import axiosInstance from "../utils/axiosInstance";


//Piechart
export interface DashboardCounts {
    id: number;
    nombre: string;
    codigo: string;
    total: string;
}
// Obtener Datos para el Grafico de Torta de Activos
export const getDashboardCounts = async (): Promise<DashboardCounts[]> => {
    try {
        const response = await axiosInstance.get('/piechart');
        return response.data.counts;
    } catch (error) {
        console.error("Error fetching dashboard counts:", error);
        throw error;
    }
};

// Obtener el total de Bienes por Estado del bien
export interface DashboardCountsFurniture {
    id: number;
    nombre: string;
    total: string;
}

export const getDashboardCountsFurniture = async (): Promise<DashboardCountsFurniture[]> => {
    try {
        const response = await axiosInstance.get('/summary');
        return response.data.countsEstadobien;
    } catch (error) {
        console.error("Error fetching dashboard counts for furniture:", error);
        throw error;
    }
};

// Obtener el total de Bienes
export interface DashboardCountsTotal {
    suma_cantidad: string;
}
export const getDashboardTotal = async (): Promise<DashboardCountsTotal> => {
    try {
        const response = await axiosInstance.get('/total');
        return response.data.total;
    } catch (error) {
        console.error("Error fetching dashboard total:", error);
        throw error;
    }
};

// Obtener bienes registrados la ultima semana
export interface DashboardCountsLastWeek {
    ultimaSemana: number;
}
export const getDashboardCountsLastWeek = async (): Promise<DashboardCountsLastWeek[]> => {
    try {
        const response = await axiosInstance.get('/lastweek');
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard counts for last week:", error);
        throw error;
    }
};

// Obtener bienes registrados por mes
export interface DashboardCountsForMonth {
    anio: number;
    mes: number;
    total_muebles: string;
}
export const getDashboardCountsForMonth = async (): Promise<DashboardCountsForMonth[]> => {
    try {
        const response = await axiosInstance.get('/furnitureForMonth');
        return response.data.mublesPorMes;
    } catch (error) {
        console.error("Error fetching dashboard counts for last month:", error);
        throw error;
    }
};

// Obtener el total de Bienes por Departamento
export interface DashboardCountsByDepartment {
    dept_id: number;
    dept_nombre: string;
    total_valor: string;
}
export const getDashboardCountsByDepartment = async (): Promise<DashboardCountsByDepartment[]> => {
    try {
        const response = await axiosInstance.get('/totalValue');
        return response.data.valortotal;
    } catch (error) {
        console.error("Error fetching dashboard counts by department:", error);
        throw error;
    }
};