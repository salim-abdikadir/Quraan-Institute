const createHttpError = require("http-errors");
const Department = require("../models/departmentModel");
exports.getAll = async (req, res, next) => {
  try {
    const departments = await Department.find();
    res.status(200).json({
      message: "departments have been retrieved",
      data: { count: departments.length, departments },
    });
  } catch (err) {
    next(err);
  }
};
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const department = await Department.findOne({ _id: id });
    if (department)
      return res
        .status(200)
        .json({
          message: "department was successfully found",
          data: department,
        });
    next(
      createHttpError(404, {
        message: "the department is not found",
        code: "not found",
      })
    );
  } catch (err) {
    next(createHttpError(500, { code: err.code, message: err.message }));
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, createdBy, updatedBy, description } = req.body;
    const createddepartment = await Department.create({
      name,
      createdBy,
      updatedBy,
      description,
    });
    res
      .status(200)
      .json({
        message: "department successfully created",
        data: createddepartment,
      });
  } catch (err) {
    next(createHttpError(500, { code: err.code, message: err.message }));
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updateddepartment = await Department.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
      }
    );
    if (updateddepartment) return res.status(200).json(updateddepartment);
    next(
      createHttpError(434, {
        code: "Not Found",
        message: "The department to be updated is Not found",
      })
    );
  } catch (err) {
    next(createHttpError(500, { code: err.code, message: err.message }));
  }
};
