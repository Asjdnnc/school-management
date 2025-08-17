import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Courses from "./pages/Courses";
import Subjects from "./pages/Subjects";
import Assignments from "./pages/Assignments";
import "./App.css";

function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/assignments" element={<Assignments />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
