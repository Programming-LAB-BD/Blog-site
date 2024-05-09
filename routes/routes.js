const authRoute = require("./authRoute");
const dashboardRoute = require("./dashboardRoute");
const validator = require("../playground/validetor");
const uploadRoute = require("./uploadRoute");
const postRoute = require("./postRoute");

const routes = [
  {
    path: "/auth",
    handler: authRoute,
  },
  {
    path: "/dashboard",
    handler: dashboardRoute,
  },
  {
    path: "/uploads",
    handler: uploadRoute,
  },
  {
    path: "/posts",
    handler: postRoute,
  },
  {
    path: "/playground",
    handler: validator,
  },
  {
    path: "/",
    handler: (req, res) => {
      res.json({
        massege: "hello world",
      });
    },
  },
];

module.exports = (app) => {
  routes.map((route) => {
    if (route.path === "/") {
      app.get(route.path, route.handler);
    } else {
      app.use(route.path, route.handler);
    }
  });
};
