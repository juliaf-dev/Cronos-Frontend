import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Perfil.css";

function Perfil() {
  const { user, setUser } = useAuth();
  const [nome, setNome] = useState(user?.nome || "");
  const [email, setEmail] = useState(user?.email || "");
  const [fotoUrl, setFotoUrl] = useState(user?.foto_url || "");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const salvarPerfil = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.put(
        "/api/auth/me",
        { nome, email, foto_url: fotoUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data.data);
      setMessage("✅ Perfil atualizado com sucesso!");
    } catch (err) {
      setMessage("❌ Erro ao atualizar perfil: " + (err.response?.data?.message || err.message));
    }
  };

  const alterarSenha = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.put(
        "/api/auth/me/password",
        { senhaAtual, novaSenha },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Senha alterada com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
    } catch (err) {
      setMessage("❌ Erro ao alterar senha: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="perfil-container">
      <h2>Meu Perfil</h2>

      {message && <p className="perfil-message">{message}</p>}

      <form onSubmit={salvarPerfil} className="perfil-form">
        <label>Nome</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} />

        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Foto de Perfil (URL)</label>
        <input value={fotoUrl} onChange={(e) => setFotoUrl(e.target.value)} />

        {fotoUrl && <img src={fotoUrl} alt="Foto do usuário" className="perfil-foto" />}

        <button type="submit">Salvar Perfil</button>
      </form>

      <h3>Alterar Senha</h3>
      <form onSubmit={alterarSenha} className="perfil-form">
        <label>Senha Atual</label>
        <input
          type="password"
          value={senhaAtual}
          onChange={(e) => setSenhaAtual(e.target.value)}
        />

        <label>Nova Senha</label>
        <input
          type="password"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
        />

        <button type="submit">Alterar Senha</button>
      </form>
    </div>
  );
}

export default Perfil;
