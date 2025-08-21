// src/pages/Main.jsx
import React, { useEffect, useState } from "react";
import "../css/Main.css";
import FlashcardRandon from "../components/FlashcardRandon";
import ResumoAtalhos from "../components/ResumoAtalhos";
import ChatAssistente from "../components/ChatAssistente";
import { API_BASE_URL } from "../config/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { iconesMaterias } from "../components/iconesMaterias";

const Main = ({ navegarParaMateria }) => {
  const [materiasData, setMateriasData] = useState([]);

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE_URL}/api/materias`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        const data = await res.json();

        if (data.ok && Array.isArray(data.data)) {
          setMateriasData(data.data);
        } else {
          console.warn("Resposta inesperada:", data);
        }
      } catch (err) {
        console.error("Erro ao carregar matérias:", err);
      }
    };

    fetchMaterias();
  }, []);

  return (
    <div className="main-container">
      <div className="main-body">
        <p className="slogan">
          "Desafie sua mente, explore novas ideias e aprenda de forma ativa: sua
          jornada de conhecimento começa aqui!"
        </p>

        <FlashcardRandon />
        <ResumoAtalhos />

        <div className="disciplinas">
          <h3>Estude por Disciplina</h3>
          <div className="disciplinas-grid">
            {materiasData.map((materia) => {
              const iconeMateria =
                iconesMaterias[materia.nome] || iconesMaterias.Geral;

              return (
                <div
                  key={materia.id}
                  className="disciplina-card"
                  onClick={() => navegarParaMateria(materia)} // ✅ usa a função recebida por props
                >
                  <div className="disciplina-icon">
                    <FontAwesomeIcon icon={iconeMateria} size="2x" />
                  </div>
                  <h2>{materia.nome}</h2>
                  <p>{materia.total_topicos} tópicos</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card-chat">
          <ChatAssistente />
        </div>
      </div>
    </div>
  );
};

export default Main;
