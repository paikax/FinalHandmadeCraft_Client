import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';

import cl, { uploadVideoToCloudinary } from '~/utils/cloudinaryConfig'; // Update the path accordingly
import { createTutorial } from '~/services/tutorialService'; // Update the path accordingly
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '~/services/categoryService';

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
        categoryId: '',
        material: '',
    });

    const [videoUrl, setVideoUrl] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploadComplete, setUploadComplete] = useState(false);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch categories when the component mounts
        async function fetchCategories() {
            try {
                const categoriesData = await getAllCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error fetching categories', error);
            }
        }
        fetchCategories();
    }, []);

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
            <div className="w-[65%] p-4 bg-[#176b87] mr-[10px]">
                {!isUploadComplete && (
                    <div
                        {...getRootProps()}
                        className="border-dashed border-gray-400 border-2 bg-gradient-to-r from-[#176B87] to-[#2D9AC9] p-8 text-center cursor-pointer rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
                        style={{ maxWidth: '500px', margin: '0 auto' }}
                    >
                        <input {...getInputProps()} />
                        <p className="text-white text-3xl font-extrabold mb-8">Click or drop your video</p>
                        <div className="flex justify-between items-center mb-8">
                            <p className="text-lg text-[#EEF5FF]">
                                Accepted formats: <span className="font-semibold">MP4</span>
                            </p>
                            <button className="text-[#176B87] bg-[#B4D4FF] rounded-md border border-solid border-white transition-all hover:bg-[#EEF5FF] py-3 px-6 font-semibold focus:outline-none focus:ring-2 focus:ring-[#176B87] focus:ring-opacity-50">
                                Start Upload
                            </button>
                        </div>
                        {uploadProgress > 0 && (
                            <div className="relative w-full h-4 bg-gray-300 rounded-lg overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full bg-green-500 rounded-lg"
                                    style={{ width: `${uploadProgress}%`, transition: 'width 0.3s ease-in-out' }}
                                ></div>
                            </div>
                        )}
                        {uploadProgress > 0 && (
                            <p className="mt-4 text-md text-green-500">Uploading... {uploadProgress}% complete</p>
                        )}
                    </div>
                )}

                {/* Video preview section */}
                {isUploadComplete && (
                    <div className="">
                        <label className="block text-xl font-medium text-white">Video Preview</label>
                        <video controls className="mt-1 border rounded-md" style={{ maxWidth: '100%' }}>
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <button
                            onClick={handleReplaceVideo}
                            className="bg-[#3a93d3] hover:bg-[#4590a9] text-white p-2 mt-3 rounded-md"
                        >
                            Replace Video
                        </button>
                    </div>
                )}
            </div>

            {/* Right side - Form */}
            <div className="w-[39%] p-4 bg-[#176b87] ml-[10px]">
                {isUploadComplete && (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        {/* Other input fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="title" className="block text-xl font-medium text-white">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={tutorialData.title}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 text-2xl w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out placeholder-gray-500"
                                    placeholder="Enter tutorial title"
                                    required
                                />
                            </div>
                            <div className="">
                                <label htmlFor="difficultLevel" className="block text-xl font-medium text-white">
                                    Difficulty Level
                                </label>
                                <select
                                    id="difficultLevel"
                                    name="difficultLevel"
                                    value={tutorialData.difficultLevel}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 text-2xl h-[30px] w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out placeholder-gray-500 bg-white shadow-xl"
                                    required
                                >
                                    <option disabled value="">
                                        Select difficulty level
                                    </option>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="material" className="block text-xl font-medium text-white">
                                Material
                            </label>
                            <input
                                type="text"
                                id="material"
                                name="material"
                                value={tutorialData.material}
                                onChange={handleInputChange}
                                className="mt-1 p-2 text-2xl w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out placeholder-gray-500"
                                placeholder="Enter material used"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="instruction" className="block text-xl font-medium text-white">
                                Instruction
                            </label>
                            <textarea
                                id="instruction"
                                name="instruction"
                                value={tutorialData.instruction}
                                onChange={handleInputChange}
                                className="mt-1 p-2 text-2xl w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out placeholder-gray-500"
                                placeholder="Enter tutorial instruction"
                                rows={4}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-xl font-medium text-white">
                                Price
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={tutorialData.price}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 text-2xl w-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out placeholder-gray-500 pl-10"
                                    placeholder="Enter tutorial price (Limit: $300)"
                                    min="0"
                                    max="300" // Limit the maximum value to $300
                                    step="0.01"
                                    required
                                />
                                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                                    $
                                </span>
                            </div>
                        </div>

                        <div className="relative">
                            <label htmlFor="categoryId" className="block text-xl font-medium text-white">
                                Category
                            </label>
                            <div className="relative">
                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    value={tutorialData.categoryId}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full text-2xl h-[30px] pl-3 pr-10 py-2  border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out bg-white hover:border-gray-400"
                                    required
                                >
                                    <option value="" disabled hidden>
                                        Select category
                                    </option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg
                                        className="h-6 w-6 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5l7 7-7 7"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Hidden input for videoUrl */}
                        <input type="hidden" name="videoUrl" value={videoUrl} />

                        <div>
                            <button
                                type="submit"
                                className="bg-[#3a93d3] text-white p-2 rounded-md w-full hover:bg-[#4590a9] focus:outline-none focus:ring focus:ring-blue-300 transition duration-300 ease-in-out"
                            >
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
