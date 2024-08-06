// controllers/category.controller.js
const db = require('../models');
const Category = db.category;

exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = new Category({ name });
    await category.save();

    res.status(201).send({ message: 'Category added successfully!' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
