import React from 'react';

const OrderList = ({ orders }) => {
    if (!orders || orders.length === 0) {
        return <div>No orders available</div>;
    }

    return (
        <div className="flex flex-col space-y-4">
            {orders.map((order) => (
                <div key={order.id} className="border p-4 rounded-lg">
                    <div className="font-semibold">Order ID: {order.id}</div>
                    <div>User ID: {order.userId}</div>
                    <div>Total Price: {order.totalPrice}</div>
                    <div>Address: {order.address}</div>
                    <div className="mt-2">
                        <h3 className="font-semibold mb-2">Items:</h3>
                        <ul className="list-disc pl-4">
                            {order.items.map((item) => (
                                <li key={item.productId}>
                                    {item.productName} - Quantity: {item.quantity} - Price: {item.price}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderList;
