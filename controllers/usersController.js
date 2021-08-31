const express = require("express");

const UsersData = require("../model/usersModel");

// All Middlewares >>

// get specific user middleware (GET http://localhost:5000/users/display/:userName) >>
const showSingleUserMiddleware = async (req, res, next) => {
  let user;

  try {
    // find user by user name in lowercase because the data is in lowercase >>
    user = await UsersData.findOne({
      userName: req.params.userName.toLowerCase(),
    });

    // if no user found in the db >>
    if (!user) {
      console.log("Sorry, no user found.");
      return res.status(404).json({
        message: `Sorry, couldn't find anyone named: ${req.params.userName}.`,
      }); // error 404 = Not Found
    }

    // display the user name with first letter capitalized >>
    let firstLetter = user.userName.charAt(0).toUpperCase();
    let restLetters = user.userName.slice(1);
    user.userName = firstLetter + restLetters;

    // converting age and fbw into numbers and sorting toolStack alphabetically in a new object >>
    let userInfo = {
      userName: user.userName,
      userPass: user.userPass,
      age: parseInt(user.age),
      fbw: parseInt(user.fbw),
      toolStack: user.toolStack.sort(),
      email: user.email,
    };
    console.log(user);
    // console.log(userInfo);
    // assigning userInfo to res.user which is then sent to the controller func >>
    res.user = userInfo;
  } catch (err) {
    res.status(500).json({ message: err.message }); // error 500 = Internal Server Error
  }

  next();
};

// ----------------------
// All Route Functions >>

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
    userName: req.body.userName.toLowerCase(), // only lowercase names can be saved in the database for now
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

const updateUserMiddleware = async (req, res, next) => {
  let user = await UsersData.findOne({ userName: req.params.userName });
  res.users = user;
  console.log(user)
  next();
};

// update specific user upon their name (GET http://localhost:5000/users/:userName) >>
const updateUser = async (req, res) => {
  const { userName, userPass, age, fbw, toolStack, email } = req.body;

  // assign user's given data >>
  if (userName) {
    res.users.userName = userName;
  } else if (userPass) {
    res.users.userPass = userPass;
  } else if (age) {
    res.users.age = age;
  } else if (fbw) {
    res.users.fbw = fbw;
  } else if (toolStack) {
    res.users.toolStack = toolStack;
  } else if (email) {
    res.users.email = email;
  }

  // << try switch case?
  console.log(res.users);
  try {
    // save new data >>
    await res.users.save();

    // send response if successful >>
    res.status(200).json({ message: "user updated with: ", data: res.users });
  } catch (err) {
    res.status(400).json({ message: err.message }); // error 400 = Bad Request
  }
};

// get specific user by name (GET http://localhost:5000/users/display/:userName) >>
const showSingleUser = async (req, res) => {
  // check middleware: showSingleUserMiddleware
  res.status(200).json(res.user);
  // res.status(200).json(userInfo);
};

//

module.exports = {
  showAllUsers,
  addNewUser,
  updateUserMiddleware,
  updateUser,
  showSingleUser,
  showSingleUserMiddleware,
};

// ------------------------
// Notes
