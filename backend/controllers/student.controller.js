// controllers/student.controller.js
const db = require('../models');
const Student = db.student;

/**
 * Adds a new student to the database.
 * @param {Object} req - The request object, containing the student details.
 * @param {Object} res - The response object.
 * @returns {Object} A success message if the student is added successfully, or an error message if an error occurs.
 */
exports.addStudent = async (req, res) => {
  try {
    const { name, studentId } = req.body;
    const student = new Student({ name, studentId });
    await student.save();

    res.status(201).send({ message: 'Student added successfully!' });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send({ message: 'Sorry, this student ID is already in the system!' });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
};

/**
 * Retrieves all students from the database.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Array} An array of student objects.
 */
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).send(students);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/**
 * Searches for students based on name and/or student ID.
 * @param {Object} req - The request object, containing the search criteria.
 * @param {Object} res - The response object.
 * @returns {Array} An array of student objects that match the search criteria.
 */
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

//new 
/**
 * Retrieves detailed information about a specific student based on student ID.
 * @param {Object} req - The request object, containing the student ID.
 * @param {Object} res - The response object.
 * @returns {Object} A student object with detailed information.
 */
exports.getStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findOne({ studentId }).populate('subscription');
    if (!student) {
      return res.status(404).send({ message: 'Student not found!' });
    }

    res.status(200).send(student);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
