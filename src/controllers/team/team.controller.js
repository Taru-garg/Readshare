"use strict";

const { getTeams } = require("./team.action.get.teams");
const { deleteTeam } = require("./team.action.delete.team");
const { createTeam } = require("./team.action.create.team");
const { addMemberToTeam } = require("./team.action.create.member");
const { removeMemberFromTeam } = require("./team.action.delete.member");

module.exports = {
  getTeams: getTeams,
  createTeam: createTeam,
  deleteTeam: deleteTeam,
  addmember: addMemberToTeam,
  removemember: removeMemberFromTeam,
};
