const express = require("express");
const router = express.Router();

const postsController = require("../../controllers/postsController");
const asyncHandler = require("../../utils/asyncHandler");
const auth = require("../../middleware/auth");

router.get("/", asyncHandler(postsController.getPosts));
router.get("/:id", asyncHandler(postsController.getPostById));

router.post("/", auth, asyncHandler(postsController.createPost));
router.patch("/:id", auth, asyncHandler(postsController.updatePost));
router.delete("/:id", auth, asyncHandler(postsController.deletePost));
router.post("/:id/like", auth, asyncHandler(postsController.toggleLike));

module.exports = router;