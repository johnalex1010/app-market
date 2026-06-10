import { z } from 'zod';

export const marketItemSchema = z.object({
  product_id: z.string().uuid('Selecciona un producto válido.'),
  category_id: z.string().uuid('Selecciona una categoría válida.'),
  quantity: z.coerce.number().positive('La cantidad debe ser mayor que cero.'),
  unit_id: z.string().uuid('Selecciona una unidad válida.'),
  price: z.coerce.number().positive('El precio debe ser mayor que cero.'),
  notes: z
    .string()
    .trim()
    .max(500, 'Las notas no deben superar 500 caracteres.')
    .optional()
    .nullable()
});

export type MarketItemFormValues = z.infer<typeof marketItemSchema>;
