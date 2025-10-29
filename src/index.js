import 'dotenv/config';
import express from 'express';
import { sequelize } from './models/index.js';
import authRouter from './routes/auth.js';

const app = express();

// CORS middleware
const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || 'http://localhost:3001')
  .split(',')
  .map((s) => s.trim());

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  const reqHeaders = req.header('Access-Control-Request-Headers');
  res.header(
    'Access-Control-Allow-Headers',
    reqHeaders || 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
    // Preflight request
    return res.sendStatus(204);
  }
  next();
});

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
