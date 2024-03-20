import axios from 'axios';
import { useEffect, useState } from 'react';
import { unstable_HistoryRouter, useSearchParams } from 'react-router-dom';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi'; // Import icons from react-icons library
import routes from '~/config/routes';
import { useNavigate } from 'react-router-dom';
import httpRequest from '~/utils/httpRequest';

const EmailVerificationPage = () => {
    const [searchParams] = useSearchParams();
    const [verificationStatus, setVerificationStatus] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const token = searchParams.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                if (!token) {
                    throw new Error('Invalid token.');
                }

                const response = await httpRequest.get(`user/verify-email`, {
                    params: { token },
                });
                setVerificationStatus(response.data.Message);
            } catch (error) {
                setError(error.response ? error.response.data.Message : 'Error verifying email.');
            } finally {
                setIsLoading(false);
            }
        };

        verifyEmail();
    }, [token]);
    const goToHomePage = () => {
        navigate(routes.login);
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-[#47a2c1] to-[#176B87]">
            {isLoading ? (
                <p className="text-xl font-semibold text-white">Loading...</p>
            ) : (
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                    {error ? (
                        <div className="flex items-center text-red-600 mb-4">
                            <FiAlertCircle className="mr-2 text-xl" />
                            <h2 className="text-2xl font-bold">{error}</h2>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-center items-center mb-4">
                                <FiCheckCircle className="mr-2 text-green-600 text-3xl" />
                                <h2 className="text-3xl font-bold text-gray-800">{verificationStatus}</h2>
                            </div>
                            <p className="text-lg text-center text-gray-600">
                                Thank you for verifying your email. Now you can login{' '}
                            </p>
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={goToHomePage}
                                    className="bg-[#176B87] hover:bg-[#47a2c1] text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                                >
                                    Login here
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default EmailVerificationPage;
