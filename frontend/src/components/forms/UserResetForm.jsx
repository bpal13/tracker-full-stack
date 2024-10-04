import InputGroup from '../InputGroup';
import { useEffect, useState, useRef } from 'react';
import useApiPrivate from '../../hooks/useApiPrivate';
import toast from 'react-hot-toast';

const UserResetForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const api = useApiPrivate();
  const formRef = useRef();

  useEffect(() => {
    document.title = 'User Reset - MEO Tracker';
    formRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    try {
      const resp = await api.post('/admin/user-reset', { ...formData });
      if (resp.status === 200) {
        toast.success(resp.data.message);
      }
    } catch (error) {
      if (!error?.response) {
        toast.error('No response from the server. Try again later.');
      } else if (error.response.status === 404) {
        toast.error('User does not exist.');
      } else {
        toast.error(
          'There was an error processing the request. Try again later.'
        );
      }
    }
  };

  return (
    <form
      className='flex flex-row p-6 bg-white border border-solid border-gray-400 rounded-xl max-w-[600px] '
      onSubmit={handleSubmit}
    >
      <section className='max-w-[50%] flex flex-col justify-center'>
        <p>
          <b>User password reset</b>
        </p>
        <p>
          User will recieve an email notification including their new one-time
          login password.
        </p>
      </section>
      <div className='divider divider-vertical' />
      <section className='flex flex-col gap-4'>
        <div className='font-semibold text-center text-xl'>
          <h1>UserPasswordReset</h1>
        </div>
        <div>
          <InputGroup
            label='Username'
            name='form-username'
            fieldRef={formRef}
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          <InputGroup
            label='Password'
            type='password'
            name='form-password'
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
        <div>
          <button type='submit' className='btn btn-block btn-primary'>
            Submit
          </button>
        </div>
      </section>
    </form>
  );
};
export default UserResetForm;
