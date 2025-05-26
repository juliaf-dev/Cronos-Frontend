import MateriaTemplate from './MateriaTemplate';

const Filosofia = ({ voltarParaMain, navegarParaConteudo }) => {
  const periodos = [
    {
        id: 10, 
        nome: "O que mais cai em Filosofia no Enem",
        subitens: ["Ética e justiça" , "Platão e Aristóteles" , "Escola de Frankfurt ", "Filósofos contratualistas"  , "Natureza do conhecimento"]
    },
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
    { 
      id: 3, 
      nome: "Filosofia Moderna", 
      subitens: ["Racionalismo (Descartes)", "Empirismo (Locke, Hume)", "Iluminismo: razão, progresso, liberdade (Voltaire, Rousseau, Montesquieu)", "Contratualismo: Hobbes, Locke e Rousseau"] 
    },
    { 
      id: 4, 
      nome: "Filosofia Contemporânea", 
      subitens: ["Karl Marx: crítica ao capitalismo, materialismo histórico ", "Nietzsche: crítica à moral cristã, vontade de poder, niilismo ", "Existencialismo: Sartre, liberdade e responsabilidade", "Escola de Frankfurt: crítica da razão instrumental, indústria cultural."] 
    },
    { 
      id: 5, 
      nome: "Filosofia Política", 
      subitens: ["Teorias do contrato social", "Democracia, cidadania, poder e Estado", "Justiça e equidade (Rawls, Amartya Sen)"] 
    },
    { 
      id: 6, 
      nome: "Ética e Moral", 
      subitens: ["Diferença entre ética e moral", "Ética kantiana: imperativo categórico", "Utilitarismo (Jeremy Bentham, John Stuart Mill)", "Bioética e dilemas morais contemporâneos"] 
    },
    { 
      id: 7, 
      nome: "Filosofia da Ciência", 
      subitens: ["Positivismo (Comte)", "Epistemologia: Popper (falseabilidade), Kuhn (paradigmas)", "Crítica ao cientificismo"] 
    },
    { 
      id: 8, 
      nome: "Filosofia Brasileira e Latino-americana", 
      subitens: ["Pensadores como Paulo Freire (educação e libertação)", "Sérgio Buarque de Holanda, Darcy Ribeiro", "Filosofia indígena e afro-brasileira"] 
    },
    { 
      id: 9, 
      nome: "Temas Transversais e Interdisciplinares", 
    subitens: ["Filosofia e linguagem", "Filosofia e arte", "Filosofia e tecnologia", "Filosofia e meio ambiente"] 
    },
  ];

  
  


  return (
    <MateriaTemplate
      voltarParaMain={voltarParaMain}
      navegarParaConteudo={navegarParaConteudo}
      titulo="Filosofia"
      itens={periodos}
   
    />
  );
};

export default Filosofia;