const mongoose = require("mongoose");
const { isURL, isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Jacques Cousteau',
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Explorer',
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg',
    required: true,
    validate: {
      validator: (v) => isURL(v, { protocols: ["http", "https"], require_protocol: true }),
      message: "O campo avatar deve ser um link válido.",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'não é um email válido!',
    },
  },
  password: {
    type: String,
    required: true,
    select: false
  },
});

module.exports = mongoose.model("user", userSchema);
