import { z } from 'zod';

export const LogFiltersSchema = z
  .object({
    level: z.enum(['error', 'warn', 'info', 'debug']).optional(),
    message: z.string().optional(),
    resourceId: z.string().optional(),
    timestamp_start: z.string().datetime().optional(),
    timestamp_end: z.string().datetime().optional(),
    traceId: z.string().optional(),
    spanId: z.string().optional(),
    commit: z.string().optional(),
  })
  .optional();

export type LogFiltersDto = z.infer<typeof LogFiltersSchema>;
