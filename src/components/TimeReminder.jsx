import { useEffect, useState } from "react";

export default function TimeReminder({selectedDate}) {
    const [timeRemaining, setTimeRemaining] = useState("");
    useEffect(() => {
        if (!selectedDate) return;
    
        const targetDate = new Date(selectedDate);
        targetDate.setHours(23, 59, 0, 0); // Establece la hora a las 11:59 PM
    
        const updateCountdown = () => {
          const now = new Date();
          const difference = targetDate - now;
    
          if (difference > 0) {
            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor(
              (difference % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
            setTimeRemaining(
              `${hours} hours, ${minutes} minutes, ${seconds} seconds`
            );
          } else {
            setTimeRemaining("¡El tiempo ha terminado!");
          }
        };
    
        updateCountdown(); // Llama una vez al iniciar
    
        const intervalId = setInterval(updateCountdown, 1000); // Actualiza cada segundo
    
        return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
      }, [selectedDate]);
  return (
    <>
        {new Date(selectedDate).toDateString() ===
            new Date().toDateString() && (
            <p className="text-white">
            All your activities will be closed in:{" "}
            <span className="text-minimal font-semibold text-xl">
                {timeRemaining}
            </span>{" "}
            </p>
        )
        }
    </>
  )
}
