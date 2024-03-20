import axios from 'axios';
import { Cloudinary } from 'cloudinary-core';
import httpRequest from './httpRequest';

const cl = new Cloudinary({ cloud_name: 'dutsdz5bq', secure: true });
const cloudinaryVideoUploadUrl = `https://api.cloudinary.com/v1_1/${cl.config().cloud_name}/video/upload`;
const cloudinaryImageUploadUrl = `https://api.cloudinary.com/v1_1/${cl.config().cloud_name}/image/upload`;

export default cl;

// You can place this in a utils file
export const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'profile_user_img');

    const response = await fetch(`https://api.cloudinary.com/v1_1/dutsdz5bq/image/upload`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    return data.secure_url; // URL of the uploaded image
};

export const updateAvatar = async (userId, imageUrl) => {
    try {
        const response = await httpRequest.post('user/update-avatar', { userId, imageUrl });

        if (!response.ok) {
            throw new Error('Failed to update avatar');
        }

        return response.data;
    } catch (error) {
        console.error('Error updating avatar:', error);
        throw error;
    }
};

export const uploadVideoToCloudinary = async (videoFile, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('upload_preset', 'crafts_tutorial_video');

    try {
        const response = await axios.post(cloudinaryVideoUploadUrl, formData, {
            onUploadProgress, // Pass the callback directly to axios
        });

        if (!response.data.secure_url) {
            throw new Error('Invalid response from Cloudinary');
        }

        // Return the video URL
        return response.data.secure_url;
    } catch (error) {
        console.error('Error uploading video:', error);
        throw new Error(`Failed to upload video. Details: ${error.message}`);
    }
};
