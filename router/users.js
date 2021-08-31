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
  .put(checkContentMW, updateUserCompletely);

// route to display only one specific user: http://localhost:5000/display/:userName >>
router
  .route("/display/:userName")
  .get(showSingleUserMiddleware, showSingleUser);

module.exports = router;
