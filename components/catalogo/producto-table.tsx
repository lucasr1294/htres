"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { MargenBadge } from "./margen-badge";
import { calcularMargen, TIPO_CAMBIO_DEFAULT } from "@/lib/calculos";
import { formatUSD, formatARS } from "@/lib/utils";
import type { Categoria } from "@prisma/client";

export interface ProductoFila {
  id: string;
  sku: string;
  nombre: string;
  categoria: Categoria;
  proveedor: { nombre: string } | null;
  precioFOBusd: number;
  precioConArancelesUSD: number;
  precioVentaARS: number;
  activo: boolean;
  stock: { disponible: number; umbralAlerta: number } | null;
}

type Columna = "sku" | "nombre" | "categoria" | "precioFOBusd" | "precioConArancelesUSD" | "precioVentaARS" | "margen" | "stock";
type Direccion = "asc" | "desc";

const LABELS_CATEGORIA: Record<Categoria, string> = {
  ILUMINACION:  "Iluminación",
  DECORACION:   "Decoración",
  MUEBLES:      "Muebles",
  TEXTILES:     "Textiles",
  ORGANIZACION: "Organización",
  EXTERIOR:     "Exterior",
  OTROS:        "Otros",
};

interface ProductoTableProps {
  productos: ProductoFila[];
}

export function ProductoTable({ productos }: ProductoTableProps) {
  const [sortCol, setSortCol]       = useState<Columna>("sku");
  const [sortDir, setSortDir]       = useState<Direccion>("asc");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("");
  const [soloAlerta, setSoloAlerta] = useState(false);

  function toggleSort(col: Columna) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  }

  const filas = useMemo(() => {
    let result = productos.map(p => ({
      ...p,
      margen: calcularMargen(p.precioConArancelesUSD, p.precioVentaARS, TIPO_CAMBIO_DEFAULT),
    }));

    if (filtroCategoria) result = result.filter(p => p.categoria === filtroCategoria);
    if (soloAlerta) result = result.filter(p => p.stock && p.stock.disponible <= p.stock.umbralAlerta);

    result.sort((a, b) => {
      let va: string | number = a[sortCol] as string | number ?? 0;
      let vb: string | number = b[sortCol] as string | number ?? 0;
      if (sortCol === "stock") { va = a.stock?.disponible ?? 0; vb = b.stock?.disponible ?? 0; }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [productos, filtroCategoria, soloAlerta, sortCol, sortDir]);

  const categorias = Array.from(new Set(productos.map(p => p.categoria)));

  return (
    <div className="flex flex-col gap-4">
      {/* Filtros */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={filtroCategoria}
          onChange={e => setFiltroCategoria(e.target.value)}
          className="font-sans text-sm px-3 py-1.5 border bg-white"
          style={{ borderColor: "#E2E0DC", borderRadius: "4px", color: "#111111" }}
        >
          <option value="">Todas las categorías</option>
          {categorias.map(c => (
            <option key={c} value={c}>{LABELS_CATEGORIA[c]}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 font-sans text-sm cursor-pointer" style={{ color: "#6B6D72" }}>
          <input
            type="checkbox"
            checked={soloAlerta}
            onChange={e => setSoloAlerta(e.target.checked)}
            className="w-3.5 h-3.5"
          />
          Solo stock bajo
        </label>

        <span className="font-sans ml-auto" style={{ fontSize: "12px", color: "#A8AAAE" }}>
          {filas.length} {filas.length === 1 ? "producto" : "productos"}
        </span>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto border" style={{ borderColor: "#E2E0DC", borderRadius: "4px" }}>
        <table className="w-full bg-white">
          <thead>
            <tr style={{ borderBottom: "1px solid #E2E0DC", backgroundColor: "#F8F7F4" }}>
              {(
                [
                  { col: "sku" as Columna,                   label: "SKU" },
                  { col: "nombre" as Columna,                label: "Nombre" },
                  { col: "categoria" as Columna,             label: "Categoría" },
                  { col: "precioFOBusd" as Columna,          label: "FOB USD" },
                  { col: "precioConArancelesUSD" as Columna, label: "Con aranceles" },
                  { col: "precioVentaARS" as Columna,        label: "Venta ARS" },
                  { col: "margen" as Columna,                label: "Margen" },
                  { col: "stock" as Columna,                 label: "Stock" },
                ] as { col: Columna; label: string }[]
              ).map(({ col, label }) => (
                <th
                  key={col}
                  className="px-4 py-2 text-left cursor-pointer select-none"
                  onClick={() => toggleSort(col)}
                >
                  <div className="flex items-center gap-1">
                    <span
                      className="font-sans font-medium uppercase tracking-[0.08em]"
                      style={{ fontSize: "11px", color: "#6B6D72" }}
                    >
                      {label}
                    </span>
                    {sortCol === col
                      ? (sortDir === "asc"
                          ? <ChevronUp size={10} strokeWidth={1.5} style={{ color: "#6B6D72" }} />
                          : <ChevronDown size={10} strokeWidth={1.5} style={{ color: "#6B6D72" }} />)
                      : <ChevronsUpDown size={10} strokeWidth={1.5} style={{ color: "#D6D7D9" }} />
                    }
                  </div>
                </th>
              ))}
              <th className="px-4 py-2" />
            </tr>
          </thead>

          <tbody>
            {filas.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center font-sans text-sm" style={{ color: "#A8AAAE" }}>
                  No hay productos con esos filtros
                </td>
              </tr>
            )}
            {filas.map(p => {
              const enAlerta = p.stock && p.stock.disponible <= p.stock.umbralAlerta;
              return (
                <tr
                  key={p.id}
                  className="hover:bg-[#F5F4F1] transition-colors duration-150"
                  style={{
                    borderBottom: "1px solid #E2E0DC",
                    borderLeft: enAlerta ? "2px solid #1A1A1A" : "2px solid transparent",
                  }}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm" style={{ color: "#6B6D72" }}>{p.sku}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-sans text-sm" style={{ color: "#111111" }}>{p.nombre}</span>
                    {!p.activo && (
                      <span className="ml-2 font-sans uppercase" style={{ fontSize: "10px", color: "#A8AAAE", backgroundColor: "#F0EDE8", padding: "1px 4px" }}>
                        inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-sans text-sm" style={{ color: "#6B6D72" }}>
                      {LABELS_CATEGORIA[p.categoria]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm" style={{ color: "#111111" }}>{formatUSD(p.precioFOBusd)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm" style={{ color: "#111111" }}>{formatUSD(p.precioConArancelesUSD)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm" style={{ color: "#111111" }}>{formatARS(p.precioVentaARS)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <MargenBadge margen={p.margen} />
                  </td>
                  <td className="px-4 py-3">
                    {p.stock
                      ? <span className="font-mono text-sm" style={{ color: enAlerta ? "#5C2E2E" : "#111111" }}>
                          {p.stock.disponible}
                        </span>
                      : <span style={{ fontSize: "12px", color: "#A8AAAE" }}>—</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/catalogo/${p.id}`}
                      className="font-sans text-sm transition-colors duration-150"
                      style={{ color: "#A8AAAE" }}
                    >
                      Ver →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
