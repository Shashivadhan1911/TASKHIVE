const Task = require("../models/Task");
const Board = require("../models/Board");

// @desc    Get all tasks for a board
// @route   GET /api/tasks/board/:boardId
// @access  Private
const getTasksByBoard = async (req, res) => {
  try {
    const tasks = await Task.find({ board: req.params.boardId })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ position: 1, createdAt: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, board, column, dueDate, priority } = req.body;

    // Check if board exists and user has access
    const boardDoc = await Board.findById(board);
    if (!boardDoc) {
      return res.status(404).json({ message: "Board not found" });
    }

    const hasAccess =
      boardDoc.owner.toString() === req.user._id.toString() ||
      boardDoc.members.some(
        (member) => member.user.toString() === req.user._id.toString()
      );

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    const task = await Task.create({
      title,
      description,
      board,
      column,
      createdBy: req.user._id,
      dueDate,
      priority,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check board access
    const board = await Board.findById(task.board);
    const hasAccess =
      board.owner.toString() === req.user._id.toString() ||
      board.members.some(
        (member) => member.user.toString() === req.user._id.toString()
      );

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check board access
    const board = await Board.findById(task.board);
    const hasAccess =
      board.owner.toString() === req.user._id.toString() ||
      board.members.some(
        (member) => member.user.toString() === req.user._id.toString()
      );

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Move task between columns
// @route   PUT /api/tasks/:id/move
// @access  Private
const moveTask = async (req, res) => {
  try {
    const { column, position } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update task column and position
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { column, position },
      { new: true }
    )
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasksByBoard,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
};
