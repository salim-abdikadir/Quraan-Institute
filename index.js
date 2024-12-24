"use strict";
const express = require("express");
const httpErrors = require("http-errors");
const pino = require("pino");
const pinoHttp = require("pino-http");
const { connect, getStorage } = require("./config/db"); // Ensure getStorage is exported
const multer = require("multer");

module.exports = async function main(options, cb) {
  const ready = cb || function () {};
  const opts = Object.assign({}, options);
  const logger = pino();

  let server;
  let serverStarted = false;
  let serverClosing = false;

  // Error handling
  function unhandledError(err) {
    logger.error(err);
    if (serverClosing) return;
    serverClosing = true;
    if (serverStarted) {
      server.close(() => process.exit(1));
    }
  }
  process.on("uncaughtException", unhandledError);
  process.on("unhandledRejection", unhandledError);

  // Create express app
  const app = express();
  app.use(pinoHttp({ logger }));
  app.use(express.json());

  try {
    // Initialize database
    connect().then((e) => {
      // Register routes
      require("./routes")(app, { ...opts });

      // Error handlers
      app.use((req, res, next) =>
        next(httpErrors(404, `Route not found: ${req.url}`))
      );
      app.use((err, req, res, next) => {
        if (err.status >= 500) logger.error(err);
        res.status(err.status || 500).json({
          error: {
            code: err.code || "InternalServerError",
            message: err.message,
          },
        });
      });

      // Start server

      return (server = app.listen(opts.port, opts.host, (err) => {
        if (err) return ready(err, app, server);
        if (serverClosing)
          return ready(new Error("Server was closed before it could start"));
        serverStarted = true;
        const addr = server.address();
        logger.info(
          `Started at ${opts.host || addr.host || "localhost"}:${addr.port}`
        );
        ready(null, app, server);
      }));
    });
  } catch (err) {
    logger.error("Initialization failed:", err);
    ready(err, null, null);
  }
};
