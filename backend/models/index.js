const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.librarian = require('./librarian.model'); 

module.exports = db;
