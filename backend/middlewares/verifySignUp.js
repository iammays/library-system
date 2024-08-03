const db = require("../models");
const Librarian = db.librarian;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Username
    const librarianByUsername = await Librarian.findOne({
      username: req.body.username
    }).exec();

    if (librarianByUsername) {
      return res.status(400).send({ message: "Failed! Username is already in use!" });
    }

    // Email
    const librarianByEmail = await Librarian.findOne({
      email: req.body.email
    }).exec();

    if (librarianByEmail) {
      return res.status(400).send({ message: "Failed! Email is already in use!" });
    }

    next();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail
};

module.exports = verifySignUp;
