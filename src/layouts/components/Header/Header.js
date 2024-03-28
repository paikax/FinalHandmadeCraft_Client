import HeadlessTippy from '@tippyjs/react/headless';
import { toast } from 'react-hot-toast';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import Image from '~/components/Image/Image';
import config from '~/config';
import { createAxios } from '~/createInstance';
import { handleSignOut } from '~/firebaseConfig';
import { logOut } from '~/redux/apiRequest';
import { logOutSuccess } from '~/redux/authSlice';
import Search from '../Search';
import { NotifyIcon } from '~/components/Icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCloudArrowUp, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { fetchNotifications } from '~/services/notificationService';

function Header({ currentUser }) {
    const [notifications, setNotifications] = useState();
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const googleAvatar = localStorage.getItem('profilePic');
    const avatar = localStorage.getItem('profilePhoto');
    const currentUserID = useSelector((state) => String(state.auth.login.currentUser?.id));

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logOut(dispatch, navigate);
    };

    const renderResult = () => {
        return (
            <div className="bg-[#fff]  shadow-[0_24px_54px_rgba(0,0,0,0.15)]">
                <div className="flex justify-end">
                    <button
                        className="px-[14px] py-[15px] text-[14px] hover:bg-[#f5f5f5] hover:underline"
                        onClick={handleLogout}
                    >
                        Sign out
                    </button>
                </div>
                <div className="flex items-center">
                    <Image
                        className="m-[20px] shrink-0 rounded-full w-[88px] h-[88px] object-cover border-[1px] border-solid border-[#777]"
                        src={googleAvatar || currentUser.profilePhoto}
                        alt="Avatar"
                    />

                    <div>
                        <Link to={`/profile/${currentUser?.id}`} className="font-semibold text-[18px]">
                            {name || `${currentUser?.firstName} ${currentUser?.lastName}`}
                        </Link>
                        <p className="text-[14px]">{email || currentUser?.email}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <header className="flex md:flex-row items-center h-[60px] shadow-md bg-[#fff] justify-between px-[12px] z-10 mb-10">
            <div className="flex items-center justify-between w-full md:w-auto">
                <div className="flex items-center">
                    <Link
                        to={config.routes.home}
                        className="font-bold text-[#4a8f92] px-4 hover:scale-110 transition-all"
                    >
                        HandMadeCraft
                    </Link>
                </div>
            </div>
            <div className="flex items-center max-md:hidden">
                <Search />
            </div>

            <div className="flex items-center gap-[20px] h-full">
                <Link
                    to={config.routes.tutorialUpload}
                    className="text-center text-white w-[50px] bg-gray-200 rounded-full transition-all hover:bg-[#EEF5FF] hover:scale-125"
                >
                    <FontAwesomeIcon icon={faCloudArrowUp} className="text-[#4a8f92]" />
                </Link>
                <div className="hidden md:flex gap-[20px]">
                    <Link
                        to={config.routes.tutorialList}
                        className="text-black font-semibold translate-y-[1px] hover:scale-110 transition-all "
                    >
                        Discover
                    </Link>
                    <Link
                        to={config.routes.about}
                        className="text-black font-semibold  transition-all translate-y-[1px] hover:scale-125"
                    >
                        About
                    </Link>
                    <Link
                        to="/link3"
                        className="text-black font-semibold transition-all hover:scale-125  translate-y-[1px]"
                    >
                        Saved
                    </Link>
                    <Link
                        to={config.routes.shoppingCart}
                        className="text-black translate-y-[1px] hover:scale-110 transition-all"
                    >
                        <FontAwesomeIcon icon={faShoppingCart} className="text-4xl" />
                    </Link>
                </div>
                <HeadlessTippy
                    trigger="click"
                    interactive
                    offset={[8, 18]}
                    placement="bottom-end"
                    render={() => (
                        <div className="bg-white shadow-[0_24px_54px_rgba(0,0,0,0.15)]">
                            <div className="flex justify-between p-[16px] pb-[0px]">
                                <h3 className="text-[18px] font-medium">Notification</h3>
                                <button className="text-[#f05123] text-[14px] hover:bg-[#f5f5f5] p-[6px] rounded-[4px]">
                                    Marks as read
                                </button>
                            </div>
                            <div className="flex flex-col p-[10px]">
                                {/* {notifications.map(({ title, message }) => (
                                    <div className="p-[10px] rounded-[8px] mt-[10px] bg-[#f051231a] cursor-pointer">
                                        <h4>
                                            {title} "<span className="font-medium">{}</span>"
                                        </h4>
                                        <p className="text-[#f05123] text-[12px] mt-[4px]">{message}</p>
                                    </div>
                                ))} */}
                            </div>
                        </div>
                    )}
                >
                    <button className="p-[5px] bg-gray-200 rounded-full border-white transition-all hover:scale-110 hover:bg-[#EEF5FF]">
                        <NotifyIcon className="text-black font-semibold w-[25px] h-[25px]" />
                    </button>
                </HeadlessTippy>
                <div className="account-global flex items-center justify-center h-full w-[48px] hover:bg-[#AAD7D9] transition-colors cursor-pointer">
                    <HeadlessTippy
                        trigger="click"
                        interactive
                        offset={[8, 18]}
                        placement="bottom-end"
                        render={renderResult}
                    >
                        <Image
                            className="rounded-full w-[34px] h-[34px] object-cover border-[1px] border-solid border-white"
                            src={googleAvatar || currentUser.profilePhoto}
                            alt="Avatar"
                        />
                    </HeadlessTippy>
                </div>
            </div>
        </header>
    );
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.login.currentUser,
    };
};

export default connect(mapStateToProps)(Header);
