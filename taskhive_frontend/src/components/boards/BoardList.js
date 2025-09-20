import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { boardsAPI } from "../../services/api";
import BoardForm from "./BoardForm";
import { backgroundColors } from "./BoardForm";

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await boardsAPI.getBoards();
      setBoards(response.data);
    } catch (error) {
      setError("Failed to fetch boards");
      console.error("Error fetching boards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBoardCreated = (newBoard) => {
    setBoards([newBoard, ...boards]);
    setShowCreateModal(false);
  };

  const handleDeleteBoard = async (boardId) => {
    if (window.confirm("Are you sure you want to delete this board?")) {
      try {
        await boardsAPI.deleteBoard(boardId);
        setBoards(boards.filter((board) => board._id !== boardId));
      } catch (error) {
        console.error("Error deleting board:", error);
        alert("Failed to delete board");
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div
        className="dashboard-header"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <h2 className="dashboard-title">My Boards</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          + Create Board
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="boards-grid">
        {boards.map((board) => (
          <div
            key={board._id}
            className="board-card"
            style={{ borderLeft: `4px solid ${board.backgroundColor}` }}>
            <Link
              to={`/board/${board._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h3>{board.title}</h3>
              <p>{board.description || "No description"}</p>
              <div className="board-meta">
                <span>Owner: {board.owner.name}</span>
                <span>{new Date(board.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
            <div className="board-actions">
              <button
                className="btn btn-small btn-danger"
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteBoard(board._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {boards.length === 0 && (
        <div className="text-center" style={{ padding: "3rem", color: "#666" }}>
          <h3>No boards yet</h3>
          <p>Create your first board to get started with TaskHive!</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            Create Your First Board
          </button>
        </div>
      )}

      {showCreateModal && (
        <BoardForm
          onClose={() => setShowCreateModal(false)}
          onBoardCreated={handleBoardCreated}
        />
      )}
    </div>
  );
};

export default BoardList;
