import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatUSD, formatARS } from "@/lib/utils";

export interface ResumenFinancieroData {
  importadoUSD: number;
  vendidoARS: number;
  tipoCambio: number;
  fechaTipoCambio: Date;
}

interface ResumenFinancieroProps {
  data: ResumenFinancieroData;
}

export function ResumenFinanciero({ data }: ResumenFinancieroProps) {
  const { importadoUSD, vendidoARS, tipoCambio, fechaTipoCambio } = data;

  return (
    <div
      className="p-6 border flex flex-col gap-5 h-full"
      style={{ backgroundColor: "#F0EDE8", borderColor: "#E2E0DC", borderRadius: "4px" }}
    >
      {/* Encabezado */}
      <p
        className="font-sans font-medium uppercase tracking-[0.08em]"
        style={{ fontSize: "11px", color: "#6B6D72" }}
      >
        Resumen del mes
      </p>

      {/* Dos columnas: importado vs vendido */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-sans" style={{ fontSize: "11px", color: "#A8AAAE" }}>
            Importado
          </p>
          <p
            className="font-display font-bold"
            style={{ fontSize: "22px", color: "#111111" }}
          >
            {formatUSD(importadoUSD)}
          </p>
          <p className="font-mono" style={{ fontSize: "11px", color: "#A8AAAE" }}>
            USD
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-sans" style={{ fontSize: "11px", color: "#A8AAAE" }}>
            Vendido
          </p>
          <p
            className="font-display font-bold"
            style={{ fontSize: "22px", color: "#111111" }}
          >
            {formatARS(vendidoARS)}
          </p>
          <p className="font-mono" style={{ fontSize: "11px", color: "#A8AAAE" }}>
            ARS
          </p>
        </div>
      </div>

      {/* Tipo de cambio */}
      <div
        className="pt-4 border-t"
        style={{ borderColor: "#D6D7D9" }}
      >
        <p className="font-sans" style={{ fontSize: "12px", color: "#A8AAAE" }}>
          Tipo de cambio:{" "}
          <span className="font-mono" style={{ color: "#6B6D72" }}>
            $1 USD = {formatARS(tipoCambio)}
          </span>
        </p>
        <p className="font-sans" style={{ fontSize: "11px", color: "#A8AAAE", marginTop: "2px" }}>
          Actualizado {format(new Date(fechaTipoCambio), "d MMM yyyy", { locale: es })}
        </p>
      </div>
    </div>
  );
}
