// Tipos para la estructura de revisión clínica

export interface ClinicalReview {
  resumenClinico: string;
  datosRelevantes: DatosRelevantes;
  redFlags: string[];
  informacionFaltante: string[];
  advertencia: string;
}

export interface DatosRelevantes {
  antecedentes: string[];
  sintomas: string[];
  signos: string[];
  estudios: string[];
  medicacionPrevia: string[];
}

export interface AnalysisRequest {
  textoClinico: string;
}

export interface AnalysisResponse {
  success: boolean;
  data?: ClinicalReview;
  error?: string;
}
