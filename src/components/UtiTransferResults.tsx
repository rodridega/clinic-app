import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  FlaskConical, 
  Clock, 
  Pill, 
  ClipboardList, 
  Eye, 
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import type { UtiTransfer } from '../types/utiTransfer';

interface UtiTransferResultsProps {
  results: UtiTransfer;
}

const capitalize = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const UtiTransferResults: React.FC<UtiTransferResultsProps> = ({ results }) => {
  const [copied, setCopied] = useState(false);
  const [copiedTable, setCopiedTable] = useState(false);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(results.textoParaHistoria);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const handleCopyTable = async () => {
    if (!results.estudiosRealizados.laboratorioTabla) return;
    
    try {
      const { fechas, parametros } = results.estudiosRealizados.laboratorioTabla;
      
      // Crear tabla en formato texto con tabs (compatible con Excel/Sheets)
      let tableText = 'Parámetro\tUnidad\t' + fechas.join('\t') + '\n';
      
      parametros.forEach(param => {
        const unidad = param.unidad || '';
        tableText += `${param.nombre}\t${unidad}\t${param.valores.join('\t')}\n`;
      });
      
      await navigator.clipboard.writeText(tableText);
      setCopiedTable(true);
      setTimeout(() => setCopiedTable(false), 2000);
    } catch (err) {
      console.error('Error al copiar tabla:', err);
    }
  };

  return (
    <div className="results-container">
      {/* Section 1: Resumen Cronológico Integrado */}
      <section className="section">
        <h2 className="section-title">
          <FileText size={24} />
          1. Resumen Cronológico Integrado
        </h2>
        <div className="section-content">
          <p>{capitalize(results.resumenCronologico)}</p>
        </div>
      </section>

      {/* Section 2: Línea de Tiempo */}
      <section className="section">
        <h2 className="section-title">
          <Calendar size={24} />
          2. Línea de Tiempo Resumida
        </h2>
        <div className="section-content">
          {results.lineaTiempo.length > 0 ? (
            <div className="timeline-container">
              {results.lineaTiempo.map((entry, index) => (
                <div key={index} className="timeline-entry">
                  <h3 className="subsection-title">{capitalize(entry.fecha)}</h3>
                  <ul>
                    {entry.eventos.map((evento, i) => (
                      <li key={i}>{capitalize(evento)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No se identificaron eventos cronológicos específicos.</p>
          )}
        </div>
      </section>

      {/* Section 3: Estudios Realizados */}
      <section className="section">
        <h2 className="section-title">
          <FlaskConical size={24} />
          3. Estudios Realizados
        </h2>
        <div className="section-content">
          <div className="subsection">
            <h3 className="subsection-title">Laboratorio</h3>
            
            {/* Tabla comparativa de laboratorios */}
            {results.estudiosRealizados.laboratorioTabla && results.estudiosRealizados.laboratorioTabla.parametros.length > 0 && (
              <div className="lab-table-container">
                <div className="lab-table-header">
                  <span style={{ fontSize: '0.9rem', color: '#666' }}>
                    📊 Evolución de valores de laboratorio
                  </span>
                  <button 
                    onClick={handleCopyTable}
                    className="copy-table-button"
                    title="Copiar tabla"
                  >
                    {copiedTable ? (
                      <>
                        <Check size={16} />
                        <span>¡Copiada!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>Copiar tabla</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="lab-table-wrapper">
                  <table className="lab-table">
                    <thead>
                      <tr>
                        <th>Parámetro</th>
                        <th>Unidad</th>
                        {results.estudiosRealizados.laboratorioTabla.fechas.map((fecha, i) => (
                          <th key={i}>{capitalize(fecha)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {results.estudiosRealizados.laboratorioTabla.parametros.map((param, i) => (
                        <tr key={i}>
                          <td className="lab-param-name">{capitalize(param.nombre)}</td>
                          <td className="lab-unit">{param.unidad || '-'}</td>
                          {param.valores.map((valor, j) => (
                            <td key={j} className="lab-value">{valor}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Lista de laboratorios (formato anterior) */}
            {results.estudiosRealizados.laboratorio.length > 0 ? (
              <ul>
                {results.estudiosRealizados.laboratorio.map((item, i) => (
                  <li key={i}>{capitalize(item)}</li>
                ))}
              </ul>
            ) : !results.estudiosRealizados.laboratorioTabla && (
              <p className="empty-state">No se mencionaron estudios de laboratorio.</p>
            )}
          </div>

          <div className="subsection">
            <h3 className="subsection-title">Imágenes</h3>
            {results.estudiosRealizados.imagenes.length > 0 ? (
              <ul>
                {results.estudiosRealizados.imagenes.map((item, i) => (
                  <li key={i}>{capitalize(item)}</li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">No se mencionaron estudios por imágenes.</p>
            )}
          </div>

          {results.estudiosRealizados.otros.length > 0 && (
            <div className="subsection">
              <h3 className="subsection-title">Otros Estudios/Procedimientos</h3>
              <ul>
                {results.estudiosRealizados.otros.map((item, i) => (
                  <li key={i}>{capitalize(item)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Section 4: Estudios Pendientes */}
      <section className="section">
        <h2 className="section-title">
          <Clock size={24} />
          4. Estudios Pendientes o en Curso
        </h2>
        <div className="section-content">
          {results.estudiosPendientes.length > 0 ? (
            <ul>
              {results.estudiosPendientes.map((item, i) => (
                <li key={i}>{capitalize(item)}</li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No se identificaron estudios pendientes.</p>
          )}
        </div>
      </section>

      {/* Section 5: Tratamientos en UTI */}
      <section className="section">
        <h2 className="section-title">
          <Pill size={24} />
          5. Tratamientos Recibidos en UTI
        </h2>
        <div className="section-content">
          <div className="subsection">
            <h3 className="subsection-title">Soporte</h3>
            {results.tratamientosUti.soporte.length > 0 ? (
              <ul>
                {results.tratamientosUti.soporte.map((item, i) => (
                  <li key={i}>{capitalize(item)}</li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">No se mencionó soporte específico.</p>
            )}
          </div>

          <div className="subsection">
            <h3 className="subsection-title">Medicación Relevante</h3>
            {results.tratamientosUti.medicacion.length > 0 ? (
              <ul>
                {results.tratamientosUti.medicacion.map((item, i) => (
                  <li key={i}>{capitalize(item)}</li>
                ))}
              </ul>
            ) : (
              <p className="empty-state">No se mencionó medicación relevante.</p>
            )}
          </div>

          {results.tratamientosUti.procedimientos.length > 0 && (
            <div className="subsection">
              <h3 className="subsection-title">Procedimientos Invasivos</h3>
              <ul>
                {results.tratamientosUti.procedimientos.map((item, i) => (
                  <li key={i}>{capitalize(item)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Section 6: Plan de Egreso */}
      <section className="section">
        <h2 className="section-title">
          <ClipboardList size={24} />
          6. Plan de Egreso de UTI
        </h2>
        <div className="section-content">
          {results.planEgreso.length > 0 ? (
            <ul>
              {results.planEgreso.map((item, i) => (
                <li key={i}>{capitalize(item)}</li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No se especificó plan de egreso explícito.</p>
          )}
        </div>
      </section>

      {/* Section 7: Puntos a Vigilar */}
      <section className="section">
        <h2 className="section-title">
          <Eye size={24} />
          7. Puntos a Vigilar en Planta
        </h2>
        <div className="section-content">
          {results.puntosVigilar.length > 0 ? (
            <ul>
              {results.puntosVigilar.map((item, i) => (
                <li key={i}>{capitalize(item)}</li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No se identificaron puntos específicos de vigilancia.</p>
          )}
        </div>
      </section>

      {/* Section 8: Información Faltante */}
      <section className="section">
        <h2 className="section-title">
          <AlertCircle size={24} />
          8. Información Faltante o Poco Clara
        </h2>
        <div className="section-content">
          {results.informacionFaltante.length > 0 ? (
            <ul>
              {results.informacionFaltante.map((item, i) => (
                <li key={i}>{capitalize(item)}</li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No se identificó información faltante crítica.</p>
          )}
        </div>
      </section>

      {/* Section 9: Texto para Historia Clínica */}
      {results.textoParaHistoria && (
        <section className="section section-highlight">
          <h2 className="section-title">
            <Copy size={24} />
            📋 Texto para Historia Clínica
          </h2>
          <div className="section-content">
            <p style={{ marginBottom: '1rem', color: '#666', fontSize: '0.95rem' }}>
              Este texto está formateado para copiar y pegar directamente en la historia clínica:
            </p>
            <div className="copy-text-container">
              <pre className="copy-text-content">{results.textoParaHistoria}</pre>
              <button 
                onClick={handleCopyText}
                className="copy-button"
                title="Copiar texto"
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    <span>Copiar texto</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Advertencia */}
      {results.advertencia && (
        <div className="warning-box">
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{capitalize(results.advertencia)}</span>
        </div>
      )}
    </div>
  );
};
