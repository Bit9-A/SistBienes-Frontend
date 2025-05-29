import axiosInstance from "../utils/axiosInstance";

// Definir la interfaz para los bienes
export interface Bien {
  id: number;
  id_traslado?: number;
  id_mueble: number;
  nombre_descripcion: string;
  numero_identificacion: string;
}
// Actualizar la interfaz Transfer para incluir bienes
export interface Transfer {
  id: number;
  fecha: string;
  cantidad: number;
  origen_id: number;
  destino_id: number;
  bien_traslado_id: number;
  id_mueble: number;
  bienes?: Bien[]; // Agregar la propiedad bienes
}

// Obtener todas las transferencias
export const getAllTransfers = async (): Promise<Transfer[]> => {
  try {
    const response = await axiosInstance.get('/transfers');
    return response.data.transfers || [];
  } catch (error) {
    console.error("Error fetching transfers:", error);
    throw error;
  }
};

export const getByTransfersId = async (id: string | number): Promise<Transfer[]> => {
  try {
    const response = await axiosInstance.get(`/transfers/${id}`);
    return response.data.transfers || [];
  } catch (error) {
    console.error("Error fetching transfers:", error);
    throw error;
  }
};

// Crear una nueva transferencia
export const createTransfer = async (transferData: Transfer) => {
  try {
    console.log("Datos enviados al servidor:", transferData);
    const response = await axiosInstance.post('/transfers', transferData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating transfer:', error.response?.data || error.message);
    throw error;
  }
};

// Actualizar una transferencia existente
export const updateTransfer = async (transferId: number, transferData: Transfer) => {
  try {
    console.log("Datos enviados al servidor:", transferData);
    const response = await axiosInstance.put(`/transfers/${transferId}`, transferData);
    return response.data;
  } catch (error: any) {
    console.error("Error al actualizar la transferencia:", error.response?.data || error.message);
    throw error;
  }
};

// Eliminar una transferencia existente
export const deleteTransfer = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/transfers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting transfer:', error);
    throw error;
  }
}