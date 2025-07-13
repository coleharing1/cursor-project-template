import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').nullable().optional(),
  icon: z.string().max(50).nullable().optional(),
  header: z.string().max(50).nullable().optional(),
  parent_id: z.string().uuid().nullable().optional(),
})

export const updateCategorySchema = categorySchema.partial()

export type CreateCategoryInput = z.infer<typeof categorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>