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
  isActive?: number;
  observaciones?: string;
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

//Desincorporacion
export interface Desincorp {
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
  observaciones?: string;
  } ;

//app.use("/desincorp", desincorp);
export const getDesincorps = async (): Promise<Desincorp[]> => {
  const response = await axiosInstance.get("/desincorp");
  
  return response.data.desincorps as Desincorp[];
};
// Obtener una desincorporación por ID
export const getDesincorpById = async (id: number): Promise<Desincorp> => {
  const response = await axiosInstance.get(`/desincorp/${id}`);
  return response.data.desincorp as Desincorp;
}
// Crear una desincorporación
export const createDesincorp = async (desincorpData: Omit<Desincorp, "id">): Promise<Desincorp> => {
  const response = await axiosInstance.post("/desincorp", desincorpData);
  return response.data.desincorp as Desincorp;
}
// Actualizar una desincorporación
export const updateDesincorp = async (id: number, updates: Partial<Omit<Desincorp, "id">>): Promise<Desincorp> => {
  const response = await axiosInstance.put(`/desincorp/${id}`, updates);
  return response.data.desincorp as Desincorp;
};
// Eliminar una desincorporación
export const deleteDesincorp = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/desincorp/${id}`);
};
