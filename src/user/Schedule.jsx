import { useState } from "react";
import ContentLA from "../layouts/ContentLA";

function Schedule() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [activities, setActivities] = useState({});
    const [newActivity, setNewActivity] = useState('');
  
    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
    const getCalendarDays = () => {
      const startOfWeek = new Date();
      const weekDays = Array.from({ length: 7 }, (_, i) =>
        new Date(startOfWeek).setDate(startOfWeek.getDate() + i)
      );
      return weekDays;
    };
  
    const addActivity = () => {
      if (newActivity && selectedDate) {
        const dateStr = new Date(selectedDate).toLocaleDateString();
        setActivities((prev) => ({
          ...prev,
          [dateStr]: [...(prev[dateStr] || []), { name: newActivity, completed: false }],
        }));
        setNewActivity('');
      }
    };
  
    const toggleCompletion = (date, index) => {
      const updatedActivities = [...activities[date]];
      updatedActivities[index].completed = !updatedActivities[index].completed;
      setActivities({ ...activities, [date]: updatedActivities });
    };
  
    const selectedActivities =
      activities[new Date(selectedDate).toLocaleDateString()] || [];
  
    const totalActivities = selectedActivities.length;
    const completedActivities = selectedActivities.filter(
      (activity) => activity.completed
    ).length;
    const completionPercentage =
      totalActivities > 0
        ? Math.round((completedActivities / totalActivities) * 100)
        : 0;
  
    return (
      <div className="flex flex-col w-[70vw] mx-auto p-6 bg-minimal rounded-md">
        <h1 className="text-3xl font-bold text-dark mb-4">
          Calendario de Actividades
        </h1>
  
        <div className="w-full overflow-x-auto">
          <div className="grid grid-cols-7 gap-4 mb-6 min-w-max">
            {getCalendarDays().map((day, idx) => (
              <button
                key={idx}
                className={`p-4 text-center rounded-lg ${
                  selectedDate === day
                    ? 'bg-plus-min text-white'
                    : 'bg-opac text-white'
                } transition-all hover:bg-plus-min`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="font-bold">{daysOfWeek[idx]}</div>
                <div>{new Date(day).getDate()}</div>
              </button>
            ))}
          </div>
        </div>
  
        {selectedDate && (
          <div className="bg-darker-light p-4 rounded-lg mb-6">
            <h2 className="text-2xl text-white mb-4">
              Actividades para {new Date(selectedDate).toLocaleDateString()}
            </h2>
  
            {selectedActivities.length > 0 ? (
              <>
                <ul className="mb-4">
                  {selectedActivities.map((activity, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center mb-2"
                    >
                      <span
                        className={`text-lg ${
                          activity.completed
                            ? 'line-through text-gray-300'
                            : 'text-minimal'
                        }`}
                      >
                        {activity.name}
                      </span>
                      <button
                        className={`ml-4 px-3 py-1 rounded text-white ${
                          activity.completed ? 'bg-green-500' : 'bg-plus-min'
                        }`}
                        onClick={() =>
                          toggleCompletion(
                            new Date(selectedDate).toLocaleDateString(),
                            index
                          )
                        }
                      >
                        {activity.completed ? 'Completado' : 'Marcar'}
                      </button>
                    </li>
                  ))}
                </ul>
  
                {/* Barra de progreso */}
                <div className="w-full bg-opac rounded-full h-4 mb-4">
                  <div
                    className="bg-plus-min h-4 rounded-full"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <p className="text-white text-sm mb-4">
                  {completionPercentage}% completado
                </p>
              </>
            ) : (
              <p className="text-white">No hay actividades para este día.</p>
            )}
  
            <div className="flex items-center">
              <input
                type="text"
                className="border border-gray-300 p-2 w-full rounded-md"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="Nueva actividad..."
              />
              <button
                className="bg-dark text-white px-4 py-2 rounded-md ml-2"
                onClick={addActivity}
              >
                Añadir
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

export default function ViewSchedule() {
  return <ContentLA child={<Schedule />} />;
}
