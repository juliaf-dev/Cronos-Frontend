import React from 'react';
import '../css/ResumoAtalhos.css';

const resumosRecentes = [
  { id: 1, titulo: "A Revolução Francesa", link: "#", data: "2025-05-15" },
  { id: 2, titulo: "Geopolítica do Petróleo", link: "#", data: "2025-05-17" },
  { id: 3, titulo: "Sócrates e a Ética", link: "#", data: "2025-05-18" },
  { id: 4, titulo: "Karl Marx: Trabalho e Alienação", link: "#", data: "2025-05-20" },
];

const formatarData = (dataISO) => {
  const data = new Date(dataISO);
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const ResumoAtalhos = () => {
  return (
    <div className="resumo-atalhos">
      <h3>Resumos Recentes</h3>
      <div className="atalhos-grid">
        {resumosRecentes.map(resumo => (
          <a 
            key={resumo.id} 
            href={resumo.link} 
            className="atalho-card"
            title={`Resumo de ${resumo.titulo} - ${formatarData(resumo.data)}`}
          >
            <div className="atalho-titulo">{resumo.titulo}</div>
            <div className="atalho-data">{formatarData(resumo.data)}</div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ResumoAtalhos;
