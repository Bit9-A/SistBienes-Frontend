import axiosInstance from "../utils/axiosInstance";

export interface DashboardCounts {
    equiposInformaticos: number;
    mobiliarios: number;
    vehiculos: number;
    equiposOficina: number;
    audiovisuales: number;
}


// Obtener Datos para el Grafico de Torta de Activos
export const getDashboardCounts = async (): Promise<DashboardCounts> => {
    try {
        const response = await axiosInstance.get('/');
        return response.data.counts;
    } catch (error) {
        console.error("Error fetching dashboard counts:", error);
        throw error;
    }
};