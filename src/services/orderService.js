import * as httpRequest from '~/utils/httpRequest';

export const createOrder = async (orderRequest) => {
    try {
        const res = await httpRequest.post(`/orders/${orderRequest.userId}`, orderRequest);
        return res;
    } catch (error) {
        console.log(error);
        throw error; // Re-throw the error to handle it elsewhere
    }
};

export const getOrders = async (userId) => {
    try {
        const res = await httpRequest.get(`/orders/all/${userId}`);
        return res; // Assuming the response data contains the orders
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error; // Re-throw the error to handle it elsewhere
    }
};
