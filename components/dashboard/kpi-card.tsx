interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
  // Variación vs período anterior (positivo = bueno, negativo = malo)
  delta?: { porcentaje: number; descripcion: string };
  // Primera card usa fondo mármol + borde acento (ver skills/frontend.md)
  featured?: boolean;
}

export function KpiCard({ label, value, unit, delta, featured = false }: KpiCardProps) {
  const deltaPositivo = delta && delta.porcentaje >= 0;

  return (
    <div
      className="p-6 border flex flex-col gap-3"
      style={{
        backgroundColor: featured ? "#F0EDE8" : "#FFFFFF",
        borderColor: "#E2E0DC",
        borderRadius: "4px",
        borderLeft: featured ? "2px solid #111111" : "1px solid #E2E0DC",
        // Sombra sólida sin blur según design system
        boxShadow: "2px 2px 0px #C8C9CB",
      }}
    >
      {/* Label */}
      <p
        className="font-sans font-medium uppercase tracking-[0.08em]"
        style={{ fontSize: "11px", color: "#6B6D72" }}
      >
        {label}
      </p>

      {/* Valor principal */}
      <div className="flex items-baseline gap-2">
        <span
          className="font-display font-bold leading-none"
          style={{ fontSize: "32px", color: "#111111" }}
        >
          {value}
        </span>
        {unit && (
          <span className="font-mono" style={{ fontSize: "13px", color: "#A8AAAE" }}>
            {unit}
          </span>
        )}
      </div>

      {/* Variación vs período anterior */}
      {delta && (
        <p
          className="font-sans"
          style={{
            fontSize: "12px",
            fontWeight: 300,
            color: deltaPositivo ? "#3D5A3E" : "#5C2E2E",
          }}
        >
          {deltaPositivo ? "↑" : "↓"} {Math.abs(delta.porcentaje).toFixed(1)}%{" "}
          {delta.descripcion}
        </p>
      )}
    </div>
  );
}
