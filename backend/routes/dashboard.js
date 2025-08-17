const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get counts for each entity
    const studentsCount = await pool.query('SELECT COUNT(*) FROM students');
    const teachersCount = await pool.query('SELECT COUNT(*) FROM teachers');
    const coursesCount = await pool.query('SELECT COUNT(*) FROM courses');
    const subjectsCount = await pool.query('SELECT COUNT(*) FROM subjects');
    const assignmentsCount = await pool.query('SELECT COUNT(*) FROM assignments');

    // Get course status distribution
    const courseStatus = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM courses 
      GROUP BY status
    `);

    // Get assignment status distribution
    const assignmentStatus = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM assignments 
      GROUP BY status
    `);

    // Get recent activities (last 5 records from each table)
    const recentStudents = await pool.query(`
      SELECT id, name, roll_no, created_at 
      FROM students 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    const recentTeachers = await pool.query(`
      SELECT id, name, subject, created_at 
      FROM teachers 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    const recentAssignments = await pool.query(`
      SELECT a.id, a.title, s.name as subject_name, a.due_date, a.status 
      FROM assignments a 
      LEFT JOIN subjects s ON a.subject_id = s.id 
      ORDER BY a.created_at DESC 
      LIMIT 5
    `);

    res.json({
      counts: {
        students: parseInt(studentsCount.rows[0].count),
        teachers: parseInt(teachersCount.rows[0].count),
        courses: parseInt(coursesCount.rows[0].count),
        subjects: parseInt(subjectsCount.rows[0].count),
        assignments: parseInt(assignmentsCount.rows[0].count)
      },
      courseStatus: courseStatus.rows,
      assignmentStatus: assignmentStatus.rows,
      recentActivities: {
        students: recentStudents.rows,
        teachers: recentTeachers.rows,
        assignments: recentAssignments.rows
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get class-wise student distribution
router.get('/class-distribution', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT class, COUNT(*) as count 
      FROM students 
      GROUP BY class 
      ORDER BY class
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching class distribution:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get subject-wise teacher distribution
router.get('/subject-distribution', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT subject, COUNT(*) as count 
      FROM teachers 
      GROUP BY subject 
      ORDER BY count DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching subject distribution:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get upcoming assignments (due in next 7 days)
router.get('/upcoming-assignments', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.id, a.title, a.due_date, s.name as subject_name, t.name as teacher_name
      FROM assignments a 
      LEFT JOIN subjects s ON a.subject_id = s.id 
      LEFT JOIN teachers t ON a.created_by = t.id 
      WHERE a.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
      ORDER BY a.due_date ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching upcoming assignments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
