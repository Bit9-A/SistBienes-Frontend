import axiosInstance from "../utils/axiosInstance";


//Departamentos

// Definición de la interfaz para un departamento
export interface Department {
  id: number;
  nombre: string;
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

//Tipos de usuario

