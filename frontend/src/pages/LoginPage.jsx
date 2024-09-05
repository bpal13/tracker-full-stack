import { useState, useEffect, useRef } from 'react';
import InputGroup from '../components/InputGroup';
import { apiPrivate, apiPublic } from '../api/ApiClient';
import useAuth from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [formError, setFormError] = useState({});
  const usernameRef = useRef();
  const passwordRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');

  const [errMsg, setErrMsg] = useState();

  // Set the focus on the username field
  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  // Clear errors on change
  useEffect(() => {
    setFormError({});
    setErrMsg('');
  }, [user, pwd]);

  // Form Submission handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    // handle missing fields
    if (!user) {
      setFormError({ username: 'Field required.' });
    }
    try {
      const response = await apiPublic.post(
        '/login',
        {
          username: user,
          password: pwd,
        },
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      if (response?.status === 200) {
        console.log(response);
        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;
        setAuth({
          username: response.data.username,
          accessToken,
          refreshToken,
          role: response.data.role,
          fullname: response.data.fullname,
        });

        setUser('');
        setPwd('');
        navigate(from, { relative: true });
      }
    } catch (error) {
      if (!error?.response) {
        console.log(error);
        setErrMsg('No response from the server.');
      } else if (error.response.status === 403) {
        setErrMsg(error.response.data.detail);
      } else {
        setErrMsg('Login Failed.');
      }
    }
  };

  return (
    <main className='flex flex-col justify-center items-center bg-slate-200 h-screen'>
      {errMsg && (
        <div className='p-4 w-full absolute top-1'>
          <div className='alert bg-red-200'>
            <svg
              width='48'
              height='48'
              viewBox='0 0 48 48'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M24 4C12.96 4 4 12.96 4 24C4 35.04 12.96 44 24 44C35.04 44 44 35.04 44 24C44 12.96 35.04 4 24 4ZM24 26C22.9 26 22 25.1 22 24V16C22 14.9 22.9 14 24 14C25.1 14 26 14.9 26 16V24C26 25.1 25.1 26 24 26ZM26 34H22V30H26V34Z'
                fill='#E92C2C'
              />
            </svg>
            <div className='flex flex-col'>
              <span className='font-semibold'>Error</span>
              <span className='text-content2'>{errMsg}</span>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className='bg-white border border-solid border-gray-200 rounded-2xl p-4 flex flex-col gap-4'
      >
        <section className='form-header'>
          <h1 className='font-semibold text-2xl text-center'>Sign In</h1>
          <p className='text-sm text-center'>To gain access to the page.</p>
        </section>
        <section className='form-fields flex flex-col gap-3'>
          <InputGroup
            label='Username'
            type='text'
            placeholder='username'
            name='username'
            value={user}
            onChange={(e) => setUser(e.target.value)}
            fieldRef={usernameRef}
            error={formError.username}
          />
          <InputGroup
            label='Password'
            type='password'
            placeholder='password'
            name='password'
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            fieldRef={passwordRef}
          />
          <button className='btn btn-primary btn-block font-bold'>
            Sign In
          </button>
        </section>
        <section className='form-footer'>
          <p className='text-sm'>
            Forgot your password?
            <a href='#'>Click here.</a>
          </p>
        </section>
      </form>
    </main>
  );
};
export default LoginPage;
