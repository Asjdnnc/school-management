import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/students">Students</Link></li>
          <li><Link to="/teachers">Teachers</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/subjects">Subjects</Link></li>
          <li><Link to="/assignments">Assignments</Link></li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
