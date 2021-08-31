const express = require("express");
const app = express();

// development mode info >>
const morgan = require("morgan"); // morgan is for more information on HTTP status etc.
app.use(morgan("dev"));

// for enabling processing of json data >>
app.use(express.json());

// Connecting to our databse in mongoDB >>
const mongoose = require("mongoose");
const DB_URL = process.env.DB_URL;

// connect to db through mongoose >>
mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(console.log("The database is connected successfully."))
  .catch((err) => {
    console.log(`There was a problem. Error: ${err.message}`);
  });

// root route >>
app.get("/", (req, res) => {
  res.status(200).send("Welcome to our User List App.");
});

// user routes are handled in router/users >>
const users = require("./router/users");
app.use("/users", users);

// export app (imported in: server.js) >>
module.exports = app;
