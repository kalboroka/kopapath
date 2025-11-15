import express from 'express';
// import path from 'path';

import { secureApp } from '#middlewares/security.js';
import { migDb } from '#config/db.mig_01.js';
import authRoutes from '#routes/auth.js';
import loanRoutes from '#routes/loans.js';
import msgRoutes from '#routes/messages.js';
// import repayRoutes from '#routes/repayments.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
secureApp(app);


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/loans', loanRoutes);
app.use('/api/v1/messages', msgRoutes);
// app.use('/api/repay', repayRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
})
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(process.env.PORT, () => {
  console.log('server started');
  migDb(); // db migrstions
});
