const { body } = require("express-validator");

const loginValidator = [
  body("email").not().isEmpty().withMessage("Email Can Not Be Empty"),
  body("password").not().isEmpty().withMessage("Password Can Not Be Empty"),
];

module.exports = loginValidator;
