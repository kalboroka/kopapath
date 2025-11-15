// server/routes/loans.js
import express from 'express';
import { pool } from '#config/db.config.js';
import { requireAuth } from '#middlewares/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT id, amount, term, total_due, status FROM loans WHERE user_id = $1 ORDER BY applied_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get loans error:', err);
    next(err)
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { amount, term, rate, total_due } = req.body;
    const userId = req.user.id;

    if (!amount || !term || !rate || !total_due ) return res.status(400).json({ error: 'Missing fields' });

    const result = await pool.query(
      'INSERT INTO loans (user_id, amount, term, rate, total_due, due_date) VALUES ($1, $2, $3, $4, $5, NOW() + make_interval(days => $6)) RETURNING *',
      [userId, amount, term, rate, total_due, term]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err)
  }
});

// Loan bucket
router.get('/bucket', requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT amount FROM bucket'
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err)
  }
});

// Loan pending
router.get('/pending', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id FROM loans WHERE user_id = $1 AND status = $2 LIMIT 1',
      [req.user.id, 'pending']
    );
    res.json({ exist: result.rows.length > 0 });
  } catch (err) {
    next(err)
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
    next(err)
  }
});

export default router;