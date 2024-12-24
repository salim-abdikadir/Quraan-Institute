const createHttpError = require("http-errors");
const Project = require("../models/projectModel");
const crypto = require("crypto");

const { getGFS } = require("../config/db");
const { uploadFile, readFile, deleteFile } = require("../config/gridfsBucket");
const { projectGFS } = getGFS();

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
    next(
      createHttpError(err.status || 500, {
        code: err.code,
        message: err.message,
      })
    );
  }
};

exports.create = async (req, res, next) => {
  try {
    const hash = crypto.randomBytes(16).toString("hex"); // 16 bytes = 32 characters in hex
    const timestamp = Date.now(); // Optional for added uniqueness
    const extension = req.file.originalname.split(".").pop(); // Extract file extension
    if (req.file && req.file?.buffer?.length > 0) {
      const uploadedImage = await uploadFile(projectGFS, {
        ...req.file,
        filename: `${hash}-${timestamp}.${extension}`,
      });
      req.body.fileId = uploadedImage.id;
    }

    const {
      title,
      description,
      startDate,
      endDate,
      department,
      status,
      createdBy,
      updatedBy,
      fileId,
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
      photo: fileId,
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
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const hash = crypto.randomBytes(16).toString("hex"); // 16 bytes = 32 characters in hex
    const timestamp = Date.now(); // Optional for added uniqueness
    const extension = req.file.originalname.split(".").pop(); // Extract file extension
    if (req.file && req.file?.buffer?.length > 0) {
      const uploadedImage = await uploadFile(projectGFS, {
        ...req.file,
        filename: `${hash}-${timestamp}.${extension}`,
      });
      const project = await Project.findOne({ _id: id });
      const photoId = project.photo;
      console.log(photoId);
      await deleteFile(projectGFS, photoId);
      console.log("deleted");
      req.body.photo = uploadedImage.id;
    }

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
    console.log(err);
    next(createHttpError(500, { code: err.code, message: err.message }));
  }
};

exports.getPhoto = async (req, res) => {
  const { photoId } = req.params;
  const { metadata, buffer } = await readFile(projectGFS, photoId);
  res.set("Content-Type", metadata.contentType || "application/octet-stream");
  res.send(buffer);
};
