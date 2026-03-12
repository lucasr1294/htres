import { ShoppingBag } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatARS } from "@/lib/utils";

export interface VentaReciente {
  id: string;
  fecha: Date;
  canal: string;
  productos: string;   // descripción resumida de lo vendido
  totalARS: number;
}

interface ActividadRecienteProps {
  ventas: VentaReciente[];
}

export function ActividadReciente({ ventas }: ActividadRecienteProps) {
  return (
    <div
      className="p-6 border flex flex-col gap-4"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E0DC", borderRadius: "4px" }}
    >
      <p
        className="font-sans font-medium uppercase tracking-[0.08em]"
        style={{ fontSize: "11px", color: "#6B6D72" }}
      >
        Actividad reciente
      </p>

      {/* Estado vacío */}
      {ventas.length === 0 && (
        <div className="flex items-center gap-3 py-4">
          <ShoppingBag size={16} strokeWidth={1.5} style={{ color: "#A8AAAE" }} />
          <p className="font-sans text-sm" style={{ color: "#A8AAAE" }}>
            No hay ventas registradas todavía
          </p>
        </div>
      )}

      {/* Feed compacto — últimas 5 ventas */}
      {ventas.length > 0 && (
        <ul className="flex flex-col divide-y" style={{ borderColor: "#E2E0DC" }}>
          {ventas.map((venta) => (
            <li key={venta.id} className="flex items-center justify-between py-3 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <ShoppingBag size={14} strokeWidth={1.5} style={{ color: "#A8AAAE", flexShrink: 0 }} />
                <div className="min-w-0">
                  <p className="font-sans text-sm truncate" style={{ color: "#111111" }}>
                    {venta.productos}
                  </p>
                  <p className="font-sans" style={{ fontSize: "12px", color: "#A8AAAE" }}>
                    {venta.canal} ·{" "}
                    {format(new Date(venta.fecha), "d MMM, HH:mm", { locale: es })}
                  </p>
                </div>
              </div>
              <span className="font-mono text-sm flex-shrink-0" style={{ color: "#111111" }}>
                {formatARS(venta.totalARS)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
