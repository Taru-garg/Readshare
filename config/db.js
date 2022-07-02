"use strict";

const { default: mongoose } = require("mongoose");

let _db = null;

mongoose.connection.on("connecting", async function () {
  console.log("Trying to connect to MongoDB");
});

mongoose.connection.on("disconnected", async function () {
  console.log("Lost MongoDB connection...");
  while (_db === null || _db.connection.readyState === 0) {
    try {
      await get_db();
    } catch (err) {
      console.log(err);
    }
  }
});

const get_db = async () => {
  try {
    if (_db === null) {
      const conn = await connectDB();
      _db = conn;
    } else {
      if (_db.connection.readyState === 0) await _db.connection.client.connect();
      else console.log("Already connected to MongoDB");
    }
    console.log(
      `MongoDB ${mongoose.STATES[_db.connection.readyState]}: ${
        _db.connection.host
      }`
    );
  } catch (err) {
    console.log("Couldn't connect to MongoDB");
  }
  return _db;
};

const connectDB = async () => {
  try {
    const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`;

    const conn = mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    return conn;
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = {
  get_db: get_db,
};
