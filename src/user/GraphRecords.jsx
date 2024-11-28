import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { GraphRecordsEndpoint } from '../utils/EndpointExporter';
import ContentLA from '../layouts/ContentLA';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraphRecords = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${GraphRecordsEndpoint}?token=${token}`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Error al cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const processData = () => {
    if (data.length === 0) return null;

    const scores = data.map((item) => item.score);
    const labels = data.map((item) => `${item.name} (${item.username})`);

    // Regresión Lineal
    const n = scores.length;
    const sumX = scores.reduce((sum, _, idx) => sum + idx, 0);
    const sumY = scores.reduce((sum, value) => sum + value, 0);
    const sumXY = scores.reduce((sum, value, idx) => sum + idx * value, 0);
    const sumX2 = scores.reduce((sum, idx) => sum + idx ** 2, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
    const intercept = (sumY - slope * sumX) / n;

    const regressionLine = scores.map((_, idx) => slope * idx + intercept);

    return {
      labels,
      datasets: [
        {
          label: 'Puntajes',
          data: scores,
          borderColor: '#4A90E2',
          backgroundColor: '#ADD8E6',
          pointBackgroundColor: '#4A90E2',
          pointBorderColor: '#FFFFFF',
          pointHoverRadius: 8,
          pointRadius: 5,
          fill: true,
          tension: 0.3,
        },
        {
          label: 'Regresión Lineal',
          data: regressionLine,
          borderColor: '#D9534F',
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
          tension: 0.1,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `Puntaje: ${context.raw}`,
        },
        backgroundColor: '#1D2C40',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#3D5473',
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#3D5473',
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#1D2C40',
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#1D2C40',
          font: {
            size: 12,
          },
        },
        grid: {
          color: '#E0E0E0',
        },
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <button
        onClick={() => navigate('/records')}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Atrás
      </button>
      <h1 className="text-3xl font-bold text-center mb-6 text-minimal">Gráfica de Puntajes</h1>
      {loading ? (
        <div className="text-center text-gray-500">Cargando...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="bg-white p-6 rounded shadow-lg">
          <Line data={processData()} options={options} />
        </div>
      )}
    </div>
  );
};

export default function ViewGraphRecords() {
  return <ContentLA child={<GraphRecords />} />;
}
