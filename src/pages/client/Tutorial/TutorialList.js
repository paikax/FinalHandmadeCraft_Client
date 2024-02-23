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
            <h2 className="text-3xl font-semibold mb-4">My Tutorials</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 border-solid border-r-0 border-l-0"></div>
                ) : (
                    tutorials.map((tutorial) => (
                        <div key={tutorial.id} className={loading ? 'pointer-events-none opacity-50' : ''}>
                            <Link to={`/tutorials/${tutorial.id}`}>
                                <div className="bg-white rounded-md p-4 shadow-md transition-transform transform hover:scale-105">
                                    {isNewTutorial(tutorial.uploadTime) && (
                                        <span className="bg-green-500 text-white px-2 py-1 rounded-md absolute top-2 right-2">
                                            New
                                        </span>
                                    )}

                                    {isHotTutorial(tutorial.likes.length) && (
                                        <span className="bg-red-500 text-white px-2 py-1 rounded-md absolute top-2 left-2">
                                            Hot
                                        </span>
                                    )}

                                    <img
                                        src={`${removeFileExtension(tutorial.videoUrl)}.jpg`}
                                        alt={tutorial.title}
                                        className="w-full h-96 object-cover mb-4 rounded-md"
                                    />
                                    <span className="text-xl font-semibold absolute bottom-4 right-20">
                                        {tutorial.userName}
                                    </span>
                                    <img
                                        src={tutorial.userProfilePicture}
                                        alt="User Profile"
                                        className="w-12 h-12 rounded-full absolute bottom-4 right-4"
                                    />

                                    <h3 className="text-2xl font-semibold mb-2 capitalize">{tutorial.title}</h3>
                                    <p className="text-xl text-gray-600 mb-2 capitalize">
                                        Difficulty Level: {tutorial.difficultLevel}
                                    </p>
                                    <p className="text-xl text-gray-600 mb-2 capitalize">
                                        Completion Time: {tutorial.completionTime}
                                    </p>
                                    <p className="text-xl text-gray-700 capitalize">
                                        Price: ${tutorial.price.toFixed(2)}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <FontAwesomeIcon icon={faHeart} className="text-red-500" />
                                        <span>{tutorial.likes.length}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <FontAwesomeIcon icon={faComment} className="text-blue-500" />
                                        <span>{tutorial.comments.length}</span>
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
