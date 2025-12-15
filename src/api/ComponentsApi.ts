import axiosInstance from "../utils/axiosInstance";

export interface Component {
  id: number;
  bien_id: number | null; 
  nombre: string;
  numero_serial?: string | null;
}

// Obtener todos los componentes
export const getComponents = async (): Promise<Component[]> => {
  const response = await axiosInstance.get("/components");
  // Si tu backend responde con { ok, components }
  return response.data.components as Component[];
};

// Obtener un componente por ID
export const getComponentById = async (id: number): Promise<Component> => {
  const response = await axiosInstance.get(`/components/${id}`);
  return response.data.component as Component;
};

// Obtener todos los componentes de un bien específico
export const getComponentsByBienId = async (bien_id: number): Promise<Component[]> => {
  const response = await axiosInstance.get(`/components/bien/${bien_id}`);
  return response.data.components as Component[];
};

// Crear un nuevo componente
export const createComponent = async (componentData: Omit<Component, "id">): Promise<Component> => {
  const response = await axiosInstance.post("/components", componentData);
  return response.data.component as Component;
};

// Actualizar un componente
export const updateComponent = async (
  id: number,
  updates: Partial<Omit<Component, "id">>
): Promise<Component> => {
  const response = await axiosInstance.put(`/components/${id}`, updates);
  return response.data.component as Component;
};

// Eliminar un componente
export const deleteComponent = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/components/${id}`);
};

// Quitar un componente de un bien (establecer bien_id a null)
export const removeComponentFromAsset = async (id: number): Promise<Component> => {
  const response = await axiosInstance.put(`/components/${id}`, { bien_id: null });
  return response.data.component as Component;
};

export interface TransferComponent {
  id: number;
  componente_id: number;
  bien_origen_id: number;
  bien_destino_id: number;
  fecha: string;
  componente_nombre?: string;
  numero_serial?: string | null;
  observaciones?: string;
  dept_origen?: number | null; // ID del departamento de origen del bien
  dept_destino?: number | null; // ID del departamento de destino del bien
  dept_origen_nombre?: string; // Nombre del departamento de origen
  dept_destino_nombre?: string; // Nombre del departamento de destino
}

// Obtener todos los traslados de componentes
export const getTransferComponents = async (): Promise<TransferComponent[]> => {
  const response = await axiosInstance.get("/transfer-component");
  // Asumiendo que el backend siempre devuelve { ok: boolean, transfers: TransferComponent[] }
  return response.data.transfers as TransferComponent[];
};

// Obtener un traslado de componente por ID
export const getTransferComponentById = async (id: number): Promise<TransferComponent> => {
  const response = await axiosInstance.get(`/transfer-component/${id}`);
  return response.data.transferComponent || response.data as TransferComponent;
};

// Crear un nuevo traslado de componente
export const createTransferComponent = async (
  data: Omit<TransferComponent, "id" | "componente_nombre" | "numero_serial">
): Promise<TransferComponent> => {
  const response = await axiosInstance.post("/transfer-component", data);
  return response.data.transferComponent || response.data as TransferComponent;
};

// Actualizar un traslado de componente
export const updateTransferComponent = async (
  id: number,
  updates: Partial<Omit<TransferComponent, "id" | "componente_nombre" | "numero_serial">>
): Promise<TransferComponent> => {
  const response = await axiosInstance.put(`/transfer-component/${id}`, updates);
  return response.data.transferComponent || response.data as TransferComponent;
};

// Eliminar un traslado de componente
export const deleteTransferComponent = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/transfer-component/${id}`);
};
