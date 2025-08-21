// src/components/FlashcardRandon.jsx
import React, { useState, useEffect } from "react";
import "../css/FlashcardRandon.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { API_BASE_URL } from "../config/config";
import { useAuth } from "../context/AuthContext";
import { iconesMaterias } from "./iconesMaterias";

const FlashcardRandon = () => {
  const { user } = useAuth();
  const [flashcard, setFlashcard] = useState(null);
  const [materiaNome, setMateriaNome] = useState(null);
  const [mostrarResposta, setMostrarResposta] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchAleatorio = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        // 🔹 buscar flashcards
        const res = await fetch(`${API_BASE_URL}/api/flashcards`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
        const data = await res.json();

        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];

        if (lista.length === 0) {
          setFlashcard(null);
          return;
        }

        const aleatorio = Math.floor(Math.random() * lista.length);
        const escolhido = lista[aleatorio];

        setFlashcard(escolhido);

        // 🔹 buscar nome da matéria a partir do materia_id
        if (escolhido.materia_id) {
          const materiaRes = await fetch(`${API_BASE_URL}/api/materias/${escolhido.materia_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (materiaRes.ok) {
            const materiaData = await materiaRes.json();
            setMateriaNome(materiaData?.data?.nome || "Geral");
          } else {
            setMateriaNome("Geral");
          }
        } else {
          setMateriaNome("Geral");
        }

        setMostrarResposta(false);
      } catch (err) {
        console.error("❌ Erro ao buscar flashcard aleatório:", err);
      }
    };

    fetchAleatorio();
  }, [user]);

  const toggleResposta = () => setMostrarResposta((prev) => !prev);

  if (!flashcard) {
    return (
      <div className="flashcard-functional">
        <div className="flashcard-top">
          <span className="flashcard-materia">
            <FontAwesomeIcon icon={iconesMaterias.Geral} />
            <span className="materia-nome">Flashcards</span>
          </span>
          <a href="/flashcards" className="flashcard-ver-todos">
            Ver todos
          </a>
        </div>
        <div className="flashcard-content">
          <div className="flashcard-question">
            Nenhum flashcard encontrado para você.
          </div>
        </div>
      </div>
    );
  }

  const iconeMateria = iconesMaterias[materiaNome] || iconesMaterias.Geral;

  return (
    <div className="flashcard-functional">
      <div className="flashcard-top">
        <span className="flashcard-materia">
          <FontAwesomeIcon icon={iconeMateria} className="materia-icon" />
          <span className="materia-nome">{materiaNome}</span>
        </span>
        <a href="/flashcards" className="flashcard-ver-todos">
          Ver todos
        </a>
      </div>

      <div className="flashcard-content">
        <div className="flashcard-question">{flashcard.pergunta}</div>
        {mostrarResposta && (
          <div className="flashcard-answer">{flashcard.resposta}</div>
        )}
      </div>

      <button className="flashcard-toggle-btn" onClick={toggleResposta}>
        {mostrarResposta ? "Esconder resposta" : "Mostrar resposta"}
      </button>
    </div>
  );
};

export default FlashcardRandon;
