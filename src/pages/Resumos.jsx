// src/pages/Resumos.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/config";
import { useAuth } from "../context/AuthContext";
import "../css/Flashcards.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { iconesMaterias } from "../components/iconesMaterias";
import BotaoVoltar from "../components/BotaoVoltar";
import BotaoNovo from "../components/BotaoNovo";



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

        const materiasResponse = await fetch(`${API_BASE_URL}/api/materias`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const materiasResult = await materiasResponse.json();
        if (materiasResponse.ok && materiasResult.ok) {
          setMaterias(materiasResult.data);
        }

        const resumosResponse = await fetch(
          `${API_BASE_URL}/api/resumos/usuario/${user.id}`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const resumosResult = await resumosResponse.json();
        if (resumosResponse.ok && resumosResult.ok) {
          setResumosData(resumosResult.data);
        }
      } catch (error) {
        console.error("❌ Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [user]);

  // Agrupar resumos por matéria
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
          {/* 🔹 Agora o botão sabe diferenciar o "voltar" */}
          <BotaoVoltar
            onClick={
              selectedMateria
                ? () => setSelectedMateria(null) // volta para a lista de matérias
                : null // usa navigate(-1) padrão
            }
          />

          <h1 className="flashcard-title">
            {selectedMateria
              ? selectedMateria.materia_nome
              : "Minhas Pastas de Resumos"}
          </h1>

          <BotaoNovo rota="/criar-resumo" texto="Novo Resumo" />

        </div>

        {selectedMateria ? (
          <div className="pastas-lista">
            {selectedMateria.resumos.length > 0 ? (
              selectedMateria.resumos.map((resumo) => {
                const iconeMateria =
                  iconesMaterias[selectedMateria.materia_nome] ||
                  iconesMaterias.Geral;

                return (
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
                      <FontAwesomeIcon icon={iconeMateria} />{" "}
                      {selectedMateria.materia_nome}
                    </div>
                  </div>
                );
              })
            ) : (
              <p
                style={{
                  textAlign: "center",
                  marginTop: "20px",
                  color: "#5b4031",
                }}
              >
                Não há resumos para esta matéria ainda.
              </p>
            )}
          </div>
        ) : (
          <div className="pastas-lista">
            {resumosPorMateria.map((m) => {
              const iconeMateria =
                iconesMaterias[m.materia_nome] || iconesMaterias.Geral;

              return (
                <div
                  key={m.materia_id}
                  className="pasta-item"
                  onClick={() => setSelectedMateria(m)}
                >
                  <FontAwesomeIcon icon={iconeMateria} className="pasta-icone" />
                  <div className="pasta-info">
                    <h3>{m.materia_nome}</h3>
                    <p>{m.resumos.length} resumos</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Resumos;
