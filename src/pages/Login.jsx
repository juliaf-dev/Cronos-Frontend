// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import { login, register } from "../services/authServices";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Login() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👀 novo estado

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let data;

      if (isLogin) {
        data = await login({ email, senha });
      } else {
        const registerData = await register({ nome, email, senha });

        if (!registerData.ok) {
          throw new Error(registerData.message || "Erro no cadastro");
        }

        data = await login({ email, senha });
      }

      if (!data.ok) throw new Error(data.message || "Algo deu errado");

      const user = data.data?.user;
      if (user) {
        setUser(user);
        localStorage.setItem("userId", user.id);
        navigate("/main");
      } else {
        throw new Error("Usuário não retornado pela API");
      }
    } catch (err) {
      console.error("❌ Erro no login/cadastro:", err);
      setError(err.message || "Erro inesperado no login/cadastro");
    } finally {
      setLoading(false);
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

 <div className="form-group senha-group">
  <label>Senha</label>
  <div className="senha-wrapper">
    <input
      type={showPassword ? "text" : "password"}
      value={senha}
      onChange={(e) => setSenha(e.target.value)}
      required
    />
    <button
      type="button"
      className="toggle-senha"
      onClick={() => setShowPassword(!showPassword)}
    >
      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
    </button>
  </div>
</div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Carregando..." : isLogin ? "Entrar" : "Cadastrar"}
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
