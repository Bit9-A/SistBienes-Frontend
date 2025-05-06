import axiosInstance from "../utils/axiosInstance";

export interface MovableAsset {
    id: number;
    numero_identificacion: string;
    nombre_descripcion: string;
    numero_serial: string;
    grupo: number;
    subgrupo: string;
    cantidad: number;
    descripcion: string;
    marca_id: number ;
    modelo_id: number;
    valor_unitario: number;
    valor_total: number;
    fecha: string;
    departamento: number;
    id_estado: number;
    id_Parroquia: number;
}

// Obtener todos los activos
export const getAssets = async (): Promise<MovableAsset[]> => {
    try {
        const response = await axiosInstance.get('/furniture');
        return response.data.furniture; // Asegúrate de que la respuesta tenga esta estructura
    } catch (error) {
        console.error('Error fetching assets:', error);
        throw error;
    }   
}

// Crear un nuevo activo
export const createAsset = async (assetData: MovableAsset) => {
    try {
        const response = await axiosInstance.post('/furniture', assetData);
        return response.data; // Devuelve el activo creado
    } catch (error) {
        console.error('Error creating asset:', error);
        throw error;
    } 
}
// Actualizar un activo existente
export const updateAsset = async (id: number, assetData: MovableAsset) => {
    try {
        const response = await axiosInstance.put(`/furniture/${id}`, assetData);
        return response.data; // Devuelve el activo actualizado
    } catch (error) {
        console.error('Error updating asset:', error);
        throw error;
    } 
}
// Eliminar un activo existente
export const deleteAsset = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/furniture/${id}`);
        return response.data; // Devuelve el activo eliminado
    } catch (error) {
        console.error('Error deleting asset:', error);
        throw error;
    } 
}
