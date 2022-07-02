module.exports = {
  add: addLinkToTeam,
  remove: removeLinkFromTeam,
};

async function addLinkToTeam(req, res) {
  res.send("add link to team");
}

async function removeLinkFromTeam(req, res) {
  res.send("remove link from team");
}

function existingLink(link, team) {
  for (var i = 0; i < team.links.length; i++) {
    if (team.links[i].url === link.url) {
      return true;
    }
  }
  return false;
}
