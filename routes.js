"use strict";
const simple = require("./handlers/simple");
const configured = require("./handlers/configured");
const projectsRouter = require("./routes/projectRoutes");
const userRouter = require("./routes/userRoutes");
const departmentRouter = require("./routes/departmentRoutes");
const fileRouter = require("./routes/fileRoutes");

module.exports = function (app, opts) {
  // Setup routes, middleware, and handlers
  app.use("/api/images", fileRouter);
  app.use("/api/projects", projectsRouter);
  app.use("/api/users", userRouter);
  app.use("/api/departments", departmentRouter);
  app.get("/configured", configured(opts));
};
