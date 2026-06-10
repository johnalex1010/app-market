# 04_AUTH_FLOW.md

# Flujo de Autenticación — App Mercado

## 1. Objetivo

Definir el flujo de autenticación de la app Mercado usando **Supabase Auth + Next.js App Router**, garantizando sesiones persistentes, rutas protegidas, separación de datos por usuario y una base segura para Row Level Security.

El objetivo no es solo permitir login. El objetivo real es que cada usuario vea únicamente sus propios mercados, productos personalizados, estadísticas e historial de precios.

---

## 2. Alcance del módulo Auth

### Incluye

- Registro de usuario con email y contraseña.
- Inicio de sesión.
- Cierre de sesión.
- Recuperación de contraseña.
- Persistencia de sesión.
- Protección de rutas privadas.
- Redirección según estado de autenticación.
- Creación automática de perfil en `profiles`.
- Integración con Row Level Security.

### No incluye en MVP

- Login con Google OAuth.
- Roles administrativos avanzados.
- 2FA.
- Gestión de permisos por familia/equipo.
- Invitaciones entre usuarios.

Estos puntos pueden entrar en fases futuras.

---

## 3. Stack técnico

```txt
Next.js App Router
Supabase Auth
Supabase SSR helpers
TypeScript
Zod
React Hook Form
Middleware de Next.js
```

Paquetes recomendados:

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install react-hook-form zod @hookform/resolvers
```

---

## 4. Variables de entorno

Archivo requerido:

```txt
.env.local
```

Contenido:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
```

### Regla crítica

`SUPABASE_SERVICE_ROLE_KEY` nunca debe usarse en componentes cliente.

Uso permitido:

```txt
Server Actions
Route Handlers
Scripts internos
Funciones administrativas controladas
```

Uso prohibido:

```txt
Componentes React cliente
Hooks frontend
Archivos expuestos al navegador
```

---

## 5. Rutas públicas y privadas

### Rutas públicas

```txt
/auth/login
/auth/register
/auth/forgot-password
/auth/reset-password
```

### Rutas privadas

```txt
/dashboard
/markets
/markets/new
/markets/[id]
/products
/products/new
/statistics
/settings
/offline
```

### Regla de navegación

Si el usuario no está autenticado e intenta entrar a una ruta privada:

```txt
Redirigir a /auth/login
```

Si el usuario ya está autenticado e intenta entrar a login/register:

```txt
Redirigir a /dashboard
```

---

## 6. Estructura de carpetas Auth

```txt
src/
  app/
    auth/
      login/
        page.tsx
      register/
        page.tsx
      forgot-password/
        page.tsx
      reset-password/
        page.tsx
      callback/
        route.ts

  components/
    auth/
      LoginForm.tsx
      RegisterForm.tsx
      ForgotPasswordForm.tsx
      ResetPasswordForm.tsx
      AuthCard.tsx

  lib/
    supabase/
      client.ts
      server.ts
      middleware.ts

  features/
    auth/
      actions.ts
      schemas.ts
      types.ts

  middleware.ts
```

---

## 7. Cliente Supabase para navegador

Archivo:

```txt
src/lib/supabase/client.ts
```

```ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

Uso:

```txt
Componentes cliente
Formularios
Hooks del navegador
```

---

## 8. Cliente Supabase para servidor

Archivo:

```txt
src/lib/supabase/server.ts
```

```ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Puede fallar en Server Components.
            // Middleware se encarga de refrescar la sesión.
          }
        },
      },
    }
  );
}
```

Uso:

```txt
Server Components
Server Actions
Route Handlers
Validación de sesión del lado servidor
```

---

## 9. Middleware de sesión

Archivo:

```txt
src/lib/supabase/middleware.ts
```

```ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  await supabase.auth.getUser();

  return supabaseResponse;
}
```

Archivo raíz:

```txt
src/middleware.ts
```

```ts
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

---

## 10. Validaciones con Zod

Archivo:

```txt
src/features/auth/schemas.ts
```

```ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'La contraseña debe tener mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, 'El nombre es obligatorio'),
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'La contraseña debe tener mínimo 6 caracteres'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Correo inválido'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'La contraseña debe tener mínimo 6 caracteres'),
});
```

---

## 11. Server Actions de autenticación

Archivo:

```txt
src/features/auth/actions.ts
```

```ts
'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { loginSchema, registerSchema } from './schemas';

export async function loginAction(formData: FormData) {
  const rawData = {
    email: String(formData.get('email')),
    password: String(formData.get('password')),
  };

  const parsed = loginSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Datos inválidos',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      success: false,
      message: 'Credenciales incorrectas',
    };
  }

  redirect('/dashboard');
}

export async function registerAction(formData: FormData) {
  const rawData = {
    fullName: String(formData.get('fullName')),
    email: String(formData.get('email')),
    password: String(formData.get('password')),
  };

  const parsed = registerSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Datos inválidos',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  redirect('/auth/login?registered=true');
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/auth/login');
}
```

---

## 12. Crear perfil automáticamente

Supabase guarda el usuario en:

```txt
auth.users
```

Pero la app necesita datos extendidos en:

```txt
public.profiles
```

### Tabla profiles

```sql
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### Trigger para crear perfil

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
```

---

## 13. Protección de rutas privadas

Ejemplo para layout privado:

```txt
src/app/(private)/layout.tsx
```

```tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return <>{children}</>;
}
```

Estructura recomendada:

```txt
src/app/
  (public)/
    auth/
      login/
      register/
      forgot-password/
      reset-password/

  (private)/
    dashboard/
    markets/
    products/
    statistics/
    settings/
```

---

## 14. Evitar acceso a login si ya hay sesión

Layout público opcional:

```txt
src/app/(public)/auth/layout.tsx
```

```tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
```

---

## 15. RLS mínimo para perfiles

```sql
alter table public.profiles enable row level security;

create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using (user_id = auth.uid());

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
```

Regla empresarial:

```txt
Ningún usuario puede consultar, actualizar o eliminar perfiles de otros usuarios.
```

---

## 16. Flujo de registro

```txt
Usuario entra a /auth/register
↓
Completa nombre, email y contraseña
↓
Next.js valida con Zod
↓
Supabase Auth crea usuario en auth.users
↓
Trigger crea registro en profiles
↓
Usuario es enviado a /auth/login
↓
Usuario inicia sesión
↓
App redirige a /dashboard
```

---

## 17. Flujo de login

```txt
Usuario entra a /auth/login
↓
Completa email y contraseña
↓
Next.js valida con Zod
↓
Supabase valida credenciales
↓
Se crea sesión persistente vía cookies
↓
Middleware actualiza sesión
↓
Usuario entra a /dashboard
```

---

## 18. Flujo de logout

```txt
Usuario hace clic en cerrar sesión
↓
Server Action ejecuta supabase.auth.signOut()
↓
Se eliminan cookies de sesión
↓
Usuario es enviado a /auth/login
```

---

## 19. Recuperación de contraseña

### Solicitud de recuperación

```ts
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
});
```

Variable adicional recomendada:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

En producción:

```env
NEXT_PUBLIC_SITE_URL=https://tudominio.com
```

### Cambio de contraseña

```ts
const { error } = await supabase.auth.updateUser({
  password: newPassword,
});
```

---

## 20. Estados de UI

Cada formulario debe contemplar:

```txt
idle
loading
success
error
```

Ejemplos:

```txt
Iniciando sesión...
Cuenta creada correctamente
Credenciales incorrectas
Correo de recuperación enviado
La contraseña fue actualizada
```

---

## 21. Mensajes recomendados

### Login

```txt
Credenciales incorrectas. Verifica tu correo y contraseña.
```

### Registro exitoso

```txt
Cuenta creada correctamente. Ya puedes iniciar sesión.
```

### Email ya registrado

```txt
Este correo ya está asociado a una cuenta.
```

### Recuperación

```txt
Si el correo existe, recibirás un enlace para restablecer tu contraseña.
```

Esto evita revelar si un email está registrado o no.

---

## 22. Consideraciones de seguridad

- No exponer `SERVICE_ROLE_KEY` en cliente.
- Usar `supabase.auth.getUser()` en servidor para validar sesión real.
- No confiar únicamente en `getSession()` para autorización crítica.
- Activar RLS en todas las tablas privadas.
- Toda tabla de usuario debe tener `user_id`.
- Toda policy debe validar `user_id = auth.uid()`.
- Evitar mensajes que revelen existencia de cuentas.
- Validar formularios en cliente y servidor.

---

## 23. Checklist de implementación

```txt
[ ] Instalar @supabase/supabase-js
[ ] Instalar @supabase/ssr
[ ] Crear .env.local
[ ] Crear cliente Supabase browser
[ ] Crear cliente Supabase server
[ ] Crear middleware de sesión
[ ] Crear rutas públicas auth
[ ] Crear rutas privadas con layout protegido
[ ] Crear formularios Login/Register
[ ] Crear schemas Zod
[ ] Crear Server Actions Auth
[ ] Crear tabla profiles
[ ] Crear trigger handle_new_user
[ ] Activar RLS en profiles
[ ] Crear policies de profiles
[ ] Probar registro
[ ] Probar login
[ ] Probar logout
[ ] Probar ruta privada sin sesión
[ ] Probar ruta pública con sesión activa
```

---

## 24. Criterios de aceptación

El módulo Auth se considera listo cuando:

```txt
[ ] Un usuario puede registrarse.
[ ] Se crea automáticamente su perfil.
[ ] Un usuario puede iniciar sesión.
[ ] Un usuario puede cerrar sesión.
[ ] Un usuario sin sesión no puede entrar al dashboard.
[ ] Un usuario autenticado no vuelve innecesariamente a login/register.
[ ] RLS impide consultar datos de otros usuarios.
[ ] Las sesiones persisten al recargar la página.
[ ] Las variables sensibles no se exponen al frontend.
```

---

## 25. Siguiente documento sugerido

Después de este flujo, el siguiente paso natural es:

```txt
05_MARKET_CRUD.md
```

Ese documento debe definir cómo crear, listar, editar y eliminar mercados, además de cómo agregar productos dentro de cada mercado.

---

## 26. Decisión técnica

Para esta app, la autenticación debe implementarse antes del CRUD de mercados.

Motivo:

```txt
markets.user_id
market_items.user_id
products.user_id
categories.user_id
```

Toda la lógica de negocio depende del usuario autenticado. Sin Auth primero, el CRUD queda artificial y después toca refactorizar. Refactorizar Auth tarde es como ponerle cimientos a una casa después de levantar el segundo piso: técnicamente posible, estratégicamente absurdo.
