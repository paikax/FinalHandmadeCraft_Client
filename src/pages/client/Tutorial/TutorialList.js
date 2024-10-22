import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { faHeart, faComment, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAllTutorials } from '~/services/tutorialService';
import { addToCart, buyItemsFromCart } from '~/services/orderService';
import { useSelector } from 'react-redux';

const TutorialList = () => {
    const currentUserID = useSelector((state) => String(state.auth.login.currentUser?.id));
    const [tutorials, setTutorials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const tutorialsPerPage = 6; // Change this value to adjust the number of tutorials per page

    useEffect(() => {
        const fetchTutorials = async () => {
            try {
                const tutorialsData = await getAllTutorials();
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

    const handleAddToCart = async (productId) => {
        try {
            const item = { productId, quantity: 1 };
            await addToCart(currentUserID, item);
            alert('Item added to cart successfully!');
        } catch (error) {
            console.error('Error adding item to cart', error);
            alert('Failed to add item to cart. Please try again later.');
        }
    };

    const handleBuyFromCart = async () => {
        try {
            await buyItemsFromCart(currentUserID, 'address');
            alert('Items bought successfully!');
        } catch (error) {
            console.error('Error buying items from cart', error);
            alert('Failed to buy items from cart. Please try again later.');
        }
    };

    const indexOfLastTutorial = currentPage * tutorialsPerPage;
    const indexOfFirstTutorial = indexOfLastTutorial - tutorialsPerPage;
    const currentTutorials = tutorials.slice(indexOfFirstTutorial, indexOfLastTutorial);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl text-gray-700 uppercase font-extrabold mb-8 text-center">
                Discover <span className="text-[#4a8f92]">Inspiring Crafts</span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid border-r-0 border-l-0"></div>
                    </div>
                ) : (
                    currentTutorials.map((tutorial) => (
                        <div key={tutorial.id} className="relative">
                            <Link to={`/tutorials/${tutorial.id}`}>
                                <div className="bg-[#fff] rounded-lg p-8  transition-transform transform hover:shadow-xl hover:scale-105 h-full">
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
                                    <div className="flex justify-between items-start">
                                        <div className="flex-[2]">
                                            <h3 className="text-4xl font-semibold mb-4 capitalize line-clamp-1">
                                                {tutorial.title}
                                            </h3>
                                            <p className="text-xl font-semibold text-gray-600 capitalize">
                                                Difficulty: {tutorial.difficultLevel}
                                            </p>
                                            <p className="text-xl font-semibold text-gray-600 capitalize">
                                                Time: {tutorial.completionTime}
                                            </p>
                                        </div>
                                        <div className="flex flex-1 mt-1 scale-125 items-center">
                                            <img
                                                src={tutorial.userProfilePicture}
                                                alt="User Profile"
                                                className="w-16 h-16 rounded-full"
                                                loading="lazy"
                                            />
                                            <span className="text-lg font-semibold ml-4 max-sm:hidden">
                                                {tutorial.userName}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between mt-6">
                                        <p className="text-2xl font-semibold capitalize text-transparent bg-gradient-to-r from-[#ff7eb9] via-[#3ed3f1] to-[#176B87] bg-clip-text">
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
                                            <button
                                                className="bg-[#4a8f92] text-white px-4 py-2 rounded-lg text-xl font-semibold hover:bg-[#92C7CF] transition-all duration-300"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleAddToCart(String(tutorial.id));
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))
                )}
            </div>
            <div className="mt-8 flex justify-center">
                {Array.from({ length: Math.ceil(tutorials.length / tutorialsPerPage) }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        className={`px-4 py-2 mx-1 rounded-lg ${
                            currentPage === i + 1 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TutorialList;
