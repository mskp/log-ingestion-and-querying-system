import type { NextFunction, Request, Response } from 'express';
import type { CreateLogDto } from '../../common/dto/create-log.dto';
import type { LogFiltersDto } from '../../common/dto/log-filters.dto';
import type { LogsService } from './logs.service';

export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createLogDto: CreateLogDto = req.body;
      const savedLog = await this.logsService.create(createLogDto);

      console.log(`✅ Log ingested: ${savedLog.level} - ${savedLog.message}`);
      res.status(201).json(savedLog);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: LogFiltersDto = req.query;
      const logs = await this.logsService.findWithFilters(filters || {});

      console.log(`📋 Retrieved ${logs.length} logs with filters:`, filters);
      res.json(logs);
    } catch (error) {
      next(error);
    }
  }
}
