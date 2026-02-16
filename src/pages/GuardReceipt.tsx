import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, Loader2, CheckCircle, AlertCircle, Home as HomeIcon } from 'lucide-react';
import { GuardReceiptResults } from '../components/GuardReceiptResults';
import { guardReceiptAnalysisService } from '../services/guardReceiptAnalysis';
import type { GuardReceipt } from '../types/guardReceipt';

export default function GuardReceipt() {
    const [evolucionesText, setEvolucionesText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<GuardReceipt | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showDelayWarning, setShowDelayWarning] = useState(false);

    const handleAnalyze = async () => {
        if (!evolucionesText.trim()) {
            setError('Por favor, ingresa las evoluciones médicas para analizar.');
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
            const response = await guardReceiptAnalysisService.analyzeGuardReceipt({
                evolucionesTexto: evolucionesText
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
        setEvolucionesText('');
        setResult(null);
        setError(null);
    };

    const handleNewAnalysis = () => {
        setResult(null);
        setError(null);
        setEvolucionesText('');
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
                    <ClipboardCheck size={40} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                    Receptor de Guardia
                </h1>
                <p>Auditoría de coherencia documental para toma de guardia</p>
                
                {/* API Status Indicator */}
                <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: guardReceiptAnalysisService.isApiKeyConfigured() 
                        ? 'rgba(34, 197, 94, 0.1)' 
                        : 'rgba(251, 146, 60, 0.1)',
                    border: guardReceiptAnalysisService.isApiKeyConfigured()
                        ? '1px solid rgba(34, 197, 94, 0.3)'
                        : '1px solid rgba(251, 146, 60, 0.3)',
                    fontSize: '0.9rem'
                }}>
                    {guardReceiptAnalysisService.isApiKeyConfigured() ? (
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
                <h2 style={{ marginBottom: '1rem' }}>📋 Evoluciones Médicas</h2>
                <div className="textarea-container">
                    <textarea
                        className="clinical-textarea"
                        placeholder="Ingresa o pega aquí las evoluciones médicas del paciente...&#10;&#10;Incluye: pases de sala, evoluciones diarias, interconsultas, etc.&#10;&#10;Ejemplo:&#10;Día 1 UTI: Paciente ingresa por IAM con supradesnivel ST V1-V4...&#10;Día 2 UTI: Evoluciona hemodinámicamente estable..."
                        value={evolucionesText}
                        onChange={(e) => setEvolucionesText(e.target.value)}
                        disabled={isAnalyzing}
                    />
                    <div className="char-count">
                        {evolucionesText.length} caracteres
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                        className="analyze-button"
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !evolucionesText.trim()}
                        style={{ flex: 1 }}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} />
                                Analizando...
                            </>
                        ) : (
                            'Analizar Coherencia Documental'
                        )}
                    </button>

                    {(evolucionesText || result) && (
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
                    <p>Procesando evoluciones médicas...</p>
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
            {result && <GuardReceiptResults result={result} onNewAnalysis={handleNewAnalysis} />}

            {/* Footer Info */}
            {!result && !isAnalyzing && !error && evolucionesText.length === 0 && (
                <div style={{
                    marginTop: '3rem',
                    padding: '2rem',
                    background: 'rgba(102, 153, 52, 0.1)',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ marginBottom: '1rem' }}>ℹ️ Cómo usar esta herramienta</h3>
                    <ol style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto', lineHeight: '1.8' }}>
                        <li>Ingresa o pega las evoluciones médicas del paciente</li>
                        <li>Incluye pases de sala, evoluciones diarias, interconsultas</li>
                        <li>Haz clic en "Analizar Coherencia Documental"</li>
                        <li>Revisa el análisis de qué está documentado y qué NO está documentado</li>
                        <li>Utiliza el análisis como apoyo para la toma de guardia</li>
                    </ol>
                    <p style={{ marginTop: '1.5rem', fontStyle: 'italic', opacity: 0.8 }}>
                        <strong>⚠️ Importante:</strong> Esta herramienta NO diagnostica, NO indica tratamientos, 
                        NO prioriza conductas y NO reemplaza el criterio médico profesional.
                        Solo analiza la coherencia interna del texto proporcionado.
                    </p>
                </div>
            )}
        </div>
    );
}
