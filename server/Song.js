const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  url: String,
  position: Number,
}, {
  timestamps: true,
});

module.exports = mongoose.model('song', songSchema);