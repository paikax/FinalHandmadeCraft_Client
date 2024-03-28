import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
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
    const [totalPriceInCart, setTotalPriceInCart] = useState(0);

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
            toast.success('Items purchased successfully!');
        } catch (error) {
            console.error('Error buying items from cart:', error);
        }
    };

    const removeFileExtension = (url) => {
        const index = url.lastIndexOf('.');
        return index > 0 ? url.substring(0, index) : url;
    };

    // Calculate total price for each item
    const calculateItemTotalPrice = (item) => {
        return (item.quantity * item.price).toFixed(2);
    };

    // Calculate total price of all items in the cart including commission
    const calculateTotalCartPrice = () => {
        const totalPriceWithoutCommission = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
        const commission = totalPriceWithoutCommission * 0.05; // Assuming 5% commission
        const totalPriceWithCommission = totalPriceWithoutCommission + commission;
        return totalPriceWithCommission.toFixed(2);
    };

    // Calculate commission for each item
    const calculateItemCommission = (item) => {
        const commission = item.price * item.quantity * 0.05; // Assuming 5% commission
        return commission.toFixed(2);
    };

    useEffect(() => {
        // Calculate the total price in the cart whenever cart items change
        const calculateTotalPriceInCart = () => {
            const totalPriceWithoutCommission = cartItems.reduce(
                (total, item) => total + item.quantity * item.price,
                0,
            );
            const commission = totalPriceWithoutCommission * 0.05; // Assuming 5% commission
            const totalPriceWithCommission = totalPriceWithoutCommission + commission;
            setTotalPriceInCart(totalPriceWithCommission.toFixed(2));

            localStorage.setItem('totalPriceInCart', totalPriceWithCommission.toFixed(2));
        };

        calculateTotalPriceInCart();
    }, [cartItems]);

    localStorage.setItem('totalPriceInCart', totalPriceInCart);

    return (
        <div className="container mx-auto p-8 max-w-[750px] rounded-md bg-[#b4d4ff]">
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
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.productId}
                                        className="flex items-center justify-between border bg-white border-gray-200 rounded-md p-4 mb-4 shadow-md"
                                    >
                                        <div className="flex items-center">
                                            <img
                                                src={`${removeFileExtension(item.imageUrl)}.jpg`}
                                                alt="ProductImage"
                                                className="w-48 h-36 object-cover rounded-md mr-4"
                                                loading="lazy"
                                            />
                                            <div>
                                                <p className="font-semibold text-4xl text-[#176B87] line-clamp-1">
                                                    {item.productName}
                                                </p>
                                                <p className="text-gray-600 mb-1">
                                                    Price: <span className="font-bold">${item.price.toFixed(2)}</span>
                                                </p>
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productId, -1)}
                                                        className="bg-[#b4d4ff] hover:bg-opacity-70 text-gray-800 font-bold py-1 px-2 rounded"
                                                    >
                                                        -
                                                    </button>
                                                    <p className="text-center mx-2 py-[2px] w-[40px] rounded border">
                                                        {item.quantity}
                                                    </p>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productId, 1)}
                                                        className="bg-[#b4d4ff] hover:bg-opacity-70 text-gray-800 font-bold py-1 px-1 rounded"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="font-semibold text-3xl w-[160px]">
                                                Total: ${calculateItemTotalPrice(item)}
                                            </p>
                                            <p className="text-2xl text-gray-500">
                                                Commission: ${calculateItemCommission(item)}
                                            </p>
                                            <button
                                                onClick={() => handleRemoveItem(item.productId)}
                                                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 flex justify-between">
                                <div>
                                    <button
                                        onClick={handleClearCart}
                                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md"
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                                <div>
                                    <p className="font-semibold text-4xl bg-white px-4 py-2 rounded-md">
                                        Total Cart Price:
                                        <span className="text-yellow-600"> ${calculateTotalCartPrice()}</span>
                                    </p>
                                </div>
                                <div>
                                    <PayPalScriptProvider
                                        options={{
                                            'client-id':
                                                'AYJzF953JIsVvMqNNV58TYQzz_8Dkk0Tr9oz47CPCQixJXuE8kCe8-BYqij7j4B8sQf_beOdmkJ5kF-k',
                                        }}
                                    >
                                        <PayPalButtons
                                            createOrder={(data, actions) => {
                                                const calculatedTotalCartPriceStorage = JSON.parse(
                                                    localStorage.getItem('totalPriceInCart'),
                                                );

                                                return actions.order.create({
                                                    purchase_units: [
                                                        {
                                                            amount: {
                                                                value: (+calculatedTotalCartPriceStorage).toFixed(2),
                                                            },
                                                        },
                                                    ],
                                                });
                                            }}
                                            onApprove={(data, actions) => {
                                                return actions.order.capture().then(function (details) {
                                                    handleBuyItems();
                                                });
                                            }}
                                        />
                                    </PayPalScriptProvider>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ShoppingCart;
