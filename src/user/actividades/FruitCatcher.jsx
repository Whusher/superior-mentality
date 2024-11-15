import React, { useState, useEffect, useRef } from 'react';
import { UpdateScoreEndpoint } from '../../utils/EndpointExporter';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";


const FruitCatcher = () => {
  const [basketPosition, setBasketPosition] = useState(50);
  const [fruits, setFruits] = useState([]);
  const [score, setScore] = useState(0);
  const [fallSpeed, setFallSpeed] = useState(2000);
  const [spawnInterval, setSpawnInterval] = useState(2000);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const basketRef = useRef();
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
          id_activity: 3,
          username: name, 
        }),
      });
      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted) return;
      if (e.key === 'ArrowLeft') setBasketPosition((prev) => Math.max(0, prev - 5));
      if (e.key === 'ArrowRight') setBasketPosition((prev) => Math.min(100, prev + 5));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const spawnFruit = () => {
      setFruits((prevFruits) => [
        ...prevFruits,
        { top: 0, left: Math.random() * 90, caught: false, id: Math.random() },
      ]);
    };

    const intervalId = setInterval(spawnFruit, spawnInterval);
    return () => clearInterval(intervalId);
  }, [gameStarted, spawnInterval, gameOver]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveFruits = () => {
      setFruits((prevFruits) =>
        prevFruits
          .map((fruit) => ({ ...fruit, top: fruit.top + 1 }))
          .filter((fruit) => fruit.top <= 100)
      );

      fruits.forEach((fruit) => {
        if (fruit.top >= 90 && !fruit.caught) {
          const basket = basketRef.current;
          const basketRect = basket.getBoundingClientRect();
          const fruitLeft = (fruit.left / 100) * window.innerWidth;
          const basketLeft = basketRect.left;
          const basketRight = basketRect.right;

          if (fruitLeft >= basketLeft && fruitLeft <= basketRight) {
            setScore((prev) => prev + 1);
            fruit.caught = true;
            if ((score + 1) % 10 === 0) {
              setLevel((prev) => prev + 1);
              setFallSpeed((prev) => Math.max(200, prev * 0.9));
              setSpawnInterval((prev) => Math.max(1000, prev * 0.95));
            }
          } else if (fruit.top >= 100) {
            resetGame();
          }
        }
      });
    };

    const intervalId = setInterval(moveFruits, 50);
    return () => clearInterval(intervalId);
  }, [fruits, basketPosition, fallSpeed, score, gameStarted, gameOver]);

  const startGame = () => {
    setScore(0);
    setFallSpeed(2000);
    setSpawnInterval(2000);
    setBasketPosition(50);
    setFruits([]);
    setLevel(1);
    setGameOver(false);
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameOver(true);
    setGameStarted(false);
    saveScore(score);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-minimal relative">
      <h1 className="text-3xl font-bold mb-4">Atrapador de Frutas</h1>
      <p className="text-lg mb-4">Puntuación: {score} | Nivel: {level}</p>

      {!gameStarted ? (
        <button
          onClick={startGame}
          className="bg-green-500 px-4 py-2 mb-4 rounded hover:bg-green-400"
        >
          Empezar
        </button>
      ) : (
        <button
          onClick={resetGame}
          className="bg-red-500 px-4 py-2 mb-4 rounded hover:bg-red-400"
        >
          Finalizar
        </button>
      )}

      {fruits.map((fruit) => (
        <div
          key={fruit.id}
          style={{
            position: 'absolute',
            top: `${fruit.top}%`,
            left: `${fruit.left}%`,
            transition: 'top 0.05s linear',
          }}
          className="w-10 h-10 bg-red-500 rounded-full"
        />
      ))}

      <div
        ref={basketRef}
        style={{
          position: 'absolute',
          bottom: '0',
          left: `${basketPosition}%`,
          transform: 'translateX(-50%)',
        }}
        className="w-20 h-10 bg-blue-600"
      />

      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-white">
          <div className="text-center">
            <h2 className="text-3xl mb-4">¡Fin del Juego!</h2>
            <p className="text-lg mb-4">Puntuación Final: {score}</p>
            <button
              onClick={startGame}
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-400"
            >
              Reiniciar Juego
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate('/activities')}
        className="absolute top-5 left-5 text-white bg-blue-500 p-2 rounded-full"
      >
        Atrás
      </button>
    </div>
  );
};

export default FruitCatcher;
