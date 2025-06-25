import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaPlus, FaArrowLeft, FaCheck, FaTimes } from 'react-icons/fa';
import { gerarQuestoesQuiz } from '../services/geminiService';
import '../css/Quiz.css';

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const conteudo = location.state?.conteudo;
  
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [respostasUsuario, setRespostasUsuario] = useState([]);
  const [questoes, setQuestoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarAlternativas, setMostrarAlternativas] = useState(false);

  useEffect(() => {
    const carregarQuestoes = async () => {
      if (!conteudo) {
        setErro('Nenhum conteúdo selecionado para gerar questões.');
        setCarregando(false);
        return;
      }

      setCarregando(true);
      try {
        const [materia, topico] = conteudo.nome.split(' - ');
        const questoesGeradas = await gerarQuestoesQuiz(materia, topico, 5);
        
        const questoesFormatadas = questoesGeradas.map(q => ({
          pergunta: q.pergunta,
          opcoes: q.opcoes,
          respostaCorreta: q.respostaCorreta,
          explicacao: q.explicacao
        }));
        
        setQuestoes(questoesFormatadas);
        setRespostasUsuario(Array(questoesFormatadas.length).fill(null));
        setErro(null);
      } catch (error) {
        console.error('Erro ao carregar questões:', error);
        setErro('Erro ao carregar as questões. Por favor, tente novamente.');
      } finally {
        setCarregando(false);
      }
    };

    carregarQuestoes();
  }, [conteudo]);

  const selecionarResposta = (opcaoIndex) => {
    if (respostaSelecionada !== null) return;
    
    setRespostaSelecionada(opcaoIndex);
    
    const novasRespostas = [...respostasUsuario];
    novasRespostas[questaoAtual] = opcaoIndex;
    setRespostasUsuario(novasRespostas);

    if (opcaoIndex === questoes[questaoAtual].respostaCorreta) {
      setPontuacao(pontuacao + 1);
    }
  };

  const irParaProximaQuestao = () => {
    if (respostaSelecionada === null) {
      alert('Por favor, selecione uma resposta antes de continuar.');
      return;
    }

    if (questaoAtual === questoes.length - 1) {
      setMostrarResultado(true);
    } else {
      setQuestaoAtual(questaoAtual + 1);
      setRespostaSelecionada(null);
      setMostrarAlternativas(false);
    }
  };

  const voltarQuestao = () => {
    if (questaoAtual > 0) {
      setQuestaoAtual(questaoAtual - 1);
      setRespostaSelecionada(respostasUsuario[questaoAtual - 1]);
      setMostrarAlternativas(false);
    }
  };

  const reiniciarQuiz = () => {
    setQuestaoAtual(0);
    setPontuacao(0);
    setMostrarResultado(false);
    setRespostaSelecionada(null);
    setRespostasUsuario(Array(questoes.length).fill(null));
    setMostrarAlternativas(false);
  };

  const salvarParaFlashcard = () => {
    const questaoAtualObj = questoes[questaoAtual];
    
    // Extrai a matéria e período do nome do conteúdo
    const partesConteudo = conteudo.nome.split(' - ');
    const materia = partesConteudo[0] || 'História'; // Fallback para História se não conseguir extrair
    const periodo = partesConteudo[1] || '';
    
    // Log para debug - mostra como o conteúdo está sendo processado
    console.log('Conteúdo original:', conteudo.nome);
    console.log('Partes extraídas:', partesConteudo);
    console.log('Matéria extraída:', materia);
    console.log('Período extraído:', periodo);
    
    const novoFlashcard = {
      id: Date.now(),
      pergunta: questaoAtualObj.pergunta,
      resposta: questaoAtualObj.opcoes[questaoAtualObj.respostaCorreta],
      materia: materia,
      periodo: periodo,
      dataCriacao: new Date().toISOString()
    };

    // Salva no localStorage
    const flashcardsExistentes = JSON.parse(localStorage.getItem('flashcards') || '[]');
    flashcardsExistentes.push(novoFlashcard);
    localStorage.setItem('flashcards', JSON.stringify(flashcardsExistentes));

    // Mostra mensagem de confirmação com a matéria
    alert(`Questão salva como flashcard na pasta "${materia}"!`);
    
    // Log para debug
    console.log('Flashcard salvo:', {
      materia: materia,
      periodo: periodo,
      pergunta: questaoAtualObj.pergunta.substring(0, 50) + '...',
      flashcardCompleto: novoFlashcard
    });
  };

  const voltarParaConteudo = () => {
    navigate('/materia/' + conteudo.nome.split(' - ')[0].toLowerCase() + '/conteudo', {
      state: { conteudo }
    });
  };

  const voltarParaMain = () => {
    navigate('/main');
  };

  if (carregando) {
    return (
      <div className="quiz-container">
        <div className="quiz-loading">
          <h2>Gerando questões...</h2>
          <p>Aguarde enquanto preparamos seu quiz personalizado.</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="quiz-container">
        <div className="quiz-error">
          <h2>Erro</h2>
          <p>{erro}</p>
          <button onClick={voltarParaConteudo} className="btn-voltar">
            <FaArrowLeft /> Voltar ao Conteúdo
          </button>
        </div>
      </div>
    );
  }

  if (mostrarResultado) {
    const porcentagem = Math.round((pontuacao / questoes.length) * 100);
    const mensagem = porcentagem >= 80 ? 'Excelente!' : 
                    porcentagem >= 60 ? 'Bom trabalho!' : 
                    porcentagem >= 40 ? 'Continue estudando!' : 'Precisa revisar mais!';

    return (
      <div className="quiz-container">
        <div className="quiz-resultado">
          <h1>Resultado do Quiz</h1>
          <div className="resultado-info">
            <h2>{mensagem}</h2>
            <p>Você acertou {pontuacao} de {questoes.length} questões</p>
            <div className="porcentagem">{porcentagem}%</div>
          </div>
          
          <div className="resultado-acoes">
            <button onClick={reiniciarQuiz} className="btn-reiniciar">
              Tentar Novamente
            </button>
            <button onClick={voltarParaConteudo} className="btn-voltar">
              <FaArrowLeft /> Voltar ao Conteúdo
            </button>
            <button onClick={voltarParaMain} className="btn-main">
              Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    );
  }

  const questao = questoes[questaoAtual];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button onClick={voltarParaConteudo} className="btn-voltar">
          <FaArrowLeft /> Voltar
        </button>
        <h1>Quiz: {conteudo?.nome}</h1>
      </div>

      <div className="questao">
        <div className="progresso">
          Questão {questaoAtual + 1} de {questoes.length}
        </div>
        
        <h2>{questao.pergunta}</h2>
        
        {!mostrarAlternativas ? (
          <div className="container-botao-alternativas">
            <button 
              className="btn-mostrar-alternativas"
              onClick={() => setMostrarAlternativas(true)}
            >
              Ver Alternativas
            </button>
          </div>
        ) : (
          <>
            <div className="opcoes">
              {questao.opcoes.map((opcao, index) => {
                const isSelecionada = respostaSelecionada === index;
                const isCorreta = index === questao.respostaCorreta;
                
                let classeAlternativa = 'opcao';
                if (respostaSelecionada !== null) {
                  if (isSelecionada) {
                    classeAlternativa = isCorreta ? 'opcao correta' : 'opcao incorreta';
                  } else {
                    classeAlternativa = 'opcao disabled';
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => selecionarResposta(index)}
                    className={classeAlternativa}
                    disabled={respostaSelecionada !== null}
                  >
                    {opcao}
                    {respostaSelecionada !== null && (
                      <span className="icone-resposta">
                        {isSelecionada ? (
                          isCorreta ? <FaCheck /> : <FaTimes />
                        ) : isCorreta ? <FaCheck /> : null}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            
            {respostaSelecionada !== null && (
              <div className="explicacao-resposta">
                <h3>Explicação:</h3>
                <p>{questao.explicacao}</p>
              </div>
            )}
            
            <div className="navegacao-questoes">
              <button 
                onClick={voltarQuestao} 
                className="btn-navegacao"
                disabled={questaoAtual === 0}
              >
                ← Anterior
              </button>
              
              {respostaSelecionada !== null && (
                <button 
                  className="btn-salvar-flashcard"
                  onClick={salvarParaFlashcard}
                >
                  <FaPlus /> Adicionar aos Flashcards
                </button>
              )}
              
              <button 
                onClick={irParaProximaQuestao} 
                className="btn-navegacao"
              >
                {questaoAtual === questoes.length - 1 ? 'Ver Resultado' : 'Próxima →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz; 