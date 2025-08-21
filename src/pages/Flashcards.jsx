// src/pages/Flashcards.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/config";
import "../css/Flashcards.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faBook,
  faBrain,
  faGlobe,
  faLandmark,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import BotaoVoltar from "../components/BotaoVoltar";
import BotaoNovo from "../components/BotaoNovo";

// 🔹 Ícones por matéria
const icones = {
  Filosofia: faBook,
  Geografia: faGlobe,
  História: faLandmark,
  Sociologia: faUsers,
  Geral: faBrain,
};

function Flashcards() {
  const navigate = useNavigate();

  const [materias, setMaterias] = useState([]);
  const [flashcardsData, setFlashcardsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // matérias
        const materiasResponse = await fetch(`${API_BASE_URL}/api/materias`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        const materiasResult = await materiasResponse.json();
        if (materiasResponse.ok && materiasResult.ok) {
          setMaterias(materiasResult.data);
        }

        // flashcards
        const flashcardsResponse = await fetch(`${API_BASE_URL}/api/flashcards`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        const flashcardsResult = await flashcardsResponse.json();
        if (flashcardsResponse.ok && flashcardsResult.ok) {
          setFlashcardsData(flashcardsResult.data);
        }
      } catch (error) {
        console.error("❌ Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  // contar flashcards por matéria
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
          {/* 🔹 Botão voltar alinhado à esquerda */}
          <BotaoVoltar />

          {/* 🔹 Título sempre centralizado */}
          <h1 className="flashcard-title">Minhas Pastas de Flashcards</h1>

          {/* 🔹 Botão novo alinhado à direita */}
          <BotaoNovo rota="/criar-flashcard" texto="Novo Flashcard" />
        </div>

        <div className="pastas-lista">
          {flashcardsPorMateria.map((m) => (
            <div
              key={m.materia_id}
              className="pasta-item"
              onClick={() => navigate(`/flashcards/materia/${m.materia_id}`)}
            >
              <div className="pasta-icone">
                <FontAwesomeIcon icon={icones[m.materia_nome] || faFolder} />
              </div>
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
