import MateriaTemplate from './MateriaTemplate';

const Geografia = ({ voltarParaMain, navegarParaConteudo }) => {
  const periodos = [
    { 
      id: 1, 
      nome: "Geografia Física", 
      subitens: ["Relevo", "Clima", "Vegetação"] 
    },
    { 
      id: 2, 
      nome: "Geografia Humana", 
      subitens: ["Urbanização", "Demografia", "Globalização"] 
    },
    { 
      id: 3, 
      nome: "Geografia do Brasil", 
      subitens: ["Regiões Brasileiras", "Biomas", "Problemas Ambientais"] 
    },
  ];

  return (
    <MateriaTemplate
      voltarParaMain={voltarParaMain}
      navegarParaConteudo={navegarParaConteudo}
      titulo="Geografia"
      itens={periodos}
   
    />
  );
};

export default Geografia;