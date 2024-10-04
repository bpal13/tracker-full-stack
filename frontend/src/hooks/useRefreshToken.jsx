import { apiPublic } from '../api/ApiClient';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    const response = await apiPublic.get('/refresh', {
      withCredentials: true,
    });
    setAuth({
      username: response.data.username,
      accessToken: response.data.access_token,
      role: response.data.role,
      fullname: response.data.fullname,
    });
    return response.data.access_token;
  };

  return refresh;
};
export default useRefreshToken;
