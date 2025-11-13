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
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        principal NUMERIC(12,2) NOT NULL,
        interest_rate NUMERIC(5,2) NOT NULL,
        term INT NOT NULL,
        total_due NUMERIC(12,2) NOT NULL,
        status VARCHAR(20),
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        disbursed_at TIMESTAMPTZ,
        due_date TIMESTAMPTZ,
        closed_at TIMESTAMPTZ
      );
      CREATE TABLE IF NOT EXISTS repayments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        amount NUMERIC(12,2) NOT NULL,
        paid_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        msg TEXT,
        sent_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS offers (
        id SERIAL PRIMARY KEY,
        amount NUMERIC(12,0) NOT NULL,
        stock INT NOT NULL
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
