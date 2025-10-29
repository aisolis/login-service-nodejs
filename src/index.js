import 'dotenv/config';
import express from 'express';

const app = express();

// Middlewares
app.use(express.json());

// Healthcheck (no DB required)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Routes (lazy-load to avoid DB/dialect loading at cold start)
app.use('/', async (req, res, next) => {
  try {
    const { default: authRouter } = await import('./routes/auth.js');
    return authRouter(req, res, next);
  } catch (err) {
    console.error('Failed to load router:', err);
    return res.status(500).json({ error: 'Router load failure' });
  }
});

// 🚫 No usar app.listen aquí (Vercel maneja el servidor)
export default app;
