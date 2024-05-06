const { Schema, model } = require("mongoose");
// const Profile = require("./Profile");

const userSchema = new Schema(
  {
    username: {
      required: true,
      type: String,
      trim: true,
    },
    email: {
      required: true,
      type: String,
      trim: true,
    },
    password: {
      required: true,
      type: String,
      minlength: 6,
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
    },
    profilePic: {
      type: String,
      default: "/uploads/default.png",
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
