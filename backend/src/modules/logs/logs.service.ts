import { promises as fs } from 'fs';
import { join } from 'path';
import type { Log, LogFilters } from '../../common/types/log.types';
import type { CreateLogDto } from '../../common/dto/create-log.dto';
import { InternalServerErrorException } from '../../common/exceptions/http.exception';

export class LogsService {
  private readonly logsFilePath = join(process.cwd(), 'logs.json');

  async onModuleInit(): Promise<void> {
    await this.initializeLogsFile();
  }

  private async initializeLogsFile(): Promise<void> {
    try {
      await fs.access(this.logsFilePath);
      console.log('📁 Logs file found');
    } catch (error) {
      await fs.writeFile(this.logsFilePath, JSON.stringify([], null, 2));
      console.log('📁 Created new logs file');
    }
  }

  async findAll(): Promise<Log[]> {
    try {
      const data = await fs.readFile(this.logsFilePath, 'utf8');
      return JSON.parse(data || '[]');
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(this.logsFilePath, JSON.stringify([], null, 2));
        return [];
      }

      // Log JSON parse errors or other unexpected issues
      console.error('Error reading logs file:', error);
      return [];
    }
  }

  async create(createLogDto: CreateLogDto): Promise<Log> {
    try {
      const logs = await this.findAll();

      const newLog: Log = {
        ...createLogDto,
        _ingested_at: new Date().toISOString(),
      };

      logs.push(newLog);
      await this.persistLogs(logs);

      return newLog;
    } catch (error) {
      console.error('❌ Error creating log:', error);
      throw new InternalServerErrorException('Failed to create log');
    }
  }

  async findWithFilters(filters: LogFilters): Promise<Log[]> {
    try {
      const logs = await this.findAll();
      const filteredLogs = this.applyFilters(logs, filters);

      // Sort by timestamp in reverse chronological order
      return filteredLogs.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error('❌ Error filtering logs:', error);
      throw new InternalServerErrorException('Failed to filter logs');
    }
  }

  private async persistLogs(logs: Log[]): Promise<void> {
    try {
      await fs.writeFile(this.logsFilePath, JSON.stringify(logs, null, 2));
    } catch (error) {
      console.error('❌ Error writing logs:', error);
      throw new InternalServerErrorException('Failed to persist logs');
    }
  }

  applyFilters(logs: Log[], filters: LogFilters): Log[] {
    return logs.filter((log) => {
      // Level filter
      if (filters.level && log.level !== filters.level) {
        return false;
      }

      // Message search (case-insensitive)
      if (filters.message && !log.message.toLowerCase().includes(filters.message.toLowerCase())) {
        return false;
      }

      // ResourceId filter
      if (filters.resourceId && log.resourceId !== filters.resourceId) {
        return false;
      }

      // Timestamp range filter
      if (filters.timestamp_start) {
        const logTime = new Date(log.timestamp);
        const startTime = new Date(filters.timestamp_start);
        if (logTime < startTime) {
          return false;
        }
      }

      if (filters.timestamp_end) {
        const logTime = new Date(log.timestamp);
        const endTime = new Date(filters.timestamp_end);
        if (logTime > endTime) {
          return false;
        }
      }

      // TraceId filter
      if (filters.traceId && log.traceId !== filters.traceId) {
        return false;
      }

      // SpanId filter
      if (filters.spanId && log.spanId !== filters.spanId) {
        return false;
      }

      // Commit filter
      if (filters.commit && log.commit !== filters.commit) {
        return false;
      }

      return true;
    });
  }
}
