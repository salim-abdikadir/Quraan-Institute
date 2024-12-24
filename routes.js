"use strict";
const configured = require("./handlers/configured");
const projectsRouter = require("./routes/projectRoutes");
const userRouter = require("./routes/userRoutes");
const departmentRouter = require("./routes/departmentRoutes");
const memberRouter = require("./routes/memberRoutes");
const partnerRouter = require("./routes/partnerRoutes");
const fileRouter = require("./routes/fileRoutes");
const articleRouter = require("./routes/articleRoutes");
const newsRouter = require("./routes/newsRouter");

module.exports = function (app, opts) {
  // Setup routes, middleware, and handlers
  app.use("/api/files", fileRouter);
  app.use("/api/projects", projectsRouter);
  app.use("/api/users", userRouter);
  app.use("/api/departments", departmentRouter);
  api.use("/api/partners", partnerRouter);
  app.use("/api/members", memberRouter);
  app.use("/api/news", newsRouter);
  app.use("/api/article", articleRouter);
  app.get("/configured", configured(opts));
};
