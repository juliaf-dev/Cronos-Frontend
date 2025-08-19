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

        // 🔹 1) Busca conteúdos existentes
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

        const search = await res.json();

        if (search.ok && search.data?.length) {
          setConteudoBD(search.data[0]);
          return;
        }

        // 🔹 2) Se não existe, pede geração automática
        const resGen = await fetch(`${API_BASE_URL}/api/conteudos/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify({ subtopico_id: subtopicoId }),
        });

        const gen = await resGen.json();
        if (gen.ok) {
          setConteudoBD(gen.data);
        } else {
          setErro("Não foi possível gerar conteúdo.");
        }
      } catch (err) {
        console.error("Erro ao carregar/gerar conteúdo:", err);
        setErro("Não foi possível carregar ou gerar o conteúdo.");
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
        id: conteudoBD.id, // ✅ agora enviando conteudo_id
        materiaId: conteudoBD.materia_id, // ✅ usado no CriarResumo
        subtopicoId,
        tituloSugerido: conteudoBD?.titulo || conteudoBD?.subtopico_nome,
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
          conteudo_id: conteudoBD.id,              // ✅ agora padronizado
          materia_id: conteudoBD.materia_id,
          topico_id: conteudoBD.topico_id,
          subtopico_id: conteudoBD.subtopico_id,
          titulo: conteudoBD.titulo || conteudoBD.subtopico_nome,
        },
      },
    });
  };

  return (
    <div className="pagina-historica">
      <button onClick={voltarParaMain} className="botao-voltar">
        ← Voltar
      </button>

      <h1>
        {[conteudoBD?.materia_nome, conteudoBD?.topico_nome, conteudoBD?.subtopico_nome]
          .filter(Boolean)
          .join(" · ")}
      </h1>

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
          materiaTopico={`${conteudoBD?.materia_nome} | ${conteudoBD?.topico_nome} | ${conteudoBD?.subtopico_nome}`}
        />
      )}
    </div>
  );
}

export default Conteudo;
