# 03_SUPABASE_SETUP.md

# App Mercado — Supabase Setup

## 1. Propósito del documento

Este documento define la configuración inicial de **Supabase** para el proyecto **App Mercado**.

El objetivo es dejar listo el backend BaaS necesario para el MVP:

- Proyecto Supabase.
- Variables de entorno.
- Autenticación.
- Base de datos PostgreSQL.
- Row Level Security.
- Policies por usuario.
- Seeds iniciales.
- Storage para fase futura.
- Conexión desde Next.js.
- Validación técnica del setup.

Este archivo debe ejecutarse después de tener definido el modelo de base de datos en `01_DATABASE_SCHEMA.md` y antes de implementar los flujos de autenticación y CRUD.

---

## 2. Stack Supabase usado

```txt
Supabase Project
Supabase Auth
Supabase PostgreSQL
Supabase Row Level Security
Supabase Storage
Supabase SQL Editor
Supabase API Keys
Next.js App Router
@supabase/supabase-js
@supabase/ssr
```

---

## 3. Prerrequisitos

Antes de configurar Supabase, el proyecto debe tener:

```txt
Node.js instalado
Proyecto Next.js creado
Repositorio Git inicializado
Cuenta de Supabase
Archivo 01_DATABASE_SCHEMA.md definido
Archivo 02_PROJECT_STRUCTURE.md definido
```

Versión recomendada del proyecto:

```txt
Next.js App Router
TypeScript
Tailwind CSS
Supabase como backend principal
```

---

## 4. Crear proyecto en Supabase

### 4.1 Crear nuevo proyecto

Entrar a Supabase y crear un proyecto nuevo.

Datos sugeridos:

```txt
Project name: app-mercado
Database password: usar contraseña segura
Region: región más cercana al usuario objetivo
Pricing plan: Free para MVP
```

Para Colombia, seleccionar una región con buena latencia hacia LATAM si está disponible. Si no, usar una región estable cercana al mercado principal.

---

## 5. Obtener credenciales del proyecto

En Supabase:

```txt
Project Settings > API
```

Copiar:

```txt
Project URL
anon public key
service_role key
```

Uso correcto:

```txt
NEXT_PUBLIC_SUPABASE_URL      -> visible en frontend
NEXT_PUBLIC_SUPABASE_ANON_KEY -> visible en frontend
SUPABASE_SERVICE_ROLE_KEY     -> solo backend seguro / scripts / server privado
```

Regla crítica:

```txt
Nunca exponer SUPABASE_SERVICE_ROLE_KEY en componentes client-side.
```

La `service_role key` ignora RLS. Usarla mal es equivalente a dejar las llaves de producción debajo del tapete. Muy cómodo, hasta que alguien las encuentra.

---

## 6. Variables de entorno

Crear archivo:

```txt
.env.local
```

Contenido base:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

Crear también archivo de referencia:

```txt
.env.example
```

Contenido:

```env
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
```

`.env.local` debe estar ignorado en Git.

Verificar en `.gitignore`:

```gitignore
.env*.local
.env
```

---

## 7. Instalar dependencias Supabase en Next.js

Ejecutar en el proyecto:

```bash
npm install @supabase/supabase-js @supabase/ssr
```

Dependencias complementarias recomendadas:

```bash
npm install zod react-hook-form @hookform/resolvers
```

Para fase de datos/cache:

```bash
npm install @tanstack/react-query zustand
```

Para gráficas futuras:

```bash
npm install recharts
```

---

## 8. Configurar clientes Supabase en Next.js

La app debe separar el cliente Supabase según contexto:

```txt
Client helper     -> componentes cliente
Server helper     -> server components, actions, route handlers
Middleware helper -> sincronización de cookies y sesión
Admin client      -> fase futura para scripts backend controlados
```

Estructura real del proyecto:

```txt
lib/
└── supabase/
    ├── client.ts
    ├── server.ts
    ├── middleware.ts
    └── types.ts
```

---

## 9. Cliente Supabase para navegador

Archivo:

```txt
lib/supabase/client.ts
```

Código:

```ts
import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  );
}
```

Uso:

```txt
Componentes con "use client"
Formularios
Operaciones del usuario autenticado
Consultas protegidas por RLS
```

---

## 10. Cliente Supabase para servidor

Archivo:

```txt
lib/supabase/server.ts
```

Código:

```ts
import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        }
      }
    }
  );
}
```

Uso:

```txt
Server Components
Server Actions
Route Handlers
Validación de sesión
Lectura segura de datos
```

---

## 11. Cliente Admin Supabase

Estado:

```txt
No implementado en esta fase.
```

Motivo:

```txt
El MVP actual no tiene scripts administrativos ni procesos backend que requieran saltarse RLS.
Crear un cliente admin antes de tener caso de uso aumenta el riesgo de exponer o usar mal SUPABASE_SERVICE_ROLE_KEY.
```

Cuando exista una tarea administrativa real, el archivo sugerido será:

```txt
lib/supabase/admin.ts
```

Código base permitido únicamente para backend seguro:

```ts
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
```

Uso permitido:

```txt
Scripts internos
Procesos backend controlados
Migraciones puntuales
Tareas administrativas futuras
```

No usar en:

```txt
Componentes React cliente
Hooks frontend
Páginas públicas
Código enviado al navegador
```

---

## 12. Configurar middleware de sesión

Archivo:

```txt
middleware.ts
```

Helper usado:

```txt
lib/supabase/middleware.ts
```

Responsabilidades:

```txt
Sincronizar cookies entre request y response.
Consultar sesión con Supabase en rutas privadas.
Redirigir a /login cuando no exista sesión válida.
Preservar el destino original en el parámetro next.
```

Código base del middleware raíz:

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware';

const PRIVATE_ROUTES = ['/dashboard', '/markets', '/products', '/categories', '/statistics', '/settings', '/offline'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivateRoute = PRIVATE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (!isPrivateRoute) {
    return NextResponse.next();
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return redirectToLogin(request);
  }

  const { response, supabase } = createSupabaseMiddlewareClient(request);
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirectToLogin(request);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};

function redirectToLogin(request: NextRequest) {
  const redirectUrl = request.nextUrl.clone();

  redirectUrl.pathname = '/login';
  redirectUrl.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`);

  return NextResponse.redirect(redirectUrl);
}
```

Este middleware mantiene la sesión sincronizada entre navegador y servidor, y evita que una ruta privada se renderice sin usuario autenticado.

---

## 13. Configurar Auth en Supabase

Ruta en Supabase:

```txt
Authentication > Providers
```

Para MVP activar:

```txt
Email provider
Email + Password
```

Configuración recomendada para desarrollo:

```txt
Confirm email: desactivado temporalmente en desarrollo
Confirm email: activado en producción
```

Configuración recomendada en producción:

```txt
Site URL: dominio principal de la app
Redirect URLs: dominios permitidos de login, recovery y callback
```

Ejemplo local:

```txt
http://localhost:3000
http://localhost:3000/auth/callback
```

Ejemplo producción:

```txt
https://app-mercado.vercel.app
https://app-mercado.vercel.app/auth/callback
```

---

## 14. Flujo de autenticación esperado

### 14.1 Registro

```txt
Usuario llena formulario
Supabase crea usuario en auth.users
Trigger crea registro en profiles
Usuario entra al dashboard
```

### 14.2 Login

```txt
Usuario ingresa email y password
Supabase valida credenciales
Se crea sesión con cookies
Usuario accede a rutas privadas
```

### 14.3 Logout

```txt
Usuario cierra sesión
Supabase elimina sesión
App redirige a login
```

### 14.4 Recuperar contraseña

```txt
Usuario solicita recuperación
Supabase envía email
Usuario define nueva contraseña
App redirige a login/dashboard
```

---

## 15. Ejecutar SQL del esquema

En Supabase:

```txt
SQL Editor > New query
```

Ejecutar el contenido SQL definido en:

```txt
01_DATABASE_SCHEMA.md
```

Orden recomendado:

```txt
1. Extensions
2. Functions
3. Tables
4. Triggers
5. Indexes
6. RLS
7. Policies
8. Seeds
9. Views opcionales
```

No ejecutar seeds antes de crear constraints y llaves foráneas.

---

## 16. Tablas esperadas para MVP

Después de ejecutar el SQL, deben existir:

```txt
profiles
categories
units
products
markets
market_items
```

Tablas futuras opcionales:

```txt
price_history
offline_sync_logs
```

---

## 17. Validar tablas en Supabase

Ir a:

```txt
Table Editor
```

Validar:

```txt
Todas las tablas existen
Las columnas tienen tipos correctos
Las foreign keys están creadas
Los defaults funcionan
Los check constraints existen
Los índices están activos
RLS está habilitado
```

---

## 18. Configurar Row Level Security

Regla principal:

```txt
Todo dato privado debe tener user_id y RLS habilitado.
```

Tablas privadas:

```txt
profiles
markets
market_items
products personalizados
categories personalizadas
```

Tablas de lectura pública controlada:

```txt
units
products del sistema
categories del sistema
```

RLS debe estar habilitado en todas las tablas expuestas del schema `public`.

---

## 19. Policies base esperadas

### 19.1 Profiles

```txt
El usuario autenticado puede ver su propio perfil.
El usuario autenticado puede actualizar su propio perfil.
```

### 19.2 Categories

```txt
El usuario puede leer categorías del sistema.
El usuario puede leer sus propias categorías.
El usuario puede crear categorías propias.
El usuario puede actualizar categorías propias.
El usuario puede eliminar categorías propias.
```

### 19.3 Products

```txt
El usuario puede leer productos del sistema.
El usuario puede leer sus propios productos.
El usuario puede crear productos propios.
El usuario puede actualizar productos propios.
El usuario puede eliminar productos propios.
```

### 19.4 Markets

```txt
El usuario puede leer sus propios mercados.
El usuario puede crear sus propios mercados.
El usuario puede actualizar sus propios mercados.
El usuario puede eliminar sus propios mercados.
```

### 19.5 Market items

```txt
El usuario puede leer sus propios items.
El usuario puede crear items en sus propios mercados.
El usuario puede actualizar sus propios items.
El usuario puede eliminar sus propios items.
```

---

## 20. Validar RLS manualmente

Crear dos usuarios de prueba:

```txt
usuario-a@appmercado.test
usuario-b@appmercado.test
```

Validar:

```txt
Usuario A crea mercado.
Usuario B no puede ver el mercado de Usuario A.
Usuario B crea producto propio.
Usuario A no puede editar producto propio de Usuario B.
Ambos pueden ver productos del sistema.
Ambos pueden ver categorías del sistema.
```

Resultado esperado:

```txt
Aislamiento correcto por user_id.
```

---

## 21. Seeds iniciales

Los seeds mínimos deben cargar:

```txt
Categorías base
Unidades base
Productos base
```

### 21.1 Categorías base

```txt
Granos
Lácteos
Carnes
Bebidas
Aseo
Frutas
Verduras
Enlatados
Panadería
Mascotas
Otros
```

### 21.2 Unidades base

```txt
Unidad - und
Gramo - g
Kilogramo - kg
Mililitro - ml
Litro - l
Libra - lb
Docena - doc
Paquete - paq
Caja - caja
Bolsa - bolsa
Botella - bot
```

### 21.3 Productos base

```txt
Arroz
Lentejas
Fríjol
Sal
Aceite
Leche
Huevos
Agua
Panela
Pasta
Café
Azúcar
Harina
Atún
Jabón
Papel higiénico
```

---

## 22. Storage para fotos

Storage no es obligatorio en el MVP inicial, pero se deja preparado para fase futura.

Bucket sugerido:

```txt
product-images
```

Configuración:

```txt
Public bucket: false
File size limit: 2 MB a 5 MB
Allowed MIME types: image/jpeg, image/png, image/webp
```

Estructura de rutas sugerida:

```txt
product-images/{user_id}/{product_id}/{filename}
```

Ejemplo:

```txt
product-images/uuid-user/uuid-product/arroz-diana.webp
```

Regla:

```txt
El usuario solo puede subir, leer, actualizar o eliminar archivos dentro de su propio directorio user_id.
```

---

## 23. Policies futuras para Storage

Ejemplo conceptual:

```sql
create policy "Users can upload own product images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
```

```sql
create policy "Users can view own product images"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'product-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
```

```sql
create policy "Users can update own product images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-images'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'product-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
```

```sql
create policy "Users can delete own product images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## 24. Tipos TypeScript desde Supabase

Cuando la base de datos esté estable, generar tipos.

Instalar CLI si se requiere:

```bash
npm install supabase --save-dev
```

Login:

```bash
npx supabase login
```

Generar tipos:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > types/supabase.ts
```

Archivo esperado:

```txt
types/supabase.ts
```

Uso sugerido:

```ts
import type { Database } from '@/types/supabase';
```

---

## 25. Crear helper de tipos

Archivo:

```txt
types/database.types.ts
```

Ejemplo:

```ts
import type { Database } from './supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Unit = Database['public']['Tables']['units']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Market = Database['public']['Tables']['markets']['Row'];
export type MarketItem = Database['public']['Tables']['market_items']['Row'];

export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type MarketInsert = Database['public']['Tables']['markets']['Insert'];
export type MarketItemInsert = Database['public']['Tables']['market_items']['Insert'];
```

---

## 26. Validar conexión desde Next.js

Crear una prueba temporal en:

```txt
app/(private)/dashboard/page.tsx
```

Ejemplo:

```tsx
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  const { data: units, error } = await supabase
    .from('units')
    .select('*')
    .limit(5);

  if (error) {
    return <pre>{error.message}</pre>;
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(units, null, 2)}</pre>
    </main>
  );
}
```

Resultado esperado:

```txt
La app debe mostrar unidades base desde Supabase.
```

Después de validar, reemplazar esta prueba por el dashboard real.

---

## 27. Validar usuario autenticado

Ejemplo temporal:

```tsx
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function PrivatePage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return <div>Usuario autenticado: {user.email}</div>;
}
```

Resultado esperado:

```txt
Sin sesión -> redirige a login
Con sesión -> muestra página privada
```

---

## 28. Configuración para producción en Vercel

En Vercel:

```txt
Project Settings > Environment Variables
```

Agregar:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Ambientes:

```txt
Production
Preview
Development
```

Después de configurar variables:

```txt
Redeploy obligatorio
```

---

## 29. Seguridad mínima obligatoria

Checklist:

```txt
RLS habilitado en tablas privadas
Policies creadas por tabla
No exponer service_role key
No consultar datos privados sin sesión
No confiar en user_id enviado desde frontend sin validarlo
No permitir updates a registros de otro usuario
No permitir deletes cruzados entre usuarios
Validar datos con Zod antes de insertar
Usar numeric para dinero, no float
Usar timestamptz para fechas
```

---

## 30. Errores comunes

### Error: Missing Supabase environment variables

Causa:

```txt
.env.local no existe o tiene nombres incorrectos.
```

Solución:

```txt
Revisar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.
Reiniciar servidor npm run dev.
```

### Error: new row violates row-level security policy

Causa probable:

```txt
El insert no cumple with check.
user_id no coincide con auth.uid().
Usuario no está autenticado.
```

Solución:

```txt
Verificar sesión.
Enviar user_id correcto desde server.
Revisar policy insert.
```

### Error: relation does not exist

Causa:

```txt
La tabla no fue creada o se ejecutó SQL en otro proyecto.
```

Solución:

```txt
Validar proyecto activo.
Revisar SQL Editor.
Confirmar nombre de tabla.
```

### Error: auth.uid() returns null

Causa:

```txt
No hay sesión autenticada en la petición.
```

Solución:

```txt
Validar login.
Validar middleware.
Usar getUser() en server.
```

---

## 31. Checklist final de setup

```txt
[ ] Proyecto Supabase creado
[ ] Variables de entorno configuradas
[ ] Dependencias instaladas
[ ] Cliente navegador creado en lib/supabase/client.ts
[ ] Cliente servidor creado en lib/supabase/server.ts
[ ] Helper de middleware creado en lib/supabase/middleware.ts
[ ] Cliente admin evaluado y aplazado hasta existir caso de uso backend seguro
[ ] Middleware configurado
[ ] Auth email/password activo
[ ] SQL del schema ejecutado
[ ] Tablas creadas
[ ] Seeds cargados
[ ] RLS habilitado
[ ] Policies activas
[ ] Usuario de prueba creado
[ ] Prueba de lectura desde Next.js funcionando
[ ] Prueba de aislamiento por usuario validada
[ ] Storage preparado para fase futura
[ ] Tipos TypeScript generados
```

---

## 32. Entregable de esta fase

Al terminar este setup, el proyecto debe tener:

```txt
Supabase conectado a Next.js
Auth funcional
Base de datos creada
Datos semilla disponibles
RLS activo
Policies validadas
Tipos TypeScript generados
```

Este es el punto de partida correcto para continuar con:

```txt
04_AUTH_FLOW.md
```

---

## 33. Criterio de aceptación

La fase `03_SUPABASE_SETUP.md` se considera completa cuando:

```txt
Un usuario puede registrarse o iniciar sesión.
La app puede consultar unidades/categorías/productos del sistema.
El usuario puede crear un mercado propio.
Otro usuario no puede ver ese mercado.
Next.js puede leer datos desde Supabase con sesión activa.
Las variables de entorno funcionan localmente y en producción.
```

Si todo eso pasa, el backend base está listo para construir producto. Si no pasa, no se avanza a UI; primero se corrige la capa de datos y seguridad.
