// notificationService.js
import * as httpRequest from '~/utils/httpRequest';

export const fetchNotifications = async (userId) => {
    try {
        const response = await httpRequest.get(`notifications/seller/${userId}`);
        return response;
    } catch (error) {
        throw new Error('Failed to fetch notifications');
    }
};
