import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL,
});

// Intercepteur pour ajouter automatiquement le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.dispatchEvent(new Event('authChange'));
      
      // Liste des routes publiques
      const publicRoutes = ['/login', '/register', '/accueil', '/'];
      const currentRoute = window.location.pathname;
      
      // Rediriger vers login UNIQUEMENT si sur une route privée
      if (!publicRoutes.includes(currentRoute)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

