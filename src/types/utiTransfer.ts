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
  imagenes: string[];
  otros: string[];
}

export interface TratamientosUti {
  soporte: string[];
  medicacion: string[];
  procedimientos: string[];
}
