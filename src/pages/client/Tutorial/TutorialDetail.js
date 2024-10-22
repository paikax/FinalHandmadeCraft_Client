import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import {
    faHeart,
    faComment,
    faTimes,
    faBookBookmark,
    faShoppingCart,
    faEdit,
    faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'; // Import additional icons

import {
    addCommentToTutorial,
    addLikeToTutorial,
    addReplyToComment,
    deleteCommentFromTutorial,
    deleteReplyFromComment,
    deleteTutorial,
    getTutorialById,
    removeLikeFromTutorial,
    updateTutorial,
} from '~/services/tutorialService';
import { ClearIcon } from '~/components/Icons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import CommentSection from '~/components/Tutorial/CommentSection';
import toast from 'react-hot-toast';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { addToCart, createOrder } from '~/services/orderService';
import { sendPayment } from '~/services/payPalService';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { getUserById } from '~/redux/apiRequest';

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
    const currentEmail = useSelector((state) => String(state.auth.login.currentUser?.email));

    const [replyToCommentId, setReplyToCommentId] = useState(null);
    const [newReply, setNewReply] = useState('');
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [updatedTutorialData, setUpdatedTutorialData] = useState({
        title: '',
        difficultLevel: '',
        completionTime: '',
        instruction: '',
        material: '',
        price: 0,
    });

    const [addressModalOpen, setAddressModalOpen] = useState(false);
    const [address, setAddress] = useState({
        street: '',
        city: '',
        province: '',
        country: '',
        postalCode: '',
        phoneNumber: '',
    });

    useEffect(() => {
        // Check if address is complete to show PayPal button
        const isAddressComplete =
            address.street &&
            address.city &&
            address.province &&
            address.country &&
            address.postalCode &&
            address.phoneNumber;

        setPaypalButtonVisible(isAddressComplete);
    }, [address]);

    const [paypalButtonVisible, setPaypalButtonVisible] = useState(false);
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

            // Fetch user information for the current user
            const currentUser = await getUserById(currentUserID);
            console.log(currentUser);

            // Add the current user's information to the added comment
            addedComment.userName = currentUser.firstName + currentUser.lastName;
            addedComment.userProfilePhoto = currentUser.profilePhoto;

            setCommentSection((prevCommentSection) => [...prevCommentSection, addedComment]);

            setNewComment('');
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
            setIsPaymentSuccess(false);

            const orderItem = {
                tutorialId: tutorialId,
                productName: tutorial.title,
                price: tutorial.price,
                quantity: +JSON.parse(localStorage.getItem('quantity')),
            };

            const addressCombination = `${address.street}, ${address.city}, ${address.province}, ${address.country}, ${address.postalCode}, ${address.phoneNumber}`;
            const orderRequest = {
                userId: currentUserID,
                items: [orderItem],
                totalPrice: +JSON.parse(localStorage.getItem('totalPrice')),

                address: addressCombination,
                sellerEmail: tutorial.creatorEmail,
                buyerEmail: currentEmail,
                creatorEmail: tutorial.creatorEmail,
            };

            const orderResponse = await createOrder(orderRequest);

            if (orderResponse && orderResponse.id) {
                await sendPayment(tutorial.creatorPayPalEmail, +JSON.parse(localStorage.getItem('totalPrice')));

                setIsPaymentSuccess(true); // Update payment success state
                toast.success('Payment successful');
                console.log('Order created successfully:', orderResponse);
                setIsBuyModalOpen(false);
                toast.success('Check your order to see details');
            } else {
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

    // New event handler for adding a reply to a comment
    const handleReplySubmit = async () => {
        try {
            const addedReply = await addReplyToComment(tutorialId, replyToCommentId, newReply, currentUserID);

            // Fetch user information for the current user
            const currentUser = await getUserById(currentUserID);

            // Add the current user's information to the added reply
            addedReply.userName = currentUser.firstName + currentUser.lastName;
            addedReply.userProfilePhoto = currentUser.profilePhoto;

            // Update the comment section to include the newly added reply
            const updatedCommentSection = commentSection.map((comment) => {
                if (comment.id === replyToCommentId) {
                    return {
                        ...comment,
                        replies: [...comment.replies, addedReply],
                    };
                }
                return comment;
            });

            setCommentSection(updatedCommentSection);

            // Clear the reply form after submission
            setNewReply('');
            setReplyToCommentId(null);
            setIsReplyModalOpen(false);
        } catch (error) {
            console.error('Error submitting reply:', error);
        }
    };

    // New event handler for opening the reply modal
    const openReplyModal = (commentId) => {
        setIsCommentModalOpen(true);
        setReplyToCommentId(commentId);
    };

    const closeReplyModal = () => {
        setIsReplyModalOpen(false);
        setReplyToCommentId(null);
    };

    const handleDeleteReply = async (commentId, replyId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this reply?');

        if (isConfirmed) {
            try {
                await deleteReplyFromComment(tutorialId, commentId, replyId);

                // Update the comment section state to remove the deleted reply
                const updatedCommentSection = commentSection.map((comment) => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            replies: comment.replies.filter((reply) => reply.id !== replyId),
                        };
                    }
                    return comment;
                });

                setCommentSection(updatedCommentSection);
            } catch (error) {
                console.error('Error deleting reply:', error);
            }
        }
    };

    const handleAddToCart = async () => {
        try {
            const item = {
                productId: tutorialId,
                quantity: quantity,
            };
            // Call addToCart service function
            await addToCart(currentUserID, item);
            // Show success message or perform any other actions
            toast.success('Product added to cart');
        } catch (error) {
            console.error('Error adding item to cart', error);
            alert('Failed to add item to cart. Please try again later.');
        }
    };

    const openUpdateModal = () => {
        setIsUpdateModalOpen(true);
        setUpdatedTutorialData({
            title: tutorial.title,
            difficultLevel: tutorial.difficultLevel,
            completionTime: tutorial.completionTime,
            instruction: tutorial.instruction,
            material: tutorial.material,
            price: tutorial.price,
        });
    };

    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
    };

    const handleUpdate = async () => {
        try {
            // Call the updateTutorial function with the updated tutorial data
            await updateTutorial(tutorialId, updatedTutorialData);
            // Optionally, fetch the updated tutorial details and update the state
            const updatedTutorial = await getTutorialById(tutorialId);
            setTutorial(updatedTutorial);
            // Close the modal after successful update
            setIsUpdateModalOpen(false);
        } catch (error) {
            console.error('Error updating tutorial:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedTutorialData({
            ...updatedTutorialData,
            [name]: value,
        });
    };
    const handleDelete = async () => {
        try {
            await deleteTutorial(tutorialId);
            setTutorial(null); // Remove deleted tutorial from state
            toast.success('Tutorial deleted successfully');
        } catch (error) {
            console.error('Error deleting tutorial:', error);
            toast.error('Failed to delete tutorial');
        }
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
                        <button
                            onClick={() => setAddressModalOpen(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
                        >
                            Address
                        </button>
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
                            {paypalButtonVisible && (
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
                            )}
                        </div>
                    </div>
                </div>
            </Modal>
            {addressModalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-center">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Add Address</h3>
                                        <div className="mt-2">
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Street
                                                </label>
                                                <input
                                                    type="text"
                                                    value={address.street}
                                                    onChange={(e) =>
                                                        setAddress({
                                                            ...address,
                                                            street: e.target.value,
                                                        })
                                                    }
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    value={address.city}
                                                    onChange={(e) =>
                                                        setAddress({
                                                            ...address,
                                                            city: e.target.value,
                                                        })
                                                    }
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Province
                                                </label>
                                                <input
                                                    type="text"
                                                    value={address.province}
                                                    onChange={(e) =>
                                                        setAddress({
                                                            ...address,
                                                            province: e.target.value,
                                                        })
                                                    }
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Country
                                                </label>
                                                <input
                                                    type="text"
                                                    value={address.country}
                                                    onChange={(e) =>
                                                        setAddress({
                                                            ...address,
                                                            country: e.target.value,
                                                        })
                                                    }
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Postal Code
                                                </label>
                                                <input
                                                    type="text"
                                                    value={address.postalCode}
                                                    onChange={(e) =>
                                                        setAddress({
                                                            ...address,
                                                            postalCode: e.target.value,
                                                        })
                                                    }
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={address.phoneNumber}
                                                    onChange={(e) =>
                                                        setAddress({
                                                            ...address,
                                                            phoneNumber: e.target.value,
                                                        })
                                                    }
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={() => {
                                        setAddressModalOpen(false);
                                    }}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() => setAddressModalOpen(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="bg-gradient-to-r bg-[#FBF9F1] text-white py-4">
                <div className="container mx-auto px-4">
                    <header className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <div className="mr-8">
                                <Link to="/" className="text-3xl font-bold text-yellow-500">
                                    M
                                </Link>
                            </div>
                            <nav className="hidden md:flex space-x-4">
                                <Link to="/" className="text-black font-semibold hover:underline">
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
                                <FontAwesomeIcon icon={faBookmark} className="mr-1" />
                            </button>
                        </div>
                    </header>
                    <div className="flex justify-between items-center bg-[#AAD7D9] p-4 rounded my-4">
                        <div className="flex items-center mx-4">
                            <span className="text-gray-800 font-semibold">Follow Maker</span>
                            <Link to={`/profile/${tutorial.createdById}`} className="flex">
                                <button className="mx-4 rounded-full text-[#AAD7D9] hover:scale-125 font-bold transition-all">
                                    <img
                                        className="w-12 h-12 rounded-full"
                                        src={tutorial.userProfilePicture}
                                        alt="creator avatar"
                                        loading="lazy"
                                    />
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-wrap lg:flex-nowrap">
                        <div className="w-full lg:w-1/2 p-4">
                            <div className="flex flex-col items-center bg-[#92C7CF] p-8 rounded-lg shadow-lg">
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
                                <h2 className="text-3xl lg:text-5xl font-semibold mb-4 lg:mb-6 text-gray-800">
                                    {tutorial.title}
                                </h2>
                                <p className="text-3xl lg:text-4xl text-white font-bold mb-3">
                                    Price:
                                    <span className="text-red-500"> ${tutorial.price.toFixed(2)}</span>
                                </p>

                                <div className="flex justify-around w-full items-center mt-5">
                                    {tutorial.createdById !== currentUserID && (
                                        <button
                                            onClick={openBuyModal}
                                            className="w-[215px] bg-green-600 hover:bg-green-500 text-white font-bold py-3 lg:py-4 px-10 lg:px-12 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                                        >
                                            <i className="fas fa-shopping-cart mr-2"></i> Buy the product
                                        </button>
                                    )}
                                    <button
                                        className="w-[215px] bg-blue-500 text-white font-bold py-3 lg:py-4 px-10 lg:px-12 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 flex items-center hover:scale-105 justify-center"
                                        onClick={handleAddToCart}
                                    >
                                        <FontAwesomeIcon icon={faShoppingCart} className="mr-2" /> Add to Cart
                                    </button>
                                </div>

                                <p className="text-lg lg:text-xl mb-6 mt-6 lg:mb-8 text-gray-800 font-semibold">
                                    {tutorial.instruction}
                                </p>

                                <Link to="/" className="text-gray-600 text-lg hover:underline">
                                    + Learn More
                                </Link>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 p-4">
                            <div className="bg-[#AAD7D9] p-8 rounded-lg shadow-lg">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2 text-gray-700">Type:</h3>
                                    <p className="text-lg text-gray-700">{tutorial.categoryName}</p>
                                </div>
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2 text-gray-700">Material:</h3>
                                    <p className="text-lg text-gray-700">{tutorial.material} ...</p>
                                </div>
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2 text-gray-700">Uploaded by:</h3>
                                    <p className="text-lg text-gray-700">
                                        <span className="">{tutorial.userName}</span>
                                    </p>
                                </div>
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2 text-gray-700">Published:</h3>
                                    <p className="text-lg text-gray-700">{tutorial.createdAt}</p>
                                </div>
                                {/* <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2 text-white">Views:</h3>
                                    <p className="text-lg text-white">23,445</p>
                                </div> */}
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold mb-2 text-gray-700">Likes:</h3>
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
                                        onOpenReplyModal={openReplyModal}
                                        onDeleteReply={handleDeleteReply}
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
                                <Modal
                                    className="flex flex-col w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto my-8 bg-white p-8 shadow-lg rounded-md"
                                    isOpen={isCommentModalOpen && !!replyToCommentId}
                                    onRequestClose={closeCommentModal}
                                    contentLabel="Comments Modal"
                                >
                                    <h2 className="text-4xl lg:text-3xl font-bold mb-8 text-gray-900">
                                        Reply to Comment
                                    </h2>
                                    <textarea
                                        className="w-full h-32 p-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring focus:ring-blue-500 text-gray-800"
                                        placeholder="Type your reply here..."
                                        value={newReply}
                                        onChange={(e) => setNewReply(e.target.value)}
                                    />
                                    <button
                                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:pointer-events-none focus:outline-none"
                                        onClick={handleReplySubmit}
                                        disabled={!newReply.trim()}
                                    >
                                        Send
                                    </button>
                                    <button
                                        className="mt-8 self-end flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-300 ease-in-out focus:outline-none"
                                        onClick={closeReplyModal}
                                    >
                                        <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
                                    </button>
                                </Modal>
                                {tutorial.createdById === currentUserID && (
                                    <>
                                        <button
                                            className="bg-blue-500 mb-3 hover:bg-blue-600 rounded-lg font-semibold text-white px-4 py-2 flex items-center space-x-2"
                                            onClick={openUpdateModal}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                            <span>Update</span>
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-600 rounded-lg w-34 text-center font-semibold text-white px-4 py-2 flex items-center space-x-2"
                                            onClick={handleDelete}
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                            <span>Delete</span>
                                        </button>
                                    </>
                                )}

                                {/* Modal for updating the tutorial */}
                                <Modal
                                    isOpen={isUpdateModalOpen}
                                    onRequestClose={closeUpdateModal}
                                    contentLabel="Update Tutorial Modal"
                                    className="flex flex-col w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto my-8 bg-white p-8 shadow-lg rounded-md"
                                >
                                    <h2 className="text-3xl text-center lg:text-4xl font-bold mb-4 text-gray-800">
                                        Update Tutorial
                                    </h2>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="title"
                                            className="block text-lg font-semibold text-gray-800 mb-1"
                                        >
                                            Title:
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={updatedTutorialData.title}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:[#4a8f92] w-full"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="difficultLevel"
                                            className="block text-lg font-semibold text-gray-800 mb-1"
                                        >
                                            Difficult Level:
                                        </label>
                                        <input
                                            type="text"
                                            id="difficultLevel"
                                            name="difficultLevel"
                                            value={updatedTutorialData.difficultLevel}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:[#4a8f92] w-full"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="completionTime"
                                            className="block text-lg font-semibold text-gray-800 mb-1"
                                        >
                                            Completion Time:
                                        </label>
                                        <input
                                            type="text"
                                            id="completionTime"
                                            name="completionTime"
                                            value={updatedTutorialData.completionTime}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:[#4a8f92] w-full"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="instruction"
                                            className="block text-lg font-semibold text-gray-800 mb-1"
                                        >
                                            Instruction:
                                        </label>
                                        <textarea
                                            id="instruction"
                                            name="instruction"
                                            value={updatedTutorialData.instruction}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:[#4a8f92] w-full h-32 resize-none"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="material"
                                            className="block text-lg font-semibold text-gray-800 mb-1"
                                        >
                                            Material:
                                        </label>
                                        <input
                                            type="text"
                                            id="material"
                                            name="material"
                                            value={updatedTutorialData.material}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:[#4a8f92] w-full"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="price"
                                            className="block text-lg font-semibold text-gray-800 mb-1"
                                        >
                                            Price:
                                        </label>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            value={updatedTutorialData.price}
                                            onChange={handleInputChange}
                                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:[#4a8f92] w-full"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleUpdate}
                                            className="bg-[#92C7CF] text-gray-800 font-bold py-3 px-6 rounded-md hover:bg-[#AAD7D9] transition duration-300 ease-in-out mr-4"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={closeUpdateModal}
                                            className="bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-md hover:bg-gray-400 transition duration-300 ease-in-out"
                                        >
                                            Cancel
                                        </button>
                                    </div>
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
