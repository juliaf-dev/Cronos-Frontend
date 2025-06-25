import React, { useState, useEffect } from 'react';
import { FaTrash, FaArrowLeft, FaArrowRight, FaPlus, FaEdit } from 'react-icons/fa';
import '../css/FlashcardRandon.css';

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [flashcardAtual, setFlashcardAtual] = useState(0);
  const [mostrarResposta, setMostrarResposta] = useState(false);
  const [flashcardsRevisados, setFlashcardsRevisados] = useState({});
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [flashcardParaEditar, setFlashcardParaEditar] = useState(null);
  const [formData, setFormData] = useState({
    pergunta: '',
    resposta: '',
    materia: '',
    periodo: ''
  });

  useEffect(() => {
    const flashcardsSalvos = JSON.parse(localStorage.getItem('flashcards') || '[]');
    setFlashcards(flashcardsSalvos);
    const revisadosSalvos = JSON.parse(localStorage.getItem('flashcardsRevisados') || '{}');
    setFlashcardsRevisados(revisadosSalvos);
  }, []);

  const proximoFlashcard = () => {
    if (flashcardAtual < flashcards.length - 1) {
      setFlashcardAtual(flashcardAtual + 1);
      setMostrarResposta(false);
    }
  };

  const flashcardAnterior = () => {
    if (flashcardAtual > 0) {
      setFlashcardAtual(flashcardAtual - 1);
      setMostrarResposta(false);
    }
  };

  const marcarComoRevisado = (id) => {
    const novosRevisados = { ...flashcardsRevisados, [id]: true };
    setFlashcardsRevisados(novosRevisados);
    localStorage.setItem('flashcardsRevisados', JSON.stringify(novosRevisados));
  };

  const handleMostrarResposta = () => {
    setMostrarResposta(true);
    if (flashcards[flashcardAtual]) {
      const flashcardId = flashcards[flashcardAtual].id;
      marcarComoRevisado(flashcardId);
    }
  };

  const handleOcultarResposta = () => {
    setMostrarResposta(false);
  };

  const excluirFlashcard = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este flashcard?')) {
      const novosFlashcards = flashcards.filter(card => card.id !== id);
      setFlashcards(novosFlashcards);
      localStorage.setItem('flashcards', JSON.stringify(novosFlashcards));
      const novosRevisados = { ...flashcardsRevisados };
      delete novosRevisados[id];
      setFlashcardsRevisados(novosRevisados);
      localStorage.setItem('flashcardsRevisados', JSON.stringify(novosRevisados));
      if (flashcardAtual >= novosFlashcards.length) {
        setFlashcardAtual(Math.max(0, novosFlashcards.length - 1));
      }
    }
  };

  const salvarFlashcard = () => {
    if (!formData.pergunta.trim() || !formData.resposta.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    const novoFlashcard = {
      id: flashcardParaEditar ? flashcardParaEditar.id : Date.now(),
      pergunta: formData.pergunta,
      resposta: formData.resposta,
      materia: formData.materia,
      periodo: formData.periodo,
      dataCriacao: flashcardParaEditar ? flashcardParaEditar.dataCriacao : new Date().toISOString()
    };
    let novosFlashcards;
    if (flashcardParaEditar) {
      novosFlashcards = flashcards.map(f => f.id === flashcardParaEditar.id ? novoFlashcard : f);
    } else {
      novosFlashcards = [...flashcards, novoFlashcard];
    }
    setFlashcards(novosFlashcards);
    localStorage.setItem('flashcards', JSON.stringify(novosFlashcards));
    setMostrarFormulario(false);
    setFlashcardParaEditar(null);
    setFormData({ pergunta: '', resposta: '', materia: '', periodo: '' });
  };

  const editarFlashcard = (flashcard) => {
    setFlashcardParaEditar(flashcard);
    setFormData({
      pergunta: flashcard.pergunta,
      resposta: flashcard.resposta,
      materia: flashcard.materia || '',
      periodo: flashcard.periodo || ''
    });
    setMostrarFormulario(true);
  };

  const cancelarEdicao = () => {
    setMostrarFormulario(false);
    setFlashcardParaEditar(null);
    setFormData({ pergunta: '', resposta: '', materia: '', periodo: '' });
  };

  if (flashcards.length === 0) {
    return (
      <div className="flashcards-container">
        <div className="flashcards-header">
          <h1>Meus Flashcards</h1>
          <button onClick={() => setMostrarFormulario(true)} className="btn-adicionar">
            <FaPlus /> Novo Flashcard
          </button>
        </div>
        <p>Você ainda não possui flashcards cadastrados.</p>
        {mostrarFormulario && (
          <div className="formulario-flashcard">
            <h2>{flashcardParaEditar ? 'Editar Flashcard' : 'Novo Flashcard'}</h2>
            <div className="form-group">
              <label>Pergunta *</label>
              <textarea
                value={formData.pergunta}
                onChange={(e) => setFormData({...formData, pergunta: e.target.value})}
                placeholder="Digite a pergunta..."
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Resposta *</label>
              <textarea
                value={formData.resposta}
                onChange={(e) => setFormData({...formData, resposta: e.target.value})}
                placeholder="Digite a resposta..."
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Matéria</label>
              <input
                type="text"
                value={formData.materia}
                onChange={(e) => setFormData({...formData, materia: e.target.value})}
                placeholder="Ex: História, Geografia..."
              />
            </div>
            <div className="form-group">
              <label>Período</label>
              <input
                type="text"
                value={formData.periodo}
                onChange={(e) => setFormData({...formData, periodo: e.target.value})}
                placeholder="Ex: Pré-História, Idade Antiga..."
              />
            </div>
            <div className="form-actions">
              <button onClick={cancelarEdicao} className="btn-cancelar">
                Cancelar
              </button>
              <button onClick={salvarFlashcard} className="btn-salvar">
                {flashcardParaEditar ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const flashcardAtualObj = flashcards[flashcardAtual];
  const isRevisado = flashcardsRevisados[flashcardAtualObj.id];

  return (
    <div className="flashcards-container">
      <div className="flashcards-header">
        <h1>Meus Flashcards</h1>
        <button onClick={() => setMostrarFormulario(true)} className="btn-adicionar">
          <FaPlus /> Novo Flashcard
        </button>
      </div>
      {mostrarFormulario && (
        <div className="formulario-flashcard">
          <h2>{flashcardParaEditar ? 'Editar Flashcard' : 'Novo Flashcard'}</h2>
          <div className="form-group">
            <label>Pergunta *</label>
            <textarea
              value={formData.pergunta}
              onChange={(e) => setFormData({...formData, pergunta: e.target.value})}
              placeholder="Digite a pergunta..."
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Resposta *</label>
            <textarea
              value={formData.resposta}
              onChange={(e) => setFormData({...formData, resposta: e.target.value})}
              placeholder="Digite a resposta..."
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Matéria</label>
            <input
              type="text"
              value={formData.materia}
              onChange={(e) => setFormData({...formData, materia: e.target.value})}
              placeholder="Ex: História, Geografia..."
            />
          </div>
          <div className="form-group">
            <label>Período</label>
            <input
              type="text"
              value={formData.periodo}
              onChange={(e) => setFormData({...formData, periodo: e.target.value})}
              placeholder="Ex: Pré-História, Idade Antiga..."
            />
          </div>
          <div className="form-actions">
            <button onClick={cancelarEdicao} className="btn-cancelar">
              Cancelar
            </button>
            <button onClick={salvarFlashcard} className="btn-salvar">
              {flashcardParaEditar ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </div>
      )}
      <div className="flashcard-card">
        <div className="flashcard-progresso">
          {flashcardAtual + 1} de {flashcards.length}
        </div>
        <div className="flashcard-pergunta">
          <h3>Pergunta:</h3>
          <p>{flashcardAtualObj.pergunta}</p>
        </div>
        {mostrarResposta && (
          <div className="flashcard-resposta">
            <h3>Resposta:</h3>
            <p>{flashcardAtualObj.resposta}</p>
          </div>
        )}
        <div className="flashcard-info">
          {flashcardAtualObj.materia && <span className="materia">{flashcardAtualObj.materia}</span>}
          {flashcardAtualObj.periodo && <span className="periodo">{flashcardAtualObj.periodo}</span>}
          {isRevisado && <span className="revisado">✓ Revisado</span>}
        </div>
        <div className="flashcard-acoes">
          {!mostrarResposta ? (
            <button onClick={handleMostrarResposta} className="btn-ver-resposta">
              Ver Resposta
            </button>
          ) : (
            <div className="acoes-resposta">
              <button onClick={handleOcultarResposta} className="btn-ocultar-resposta">
                Ocultar Resposta
              </button>
              <button 
                onClick={() => marcarComoRevisado(flashcardAtualObj.id)}
                className={`btn-revisado ${isRevisado ? 'ativo' : ''}`}
              >
                ✓ {isRevisado ? 'Revisado' : 'Marcar como Revisado'}
              </button>
            </div>
          )}
          <button onClick={() => editarFlashcard(flashcardAtualObj)} className="btn-editar">
            <FaEdit />
          </button>
          <button onClick={() => excluirFlashcard(flashcardAtualObj.id)} className="btn-excluir">
            <FaTrash />
          </button>
        </div>
        <div className="flashcard-navegacao">
          <button 
            onClick={flashcardAnterior} 
            className="btn-navegacao"
            disabled={flashcardAtual === 0}
          >
            <FaArrowLeft /> Anterior
          </button>
          <button 
            onClick={proximoFlashcard} 
            className="btn-navegacao"
            disabled={flashcardAtual === flashcards.length - 1}
          >
            Próximo <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Flashcards; 