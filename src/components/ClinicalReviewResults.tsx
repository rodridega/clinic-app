import React from 'react';
import { FileText, AlertTriangle, HelpCircle, Activity, Shield } from 'lucide-react';
import type { ClinicalReview } from '../types/clinical';

interface ClinicalReviewResultsProps {
    review: ClinicalReview;
}

// Función para capitalizar la primera letra de una cadena
const capitalize = (text: string): string => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export const ClinicalReviewResults: React.FC<ClinicalReviewResultsProps> = ({ review }) => {
    return (
        <div className="results-container">
            {/* 1. Resumen Clínico */}
            <section className="section">
                <h2 className="section-title">
                    <FileText size={24} />
                    1. Resumen Clínico
                </h2>
                <div className="section-content">
                    <p>{capitalize(review.resumenClinico)}</p>
                </div>
            </section>

            {/* 2. Datos Relevantes Identificados */}
            <section className="section">
                <h2 className="section-title">
                    <Activity size={24} />
                    2. Datos Relevantes Identificados
                </h2>
                <div className="section-content">
                    {review.datosRelevantes.antecedentes.length > 0 && (
                        <div className="subsection">
                            <h3 className="subsection-title">Antecedentes</h3>
                            <ul>
                                {review.datosRelevantes.antecedentes.map((item, idx) => (
                                    <li key={idx}>{capitalize(item)}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {review.datosRelevantes.sintomas.length > 0 && (
                        <div className="subsection">
                            <h3 className="subsection-title">Síntomas</h3>
                            <ul>
                                {review.datosRelevantes.sintomas.map((item, idx) => (
                                    <li key={idx}>{capitalize(item)}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {review.datosRelevantes.signos.length > 0 && (
                        <div className="subsection">
                            <h3 className="subsection-title">Signos</h3>
                            <ul>
                                {review.datosRelevantes.signos.map((item, idx) => (
                                    <li key={idx}>{capitalize(item)}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {review.datosRelevantes.estudios.length > 0 && (
                        <div className="subsection">
                            <h3 className="subsection-title">Estudios Mencionados</h3>
                            <ul>
                                {review.datosRelevantes.estudios.map((item, idx) => (
                                    <li key={idx}>{capitalize(item)}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {review.datosRelevantes.medicacionPrevia.length > 0 && (
                        <div className="subsection">
                            <h3 className="subsection-title">Medicación Previa</h3>
                            <ul>
                                {review.datosRelevantes.medicacionPrevia.map((item, idx) => (
                                    <li key={idx}>{capitalize(item)}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {Object.values(review.datosRelevantes).every(arr => arr.length === 0) && (
                        <p style={{ fontStyle: 'italic', opacity: 0.7 }}>
                            No se identificaron datos relevantes específicos en las categorías predefinidas.
                        </p>
                    )}
                </div>
            </section>

            {/* 3. Red Flags a Revisar */}
            <section className="section">
                <h2 className="section-title">
                    <AlertTriangle size={24} />
                    3. Red Flags a Revisar
                </h2>
                <div className="section-content">
                    {review.redFlags.length > 0 ? (
                        <ul>
                            {review.redFlags.map((flag, idx) => (
                                <li key={idx} className="red-flag-item">{capitalize(flag)}</li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ fontStyle: 'italic', opacity: 0.7 }}>
                            No se identificaron red flags específicas en el texto proporcionado.
                        </p>
                    )}
                </div>
            </section>

            {/* 4. Información Faltante o Poco Clara */}
            <section className="section">
                <h2 className="section-title">
                    <HelpCircle size={24} />
                    4. Información Faltante o Poco Clara
                </h2>
                <div className="section-content">
                    {review.informacionFaltante.length > 0 ? (
                        <ul>
                            {review.informacionFaltante.map((item, idx) => (
                                <li key={idx}>{capitalize(item)}</li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ fontStyle: 'italic', opacity: 0.7 }}>
                            No se identificó información faltante crítica.
                        </p>
                    )}
                </div>
            </section>

            {/* 5. Advertencia de Uso */}
            <div className="warning-section">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Shield size={20} />
                    <strong>Advertencia de Uso</strong>
                </div>
                <p>{capitalize(review.advertencia)}</p>
            </div>
        </div>
    );
};
