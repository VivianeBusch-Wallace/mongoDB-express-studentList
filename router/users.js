const express = require("express");

const router = express.Router();

// model >>
const UsersData = require("../model/usersModel");

// controller functions >>
const {
  showAllUsers,
  getUserDataMW,
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
//.post(checkAgeMW, checkClassNumMW, addNewUser);

// route with name value: http://localhost:5000/users/:userName >>
router
  .route("/:userName")
  .patch(getUserDataMW, updateUser) // test 1
  // .patch(updateUser) // test 2
  .put(updateUserCompletely); // I added checkContentMW to make sure that at least the required information gets updated

// .put(checkContentMW, updateUserCompletely);

module.exports = router;

// Notes:

// why does checkContentMW influence PUT!?
// Why not anymore?
