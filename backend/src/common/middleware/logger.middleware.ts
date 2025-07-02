import type { Request, Response, NextFunction } from 'express';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, url, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    const logLevel = statusCode >= 400 ? '❌' : statusCode >= 300 ? '⚠️' : '✅';

    console.log(`${logLevel} ${method} ${url} - ${statusCode} - ${duration}ms - ${ip}`);
  });

  next();
};
