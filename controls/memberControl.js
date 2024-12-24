const createHttpError = require("http-errors");
const Member = require("../models/memberModel");
exports.getAll = async (req, res, next) => {
  try {
    const members = await Member.find();
    res.status(200).json({
      message: "members have been retrieved",
      data: { count: members.length, members },
    });
  } catch (err) {
    next(err);
  }
};
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const member = await Member.findOne({ _id: id });
    if (member)
      return res.status(200).json({
        message: "member was successfully found",
        data: member,
      });
    next(
      createHttpError(404, {
        message: "the member is not found",
        code: "not found",
      })
    );
  } catch (err) {
    next(createHttpError(500, { code: err.code, message: err.message }));
  }
};

exports.create = async (req, res, next) => {
  try {
    const {
      fullName,
      address,
      phone,
      email,
      status,
      joiningDate,
      createdBy,
      updatedBy,
    } = req.body;
    const createdmember = await Member.create({
      fullName,
      address,
      phone,
      email,
      status,
      joiningDate,
      createdBy,
      updatedBy,
    });
    res.status(200).json({
      message: "member successfully created",
      data: createdmember,
    });
  } catch (err) {
    next(createHttpError(500, { code: err.code, message: err.message }));
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedmember = await Member.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (updatedmember) return res.status(200).json(updatedmember);
    next(
      createHttpError(434, {
        code: "Not Found",
        message: "The member to be updated is Not found",
      })
    );
  } catch (err) {
    next(createHttpError(500, { code: err.code, message: err.message }));
  }
};
