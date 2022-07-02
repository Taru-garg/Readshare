"use strict";
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const { get_db } = require("./config/db");
const session = require("express-session");
const authConfig = require("./src/controllers/auth/auth.controller");
const MongoStore = require("connect-mongo");
const RedisStore = require("connect-redis");

/* Register the routes */
const linkRouter = require("./src/routes/link.router");
const teamRouter = require("./src/routes/team.router");
const userRouter = require("./src/routes/user.router");

/* Load the configuration */
dotenv.config({ path: "./config/config.env" });

/* Instantiate the app */
const app = express();
authConfig(passport);

/* Connect to the database */
const db = get_db()
  .then((res) => {
    return res;
  })
  .catch((err) => {
    console.log(err);
  });

const dbClient = db
  .then((res) => {
    return res.connection.getClient();
  })
  .catch((err) => {
    console.log(err);
  });

/* Middleware */
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    store: MongoStore.create({
      client: dbClient,
      dbname: "sessions",
      ttl: 24 * 60 * 60,
      autoRemove: "native",
      crypto: {
        algorithm: "aes-256-ctr",
        password: process.env.SESSION_SECRET,
      },
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);


app.use(passport.initialize());
app.use(passport.session());

/* Use the router */
app.use("/", linkRouter);
app.use("/", teamRouter);
app.use("/", userRouter);

/*Base route for redirects */
app.get("/", (req, res) => {
  if (req.user) {
    res.send(`Home ${req.user.email}`);
  } else {
    res.send("Hello No User");
  }
});

/* Start the server */
app.listen(process.env.PORT, () => {
  console.log("Server started on port 3000");
});
