const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const { body, validationResult } = require('express-validator');

// Get all courses with instructor information
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, t.name as instructor_name 
      FROM courses c 
      LEFT JOIN teachers t ON c.instructor_id = t.id 
      ORDER BY c.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT c.*, t.name as instructor_name 
      FROM courses c 
      LEFT JOIN teachers t ON c.instructor_id = t.id 
      WHERE c.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new course
router.post('/', [
  body('code').notEmpty().withMessage('Course code is required'),
  body('name').notEmpty().withMessage('Course name is required'),
  body('duration').notEmpty().withMessage('Duration is required'),
  body('status').optional().isIn(['Upcoming', 'Ongoing', 'Completed']).withMessage('Invalid status'),
  body('instructor_id').optional().isInt().withMessage('Instructor ID must be a number'),
  body('description').optional().isString().withMessage('Description must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, name, instructor_id, duration, status, description } = req.body;
    
    // Check if course code already exists
    const existingCourse = await pool.query(
      'SELECT * FROM courses WHERE code = $1',
      [code]
    );
    
    if (existingCourse.rows.length > 0) {
      return res.status(400).json({ error: 'Course code already exists' });
    }

    // Check if instructor exists if instructor_id is provided
    if (instructor_id) {
      const instructorExists = await pool.query(
        'SELECT * FROM teachers WHERE id = $1',
        [instructor_id]
      );
      
      if (instructorExists.rows.length === 0) {
        return res.status(400).json({ error: 'Instructor not found' });
      }
    }

    const result = await pool.query(
      'INSERT INTO courses (code, name, instructor_id, duration, status, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [code, name, instructor_id, duration, status || 'Upcoming', description]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update course
router.put('/:id', [
  body('code').notEmpty().withMessage('Course code is required'),
  body('name').notEmpty().withMessage('Course name is required'),
  body('duration').notEmpty().withMessage('Duration is required'),
  body('status').optional().isIn(['Upcoming', 'Ongoing', 'Completed']).withMessage('Invalid status'),
  body('instructor_id').optional().isInt().withMessage('Instructor ID must be a number'),
  body('description').optional().isString().withMessage('Description must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { code, name, instructor_id, duration, status, description } = req.body;

    // Check if course code already exists for other courses
    const existingCourse = await pool.query(
      'SELECT * FROM courses WHERE code = $1 AND id != $2',
      [code, id]
    );
    
    if (existingCourse.rows.length > 0) {
      return res.status(400).json({ error: 'Course code already exists' });
    }

    // Check if instructor exists if instructor_id is provided
    if (instructor_id) {
      const instructorExists = await pool.query(
        'SELECT * FROM teachers WHERE id = $1',
        [instructor_id]
      );
      
      if (instructorExists.rows.length === 0) {
        return res.status(400).json({ error: 'Instructor not found' });
      }
    }

    const result = await pool.query(
      'UPDATE courses SET code = $1, name = $2, instructor_id = $3, duration = $4, status = $5, description = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [code, name, instructor_id, duration, status, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete course
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM courses WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
