import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaArrowLeft } from 'react-icons/fa';
import '../css/ResumoAtalhos.css';

const Resumos = () => {
  const [resumos, setResumos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [resumoParaEditar, setResumoParaEditar] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    materia: '',
    periodo: ''
  });
  const navigate = useNavigate();

  // Carregar resumos do localStorage
  useEffect(() => {
    const resumosSalvos = JSON.parse(localStorage.getItem('resumos') || '[]');
    setResumos(resumosSalvos);
  }, []);

  const salvarResumo = () => {
    if (!formData.titulo.trim() || !formData.conteudo.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const novoResumo = {
      id: resumoParaEditar ? resumoParaEditar.id : Date.now(),
      titulo: formData.titulo,
      conteudo: formData.conteudo,
      materia: formData.materia,
      periodo: formData.periodo,
      dataCriacao: resumoParaEditar ? resumoParaEditar.dataCriacao : new Date().toISOString(),
      dataModificacao: new Date().toISOString()
    };

    let novosResumos;
    if (resumoParaEditar) {
      novosResumos = resumos.map(r => r.id === resumoParaEditar.id ? novoResumo : r);
    } else {
      novosResumos = [...resumos, novoResumo];
    }

    setResumos(novosResumos);
    localStorage.setItem('resumos', JSON.stringify(novosResumos));
    
    setMostrarFormulario(false);
    setResumoParaEditar(null);
    setFormData({ titulo: '', conteudo: '', materia: '', periodo: '' });
  };

  const editarResumo = (resumo) => {
    setResumoParaEditar(resumo);
    setFormData({
      titulo: resumo.titulo,
      conteudo: resumo.conteudo,
      materia: resumo.materia || '',
      periodo: resumo.periodo || ''
    });
    setMostrarFormulario(true);
  };

  const excluirResumo = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este resumo?')) {
      const novosResumos = resumos.filter(resumo => resumo.id !== id);
      setResumos(novosResumos);
      localStorage.setItem('resumos', JSON.stringify(novosResumos));
    }
  };

  const cancelarEdicao = () => {
    setMostrarFormulario(false);
    setResumoParaEditar(null);
    setFormData({ titulo: '', conteudo: '', materia: '', periodo: '' });
  };

  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="resumos-container">
      <div className="resumos-header">
        <button onClick={() => navigate('/main')} className="btn-voltar">
          <FaArrowLeft /> Voltar
        </button>
        <h1>Meus Resumos</h1>
        <button 
          onClick={() => setMostrarFormulario(true)} 
          className="btn-adicionar"
        >
          <FaPlus /> Novo Resumo
        </button>
      </div>

      {mostrarFormulario && (
        <div className="formulario-resumo">
          <h2>{resumoParaEditar ? 'Editar Resumo' : 'Novo Resumo'}</h2>
          
          <div className="form-group">
            <label>Título *</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              placeholder="Digite o título do resumo"
            />
          </div>

          <div className="form-group">
            <label>Matéria</label>
            <select
              value={formData.materia}
              onChange={(e) => setFormData({...formData, materia: e.target.value})}
            >
              <option value="">Selecione uma matéria</option>
              <option value="História">História</option>
              <option value="Geografia">Geografia</option>
              <option value="Filosofia">Filosofia</option>
              <option value="Sociologia">Sociologia</option>
            </select>
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

          <div className="form-group">
            <label>Conteúdo *</label>
            <textarea
              value={formData.conteudo}
              onChange={(e) => setFormData({...formData, conteudo: e.target.value})}
              placeholder="Digite o conteúdo do resumo..."
              rows="10"
            />
          </div>

          <div className="form-actions">
            <button onClick={cancelarEdicao} className="btn-cancelar">
              Cancelar
            </button>
            <button onClick={salvarResumo} className="btn-salvar">
              {resumoParaEditar ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </div>
      )}

      <div className="resumos-lista">
        {resumos.length === 0 ? (
          <div className="sem-resumos">
            <p>Você ainda não tem resumos criados.</p>
            <button onClick={() => setMostrarFormulario(true)} className="btn-adicionar">
              <FaPlus /> Criar Primeiro Resumo
            </button>
          </div>
        ) : (
          resumos.map(resumo => (
            <div key={resumo.id} className="resumo-card">
              <div className="resumo-header">
                <h3>{resumo.titulo}</h3>
                <div className="resumo-acoes">
                  <button onClick={() => editarResumo(resumo)} className="btn-editar">
                    <FaEdit />
                  </button>
                  <button onClick={() => excluirResumo(resumo.id)} className="btn-excluir">
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="resumo-info">
                {resumo.materia && <span className="materia">{resumo.materia}</span>}
                {resumo.periodo && <span className="periodo">{resumo.periodo}</span>}
                <span className="data">Criado em: {formatarData(resumo.dataCriacao)}</span>
              </div>
              
              <div className="resumo-conteudo">
                <p>{resumo.conteudo.substring(0, 200)}...</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Resumos; 