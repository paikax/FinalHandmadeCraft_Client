import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'; // Import the Facebook login component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons'; // Import the Facebook icon

const FacebookLoginButton = ({ onLoginSuccess, onLoginFailure }) => {
    const appId = '427633146444829';

    const responseFacebook = (response) => {
        if (response.accessToken) {
            // If the user is successfully authenticated with Facebook, pass the token to the parent component
            onLoginSuccess(response.accessToken);
        } else {
            // If the authentication fails, handle it accordingly
            onLoginFailure(response);
        }
    };

    return (
        <FacebookLogin
            appId={appId}
            autoLoad={false}
            fields="name,email,picture"
            callback={responseFacebook}
            render={(renderProps) => (
                <button
                    onClick={renderProps.onClick}
                    className="w-11 h-11 items-center justify-center inline-flex rounded-full font-bold text-lg text-white bg-blue-600 hover:bg-blue-700"
                >
                    <FontAwesomeIcon icon={faFacebookF} className="text-white" />
                </button>
            )}
        />
    );
};

export default FacebookLoginButton;
