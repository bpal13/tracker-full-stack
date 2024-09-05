import { apiPublic } from '../api/ApiClient';
import useAuth from './useAuth';

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refresh = async () => {
    const response = await apiPublic.get('/refresh', {
      withCredentials: true,
      // headers: {
      //   'Set-Cookie': `refresh_token=${auth.refreshToken}`,
      // },
    });
    setAuth((prev) => {
      // console.log(JSON.stringify(prev));
      // console.log(`New: ${response.data.access_token}`);
      return {
        ...prev,
        accessToken: response.data.access_token,
      };
    });
    return response.data.access_token;
  };

  return refresh;
};
export default useRefreshToken;
