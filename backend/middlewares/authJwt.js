const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Librarian = db.librarian;

verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  token = token.split(' ')[1]; // Extract the token from the "Bearer TOKEN" format

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken
};

module.exports = authJwt;
