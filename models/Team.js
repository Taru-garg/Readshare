"use strict";

const { Schema, model } = require("mongoose");

const teamSchema = new Schema(
  {
    name: { type: String, required: true, message: "Name Required." },
    admin: { type: Schema.Types.ObjectId, required: true },
    members: [{ type: Schema.Types.ObjectId, required: true }],
    links: [
      {
        url: { type: String, required: true, message: "URL Required" },
        tags: {
          type: [{ type: String, required: false }],
          default: [],
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Team", teamSchema);
