import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import ErrorMessage from '~/components/ErrorMessage';
import { signInWithGoogle } from '~/firebaseConfig';
import { registerUser } from '~/redux/apiRequest';
import { registerValidationSchema } from './validationSchema';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css'; // Import the CSS file for styling
import 'react-image-crop/dist/ReactCrop.css';
import ImageCropper from '~/utils/ImageCropper';
import { updateAvatar, uploadImageToCloudinary } from '~/utils/cloudinaryConfig';
import config from '~/config';

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
    const currentUser = useSelector((state) => state.auth.user); // Replace with your actual state path
    const userId = currentUser?.id; // Replace with your actual ID field

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
            const response = await fetch('https://localhost:5001/api/user/check-email?email=' + emailValue);
            const data = await response.json();
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

    const handleSignUpGoogle = () => {
        signInWithGoogle();
    };

    return (
        <>
            <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet" />
            <div
                className="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-gray-500 bg-no-repeat bg-cover relative items-center"
                style={{
                    backgroundImage:
                        'url(https://images.unsplash.com/photo-1525302220185-c387a117886e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
                }}
            >
                <div className="absolute bg-black opacity-60 inset-0 z-0" />
                <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl z-10">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign up</h2>
                        <p className="mt-2 text-md text-gray-600">Please enter your information below.</p>
                    </div>
                    <div className="flex flex-row justify-center items-center space-x-3">
                        <span className="w-11 h-11 items-center justify-center inline-flex rounded-full font-bold text-lg  text-white  bg-blue-900 hover:shadow-lg cursor-pointer transition ease-in duration-300">
                            <img
                                className="w-4 h-4"
                                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiBjbGFzcz0iIj48Zz48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im0xNS45OTcgMy45ODVoMi4xOTF2LTMuODE2Yy0uMzc4LS4wNTItMS42NzgtLjE2OS0zLjE5Mi0uMTY5LTMuMTU5IDAtNS4zMjMgMS45ODctNS4zMjMgNS42Mzl2My4zNjFoLTMuNDg2djQuMjY2aDMuNDg2djEwLjczNGg0LjI3NHYtMTAuNzMzaDMuMzQ1bC41MzEtNC4yNjZoLTMuODc3di0yLjkzOWMuMDAxLTEuMjMzLjMzMy0yLjA3NyAyLjA1MS0yLjA3N3oiIGZpbGw9IiNmZmZmZmYiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48L2c+PC9zdmc+"
                            />
                        </span>
                        <span
                            className="w-11 h-11 items-center justify-center inline-flex rounded-full font-bold text-lg  text-white bg-red-600 hover:shadow-lg cursor-pointer transition ease-in duration-300"
                            onClick={handleSignUpGoogle}
                        >
                            <FontAwesomeIcon icon={faGoogle} className="text-white-600" />
                        </span>
                        <span className="w-11 h-11 items-center justify-center inline-flex rounded-full font-bold text-lg  text-white bg-blue-500 hover:shadow-lg cursor-pointer transition ease-in duration-300">
                            <img
                                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im0yMy45OTQgMjR2LS4wMDFoLjAwNnYtOC44MDJjMC00LjMwNi0uOTI3LTcuNjIzLTUuOTYxLTcuNjIzLTIuNDIgMC00LjA0NCAxLjMyOC00LjcwNyAyLjU4N2gtLjA3di0yLjE4NWgtNC43NzN2MTYuMDIzaDQuOTd2LTcuOTM0YzAtMi4wODkuMzk2LTQuMTA5IDIuOTgzLTQuMTA5IDIuNTQ5IDAgMi41ODcgMi4zODQgMi41ODcgNC4yNDN2Ny44MDF6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtLjM5NiA3Ljk3N2g0Ljk3NnYxNi4wMjNoLTQuOTc2eiIgZmlsbD0iI2ZmZmZmZiIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTIuODgyIDBjLTEuNTkxIDAtMi44ODIgMS4yOTEtMi44ODIgMi44ODJzMS4yOTEgMi45MDkgMi44ODIgMi45MDkgMi44ODItMS4zMTggMi44ODItMi45MDljLS4wMDEtMS41OTEtMS4yOTItMi44ODItMi44ODItMi44ODJ6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+PC9nPjwvc3ZnPg=="
                                className="w-4 h-4"
                            />
                        </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                        <span className="h-px w-16 bg-gray-300" />
                        <span className="text-gray-500 font-normal">OR</span>
                        <span className="h-px w-16 bg-gray-300" />
                    </div>
                    <form
                        className="mt-8 space-y-6"
                        onSubmit={handleSubmit(onSubmitForm)}
                        encType="multipart/form-data"
                    >
                        <input type="hidden" name="remember" defaultValue="true" />
                        <div className="relative">
                            {/* <div className="absolute right-0 mt-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-green-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div> */}
                            {currentStep === 1 && (
                                <>
                                    {/* <label className="font-bold text-gray-700 tracking-wide">Email</label> */}
                                    <input
                                        className="w-full px-2 py-2 mt border rounded-xl focus:outline-none focus:border-indigo-500 bg-gray-200"
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
                                    {/* <label className="font-bold text-gray-700 tracking-wide">Password</label> */}
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
                                    {/* <label className="text-sm font-bold text-gray-700 tracking-wide">
                                        Confirm Password
                                    </label> */}
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
                                    {/* <label className="font-bold text-gray-700 tracking-wide">First Name</label> */}
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
                                    {/* <label className="font-bold text-gray-700 tracking-wide">Last Name</label> */}
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
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
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
                                className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                            >
                                Back
                            </button>
                        )}
                        {currentStep < 3 && (
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                            >
                                Next
                            </button>
                        )}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                {/* <input
                                    id="remember_me"
                                    name="remember_me"
                                    type="checkbox"
                                    className="h-4 w-4 bg-indigo-500 focus:ring-indigo-400 border-gray-300 rounded"
                                /> */}
                                {/* <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label> */}
                            </div>
                            {/* <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-500 hover:text-indigo-500">
                                    Forgot your password?
                                </a>
                            </div> */}
                        </div>
                        {currentStep === 3 && (
                            <div>
                                <button
                                    type="submit"
                                    disabled={!emailValidated || isLoading || isImageUploading}
                                    className="w-full flex justify-center bg-indigo-500 text-gray-100 p-4 rounded-full tracking-wide
                    font-semibold focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg cursor-pointer transition ease-in duration-300"
                                >
                                    {isLoading || isImageUploading ? (
                                        <div>Loading...</div> // Replace with your preferred loading spinner or text
                                    ) : (
                                        'Sign up'
                                    )}
                                </button>
                            </div>
                        )}
                        <p className="flex flex-col items-center justify-center mt-10 text-center text-md text-gray-500">
                            <span>Already have account?</span>
                            <Link
                                to={config.routes.login}
                                className="text-indigo-500 hover:text-indigo-500no-underline hover:underline cursor-pointer transition ease-in duration-300"
                            >
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Register;
