"use strict";

const User = require("../../../models/User");
const Team = require("../../../models/Team");
const mongoose = require("mongoose");

module.exports = {
  validateMembers: validateMembers,
  isAdmin: isAdmin,
  isUserInTeam: isUserInTeam,
};

async function validateMembers(members) {
  let taskList = [];

  try {
    for (let member of members) {
      taskList.push(User.exists({ email: member }));
    }
    // exists method returns null if user not found else the object id
    let results = await Promise.all(taskList);
    results = results.map((result) => (result ? result._id : null));
    return {
      success: true,
      results: results,
      errors: [],
    };
  } catch (err) {
    return {
      success: false,
      results: [],
      errors: err.message,
    };
  }
}

async function isAdmin(userId, teamId) {
  const team = await Team.findById(teamId);
  if (team) return team.admin.toString() === userId;
  return false;
}

async function isUserInTeam(userId, teamId) {
  const pipline = [
    {
      $match: {
        $and: [
          { _id: mongoose.Types.ObjectId(teamId) },
          {
            members: {
              $in: [ mongoose.Types.ObjectId(userId) ],
            },
          },
        ],
      },
    },
  ];
  const res = await Team.aggregate(pipline);
  return res;
}
