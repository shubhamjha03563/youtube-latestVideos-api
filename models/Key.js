const mongoose = require('mongoose');

const KeySchema = new mongoose.Schema({
  keyNumber: Number,
  key: String,
  used: Number,
});

KeySchema.index({ keyNumber: 1 });

module.exports = mongoose.model('Key', KeySchema);
