import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    clearCart,
    getCartItems,
    removeFromCart,
    updateCartItemQuantity,
    buyItemsFromCart,
} from '~/services/orderService';

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUserID = useSelector((state) => String(state.auth.login.currentUser?.id));
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const items = await getCartItems(currentUserID);
                setCartItems(items);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cart items', error);
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [currentUserID]);

    const handleClearCart = async () => {
        try {
            await clearCart(currentUserID);
            setCartItems([]);
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await removeFromCart(currentUserID, productId);
            setCartItems(cartItems.filter((item) => item.productId !== productId));
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const handleQuantityChange = async (productId, change) => {
        try {
            const updatedItems = cartItems.map((item) => {
                if (item.productId === productId) {
                    const newQuantity = item.quantity + change;
                    return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
                }

                return item;
            });
            setCartItems(updatedItems);
            await updateCartItemQuantity(
                currentUserID,
                productId,
                updatedItems.find((item) => item.productId === productId).quantity,
            );
        } catch (error) {
            console.error('Error updating item quantity:', error);
        }
    };

    const handleBuyItems = async () => {
        try {
            // Assuming you have the user's address stored somewhere in your state or can pass it as a parameter
            const address = '123 Street, City, Country';
            await buyItemsFromCart(currentUserID, address);
            // After successful purchase, clear the cart and update the UI
            await handleClearCart();
        } catch (error) {
            console.error('Error buying items from cart:', error);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-4xl font-bold mb-8 text-center">Shopping Cart</h2>

            {loading ? (
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid border-r-0 border-l-0"></div>
                </div>
            ) : (
                <div>
                    {cartItems.length === 0 ? (
                        <p className="text-center">Your cart is empty.</p>
                    ) : (
                        <div>
                            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {cartItems.map((item) => (
                                    <li key={item.productId} className="border border-gray-200 rounded-md p-4">
                                        <p className="font-semibold">Product ID: {item.productId}</p>
                                        <p>Price: ${item.price.toFixed(2)}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <button
                                                onClick={() => handleQuantityChange(item.productId, -1)}
                                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-4 rounded"
                                            >
                                                -
                                            </button>
                                            <p className="mx-2">{item.quantity}</p>
                                            <button
                                                onClick={() => handleQuantityChange(item.productId, 1)}
                                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-4 rounded"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => handleRemoveItem(item.productId)}
                                                className="ml-4 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={handleClearCart}
                                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md mr-4"
                                >
                                    Clear Cart
                                </button>
                                <button
                                    onClick={handleBuyItems}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md"
                                >
                                    Buy Items
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ShoppingCart;
