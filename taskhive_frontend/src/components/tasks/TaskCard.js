import React from "react";
import { format, isAfter } from "date-fns";

const TaskCard = ({ task, onEdit, onDelete, onDragStart, isDragging }) => {
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(task._id);
  };

  const getPriorityClass = (priority) => {
    const classes = {
      low: "priority-low",
      medium: "priority-medium",
      high: "priority-high",
      urgent: "priority-urgent",
    };
    return classes[priority] || "priority-medium";
  };

  const isOverdue = task.dueDate && isAfter(new Date(), new Date(task.dueDate));

  return (
    <div
      className={`task-card ${isDragging ? "dragging" : ""}`}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onClick={handleEdit}
    >
      <div className="task-title">{task.title}</div>

      {task.description && (
        <div className="task-description">
          {task.description.length > 100
            ? `${task.description.substring(0, 100)}...`
            : task.description}
        </div>
      )}

      <div className="task-meta">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span className={`task-priority ${getPriorityClass(task.priority)}`}>
            {task.priority}
          </span>

          {task.dueDate && (
            <span className={`task-due-date ${isOverdue ? "overdue" : ""}`}>
              Due: {format(new Date(task.dueDate), "MMM dd")}
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            className="btn btn-small btn-outline"
            onClick={handleEdit}
            style={{ fontSize: "0.7rem", padding: "0.25rem 0.5rem" }}
          >
            Edit
          </button>
          <button
            className="btn btn-small btn-danger"
            onClick={handleDelete}
            style={{ fontSize: "0.7rem", padding: "0.25rem 0.5rem" }}
          >
            Delete
          </button>
        </div>
      </div>

      {task.assignedTo && task.assignedTo.length > 0 && (
        <div style={{ marginTop: "0.5rem" }}>
          <small style={{ color: "#666" }}>
            Assigned to: {task.assignedTo.map((user) => user.name).join(", ")}
          </small>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
