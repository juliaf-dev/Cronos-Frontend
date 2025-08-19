import React, { useEffect, useState } from "react";
import "../css/ResumoAtalhos.css";
import { API_BASE_URL } from "../config/config";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const formatarData = (dataISO) => {
  if (!dataISO) return "";
  const data = new Date(dataISO);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const ResumoAtalhos = () => {
  const { user } = useAuth();
  const [resumos, setResumos] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchResumos = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/resumos/usuario/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.message || "Erro ao buscar resumos");

        // ordena por data desc e pega os 5 mais recentes
        const recentes = [...data.data]
          .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em))
          .slice(0, 5);

        setResumos(recentes);
      } catch (err) {
        console.error("❌ Erro ao carregar resumos recentes:", err);
      }
    };

    fetchResumos();
  }, [user]);

  if (resumos.length === 0) {
    return (
      <div className="resumo-atalhos">
        <h3>Resumos Recentes</h3>
        <p style={{ textAlign: "center", marginTop: "10px", color: "#777" }}>
          Nenhum resumo encontrado.
        </p>
      </div>
    );
  }

  return (
    <div className="resumo-atalhos">
      <h3>Resumos Recentes</h3>
      <div className="atalhos-carousel">
        {resumos.map((resumo) => (
          <Link
            key={resumo.id}
            to={`/resumos/${resumo.id}`}
            className="atalho-card"
            title={`Resumo de ${resumo.titulo} - ${formatarData(resumo.criado_em)}`}
          >
            <div className="atalho-titulo">{resumo.titulo}</div>
            <div className="atalho-data">{formatarData(resumo.criado_em)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ResumoAtalhos;
