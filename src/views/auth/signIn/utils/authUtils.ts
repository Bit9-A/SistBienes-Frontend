import { login } from "../../../../api/UserApi";

// Función para manejar el inicio de sesión
export const handleLogin = async (email: string, password: string) => {
  try {
    const response = await login({ email, password });
    
    // Asegurarse de que la respuesta incluya el token
    if (response && response.token) {
      const userData = {
        ...response.user,
        token: response.token
      };
      
      // Guardar el usuario con token en localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } else {
      throw new Error("No se recibió un token válido del servidor.");
    }
  } catch (error: any) {
    // Personalizar el mensaje de error según la respuesta del backend
    if (error.response?.status === 401) {
      throw new Error("Correo o contraseña incorrectos.");
    }
    throw new Error("Error al iniciar sesión. Intenta de nuevo.");
  }
};

// Función para cerrar sesión
export const handleLogout = () => {
  localStorage.removeItem("user");
  window.location.href = "/auth/sign-in";
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = (): boolean => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      return userData && userData.token;
    }
    return false;
  } catch (error) {
    console.error("Error al verificar autenticación:", error);
    return false;
  }
};

// Función para obtener el token del usuario
export const getAuthToken = (): string | null => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      return userData?.token || null;
    }
    return null;
  } catch (error) {
    console.error("Error al obtener token:", error);
    return null;
  }
};
