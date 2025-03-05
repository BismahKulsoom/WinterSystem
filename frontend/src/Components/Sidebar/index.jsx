import React from "react";

const Sidebar = () => {
  return (
    <div style={{ width: "250px", height: "100vh", background: "#333", color: "#fff", padding: "20px" }}>
      <h2>Dashboard</h2>
      <ul>
        <li><a href="/">Winter Session Form</a></li>
        <li><a href="/assignCourse">Assign Course to Teacher</a></li>
        <li><a href="/reports">Reports</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
