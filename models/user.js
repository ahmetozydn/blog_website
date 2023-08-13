const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true , unique: true}, // must both of them unique
    password: { type: String, required: true },
  });

  const User = mongoose.model('User', userSchema);
  module.exports = User;