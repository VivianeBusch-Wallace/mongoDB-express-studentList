const express = require("express");

const UsersData = require("../model/usersModel");

// All Middlewares >>

// Get user by name from database >>
const getUserDataMW = async (req, res, next) => {
  // find user by user name in lowercase because the data is also in lowercase >>
  let user = await UsersData.findOne({
    userName: req.params.userName.toLowerCase(),
  });

  try {
    // if no user found in the db >>
    if (!user) {
      console.log("Sorry, user not found.");
      return res.status(404).json({
        message: `Sorry, couldn't find anyone named: ${req.params.userName}.`,
      }); // error 404 = Not Found
    }
  } catch (err) {
    res.status(500).json({ message: err.message }); // error 500 = Internal Server Error
  }

  res.user = user;

  next();
};

// Task: Create a middleware method that will check if the user belongs to our FBW
// Checking if the user belongs to class fbw-48 >>
const checkClassNumMW = (req, res, next) => {
  if (req.body.fbw == 48) {
    console.log("Success! User's class number is 48!");
    next();
  } else {
    return res.status(400).json({
      message:
        "Sorry, we cannot validate your user. They are not a member of class FBW-48.",
    }); // << error 400 = Bad Request
  }
};

// Task: Create a middleware method that will check if the user is above 18 years old
// checking if user's age is above 18
const checkAgeMW = (req, res, next) => {
  if (req.body.age > 18) {
    console.log("Success! User's age is valid!");
    next();
  } else {
    return res.status(400).json({
      message:
        "Sorry, we cannot validate your user. We don't accept people that are 18 years or under.",
    }); // << error 400 = Bad Request
  }
};

// Task: Create a middleware method that will make sure the object received contains userName, userPass, age, fbw and email.
// Checking if user information has the required information >>
const checkContentMW = async (req, res, next) => {
  // destructuring the given information from the user >>
  const { userName, userPass, age, fbw, email } = req.body;

  // if the information is not empty, then move on >>
  if (userName && userPass && age && fbw && email) {
    console.log("Success! User data valid!");
    next();
  } else {
    return res.status(400).json({
      message:
        "123Sorry, missing information. Please type in the user's name, password, age, fbw number, and email address.",
    }); // << if data is missing in the input then we get error 400 = Bad Request
  }
};

// get specific user middleware (GET http://localhost:5000/users/display/:userName) >>
const showSingleUserMiddleware = async (req, res, next) => {
  let user;

  try {
    // find user by user name in lowercase because the data is in lowercase >>
    user = await UsersData.findOne({
      userName: req.params.userName,
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

// Middleware for displaying userName with first char as uppercase >>
const capitlizeFirstCharMW = async (req, res, next) => {
  const { userName } = res.user;

  const userNameArray = userName.split(" ");
  let capitalizedName = [];
  userNameArray.map((namePart) => {
    capitalizedName.push(
      namePart[0].toUpperCase() + namePart.slice(1).toLowerCase()
    );
  });

  // display the user name with first letter capitalized >>
  res.user.userName = capitalizedName.join(" ");

  next();
};

// Middleware for displaying age and fbw as numbers >>
const makeNumMW = async (req, res, next) => {
  res.user.age = parseInt(res.user.age);
  res.user.fbw = parseInt(res.user.fbw);
  console.log(res.user);
  next();
};

// Middleware for displaying toolStack in alphabetical order >>
const sortMW = async (req, res, next) => {
  res.user.toolStack = res.user.toolStack.sort();
  next();
};

// ----------------------
// All Controler Functions >>

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

// Task: A POST request endpoint at /user to add new user to DB.
// adding a new user to database (POST http://localhost:5000/users/) >>
const addNewUser = async (req, res) => {
  // Middlewares before this: checkContentMW, checkAgeMW, checkClassNumMW

  // assigning data from body >>
  const user = new UsersData({
    userName: req.body.userName.toLowerCase(), // << better to save all names in lower case because the search is case sensitive
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
    res
      .status(201)
      .json({ message: "Success! New user added with: ", newUser }); // status 201: new user created
  } catch (err) {
    res.status(400).json({ message: err.message }); // error 400: bad request
  }
};

// Task: A PUT request endpoint at /user/:name to update user from DB upon their name.
// Updating a user in the db completely (PUT http://localhost:5000/users/:userName) >>
const updateUserCompletely = async (req, res) => {
  try {
    const updatedUser = await UsersData.updateOne({
      userName: req.body.userName,
      userPass: req.body.userPass,
      age: req.body.age,
      fbw: req.body.fbw,
      email: req.body.email,
    });
    res
      .status(200)
      .json({ message: "Success! User was updated with: " + updatedUser }); // check later: why updatedUser = Object object display
  } catch (err) {
    console.log(`There was an error: ${err}`);
    res.status(400).json({ message: err.message });
  }
};

// update specific user upon their name (PATCH http://localhost:5000/users/:userName) >>
// Test 1 >>
const updateUser = async (req, res) => {
  const { userName, userPass, age, fbw, toolStack, email } = req.body;

  // assign user's given data directly without if >>
  res.user.userName = userName.toLowerCase() || res.user.userName;
  res.user.userPass = userPass || res.user.userPass;
  res.user.age = age || res.user.age;
  res.user.fbw = fbw || res.user.fbw;
  res.user.toolStack = toolStack || res.user.toolStack;
  res.user.email = email || res.user.email;

  // save new data >>
  try {
    await res.user.save();
    res
      .status(200)
      .json({ message: `Success! User updated with: `, data: res.user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Test 2 for PATCH >>

// PATCH Number 1 from Hadi >>
// const updateOneEmployee = async (req, res) => {
//   const { name, age, add } = req.body;
//   if (name) {
//     res.employee.name = name;
//   }
//   if (age != null) {
//     res.employee.age = age;
//   }
//   if (add) {
//     res.employee.add = add;
//   }
//   try {
//     // save
//     await res.employee.save();
//     res.status(200).json({ message: "Employee updated", data: res.employee });
//   } catch (err) {
//     // 400 for bad req
//     res.status(400).json({ message: err.message });
//   }
// };

// PATCH Number 2 from Hadi >>
// userController.patchUserData = async (req, res) => {
//   try {
//     const userByName = await UserData.findOneAndUpdate(
//       { userName: req.params.name },
//       {
//         userName: req.body.userName || res.user.userName,
//         userPass: req.body.userPass || res.user.userPass,
//         age: req.body.age || res.user.age,
//         fbw: req.body.fbw || res.user.fbw,
//         toolStack: req.body.toolStack || res.user.toolStack,
//         email: req.body.email || res.user.email,
//       },
//       {
//         new: true,
//       }
//     );
//     res.status(200).json({
//       message: "Some user data got changes :white_check_mark:",
//       userByName,
//     });
//   } catch (err) {
//     res.status(err.status).json({ message: err.message });
//   }
// };

// get specific user by name (GET http://localhost:5000/users/display/:userName) >>
const showSingleUser = async (req, res) => {
  // check middleware: showSingleUserMiddleware
  res.status(200).json(res.user);
  // res.status(200).json(userInfo);
};

// -------------
// Exporting all functions >>

module.exports = {
  getUserDataMW,
  showAllUsers,
  addNewUser,
  updateUserCompletely,
  checkContentMW,
  checkAgeMW,
  checkClassNumMW,
  updateUser,
  capitlizeFirstCharMW,
  makeNumMW,
  sortMW,
  showSingleUser,
  showSingleUserMiddleware,
  // updateUserMiddleware,
};

// ------------------------
// Notes
/*
This is where the idea with the if else if else if else comes from:
https://github.com/Fbw-48/live-coding/commit/38572f3895a9855a96304d1aec26fa1b0885b0b1


*/
