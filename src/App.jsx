import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './css/Main.css';
import Main from './pages/Main';
import Geografia from './pages/Materia/Geografia';
import Historia from './pages/Materia/Historia';
import Filosofia from './pages/Materia/Filosofia';
import Sociologia from './pages/Materia/Sociologia';
import Header from './components/Header';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import Suporte from './pages/Suporte';
import ChatAssistente from './components/ChatAssistente';
import Conteudo from './pages/Conteudos';
import { API_BASE_URL } from './config/config';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [materiaAtual, setMateriaAtual] = useState(null);
  const [conteudoSelecionado, setConteudoSelecionado] = useState(null);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/check`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) throw new Error('Falha na autenticação');
      
      const data = await response.json();
      setIsAuthenticated(data.isAuthenticated);
      setUser(data.user);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    }
  };

  useEffect(() => { 
    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const AuthenticatedApp = () => {
    const navigate = useNavigate();

    const navegarParaMateria = (materia) => {
      const nomeFormatado = materia.nome.toLowerCase().replace(/\s+/g, '-');
      setMateriaAtual(materia.nome);
      navigate(`/materia/${nomeFormatado}`);
    };

    const navegarParaConteudo = (conteudo) => {
      setConteudoSelecionado(conteudo);
      const nomeFormatado = materiaAtual.toLowerCase().replace(/\s+/g, '-');
      navigate(`/materia/${nomeFormatado}/conteudo`, { state: { conteudo } });
    };

    return (
      <>
        <Header 
          user={user} 
          onLogout={handleLogout}
          onNavigate={navegarParaMateria}
        />
        <ChatAssistente />
        <Routes>
          <Route path="/main" element={<Main onNavigate={navegarParaMateria} />} />
          <Route path="/materia/geografia" element={<Geografia onNavigate={navegarParaConteudo} />} />
          <Route path="/materia/historia" element={<Historia onNavigate={navegarParaConteudo} />} />
          <Route path="/materia/filosofia" element={<Filosofia onNavigate={navegarParaConteudo} />} />
          <Route path="/materia/sociologia" element={<Sociologia onNavigate={navegarParaConteudo} />} />
          <Route path="/perfil" element={<Perfil user={user} />} />
          <Route path="/suporte" element={<Suporte />} />
          <Route path="/materia/:materia/conteudo" element={<Conteudo data={conteudoSelecionado} />} />
          <Route path="*" element={<Navigate to="/main" replace />} />
        </Routes>
      </>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/main" /> : <Login onLogin={handleLogin} />} />
        <Route path="/*" element={isAuthenticated ? <AuthenticatedApp /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;