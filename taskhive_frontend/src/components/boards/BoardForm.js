import React, { useState } from "react";
import { boardsAPI } from "../../services/api";

export const backgroundColors = [
  "#0079bf",
  "#d29034",
  "#519839",
  "#b04632",
  "#89609e",
  "#cd5a91",
  "#4bbf6b",
  "#00aecc",
  "#838c91",
  "#026aa7",
  "#51e898",
  "#ff78cb",
];

const BoardForm = ({ onClose, onBoardCreated, board = null }) => {
  const [formData, setFormData] = useState({
    title: board?.title || "",
    description: board?.description || "",
    backgroundColor: board?.backgroundColor || "#0079bf",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(board);

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
      let response;
      if (isEditing) {
        response = await boardsAPI.updateBoard(board._id, formData);
      } else {
        response = await boardsAPI.createBoard(formData);
      }

      onBoardCreated(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save board");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditing ? "Edit Board" : "Create New Board"}
          </h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Board Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              className="form-input form-textarea"
              value={formData.description}
              onChange={handleChange}
              maxLength={500}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Background Color</label>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginTop: "0.5rem",
              }}
            >
              {backgroundColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, backgroundColor: color })
                  }
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: color,
                    border:
                      formData.backgroundColor === color
                        ? "3px solid #333"
                        : "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>

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
                ? "Update Board"
                : "Create Board"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardForm;
