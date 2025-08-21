// src/pages/Evolucao.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import "../css/evolucao.css";
import { useAuth } from "../context/AuthContext";
import { requestApi } from "../services/authServices.js";
import BotaoVoltar from "../components/BotaoVoltar";

const Evolucao = () => {
  const [dados, setDados] = useState(null);
  const { user } = useAuth();

  // 🔹 Buscar evolução inicial no backend
  useEffect(() => {
    const fetchEvolucao = async () => {
      try {
        if (!user?.id) {
          console.error("❌ Nenhum usuário logado no contexto!");
          return;
        }

        const res = await requestApi(`/evolucao/painel/${user.id}`, { method: "GET" });
        console.log("📥 Resposta painel:", res);

        if (res.ok) {
          setDados(res.data);
        }
      } catch (err) {
        console.error("❌ Erro ao carregar painel de evolução:", err);
      }
    };

    fetchEvolucao();
  }, [user]);

  // 🔹 Ping automático de minutos estudados (atualiza state em tempo real)
  useEffect(() => {
    const ping = async () => {
      try {
        if (document.visibilityState === "visible") {
          const res = await requestApi("/evolucao/ping", { method: "POST" });
          console.log("⏱️ Ping resposta:", res);

          if (res.ok && res.data) {
            setDados((prev) => {
              if (!prev) return prev;

              let novoMapa = [...(prev.mapa || [])];
              if (novoMapa.length > 0) {
                novoMapa[novoMapa.length - 1] = {
                  ...novoMapa[novoMapa.length - 1],
                  minutos_estudados: res.data.minutos,
                  acessos: res.data.acessos,
                };
              }

              return {
                ...prev,
                resumo: {
                  ...prev.resumo,
                  tempo_total: res.data.minutos,
                  streak: res.data.streak,
                  total_resumos: prev.resumo.total_resumos,
                },
                mapa: novoMapa,
              };
            });
          }
        }
      } catch (err) {
        console.error("❌ Erro ao enviar ping:", err);
      }
    };

    ping();
    const interval = setInterval(ping, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!dados) return <p>Carregando evolução...</p>;

  const resumo = dados.resumo ?? {};
  const mapa = dados.mapa ?? [];
  const acessosHoje = mapa.length > 0 ? mapa[mapa.length - 1].acessos : 0;

  return (
    <div className="evolucao-container">
      {/* 🔹 Header padronizado */}
      <div className="flashcards-header">
        <BotaoVoltar />
        <h2 className="flashcard-title">Painel de Evolução</h2>
        <div style={{ width: "80px" }}></div> {/* placeholder para alinhar */}
      </div>

      {/* Resumo rápido */}
      <div className="resumo-cards">
        <div className="card">
          <h3>Progresso Geral</h3>
          <p>{resumo.progressoGeral ?? 0}%</p>
          <small>
            {resumo.total_acertos ?? 0} acertos de {resumo.total_respondidas ?? 0} questões
          </small>
        </div>
        <div className="card">
          <h3>Tempo de Estudo</h3>
          <p>{resumo.tempo_total ?? 0} min</p>
          <small>tempo total em atividade</small>
        </div>
        <div className="card">
          <h3>Acessos</h3>
          <p>{acessosHoje}</p>
          <small>nº de acessos hoje</small>
        </div>
        <div className="card">
          <h3>Dias Seguidos</h3>
          <p>{resumo.streak ?? 0}</p>
          <small>streak de uso diário</small>
        </div>
        <div className="card">
          <h3>Resumos</h3>
          <p>{resumo.total_resumos ?? 0}</p>
          <small>resumos criados</small>
        </div>
      </div>

      {/* Gráficos por matéria */}
      <div className="graficos-section">
        <h2>Desempenho por Matéria</h2>
        <div className="graficos-grid">
          {dados.desempenhoPorMateria && dados.desempenhoPorMateria.length > 0 ? (
            dados.desempenhoPorMateria.map((m, idx) => (
              <div key={idx} className="grafico-card">
                <h3>{m.materia}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[{ ...m, acertos: m.acertos ?? 0, erros: m.erros ?? 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="materia" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="acertos" fill="#4caf50" name="Acertos" />
                    <Bar dataKey="erros" fill="#f44336" name="Erros" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))
          ) : (
            <p>Nenhum desempenho registrado ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Evolucao;
