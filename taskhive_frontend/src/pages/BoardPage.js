import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BoardDetails from "../components/boards/BoardDetails";

const BoardPage = () => {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div>
      <header className="header">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link
            to="/dashboard"
            style={{ color: "white", textDecoration: "none" }}
          >
            <h1>TaskHive</h1>
          </Link>
          <Link
            to="/dashboard"
            className="btn btn-outline"
            style={{ color: "white", borderColor: "white" }}
          >
            ← Back to Dashboard
          </Link>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="avatar">{getInitials(user.name)}</div>
            <span>{user.name}</span>
          </div>
          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main>
        <BoardDetails />
      </main>
    </div>
  );
};

export default BoardPage;
