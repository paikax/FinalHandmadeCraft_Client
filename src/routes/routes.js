import config from '~/config';

// Layouts
import { DashboardLayout, HeaderOnly } from '~/layouts';

// Pages
import Dashboard from '~/pages/admin/Dashboard';
import Home from '~/pages/client/Home';
import Login from '~/pages/client/Login';
import Register from '~/pages/client/Register';
import Search from '~/pages/client/Search';
import Settings from '~/pages/client/Settings';
import TutorialUpload from '~/pages/client/TutorialUpload/TutorialUpload';
import TutorialList from '~/pages/client/Tutorial/TutorialList';
import TutorialDetail from '~/pages/client/Tutorial/TutorialDetail';
import Profile from '~/pages/client/Profile';
import PaymentSetup from '~/pages/client/Payment/PaymentSetup';
import Order from '~/pages/client/Order';

// Public routes
const publicRoutes = [
    { path: config.routes.login, component: Login, layout: null },
    { path: config.routes.register, component: Register, layout: null },
];

// Private routes
const privateRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.search, component: Search },
    { path: config.routes.tutorialUpload, component: TutorialUpload },
    { path: config.routes.tutorialList, component: TutorialList },
    { path: config.routes.tutorialDetail, component: TutorialDetail },
    { path: config.routes.settings, component: Settings, layout: HeaderOnly },
    { path: config.routes.profile, component: Profile },
    { path: config.routes.paymentSetup, component: PaymentSetup },
    { path: config.routes.orders, component: Order },
];

// Admin routes
const dashboardRoutes = [{ path: config.routes.dashboard, component: Dashboard, layout: DashboardLayout }];

export { dashboardRoutes, privateRoutes, publicRoutes };
