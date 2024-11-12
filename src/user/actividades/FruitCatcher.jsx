import React, { useState, useEffect, useRef } from 'react';

const FruitCatcher = () => {
  const [basketPosition, setBasketPosition] = useState(50); // Posición del canasto
  const [fruits, setFruits] = useState([]); // Lista de frutas en pantalla
  const [score, setScore] = useState(0);
  const [fallSpeed, setFallSpeed] = useState(2000); // Velocidad inicial de caída
  const [spawnInterval, setSpawnInterval] = useState(2000); // Intervalo entre frutas
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false); // Control del estado del juego
  const [level, setLevel] = useState(1); // Nivel del juego
  const basketRef = useRef(); // Referencia al canasto

  // Control del movimiento del canasto
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted) return;
      if (e.key === 'ArrowLeft') setBasketPosition((prev) => Math.max(0, prev - 5)); // Limitar al lado izquierdo
      if (e.key === 'ArrowRight') setBasketPosition((prev) => Math.min(100, prev + 5)); // Limitar al lado derecho
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted]);

  // Control de frutas
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const spawnFruit = () => {
      setFruits((prevFruits) => [
        ...prevFruits,
        { top: 0, left: Math.random() * 90, caught: false, id: Math.random() }, // Agregar propiedad 'caught'
      ]);
    };

    const intervalId = setInterval(spawnFruit, spawnInterval); // Controla cada cuánto aparece una fruta nueva
    return () => clearInterval(intervalId);
  }, [gameStarted, spawnInterval, gameOver]);

  // Control del movimiento de frutas
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveFruits = () => {
      setFruits((prevFruits) => 
        prevFruits
          .map((fruit) => ({ ...fruit, top: fruit.top + 1 })) // Movimiento de frutas
          .filter((fruit) => fruit.top <= 100) // Eliminar frutas que pasaron de la pantalla
      );

      fruits.forEach((fruit) => {
        if (fruit.top >= 90 && !fruit.caught) { // Chequear si no ha sido atrapada aún
          const basket = basketRef.current;
          const basketRect = basket.getBoundingClientRect();
          const fruitLeft = (fruit.left / 100) * window.innerWidth;
          const basketLeft = basketRect.left;
          const basketRight = basketRect.right;

          // Verificar si la fruta ha sido atrapada
          if (fruitLeft >= basketLeft && fruitLeft <= basketRight) {
            setScore((prev) => prev + 1); // Atrapaste la fruta y sumas solo 1 punto
            fruit.caught = true; // Marcar fruta como atrapada
            if ((score + 1) % 10 === 0) {
              setLevel((prev) => prev + 1); // Subir de nivel cada 10 frutas atrapadas
              setFallSpeed((prev) => Math.max(200, prev * 0.9)); // Aumentar velocidad de caída
              setSpawnInterval((prev) => Math.max(1000, prev * 0.95)); // Aumentar frecuencia
            }
          } else if (fruit.top >= 100) { // Si la fruta llega al final y no fue atrapada
            resetGame(); // Terminar el juego si se falla
          }
        }
      });
    };

    const intervalId = setInterval(moveFruits, 50); // Actualiza la posición de las frutas cada 50ms
    return () => clearInterval(intervalId);
  }, [fruits, basketPosition, fallSpeed, score, gameStarted, gameOver]);

  // Reiniciar juego
  const startGame = () => {
    setScore(0);
    setFallSpeed(2000); // Ajustar velocidad inicial
    setSpawnInterval(2000); // Ajustar frecuencia inicial
    setBasketPosition(50);
    setFruits([]); // Reiniciar frutas
    setLevel(1); // Reiniciar nivel
    setGameOver(false);
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameOver(true);
    setGameStarted(false);
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

      {/* Frutas */}
      {fruits.map((fruit) => (
        <div
          key={fruit.id}
          style={{ 
            position: 'absolute', 
            top: `${fruit.top}%`, 
            left: `${fruit.left}%`, 
            transition: 'top 0.05s linear' 
          }}
          className="w-10 h-10 bg-red-500 rounded-full"
        />
      ))}

      {/* Canasto */}
      <div
        ref={basketRef}
        style={{ 
          position: 'absolute', 
          bottom: '0', 
          left: `${basketPosition}%`, 
          transform: 'translateX(-50%)' 
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
    </div>
  );
};

export default FruitCatcher;
