// src/pages/Quiz.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/Quiz.css";

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
  const [setResumo] = useState(null);

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
      const res = await fetch(`${API_BASE_URL}/api/quiz/sessoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          conteudo_id: conteudo.conteudo_id,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.message || "Erro ao criar sessão");

      setQuizId(data.quiz.quiz_id);
      setQuestoes(data.quiz.questoes || []);
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
      if (!res.ok || data.error) throw new Error(data.message || "Erro ao responder");

      setRespostas((prev) => ({ ...prev, [questaoId]: letra }));

      setFeedback((prev) => ({
        ...prev,
        [questaoId]: {
          correta: data.correta,
          message: data.message,
          explicacao: data.explicacao || "Sem explicação disponível.",
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

      // precisa ter respondido antes
      const corretaLetra = feedback[questao.id]?.corretaLetra;
      if (!corretaLetra) {
        toast.warn("⚠️ Responda a questão antes de criar o flashcard.");
        return;
      }

      const correta = questao.alternativas?.find(
        (alt) => alt.letra?.toUpperCase() === corretaLetra?.toUpperCase()
      );
      if (!correta) {
        throw new Error("Não foi possível identificar a alternativa correta.");
      }

      const materiaId = questao.materia_id ?? conteudo?.materia_id;
      if (!materiaId) {
        throw new Error("materia_id ausente. Verifique se o backend envia questao.materia_id.");
      }

      const flashPayload = {
        materia_id: materiaId,
        pergunta: String(questao.enunciado),
        resposta: String(correta.texto),
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

      toast.success(data.message || "✅ Flashcard criado com sucesso!");
    } catch (err) {
      console.error("❌ Erro ao criar flashcard:", err);
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
      if (!res.ok || data.error) throw new Error(data.message || "Erro ao finalizar");

      setResultado(data);

      const resumoRes = await fetch(`${API_BASE_URL}/api/quiz/${quizId}/resumo`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      const resumoData = await resumoRes.json();
      if (!resumoRes.ok || resumoData.error)
        throw new Error(resumoData.message || "Erro ao carregar resumo");

      setResumo(resumoData);
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

  return (
    <div className="quiz-container">
      <h2>Quiz do Conteúdo: {conteudo?.titulo}</h2>

      {!finalizado && questoes.length > 0 && (
        <>
          {questoes.map((q, idx) => (
            <div key={q.id} className="questao-card">
              <h3>{idx + 1}. {q.enunciado}</h3>

              <div className="alternativas">
                {q.alternativas?.map((alt) => {
                  const userAnswer = respostas[q.id];
                  const fb = feedback[q.id];
                  const isCorreta = fb?.corretaLetra === alt.letra;

                  return (
                    <button
                      key={alt.id}
                      className={`alternativa-btn 
                        ${userAnswer === alt.letra ? "selecionada" : ""}
                        ${fb ? (isCorreta ? "correta" : userAnswer === alt.letra ? "errada" : "") : ""}`}
                      onClick={() => responderQuestao(q.id, alt.id, alt.letra)}
                      disabled={!!fb}
                    >
                      {alt.letra}) {alt.texto}
                    </button>
                  );
                })}
              </div>

              {feedback[q.id] && (
                <div className="feedback">
                  <p>{feedback[q.id].message}</p>
                  <p><strong>Explicação:</strong> {feedback[q.id].explicacao}</p>
                </div>
              )}

              <button className="btn-flashcard" onClick={() => criarFlashcard(q)}>
                ➕ Criar Flashcard
              </button>
            </div>
          ))}

          <button className="btn-finalizar" onClick={finalizarQuiz}>
            Finalizar Quiz
          </button>
        </>
      )}

      {finalizado && resultado && (
        <div className="quiz-resumo">
          <h3>✅ Resultado do Quiz</h3>
          <p>Total: {resultado.total}</p>
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
