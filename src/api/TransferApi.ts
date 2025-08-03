import axiosInstance from "../utils/axiosInstance";

// Definición de la interfaz para los datos
export interface TransferResponse {
  ok: boolean;
  transfer: Transfer;
}
// Definir la interfaz para los bienes
export interface bienes {
  id: number;
  id_traslado?: number;
  id_mueble: number;
  nombre_descripcion: string;
  numero_identificacion: string;
  descripcion?: string; // Nuevo: descripción del bien
  estado: string;
  estado_nombre?: string; // Nuevo: nombre del estado/condición
  dept_id?: number; // Nuevo: ID del departamento
  departamento?: string; // Nuevo: nombre del departamento
}
// Actualizar la interfaz Transfer para incluir bienes
export interface Transfer {
  id: number;
  fecha: string;
  cantidad: number;
  origen_id: number;
  destino_id: number;
  responsable_id: number;
  responsable?: string;
  observaciones?: string;
  bienes?: bienes[]; // Array de objetos bienes
  departamento_origen_id?: number; // Nuevo: ID del departamento de origen
  departamento_destino_id?: number; // Nuevo: ID del departamento de destino
}

// Interfaz para el payload de creación de transferencias
export interface CreateTransferPayload extends Omit<Transfer, "id" | "bienes"> {
  bienes: number[]; // Array de IDs de bienes para la creación
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
//Obtener los bienes asociados a una transferencia por su ID

export const getByTransfersId = async (id: string | number): Promise<TransferResponse> => {
  try {
    const response = await axiosInstance.get(`/transfers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching transfers:", error);
    throw error;
  }
};

// Crear una nueva transferencia
export const createTransfer = async (transferData: CreateTransferPayload) => {
  try {
    const formattedData = {
      ...transferData,
      fecha: transferData.fecha ? new Date(transferData.fecha).toISOString().slice(0, 10) : '',
    };
    const response = await axiosInstance.post('/transfers', formattedData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating transfer:', error.response?.data || error.message);
    throw error;
  }
};

// Actualizar una transferencia existente
export const updateTransfer = async (transferId: number, transferData: Transfer) => {
  try {
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
