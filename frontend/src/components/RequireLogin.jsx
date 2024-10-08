import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RequireLogin = () => {
  const { auth } = useAuth();
  const location = useLocation();

  return auth?.username ? (
    <Outlet />
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
};
export default RequireLogin;
