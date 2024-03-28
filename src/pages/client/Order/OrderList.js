import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';

const OrderList = ({ orders }) => {
    console.log('Orders received:', orders); // Log the orders received from props

    if (!orders || orders.length === 0) {
        return <div className="text-center text-gray-600">No orders available</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
                <Link to={`/orders/${order.id}`} key={order.id}>
                    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
                        <div className="bg-gray-100 p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <FiShoppingBag className="text-gray-500" />
                                <span className="font-semibold text-gray-700">Order ID: {order.id}</span>
                            </div>
                            <span className="text-gray-600">User ID: {order.userId}</span>
                        </div>
                        <div className="p-4">
                            <div className="text-lg font-semibold mb-2">Total Price: ${order.totalPrice}</div>
                            <div className="text-gray-600 mb-2">Address: {order.address}</div>
                            <div>
                                <h3 className="font-semibold mb-2">Items:</h3>
                                <ul className="list-disc pl-4">
                                    {order.items.map((item) => (
                                        <li key={item.productId} className="text-gray-700">
                                            {item.productName} - Quantity: {item.quantity} - Price: ${item.price}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default OrderList;
