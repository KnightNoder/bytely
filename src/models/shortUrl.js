const mongoose = require('mongoose');

const shortUrlSchema = mongoose.Schema({
  shortUrl: String,
  clicks: {
    type: Number,
    default: 0,
  },
});

const shortUrl = new mongoose.model('shortUrlModel', shortUrlSchema);

module.exports = shortUrl;
