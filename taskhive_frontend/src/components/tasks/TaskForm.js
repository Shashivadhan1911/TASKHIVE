import React, { useState, useEffect } from "react";
import { tasksAPI, commentsAPI } from "../../services/api";
import CommentList from "../comments/CommentList";

const TaskForm = ({
  boardId,
  column,
  task = null,
  onClose,
  onTaskCreated,
  onTaskUpdated,
}) => {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "medium",
    dueDate: task?.dueDate ? task.dueDate.split("T")[0] : "",
    column: task?.column || column || "todo",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const isEditing = Boolean(task);

  useEffect(() => {
    if (isEditing && task._id) {
      fetchComments();
    }
  }, [isEditing, task?._id]);

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await commentsAPI.getCommentsByTask(task._id);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const taskData = {
        ...formData,
        board: boardId,
        dueDate: formData.dueDate || null,
      };

      let response;
      if (isEditing) {
        response = await tasksAPI.updateTask(task._id, taskData);
        onTaskUpdated(response.data);
      } else {
        response = await tasksAPI.createTask(taskData);
        onTaskCreated(response.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments([newComment, ...comments]);
  };

  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter((comment) => comment._id !== commentId));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "600px" }}
      >
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditing ? "Edit Task" : "Create New Task"}
          </h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Task Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-input form-textarea"
              value={formData.description}
              onChange={handleChange}
              maxLength={1000}
              rows={4}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                className="form-input"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {isEditing && (
            <div className="form-group">
              <label htmlFor="column">Status</label>
              <select
                id="column"
                name="column"
                className="form-select"
                value={formData.column}
                onChange={handleChange}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          )}

          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !formData.title.trim()}
            >
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Task"
                : "Create Task"}
            </button>
          </div>
        </form>

        {isEditing && (
          <CommentList
            taskId={task._id}
            comments={comments}
            loading={loadingComments}
            onCommentAdded={handleCommentAdded}
            onCommentDeleted={handleCommentDeleted}
          />
        )}
      </div>
    </div>
  );
};

export default TaskForm;
