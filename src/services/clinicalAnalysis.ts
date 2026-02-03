import type { ClinicalReview, AnalysisRequest, AnalysisResponse } from '../types/clinical';

const ADVERTENCIA_USO = "Este resumen es una herramienta de apoyo para profesionales de la salud. No emite diagnósticos ni recomendaciones terapéuticas y no reemplaza el criterio clínico.";

const SYSTEM_PROMPT = `Sos un asistente clínico diseñado exclusivamente para dar soporte a profesionales de la salud.

Tu objetivo es ayudar a organizar, resumir y revisar texto clínico redactado por un profesional humano.
NO emitís diagnósticos, NO indicás tratamientos, NO sugerís medicación ni tomás decisiones clínicas.

REGLAS ESTRICTAS:
- NO debés emitir diagnósticos.
- NO debés sugerir tratamientos, medicamentos ni intervenciones.
- NO debés reemplazar el criterio clínico profesional.
- NO debés responder solicitudes orientadas a pacientes.
- Si el usuario solicita diagnóstico o tratamiento, debés rechazar el pedido de forma clara y respetuosa, explicando la limitación.

TAREA:
Dado un texto clínico proporcionado por un profesional de la salud, analizalo y generá una revisión clínica estructurada EN FORMATO JSON.

RESPONDÉ ÚNICAMENTE CON UN OBJETO JSON VÁLIDO CON ESTA ESTRUCTURA EXACTA:

{
  "resumenClinico": "Resumen conciso y neutral del caso en 3-5 líneas, basándote estrictamente en la información presente en el texto",
  "datosRelevantes": {
    "antecedentes": ["lista de antecedentes mencionados explícitamente"],
    "sintomas": ["lista de síntomas mencionados"],
    "signos": ["lista de signos mencionados"],
    "estudios": ["lista de estudios mencionados"],
    "medicacionPrevia": ["lista de medicación previa si aparece"]
  },
  "redFlags": ["elementos que requieran revisión cuidadosa: inconsistencias, hallazgos preocupantes mencionados, valores fuera de rango si están explícitos, síntomas clínicamente significativos. NO concluyas gravedad ni urgencia"],
  "informacionFaltante": ["información clínica importante ausente, incompleta o poco clara en el texto"],
  "diagnosticosDiferenciales": [
    "lista de diagnósticos diferenciales plausibles basados exclusivamente en los datos disponibles, sin jerarquizar ni confirmar ninguno"
  ],
  "estudiosSugeridos": [
    "estudios complementarios que podrían considerarse para ampliar o aclarar el cuadro clínico, basados en el caso presentado, sin implicar indicación médica directa"
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
- Basá todas las afirmaciones estrictamente en el texto proporcionado`;


interface OpenRouterResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

class ClinicalAnalysisService {
    private apiKey: string | null = null;
    private baseURL = 'https://openrouter.ai/api/v1';

    // Lista de modelos con fallback (OpenRouter da créditos iniciales gratis)
    private models = [
        'meta-llama/llama-3.3-70b-instruct',
        'meta-llama/llama-3.2-3b-instruct',
        'google/gemini-flash-1.5',
        'mistralai/mistral-7b-instruct',
        'qwen/qwen-2-7b-instruct'
    ];

    private currentModelIndex = 0;

    constructor() {
        const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
        if (apiKey && apiKey !== 'tu-api-key-aqui') {
            this.apiKey = apiKey;
        }
    }

    async analyzeClinicalText(request: AnalysisRequest): Promise<AnalysisResponse> {
        console.log('🔍 [DEBUG] Iniciando análisis clínico');
        console.log('🔑 [DEBUG] API Key presente:', !!this.apiKey);
        console.log('📝 [DEBUG] Longitud del texto:', request.textoClinico.length);

        if (!this.apiKey) {
            console.log('⚠️ [DEBUG] No hay API key, usando modo demo');
            return this.getDemoAnalysis(request.textoClinico);
        }

        // Intentar con cada modelo hasta que uno funcione
        for (let i = 0; i < this.models.length; i++) {
            const modelIndex = (this.currentModelIndex + i) % this.models.length;
            const model = this.models[modelIndex];

            console.log(`🤖 [DEBUG] Intentando con modelo (${i + 1}/${this.models.length}):`, model);

            try {
                const result = await this.tryModel(model, request.textoClinico);

                // Si funciona, guardar este modelo como preferido
                this.currentModelIndex = modelIndex;
                console.log('✨ [DEBUG] Análisis completado exitosamente con:', model);

                return result;

            } catch (error: any) {
                console.warn(`⚠️ [DEBUG] Modelo ${model} falló:`, error?.message || error);

                // Si es el último modelo, propagar el error
                if (i === this.models.length - 1) {
                    console.error('❌ [DEBUG] Todos los modelos fallaron');
                    throw error;
                }

                // Si no, continuar con el siguiente modelo
                console.log('🔄 [DEBUG] Probando siguiente modelo...');
            }
        }

        // No debería llegar aquí, pero por seguridad
        throw new Error('No se pudo completar el análisis con ningún modelo disponible');
    }

    private async tryModel(model: string, textoClinico: string): Promise<AnalysisResponse> {
        // Crear AbortController para timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
            console.warn(`⏱️ [Clinical] Timeout de 15s alcanzado con ${model}, cambiando de modelo...`);
        }, 15000); // 15 segundos

        try {
            console.log('🌐 [DEBUG] Preparando request a OpenRouter...');

            const requestPayload = {
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: SYSTEM_PROMPT
                    },
                    {
                        role: 'user',
                        content: `Analiza el siguiente texto clínico y genera la estructura de revisión en JSON:\n\n${textoClinico}`
                    }
                ],
                temperature: 0.3,
                max_tokens: 2000
            };

            console.log('📤 [DEBUG] Request payload (modelo: ' + model + ')');

            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Clinic App'
                },
                body: JSON.stringify(requestPayload),
                signal: controller.signal // Agregar signal para timeout
            });

            clearTimeout(timeoutId); // Limpiar timeout si la respuesta llega a tiempo

            console.log('📥 [DEBUG] Response status:', response.status, response.statusText);

            if (!response.ok) {
                console.error('❌ [DEBUG] Response no OK, obteniendo detalles del error...');
                const errorData = await response.json().catch(() => null);
                console.error('❌ [DEBUG] Error completo de OpenRouter:', JSON.stringify(errorData, null, 2));
                throw new Error(
                    errorData?.error?.message ||
                    `Error en OpenRouter: ${response.status} ${response.statusText}`
                );
            }

            const data: OpenRouterResponse = await response.json();
            console.log('✅ [DEBUG] Response data recibida:', JSON.stringify(data, null, 2));

            const content = data.choices[0]?.message?.content;
            console.log('📄 [DEBUG] Contenido extraído:', content?.substring(0, 200) + '...');

            if (!content) {
                console.error('❌ [DEBUG] No hay contenido en la respuesta');
                throw new Error('No se recibió respuesta del modelo');
            }

            // Limpiar el contenido para extraer solo el JSON
            let jsonContent = content.trim();
            console.log('🧹 [DEBUG] Contenido antes de limpiar:', jsonContent.substring(0, 100));

            // Remover markdown code blocks si existen
            if (jsonContent.startsWith('```')) {
                console.log('🧹 [DEBUG] Removiendo markdown code blocks...');
                jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            }

            console.log('🧹 [DEBUG] Contenido después de limpiar:', jsonContent.substring(0, 100));
            console.log('🔄 [DEBUG] Intentando parsear JSON...');

            const parsedData = JSON.parse(jsonContent);
            console.log('✅ [DEBUG] JSON parseado exitosamente:', parsedData);

            const clinicalReview: ClinicalReview = {
                resumenClinico: parsedData.resumenClinico || '',
                datosRelevantes: parsedData.datosRelevantes || {
                    antecedentes: [],
                    sintomas: [],
                    signos: [],
                    estudios: [],
                    medicacionPrevia: []
                },
                redFlags: parsedData.redFlags || [],
                informacionFaltante: parsedData.informacionFaltante || [],
                diagnosticosDiferenciales: parsedData.diagnosticosDiferenciales || [],
                estudiosSugeridos: parsedData.estudiosSugeridos || [],
                advertencia: ADVERTENCIA_USO
            };

            return {
                success: true,
                data: clinicalReview
            };

        } catch (error) {
            clearTimeout(timeoutId); // Asegurar limpieza del timeout
            
            // Verificar si fue un timeout
            if (error instanceof Error && error.name === 'AbortError') {
                console.error(`⏱️ [Clinical] Timeout: ${model} demoró más de 15 segundos`);
                throw new Error('Timeout: modelo tardó más de 15 segundos');
            }
            
            console.error('💥 [DEBUG] Error en modelo:', error);
            // Re-lanzar el error para que el método principal lo maneje
            throw error;
        }
    }

    private getDemoAnalysis(textoClinico: string): AnalysisResponse {
        // Análisis básico para demo (sin API key)
        const palabrasTexto = textoClinico.toLowerCase();

        const datosRelevantes = {
            antecedentes: this.extractItems(palabrasTexto, ['diabetes', 'hipertensión', 'hta', 'dm2', 'obesidad', 'tabaquismo', 'dislipidemia']),
            sintomas: this.extractItems(palabrasTexto, ['dolor', 'fiebre', 'tos', 'disnea', 'náuseas', 'vómitos', 'cefalea', 'mareo']),
            signos: this.extractItems(palabrasTexto, ['taquicardia', 'hipertensión', 'fiebre', 'palidez', 'edema', 'soplo']),
            estudios: this.extractItems(palabrasTexto, ['ecg', 'ecocardiograma', 'rx', 'radiografía', 'tc', 'rmn', 'laboratorio', 'hemograma']),
            medicacionPrevia: this.extractItems(palabrasTexto, ['enalapril', 'metformina', 'atorvastatina', 'aspirina', 'omeprazol', 'losartán'])
        };

        const redFlags: string[] = [];
        if (palabrasTexto.includes('dolor torácico') || palabrasTexto.includes('dolor de pecho')) {
            redFlags.push('Dolor torácico mencionado - requiere evaluación cardiovascular');
        }
        if (palabrasTexto.includes('disnea') || palabrasTexto.includes('dificultad respiratoria')) {
            redFlags.push('Disnea presente - evaluar causa respiratoria/cardiaca');
        }
        if (!palabrasTexto.includes('tensión arterial') && !palabrasTexto.includes('ta') && !palabrasTexto.includes('presión')) {
            redFlags.push('Signos vitales no documentados en el texto');
        }

        const informacionFaltante: string[] = [];
        if (!palabrasTexto.includes('desde') && !palabrasTexto.includes('evolución') && !palabrasTexto.includes('días')) {
            informacionFaltante.push('Evolución temporal del cuadro no especificada');
        }
        if (!palabrasTexto.includes('alergia')) {
            informacionFaltante.push('Alergias no constan');
        }
        if (!palabrasTexto.includes('medicación') && !palabrasTexto.includes('tratamiento')) {
            informacionFaltante.push('Medicación actual no especificada');
        }

        const resumenClinico = `Texto clínico analizado con ${textoClinico.split(' ').length} palabras. ${datosRelevantes.antecedentes.length > 0 ? 'Se identifican antecedentes relevantes.' : 'No se especifican antecedentes.'} ${datosRelevantes.sintomas.length > 0 ? `Presenta sintomatología descrita.` : 'Sintomatología no claramente descrita.'} Requiere revisión por profesional de salud.`;

        return {
            success: true,
            data: {
                resumenClinico,
                datosRelevantes,
                redFlags: redFlags.length > 0 ? redFlags : ['Revisar completitud de historia clínica'],
                informacionFaltante: informacionFaltante.length > 0 ? informacionFaltante : ['Considerar ampliar anamnesis'],
                diagnosticosDiferenciales: ['Análisis completo requiere API key configurada'],
                estudiosSugeridos: ['Análisis completo requiere API key configurada'],
                advertencia: ADVERTENCIA_USO
            }
        };
    }

    private extractItems(texto: string, keywords: string[]): string[] {
        const found: string[] = [];
        keywords.forEach(keyword => {
            if (texto.includes(keyword)) {
                found.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
            }
        });
        return found;
    }

    public isApiKeyConfigured(): boolean {
        return this.apiKey !== null && this.apiKey.length > 0;
    }
}

export const clinicalAnalysisService = new ClinicalAnalysisService();
