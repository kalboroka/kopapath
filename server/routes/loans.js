// server/routes/loans.js
import express from 'express';
import { pool } from '#config/db.config.js';
import { requireAuth } from '#middlewares/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM loans WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get loans error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { amount, term } = req.body;
    const userId = req.user.id;

    if (!amount || !term) return res.status(400).json({ error: 'Missing fields' });

    const result = await pool.query(
      'INSERT INTO loans (user_id, amount, term, status, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [userId, amount, term, 'pending']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create loan error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get loan by ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT * FROM loans WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (!result.rows.length) return res.status(404).json({ error: 'Loan not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Loan detail error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;