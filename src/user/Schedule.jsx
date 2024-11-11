import { useEffect, useState } from "react";
import ContentLA from "../layouts/ContentLA";
import { Microphone, Stop } from "../utils/SVGExporter";
import { useAuth } from "../context/AuthContext";
import { uploadAudio } from "../firebase/Initialization";
import { toast } from "react-toastify";
import { ActivitiesEndpoint } from "../utils/EndpointExporter";
import TimeReminder from "../components/TimeReminder";

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
      setAudioURL(URL.createObjectURL(blob)); // Crear URL temporal para reproducir el audio
    };

    recorder.start();
  };
  //Restore States
  const handleRestoreAct = () => {
    setActivity("");
    setAudioURL(null);
    setAudioBlob(null);
    setActivityTime("12:00");
    setAudioURL(null);
    setPriority(0);
  };

  //Stop recording
  const handleStopRecording = () => {
    if (recording) {
      recording.stop();
      setRecording(false);
    }
  };

  //Submit the record
  const handleSubmmitActivity = async (e, date) => {
    e.preventDefault();
    try {
      let URLA;
      if (audioBlob) {
        //Insert Record and get AUDIO URL
        let NameActAudio = `${Date.now()}${user.name}${activityTime}`;
        //Try upload audio
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
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Agregar el timezone
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

  const getCalendarDays = () => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      return day;
    });
  };
  useEffect(() => {
    //CURRENT STATE OF ACTIVITIES
    const fetchActivities = async () => {
      try {
        const res = await fetch(
          `${ActivitiesEndpoint}/getActivitiesBySchedule`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );
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
          {getCalendarDays().map((day, idx) => (
            <button
              key={idx}
              className={`p-4 text-center rounded-lg ${
                selectedDate === day
                  ? "bg-plus-min text-white"
                  : "bg-opac text-white"
              } transition-all hover:bg-plus-min`}
              onClick={() => {
                setSelectedDate(day);
              }}
            >
              <div className="font-bold">
                {daysOfWeek[(todayIndex + idx) % 7]}{" "}
                {/* Muestra el nombre correcto del día */}
              </div>
              <div>{day.getDate()}</div>
            </button>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div className="bg-darker-light p-4 rounded-lg mb-6">
          <h2 className="text-2xl text-white mb-4">
            Schedule to {new Date(selectedDate).toLocaleDateString()}
          </h2>
          <TimeReminder selectedDate={selectedDate}/>
          {selectedDate &&
  currentActivitiesDay
    .filter((act) => {
      //tratar el string de la fecha para formatear YYYY-DD-MM  ----> YYYY-MM-DD
      let [year,day,monthExt] = act.DateAgenda.split('-')
      // console.log({year,day,monthExt})
      //MonthExt need extract the number so slice 
      let newMonthExt = monthExt.slice(0,2)
      //  console.log(newMonthExt)
      // console.log(monthExt.slice(2))//LOS XTRAVALUE T06......

      // console.log(`${year}-${newMonthExt}-${day}${monthExt.slice(2)}`) ///FINAL RESULT
      // Crea una nueva fecha a partir de la cadena ISO completa
      const activityDate = new Date(`${year}-${newMonthExt}-${day}${monthExt.slice(2)}`);
      // console.log(activityDate)

      // Verifica que sea una fecha válida
      if (isNaN(activityDate)) return false;

      // Obtiene solo la parte de año, mes y día de la fecha seleccionada
      const selectedOnlyDate = new Date(
        selectedDate.getUTCFullYear(),
        selectedDate.getUTCMonth(),
        selectedDate.getUTCDate()
      );
      return (
        activityDate.getUTCFullYear() === selectedOnlyDate.getUTCFullYear() &&
        activityDate.getUTCMonth() === selectedOnlyDate.getUTCMonth() &&
        activityDate.getUTCDate() === selectedOnlyDate.getUTCDate()
      );
    })
    .map((obj, idx) => (
      <div className="flex items-center overflow-x-auto" key={idx}>
        <p>{obj.ActivityDesc}</p>
        <p>{obj.HourToDo}</p>
      </div>
    ))}
          <div className="flex items-center overflow-x-auto">
            {activity == "" && ( //Allow record audio
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
              value={activityTime} // Estado para manejar la hora
              onChange={(e) => setActivityTime(e.target.value)} // Manejar el cambio
            />
            <button
              onClick={(e) =>
                handleSubmmitActivity(
                  e,
                  new Date(selectedDate).toLocaleDateString()
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
          <button className="bg-red-500 m-5 text-white rounded-2xl w-1/2 mx-auto p-2">
            Finish day
          </button>
        </div>
      )}
      <p className="font-medium text-gray-600 font-sans">
        Note: If you dont close the day will be closed automatically at 12:00am
        and the completition of your activities will be calculated with the data
        available at the moment ;)
      </p>
    </div>
  );
}

export default function ViewSchedule() {
  return <ContentLA child={<Schedule />} />;
}
