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

## Archivos de referencia disponibles
- `SPEC.md` — qué hace la app, entidades del negocio, flujos principales
- `STACK.md` — stack tecnológico y decisiones de arquitectura
- `skills/stock.md` — cómo trabajar con stock
- `skills/importacion.md` — cómo procesar órdenes de importación
- `skills/reportes.md` — cómo generar reportes
- `skills/proveedor.md` — cómo gestionar proveedores

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
