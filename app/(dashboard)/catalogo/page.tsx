import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductoTable } from "@/components/catalogo/producto-table";
import type { ProductoFila } from "@/components/catalogo/producto-table";

export const revalidate = 60;

async function getProductos(): Promise<ProductoFila[]> {
  const rows = await prisma.producto.findMany({
    include: {
      stock:    { select: { disponible: true, umbralAlerta: true } },
      proveedor:{ select: { id: true, nombre: true } },
    },
    orderBy: { creadoEn: "desc" },
  });

  // Convertir Decimal a number para el componente cliente
  return rows.map(p => ({
    ...p,
    precioFOBusd:          Number(p.precioFOBusd),
    precioConArancelesUSD: Number(p.precioConArancelesUSD),
    precioVentaARS:        Number(p.precioVentaARS),
  }));
}

export default async function CatalogoPage() {
  const productos = await getProductos();

  return (
    <div className="space-y-6">
      {/* Header de sección */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-sans text-sm" style={{ color: "#6B6D72" }}>
            {productos.length} {productos.length === 1 ? "producto" : "productos"} en el catálogo
          </p>
        </div>
        <Link
          href="/catalogo/nuevo"
          className="flex items-center gap-2 px-4 py-2 font-sans font-medium text-sm text-white transition-opacity hover:opacity-85"
          style={{ backgroundColor: "#111111", borderRadius: 0 }}
        >
          <Plus size={14} strokeWidth={1.5} />
          Nuevo producto
        </Link>
      </div>

      {/* Tabla */}
      {productos.length === 0
        ? <EstadoVacio />
        : <ProductoTable productos={productos} />
      }
    </div>
  );
}

function EstadoVacio() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-16 border"
      style={{ borderColor: "#E2E0DC", backgroundColor: "#FFFFFF" }}
    >
      <p className="font-display font-bold text-lg" style={{ color: "#111111" }}>
        El catálogo está vacío
      </p>
      <p className="font-sans text-sm" style={{ color: "#6B6D72" }}>
        Agregá tu primer producto para empezar.
      </p>
      <Link
        href="/catalogo/nuevo"
        className="mt-2 px-4 py-2 font-sans font-medium text-sm text-white"
        style={{ backgroundColor: "#111111", borderRadius: 0 }}
      >
        Agregar producto
      </Link>
    </div>
  );
}
