//Paypal service
import axios from 'axios';
import httpRequest from '~/utils/httpRequest';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

export const upgradeToPremium = async (userId) => {
    try {
        const response = await httpRequest.post(`users/${userId}/upgrade-to-premium`);
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

        const response = await httpRequest.post('paypal/create-order', { amount: numericAmount });
        console.log(response.data);
        return response.data.orderId;
    } catch (error) {
        throw new Error('Failed to create order.');
    }
};

export const capturePayment = async (orderId) => {
    try {
        await httpRequest.post('paypal/capture-payment', { orderId });
        return true;
    } catch (error) {
        throw new Error('Failed to capture payment.');
    }
};

export const connectPaypal = async (userId, paypalEmail, paypalFirstName, paypalLastName) => {
    try {
        await httpRequest.post('PayPal/connect-paypal', {
            userId,
            paypalEmail,
            paypalFirstName,
            paypalLastName,
        });
    } catch (error) {
        throw new Error('Failed to connect PayPal.');
    }
};

export const sendPayment = async (paypalEmail, amount) => {
    try {
        // Make a request to your backend to send payment to the provided PayPal email with the specified amount
        const res = await httpRequest.post(`PayPal/send-payment?recipientEmail=${paypalEmail}&amount=${amount}`);
        return res;
    } catch (error) {
        console.log(error);
        throw error; // Re-throw the error to handle it elsewhere
    }
};
