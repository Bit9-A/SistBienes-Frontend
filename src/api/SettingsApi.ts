import axiosInstance from "../utils/axiosInstance";

// Configuración general
export interface GeneralConfig {
    id: number;
    fecha: string;
    colorprimario: string;
    colorsecundario: string;
    url_banner: string;
    url_logo: string;
    url_favicon: string;
    nombre_institucion: string;
}

// Mostrar los datos de la configuracion general 
export const getGeneralConfig = async (): Promise<GeneralConfig> => {
    const response = await axiosInstance.get("/config/");
    return response.data;
};

// Subida de imagen para configuración general
export const uploadConfigImage = async (formData: FormData): Promise<any> => {
    const response = await axiosInstance.put("/config/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};


//Departamentos

// Definición de la interfaz para un departamento
export interface Department {
    id: number;
    nombre: string;
    codigo: string;
}
// Obtener todos los departamentos
export const getDepartments = async (): Promise<Department[]> => {
    try {
        const response = await axiosInstance.get('/dept');
        return response.data.departments; // Asegúrate de que la respuesta tenga esta estructura
    } catch (error) {
        console.error('Error fetching departments:', error);
        throw error;
    }
};

// Crear un nuevo departamento
export const createDepartment = async (departmentData: any) => {
    try {
        const response = await axiosInstance.post('/dept', departmentData);
        return response.data; // Devuelve el departamento creado
    } catch (error) {
        console.error('Error creating department:', error);
        throw error;
    }
};

// Actualizar un departamento existente

export const updateDepartment = async (id: number, departmentData: any) => {
    try {
        const response = await axiosInstance.put(`/dept/${id}`, departmentData);
        return response.data; // Devuelve el departamento actualizado
    } catch (error) {
        console.error('Error updating department:', error);
        throw error;
    }
};
// Eliminar un departamento existente

export const deleteDepartment = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/dept/${id}`);
        return response.data; // Devuelve el departamento eliminado
    } catch (error) {
        console.error('Error deleting department:', error);
        throw error;
    }
};

//SubGrupos Muebles
// Definición de la interfaz para un subgrupo

export interface SubGroup {
    id: number;
    nombre: string;
    codigo: string;
}

export const getSubGroupsM = async (): Promise<SubGroup[]> => {
    try {
        const response = await axiosInstance.get('/subgroup/muebles');
        return response.data.subgrupos; // Asegúrate de que la respuesta tenga esta estructura
    } catch (error) {
        console.error('Error fetching subgroups:', error);
        throw error;
    }
};

// Crear un nuevo subgrupo
export const createSubGroupM = async (subgroupData: any) => {
    try {
        const response = await axiosInstance.post('/subgroup/muebles', subgroupData);
        return response.data; // Devuelve el subgrupo creado
    } catch (error) {
        console.error('Error creating subgroup:', error);
        throw error;
    }
};
// Actualizar un subgrupo existente
export const updateSubGroupM = async (id: number, subgroupData: any) => {
    try {
        const response = await axiosInstance.put(`/subgroup/muebles/${id}`, subgroupData);
        return response.data; // Devuelve el subgrupo actualizado
    } catch (error) {
        console.error('Error updating subgroup:', error);
        throw error;
    }
};

// Eliminar un subgrupo existente
export const deleteSubGroupM = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/subgroup/muebles/${id}`);
        return response.data; // Devuelve el subgrupo eliminado
    } catch (error) {
        console.error('Error deleting subgroup:', error);
        throw error;
    }
};

//Parroquias

// Definición de la interfaz para una parroquia
export interface Parroquia {
    id: number;
    nombre: string;
}
// Obtener todas las parroquias
export const getParroquias = async (): Promise<Parroquia[]> => {
    try {
        const response = await axiosInstance.get('/parish');
        return response.data.parishes; // Asegúrate de que la respuesta tenga esta estructura
    } catch (error) {
        console.error('Error fetching parroquias:', error);
        throw error;
    }
}
// Crear una nueva parroquia
export const createParroquia = async (parroquiaData: any) => {
    try {
        const response = await axiosInstance.post('/parish', parroquiaData);
        return response.data; // Devuelve la parroquia creada
    } catch (error) {
        console.error('Error creating parroquia:', error);
        throw error;
    }
};
// Actualizar una parroquia existente
export const updateParroquia = async (id: number, parroquiaData: any) => {
    try {
        const response = await axiosInstance.put(`/parish/${id}`, parroquiaData);
        return response.data; // Devuelve la parroquia actualizada
    } catch (error) {
        console.error('Error updating parroquia:', error);
        throw error;
    }
}
// Eliminar una parroquia existente
export const deleteParroquia = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/parish/${id}`);
        return response.data; // Devuelve la parroquia eliminada
    } catch (error) {
        console.error('Error deleting parroquia:', error);
        throw error;
    }
};


//Conceptos de Movimiento

// Definición de la interfaz para un concepto de movimiento
export interface ConceptoMovimiento {
    id: number;
    nombre: string;
    codigo: string;
}
// Obtener todos los conceptos de movimiento Incorporación
export const getConceptosMovimientoIncorporacion = async () => {
    try {
        const response = await axiosInstance.get('/concept-incorp');
        return response.data.conceptInc; // Asegúrate de que la respuesta tenga esta estructura
    } catch (error) {
        console.error('Error fetching conceptos de movimiento:', error);
        throw error;
    }
}
// Crear un nuevo concepto de movimiento Incorporación
export const createConceptoMovimientoIncorporacion = async (conceptoData: any) => {
    try {
        const response = await axiosInstance.post('/concept-incorp', conceptoData);
        return response.data; // Devuelve el concepto creado
    } catch (error) {
        console.error('Error creating concepto de movimiento:', error);
        throw error;
    }
};
// Actualizar un concepto de movimiento existente Incorporación
export const updateConceptoMovimientoIncorporacion = async (id: number, conceptoData: any) => {
    try {
        const response = await axiosInstance.put(`/concept-incorp/${id}`, conceptoData);
        return response.data; // Devuelve el concepto actualizado
    } catch (error) {
        console.error('Error updating concepto de movimiento:', error);
        throw error;
    }
};
// Eliminar un concepto de movimiento existente Incorporación
export const deleteConceptoMovimientoIncorporacion = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/concept-incorp/${id}`);
        return response.data; // Devuelve el concepto eliminado
    } catch (error) {
        console.error('Error deleting concepto de movimiento:', error);
        throw error;
    }
};

// Obtener todos los conceptos de movimiento Desincorporación
export const getConceptosMovimientoDesincorporacion = async () => {
    try {
        const response = await axiosInstance.get('/concept-desincorp');
        return response.data.conceptDes; // Asegúrate de que la respuesta tenga esta estructura
    } catch (error) {
        console.error('Error fetching conceptos de movimiento:', error);
        throw error;
    }
}
// Crear un nuevo concepto de movimiento Desincorporación
export const createConceptoMovimientoDesincorporacion = async (conceptoData: any) => {
    try {
        const response = await axiosInstance.post('/concept-desincorp', conceptoData);
        return response.data; // Devuelve el concepto creado
    } catch (error) {
        console.error('Error creating concepto de movimiento:', error);
        throw error;
    }
};
// Actualizar un concepto de movimiento existente Desincorporación
export const updateConceptoMovimientoDesincorporacion = async (id: number, conceptoData: any) => {
    try {
        const response = await axiosInstance.put(`/concept-desincorp/${id}`, conceptoData);
        return response.data; // Devuelve el concepto actualizado
    } catch (error) {
        console.error('Error updating concepto de movimiento:', error);
        throw error;
    }
};
// Eliminar un concepto de movimiento existente Desincorporación
export const deleteConceptoMovimientoDesincorporacion = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/concept-desincorp/${id}`);
        return response.data; // Devuelve el concepto eliminado
    } catch (error) {
        console.error('Error deleting concepto de movimiento:', error);
        throw error;
    }
}
