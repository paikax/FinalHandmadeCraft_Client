import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
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

    useEffect(() => {
        // Fetch user PayPal information after successful registration
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await connectPaypal(currentUserID, paypalEmail, paypalFirstName, paypalLastName);
            toast.success('PayPal information updated successfully');
            // Update user PayPal information in the component state
            setUserPayPalInfo({
                email: paypalEmail,
                firstName: paypalFirstName,
                lastName: paypalLastName,
            });
            setShowModal(false); // Close the modal after successful submission
        } catch (error) {
            toast.error('Failed to update PayPal information');
        }
    };

    const handleEdit = () => {
        // Show modal for editing PayPal information
        setShowModal(true);
    };

    return (
        <div>
            <h2>Payment Setup</h2>
            {userPayPalInfo ? (
                <div>
                    <p>User PayPal Email: {userPayPalInfo.email}</p>
                    <p>User PayPal First Name: {userPayPalInfo.firstName}</p>
                    <p>User PayPal Last Name: {userPayPalInfo.lastName}</p>
                    <button onClick={handleEdit}>Edit</button>
                </div>
            ) : (
                <button onClick={() => setShowModal(true)}>Set up PayPal Account</button>
            )}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>
                            &times;
                        </span>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={paypalEmail}
                                    onChange={(e) => setPaypalEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    value={paypalFirstName}
                                    onChange={(e) => setPaypalFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    value={paypalLastName}
                                    onChange={(e) => setPaypalLastName(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit">Save</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentSetup;
