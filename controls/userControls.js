const createHttpError = require("http-errors");
const User = require("../models/userModel");
exports.getAll = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      message: "users have been retrieved",
      data: { count: users.length, users },
    });
  } catch (err) {
    next(err);
  }
};
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    if (user)
      return res
        .status(200)
        .json({ message: "user was successfully found", data: user });
    next(
      createHttpError(404, {
        message: "the user is not found",
        code: "not found",
      })
    );
  } catch (err) {
    next(createHttpError(500, { code: err.code, message: err.message }));
  }
};

exports.create = async (req, res, next) => {
  try {
    const { email, username, password, role } = req.body;
    const createdUser = await User.create({ username, password, email, role });
    res
      .status(200)
      .json({ message: "user successfully created", data: createdUser });
  } catch (err) {
    next(createHttpError(500, { code: err.code, message: err.message }));
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (updatedUser) return res.status(200).json(updatedUser);
    next(
      createHttpError(434, {
        code: "Not Found",
        message: "The user to be updated is Not found",
      })
    );
  } catch (err) {
    next(createHttpError(500, { code: err.code, message: err.message }));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user)
      throw new Error({
        status: 404,
        code: "not found",
        message: "the user doesn't exist",
      });
    if (!(await User.comparePasswords(password, user.password)))
      throw new Error({
        status: 401,
        code: "incorrect password",
        message: "the password is incorrect",
      });
  } catch (err) {
    next(
      createHttpError(err.status || 501, {
        code: err.code,
        message: err.message,
      })
    );
  }
};
