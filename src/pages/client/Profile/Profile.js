import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faImages, faEdit, faStar, faGift, faTimes } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

import {
    getUserById,
    updateUserProfile,
    upgradeToPremium,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    checkIfFollowing,
} from '~/redux/apiRequest';
import { updateAvatar, uploadImageToCloudinary } from '~/utils/cloudinaryConfig';
import ImageCropper from '~/utils/ImageCropper';
import { capturePayment, createOrder } from '~/services/payPalService';
import { useSelector } from 'react-redux';

const Profile = () => {
    const currentUserID = useSelector((state) => String(state.auth.login.currentUser?.id));
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const [uploadImage, setUploadImage] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [isCroppedImageVisible, setIsCroppedImageVisible] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    // States for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        profilePhoto: '',
        phoneNumber: '',
        address: '',
    });
    const [isPremium, setIsPremium] = useState(false);
    const [showPayPalButtons, setShowPayPalButtons] = useState(false);
    const [showBenefitsModal, setShowBenefitsModal] = useState(false);
    const amount = '10.00';
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const fetchedUser = await getUserById(userId);
                setUser(fetchedUser);
                // Retrieve the updated profile picture URL from localStorage
                const storedProfilePhoto = localStorage.getItem('profilePhoto');

                // Set initial form data
                setFormData({
                    firstName: fetchedUser.firstName,
                    lastName: fetchedUser.lastName,
                    email: fetchedUser.email,
                    password: '',
                    profilePhoto: storedProfilePhoto || fetchedUser.profilePhoto,
                    phoneNumber: fetchedUser.phoneNumber,
                    address: fetchedUser.address,
                });

                setIsPremium(fetchedUser.isPremium);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        const fetchFollowersAndFollowing = async () => {
            try {
                const isCurrentlyFollowing = await checkIfFollowing(currentUserID, userId);
                console.log(isCurrentlyFollowing);
                setIsFollowing(isCurrentlyFollowing);
                const followers = await getFollowers(userId);
                const following = await getFollowing(userId);

                setFollowerCount(followers.length); // Update the state with the count
                setFollowingCount(following.length); // Update the state with the count
            } catch (error) {
                console.error('Error fetching followers and following:', error);
            }
        };

        fetchFollowersAndFollowing();

        fetchUserProfile();
    }, [userId, currentUserID]);

    const handleCropComplete = (croppedImage) => {
        setProfilePicture(croppedImage);
        setIsCroppedImageVisible(true); // Show the cropped image only after saving
    };

    const handleRemoveImage = () => {
        setProfilePicture(null);
        setIsCroppedImageVisible(false);
        setUploadImage(false);
    };

    const handleEditProfile = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setUploadImage(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdateProfile = async () => {
        try {
            setIsUpdatingProfile(true);
            const updatedFields = {};

            // Check if each field in formData is different from the user's current data
            if (formData.firstName !== user.firstName) {
                updatedFields.firstName = formData.firstName;
            }

            if (formData.lastName !== user.lastName) {
                updatedFields.lastName = formData.lastName;
            }

            if (formData.email !== user.email) {
                updatedFields.email = formData.email;
            }

            if (formData.profilePhoto !== user.profilePhoto) {
                updatedFields.profilePhoto = formData.profilePhoto;
            }

            if (formData.phoneNumber !== user.phoneNumber) {
                updatedFields.phoneNumber = formData.phoneNumber;
            }

            if (formData.address !== user.address) {
                updatedFields.address = formData.address;
            }

            // Handle password change
            if (isChangingPassword) {
                if (formData.password !== '') {
                    if (formData.password === confirmPassword) {
                        updatedFields.password = formData.password;
                    } else {
                        toast.error('Password do not match.');
                        return;
                    }
                }
            }

            // Handle profile photo separately
            if (profilePicture) {
                try {
                    setIsImageUploading(true);

                    // Upload the image to Cloudinary
                    let imageUrl = await uploadImageToCloudinary(profilePicture);

                    updatedFields.profilePhoto = imageUrl;
                    localStorage.setItem('profilePhoto', imageUrl);

                    // Reset states
                    setUploadImage(false);
                    setIsCroppedImageVisible(false);
                    setIsImageUploading(false);
                    imageUrl = null;

                    toast.success('Profile photo updated successfully!');
                } catch (error) {
                    console.error('Error updating profile photo:', error);
                    toast.error('Failed to update profile photo. Please try again.');
                }
            }

            // Optionally, you can update the user data in the state to reflect the changes immediately
            setUser((prevUser) => ({ ...prevUser, ...updatedFields }));

            await updateUserProfile(userId, updatedFields);

            setIsModalOpen(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating user profile:', error);
            toast.error('Failed to update profile. Please try again.');
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const PremiumBenefitsModal = () => {
        return (
            <div className={`${showBenefitsModal ? 'fixed inset-0 flex items-center justify-center' : 'hidden'}`}>
                <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
                <div className="modal bg-white p-6 rounded-lg z-10">
                    <div className="flex justify-end">
                        <button className="focus:outline-none" onClick={() => setShowBenefitsModal(false)}>
                            <FontAwesomeIcon icon={faTimes} className="text-gray-500 hover:text-gray-700" />
                        </button>
                    </div>
                    <h2 className="text-2xl mb-4">Premium Benefits</h2>
                    <ul className="list-disc text-left ml-10">
                        <li>Unlimited Access to All Features</li>
                        <li>Ad-Free Experience</li>
                        <li>Priority Support</li>
                        <li>Exclusive Content</li>
                    </ul>
                    <button
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => setShowBenefitsModal(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    };

    const handleShowBenefitsModal = () => {
        setShowBenefitsModal(true);
    };

    const handleShowPayPalButtons = () => {
        setShowPayPalButtons(true);
    };

    const handleUpgradeToPremium = async () => {
        try {
            // Make API call to upgrade user to premium
            await upgradeToPremium(userId);
            // Update local state to reflect premium status
            setIsPremium(true);
            setShowPayPalButtons(false);
            handlePayment();
            toast.success('Successfully upgraded to premium!');
        } catch (error) {
            console.error('Error upgrading to premium:', error);
            toast.error('Failed to upgrade to premium. Please try again.');
        }
    };

    const handlePayment = async () => {
        try {
            const orderId = await createOrder(amount);
            const success = await capturePayment(orderId);
            if (success) {
                // Payment successful
            } else {
                // Payment failed
            }
        } catch (error) {
            // Handle errors
        }
    };

    const handleFollow = async () => {
        try {
            await followUser(currentUserID, userId);
            setIsFollowing(true);
            setFollowerCount((prevCount) => prevCount + 1);
            toast.success('You are now following this user.');
        } catch (error) {
            toast.error('Failed to follow user.');
        }
    };

    const handleUnfollow = async () => {
        try {
            await unfollowUser(currentUserID, userId);
            setIsFollowing(false);
            setFollowerCount((prevCount) => prevCount - 1);
            toast.success('You have unfollowed this user.');
        } catch (error) {
            toast.error('Failed to unfollow user.');
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="gradient-custom-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg">
            <div className="container py-5 h-full">
                <div className="flex justify-center items-center h-full">
                    <div className="lg:w-9/12 xl:w-7/12">
                        <div className="card">
                            <div
                                className="rounded-top text-white flex items-center rounded-md"
                                style={{ backgroundColor: '#000', height: '200px' }}
                            >
                                <div className="ms-4 mt-5 flex flex-col" style={{ width: '150px' }}>
                                    <img
                                        src={user.profilePhoto}
                                        alt="Profile"
                                        className="mt-4 mb-2 img-thumbnail w-full"
                                    />
                                    {currentUserID === userId && ( // Check if current user is viewing their own profile
                                        <button
                                            className="btn bg-green-400 hover:bg-green-500 rounded btn-outline-dark h-10 overflow-visible"
                                            onClick={handleEditProfile}
                                        >
                                            <FontAwesomeIcon icon={faEdit} className="me-2" />
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                                <div className="ms-3" style={{ marginTop: '130px' }}>
                                    <h5 className={`text-md font-semibold ${user.isPremium ? 'text-yellow-500' : ''}`}>
                                        {user.firstName} {user.lastName}
                                    </h5>
                                    <p className="">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                                        {user.address}
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                                <div className="flex justify-end text-center py-1">
                                    <div>
                                        {currentUserID !== userId && (
                                            <div className="flex justify-center">
                                                {isFollowing ? (
                                                    <button
                                                        onClick={handleUnfollow}
                                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
                                                    >
                                                        Unfollow
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={handleFollow}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out"
                                                    >
                                                        Follow
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-3">
                                        <p className="mb-1 text-lg">{followerCount}</p>
                                        <p className="text-xs text-muted mb-0">Followers</p>
                                    </div>
                                    <div className="px-3">
                                        <p className="mb-1 text-lg">{followingCount}</p>
                                        <p className="text-xs text-muted mb-0">Following</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body text-black p-4">
                                <div className="mb-5">
                                    <p className="lead font-normal mb-1">About</p>
                                    <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                                        <p className="font-italic mb-1">{user.bio}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <p className="lead font-normal mb-0">Recent Photos</p>
                                    <p className="mb-0">
                                        <a href="#!" className="text-muted">
                                            Show All
                                        </a>
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="mb-2">
                                        <img
                                            src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp"
                                            alt="Image 1"
                                            className="w-full rounded-3"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <img
                                            src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(107).webp"
                                            alt="Image 2"
                                            className="w-full rounded-3"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="mb-2">
                                        <img
                                            src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(108).webp"
                                            alt="Image 3"
                                            className="w-full rounded-3"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <img
                                            src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(114).webp"
                                            alt="Image 4"
                                            className="w-full rounded-3"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <PayPalScriptProvider
                        options={{
                            'client-id':
                                'AQoxVwjga08z5yxk0JvxpEgKbGqGZ7DQdOLuYT34GGPv7Xn4Mc0fzf-ZdsdLe--pF0G0vIDR5699Dbqa',
                        }}
                    >
                        {isPremium ? (
                            <div className="text-center p-4 rounded-lg bg-green-100 border border-green-200">
                                <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                                <span>You are a premium user!</span>
                            </div>
                        ) : (
                            <div className="text-center p-4 rounded-lg border border-blue-200 bg-blue-50">
                                <h2 className="text-2xl mb-4">Upgrade to Premium</h2>
                                <FontAwesomeIcon icon={faGift} className="text-3xl mb-4 text-red-500 animate-bounce" />
                                <p className="mb-4">Unlock all premium features for a better experience.</p>
                                {showPayPalButtons ? (
                                    <PayPalButtons
                                        createOrder={(data, actions) => {
                                            return actions.order.create({
                                                purchase_units: [
                                                    {
                                                        amount: { value: '10.00' },
                                                    },
                                                ],
                                            });
                                        }}
                                        onApprove={(data, actions) => {
                                            // Capture the payment
                                            return actions.order.capture().then(function (details) {
                                                // Handle payment success
                                                handleUpgradeToPremium();
                                            });
                                        }}
                                    />
                                ) : (
                                    <button
                                        onClick={handleShowPayPalButtons}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Upgrade to Premium
                                    </button>
                                )}
                                <button className="btn btn-primary" onClick={handleShowBenefitsModal}>
                                    See Premium Benefits
                                </button>
                            </div>
                        )}
                    </PayPalScriptProvider>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
                    <div className="modal bg-white p-6 rounded-lg z-10">
                        <span className="close-icon absolute top-4 right-4 cursor-pointer" onClick={handleCloseModal}>
                            <FontAwesomeIcon icon={faTimes} />
                        </span>
                        <h2 className="text-2xl mb-4 text-center font-bold">Edit Profile</h2>
                        <form>
                            <div className="form-group mb-4">
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="form-group mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                />
                            </div>
                            {isChangingPassword && (
                                <div className="form-group mb-4">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                    />
                                </div>
                            )}
                            <div className="form-group mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Change Password?
                                    <input
                                        type="checkbox"
                                        name="changePassword"
                                        checked={isChangingPassword}
                                        onChange={() => setIsChangingPassword((prev) => !prev)}
                                        className="ml-2"
                                    />
                                </label>
                            </div>
                            {/* Profile picture upload */}
                            <div className="form-group mb-4">
                                <label htmlFor="profilePicture" className="block text-xl font-medium text-gray-700">
                                    Profile Picture
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setUploadImage(!uploadImage)} // Toggle the image upload section
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                                >
                                    {uploadImage ? 'Cancel' : 'New profile?'}
                                </button>
                                {uploadImage && (
                                    <ImageCropper
                                        onCropComplete={handleCropComplete}
                                        isCroppedImageVisible={isCroppedImageVisible}
                                    />
                                )}
                                {/* Add a button to remove the profile picture */}
                                {isCroppedImageVisible && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                                    >
                                        Remove Profile Picture
                                    </button>
                                )}
                            </div>
                            <button type="button" className="btn-save mt-4" onClick={handleUpdateProfile}>
                                {isUpdatingProfile ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-600 border-solid border-r-0 border-l-0"></div>
                                    </div>
                                ) : (
                                    <div className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
                                        Save Changes
                                    </div>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <PremiumBenefitsModal />
        </div>
    );
};

export default Profile;
