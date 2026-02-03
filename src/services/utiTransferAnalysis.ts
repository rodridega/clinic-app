import type { UtiTransfer } from '../types/utiTransfer';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const SYSTEM_PROMPT = `Sos un asistente clínico para médicos.
Vas a recibir múltiples evoluciones médicas de un paciente internado en UTI, escritas en distintos días, por distintos profesionales, con información potencialmente repetida, incompleta o desordenada.

Tu tarea es integrar toda la información disponible en una única historia clínica resumida, clara y cronológica, pensada para un médico clínico que recibe al paciente al pasar de UTI a Planta.

Instrucciones estrictas:

No inventes datos ni completes información que no esté explícitamente mencionada.

Si hay datos contradictorios, menciónalos como tales sin intentar resolverlos.

Ordená los eventos en forma cronológica (desde el ingreso a UTI hasta el egreso).

Priorizá información clínicamente relevante.

Eliminá repeticiones, pero conservá cambios en la evolución.

Usá lenguaje médico claro, neutral y conciso.

IMPORTANTE PARA LABORATORIO: En "laboratorioTabla" debes incluir TODOS los parámetros de laboratorio mencionados en las evoluciones (hemograma completo, función renal, función hepática, ionograma, coagulación, marcadores inflamatorios, etc.). No te limites a los ejemplos mostrados. Extrae CADA valor de laboratorio que encuentres en el texto, organizándolos por fecha o día de evolución.

IMPORTANTE PARA ESTUDIOS POR IMÁGENES: En "imagenes" dentro de "estudiosRealizados" debes incluir TODOS los estudios por imágenes mencionados en las evoluciones: Radiografías (tórax, abdomen, etc.), Ecografías (abdominal, cardíaca, renovesical, doppler, etc.), Tomografías, Resonancias, Endoscopías (VEDA, colonoscopía, rectosigmoidoscopía), Ecocardiogramas. Extrae CADA estudio de imagen que encuentres con su fecha y hallazgos principales.

Responde ÚNICAMENTE con un objeto JSON con esta estructura exacta:

{
  "resumenCronologico": "Narrativa continua que describa: motivo de ingreso a UTI, principales eventos durante la estadía, evolución general, y condición clínica al egreso de UTI",
  "lineaTiempo": [
    {
      "fecha": "Día 1 o DD/MM",
      "eventos": ["evento clínico 1", "evento clínico 2", "cambio terapéutico"]
    }
  ],
  "estudiosRealizados": {
    "laboratorio": ["Solo usa este campo si NO puedes estructurar los datos en tabla"],
    "laboratorioTabla": {
      "fechas": ["Día 1", "Día 3", "Día 5"],
      "parametros": [
        {
          "nombre": "Hemoglobina",
          "valores": ["12.5", "11.2", "10.8"],
          "unidad": "g/dL"
        },
        {
          "nombre": "Leucocitos",
          "valores": ["15000", "12000", "9000"],
          "unidad": "/mm3"
        },
        {
          "nombre": "Creatinina",
          "valores": ["1.2", "1.5", "1.1"],
          "unidad": "mg/dL"
        },
        {
          "nombre": "PCR",
          "valores": ["25", "18", "12"],
          "unidad": "mg/L"
        }
      ]
    },
    "imagenes": ["IMPORTANTE: Incluir TODOS los estudios por imágenes mencionados: Rx de tórax, Rx de abdomen, Ecografías (abdominal, cardíaca, renovesical, etc.), Tomografías, Resonancias, Endoscopías (VEDA, colonoscopía, etc.), Ecocardiogramas. Formato: 'Fecha - Tipo de estudio: hallazgos principales'"],
    "otros": ["Incluir procedimientos invasivos y otros estudios no categorizados arriba (ej: punciones, biopsias, estudios funcionales). Formato: 'Fecha - Procedimiento: resultado'"]
  },
  "estudiosPendientes": ["estudio pendiente 1", "control sugerido sin realizar"],
  "tratamientosUti": {
    "soporte": ["ventilación mecánica", "drogas vasoactivas"],
    "medicacion": ["antibióticos", "corticoides"],
    "procedimientos": ["procedimiento invasivo realizado"]
  },
  "planEgreso": ["indicación 1", "tratamiento a continuar", "objetivo clínico"],
  "puntosVigilar": ["aspecto clínico a seguir", "riesgo mencionado"],
  "informacionFaltante": ["dato clave ausente para continuidad"],
  "advertencia": "RECORDATORIO: Esta es una herramienta de asistencia. Toda decisión médica debe ser validada por un profesional habilitado.",
  "textoParaHistoria": "Texto narrativo profesional, formateado para copiar y pegar directamente en historia clínica, que integre de forma clara y concisa: motivo de ingreso, evolución cronológica, estudios, tratamientos, estado actual al pase, plan e indicaciones para planta. Usar lenguaje médico formal, párrafos bien estructurados."
}`;

const MODELS = [
  'meta-llama/llama-3.3-70b-instruct',
  'meta-llama/llama-3.2-3b-instruct',
  'google/gemini-flash-1.5',
  'mistralai/mistral-7b-instruct',
  'qwen/qwen-2-7b-instruct'
];

async function tryModel(modelName: string, evolutions: string): Promise<UtiTransfer | null> {
  console.log(`🔄 [UTI Transfer] Intentando con modelo: ${modelName}`);
  
  // Crear AbortController para timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    console.warn(`⏱️ [UTI Transfer] Timeout de 15s alcanzado con ${modelName}, cambiando de modelo...`);
  }, 15000); // 15 segundos
  
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Clinical UTI Transfer App'
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: evolutions
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      }),
      signal: controller.signal // Agregar signal para timeout
    });

    clearTimeout(timeoutId); // Limpiar timeout si la respuesta llega a tiempo

    console.log(`📡 [UTI Transfer] Respuesta del servidor (${modelName}):`, response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [UTI Transfer] Error con ${modelName}:`, errorText);
      return null;
    }

    const data = await response.json();
    console.log(`✅ [UTI Transfer] Respuesta recibida de ${modelName}:`, data);

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error(`❌ [UTI Transfer] No se encontró contenido en la respuesta de ${modelName}`);
      return null;
    }

    console.log(`📝 [UTI Transfer] Contenido a parsear:`, content);

    let parsedData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        parsedData = JSON.parse(content);
      }
    } catch (parseError) {
      console.error(`❌ [UTI Transfer] Error al parsear JSON de ${modelName}:`, parseError);
      return null;
    }

    console.log(`🎯 [UTI Transfer] Datos parseados correctamente:`, parsedData);

    return {
      resumenCronologico: parsedData.resumenCronologico || '',
      lineaTiempo: parsedData.lineaTiempo || [],
      estudiosRealizados: {
        laboratorio: parsedData.estudiosRealizados?.laboratorio || [],
        laboratorioTabla: parsedData.estudiosRealizados?.laboratorioTabla || undefined,
        imagenes: parsedData.estudiosRealizados?.imagenes || [],
        otros: parsedData.estudiosRealizados?.otros || []
      },
      estudiosPendientes: parsedData.estudiosPendientes || [],
      tratamientosUti: parsedData.tratamientosUti || {
        soporte: [],
        medicacion: [],
        procedimientos: []
      },
      planEgreso: parsedData.planEgreso || [],
      puntosVigilar: parsedData.puntosVigilar || [],
      informacionFaltante: parsedData.informacionFaltante || [],
      advertencia: parsedData.advertencia || 'RECORDATORIO: Esta es una herramienta de asistencia. Toda decisión médica debe ser validada por un profesional habilitado.',
      textoParaHistoria: parsedData.textoParaHistoria || ''
    };

  } catch (error) {
    clearTimeout(timeoutId); // Asegurar limpieza del timeout
    
    // Verificar si fue un timeout
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`⏱️ [UTI Transfer] Timeout: ${modelName} demoró más de 15 segundos`);
      return null;
    }
    
    console.error(`❌ [UTI Transfer] Error de red con ${modelName}:`, error);
    return null;
  }
}

export async function analyzeUtiTransfer(evolutions: string): Promise<UtiTransfer> {
  if (!OPENROUTER_API_KEY) {
    console.log('⚠️ [UTI Transfer] No hay API key configurada, usando modo demo');
    return getDemoAnalysis(evolutions);
  }

  console.log('🚀 [UTI Transfer] Iniciando análisis con OpenRouter');

  for (const model of MODELS) {
    const result = await tryModel(model, evolutions);
    if (result) {
      console.log(`✨ [UTI Transfer] ¡Análisis exitoso con ${model}!`);
      return result;
    }
    console.log(`⏭️ [UTI Transfer] Modelo ${model} falló, probando siguiente...`);
  }

  console.log('⚠️ [UTI Transfer] Todos los modelos fallaron, usando modo demo');
  return getDemoAnalysis(evolutions);
}

function getDemoAnalysis(evolutions: string): UtiTransfer {
  const words = evolutions.toLowerCase().split(/\s+/);
  const hasRespiratory = words.some(w => w.includes('ventilación') || w.includes('oxígeno') || w.includes('respiratorio'));
  const hasCardio = words.some(w => w.includes('presión') || w.includes('cardio') || w.includes('hemodinámico'));
  const hasInfection = words.some(w => w.includes('infección') || w.includes('antibiótico') || w.includes('fiebre'));

  return {
    resumenCronologico: 'Este es un análisis de demostración. Configure una API key de OpenRouter para obtener un análisis real con IA del pase de UTI a Planta.',
    lineaTiempo: [
      {
        fecha: 'Día 1',
        eventos: ['Ingreso a UTI mencionado en el texto']
      }
    ],
    estudiosRealizados: {
      laboratorio: hasInfection ? ['Laboratorio mencionado en evoluciones'] : [],
      imagenes: hasRespiratory ? ['Imágenes mencionadas en evoluciones'] : [],
      otros: []
    },
    estudiosPendientes: ['Configure API key para análisis detallado'],
    tratamientosUti: {
      soporte: hasRespiratory ? ['Soporte respiratorio mencionado'] : [],
      medicacion: hasInfection ? ['Medicación antimicrobiana mencionada'] : [],
      procedimientos: []
    },
    planEgreso: ['Requiere análisis completo con API key configurada'],
    puntosVigilar: hasCardio ? ['Monitoreo hemodinámico sugerido'] : ['Configure API key para recomendaciones específicas'],
    informacionFaltante: ['Análisis completo requiere configuración de API key de OpenRouter'],
    advertencia: 'MODO DEMO: Configure una API key de OpenRouter para obtener análisis real. Esta es una herramienta de asistencia. Toda decisión médica debe ser validada por un profesional habilitado.',
    textoParaHistoria: 'MODO DEMO: Para obtener el texto formateado para historia clínica, configure una API key de OpenRouter en las variables de entorno.'
  };
}

export function isApiKeyConfigured(): boolean {
  return !!OPENROUTER_API_KEY;
}
