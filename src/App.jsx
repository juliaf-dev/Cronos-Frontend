// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./css/Main.css";

// 📄 Páginas
import Main from "./pages/Main";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Suporte from "./pages/Suporte";
import Conteudo from "./pages/Conteudos";
import Flashcards from "./pages/Flashcards";
import Quiz from "./pages/Quiz";
import CriarResumo from "./pages/CriarResumo";
import CriarFlashcard from "./pages/CriarFlashcard";
import ResumoView from "./components/ResumoView";
import FlashcardView from "./components/FlashcardsView";// <-- ✅ singular e caminho correto
import TopicosPage from "./pages/TopicosPage";
import Resumos from "./pages/Resumos";

// 📦 Componentes
import Header from "./components/Header";
import ChatAssistente from "./components/ChatAssistente";
import PrivateRoute from "./components/PrivateRoute";

// 🔑 Contexto de autenticação
import { useAuth } from "./context/AuthContext";

function AuthenticatedApp() {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const voltarParaMain = () => navigate("/main");
  const navegarParaMateria = (materia) => navigate(`/materia/${materia.id}`);

  return (
    <>
      <Header
        voltarParaMain={voltarParaMain}
        navegarParaMateria={navegarParaMateria}
        onLogout={handleLogout}
        user={user}
      />

      <ChatAssistente />

      <Routes>
        <Route path="/main" element={<Main navegarParaMateria={navegarParaMateria} />} />
        <Route path="/materia/:materiaId" element={<TopicosPage />} />
        <Route path="/conteudos/:subtopicoId" element={<Conteudo />} />

        {/* 📌 Flashcards */}
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/flashcards/materia/:materiaId" element={<FlashcardView />} /> {/* ✅ */}
        <Route path="/flashcards/:id" element={<FlashcardView />} />

        {/* 📌 Resumos */}
        <Route path="/resumos" element={<Resumos />} />
        <Route path="/resumos/:id" element={<ResumoView />} />

        <Route path="/quiz" element={<Quiz />} />
        <Route path="/criar-resumo" element={<CriarResumo />} />
        <Route path="/criar-flashcard" element={<CriarFlashcard />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/suporte" element={<Suporte />} />

        {/* fallback → manda para main */}
        <Route path="*" element={<Navigate to="/main" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <AuthenticatedApp />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
