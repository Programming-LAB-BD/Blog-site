const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const sessionStore = require("connect-mongodb-session");
const config = require("config");
const morgan = require("morgan");

const { bindUserWithRequest } = require("./authMiddleware");
const setLocals = require("./setLocals");

const MongoDBStore = sessionStore(session);
const MONGODB_URI = `mongodb+srv://${config.get("db-user-name")}:${config.get(
  "db-password"
)}@software.7wa8yc7.mongodb.net/${config.get(
  "db-name"
)}?retryWrites=true&w=majority&appName=${config.get("db-app-name")}`;

// Session Store in DataBase
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "session",
  expires: 1000 * 60 * 60 * 2,
});

const middlewares = [
  morgan("dev"),
  express.static("public"),
  express.urlencoded({ extended: true }),
  express.json(),
  session({
    secret: config.get("secret-key"),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
    store: store,
  }),
  flash(),
  bindUserWithRequest(),
  setLocals(),
];

module.exports = (app) => {
  middlewares.map((middleware) => {
    app.use(middleware);
  });
};
