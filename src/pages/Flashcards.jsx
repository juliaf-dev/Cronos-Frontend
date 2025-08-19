// src/pages/Flashcards.jsx (arquivo completo já ajustado)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/config';
import '../css/Flashcards.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faPlus, faArrowLeft, faTag } from '@fortawesome/free-solid-svg-icons';

function Flashcards() {
  const navigate = useNavigate();

  const [materias, setMaterias] = useState([]);
  const [flashcardsData, setFlashcardsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // matérias
        const materiasResponse = await fetch(`${API_BASE_URL}/api/materias`, {
          credentials: 'include',
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        const materiasResult = await materiasResponse.json();
        if (materiasResponse.ok && materiasResult.ok) {
          setMaterias(materiasResult.data);
        }

        // flashcards do usuário (opcional; só para contar por pasta)
        const flashcardsResponse = await fetch(`${API_BASE_URL}/api/flashcards`, {
          credentials: 'include',
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        const flashcardsResult = await flashcardsResponse.json();
        if (flashcardsResponse.ok && flashcardsResult.ok) {
          setFlashcardsData(flashcardsResult.data);
        }
      } catch (error) {
        console.error('❌ Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  // conta por matéria
  const flashcardsPorMateria = materias.map((materia) => {
    const flashcards = flashcardsData.filter(
      (f) => f.materia_id === materia.id || f.materiaId === materia.id
    );
    return {
      materia_id: materia.id,
      materia_nome: materia.nome,
      qtde: flashcards.length,
    };
  });

  return (
    <div className="flashcards-page">
      <div className="flashcards-container">
        <div className="flashcards-header">
          <div style={{ width: '80px' }}></div>
          <h1 className="flashcard-title">Minhas Pastas de Flashcards</h1>
          <button onClick={() => navigate('/criar-flashcard')} className="btn-adicionar">
            <FontAwesomeIcon icon={faPlus} /> Novo Flashcard
          </button>
        </div>

        <div className="pastas-lista">
          {flashcardsPorMateria.map((m) => (
            <div
              key={m.materia_id}
              className="pasta-item"
              onClick={() => navigate(`/flashcards/materia/${m.materia_id}`)}
            >
              <FontAwesomeIcon icon={faFolder} className="pasta-icone" />
              <div className="pasta-info">
                <h3>{m.materia_nome}</h3>
                <p>{m.qtde} flashcards</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Flashcards;
