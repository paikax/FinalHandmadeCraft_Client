// notificationService.js
import * as httpRequest from '~/utils/httpRequest';

export const fetchNotifications = async (userId) => {
    try {
        const response = await httpRequest.get(`/api/notifications/${userId}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch notifications');
    }
};

export const markNotificationsAsRead = async (userId) => {
    try {
        await httpRequest.put(`/api/notifications/${userId}/mark-as-read`);
    } catch (error) {
        throw new Error('Failed to mark notifications as read');
    }
};
