// orderServices.js
import * as httpRequest from '~/utils/httpRequest';

export const createOrder = async (orderRequest) => {
    try {
        const res = await httpRequest.post(`orders/${orderRequest.userId}`, orderRequest);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getOrders = async (userId) => {
    try {
        const res = await httpRequest.get(`orders/all/${userId}`);
        return res;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const getOrderById = async (orderId) => {
    try {
        const res = await httpRequest.get(`orders/${orderId}`);
        console.log(res);
        return res;
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
};

export const addToCart = async (userId, item) => {
    try {
        const res = await httpRequest.post(`orders/cart/${userId}`, item);
        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const buyItemsFromCart = async (userId, address) => {
    try {
        const res = await httpRequest.post(`orders/cart/buy/${userId}?buyUserAddress=${address}`);
        return res;
    } catch (error) {
        console.error('Error buying items from cart:', error);
        throw error;
    }
};

export const getCartItems = async (userId) => {
    try {
        const res = await httpRequest.get(`orders/cart/${userId}`);
        return res;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
};

export const removeFromCart = async (userId, productId) => {
    try {
        const res = await httpRequest.remove(`orders/cart/${userId}/${productId}`);
        return res;
    } catch (error) {
        console.error('Error removing item from cart:', error);
        throw error;
    }
};

export const clearCart = async (userId) => {
    try {
        const res = await httpRequest.remove(`orders/cart/${userId}`);
        return res;
    } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
    }
};

export const updateCartItemQuantity = async (userId, productId, quantity) => {
    console.log(userId, productId, quantity);
    try {
        const res = await httpRequest.update(`orders/cart/${userId}/${productId}?quantity=${quantity}`);
        return res;
    } catch (error) {
        console.error('Error updating item quantity:', error);
        throw error;
    }
};
