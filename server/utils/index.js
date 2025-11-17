import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const ACCESS_SECRET = process.env.ACCESS_SECRET;

export function signAccess(payload) {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
}

export function verifyAccess(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

export function newRandomToken() {
  return crypto.randomBytes(64).toString('hex');
}

export async function hash(str) {
  return await bcrypt.hash(str, 10);
}

export async function compare(raw, hashed) {
  return await bcrypt.compare(raw, hashed);
}

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendResetLink(toEmail, link) {
  await transporter.sendMail({
    from: '"KopaPath" <no-reply@yourapp.com>',
    to: toEmail,
    subject: 'Reset Your Secret',
    html: `
      <p>Hi,</p>
      <p>Click the link below to reset your secret:</p>
      <a href="${link}">${link}</a>
      <p>This link expires in 15 minutes.</p>
    `
  });
}