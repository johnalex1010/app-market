import { z } from 'zod';

export const authEmailSchema = z.object({
  email: z.string().trim().email('Ingresa un correo válido.')
});

export const loginSchema = z.object({
  email: z.string().trim().email('Ingresa un correo válido.'),
  password: z.string().min(6, 'La contraseña debe tener mínimo 6 caracteres.')
});

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Ingresa tu nombre completo.'),
  email: z.string().trim().email('Ingresa un correo válido.'),
  password: z.string().min(6, 'La contraseña debe tener mínimo 6 caracteres.')
});

export const forgotPasswordSchema = authEmailSchema;

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'La contraseña debe tener mínimo 6 caracteres.')
});
