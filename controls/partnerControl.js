const createHttpError = require("http-errors");
const Partner = require("../models/partnerModel");
exports.getAll = async (req, res, next) => {
  try {
    const partners = await Partner.find();
    res.status(200).json({
      message: "partners have been retrieved",
      data: { count: partners.length, partners },
    });
  } catch (err) {
    next(err);
  }
};
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const partner = await Partner.findOne({ _id: id });
    if (partner)
      return res.status(200).json({
        message: "partner was successfully found",
        data: partner,
      });
    next(
      createHttpError(404, {
        message: "the partner is not found",
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
      partnershipType,
      startDate,
      endDate,
      website,
      createdBy,
      updatedBy,
    } = req.body;
    const createdpartner = await Partner.create({
      fullName,
      address,
      phone,
      email,
      partnershipType,
      startDate,
      endDate,
      website,
      createdBy,
      updatedBy,
    });
    res.status(200).json({
      message: "partner successfully created",
      data: createdpartner,
    });
  } catch (err) {
    next(createHttpError(500, { code: err.code, message: err.message }));
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedpartner = await Partner.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (updatedpartner) return res.status(200).json(updatedpartner);
    next(
      createHttpError(434, {
        code: "Not Found",
        message: "The partner to be updated is Not found",
      })
    );
  } catch (err) {
    next(createHttpError(500, { code: err.code, message: err.message }));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await Partner.deleteOne({ _id: id });
    if (!deletedUser)
      throw Error({
        status: 404,
        code: "not found",
        message: "the user is not found",
      });
    res.status(200).json({ message: "deleted succefully", data: deletedUser });
  } catch (err) {
    next(
      createHttpError(err.status || 500, {
        code: err.code,
        message: err.message,
      })
    );
  }
};
