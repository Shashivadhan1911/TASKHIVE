import React from "react";
import { useAuth } from "../context/AuthContext";
import BoardList from "../components/boards/BoardList";

const Dashboard = () => {
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
        <h1>TaskHive</h1>
        <div className="header-right">
          <div className="user-info">
            <div className="avatar">{getInitials(user.name)}</div>
            <span>Welcome, {user.name}</span>
          </div>
          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard">
        <BoardList />
      </main>
    </div>
  );
};

export default Dashboard;
