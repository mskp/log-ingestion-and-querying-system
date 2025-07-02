import type { Request, Response, NextFunction } from 'express';
import { HttpException, ValidationException } from '../exceptions/http.exception';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error:', err);

  // Handle custom HTTP exceptions
  if (err instanceof HttpException) {
    const response: any = {
      error: err.message,
      timestamp: new Date().toISOString(),
      path: req.path,
    };

    // Add validation details if it's a validation exception
    if (err instanceof ValidationException && err.details) {
      response.details = err.details;
    }

    res.status(err.status).json(response);
    return;
  }

  // Handle specific error types
  if (err.name === 'SyntaxError') {
    res.status(400).json({
      error: 'Invalid JSON syntax',
      timestamp: new Date().toISOString(),
      path: req.path,
    });
    return;
  }

  // Handle file system errors
  if ((err as any).code === 'ENOENT') {
    res.status(500).json({
      error: 'File system error',
      timestamp: new Date().toISOString(),
      path: req.path,
    });
    return;
  }

  // Default error response
  res.status(500).json({
    error: 'Internal Server Error',
    timestamp: new Date().toISOString(),
    path: req.path,
  });
};
