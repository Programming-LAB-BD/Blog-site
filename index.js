require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

const setMiddlewares = require("./middlewares/middlewares");
const setRoutes = require("./routes/routes");

// Setup MongoDB Url Here
const MONGODB_URI = `mongodb+srv://${config.get("db-user-name")}:${config.get(
  "db-password"
)}@software.7wa8yc7.mongodb.net/${config.get(
  "db-name"
)}?retryWrites=true&w=majority&appName=${config.get("db-app-name")}`;

// App Setup Here Start
const app = express();

// Setup View Engine
app.set("view engine", "ejs");
app.set("views", "views");

// Setup All Middlewares Here
setMiddlewares(app);

// Setup All Route Here
setRoutes(app);

// Setup 404 Not Found
app.use((req, res, next) => {
  let error = new Error("404 Page Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  if (error.status === 404) {
    return res.render("pages/Error/404");
  }

  console.log(error);
  return res.render("pages/Error/500");
});

// Setup DataBase & Server Here
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(config.get("port"), () => {
      console.log(`Server is running on PORT: ${config.get("port")}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });
