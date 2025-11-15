import express from 'express';
import { requireAuth } from '#middlewares/auth.js';
import { pool } from '#config/db.config.js';

const router = express.Router();

/*
// SEND
router.post('/', async (req, res, next) => {
  try {
    const { msg } = req.body;
    const r = await pool.query(
      `INSERT INTO messages (user_id,msg)
       VALUES ($1,$2)
       RETURNING *`,
      [user_id, msg]
    );
    res.json(r.rows[0]);
  } catch (e) { next(e); }
});
*/

// Messages list
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const r = await pool.query(
      `SELECT *
       FROM messages
       WHERE user_id=$1
       ORDER BY sent_at`,
      [req.user.id]
    );

    res.json(r.rows);
  } catch (e) { next(e); }
});

// ACK a message (client must confirm receipt)
router.patch('/:id/ack', async (req, res, next) => {
  try {
    const r = await pool.query(
      `UPDATE messages SET ack_at=NOW()
       WHERE id=$1
       RETURNING *`,
      [req.params.id]
    );
    res.json(r.rows[0]);
  } catch (e) { next(e); }
});

/*
// CLEAN ACKED (cron job or daily job)
router.delete('/clean/:uid', async (req, res, next) => {
  try {
    const r = await pool.query(
      `DELETE FROM messages
       WHERE user_id=$1 AND ack_at IS NOT NULL`,
      [req.params.uid]
    );
    res.json({ deleted: r.rowCount });
  } catch (e) { next(e); }
});
*/

export default router;
