# Configuración de OpenRouter 🚀

## ¿Qué es OpenRouter?

OpenRouter es una plataforma que proporciona acceso unificado a múltiples modelos de IA de diferentes proveedores (OpenAI, Anthropic, Google, Meta, Mistral, etc.) a través de una única API.

## ✨ Ventajas

- **100% GRATUITO** con modelos seleccionados
- Sin necesidad de tarjeta de crédito
- Acceso a múltiples modelos de IA
- API compatible con OpenAI
- Sin límites estrictos para uso personal

## 🔑 Cómo obtener tu API Key GRATIS

### Paso 1: Crear cuenta

1. Visita [https://openrouter.ai](https://openrouter.ai)
2. Haz clic en "Sign In" (arriba a la derecha)
3. Elige una opción:
   - Continuar con GitHub
   - Continuar con Google
   - Continuar con Email

### Paso 2: Generar API Key

1. Una vez logueado, ve a [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Haz clic en "Create Key"
3. Dale un nombre a tu key (ej: "Clinic App")
4. Copia la key generada (comienza con `sk-or-v1-...`)

### Paso 3: Configurar en la aplicación

1. En la carpeta del proyecto, crea un archivo `.env`:

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

2. Abre el archivo `.env` y pega tu API key:

```
VITE_OPENROUTER_API_KEY=sk-or-v1-tu-key-aqui
```

3. Guarda el archivo y reinicia el servidor de desarrollo si está corriendo.

## 🤖 Modelos Gratuitos Disponibles

La aplicación usa por defecto **Google Gemini 2.0 Flash** que es:
- ✅ Completamente gratuito
- ✅ Rápido
- ✅ Potente para análisis de texto
- ✅ Sin límites estrictos

### Otros modelos gratuitos disponibles

Puedes cambiar el modelo editando `src/services/clinicalAnalysis.ts`:

```typescript
// Opciones gratuitas:
private model = 'google/gemini-2.0-flash-exp:free'; // Por defecto
// private model = 'meta-llama/llama-3.1-8b-instruct:free';
// private model = 'mistralai/mistral-7b-instruct:free';
// private model = 'google/gemini-flash-1.5:free';
```

## 🔍 Verificar que funciona

1. Inicia la aplicación:
```bash
npm run dev
```

2. Abre http://localhost:3000

3. Ingresa un texto clínico de ejemplo

4. Haz clic en "Analizar Texto Clínico"

5. Si todo funciona correctamente:
   - ✅ Verás un análisis detallado en segundos
   - ✅ No verás errores en la consola
   - ✅ El análisis será mucho más completo que el modo demo

## 🚨 Solución de Problemas

### Error: "Invalid API Key"

- Verifica que copiaste la key completa
- Asegúrate de que no haya espacios antes o después
- La key debe empezar con `sk-or-v1-`

### Error: "Model not found"

- Verifica que el modelo esté disponible en OpenRouter
- Intenta con otro modelo gratuito
- Visita https://openrouter.ai/models para ver modelos disponibles

### El análisis es muy básico

- Verifica que el archivo `.env` esté en la raíz del proyecto (no en `src/`)
- Reinicia el servidor de desarrollo después de crear/editar `.env`
- Abre las DevTools del navegador (F12) y busca errores en la consola

### Error: "CORS" o "Network Error"

- OpenRouter requiere que especifiques el origen de la petición
- Esto ya está configurado en el código (`HTTP-Referer`)
- Si persiste, verifica tu conexión a internet

## 📊 Límites de Uso Gratuito

OpenRouter ofrece modelos gratuitos con límites generosos:

- **Gemini 2.0 Flash**: ~10-20 peticiones por minuto
- **Llama 3.1**: ~10 peticiones por minuto
- **Mistral 7B**: ~10 peticiones por minuto

Para uso profesional con mayor volumen, considera los modelos de pago de OpenRouter (muy económicos).

## 🔐 Seguridad

- **NO** compartas tu API key públicamente
- **NO** la subas a GitHub (está en `.gitignore`)
- **NO** la incluyas en capturas de pantalla
- Si crees que tu key se comprometió, revócala en https://openrouter.ai/keys

## 💡 Consejos

1. **Modo Demo vs Modo IA**:
   - Sin API key: análisis básico por palabras clave
   - Con API key: análisis avanzado con IA

2. **Privacidad**:
   - OpenRouter NO almacena mensajes enviados a modelos gratuitos
   - De todas formas, NO uses datos reales de pacientes

3. **Rendimiento**:
   - Gemini 2.0 Flash es el más rápido (~2-3 segundos)
   - Llama 3.1 es muy bueno para español (~3-5 segundos)

## 🆘 Soporte

- Documentación OpenRouter: https://openrouter.ai/docs
- Modelos disponibles: https://openrouter.ai/models
- Discord de OpenRouter: https://discord.gg/openrouter

---

**¡Listo! Ahora tienes acceso gratuito a IA avanzada para tu herramienta clínica. 🎉**
