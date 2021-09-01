const express = require("express");

const router = express.Router();

// model >>
const UsersData = require("../model/usersModel");

// controller functions >>
const {
  showAllUsers,
  addNewUser,
  updateUserCompletely,
  checkAgeMW,
  checkContentMW,
  checkClassNumMW,
  updateUserMiddleware,
  updateUser,
} = require("../controllers/usersController");

// root route of users: http://localhost:5000/users/ >>
router
  .route("/")
  .get(showAllUsers)
  .post(checkContentMW, checkAgeMW, checkClassNumMW, addNewUser);

// route with name value: http://localhost:5000/users/:userName >>
router
  .route("/:userName")
  .patch(updateUserMiddleware, updateUser)
  .put(checkContentMW, updateUserCompletely); // I added checkContentMW to make sure that at least the required information gets updated

  module.exports = router;