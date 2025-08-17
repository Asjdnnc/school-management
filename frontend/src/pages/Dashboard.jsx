import React, { useState, useEffect } from "react";
import { GraduationCap, User, BookOpen, BookMarked, PlusCircle, FileText } from "lucide-react";
import apiService from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDashboardStats();
      
      const statsData = [
        { label: "Students", value: data.counts.students, icon: <GraduationCap size={40} />, color: "blue" },
        { label: "Teachers", value: data.counts.teachers, icon: <User size={40} />, color: "green" },
        { label: "Courses", value: data.counts.courses, icon: <BookOpen size={40} />, color: "purple" },
        { label: "Subjects", value: data.counts.subjects, icon: <BookMarked size={40} />, color: "orange" },
        { label: "Assignments", value: data.counts.assignments, icon: <FileText size={40} />, color: "red" },
      ];
      
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard stats: ' + err.message);
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const links = [
    { label: "Manage Students" },
    { label: "Manage Teachers" },
    { label: "Manage Courses" },
    { label: "Manage Subjects" },
  ];

  if (loading) {
    return (
      <main className="dashboard">
        <h1 className="title">Welcome to Your Dashboard</h1>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard">
        <h1 className="title">Welcome to Your Dashboard</h1>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardStats}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <h1 className="title">Welcome to Your Dashboard</h1>
      <p className="subtitle">
        Manage students, teachers, courses, and subjects all in one place.
      </p>

      {/* Stats Section */}
      <div className="stats-grid">
        {stats.map((item, idx) => (
          <div key={idx} className="stat-card">
            <div className={`stat-icon ${item.color}`}>{item.icon}</div>
            <h2 className="stat-label">{item.label}</h2>
            <p className="stat-value">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Links Section */}
      <h2 className="quick-links-title">Quick Links</h2>
      <div className="links-container">
        {links.map((link, idx) => (
          <button key={idx} className="link-btn">
            <PlusCircle size={18} />
            {link.label}
          </button>
        ))}
      </div>
    </main>
  );
}

export default Dashboard;
