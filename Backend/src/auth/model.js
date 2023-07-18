const mongoose = require("mongoose");
const dayjs = require("dayjs");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    default: "",
  },
  last_name: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  phone: {
    type: String,
    default: "",
  },
  image: {
    type: Object,
  },
  gender: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  status: {
    type: Number,
    default: 1,
  },
  birth: {
    type: Number,
  },
  role: {
    type: Number,
    required: true,
    default: 1,
  },
});
const usersDB = mongoose.model("users", userSchema);

module.exports = usersDB;
