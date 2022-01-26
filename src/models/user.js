const mongoose = require('mongoose');

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
      shortUrl: String,
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
    console.log(`password is ${this.password} `);
  }
  next();
});

const User = new mongoose.model('UserModel', userSchema);

module.exports = User;
