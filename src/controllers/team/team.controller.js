"use strict";

const { deleteTeam, removeMemberFromTeam } = require("./team.action.delete");
const { createTeam } = require("./team.action.create");
const { addMemberToTeam } = require("./team.action.addmember");
const getTeams  = require("./team.action.getTeams");

module.exports = {
  createTeam: createTeam,
  deleteTeam: deleteTeam,
  addmember: addMemberToTeam,
  removemember: removeMemberFromTeam,
  getTeams: getTeams,
};
