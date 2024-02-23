import { Fragment } from 'react';
import { connect } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import config from '~/config';
import { DefaultLayout } from '~/layouts';

const DashboardRoute = ({ id, currentUser, route, children }) => {
    const location = useLocation();
    const userId = localStorage.getItem('userId');

    let Layout = DefaultLayout;

    if (route.layout) {
        Layout = route.layout;
    } else if (route.layout === null) {
        Layout = Fragment;
    }

    return currentUser?.isAdmin ? (
        <Layout>{children}</Layout>
    ) : id || userId ? (
        <Navigate to={config.routes.home} />
    ) : (
        <Navigate to={config.routes.login} state={{ from: location }} />
    );
};

const mapStateToProps = (state) => {
    return {
        id: state.auth.login.currentUser?._id,
        currentUser: state.auth.login.currentUser,
    };
};

export default connect(mapStateToProps)(DashboardRoute);
