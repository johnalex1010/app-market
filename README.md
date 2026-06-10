# App Mercado

Aplicación web responsive tipo PWA para registrar mercados, productos y variaciones de precio. El MVP prioriza el flujo: crear mercado, agregar productos, calcular total, comparar precios y mostrar variación.

## Stack tecnológico

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, PostgreSQL y Storage
- Zod
- React Hook Form
- TanStack Query
- Zustand
- Recharts
- Dexie.js para soporte offline futuro

## Requisitos

- Node.js compatible con Next.js 15.
- npm como gestor de paquetes inicial.
- Proyecto Supabase creado y credenciales configuradas para completar el setup remoto.

## Instalación

```bash
npm install
```

## Variables de entorno

Crear `.env.local` a partir de `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` no debe usarse en componentes cliente.

## Scripts disponibles

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

## Flujo de desarrollo

1. Definir SPEC antes de implementar lógica funcional.
2. Implementar en archivos fuente, no en builds generados.
3. Mantener UI separada de servicios, queries y mutations.
4. Validar TypeScript, lint y build antes de cerrar cambios funcionales.

## Flujo de autenticación

El módulo Auth usa Supabase Auth con cookies SSR y Server Actions.

- Rutas públicas: `/login`, `/register`, `/forgot-password`, `/reset-password`.
- Callback técnico de Supabase: `/auth/callback`.
- Rutas privadas protegidas: `/dashboard`, `/markets`, `/products`, `/categories`, `/statistics`, `/settings`, `/offline`.
- El registro envía `full_name` como metadata para que el trigger remoto cree el perfil en `profiles`.
- La recuperación de contraseña usa `NEXT_PUBLIC_APP_URL` para construir el enlace de retorno.
- `SUPABASE_SERVICE_ROLE_KEY` no se usa en componentes cliente ni en el flujo Auth del MVP.

## Flujo de mercados

El módulo de mercados usa rutas privadas de App Router y Server Actions contra Supabase.

- `/markets`: lista los mercados del usuario autenticado.
- `/markets/new`: crea un mercado con nombre, fecha y notas.
- `/markets/[id]`: muestra detalle, total acumulado, formulario de productos e items registrados.
- `/markets/[id]/edit`: edita la información general del mercado.

Cada item guarda producto, categoría, cantidad, unidad, precio pagado, `product_name_snapshot`, `purchase_date`, `sync_status = synced`, cantidad normalizada y precio unitario normalizado. Al crear, editar o eliminar items, la app recalcula `markets.total_amount`.

El acceso se filtra por usuario desde Server Actions/queries y debe estar respaldado por las policies RLS descritas en `docs/01_DATABASE_SCHEMA.md`.

## Flujo de build

```bash
npm run build
```

## Estructura principal

- `app/`: rutas, layouts y endpoints App Router.
- `components/`: UI reusable, layouts y componentes por dominio.
- `features/`: reglas y helpers por dominio funcional.
- `lib/`: Supabase, validaciones, utilidades, constantes, formatters y cálculos.
- `services/`: acceso directo a datos externos.
- `queries/`: lecturas y caché con TanStack Query.
- `mutations/`: escrituras e invalidaciones.
- `hooks/`: hooks personalizados.
- `stores/`: estado local con Zustand.
- `types/`: tipos compartidos.
- `docs/`: documentación técnica del proyecto.

## Convenciones relevantes

- Idioma del proyecto: Español Colombia (`es-CO`).
- Encoding: UTF-8.
- Archivos y carpetas en kebab-case.
- Componentes React en PascalCase.
- Servicios sin acceso directo desde componentes UI.
- No hardcodear secretos.

## Pruebas y validación

No hay test runner configurado todavía. Las validaciones iniciales son:

```bash
npm run typecheck
npm run lint
npm run build
```

## Despliegue

Deploy sugerido: Vercel. La configuración concreta queda pendiente hasta definir Supabase y variables de entorno de producción.

## Troubleshooting básico

- Si faltan variables de entorno, revisar `.env.local`.
- Si Supabase falla, validar URL, anon key y configuración RLS.
- Si Tailwind no aplica estilos, revisar `tailwind.config.ts` y `app/globals.css`.
- Si una ruta privada redirige siempre a login, validar que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` existan y que haya sesión activa.

## Riesgos conocidos

- El proyecto Supabase remoto, el SQL del schema, los seeds y las policies RLS deben ejecutarse fuera del repositorio siguiendo `docs/03_SUPABASE_SETUP.md`.
- La creación automática de perfiles depende del trigger `handle_new_user` aplicado en Supabase.
- Los catálogos de productos, categorías y unidades deben estar sembrados en Supabase para agregar items a un mercado.
- El soporte offline está preparado a nivel estructural, pero no implementado.

## Documentación técnica

- [docs/01_DATABASE_SCHEMA.md](docs/01_DATABASE_SCHEMA.md): esquema inicial de base de datos.
- [docs/02_PROJECT_STRUCTURE.md](docs/02_PROJECT_STRUCTURE.md): estructura base del proyecto.
- [docs/03_SUPABASE_SETUP.md](docs/03_SUPABASE_SETUP.md): configuración Supabase, middleware de sesión y validación remota pendiente.
- [docs/04_AUTH_FLOW.md](docs/04_AUTH_FLOW.md): flujo de autenticación pendiente.
- [docs/05_MARKET_CRUD.md](docs/05_MARKET_CRUD.md): CRUD de mercados e items implementado.
