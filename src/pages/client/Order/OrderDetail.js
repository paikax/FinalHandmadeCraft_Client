import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById } from '~/services/orderService';

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const orderData = await getOrderById(id);
                setOrder(orderData);
            } catch (error) {
                console.error('Error fetching order detail:', error);
            }
        };
        fetchOrderDetail();
    }, [id]);

    if (!order) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-4xl font-bold mb-10 text-center text-gray-900">Order Details</h1>
            <OrderInfo order={order} />
        </div>
    );
};

const Loading = () => <div className="container mx-auto flex justify-center items-center h-screen">Loading...</div>;

const OrderInfo = ({ order }) => (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-86B6F6">
        <h2 className="text-sm font-semibold mb-6 text-center text-176B87">Order #{order.id}</h2>
        <p className="text-2xl text-176B87 mb-4">
            <span className="font-bold">Total Price: </span>${order.totalPrice.toFixed(2)}
        </p>
        <p className="text-2xl text-176B87 mb-8">
            <span className="font-bold">Shipping Address: </span>
            {order.address}
        </p>
        <ul className="divide-y divide-86B6F6">
            {order.items.map((item) => (
                <OrderItem key={item.productId} item={item} />
            ))}
        </ul>
    </div>
);

const OrderItem = ({ item }) => (
    <li className="py-4 flex items-center">
        <img
            src={`${removeFileExtension(item.tutorialImageUrl)}.jpg`}
            alt={item.productName}
            className="w-48 h-48 rounded-lg"
        />
        <div className="px-5">
            <p className="text-4xl font-semibold text-176B87">{item.productName}</p>
            <p className="text-3xl text-gray-500">Quantity: {item.quantity}</p>
            <p className="text-2xl text-[#176B87]">Price: ${item.price.toFixed(2)}</p>
        </div>
    </li>
);

const removeFileExtension = (url) => {
    const index = url.lastIndexOf('.');
    return index > 0 ? url.substring(0, index) : url;
};

export default OrderDetail;
