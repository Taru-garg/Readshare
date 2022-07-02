"use strict";

const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    username: { type: String, trim: true, unique: true, index: true },
    password: { type: String, select: false, required: true },
    teams: {
      type: [{ type: Schema.Types.ObjectId, ref: "Team" }],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
