import { useState } from "react";
import ContentLA from "../layouts/ContentLA";
import { Microphone, Stop } from "../utils/SVGExporter";

function Schedule() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [activity, setActivity] = useState('')
  const [audioURL, setAudioURL] = useState(null);
  const [activityTime, setActivityTime] = useState("12:00"); // Hora por defecto

  const daysOfWeek = ["Dom","Lun", "Mar", "Mié", "Jue", "Vie", "Sáb" ];

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
  //Stop recording
  const handleStopRecording = () => {
    if (recording) {
      recording.stop();
      setRecording(false);
    }
  };

  const getCalendarDays = () => {
    const startOfWeek = new Date();
    const weekDays = Array.from({ length: 7 }, (_, i) =>
      new Date(startOfWeek).setDate(startOfWeek.getDate() + i)
    );
    return weekDays;
  };

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
          <div className="flex items-center overflow-x-auto">
            <button
              onClick={handleRecording}
              className={`bg-minimal text-center rounded-full p-2 m-2 ${
                recording && "jumper"
              }`}
            >
              {Microphone()}
            </button>
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
                onChange={e => setActivity(e.target.value)}
              />
            )}
            <div className="flex items-center justify-center m-10 space-x-3 text-white">
              <label htmlFor="priority">Priority</label>
              <select className={`rounded-lg p-2 my-auto text-black`}>
                <option className="bg-red-500">High</option>
                <option className="bg-yellow-500">Medium</option>
                <option className="bg-green-500">Low</option>
              </select>
            </div>

            <input
              type="time"
              className="border border-gray-300 p-2 rounded-md"
              value={activityTime} // Estado para manejar la hora
              onChange={(e) => setActivityTime(e.target.value)} // Manejar el cambio
            />
            <button className="bg-dark text-white px-4 py-2 rounded-md ml-2 hover:bg-green-500/90 transition-colors">
              Add
            </button>
            {
              activity || audioURL ? (

            <button className="bg-red-500 rounded-md text-white p-2 mx-2"
              onClick={()=>{ //Restart all items
                setActivity('')
                setAudioURL(null)
                setActivityTime("12:00")
              }}
            >
              Cancel
            </button>
              ) : <></>
            }
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
