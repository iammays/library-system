// models/student.model.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    default: null
  },
  subscriptionEndDate: { type: Date, default: null },
  isPaid: { type: Boolean, default: false }
});


const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
