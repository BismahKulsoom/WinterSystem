import React from "react";

const Sidebar = () => {
  return (
    <div style={{ width: "250px", height: "100vh", background: "#333", color: "#fff", padding: "20px" }}>
      <h2>Dashboard</h2>
      <ul>
        <li><a style={{textDecoration:"none",color:"white"}} href="/">Winter Session Form</a></li>
        <li><a style={{textDecoration:"none",color:"white"}} href="/assignCourse">Assign Course to Teacher</a></li>
        <li><a  style={{textDecoration:"none",color:"white"}} href="/coursereport">Reports</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
