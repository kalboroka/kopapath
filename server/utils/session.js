import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export function signAccess(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
}

export function verifyAccess(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function newRefreshToken() {
  return crypto.randomBytes(64).toString('hex');
}

export async function hash(str) {
  return await bcrypt.hash(str, 10);
}

export async function compare(raw, hashed) {
  return await bcrypt.compare(raw, hashed);
}