import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import aiRoutes from './src/routes/ai.routes.js';
import ocrRoutes from './src/routes/ocr.routes.js';
import { errorHandler } from './src/middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// Configure a more generous rate limit for development 
const limiter = rateLimit({
  windowMs: 60_000, // 1 minute
  max: 60,          // limit each IP to 60 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/ai', limiter);

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/ocr', ocrRoutes);
app.use('/api/ai', aiRoutes);

app.use(errorHandler);

export default app;

