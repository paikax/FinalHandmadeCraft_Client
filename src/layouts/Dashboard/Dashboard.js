import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { useState } from 'react';

import { BarsIcon } from '~/components/Icons';
import AdminHeader from '~/layouts/components/AdminHeader';
import styles from './Dashboard.module.scss';
import AdminSidebar from '~/layouts/components/AdminSidebar';

const cx = classNames.bind(styles);
function Dashboard({ children }) {
    const [showSidebar, setShowSidebar] = useState(true);

    const handleToggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    return (
        <div className={cx('wrapper')}>
            <AdminHeader />
            <div className={cx('container')}>
                <AdminSidebar showSidebar={showSidebar} handleToggleSidebar={handleToggleSidebar} />
                <button className={cx('bars-icon', 'max-sm:hidden')} onClick={handleToggleSidebar}>
                    <BarsIcon />
                </button>
                <div className={cx('content', 'max-sm:p-[12px]')}>{children}</div>
            </div>
        </div>
    );
}

Dashboard.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Dashboard;
