import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
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
import Resumos from './pages/Resumos';
import Flashcards from './pages/Flashcards';
import Quiz from './pages/Quiz';
import CriarResumo from './pages/CriarResumo';
import { API_BASE_URL } from './config/config';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [materiaAtual, setMateriaAtual] = useState(null);

  const [paginaAtual, setPaginaAtual] = useState('main');
  const [conteudoSelecionado, setConteudoSelecionado] = useState(null);

  useEffect(() => {
    // Verificar autenticação ao carregar o app
    const checkAuth = async () => {
      try {
        const response =await fetch(`${API_BASE_URL}/api/auth/check`,{
          credentials: 'include' // Importante para enviar o cookie
        });
        const data = await response.json();
        
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          setUser(data.user);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      }
    };
    
    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`,{
        credentials: 'include' // Importante para enviar o cookie
      });
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Componente wrapper para as páginas autenticadas
  const AuthenticatedApp = () => {
    const navigate = useNavigate();

      const voltarParaMain = () => {
      setMateriaAtual(null);
      navigate('/main');
    };

    const navegarParaMateria = (materia) => {
  setMateriaAtual(materia.nome);
  const nomeNormalizado = materia.nome
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  navigate(`/materia/${nomeNormalizado}`);
};


    const navegarParaConteudo = (conteudo) => {
  setConteudoSelecionado(conteudo);  // atualiza o estado com o conteúdo selecionado
  const nomeMateria = materiaAtual
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  navigate(`/materia/${nomeMateria}/conteudo` , {
  state: { conteudo }, });
};


    return (
      <>
        <Header 
          voltarParaMain={voltarParaMain}
          navegarParaMateria={navegarParaMateria}
          onLogout={handleLogout}
          user={user}
        />
        <ChatAssistente/>
        <Routes>
          <Route path="/main" element={<Main navegarParaMateria={navegarParaMateria}  />} />
          <Route path="/materia/geografia" element={<Geografia voltarParaMain={voltarParaMain} navegarParaConteudo={navegarParaConteudo}/>} />
          <Route path="/materia/historia" element={<Historia voltarParaMain={voltarParaMain} navegarParaConteudo={navegarParaConteudo} />} />
          <Route path="/materia/filosofia" element={<Filosofia voltarParaMain={voltarParaMain} navegarParaConteudo={navegarParaConteudo}/>} />
          <Route path="/materia/sociologia" element={<Sociologia voltarParaMain={voltarParaMain} navegarParaConteudo={navegarParaConteudo}/>} />
          <Route path="/materia/:materiaNome/conteudo" element={<Conteudo voltarParaMain={voltarParaMain} />} />
          <Route path="/resumos" element={<Resumos />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/criar-resumo" element={<CriarResumo />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/evolucao" element={<Perfil />} />
          <Route path="/suporte" element={<Suporte />} />
          <Route path="*" element={<Navigate to="/main" replace />} />
        </Routes>
      </>
    );
  };

  const ConfirmEmailPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    useEffect(() => {
      const token = searchParams.get('token');
      const confirmar = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/confirm?token=${token}`);
          const data = await res.json();
          if (res.ok) {
            navigate('/?confirm=success');
          } else {
            navigate('/?confirm=fail');
          }
        } catch {
          navigate('/?confirm=fail');
        }
      };
      if (token) confirmar();
      else navigate('/?confirm=fail');
    }, [searchParams, navigate]);
    return <div>Confirmando e-mail...</div>;
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/confirmar" element={<ConfirmEmailPage />} />
          <Route path="/" element={isAuthenticated ? <Navigate to="/main" replace /> : <Login onLogin={handleLogin} />} />
          <Route path="/*" element={isAuthenticated ? <AuthenticatedApp /> : <Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;