import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';

import images from '~/assets/images';
import ErrorMessage from '~/components/ErrorMessage';
import Image from '~/components/Image/Image';
import config from '~/config';
import { signInWithGoogle, uploadImageToFirebase } from '~/firebaseConfig';
import { registerUser } from '~/redux/apiRequest';
import { registerValidationSchema } from './validationSchema';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the CSS file for styling
import 'react-image-crop/dist/ReactCrop.css';
import AddressModal from './AddressModal';
import ImageCropper from '~/utils/ImageCropper';
import { uploadImageToCloudinary } from '~/utils/cloudinaryConfig';

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [emailValidated, setEmailValidated] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [countryCodes, setCountryCodes] = useState([]);
    const [addressDetails, setAddressDetails] = useState({
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
    });
    const [profilePicture, setProfilePicture] = useState(null);

    const handleCropComplete = (croppedImage) => {
        setProfilePicture(croppedImage);
    };

    useEffect(() => {
        const fetchCountryCodes = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all');
                const data = await response.json();
                const codes = data.map((country) => ({
                    code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ''),
                    name: country.name.common,
                }));

                // Sort the country codes alphabetically by name
                codes.sort((a, b) => a.name.localeCompare(b.name));

                setCountryCodes(codes);
            } catch (error) {
                console.error('Error fetching country codes:', error);
            }
        };

        fetchCountryCodes();
    }, []);

    const handleAddressInputClick = () => {
        setIsModalOpen(true); // Open the AddressModal when the address input is clicked
    };

    const handleAddressSelect = (address) => {
        const formattedAddress = `${address.street}, ${address.city}, ${address.state}, ${address.country}, ${address.zipCode}`;
        setSelectedAddress(formattedAddress);

        setAddressDetails(address); // Update the address details state
        setValue('address', formattedAddress, { shouldValidate: true });
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
            phoneNumber: '',
            dateOfBirth: '',
            address: '',
            profilePhoto: '',
        },
    });

    const { email, password, confirmPassword, firstName, lastName, phoneNumber, dateOfBirth, address, profilePhoto } =
        errors;

    const { mutate } = useMutation({
        mutationFn: (data) => registerUser(data, dispatch, navigate),
        onSuccess: (data) => {
            if (data) {
                toast.success('Sign up successfully');
            } else {
                toast.error('Sign up failed!');
            }
        },
    });

    // register progress steps
    const checkEmail = async () => {
        const emailValue = getValues('email');

        try {
            const response = await fetch('https://localhost:44346/api/user/check-email?email=' + emailValue);
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
        // Reset email validation when going back from step 2 to step 1
        if (currentStep === 2) {
            setEmailValidated(false);
        }

        setCurrentStep(currentStep - 1);
    };

    const handleNextStep = async () => {
        if (currentStep === 1) {
            const isEmailValid = await trigger('email');
            if (!isEmailValid) {
                // toast.error('Please enter a valid email.');
                return;
            }

            // Always recheck email when on step 1
            await checkEmail();
        } else {
            // For steps 2 and 3, check for errors before advancing
            const fieldsToValidate =
                currentStep === 2
                    ? ['password', 'confirmPassword', 'firstName', 'lastName']
                    : ['phoneNumber', 'dateOfBirth', 'address'];

            const isCurrentStepValid = await trigger(fieldsToValidate);
            if (!isCurrentStepValid) {
                toast.error('Please fill out all required fields correctly.');
                return;
            }

            setCurrentStep(currentStep + 1);
        }
    };

    const onSubmitForm = async (data) => {
        if (currentStep < 4) {
            handleNextStep();
        } else if (emailValidated) {
            try {
                // Upload the image to Cloudinary and get the URL
                const imageUrl = await uploadImageToCloudinary(profilePicture);
                console.log(imageUrl);

                // Combine country code and phone number
                const fullPhoneNumber = `${data.countryCode}${data.phoneNumber}`;
                data.phoneNumber = fullPhoneNumber;

                // Add the image URL to your form data
                const formData = { ...data, profilePhoto: imageUrl };

                // Now, submit the formData to your backend
                mutate(formData);
            } catch (error) {
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
        <div className="flex h-scree overflow-hidden">
            <div className="flex flex-col items-center justify-center p-12 w-full lg:w-1/2">
                <Image src={images.logo} alt="Logo" className="w-24 rounded-md" />
                <h1 className="mt-6 mb-2 text-3xl font-semibold">Create an account</h1>
                <p className="text-[#555] text-2xl">Sign up to continue.</p>

                <form
                    className="flex flex-col items-center w-full gap-4 mt-10"
                    onSubmit={handleSubmit(onSubmitForm)}
                    encType="multipart/form-data"
                >
                    {currentStep === 1 && (
                        // Step 1: Email
                        <div className="flex flex-col w-full">
                            <input
                                className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                                type="email"
                                name="email"
                                placeholder="Email"
                                {...register('email')}
                            />
                            <ErrorMessage name={email} />
                        </div>
                    )}
                    {currentStep === 2 && (
                        // Step 2: First Name, Last Name, Password, Confirm Password
                        <>
                            <div className="flex flex-col w-full">
                                <input
                                    className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    {...register('password')}
                                />
                                <ErrorMessage name={password} />
                            </div>
                            <div className="flex flex-col w-full">
                                <input
                                    className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    {...register('confirmPassword')}
                                />
                                <ErrorMessage name={confirmPassword} />
                            </div>
                            <div className="flex flex-col w-full">
                                <input
                                    className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                                    type="firstName"
                                    name="firstName"
                                    placeholder="First Name"
                                    {...register('firstName')}
                                />
                                <ErrorMessage name={firstName} />
                            </div>
                            <div className="flex flex-col w-full">
                                <input
                                    className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md"
                                    type="lastName"
                                    name="lastName"
                                    placeholder="Last Name"
                                    {...register('lastName')}
                                />
                                <ErrorMessage name={lastName} />
                            </div>
                        </>
                    )}
                    {currentStep === 3 && (
                        // Step 3: Phone Number, Date of Birth, Address
                        <>
                            <div className="flex flex-col w-full">
                                <div className="flex">
                                    <select
                                        className="text-2xl p-4 border-[1px] border-r-0 border-solid border-[#999] rounded-l-md"
                                        {...register('countryCode')}
                                    >
                                        {countryCodes.map((country) => (
                                            <option key={country.code} value={country.code}>
                                                {country.name} ({country.code})
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-r-md"
                                        type="phoneNumber"
                                        name="phoneNumber"
                                        placeholder="Phone Number"
                                        {...register('phoneNumber')}
                                    />
                                </div>
                                <ErrorMessage name={phoneNumber} />
                            </div>
                            <div className="flex flex-col w-full">
                                <DatePicker
                                    selected={getValues('dateOfBirth')}
                                    onChange={(date) => setValue('dateOfBirth', date, { shouldValidate: true })}
                                    showYearDropdown
                                    scrollableYearDropdown
                                    yearDropdownItemNumber={50}
                                    dateFormat="dd/MM/yyyy" // Customize the date format
                                    placeholderText="Date of Birth"
                                    className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md cursor-pointer"
                                />
                                <ErrorMessage name={dateOfBirth} />
                            </div>
                            <div className="flex flex-col w-full">
                                <input
                                    className="w-full text-2xl p-4 border-[1px] border-solid border-[#999] rounded-md cursor-pointer"
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    onClick={handleAddressInputClick} // Open modal on click
                                    value={selectedAddress} // Show the selected address in the input field
                                    readOnly // Make the field read-only
                                />
                                <ErrorMessage name={address} />
                            </div>
                            <AddressModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                addressDetails={addressDetails} // Pass addressDetails as a prop
                                setAddressDetails={setAddressDetails}
                                onAddressSelect={handleAddressSelect}
                            />
                        </>
                    )}
                    {currentStep === 4 && (
                        <div className="mt-4">
                            <ImageCropper onCropComplete={handleCropComplete} />
                        </div>
                    )}

                    {currentStep < 4 && (
                        <button type="button" onClick={handleNextStep}>
                            Next
                        </button>
                    )}
                    {currentStep > 1 && (
                        <button type="button" onClick={handlePreviousStep}>
                            Back
                        </button>
                    )}
                    {currentStep === 4 && (
                        <button
                            className="bg-[#333] border-[1px] border-solid border-[#333] text-white w-full p-4 rounded-md text-2xl hover:bg-opacity-90"
                            type="submit"
                            disabled={!emailValidated}
                        >
                            Create account
                        </button>
                    )}
                </form>

                <span className="my-6 text-[#555] text-2xl">OR</span>

                <div className="flex flex-col items-center w-full gap-4">
                    <button
                        className="bg-white border-[1px] border-solid border-[#ccc] text-2xl text-[#333] w-full p-4 rounded-md hover:bg-[rgba(0,0,0,0.05)]"
                        onClick={handleSignUpGoogle}
                    >
                        <FontAwesomeIcon icon={faGoogle} className="text-red-600" />
                        <span className="ml-3">Sign up with Google</span>
                    </button>
                </div>

                <p className="mt-8 text-2xl">
                    Already have an account?{' '}
                    <Link className="font-medium" to={config.routes.login}>
                        Login
                    </Link>
                </p>
            </div>
            <div className="flex-1 max-sm:hidden">
                <Image
                    className="rounded-tl-[60px] rounded-bl-[60px] object-cover h-screen w-full"
                    src={images.backgroundRegister}
                    alt="Register background"
                />
            </div>
        </div>
    );
}

export default Register;
