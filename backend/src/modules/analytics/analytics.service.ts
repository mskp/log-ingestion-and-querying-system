import type { IAnalytics, ILogFilters, LogLevel } from '../../common/types/log.types';
import type { LogsService } from '../../modules/logs/logs.service';
import { InternalServerErrorException } from '../../common/exceptions/http.exception';

export class AnalyticsService {
  constructor(private readonly logsService: LogsService) {}

  async getAnalytics(filters: ILogFilters): Promise<IAnalytics> {
    try {
      const logs = await this.logsService.findAll();
      const filteredLogs = this.logsService.applyFilters(logs, filters);

      // Count logs by level
      const levelCounts = filteredLogs.reduce(
        (acc, log) => {
          acc[log.level] = (acc[log.level] || 0) + 1;
          return acc;
        },
        {} as Record<LogLevel, number>
      );

      // Count logs by hour for the last 24 hours
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const recentLogs = filteredLogs.filter((log) => new Date(log.timestamp) >= last24Hours);

      const hourlyData: Record<string, number> = {};
      for (let i = 0; i < 24; i++) {
        const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hourKey = hour.toISOString().slice(0, 13) + ':00:00.000Z';
        hourlyData[hourKey] = 0;
      }

      recentLogs.forEach((log) => {
        const logHour = new Date(log.timestamp);
        logHour.setMinutes(0, 0, 0);
        const hourKey = logHour.toISOString();
        if (hourlyData.hasOwnProperty(hourKey)) {
          hourlyData[hourKey]++;
        }
      });

      // Get resource distribution
      const resourceCounts = filteredLogs.reduce(
        (acc, log) => {
          acc[log.resourceId] = (acc[log.resourceId] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      // Sort logs by timestamp to get time range
      const sortedLogs = filteredLogs.sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      return {
        levelCounts,
        hourlyData: Object.entries(hourlyData)
          .map(([time, count]) => ({ time, count }))
          .reverse(),
        resourceCounts,
        totalLogs: filteredLogs.length,
        timeRange: {
          earliest: sortedLogs.length > 0 ? sortedLogs[0].timestamp : null,
          latest: sortedLogs.length > 0 ? sortedLogs[sortedLogs.length - 1].timestamp : null,
        },
      };
    } catch (error) {
      console.error('❌ Error getting analytics:', error);
      throw new InternalServerErrorException('Failed to get analytics');
    }
  }
}
