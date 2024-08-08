// models/subscription.model.js
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  paymentStatus: { type: String, enum: ['paid', 'unpaid'], required: true },
  paymentDate: { type: Date, required: true },
  nextDueDate: { type: Date, required: true }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
