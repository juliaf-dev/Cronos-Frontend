import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
      const body = isLogin ? { email, password } : { username: email.split('@')[0], email, password };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include' // Importante para receber o cookie
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Algo deu errado');
      }
      
      onLogin(data.user);
      navigate('/main');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isLogin ? 'Login' : 'Cadastro'}</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Nome de Usuário</label>
              <input 
                type="text" 
                value={email.split('@')[0]} 
                onChange={(e) => setEmail(e.target.value + '@exemplo.com')}
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
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="login-button">
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>
        <p className="toggle-form" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
        </p>
      </div>
    </div>
  );
}

export default Login;