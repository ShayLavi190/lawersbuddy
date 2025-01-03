const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, required: true },
  password: { type: String, required: true },
  id: { type: String, required: true },
  premission: { type: String, required: true },
  lawyer: { type: String, required: false },
});


const User = mongoose.model('User', userSchema, 'users');
module.exports = User;
