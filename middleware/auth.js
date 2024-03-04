const jwt = require("jsonwebtoken");
const CONFIG = require("../config/config");

module.exports = function (req, res, next) {
  //const token = req.header('Bearer');
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }
  let token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).send("Access Denied. No token provided");
  try {
    const decoded = jwt.verify(token, CONFIG.jwt_encryption);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
};
