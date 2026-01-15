import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(helmet());
app.use(morgan('dev'));
// Allow CORS from client and ensure Authorization header is accepted
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'EthioCamps Backend API - Running!' });
});

app.use(notFound);
app.use(errorHandler);

export default app;