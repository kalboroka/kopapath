import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import compression from 'compression';

export function secureApp(app) {
  app.use(helmet());
  app.use(cors({
    /*origin: process.env.CLIENT_ORIGIN,*/
    credentials: true
  }));

  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
  }));

  app.use(cookieParser(process.env.COOKIE_SECRET));

  app.use(compression());
}