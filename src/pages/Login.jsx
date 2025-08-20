// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import { login, register } from "../services/authServices";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const navigate = useNavigate();
  const { setUser } = useAuth(); // contexto global

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let data;

      if (isLogin) {
        data = await login({ email, senha });
      } else {
        data = await register({ nome, email, senha });
      }

      console.log("🔐 LOGIN DATA:", data);

      if (!data.ok) throw new Error(data.message || "Algo deu errado");

      // pega user dentro de data.data
      const user = data.data?.user;

      if (user) {
        // salva no contexto e no localStorage apenas o userId
        setUser(user);
        localStorage.setItem("userId", user.id);
      } else {
        throw new Error("Usuário não retornado pela API");
      }

      // redireciona para página inicial do aluno
      navigate("/main");
    } catch (err) {
      console.error("❌ Erro no login:", err);
      setError(err.message || "Erro inesperado no login");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isLogin ? "Login" : "Cadastro"}</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            {isLogin ? "Entrar" : "Cadastrar"}
          </button>
        </form>

        <p className="toggle-form" onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Não tem uma conta? Cadastre-se"
            : "Já tem uma conta? Faça login"}
        </p>
      </div>
    </div>
  );
}

export default Login;
