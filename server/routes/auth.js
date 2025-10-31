import express from 'express';
import { pool } from '#config/db.config.js';
import {
  signAccess,
  newRefreshToken,
  hash,
  compare
} from '#utils/session.js';
import { requireAuth } from '#middlewares/auth.js';

const router = express.Router();

function setRefreshCookie(res, token, userId) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    // sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
  res.cookie('uid', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    // sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
}

/* -------------------- SIGNUP -------------------- */
router.post('/signup', async (req, res) => {
  const { name, mobile, secret } = req.body;
  if (!name || !mobile || !secret || secret.length < 8)
    return res.status(400).json({ error: 'credentials unmatched' });

  try {
    // Check if user already exists
    const { rows: existing } = await pool.query(
      'SELECT id FROM users WHERE mobile=$1',
      [mobile]
    );
    if (existing.length > 0)
      return res.status(409).json({ error: 'User exists' });

    // Hash secret
    const hashedSecret = await hash(secret);

    // Create new user
    const result = await pool.query(
      `INSERT INTO users (name, mobile, secret)
       VALUES ($1, $2, $3)
       RETURNING id, name, mobile`,
      [name, mobile, hashedSecret]
    );
    const newUser = result.rows[0];

    // Generate tokens
    const accessToken = signAccess({ id: newUser.id, mobile: newUser.mobile });
    const refreshToken = newRefreshToken();
    const hashedRefresh = await hash(refreshToken);

    await pool.query('UPDATE users SET refresh_token=$1 WHERE id=$2', [
      hashedRefresh,
      newUser.id
    ]);

    setRefreshCookie(res, refreshToken, newUser.id);
    res.status(201).json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* -------------------- LOGIN -------------------- */
router.post('/login', async (req, res) => {
  const { mobile, secret } = req.body;
  if (!mobile || !secret)
    return res.status(400).json({ error: 'credentials unmatched' });

  try {
    const { rows } = await pool.query(
      'SELECT id, name, mobile, secret, refresh_token FROM users WHERE mobile=$1',
      [mobile]
    );
    const user = rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    const secretOk = await compare(secret, user.secret);
    if (!secretOk) return res.status(401).json({ error: 'credentials unmatched' });

    const accessToken = signAccess({ id: user.id, mobile: user.mobile });
    const refreshToken = newRefreshToken();
    const hashedRefresh = await hash(refreshToken);

    await pool.query('UPDATE users SET refresh_token=$1 WHERE id=$2', [
      hashedRefresh,
      user.id
    ]);

    setRefreshCookie(res, refreshToken, user.id);
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* -------------------- REFRESH -------------------- */
router.post('/refresh', async (req, res) => {
  const refreshToken = req.signedCookies.refreshToken;
  const userId = req.signedCookies.uid;
  if (!refreshToken || !userId)
    return res.status(401).json({ error: 'credentials unmatched' });

  try {
    const { rows } = await pool.query(
      'SELECT id, mobile, refresh_token FROM users WHERE id=$1',
      [userId]
    );
    const user = rows[0];
    if (!user || !user.refresh_token)
      return res.status(403).json({ error: 'credentials unmatched' });

    const match = await compare(refreshToken, user.refresh_token);
    if (!match) return res.status(403).json({ error: 'credentials unmatched' });

    // Rotate refresh token
    const newAccess = signAccess({ id: user.id, mobile: user.mobile });
    const newRefresh = newRefreshToken();
    const hashedNewRefresh = await hash(newRefresh);

    await pool.query('UPDATE users SET refresh_token=$1 WHERE id=$2', [
      hashedNewRefresh,
      user.id
    ]);

    setRefreshCookie(res, newRefresh, user.id);
    res.json({ accessToken: newAccess });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* -------------------- LOGOUT -------------------- */
router.post('/logout', requireAuth, async (req, res) => {
  try {
    await pool.query('UPDATE users SET refresh_token=NULL WHERE id=$1', [
      req.user.id
    ]);
    res.clearCookie('refreshToken');
    res.clearCookie('uid');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;