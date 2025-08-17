const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const { body, validationResult } = require('express-validator');

// Get all subjects with teacher information
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, t.name as teacher_name 
      FROM subjects s 
      LEFT JOIN teachers t ON s.teacher_id = t.id 
      ORDER BY s.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get subject by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT s.*, t.name as teacher_name 
      FROM subjects s 
      LEFT JOIN teachers t ON s.teacher_id = t.id 
      WHERE s.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new subject
router.post('/', [
  body('code').notEmpty().withMessage('Subject code is required'),
  body('name').notEmpty().withMessage('Subject name is required'),
  body('class').notEmpty().withMessage('Class is required'),
  body('teacher_id').optional().isInt().withMessage('Teacher ID must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, name, teacher_id, class: subjectClass } = req.body;
    
    // Check if subject code already exists
    const existingSubject = await pool.query(
      'SELECT * FROM subjects WHERE code = $1',
      [code]
    );
    
    if (existingSubject.rows.length > 0) {
      return res.status(400).json({ error: 'Subject code already exists' });
    }

    // Check if teacher exists if teacher_id is provided
    if (teacher_id) {
      const teacherExists = await pool.query(
        'SELECT * FROM teachers WHERE id = $1',
        [teacher_id]
      );
      
      if (teacherExists.rows.length === 0) {
        return res.status(400).json({ error: 'Teacher not found' });
      }
    }

    const result = await pool.query(
      'INSERT INTO subjects (code, name, teacher_id, class) VALUES ($1, $2, $3, $4) RETURNING *',
      [code, name, teacher_id, subjectClass]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update subject
router.put('/:id', [
  body('code').notEmpty().withMessage('Subject code is required'),
  body('name').notEmpty().withMessage('Subject name is required'),
  body('class').notEmpty().withMessage('Class is required'),
  body('teacher_id').optional().isInt().withMessage('Teacher ID must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { code, name, teacher_id, class: subjectClass } = req.body;

    // Check if subject code already exists for other subjects
    const existingSubject = await pool.query(
      'SELECT * FROM subjects WHERE code = $1 AND id != $2',
      [code, id]
    );
    
    if (existingSubject.rows.length > 0) {
      return res.status(400).json({ error: 'Subject code already exists' });
    }

    // Check if teacher exists if teacher_id is provided
    if (teacher_id) {
      const teacherExists = await pool.query(
        'SELECT * FROM teachers WHERE id = $1',
        [teacher_id]
      );
      
      if (teacherExists.rows.length === 0) {
        return res.status(400).json({ error: 'Teacher not found' });
      }
    }

    const result = await pool.query(
      'UPDATE subjects SET code = $1, name = $2, teacher_id = $3, class = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [code, name, teacher_id, subjectClass, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete subject
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM subjects WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
