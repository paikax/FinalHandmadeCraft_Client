import React from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';

function GoogleLoginButton() {
    const handleLogin = async (decodedUser) => {
        const tokenId = decodedUser.credential; // Extract tokenId from the decoded user object
        console.log('Token ID:', tokenId);
        try {
            const response = await axios.post('https://localhost:5001/api/user/authenticate-google', {
                tokenId: tokenId,
            });
            console.log(response.data);
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
