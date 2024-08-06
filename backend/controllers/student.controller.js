// controllers/student.controller.js
const db = require('../models');
const Student = db.student;

exports.addStudent = async (req, res) => {
    try {
      const { name, studentId } = req.body;
      const student = new Student({ name, studentId });
      await student.save();
  
      res.status(201).send({ message: 'Student added successfully!' });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error code
          res.status(400).send({ message: 'Sorry, this student ID is already in the system!' });
        } else {
          res.status(500).send({ message: error.message });
        }
      }
  };
  
  exports.getStudents = async (req, res) => {
    try {
      const students = await Student.find();
      res.status(200).send(students);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

exports.searchStudents = async (req, res) => {
  try {
    const { name, studentId } = req.query;
    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    if (studentId) {
      filter.studentId = { $regex: studentId, $options: 'i' };
    }

    const students = await Student.find(filter);
    res.status(200).send(students);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
