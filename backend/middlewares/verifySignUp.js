const db = require("../models");
const Librarian = db.librarian;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const { username, email } = req.body;
    const userId = req.userId; // Assuming you have userId set in req.userId via some authentication middleware

    // Check if username already exists and doesn't belong to the current user
    const librarianByUsername = await Librarian.findOne({ username }).exec();
    if (librarianByUsername && librarianByUsername._id.toString() !== userId) {
      return res.status(400).send({ message: "Failed! Username is already in use!" });
    }

    // Check if email already exists and doesn't belong to the current user
    const librarianByEmail = await Librarian.findOne({ email }).exec();
    if (librarianByEmail && librarianByEmail._id.toString() !== userId) {
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
