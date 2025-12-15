import axiosInstance from "../utils/axiosInstance";

// Definición de la interfaz para una notificación
export interface Notification {
  id: number;
  descripcion: string;
  isRead: number;
  fecha: string;
  dept_id: number;
  departamento: string;
}

// Obtener todas las notificaciones
export const getAllNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await axiosInstance.get('/notifications');
    return response.data.notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Actualizar el estado de lectura de una notificación
export const updateNotificationStatus = async (id: number, isRead: number) => {
  try {
    const response = await axiosInstance.put(`/notifications/${id}`, { isRead });
     
    return response.data;
  } catch (error) {
    console.error('Error updating notification status:', error);
    throw error;
  }
};

// Obtener una notificación por ID
export const getNotificationById = async (id: number): Promise<Notification> => {
  try {
    const response = await axiosInstance.get(`/notifications/${id}`);
    return response.data.notifications;
  } catch (error) {
    console.error('Error fetching notification:', error);
    throw error;
  }
};

// Crear una nueva notificación
export const createNotification = async (notificationData: any) => {
  try {
    const response = await axiosInstance.post('/notifications', notificationData);
    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Actualizar una notificación existente
export const updateNotification = async (id: number, notificationData: any) => {
  try {
    const response = await axiosInstance.put(`/notifications/${id}`, notificationData);
    return response.data;
  } catch (error) {
    console.error('Error updating notification:', error);
    throw error;
  }
};

// Eliminar una notificación existente
export const deleteNotification = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/notifications/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// Obtener notificaciones por ID de departamento
export const getNotificationsByDeptId = async (dept_id: number): Promise<Notification[]> => {
  try {
    const response = await axiosInstance.get(`/notifications/dept/${dept_id}`);
    return response.data.notifications; // Asegurarse de que devuelve el array de notificaciones
  } catch (error) {
    console.error('Error fetching notifications by department ID:', error);
    throw error;
  }
};
