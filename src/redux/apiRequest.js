//apiRequest.js
import axios from 'axios';
import config from '~/config';
import {
    loginFailed,
    loginStart,
    loginSuccess,
    logOutFailed,
    logOutStart,
    logOutSuccess,
    registerFailed,
    registerStart,
    registerSuccess,
} from './authSlice';
import {
    deleteUserFailed,
    deleteUsersSuccess,
    deleteUserStart,
    getUsersFailed,
    getUsersStart,
    getUsersSuccess,
} from './userSlice';

import toast from 'react-hot-toast';
import httpRequest from '~/utils/httpRequest';

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await httpRequest.post('user/authenticate', user);
        dispatch(loginSuccess(res.data));
        navigate(config.routes.home);

        return res;
    } catch (err) {
        dispatch(loginFailed());
        console.error('Error during login:', err.message);
    }
};

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        const res = await httpRequest.post('user/register', user);
        dispatch(registerSuccess());
        navigate(config.routes.login);

        return res;
    } catch (err) {
        dispatch(registerFailed());
    }
};

export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
    dispatch(getUsersStart());
    try {
        const res = await axiosJWT.get('/v1/user', {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(getUsersSuccess(res.data));

        return res;
    } catch (err) {
        dispatch(getUsersFailed());
    }
};

export const deleteUser = async (accessToken, dispatch, id, axiosJWT) => {
    dispatch(deleteUserStart());
    try {
        const res = await axiosJWT.delete('/v1/user/' + id, {
            headers: { token: `Bearer ${accessToken}` },
        });
        dispatch(deleteUsersSuccess(res.data));

        return res;
    } catch (err) {
        dispatch(deleteUserFailed(err.response.data));
    }
};

export const logOut = async (dispatch, navigate) => {
    dispatch(logOutStart());
    try {
        // Assuming you have an endpoint for logging out
        const res = await httpRequest.post('user/logout');
        if (res.status === 200) {
            dispatch(logOutSuccess());
            navigate('/login'); // Redirect to login page after successful logout
        } else {
            dispatch(logOutFailed());
        }
    } catch (err) {
        dispatch(logOutFailed());
    }
};

export const getUserById = async (userId) => {
    try {
        const res = await httpRequest.get(`user/${userId}`); // Adjust the endpoint based on your API
        return res.data;
    } catch (error) {
        throw error;
    }
};

export const updateUserProfile = async (userId, user, axiosJWT) => {
    try {
        const res = await httpRequest.put(`user/${userId}`, user);
        return res.data;
    } catch (err) {
        throw err;
    }
};
export const upgradeToPremium = async (userId) => {
    try {
        const res = await httpRequest.post(`user/${userId}/upgrade-to-premium`);
        return res.data;
    } catch (err) {
        throw err;
    }
};

export const followUser = async (userId, followerId) => {
    try {
        const response = await httpRequest.post(`user/${userId}/follow/${followerId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to follow user', error);
        throw error;
    }
};

export const unfollowUser = async (userId, followerId) => {
    try {
        const response = await httpRequest.post(`user/${userId}/unfollow/${followerId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to unfollow user', error);
        throw error;
    }
};

export const getFollowers = async (userId) => {
    try {
        const response = await axios.get(`/api/User/${userId}/followers`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch followers', error);
        throw error;
    }
};

export const getFollowing = async (userId) => {
    try {
        const response = await axios.get(`/api/User/${userId}/following`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch following', error);
        throw error;
    }
};

export const checkIfFollowing = async (currentUserId, profileUserId) => {
    try {
        const response = await axios.get(`/api/User/${profileUserId}/isFollowing/${currentUserId}`);
        return response.data; // This should return a boolean
    } catch (error) {
        console.error('Failed to check if following', error);
        throw error;
    }
};

export const getLatestTutorialsByUser = async (userId, count) => {
    try {
        const response = await axios.get(`/api/User/${userId}/latest-tutorials?count=${count}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch latest tutorials by user', error);
        throw error;
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post('/api/User/forgot-password', { email });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resetPassword = async (token, password, confirmPassword) => {
    try {
        const response = await axios.post('/api/User/reset-password', { token, password, confirmPassword });
        return response.data;
    } catch (error) {
        throw error;
    }
};
