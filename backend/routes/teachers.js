const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const { body, validationResult } = require('express-validator');

// Get all teachers
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM teachers ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get teacher by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM teachers WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new teacher
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('qualification').notEmpty().withMessage('Qualification is required'),
  body('experience').notEmpty().withMessage('Experience is required'),
  body('contact').notEmpty().withMessage('Contact is required'),
  body('email').optional().isEmail().withMessage('Invalid email format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, subject, qualification, experience, contact, email } = req.body;
    
    // Check if email already exists
    if (email) {
      const existingTeacher = await pool.query(
        'SELECT * FROM teachers WHERE email = $1',
        [email]
      );
      
      if (existingTeacher.rows.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    const result = await pool.query(
      'INSERT INTO teachers (name, subject, qualification, experience, contact, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, subject, qualification, experience, contact, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update teacher
router.put('/:id', [
  body('name').notEmpty().withMessage('Name is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('qualification').notEmpty().withMessage('Qualification is required'),
  body('experience').notEmpty().withMessage('Experience is required'),
  body('contact').notEmpty().withMessage('Contact is required'),
  body('email').optional().isEmail().withMessage('Invalid email format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, subject, qualification, experience, contact, email } = req.body;

    // Check if email already exists for other teachers
    if (email) {
      const existingTeacher = await pool.query(
        'SELECT * FROM teachers WHERE email = $1 AND id != $2',
        [email, id]
      );
      
      if (existingTeacher.rows.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    const result = await pool.query(
      'UPDATE teachers SET name = $1, subject = $2, qualification = $3, experience = $4, contact = $5, email = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [name, subject, qualification, experience, contact, email, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete teacher
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM teachers WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
