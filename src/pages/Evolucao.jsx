// src/pages/Evolucao.jsx
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/config";
import {
  BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import '../css/evolucao.css';

const Evolucao = () => {
  const [dados, setDados] = useState(null);

  // 🔹 Buscar evolução inicial no backend
  useEffect(() => {
    const fetchEvolucao = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const userId = localStorage.getItem("userId");

        if (!userId) {
          console.error("❌ Nenhum userId encontrado no localStorage!");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/evolucao/painel/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });

        const data = await res.json();
        console.log("📥 Resposta painel:", data);

        if (data.ok) {
          setDados(data.data);
        }
      } catch (err) {
        console.error("❌ Erro ao carregar painel de evolução:", err);
      }
    };

    fetchEvolucao();
  }, []);

  // 🔹 Ping automático de minutos estudados (atualiza state em tempo real)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const ping = async () => {
      try {
        if (document.visibilityState === "visible") {
          const res = await fetch(`${API_BASE_URL}/api/evolucao/ping`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          });

          const data = await res.json();
          console.log("⏱️ Ping resposta:", data);

          if (data.ok && data.data) {
            setDados(prev => {
              if (!prev) return prev;

              // Atualiza mapa diário
              let novoMapa = [...(prev.mapa || [])];
              if (novoMapa.length > 0) {
                novoMapa[novoMapa.length - 1] = {
                  ...novoMapa[novoMapa.length - 1],
                  minutos_estudados: data.data.minutos,
                  acessos: data.data.acessos,
                };
              }

              return {
                ...prev,
                resumo: {
                  ...prev.resumo,
                  tempo_total: data.data.minutos,
                  streak: data.data.streak,
                  total_resumos: prev.resumo.total_resumos // mantém
                },
                mapa: novoMapa
              };
            });
          }
        }
      } catch (err) {
        console.error("❌ Erro ao enviar ping:", err);
      }
    };

    // 🔹 Primeiro ping imediato
    ping();

    // 🔹 Depois a cada 1 minuto
    const interval = setInterval(ping, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!dados) return <p>Carregando evolução...</p>;

  const resumo = dados.resumo ?? {};
  const mapa = dados.mapa ?? [];
  const acessosHoje = mapa.length > 0 ? mapa[mapa.length - 1].acessos : 0;

  return (
    <div className="evolucao-container">
      <h2>Painel de Evolução</h2>

      {/* Resumo rápido */}
      <div className="resumo-cards">
        <div className="card">
          <h3>Progresso Geral</h3>
          <p>{resumo.progressoGeral ?? 0}%</p>
          <small>{resumo.total_acertos ?? 0} acertos de {resumo.total_respondidas ?? 0} questões</small>
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
          {(dados.desempenhoPorMateria && dados.desempenhoPorMateria.length > 0) ? (
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
