import { useState } from 'react';
import { Loader2, Activity } from 'lucide-react';

interface UtiTransferFormProps {
    onAnalyze: (evolutions: string) => void;
    isLoading: boolean;
}

export default function UtiTransferForm({ onAnalyze, isLoading }: UtiTransferFormProps) {
    const [evolutions, setEvolutions] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (evolutions.trim()) {
            onAnalyze(evolutions);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <h2 style={{ marginBottom: '1rem' }}>📋 Evoluciones de UTI</h2>
                <div className="textarea-container">
                    <textarea
                        id="evolutions"
                        className="clinical-textarea"
                        value={evolutions}
                        onChange={(e) => setEvolutions(e.target.value)}
                        placeholder="Pegue aquí todas las evoluciones médicas del paciente durante su estadía en UTI.&#10;&#10;Ejemplo:&#10;&#10;Paciente cursando 8° día de internación en UTI por HDA en estudio, con antecedentes de enfermedad renal crónica, cirrosis hepática, cirugía de abdomen agudo oclusivo que complicó posteriormente con colección intraabdominal y requirió reintervención e ileostomía de alto débito. Anemia mixta, ferropénica más trastornos crónicos. Desnutrición. Se encuentra vigil, OTE. Ventilando espontaneamente a AA. Sat 99%, FR 10 FC 68, buena mecanica ventilatoria. Se realiza asistencia kinesica motora, movilizaciones activas en decubito dorsal en cama de MMSS e MMII. Control y cuidados posturales en cama, cuidando puntos de apoyo.  

--------------------------------------------------------------------------------

Evolución:  
Evolución UTI turno noche: Paciente masculino de 58 años de edad, con antecedentes de ERC, cirrosis hepática de causa no etílica Child B, cirugia de abdomen por obstrucción por fitobezoar, reintervenido por colección intraabdominal con ileostomía (hace mas de 10 años), anemia mixta, ferropénica más trastornos crónicos, desnutrición proteico-calórica con alimentación enteral, internación domiciliaria, Internación en Sanatorio 08/09/25-26/10/25 por bacteriemia a ECN"
                        disabled={isLoading}
                        required
                    />
                    <div className="char-count">
                        {evolutions.length} caracteres
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                        type="submit"
                        className="analyze-button"
                        disabled={isLoading || !evolutions.trim()}
                        style={{ flex: 1 }}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} />
                                Analizando evoluciones...
                            </>
                        ) : (
                            <>
                                <Activity size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                                Analizar Pase UTI → Planta
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
