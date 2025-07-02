import { Router } from 'express';
import type { AnalyticsController } from './analytics.controller';
import { validateQuery } from '../../common/middleware/validation.middleware';
import { LogFiltersSchema } from '../../common/dto/log-filters.dto';

export class AnalyticsRoutes {
  public readonly router = Router();

  constructor(private readonly analyticsController: AnalyticsController) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // GET /analytics - Get analytics data
    this.router.get(
      '/',
      validateQuery(LogFiltersSchema),
      this.analyticsController.getAnalytics.bind(this.analyticsController)
    );
  }
}
