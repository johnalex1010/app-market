import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener mínimo 2 caracteres.')
    .max(120, 'El nombre no debe superar 120 caracteres.'),
  category_id: z.string().uuid('Selecciona una categoría válida.'),
  default_unit_id: z.string().uuid('Selecciona una unidad válida.'),
  description: z
    .string()
    .trim()
    .max(500, 'La descripción no debe superar 500 caracteres.')
    .optional()
    .nullable(),
  image_url: z
    .string()
    .trim()
    .url('Ingresa una URL de imagen válida.')
    .refine((value) => ['http:', 'https:'].includes(new URL(value).protocol), 'La imagen debe usar una URL http o https.')
    .optional()
    .or(z.literal(''))
    .transform((value) => value || null)
});

export type ProductFormValues = z.infer<typeof productSchema>;
