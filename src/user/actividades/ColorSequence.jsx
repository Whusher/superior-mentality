import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UpdateScoreEndpoint } from '../../utils/EndpointExporter';
import { useAuth } from "../../context/AuthContext";

const ColorSequence = () => {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [message, setMessage] = useState('');
  const [speed, setSpeed] = useState(3000);
  const [rounds, setRounds] = useState(0);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();
  const name = user?.name

  const saveScore = async (newScore) => {
    const token = localStorage.getItem('userToken');
    try {
      const response = await fetch(`${UpdateScoreEndpoint}?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: newScore,
          id_activity: 2, 
          username: name,
        }),
      });
      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const colors = ['red', 'blue', 'green', 'yellow'];

  const generateSequence = () => {
    const newSequence = Array.from({ length: 4 }, () => colors[Math.floor(Math.random() * colors.length)]);
    setSequence(newSequence);
    setUserSequence([]);
    setCurrentStep(0);
    setMessage('Memoriza la secuencia');
    setRounds((prevRounds) => prevRounds + 1);
    setIsShowingSequence(true);
    playSequence(newSequence);
  };

  const playSequence = async (sequenceToPlay) => {
    for (let index = 0; index < sequenceToPlay.length; index++) {
      setMessage(`Color: ${sequenceToPlay[index]} (${index + 1})`);
      await new Promise((resolve) => setTimeout(resolve, speed));
    }
    setMessage('Tu turno');
    setIsShowingSequence(false);
  };

  const handleColorClick = (color) => {
    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);

    if (newUserSequence[currentStep] === sequence[currentStep]) {
      if (newUserSequence.length === sequence.length) {
        setMessage('¡Correcto! Secuencia completa.');
        setScore((prevScore) => prevScore + 10);
        if (rounds % 5 === 0 && rounds !== 0) {
          setSpeed((prevSpeed) => Math.max(prevSpeed - 200, 1000));
        }
        setTimeout(generateSequence, 1000);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setMessage('Secuencia incorrecta. Intentando de nuevo.');
      setUserSequence([]);
      setCurrentStep(0);
      repeatSequence();
    }
  };

  const repeatSequence = () => {
    setIsShowingSequence(true);
    playSequence(sequence);
  };

  const restartGame = () => {
    saveScore(score);
    setRounds(0);
    setSpeed(3000);
    setUserSequence([]);
    generateSequence();
    setScore(0);
  };

  const goToActivities = () => {
    saveScore(score);
    navigate('/activities');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-minimal">
      <h1 className="text-3xl font-bold mb-4 text-opac">Repite la secuencia de colores</h1>
      <p className="text-xl mb-2">Ronda: {rounds}</p>
      <div className="flex space-x-4 mb-4">
        {colors.map((color) => (
          <button
            key={color}
            style={{ backgroundColor: color }}
            className="w-16 h-16 rounded-full relative flex items-center justify-center"
            onClick={() => handleColorClick(color)}
          >
            <span className="text-white font-bold text-xl">{colors.indexOf(color) + 1}</span>
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
      <button 
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-opacity-80"
        onClick={goToActivities}
      >
        Volver a Actividades
      </button>
    </div>
  );
};

export default ColorSequence;
