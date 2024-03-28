import React from 'react';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import ErrorMessage from '~/components/ErrorMessage';
import { loginUser } from '~/redux/apiRequest';
import { loginValidationSchema } from './validationSchema';
import config from '~/config';
import GoogleLoginButton from '~/components/Button/GoogleLoginButton';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(loginValidationSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const { email, password } = errors;

    const { mutate } = useMutation({
        mutationFn: (data) => loginUser(data, dispatch, navigate),
        onSuccess: (data) => {
            if (data) {
                toast.success('Login successfully');
            } else {
                toast.error('Login failed!');
            }
        },
        onError: (error) => {
            console.error('Error during login:', error.message);
            toast.error('An error occurred during login');
        },
    });

    const onSubmitForm = async (data) => {
        try {
            mutate(data);
        } catch (error) {
            console.error('Error during form submission: ', error);
            toast.error('Failed to submit form.');
        }
    };

    const handleSignUpGoogle = () => {};

    return (
        <div
            className="flex items-center justify-center min-h-screen"
            style={{
                backgroundImage: `url(${require('~/assets/images/register-wallpapers/LoginBackground.jpg')})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="max-w-xl w-full px-8 py-6 mt-4 text-left bg-white shadow-lg border rounded-xl">
                <div className="flex justify-center mb-3">
                    <h3 className="text-3xl font-bold text-center">Welcome back!</h3>
                </div>

                <div className="mt-4">
                    <div className="flex items-center justify-center">
                        <GoogleLoginButton />
                    </div>

                    <div className="flex items-center justify-between my-4">
                        <hr className="w-full" />
                        <label className="text-gray-600 px-3 bg-white">OR</label>
                        <hr className="w-full" />
                    </div>

                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        <div className="mt-8">
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    {...register('email')}
                                    className="w-full px-2 py-2 mt border rounded-xl focus:outline-none bg-gray-200"
                                />
                                {email && <ErrorMessage message={email.message} />}
                            </div>
                            <div className="mt-6">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    {...register('password')}
                                    className="w-full px-2 py-2 mt border rounded-xl focus:outline-none bg-gray-200"
                                />
                                {password && <ErrorMessage message={password.message} />}
                            </div>
                            <div className="mt-4 flex items-baseline justify-between">
                                <button className="px-6 py-2 mt-4 text-gray-800 font-semibold bg-[#92C7CF] hover:bg-[#AAD7D9] rounded-lg">
                                    Sign in
                                </button>
                                <Link
                                    to={config.routes.forgotPassword}
                                    className=" text-[#4a8f92] text-xl hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
                <p className="mt-14 font-light text-center text-2xl text-gray-700">
                    {' '}
                    Don't have an account?{' '}
                    <em>
                        <Link to={config.routes.register} className="text-[#4a8f92] hover:underline">
                            Sign up
                        </Link>
                    </em>
                </p>
            </div>
        </div>
    );
}

export default Login;
