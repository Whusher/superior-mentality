import React, { useState, useEffect } from 'react';
import { UpdateScoreEndpoint } from '../../utils/EndpointExporter';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [timer, setTimer] = useState(60);
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
          id_activity: 1,
          username: name, 
        }),
      });
      
      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };
  

  const initialCards = [
    { id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 3, name: 'C' },
    { id: 4, name: 'A' }, { id: 5, name: 'B' }, { id: 6, name: 'C' },
    { id: 7, name: 'D' }, { id: 8, name: 'D' }, { id: 9, name: 'E' },
    { id: 10, name: 'E' }, { id: 11, name: 'F' }, { id: 12, name: 'F' },
    { id: 13, name: 'G' }, { id: 14, name: 'G' }, { id: 15, name: 'H' },
    { id: 16, name: 'H' }, { id: 17, name: 'I' }, { id: 18, name: 'I' },
    { id: 19, name: 'J' }, { id: 20, name: 'J' }, { id: 21, name: 'K' },
    { id: 22, name: 'K' }, { id: 23, name: 'L' }, { id: 24, name: 'L' },
  ];

  useEffect(() => {
    if (isGameStarted && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setShowCards(false);
      setFlippedCards([]);
    }
  }, [isGameStarted, timer]);

  const shuffleCards = (cards) => {
    return cards.sort(() => Math.random() - 0.5);
  };

  const handleCardClick = (index) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(index)) return;

    setFlippedCards((prev) => [...prev, index]);

    if (flippedCards.length === 1) {
      const firstCard = cards[flippedCards[0]];
      const secondCard = cards[index];
      if (firstCard.name === secondCard.name) {
        setMatchedCards((prev) => [...prev, firstCard.name]);
        setScore((prevScore) => prevScore + 10);
      }
      setTimeout(() => setFlippedCards([]), 1000);
    }
  };

  const startGame = () => {
    setCards(shuffleCards([...initialCards]));
    setIsGameStarted(true);
    setMatchedCards([]);
    setFlippedCards([]);
    setTimer(60);
    setShowCards(true);
    setTimeout(() => setShowCards(false), 60000);
  };

  const resetGame = () => {
    setIsGameStarted(false);
    setCards([]);
    setFlippedCards([]);
    setMatchedCards([]);
    setTimer(60);
    setShowCards(false);
    saveScore(score);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-minimal">
      <h1 className="text-3xl font-bold mb-4 text-opac">Juego de Memoria</h1>
      <div className="mb-4 text-xl">Tiempo restante: {timer} segundos</div>
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`w-20 h-20 flex items-center justify-center border-2 ${
              flippedCards.includes(index) || matchedCards.includes(card.name) || showCards
                ? 'bg-plus-min'
                : 'bg-dark'
            }`}
            onClick={() => handleCardClick(index)}
          >
            {flippedCards.includes(index) || matchedCards.includes(card.name) || showCards
              ? card.name
              : '?' }
          </div>
        ))}
      </div>
      <div className="mt-4">
        {!isGameStarted && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={startGame}
          >
            Iniciar Juego
          </button>
        )}
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={resetGame}
        >
          Reiniciar
        </button>
      </div>
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
        onClick={() => navigate('/activities')}
      >
        Atrás
      </button>
    </div>
  );
};

export default MemoryGame;
