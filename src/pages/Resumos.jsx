// src/pages/Resumos.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/config';
import { useAuth } from '../context/AuthContext';
import '../css/Flashcards.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faPlus, faArrowLeft, faTag } from '@fortawesome/free-solid-svg-icons';

function Resumos() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [materias, setMaterias] = useState([]);
  const [resumosData, setResumosData] = useState([]);
  const [selectedMateria, setSelectedMateria] = useState(null);

  // Buscar matérias e resumos
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;

        // 📌 Buscar todas as matérias
        const materiasResponse = await fetch(`${API_BASE_URL}/api/materias`, {
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const materiasResult = await materiasResponse.json();
        if (materiasResponse.ok && materiasResult.ok) {
          setMaterias(materiasResult.data);
        }

        // 📌 Buscar resumos do usuário
        const resumosResponse = await fetch(`${API_BASE_URL}/api/resumos/usuario/${user.id}`, {
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const resumosResult = await resumosResponse.json();
        if (resumosResponse.ok && resumosResult.ok) {
          setResumosData(resumosResult.data);
        }
      } catch (error) {
        console.error('❌ Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, [user]);

  // Agrupar resumos por matéria, mas garantindo que todas as matérias apareçam
  const resumosPorMateria = materias.map((materia) => {
    const resumos = resumosData.filter((r) => r.materia_id === materia.id);
    return {
      materia_id: materia.id,
      materia_nome: materia.nome,
      resumos,
    };
  });

  return (
    <div className="flashcards-page">
      <div className="flashcards-container">
        <div className="flashcards-header">
          {selectedMateria ? (
            <button onClick={() => setSelectedMateria(null)} className="btn-voltar">
              <FontAwesomeIcon icon={faArrowLeft} /> Voltar
            </button>
          ) : (
            <div style={{ width: '80px' }}></div>
          )}

          <h1 className="flashcard-title">
            {selectedMateria ? selectedMateria.materia_nome : 'Minhas Pastas de Resumos'}
          </h1>

          <button onClick={() => navigate('/criar-resumo')} className="btn-adicionar">
            <FontAwesomeIcon icon={faPlus} /> Novo Resumo
          </button>
        </div>

        {selectedMateria ? (
          <div className="pastas-lista">
            {selectedMateria.resumos.length > 0 ? (
              selectedMateria.resumos.map((resumo) => (
                <div
                  key={resumo.id}
                  className="pasta-item resumo-item"
                  onClick={() => navigate(`/resumos/${resumo.id}`)}
                >
                  <div className="resumo-info">
                    <h3>{resumo.titulo}</h3>
                    <p className="resumo-data">
                      {new Date(resumo.criado_em).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="resumo-tag">
                    <FontAwesomeIcon icon={faTag} /> {selectedMateria.materia_nome}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', marginTop: '20px', color: '#5b4031' }}>
                Não há resumos para esta matéria ainda.
              </p>
            )}
          </div>
        ) : (
          <div className="pastas-lista">
            {resumosPorMateria.map((m) => (
              <div
                key={m.materia_id}
                className="pasta-item"
                onClick={() => setSelectedMateria(m)}
              >
                <FontAwesomeIcon icon={faFolder} className="pasta-icone" />
                <div className="pasta-info">
                  <h3>{m.materia_nome}</h3>
                  <p>{m.resumos.length} resumos</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Resumos;
