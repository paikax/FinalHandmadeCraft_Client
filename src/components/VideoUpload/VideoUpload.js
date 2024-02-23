// components/VideoUpload.js
import React, { useState } from 'react';
import cl, { uploadVideoToCloudinary } from '~/utils/cloudinaryConfig'; // Update the path accordingly

const VideoUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [videoPreview, setVideoPreview] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        setUploadProgress(0);

        // Create a preview URL for the selected video file
        setVideoPreview(file ? URL.createObjectURL(file) : '');
    };

    const handleUpload = async () => {
        try {
            if (!selectedFile) {
                console.error('No file selected for upload');
                return;
            }

            setUploading(true);

            await uploadVideoToCloudinary(selectedFile, (progressEvent) => {
                const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                setUploadProgress(progress);
            });

            console.log('Upload successful!');
            // Handle response, e.g., save video details to backend or update UI
        } catch (error) {
            console.error('Error uploading video:', error);
            // Handle errors, update UI, etc.
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8">
            <input type="file" onChange={handleFileChange} className="mb-4" />

            {videoPreview && (
                <div className="mb-4">
                    <video
                        src={videoPreview}
                        controls
                        className="w-full h-auto"
                        style={{ maxHeight: '300px' }} // Set a max height for the preview
                    ></video>
                </div>
            )}

            {uploading && (
                <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
                                Upload Progress
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-teal-600">
                                {`${uploadProgress}%`}
                            </span>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="flex flex-col w-full">
                            <div className="shadow w-full bg-gray-200 mt-1">
                                <div
                                    className="bg-teal-500 text-xs leading-none py-1 text-center text-white"
                                    style={{ width: `${uploadProgress}%` }}
                                >
                                    {`${uploadProgress}%`}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className={`${
                    uploading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'
                } text-white font-bold py-2 px-4 rounded`}
            >
                {uploading ? 'Uploading...' : 'Upload Video'}
            </button>
        </div>
    );
};

export default VideoUpload;
