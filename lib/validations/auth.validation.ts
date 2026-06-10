import { z } from 'zod';

export const authEmailSchema = z.object({
  email: z.string().email('Ingresa un correo válido.')
});
