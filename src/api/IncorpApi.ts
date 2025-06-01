import axiosInstance from "../utils/axiosInstance";

export interface Incorp {
  id: number;
  bien_id: number;
  fecha: string; 
  valor: number;
  cantidad: number;
  concepto_id: number;
  numero_identificacion?: string;
  dept_nombre?: string;
  concepto_nombre?: string;
  dept_id: number;
}

// Obtener todas las incorporaciones
export const getIncorps = async (): Promise<Incorp[]> => {
  const response = await axiosInstance.get("/incorp");
  
  return response.data.incorps as Incorp[];
};

// Obtener una incorporación por ID
export const getIncorpById = async (id: number): Promise<Incorp> => {
  const response = await axiosInstance.get(`/incorp/${id}`);
  return response.data.incorp as Incorp;
};

// Crear una incorporación
export const createIncorp = async (incorpData: Omit<Incorp, "id">): Promise<Incorp> => {
console.log("Datos enviados al servidor:", incorpData);
  const response = await axiosInstance.post("/incorp", incorpData);

  return response.data.incorp as Incorp;
};

// Actualizar una incorporación
export const updateIncorp = async (id: number, updates: Partial<Omit<Incorp, "id">>): Promise<Incorp> => {
  const response = await axiosInstance.put(`/incorp/${id}`, updates);
  return response.data.incorp as Incorp;
};

// Eliminar una incorporación
export const deleteIncorp = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/incorp/${id}`);
};