const router = require("express").Router();

const { isAuthenticated } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const {
  uploadController,
  removeController,
} = require("../controllers/uploadController");

router.post(
  "/profilePic",
  isAuthenticated(),
  upload.single("profilePic"),
  uploadController
);

router.delete("/profilePic", isAuthenticated(), removeController);

module.exports = router;
