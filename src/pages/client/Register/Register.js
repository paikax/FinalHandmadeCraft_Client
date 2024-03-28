import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import ErrorMessage from '~/components/ErrorMessage';
import { registerUser } from '~/redux/apiRequest';
import { registerValidationSchema } from './validationSchema';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css'; // Import the CSS file for styling
import 'react-image-crop/dist/ReactCrop.css';
import ImageCropper from '~/utils/ImageCropper';
import { updateAvatar, uploadImageToCloudinary } from '~/utils/cloudinaryConfig';
import config from '~/config';
import GoogleLoginButton from '~/components/Button/GoogleLoginButton';
import FacebookLoginButton from '~/components/Button/FacebookLoginButton';
import httpRequest from '~/utils/httpRequest';

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [emailValidated, setEmailValidated] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [uploadImage, setUploadImage] = useState(false);
    const [isCroppedImageVisible, setIsCroppedImageVisible] = useState(false);
    const [isImageUploading, setIsImageUploading] = useState(false);
    const currentUser = useSelector((state) => state.auth.user);
    const userId = currentUser?.id;
    const [googleToken, setGoogleToken] = useState(null);
    const [verificationCodeSent, setVerificationCodeSent] = useState(false);

    const handleCropComplete = (croppedImage) => {
        setProfilePicture(croppedImage);
        setIsCroppedImageVisible(true); // Show the cropped image only after saving
    };

    const {
        register,
        formState: { errors },
        handleSubmit,
        getValues,
        setValue,
        trigger,
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(registerValidationSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            profilePhoto: '',
        },
    });

    const { email, password, confirmPassword, firstName, lastName } = errors;

    const checkPasswordsMatch = () => {
        const passwordValue = getValues('password');
        const confirmPasswordValue = getValues('confirmPassword');
        setPasswordsMatch(passwordValue === confirmPasswordValue);
    };

    const { mutate, isLoading } = useMutation({
        mutationFn: (data) => registerUser(data, dispatch, navigate),
        onSuccess: (data) => {
            if (data) {
                toast.success('Sign up successfully');
            } else {
                toast.error('Sign up failed!');
            }
        },
        onError: () => {
            toast.error('Error occurred during sign up.');
        },
    });

    // register progress steps
    const checkEmail = async () => {
        const emailValue = getValues('email');

        try {
            const response = await httpRequest.get('user/check-email', {
                params: { email: emailValue },
            });
            const data = response.data;
            console.log(data);
            if (data.emailExists) {
                toast.error('Email is already taken.');
                setEmailValidated(false); // Important to set to false if email exists
            } else {
                toast.success('Email is available.');
                setEmailValidated(true);
                setCurrentStep(currentStep + 1);
            }
        } catch (error) {
            toast.error('Error checking email.');
            setEmailValidated(false);
        }
    };

    const handlePreviousStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleNextStep = async () => {
        if (currentStep === 1) {
            const isEmailValid = await trigger('email');
            if (!isEmailValid) {
                return;
            }

            await checkEmail();
        } else {
            const fieldsToValidate = ['password', 'confirmPassword', 'firstName', 'lastName'];

            const isCurrentStepValid = await trigger(fieldsToValidate);
            if (!isCurrentStepValid) {
                toast.error('Please fill out all required fields correctly.');
                return;
            }

            setCurrentStep(currentStep + 1);
        }
    };

    const onSubmitForm = async (data) => {
        if (currentStep < 3) {
            handleNextStep();
        } else if (emailValidated) {
            try {
                setIsImageUploading(true); // Start the image upload loading
                const imageUrl = await uploadImageToCloudinary(profilePicture);
                setIsImageUploading(false);

                const formData = { ...data, profilePhoto: imageUrl };

                console.log('Submitting form'); // Check if this gets logged
                mutate(formData);
            } catch (error) {
                setIsImageUploading(false); // End the image upload loading in case of an error
                console.error('Error during form submission: ', error);
                toast.error('Failed to upload image or submit form.');
                throw error;
            }
        } else {
            toast.error('Please complete all steps before submitting.');
        }
    };

    const handleFacebookLoginSuccess = (accessToken) => {
        // Handle the successful login with Facebook here
        console.log('Facebook login successful. Access Token:', accessToken);
    };

    const handleFacebookLoginFailure = (error) => {
        // Handle the failed login with Facebook here
        console.error('Facebook login failed. Error:', error);
    };

    // const handleSignUpGoogle = () => {
    //     signInWithGoogle();
    // };

    return (
        <>
            <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet" />
            <div
                className="relative min-h-screen flex justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-gray-500 bg-no-repeat bg-cover relative items-center"
                style={{
                    backgroundImage: `url(${require('~/assets/images/register-wallpapers/registerBackground.jpg')})`,
                }}
            >
                <div className="absolute bg-black opacity-15 inset-0 z-0" />
                <div className="max-w-xl w-full space-y-8 p-10 bg-white rounded-xl z-10">
                    <div className="text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900">Sign up</h2>
                        {currentStep === 1 && (
                            <span>
                                <hr />
                            </span>
                        )}
                        <p className="mt-3 text-md text-gray-600">Please enter your information below.</p>
                    </div>
                    <div className="flex flex-row justify-center items-center space-x-3">
                        {currentStep === 1 && (
                            <span className="flex items-center">
                                <GoogleLoginButton />
                            </span>
                        )}
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                        {currentStep === 1 && (
                            <>
                                <span className="h-px w-16 bg-gray-300" />
                                <span className="text-gray-500 font-normal">OR</span>
                                <span className="h-px w-16 bg-gray-300" />
                            </>
                        )}
                    </div>
                    <form
                        className="mt-8 space-y-6"
                        onSubmit={handleSubmit(onSubmitForm)}
                        encType="multipart/form-data"
                    >
                        <input type="hidden" name="remember" defaultValue="true" />
                        <div className="relative">
                            {currentStep === 1 && (
                                <>
                                    <input
                                        className="w-full px-2 py-2 mt border rounded-xl focus:outline-none bg-gray-200"
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        {...register('email')}
                                    />

                                    <ErrorMessage name={email} />
                                </>
                            )}
                        </div>
                        {currentStep === 2 && (
                            <>
                                <div className="mt-8 content-center">
                                    <input
                                        className="w-full px-4 py-2 mt-2 border rounded-xl focus:outline-none focus:border-indigo-500 bg-gray-200"
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        {...register('password')}
                                        onBlur={checkPasswordsMatch}
                                    />
                                    <ErrorMessage name={password} />
                                </div>
                                <div className="mt-8 content-center">
                                    <input
                                        className="w-full px-4 py-2 mt-2 border rounded-xl focus:outline-none focus:border-indigo-500 bg-gray-200"
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        {...register('confirmPassword')}
                                        onBlur={checkPasswordsMatch}
                                    />
                                    {passwordsMatch && (
                                        <FontAwesomeIcon
                                            icon={faCheckCircle}
                                            className="text-green-500 h-6 w-6 absolute right-0 mt-4"
                                        />
                                    )}
                                    <ErrorMessage name={confirmPassword} />
                                </div>
                                <div className="mt-8 content-center">
                                    <input
                                        className="w-full px-4 py-2 mt-2 border rounded-xl focus:outline-none focus:border-indigo-500 bg-gray-200"
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        {...register('firstName')}
                                    />
                                    <ErrorMessage name={firstName} />
                                </div>
                                <div className="mt-8 content-center">
                                    <input
                                        className="w-full px-4 py-2 mt-2 border rounded-xl focus:outline-none focus:border-indigo-500 bg-gray-200"
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        {...register('lastName')}
                                    />
                                    <ErrorMessage name={lastName} />
                                </div>
                            </>
                        )}
                        {currentStep === 3 && (
                            <div className="mt-4">
                                <label className="text-md font-bold text-gray-700 tracking-wide">(Optional)</label>
                                <div className="mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setUploadImage(!uploadImage)} // Toggle the image upload section
                                        className="bg-[#92C7CF] hover:bg-[#AAD7D9] text-gray-700 font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                                    >
                                        {uploadImage ? 'Remove Image' : 'Upload Image'}
                                    </button>
                                </div>
                                {uploadImage && (
                                    <ImageCropper
                                        onCropComplete={handleCropComplete}
                                        isCroppedImageVisible={isCroppedImageVisible}
                                    />
                                )}
                            </div>
                        )}
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={handlePreviousStep}
                                className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                            >
                                Back
                            </button>
                        )}
                        {currentStep < 3 && (
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className=" w-full bg-[#92C7CF] hover:bg-[#AAD7D9] ease-in-out duration-300 text-gray-800 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                            >
                                Next
                            </button>
                        )}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center"></div>
                        </div>
                        {currentStep === 3 && (
                            <div>
                                <button
                                    type="submit"
                                    disabled={!emailValidated || isLoading || isImageUploading}
                                    className="w-full flex justify-center bg-[#76ABAE] text-gray-800 p-4 rounded-full tracking-wide
                    font-semibold focus:outline-none focus:shadow-outline hover:bg-[#92C7CF] shadow-lg cursor-pointer transition ease-in duration-300"
                                >
                                    {isLoading || isImageUploading ? (
                                        <div>
                                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.002 8.002 0 0112 4.472v3.087c-3.042.427-5.467 2.853-5.94 5.895H6zM20 12c0-3.511-1.794-6.606-4.505-8.413l1.421-2.83A10.014 10.014 0 0122 12h-4zm-5.483 6.93a7.972 7.972 0 01-3.447 0H10.48a9.98 9.98 0 003.038 5.011l1.421-2.83zM4 12h4c0 3.511 1.794 6.606 4.505 8.413l-1.421 2.83A10.014 10.014 0 014 12zm11.517-6.93a7.972 7.972 0 013.447 0h2.592a9.98 9.98 0 00-3.038-5.011l-1.421 2.83zM10.48 6.07a7.972 7.972 0 013.038-5.01V3.57a9.98 9.98 0 00-3.447 0H6.472l1.008-2.016C9.206.988 10.579 0 12 0v4c-1.381 0-2.674.364-3.808.997L9.073 6.07zm6.037 1.354L14.464 8.99a8.014 8.014 0 01-.928 3.012h3.033a9.972 9.972 0 003.447-1.007l-1.008-2.016zM9.073 17.93a8.014 8.014 0 01.928-3.012L6.464 11.968a9.972 9.972 0 00-3.447 1.007l1.008 2.016h2.592zM14.464 15.01l1.008 2.016a9.972 9.972 0 003.447 1.007l-1.008-2.016h-3.447zM14.464 8.99l-1.008-2.016a9.972 9.972 0 00-3.447-1.007L9.073 6.07h3.447z"
                                                ></path>
                                            </svg>
                                        </div>
                                    ) : (
                                        'Sign up'
                                    )}
                                </button>
                            </div>
                        )}
                        <p className="flex flex-col items-center justify-center mt-10 text-center text-md text-gray-500">
                            <span>
                                Already have account?
                                <em className="ml-2">
                                    <Link
                                        to={config.routes.login}
                                        className="text-[#4a8f92] hover:text-[#76ABAE] no-underline hover:underline cursor-pointer transition ease-in duration-300"
                                    >
                                        Sign in
                                    </Link>
                                </em>
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Register;
