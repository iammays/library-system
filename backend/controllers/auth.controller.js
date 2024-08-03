const db = require("../models");
const Librarian = db.librarian;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

exports.signup = async (req, res) => {
  try {
    const librarian = new Librarian({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    });

    await librarian.save();
    res.status(201).send({ message: "User was registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const identifier = req.body.identifier;
    const librarian = await Librarian.findOne({
      $or: [
        { username: identifier },
        { email: identifier }
      ]
    }).exec();

    if (!librarian) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, librarian.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    const token = jwt.sign({ id: librarian.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    });

    res.status(200).send({
      id: librarian._id,
      username: librarian.username,
      email: librarian.email,
      accessToken: token
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
