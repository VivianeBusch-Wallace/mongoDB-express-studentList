// intialize express >>
const express = require("express");

// open express router >>
const router = express.Router();

// importing functions >>
const {
  getUserDataMW,
  capitlizeFirstCharMW,
  makeNumMW,
  sortMW,
  showSingleUser,
  showSingleUserMiddleware,
} = require("../controllers/usersController");

// route to display only one specific user: http://localhost:5000/display/:userName >>
router
  .route("/:userName")
  .get(getUserDataMW, capitlizeFirstCharMW, makeNumMW, showSingleUser);

module.exports = router;
