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
import { signInWithGoogle } from '~/firebaseConfig';
import { loginUser } from '~/redux/apiRequest';
import { loginValidationSchema } from './validationSchema';
import config from '~/config';

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
                // navigate('/dashboard');
            } else {
                toast.error('Login failed!');
            }
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

    const handleSignUpGoogle = () => {
        signInWithGoogle();
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen"
            style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1525302220185-c387a117886e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg border rounded-xl">
                <div className="flex justify-center">
                    <h3 className="text-2xl font-bold text-center">Welcome back!</h3>
                </div>
                <div className="mt-4">
                    <div className="flex items-center justify-between">
                        <span
                            className="w-11 h-11 items-center justify-center inline-flex rounded-full font-bold text-lg text-white bg-red-600 hover:shadow-lg cursor-pointer transition ease-in duration-300"
                            onClick={handleSignUpGoogle}
                        >
                            <FontAwesomeIcon icon={faGoogle} className="text-white-600" />
                        </span>
                        <span className="text-gray-700 block text-xl">Sign in with Google</span>
                    </div>

                    <div className="flex items-center justify-between my-4">
                        <hr className="w-full" />
                        <label className="text-gray-600 px-3 bg-white">OR</label>
                        <hr className="w-full" />
                    </div>

                    <form onSubmit={handleSubmit(onSubmitForm)}>
                        <div className="mt-4">
                            <div>
                                <label className="block text-2xl" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    {...register('email')}
                                    className="w-full px-4 py-2 mt-2 border rounded-md"
                                />
                                {email && <ErrorMessage message={email.message} />}
                            </div>
                            <div className="mt-4">
                                <label className="block block text-2xl">Password</label>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    {...register('password')}
                                    className="w-full px-4 py-2 mt-2 border rounded-md"
                                />
                                {password && <ErrorMessage message={password.message} />}
                            </div>
                            <div className="flex items-baseline justify-between">
                                <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
                                    Login
                                </button>
                                <a href="#" className=" text-blue-600 text-xl hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                    </form>
                </div>
                <p className="mt-14 font-light text-center text-xl text-gray-700">
                    {' '}
                    Don't have an account?{' '}
                    <Link to={config.routes.register} className="text-blue-600 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
