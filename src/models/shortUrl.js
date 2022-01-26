const mongoose = require('mongoose');

const shortUrlSchema = mongoose.Schema({
  smallUrl: String,
  longUrl: String,
  clicks: {
    type: Number,
    default: 0,
  },
});

const ShortUrl = new mongoose.model('shortUrlModel', shortUrlSchema);

module.exports = ShortUrl;
