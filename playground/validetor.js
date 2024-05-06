// const { check, validationResult } = require("express-validator");
const router = require("express").Router();
const Flash = require("../utils/Flash");
const upload = require("../middlewares/uploadMiddleware");

router.get("/validator", (req, res, next) => {
  res.render("playground/signup", {
    title: "Playground",
    flashMassege: Flash.getMassege(req),
  });
  next();
});

// let validation = [
//   check("username")
//     .trim()
//     .not()
//     .isEmpty()
//     .withMessage("Username can not be empty")
//     .isLength({ min: 6, max: 15 })
//     .withMessage("Username must be 6-15 character"),
//   check("email")
//     .normalizeEmail()
//     .isEmail()
//     .withMessage("Provide a valid email"),
//   check("password").custom((value) => {
//     if (value.length < 6) {
//       throw new Error("Password must be greater then 5 characters");
//     }

//     return true;
//   }),
//   check("confirmPassword").custom((value, { req }) => {
//     if (value !== req.body.password) {
//       throw new Error("Confirm password dosn't matched.");
//     }
//     return true;
//   }),
// ];

router.post("/validator", upload.single("file"), (req, res, next) => {
  if (req.file) {
    console.log(req.file);
  }

  res.redirect("/playground/validator");
});

module.exports = router;
