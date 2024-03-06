// orderServices.js
import * as httpRequest from '~/utils/httpRequest';

export const createOrder = async (orderRequest) => {
    try {
        const res = await httpRequest.post(`/orders/${orderRequest.userId}`, orderRequest);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getOrders = async (userId) => {
    try {
        const res = await httpRequest.get(`/orders/all/${userId}`);
        return res;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const getOrderById = async (orderId) => {
    try {
        const res = await httpRequest.get(`/orders/${orderId}`);
        console.log(res);
        return res;
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
};
