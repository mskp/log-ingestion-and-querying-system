import cors from 'cors';
import express, { type Application } from 'express';
import { Server } from 'http';
import { errorHandler } from './common/middleware/error-handler.middleware';
import { loggerMiddleware } from './common/middleware/logger.middleware';
import { AnalyticsController } from './modules/analytics/analytics.controller';
import { AnalyticsRoutes } from './modules/analytics/analytics.routes';
import { AnalyticsService } from './modules/analytics/analytics.service';
import { LogsController } from './modules/logs/logs.controller';
import { LogsRoutes } from './modules/logs/logs.routes';
import { LogsService } from './modules/logs/logs.service';

export class App {
  public app: Application;
  public server: Server;
  private readonly port: number;

  // Services
  private readonly logsService: LogsService;
  private readonly analyticsService: AnalyticsService;

  // Controllers
  private readonly logsController: LogsController;
  private readonly analyticsController: AnalyticsController;

  // Routes
  private readonly logsRoutes: LogsRoutes;
  private readonly analyticsRoutes: AnalyticsRoutes;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.server = new Server(this.app);

    // Initialize services
    this.logsService = new LogsService();
    this.analyticsService = new AnalyticsService(this.logsService);

    // Initialize controllers
    this.logsController = new LogsController(this.logsService);
    this.analyticsController = new AnalyticsController(this.analyticsService);

    // Initialize routes
    this.logsRoutes = new LogsRoutes(this.logsController);
    this.analyticsRoutes = new AnalyticsRoutes(this.analyticsController);

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(loggerMiddleware);
  }

  private initializeRoutes(): void {
    this.app.use('/logs', this.logsRoutes.router);
    this.app.use('/analytics', this.analyticsRoutes.router);
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async listen() {
    try {
      await this.logsService.onModuleInit();

      this.server.listen(this.port, () => {
        console.log(`🚀 Server running on port ${this.port}`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }
}
