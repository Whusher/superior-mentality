import { useEffect, useState } from "react";
import ContentLA from "../layouts/ContentLA";
import { CheckIcon, Microphone, Stop } from "../utils/SVGExporter";
import { useAuth } from "../context/AuthContext";
import { uploadAudio } from "../firebase/Initialization";
import { toast } from "react-toastify";
import { ActivitiesEndpoint } from "../utils/EndpointExporter";
import TimeReminder from "../components/TimeReminder";

// Función auxiliar para formatear fechas
const formatCalendarDate = (date) => {
  if (!date) return null;
  const localDate = new Date(date);
  localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());
  return localDate;
};

function Schedule() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [activity, setActivity] = useState("");
  const [audioURL, setAudioURL] = useState(null);
  const [priority, setPriority] = useState(0);
  const [currentActivitiesDay, setCurrentActivitiesDay] = useState([]);
  const [updater, setUpdater] = useState(false);
  const [activityTime, setActivityTime] = useState("12:00"); // Hora por defecto
  const { user } = useAuth();
  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const todayIndex = new Date().getDay();

  const handleRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setRecording(recorder);

    let chunks = [];
    recorder.ondataavailable = (event) => chunks.push(event.data);

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/wav" });
      setAudioBlob(blob);
      setAudioURL(URL.createObjectURL(blob));
    };

    recorder.start();
  };

  const handleRestoreAct = () => {
    setActivity("");
    setAudioURL(null);
    setAudioBlob(null);
    setActivityTime("12:00");
    setAudioURL(null);
    setPriority(0);
  };

  const handleStopRecording = () => {
    if (recording) {
      recording.stop();
      setRecording(false);
    }
  };

  const handleSubmmitActivity = async (e, date) => {
    e.preventDefault();
    try {
      let URLA;
      if (audioBlob) {
        let NameActAudio = `${Date.now()}${user.name}${activityTime}`;
        URLA = await uploadAudio(audioBlob, { user: user.name }, NameActAudio);
        console.log(URLA);
      }
      const res = await fetch(`${ActivitiesEndpoint}/createAcytivity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify({
          audioURL: URLA,
          activityDesc: activity,
          activityTime: activityTime,
          priority: Number(priority),
          scheduleDate: date,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      const data = await res.json();
      console.log(data);
    } catch (e) {
      console.log(e);
      toast.error("Error setting activity");
    } finally {
      handleRestoreAct();
      setUpdater(!updater);
    }
  };

  const handleCompleteActivity = async (e, actObject) => {
    e.preventDefault();
    try {
      const res = await fetch(`${ActivitiesEndpoint}/markActivityAsCompleted`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify(actObject),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(`${data.message}`);
      } else {
        toast.error("Can not mark as complete this activity...");
      }
    } catch (e) {
      console.log(e);
      toast.error("Can not mark as complete this activity...");
    } finally {
      setUpdater(!updater);
    }
  };

  // Función auxiliar para normalizar fechas
  const normalizeDateToUTC = (date) => {
    if (typeof date === "string") {
      date = new Date(date);
    }
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
  };

  // Función para filtrar actividades por fecha
  const filterActivitiesByDate = (activities, selectedDate) => {
    if (!selectedDate || !activities?.length) return [];
    
    const normalizedSelectedDate = normalizeDateToUTC(selectedDate);
    const selectedDateString = normalizedSelectedDate.toISOString().split("T")[0];

    return activities.filter((activity) => {
      const activityDate = normalizeDateToUTC(activity.DateAgenda);
      const activityDateString = activityDate.toISOString().split("T")[0];
      return activityDateString === selectedDateString;
    });
  };

  // Función actualizada para obtener días del calendario
  const getCalendarDays = () => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      return normalizeDateToUTC(day);
    });
  };

  const finishDay = async (agendaId) => {
    try {
      const response = await fetch("http://localhost:4321/finish-day", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agendaId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        alert("Agenda completed successfully!");
      } else {
        console.error("Failed to finish day.");
      }
    } catch (error) {
      console.error("Error finishing day:", error);
    }
  };


  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(`${ActivitiesEndpoint}/getActivitiesBySchedule`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });
        const data = await res.json();
        console.log(data);
        setCurrentActivitiesDay(data);
      } catch (e) {
        console.log(e);
        toast.error("Activities Service not available");
      }
    };
    fetchActivities();
  }, [updater]);

  return (
    <div className="flex flex-col w-full mx-auto p-6 bg-minimal rounded-md">
      <h1 className="text-3xl font-bold text-dark mb-4">TO DO List</h1>

      <div className="w-full overflow-x-auto">
        <div className="grid grid-cols-7 gap-4 mb-6 min-w-max">
          {getCalendarDays().map((day, idx) => {
            const formattedDay = formatCalendarDate(day);
            return (
              <button
                key={idx}
                className={`p-4 text-center rounded-lg ${
                  selectedDate?.toISOString().split("T")[0] ===
                  day.toISOString().split("T")[0]
                    ? "bg-plus-min text-white"
                    : "bg-opac text-white"
                } transition-all hover:bg-plus-min`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="font-bold">
                  {daysOfWeek[(todayIndex + idx) % 7]}{" "}
                </div>
                <div>{formattedDay.getDate()}</div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="bg-darker-light p-4 rounded-lg mb-6">
          <h2 className="text-2xl text-white mb-4">
            Schedule to {formatCalendarDate(selectedDate).toLocaleDateString()}
          </h2>
          <TimeReminder selectedDate={formatCalendarDate(selectedDate)} />
          <div
            className={`flex items-center overflow-x-auto bg-darker-light  mt-3 
            ${currentActivitiesDay.length == 0 && "hidden"}`}
          >
            <table className="w-full overflow-x-auto rounded-sm">
              <thead>
                <tr className="text-minimal text-lg bg-darker-light">
                  <th className="min-w-[200px] md:min-w-[400px]">Activity Desc</th>
                  <th className="py-2">Priority</th>
                  <th className="py-2">Hour to Do</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-minimal rounded-md">
                {selectedDate &&
                  currentActivitiesDay
                    .filter((act) => {
                      let actDate = new Date(act.DateAgenda); // Convertimos el string a un objeto Date
                      // Asegúrate de usar la zona horaria UTC para la fecha de la base de datos
                      let actDateUTC = new Date(
                        Date.UTC(
                          actDate.getUTCFullYear(),
                          actDate.getUTCMonth(),
                          actDate.getUTCDate()
                        )
                      );
                      actDateUTC = actDateUTC.toISOString();
                      //  console.log(actDateUTC)
                      //  console.log(actDateUTC.slice(0,4))//ANIO
                      //  console.log(actDateUTC.slice(5,7))//MES correcto
                      //  console.log(actDateUTC.slice(8,10))//DIA
                      //YA ES OK LA FECHA DE LA ACTIVIDAD

                      //HACER OK La fecha de selected date
                      let newSelectedDate = new Date(
                        Date.UTC(
                          selectedDate.getUTCFullYear(),
                          selectedDate.getUTCMonth(),
                          selectedDate.getUTCDate()
                        )
                      );
                      //  console.log( newSelectedDate)
                      //  console.log( newSelectedDate.getFullYear()) //ANIO
                      //  console.log('MONTH SELECT', newSelectedDate.getUTCMonth()+1) //Te da el mes 0 es enero
                      //  console.log( newSelectedDate.getDate())

                      // Verifica que sea una fecha válida
                      // if (isNaN(actDateUTC)) return false;

                      // Obtiene solo la parte de año, mes y día de la fecha seleccionada

                      // Extraemos las partes de año, mes y día de ambas fechas
                      // let actDateFormatted = actDateUTC.slice(0, 10); // Formato YYYY-MM-DD
                      let [year, month, day] = newSelectedDate
                        .toISOString()
                        .slice(0, 10)
                        .split("-");
                      let selectedDateFormatted = `${year}-${month}-${day - 1}`; // Formato YYYY-MM-DD
                      let textSelectedDate = `${actDateUTC.slice(
                        0,
                        4
                      )}-${actDateUTC.slice(5, 7)}-${actDateUTC.slice(8, 10)}`;
                      // console.log('Act Date Formatted:', textSelectedDate);
                      // console.log('Selected Date Formatted:', selectedDateFormatted);

                      // // Comparar solo la parte de la fecha (YYYY-MM-DD)
                      // if (textSelectedDate === selectedDateFormatted) {
                      //     console.log("Las fechas coinciden.");
                      // } else {
                      //     console.log("Las fechas no coinciden.");
                      // }

                      return textSelectedDate == selectedDateFormatted;
                    })
                    .map((obj, idx) => (
                      <tr key={idx} className="border-4  border-opac p-4">
                        {obj.ActivityAudioURL ? (
                          <td className="border-opac p-4 text-center mx-0 my-auto">
                            <audio controls>
                              <source
                                src={obj.ActivityAudioURL}
                                type="audio/mpeg"
                              />
                              Your browser doesnt support audio controls
                            </audio>
                          </td>
                        ) : (
                          <td
                            className={`border-opac p-4 text-center font-sans text-dark ${
                              obj.IsCompleted ? "line-through" : ""
                            }`}
                          >
                            {obj.ActivityDesc}
                          </td>
                        )}
                        <td className="border-opac p-4 text-center border">
                          <span
                            className={`border-opac p-4 text-center rounded-md text-white font-bold ${
                              obj.Priority === 1
                                ? "bg-red-500 text-white"
                                : obj.Priority === 2
                                ? "bg-yellow-500 text-black"
                                : obj.Priority === 3
                                ? "bg-green-500 text-white"
                                : "bg-gray-300 text-gray-700"
                            }`}
                          >
                            {getPriorityLabel(obj.Priority)}
                          </span>
                        </td>
                        <td className="border-opac p-4 text-center border">
                          <span className="font-sans font-semibold text-darker-light">
                            {obj.HourToDo}
                          </span>
                        </td>
                        <td className="border-opac p-4 text-center mx-auto my-0 border">
                          {obj.IsCompleted === 0 ? (
                            <button
                              onClick={(e) => handleCompleteActivity(e, obj)}
                              className="flex justify-center items-center space-x-2 hover:bg-green-500 max-w-48 transition-all delay-150 ease-linear bg-gray-600 text-white rounded-md p-3 font-semibold text-center"
                            >
                              <span>Mark As Completed</span>{" "}
                              <span className="text-white text-center">
                                {CheckIcon()}
                              </span>
                            </button>
                          ) : (
                            <span className="p-4 bg-green-500 text-white rounded-lg font-semibold">
                              DONE
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center overflow-x-auto">
            {activity == "" && (
              <button
                onClick={handleRecording}
                className={`bg-minimal text-center rounded-full p-2 m-2 ${
                  recording && "jumper "
                }`}
              >
                {Microphone()}
              </button>
            )}
            {recording && (
              <button
                className={`bg-red-500 mx-3 font-semibold p-2 text-white rounded-md`}
                onClick={handleStopRecording}
              >
                {Stop()}
              </button>
            )}

            {audioURL || recording ? (
              <div>
                <audio controls src={audioURL} />
              </div>
            ) : (
              <input
                type="text"
                className="border border-gray-300 p-2 w-full rounded-md min-w-[400px]"
                placeholder="New Task..."
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
              />
            )}
            <div className="flex items-center justify-center m-10 space-x-3 text-white">
              <label htmlFor="priority">Priority</label>
              <select
                className={`rounded-lg p-2 my-auto text-black`}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option className="bg-minimal" value={0}>
                  ---SELECT AN OPTION----
                </option>
                <option className="bg-red-500 text-white" value={1}>
                  High
                </option>
                <option className="bg-yellow-500" value={2}>
                  Medium
                </option>
                <option className="bg-green-500 text-white" value={3}>
                  Low
                </option>
              </select>
            </div>

            <input
              type="time"
              className="border border-gray-300 p-2 rounded-md"
              value={activityTime}
              onChange={(e) => setActivityTime(e.target.value)}
            />
            <button
              onClick={(e) =>
                handleSubmmitActivity(
                  e,
                  formatCalendarDate(selectedDate).toLocaleDateString()
                )
              }
              className="bg-dark text-white px-4 py-2 rounded-md ml-2 hover:bg-green-500/90 transition-colors"
            >
              Add
            </button>
            {activity || audioURL ? (
              <button
                className="bg-red-500 rounded-md text-white p-2 mx-2 hover:bg-red-500/60"
                onClick={handleRestoreAct}
              >
                Cancel
              </button>
            ) : (
              <></>
            )}
          </div>
          <button className="bg-red-500 m-5 text-white rounded-2xl w-1/2 mx-auto p-2" onClick={()=>finishDay(currentActivitiesDay[0].AgendaId)}>
            Finish day
          </button>
        </div>
      )}
      <p className="font-medium text-gray-600 font-sans">
        Note: If you dont close the day will be closed automatically at 12:00am and
        the completition of your activities will be calculated with the data
        available at the moment ;)
      </p>
    </div>
  );
}

function getPriorityLabel(priority) {
  switch (priority) {
    case 1:
      return "Urgent";
    case 2:
      return "Medium";
    case 3:
      return "Low";
    default:
      return "Finished";
  }
}

export default function ViewSchedule() {
  return <ContentLA child={<Schedule />} />;
}
