const mongoose = require("mongoose");

// creating a new schema >>
const userDataSchema = new mongoose.Schema({
  userName: {
    type: String,
    trim: true,
  },
  userPass: {
    type: String,
    trim: true,
  },
  age: {
    type: Number,
  },
  fbw: {
    type: Number,
  },
  toolStack: {
    type: Array,
  },
  email: {
    type: String,
    trim: true,
  },
});

// creating a new collection using the schema
module.exports = mongoose.model("UsersData", usersDataSchema, "UsersData");
