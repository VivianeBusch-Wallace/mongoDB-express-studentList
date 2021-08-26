const express = require("express");

const router = express.Router();

// model >>
const UsersData = require("../model/usersModel");

// controller functions >>
const { showAllUsers } = require("../controllers/usersController");

// root route of users: http://localhost:5000/users/ >>
router.route("/").get(showAllUsers);

module.exports = router;
