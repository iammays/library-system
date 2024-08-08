// models/index.js
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.librarian = require('./librarian.model');
db.book = require('./book.model'); 
db.student = require('./student.model'); 
db.category = require('./category.model'); 
db.subscription = require('./subscription.model');


module.exports = db;
