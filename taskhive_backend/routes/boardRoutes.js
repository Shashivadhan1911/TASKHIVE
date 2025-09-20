const express = require("express");
const {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
} = require("../controllers/boardController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getBoards).post(createBoard);
router.route("/:id").get(getBoard).put(updateBoard).delete(deleteBoard);

module.exports = router;
