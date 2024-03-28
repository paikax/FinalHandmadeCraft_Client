import { useMutation } from '@tanstack/react-query';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';
import { toast } from 'react-hot-toast';
import { connect, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';

import { BarsIcon, CheckIcon, HomeIcon, SignOutIcon, StarIcon, TheSunIcon, WalletIcon } from '~/components/Icons';
import config from '~/config';
import { createAxios } from '~/createInstance';
import { handleSignOut } from '~/firebaseConfig';
import { logOut } from '~/redux/apiRequest';
import { logOutSuccess } from '~/redux/authSlice';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

const sidebarList = [
    {
        id: 1,
        icon: HomeIcon,
        to: config.routes.home,
        title: 'Home',
    },
    {
        id: 2,
        icon: TheSunIcon,
        to: config.routes.tutorialList,
        title: 'Tutorials',
    },
    // {
    //     id: 3,
    //     icon: StarIcon,
    //     to: config.routes.tutorialList,
    //     title: 'Saved',
    // },
    {
        id: 4,
        icon: CheckIcon,
        to: config.routes.orders,
        title: 'Order',
    },
    {
        id: 5,
        icon: WalletIcon,
        title: 'Setup Your Payment',
        to: config.routes.paymentSetup,
    },
    {
        id: 6,
        icon: SignOutIcon,
        title: 'Sign out',
    },
];

function Sidebar({ currentUser, showSidebar, handleToggleSidebar }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const id = currentUser?._id;
    const accessToken = currentUser?.accessToken;
    const axiosJWT = createAxios(currentUser, dispatch, logOutSuccess);

    const { mutate } = useMutation({
        mutationFn: () => logOut(dispatch, id, navigate, accessToken, axiosJWT),
        onSuccess: (data) => {
            if (data.status === 200) {
                toast.success('Logout successfully');
            } else {
                toast.error('Logout failed!');
            }
        },
    });

    const handleLogout = async () => {
        if (currentUser) {
            // Normal logout
            mutate();
        } else {
            handleSignOut(); // Logout google
        }
    };

    return (
        <React.Fragment>
            <aside
                className={`relative w-[290px] min-h-screen border-solid border-r-[1px] border-[rgba(0,0,0,0.1)] ${
                    showSidebar ? 'block' : 'hidden'
                } max-sm:hidden`}
            >
                <div className="mt-[16px] px-[24px] h-[48px] flex items-center">
                    <button onClick={handleToggleSidebar}>
                        <BarsIcon />
                    </button>
                </div>
                <ul>
                    {sidebarList.map((item) => {
                        const Icon = item.icon;

                        return (
                            <li key={item.id} className="relative hover:bg-[#f5f5f5] transition-colors">
                                {item.to ? (
                                    <NavLink
                                        to={item.to}
                                        className={({ isActive }) =>
                                            cx(
                                                'flex',
                                                'items-center',
                                                'text-2xl',
                                                'px-[24px]',
                                                'py-[12px]',
                                                'font-semibold',
                                                'text-gray-600',
                                                {
                                                    active: isActive,
                                                },
                                            )
                                        }
                                    >
                                        <Icon />
                                        <span className="ml-[16px]">{item.title}</span>
                                    </NavLink>
                                ) : (
                                    <button
                                        className="flex items-center text-2xl px-[24px] py-[12px] w-full"
                                        onClick={handleLogout}
                                    >
                                        <Icon />
                                        <span className="ml-[16px]">{item.title}</span>
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </aside>

            <aside className="fixed bg-white bottom-0 right-0 left-0 sm:hidden border-t border-solid border-[#f5f5f5] z-50">
                <ul className="flex">
                    {sidebarList.map((item) => {
                        const Icon = item.icon;

                        return (
                            <li key={item.id} className="flex-1 relative hover:bg-[#f5f5f5] transition-colors">
                                {item.to ? (
                                    <NavLink
                                        to={item.to}
                                        className={({ isActive }) =>
                                            cx(
                                                'flex',
                                                'items-center',
                                                'justify-center',
                                                'text-2xl',
                                                'px-[24px]',
                                                'py-[14px]',
                                                {
                                                    mobileActive: isActive,
                                                },
                                            )
                                        }
                                    >
                                        <Icon />
                                    </NavLink>
                                ) : (
                                    <button
                                        className="flex items-center justify-center text-2xl px-[24px] py-[14px] w-full"
                                        onClick={handleLogout}
                                    >
                                        <Icon />
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </aside>
        </React.Fragment>
    );
}

Sidebar.propTypes = {
    handleToggleSidebar: PropTypes.func,
    showSidebar: PropTypes.bool,
};

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.login.currentUser,
    };
};

export default connect(mapStateToProps)(Sidebar);
