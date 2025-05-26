import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/conteudos.css';
import { gerarConteudoMateria } from '../services/geminiService';
import ChatAssistente from '../components/ChatAssistente';

const Conteudo = ({ voltarParaMain }) => {
  const location = useLocation();
  const conteudo = location.state?.conteudo;

  const [conteudoGerado, setConteudoGerado] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregarConteudo = async () => {
      if (!conteudo || !conteudo.nome) return;

      setCarregando(true);
      try {
        const [materia, topico] = conteudo.nome.split(' - ');
        const texto = await gerarConteudoMateria(materia, topico);
        setConteudoGerado(texto);
      } catch (error) {
        console.error('Erro ao carregar conteúdo:', error);
        setConteudoGerado('Erro ao carregar o conteúdo. Por favor, tente novamente.');
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
      <button onClick={voltarParaMain} className="botao-voltar">
        ← Voltar
      </button>

      <h1>{conteudo.nome}</h1>

      <div className="conteudo-texto">
        {carregando ? (
          <p>Carregando conteúdo...</p>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: conteudoGerado }} />
        )}
      </div>

      <button className="botao-criar-resumo">
        Criar Resumo
      </button>

      <ChatAssistente materiaTopico={conteudo.nome} />
    </div>
  );
};

export default Conteudo;