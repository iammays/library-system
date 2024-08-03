const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.librarian = require('./librarian.model'); // Change to 'librarian'

module.exports = db;
