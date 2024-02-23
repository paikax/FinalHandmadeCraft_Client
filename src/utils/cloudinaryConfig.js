import axios from 'axios';
import { Cloudinary } from 'cloudinary-core';

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
    const response = await fetch('/api/user/update-avatar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Include any necessary headers, like an authentication token
        },
        body: JSON.stringify({ userId, imageUrl }),
    });

    if (!response.ok) {
        throw new Error('Failed to update avatar');
    }

    const data = await response.json();
    return data;
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
