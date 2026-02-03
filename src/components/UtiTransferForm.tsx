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
                        placeholder="Pegue aquí todas las evoluciones médicas del paciente durante su estadía en UTI.&#10;&#10;Ejemplo:&#10;&#10;DÍA 1 - 10/01/2025&#10;Paciente varón de 65 años ingresa a UTI por insuficiencia respiratoria aguda...&#10;&#10;DÍA 3 - 12/01/2025&#10;Evoluciona con mejoría del patrón respiratorio, se logra descenso de FiO2...&#10;&#10;DÍA 5 - 14/01/2025&#10;Se decide pase a sala general..."
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
