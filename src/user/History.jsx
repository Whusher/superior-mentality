import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";
import "chart.js/auto"; // Necesario para que Chart.js funcione correctamente
import ContentLA from "../layouts/ContentLA";
import {CheckSubscriptionEndpoint } from '../utils/EndpointExporter';
import * as ss from "simple-statistics";


const ActivityChart = () => {
  const [chartData, setChartData] = useState(null);
  const [dataCopy, setDataCopy] = useState([]);
  const [startDate, setStartDate] = useState("2024-11-05");
  const [endDate, setEndDate] = useState("2024-11-16");
  const [subscriptionInfo, setSubscriptionInfo] = useState(null); // Estado para la suscripción

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
      setDataCopy(data);

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
            onClick={() => window.location.href = "/subscription"} 
          >
            Suscribirme Ahora
          </button>
        </div>
      </div>
    );
  }
  

  if (!chartData) {
    return <p>Cargando datos...</p>;
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
        <ActivityComparisonChart startDate={startDate} endDate={endDate} data={dataCopy} />
        <ExpectedRatio startDate={startDate} endDate={endDate} data={dataCopy} />
      </div>
    </div>
  );
};

const ActivityComparisonChart = ({ startDate, endDate, data }) => {
  const [chartData, setChartData] = useState(null);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
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
    fetchData();
  }, [startDate, endDate, data]);

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



const ExpectedRatio = ({ startDate, endDate, data }) => {
  const [chartData, setChartData] = useState(null);
  const [predictedPercentage, setPredictedPercentage] = useState(null);
  const [regressionFormula, setRegressionFormula] = useState("");

  useEffect(() => {
    const processData = () => {
      try {
        // Procesar datos
        const processedData = data.map((item) => ({
          date: new Date(item.date).toLocaleDateString(), // Formatear fecha
          manualCompleted: parseInt(item.manualCompleted, 10),
          totalActivities: parseInt(item.totalActivities, 10),
        }));

        // Calcula porcentajes de actividades completadas manualmente
        const percentages = processedData.map(
          (item) => (item.manualCompleted / item.totalActivities) * 100 || 0
        );

        // Genera el eje x (índice de fechas) y eje y (porcentajes)
        const x = percentages.map((_, index) => index); // Índices como valores de X
        const y = percentages; // Porcentajes reales como valores de Y

        // Aplica la regresión lineal
        const regression = ss.linearRegression(
          y.map((value, index) => [x[index], value])
        );
        const regressionLine = ss.linearRegressionLine(regression);

        // Predice el siguiente porcentaje
        const nextIndex = x.length; // Índice siguiente
        const predicted = regressionLine(nextIndex); // Predicción

        setPredictedPercentage(predicted.toFixed(2)); // Redondea la predicción

        // Configura la fórmula de la regresión lineal: y = mx + b
        const slope = regression.m.toFixed(4);
        const intercept = regression.b.toFixed(2);
        setRegressionFormula(`y = ${slope}x + ${intercept}`);

        // Configura los datos para el gráfico
        setChartData({
          labels: processedData.map((item) => item.date),
          datasets: [
            {
              label: "Completadas Manualmente (%)",
              data: percentages,
              backgroundColor: "rgba(75,192,192,0.6)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error procesando datos:", error);
      }
    };

    processData();
  }, [startDate, endDate, data]);

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
            title: { display: true, text: "Porcentaje de Actividades Completadas Manualmente" },
          },
        }}
      />
      {predictedPercentage && (
        <div style={{ marginTop: "20px", fontSize: "16px" }}>
          <p>
            <strong>Predicción:</strong> Se espera que el porcentaje de actividades completadas
            manualmente sea aproximadamente{" "}
            <strong className="text-2xl text-green-600 font-bold">
              {predictedPercentage}%
            </strong>
            .
          </p>
          <p>
            <strong>Fórmula de regresión lineal:</strong> <code>{regressionFormula}</code>
          </p>
          <p>
            <strong>Explicación:</strong> La regresión lineal utiliza los porcentajes de actividades
            completadas manualmente como eje Y y los días como eje X para ajustar una recta que
            represente la tendencia de los datos. La fórmula <code>y = mx + b</code> permite calcular
            el porcentaje esperado de actividades en el siguiente día.
          </p>
        </div>
      )}
    </div>
  );
};


function ViewHistory() {
  return <ContentLA child={<ActivityChart />} />;
}

export default ViewHistory;
