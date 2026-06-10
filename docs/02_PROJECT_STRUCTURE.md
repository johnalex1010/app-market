# 02_PROJECT_STRUCTURE.md

# App Mercado — Estructura de Proyecto

## 1. Objetivo del documento

Definir la estructura base del proyecto **App Mercado** para implementar una aplicación web responsive tipo PWA con **Next.js App Router**, **TypeScript**, **Tailwind CSS** y **Supabase**.

Este documento establece la organización de carpetas, convenciones de nombres, separación de responsabilidades y criterios técnicos para mantener el código escalable, mantenible y alineado con el MVP.

---

## 2. Stack base del proyecto

```txt
Frontend: Next.js + TypeScript
UI: Tailwind CSS
Backend/BaaS: Supabase
Auth: Supabase Auth
DB: Supabase PostgreSQL
Storage: Supabase Storage
Validaciones: Zod
Formularios: React Hook Form
Gráficas: Recharts
Server State: TanStack Query
Estado local: Zustand
Offline futuro: IndexedDB + Dexie.js
Deploy sugerido: Vercel
```

---

## 3. Principios de arquitectura

La estructura del proyecto debe seguir estos principios:

1. **Separación por dominio funcional**, no por tipo técnico únicamente.
2. **UI desacoplada de lógica de negocio**.
3. **Acceso a datos centralizado en servicios o queries**.
4. **Validaciones compartidas entre formularios y lógica de negocio**.
5. **Tipos TypeScript reutilizables**.
6. **Componentes pequeños, testeables y reutilizables**.
7. **Preparación para PWA/offline sin implementarlo desde el día uno**.
8. **MVP primero, extensibilidad después**.

---

## 4. Estructura general recomendada

```txt
app-mercado/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   │
│   ├── (private)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── markets/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   ├── statistics/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── offline/
│   │       └── page.tsx
│   │
│   ├── api/
│   │   └── health/
│   │       └── route.ts
│   │
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── not-found.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── auth/
│   ├── dashboard/
│   ├── markets/
│   ├── products/
│   ├── categories/
│   ├── charts/
│   ├── forms/
│   └── offline/
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── markets/
│   ├── products/
│   ├── categories/
│   ├── statistics/
│   └── offline/
│
├── lib/
│   ├── supabase/
│   ├── validations/
│   ├── utils/
│   ├── constants/
│   ├── formatters/
│   └── calculations/
│
├── hooks/
│   ├── use-auth-user.ts
│   ├── use-online-status.ts
│   └── use-toast.ts
│
├── stores/
│   ├── auth-store.ts
│   ├── market-draft-store.ts
│   └── sync-store.ts
│
├── types/
│   ├── database.types.ts
│   ├── auth.types.ts
│   ├── market.types.ts
│   ├── product.types.ts
│   ├── category.types.ts
│   ├── unit.types.ts
│   └── common.types.ts
│
├── services/
│   ├── auth.service.ts
│   ├── markets.service.ts
│   ├── market-items.service.ts
│   ├── products.service.ts
│   ├── categories.service.ts
│   ├── units.service.ts
│   └── statistics.service.ts
│
├── queries/
│   ├── markets.queries.ts
│   ├── products.queries.ts
│   ├── categories.queries.ts
│   └── statistics.queries.ts
│
├── mutations/
│   ├── markets.mutations.ts
│   ├── products.mutations.ts
│   └── market-items.mutations.ts
│
├── public/
│   ├── icons/
│   ├── images/
│   └── manifest.json
│
├── docs/
│   ├── 01_DATABASE_SCHEMA.md
│   ├── 02_PROJECT_STRUCTURE.md
│   ├── 03_SUPABASE_SETUP.md
│   ├── 04_AUTH_FLOW.md
│   └── 05_MARKET_CRUD.md
│
├── .env.example
├── .env.local
├── .gitignore
├── middleware.ts
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 5. Estructura de rutas Next.js

Se recomienda usar **Route Groups** para separar rutas públicas y privadas sin afectar la URL final.

### 5.1 Rutas públicas

```txt
app/(auth)/login/page.tsx
app/(auth)/register/page.tsx
app/(auth)/forgot-password/page.tsx
```

URLs resultantes:

```txt
/login
/register
/forgot-password
```

### 5.2 Rutas privadas

```txt
app/(private)/dashboard/page.tsx
app/(private)/markets/page.tsx
app/(private)/markets/new/page.tsx
app/(private)/markets/[id]/page.tsx
app/(private)/products/page.tsx
app/(private)/products/new/page.tsx
app/(private)/products/[id]/page.tsx
app/(private)/categories/page.tsx
app/(private)/statistics/page.tsx
app/(private)/settings/page.tsx
app/(private)/offline/page.tsx
```

URLs resultantes:

```txt
/dashboard
/markets
/markets/new
/markets/[id]
/products
/products/new
/products/[id]
/categories
/statistics
/settings
offline
```

---

## 6. Layouts recomendados

### 6.1 Layout raíz

```txt
app/layout.tsx
```

Responsabilidades:

- Definir metadata global.
- Cargar fuentes.
- Incluir estilos globales.
- Montar providers principales.

### 6.2 Layout de autenticación

```txt
app/(auth)/layout.tsx
```

Responsabilidades:

- Layout limpio para login/registro.
- No mostrar sidebar.
- Centrar formularios.

### 6.3 Layout privado

```txt
app/(private)/layout.tsx
```

Responsabilidades:

- Validar sesión.
- Renderizar sidebar/topbar.
- Proteger navegación privada.
- Mostrar estado de sincronización futuro.

---

## 7. Componentes globales

Carpeta:

```txt
components/ui/
```

Componentes sugeridos:

```txt
Button.tsx
Input.tsx
Select.tsx
Textarea.tsx
Card.tsx
Badge.tsx
Modal.tsx
Dialog.tsx
Dropdown.tsx
Table.tsx
EmptyState.tsx
LoadingState.tsx
ErrorState.tsx
ConfirmDialog.tsx
CurrencyInput.tsx
NumberInput.tsx
DatePicker.tsx
```

Regla:

> `components/ui` no debe conocer Supabase, rutas de negocio ni reglas específicas de mercado.

Debe ser UI pura y reutilizable.

---

## 8. Componentes por dominio

### 8.1 Dashboard

```txt
components/dashboard/
├── KpiCard.tsx
├── MarketSummaryCard.tsx
├── PriceTrendCard.tsx
├── LastMarketCard.tsx
├── ExpenseOverview.tsx
└── DashboardHeader.tsx
```

### 8.2 Mercados

```txt
components/markets/
├── MarketForm.tsx
├── MarketList.tsx
├── MarketCard.tsx
├── MarketItemForm.tsx
├── MarketItemsTable.tsx
├── MarketTotalSummary.tsx
├── MarketComparison.tsx
├── MissingProductsAlert.tsx
└── MarketActions.tsx
```

### 8.3 Productos

```txt
components/products/
├── ProductForm.tsx
├── ProductList.tsx
├── ProductCard.tsx
├── ProductSearch.tsx
├── ProductSelector.tsx
├── ProductPriceHistory.tsx
└── ProductVariationBadge.tsx
```

### 8.4 Categorías

```txt
components/categories/
├── CategoryForm.tsx
├── CategoryList.tsx
├── CategoryBadge.tsx
└── CategorySelector.tsx
```

### 8.5 Gráficas

```txt
components/charts/
├── LinePriceChart.tsx
├── MarketBarChart.tsx
├── CategoryPieChart.tsx
└── ProductVariationChart.tsx
```

### 8.6 Offline futuro

```txt
components/offline/
├── SyncStatusBadge.tsx
├── PendingSyncList.tsx
├── OfflineBanner.tsx
└── SyncRetryButton.tsx
```

---

## 9. Carpeta `features`

La carpeta `features` agrupa lógica funcional por dominio.

```txt
features/markets/
├── market.schema.ts
├── market.constants.ts
├── market.helpers.ts
├── market.mapper.ts
└── market.permissions.ts
```

Ejemplo por dominio:

```txt
features/products/
├── product.schema.ts
├── product.constants.ts
├── product.helpers.ts
├── product.mapper.ts
└── product.permissions.ts
```

Uso recomendado:

- `schema.ts`: validaciones Zod.
- `constants.ts`: constantes del dominio.
- `helpers.ts`: funciones auxiliares.
- `mapper.ts`: transformación DB → UI.
- `permissions.ts`: reglas específicas del usuario o visibilidad.

---

## 10. Servicios de datos

Carpeta:

```txt
services/
```

Los servicios encapsulan llamadas directas a Supabase.

```txt
services/markets.service.ts
services/products.service.ts
services/categories.service.ts
services/units.service.ts
services/statistics.service.ts
```

Ejemplo de responsabilidad:

```txt
markets.service.ts
- getMarketsByUser()
- getMarketById()
- createMarket()
- updateMarket()
- deleteMarket()
```

Regla:

> Ningún componente de UI debería llamar directamente a Supabase.

Correcto:

```txt
Page/Component → Query/Mutation → Service → Supabase
```

Incorrecto:

```txt
Component → Supabase
```

---

## 11. Queries y mutations

### 11.1 Queries

Carpeta:

```txt
queries/
```

Uso:

- Lectura de datos.
- Integración con TanStack Query.
- Cache.
- Revalidación.

Ejemplo:

```txt
queries/markets.queries.ts
queries/products.queries.ts
queries/statistics.queries.ts
```

### 11.2 Mutations

Carpeta:

```txt
mutations/
```

Uso:

- Crear.
- Editar.
- Eliminar.
- Invalidar queries.
- Manejar feedback visual.

Ejemplo:

```txt
mutations/markets.mutations.ts
mutations/products.mutations.ts
mutations/market-items.mutations.ts
```

---

## 12. Librerías internas

Carpeta:

```txt
lib/
```

### 12.1 Supabase

```txt
lib/supabase/
├── client.ts
├── server.ts
├── middleware.ts
└── types.ts
```

Responsabilidades:

- Cliente browser.
- Cliente server.
- Cliente middleware.
- Tipos generados desde Supabase.

### 12.2 Validaciones

```txt
lib/validations/
├── auth.validation.ts
├── market.validation.ts
├── market-item.validation.ts
├── product.validation.ts
└── category.validation.ts
```

### 12.3 Cálculos

```txt
lib/calculations/
├── price-variation.ts
├── market-total.ts
├── normalized-price.ts
├── market-equivalence.ts
└── statistics.ts
```

Funciones clave:

```txt
calculatePriceVariation()
calculateVariationPercentage()
calculateMarketTotal()
calculateNormalizedUnitPrice()
calculateMarketEquivalence()
```

### 12.4 Formatters

```txt
lib/formatters/
├── currency.formatter.ts
├── date.formatter.ts
├── percentage.formatter.ts
└── unit.formatter.ts
```

Ejemplos:

```txt
formatCurrencyCOP(5000) → $5.000
formatPercentage(12.5) → 12,5%
formatShortDate(date) → 10 jun 2026
```

### 12.5 Constantes

```txt
lib/constants/
├── app.constants.ts
├── routes.constants.ts
├── units.constants.ts
├── categories.constants.ts
└── query-keys.constants.ts
```

---

## 13. Tipos TypeScript

Carpeta:

```txt
types/
```

Archivos recomendados:

```txt
types/database.types.ts
types/auth.types.ts
types/market.types.ts
types/market-item.types.ts
types/product.types.ts
types/category.types.ts
types/unit.types.ts
types/statistics.types.ts
types/common.types.ts
```

### 13.1 Tipos base sugeridos

```ts
export type UUID = string;

export type SyncStatus = 'synced' | 'pending' | 'failed' | 'conflict';

export type VariationStatus = 'up' | 'down' | 'equal' | 'new' | 'unknown';

export type UnitType = 'weight' | 'volume' | 'count';
```

### 13.2 Convención

- Tipos de DB: derivados de Supabase.
- Tipos de UI: definidos manualmente.
- Tipos de formularios: derivados de Zod cuando sea posible.

---

## 14. Hooks personalizados

Carpeta:

```txt
hooks/
```

Hooks sugeridos:

```txt
use-auth-user.ts
use-online-status.ts
use-market-total.ts
use-price-variation.ts
use-debounce.ts
use-toast.ts
```

Regla:

> Un hook no debe convertirse en un “servicio disfrazado”. Si accede a datos externos, debe usar queries/mutations.

---

## 15. Stores con Zustand

Carpeta:

```txt
stores/
```

Stores sugeridos:

```txt
auth-store.ts
market-draft-store.ts
sync-store.ts
ui-store.ts
```

### 15.1 `market-draft-store.ts`

Uso:

- Guardar temporalmente un mercado en creación.
- Evitar pérdida de datos antes de guardar.
- Preparar comportamiento offline futuro.

### 15.2 `sync-store.ts`

Uso futuro:

- Estado global online/offline.
- Conteo de elementos pendientes.
- Último intento de sincronización.

---

## 16. Middleware

Archivo:

```txt
middleware.ts
```

Responsabilidades:

- Proteger rutas privadas.
- Redirigir usuarios no autenticados a `/login`.
- Redirigir usuarios autenticados fuera de `/login` y `/register`.
- Refrescar sesión Supabase si aplica.

Rutas privadas iniciales:

```txt
/dashboard
/markets
/products
/categories
/statistics
/settings
/offline
```

---

## 17. Variables de entorno

Archivo:

```txt
.env.example
```

Contenido sugerido:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Regla:

> `SUPABASE_SERVICE_ROLE_KEY` nunca debe usarse en componentes cliente.

---

## 18. Convenciones de nombres

### 18.1 Archivos y carpetas

Usar kebab-case:

```txt
market-form.tsx
price-variation.ts
currency.formatter.ts
market-items.service.ts
```

### 18.2 Componentes React

Usar PascalCase:

```tsx
MarketForm
ProductSearch
KpiCard
```

### 18.3 Funciones y variables

Usar camelCase:

```ts
calculateMarketTotal
normalizedUnitPrice
currentMarket
previousMarket
```

### 18.4 Constantes

Usar UPPER_SNAKE_CASE:

```ts
DEFAULT_CURRENCY
MAX_PRODUCT_NAME_LENGTH
QUERY_KEYS
```

### 18.5 Tipos e interfaces

Usar PascalCase:

```ts
Market
MarketItem
Product
ProductVariation
```

---

## 19. Convención de imports

Orden recomendado:

```ts
// 1. Librerías externas
import { useForm } from 'react-hook-form';

// 2. Componentes internos
import { Button } from '@/components/ui/button';

// 3. Servicios/queries/mutations
import { useCreateMarketMutation } from '@/mutations/markets.mutations';

// 4. Tipos
import type { MarketFormValues } from '@/types/market.types';

// 5. Utilidades
import { formatCurrencyCOP } from '@/lib/formatters/currency.formatter';
```

---

## 20. Alias TypeScript

Configurar en `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Uso:

```ts
import { Button } from '@/components/ui/button';
import { createMarket } from '@/services/markets.service';
```

---

## 21. Orden sugerido de implementación

### Sprint técnico inicial

```txt
1. Crear proyecto Next.js con TypeScript.
2. Configurar Tailwind CSS.
3. Configurar alias @/*.
4. Crear carpetas base.
5. Configurar Supabase client/server.
6. Crear .env.example.
7. Crear layout público y privado.
8. Crear componentes UI mínimos.
9. Configurar middleware de auth.
10. Conectar primera pantalla /dashboard.
```

### Después del setup

```txt
1. Implementar autenticación.
2. Implementar categorías y unidades.
3. Implementar productos.
4. Implementar mercados.
5. Implementar items del mercado.
6. Implementar cálculos.
7. Implementar dashboard MVP.
```

---

## 22. Componentes mínimos para arrancar MVP

```txt
components/ui/Button.tsx
components/ui/Input.tsx
components/ui/Select.tsx
components/ui/Card.tsx
components/ui/Badge.tsx
components/layout/AppSidebar.tsx
components/layout/AppHeader.tsx
components/layout/PrivateLayoutShell.tsx
components/markets/MarketForm.tsx
components/markets/MarketItemForm.tsx
components/products/ProductSelector.tsx
components/dashboard/KpiCard.tsx
```

---

## 23. Rutas mínimas para MVP

```txt
/login
/register
/dashboard
/markets
/markets/new
/markets/[id]
/products
/products/new
```

No implementar todavía:

```txt
/statistics avanzada
/offline avanzado
/fotos
/exportaciones
/OCR
```

---

## 24. Decisión estratégica

La app debe priorizar esta secuencia:

```txt
Datos → Reglas de negocio → CRUD → Cálculos → Dashboard → Gráficas → Offline
```

No se debe iniciar por diseño visual avanzado. Primero debe funcionar bien el flujo central:

```txt
Crear mercado → Agregar productos → Calcular total → Comparar precios → Mostrar variación
```

---

## 25. Resultado esperado de esta estructura

Con esta estructura se busca:

- Reducir deuda técnica temprana.
- Separar UI, lógica, datos y validaciones.
- Facilitar crecimiento hacia PWA/offline.
- Mantener rutas limpias.
- Evitar componentes gigantes.
- Facilitar pruebas y mantenimiento.
- Preparar el proyecto para escalar hacia estadísticas, fotos, OCR y sincronización.

---

## 26. Próximo documento recomendado

Después de este archivo, el siguiente entregable debe ser:

```txt
03_SUPABASE_SETUP.md
```

Ese documento debe cubrir:

- Creación del proyecto Supabase.
- Variables de entorno.
- Configuración de Auth.
- Ejecución del schema SQL.
- Seeds iniciales.
- RLS.
- Storage.
- Cliente Supabase en Next.js.
