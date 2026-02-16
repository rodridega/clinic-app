import type { GuardReceipt, GuardReceiptRequest, GuardReceiptResponse } from '../types/guardReceipt';

const DISCLAIMER_FINAL = "Este análisis se basa únicamente en la información escrita proporcionada. No evalúa la corrección clínica, no reemplaza el criterio médico y no implica recomendaciones diagnósticas ni terapéuticas.";

const SYSTEM_PROMPT = `Actuás como un asistente clínico de apoyo cognitivo para médicos que toman guardia.

Vas a recibir texto libre con evoluciones médicas de un paciente (pases de sala, evoluciones diarias, interconsultas, etc.).

Tu tarea NO es diagnosticar, NO indicar tratamientos, NO priorizar conductas.

Tu único objetivo es analizar la coherencia interna del texto, señalando qué está documentado y qué NO está documentado, siempre basándote exclusivamente en la información escrita.

⚠️ Reglas estrictas:
- No evalúes si algo "está bien o mal".
- No agregues información clínica que no esté en el texto.
- No concluyas gravedad, urgencia ni corrección médica.
- Usá siempre lenguaje descriptivo y neutral ("no se menciona", "no figura documentado").
- Si algo no está en el texto, asumí que no está documentado, no que no se hizo.

TAREA:
Dado un texto con evoluciones médicas, generá una auditoría clínica estructurada EN FORMATO JSON.

RESPONDÉ ÚNICAMENTE CON UN OBJETO JSON VÁLIDO CON ESTA ESTRUCTURA EXACTA:

{
  "diagnosticosIncompletos": [
    {
      "diagnostico": "nombre del diagnóstico mencionado explícitamente",
      "elementosDocumentados": ["elementos clínicos, de laboratorio o de imágenes que SÍ están documentados"],
      "elementosNoMencionados": ["elementos relevantes que NO aparecen mencionados en el texto"]
    }
  ],
  "hipotesisNoMencionadas": [
    "En el contexto de [signos/síntomas descriptos], no se menciona evaluación de [hipótesis clínica relevante]"
  ],
  "accionesHabitualesNoRegistradas": [
    {
      "diagnostico": "nombre del diagnóstico",
      "accionesHabituales": ["acciones o medidas que habitualmente se documentan en ese contexto clínico pero no figuran registradas"]
    }
  ],
  "informacionAusente": [
    "datos ausentes, incompletos o ambiguos: evolución temporal, resultados pendientes, criterios de seguimiento, etc."
  ]
}

IMPORTANTE:
- Respondé SOLO con JSON válido, sin texto adicional antes o después
- NO uses markdown code blocks
- Si no hay información para una categoría, usá array vacío []
- NO infieras ni agregues información que no esté en el texto
- Usá lenguaje médico profesional
- Mantené un tono neutral y objetivo
- Evitá especulaciones
- NO uses términos como "obligatorio" o "debe", usá "habitualmente asociado"
- Basá todas las afirmaciones estrictamente en el texto proporcionado
- Para hipótesis no mencionadas, usá siempre lenguaje condicional y descriptivo
- NO afirmes diagnósticos, solo señalá qué no está mencionado`;

class GuardReceiptAnalysisService {
    private apiKey: string;
    private baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
    private model = 'deepseek/deepseek-chat';

    constructor() {
        const key = import.meta.env.VITE_OPENROUTER_API_KEY;
        if (!key) {
            console.error('⚠️ VITE_OPENROUTER_API_KEY no está configurada');
        }
        this.apiKey = key || '';
    }

    async analyzeGuardReceipt(request: GuardReceiptRequest): Promise<GuardReceiptResponse> {
        if (!this.apiKey) {
            return {
                success: false,
                error: 'La API key no está configurada. Por favor, configura VITE_OPENROUTER_API_KEY en tu archivo .env'
            };
        }

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Clinic App - Receptor de Guardia'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: SYSTEM_PROMPT
                        },
                        {
                            role: 'user',
                            content: `Analiza las siguientes evoluciones médicas para toma de guardia:\n\n${request.evolucionesTexto}`
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 4000
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error en la respuesta de OpenRouter:', response.status, errorText);
                return {
                    success: false,
                    error: `Error ${response.status}: ${errorText}`
                };
            }

            const data = await response.json();

            if (!data.choices?.[0]?.message?.content) {
                return {
                    success: false,
                    error: 'La respuesta de la API no contiene el formato esperado'
                };
            }

            const content = data.choices[0].message.content.trim();

            // Intentar limpiar posibles wrappers de markdown
            let cleanedContent = content;
            if (content.startsWith('```json')) {
                cleanedContent = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            } else if (content.startsWith('```')) {
                cleanedContent = content.replace(/^```\s*/, '').replace(/\s*```$/, '');
            }

            let parsedData: GuardReceipt;
            try {
                parsedData = JSON.parse(cleanedContent);
            } catch (parseError) {
                console.error('Error al parsear JSON:', parseError);
                console.error('Contenido recibido:', cleanedContent);
                return {
                    success: false,
                    error: 'Error al interpretar la respuesta del modelo. Por favor, intenta nuevamente.'
                };
            }

            // Agregar el disclaimer final
            parsedData.disclaimer = DISCLAIMER_FINAL;

            // Validación básica de la estructura
            if (!parsedData.diagnosticosIncompletos || !parsedData.hipotesisNoMencionadas ||
                !parsedData.accionesHabitualesNoRegistradas || !parsedData.informacionAusente) {
                return {
                    success: false,
                    error: 'La respuesta no contiene la estructura esperada'
                };
            }

            return {
                success: true,
                data: parsedData
            };

        } catch (error) {
            console.error('Error en analyzeGuardReceipt:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido'
            };
        }
    }

    isApiKeyConfigured(): boolean {
        return !!this.apiKey;
    }
}

export const guardReceiptAnalysisService = new GuardReceiptAnalysisService();
