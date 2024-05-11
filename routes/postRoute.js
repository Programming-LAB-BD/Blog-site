const router = require("express").Router();

const postValidator = require("../validators/dashboard/post/postValidator");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const uploads = require("../middlewares/uploadMiddleware");

const {
  createPostGetController,
  createPostPostController,
  editPostGetController,
  editPostPostController,
} = require("../controllers/postController");

router.get("/create", isAuthenticated(), createPostGetController);

router.post(
  "/create",
  isAuthenticated(),
  uploads.single("post-thumbnail"),
  postValidator,
  createPostPostController
);

router.get("/edit/:postId", isAuthenticated(), editPostGetController);
router.post(
  "/edit/:postId",
  isAuthenticated(),
  uploads.single("post-thumbnail"),
  postValidator,
  editPostPostController
);

module.exports = router;
