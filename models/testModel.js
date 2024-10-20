const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: String,
  photo: String,
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
