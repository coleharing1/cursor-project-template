import { z } from 'zod'

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().nullable().optional(),
  duration: z.number().int().positive().nullable().optional(),
  due_date: z.string().datetime().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  parent_id: z.string().uuid().nullable().optional(),
  category_id: z.string().uuid().nullable().optional(),
  is_focused: z.boolean().default(false),
  position: z.number().int().nullable().optional(),
})

export const updateTaskSchema = taskSchema.partial().extend({
  completed_at: z.string().datetime().nullable().optional(),
  order: z.number().int().nullable().optional(),
})

export type CreateTaskInput = z.infer<typeof taskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>