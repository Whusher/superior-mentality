import React, { useState } from 'react';
import ContentLU from "../layouts/ContentLU";

const News = () => {
  const [active, setActive] = useState(null);

  const toggleCard = (index) => {
    setActive(active === index ? null : index);
  };

  const Card = ({ title, children, index }) => (
    <div 
      style={{
        backgroundColor: '#3D5473',
        borderRadius: '8px',
        marginBottom: '15px',
        padding: '10px', 
        cursor: 'pointer',
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',  // Reducir sombra
      }}
      onClick={() => toggleCard(index)}
    >
      <h3 style={{
        color: '#BDD9F2',
        fontSize: '1.4rem',  
        fontWeight: 'bold',
        marginBottom: '8px',  
      }}>{title}</h3>
      {active === index && <p style={{ color: '#FFFFFF', fontSize: '1rem', lineHeight: '1.6' }}>{children}</p>}  {/* Reducir tamaño de texto */}
    </div>
  );

  return (
    <div style={{
      padding: '30px',  
      backgroundColor: '#1D2C40',
      color: '#FFFFFF',
      borderRadius: '12px',
      boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',  
      maxWidth: '1000px', 
      margin: 'auto',
    }}>
      <h2 style={{
        color: '#BDD9F2',
        fontSize: '1.6rem',  
        marginBottom: '20px',  
        borderBottom: '2px solid #BDD9F2',
        paddingBottom: '8px',  
        textAlign: 'center',
      }}>Tips para el Día a Día</h2>

      <Card title="Consejos para manejar la impulsividad o la procrastinación:" index={1}>
        <ul style={{
          paddingLeft: '15px',
          lineHeight: '1.6', 
          fontSize: '1.2rem',
          listStyleType: 'circle',
        }}>
          <li><strong>🕒 Uso de timers o temporizadores:</strong> Una técnica efectiva para evitar la procrastinación es usar temporizadores. La técnica Pomodoro, por ejemplo, implica trabajar durante 25 minutos seguidos y luego tomar un descanso de 5 minutos. Esto ayuda a mantener la concentración y reducir las distracciones.</li>
          <li><strong>✏️ Dividir las tareas en pasos pequeños:</strong> A menudo, las personas con TDAH se sienten abrumadas por proyectos grandes. Dividir las tareas en pasos más pequeños y manejables puede hacerlas menos intimidantes y más alcanzables.</li>
          <li><strong>📝 Establecer recompensas inmediatas:</strong> Ofrecerse una recompensa al completar una tarea, como un pequeño descanso, un snack favorito o escuchar música, puede ser motivador.</li>
          <li><strong>🛑 Eliminar distracciones:</strong>Crear un espacio de trabajo libre de distracciones, como apagar notificaciones en el celular o trabajar en una habitación tranquila, puede mejorar el enfoque. </li>
          <li><strong>💭 Practicar la toma de decisiones consciente:</strong> Cuando surja la tentación de actuar impulsivamente, es útil pausar, tomar una respiración profunda y reflexionar antes de actuar.</li>
          <li><strong>⏳ Técnica de la Regla de los 2 Minutos:</strong> Si una tarea puede hacerse en menos de 2 minutos, hazla de inmediato en lugar de postergarla.</li>
        </ul>
      </Card>

      <Card title="Ideas para mantener la motivación y desarrollar buenos hábitos:" index={2}>
        <ul style={{
          paddingLeft: '15px', 
          lineHeight: '1.6',  
          fontSize: '1.2rem',  
          listStyleType: 'circle',
        }}>
          <li><strong>🎯 Establecer metas claras y alcanzables:</strong>Fijar objetivos que sean específicos, medibles y alcanzables ayuda a mantener el enfoque y evita la sensación de fracaso.</li>
          <li><strong>📅 Usar recordatorios visuales:</strong> Notas adhesivas, calendarios, aplicaciones de organización y alarmas pueden servir como recordatorios útiles para completar tareas importantes.</li>
          <li><strong>🗓 Crear una rutina estable:</strong> Tener un horario diario puede dar estructura y estabilidad, lo que es especialmente útil para las personas con TDAH.</li>
          <li><strong>🎉 Celebrar logros pequeños:</strong> Reconocer y recompensar los pequeños avances es clave para mantenerse motivado a largo plazo.</li>
          <li><strong>🤝 Tener un sistema de apoyo:</strong> Hablar con amigos, familiares o terapeutas que brinden apoyo emocional puede ser un refuerzo positivo.</li>
          <li><strong>💖 Practicar la autocompasión:</strong> Aceptar los errores y los días malos como parte del proceso y no castigarse por ello.
          </li>
        </ul>
      </Card>

      <h2 style={{
        color: '#BDD9F2',
        fontSize: '1.6rem', 
        marginBottom: '20px',  
        borderBottom: '2px solid #BDD9F2',
        paddingBottom: '8px',  
        textAlign: 'center',
      }}>Noticias sobre Inclusión y Cultura</h2>

      <Card title="Proyectos o iniciativas que promuevan la inclusión de personas con TDAH en la sociedad:" index={3}>
        <ul style={{
          paddingLeft: '15px',  
          lineHeight: '1.6',  
          fontSize: '1.3rem',  
          listStyleType: 'circle',
        }}>
          <li><strong>🎓 Proyectos de inclusión educativa:</strong> Programas que integran tecnología y estrategias adaptadas para estudiantes con TDAH, mejorando su experiencia de aprendizaje.</li>
          <li><strong>🏢 Trabajo de concienciación en el ámbito laboral:</strong> Redes como el Job Accommodation Network ofrecen recursos para empleadores y empleados con TDAH, promoviendo ambientes inclusivos.</li>
          <li><strong>📺 Campañas de sensibilización en medios de comunicación:</strong> ONGs y organizaciones de salud mental difunden información sobre el TDAH para aumentar la comprensión y reducir el estigma.</li>
          <li><strong>⚽ Iniciativas de inclusión en el deporte:</strong> Clubes deportivos están implementando actividades diseñadas para promover la participación de personas con TDAH, fomentando el desarrollo social y físico.</li>
        </ul>
      </Card>

      <Card title="Cambios en el ámbito laboral o educativo que favorezcan a personas con TDAH:" index={4}>
        <ul style={{
          paddingLeft: '15px', 
          lineHeight: '1.6', 
          fontSize: '1.3rem', 
          listStyleType: 'circle',
        }}>
          <li><strong>📜 Legislación de apoyo en el ámbito laboral:</strong> Países están desarrollando leyes para proteger los derechos de personas con TDAH, promoviendo igualdad de oportunidades en el trabajo.</li>
          <li><strong>🏫 Modificaciones educativas:</strong> Los Planes Educativos Individualizados (PEI) permiten que estudiantes con TDAH reciban apoyo personalizado para alcanzar su máximo potencial.</li>
        </ul>
      </Card>
    </div>
  );
};

export default function ViewNews() {
  return <ContentLU child={<News />} />;
}
