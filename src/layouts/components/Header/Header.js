import HeadlessTippy from '@tippyjs/react/headless';
import { toast } from 'react-hot-toast';
import { connect, useDispatch } from 'react-redux';
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
import { faPlus, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';

function Header({ currentUser }) {
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const googleAvatar = localStorage.getItem('profilePic');
    const avatar = localStorage.getItem('profilePhoto');

    const dispatch = useDispatch(); // Moved dispatch declaration here
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logOut(dispatch, navigate);
    };

    const renderResult = () => {
        return (
            <div className="bg-white shadow-[0_24px_54px_rgba(0,0,0,0.15)]">
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
        <header className="flex md:flex-row items-center h-[60px] bg-[#176B87] justify-between px-[12px]">
            <div className="flex items-center justify-between w-full md:w-auto">
                <div className="flex items-center">
                    <Link to={config.routes.home} className="font-semibold text-white hover:underline px-4">
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
                    className="text-center text-white w-[50px] bg-[#B4D4FF] rounded-full border border-solid border-white transition-all hover:bg-[#EEF5FF]"
                >
                    <FontAwesomeIcon icon={faCloudArrowUp} className="text-[#176B87]" />
                </Link>
                <div className="hidden md:flex gap-[20px]">
                    <Link to={config.routes.tutorialList} className="text-white hover:underline">
                        Discover
                    </Link>
                    <Link to={config.routes.about} className="text-white hover:underline">
                        About
                    </Link>
                    <Link to="/link3" className="text-white hover:underline">
                        Saved
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
                                <div className="p-[10px] rounded-[8px] mt-[10px] bg-[#f051231a] cursor-pointer">
                                    <h4>
                                        Works "<span className="font-medium">INFO</span>"
                                    </h4>
                                    <p className="text-[#f05123] text-[12px] mt-[4px]">Time</p>
                                </div>
                                <div className="p-[10px] rounded-[8px] mt-[10px] bg-[#f051231a] cursor-pointer">
                                    <h4>
                                        Works "<span className="font-medium">INFO</span>"
                                    </h4>
                                    <p className="text-[#f05123] text-[12px] mt-[4px]">Time</p>
                                </div>
                            </div>
                        </div>
                    )}
                >
                    <button className="p-[5px] bg-[#B4D4FF] rounded-full border border-solid border-white transition-all hover:bg-[#EEF5FF]">
                        <NotifyIcon className="text-[#176B87]" />
                    </button>
                </HeadlessTippy>
                <div className="account-global flex items-center justify-center h-full w-[48px] hover:bg-[#005A9E] transition-colors cursor-pointer">
                    <HeadlessTippy
                        trigger="click"
                        interactive
                        offset={[8, 18]}
                        placement="bottom-end"
                        render={renderResult}
                    >
                        <Image
                            className="rounded-full w-[32px] h-[32px] object-cover border-[1px] border-solid border-white"
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
