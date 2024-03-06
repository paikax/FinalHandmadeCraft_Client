// TutorialList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { FaHeart, FaComment } from 'react-icons/fa';
import { faHeart, faComment } from '@fortawesome/free-solid-svg-icons';

import { getAllTutorials } from '~/services/tutorialService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TutorialList = () => {
    const [tutorials, setTutorials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTutorials = async () => {
            try {
                const tutorialsData = await getAllTutorials();
                console.log(tutorialsData);
                setTutorials(tutorialsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching tutorials', error);
                setLoading(false);
            }
        };

        fetchTutorials();
    }, []);

    const removeFileExtension = (url) => {
        const index = url.lastIndexOf('.');
        return index > 0 ? url.substring(0, index) : url;
    };

    const isNewTutorial = (uploadTime) => {
        const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
        const today = new Date();
        return today - new Date(uploadTime) < oneDay;
    };

    const isHotTutorial = (likesCount) => {
        return likesCount > 3;
    };

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-4xl font-bold mb-8 text-center">Discover Inspiring Crafts</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid border-r-0 border-l-0"></div>
                    </div>
                ) : (
                    tutorials.map((tutorial) => (
                        <div key={tutorial.id} className="relative">
                            <Link to={`/tutorials/${tutorial.id}`}>
                                <div className="bg-white rounded-lg p-8 shadow-xl transition-transform transform hover:scale-105 h-full">
                                    {isNewTutorial(tutorial.uploadTime) && (
                                        <span className="bg-green-500 text-white px-4 py-2 rounded-full absolute top-6 right-6">
                                            New
                                        </span>
                                    )}

                                    {isHotTutorial(tutorial.likes.length) && (
                                        <span className="bg-red-500 text-white px-4 py-2 rounded-full absolute top-6 left-6">
                                            Hot
                                        </span>
                                    )}

                                    <img
                                        src={`${removeFileExtension(tutorial.videoUrl)}.jpg`}
                                        alt={tutorial.title}
                                        className="w-full h-80 object-cover mb-6 rounded-md"
                                        loading="lazy"
                                    />
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-3xl font-semibold mb-4 capitalize">{tutorial.title}</h3>
                                            <p className="text-lg text-gray-600 capitalize">
                                                Difficulty: {tutorial.difficultLevel}
                                            </p>
                                            <p className="text-lg text-gray-600 capitalize">
                                                Time: {tutorial.completionTime}
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <img
                                                src={tutorial.userProfilePicture}
                                                alt="User Profile"
                                                className="w-16 h-16 rounded-full"
                                                loading="lazy"
                                            />
                                            <span className="text-xl font-semibold ml-4 max-sm:hidden">
                                                {tutorial.userName}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between mt-6">
                                        <p className="text-lg text-gray-700 capitalize">
                                            Price: ${tutorial.price.toFixed(2)}
                                        </p>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faHeart} className="text-red-500 mr-2" />
                                                <span className="text-lg">{tutorial.likes.length}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FontAwesomeIcon icon={faComment} className="text-blue-500 mr-2" />
                                                <span className="text-lg">{tutorial.comments.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TutorialList;
