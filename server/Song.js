const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  url: String,
  name: String,
  position: Number
}, {
  timestamps: true,
});

module.exports = mongoose.model('Song', songSchema);