import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";
import "chart.js/auto"; // Necesario para que Chart.js funcione correctamente
import ContentLA from "../layouts/ContentLA";
import { CheckSubscriptionEndpoint } from '../utils/EndpointExporter';
import { useNavigate } from 'react-router-dom';

const ActivityChart = () => {
  const [chartData, setChartData] = useState(null);
  const [startDate, setStartDate] = useState("2024-11-05");
  const [endDate, setEndDate] = useState("2024-11-16");
  const [subscriptionInfo, setSubscriptionInfo] = useState(null); // Estado para la suscripción
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://activity-services-whusher-whushers-projects.vercel.app/api/activities/percentage`,
        {
          params: { startDate, endDate },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      const data = response.data;

      setChartData({
        labels: data.map((item) => item.date),
        datasets: [
          {
            label: "Porcentaje de Actividades Completadas Manualmente",
            data: data.map((item) => item.percentageManual),
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const checkSubscription = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      const response = await fetch(`${CheckSubscriptionEndpoint}?token=${token}`);
      const data = await response.json();

      if (data.hasSubscription) {
        setSubscriptionInfo({
          startDate: new Date(data.startDate).toLocaleDateString(),
          endDate: new Date(data.endDate).toLocaleDateString(),
        });
      } else {
        setSubscriptionInfo(null);
      }
    } catch (error) {
      console.error("Error al verificar la suscripción:", error);
    }
  };

  useEffect(() => {
    checkSubscription();
    fetchData();
  }, [startDate, endDate]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") setStartDate(value);
    if (name === "endDate") setEndDate(value);
  };

  if (!subscriptionInfo) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-blue-600">¡Acceso Restringido!</h2>
          <p className="mt-4 text-gray-700">
            No tienes una suscripción activa para acceder a esta funcionalidad. 
            Suscríbete ahora y desbloquea todos los beneficios exclusivos.
          </p>
          <button
            className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            onClick={() => navigate('/subscription')} 
          >
            Suscribirme Ahora
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white flex flex-col md:block">
      <div className="md:w-[900px] p-4 w-[400px] ">
        <h2>Porcentaje de Actividades Completadas Manualmente</h2>
        <div className="mb-4">
          <label className="mr-2">Inicio:</label>
          <input
            type="date"
            name="startDate"
            value={startDate}
            onChange={handleDateChange}
            className="border border-gray-300 rounded p-1"
          />
          <label className="ml-4 mr-2">Fin:</label>
          <input
            type="date"
            name="endDate"
            value={endDate}
            onChange={handleDateChange}
            className="border border-gray-300 rounded p-1"
          />
        </div>
        <Line data={chartData} />
      </div>
      <div className="md:w-[900px]  w-[400px] mt-7 p-4">
        <h2>Activities Closed vs Incomplete</h2>
        <ActivityComparisonChart startDate={startDate} endDate={endDate} />
      </div>
    </div>
  );
};

const ActivityComparisonChart = ({ startDate, endDate }) => {
  const [chartData, setChartData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://activity-services-whusher-whushers-projects.vercel.app/api/activities/percentage`,
        {
          params: { startDate, endDate },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      const data = response.data;

      // Procesar datos para actividades cerradas automáticamente
      const processedData = data.map((item) => ({
        date: new Date(item.date).toLocaleDateString(), // Formatear fecha
        manualCompleted: parseInt(item.manualCompleted, 10),
        autoClosed: item.totalActivities - parseInt(item.manualCompleted, 10),
      }));

      setChartData({
        labels: processedData.map((item) => item.date),
        datasets: [
          {
            label: "Completadas Manualmente",
            data: processedData.map((item) => item.manualCompleted),
            backgroundColor: "rgba(75,192,192,0.6)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
          },
          {
            label: "Cerradas Automáticamente",
            data: processedData.map((item) => item.autoClosed),
            backgroundColor: "rgba(255,99,132,0.6)",
            borderColor: "rgba(255,99,132,1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  if (!chartData) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Actividades Completadas vs Cerradas Auto" },
          },
        }}
      />
    </div>
  );
};

function ViewHistory() {
  return <ContentLA child={<ActivityChart />} />;
}

export default ViewHistory;
