import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, CheckCircle, AlertCircle, Home as HomeIcon } from 'lucide-react';
import UtiTransferForm from '../components/UtiTransferForm';
import { UtiTransferResults } from '../components/UtiTransferResults';
import { analyzeUtiTransfer, isApiKeyConfigured } from '../services/utiTransferAnalysis';
import type { UtiTransfer } from '../types/utiTransfer';

export default function UtiTransferPage() {
  const [result, setResult] = useState<UtiTransfer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDelayWarning, setShowDelayWarning] = useState(false);

  const handleAnalyze = async (evolutions: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setShowDelayWarning(false);

    // Timer para mostrar aviso de demora después de 10 segundos
    const delayTimer = setTimeout(() => {
      setShowDelayWarning(true);
    }, 10000);

    try {
      const analysis = await analyzeUtiTransfer(evolutions);
      setResult(analysis);
    } catch (err) {
      setError('Error al procesar las evoluciones. Por favor, intenta nuevamente.');
      console.error(err);
    } finally {
      clearTimeout(delayTimer);
      setIsLoading(false);
      setShowDelayWarning(false);
    }
  };

  const handleClear = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <Link to="/" className="back-link">
          <HomeIcon size={20} />
          <span>Volver al inicio</span>
        </Link>
        
        <h1>
          <Activity size={40} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }} />
          Pase UTI → Planta
        </h1>
        <p>Resume cronológicamente evoluciones de UTI para el pase a Planta</p>
        
        {/* API Status Indicator */}
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: isApiKeyConfigured() 
            ? 'rgba(34, 197, 94, 0.1)' 
            : 'rgba(251, 146, 60, 0.1)',
          border: isApiKeyConfigured()
            ? '1px solid rgba(34, 197, 94, 0.3)'
            : '1px solid rgba(251, 146, 60, 0.3)',
          fontSize: '0.9rem'
        }}>
          {isApiKeyConfigured() ? (
            <>
              <CheckCircle size={18} style={{ color: '#22c55e' }} />
              <span style={{ color: '#22c55e', fontWeight: 500 }}>API Key Configurada</span>
              <span style={{ opacity: 0.7, marginLeft: '0.25rem' }}>- Análisis con IA activo</span>
            </>
          ) : (
            <>
              <AlertCircle size={18} style={{ color: '#fb923c' }} />
              <span style={{ color: '#fb923c', fontWeight: 500 }}>API Key No Configurada</span>
              <span style={{ opacity: 0.7, marginLeft: '0.25rem' }}>- Usando modo demo</span>
            </>
          )}
        </div>
      </header>

      {/* Input Form */}
      <section className="input-section">
        <UtiTransferForm onAnalyze={handleAnalyze} isLoading={isLoading} />
        
        {result && (
          <button
            onClick={handleClear}
            disabled={isLoading}
            style={{
              background: '#6c757d',
              padding: '1rem 1.5rem',
              marginTop: '1rem',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Analizar Nuevas Evoluciones
          </button>
        )}
      </section>

      {/* Loading State with Delay Warning */}
      {isLoading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Procesando evoluciones de UTI...</p>
          {showDelayWarning && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(251, 146, 60, 0.1)',
              border: '1px solid rgba(251, 146, 60, 0.3)',
              borderRadius: '8px',
              color: '#ea580c',
              fontSize: '0.95rem'
            }}>
              ⏱️ <strong>Esto está tomando más tiempo de lo esperado.</strong>
              <br />
              <span style={{ opacity: 0.9 }}>El sistema está probando diferentes modelos. Por favor, espera un momento más...</span>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Results */}
      {result && <UtiTransferResults results={result} />}

      {/* Footer Info */}
      {!result && !isLoading && !error && (
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          background: 'rgba(102, 153, 52, 0.1)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>ℹ️ Acerca de esta herramienta</h3>
          <div style={{ textAlign: 'left', maxWidth: '700px', margin: '0 auto', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1rem' }}>
              Esta herramienta está diseñada para ayudar al médico clínico que recibe un paciente al pasar de UTI a Planta.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong>¿Qué hace?</strong>
            </p>
            <ul style={{ marginBottom: '1rem', paddingLeft: '1.5rem' }}>
              <li>Integra múltiples evoluciones médicas en una historia cronológica única</li>
              <li>Organiza eventos clínicos por fecha o día de internación</li>
              <li>Resume estudios realizados y pendientes</li>
              <li>Identifica tratamientos recibidos en UTI</li>
              <li>Extrae el plan de egreso y puntos a vigilar en Planta</li>
              <li>Señala información faltante o poco clara</li>
            </ul>
            <p style={{ fontStyle: 'italic', opacity: 0.8 }}>
              Esta herramienta NO diagnostica, NO indica tratamientos y NO reemplaza el juicio clínico profesional.
              Es un asistente para organizar información y facilitar la continuidad del cuidado.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
