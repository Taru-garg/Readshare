"use strict";
const LocalStrategy = require("passport-local").Strategy;
const User = require("../../../models/User");
const bcrypt = require("bcryptjs");

// Create the strategy
const authConfig = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email }).select("+password");
          if (!user) {
            return done(null, false);
          } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
              return done(null, user);
            } 
            return done(null, false);
          }
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};

module.exports = authConfig;
