import { verifyAccess } from '#utils/session.js';

export function requireAuth(req, res, next) {
  const errMsg = 'credentials unmatched';
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: errMsg });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: errMsg });

  try {
    const decoded = verifyAccess(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: errMsg });
  }
}
