// controllers/subscription.controller.js
const Subscription = require('../models/subscription.model');
const Student = require('../models/student.model');

// Add a new subscription
exports.addSubscription = async (req, res) => {
  try {
    const { studentId, paymentAmount } = req.body;
    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).send({ message: 'Student not found!' });
    }

    const paymentStatus = paymentAmount >= 50 ? 'paid' : 'unpaid';
    const paymentDate = new Date();
    const nextDueDate = new Date();
    nextDueDate.setDate(paymentDate.getDate() + 30);

    const subscription = new Subscription({
      student: student._id,
      paymentStatus,
      paymentDate,
      nextDueDate
    });

    await subscription.save();
    student.subscription = subscription._id;
    await student.save();

    res.status(201).send({ message: 'Subscription added successfully!' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Update a subscription
exports.updateSubscription = async (req, res) => {
  try {
    const { studentId, paymentAmount } = req.body;
    const student = await Student.findOne({ studentId }).populate('subscription');
    
    if (!student) {
      return res.status(404).send({ message: 'Student not found!' });
    }

    let subscription = student.subscription;

    if (!subscription) {
      subscription = new Subscription({
        student: student._id,
        paymentStatus: '',
        paymentDate: null,
        nextDueDate: null
      });
      student.subscription = subscription._id;
    }

    const paymentStatus = paymentAmount >= 50 ? 'paid' : 'unpaid';
    const paymentDate = new Date();
    const nextDueDate = new Date();
    nextDueDate.setDate(paymentDate.getDate() + 30);

    subscription.paymentStatus = paymentStatus;
    subscription.paymentDate = paymentDate;
    subscription.nextDueDate = nextDueDate;

    await subscription.save();

    // Update the student document
    student.isPaid = paymentStatus === 'paid';
    student.subscriptionEndDate = nextDueDate;

    await student.save();

    res.status(200).send({ message: 'Subscription updated successfully!' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};





// Get the subscription status of a student
exports.getSubscriptionStatus = async (req, res) => {
    try {
      const { studentId } = req.params;
      const student = await Student.findOne({ studentId }).populate('subscription');
      if (!student) {
        return res.status(404).send({ message: 'Student not found!' });
      }
  
      const subscription = student.subscription;
      const today = new Date();
      const daysRemaining = Math.floor((subscription.nextDueDate - today) / (1000 * 60 * 60 * 24));
  
      res.status(200).send({ daysRemaining });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
