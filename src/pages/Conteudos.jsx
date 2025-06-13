import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../css/conteudos.css';
import ChatAssistente from '../components/ChatAssistente';
import { API_BASE_URL } from '../config/config'; 

const Conteudo = ({ voltarParaMain }) => {
  const location = useLocation();
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

      <button className="botao-criar-resumo">Criar Resumo</button>

      <ChatAssistente materiaTopico={conteudo.nome} />
    </div>
  );
};

export default Conteudo;
