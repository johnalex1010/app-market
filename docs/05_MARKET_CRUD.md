# 05_MARKET_CRUD.md

# CRUD de Mercados e Items — App Mercado

## 1. Objetivo

Definir la implementación funcional y técnica del módulo principal de la app: **mercados** y **productos registrados dentro de cada mercado**.

Este módulo es el núcleo del MVP. Sin mercados e items no hay histórico, comparación, dashboard ni estadísticas.

El objetivo es permitir que un usuario autenticado pueda:

- Crear un mercado.
- Editar información general del mercado.
- Eliminar un mercado.
- Agregar productos al mercado.
- Editar items del mercado.
- Eliminar items.
- Calcular total del mercado.
- Calcular precio normalizado por unidad.
- Comparar productos contra registros anteriores.
- Preparar la base para comparar mercados completos.

---

## 2. Alcance del módulo

### Incluye en MVP

- Listado de mercados del usuario.
- Creación de mercado.
- Detalle de mercado.
- Edición de mercado.
- Eliminación de mercado.
- Agregar item/producto a un mercado.
- Editar item del mercado.
- Eliminar item.
- Cálculo automático del total del mercado.
- Cálculo de `normalized_quantity`.
- Cálculo de `normalized_unit_price`.
- Comparación básica del producto contra su registro anterior.
- Estados visuales: subió, bajó, igual.

### No incluye en esta fase

- Gráficas avanzadas.
- Offline-first.
- Fotos de productos.
- OCR de facturas.
- Escaneo de código de barras.
- Comparación inteligente completa entre mercados.
- Predicción de precios.

Estos puntos quedan para fases posteriores.

---

## 3. Tablas involucradas

Este módulo trabaja principalmente con:

```txt
markets
market_items
products
categories
units
```

Relación principal:

```txt
profiles/auth.users
   └── markets
          └── market_items
                 ├── products
                 ├── categories
                 └── units
```

---

## 4. Rutas del módulo

Estructura sugerida usando Next.js App Router:

```txt
app/
  (private)/
    markets/
      page.tsx
      new/
        page.tsx
      [marketId]/
        page.tsx
        edit/
          page.tsx
```

### Rutas funcionales

| Ruta | Descripción | Tipo |
|---|---|---|
| `/markets` | Listado de mercados | Privada |
| `/markets/new` | Crear mercado | Privada |
| `/markets/[marketId]` | Detalle del mercado | Privada |
| `/markets/[marketId]/edit` | Editar mercado | Privada |

---

## 5. Estructura de archivos recomendada

```txt
src/
  app/
    (private)/
      markets/
        page.tsx
        new/
          page.tsx
        [marketId]/
          page.tsx
          edit/
            page.tsx

  components/
    markets/
      MarketCard.tsx
      MarketForm.tsx
      MarketList.tsx
      MarketHeader.tsx
      MarketSummary.tsx
      MarketDeleteDialog.tsx

    market-items/
      MarketItemForm.tsx
      MarketItemList.tsx
      MarketItemRow.tsx
      MarketItemDeleteDialog.tsx
      ProductPriceVariationBadge.tsx

  features/
    markets/
      actions.ts
      queries.ts
      validations.ts
      types.ts
      utils.ts

    market-items/
      actions.ts
      queries.ts
      validations.ts
      types.ts
      calculations.ts

  lib/
    supabase/
      client.ts
      server.ts
```

---

## 6. Modelo funcional de mercado

Un mercado representa una compra agrupada.

Ejemplos:

```txt
Mercado Junio 2026
Mercado D1 - Semana 1
Mercado Tienda Barrio
Mercado Mensual
```

Campos clave:

```txt
id
user_id
name
market_date
total_amount
notes
created_at
updated_at
```

### Reglas funcionales

- Todo mercado pertenece a un usuario.
- El usuario solo puede ver sus propios mercados.
- `market_date` debe tener fecha por defecto del día actual.
- `total_amount` se calcula desde los items.
- El usuario puede crear varios mercados el mismo día.
- El nombre puede ser manual o autogenerado.

Nombre automático sugerido:

```txt
Mercado del 10/06/2026
```

---

## 7. Modelo funcional de item del mercado

Un item representa un producto comprado dentro de un mercado.

Ejemplo:

```txt
Producto: Arroz Diana
Cantidad: 500
Unidad: gramos
Precio: $3.000 COP
```

Campos clave:

```txt
id
market_id
user_id
product_id
product_name_snapshot
category_id
quantity
unit_id
price
normalized_quantity
normalized_unit_price
purchase_date
sync_status
created_at
updated_at
```

### Reglas funcionales

- Todo item pertenece a un mercado.
- Todo item pertenece a un usuario.
- Todo item debe tener producto, cantidad, unidad y precio.
- `price` representa el precio total pagado por ese item.
- `normalized_quantity` se calcula según la unidad base.
- `normalized_unit_price` se calcula automáticamente.
- `purchase_date` puede heredar la fecha del mercado.
- `product_name_snapshot` protege el histórico si el nombre del producto cambia después.

---

## 8. Flujo: crear mercado

### Paso a paso

1. Usuario entra a `/markets`.
2. Clic en **Nuevo mercado**.
3. App abre `/markets/new`.
4. Usuario ingresa:
   - Nombre del mercado.
   - Fecha.
   - Notas opcionales.
5. Usuario guarda.
6. App crea registro en `markets`.
7. App redirige a `/markets/[marketId]`.
8. Usuario puede empezar a agregar productos.

### Campos del formulario

```txt
name: string
market_date: date
notes?: string
```

### Validaciones

```txt
name: requerido, mínimo 3 caracteres
market_date: requerido
notes: opcional, máximo 500 caracteres
```

---

## 9. Flujo: agregar producto al mercado

### Paso a paso

1. Usuario entra al detalle del mercado.
2. Clic en **Agregar producto**.
3. Selecciona producto existente o crea uno nuevo.
4. Ingresa cantidad.
5. Selecciona unidad.
6. Ingresa precio pagado.
7. Guarda.
8. App calcula:
   - `normalized_quantity`
   - `normalized_unit_price`
9. App crea registro en `market_items`.
10. App recalcula total del mercado.
11. App muestra si el producto subió, bajó o se mantuvo igual frente al registro anterior.

### Campos del formulario

```txt
product_id: uuid
category_id: uuid
quantity: number
unit_id: uuid
price: number
notes?: string
```

### Validaciones

```txt
product_id: requerido
quantity: requerido, mayor a 0
unit_id: requerido
price: requerido, mayor a 0
notes: opcional, máximo 500 caracteres
```

---

## 10. Validaciones con Zod

### `features/markets/validations.ts`

```ts
import { z } from 'zod';

export const marketSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener mínimo 3 caracteres')
    .max(120, 'El nombre no debe superar 120 caracteres'),
  market_date: z.string().min(1, 'La fecha es obligatoria'),
  notes: z
    .string()
    .max(500, 'Las notas no deben superar 500 caracteres')
    .optional()
    .nullable(),
});

export type MarketFormValues = z.infer<typeof marketSchema>;
```

### `features/market-items/validations.ts`

```ts
import { z } from 'zod';

export const marketItemSchema = z.object({
  product_id: z.string().uuid('Producto inválido'),
  category_id: z.string().uuid('Categoría inválida'),
  quantity: z.coerce
    .number()
    .positive('La cantidad debe ser mayor a 0'),
  unit_id: z.string().uuid('Unidad inválida'),
  price: z.coerce
    .number()
    .positive('El precio debe ser mayor a 0'),
  notes: z
    .string()
    .max(500, 'Las notas no deben superar 500 caracteres')
    .optional()
    .nullable(),
});

export type MarketItemFormValues = z.infer<typeof marketItemSchema>;
```

---

## 11. Tipos TypeScript

### `features/markets/types.ts`

```ts
export type Market = {
  id: string;
  user_id: string;
  name: string;
  market_date: string;
  total_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
```

### `features/market-items/types.ts`

```ts
export type MarketItem = {
  id: string;
  market_id: string;
  user_id: string;
  product_id: string;
  product_name_snapshot: string;
  category_id: string;
  quantity: number;
  unit_id: string;
  price: number;
  normalized_quantity: number;
  normalized_unit_price: number;
  image_url: string | null;
  notes: string | null;
  purchase_date: string;
  sync_status: 'synced' | 'pending' | 'failed' | 'conflict';
  created_at: string;
  updated_at: string;
};
```

---

## 12. Cálculos base

### Precio normalizado

```ts
export function calculateNormalizedQuantity(
  quantity: number,
  conversionFactor: number
): number {
  return quantity * conversionFactor;
}

export function calculateNormalizedUnitPrice(
  price: number,
  normalizedQuantity: number
): number {
  if (normalizedQuantity <= 0) return 0;
  return price / normalizedQuantity;
}
```

### Ejemplo práctico

```txt
Arroz 500g = $3.000
normalized_quantity = 500
normalized_unit_price = 3000 / 500
normalized_unit_price = $6 por gramo
```

```txt
Arroz 1kg = $5.000
conversion_factor kg -> g = 1000
normalized_quantity = 1 * 1000
normalized_unit_price = 5000 / 1000
normalized_unit_price = $5 por gramo
```

Resultado: el producto de 1kg cuesta más en total, pero es más barato por gramo.

---

## 13. Cálculo total del mercado

El total del mercado debe calcularse sumando todos los items.

```ts
export function calculateMarketTotal(items: { price: number }[]): number {
  return items.reduce((total, item) => total + item.price, 0);
}
```

### Actualización recomendada

Cada vez que se cree, edite o elimine un item:

1. Consultar items del mercado.
2. Sumar precios.
3. Actualizar `markets.total_amount`.

Para MVP esto puede hacerse desde Server Actions.

Para una fase más robusta, puede migrarse a trigger SQL.

---

## 14. Comparación básica de producto

### Regla

Para saber si un producto subió o bajó, comparar el último registro contra el registro inmediatamente anterior del mismo usuario y mismo producto.

```ts
export function calculatePriceVariation(currentPrice: number, previousPrice: number) {
  const difference = currentPrice - previousPrice;
  const percentage = previousPrice > 0
    ? (difference / previousPrice) * 100
    : 0;

  const status = difference > 0
    ? 'up'
    : difference < 0
      ? 'down'
      : 'equal';

  return {
    difference,
    percentage,
    status,
  };
}
```

### Estados visuales

```txt
up    -> rojo   -> subió
down  -> verde  -> bajó
equal -> gris   -> igual
```

Nota de negocio: en esta app, rojo no significa error técnico. Significa impacto negativo en precio. El dinero también tiene semáforo.

---

## 15. Queries Supabase

### Obtener mercados del usuario

```ts
export async function getMarkets(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('markets')
    .select('*')
    .order('market_date', { ascending: false });

  if (error) throw error;

  return data;
}
```

### Obtener detalle de mercado

```ts
export async function getMarketById(
  supabase: SupabaseClient,
  marketId: string
) {
  const { data, error } = await supabase
    .from('markets')
    .select('*')
    .eq('id', marketId)
    .single();

  if (error) throw error;

  return data;
}
```

### Obtener items de un mercado

```ts
export async function getMarketItems(
  supabase: SupabaseClient,
  marketId: string
) {
  const { data, error } = await supabase
    .from('market_items')
    .select(`
      *,
      products(id, name),
      categories(id, name),
      units(id, name, abbreviation, type)
    `)
    .eq('market_id', marketId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data;
}
```

### Obtener último registro anterior de un producto

```ts
export async function getPreviousProductItem(
  supabase: SupabaseClient,
  productId: string,
  currentItemId?: string
) {
  let query = supabase
    .from('market_items')
    .select('*')
    .eq('product_id', productId)
    .order('purchase_date', { ascending: false })
    .limit(1);

  if (currentItemId) {
    query = query.neq('id', currentItemId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data?.[0] ?? null;
}
```

---

## 16. Server Actions sugeridas

### `features/markets/actions.ts`

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { marketSchema } from './validations';

export async function createMarket(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const payload = {
    name: String(formData.get('name') ?? ''),
    market_date: String(formData.get('market_date') ?? ''),
    notes: String(formData.get('notes') ?? '') || null,
  };

  const parsed = marketSchema.safeParse(payload);

  if (!parsed.success) {
    throw new Error('Datos inválidos');
  }

  const { data, error } = await supabase
    .from('markets')
    .insert({
      ...parsed.data,
      user_id: user.id,
      total_amount: 0,
    })
    .select('id')
    .single();

  if (error) throw error;

  revalidatePath('/markets');

  return data;
}
```

---

## 17. Acción para crear item

### `features/market-items/actions.ts`

```ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { marketItemSchema } from './validations';
import {
  calculateNormalizedQuantity,
  calculateNormalizedUnitPrice,
} from './calculations';

export async function createMarketItem(marketId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const payload = {
    product_id: String(formData.get('product_id') ?? ''),
    category_id: String(formData.get('category_id') ?? ''),
    quantity: Number(formData.get('quantity') ?? 0),
    unit_id: String(formData.get('unit_id') ?? ''),
    price: Number(formData.get('price') ?? 0),
    notes: String(formData.get('notes') ?? '') || null,
  };

  const parsed = marketItemSchema.safeParse(payload);

  if (!parsed.success) {
    throw new Error('Datos inválidos');
  }

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('name')
    .eq('id', parsed.data.product_id)
    .single();

  if (productError) throw productError;

  const { data: unit, error: unitError } = await supabase
    .from('units')
    .select('conversion_factor')
    .eq('id', parsed.data.unit_id)
    .single();

  if (unitError) throw unitError;

  const normalizedQuantity = calculateNormalizedQuantity(
    parsed.data.quantity,
    Number(unit.conversion_factor)
  );

  const normalizedUnitPrice = calculateNormalizedUnitPrice(
    parsed.data.price,
    normalizedQuantity
  );

  const { error } = await supabase
    .from('market_items')
    .insert({
      market_id: marketId,
      user_id: user.id,
      product_id: parsed.data.product_id,
      product_name_snapshot: product.name,
      category_id: parsed.data.category_id,
      quantity: parsed.data.quantity,
      unit_id: parsed.data.unit_id,
      price: parsed.data.price,
      normalized_quantity: normalizedQuantity,
      normalized_unit_price: normalizedUnitPrice,
      notes: parsed.data.notes,
      purchase_date: new Date().toISOString(),
      sync_status: 'synced',
    });

  if (error) throw error;

  await updateMarketTotal(marketId);

  revalidatePath(`/markets/${marketId}`);
}
```

---

## 18. Acción para actualizar total del mercado

```ts
export async function updateMarketTotal(marketId: string) {
  const supabase = await createClient();

  const { data: items, error: itemsError } = await supabase
    .from('market_items')
    .select('price')
    .eq('market_id', marketId);

  if (itemsError) throw itemsError;

  const total = items.reduce((sum, item) => sum + Number(item.price), 0);

  const { error: updateError } = await supabase
    .from('markets')
    .update({ total_amount: total })
    .eq('id', marketId);

  if (updateError) throw updateError;

  return total;
}
```

---

## 19. Componentes principales

### `MarketCard.tsx`

Responsabilidad:

- Mostrar nombre del mercado.
- Mostrar fecha.
- Mostrar total.
- Enlazar al detalle.

```txt
Mercado Junio 2026
10/06/2026
Total: $180.000 COP
```

### `MarketForm.tsx`

Responsabilidad:

- Crear o editar mercado.
- Validar campos.
- Enviar datos a Server Action.

### `MarketSummary.tsx`

Responsabilidad:

- Mostrar total del mercado.
- Mostrar cantidad de productos.
- Mostrar fecha.
- Mostrar variación futura contra mercado anterior.

### `MarketItemForm.tsx`

Responsabilidad:

- Seleccionar producto.
- Seleccionar unidad.
- Ingresar cantidad.
- Ingresar precio.
- Guardar item.

### `MarketItemRow.tsx`

Responsabilidad:

- Mostrar producto.
- Mostrar cantidad/unidad.
- Mostrar precio total.
- Mostrar precio normalizado.
- Mostrar variación frente al registro anterior.
- Acciones editar/eliminar.

---

## 20. UI mínima para `/markets`

Contenido requerido:

```txt
Título: Mis mercados
Botón: Nuevo mercado
Listado de MarketCard
Estado vacío
```

### Estado vacío

```txt
Aún no tienes mercados registrados.
Crea tu primer mercado para empezar a comparar precios.
[Crear mercado]
```

---

## 21. UI mínima para `/markets/new`

Contenido requerido:

```txt
Título: Nuevo mercado
Formulario:
- Nombre
- Fecha
- Notas
Botones:
- Cancelar
- Crear mercado
```

---

## 22. UI mínima para `/markets/[marketId]`

Contenido requerido:

```txt
Header del mercado
Resumen del mercado
Botón Agregar producto
Lista de productos/items
Total acumulado
Acciones editar/eliminar
```

Estructura visual sugerida:

```txt
Mercado Junio 2026
Fecha: 10/06/2026
Total: $180.000 COP
Productos: 12

[Agregar producto]

Producto      Cantidad      Precio      Precio unitario      Variación
Arroz         500g          $3.000      $6/g                 🔴 +10%
Leche         1L            $4.500      $4.5/ml              🟢 -5%
```

---

## 23. Formato de moneda

Crear helper global:

```ts
export function formatCurrencyCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}
```

Uso:

```ts
formatCurrencyCOP(180000)
```

Resultado:

```txt
$180.000
```

---

## 24. Formato de porcentaje

```ts
export function formatPercentage(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
}
```

Ejemplo:

```txt
+12.50%
-8.30%
0.00%
```

---

## 25. Eliminación de mercados

### Regla recomendada para MVP

Eliminar un mercado debe eliminar también sus items.

Esto debe estar soportado desde la base de datos con relación `ON DELETE CASCADE` entre:

```txt
markets.id -> market_items.market_id
```

### UX obligatoria

Antes de eliminar, mostrar confirmación:

```txt
¿Eliminar este mercado?
Esta acción eliminará también todos los productos registrados dentro del mercado.
```

Botones:

```txt
Cancelar
Eliminar mercado
```

---

## 26. Eliminación de items

Al eliminar un item:

1. Se elimina registro de `market_items`.
2. Se recalcula `markets.total_amount`.
3. Se refresca el detalle del mercado.

Confirmación sugerida:

```txt
¿Eliminar este producto del mercado?
```

---

## 27. Edición de items

Cuando el usuario edita un item, puede cambiar:

```txt
Producto
Cantidad
Unidad
Precio
Notas
```

Después de editar:

1. Recalcular `normalized_quantity`.
2. Recalcular `normalized_unit_price`.
3. Actualizar `product_name_snapshot` si cambió el producto.
4. Recalcular total del mercado.
5. Revalidar vista.

---

## 28. Orden recomendado de implementación

### Paso 1

Crear rutas:

```txt
/markets
/markets/new
/markets/[marketId]
```

### Paso 2

Crear queries:

```txt
getMarkets
getMarketById
getMarketItems
```

### Paso 3

Crear formularios:

```txt
MarketForm
MarketItemForm
```

### Paso 4

Crear Server Actions:

```txt
createMarket
updateMarket
deleteMarket
createMarketItem
updateMarketItem
deleteMarketItem
updateMarketTotal
```

### Paso 5

Crear cálculos:

```txt
calculateNormalizedQuantity
calculateNormalizedUnitPrice
calculateMarketTotal
calculatePriceVariation
```

### Paso 6

Conectar UI:

```txt
MarketList
MarketCard
MarketSummary
MarketItemList
MarketItemRow
```

---

## 29. Checklist de aceptación

El módulo se considera terminado cuando:

- [ ] El usuario puede ver solo sus mercados.
- [ ] El usuario puede crear un mercado.
- [ ] El usuario puede editar un mercado.
- [ ] El usuario puede eliminar un mercado.
- [ ] El usuario puede entrar al detalle de un mercado.
- [ ] El usuario puede agregar productos/items.
- [ ] El usuario puede editar items.
- [ ] El usuario puede eliminar items.
- [ ] El total del mercado se actualiza correctamente.
- [ ] El precio normalizado se calcula correctamente.
- [ ] El item guarda `product_name_snapshot`.
- [ ] El item guarda `purchase_date`.
- [ ] El item guarda `sync_status = synced`.
- [ ] La UI muestra precios en COP.
- [ ] La UI muestra estado vacío.
- [ ] La UI es responsive.
- [ ] Las rutas están protegidas.
- [ ] RLS bloquea acceso a datos de otros usuarios.

---

## 30. Casos de prueba funcionales

### Caso 1: crear mercado

```txt
Dado un usuario autenticado
Cuando crea un mercado llamado "Mercado Junio 2026"
Entonces el mercado aparece en /markets
Y el total inicial es $0 COP
```

### Caso 2: agregar producto

```txt
Dado un mercado existente
Cuando el usuario agrega Arroz 500g por $3.000
Entonces el producto aparece en el detalle
Y el total del mercado es $3.000 COP
```

### Caso 3: agregar segundo producto

```txt
Dado un mercado con Arroz por $3.000
Cuando el usuario agrega Leche por $4.500
Entonces el total del mercado es $7.500 COP
```

### Caso 4: eliminar item

```txt
Dado un mercado con total de $7.500
Cuando el usuario elimina Leche de $4.500
Entonces el total queda en $3.000 COP
```

### Caso 5: precio normalizado

```txt
Dado un producto de 1kg por $5.000
Cuando la unidad tiene conversion_factor 1000
Entonces normalized_quantity es 1000
Y normalized_unit_price es 5
```

### Caso 6: acceso seguro

```txt
Dado un usuario A y un usuario B
Cuando usuario A intenta acceder a un mercado de usuario B
Entonces Supabase debe bloquear la consulta por RLS
```

---

## 31. Riesgos técnicos

### Riesgo 1: duplicar lógica de totales

Si el total se calcula en muchos lugares, aparecerán inconsistencias.

Mitigación:

- Centralizar cálculo en `updateMarketTotal`.
- En el futuro migrar a trigger SQL.

### Riesgo 2: comparar precios sin normalizar

Comparar solo precio total puede generar conclusiones falsas.

Mitigación:

- Guardar siempre `normalized_quantity`.
- Guardar siempre `normalized_unit_price`.
- Mostrar precio total y precio normalizado.

### Riesgo 3: perder histórico si cambia el nombre del producto

Si el producto se renombra, los registros antiguos podrían cambiar de contexto.

Mitigación:

- Guardar `product_name_snapshot` en cada item.

### Riesgo 4: eliminar mercados por accidente

Mitigación:

- Confirmación explícita.
- Texto claro de impacto.
- No usar eliminación silenciosa.

---

## 32. Decisión técnica recomendada

Para el MVP, la lógica de creación, edición, eliminación y cálculo puede manejarse con **Server Actions**.

Razón:

- Menos API routes innecesarias.
- Mejor integración con App Router.
- Validación server-side directa.
- Revalidación de rutas simple.
- Menor superficie de exposición.

Cuando el sistema crezca, los cálculos más sensibles pueden migrarse a:

```txt
PostgreSQL functions
Triggers
Supabase Edge Functions
```

Pero para esta fase, Server Actions es suficiente y pragmático.

---

## 33. Resultado esperado de la fase

Al finalizar este módulo, la app ya debe tener valor funcional real.

El usuario podrá crear mercados, registrar productos, ver cuánto gastó y empezar a construir histórico de precios.

Este es el primer punto donde la app deja de ser maqueta y empieza a comportarse como producto.
