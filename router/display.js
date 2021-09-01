// intialize express >>
const express = require("express");

// open express router >>
const router = express.Router();

// importing functions >>
const { capitlizeFirstCharMW, showSingleUser, showSingleUserMiddleware } =
  require.apply("../controllers/userController");

// route to display only one specific user: http://localhost:5000/display/:userName >>
router.route("/display/:userName").get(capitlizeFirstCharMW, showSingleUser);

module.exports = router;
