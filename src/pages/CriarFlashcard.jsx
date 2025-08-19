// src/pages/CriarFlashcard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../config/config";

import "../css/CriarFlashcards.css";

function CriarFlashcard() {
  const navigate = useNavigate();
  const location = useLocation();
  const conteudoState = location.state?.conteudo;
  const vindoDoConteudo = !!conteudoState;

  const [materiasDisponiveis, setMateriasDisponiveis] = useState([]);
  const [materiaSelecionada, setMateriaSelecionada] = useState({
    id: null,
    nome: "",
  });
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [dificuldade, setDificuldade] = useState("medio"); // 🔹 default
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("accessToken");

  // 🔹 Carregar matéria vinculada se veio de conteúdo
  useEffect(() => {
    if (vindoDoConteudo && conteudoState) {
      setPergunta(conteudoState.tituloSugerido || "");
      setResposta("");

      const carregarMateria = async () => {
        try {
          let url = null;
          let headers = {};

          if (conteudoState.materiaId) {
            url = `${API_BASE_URL}/api/materias/${conteudoState.materiaId}`;
            headers = { Authorization: `Bearer ${token}` };
          } else if (conteudoState.subtopicoId) {
            url = `${API_BASE_URL}/api/subtopicos/${conteudoState.subtopicoId}/materia`;
          }

          if (!url) return;

          const response = await fetch(url, { headers });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || "Erro ao carregar matéria vinculada");

          setMateriaSelecionada({
            id: data.data?.id || data.data?.materia_id,
            nome: data.data?.nome || data.data?.nome_materia || "Matéria",
          });
        } catch (err) {
          console.error("❌ Erro ao carregar matéria vinculada:", err);
          setError("Erro ao carregar a matéria vinculada.");
        }
      };

      carregarMateria();
    }
  }, [vindoDoConteudo, conteudoState, token]);

  // 🔹 Carregar matérias se criação manual
  useEffect(() => {
    if (vindoDoConteudo) return;

    const fetchMaterias = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/materias`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Erro ao carregar matérias");

        setMateriasDisponiveis(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error("❌ Erro ao buscar matérias:", err);
        setError("Erro ao carregar matérias.");
      }
    };

    fetchMaterias();
  }, [vindoDoConteudo, token]);

  // 🔹 Salvar Flashcard
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!pergunta || !resposta || !materiaSelecionada.id) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const flashcardPayload = {
        materia_id: materiaSelecionada.id,
        ...(conteudoState?.id ? { conteudo_id: conteudoState.id } : {}),
        pergunta,
        resposta,
        dificuldade, // 🔹 agora com dificuldade
      };

      const response = await fetch(`${API_BASE_URL}/api/flashcards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(flashcardPayload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao criar flashcard");

      setMessage(data.message || "Flashcard criado com sucesso!");
      setTimeout(() => {
        if (vindoDoConteudo) {
          navigate("/quiz", { state: { conteudo: conteudoState } });
        } else {
          navigate("/flashcards");
        }
      }, 1000);
    } catch (err) {
      console.error("❌ Erro ao salvar flashcard:", err);
      setError(err.message || "Erro ao criar flashcard.");
    }
  };

  return (
    <div className="criar-flashcard-container">
      <h2>{vindoDoConteudo ? "Criar Flashcard do Conteúdo" : "Criar Novo Flashcard"}</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="pergunta">Pergunta:</label>
          <input
            type="text"
            id="pergunta"
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            required
          />
        </div>

        {!vindoDoConteudo ? (
          <div className="form-group">
            <label htmlFor="materia">Matéria:</label>
            <select
              id="materia"
              value={materiaSelecionada.id || ""}
              onChange={(e) => {
                const materiaId = Number(e.target.value);
                const materia = materiasDisponiveis.find((m) => m.id === materiaId);
                setMateriaSelecionada(materia || { id: null, nome: "" });
              }}
              required
            >
              <option value="">Selecione uma matéria</option>
              {(Array.isArray(materiasDisponiveis) ? materiasDisponiveis : []).map((mat) => (
                <option key={mat.id} value={mat.id}>
                  {mat.nome}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="materia">Matéria:</label>
            <input
              type="text"
              id="materia"
              value={materiaSelecionada.nome || "Carregando..."}
              readOnly
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="resposta">Resposta:</label>
          <textarea
            id="resposta"
            value={resposta}
            onChange={(e) => setResposta(e.target.value)}
            rows="8"
            required
          ></textarea>
        </div>

        {/* 🔹 campo de dificuldade */}
        <div className="form-group">
          <label htmlFor="dificuldade">Nível de dificuldade:</label>
          <select
            id="dificuldade"
            value={dificuldade}
            onChange={(e) => setDificuldade(e.target.value)}
          >
            <option value="facil">Fácil</option>
            <option value="medio">Médio</option>
            <option value="dificil">Difícil</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-salvar">Salvar Flashcard</button>
          <button type="button" onClick={() => navigate(-1)} className="btn-cancelar">Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default CriarFlashcard;
