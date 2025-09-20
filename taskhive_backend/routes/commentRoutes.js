const express = require("express");
const {
  getCommentsByTask,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").post(createComment);
router.route("/task/:taskId").get(getCommentsByTask);
router.route("/:id").put(updateComment).delete(deleteComment);

module.exports = router;
