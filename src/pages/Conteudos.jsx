import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFileAlt, FaQuestionCircle } from 'react-icons/fa';
import '../css/conteudos.css';
import ChatAssistente from '../components/ChatAssistente';
import { API_BASE_URL } from '../config/config'; 

const Conteudo = ({ voltarParaMain }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const conteudo = location.state?.conteudo;

  const [conteudoGerado, setConteudoGerado] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarConteudo = async () => {
      if (!conteudo || !conteudo.nome) return;

      setCarregando(true);
      setErro(null);

      try {
        const [materia, topico] = conteudo.nome.split(' - ');

        const response = await axios.post(
          `${API_BASE_URL}/api/contents/generate`,
          {
            materia,
            topico
          }, 
          { withCredentials: true }
        );

        setConteudoGerado(response.data.body);
        
        // Se o conteúdo veio do cache, mostra uma mensagem sutil
        if (response.data.fromCache) {
          console.log('Conteúdo carregado do cache');
        }
      } catch (error) {
        console.error('Erro ao carregar conteúdo:', error);
        setErro('Erro ao carregar o conteúdo. Por favor, tente novamente.');
      } finally {
        setCarregando(false);
      }
    };

    carregarConteudo();
  }, [conteudo]);

  const irParaCriarResumo = () => {
    navigate('/criar-resumo', { 
      state: { 
        conteudo,
        conteudoGerado 
      } 
    });
  };

  const irParaQuiz = () => {
    navigate('/quiz', { 
      state: { 
        conteudo 
      } 
    });
  };

  if (!conteudo) {
    return (
      <div className="pagina-historica">
        <h2>Conteúdo não encontrado</h2>
        <p>Você precisa acessar essa página através da seleção de um conteúdo.</p>
        <button onClick={voltarParaMain} className="botao-voltar">← Voltar</button>
      </div>
    );
  }

  return (
    <div className="pagina-historica">
      <button onClick={voltarParaMain} className="botao-voltar">← Voltar</button>

      <h1>{conteudo.nome}</h1>

      <div className="conteudo-texto">
        {carregando ? (
          <p>Carregando conteúdo...</p>
        ) : erro ? (
          <p className="erro">{erro}</p>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: conteudoGerado }} />
        )}
      </div>

      <div className="acoes-conteudo">
        <button onClick={irParaCriarResumo} className="botao-criar-resumo">
          <FaFileAlt /> Criar Resumo
        </button>
        <button onClick={irParaQuiz} className="botao-quiz">
          <FaQuestionCircle /> Fazer Quiz
        </button>
      </div>

      <ChatAssistente materiaTopico={conteudo.nome} />
    </div>
  );
};

export default Conteudo;
