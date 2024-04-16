import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddressModal from '~/components/Address/AddressModal';
import config from '~/config';
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
    const navigate = useNavigate();
    const [addressModalOpen, setAddressModalOpen] = useState(false);
    const [address, setAddress] = useState({
        street: '',
        city: '',
        province: '',
        country: '',
        postalCode: '',
        phoneNumber: '',
    });
    const [paypalButtonVisible, setPaypalButtonVisible] = useState(false);

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
            const addressCombination = `${address.street}, ${address.city}, ${address.province}, ${address.country}, ${address.postalCode}, ${address.phoneNumber}`;
            await buyItemsFromCart(currentUserID, addressCombination);
            // After successful purchase, clear the cart and update the UI
            await handleClearCart();
            navigate(config.routes.orders);
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

    useEffect(() => {
        // Check if address is complete to show PayPal button
        const isAddressComplete =
            address.street &&
            address.city &&
            address.province &&
            address.country &&
            address.postalCode &&
            address.phoneNumber;

        setPaypalButtonVisible(isAddressComplete);
    }, [address]);

    localStorage.setItem('totalPriceInCart', totalPriceInCart);

    return (
        <div className="container mx-auto p-8 max-w-[750px] rounded-md bg-[#AAD7D9]">
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
                                                <p className="font-semibold text-4xl text-gray-800 line-clamp-1">
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
                                                Transaction fee: ${calculateItemCommission(item)}
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
                                <div className="">
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
                                    <button
                                        onClick={() => setAddressModalOpen(true)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
                                    >
                                        Add Address
                                    </button>
                                    {addressModalOpen && (
                                        <div className="fixed z-10 inset-0 overflow-y-auto">
                                            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                                <div className="fixed inset-0 transition-opacity">
                                                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                                                </div>
                                                <span
                                                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                                                    aria-hidden="true"
                                                >
                                                    &#8203;
                                                </span>
                                                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                                        <div className="sm:flex sm:items-center">
                                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                                    Add Address
                                                                </h3>
                                                                <div className="mt-2">
                                                                    <div className="mb-4">
                                                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                                                            Street
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={address.street}
                                                                            onChange={(e) =>
                                                                                setAddress({
                                                                                    ...address,
                                                                                    street: e.target.value,
                                                                                })
                                                                            }
                                                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        />
                                                                    </div>
                                                                    <div className="mb-4">
                                                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                                                            City
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={address.city}
                                                                            onChange={(e) =>
                                                                                setAddress({
                                                                                    ...address,
                                                                                    city: e.target.value,
                                                                                })
                                                                            }
                                                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        />
                                                                    </div>
                                                                    <div className="mb-4">
                                                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                                                            Province
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={address.province}
                                                                            onChange={(e) =>
                                                                                setAddress({
                                                                                    ...address,
                                                                                    province: e.target.value,
                                                                                })
                                                                            }
                                                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        />
                                                                    </div>
                                                                    <div className="mb-4">
                                                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                                                            Country
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={address.country}
                                                                            onChange={(e) =>
                                                                                setAddress({
                                                                                    ...address,
                                                                                    country: e.target.value,
                                                                                })
                                                                            }
                                                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        />
                                                                    </div>
                                                                    <div className="mb-4">
                                                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                                                            Postal Code
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={address.postalCode}
                                                                            onChange={(e) =>
                                                                                setAddress({
                                                                                    ...address,
                                                                                    postalCode: e.target.value,
                                                                                })
                                                                            }
                                                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        />
                                                                    </div>
                                                                    <div className="mb-4">
                                                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                                                            Phone Number
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={address.phoneNumber}
                                                                            onChange={(e) =>
                                                                                setAddress({
                                                                                    ...address,
                                                                                    phoneNumber: e.target.value,
                                                                                })
                                                                            }
                                                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                                        <button
                                                            onClick={() => {
                                                                setAddressModalOpen(false);
                                                            }}
                                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => setAddressModalOpen(false)}
                                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {paypalButtonVisible && (
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
                                                                    value: (+calculatedTotalCartPriceStorage).toFixed(
                                                                        2,
                                                                    ),
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
                                    )}
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
