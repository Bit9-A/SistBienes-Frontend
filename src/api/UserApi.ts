import axiosInstance from "../utils/axiosInstance"

export interface User {
  id: number
  nombre: string
  apellido: string
  email: string
  telefono?: string
  dept_id: number
  tipo_usuario: number
  cedula: string
  password?: string
  isActive?: number
  username: string
  nombre_completo?: string // Agregamos este campo
}

export interface UserProfile {
  id: number
  tipo_usuario: number
  nombre?: string
  apellido?: string
  email?: string
  telefono?: string
  dept_id?: number
  dept_nombre?: string
  cedula?: string
  username?: string
  password?: string
  nombre_completo?: string // Agregamos este campo
}


// Obtener todos los usuarios
export const getUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get("/user")
  if (!response.data || !response.data.users) {
    throw new Error("No se encontraron usuarios")
  }
  return response.data.users
}

export const createUser = async (userData: any) => {
  const response = await axiosInstance.post("/auth/register", userData)
  return response.data // Devuelve el usuario creado
}

// Actualizar un usuario existente
export const updateUser = async (id: number, userData: any) => {
  const response = await axiosInstance.put(`/user/${id}`, userData)
  return response.data
}

// Eliminar un usuario
export const deleteUser = async (id: number) => {
  const response = await axiosInstance.delete(`/user/${id}`)
  return response.data
}

//Iniciar Sesión
export const login = async (userData: any) => {
  const response = await axiosInstance.post("/auth/login", userData)
  return response.data // Devuelve el usuario creado
}

// Cerrar Sesión
export const logout = async () => {
  const user = localStorage.getItem("user");
  let token = null;
  if (user) {
    try {
      token = JSON.parse(user).token;
    } catch { }
  }
  const headers = token
    ? { Authorization: `Bearer ${token}` }
    : {};
  const response = await axiosInstance.post("/auth/logout", {}, { headers });
  return response.data; // Devuelve la respuesta de cierre de sesión
};

// Obtener el profile del usuario
export const getProfile = async (): Promise<UserProfile> => {
  const response = await axiosInstance.get("/auth/profile")
  return response.data.user
}

//Obtener jefe de departamento
export const getDepartmentJefe = async (deptId: number): Promise<UserProfile | null> => {
  try {
    const response = await axiosInstance.get(`/user/jefe/${deptId}`)
    return response.data.jefe || null
  } catch (error) {
    console.error("Error al obtener el jefe de departamento:", error)
    return null
  }
}
