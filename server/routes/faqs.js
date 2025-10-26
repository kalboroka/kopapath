// server/routes/faq.js
import express from 'express';
import { pool } from '#config/db.config.js';

const router = express.Router();

// Get FAQs (public route)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT question, answer FROM faq ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('FAQ fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;