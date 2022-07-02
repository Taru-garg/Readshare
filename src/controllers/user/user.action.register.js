"use strict";

const User = require("../../../models/User");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

module.exports = async function registerUser(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email: email,
      username: username,
      password: hashedPassword,
    });
    await newUser.save({ session });
    await session.commitTransaction();
    return res.status(200).json({ msg: "User created" });
  } catch (err) {
    await session.abortTransaction();
    return res.status(400).json({ errors: [{ msg: err.message }] });
  } finally {
    session.endSession();
  }
};
