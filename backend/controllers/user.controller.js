const db = require("../models");
const Librarian = db.librarian;
const bcrypt = require("bcryptjs");
const cloudinary = require('../config/cloudinary.config');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.getProfile = async (req, res) => {
  try {
    const user = await Librarian.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updates.profile_pic = result.secure_url;
    }

    if (updates.password) {
      updates.password = bcrypt.hashSync(updates.password, 8);
    }

    const user = await Librarian.findByIdAndUpdate(req.userId, updates, { new: true }).select('-password');
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
