# CLAUDE.md — Contexto del Proyecto

## ¿Qué es este proyecto?
Una web app interna para gestionar un negocio de importación y venta de artículos de decoración del hogar desde China. Permite a los socios ver stock, gestionar órdenes, registrar proveedores y analizar el negocio en tiempo real.

## Socios / Usuarios
- 2 a 5 usuarios con roles diferenciados (admin y socio)
- Acceso desde browser (desktop y mobile)

## Reglas generales para Claude Code
- Siempre usar **TypeScript** — sin excepción
- Siempre usar **Prisma** para acceder a la base de datos, nunca SQL crudo
- Los componentes van en `/components`, las páginas en `/app`, los endpoints en `/app/api`
- Usar **Tailwind CSS** para todos los estilos — sin CSS custom salvo casos excepcionales
- Antes de crear un componente nuevo, verificar si ya existe uno similar en `/components`
- Comentar el código en **español**
- Nombres de variables y funciones en **camelCase en inglés** (ej: `stockItem`, `getOrders`)
- Nombres de archivos en **kebab-case** (ej: `stock-table.tsx`, `get-orders.ts`)

## Estructura del proyecto
```
/
├── app/                  ← páginas y API routes (Next.js App Router)
│   ├── dashboard/
│   ├── stock/
│   ├── ordenes/
│   ├── proveedores/
│   └── api/
├── components/           ← componentes reutilizables
├── lib/                  ← utilidades, helpers, configuración de Prisma
├── prisma/               ← schema de la DB y migraciones
├── skills/               ← skills de referencia para agentes Claude
├── CLAUDE.md             ← este archivo
├── SPEC.md               ← especificación funcional
└── STACK.md              ← decisiones tecnológicas
```

## MCP Servers configurados

El proyecto incluye un `.mcp.json` en la raíz con los servidores MCP activos. Claude Code los carga automáticamente al abrir el proyecto.

| Server | Uso |
|--------|-----|
| **context7** | Documentación actualizada de librerías en tiempo real |

### Cómo usar context7
Agregar `use context7` al final de cualquier prompt cuando se trabaje con librerías externas:
```
Implementá paginación en la tabla de stock con TanStack Table. use context7
Configurá Supabase Auth con middleware en Next.js 14. use context7
Creá una migración de Prisma para agregar el modelo Venta. use context7
```

---

## Archivos de referencia disponibles
- `SPEC.md` — qué hace la app, entidades del negocio, flujos principales
- `STACK.md` — stack tecnológico y decisiones de arquitectura
- `skills/frontend.md` — sistema de diseño completo: colores, tipografía, componentes, reglas visuales
- `skills/dashboard.md` — KPIs, alertas, secciones y comportamiento del dashboard
- `skills/catalogo.md` — entidad producto, variantes, SKUs, cálculo de margen
- `skills/stock.md` — reglas de inventario, movimientos, UI de la tabla
- `skills/importacion.md` — ciclo de vida de una orden, cálculo de costos, UI
- `skills/pagos.md` — pagos por orden, anticipo/saldo, lógica financiera
- `skills/proveedor.md` — ficha de proveedor, ciudades clave de China
- `skills/reportes.md` — KPIs del dashboard, exportación, colores para gráficos

### Cuándo leer cada skill
| Tarea | Skill a leer primero |
|-------|----------------------|
| Cualquier componente visual | `skills/frontend.md` |
| Tablas, cards, layouts | `skills/frontend.md` |
| Dashboard y KPIs | `skills/dashboard.md` |
| Catálogo / fichas de producto | `skills/catalogo.md` |
| Lógica de inventario | `skills/stock.md` |
| Órdenes a proveedores | `skills/importacion.md` |
| Pagos y finanzas | `skills/pagos.md` |
| Fichas de proveedor | `skills/proveedor.md` |
| Dashboards y gráficos | `skills/reportes.md` + `skills/frontend.md` |

## Flujo de trabajo
1. Leer `SPEC.md` para entender el dominio antes de construir algo nuevo
2. Leer el skill correspondiente a la tarea antes de codear
3. Crear migraciones de Prisma al modificar el schema (`npx prisma migrate dev`)
4. Hacer commit con mensajes descriptivos en español

## Convenciones de commits
```
feat: agrega tabla de stock
fix: corrige cálculo de costo con flete
refactor: simplifica componente de órdenes
```

## Variables de entorno requeridas
```
DATABASE_URL=          # URL de PostgreSQL (local o Supabase)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
