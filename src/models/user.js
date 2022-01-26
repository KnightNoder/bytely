const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  urls: [
    {
      smallUrl: String,
      longUrl: String,
      clicks: {
        type: Number,
        default: 0,
      },
      createdAt: {
        type: String,
        default: Date.now,
      },
    },
  ],
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = new mongoose.model('UserModel', userSchema);

module.exports = User;
