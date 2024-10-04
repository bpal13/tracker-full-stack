import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InputGroup from '../InputGroup';
import useApiPrivate from '../../hooks/useApiPrivate';
import { apiPublic } from '../../api/ApiClient';
import toast from 'react-hot-toast';

const ResetPasswordRequest = () => {
  const [formData, setFormData] = useState({ password: '', password2: '' });
  const [formError, setFormError] = useState({});
  const navigate = useNavigate();
  const url_token = useParams();
  const formRef = useRef();
  const api = useApiPrivate();

  const rePassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/;

  useEffect(() => {
    formRef.current.focus();
  }, []);

  // Check for password reqs
  useEffect(() => {
    if (formData.password.length < 8) {
      setFormError({
        ...formError,
        password: 'Must be at least 8 characters long.',
      });
    } else if (
      formData.password2 != '' &&
      formData.password2 != formData.password
    ) {
      setFormError({
        ...formError,
        password2: 'Passwords must match',
      });
    } else {
      setFormError('');
    }
  }, [formData.password2, formData.password]);

  // Password reset api call
  const handleSubmit = async (e) => {
    e.preventDefault();
    const re = rePassword.exec(formData.password2);
    if (re === null) {
      toast.error('Password must meet the requirements');
    } else {
      try {
        const resp = await api.put(`/password-reset/${url_token.token}`, {
          ...formData,
        });
        if (resp.status === 200) {
          setFormData({ password: '', password2: '' });
          navigate('/');
        }
        console.log(resp);
      } catch (error) {
        if (!error?.resp) {
          toast.error('Server is not responding. Try again later.');
        } else if (error.status == 404) {
          toast.error('User does not exist.');
        }
      }
    }
  };

  return (
    <form
      className='bg-white border border-solid border-gray-400 rounded-xl p-6 flex flex-row max-w-[600px]'
      onSubmit={handleSubmit}
    >
      <section className='max-w-[50%] flex flex-col justify-center'>
        <p>
          <b>Password requirements:</b>
        </p>
        <ul>
          <li>Min. 6 characters long</li>
          <li>1 uppercase letter</li>
          <li>1 special character</li>
        </ul>
      </section>
      <div className='divider divider-vertical' />
      <section className='flex flex-col gap-4'>
        <h1 className='text-center font-semibold text-xl text-wrap'>
          Reset your password
        </h1>
        <div>
          <InputGroup
            label='New Password'
            type='password'
            name='form-password'
            fieldRef={formRef}
            required={true}
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
            error={formError.password}
          />
          <InputGroup
            label='Confirm Password'
            type='password'
            name='form-password2'
            required={true}
            value={formData.password2}
            onChange={(e) => {
              setFormData({ ...formData, password2: e.target.value });
            }}
            error={formError.password2}
          />
        </div>
        <div>
          <button type='submit' className='btn btn-primary btn-block'>
            Submit
          </button>
        </div>
      </section>
    </form>
  );
};
export default ResetPasswordRequest;
