import 'dotenv/config';
import express from 'express';
import { sequelize } from './models/index.js';
import authRouter from './routes/auth.js';

const app = express();

// Middlewares
app.use(express.json());

// Healthcheck
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/', authRouter);

(async () => {
  try {
    await sequelize.authenticate();
    if (process.env.DB_SYNC === 'true') {
      await sequelize.sync();
    }
    console.log('Database initialized');
  } catch (err) {
    console.error('Database init error (continuing):', err);
  }
})();


export default app;
