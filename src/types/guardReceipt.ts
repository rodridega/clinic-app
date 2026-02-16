// Tipos para la estructura de Receptor de Guardia

export interface GuardReceipt {
  diagnosticosIncompletos: DiagnosticoIncompleto[];
  hipotesisNoMencionadas: string[];
  accionesHabitualesNoRegistradas: AccionNoRegistrada[];
  informacionAusente: string[];
  disclaimer: string;
}

export interface DiagnosticoIncompleto {
  diagnostico: string;
  elementosDocumentados: string[];
  elementosNoMencionados: string[];
}

export interface AccionNoRegistrada {
  diagnostico: string;
  accionesHabituales: string[];
}

export interface GuardReceiptRequest {
  evolucionesTexto: string;
}

export interface GuardReceiptResponse {
  success: boolean;
  data?: GuardReceipt;
  error?: string;
}
