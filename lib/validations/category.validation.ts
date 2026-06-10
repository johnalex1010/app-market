import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener mínimo 2 caracteres.')
    .max(80, 'El nombre no debe superar 80 caracteres.'),
  icon: z
    .string()
    .trim()
    .max(24, 'El ícono no debe superar 24 caracteres.')
    .optional()
    .nullable(),
  color: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{6})$/, 'Usa un color hexadecimal válido.')
    .optional()
    .nullable()
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
