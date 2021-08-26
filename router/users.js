const express = require("express");

const router = express.Router();

// model >>
const UsersData = require("../model/usersModel");

// controller functions >>
const {
  showAllUsers,
  addNewUser,
  updateUser,
} = require("../controllers/usersController");

// root route of users: http://localhost:5000/users/ >>
router.route("/").get(showAllUsers).post(addNewUser);

// route with name value >>
router.route("/:userName").patch(updateUser);

module.exports = router;
