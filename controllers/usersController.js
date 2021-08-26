const express = require("express");
const UsersData = require("../model/usersModel");

const showAllUsers = async (req, res) => {
  try {
    // fetching all user data >>
    const users = await UsersData.find();

    // mapping out following user data >>
    res.status(200).json(
      users.map((users) => {
        return {
          userId: users._id,
          userName: users.userName,
          age: users.age,
          fbw: users.fbw,
          toolstack: users.toolStack,
          email: users.email,
          request: {
            type: "GET",
            url: `http://localhost:5000/users/${user.userName}`,
          },
        };
      })
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { showAllUsers };
