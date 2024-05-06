const User = require("../models/User");

exports.bindUserWithRequest = () => {
  return async (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return next();
    }

    try {
      let user = await User.findById(req.session.user._id);
      req.user = user;
      next();
    } catch (e) {
      next(e);
    }
  };
};

exports.isAuthenticated = () => {
  return (req, res, next) => {
    if (!req.session.isLoggedIn) {
      res.redirect("/auth/login");
    }

    next();
  };
};

exports.isUnauthenticated = () => {
  return (req, res, next) => {
    if (req.session.isLoggedIn) {
      res.redirect("/dashboard");
    }

    next();
  };
};
