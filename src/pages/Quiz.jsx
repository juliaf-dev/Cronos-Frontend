import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/Quiz.css";
import BotaoVoltar from "../components/BotaoVoltar";

import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// 🔹 Sanitização mínima
function sanitizeHTML(texto) {
  let clean = String(texto || "")
    .replace(/```html|```/gi, "")
    .replace(/<h1[^>]*>.*?<\/h1>/gi, "")
    .trim();

  if (!/(<p>|<h2>|<ul>|<li>)/i.test(clean)) {
    clean = `<p>${clean}</p>`;
  }
  return clean;
}

function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const conteudo = location.state?.conteudo;

  const [quizId, setQuizId] = useState(null);
  const [questoes, setQuestoes] = useState([]);
  const [respostas, setRespostas] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [finalizado, setFinalizado] = useState(false);
  const [resultado, setResultado] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [mostrarAlternativas, setMostrarAlternativas] = useState(false);

  // Criar sessão
  const criarSessao = async () => {
    if (!conteudo) {
      setErro("Conteúdo não encontrado.");
      return;
    }
    setLoading(true);
    setErro(null);

    try {
      const token = localStorage.getItem("accessToken");
      const usuarioId = localStorage.getItem("userId");

      const res = await fetch(`${API_BASE_URL}/api/quiz/sessoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          conteudo_id: conteudo.conteudo_id,
          usuario_id: usuarioId,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        if (res.status === 400) {
          toast.warn(data.message || "Não foi possível gerar quiz com 10 questões.");
          navigate("/main");
          return;
        }
        throw new Error(data.message || "Erro ao criar sessão");
      }

      const questoesNormalizadas = (data.quiz.questoes || []).map((q) => ({
        ...q,
        enunciado: sanitizeHTML(q.enunciado || "Enunciado indisponível"),
        alternativas: (q.alternativas || []).map((alt) => {
          if (typeof alt === "string") {
            const letra = alt.trim().charAt(0).toUpperCase();
            const texto = alt.replace(/^[A-E]\)\s*/i, "").trim();
            return { id: `${q.id}-${letra}`, letra, texto: sanitizeHTML(texto) };
          }
          return {
            id: alt.id || `${q.id}-${alt.letra}`,
            letra: alt.letra,
            texto: sanitizeHTML(alt.texto),
          };
        }),
      }));

      setQuizId(data.quiz.quiz_id);
      setQuestoes(questoesNormalizadas);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Responder questão
  const responderQuestao = async (questaoId, alternativaId, letra) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE_URL}/api/quiz/responder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          quiz_id: quizId,
          questao_id: questaoId,
          alternativa_id: alternativaId,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error)
        throw new Error(data.message || "Erro ao responder");

      setRespostas((prev) => ({ ...prev, [questaoId]: letra }));
      setFeedback((prev) => ({
        ...prev,
        [questaoId]: {
          correta: data.correta,
          message: data.message,
          explicacao: sanitizeHTML(data.explicacao || "Sem explicação disponível."),
          corretaLetra: data.letra_correta,
        },
      }));
    } catch (err) {
      setErro(err.message);
    }
  };

  // Criar flashcard
  const criarFlashcard = async (questao) => {
    try {
      const token = localStorage.getItem("accessToken");
      const corretaLetra = feedback[questao.id]?.corretaLetra;
      if (!corretaLetra) {
        toast.warn("⚠️ Responda a questão antes de criar o flashcard.");
        return;
      }

      const correta = questao.alternativas?.find(
        (alt) => alt.letra?.toUpperCase() === corretaLetra?.toUpperCase()
      );
      if (!correta) throw new Error("Não foi possível identificar a alternativa correta.");

      const materiaId = questao.materia_id ?? conteudo?.materia_id;
      if (!materiaId) throw new Error("materia_id ausente no backend.");

      const flashPayload = {
        materia_id: materiaId,
        pergunta: questao.enunciado,
        resposta: correta.texto,
      };

      const res = await fetch(`${API_BASE_URL}/api/flashcards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(flashPayload),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.message || "Erro ao criar flashcard");

      toast.success(data.message || "✅ Flashcard criado!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Finalizar quiz
  const finalizarQuiz = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE_URL}/api/quiz/finalizar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ quiz_id: quizId }),
      });

      const data = await res.json();
      if (!res.ok || data.error)
        throw new Error(data.message || "Erro ao finalizar");

      setResultado(data);
      setFinalizado(true);
    } catch (err) {
      setErro(err.message);
    }
  };

  useEffect(() => {
    criarSessao();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p>Carregando quiz...</p>;
  if (erro) return <p className="error-message">{erro}</p>;

  const questaoAtual = questoes[currentIndex];
  const progresso = ((currentIndex + 1) / questoes.length) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <BotaoVoltar />
        <h2>Quiz do Conteúdo: {conteudo?.titulo}</h2>
      </div>

      {!finalizado && questoes.length > 0 && questaoAtual && (
        <>
          {/* Barra de progresso */}
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progresso}%` }}></div>
          </div>
          <p>
            Questão {currentIndex + 1} de {questoes.length}
          </p>

          <div className="questao-card">
            <div
              className="enunciado"
              dangerouslySetInnerHTML={{ __html: questaoAtual.enunciado }}
            />

            {/* 🔹 Antes de expandir → só o botão */}
            {!mostrarAlternativas ? (
              <button
                className="btn-expandir"
                onClick={() => setMostrarAlternativas(true)}
              >
                ▼ Mostrar alternativas
              </button>
            ) : (
              <>
                <div className="alternativas">
                  {questaoAtual.alternativas?.map((alt) => {
                    const userAnswer = respostas[questaoAtual.id];
                    const fb = feedback[questaoAtual.id];
                    const isCorreta = fb?.corretaLetra === alt.letra;
                    const isSelecionada = userAnswer === alt.letra;

                    return (
                      <button
                        key={alt.id}
                        className={`alternativa-btn 
                          ${isSelecionada ? "selecionada" : ""}
                          ${
                            fb
                              ? isCorreta
                                ? "correta"
                                : isSelecionada
                                ? "errada"
                                : ""
                              : ""
                          }`}
                        onClick={() =>
                          responderQuestao(questaoAtual.id, alt.id, alt.letra)
                        }
                        disabled={!!fb}
                        dangerouslySetInnerHTML={{
                          __html: `${alt.letra}) ${alt.texto}`,
                        }}
                      />
                    );
                  })}
                </div>

                {/* 🔹 Criar flashcard aparece junto das alternativas */}
                <div className="flashcard-inline">
                  <button
                    className="btn-flashcard"
                    onClick={() => criarFlashcard(questaoAtual)}
                  >
                    ➕ Criar Flashcard
                  </button>
                </div>
              </>
            )}

            {feedback[questaoAtual.id] && (
              <div className="feedback">
                <p>{feedback[questaoAtual.id].message}</p>
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<strong>Explicação:</strong> ${feedback[questaoAtual.id].explicacao}`,
                  }}
                />
              </div>
            )}

            {/* 🔹 Próxima / Finalizar fica separado */}
            {feedback[questaoAtual.id] && (
              <div className="quiz-actions">
                {currentIndex < questoes.length - 1 ? (
                  <button
                    className="btn-proxima"
                    onClick={() => {
                      setCurrentIndex((i) => i + 1);
                      setMostrarAlternativas(false);
                    }}
                  >
                    ➡ Próxima
                  </button>
                ) : (
                  <button className="btn-finalizar" onClick={finalizarQuiz}>
                    🏁 Finalizar
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {finalizado && resultado && (
        <div className="quiz-resumo">
          <h3>✅ Resultado do Quiz</h3>

          <div style={{ width: 180, margin: "20px auto" }}>
            <CircularProgressbar
              value={(resultado.acertos / resultado.total) * 100}
              text={`${Math.round(
                (resultado.acertos / resultado.total) * 100
              )}%`}
              styles={buildStyles({
                textColor: "#333",
                pathColor: "#28a745",
                trailColor: "#ddd",
                textSize: "16px",
                pathTransitionDuration: 0.5,
              })}
            />
          </div>

          <p>Total de Questões: {resultado.total}</p>
          <p>Acertos: {resultado.acertos}</p>
          <p>Erros: {resultado.erros}</p>

          <button onClick={() => navigate("/main")}>⬅ Voltar ao painel</button>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
}

export default Quiz;
