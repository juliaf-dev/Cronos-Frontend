import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';

function Login({ onLogin }) {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://cronos-backend-1.onrender.com';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = isLogin 
        ? `${API_BASE_URL}/api/auth/login` 
        : `${API_BASE_URL}/api/auth/register`;
      
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : {
            username: formData.username || formData.email.split('@')[0],
            email: formData.email,
            password: formData.password
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      onLogin(data.user);
      navigate('/main');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose username"
                required
                minLength={3}
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isLogin ? 'Your password' : 'Create password (min 6 chars)'}
              minLength={6}
              required
            />
          </div>
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : isLogin ? 'Log In' : 'Register'}
          </button>
        </form>
        
        <p onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
        </p>
      </div>
    </div>
  );
}

export default Login;