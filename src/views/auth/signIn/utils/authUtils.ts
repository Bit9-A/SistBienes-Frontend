import { login } from "../../../../api/UserApi";

/**
 * Inicia sesión con el backend.
 * @param email Correo del usuario
 * @param password Contraseña del usuario
 * @returns Usuario autenticado o lanza error si falla
 */
export const handleLogin = async (email: string, password: string) => {
  try {
    const user = await login({ email, password });
    // Puedes guardar el usuario/token en localStorage aquí si lo necesitas
    // localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (error: any) {
    // Puedes personalizar el mensaje de error según la respuesta del backend
    if (error.response?.status === 401) {
      throw new Error("Correo o contraseña incorrectos.");
    }
    throw new Error("Error al iniciar sesión. Intenta de nuevo.");
  }
};