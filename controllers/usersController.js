const express = require("express");
const UsersData = require("../model/usersModel");

// All Middlewares >>

// get specific user middleware (GET http://localhost:5000/users/display/:userName) >>
const showSingleUserMiddleware = async (req, res, next) => {
  let user;
  try {
    // find user by name >>
    user = await UsersData.findOne({ userName: req.params.userName });
    console.log(user);
    // if no user found >>
    if (!user) {
      return res.status(404).json({ message: "Sorry, couldn't find user." }); // error 404 = Not Found
      console.log("Sorry, no user found.");
    }
  } catch (err) {
    res.status(500).json({ message: err.message }); // error 500 = Internal Server Error
  }
  // user = res.user;
  res.user = user;

  next();
};

// show all users (GET http://localhost:5000/users/) >>
const showAllUsers = async (req, res) => {
  try {
    // fetching all user data >>
    const users = await UsersData.find();
    console.log(users);
    // mapping out following user data >>
    res.status(200).json(
      users.map((user) => {
        return {
          userId: user._id,
          userName: user.userName,
          age: user.age,
          fbw: user.fbw,
          toolStack: user.toolStack,
          email: user.email,
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

// adding a new user to database (POST http://localhost:5000/users/) >>
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

// get specific user by name (GET http://localhost:5000/users/display/:userName) >>
const showSingleUser = async (req, res) => {
  // check middleware: showSingleUser
  res.status(200).json(res.user);
};

// update specific user upon their name >>
const updateUser = async (req, res) => {
  const { userName, userPass, age, fbw, toolStack, email } = req.body;
  if (userName) {
    res.user.userName = userName;
  } else if (userPass) {
    res.user.userPass = userPass;
  } else if (age) {
    res.user.age = age;
  } else if (fbw) {
    res.user.fbw = fbw;
  } else if (toolStack.length > 0) {
    res.user.toolStack = toolStack;
  } else if (email) {
    res.user.email = email;
  }
  try {
    await res.user.save();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//

module.exports = { showAllUsers, addNewUser, updateUser, showSingleUser };
