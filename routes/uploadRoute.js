const router = require("express").Router();

const { isAuthenticated } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const {
  uploadController,
  removeController,
  postImageUploadController,
} = require("../controllers/uploadController");

router.post(
  "/profilePic",
  isAuthenticated(),
  upload.single("profilePic"),
  uploadController
);

router.delete("/profilePic", isAuthenticated(), removeController);

router.post(
  "/postImage",
  isAuthenticated(),
  upload.single("post-image"),
  postImageUploadController
);

module.exports = router;
