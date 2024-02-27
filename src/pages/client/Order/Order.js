import React, { useState, useEffect } from 'react';
import OrderList from './OrderList';
import { getOrders } from '~/services/orderService'; // Adjust the path accordingly
import { useSelector } from 'react-redux';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const currentUserID = useSelector((state) => String(state.auth.login.currentUser?.id));

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getOrders(currentUserID); // Replace 'userId' with actual user ID
            setOrders(response.data); // Assuming the API response has a 'data' property containing the orders
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Orders</h2>
            <OrderList orders={orders} />
        </div>
    );
};

export default Order;
