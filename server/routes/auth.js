import express from 'express';
import { pool } from '#config/db.config.js';
import {
  signAccess, newRandomToken, hash, compare, sendResetLink
} from '#utils/index.js';
import { requireAuth } from '#middlewares/auth.js';

const router = express.Router();

/* -------------------- HELPERS -------------------- */
const badReq = (res, msg = 'credentials unmatched') =>
  res.status(400).json({ error: msg });

const setRefreshCookie = (res, token, uid) => {
  const opts = {
    httpOnly: true,
    secure: false,
    signed: true,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000
  };
  res.cookie('refreshToken', token, opts);
  res.cookie('uid', uid, opts);
};

async function getUserById(id) {
  const { rows } = await pool.query(
    'SELECT * FROM users WHERE mobile=$1 OR email=$1 LIMIT 1',
    [id]
  );
  return rows[0];
}

async function rotateRefresh(userId) {
  const refresh = newRandomToken();
  const hashed = await hash(refresh);
  await pool.query(
    'UPDATE users SET refresh_token=$1 WHERE id=$2',
    [hashed, userId]
  );
  return refresh;
}

/* -------------------- SIGNUP -------------------- */
router.post('/signup', async (req, res, next) => {
  const { name, mobile, email, secret } = req.body;
  if (!name || !mobile || !email || !secret) return badReq(res);

  try {
    const { rows: exists } = await pool.query(
      'SELECT id FROM users WHERE mobile=$1 OR email=$2',
      [mobile, email]
    );
    if (exists.length) return res.status(409).json({ error: 'User exists' });

    const hashedSecret = await hash(secret);
    const { rows } = await pool.query(
      `INSERT INTO users (name, mobile, email, secret)
       VALUES ($1,$2,$3,$4)
       RETURNING id, mobile, email`,
      [name, mobile, email, hashedSecret]
    );

    const user = rows[0];
    const refresh = await rotateRefresh(user.id);
    setRefreshCookie(res, refresh, user.id);

    res.status(201).json({
      accessToken: signAccess({ id: user.id, mobile, email })
    });
  } catch (err) { next(err); }
});

/* -------------------- LOGIN -------------------- */
router.post('/login', async (req, res, next) => {
  const { userid, secret } = req.body;
  if (!userid || !secret) return badReq(res);

  try {
    const user = await getUserById(userid);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const ok = await compare(secret, user.secret);
    if (!ok) return res.status(401).json({ error: 'credentials unmatched' });

    const refresh = await rotateRefresh(user.id);
    setRefreshCookie(res, refresh, user.id);

    res.json({
      accessToken: signAccess({ id: user.id, mobile: user.mobile, email: user.email }),
      user: { name: user.name, mobile: user.mobile, email: user.email }
    });
  } catch (err) { next(err); }
});

/* -------------------- REFRESH -------------------- */
router.post('/refresh', async (req, res, next) => {
  const refresh = req.signedCookies.refreshToken;
  const uid = req.signedCookies.uid;
  if (!refresh || !uid) return res.status(401).json({ error: 'credentials unmatched' });

  try {
    const { rows } = await pool.query(
      'SELECT id, mobile, email, refresh_token FROM users WHERE id=$1',
      [uid]
    );
    const user = rows[0];
    if (!user) return res.status(403).json({ error: 'credentials unmatched' });

    const match = await compare(refresh, user.refresh_token);
    if (!match) return res.status(403).json({ error: 'credentials unmatched' });

    const newRefresh = await rotateRefresh(user.id);
    setRefreshCookie(res, newRefresh, user.id);

    res.json({
      accessToken: signAccess({ id: user.id, mobile: user.mobile, email: user.email })
    });
  } catch (err) { next(err); }
});

/* -------------------- LOGOUT -------------------- */
router.post('/logout', requireAuth, async (req, res, next) => {
  try {
    await pool.query('UPDATE users SET refresh_token=NULL WHERE id=$1', [req.user.id]);
    res.clearCookie('refreshToken');
    res.clearCookie('uid');
    res.json({ message: 'Logged out successfully' });
  } catch (err) { next(err); }
});

/* -------------------- RESET REQUEST -------------------- */
router.post('/reset', async (req, res, next) => {
  console.log('reset: ', req.body)
  const { userid } = req.body;
  if (!userid) return badReq(res, 'userid required');

  try {
    const user = await getUserById(userid);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = newRandomToken();
    await pool.query(
      `UPDATE users SET reset_token=$1,
                       reset_expires=NOW() + INTERVAL '15 minutes'
       WHERE id=$2`,
      [token, user.id]
    );

    await sendResetLink(user.email, `http://localhost:4000/auth/reset?token=${token}`);
    res.json({ message: 'Reset link sent to your email' });
  } catch (err) { next(err); }
});

/* -------------------- CONFIRM RESET -------------------- */
router.post('/confirm', async (req, res, next) => {
  console.log('confirm:', req.body)
  const { token, secret } = req.body;
  if (!token || !secret) return badReq(res);

  try {
    const { rows } = await pool.query(
      `SELECT id FROM users
       WHERE reset_token=$1 AND reset_expires > NOW() LIMIT 1`,
      [token]
    );
    if (!rows.length) return res.status(400).json({ error: 'Invalid or expired token' });

    const hashed = await hash(secret);

    await pool.query(
      `UPDATE users SET secret=$1,
                        reset_token=NULL,
                        reset_expires=NULL
       WHERE id=$2`,
      [hashed, rows[0].id]
    );

    res.json({ message: 'Secret updated successfully' });
  } catch (err) { next(err); }
});

export default router;
