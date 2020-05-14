import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';

import AppError from './errors/AppError';
import routes from './routes';
import uploadConfig from './config/upload';
import './database';

const app = express();

app.use(cors());

app.use(express.json());
app.use(routes);

app.use('/files', express.static(uploadConfig.directory));

app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    console.error(error);

    return response
      .status(500)
      .json({ status: 'error', message: 'Internal server error.' });
  },
);

app.listen(3333);
