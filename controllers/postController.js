const Flash = require("../utils/Flash");

exports.createPostGetController = (req, res, next) => {
  res.render("pages/dashboard/posts/create-post", {
    title: "Create a new Post",
    error: {},
    flashMassege: Flash.getMassege(req),
  });
};

exports.createPostPostController = (req, res, next) => {
  res.render("pages/dashboard/posts/create-post", {
    title: "Create A New Post",
    error: {},
    flashMassege: Flash.getMassege(req),
  });
};
