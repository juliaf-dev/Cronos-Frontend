import MateriaTemplate from './MateriaTemplate';

const Historia = ({ voltarParaMain, navegarParaConteudo }) => {
  const periodos = [
    { 
      id: 1, 
      nome: "Pré-História", 
      subitens: ["Paleolítico", "Neolítico", "Idade dos Metais"] 
    },
    { 
      id: 2, 
      nome: "Idade Antiga", 
      subitens: ["Civilizações Mesopotâmicas", "Antigo Egito", "Grécia Antiga"] 
    },
    // ... outros períodos
  ];

  return (
    <MateriaTemplate
      voltarParaMain={voltarParaMain}
      navegarParaConteudo={navegarParaConteudo}
      titulo="História"
      itens={periodos}
   
    />
  );
};

export default Historia;