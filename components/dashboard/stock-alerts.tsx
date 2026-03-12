import Link from "next/link";
import { AlertTriangle, CheckCircle } from "lucide-react";

export interface StockAlertItem {
  id: string;
  nombre: string;
  sku: string;
  disponible: number;
  umbralAlerta: number;
}

interface StockAlertsProps {
  items: StockAlertItem[];
}

export function StockAlerts({ items }: StockAlertsProps) {
  return (
    <div
      className="p-6 border flex flex-col gap-4 h-full"
      style={{ backgroundColor: "#FFFFFF", borderColor: "#E2E0DC", borderRadius: "4px" }}
    >
      {/* Encabezado de sección */}
      <div className="flex items-center justify-between">
        <p
          className="font-sans font-medium uppercase tracking-[0.08em]"
          style={{ fontSize: "11px", color: "#6B6D72" }}
        >
          Alertas de stock
        </p>
        {items.length > 0 && (
          <Link
            href="/stock?alerta=true"
            className="font-sans transition-colors duration-150"
            style={{ fontSize: "12px", color: "#A8AAAE" }}
          >
            Ver todos →
          </Link>
        )}
      </div>

      {/* Estado vacío positivo */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 gap-2 py-6">
          <CheckCircle size={20} strokeWidth={1.5} style={{ color: "#3D5A3E" }} />
          <p className="font-sans text-sm" style={{ color: "#6B6D72" }}>
            Todo el stock está en orden
          </p>
        </div>
      )}

      {/* Lista de alertas — máximo 5 */}
      {items.length > 0 && (
        <ul className="flex flex-col divide-y" style={{ borderColor: "#E2E0DC" }}>
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-3 gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <AlertTriangle size={14} strokeWidth={1.5} style={{ color: "#7A5C2E", flexShrink: 0 }} />
                <div className="min-w-0">
                  <p className="font-sans text-sm truncate" style={{ color: "#111111" }}>
                    {item.nombre}
                  </p>
                  <p className="font-mono" style={{ fontSize: "11px", color: "#A8AAAE" }}>
                    {item.sku}
                  </p>
                </div>
              </div>

              {/* Stock actual vs umbral */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="font-mono text-sm font-bold" style={{ color: "#5C2E2E" }}>
                  {item.disponible}
                </span>
                <span className="font-sans" style={{ fontSize: "11px", color: "#A8AAAE" }}>
                  / {item.umbralAlerta} mín
                </span>
                <Link
                  href="/ordenes/nueva"
                  className="font-sans font-medium px-3 py-1 border transition-all duration-150 hover:bg-[#111111] hover:text-white"
                  style={{
                    fontSize: "11px",
                    color: "#111111",
                    borderColor: "#111111",
                    borderRadius: 0,
                  }}
                >
                  Reponer
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
