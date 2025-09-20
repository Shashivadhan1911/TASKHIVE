const express = require("express");
const {
  getTasksByBoard,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").post(createTask);
router.route("/board/:boardId").get(getTasksByBoard);
router.route("/:id").put(updateTask).delete(deleteTask);
router.route("/:id/move").put(moveTask);

module.exports = router;
