import MateriaTemplate from './MateriaTemplate';

const Sociologia = ({ voltarParaMain, navegarParaConteudo }) => {
  const periodos = [
    { 
      id: 1, 
      nome: "Filosofia Antiga", 
      subitens: ["Pré-Socráticos", "Sócrates", "Platão", "Aristóteles"] 
    },
    { 
      id: 2, 
      nome: "Filosofia Medieval", 
      subitens: ["Patrística", "Escolástica", "Filosofia cristã e influências do islamismo e judaísmo"] 
    },
  ];

  return (
    <MateriaTemplate
      voltarParaMain={voltarParaMain}
      navegarParaConteudo={navegarParaConteudo}
      titulo="Sociologia"
      itens={periodos}
   
    />
  );
};

export default Sociologia;