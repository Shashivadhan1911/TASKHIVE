const Board = require("../models/Board");
const Task = require("../models/Task");

// @desc    Get all boards for user
// @route   GET /api/boards
// @access  Private
const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.user._id }, { "members.user": req.user._id }],
    })
      .populate("owner", "name email")
      .populate("members.user", "name email")
      .sort({ updatedAt: -1 });

    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single board
// @route   GET /api/boards/:id
// @access  Private
const getBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members.user", "name email");

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Check if user has access to board
    const hasAccess =
      board.owner._id.toString() === req.user._id.toString() ||
      board.members.some(
        (member) => member.user._id.toString() === req.user._id.toString()
      );

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new board
// @route   POST /api/boards
// @access  Private
const createBoard = async (req, res) => {
  try {
    const { title, description, backgroundColor } = req.body;

    const board = await Board.create({
      title,
      description,
      owner: req.user._id,
      backgroundColor,
      columns: [
        { id: "todo", title: "To Do", taskIds: [] },
        { id: "in-progress", title: "In Progress", taskIds: [] },
        { id: "review", title: "Review", taskIds: [] },
        { id: "done", title: "Done", taskIds: [] },
      ],
    });

    const populatedBoard = await Board.findById(board._id).populate(
      "owner",
      "name email"
    );

    res.status(201).json(populatedBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update board
// @route   PUT /api/boards/:id
// @access  Private
const updateBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Check if user is owner
    if (board.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedBoard = await Board.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("owner", "name email")
      .populate("members.user", "name email");

    res.json(updatedBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete board
// @route   DELETE /api/boards/:id
// @access  Private
const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Check if user is owner
    if (board.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Delete all tasks in the board
    await Task.deleteMany({ board: req.params.id });

    // Delete the board
    await Board.findByIdAndDelete(req.params.id);

    res.json({ message: "Board deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBoards,
  getBoard,
  createBoard,
  updateBoard,
  deleteBoard,
};
