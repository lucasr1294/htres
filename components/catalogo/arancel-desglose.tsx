"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { DesglosePrecio } from "@/lib/calculos";
import { formatUSD } from "@/lib/utils";

interface ArancelDesgloseProps {
  desglose: DesglosePrecio;
}

// Panel expandible con el desglose línea por línea de aranceles
export function ArancelDesglose({ desglose }: ArancelDesgloseProps) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setAbierto(!abierto)}
        className="flex items-center gap-1 font-sans transition-colors duration-150"
        style={{ fontSize: "12px", color: "#6B6D72" }}
      >
        {abierto ? <ChevronUp size={12} strokeWidth={1.5} /> : <ChevronDown size={12} strokeWidth={1.5} />}
        Ver desglose
      </button>

      {abierto && (
        <div
          className="mt-2 p-3 font-mono"
          style={{
            fontSize: "12px",
            backgroundColor: "#F0EDE8",
            borderLeft: "2px solid #D6D7D9",
            lineHeight: "1.8",
          }}
        >
          <DesgloseFila label="Precio FOB" valor={desglose.precioFOB} />
          <DesgloseFila label={`+ Derechos (${desglose.pctDerechos}%)`} valor={desglose.derechos} />
          <DesgloseFila label={`+ Tasa estadística (${desglose.pctTasa}%)`} valor={desglose.tasaEstadistica} />
          <div style={{ borderTop: "1px solid #C8C9CB", margin: "4px 0" }} />
          <DesgloseFila label="Subtotal" valor={desglose.subtotal} bold />
          <DesgloseFila label={`+ IVA (${desglose.pctIva}%)`} valor={desglose.iva} />
          <DesgloseFila label={`+ IVA Adicional (${desglose.pctIvaAdicional}%)`} valor={desglose.ivaAdicional} />
          <DesgloseFila label={`+ Ganancias (${desglose.pctGanancias}%)`} valor={desglose.ganancias} />
          <DesgloseFila label={`+ Ing. Brutos (${desglose.pctIIBB}%)`} valor={desglose.iibb} />
          <div style={{ borderTop: "1px solid #C8C9CB", margin: "4px 0" }} />
          <DesgloseFila label="Precio con aranceles" valor={desglose.total} bold />
        </div>
      )}
    </div>
  );
}

function DesgloseFila({ label, valor, bold }: { label: string; valor: number; bold?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span style={{ color: "#6B6D72", fontWeight: bold ? 500 : 400 }}>{label}</span>
      <span style={{ color: "#111111", fontWeight: bold ? 500 : 400 }}>{formatUSD(valor)}</span>
    </div>
  );
}
