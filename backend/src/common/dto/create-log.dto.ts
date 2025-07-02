import { z } from 'zod';

export const CreateLogSchema = z.object({
  level: z.enum(['error', 'warn', 'info', 'debug'], {
    required_error: 'Level is required',
    invalid_type_error: 'Level must be one of: error, warn, info, debug',
  }),
  message: z
    .string({
      required_error: 'Message is required',
      invalid_type_error: 'Message must be a string',
    })
    .min(1, 'Message cannot be empty'),
  resourceId: z
    .string({
      required_error: 'ResourceId is required',
      invalid_type_error: 'ResourceId must be a string',
    })
    .min(1, 'ResourceId cannot be empty'),
  timestamp: z
    .string({
      required_error: 'Timestamp is required',
      invalid_type_error: 'Timestamp must be a string',
    })
    .datetime('Timestamp must be in ISO 8601 format'),
  traceId: z
    .string({
      required_error: 'TraceId is required',
      invalid_type_error: 'TraceId must be a string',
    })
    .min(1, 'TraceId cannot be empty'),
  spanId: z
    .string({
      required_error: 'SpanId is required',
      invalid_type_error: 'SpanId must be a string',
    })
    .min(1, 'SpanId cannot be empty'),
  commit: z
    .string({
      required_error: 'Commit is required',
      invalid_type_error: 'Commit must be a string',
    })
    .min(1, 'Commit cannot be empty'),
  metadata: z.record(z.any(), {
    required_error: 'Metadata is required',
    invalid_type_error: 'Metadata must be an object',
  }),
});

export type CreateLogDto = z.infer<typeof CreateLogSchema>;
