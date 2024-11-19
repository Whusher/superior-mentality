import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";
import "chart.js/auto"; // Necesario para que Chart.js funcione correctamente
import { ActivitiesEndpoint } from "../utils/EndpointExporter";
import ContentLA from "../layouts/ContentLA";

const ActivityChart = () => {
  const [chartData, setChartData] = useState(null);
  const [startDate, setStartDate] = useState("2024-11-05");
  const [endDate, setEndDate] = useState("2024-11-16");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4321/api/activities/percentage`,
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

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") setStartDate(value);
    if (name === "endDate") setEndDate(value);
  };

  if (!chartData) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div className="rounded-lg bg-white">
      <div className="w-[900px] p-4">
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
      <div className="w-[900px] mt-7 p-4">
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
        `http://localhost:4321/api/activities/percentage`,
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
