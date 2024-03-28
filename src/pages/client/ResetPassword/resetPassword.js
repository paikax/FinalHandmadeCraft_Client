import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom'; // assuming you're using react-router for navigation
import { resetPassword } from '~/redux/apiRequest'; // adjust the import path as needed

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state
    const navigate = useNavigate();
    const location = useLocation();

    const query = new URLSearchParams(location.search);
    const token = query.get('token'); // Assuming the token is passed as a URL query parameter

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords don't match.");
            return;
        }

        setLoading(true); // Set loading to true when starting the API call
        try {
            const data = await resetPassword(token, password, confirmPassword);
            setMessage(data.message);
            toast.success('Reset password successfully');
            navigate('/auth/login'); // Redirect to login page after reset
        } catch (error) {
            toast.error('Failed to reset password.');
            setMessage('Failed to reset password.');
        } finally {
            setLoading(false); // Set loading to false after API call completes (success or failure)
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Reset Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#176B87] focus:ring-2 focus:ring-indigo-200"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                    <button
                        type="submit"
                        className={`w-full px-4 py-2 bg-[#176B87] text-white rounded-md hover:bg-[#5b9fb6] transition duration-300 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
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
                            </svg>
                        ) : (
                            'Reset Password'
                        )}
                    </button>
                </form>
                {message && <p className="text-center text-gray-700 mt-4">{message}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;
