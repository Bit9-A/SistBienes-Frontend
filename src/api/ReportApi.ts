export interface MissingGood {
    id: number;
    unidad: number;
    existencias: number;
    diferencia_cantidad: number;
    diferencia_valor: number;
    funcionario_id: number;
    jefe_id: number;
    observaciones: string;
    fecha: string;
    bien_id: number;
    funcionario_nombre?: string;
    jefe_nombre?: string;
    departamento?: string;
    numero_identificacion?: string;
    dept_id?: number;
}

import axiosInstance from "../utils/axiosInstance";

// Obtener todos los bienes faltantes
export const getMissingGoods = async (): Promise<MissingGood[]> => {
    const response = await axiosInstance.get("/missing-goods");
    return response.data.missingGoods as MissingGood[];
};

// Obtener un bien faltante por ID
export const getMissingGoodById = async (id: number): Promise<MissingGood> => {
    const response = await axiosInstance.get(`/missing-goods/${id}`);
    return response.data.missingGood as MissingGood;
};

// Crear un bien faltante
export const createMissingGood = async (missingGoodData: Omit<MissingGood, "id">): Promise<MissingGood> => {
    const response = await axiosInstance.post("/missing-goods", missingGoodData);
    return response.data.missingGood as MissingGood;
};

// Actualizar un bien faltante
export const updateMissingGood = async (id: number, updates: Partial<Omit<MissingGood, "id">>): Promise<MissingGood> => {
    const response = await axiosInstance.put(`/missing-goods/${id}`, updates);
    return response.data.missingGood as MissingGood;
};

// Eliminar un bien faltante
export const deleteMissingGood = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/missing-goods/${id}`);
};
