import { z } from 'zod';

export const marketItemSchema = z.object({
  productId: z.string().uuid('Selecciona un producto válido.'),
  quantity: z.number().positive('La cantidad debe ser mayor que cero.')
});
