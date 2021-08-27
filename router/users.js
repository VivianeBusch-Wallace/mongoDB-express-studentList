const express = require("express");

const router = express.Router();

// model >>
const UsersData = require("../model/usersModel");

// controller functions >>
const {
  showAllUsers,
  showSingleUser,
  showSingleUserMiddleware,
  addNewUser,
  updateUser,
} = require("../controllers/usersController");

// root route of users: http://localhost:5000/users/ >>
router.route("/").get(showAllUsers).post(addNewUser);

// route with name value >>
router.route("/:userName").patch(updateUser).get(showSingleUser);

// route to display only one user >>
router
  .route("/display/:userName")
  .get(showSingleUserMiddleware, showSingleUser);

module.exports = router;
