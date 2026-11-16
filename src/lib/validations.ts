import { z } from 'zod';

export const habitSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500, "Description is too long").optional().nullable(),
  category: z.string().max(50, "Category is too long").optional().nullable(),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid hex color").optional().default('#ffffff'),
  goalType: z.enum(['binary', 'duration', 'quantity']),
  goalTarget: z.number().positive().max(1000000).optional().nullable(),
  unit: z.string().max(20).optional().nullable(),
  active: z.boolean().optional().default(true),
});

export const habitUpdateSchema = habitSchema.partial();

export const entrySchema = z.object({
  habitId: z.string().uuid("Invalid habit ID"),
  entryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  completed: z.boolean().default(false),
  value: z.number().max(1000000).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  mood: z.number().min(1).max(5).optional().nullable(),
  energy: z.number().min(1).max(5).optional().nullable(),
  duration: z.number().positive().max(86400).optional().nullable(),
});

export const entryUpdateSchema = z.object({
  completed: z.boolean().optional(),
  value: z.number().max(1000000).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  mood: z.number().min(1).max(5).optional().nullable(),
  energy: z.number().min(1).max(5).optional().nullable(),
  duration: z.number().positive().max(86400).optional().nullable(),
});

export const focusSessionSchema = z.object({
  habitId: z.string().uuid("Invalid habit ID").optional().nullable(),
  duration: z.number().positive().max(86400),
  notes: z.string().max(1000).optional().nullable(),
  completedAt: z.string().datetime().optional(),
});

export const badgeSchema = z.object({
  name: z.string().min(1).max(100),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export const challengeParticipantSchema = z.object({
  challengeId: z.string().min(1).max(100),
});
