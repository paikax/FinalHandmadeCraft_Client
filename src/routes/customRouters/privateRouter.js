import { Fragment } from 'react';
import { connect } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import config from '~/config';
import { DefaultLayout } from '~/layouts';

const PrivateRoute = ({ id, route, children }) => {
    const location = useLocation();
    const userId = localStorage.getItem('userId');

    let Layout = DefaultLayout;

    if (route.layout) {
        Layout = route.layout;
    } else if (route.layout === null) {
        Layout = Fragment;
    }

    return id || userId ? (
        <Layout>{children}</Layout>
    ) : (
        <Navigate to={config.routes.login} state={{ from: location }} />
    );
};

const mapStateToProps = (state) => {
    return {
        id: state.auth.login.currentUser?.id,
    };
};

export default connect(mapStateToProps)(PrivateRoute);
