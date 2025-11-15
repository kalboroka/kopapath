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
    secure: false,
    signed: true,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
  res.cookie('uid', userId, {
    httpOnly: true,
    secure: false,
    signed: true,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
}

/* -------------------- SIGNUP -------------------- */
router.post('/signup', async (req, res, next) => {
  const { name, mobile, email, secret } = req.body;
  if (!name || !mobile || !email || !secret )
    return res.status(400).json({ error: 'credentials unmatched' });

  try {
    // Check if user already exists
    const { rows: existing } = await pool.query(
      'SELECT id FROM users WHERE mobile=$1 OR email=$2',
      [mobile, email]
    );
    if (existing.length > 0)
      return res.status(409).json({ error: 'User exists' });

    // Hash secret
    const hashedSecret = await hash(secret);

    // Create new user
    const result = await pool.query(
      `INSERT INTO users (name, mobile, email, secret)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, mobile, email`,
      [name, mobile, email, hashedSecret]
    );
    const newUser = result.rows[0];

    // Generate tokens
    const accessToken = signAccess({ id: newUser.id, mobile: newUser.mobile, email: newUser.email });
    const refreshToken = newRefreshToken();
    const hashedRefresh = await hash(refreshToken);

    await pool.query('UPDATE users SET refresh_token=$1 WHERE id=$2', [
      hashedRefresh,
      newUser.id
    ]);

    setRefreshCookie(res, refreshToken, newUser.id);
    res.status(201).json({ accessToken });
  } catch (err) {
    next(err)
  }
});

/* -------------------- LOGIN -------------------- */
router.post('/login', async (req, res, next) => {
  const { mobile, secret } = req.body;
  if (!mobile || !secret)
    return res.status(400).json({ error: 'credentials unmatched' });

  try {
    const { rows } = await pool.query(
      'SELECT id, name, mobile, email, secret, refresh_token FROM users WHERE mobile=$1',
      [mobile]
    );
    const user = rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    const secretOk = await compare(secret, user.secret);
    if (!secretOk) return res.status(401).json({ error: 'credentials unmatched' });

    const accessToken = signAccess({ id: user.id, mobile: user.mobile, email: user.email });
    const refreshToken = newRefreshToken();
    const hashedRefresh = await hash(refreshToken);

    await pool.query('UPDATE users SET refresh_token=$1 WHERE id=$2', [
      hashedRefresh,
      user.id
    ]);

    setRefreshCookie(res, refreshToken, user.id);
    res.json({ accessToken, user: { name: user.name, mobile: user.mobile } });
  } catch (err) {
    next(err)
  }
});

/* -------------------- REFRESH -------------------- */
router.post('/refresh', async (req, res, next) => {
  const refreshToken = req.signedCookies.refreshToken;
  const userId = req.signedCookies.uid;
  if (!refreshToken || !userId)
    return res.status(401).json({ error: `credentials unmatched. ${refreshToken}:${userId}` });

  try {
    const { rows } = await pool.query(
      'SELECT id, mobile, email, refresh_token FROM users WHERE id=$1',
      [userId]
    );
    const user = rows[0];
    if (!user || !user.refresh_token)
      return res.status(403).json({ error: 'credentials unmatched' });

    const match = await compare(refreshToken, user.refresh_token);
    if (!match) return res.status(403).json({ error: 'credentials unmatched' });

    // Rotate refresh token
    const newAccess = signAccess({ id: user.id, mobile: user.mobile, email: user.email });
    const newRefresh = newRefreshToken();
    const hashedNewRefresh = await hash(newRefresh);

    await pool.query('UPDATE users SET refresh_token=$1 WHERE id=$2', [
      hashedNewRefresh,
      user.id
    ]);

    setRefreshCookie(res, newRefresh, user.id);
    res.json({ accessToken: newAccess });
  } catch (err) {
    next(err)
  }
});

/* -------------------- LOGOUT -------------------- */
router.post('/logout', requireAuth, async (req, res, next) => {
  try {
    await pool.query('UPDATE users SET refresh_token=NULL WHERE id=$1', [
      req.user.id
    ]);
    res.clearCookie('refreshToken');
    res.clearCookie('uid');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err)
  }
});

export default router;