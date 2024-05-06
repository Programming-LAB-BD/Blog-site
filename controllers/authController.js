const bcrypt = require("bcrypt");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const validationErrorFormatter = require("../utils/validationErrorFormatter");
const Flash = require("../utils/Flash");

exports.signupGetController = (req, res, next) => {
  res.render("pages/auth/signup", {
    title: "Create a new account",
    error: {},
    value: {},
    flashMassege: Flash.getMassege(req),
  });
};

exports.signupPostController = async (req, res, next) => {
  let { username, email, password } = req.body;
  let errors = validationResult(req).formatWith(validationErrorFormatter);

  if (!errors.isEmpty()) {
    req.flash("fail", "Please Check Your Form");
    return res.render("pages/auth/signup", {
      title: "Create a new account",
      error: errors.mapped(),
      value: {
        username,
        email,
        password,
      },
      flashMassege: Flash.getMassege(req),
    });
  }

  try {
    let hashedPassword = await bcrypt.hash(password, 11);
    let user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    req.flash("success", "User Account Created Successfully");
    res.render("pages/auth/signup", {
      title: "Create a new Account",
      error: {},
      value: {},
      flashMassege: Flash.getMassege(req),
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

exports.loginGetController = (req, res, next) => {
  console.log(req.session.isLoggedIn, req.session.user);
  res.render("pages/auth/login", {
    title: "Login to your Account",
    error: {},
    flashMassege: Flash.getMassege(req),
  });
};

exports.loginPostController = async (req, res, next) => {
  let { email, password } = req.body;

  let errors = validationResult(req).formatWith(validationErrorFormatter);
  if (!errors.isEmpty()) {
    req.flash("fail", "Please Check Your Form");
    return res.render("pages/auth/login", {
      title: "Login to your Account",
      error: errors.mapped(),
      flashMassege: Flash.getMassege(req),
    });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      req.flash("fail", "Please Provide Valid Credential");
      return res.render("pages/auth/login", {
        title: "Login to your Account",
        error: {},
        flashMassege: Flash.getMassege(req),
      });
    }

    let match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash("fail", "Please Provide Valid Credential");
      return res.render("pages/auth/login", {
        title: "Login to your Account",
        error: {},
        flashMassege: Flash.getMassege(req),
      });
    }

    req.session.user = user;
    req.session.isLoggedIn = true;
    req.session.save((err) => {
      if (err) {
        console.log(err);
        return next();
      }

      req.flash("success", "Successfully Logged In");
      res.redirect("/dashboard");
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

exports.logoutController = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return next();
    }

    return res.redirect("/auth/login");
  });
};
