const mongoose = require("mongoose");

// creating a new schema >>
const userDataSchema = new mongoose.Schema({
  userName: {
    type: String,
    trim: true,
    required: [true, "Please type your username."],
  },
  userPass: {
    type: String,
    trim: true,
    required: [true, "Please type your userpass."],
  },
  age: {
    type: String,
    required: [true, "Please give your age."],
  },
  fbw: {
    type: String,
    required: [true, "Please give your fbw number."],
  },
  toolStack: {
    type: Array,
    required: false,
  },
  email: {
    type: String,
    trim: true,
    required: [true, "Please type your email address."],
  },
});

// creating a new collection using the schema and at the same time loading previous data
module.exports = mongoose.model("UsersData", userDataSchema, "UsersData");
// << UsersData is the name of our collection