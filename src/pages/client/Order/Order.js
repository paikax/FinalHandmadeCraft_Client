import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getOrders } from '~/services/orderService';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const currentUserID = useSelector((state) => String(state.auth.login.currentUser?.id));

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const ordersData = await getOrders(currentUserID);
                setOrders(ordersData);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, [currentUserID]);

    const removeFileExtension = (url) => {
        if (!url) return ''; // Handle null or undefined input
        const index = url.lastIndexOf('.');
        return index > 0 ? url.substring(0, index) : url;
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-4xl font-bold mb-10 text-center uppercase text-gray-900">Your Orders</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {orders && orders.length > 0 ? (
                    orders.map((order) => (
                        <Link to={`/orders/${order.id}`} key={order.id}>
                            <div key={order.id} className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900">Order #{order.id}</h2>
                                    <span className="text-xl text-gray-600">{order.date}</span>
                                </div>

                                <ul className="divide-y divide-gray-300">
                                    {order.items.map((item) => (
                                        <li key={item.productId} className="py-4 flex items-center">
                                            <img
                                                src={`${removeFileExtension(item.tutorialImageUrl)}.jpg`}
                                                alt={item.productName}
                                                className="w-32 h-32 mr-4 rounded-lg"
                                            />
                                            <div>
                                                <p className="text-2xl font-semibold text-gray-900">
                                                    {item.productName}
                                                </p>
                                                <p className="text-xl text-gray-800">Quantity: {item.quantity}</p>
                                                <p className="text-xl text-green-600 font-bold">
                                                    Price: ${item.price.toFixed(2)}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6">
                                    <p className="text-2xl text-gray-800 mb-2">
                                        <span className="font-bold">Total Price: </span>${order.totalPrice.toFixed(2)}
                                    </p>
                                    <p className="text-2xl text-gray-800 mb-4">
                                        <span className="font-bold">Shipping Address: </span>
                                        {order.address}
                                    </p>
                                    <button className="w-full bg-[#92C7CF] hover:bg-[#AAD7D9] text-gray-800 font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-lg text-gray-800 text-center">No orders available</p>
                )}
            </div>
        </div>
    );
};

export default Order;
