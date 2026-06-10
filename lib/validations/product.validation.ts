import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'El nombre del producto es obligatorio.')
});
