import { Router } from 'express';
import type { LogsController } from './logs.controller';
import { validateBody, validateQuery } from '../../common/middleware/validation.middleware';
import { CreateLogSchema } from '../../common/dto/create-log.dto';
import { LogFiltersSchema } from '../../common/dto/log-filters.dto';

export class LogsRoutes {
  public readonly router = Router();

  constructor(private readonly logsController: LogsController) {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // POST /logs - Ingest a single log entry
    this.router.post(
      '/',
      validateBody(CreateLogSchema),
      this.logsController.create.bind(this.logsController)
    );

    // GET /logs - Retrieve filtered logs
    this.router.get(
      '/',
      validateQuery(LogFiltersSchema),
      this.logsController.findAll.bind(this.logsController)
    );
  }
}
