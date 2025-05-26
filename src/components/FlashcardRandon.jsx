import React, { useState, useEffect } from 'react';
import '../css/FlashcardRandon.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBrain, faGlobe, faLandmark, faUsers } from '@fortawesome/free-solid-svg-icons';

const FlashcardRandon = () => {
  const bancoFake = [
    {
      materia: "Filosofia",
      icone: faBook,
      pergunta: "O que é o mito da caverna de Platão?",
      resposta: "Uma alegoria sobre a ignorância e a busca pelo conhecimento verdadeiro."
    },
    {
      materia: "Geografia",
      icone: faGlobe,
      pergunta: "O que é clima equatorial?",
      resposta: "Clima quente e úmido, com chuvas bem distribuídas ao longo do ano."
    },
    {
      materia: "História",
      icone: faLandmark,
      pergunta: "Quem foi D. Pedro I?",
      resposta: "Foi o primeiro imperador do Brasil e proclamou a independência em 1822."
    },
    {
      materia: "Sociologia",
      
      icone: faUsers,
      pergunta: "O que é fato social segundo Durkheim?",
      resposta: "É toda maneira de agir, pensar e sentir que exerce coerção sobre o indivíduo."
    }
  ];

  const [flashcard, setFlashcard] = useState(null);
  const [mostrarResposta, setMostrarResposta] = useState(false);

  useEffect(() => {
    const aleatorio = Math.floor(Math.random() * bancoFake.length);
    setFlashcard(bancoFake[aleatorio]);
  }, []);

  const toggleResposta = () => {
    setMostrarResposta(prev => !prev);
  };

  if (!flashcard) return null;

  return (
    <div className="flashcard-functional">
      <div className="flashcard-top">
        <span className="flashcard-materia">
          <FontAwesomeIcon icon={flashcard.icone} className="materia-icon" />
          <span className="materia-emoji">{flashcard.emoji}</span> {flashcard.materia}
        </span>
        <a href="#" className="flashcard-ver-todos">Ver todos</a>
      </div>

      <div className="flashcard-content">
        <div className="flashcard-question">{flashcard.pergunta}</div>
        {mostrarResposta && (
          <div className="flashcard-answer">{flashcard.resposta}</div>
        )}
      </div>

      <button 
        className="flashcard-toggle-btn" 
        onClick={toggleResposta}
      >
        {mostrarResposta ? 'Esconder resposta' : 'Mostrar resposta'}
      </button>
    </div>
  );
};

export default FlashcardRandon;
