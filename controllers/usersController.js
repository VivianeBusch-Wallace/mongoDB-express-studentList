const express = require("express");
const UsersData = require("../model/usersModel");

// All Middlewares >>

// show all users (GET http://localhost:5000/users/) >>
const showAllUsers = async (req, res) => {
  try {
    // fetching all user data >>
    const users = await UsersData.find();
    console.log(users);
    // mapping out following user data >>
    res.status(200).json(
      users.map((users) => {
        return {
          userId: users._id,
          userName: users.userName,
          age: users.age,
          fbw: users.fbw,
          toolStack: users.toolStack,
          email: users.email,
          request: {
            type: "GET",
            url: `http://localhost:5000/users/${user.userName}`,
          },
        };
      })
    );
  } catch (err) {
    res.status(500).json({ message: err.message }); // internal server error
  }
};

// adding a new user to database >>
const addNewUser = async (req, res) => {
  // assigning data from body >>
  const user = new UsersData({
    userName: req.body.userName,
    userPass: req.body.userPass,
    age: req.body.age,
    fbw: req.body.fbw,
    toolStack: req.body.toolStack,
    email: req.body.email,
  });

  try {
    // saving the data into database >>
    const newUser = await user.save();

    // sending status for success >>
    res.status(201).json({ newUser }); // created
  } catch (err) {
    res.status(400).json({ message: err.message }); // bad request
  }
};

module.exports = { showAllUsers, addNewUser };
