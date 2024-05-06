const User = require("../models/User");
const Profile = require("../models/Profile");
const fs = require("fs");

exports.uploadController = async (req, res, next) => {
  if (req.file) {
    try {
      let profilePic = `/uploads/${req.file.filename}`;
      let profile = await Profile.findOne({ user: req.user._id });

      if (profile) {
        await Profile.findOneAndUpdate(
          { user: req.user._id },
          { $set: { profilePic } }
        );
      }

      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { profilePic } }
      );

      if (req.user.profilePic !== "/uploads/default.png") {
        fs.unlink(`public${req.user.profilePic}`, (err) => {
          if (err) console.log(err);
        });
      }

      res.status(200).json({
        profilePic,
      });
    } catch (e) {
      res.status(500).json({
        profilePic: req.user.profilePic,
      });
    }
  } else {
    res.status(500).json({
      profilePic: req.user.profilePic,
    });
  }
};

exports.removeController = async (req, res, next) => {
  try {
    let profilePic = "/uploads/default.png";
    let currentProfilePic = req.user.profilePic;
    fs.unlink(`public${currentProfilePic}`, async (err) => {
      let profile = await Profile.findOne({ user: req.user._id });

      if (profile) {
        await Profile.findOneAndUpdate(
          { user: req.user._id },
          { $set: { profilePic: profilePic } }
        );
      }

      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: { profilePic: profilePic } }
      );
    });

    res.status(200).json({
      profilePic,
    });
  } catch (e) {
    res.status(500).json({
      massege: "Can't remove profile picture.",
    });
  }
};
