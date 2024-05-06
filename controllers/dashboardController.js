const { validationResult } = require("express-validator");
const Flash = require("../utils/Flash");
const Profile = require("../models/Profile");
const User = require("../models/User");
const errorFormatter = require("../utils/validationErrorFormatter");

exports.dashboardGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      return res.render("pages/dashboard/dashboard", {
        title: "My Dashboard",
        flashMassege: Flash.getMassege(req),
      });
    }

    res.redirect("/dashboard/create-profile");
  } catch (e) {
    next(e);
  }
};

exports.createProfileGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      return res.redirect("/dashboard/edit-profile");
    }

    res.render("pages/dashboard/create-profile", {
      title: "Create a New Profile",
      flashMassege: Flash.getMassege(req),
      error: {},
    });
  } catch (e) {
    next(e);
  }
};

exports.createProfilePostController = async (req, res, next) => {
  let errors = validationResult(req).formatWith(errorFormatter);

  if (!errors.isEmpty()) {
    return res.render("pages/dashboard/create-profile", {
      title: "Create a New Profile",
      flashMassege: Flash.getMassege(req),
      error: errors.mapped(),
    });
  }

  let { name, title, bio, website, facebook, twitter, github } = req.body;

  try {
    let profile = new Profile({
      user: req.user._id,
      name,
      title,
      bio,
      profilePic: req.user.profilePic,
      links: {
        website: website || "",
        facebook: facebook || "",
        twitter: twitter || "",
        github: github || "",
      },
      posts: [],
      bookmarks: [],
    });

    let createdprofile = await profile.save();
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { profile: createdprofile._id } }
    );

    req.flash("success", "Profile created successfully.");
    res.redirect("/dashboard");
  } catch (e) {
    next(e);
  }

  res.render("pages/dashboard/create-profile", {
    title: "Create a New Profile",
    flashMassege: Flash.getMassege(req),
    error: {},
  });
};

exports.editProfileGetController = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });

    if (!profile) {
      return res.redirect("/dashboard/create-profile");
    }

    res.render("pages/dashboard/edit-profile", {
      title: "Edit Your Profile",
      flashMassege: Flash.getMassege(req),
      error: {},
      profile,
    });
  } catch (e) {
    next(e);
  }
};

exports.editProfilePostController = async (req, res, next) => {
  let errors = validationResult(req).formatWith(errorFormatter);

  let { name, title, bio, website, facebook, twitter, github } = req.body;

  if (!errors.isEmpty()) {
    return res.render("pages/dashboard/edit-profile", {
      title: "Create a New Profile",
      flashMassege: Flash.getMassege(req),
      error: errors.mapped(),
      profile: {
        name,
        title,
        bio,
        links: {
          website,
          facebook,
          twitter,
          github,
        },
      },
    });
  }

  try {
    let profile = {
      name,
      title,
      bio,
      links: {
        website: website || "",
        facebook: facebook || "",
        twitter: twitter || "",
        github: github || "",
      },
    };

    let updatedprofile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profile },
      { new: true }
    );

    req.flash("success", "Profile updated successfully.");
    res.render("pages/dashboard/edit-profile", {
      title: "Edit Your Profile",
      flashMassege: Flash.getMassege(req),
      error: {},
      profile: updatedprofile,
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};
