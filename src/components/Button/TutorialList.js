import React from 'react';
import { createOrder } from '~/services/orderService'; // This service needs to be created

const OrderButton = ({ tutorialId, userId }) => {
    const handleOrder = async () => {
        try {
            await createOrder(tutorialId, userId);
            alert('Order placed successfully!');
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order.');
        }
    };

    return <button onClick={handleOrder}>Order Tutorial</button>;
};
