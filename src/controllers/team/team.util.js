"use strict";

const User = require("../../../models/User");
const Team = require("../../../models/Team");

module.exports = {
  validateMembers: validateMembers,
  isAdmin : isAdmin,
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
    console.log(results);
    return {
      success: true,
      results: results,
      errors: [],
    };
  } catch (err) {
    return {
      success: false,
      results: [],
      errors: [{ msg: err.message }],
    };
  }
}

async function isAdmin(userId, teamId) {
  const team = await Team.findById(teamId);
  return team.admin === userId;
}
