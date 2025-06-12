// Adicione no topo do arquivo
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Atualize a função checkAuth para lidar melhor com erros CORS
const checkAuth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/check`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest' // Ajuda com alguns proxies
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.isAuthenticated) {
      setIsAuthenticated(true);
      setUser(data.user);
    }
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    // Mostra feedback visual se o erro for de CORS
    if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
      alert(`Erro de conexão com o servidor. Verifique se você está acessando de um domínio permitido: ${API_BASE_URL}`);
    }
  }
};

// Atualize a função handleLogout
const handleLogout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    setIsAuthenticated(false);
    setUser(null);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};