import React, { useState, useEffect } from 'react';

// Acciones ampliadas
const actions = [
  'salta', 'gira', 'baila', 'mueve tus manos',
  'da una vuelta', 'aplaude', 'toca tus pies', 'saluda',
  'haz una mueca', 'haz una pirueta', 'camina hacia atrás', 'levanta una pierna',
  'mueve tus caderas', 'da un paso adelante', 'salta en un pie', 'agáchate',
  'toca tu cabeza', 'da palmas', 'mueve la cabeza', 'imita un animal'
];

const SimonSays = () => {
  const [isGameActive, setIsGameActive] = useState(false); // Estado del juego
  const [currentAction, setCurrentAction] = useState(''); // Acción actual
  const [timer, setTimer] = useState(30); // Temporizador
  const [intervalId, setIntervalId] = useState(null); // ID del temporizador

  // Función para hacer que la voz diga una acción
  const speak = (action) => {
    const utterance = new SpeechSynthesisUtterance(`Simón dice: ${action}`);
    utterance.rate = 1; // Ajusta la velocidad de la voz
    window.speechSynthesis.speak(utterance);
  };

  // Función para generar una acción aleatoria
  const randomAction = () => {
    return actions[Math.floor(Math.random() * actions.length)];
  };

  // Iniciar el juego
  const startGame = () => {
    setIsGameActive(true); // Activar el juego
    setTimer(30); // Reiniciar el temporizador
    const newAction = randomAction(); // Seleccionar una acción aleatoria
    setCurrentAction(newAction); // Establecer la acción actual
    speak(newAction); // Decir la acción en voz alta

    // Configurar el temporizador que cambiará la acción cada 30 segundos
    const id = setInterval(() => {
      const nextAction = randomAction(); // Seleccionar la siguiente acción
      setCurrentAction(nextAction); // Actualizar la acción actual
      setTimer(30); // Reiniciar el temporizador a 30 segundos
      speak(nextAction); // Decir la acción en voz alta
    }, 30000); // Cada 30 segundos
    setIntervalId(id); // Guardar el ID del temporizador
  };

  // Detener el juego
  const stopGame = () => {
    setIsGameActive(false); // Desactivar el juego
    clearInterval(intervalId); // Limpiar el temporizador
    setCurrentAction(''); // Limpiar la acción actual
    setTimer(30); // Reiniciar el temporizador
  };

  // Temporizador de cuenta regresiva
  useEffect(() => {
    if (isGameActive && timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000); // Cuenta regresiva de un segundo
      return () => clearTimeout(countdown); // Limpiar el temporizador cuando el componente se desmonte o se detenga el juego
    }
  }, [isGameActive, timer]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <h1 className="text-3xl font-bold mb-4">Simón Dice</h1>
      <h3 className="text-xl mb-4">{isGameActive ? `Acción: ${currentAction}` : ''}</h3>
      <h3 className="text-lg mb-4">Tiempo para la siguiente acción: {timer}s</h3>

      {!isGameActive ? (
        <button
          onClick={startGame}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400 transition-colors"
        >
          Empezar
        </button>
      ) : (
        <button
          onClick={stopGame}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400 transition-colors"
        >
          Detener
        </button>
      )}
    </div>
  );
};

export default SimonSays;
