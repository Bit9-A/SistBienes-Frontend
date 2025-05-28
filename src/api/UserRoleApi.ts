import axiosInstance from "../utils/axiosInstance";

export interface UserRole {
    id: number;
    nombre: string;
    }

// Obtener todos los roles de usuario
export const getUserRoles = async (): Promise<UserRole[]> => {
    const response = await axiosInstance.get("/user_role");
    return response.data.roles; // Asegúrate de que la respuesta tenga esta estructura
  };
// Crear un nuevo rol de usuario    
export const createUserRole = async (data: UserRole): Promise<UserRole> => {
    const response = await axiosInstance.post("/user_role", data);
    return response.data; // Devuelve el rol de usuario creado
  }
// Actualizar un rol de usuario existente
export const updateUserRole = async (id: number, data: UserRole): Promise<UserRole> => {
    const response = await axiosInstance.put(`/user_role/${id}`, data);
    return response.data; // Devuelve el rol de usuario actualizado
  }
// Eliminar un rol de usuario existente
export const deleteUserRole = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/user_role/${id}`);
  }
//   return response.data; // Devuelve el rol de usuario eliminado

// };

// Obtener un rol de usuario por su id
export const getUserRoleById = async (id: number): Promise<UserRole> => {
    const response = await axiosInstance.get(`/user_role/${id}`);
    console.log(response.data);
    return response.data; // Asegúrate de que la respuesta tenga esta estructura
  }


