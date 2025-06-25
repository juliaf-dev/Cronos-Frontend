import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaQuestionCircle } from 'react-icons/fa';
import '../css/CriarResumo.css';

const CriarResumo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { conteudo, conteudoGerado, resumoParaEditar } = location.state || {};

  const [titulo, setTitulo] = useState('');
  const [conteudoResumo, setConteudoResumo] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (resumoParaEditar) {
      setTitulo(resumoParaEditar.titulo);
      setConteudoResumo(resumoParaEditar.conteudo);
    } else if (conteudo) {
      setTitulo(`${conteudo.nome} - Resumo`);
    }
  }, [resumoParaEditar, conteudo]);

  useEffect(() => {
    if (mensagemSucesso && !resumoParaEditar) {
      const timer = setTimeout(() => {
        irParaQuiz();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [mensagemSucesso, resumoParaEditar]);

  const handleSalvar = () => {
    if (!titulo.trim() || !conteudoResumo.trim()) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    setSalvando(true);
    
    const novoResumo = {
      id: resumoParaEditar ? resumoParaEditar.id : Date.now(),
      titulo,
      conteudo: conteudoResumo,
      materia: conteudo ? conteudo.nome.split(' - ')[0] : '',
      periodo: conteudo ? conteudo.nome.split(' - ')[1] : '',
      dataCriacao: resumoParaEditar ? resumoParaEditar.dataCriacao : new Date().toISOString(),
      dataModificacao: new Date().toISOString()
    };

    // Salvar no localStorage
    const resumosExistentes = JSON.parse(localStorage.getItem('resumos') || '[]');
    let novosResumos;
    
    if (resumoParaEditar) {
      novosResumos = resumosExistentes.map(r => r.id === resumoParaEditar.id ? novoResumo : r);
    } else {
      novosResumos = [...resumosExistentes, novoResumo];
    }

    localStorage.setItem('resumos', JSON.stringify(novosResumos));

    setMensagemSucesso(resumoParaEditar ? 'Resumo atualizado com sucesso!' : 'Resumo salvo com sucesso! Redirecionando para questões...');
    setSalvando(false);
  };

  const irParaQuiz = () => {
    navigate('/quiz', { 
      state: { 
        conteudo 
      } 
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

  if (!conteudo && !resumoParaEditar) {
    return (
      <div className="criar-resumo-container">
        <h2>Nenhum conteúdo selecionado</h2>
        <p>Você precisa acessar essa página através de um conteúdo.</p>
        <button onClick={voltarParaMain} className="botao-voltar">
          <FaArrowLeft /> Voltar ao Início
        </button>
      </div>
    );
  }

  return (
    <div className="criar-resumo-container">
      <div className="criar-resumo-header">
        <button onClick={voltarParaConteudo} className="botao-voltar">
          <FaArrowLeft /> Voltar
        </button>
        <h1>{resumoParaEditar ? 'Editar Resumo' : 'Criar Novo Resumo'}</h1>
      </div>

      {mensagemSucesso && (
        <div className="mensagem-sucesso">
          {mensagemSucesso}
        </div>
      )}

      <div className="formulario-resumo">
        <div className="form-group">
          <label>Título do Resumo</label>
          <input
            type="text"
            placeholder="Digite o título do resumo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="input-titulo"
            disabled={salvando}
          />
        </div>

        <div className="form-group">
          <label>Conteúdo do Resumo</label>
          <textarea 
            placeholder="Digite seu resumo aqui..." 
            rows="15"
            value={conteudoResumo}
            onChange={(e) => setConteudoResumo(e.target.value)}
            disabled={salvando}
            className="textarea-conteudo"
          />
        </div>

        {conteudoGerado && (
          <div className="conteudo-original">
            <h3>Conteúdo Original para Referência:</h3>
            <div 
              className="conteudo-texto"
              dangerouslySetInnerHTML={{ __html: conteudoGerado }}
            />
          </div>
        )}

        <div className="acoes">
          <button onClick={voltarParaConteudo} disabled={salvando} className="btn-voltar">
            <FaArrowLeft /> Voltar
          </button>
          
          <button 
            onClick={handleSalvar} 
            className="btn-salvar"
            disabled={salvando}
          >
            <FaSave /> {salvando ? 'Salvando...' : resumoParaEditar ? 'Salvar Alterações' : 'Salvar Resumo'}
          </button>
          
          {!resumoParaEditar && (
            <button 
              onClick={irParaQuiz} 
              className="btn-ir-questoes"
              disabled={salvando}
            >
              <FaQuestionCircle /> Ir para Questões
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CriarResumo; 