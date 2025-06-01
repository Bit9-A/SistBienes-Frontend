import { login,logout } from "../../../../api/UserApi";
import { useToast } from "@chakra-ui/react";

// Función para manejar el inicio de sesión
export const handleLogin = async (username: string, password: string) => {
  try {
    const response = await login({ username, password });

    if (response && response.token) {
      const userData = {
        ...response.user,
        token: response.token
      };
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } else {
      throw new Error("No se recibió un token válido del servidor.");
    }
  } catch (error: any) {
    // Captura el mensaje del backend si existe
    const backendMsg =
      error?.response?.data?.message ||
      error?.response?.data?.msg ||
      error?.message ||
      "Error al iniciar sesión. Intenta de nuevo.";
    throw new Error(backendMsg);
  }
};

// Función para cerrar sesión
export const handleLogout = async () => {
  const toast = useToast();
  try {
    await logout();
  } catch (e) {
    console.error("Error al cerrar sesión:", e);
  }
  localStorage.removeItem("user");
  if (window.location.pathname !== "/auth/sign-in") {
  window.location.href = "/auth/sign-in";
}
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
