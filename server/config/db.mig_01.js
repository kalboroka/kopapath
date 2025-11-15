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
        email VARCHAR(150) NOT NULL UNIQUE,
        secret TEXT NOT NULL,
        refresh_token TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS loans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount NUMERIC(12,2) NOT NULL,
        rate NUMERIC(5,2) NOT NULL,
        term SMALLINT NOT NULL,
        total_due NUMERIC(12,2) NOT NULL,
        status VARCHAR(10) NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','active','done')),
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        disbursed_at TIMESTAMPTZ,
        due_date TIMESTAMPTZ NOT NULL,
        closed_at TIMESTAMPTZ
      );
      
      CREATE TABLE IF NOT EXISTS repayments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        loan_id UUID NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount NUMERIC(12,2) NOT NULL,
        paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        msg TEXT NOT NULL,
        sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        ack_at TIMESTAMPTZ
      );
      
      CREATE TABLE IF NOT EXISTS bucket (
        id SMALLINT PRIMARY KEY DEFAULT 1,
        amount NUMERIC(12,2) NOT NULL
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
