import { Link } from 'react-router-dom';
import { FileText, Activity, ClipboardCheck, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="app-container">
      <div className="home-hero">
        <div className="home-hero-content">
          <h1>
            <FileText size={50} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.75rem' }} />
            Clinic App
          </h1>
          <p className="home-subtitle">
            Asistencia en organización y revisión de textos clínicos
          </p>
          <p className="home-description">
            Para profesionales de la salud
          </p>
        </div>
      </div>

      <div className="home-cards-container">
        {/* Clinical Review Card */}
        <Link to="/clinical-review" className="home-card">
          <div className="home-card-icon">
            <FileText size={48} />
          </div>
          <h2 className="home-card-title">
            Revisión de Historia Clínica
          </h2>
          <p className="home-card-description">
            Resume y organiza historias clínicas desordenadas.
            Identifica datos relevantes, red flags e información faltante.
          </p>
          <div className="home-card-action">
            Comenzar <ArrowRight size={20} />
          </div>
        </Link>

        {/* UTI Transfer Card */}
        <Link to="/uti-transfer" className="home-card">
          <div className="home-card-icon">
            <Activity size={48} />
          </div>
          <h2 className="home-card-title">
            Pase UTI → Planta
          </h2>
          <p className="home-card-description">
            Integra evoluciones de UTI en una historia cronológica clara
            para el médico que recibe al paciente en Planta.
          </p>
          <div className="home-card-action">
            Comenzar <ArrowRight size={20} />
          </div>
        </Link>

        {/* Guard Receipt Card */}
        <Link to="/guard-receipt" className="home-card">
          <div className="home-card-icon">
            <ClipboardCheck size={48} />
          </div>
          <h2 className="home-card-title">
            Receptor de Guardia
          </h2>
          <p className="home-card-description">
            Auditoría de coherencia documental para toma de guardia.
            Analiza qué está documentado y qué NO está documentado.
          </p>
          <div className="home-card-action">
            Comenzar <ArrowRight size={20} />
          </div>
        </Link>
      </div>

      {/* Info Footer */}
      <div className="home-footer">
        <p className="home-footer-warning">
          💡 Estas herramientas NO diagnostican, NO indican tratamientos y NO reemplazan el juicio clínico profesional.
        </p>
        <p className="home-footer-note">
          Son asistentes para organizar información y apoyar la toma de decisiones médicas.
        </p>
      </div>
    </div>
  );
}
