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
            <div className="bg-white shadow-lg rounded-lg p-4">
                <div className="flex justify-end">
                    <Link
                        to={config.routes.home}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:underline rounded-md"
                    >
                        Go Home
                    </Link>
                </div>
                <div className="flex items-center mt-4">
                    <div className="relative">
                        <Image
                            className="rounded-full w-20 h-20 object-cover border-2 border-solid border-white"
                            src={avatar || ''}
                            alt="Avatar"
                        />
                        <span className="absolute bottom-0 right-0 inline-block w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="ml-4">
                        <h2 className="font-semibold text-2xl text-gray-800">{name || currentUser?.username}</h2>
                        <p className="text-sm text-gray-600">{email || currentUser?.email}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <header className="flex items-center h-16 bg-gradient-to-r from-blue-500 to-purple-600 justify-between px-4">
            <Link to={config.routes.home} className="font-semibold text-white hover:underline">
                HandMadeCraft
            </Link>

            <div className="account-global relative group">
                <HeadlessTippy trigger="click" interactive offset={[8, 8]} placement="bottom-end" render={renderResult}>
                    <Image
                        className="rounded-full w-10 h-10 object-cover border-2 border-solid border-white group-hover:shadow-lg"
                        src={avatar || ''}
                        alt="Avatar"
                    />
                </HeadlessTippy>
                <span className="absolute bottom-0 right-0 inline-block w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
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
