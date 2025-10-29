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

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    if (process.env.DB_SYNC === 'true') {
      // Optional sync when explicitly requested
      await sequelize.sync();
    }
    app.listen(PORT, () => {
      console.log(`Auth service listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
