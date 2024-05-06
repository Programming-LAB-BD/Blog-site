const { body } = require("express-validator");
const validator = require("validator");

const linkValidator = (value, massege) => {
  if (value) {
    if (!validator.isURL(value)) {
      throw new Error(massege);
    }
  }
  return true;
};

module.exports = [
  body("name")
    .not()
    .isEmpty()
    .withMessage("Name can't be empty.")
    .isLength({ max: 30 })
    .withMessage("Name can't be more then 30 charecters")
    .trim(),
  body("title")
    .isLength({ max: 100 })
    .withMessage("Title can't be more then 100 charecters")
    .trim(),
  body("bio")
    .isLength({ max: 500 })
    .withMessage("Bio can't be more then 500 charecters")
    .trim(),
  body("website").custom((value) =>
    linkValidator(value, "Please provide a valid website url")
  ),
  body("facebook").custom((value) =>
    linkValidator(value, "Please provide a valid facebook profile link")
  ),
  body("twitter").custom((value) =>
    linkValidator(value, "Please provide a valid twitter profile link")
  ),
  body("github").custom((value) =>
    linkValidator(value, "Please provide a valid github link")
  ),
];
