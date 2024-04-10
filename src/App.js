import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { DashboardRoute, PrivateRoute, UnauthorizeRoute, dashboardRoutes, privateRoutes, publicRoutes } from '~/routes';
import Error from './pages/client/Error';
import Footer from './components/Footer/Footer';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <UnauthorizeRoute route={route}>
                                        <Page />
                                    </UnauthorizeRoute>
                                }
                            />
                        );
                    })}
                    {privateRoutes.map((route, index) => {
                        const Page = route.component;

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <PrivateRoute route={route}>
                                        <Page />
                                    </PrivateRoute>
                                }
                            />
                        );
                    })}
                    {dashboardRoutes.map((route, index) => {
                        const Page = route.component;

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <DashboardRoute route={route}>
                                        <Page />
                                    </DashboardRoute>
                                }
                            />
                        );
                    })}
                    <Route path="*" element={<Error />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
