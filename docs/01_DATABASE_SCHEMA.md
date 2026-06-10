# 01_DATABASE_SCHEMA.md

# App Mercado — Database Schema

## 1. Propósito del documento

Este documento define el esquema inicial de base de datos para la aplicación **App Mercado**, una herramienta web para registrar mercados, productos comprados, precios históricos, cantidades, unidades de medida y comparaciones de precio en el tiempo.

El objetivo del modelo es soportar correctamente:

- Usuarios independientes.
- Productos del sistema y productos creados por el usuario.
- Categorías del sistema y categorías personalizadas.
- Mercados o compras agrupadas.
- Items registrados dentro de cada mercado.
- Comparación de precios por producto.
- Comparación entre mercados.
- Cálculo de precio unitario normalizado.
- Preparación futura para offline-first, fotos, gráficas y análisis avanzado.

---

## 2. Stack de base de datos

Base recomendada:

```txt
Supabase PostgreSQL
Supabase Auth
Supabase Row Level Security
Supabase Storage, fase futura
```

Extensiones recomendadas:

```sql
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";
```

---

## 3. Convenciones generales

### 3.1 Naming

- Tablas en plural: `products`, `markets`, `market_items`.
- Columnas en `snake_case`.
- Llaves primarias tipo `uuid`.
- Fechas con `timestamptz`.
- Valores monetarios en COP usando `numeric(12,2)`.
- Cantidades usando `numeric(12,3)`.
- Estados con `text` + `check constraint`.

### 3.2 Campos estándar

Todas las tablas principales deben manejar:

```sql
id uuid primary key default gen_random_uuid(),
created_at timestamptz not null default now(),
updated_at timestamptz not null default now()
```

### 3.3 Multiusuario

Las tablas de información privada deben tener:

```sql
user_id uuid not null references auth.users(id) on delete cascade
```

Las tablas mixtas, como productos o categorías, pueden tener registros del sistema y registros del usuario:

```sql
is_system boolean not null default false,
user_id uuid null references auth.users(id) on delete cascade
```

Regla:

- `is_system = true` → registro global, visible para todos.
- `is_system = false` → registro privado, asociado a `user_id`.

---

## 4. Diagrama lógico simplificado

```txt
auth.users
   └── profiles

categories
   └── products
          └── market_items

units
   └── products.default_unit_id
   └── market_items.unit_id

markets
   └── market_items
```

---

## 5. Tablas principales

---

# 5.1 profiles

Guarda información extendida del usuario autenticado.

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

### Índices

```sql
create index if not exists idx_profiles_user_id
on public.profiles(user_id);
```

---

# 5.2 categories

Categorías de productos. Pueden ser globales o creadas por usuario.

```sql
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null,
  icon text,
  color text,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint categories_system_user_check check (
    (is_system = true and user_id is null)
    or
    (is_system = false and user_id is not null)
  )
);
```

### Índices

```sql
create index if not exists idx_categories_user_id
on public.categories(user_id);

create index if not exists idx_categories_slug
on public.categories(slug);

create unique index if not exists idx_categories_system_slug_unique
on public.categories(slug)
where is_system = true;

create unique index if not exists idx_categories_user_slug_unique
on public.categories(user_id, slug)
where is_system = false;
```

---

# 5.3 units

Unidades de medida disponibles para registrar cantidades y calcular precios normalizados.

```sql
create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  abbreviation text not null,
  type text not null,
  conversion_factor numeric(12,6) not null default 1,
  base_unit text not null,
  is_system boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint units_type_check check (
    type in ('weight', 'volume', 'count', 'package')
  ),

  constraint units_conversion_factor_check check (
    conversion_factor > 0
  )
);
```

### Explicación de campos

| Campo | Descripción |
|---|---|
| `name` | Nombre completo. Ej: Kilogramo |
| `abbreviation` | Abreviatura. Ej: kg |
| `type` | Tipo de unidad: peso, volumen, conteo o empaque |
| `conversion_factor` | Factor para convertir a unidad base |
| `base_unit` | Unidad base de comparación. Ej: g, ml, und |

### Ejemplo

```txt
1 kg = 1000 g
conversion_factor = 1000
base_unit = g
```

### Índices

```sql
create unique index if not exists idx_units_abbreviation_unique
on public.units(abbreviation);

create index if not exists idx_units_type
on public.units(type);
```

---

# 5.4 products

Catálogo de productos. Puede contener productos globales del sistema y productos personalizados por usuario.

```sql
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete cascade,
  category_id uuid null references public.categories(id) on delete set null,
  default_unit_id uuid null references public.units(id) on delete set null,
  name text not null,
  slug text not null,
  description text,
  image_url text,
  is_system boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint products_system_user_check check (
    (is_system = true and user_id is null)
    or
    (is_system = false and user_id is not null)
  )
);
```

### Índices

```sql
create index if not exists idx_products_user_id
on public.products(user_id);

create index if not exists idx_products_category_id
on public.products(category_id);

create index if not exists idx_products_default_unit_id
on public.products(default_unit_id);

create index if not exists idx_products_slug
on public.products(slug);

create unique index if not exists idx_products_system_slug_unique
on public.products(slug)
where is_system = true;

create unique index if not exists idx_products_user_slug_unique
on public.products(user_id, slug)
where is_system = false;
```

### Imagen del producto

La imagen del catálogo se guarda en `public.products.image_url`.

Ese es el campo que debes llenar para que el producto muestre imagen en el listado, el detalle y el formulario. Debe ser una URL `http` o `https`, por ejemplo una URL pública generada desde Supabase Storage.

No confundir con `public.market_items.image_url`: ese campo queda reservado para una foto histórica de un item comprado dentro de un mercado específico, si más adelante se decide registrar evidencias por compra.

Ejemplo para agregar imagen a un producto existente:

```sql
update public.products
set image_url = 'https://tu-dominio-o-storage.com/products/arroz.webp'
where slug = 'arroz';
```

---

# 5.5 markets

Representa un mercado, compra o grupo de productos comprados.

Ejemplos:

```txt
Mercado Junio 2026
Mercado D1 Semana 1
Mercado Tienda Barrio
```

```sql
create table if not exists public.markets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  market_date date not null default current_date,
  total_amount numeric(12,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint markets_total_amount_check check (total_amount >= 0)
);
```

### Índices

```sql
create index if not exists idx_markets_user_id
on public.markets(user_id);

create index if not exists idx_markets_market_date
on public.markets(market_date desc);

create index if not exists idx_markets_user_date
on public.markets(user_id, market_date desc);
```

---

# 5.6 market_items

Representa cada producto registrado dentro de un mercado.

Esta es una de las tablas más importantes del sistema porque almacena el precio real pagado, cantidad, unidad y precio normalizado.

```sql
create table if not exists public.market_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  market_id uuid not null references public.markets(id) on delete cascade,
  product_id uuid null references public.products(id) on delete set null,
  category_id uuid null references public.categories(id) on delete set null,
  unit_id uuid null references public.units(id) on delete set null,

  product_name_snapshot text not null,
  quantity numeric(12,3) not null default 1,
  price numeric(12,2) not null,
  normalized_quantity numeric(12,3),
  normalized_unit_price numeric(12,6),

  image_url text,
  notes text,
  purchase_date date not null default current_date,
  sync_status text not null default 'synced',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint market_items_quantity_check check (quantity > 0),
  constraint market_items_price_check check (price >= 0),
  constraint market_items_sync_status_check check (
    sync_status in ('synced', 'pending', 'failed', 'conflict')
  )
);
```

### Explicación de campos críticos

| Campo | Descripción |
|---|---|
| `price` | Precio total pagado por el producto |
| `quantity` | Cantidad comprada |
| `unit_id` | Unidad registrada: kg, g, l, ml, und, etc. |
| `normalized_quantity` | Cantidad convertida a unidad base |
| `normalized_unit_price` | Precio por unidad base |
| `product_name_snapshot` | Nombre congelado del producto al momento de la compra |

### Ejemplo

```txt
Producto: Arroz Diana 1kg
Precio: $5.000 COP
Cantidad: 1
Unidad: kg
normalized_quantity: 1000
normalized_unit_price: 5

Resultado:
$5 COP por gramo
```

### Índices

```sql
create index if not exists idx_market_items_user_id
on public.market_items(user_id);

create index if not exists idx_market_items_market_id
on public.market_items(market_id);

create index if not exists idx_market_items_product_id
on public.market_items(product_id);

create index if not exists idx_market_items_category_id
on public.market_items(category_id);

create index if not exists idx_market_items_purchase_date
on public.market_items(purchase_date desc);

create index if not exists idx_market_items_user_product_date
on public.market_items(user_id, product_id, purchase_date desc);
```

---

## 6. Tabla opcional futura: price_history

Para el MVP no es obligatorio crear esta tabla porque el historial puede calcularse desde `market_items`.

Se recomienda crearla solo cuando haya necesidad de optimización o reportes pesados.

```sql
create table if not exists public.price_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid null references public.products(id) on delete set null,
  market_item_id uuid not null references public.market_items(id) on delete cascade,
  price numeric(12,2) not null,
  quantity numeric(12,3) not null,
  unit_id uuid null references public.units(id) on delete set null,
  normalized_unit_price numeric(12,6),
  purchase_date date not null,
  created_at timestamptz not null default now(),

  constraint price_history_price_check check (price >= 0),
  constraint price_history_quantity_check check (quantity > 0)
);
```

### Índices

```sql
create index if not exists idx_price_history_user_id
on public.price_history(user_id);

create index if not exists idx_price_history_product_id
on public.price_history(product_id);

create index if not exists idx_price_history_user_product_date
on public.price_history(user_id, product_id, purchase_date desc);
```

---

## 7. Funciones auxiliares

---

# 7.1 updated_at automático

```sql
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
```

### Triggers

```sql
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger set_units_updated_at
before update on public.units
for each row execute function public.set_updated_at();

create trigger set_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger set_markets_updated_at
before update on public.markets
for each row execute function public.set_updated_at();

create trigger set_market_items_updated_at
before update on public.market_items
for each row execute function public.set_updated_at();
```

---

# 7.2 Calcular total de mercado

Cada vez que se inserta, actualiza o elimina un item, se recalcula el total del mercado.

```sql
create or replace function public.recalculate_market_total(target_market_id uuid)
returns void as $$
begin
  update public.markets
  set total_amount = coalesce((
    select sum(price)
    from public.market_items
    where market_id = target_market_id
  ), 0),
  updated_at = now()
  where id = target_market_id;
end;
$$ language plpgsql security definer;
```

---

# 7.3 Trigger para recalcular total

```sql
create or replace function public.trigger_recalculate_market_total()
returns trigger as $$
begin
  if tg_op = 'DELETE' then
    perform public.recalculate_market_total(old.market_id);
    return old;
  else
    perform public.recalculate_market_total(new.market_id);
    return new;
  end if;
end;
$$ language plpgsql security definer;
```

```sql
create trigger recalculate_market_total_after_insert
insert on public.market_items
for each row execute function public.trigger_recalculate_market_total();

create trigger recalculate_market_total_after_update
after update on public.market_items
for each row execute function public.trigger_recalculate_market_total();

create trigger recalculate_market_total_after_delete
after delete on public.market_items
for each row execute function public.trigger_recalculate_market_total();
```

> Nota técnica: en Supabase/PostgreSQL, el trigger correcto debe usar `after insert`, no solo `insert`. Si el SQL anterior se ejecuta en bloque, ajustar así:

```sql
drop trigger if exists recalculate_market_total_after_insert on public.market_items;

create trigger recalculate_market_total_after_insert
after insert on public.market_items
for each row execute function public.trigger_recalculate_market_total();
```

---

# 7.4 Calcular cantidad normalizada y precio unitario

```sql
create or replace function public.calculate_normalized_values()
returns trigger as $$
declare
  unit_factor numeric(12,6);
begin
  if new.unit_id is not null then
    select conversion_factor
    into unit_factor
    from public.units
    where id = new.unit_id;

    if unit_factor is not null then
      new.normalized_quantity = new.quantity * unit_factor;

      if new.normalized_quantity > 0 then
        new.normalized_unit_price = new.price / new.normalized_quantity;
      end if;
    end if;
  end if;

  return new;
end;
$$ language plpgsql;
```

### Trigger

```sql
create trigger calculate_market_item_normalized_values
before insert or update on public.market_items
for each row execute function public.calculate_normalized_values();
```

---

## 8. Row Level Security

Activar RLS en todas las tablas privadas o mixtas.

```sql
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.markets enable row level security;
alter table public.market_items enable row level security;
alter table public.price_history enable row level security;
```

`units` puede ser pública de solo lectura si todas las unidades son del sistema.

```sql
alter table public.units enable row level security;
```

---

# 8.1 Policies — profiles

```sql
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = user_id);

create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = user_id);

create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

---

# 8.2 Policies — categories

```sql
create policy "Users can view system and own categories"
on public.categories
for select
using (
  is_system = true
  or auth.uid() = user_id
);

create policy "Users can insert own categories"
on public.categories
for insert
with check (
  is_system = false
  and auth.uid() = user_id
);

create policy "Users can update own categories"
on public.categories
for update
using (
  is_system = false
  and auth.uid() = user_id
)
with check (
  is_system = false
  and auth.uid() = user_id
);

create policy "Users can delete own categories"
on public.categories
for delete
using (
  is_system = false
  and auth.uid() = user_id
);
```

---

# 8.3 Policies — units

```sql
create policy "Users can view units"
on public.units
for select
using (true);
```

> Las unidades del sistema no deberían ser modificadas desde el frontend.

---

# 8.4 Policies — products

```sql
create policy "Users can view system and own products"
on public.products
for select
using (
  is_system = true
  or auth.uid() = user_id
);

create policy "Users can insert own products"
on public.products
for insert
with check (
  is_system = false
  and auth.uid() = user_id
);

create policy "Users can update own products"
on public.products
for update
using (
  is_system = false
  and auth.uid() = user_id
)
with check (
  is_system = false
  and auth.uid() = user_id
);

create policy "Users can delete own products"
on public.products
for delete
using (
  is_system = false
  and auth.uid() = user_id
);
```

---

# 8.5 Policies — markets

```sql
create policy "Users can view own markets"
on public.markets
for select
using (auth.uid() = user_id);

create policy "Users can insert own markets"
on public.markets
for insert
with check (auth.uid() = user_id);

create policy "Users can update own markets"
on public.markets
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own markets"
on public.markets
for delete
using (auth.uid() = user_id);
```

---

# 8.6 Policies — market_items

```sql
create policy "Users can view own market items"
on public.market_items
for select
using (auth.uid() = user_id);

create policy "Users can insert own market items"
on public.market_items
for insert
with check (auth.uid() = user_id);

create policy "Users can update own market items"
on public.market_items
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own market items"
on public.market_items
for delete
using (auth.uid() = user_id);
```

---

# 8.7 Policies — price_history

```sql
create policy "Users can view own price history"
on public.price_history
for select
using (auth.uid() = user_id);

create policy "Users can insert own price history"
on public.price_history
for insert
with check (auth.uid() = user_id);

create policy "Users can update own price history"
on public.price_history
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own price history"
on public.price_history
for delete
using (auth.uid() = user_id);
```

---

## 9. Datos semilla iniciales

---

# 9.1 Unidades

```sql
insert into public.units (name, abbreviation, type, conversion_factor, base_unit, is_system)
values
  ('Unidad', 'und', 'count', 1, 'und', true),
  ('Gramo', 'g', 'weight', 1, 'g', true),
  ('Kilogramo', 'kg', 'weight', 1000, 'g', true),
  ('Libra', 'lb', 'weight', 500, 'g', true),
  ('Mililitro', 'ml', 'volume', 1, 'ml', true),
  ('Litro', 'l', 'volume', 1000, 'ml', true),
  ('Paquete', 'paq', 'package', 1, 'paq', true),
  ('Bolsa', 'bolsa', 'package', 1, 'bolsa', true),
  ('Caja', 'caja', 'package', 1, 'caja', true),
  ('Botella', 'botella', 'package', 1, 'botella', true),
  ('Docena', 'docena', 'count', 12, 'und', true)
on conflict do nothing;
```

---

# 9.2 Categorías del sistema

```sql
insert into public.categories (name, slug, icon, color, is_system, user_id)
values
  ('Granos', 'granos', 'wheat', '#F2C94C', true, null),
  ('Lácteos', 'lacteos', 'milk', '#56CCF2', true, null),
  ('Carnes', 'carnes', 'beef', '#EB5757', true, null),
  ('Bebidas', 'bebidas', 'bottle', '#2D9CDB', true, null),
  ('Aseo', 'aseo', 'sparkles', '#9B51E0', true, null),
  ('Frutas', 'frutas', 'apple', '#27AE60', true, null),
  ('Verduras', 'verduras', 'carrot', '#6FCF97', true, null),
  ('Enlatados', 'enlatados', 'package', '#828282', true, null),
  ('Panadería', 'panaderia', 'bread', '#D35400', true, null),
  ('Mascotas', 'mascotas', 'paw', '#BB6BD9', true, null),
  ('Otros', 'otros', 'box', '#BDBDBD', true, null)
on conflict do nothing;
```

---

# 9.3 Productos base del sistema

> Nota: este seed depende de que las categorías y unidades ya existan.

```sql
insert into public.products (
  name,
  slug,
  category_id,
  default_unit_id,
  is_system,
  user_id
)
select
  'Arroz',
  'arroz',
  c.id,
  u.id,
  true,
  null
from public.categories c, public.units u
where c.slug = 'granos' and u.abbreviation = 'g'
on conflict do nothing;

insert into public.products (name, slug, category_id, default_unit_id, is_system, user_id)
select 'Lentejas', 'lentejas', c.id, u.id, true, null
from public.categories c, public.units u
where c.slug = 'granos' and u.abbreviation = 'g'
on conflict do nothing;

insert into public.products (name, slug, category_id, default_unit_id, is_system, user_id)
select 'Fríjol', 'frijol', c.id, u.id, true, null
from public.categories c, public.units u
where c.slug = 'granos' and u.abbreviation = 'g'
on conflict do nothing;

insert into public.products (name, slug, category_id, default_unit_id, is_system, user_id)
select 'Sal', 'sal', c.id, u.id, true, null
from public.categories c, public.units u
where c.slug = 'granos' and u.abbreviation = 'g'
on conflict do nothing;

insert into public.products (name, slug, category_id, default_unit_id, is_system, user_id)
select 'Aceite', 'aceite', c.id, u.id, true, null
from public.categories c, public.units u
where c.slug = 'granos' and u.abbreviation = 'ml'
on conflict do nothing;

insert into public.products (name, slug, category_id, default_unit_id, is_system, user_id)
select 'Leche', 'leche', c.id, u.id, true, null
from public.categories c, public.units u
where c.slug = 'lacteos' and u.abbreviation = 'ml'
on conflict do nothing;

insert into public.products (name, slug, category_id, default_unit_id, is_system, user_id)
select 'Huevos', 'huevos', c.id, u.id, true, null
from public.categories c, public.units u
where c.slug = 'granos' and u.abbreviation = 'und'
on conflict do nothing;

insert into public.products (name, slug, category_id, default_unit_id, is_system, user_id)
select 'Agua', 'agua', c.id, u.id, true, null
from public.categories c, public.units u
where c.slug = 'bebidas' and u.abbreviation = 'ml'
on conflict do nothing;

insert into public.products (name, slug, category_id, default_unit_id, is_system, user_id)
select 'Panela', 'panela', c.id, u.id, true, null
from public.categories c, public.units u
where c.slug = 'granos' and u.abbreviation = 'g'
on conflict do nothing;

insert into public.products (name, slug, category_id, default_unit_id, is_system, user_id)
select 'Pasta', 'pasta', c.id, u.id, true, null
from public.categories c, public.units u
where c.slug = 'granos' and u.abbreviation = 'g'
on conflict do nothing;

insert into public.products (name, slug, category_id, default_unit_id, is_system, user_id)
select 'Café', 'cafe', c.id, u.id, true, null
from public.categories c, public.units u
where c.slug = 'granos' and u.abbreviation = 'g'
on conflict do nothing;
```

---

## 10. Consultas base para el MVP

---

# 10.1 Obtener mercados del usuario

```sql
select
  id,
  name,
  market_date,
  total_amount,
  notes,
  created_at
from public.markets
where user_id = auth.uid()
order by market_date desc, created_at desc;
```

---

# 10.2 Obtener detalle de un mercado

```sql
select
  mi.id,
  mi.product_name_snapshot,
  mi.quantity,
  u.abbreviation as unit,
  mi.price,
  mi.normalized_quantity,
  mi.normalized_unit_price,
  mi.purchase_date,
  c.name as category_name
from public.market_items mi
left join public.units u on u.id = mi.unit_id
left join public.categories c on c.id = mi.category_id
where mi.market_id = :market_id
  and mi.user_id = auth.uid()
order by mi.created_at asc;
```

---

# 10.3 Comparar último precio vs precio anterior de un producto

```sql
with product_prices as (
  select
    id,
    product_id,
    price,
    normalized_unit_price,
    purchase_date,
    row_number() over (
      partition by product_id
      order by purchase_date desc, created_at desc
    ) as rn
  from public.market_items
  where user_id = auth.uid()
    and product_id = :product_id
)
select
  current_price.price as current_price,
  previous_price.price as previous_price,
  current_price.price - previous_price.price as price_difference,
  case
    when previous_price.price > 0 then
      ((current_price.price - previous_price.price) / previous_price.price) * 100
    else null
  end as percentage_difference,
  current_price.normalized_unit_price as current_normalized_unit_price,
  previous_price.normalized_unit_price as previous_normalized_unit_price
from product_prices current_price
left join product_prices previous_price
  on previous_price.rn = 2
where current_price.rn = 1;
```

---

# 10.4 Comparar dos mercados por total

```sql
select
  current_market.id as current_market_id,
  current_market.name as current_market_name,
  current_market.total_amount as current_total,
  previous_market.id as previous_market_id,
  previous_market.name as previous_market_name,
  previous_market.total_amount as previous_total,
  current_market.total_amount - previous_market.total_amount as amount_difference,
  case
    when previous_market.total_amount > 0 then
      ((current_market.total_amount - previous_market.total_amount) / previous_market.total_amount) * 100
    else null
  end as percentage_difference
from public.markets current_market
join public.markets previous_market
  on previous_market.user_id = current_market.user_id
where current_market.id = :current_market_id
  and previous_market.id = :previous_market_id
  and current_market.user_id = auth.uid();
```

---

# 10.5 Detectar productos faltantes entre mercados

```sql
select
  previous_items.product_id,
  previous_items.product_name_snapshot
from public.market_items previous_items
where previous_items.market_id = :previous_market_id
  and previous_items.user_id = auth.uid()
  and not exists (
    select 1
    from public.market_items current_items
    where current_items.market_id = :current_market_id
      and current_items.user_id = auth.uid()
      and current_items.product_id = previous_items.product_id
  );
```

---

# 10.6 Detectar productos nuevos entre mercados

```sql
select
  current_items.product_id,
  current_items.product_name_snapshot
from public.market_items current_items
where current_items.market_id = :current_market_id
  and current_items.user_id = auth.uid()
  and not exists (
    select 1
    from public.market_items previous_items
    where previous_items.market_id = :previous_market_id
      and previous_items.user_id = auth.uid()
      and previous_items.product_id = current_items.product_id
  );
```

---

## 11. Consideraciones para offline-first

La cola offline no debe vivir inicialmente en Supabase. Debe manejarse en cliente usando IndexedDB.

Estructura local sugerida:

```ts
type OfflineQueueItem = {
  localId: string;
  serverId?: string;
  entityType: 'market' | 'market_item' | 'product' | 'category';
  action: 'create' | 'update' | 'delete';
  payload: Record<string, unknown>;
  status: 'pending' | 'synced' | 'failed' | 'conflict';
  retryCount: number;
  createdAt: string;
  lastSyncAttempt?: string;
};
```

Campos importantes para el backend:

```txt
sync_status
created_at
updated_at
```

Para MVP se puede mantener `sync_status = 'synced'` en registros creados online.

---

## 12. Reglas críticas de negocio soportadas por el schema

### 12.1 Precio total vs precio normalizado

La app no debe comparar únicamente precios totales.

Ejemplo:

```txt
Arroz 500g: $3.000 COP
Arroz 1kg: $5.000 COP
```

Aunque el segundo cuesta más, el precio por gramo es menor.

```txt
$3.000 / 500g = $6/g
$5.000 / 1000g = $5/g
```

Por eso `market_items` guarda:

```txt
price
quantity
unit_id
normalized_quantity
normalized_unit_price
```

---

### 12.2 Snapshot del producto

`product_name_snapshot` evita que cambios futuros en el catálogo dañen el histórico.

Ejemplo:

Si el usuario compró:

```txt
Arroz Diana 500g
```

Y luego renombra el producto a:

```txt
Arroz Diana Premium 500g
```

El mercado anterior debe conservar el nombre original registrado.

---

### 12.3 Mercados comparables

La comparación entre mercados no debe limitarse al total. También debe revisar:

- Productos repetidos.
- Productos faltantes.
- Productos nuevos.
- Variación por producto.
- Variación por categoría.
- Nivel de equivalencia.

La lógica avanzada puede implementarse en queries, funciones SQL o capa de aplicación.

---

## 13. Pendientes para siguientes documentos

Este schema deja preparada la base para los siguientes entregables:

```txt
02_PROJECT_STRUCTURE.md
03_SUPABASE_SETUP.md
04_AUTH_FLOW.md
05_MARKET_CRUD.md
06_PRICE_COMPARISON_LOGIC.md
07_DASHBOARD_METRICS.md
08_OFFLINE_SYNC_STRATEGY.md
```

---

## 14. Recomendación de implementación

El orden correcto de ejecución en Supabase es:

```txt
1. Extensiones
2. Tablas
3. Índices
4. Funciones
5. Triggers
6. RLS
7. Policies
8. Seeds
9. Queries de validación
```

No avanzar a interfaces hasta validar:

- Creación de usuario.
- Creación de mercado.
- Inserción de item.
- Cálculo automático de total.
- Cálculo automático de precio normalizado.
- Aislamiento por usuario vía RLS.

---

## 15. Checklist de validación MVP

```txt
[ ] El usuario puede tener perfil.
[ ] El usuario puede ver categorías del sistema.
[ ] El usuario puede crear categorías propias.
[ ] El usuario puede ver productos del sistema.
[ ] El usuario puede crear productos propios.
[ ] El usuario puede crear mercados.
[ ] El usuario puede agregar items al mercado.
[ ] El total del mercado se recalcula automáticamente.
[ ] El precio normalizado se calcula automáticamente.
[ ] El usuario no puede ver datos de otros usuarios.
[ ] El usuario puede consultar historial por producto.
[ ] La base soporta comparación de mercados.
```

---

## 16. Conclusión técnica

La tabla dominante del sistema es `market_items`. Si esta tabla queda bien diseñada, el resto de la app puede evolucionar sin reprocesos graves.

El núcleo mínimo correcto es:

```txt
user_id
market_id
product_id
product_name_snapshot
quantity
unit_id
price
normalized_quantity
normalized_unit_price
purchase_date
```

Con ese modelo se puede construir el MVP, las gráficas, la comparación de productos, la comparación entre mercados y la futura capa offline-first sin romper arquitectura.
