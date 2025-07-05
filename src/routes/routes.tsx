import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import UserManagement from '../pages/userManagement';
import LogManagement from '../pages/logManagement';
import MyProfile from '../components/MyProfile';
import Login from '../authPages/login';
import ProtectedRoute from './protectedRoute';
import NotFound from '../pages/notFound';
import ComingSoon from '../pages/comingSoon';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <Login /> },
      { path: 'login', element: <Login /> },

      {
        path: 'user/management',
        element: (
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'log/management',
        element: (
          <ProtectedRoute>
            <LogManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <ComingSoon />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <ComingSoon />
          </ProtectedRoute>
        ),
      },
      {
        path: 'security/settings',
        element: (
          <ProtectedRoute>
            <ComingSoon />
          </ProtectedRoute>
        ),
      },
      {
        path: 'company/:ticker',
        element: (
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        ),
        children: [{ path: 'my-profile', element: <MyProfile /> }],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
