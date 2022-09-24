"use strict";

module.exports = async function logoutUser(req, res) {
  req.logout(function(err) {
    if (err) { return res.sendStatus(400); }
    req.session.destroy();
    res.redirect('/');
  });    
};
