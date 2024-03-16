import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import config from '~/config';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '~/redux/authSlice';

const apiClient = axios.create({
    baseURL: 'https://localhost:5001/api/', // Update the base URL to your backend API
});

function GoogleLoginButton() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogin = async (decodedUser) => {
        const tokenId = decodedUser.credential;
        try {
            const response = await apiClient.post('/user/authenticate-google', {
                tokenId: tokenId,
            });

            if (response && response.data) {
                dispatch(loginSuccess(response.data));
                navigate(config.routes.home);
            } else {
                throw new Error('Failed to authenticate with Google.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <GoogleOAuthProvider clientId="98050732292-3h818r3q6cnmec7gihkd090p4lp3k4ji.apps.googleusercontent.com">
            <GoogleLogin
                buttonText="Login with Google"
                onSuccess={handleLogin}
                onFailure={(response) => {
                    console.log('Login Failed:', response);
                }}
                cookiePolicy={'single_host_origin'}
            />
        </GoogleOAuthProvider>
    );
}

export default GoogleLoginButton;
