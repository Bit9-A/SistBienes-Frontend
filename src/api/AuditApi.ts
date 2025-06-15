


export interface Audit{
    id: number;
    usuario_id: number;
    entrada: string; // Formato ISO 8601
    salida: string; // Formato ISO 8601
    nombre: string;
    departamento?: string;
    ip: string;
}
export interface Log{
    id: number;
    usuario_id: number;
    usuario_nombre?:string; // Nombre del usuario
    fecha: string; // Formato ISO 8601
    accion: string;
    detalles: string;
    departamento?: string; // Nombre del departamento
}

export const ACTION_TYPES = [
  { value: "all", label: "Todas las acciones" },
  { value: "autenticación", label: "Autenticación" },
  { value: "creación", label: "Creación" },
  { value: "eliminación", label: "Eliminación" },
  { value: "actualización", label: "Actualización" },
]

import axiosInstance from "../utils/axiosInstance";

// Obtener todas las auditorías
export const getAudits = async (): Promise<Audit[]> => {
    const response = await axiosInstance.get("/audit");
    return response.data.audits as Audit[];
};
// Obtener una auditoría por ID
export const getAuditById = async (id: number): Promise<Audit> => {
    const response = await axiosInstance.get(`/audit/${id}`);
    return response.data.audit as Audit;
}
// Crear una auditoría
export const createAudit = async (auditData: Omit<Audit, "id">): Promise<Audit> => {
    const response = await axiosInstance.post("/audit", auditData);
    return response.data.audit as Audit;
};
// Actualizar una auditoría
export const updateAudit = async (id: number, updates: Partial<Omit<Audit, "id">>): Promise<Audit> => {
    const response = await axiosInstance.put(`/audit/${id}`, updates);
    return response.data.audit as Audit;
};
// Eliminar una auditoría
export const deleteAudit = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/audit/${id}`);
}
// Obtener todos los logs
export const getLogs = async (): Promise<Log[]> => {
    const response = await axiosInstance.get("/logs");
    return response.data.logs as Log[];
}
// Obtener un log por ID
export const getLogById = async (id: number): Promise<Log> => {
    const response = await axiosInstance.get(`/logs/${id}`);
    return response.data.log as Log;
}
// Crear un log
export const createLog = async (logData: Omit<Log, "id">): Promise<Log> => {
    const response = await axiosInstance.post("/logs", logData);
    return response.data.log as Log;
};
// Actualizar un log
export const updateLog = async (id: number, updates: Partial<Omit<Log, "id">>): Promise<Log> => {
    const response = await axiosInstance.put(`/logs/${id}`, updates);
    return response.data.log as Log;
};
// Eliminar un log
export const deleteLog = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/logs/${id}`);
}





// Registrar entrada de usuario (inicio de sesión)

export const registerAuditIn = async (usuario_id: number): Promise<{ ok: boolean; id?: number }> => {
    const response = await axiosInstance.post("/audit/in/r", { usuario_id });
    return response.data;
};

// Registrar salida de usuario (cierre de sesión)
export const registerAuditOut = async (usuario_id: number): Promise<{ ok: boolean }> => {
  
    const response = await axiosInstance.post("/audit/out/r", { usuario_id });
  
    return response.data;
};