import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { getUserById, updateUserProfile } from '~/redux/apiRequest';
import { connectPaypal } from '~/services/payPalService';

const PaymentSetup = () => {
    const [showModal, setShowModal] = useState(false);
    const [paypalEmail, setPaypalEmail] = useState('');
    const [paypalFirstName, setPaypalFirstName] = useState('');
    const [paypalLastName, setPaypalLastName] = useState('');
    const [userPayPalInfo, setUserPayPalInfo] = useState(null);
    const currentUserID = useSelector((state) => String(state.auth.login.currentUser?.id));
    const modalRef = useRef(null);

    useEffect(() => {
        const fetchUserPayPalInfo = async () => {
            try {
                const user = await getUserById(currentUserID);
                setUserPayPalInfo({
                    email: user.payPalEmail,
                    firstName: user.payPalFirstName,
                    lastName: user.payPalLastName,
                });
            } catch (error) {
                console.error('Failed to fetch user PayPal information:', error);
            }
        };

        fetchUserPayPalInfo();
    }, [currentUserID]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowModal(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await connectPaypal(currentUserID, paypalEmail, paypalFirstName, paypalLastName);
            toast.success('PayPal information updated successfully');
            toast.success('Congratulations you now become Creator');
            setUserPayPalInfo({
                email: paypalEmail,
                firstName: paypalFirstName,
                lastName: paypalLastName,
            });
            setShowModal(false);
        } catch (error) {
            toast.error('Failed to update PayPal information');
        }
    };

    const handleEdit = () => {
        if (userPayPalInfo) {
            setPaypalEmail(userPayPalInfo.email);
            setPaypalFirstName(userPayPalInfo.firstName);
            setPaypalLastName(userPayPalInfo.lastName);
        }
        setShowModal(true);
    };

    return (
        <div
            style={{
                backgroundImage: `url(${require('~/assets/images/paymentSetup/paymentSetupBg.jpg')})`,
            }}
            className="flex bg-no-repeat bg-cover items-center justify-center min-h-screen"
        >
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
                <div>
                    <h2 className="text-4xl font-bold mb-6 p-6 text-center text-gray-800">Become a Creator</h2>
                    <p className="text-center text-gray-700 mb-8">
                        By entering your payment method here, you'll unlock the ability to sell your products and
                        unleash your creativity as a creator.
                    </p>
                </div>

                {userPayPalInfo ? (
                    <div className="mb-6">
                        <p className="text-2xl mb-2 text-gray-700">PayPal Email: {userPayPalInfo.email}</p>
                        <p className="text-2xl mb-2 text-gray-700">First Name: {userPayPalInfo.firstName}</p>
                        <p className="text-2xl mb-2 text-gray-700">Last Name: {userPayPalInfo.lastName}</p>
                        <button
                            onClick={handleEdit}
                            className="bg-[#4a8f92] text-white px-4 py-2 rounded-md hover:bg-[#92C7CF] transition duration-300 ease-in-out flex items-center justify-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2 0a5 5 0 11-10 0 5 5 0 0110 0zm2 0a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            Edit
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-[#4a8f92] text-white px-6 py-3 rounded-full hover:bg-[#92C7CF] transition duration-300 ease-in-out flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        Set up PayPal Account
                    </button>
                )}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div ref={modalRef} className="bg-white p-8 rounded-lg z-50 max-w-md w-full relative">
                            <button
                                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
                                onClick={() => setShowModal(false)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-3lg mb-2 text-gray-800">
                                        Email:
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={paypalEmail}
                                        onChange={(e) => setPaypalEmail(e.target.value)}
                                        required
                                        className="border text-black border-gray-300 bg-[#ddd] rounded-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="firstName" className="block text-3lg mb-2 text-gray-800">
                                        First Name:
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        value={paypalFirstName}
                                        onChange={(e) => setPaypalFirstName(e.target.value)}
                                        required
                                        className="border border-gray-300 bg-[#ddd] text-black rounded-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-3lg mb-2 text-gray-800">
                                        Last Name:
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        value={paypalLastName}
                                        onChange={(e) => setPaypalLastName(e.target.value)}
                                        required
                                        className="border border-gray-300 bg-[#ddd] text-black rounded-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-[#92C7CF] text-gray-800 px-6 py-3 rounded-full hover:bg-[#AAD7D9] transition duration-300 ease-in-out w-full"
                                >
                                    Save
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSetup;
