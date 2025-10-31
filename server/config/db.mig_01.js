import { pool } from './db.config.js';

export async function migDb() {
  let client = null;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        mobile VARCHAR(20) NOT NULL UNIQUE,
        secret TEXT NOT NULL,
        refresh_token TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS loans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        amount NUMERIC(10, 2) NOT NULL,
        interest_rate NUMERIC(5, 2) NOT NULL,
        status VARCHAR(20) NOT NULL CHECK (status IN ('Pending', 'Approved', 'Disbursed', 'Paid', 'Defaulted', 'Rejected')),
        application_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        approval_date TIMESTAMPTZ,
        disbursal_date TIMESTAMPTZ,
        total_repaid NUMERIC(10, 2) DEFAULT 0.00
      );
      CREATE TABLE IF NOT EXISTS repayments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        loan_id UUID NOT NULL REFERENCES loans(id),
        due_date DATE NOT NULL,
        amount_due NUMERIC(10, 2) NOT NULL,
        status VARCHAR(20) NOT NULL CHECK (status IN ('Pending', 'Paid', 'Due', 'Overdue')),
        payment_date TIMESTAMPTZ
      );
      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        sort_order INT
      );
    `);
    await client.query('COMMIT');
    console.log('db migrations done');
  } catch (err) {
    if (client)
      await client.query('ROLLBACK');
    console.error(err);
  } finally {
    if (client)
      client.release();
  }
}
