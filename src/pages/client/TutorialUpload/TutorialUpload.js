import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';

import cl, { uploadVideoToCloudinary } from '~/utils/cloudinaryConfig'; // Update the path accordingly
import { createTutorial } from '~/services/tutorialService'; // Update the path accordingly
import VideoUploadModal from '~/pages/client/TutorialUpload/videoUploadModal';
import { useNavigate } from 'react-router-dom';

const TutorialUpload = () => {
    const currentUserID = useSelector((state) => String(state.auth.login.currentUser?.id));
    const [isModalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const [tutorialData, setTutorialData] = useState({
        title: '',
        difficultLevel: '',
        completionTime: '',
        instruction: '',
        price: '',
        CreatedById: currentUserID,
    });

    const [videoUrl, setVideoUrl] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploadComplete, setUploadComplete] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTutorialData({ ...tutorialData, [name]: value });
    };

    const handleDifficultyChange = (e) => {
        setTutorialData({ ...tutorialData, difficultLevel: e.target.value });
    };

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];

        const maxSize = 1024 * 1024 * 1024;
        if (file.size > maxSize) {
            console.error('File size exceeds the limit. Please upload a video file smaller than 1GB.');
            return;
        }

        try {
            openModal(); // Open the modal on drop
            const videoUploadUrl = await uploadVideoToCloudinary(file, (progressEvent) => {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(progress);
            });

            setVideoUrl(videoUploadUrl);
            setPreviewUrl(URL.createObjectURL(file));
            setUploadProgress(0);
            setUploadComplete(true);
            closeModal(); // Close the modal on upload completion
        } catch (error) {
            console.error('Error uploading video to Cloudinary', error);
            setUploadProgress(0);
            closeModal(); // Close the modal on upload failure
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'video/*',
    });

    const handleReplaceVideo = () => {
        setVideoUrl('');
        setPreviewUrl('');
        setUploadProgress(0);
        setUploadComplete(false);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted');

        const formDataToSend = {
            ...tutorialData,
            videoUrl: videoUrl,
            CreatedById: currentUserID,
        };

        try {
            const response = await createTutorial(formDataToSend);
            console.log('Tutorial saved successfully', response);
            navigate('/tutorials');
        } catch (error) {
            console.error('Error saving tutorial', error);
        }
    };

    return (
        <div className="flex">
            {/* Left side - Video Upload */}
            <div className="flex-1 p-4">
                {!isUploadComplete && (
                    <div>
                        <button
                            onClick={openModal}
                            className="border-dashed border-2 border-gray-300 p-8 text-center cursor-pointer bg-gray-100"
                        >
                            Upload your handmade craft video
                        </button>
                    </div>
                )}

                {/* Video preview section */}
                {isUploadComplete && (
                    <div className="mt-4">
                        <label className="block text-xl font-medium text-gray-600">Video Preview</label>
                        <video controls className="mt-1 border rounded-md" style={{ maxWidth: '100%' }}>
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <button onClick={handleReplaceVideo} className="bg-blue-500 text-white p-2 mt-2 rounded-md">
                            Replace Video
                        </button>
                    </div>
                )}
            </div>

            {/* Right side - Form */}
            <div className="flex-1 p-4">
                {isModalOpen && (
                    <VideoUploadModal
                        onClose={() => {
                            closeModal();
                            handleReplaceVideo(); // Reset on modal close
                        }}
                        onDrop={onDrop}
                        getInputProps={getInputProps}
                        getRootProps={getRootProps}
                        uploadProgress={uploadProgress}
                        isUploadComplete={isUploadComplete}
                    />
                )}

                {/* {uploadProgress > 0 && (
                    <div className="mt-4">
                        <div className="bg-green-500 text-white p-2 rounded-md">Uploading... {uploadProgress}%</div>
                        <div className="w-full h-2 bg-gray-200 mt-2 rounded-md">
                            <div
                                className="bg-green-500 h-full rounded-md"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )} */}

                {isUploadComplete && (
                    <form onSubmit={handleFormSubmit}>
                        {/* Other input fields */}
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-600">
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={tutorialData.title}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border rounded-md"
                            />
                        </div>

                        {/* Dropdown for difficulty level */}
                        <div className="mb-4">
                            <label htmlFor="difficultLevel" className="block text-sm font-medium text-gray-600">
                                Difficulty Level
                            </label>
                            <select
                                id="difficultLevel"
                                name="difficultLevel"
                                value={tutorialData.difficultLevel}
                                onChange={handleDifficultyChange}
                                className="mt-1 p-2 w-full border rounded-md"
                            >
                                <option value="">Select difficulty level</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="completionTime" className="block text-sm font-medium text-gray-600">
                                Completion Time
                            </label>
                            <input
                                type="text"
                                id="completionTime"
                                name="completionTime"
                                value={tutorialData.completionTime}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border rounded-md"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="instruction" className="block text-sm font-medium text-gray-600">
                                Instruction
                            </label>
                            <textarea
                                id="instruction"
                                name="instruction"
                                value={tutorialData.instruction}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border rounded-md"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-600">
                                Price
                            </label>
                            <input
                                type="text"
                                id="price"
                                name="price"
                                value={tutorialData.price}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border rounded-md"
                            />
                        </div>

                        {/* Hidden input for videoUrl */}
                        <input type="hidden" name="videoUrl" value={videoUrl} />

                        <div className="mb-4">
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                                Add Tutorial
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default TutorialUpload;
