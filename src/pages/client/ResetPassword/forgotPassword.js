import React, { useState } from 'react';
import { forgotPassword } from '~/redux/apiRequest'; // adjust the import path as needed

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when starting the API call
        try {
            const data = await forgotPassword(email);
            setMessage(data.message);
        } catch (error) {
            setMessage('Failed to send reset password email.');
        } finally {
            setLoading(false); // Set loading to false after API call completes (success or failure)
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Forgot Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                    <button
                        type="submit"
                        className={`w-full px-4 py-2 rounded-md hover:bg-indigo-600 transition duration-300 ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-500 text-white'
                        }`}
                        disabled={loading} // Disable button when loading
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.002 8.002 0 0112 4.472v3.087c-3.042.427-5.467 2.853-5.94 5.895H6zM20 12c0-3.511-1.794-6.606-4.505-8.413l1.421-2.83A10.014 10.014 0 0122 12h-4zm-5.483 6.93a7.972 7.972 0 01-3.447 0H10.48a9.98 9.98 0 003.038 5.011l1.421-2.83zM4 12h4c0 3.511 1.794 6.606 4.505 8.413l-1.421 2.83A10.014 10.014 0 014 12zm11.517-6.93a7.972 7.972 0 013.447 0h2.592a9.98 9.98 0 00-3.038-5.011l-1.421 2.83zM10.48 6.07a7.972 7.972 0 013.038-5.01V3.57a9.98 9.98 0 00-3.447 0H6.472l1.008-2.016C9.206.988 10.579 0 12 0v4c-1.381 0-2.674.364-3.808.997L9.073 6.07zm6.037 1.354L14.464 8.99a8.014 8.014 0 01-.928 3.012h3.033a9.972 9.972 0 003.447-1.007l-1.008-2.016zM9.073 17.93a8.014 8.014 0 01.928-3.012L6.464 11.968a9.972 9.972 0 00-3.447 1.007l1.008 2.016h2.592zM14.464 15.01l1.008 2.016a9.972 9.972 0 003.447 1.007l-1.008-2.016h-3.447zM14.464 8.99l-1.008-2.016a9.972 9.972 0 00-3.447-1.007L9.073 6.07h3.447z"
                                ></path>
                            </svg>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </form>
                {message && <p className="text-center text-green-500 mt-4">{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;
