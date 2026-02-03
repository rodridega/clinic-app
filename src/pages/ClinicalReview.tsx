import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Loader2, CheckCircle, AlertCircle, Home as HomeIcon } from 'lucide-react';
import { ClinicalReviewResults } from '../components/ClinicalReviewResults';
import { clinicalAnalysisService } from '../services/clinicalAnalysis';
import type { ClinicalReview } from '../types/clinical';

export default function ClinicalReview() {
    const [clinicalText, setClinicalText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<ClinicalReview | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showDelayWarning, setShowDelayWarning] = useState(false);

    const handleAnalyze = async () => {
        if (!clinicalText.trim()) {
            setError('Por favor, ingresa un texto clínico para analizar.');
            return;
        }

        setIsAnalyzing(true);
        setError(null);
        setResult(null);
        setShowDelayWarning(false);

        // Timer para mostrar aviso de demora después de 10 segundos
        const delayTimer = setTimeout(() => {
            setShowDelayWarning(true);
        }, 10000);

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
            clearTimeout(delayTimer);
            setIsAnalyzing(false);
            setShowDelayWarning(false);
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
                <Link to="/" className="back-link">
                    <HomeIcon size={20} />
                    <span>Volver al inicio</span>
                </Link>
                
                <h1>
                    <FileText size={40} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                    Revisión de Historia Clínica
                </h1>
                <p>Resume y organiza historias clínicas desordenadas</p>
                
                {/* API Status Indicator */}
                <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: clinicalAnalysisService.isApiKeyConfigured() 
                        ? 'rgba(34, 197, 94, 0.1)' 
                        : 'rgba(251, 146, 60, 0.1)',
                    border: clinicalAnalysisService.isApiKeyConfigured()
                        ? '1px solid rgba(34, 197, 94, 0.3)'
                        : '1px solid rgba(251, 146, 60, 0.3)',
                    fontSize: '0.9rem'
                }}>
                    {clinicalAnalysisService.isApiKeyConfigured() ? (
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

            {/* Loading State with Delay Warning */}
            {isAnalyzing && (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Procesando texto clínico...</p>
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
            {result && <ClinicalReviewResults review={result} />}

            {/* Footer Info */}
            {!result && !isAnalyzing && !error && clinicalText.length === 0 && (
                <div style={{
                    marginTop: '3rem',
                    padding: '2rem',
                    background: 'rgba(102, 153, 52, 0.1)',
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
                </div>
            )}
        </div>
    );
}
