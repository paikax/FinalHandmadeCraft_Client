import HeadlessTippy from '@tippyjs/react/headless';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Image from '~/components/Image/Image';
import config from '~/config';

function AdminHeader({ currentUser }) {
    const name = localStorage.getItem('name');
    const avatar = localStorage.getItem('profilePic');
    const email = localStorage.getItem('email');

    const renderResult = () => {
        return (
            <div className="bg-white shadow-[0_24px_54px_rgba(0,0,0,0.15)]">
                <div className="flex justify-end">
                    <Link
                        to={config.routes.home}
                        className="px-[14px] py-[15px] text-[14px] hover:bg-[#f5f5f5] hover:underline"
                    >
                        Go home
                    </Link>
                </div>
                <div className="flex items-center">
                    <Image
                        className="m-[20px] shrink-0 rounded-full w-[88px] h-[88px] object-cover border-[1px] border-solid border-[#777]"
                        src={avatar || ''}
                        alt="Avatar"
                    />

                    <div>
                        <h2 className="font-semibold text-[18px]">{name || currentUser?.username}</h2>
                        <p className="text-[14px]">{email || currentUser?.email}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <header className="flex items-center h-[48px] bg-[#2564cf] justify-between px-[12px]">
            <Link to={config.routes.home} className="font-semibold text-white hover:underline">
                HandMadeCraft
            </Link>

            <div className="account-global flex items-center justify-center h-full w-[48px] hover:bg-[#005A9E] transition-colors cursor-pointer">
                <HeadlessTippy trigger="click" interactive offset={[8, 8]} placement="bottom-end" render={renderResult}>
                    <Image
                        className="rounded-full w-[32px] h-[32px] object-cover border-[1px] border-solid border-white"
                        src={avatar || ''}
                        alt="Avatar"
                    />
                </HeadlessTippy>
            </div>
        </header>
    );
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.login.currentUser,
    };
};

export default connect(mapStateToProps)(AdminHeader);
