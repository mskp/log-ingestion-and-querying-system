export interface Log {
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  resourceId: string;
  timestamp: string;
  traceId: string;
  spanId: string;
  commit: string;
  metadata: Record<string, any>;
}

export interface FilterParams {
  level?: string;
  message?: string;
  resourceId?: string;
  timestamp_start?: string;
  timestamp_end?: string;
  traceId?: string;
  spanId?: string;
  commit?: string;
}

export interface AnalyticsData {
  levelCounts: Record<string, number>;
  hourlyData: Array<{ time: string; count: number }>;
  resourceCounts: Record<string, number>;
  totalLogs: number;
  timeRange: {
    earliest: string | null;
    latest: string | null;
  };
}

export interface ConnectionStats {
  connectedClients: number;
  yourId?: string;
}

export interface SocketClient {
  socket: any;
  filters: FilterParams;
  joinedAt: Date;
}

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
