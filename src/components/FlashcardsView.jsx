// src/components/FlashcardView.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faBrain,
  faGlobe,
  faLandmark,
  faUsers,
  faCheckCircle,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL } from "../config/config";
import { useAuth } from "../context/AuthContext";
import "../css/FlashcardRandon.css";

const icones = {
  Filosofia: faBook,
  Geografia: faGlobe,
  História: faLandmark,
  Sociologia: faUsers,
  Geral: faBrain,
};

const FlashcardView = () => {
  const { user } = useAuth(); 
  const { materiaId, id } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [indexAtual, setIndexAtual] = useState(0);
  const [mostrarResposta, setMostrarResposta] = useState(false);

  useEffect(() => {
    if (!user) {
      console.warn("⚠️ Usuário não autenticado.");
      return;
    }

    const fetchFlashcards = async () => {
      try {
        let url;
        if (materiaId) {
          url = `${API_BASE_URL}/api/flashcards/materia/${materiaId}`;
        } else if (id) {
          url = `${API_BASE_URL}/api/flashcards/${id}`;
        } else {
          url = `${API_BASE_URL}/api/flashcards`;
        }

        console.log("🌐 Buscando flashcards em:", url);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.warn("⚠️ Nenhum token encontrado no localStorage.");
          return;
        }

        const res = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Erro HTTP: ${res.status}`);
        }

        const data = await res.json();
        console.log("📥 Resposta bruta da API:", data);

        // 🔑 Trata os dois formatos possíveis: array puro ou objeto com .data
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : data
          ? [data]
          : [];

        console.log("✅ Lista final de flashcards:", lista);

        setFlashcards(lista);
        setIndexAtual(0);
        setMostrarResposta(false);
      } catch (err) {
        console.error("❌ Erro ao carregar flashcards:", err);
      }
    };

    fetchFlashcards();
  }, [user, materiaId, id]);

  const toggleResposta = async () => {
    const atual = flashcards[indexAtual];
    const vaiMostrar = !mostrarResposta;
    setMostrarResposta(vaiMostrar);

    if (vaiMostrar && atual && !atual.revisado) {
      try {
        console.log("📌 Registrando revisão de flashcard:", atual.id);
        const token = localStorage.getItem("accessToken");

        await fetch(`${API_BASE_URL}/api/flashcards/${atual.id}/resultado`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ revisado: true }),
        });

        // Atualiza localmente para já refletir na UI
        setFlashcards((prev) =>
          prev.map((f, i) =>
            i === indexAtual ? { ...f, revisado: true } : f
          )
        );
      } catch (err) {
        console.error("❌ Erro ao registrar revisão:", err);
      }
    }
  };

  const proximo = () => {
    if (flashcards.length === 0) return;
    setIndexAtual((prev) => (prev + 1) % flashcards.length);
    setMostrarResposta(false);
  };

  if (flashcards.length === 0) {
    return (
      <div className="flashcard-functional">
        <div className="flashcard-top">
          <span className="flashcard-materia">Flashcards</span>
          <Link to="/flashcards" className="flashcard-ver-todos">
            Voltar às pastas
          </Link>
        </div>
        <div className="flashcard-content">
          <div className="flashcard-question">Nenhum flashcard encontrado.</div>
        </div>
      </div>
    );
  }

  const flashcard = flashcards[indexAtual];

  return (
    <div className="flashcard-functional">
      <div className="flashcard-top">
        <span className="flashcard-materia">
          <FontAwesomeIcon
            icon={icones[flashcard.materia] || faBrain}
            className="materia-icon"
          />
          {flashcard.materia || "Flashcards"}
        </span>
        <Link to="/flashcards" className="flashcard-ver-todos">
          Ver pastas
        </Link>
      </div>

      <div className="flashcard-content">
        <div className="flashcard-question">{flashcard.pergunta}</div>
        {mostrarResposta && (
          <div className="flashcard-answer">{flashcard.resposta}</div>
        )}
      </div>

      <div className="flashcard-status">
        {flashcard.revisado ? (
          <span className="status revisado">
            <FontAwesomeIcon icon={faCheckCircle} color="green" /> Revisado
          </span>
        ) : (
          <span className="status revisar">
            <FontAwesomeIcon icon={faClock} color="orange" /> A revisar
          </span>
        )}
      </div>

      <div className="flashcard-actions">
        <button className="flashcard-toggle-btn" onClick={toggleResposta}>
          {mostrarResposta ? "Esconder resposta" : "Exibir resposta"}
        </button>
        <button className="flashcard-next-btn" onClick={proximo}>
          Próximo →
        </button>
      </div>
    </div>
  );
};

export default FlashcardView;
