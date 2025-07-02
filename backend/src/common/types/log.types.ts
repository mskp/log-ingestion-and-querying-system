export type Log = {
  level: LogLevel;
  message: string;
  resourceId: string;
  timestamp: string;
  traceId: string;
  spanId: string;
  commit: string;
  metadata: Record<string, any>;
  _ingested_at?: string;
};

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export type LogFilters = {
  level?: LogLevel;
  message?: string;
  resourceId?: string;
  timestamp_start?: string;
  timestamp_end?: string;
  traceId?: string;
  spanId?: string;
  commit?: string;
};

export type Analytics = {
  levelCounts: Record<LogLevel, number>;
  hourlyData: Array<{ time: string; count: number }>;
  resourceCounts: Record<string, number>;
  totalLogs: number;
  timeRange: {
    earliest: string | null;
    latest: string | null;
  };
};

export type ConnectionStats = {
  connectedClients: number;
  yourId?: string;
};

export type SocketClient = {
  socket: any;
  filters: LogFilters;
  joinedAt: Date;
};
