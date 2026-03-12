import Link from "next/link";
import { Ship } from "lucide-react";
import type { EstadoOrden } from "@prisma/client";
import { EstadoBadge } from "@/components/shared/estado-badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export interface OrdenEnCamino {
  id: string;
  proveedor: string;
  cantidadItems: number;
  estado: EstadoOrden;
  fechaEstimada: Date | null;
  tracking: string | null;
}

interface OrdenesEnCaminoProps {
  ordenes: OrdenEnCamino[];
}

export function OrdenesEnCamino({ ordenes }: OrdenesEnCaminoProps) {
  return (
    <div
      className="p-6 border flex flex-col gap-4"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E0DC", borderRadius: "4px" }}
    >
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <p
          className="font-sans font-medium uppercase tracking-[0.08em]"
          style={{ fontSize: "11px", color: "#6B6D72" }}
        >
          Órdenes en camino
        </p>
        {ordenes.length > 0 && (
          <Link
            href="/ordenes"
            className="font-sans transition-colors duration-150"
            style={{ fontSize: "12px", color: "#A8AAAE" }}
          >
            Ver todas →
          </Link>
        )}
      </div>

      {/* Estado vacío */}
      {ordenes.length === 0 && (
        <div className="flex items-center gap-3 py-4">
          <Ship size={16} strokeWidth={1.5} style={{ color: "#A8AAAE" }} />
          <p className="font-sans text-sm" style={{ color: "#A8AAAE" }}>
            No hay órdenes activas en camino
          </p>
        </div>
      )}

      {/* Tabla de órdenes — ordenadas por fecha estimada ascendente */}
      {ordenes.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #E2E0DC" }}>
                {["Proveedor", "Items", "Estado", "Llegada estimada", "Tracking"].map((col) => (
                  <th
                    key={col}
                    className="pb-2 text-left font-sans font-medium uppercase tracking-[0.08em]"
                    style={{ fontSize: "11px", color: "#6B6D72" }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr
                  key={orden.id}
                  className="transition-colors duration-150 hover:bg-[#F5F4F1]"
                  style={{ borderBottom: "1px solid #E2E0DC" }}
                >
                  <td className="py-3 font-sans text-sm pr-4" style={{ color: "#111111" }}>
                    {orden.proveedor}
                  </td>
                  <td className="py-3 font-mono text-sm pr-4" style={{ color: "#6B6D72" }}>
                    {orden.cantidadItems} {orden.cantidadItems === 1 ? "ítem" : "ítems"}
                  </td>
                  <td className="py-3 pr-4">
                    <EstadoBadge estado={orden.estado} />
                  </td>
                  <td className="py-3 font-sans text-sm pr-4" style={{ color: "#6B6D72" }}>
                    {orden.fechaEstimada
                      ? format(new Date(orden.fechaEstimada), "d MMM yyyy", { locale: es })
                      : "—"}
                  </td>
                  <td className="py-3">
                    {orden.tracking ? (
                      <span
                        className="font-mono cursor-pointer select-all"
                        style={{ fontSize: "12px", color: "#6B6D72" }}
                        title="Clic para seleccionar"
                      >
                        {orden.tracking}
                      </span>
                    ) : (
                      <span style={{ fontSize: "12px", color: "#A8AAAE" }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
