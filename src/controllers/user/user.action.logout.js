"use strict";

module.exports = async function logoutUser(req, res) {
  try {
    req.logout();
    req.session.destroy();
    return res.status(200).json({ msg: "Logged out" });
  } catch (err) {
    return res.status(400).json({ errors: [{ msg: err.message }] });
  }
};
