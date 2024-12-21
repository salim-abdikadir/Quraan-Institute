const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");

const authHandling = (req, res, next) => {
  let user;
  const authHeader = req.headers.authorization;
  try {
    if (!authHeader)
      throw Error({
        status: 401,
        code: "bad request",
        message: "no authorization header",
      });
    const token = authHeader.split(" ")[1];
    if (!token)
      throw Error({
        status: 400,
        code: "unauthorized",
        message: "the user is not authenticated",
      });
    else
      jwt.verify(token, "secret", (err, decoded) => {
        if (err)
          throw Error({
            status: 500,
            code: "server error",
            message: err.message,
          });
        else req.user = decoded;
        console.log(req.user);
      });
    next();
  } catch (err) {
    next(createHttpError(err.status, { mesasge: err.message, code: err.code }));
  }
};

const roleHandling = (authorized) => {
  return function (req, res, next) {
    if (!authorized.includes(req.user.role))
      next(
        createHttpError(401, {
          message: "you are not authorized to this action",
          code: "not authorized",
        })
      );
  };
};

module.exports = {authHandling, roleHandling};
