// Funciones de cálculo de aranceles y márgenes — basadas en el sistema aduanero argentino
// Ver documentación completa en skills/catalogo.md

export interface DatosPosicion {
  derechos: number;
  tasa: number;
  iva: number;
  ivaAdicional: number;
  ganancias: number;
  ingresosBrutos: number;
}

export interface DesglosePrecio {
  precioFOB: number;
  derechos: number;
  tasaEstadistica: number;
  subtotal: number;
  iva: number;
  ivaAdicional: number;
  ganancias: number;
  iibb: number;
  total: number;
  // Porcentajes de cada posición para mostrar en el desglose
  pctDerechos: number;
  pctTasa: number;
  pctIva: number;
  pctIvaAdicional: number;
  pctGanancias: number;
  pctIIBB: number;
}

// Calcula el precio de importación final incluyendo todos los aranceles
export function calcularPrecioConAranceles(
  precioFOB: number,
  posicion: DatosPosicion
): number {
  const { subtotal, iva, ivaAdicional, ganancias, iibb } = calcularDesglose(precioFOB, posicion);
  return subtotal + iva + ivaAdicional + ganancias + iibb;
}

// Devuelve el desglose línea por línea para mostrar en el panel "Ver desglose"
export function calcularDesglose(
  precioFOB: number,
  posicion: DatosPosicion
): DesglosePrecio {
  const derechos = precioFOB * posicion.derechos;
  const tasaEstadistica = precioFOB * posicion.tasa;
  const subtotal = precioFOB + derechos + tasaEstadistica;

  const iva = subtotal * posicion.iva;
  const ivaAdicional = subtotal * posicion.ivaAdicional;
  const ganancias = subtotal * posicion.ganancias;
  const iibb = subtotal * posicion.ingresosBrutos;

  return {
    precioFOB,
    derechos,
    tasaEstadistica,
    subtotal,
    iva,
    ivaAdicional,
    ganancias,
    iibb,
    total: subtotal + iva + ivaAdicional + ganancias + iibb,
    pctDerechos: posicion.derechos * 100,
    pctTasa: posicion.tasa * 100,
    pctIva: posicion.iva * 100,
    pctIvaAdicional: posicion.ivaAdicional * 100,
    pctGanancias: posicion.ganancias * 100,
    pctIIBB: posicion.ingresosBrutos * 100,
  };
}

// Calcula el margen bruto estimado en porcentaje
export function calcularMargen(
  precioConArancelesUSD: number,
  precioVentaARS: number,
  tipoCambio: number
): number {
  if (precioConArancelesUSD === 0 || tipoCambio === 0) return 0;
  const precioVentaUSD = precioVentaARS / tipoCambio;
  return ((precioVentaUSD - precioConArancelesUSD) / precioConArancelesUSD) * 100;
}

// Devuelve el color del semáforo de margen según los rangos definidos en el skill
export function colorMargen(margen: number): string {
  if (margen > 80) return "#3D5A3E";   // verde oscuro
  if (margen >= 50) return "#6B6D72";  // neutro
  if (margen >= 30) return "#7A5C2E";  // ámbar oscuro
  return "#5C2E2E";                     // rojo oscuro
}

// Prefijos de SKU por categoría
export const PREFIJOS_SKU: Record<string, string> = {
  ILUMINACION:  "ILU",
  DECORACION:   "DEC",
  MUEBLES:      "MUE",
  TEXTILES:     "TEX",
  ORGANIZACION: "ORG",
  EXTERIOR:     "EXT",
  OTROS:        "OTR",
};

// Tipo de cambio por defecto hasta que exista la tabla de configuración
export const TIPO_CAMBIO_DEFAULT = 1050;
