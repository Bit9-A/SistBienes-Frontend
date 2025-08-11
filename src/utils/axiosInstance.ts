import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000, // Tiempo de espera de 10 segundos
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token a las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData && userData.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
        }
      }
    } catch (error) {
      console.error("Error al obtener token para la petición:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en la solicitud:", error);
    
    // Si el error es 401 (No autorizado), limpiar localStorage y redirigir al login
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/auth/sign-in";
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
