import axiosInstance from "../utils/axiosInstance";

export interface MissingGoods {
  id: number
  unidad: number
  existencias: number
  diferencia_cantidad: number
  diferencia_valor: number
  funcionario_id: number
  jefe_id?: number // Hacer jefe_id opcional
  observaciones: string
  fecha: string
  bien_id: number
  responsable_id: number // Añadir responsable_id

  // Campos opcionales/calculados para mostrar en frontend
  funcionario_nombre?: string
  jefe_nombre?: string
  departamento?: string
  numero_identificacion?: string
}

// Obtener todos los bienes faltantes
export const getMissingGoods = async (): Promise<MissingGoods[]> => {
  const response = await axiosInstance.get("/missing-goods");
  return response.data.missingGoods as MissingGoods[];
};

// Obtener un bien faltante por ID
export const getMissingGoodById = async (id: number): Promise<MissingGoods> => {
  const response = await axiosInstance.get(`/missing-goods/${id}`);
  return response.data.missingGoods as MissingGoods;
};

// Crear un bien faltante
export const createMissingGood = async (
  missingGoodData: Omit<MissingGoods, "id" | "funcionario_nombre" | "jefe_nombre" | "departamento">
): Promise<MissingGoods> => {
  const response = await axiosInstance.post("/missing-goods", missingGoodData);
  return response.data.missingGoods as MissingGoods;
};

// Actualizar un bien faltante
export const updateMissingGood = async (
  id: number,
  updates: Partial<Omit<MissingGoods, "id" | "funcionario_nombre" | "jefe_nombre" | "departamento">>
): Promise<MissingGoods> => {
  const response = await axiosInstance.put(`/missing-goods/${id}`, updates);
  return response.data.missingGoods as MissingGoods;
};

// Eliminar un bien faltante
export const deleteMissingGood = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/missing-goods/${id}`);
};
