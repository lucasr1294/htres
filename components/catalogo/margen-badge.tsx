import { colorMargen } from "@/lib/calculos";

interface MargenBadgeProps {
  margen: number;
}

// Badge de margen con semáforo de color según rangos del skill
export function MargenBadge({ margen }: MargenBadgeProps) {
  const color = colorMargen(margen);
  return (
    <span
      className="font-mono text-sm"
      style={{ color }}
    >
      {margen > 0 ? "+" : ""}{margen.toFixed(1)}%
    </span>
  );
}
