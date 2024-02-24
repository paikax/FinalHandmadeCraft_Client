import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import { faHeart, faComment, faTimes } from '@fortawesome/free-solid-svg-icons'; // Import additional icons

import {
    addCommentToTutorial,
    addLikeToTutorial,
    deleteCommentFromTutorial,
    getTutorialById,
    removeLikeFromTutorial,
} from '~/services/tutorialService';
import { ClearIcon } from '~/components/Icons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import CommentSection from '~/components/Tutorial/CommentSection';
import toast from 'react-hot-toast';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { createOrder } from '~/services/orderService';
import { sendPayment } from '~/services/payPalService';

const TutorialDetail = () => {
    const { tutorialId } = useParams();
    const [tutorial, setTutorial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [commentSection, setCommentSection] = useState([]);
    const [modalKey, setModalKey] = useState(0);
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const currentUserID = useSelector((state) => String(state.auth.login.currentUser?.id));
    const { transcript, resetTranscript } = useSpeechRecognition();
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

    useEffect(() => {
        const fetchTutorial = async () => {
            try {
                const tutorialData = await getTutorialById(tutorialId);
                setTutorial(tutorialData);

                // Initialize comment section with existing comments
                setCommentSection(tutorialData.comments || []);

                setLoading(false);
                setIsLiked(tutorialData.likes.some((like) => like.userId === currentUserID));
            } catch (error) {
                console.error('Error fetching tutorial details', error);
                setLoading(false);
            }
        };

        fetchTutorial();
    }, [tutorialId, currentUserID, isLiked]);

    useEffect(() => {
        setLoading(true);
        const fetchTutorial = async () => {
            try {
                const tutorialData = await getTutorialById(tutorialId);
                setTutorial(tutorialData);

                // Initialize comment section with existing comments
                setCommentSection(tutorialData.comments || []);

                setLoading(false);
                setIsLiked(tutorialData.likes.some((like) => like.userId === currentUserID));
            } catch (error) {
                console.error('Error fetching tutorial details', error);
                setLoading(false);
            }
        };
        fetchTutorial();
    }, [tutorialId]);

    const openBuyModal = () => setIsBuyModalOpen(true);
    const closeBuyModal = () => setIsBuyModalOpen(false);

    const handleBuyNow = async () => {
        try {
            setIsPaymentSuccess(false); // Reset payment success state
            setIsBuyModalOpen(false); // Close the buy modal

            // Construct order item with necessary information
            const orderItem = {
                tutorialId: tutorialId,
                quantity: 1, // Assuming quantity is fixed to 1 for now
                price: tutorial.price, // Pass the tutorial price to the order item
            };

            // Construct order request object with user ID, order items, total price, and address (if applicable)
            const orderRequest = {
                userId: currentUserID,
                items: [orderItem],
                totalPrice: tutorial.price, // Pass the total price of the order
                address: '', // Add the address if available
            };

            // Call the createOrder function with the constructed order request
            const orderResponse = await createOrder(orderRequest);

            // Check if order creation was successful
            if (orderResponse && orderResponse.OrderId) {
                // If order was created successfully, send payment
                await sendPayment(tutorial.paypalEmail, tutorial.price);

                setIsPaymentSuccess(true); // Update payment success state
                toast.success('Payment successful');
            } else {
                // Handle the case where order creation failed
                toast.error('Failed to create order');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            toast.error('Failed to process payment');
        }
    };

    const handleAddToCart = async () => {
        alert('Add to Cart feature will be implemented');
    };

    const openCommentModal = () => {
        setIsCommentModalOpen(true);
        // Increment the modalKey to force a re-render of the modal
        setModalKey((prevKey) => prevKey + 1);
    };

    const closeCommentModal = () => {
        setIsCommentModalOpen(false);
        // Increment the modalKey to force a re-render of the modal
        setModalKey((prevKey) => prevKey + 1);
    };
    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleLike = async () => {
        try {
            let updatedTutorial;

            if (isLiked) {
                const likeToRemove = tutorial.likes.find((like) => like.userId === currentUserID);
                if (likeToRemove) {
                    await removeLikeFromTutorial(tutorialId, likeToRemove.id);
                    updatedTutorial = {
                        ...tutorial,
                        likes: tutorial.likes.filter((like) => like.userId !== currentUserID),
                    };
                }
                setIsLiked(false);
            } else {
                const addedLike = await addLikeToTutorial(tutorialId, currentUserID);
                updatedTutorial = {
                    ...tutorial,
                    likes: [...tutorial.likes, addedLike],
                };
                setIsLiked(true);
            }

            setTutorial(updatedTutorial);
        } catch (error) {
            console.error('Error handling like:', error);
        }
    };

    // Use useEffect to update isLiked state after setTutorial
    useEffect(() => {
        if (tutorial) {
            setIsLiked(tutorial.likes.some((like) => like.userId === currentUserID));
        }
    }, [tutorial, currentUserID]);

    const handleCommentSubmit = async () => {
        try {
            const addedComment = await addCommentToTutorial(tutorialId, newComment, currentUserID);

            // Update the comments section state
            setCommentSection((prevCommentSection) => [...prevCommentSection, addedComment]);

            setNewComment(''); // Clear the new comment input field
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this comment?');

        if (isConfirmed) {
            try {
                await deleteCommentFromTutorial(tutorialId, commentId);

                const updatedTutorial = {
                    ...tutorial,
                    comments: tutorial.comments.filter((comment) => comment.id !== commentId),
                };

                setTutorial(updatedTutorial);

                setCommentSection((prevCommentSection) =>
                    prevCommentSection.filter((comment) => comment.id !== commentId),
                );
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    };

    const handleVideoPlay = () => {
        SpeechRecognition.startListening();
    };

    const handleVideoPause = () => {
        SpeechRecognition.stopListening();
        console.log('Transcript:', transcript);
        resetTranscript();
    };

    if (loading) {
        return <div className="text-center mt-8">Loading...</div>;
    }

    if (!tutorial) {
        return <div className="text-center mt-8">Tutorial not found</div>;
    }

    return (
        <div className="container mx-auto p-8 mb-10">
            <p className="text-xl text-left mx-2 my-2">Tutorial · Product</p>
            <Modal
                isOpen={!isPaymentSuccess && isBuyModalOpen}
                onRequestClose={closeBuyModal}
                className="fixed inset-0 flex items-center justify-center p-4"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
                contentLabel="Buy Options"
            >
                {isPaymentSuccess ? ( // If payment is successful, display success message
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-sm">
                        <div className="p-5">
                            <h2 className="text-2xl font-bold mb-2">Order Successful!</h2>
                            <p className="text-sm text-gray-700">Thank you for your purchase.</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-sm">
                        <div className="p-5">
                            <PayPalScriptProvider
                                options={{
                                    'client-id':
                                        'AYJzF953JIsVvMqNNV58TYQzz_8Dkk0Tr9oz47CPCQixJXuE8kCe8-BYqij7j4B8sQf_beOdmkJ5kF-k',
                                }}
                            >
                                <div className="container mx-auto p-8 mb-10">
                                    <PayPalButtons
                                        style={{ layout: 'horizontal' }}
                                        createOrder={(data, actions) => {
                                            return actions.order.create({
                                                purchase_units: [
                                                    {
                                                        amount: {
                                                            value: tutorial.price,
                                                        },
                                                    },
                                                ],
                                            });
                                        }}
                                        onApprove={(data, actions) => {
                                            return actions.order.capture().then(function (details) {
                                                handleBuyNow();
                                            });
                                        }}
                                    />
                                </div>
                            </PayPalScriptProvider>
                        </div>
                    </div>
                )}
            </Modal>

            {/* New */}
            <div className="bg-gradient-to-r from-purple-300 to-blue-400 text-white py-4">
                <div className="container mx-auto px-4">
                    <header className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <div className="mr-8">
                                <Link to="/" className="text-3xl font-bold text-white">
                                    T
                                </Link>
                            </div>
                            <nav className="hidden md:flex space-x-4">
                                <Link to="/" className="text-black hover:text-gray-300">
                                    Your choosing
                                </Link>
                                <Link to="/" className="text-orange-600 hover:text-orange-500">
                                    Completed
                                </Link>
                                {/* <div className="relative inline-block text-left dropdown">
                                    <span className="rounded-md shadow-sm">
                                        <button
                                            aria-controls="headlessui-menu-items-117"
                                            aria-expanded="true"
                                            aria-haspopup="true"
                                            className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white hover:text-gray-300 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
                                            type="button"
                                        >
                                            Types
                                            <svg
                                                className="w-5 h-5 ml-2 -mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M7 7l3-3 3 3m0 6l-3 3-3-3"></path>
                                            </svg>
                                        </button>
                                    </span>
                                </div>
                                <Link to="/" className="text-black hover:text-gray-300">
                                    A-Z List
                                </Link> */}
                                <Link to="/" className="text-black hover:text-gray-300">
                                    News
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center">
                            {/* <Link to="/" className="text-black hover:text-gray-300 mr-4">
                                Follow maker:
                            </Link>
                            <Link to="/" className="text-black hover:text-gray-300 mr-4">
                                <i className="fab fa-reddit-alien"></i>
                            </Link>
                            <Link to="/" className="text-black hover:text-gray-300 mr-4">
                                <i className="fab fa-twitter"></i>
                            </Link>
                            <Link to="/" className="text-white hover:text-gray-300 mr-4">
                                <i className="fab fa-discord"></i>
                            </Link> */}
                            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded">
                                Dark Mode
                            </button>
                        </div>
                    </header>
                    <div className="flex justify-between items-center bg-blue-600 p-4 rounded my-4">
                        <div className="flex items-center mx-4">
                            <span>Follow Maker</span>
                            <Link to={`/profile/${tutorial.createdById}`}>
                                <button className="bg-blue-200 mx-2 rounded-full hover:bg-blue-200 text-white font-bold py-2 px-3">
                                    <img
                                        className="w-12 h-12 rounded-full"
                                        src={tutorial.userProfilePicture}
                                        alt="creator avatar"
                                    />
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-wrap lg:flex-nowrap">
                        <div className="w-full lg:w-1/2 p-4">
                            <div className="flex flex-col items-center bg-blue-500 p-6 rounded-lg">
                                <video
                                    controls
                                    className="w-full h-auto object-cover rounded-md mb-4"
                                    onPlay={handleVideoPlay}
                                    onPause={handleVideoPause}
                                >
                                    <source src={tutorial.videoUrl} type="video/mp4" />
                                    <track
                                        kind="subtitles"
                                        src={tutorial.subtitlesUrl}
                                        srcLang="en"
                                        label="English"
                                        default
                                    />
                                    Your browser does not support the video tag.
                                </video>
                                <h2 className="text-3xl font-bold mb-2">{tutorial.title}</h2>
                                <p className="text-2xl text-green-300 font-bold mb-4">${tutorial.price}</p>
                                <button
                                    onClick={openBuyModal}
                                    className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded mb-4"
                                >
                                    <i className="fas fa-book-open"></i> Buy the product
                                </button>
                                <div className="flex space-x-2 mb-4">
                                    <span className="bg-purple-600 hover:bg-purple-500 text-xl rounded-md px-3 py-1 text-white">
                                        Difficult Level: {tutorial.difficultLevel}
                                    </span>
                                </div>
                                <p className="text-sm mb-4">{tutorial.instruction}</p>
                                <Link to="/" className="text-white text-lg">
                                    + Read full
                                </Link>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 p-4">
                            <div className="bg-blue-500 p-6 rounded-lg">
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold mb-2">Type:</h3>
                                    <p className="text-sm">Manga</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold mb-2">Material:</h3>
                                    <p className="text-sm">... ... ...</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold mb-2">Uploaded by</h3>
                                    <p className="text-sm">{tutorial.userName}</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold mb-2">Published:</h3>
                                    <p className="text-sm">{tutorial.createdAt}</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold mb-2">Views:</h3>
                                    <p className="text-sm">23,445</p>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold mb-2">Likes:</h3>
                                    <div className="flex items-center">
                                        <p className="text-3xl font-bold text-yellow-200 mr-2">
                                            {tutorial.likes.length}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-2 mb-4">
                                    <button
                                        className={`bg-white hover:bg-white text-blue-700 hover:text-blue-500 ${
                                            isLiked ? 'text-red-500' : ''
                                        } font-bold py-2 px-4 rounded`}
                                        onClick={handleLike}
                                    >
                                        <FontAwesomeIcon icon={faHeart} className="mr-1" />
                                        {isLiked ? 'Liked' : 'Like'}
                                    </button>
                                </div>
                                <div className="flex space-x-2 mb4">
                                    <button
                                        className="bg-white px-2 py-2 rounded-md text-xl font-bold text-blue-500
                                        hover:text-blue-400 cursor-pointer"
                                        onClick={openCommentModal}
                                    >
                                        View Comments {tutorial.comments.length}
                                    </button>
                                    <Modal
                                        className="flex flex-col w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto my-8 bg-white p-8 shadow-[1px_1px_12px_rgba(0,0,0,0.15)] rounded-md"
                                        isOpen={isCommentModalOpen}
                                        onRequestClose={closeCommentModal}
                                        contentLabel="Comments Modal"
                                    >
                                        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
                                        <CommentSection
                                            comments={commentSection}
                                            currentUserID={currentUserID}
                                            onDeleteComment={handleDeleteComment}
                                            setCommentSection={setCommentSection}
                                        />

                                        <div className="mt-4">
                                            <textarea
                                                className="w-full h-20 p-2 border border-gray-300 rounded-md"
                                                placeholder="Type your comment here..."
                                                value={newComment}
                                                onChange={handleCommentChange}
                                            />
                                            <button
                                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                                                onClick={handleCommentSubmit}
                                                disabled={!newComment.trim()}
                                            >
                                                Submit Comment
                                            </button>
                                        </div>
                                        <button
                                            className="mt-4 self-end flex items-center justify-center w-[40px] h-[40px] rounded-full hover:bg-[rgba(0,0,0,0.05)]"
                                            onClick={closeCommentModal}
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="flex space-x-2 my-4">
                        <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
                            <i className="fab fa-facebook-f"></i> Share
                        </button>
                        <button className="bg-blue-400 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded">
                            <i className="fab fa-twitter"></i> Tweet
                        </button>
                        <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded">
                            <i className="fab fa-pinterest-p"></i> Share
                        </button>
                        <button className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded">
                            <i className="fab fa-reddit-alien"></i> Share
                        </button>
                        <button className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded">
                            <i className="fab fa-whatsapp"></i> Share
                        </button>
                    </div> */}
                    <div className="bg-blue-700 my-2 text-center p-4">
                        <span className="text-xl my-2">PRIVACY</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorialDetail;
