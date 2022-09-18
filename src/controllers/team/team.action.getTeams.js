"use strict";

const { default: mongoose } = require("mongoose");
const passport = require("passport");
const Team = require("../../../models/Team");
const User = require("../../../models/User");

module.exports = async function getTeams(req, res) {
  try {
    const pipeline = [
      { $match: { _id: mongoose.Types.ObjectId(req.user.id) } },
      { $project: { _id: 0, teams: 1 } },
      {
        $lookup: {
          from: "teams",
          localField: "teams",
          foreignField: "_id",
          pipeline: [
            { $project: { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 } },
          ],
          as: "teams",
        },
      },
      {$project : { _id: 0, teams: 1 } },
    ];
    const teams = await User.aggregate(pipeline);
    console.log(teams);
    return res.status(200).json({
      teams 
    });
  } catch (err) {
    return res.status(400).json({
      errors: [
        {
          msg: err,
        },
      ],
    });
  }
};
