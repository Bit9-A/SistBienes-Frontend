import axiosInstance from "../utils/axiosInstance";

export interface User {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    dept_id: number;
    tipo_usuario: number;
    cedula: string;
    password?: string;
  }
// Obtener todos los usuarios
export const getUsers = async ():Promise<User[]> => {
  const response = await axiosInstance.get("/user");
  return response.data.users; 
};
export const createUser = async(userData: any) => {
  const response = await axiosInstance.post("/auth/register", userData);
  return response.data; // Devuelve el usuario creado
};
// Actualizar un usuario existente
export const updateUser = async (id: number, userData: any) => {
  const response = await axiosInstance.put(`/user/${id}`, userData);
  return response.data;
};
// Eliminar un usuario
export const deleteUser = async (id: number) => {
  const response = await axiosInstance.delete(`/user/${id}`);
  return response.data;
};

//Iniciar Sesión
export const login = async (userData: any) => {
  const response = await axiosInstance.post("/auth/login", userData);
  return response.data; // Devuelve el usuario creado
}