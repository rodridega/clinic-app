import React, { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { ClinicalReviewResults } from './components/ClinicalReviewResults';
import { clinicalAnalysisService } from './services/clinicalAnalysis';
import type { ClinicalReview } from './types/clinical';
import './index.css';

function App() {
  const [clinicalText, setClinicalText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ClinicalReview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!clinicalText.trim()) {
      setError('Por favor, ingresa un texto clínico para analizar.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await clinicalAnalysisService.analyzeClinicalText({
        textoClinico: clinicalText
      });

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.error || 'Error desconocido al procesar el texto.');
      }
    } catch (err) {
      setError('Error al procesar la solicitud. Por favor, intenta nuevamente.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setClinicalText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <h1>
          <FileText size={40} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }} />
          Clinic App
        </h1>
        <p>Asistencia en organización y revisión de textos clínicos</p>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.8 }}>
          Para profesionales de la salud
        </p>
      </header>

      {/* Input Section */}
      <section className="input-section">
        <h2 style={{ marginBottom: '1rem' }}>📥 Texto Clínico</h2>
        <div className="textarea-container">
          <textarea
            className="clinical-textarea"
            placeholder="Ingresa o pega aquí el texto clínico a revisar...&#10;&#10;Ejemplo:&#10;Paciente masculino de 65 años con antecedentes de HTA y DM2.&#10;Consulta por dolor torácico opresivo de 2 horas de evolución.&#10;TA: 150/95 mmHg, FC: 98 lpm.&#10;ECG muestra cambios isquémicos en cara anterior..."
            value={clinicalText}
            onChange={(e) => setClinicalText(e.target.value)}
            disabled={isAnalyzing}
          />
          <div className="char-count">
            {clinicalText.length} caracteres
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !clinicalText.trim()}
            style={{ flex: 1 }}
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} />
                Analizando...
              </>
            ) : (
              'Analizar Texto Clínico'
            )}
          </button>
          
          {(clinicalText || result) && (
            <button
              onClick={handleClear}
              disabled={isAnalyzing}
              style={{
                background: '#6c757d',
                padding: '1rem 1.5rem'
              }}
            >
              Limpiar
            </button>
          )}
        </div>
      </section>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Procesando texto clínico...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Results */}
      {result && <ClinicalReviewResults review={result} />}

      {/* Footer Info */}
      {!result && !isAnalyzing && !error && clinicalText.length === 0 && (
        <div style={{ 
          marginTop: '3rem', 
          padding: '2rem', 
          background: 'rgba(102, 126, 234, 0.1)', 
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>ℹ️ Cómo usar esta herramienta</h3>
          <ol style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto', lineHeight: '1.8' }}>
            <li>Ingresa o pega el texto clínico en el área de texto superior</li>
            <li>Haz clic en "Analizar Texto Clínico"</li>
            <li>Revisa la estructura de revisión generada</li>
            <li>Utiliza el análisis como apoyo para tu criterio profesional</li>
          </ol>
          <p style={{ marginTop: '1.5rem', fontStyle: 'italic', opacity: 0.8 }}>
            Esta herramienta NO diagnostica, NO indica tratamientos y NO reemplaza el juicio clínico profesional.
          </p>
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            background: 'rgba(52, 211, 153, 0.1)', 
            borderRadius: '8px',
            border: '1px solid rgba(52, 211, 153, 0.3)'
          }}>
            <p style={{ margin: 0, fontWeight: 500 }}>
              💡 <strong>Tip:</strong> Obtén análisis completo con IA configurando OpenRouter (100% gratis)
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
              Ver <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" style={{ color: '#34d399' }}>instrucciones de configuración</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
