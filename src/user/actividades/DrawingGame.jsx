import React, { useState, useRef } from 'react';

const DrawingGame = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); // Tiempo para dibujar
  const [shapes, setShapes] = useState([
    'Círculo', 'Cuadrado', 'Triángulo', 'Rectángulo', 'Línea', 'Pentágono'
  ]); // Figuras geométricas
  const [currentShape, setCurrentShape] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  // Iniciar el juego
  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setCurrentShape(shapes[Math.floor(Math.random() * shapes.length)]);
    setGameOver(false);
    setGameStarted(true);
    clearInterval(intervalId);
    setIntervalId(setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000));
  };

  // Terminar el juego
  const endGame = () => {
    setGameStarted(false);
    setGameOver(true);
    clearInterval(intervalId);
  };

  // Manejar el inicio del dibujo
  const startDrawing = (e) => {
    if (!gameStarted) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  // Manejar el dibujo
  const draw = (e) => {
    if (!isDrawing || !gameStarted) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  // Terminar el dibujo
  const stopDrawing = () => {
    if (!isDrawing || !gameStarted) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.stroke();
    ctx.closePath();
    checkDrawing(); // Comprobar si el dibujo es correcto
  };

  // Comprobar si el dibujo es correcto (simulación)
  const checkDrawing = () => {
    let correctDrawing = false;

    // Lógica básica para cada figura geométrica (esto se puede mejorar)
    switch (currentShape) {
      case 'Círculo':
        correctDrawing = Math.random() < 0.8; // Simulación
        break;
      case 'Cuadrado':
        correctDrawing = Math.random() < 0.7;
        break;
      case 'Triángulo':
        correctDrawing = Math.random() < 0.6;
        break;
      case 'Rectángulo':
        correctDrawing = Math.random() < 0.7;
        break;
      case 'Línea':
        correctDrawing = Math.random() < 0.9;
        break;
      case 'Pentágono':
        correctDrawing = Math.random() < 0.5;
        break;
      default:
        correctDrawing = false;
    }

    if (correctDrawing) {
      setScore((prev) => prev + 1);
      setCurrentShape(shapes[Math.floor(Math.random() * shapes.length)]);
      setTimeLeft(10);
    } else {
      alert(`¡Incorrecto! Debías dibujar un ${currentShape}.`);
      endGame();
    }
  };

  // Reiniciar el juego
  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    clearInterval(intervalId);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
      <h1 className="text-3xl font-bold mb-4">Dibujo de Figuras Geométricas</h1>
      <p className="text-lg mb-4">Puntuación: {score}</p>
      {gameOver ? (
        <div>
          <h2 className="text-xl mb-4">¡Fin del Juego!</h2>
          <button onClick={resetGame} className="bg-green-500 px-4 py-2 rounded hover:bg-green-400">
            Reiniciar
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-2">Dibuja: {currentShape}</p>
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            className="border border-black"
          />
          <button onClick={startGame} className="bg-blue-500 px-4 py-2 mt-4 rounded hover:bg-blue-400">
            Empezar
          </button>
        </div>
      )}
      <p className="mt-4">Tiempo restante: {timeLeft}s</p>
    </div>
  );
};

export default DrawingGame;
