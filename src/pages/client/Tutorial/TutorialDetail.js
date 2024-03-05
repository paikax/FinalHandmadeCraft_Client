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
    const [shippingAddress, setShippingAddress] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const { transcript, resetTranscript } = useSpeechRecognition();
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
    const [orderTotal, setOrderTotal] = useState(0);
    const [buyerEmail, setBuyerEmail] = useState('');

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

    useEffect(() => {
        if (tutorial) {
            const totalPrice = tutorial.price * quantity;
            setTotalPrice(totalPrice);
            localStorage.setItem('totalPrice', totalPrice);
        }
    }, [quantity, tutorial]);

    useEffect(() => {
        localStorage.setItem('shippingAddress', shippingAddress);
    }, [shippingAddress]);

    const openBuyModal = () => setIsBuyModalOpen(true);
    const closeBuyModal = () => setIsBuyModalOpen(false);

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
    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value);
        setQuantity(newQuantity);
        localStorage.setItem('quantity', newQuantity);
    };
    const handleBuyNow = async () => {
        try {
            setIsPaymentSuccess(false); // Reset payment success state

            const orderItem = {
                tutorialId: tutorialId,
                productName: tutorial.title,
                price: tutorial.price,
                quantity: +JSON.parse(localStorage.getItem('quantity')),
            };

            // Construct order request object with user ID, order items, total price, and address (if applicable)
            const orderRequest = {
                userId: currentUserID,
                items: [orderItem],
                totalPrice: +JSON.parse(localStorage.getItem('totalPrice')),
                address: localStorage.getItem('shippingAddress'),
                sellerEmail: tutorial.creatorPayPalEmail,
            };

            const orderResponse = await createOrder(orderRequest);

            if (orderResponse && orderResponse.id) {
                await sendPayment(tutorial.creatorPayPalEmail, +JSON.parse(localStorage.getItem('totalPrice')));

                setIsPaymentSuccess(true); // Update payment success state
                toast.success('Payment successful');
                console.log('Order created successfully:', orderResponse);
                setIsBuyModalOpen(false); // Close the buy modal
            } else {
                // Handle the case where order creation failed
                toast.error('Failed to create order');
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            toast.error('Failed to process payment');
        }
    };

    useEffect(() => {
        if (tutorial) {
            const totalPrice = tutorial.price * quantity;
            setOrderTotal(totalPrice);
        }
    }, [tutorial, quantity]);

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
                className="fixed inset-0 flex items-center justify-center"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
                shouldCloseOnEsc={true}
                contentLabel="Buy Options"
                shouldCloseOnOverlayClick={true}
            >
                <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-lg relative">
                    <button
                        className="absolute top-0 right-0 m-3 text-gray-600 hover:text-gray-800 focus:outline-none"
                        onClick={closeBuyModal}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <div className="p-8">
                        <h2 className="text-3xl font-bold mb-4 text-green-600">{tutorial.title}</h2>
                        <div className="mb-6">
                            <label className="block text-xl font-medium text-gray-700 mb-1" htmlFor="shippingAddress">
                                Shipping Address
                            </label>
                            <input
                                type="text"
                                id="shippingAddress"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500 w-full"
                                placeholder="Enter your shipping address"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-xl font-medium text-gray-700 mb-1" htmlFor="quantity">
                                Quantity (Max: 10)
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                min="1"
                                max="10"
                                value={quantity}
                                onChange={handleQuantityChange}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500 w-full"
                                placeholder="Enter quantity"
                            />
                        </div>
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-2">Product Details</h3>
                            <p className="text-xl text-gray-700">Price per item: ${tutorial.price}</p>
                            <p className="text-xl text-gray-700">Quantity: {quantity}</p>
                            <p className="text-xl text-gray-700">Total Price: ${orderTotal}</p>
                        </div>
                        <div className="mb-6">
                            <PayPalScriptProvider
                                options={{
                                    'client-id':
                                        'AYJzF953JIsVvMqNNV58TYQzz_8Dkk0Tr9oz47CPCQixJXuE8kCe8-BYqij7j4B8sQf_beOdmkJ5kF-k',
                                }}
                            >
                                <PayPalButtons
                                    createOrder={(data, actions) => {
                                        const totalPrice = JSON.parse(localStorage.getItem('totalPrice'));

                                        return actions.order.create({
                                            purchase_units: [
                                                {
                                                    amount: { value: (+totalPrice).toFixed(2) },
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
                            </PayPalScriptProvider>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* New */}
            <div className="bg-gradient-to-r bg-[#B4D4FF] text-white py-4">
                <div className="container mx-auto px-4">
                    <header className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <div className="mr-8">
                                <Link to="/" className="text-3xl font-bold text-yellow-500">
                                    M
                                </Link>
                            </div>
                            <nav className="hidden md:flex space-x-4">
                                <Link to="/" className="text-black hover:underline">
                                    Your choosing
                                </Link>
                                <Link to="/" className="text-black hover:underline">
                                    Completed
                                </Link>
                                <Link to="/" className="text-black hover:underline">
                                    News
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center">
                            <button className="bg-[#176B87] hover:bg-[#47a2c1] text-white font-bold py-2 px-4 rounded">
                                Dark Mode
                            </button>
                        </div>
                    </header>
                    <div className="flex justify-between items-center bg-[#176B87] p-4 rounded my-4">
                        <div className="flex items-center mx-4">
                            <span className="text-white">Follow Maker</span>
                            <Link to={`/profile/${tutorial.createdById}`}>
                                <button className="bg-blue-200 mx-2 rounded-full hover:bg-blue-400 text-[#176B87] font-bold py-2 px-3">
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
                            <div className="flex flex-col items-center bg-[#176B87] p-8 rounded-lg shadow-lg">
                                <video
                                    controls
                                    className="w-full h-auto object-cover rounded-md mb-6 lg:mb-8"
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
                                <h2 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6 text-white">
                                    {tutorial.title}
                                </h2>
                                <p className="text-3xl lg:text-4xl text-green-300 font-bold mb-6 lg:mb-8">
                                    ${tutorial.price}
                                </p>
                                {tutorial.createdById !== currentUserID && (
                                    <button
                                        onClick={openBuyModal}
                                        className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 lg:py-4 px-10 lg:px-12 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                                    >
                                        <i className="fas fa-shopping-cart mr-2"></i> Buy the product
                                    </button>
                                )}
                                <p className="text-lg lg:text-xl mb-6 lg:mb-8 text-white">{tutorial.instruction}</p>
                                <Link to="/" className="text-white text-lg hover:underline">
                                    + Learn More
                                </Link>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 p-4">
                            <div className="bg-[#176B87] p-8 rounded-lg shadow-lg">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2 text-white">Type:</h3>
                                    <p className="text-lg text-white">{tutorial.categoryName}</p>
                                </div>
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2 text-white">Material:</h3>
                                    <p className="text-lg text-white">{tutorial.material} ...</p>
                                </div>
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2 text-white">Uploaded by:</h3>
                                    <p className="text-lg text-white">{tutorial.userName}</p>
                                </div>
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2 text-white">Published:</h3>
                                    <p className="text-lg text-white">{tutorial.createdAt}</p>
                                </div>
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2 text-white">Views:</h3>
                                    <p className="text-lg text-white">23,445</p>
                                </div>
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2 text-white">Likes:</h3>
                                    <div className="flex items-center">
                                        <p className="text-3xl font-bold text-yellow-200 mr-2">
                                            {tutorial.likes.length}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-4 mb-6">
                                    <button
                                        className={`bg-white hover:bg-white text-blue-700 hover:text-blue-500 font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out ${
                                            isLiked ? 'text-red-500' : ''
                                        }`}
                                        onClick={handleLike}
                                    >
                                        <FontAwesomeIcon icon={faHeart} className="mr-1" />
                                        {isLiked ? 'Liked' : 'Like'}
                                    </button>
                                    <button
                                        className="bg-white hover:bg-white text-blue-700 hover:text-blue-500 font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out"
                                        onClick={openCommentModal}
                                    >
                                        <FontAwesomeIcon icon={faComment} className="mr-1" />
                                        View Comments ({tutorial.comments.length})
                                    </button>
                                </div>
                                <Modal
                                    className="flex flex-col w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto my-8 bg-white p-8 shadow-lg rounded-md"
                                    isOpen={isCommentModalOpen}
                                    onRequestClose={closeCommentModal}
                                    contentLabel="Comments Modal"
                                >
                                    <h2 className="text-4xl lg:text-3xl font-bold mb-8 text-gray-900">Comments</h2>
                                    <CommentSection
                                        comments={commentSection}
                                        currentUserID={currentUserID}
                                        onDeleteComment={handleDeleteComment}
                                        setCommentSection={setCommentSection}
                                    />
                                    <div className="mt-8">
                                        <textarea
                                            className="w-full h-32 p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring focus:ring-blue-500 text-gray-800"
                                            placeholder="Type your comment here..."
                                            value={newComment}
                                            onChange={handleCommentChange}
                                        />
                                        <button
                                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:pointer-events-none focus:outline-none"
                                            onClick={handleCommentSubmit}
                                            disabled={!newComment.trim()}
                                        >
                                            Send
                                        </button>
                                    </div>
                                    <button
                                        className="mt-8 self-end flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300 ease-in-out focus:outline-none"
                                        onClick={closeCommentModal}
                                    >
                                        <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
                                    </button>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorialDetail;
