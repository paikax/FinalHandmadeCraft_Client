import { Fragment } from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

import config from '~/config';
import { DefaultLayout } from '~/layouts';

const UnauthorizeRoute = ({ id, route, children }) => {
    const userId = localStorage.getItem('userId');

    let Layout = DefaultLayout;

    if (route.layout) {
        Layout = route.layout;
    } else if (route.layout === null) {
        Layout = Fragment;
    }

    return id || userId ? <Navigate to={config.routes.home} /> : <Layout>{children}</Layout>;
};

const mapStateToProps = (state) => {
    return {
        id: state.auth.login.currentUser?.id,
    };
};

export default connect(mapStateToProps)(UnauthorizeRoute);
