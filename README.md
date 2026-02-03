# Clinic App 🏥

Herramienta de asistencia para profesionales de la salud en la organización y revisión de textos clínicos.

## 🎯 Objetivo

Asistir a profesionales de la salud en la organización y revisión de textos clínicos, **sin emitir diagnósticos ni indicar tratamientos**.

## 👤 Usuario Target

- Médicos
- Residentes
- Clínicos
- Profesionales de la salud en UTI y áreas de internación

## ✨ Características

La aplicación ahora cuenta con **dos herramientas principales**:

### 1. 📋 Revisión de Historia Clínica

Procesa historias clínicas desordenadas y genera una estructura de revisión con 8 secciones:

#### 1️⃣ Resumen Clínico
#### 1️⃣ Resumen Clínico
- 3-5 líneas en lenguaje médico
- Sin interpretaciones
- Visión global del caso

#### 2️⃣ Datos Relevantes Identificados
- **Antecedentes**: HTA, DM2, etc.
- **Síntomas**: Dolor, fiebre, disnea, etc.
- **Signos**: Taquicardia, hipertensión, etc.
- **Estudios**: ECG, laboratorios, imágenes
- **Medicación previa**: Si está mencionada

#### 3️⃣ Red Flags a Revisar
- Inconsistencias detectadas
- Datos preocupantes mencionados
- Valores fuera de rango (si están explícitos)
- Ausencias de información crítica

#### 4️⃣ Información Faltante o Poco Clara
- Evolución temporal no especificada
- Alergias no constan
- Medicación actual no detallada
- Cualquier dato clínico clave ausente

#### 5️⃣ Diagnósticos Diferenciales
- Posibles diagnósticos basados en la información presentada
- Sin confirmación, solo orientativos

#### 6️⃣ Estudios Sugeridos
- Estudios complementarios que podrían aportar información relevante
- Basados en la presentación clínica

### 2. 🏥 Pase UTI → Planta

Resume cronológicamente múltiples evoluciones de UTI en una historia única para el pase a Planta, con 8 secciones:

#### 1️⃣ Resumen Cronológico Integrado
- Narrativa continua desde ingreso hasta egreso de UTI
- Motivo de ingreso
- Principales eventos
- Evolución general
- Condición clínica al egreso

#### 2️⃣ Línea de Tiempo Resumida
- Eventos organizados por día/fecha
- Cambios clínicos significativos
- Modificaciones terapéuticas

#### 3️⃣ Estudios Realizados
- **Laboratorio**: Estudios y hallazgos relevantes
- **Imágenes**: Tipo de estudio y resultados
- **Otros**: Procedimientos adicionales

#### 4️⃣ Estudios Pendientes o en Curso
- Estudios solicitados sin resultado
- Controles sugeridos pendientes

#### 5️⃣ Tratamientos Recibidos en UTI
- **Soporte**: Ventilación, drogas vasoactivas
- **Medicación**: Antibióticos, corticoides, anticoagulación
- **Procedimientos**: Intervenciones invasivas

#### 6️⃣ Plan de Egreso de UTI
- Indicaciones al pase a Planta
- Tratamientos a continuar/suspender/reevaluar
- Objetivos clínicos planteados

#### 7️⃣ Puntos a Vigilar en Planta
- Aspectos clínicos que requieren seguimiento
- Riesgos mencionados o implícitos

#### 8️⃣ Información Faltante o Poco Clara
- Datos clave ausentes para continuidad del cuidado

## 🔄 Navegación

La aplicación cuenta con una página de inicio donde puedes elegir entre las dos herramientas:
- `/` - Página principal con selección de herramienta
- `/clinical-review` - Revisión de Historia Clínica
- `/uti-transfer` - Pase UTI → Planta

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Pasos

1. **Clonar o descargar el proyecto**

```bash
cd clinic-app
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar API Key GRATUITA de OpenRouter**

Para usar procesamiento con IA avanzada (100% GRATIS):

```bash
# Copiar el archivo de ejemplo
copy .env.example .env

# Editar .env y agregar tu API key GRATUITA
VITE_OPENROUTER_API_KEY=tu-api-key-aqui
```

**Cómo obtener tu API Key gratuita:**
1. Visita [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Crea una cuenta (GitHub, Google o email)
3. Genera una API key
4. Copia la key al archivo `.env`

📖 **Ver guía detallada**: [OPENROUTER_SETUP.md](OPENROUTER_SETUP.md)

> **Nota**: OpenRouter ofrece acceso **gratuito** a múltiples modelos de IA, incluyendo Google Gemini 2.0 Flash. La aplicación también funciona en modo demo sin API key, con análisis básico por palabras clave.

4. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

5. **Abrir en el navegador**

```
http://localhost:3000
```

**💡 Consejo**: Para aprovechar el análisis completo con IA gratuita, obtén una API key en [openrouter.ai/keys](https://openrouter.ai/keys) y agrégala al archivo `.env`.

## 📦 Build para Producción

```bash
npm run build
```

Los archivos optimizados estarán en la carpeta `dist/`.

## 🛠️ Tecnologías

- **React 18** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **OpenRouter API** - Acceso gratuito a múltiples modelos de IA (Google Gemini, Meta Llama, Mistral, etc.)
- **Lucide React** - Iconos

## 📖 Uso

1. **Ingresa el texto clínico**: Copy/paste de notas clínicas, historias, evoluciones, etc.

2. **Analiza**: Haz clic en "Analizar Texto Clínico"

3. **Revisa la estructura**: 
   - Lee el resumen clínico
   - Verifica los datos relevantes extraídos
   - Presta atención a los red flags
   - Considera la información faltante

4. **Aplica tu criterio profesional**: Esta herramienta es un apoyo, no un reemplazo

## ⚠️ Limitaciones y Advertencias

### ⚡ LO QUE NO HACE
- ❌ NO diagnostica
- ❌ NO indica tratamientos  
- ❌ NO toma decisiones clínicas
- ❌ NO reemplaza el juicio profesional
- ❌ NO valida semánticamente el contenido médico

### ✅ LO QUE SÍ HACE
- ✅ Organiza información
- ✅ Identifica datos relevantes
- ✅ Señala red flags para revisar
- ✅ Indica información faltante
- ✅ Piensa como clínico en revisión de notas

## 🔒 Privacidad y Seguridad

- **Modo Demo**: Sin API key, todo el procesamiento es local
- **Modo IA**: Con API key de OpenRouter, el texto se procesa en la nube
  - 🆓 **Completamente gratuito** con modelos como Google Gemini 2.0 Flash
  - ⚠️ NO uses para datos reales de pacientes sin consentimiento informado
  - ⚠️ Cumple con normativas locales (HIPAA, GDPR, Ley de Protección de Datos, etc.)
  - ⚠️ Solo para fines educativos, desarrollo y práctica profesional
  - 🔐 OpenRouter no almacena los mensajes enviados a modelos gratuitos

## 📝 Ejemplo de Texto Clínico

```
Paciente masculino de 65 años con antecedentes de HTA y DM2 en tratamiento.
Consulta por dolor torácico opresivo de 2 horas de evolución, irradiado a brazo izquierdo.
Refiere disnea y diaforesis asociada.

Examen físico:
- TA: 150/95 mmHg
- FC: 98 lpm
- FR: 22 rpm
- Saturación: 94% aire ambiente

ECG: Cambios isquémicos en derivaciones V1-V4, elevación del segmento ST.

Laboratorio pendiente.
Medicación habitual: Enalapril 10mg, Metformina 850mg.
```

## 🤝 Contribuciones

Este proyecto es de código cerrado para uso interno. Para sugerencias o reportes de bugs, contacta al equipo de desarrollo.

## 📄 Licencia

Todos los derechos reservados © 2026

---

**Desarrollado para profesionales de la salud por profesionales de la salud.**

*Última actualización: Febrero 2026*
