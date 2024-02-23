// PaymentSetup.js

import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';
import { setUpPayment } from '~/services/payPalService';
import { useSelector } from 'react-redux';

const PaymentSetup = () => {
    const [error, setError] = useState('');
    const currentUserID = useSelector((state) => String(state.auth.login.currentUser?.id));

    const handleOnApprove = async (data, actions) => {
        try {
            // Set up PayPal for the user
            console.log(data);
            await setUpPayment(currentUserID, data.clientID, data.clientSecret);
            alert('PayPal setup successful.');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <PayPalScriptProvider
            options={{
                'client-id': 'AYJzF953JIsVvMqNNV58TYQzz_8Dkk0Tr9oz47CPCQixJXuE8kCe8-BYqij7j4B8sQf_beOdmkJ5kF-k', // Replace with your application's PayPal client ID
            }}
        >
            <div>
                <h2>PayPal Setup</h2>
                <div>
                    <PayPalButtons
                        createOrder={(data, actions) => {
                            return actions.order.create({
                                purchase_units: [
                                    {
                                        amount: {
                                            value: '0.01', // Change this value as per your requirements
                                        },
                                    },
                                ],
                            });
                        }}
                        onApprove={handleOnApprove}
                    />
                </div>
                {error && <div>{error}</div>}
            </div>
        </PayPalScriptProvider>
    );
};

export default PaymentSetup;
