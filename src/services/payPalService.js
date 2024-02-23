//Paypal service
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://localhost:5001/api/', // Update the base URL to your backend API
});

export const upgradeToPremium = async (userId) => {
    try {
        const response = await axios.apiClient(`/users/${userId}/upgrade-to-premium`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to upgrade user to premium: ' + error.message);
    }
};
export const createOrder = async (amount) => {
    try {
        // Convert the amount to a number
        const numericAmount = parseFloat(amount);

        // Check if the conversion is successful
        if (isNaN(numericAmount)) {
            throw new Error('Invalid amount');
        }

        const response = await axios.apiClient('/paypal/create-order', { amount: numericAmount });
        console.log(response.data);
        return response.data.orderId;
    } catch (error) {
        throw new Error('Failed to create order.');
    }
};

export const capturePayment = async (orderId) => {
    try {
        await axios.post('/paypal/capture-payment', { orderId });
        return true;
    } catch (error) {
        throw new Error('Failed to capture payment.');
    }
};

export const setUpPayment = async (userId, clientID, clientSecret) => {
    try {
        const response = await apiClient.post(`/paymentSetup/setup-paypal/${userId}`, {
            clientID,
            clientSecret,
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to set up PayPal for user: ' + error.message);
    }
};
