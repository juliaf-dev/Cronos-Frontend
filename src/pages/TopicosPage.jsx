// src/pages/TopicosPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/config";
import "../css/Topicos.css";
import BotaoVoltar from "../components/BotaoVoltar";

const TopicosPage = () => {
  const { materiaId } = useParams();
  const navigate = useNavigate();
  const [topicos, setTopicos] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchTopicos = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`${API_BASE_URL}/api/topicos/materia/${materiaId}`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        const data = await res.json();

        if (data.ok && Array.isArray(data.data)) {
          setTopicos(data.data);
        } else {
          console.warn("Resposta inesperada:", data);
        }
      } catch (err) {
        console.error("Erro ao carregar tópicos:", err);
      }
    };

    fetchTopicos();
  }, [materiaId]);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const abrirConteudo = (subtopico) => {
    navigate(`/conteudos/${subtopico.id}`, {
      state: {
        conteudo: {
          materiaId,
          topicoId: subtopico.topico_id,
          subtopicoId: subtopico.id,
          materiaNome: subtopico.materia_nome || "Matéria",
          topico: subtopico.topico_nome || "Tópico",
          subtopico: subtopico.nome,
        },
      },
    });
  };

  return (
    <div className="topicos-container">
      {/* 🔹 Header padronizado */}
      <div className="flashcards-header">
        <BotaoVoltar />
        <h2 className="flashcard-title">Tópicos da Matéria</h2>
        <div style={{ width: "80px" }}></div> {/* placeholder para alinhar */}
      </div>

      {topicos.length > 0 ? (
        topicos.map((topico) => (
          <div key={topico.id} className="topico-card">
            <div className="topico-header" onClick={() => toggleExpand(topico.id)}>
              <h3>{topico.nome}</h3>
              <button className="expand-btn">
                {expanded === topico.id ? "−" : "+"}
              </button>
            </div>

            {/* Se expandido → lista subtopicos */}
            {expanded === topico.id && (
              <div className="subtopicos-list">
                {topico.subtopicos && topico.subtopicos.length > 0 ? (
                  topico.subtopicos.map((sub) => (
                    <div
                      key={sub.id}
                      className="subtopico-item"
                      onClick={() => abrirConteudo(sub)}
                    >
                      {sub.nome}
                    </div>
                  ))
                ) : (
                  <p className="no-subtopicos">Nenhum subtópico disponível.</p>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <p>Nenhum tópico encontrado.</p>
      )}
    </div>
  );
};

export default TopicosPage;
