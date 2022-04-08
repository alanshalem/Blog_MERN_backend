const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getPosts,
  createPost,
  getPostById,
  updatePost,
  deletePost,
  getAllPosts,
  getOldPosts,
} = require("../controllers/postController");

const router = express.Router();

router
  .route("/")
  .get(getPosts)
  .post(protect, createPost)
  .put(protect, updatePost);

router.route("/admin").get(protect, getAllPosts);

router.route("/old").get(getOldPosts);

router.route("/:id").get(getPostById).delete(protect, deletePost);

module.exports = router;
