import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentLA from '../layouts/ContentLA';
import { TopActivitiesEndpoint } from '../utils/EndpointExporter';

const Records = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${TopActivitiesEndpoint}?token=${token}`);
      const data = await response.json();
      
      if (data.length === 0) {
        setActivities([]);
      } else {
        setActivities(data);
      }
    } catch (err) {
      setError('Hubo un error al cargar los datos. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const activityContent = (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-minimal">Top 3 Jugadores por Actividad</h1>
      {loading ? (
        <div className="text-center text-gray-500">Cargando...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : activities.length === 0 ? (
        <div className="col-span-3 text-center text-gray-500">Empty</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <div
              key={activity.id_activity}
              className="bg-white shadow-md rounded-lg p-6 transition-transform transform hover:scale-105"
            >
              <h2 className="text-2xl font-semibold mb-2 text-opac">{activity.name}</h2>
              <p className="text-gray-700 mb-4">{activity.description}</p>
              {activity.topScores && activity.topScores.length > 0 ? (
                <div className="top-scores">
                  <h3 className="font-semibold text-lg mb-2">Top 3 Jugadores</h3>
                  <ul>
                    {activity.topScores.map((score, idx) => (
                      <li key={idx} className="text-gray-800 mb-2">
                        <span>{score.username}</span> - <span>{score.score} puntos</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500">Sin puntajes disponibles.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return <ContentLA child={activityContent} />;
};

export default Records;
