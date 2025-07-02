import type { Request, Response, NextFunction } from 'express';
import type { AnalyticsService } from './analytics.service';
import type { LogFiltersDto } from '../../common/dto/log-filters.dto';

export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  async getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: LogFiltersDto = req.query;
      const analytics = await this.analyticsService.getAnalytics(filters || {});

      console.log('📊 Analytics requested with filters:', filters);
      res.json(analytics);
    } catch (error) {
      next(error);
    }
  }
}
