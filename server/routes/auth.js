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

function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    /*sameSite: 'strict',*/
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
}

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ error: 'Missing required fields' });

  try {
    const { rows: existing } = await pool.query(
      'SELECT id FROM users WHERE username=$1 OR email=$2',
      [username, email]
    );
    if (existing.length > 0)
      return res.status(409).json({ error: 'User already exists' });

    if (password.length < 8)
      return res.status(400).json({ error: 'Password too short (min 8 chars)' });

    const hashedPass = await hash(password);

    const result = await pool.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username`,
      [username, email, hashedPass]
    );
    const newUser = result.rows[0];

    const accessToken = signAccess({ id: newUser.id, username: newUser.username });
    const refreshToken = newRefreshToken();
    const hashedRefresh = await hash(refreshToken);
    await pool.query('UPDATE users SET refresh_token=$1 WHERE id=$2', [hashedRefresh, newUser.id]);

    setRefreshCookie(res, refreshToken);
    res.status(201).json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  console.log('body:', req.body);
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Missing credentials' });

  try {
    const { rows } = await pool.query(
      'SELECT id, username, password, refresh_token FROM users WHERE username=$1',
      [username]
    );
    const user = rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    const passwordOk = await compare(password, user.password);
    if (!passwordOk) return res.status(401).json({ error: 'Invalid credentials' });

    const accessToken = signAccess({ id: user.id, username: user.username });
    const refreshToken = newRefreshToken();

    const hashedRefresh = await hash(refreshToken);
    await pool.query('UPDATE users SET refresh_token=$1 WHERE id=$2', [hashedRefresh, user.id]);

    setRefreshCookie(res, refreshToken);
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/refresh', async (req, res) => {
  const refreshToken = req.signedCookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

  try {
    const { rows } = await pool.query('SELECT id, username, refresh_token FROM users');
    let user = null;
    for (const u of rows) {
      if (u.refresh_token && await compare(refreshToken, u.refresh_token)) {
        user = u;
        break;
      }
    }

    if (!user) return res.status(403).json({ error: 'Invalid refresh token' });

    // Rotate refresh token
    const newAccess = signAccess({ id: user.id, username: user.username });
    const newRefresh = newRefreshToken();

    const hashedNewRefresh = await hash(newRefresh);
    await pool.query('UPDATE users SET refresh_token=$1 WHERE id=$2', [hashedNewRefresh, user.id]);

    setRefreshCookie(res, newRefresh);
    res.json({ accessToken: newAccess });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/logout', requireAuth, async (req, res) => {
  try {
    await pool.query('UPDATE users SET refresh_token=NULL WHERE id=$1', [req.user.id]);
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;