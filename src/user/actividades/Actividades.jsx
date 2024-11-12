import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentLA from '../../layouts/ContentLA'; // Importa ContentLA

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      const data = [
        { id: 1, title: "Juego de Memoria", description: "Encuentra los pares.", route: "/actividades/MemoryGame" },
        { id: 2, title: "Secuencia de Colores", description: "Repite la secuencia.", route: "/actividades/ColorSequence" },
        { id: 3, title: "Atrapador de Frutas", description: "Atrapa las frutas.", route: "/actividades/FruitCatcher" },
        { id: 4, title: "Dibujo Rápido", description: "Dibuja el objeto en un tiempo limitado.", route: "/actividades/DrawingGame" },
        { id: 5, title: "Simón Dice", description: "Repite la secuencia de colores.", route: "/actividades/SimonSays" },
      ];
      setActivities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  const activityContent = (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-minimal">Actividades</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white shadow-md rounded-lg p-6 transition-transform transform hover:scale-105"
          >
            <h2 className="text-2xl font-semibold mb-2 text-opac">{activity.title}</h2>
            <p className="text-gray-700 mb-4">{activity.description}</p>
            <button 
              onClick={() => navigate(activity.route)} 
              className="bg-plus-min text-white px-4 py-2 rounded hover:bg-opacity-80 transition-colors"
            >
              Jugar
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return <ContentLA child={activityContent} />;
};

export default ActivityList;
