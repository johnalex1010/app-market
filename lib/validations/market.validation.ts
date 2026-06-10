import { z } from 'zod';

export const marketSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'El nombre debe tener mínimo 3 caracteres.')
    .max(120, 'El nombre no debe superar 120 caracteres.'),
  market_date: z.string().min(1, 'La fecha es obligatoria.'),
  notes: z
    .string()
    .trim()
    .max(500, 'Las notas no deben superar 500 caracteres.')
    .optional()
    .nullable()
});

export type MarketFormValues = z.infer<typeof marketSchema>;
