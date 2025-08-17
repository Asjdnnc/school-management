const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const { body, validationResult } = require('express-validator');

// Get all assignments with subject and teacher information
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, s.name as subject_name, t.name as teacher_name 
      FROM assignments a 
      LEFT JOIN subjects s ON a.subject_id = s.id 
      LEFT JOIN teachers t ON a.created_by = t.id 
      ORDER BY a.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get assignment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT a.*, s.name as subject_name, t.name as teacher_name 
      FROM assignments a 
      LEFT JOIN subjects s ON a.subject_id = s.id 
      LEFT JOIN teachers t ON a.created_by = t.id 
      WHERE a.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new assignment
router.post('/', [
  body('subject_id').isInt().withMessage('Subject ID must be a number'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('due_date').isDate().withMessage('Due date must be a valid date'),
  body('status').optional().isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid status'),
  body('created_by').optional().isInt().withMessage('Created by must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { subject_id, title, description, due_date, status, created_by } = req.body;

    // Check if subject exists
    const subjectExists = await pool.query(
      'SELECT * FROM subjects WHERE id = $1',
      [subject_id]
    );
    
    if (subjectExists.rows.length === 0) {
      return res.status(400).json({ error: 'Subject not found' });
    }

    // Check if teacher exists if created_by is provided
    if (created_by) {
      const teacherExists = await pool.query(
        'SELECT * FROM teachers WHERE id = $1',
        [created_by]
      );
      
      if (teacherExists.rows.length === 0) {
        return res.status(400).json({ error: 'Teacher not found' });
      }
    }

    const result = await pool.query(
      'INSERT INTO assignments (subject_id, title, description, due_date, status, created_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [subject_id, title, description, due_date, status || 'Pending', created_by]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update assignment
router.put('/:id', [
  body('subject_id').isInt().withMessage('Subject ID must be a number'),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('due_date').isDate().withMessage('Due date must be a valid date'),
  body('status').optional().isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid status'),
  body('created_by').optional().isInt().withMessage('Created by must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { subject_id, title, description, due_date, status, created_by } = req.body;

    // Check if subject exists
    const subjectExists = await pool.query(
      'SELECT * FROM subjects WHERE id = $1',
      [subject_id]
    );
    
    if (subjectExists.rows.length === 0) {
      return res.status(400).json({ error: 'Subject not found' });
    }

    // Check if teacher exists if created_by is provided
    if (created_by) {
      const teacherExists = await pool.query(
        'SELECT * FROM teachers WHERE id = $1',
        [created_by]
      );
      
      if (teacherExists.rows.length === 0) {
        return res.status(400).json({ error: 'Teacher not found' });
      }
    }

    const result = await pool.query(
      'UPDATE assignments SET subject_id = $1, title = $2, description = $3, due_date = $4, status = $5, created_by = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [subject_id, title, description, due_date, status, created_by, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete assignment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM assignments WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
