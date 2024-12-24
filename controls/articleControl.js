const createHttpError = require("http-errors");
const Article = require("../models/articleModel");
exports.getAll = async (req, res, next) => {
  try {
    const articles = await Article.find();
    res.status(200).json({
      message: "articles have been retrieved",
      data: { count: articles.length, articles },
    });
  } catch (err) {
    next(err);
  }
};
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const article = await Article.findOne({ _id: id });
    if (article)
      return res.status(200).json({
        message: "article was successfully found",
        data: article,
      });
    next(
      createHttpError(404, {
        message: "the article is not found",
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
    const createdarticle = await Article.create({
      title,
      content,
      category,
      publicationDate,
      createdBy,
      updatedBy,
    });
    res.status(200).json({
      message: "article successfully created",
      data: createdarticle,
    });
  } catch (err) {
    next(createHttpError(500, { code: err.code, message: err.message }));
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedarticle = await Article.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (updatedarticle) return res.status(200).json(updatedarticle);
    next(
      createHttpError(434, {
        code: "Not Found",
        message: "The article to be updated is Not found",
      })
    );
  } catch (err) {
    next(createHttpError(500, { code: err.code, message: err.message }));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedArticle = await Article.deleteOne({ _id: id });
    if (!deletedArticle)
      throw Error({
        status: 404,
        code: "not found",
        message: "the user is not found",
      });
    res.status(200).json({ message: "deleted succefully", data: deletedArticle });
  } catch (err) {
    next(
      createHttpError(err.status || 500, {
        code: err.code,
        message: err.message,
      })
    );
  }
};
