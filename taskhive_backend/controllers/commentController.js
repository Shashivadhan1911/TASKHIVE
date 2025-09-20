const Comment = require("../models/Comment");
const Task = require("../models/Task");
const Board = require("../models/Board");

// @desc    Get comments for a task
// @route   GET /api/comments/task/:taskId
// @access  Private
const getCommentsByTask = async (req, res) => {
  try {
    const comments = await Comment.find({
      task: req.params.taskId,
      parentComment: null,
    })
      .populate("author", "name email")
      .populate({
        path: "replies",
        populate: { path: "author", select: "name email" },
      })
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new comment
// @route   POST /api/comments
// @access  Private
const createComment = async (req, res) => {
  try {
    const { content, task, parentComment } = req.body;

    // Check if task exists and user has access
    const taskDoc = await Task.findById(task).populate("board");
    if (!taskDoc) {
      return res.status(404).json({ message: "Task not found" });
    }

    const board = taskDoc.board;
    const hasAccess =
      board.owner.toString() === req.user._id.toString() ||
      board.members.some(
        (member) => member.user.toString() === req.user._id.toString()
      );

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    const comment = await Comment.create({
      content,
      task,
      author: req.user._id,
      parentComment,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      "author",
      "name email"
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true, runValidators: true }
    ).populate("author", "name email");

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCommentsByTask,
  createComment,
  updateComment,
  deleteComment,
};
