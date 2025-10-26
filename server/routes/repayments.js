import express from 'express';
import { pool } from '#config/db.config.js';
import { requireAuth } from '#middlewares/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(`
      SELECT
        l.id AS loan_id,
        l.amount AS loan_amount,
        l.interest_rate,
        l.status,
        l.application_date,
        l.approval_date,
        l.disbursal_date,
        COALESCE(SUM(r.amount_due) FILTER (WHERE r.status = 'Paid'), 0) AS total_repaid,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'repayment_id', r.id,
              'due_date', r.due_date,
              'amount_due', r.amount_due,
              'status', r.status,
              'payment_date', r.payment_date
            )
            ORDER BY r.due_date
          ) FILTER (WHERE r.id IS NOT NULL),
          '[]'
        ) AS repayments
      FROM loans l
      LEFT JOIN repayments r ON l.id = r.loan_id
      WHERE l.user_id = $1
      GROUP BY
        l.id, l.amount, l.interest_rate, l.status,
        l.application_date, l.approval_date, l.disbursal_date
      ORDER BY l.application_date DESC;`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Repayments error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Record repayment
router.post('/', requireAuth, async (req, res) => {
  try {
    const { loan_id, amount } = req.body;
    const userId = req.user.id;

    if (!loan_id || !amount)
      return res.status(400).json({ error: 'Missing fields' });

    const result = await pool.query(
      'INSERT INTO repayments (loan_id, user_id, amount, date) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [loan_id, userId, amount]
    );

    // Optionally update loan balance/status
    await pool.query(
      'UPDATE loans SET balance = balance - $1 WHERE id = $2 AND user_id = $3',
      [amount, loan_id, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Repayment error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;