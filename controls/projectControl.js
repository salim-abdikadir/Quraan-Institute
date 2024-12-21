const createHttpError = require("http-errors");
const Project = require("../models/projectModel");
exports.getAll = async (req, res, next) => {
  try {
    const projects = await Project.find();
    res.status(200).json({
      message: "projects have been retrieved",
      data: { count: projects.length, projects },
    });
  } catch (err) {
    next(err);
  }
};
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findOne({ _id: id });
    if (project)
      return res.status(200).json({
        message: "project was successfully found",
        data: project,
      });
    next(
      createHttpError(404, {
        message: "the project is not found",
        code: "not found",
      })
    );
  } catch (err) {
    next(createHttpError(err.status, { code: err.code, message: err.message }));
  }
};

exports.create = async (req, res, next) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      department,
      status,
      createdBy,
      updatedBy,
    } = req.body;
    const createdproject = await Project.create({
      title,
      description,
      startDate,
      endDate,
      department,
      status,
      createdBy,
      updatedBy,
    });
    res.status(200).json({
      message: "project successfully created",
      data: createdproject,
    });
  } catch (err) {
    next(createHttpError(500, { code: err.code, message: err.message }));
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedproject = await Project.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (updatedproject) return res.status(200).json(updatedproject);
    next(
      createHttpError(434, {
        code: "Not Found",
        message: "The project to be updated is Not found",
      })
    );
  } catch (err) {
    next(createHttpError(500, { code: err.code, message: err.message }));
  }
};
