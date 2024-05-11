const { body } = require("express-validator");
const cheerio = require("cheerio");

module.exports = [
  body("title")
    .not()
    .isEmpty()
    .withMessage("Title can't be empty.")
    .isLength({ max: 100 })
    .withMessage("Title can't be more then 100 charecters.")
    .trim(),
  body("body")
    .not()
    .isEmpty()
    .withMessage("Body can't be empty.")
    .custom((value) => {
      let $ = cheerio.load(value);
      let text = $.text();

      if (text.length > 5000) {
        throw new Error("Body can't be more then 5000 charecters.");
      }

      return true;
    }),
  body("tags").not().isEmpty().withMessage("Tag can't be Empty.").trim(),
];
