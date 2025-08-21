import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaFileAlt, FaQuestionCircle } from "react-icons/fa";
import "../css/conteudos.css";
import ChatAssistente from "../components/ChatAssistente";
import { API_BASE_URL } from "../config/config";

function Conteudo({ voltarParaMain }) {
  const { subtopicoId } = useParams();
  const navigate = useNavigate();

  const [conteudoBD, setConteudoBD] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarConteudo = async () => {
      if (!subtopicoId) {
        setErro("ID do subtópico não informado.");
        setCarregando(false);
        return;
      }

      setCarregando(true);
      setErro(null);

      try {
        const token = localStorage.getItem("accessToken");

        const res = await fetch(
          `${API_BASE_URL}/api/conteudos/subtopico/${subtopicoId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            credentials: "include",
          }
        );

        const data = await res.json();

        if (data.ok && data.data) {
          setConteudoBD(data.data);
        } else {
          setErro(data.message || "Não foi possível carregar conteúdo.");
        }
      } catch (err) {
        console.error("Erro ao carregar conteúdo:", err);
        setErro("Erro de conexão ao carregar o conteúdo.");
      } finally {
        setCarregando(false);
      }
    };

    carregarConteudo();
  }, [subtopicoId]);

  const irParaCriarResumo = () => {
    if (!conteudoBD) return;
    navigate("/criar-resumo", {
      state: {
        conteudo: {
          id: conteudoBD.id,
          materiaId: conteudoBD.materia_id,
          subtopicoId: conteudoBD.subtopico_id,
          tituloSugerido: conteudoBD?.subtopico_nome,
          bodyBase: conteudoBD?.body || "",
        },
      },
    });
  };

  const irParaQuiz = () => {
    if (!conteudoBD) return;
    navigate("/quiz", {
      state: {
        conteudo: {
          conteudo_id: conteudoBD.id,
          materia_id: conteudoBD.materia_id,
          topico_id: conteudoBD.topico_id,
          subtopico_id: conteudoBD.subtopico_id,
          titulo: conteudoBD.subtopico_nome,
        },
      },
    });
  };

  return (
    <div className="pagina-historica">
      <button onClick={voltarParaMain} className="botao-voltar">
        ← Voltar
      </button>

      {conteudoBD && (
        <div className="cabecalho-conteudo">
          <span className="tag-materia">{conteudoBD?.materia_nome}</span>
          <h1>{conteudoBD?.subtopico_nome}</h1>
        </div>
      )}

      <div className="conteudo-texto">
        {carregando ? (
          <p>Carregando conteúdo...</p>
        ) : erro ? (
          <p className="erro">{erro}</p>
        ) : conteudoBD?.body ? (
          <div dangerouslySetInnerHTML={{ __html: conteudoBD.body }} />
        ) : (
          <p className="erro">Conteúdo indisponível.</p>
        )}
      </div>

      <div className="acoes-conteudo">
        <button onClick={irParaCriarResumo} className="botao-criar-resumo">
          <FaFileAlt /> Criar Resumo
        </button>
        <button onClick={irParaQuiz} className="botao-quiz">
          <FaQuestionCircle /> Fazer Quiz
        </button>
      </div>

      {conteudoBD && (
        <ChatAssistente
          contexto={{
            conteudo_id: conteudoBD.id, // 🔹 agora o back pode buscar também pelo ID
            materia: conteudoBD?.materia_nome,
            topico: conteudoBD?.topico_nome,
            subtopico: conteudoBD?.subtopico_nome,
            conteudo: conteudoBD?.body, // 🔹 envia o conteúdo completo
          }}
        />
      )}
    </div>
  );
}

export default Conteudo;
