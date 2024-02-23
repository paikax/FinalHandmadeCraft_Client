import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PayPalPayment = () => {
    return (
        <PayPalScriptProvider
            options={{
                'client-id': 'AU-DtmtWhfyEmvq4FK6H7gTU6MOlrb5zzBLU_LgOx-XZ-L6M1-bh_tmxqa3prqNm0bD3lH2P-8a25E7A',
                currency: 'USD',
            }}
        >
            <div>
                <h2>Complete Your Payment</h2>
                <PayPalButtons
                    style={{ layout: 'vertical' }}
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: '1.00', // Can dynamically set the value based on the purchase
                                    },
                                },
                            ],
                        });
                    }}
                    onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                            alert('Transaction completed by ' + details.payer.name.given_name);
                            // Call your backend to save the transaction
                            // return fetch('/api/paypal-transaction-complete', {
                            //     method: 'post',
                            //     body: JSON.stringify({
                            //         orderID: data.orderID
                            //     })
                            // });
                        });
                    }}
                />
            </div>
        </PayPalScriptProvider>
    );
};

export default PayPalPayment;
