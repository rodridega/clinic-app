import React from 'react';
import { FileQuestion, Lightbulb, CheckSquare, AlertTriangle, Info, RotateCcw } from 'lucide-react';
import type { GuardReceipt } from '../types/guardReceipt';

interface GuardReceiptResultsProps {
    result: GuardReceipt;
    onNewAnalysis: () => void;
}

// Función para capitalizar la primera letra de una cadena
const capitalize = (text: string): string => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export const GuardReceiptResults: React.FC<GuardReceiptResultsProps> = ({ result, onNewAnalysis }) => {
    return (
        <div className="results-container">
            {/* Header con botón de nuevo análisis */}
            <div className="results-header">
                <h2>Auditoría de Coherencia Documental</h2>
                <button onClick={onNewAnalysis} className="secondary-button">
                    <RotateCcw size={20} />
                    Nuevo análisis
                </button>
            </div>

            {/* 1. Diagnósticos mencionados con documentación incompleta */}
            <section className="section">
                <h2 className="section-title">
                    <FileQuestion size={24} />
                    1. Diagnósticos Mencionados con Documentación Incompleta
                </h2>
                <div className="section-content">
                    {result.diagnosticosIncompletos.length > 0 ? (
                        result.diagnosticosIncompletos.map((diag, idx) => (
                            <div key={idx} className="diagnostic-card">
                                <h3 className="diagnostic-title">{capitalize(diag.diagnostico)}</h3>
                                
                                {diag.elementosDocumentados.length > 0 && (
                                    <div className="subsection">
                                        <h4 className="subsection-title">✓ Elementos documentados:</h4>
                                        <ul>
                                            {diag.elementosDocumentados.map((elem, i) => (
                                                <li key={i} className="documented-item">{capitalize(elem)}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {diag.elementosNoMencionados.length > 0 && (
                                    <div className="subsection">
                                        <h4 className="subsection-title warning-title">⚠ Elementos no mencionados:</h4>
                                        <ul>
                                            {diag.elementosNoMencionados.map((elem, i) => (
                                                <li key={i} className="missing-item">{capitalize(elem)}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p style={{ fontStyle: 'italic', opacity: 0.7 }}>
                            No se identificaron diagnósticos con documentación incompleta.
                        </p>
                    )}
                </div>
            </section>

            {/* 2. Hipótesis clínicas relevantes no mencionadas explícitamente */}
            <section className="section">
                <h2 className="section-title">
                    <Lightbulb size={24} />
                    2. Hipótesis Clínicas Relevantes No Mencionadas Explícitamente
                </h2>
                <div className="section-content">
                    {result.hipotesisNoMencionadas.length > 0 ? (
                        <ul>
                            {result.hipotesisNoMencionadas.map((hipotesis, idx) => (
                                <li key={idx} className="hypothesis-item">{capitalize(hipotesis)}</li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ fontStyle: 'italic', opacity: 0.7 }}>
                            No se identificaron hipótesis clínicas relevantes no mencionadas.
                        </p>
                    )}
                </div>
            </section>

            {/* 3. Acciones habitualmente asociadas que no figuran registradas */}
            <section className="section">
                <h2 className="section-title">
                    <CheckSquare size={24} />
                    3. Acciones Habitualmente Asociadas que No Figuran Registradas
                </h2>
                <div className="section-content">
                    {result.accionesHabitualesNoRegistradas.length > 0 ? (
                        result.accionesHabitualesNoRegistradas.map((accion, idx) => (
                            <div key={idx} className="action-card">
                                <h3 className="diagnostic-title">{capitalize(accion.diagnostico)}</h3>
                                <div className="subsection">
                                    <h4 className="subsection-title">Acciones habitualmente documentadas:</h4>
                                    <ul>
                                        {accion.accionesHabituales.map((hab, i) => (
                                            <li key={i}>{capitalize(hab)}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ fontStyle: 'italic', opacity: 0.7 }}>
                            No se identificaron acciones habitualmente documentadas ausentes.
                        </p>
                    )}
                </div>
            </section>

            {/* 4. Información clínica ausente o poco clara para la toma de guardia */}
            <section className="section">
                <h2 className="section-title">
                    <AlertTriangle size={24} />
                    4. Información Clínica Ausente o Poco Clara para la Toma de Guardia
                </h2>
                <div className="section-content">
                    {result.informacionAusente.length > 0 ? (
                        <ul>
                            {result.informacionAusente.map((info, idx) => (
                                <li key={idx} className="missing-info-item">{capitalize(info)}</li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ fontStyle: 'italic', opacity: 0.7 }}>
                            No se identificó información clínica crítica ausente o poco clara.
                        </p>
                    )}
                </div>
            </section>

            {/* 5. Disclaimer */}
            <section className="disclaimer-section">
                <div className="disclaimer-content">
                    <Info size={24} />
                    <div>
                        <h3>Disclaimer</h3>
                        <p>{result.disclaimer}</p>
                    </div>
                </div>
            </section>

            {/* Botón de nuevo análisis al final */}
            <div className="results-footer">
                <button onClick={onNewAnalysis} className="primary-button">
                    <RotateCcw size={20} />
                    Realizar nuevo análisis
                </button>
            </div>
        </div>
    );
};
