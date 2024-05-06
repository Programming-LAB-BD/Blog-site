const router = require("express").Router();

const { isUnauthenticated } = require("../middlewares/authMiddleware");

const {
  signupGetController,
  signupPostController,
  loginGetController,
  loginPostController,
  logoutController,
} = require("../controllers/authController");

const signupValidator = require("../validators/auth/signupValidator");
const loginValidator = require("../validators/auth/loginValidator");

router.get("/signup", isUnauthenticated(), signupGetController);
router.post(
  "/signup",
  isUnauthenticated(),
  signupValidator,
  signupPostController
);

router.get("/login", isUnauthenticated(), loginGetController);
router.post("/login", isUnauthenticated(), loginValidator, loginPostController);

router.get("/logout", logoutController);

module.exports = router;
