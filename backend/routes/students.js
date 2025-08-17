const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const { body, validationResult } = require('express-validator');

// Get all students
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM students ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new student
router.post('/', [
  body('roll_no').notEmpty().withMessage('Roll number is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('class').notEmpty().withMessage('Class is required'),
  body('section').notEmpty().withMessage('Section is required'),
  body('contact').notEmpty().withMessage('Contact is required'),
  body('email').optional().isEmail().withMessage('Invalid email format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { roll_no, name, class: studentClass, section, contact, email, address } = req.body;
    
    // Check if roll number already exists
    const existingStudent = await pool.query(
      'SELECT * FROM students WHERE roll_no = $1',
      [roll_no]
    );
    
    if (existingStudent.rows.length > 0) {
      return res.status(400).json({ error: 'Roll number already exists' });
    }

    const result = await pool.query(
      'INSERT INTO students (roll_no, name, class, section, contact, email, address) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [roll_no, name, studentClass, section, contact, email, address]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update student
router.put('/:id', [
  body('roll_no').notEmpty().withMessage('Roll number is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('class').notEmpty().withMessage('Class is required'),
  body('section').notEmpty().withMessage('Section is required'),
  body('contact').notEmpty().withMessage('Contact is required'),
  body('email').optional().isEmail().withMessage('Invalid email format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { roll_no, name, class: studentClass, section, contact, email, address } = req.body;

    // Check if roll number already exists for other students
    const existingStudent = await pool.query(
      'SELECT * FROM students WHERE roll_no = $1 AND id != $2',
      [roll_no, id]
    );
    
    if (existingStudent.rows.length > 0) {
      return res.status(400).json({ error: 'Roll number already exists' });
    }

    const result = await pool.query(
      'UPDATE students SET roll_no = $1, name = $2, class = $3, section = $4, contact = $5, email = $6, address = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *',
      [roll_no, name, studentClass, section, contact, email, address, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
