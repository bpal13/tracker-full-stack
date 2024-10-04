import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RestrictedRoutes = () => {
  const { auth } = useAuth();
  const location = useLocation();

  return auth?.role === 'viewer' ? (
    <Navigate to='/error' state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
};
export default RestrictedRoutes;
