import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { boardsAPI, tasksAPI } from "../../services/api";
import TaskCard from "../tasks/TaskCard";
import TaskForm from "../tasks/TaskForm";
import { backgroundColors } from "./BoardForm";

const BoardDetails = () => {
  const { id: boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const defaultColumns = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" },
  ];

  useEffect(() => {
    fetchBoardAndTasks();
  }, [boardId]);

  const fetchBoardAndTasks = async () => {
    try {
      const [boardResponse, tasksResponse] = await Promise.all([
        boardsAPI.getBoard(boardId),
        tasksAPI.getTasksByBoard(boardId),
      ]);

      setBoard(boardResponse.data);
      setTasks(tasksResponse.data);
    } catch (error) {
      setError("Failed to load board");
      console.error("Error fetching board:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTask) => {
    setTasks([...tasks, newTask]);
    setShowTaskModal(false);
    setSelectedColumn("");
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(
      tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
    setEditingTask(null);
  };

  const handleTaskDeleted = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await tasksAPI.deleteTask(taskId);
        setTasks(tasks.filter((task) => task._id !== taskId));
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task");
      }
    }
  };

  const handleAddTask = (columnId) => {
    setSelectedColumn(columnId);
    setShowTaskModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleBackgroundColorChange = async (newColor) => {
    try {
      const updatedBoard = await boardsAPI.updateBoard(boardId, {
        ...board,
        backgroundColor: newColor,
      });

      setBoard(updatedBoard.data);
      setShowColorPicker(false);
    } catch (error) {
      console.error("Error updating board background color:", error);
      alert("Failed to update board background color");
    }
  };

  // Drag and Drop Functions
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, columnId) => {
    e.preventDefault();

    if (!draggedTask || draggedTask.column === columnId) {
      setDraggedTask(null);
      return;
    }

    try {
      const updatedTask = await tasksAPI.moveTask(draggedTask._id, {
        column: columnId,
        position: 0,
      });

      setTasks(
        tasks.map((task) =>
          task._id === draggedTask._id ? { ...task, column: columnId } : task
        )
      );
    } catch (error) {
      console.error("Error moving task:", error);
      alert("Failed to move task");
    } finally {
      setDraggedTask(null);
    }
  };

  const getTasksByColumn = (columnId) => {
    return tasks
      .filter((task) => task.column === columnId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="board-page">
      <div className="board-header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h1 className="board-title" style={{ color: board.backgroundColor }}>
            {board.title}
          </h1>
          <button
            className="btn btn-outline btn-small"
            onClick={() => setShowColorPicker(!showColorPicker)}
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: board.backgroundColor,
              border: "2px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            title="Change background color"
          />
        </div>
        {board.description && (
          <p style={{ color: "#666", margin: "0.5rem 0" }}>
            {board.description}
          </p>
        )}

        {showColorPicker && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "0",
              zIndex: 1000,
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              marginTop: "0.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginBottom: "0.5rem",
              }}
            >
              {backgroundColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleBackgroundColorChange(color)}
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: color,
                    border:
                      board.backgroundColor === color
                        ? "3px solid #333"
                        : "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  title={`Select ${color} color`}
                />
              ))}
            </div>
            <button
              className="btn btn-secondary btn-small"
              onClick={() => setShowColorPicker(false)}
              style={{ width: "100%" }}
            >
              Close
            </button>
          </div>
        )}
      </div>

      <div className="board-content">
        {defaultColumns.map((column) => {
          const columnTasks = getTasksByColumn(column.id);

          return (
            <div
              key={column.id}
              className="column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="column-header">
                <h3 className="column-title">{column.title}</h3>
                <span className="task-count">{columnTasks.length}</span>
              </div>

              <div className="column-content">
                <div className="tasks-list">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={handleTaskDeleted}
                      onDragStart={handleDragStart}
                      isDragging={draggedTask?._id === task._id}
                    />
                  ))}
                </div>

                <button
                  className="btn btn-outline btn-small"
                  onClick={() => handleAddTask(column.id)}
                  style={{ width: "100%", marginTop: "1rem" }}
                >
                  + Add a card
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showTaskModal && (
        <TaskForm
          boardId={boardId}
          column={selectedColumn}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedColumn("");
          }}
          onTaskCreated={handleTaskCreated}
        />
      )}

      {editingTask && (
        <TaskForm
          boardId={boardId}
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </div>
  );
};

export default BoardDetails;
