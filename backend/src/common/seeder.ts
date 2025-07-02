import { LogsService } from '@/modules/logs/logs.service';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface CreateLogDto {
  level: LogLevel;
  message: string;
  resourceId: string;
  timestamp: string;
  traceId: string;
  spanId: string;
  commit: string;
  metadata: Record<string, any>;
}

const levels: LogLevel[] = ['error', 'warn', 'info', 'debug'];
const resources = [
  'server-1234',
  'server-5678',
  'server-9012',
  'worker-3456',
  'api-gateway-001',
  'db-primary-002',
];
const messages = [
  'Database connection established successfully',
  'Failed to connect to external API',
  'User authentication completed',
  'Memory usage threshold exceeded',
  'Cache invalidation triggered',
  'Request processing completed',
  'Error parsing JSON payload',
  'Service health check passed',
  'Rate limit exceeded for user',
  'Background job completed successfully',
  'SSL certificate renewal required',
  'Disk space running low',
  'Network timeout occurred',
  'Configuration updated successfully',
  'Backup process initiated',
];

function generateRandomLog(): CreateLogDto {
  const now = new Date();
  const randomMinutes = Math.floor(Math.random() * 1440); // Random time in last 24 hours
  const timestamp = new Date(now.getTime() - randomMinutes * 60000);

  return {
    level: levels[Math.floor(Math.random() * levels.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    resourceId: resources[Math.floor(Math.random() * resources.length)],
    timestamp: timestamp.toISOString(),
    traceId: `trace-${Math.random().toString(36).substr(2, 9)}`,
    spanId: `span-${Math.random().toString(36).substr(2, 6)}`,
    commit: Math.random().toString(36).substr(2, 7),
    metadata: {
      userId: Math.floor(Math.random() * 1000),
      requestId: `req-${Math.random().toString(36).substr(2, 8)}`,
      duration: Math.floor(Math.random() * 1000),
      environment: Math.random() > 0.5 ? 'production' : 'staging',
      version: `v${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
    },
  };
}

async function generateLogs(count = 50): Promise<void> {
  console.log(`🚀 Generating ${count} sample logs...`);

  const logsService = new LogsService();

  for (let i = 0; i < count; i++) {
    try {
      const randomLog = generateRandomLog();
      await logsService.create(randomLog);
    } catch {}
  }
  console.log(`🎉 Sample log generation completed!`);
}

generateLogs();
