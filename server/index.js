import express from 'express';
import path from 'path';

import { secureApp } from '#middlewares/security.js';
import { migDb } from '#config/db.mig_01.js';
import authRoutes from '#routes/auth.js';
import repayRoutes from '#routes/repayments.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
secureApp(app);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.use('/auth', authRoutes);
app.use('/repay', repayRoutes);

app.listen(process.env.PORT, () => {
  console.log('server started');
  migDb(); // db migrstions
});
