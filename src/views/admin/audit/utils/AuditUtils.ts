import {
  Audit, Log, createAudit, updateAudit, getAudits, getAuditById, getLogById, getLogs,
  deleteAudit, deleteLog, updateLog, createLog,
  registerAuditIn, registerAuditOut // <-- importa las nuevas funciones
} from "api/AuditApi";

import { getProfile } from "api/UserApi";

// Guardar entrada de usuario (inicio de sesión)
export const logUserEntry = async () => {
   // Asegúrate de que el perfil del usuario se obtenga antes de registrar la auditoría
  const profile = await getProfile();
  const usuario_id = profile.id; // Obtén el ID del usuario desde el perfil
  try {
    // Solo envía el usuario_id, la IP la toma el backend
    const data = await registerAuditIn(usuario_id);
    if (data.ok && data.id) {
      localStorage.setItem("audit_id", data.id.toString());
    }
  } catch (error) {
    console.error("Error registrando entrada de usuario:", error);
  }
};

// Guardar salida de usuario (cierre de sesión)


// Guardar salida de usuario (cierre de sesión)
export const logUserExit = async () => {
  const auditId = localStorage.getItem("audit_id");
  if (!auditId) {
    console.error("No se encontró el ID de auditoría en el almacenamiento local");
    return;
    }
  // Asegúrate de que el perfil del usuario se obtenga antes de registrar la auditoría
  const profile = await getProfile();
  const usuario_id = profile.id; // Obtén el ID del usuario desde el perfil
  try {
    await registerAuditOut(usuario_id);
    localStorage.removeItem("audit_id");
  } catch (error) {
    console.error("Error registrando salida de usuario:", error);
  }
};

// Obtener todas las auditorías
export const fetchAudits = async () => {
  try {
    return await getAudits();
  } catch (error) {
    console.error("Error obteniendo auditorías:", error);
    throw error;
  }
};

// Obtener auditoría por ID
export const fetchAuditById = async (id: number) => {
  try {
    return await getAuditById(id);
  } catch (error) {
    console.error("Error obteniendo auditoría por ID:", error);
    throw error;
  }
}
// Obtener todos los logs
export const fetchLogs = async () => {
    try {
        return await getLogs();
    } catch (error) {
        console.error("Error obteniendo logs:", error);
        throw error;
    }
}
// Obtener log por ID
export const fetchLogById = async (id: number) => {
    try {
        return await getLogById(id);
    } catch (error) {
        console.error("Error obteniendo log por ID:", error);
        throw error;
    }
}

// Crear un nuevo log
export const createNewLog = async (logData: Omit<Log, "id">) => {
    try {
        return await createLog(logData);
    } catch (error) {
        console.error("Error creando log:", error);
        throw error;
    }
}
// Actualizar un log existente
export const updateExistingLog = async (id: number, updates: Partial<Omit<Log, "id">>) => {
    try {
        return await updateLog(id, updates);
    } catch (error) {
        console.error("Error actualizando log:", error);
        throw error;
    }
}
// Eliminar un log
export const deleteExistingLog = async (id: number) => {
    try {
        await deleteLog(id);
    } catch (error) {
        console.error("Error eliminando log:", error);
        throw error;
    }
}
// Eliminar una auditoría
export const deleteExistingAudit = async (id: number) => {
  try {
    await deleteAudit(id);
  } catch (error) {
    console.error("Error eliminando auditoría:", error);
    throw error;
  }
};
// Actualizar una auditoría
export const updateExistingAudit = async (id: number, updates: Partial<Omit<Audit, "id">>) => {
  try {
    return await updateAudit(id, updates);
  } catch (error) {
    console.error("Error actualizando auditoría:", error);
    throw error;
  }
};
// Crear una nueva auditoría
export const createNewAudit = async (auditData: Omit<Audit, "id">) => {
  try {
    return await createAudit(auditData);
  } catch (error) {
    console.error("Error creando auditoría:", error);
    throw error;
  }
};



// Registrar una acción personalizada en los logs
export const logCustomAction = async ({
  accion,
  detalles,
}: {
  accion: string;
  detalles: string;
}) => {
  try {
    const profile = await getProfile();
    const usuario_id = profile.id;
    const fecha = new Date().toISOString(); // O dayjs().toISOString() si usas dayjs

    const logData = {
      usuario_id,
      fecha,
      accion,
      detalles,
    };

    await createLog(logData);
  } catch (error) {
    console.error("Error registrando acción personalizada:", error);
  }
};