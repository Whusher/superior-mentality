import React, { useState } from 'react';

const ColorSequence = () => {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [message, setMessage] = useState('');
  const [speed, setSpeed] = useState(3000); // Velocidad inicial
  const [rounds, setRounds] = useState(0); // Contador de rondas
  const [isShowingSequence, setIsShowingSequence] = useState(false); // Para controlar si se está mostrando la secuencia

  const colors = ['red', 'blue', 'green', 'yellow'];

  const generateSequence = () => {
    const newSequence = Array.from({ length: 4 }, () => colors[Math.floor(Math.random() * colors.length)]);
    setSequence(newSequence);
    setUserSequence([]);
    setCurrentStep(0);
    setMessage('Memoriza la secuencia');
    setRounds((prevRounds) => prevRounds + 1); // Aumentar el contador de rondas
    setIsShowingSequence(true); // Iniciar la visualización de la secuencia
    playSequence(newSequence); // Reproducir la secuencia después de generarla
  };

  const playSequence = async (sequenceToPlay) => {
    for (let index = 0; index < sequenceToPlay.length; index++) {
      setMessage(`Color: ${sequenceToPlay[index]} (${index + 1})`); // Muestra el color y el número
      await new Promise((resolve) => setTimeout(resolve, speed)); // Esperar antes de cambiar al siguiente color
    }
    setMessage('Tu turno'); // Mensaje para el usuario que es su turno
    setIsShowingSequence(false);
  };

  const handleColorClick = (color) => {
    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);

    if (newUserSequence[currentStep] === sequence[currentStep]) {
      if (newUserSequence.length === sequence.length) {
        setMessage('¡Correcto! Secuencia completa.');
        // Aumentar la velocidad cada 5 rondas
        if (rounds % 5 === 0 && rounds !== 0) {
          setSpeed((prevSpeed) => Math.max(prevSpeed - 200, 1000)); // Aumentar la velocidad (disminuir el intervalo)
        }
        // Generar una nueva secuencia después de un pequeño retraso
        setTimeout(generateSequence, 1000);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setMessage('Secuencia incorrecta. Intentando de nuevo.');
      setUserSequence([]);
      setCurrentStep(0);
      repeatSequence(); // Repetir la secuencia actual al cometer un error
    }
  };

  const repeatSequence = () => {
    setIsShowingSequence(true);
    playSequence(sequence); // Reproducir la secuencia actual
  };

  const restartGame = () => {
    setRounds(0);
    setSpeed(3000); // Resetear velocidad a la inicial
    setUserSequence([]); // Resetear la secuencia del usuario
    generateSequence(); // Generar la primera secuencia
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-minimal">
      <h1 className="text-3xl font-bold mb-4 text-opac">Repite la secuencia de colores</h1>
      <p className="text-xl mb-2">Ronda: {rounds}</p> {/* Mostrar ronda actual */}
      <div className="flex space-x-4 mb-4">
        {colors.map((color) => (
          <button
            key={color}
            style={{ backgroundColor: color }}
            className="w-16 h-16 rounded-full relative flex items-center justify-center"
            onClick={() => handleColorClick(color)}
          >
            <span className="text-white font-bold text-xl">{colors.indexOf(color) + 1}</span> {/* Número en el centro */}
          </button>
        ))}
      </div>
      {isShowingSequence ? (
        <p className="text-2xl text-darker-light">{message}</p>
      ) : (
        <p className="text-2xl text-darker-light">Memoriza la secuencia</p>
      )}
      <button 
        className="mt-4 bg-plus-min text-white px-4 py-2 rounded hover:bg-opacity-80"
        onClick={repeatSequence}
      >
        Repetir Secuencia
      </button>
      <button 
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-opacity-80"
        onClick={restartGame}
      >
        Reiniciar Juego
      </button>
      <button 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-opacity-80"
        onClick={generateSequence}
      >
        Iniciar Juego
      </button>
    </div>
  );
};

export default ColorSequence;
