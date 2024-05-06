const { body } = require("express-validator");
const User = require("../../models/User");

const signupValidator = [
  body("username")
    .trim()
    .isLength({
      min: 2,
      max: 15,
    })
    .withMessage("Username Must Be Between 2-15 Characters")
    .custom(async (username) => {
      let user = await User.findOne({ username });
      if (user) {
        return Promise.reject("Username Already Used");
      }

      return true;
    }),
  body("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Please Provide A Valid Email")
    .custom(async (email) => {
      let user = await User.findOne({ email });
      if (user) {
        return Promise.reject("Email Already Used");
      }

      return true;
    }),
  body("password")
    .isLength({
      min: 6,
    })
    .withMessage("Password Must Be Greater Then 6 Characters"),
  body("confirmPassword")
    .isLength({
      min: 6,
    })
    .withMessage("Password Must Be Greater Then 6 Characters")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password Dosn't Match");
      }

      return true;
    }),
];

module.exports = signupValidator;
