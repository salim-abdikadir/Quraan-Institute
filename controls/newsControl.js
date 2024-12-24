const createHttpError = require("http-errors");
const News = require("../models/newsModel");
exports.getAll = async (req, res, next) => {
  try {
    const newss = await News.find();
    res.status(200).json({
      message: "newss have been retrieved",
      data: { count: newss.length, newss },
    });
  } catch (err) {
    next(err);
  }
};
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const news = await News.findOne({ _id: id });
    if (news)
      return res.status(200).json({
        message: "news was successfully found",
        data: news,
      });
    next(
      createHttpError(404, {
        message: "the news is not found",
        code: "not found",
      })
    );
  } catch (err) {
    next(createHttpError(500, { code: err.code, message: err.message }));
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, content, category, publicationDate, createdBy, updatedBy } =
      req.body;
    const creatednews = await News.create({
      title,
      content,
      category,
      publicationDate,
      createdBy,
      updatedBy,
    });
    res.status(200).json({
      message: "news successfully created",
      data: creatednews,
    });
  } catch (err) {
    next(createHttpError(500, { code: err.code, message: err.message }));
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatednews = await News.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (updatednews) return res.status(200).json(updatednews);
    next(
      createHttpError(434, {
        code: "Not Found",
        message: "The news to be updated is Not found",
      })
    );
  } catch (err) {
    next(createHttpError(500, { code: err.code, message: err.message }));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletednews = await News.deleteOne({ _id: id });
    if (!deletednews)
      throw Error({
        status: 404,
        code: "not found",
        message: "the user is not found",
      });
    res.status(200).json({ message: "deleted succefully", data: deletednews });
  } catch (err) {
    next(
      createHttpError(err.status || 500, {
        code: err.code,
        message: err.message,
      })
    );
  }
};
