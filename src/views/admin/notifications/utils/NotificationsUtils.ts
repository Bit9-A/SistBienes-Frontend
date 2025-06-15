import {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  getNotificationsByDeptId,
  type Notification,
} from "api/NotificationsApi";

export type { Notification };

export const {
  getAllNotifications: fetchNotifications,
  getNotificationById: fetchNotificationById,
  updateNotification: updateExistingNotification,
  deleteNotification: deleteExistingNotification,
  getNotificationsByDeptId: fetchNotificationsByDeptId,
} = {
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  getNotificationsByDeptId,
};

export const createNotificationAction = async ({
  dept_id,
  descripcion,
}: {
  dept_id: number;
  descripcion: string;
}) => {
  try {
    const fecha = new Date().toISOString();

    const notificationData = {
      dept_id,
      descripcion,
      fecha,
      isRead: 0,
    };

    const response = await createNotification(notificationData);
    return response.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};
