export interface UtiTransfer {
  resumenCronologico: string;
  lineaTiempo: TimelineEntry[];
  estudiosRealizados: EstudiosRealizados;
  estudiosPendientes: string[];
  tratamientosUti: TratamientosUti;
  planEgreso: string[];
  puntosVigilar: string[];
  informacionFaltante: string[];
  advertencia: string;
  textoParaHistoria: string;
}

export interface TimelineEntry {
  fecha: string; // "Día 1", "DD/MM", etc.
  eventos: string[];
}

export interface EstudiosRealizados {
  laboratorio: string[];
  laboratorioTabla?: LaboratorioTabla; // Tabla estructurada opcional
  imagenes: string[];
  otros: string[];
}

export interface LaboratorioTabla {
  fechas: string[]; // Array de fechas/días
  parametros: LaboratorioParametro[]; // Array de parámetros con sus valores
}

export interface LaboratorioParametro {
  nombre: string; // Ej: "Hemoglobina", "Leucocitos", "Creatinina"
  valores: string[]; // Valores correspondientes a cada fecha (mismo orden que fechas)
  unidad?: string; // Ej: "g/dL", "mg/dL", etc.
}

export interface TratamientosUti {
  soporte: string[];
  medicacion: string[];
  procedimientos: string[];
}
