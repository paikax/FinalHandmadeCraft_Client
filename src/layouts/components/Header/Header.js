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

function Header({ currentUser }) {
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const avatar = currentUser.profilePhoto;

    const dispatch = useDispatch(); // Moved dispatch declaration here
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logOut(dispatch, navigate);
    };

    // const id = currentUser.id;
    // const accessToken = currentUser?.accessToken;
    // const axiosJWT = createAxios(currentUser, dispatch, logOutSuccess);

    // const { mutate } = useMutation({
    //     mutationFn: () => logOut(dispatch, id, navigate, accessToken, axiosJWT),
    //     onSuccess: (data) => {
    //         if (data && data.status === 200) {
    //             toast.success('Logout successfully');
    //         } else {
    //             toast.error('Logout failed!');
    //         }
    //     },
    // });

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
                        src={avatar || ''}
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
        <header className="flex items-center h-[48px] bg-[#2564cf] justify-between px-[12px]">
            <Link to={config.routes.home} className="font-semibold text-white hover:underline px-4">
                HandMadeCraft
            </Link>

            <Search />

            <div className="flex items-center gap-[10px] h-full">
                <HeadlessTippy
                    trigger="click"
                    interactive
                    offset={[8, 8]}
                    placement="bottom-end"
                    render={() => (
                        <div className="bg-white shadow-[0_24px_54px_rgba(0,0,0,0.15)]">
                            <div className="flex justify-between p-[16px] pb-[0px]">
                                <h3 className="text-[18px] font-medium">Thông báo</h3>
                                <button className="text-[#f05123] text-[14px] hover:bg-[#f5f5f5] p-[6px] rounded-[4px]">
                                    Marks as read
                                </button>
                            </div>
                            <div className="flex flex-col p-[10px]">
                                <div className="p-[10px] rounded-[8px] mt-[10px] bg-[#f051231a] cursor-pointer">
                                    <h4>
                                        Works "<span className="font-medium">tac vu huynguyen</span>" sắp đến hạn
                                    </h4>
                                    <p className="text-[#f05123] text-[12px] mt-[4px]">3 tháng trước</p>
                                </div>
                                <div className="p-[10px] rounded-[8px] mt-[10px] bg-[#f051231a] cursor-pointer">
                                    <h4>
                                        Works "<span className="font-medium">tac vu huynguyen</span>" sắp đến hạn
                                    </h4>
                                    <p className="text-[#f05123] text-[12px] mt-[4px]">3 tháng trước</p>
                                </div>
                            </div>
                        </div>
                    )}
                >
                    <button className="p-[10px] rounded-full hover:bg-[#005A9E]">
                        <NotifyIcon className="text-white" />
                    </button>
                </HeadlessTippy>
                <div className="account-global flex items-center justify-center h-full w-[48px] hover:bg-[#005A9E] transition-colors cursor-pointer">
                    <HeadlessTippy
                        trigger="click"
                        interactive
                        offset={[8, 8]}
                        placement="bottom-end"
                        render={renderResult}
                    >
                        <Image
                            className="rounded-full w-[32px] h-[32px] object-cover border-[1px] border-solid border-white"
                            src={avatar || ''}
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
