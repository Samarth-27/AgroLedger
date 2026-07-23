import { Request, Response, NextFunction } from 'express';
import { AppError } from '@utils/AppError';
import { logger } from '@utils/logger';
import { IApiResponse } from '@mandi-erp/shared';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let code = 'INTERNAL_ERROR';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = 'APP_ERROR';
  } else {
    logger.error('Unhandled Error:', err);
  }

  const response: IApiResponse<null> = {
    success: false,
    error: {
      code,
      message,
    }
  };

  res.status(statusCode).json(response);
};
