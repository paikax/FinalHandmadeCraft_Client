import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import React from 'react';

import { BarsIcon, DashboardIcon, SignOutIcon, TagsIcon, UserIcon } from '~/components/Icons';
import config from '~/config';
import styles from './AdminSidebar.module.scss';

const cx = classNames.bind(styles);

const sidebarList = [
    {
        id: 1,
        icon: DashboardIcon,
        to: config.routes.dashboard,
        title: 'Dashboard',
    },
    {
        id: 2,
        icon: UserIcon,
        to: config.routes.users,
        title: 'Users',
    },
    {
        id: 3,
        icon: TagsIcon,
        to: config.routes.labels,
        title: 'Labels',
    },
    {
        id: 4,
        icon: SignOutIcon,
        title: 'Go home',
    },
];

function AdminSidebar({ showSidebar, handleToggleSidebar }) {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(config.routes.home);
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
                                            cx('flex', 'items-center', 'text-2xl', 'px-[24px]', 'py-[12px]', {
                                                active: isActive,
                                            })
                                        }
                                    >
                                        <Icon />
                                        <span className="ml-[16px]">{item.title}</span>
                                    </NavLink>
                                ) : (
                                    <button
                                        className="flex items-center text-2xl px-[24px] py-[12px] w-full"
                                        onClick={handleNavigate}
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

            <aside className="fixed bg-white bottom-0 right-0 left-0 sm:hidden border-t border-solid border-[#f5f5f5]">
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
                                        onClick={handleNavigate}
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

AdminSidebar.propTypes = {
    handleToggleSidebar: PropTypes.func,
    showSidebar: PropTypes.bool,
};

const mapStateToProps = (state) => {
    return {
        currentUser: state.auth.login.currentUser,
    };
};

export default connect(mapStateToProps)(AdminSidebar);
