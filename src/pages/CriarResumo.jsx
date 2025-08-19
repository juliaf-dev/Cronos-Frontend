// src/pages/CriarResumo.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config/config';
import '../css/CriarResumo.css';

function CriarResumo() {
  const navigate = useNavigate();
  const location = useLocation();
  const conteudoState = location.state?.conteudo;
  const vindoDoConteudo = !!conteudoState;

  const [materiasDisponiveis, setMateriasDisponiveis] = useState([]);
  const [materiaSelecionada, setMateriaSelecionada] = useState({ id: null, nome: '' });
  const [titulo, setTitulo] = useState('');
  const [corpo, setCorpo] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('accessToken');

  /**
   * Quando vem de um conteúdo → busca a matéria vinculada
   */
  useEffect(() => {
    if (!vindoDoConteudo || !conteudoState) return;

    setTitulo(conteudoState.tituloSugerido || '');
    setCorpo('');

    const carregarMateria = async () => {
      try {
        let url = null;
        let headers = {};

        if (conteudoState.materiaId) {
          url = `${API_BASE_URL}/api/materias/${conteudoState.materiaId}`;
          headers = { Authorization: `Bearer ${token}` };
        } else if (conteudoState.subtopicoId) {
          url = `${API_BASE_URL}/api/subtopicos/${conteudoState.subtopicoId}/materia`;
        }

        if (!url) return console.warn('⚠️ Nenhum ID de matéria ou subtopico fornecido no conteúdo.');

        const response = await fetch(url, { headers });
        const data = await response.json();

        if (!response.ok || !data.ok) throw new Error(data.message || 'Erro ao carregar a matéria vinculada');

        setMateriaSelecionada({
          id: data.data.id || data.data.materia_id,
          nome: data.data.nome || data.data.nome_materia || 'Matéria'
        });
      } catch (err) {
        console.error('❌ Erro ao carregar a matéria vinculada:', err);
        setError('Erro ao carregar a matéria vinculada.');
      }
    };

    carregarMateria();
  }, [vindoDoConteudo, conteudoState, token]);

  /**
   * Carrega todas as matérias (quando não vem de conteúdo)
   */
  useEffect(() => {
    if (vindoDoConteudo) return;

    const fetchMaterias = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/materias`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (!response.ok || !data.ok) throw new Error(data.message || 'Erro ao carregar matérias');

        setMateriasDisponiveis(data.data);
      } catch (err) {
        console.error('❌ Erro ao buscar todas matérias:', err);
        setError('Erro ao carregar matérias.');
      }
    };

    fetchMaterias();
  }, [vindoDoConteudo, token]);

  /**
   * Salvar resumo
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!titulo || !corpo || !materiaSelecionada.id) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const resumoPayload = {
        materia_id: materiaSelecionada.id,
        ...(conteudoState?.id && { conteudo_id: conteudoState.id }),
        titulo,
        corpo
      };

      const response = await fetch(`${API_BASE_URL}/api/resumos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(resumoPayload),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.message || 'Erro ao criar resumo');

      setMessage('Resumo criado com sucesso!');

      setTimeout(() => {
        if (vindoDoConteudo) {
          // 🚀 Navega para o quiz já com resumo e conteudo padronizado
          navigate('/quiz', {
            state: {
              resumo: data.data, // {id, materia_id, titulo, corpo}
              conteudo: {
                conteudo_id: conteudoState.id,
                materia_id: conteudoState.materia_id,
                topico_id: conteudoState.topico_id,
                subtopico_id: conteudoState.subtopico_id,
                titulo: conteudoState.titulo || conteudoState.subtopico_nome,
              },
            },
          });
        } else {
          navigate('/resumos');
        }
      }, 1000);
    } catch (err) {
      console.error('❌ Erro ao salvar resumo:', err);
      setError(err.message || 'Erro ao criar resumo.');
    }
  };

  return (
    <div className="criar-resumo-container">
      <h2>{vindoDoConteudo ? 'Criar Resumo do Conteúdo' : 'Criar Novo Resumo'}</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Título */}
        <div className="form-group">
          <label htmlFor="titulo">Título:</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        {/* Matéria */}
        {!vindoDoConteudo ? (
          <div className="form-group">
            <label htmlFor="materia">Matéria:</label>
            <select
              id="materia"
              value={materiaSelecionada.id || ''}
              onChange={(e) => {
                const materiaId = Number(e.target.value);
                const materia = materiasDisponiveis.find(m => m.id === materiaId);
                setMateriaSelecionada(materia || { id: null, nome: '' });
              }}
              required
            >
              <option value="">Selecione uma matéria</option>
              {materiasDisponiveis.map((mat) => (
                <option key={mat.id} value={mat.id}>
                  {mat.nome}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="materia">Matéria:</label>
            <input
              type="text"
              id="materia"
              value={materiaSelecionada.nome || 'Carregando...'}
              readOnly
            />
          </div>
        )}

        {/* Corpo */}
        <div className="form-group">
          <label htmlFor="corpo">Corpo do Resumo:</label>
          <textarea
            id="corpo"
            value={corpo}
            onChange={(e) => setCorpo(e.target.value)}
            rows="12"
            required
          ></textarea>
        </div>

        {/* Ações */}
        <div className="form-actions">
          <button type="submit" className="btn-salvar">Salvar Resumo</button>
          <button type="button" onClick={() => navigate(-1)} className="btn-cancelar">Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default CriarResumo;
