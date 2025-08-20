import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../config/config";
import { useAuth } from "../context/AuthContext";
import "../css/CriarResumo.css"; // Reutiliza CSS de formulário

function ResumoView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [materia, setMateria] = useState("");
  const [materiasDisponiveis, setMateriasDisponiveis] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 🔹 Carregar resumo e matérias
  useEffect(() => {
    if (!user) return;

    const fetchResumo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/resumos/${id}`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const data = await response.json();

        if (response.ok && data.ok) {
          setTitulo(data.data.titulo);
          setConteudo(data.data.corpo); // campo correto na tabela
          setMateria(data.data.materia_id);
        } else {
          setError(data.error || "Resumo não encontrado.");
        }
      } catch (err) {
        setError("❌ Erro ao carregar o resumo.");
      } finally {
        setLoading(false);
      }
    };

    const fetchMaterias = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/materias`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          setMateriasDisponiveis(data.data);
        }
      } catch (err) {
        console.error("❌ Erro ao carregar matérias:", err);
      }
    };

    fetchMaterias();
    fetchResumo();
  }, [id, user]);

  // 🔹 Atualizar resumo
  const handleSalvar = async () => {
    setMessage("");
    setError("");

    if (!titulo || !conteudo || !materia) {
      setError("⚠️ Por favor, preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/resumos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ titulo, corpo: conteudo, materia_id: materia }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        setMessage("✅ Resumo atualizado com sucesso!");
      } else {
        setError(data.error || "Erro ao atualizar resumo.");
      }
    } catch (err) {
      setError("❌ Erro ao atualizar resumo.");
    }
  };

  // 🔹 Excluir resumo
  const handleExcluir = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este resumo?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/resumos/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        navigate("/resumos");
      } else {
        const data = await response.json();
        setError(data.error || "Erro ao excluir resumo.");
      }
    } catch {
      setError("❌ Erro ao excluir resumo.");
    }
  };

  if (loading) return <p>Carregando resumo...</p>;

  return (
    <div className="criar-resumo-container">
      <h2>Visualizar / Editar Resumo</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label htmlFor="titulo">Título:</label>
        <input
          type="text"
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="conteudo">Conteúdo do Resumo:</label>
        <textarea
          id="conteudo"
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          rows="8"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="materia">Matéria:</label>
        <select
          id="materia"
          value={materia}
          onChange={(e) => setMateria(e.target.value)}
          required
        >
          <option value="">Selecione uma matéria</option>
          {materiasDisponiveis.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button onClick={handleSalvar} className="btn-salvar">
          Salvar
        </button>
        <button
          onClick={handleExcluir}
          className="btn-excluir"
          style={{ marginLeft: "10px" }}
        >
          Excluir
        </button>
        <button
          onClick={() => navigate("/resumos")}
          className="btn-cancelar"
          style={{ marginLeft: "10px" }}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

export default ResumoView;
