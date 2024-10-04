import { useState, useRef, useEffect } from 'react';
import useApiPrivate from '../hooks/useApiPrivate';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';
import InputGroup from '../components/InputGroup';

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({ password: '', password2: '' });
  const [formError, setFormError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const api = useApiPrivate();
  const passRef = useRef();

  const rePassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/;

  useEffect(() => {
    document.title = 'Change Password - MEO Tracker';

    passRef.current.focus();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const re = rePassword.exec(formData.password2);
    if (re === null) {
      toast.error('Password must meet the requirements');
    } else {
      // console.log(formData);
      setIsLoading(true);
      try {
        const resp = api.put('/password-change', {
          ...formData,
        });
        toast.success('Your password has been updated.');
        setFormData({ password: '', password2: '' });
        setIsLoading(false);
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
    <Layout>
      <div className='flex flex-col justify-center items-center w-screen'>
        <form
          className='bg-white flex flex-row border border-solid border-gray-400 rounded-xl p-6 max-w-[600px]'
          onSubmit={handleSubmit}
        >
          <section className='max-w-[50%] flex flex-col justify-center'>
            <p>
              <b>Követelmények:</b>
            </p>
            <ul>
              <li>Min. 6 karakter hosszú</li>
              <li>1 nagybetű</li>
              <li>1 speciális karakter</li>
            </ul>
          </section>

          <div className='divider divider-vertical' />

          <section className=' flex flex-col gap-4 justify-end'>
            <div className='font-semibold text-center text-2xl'>
              <h1>Change Password</h1>
            </div>
            <div className='flex flex-col gap-2'>
              <InputGroup
                label='Új jelszavad'
                type='password'
                placeholder='New password'
                name='form-newpass'
                fieldRef={passRef}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={true}
                error={formError.password}
              />
              <InputGroup
                label='Jelszavad mégegyszer'
                type='password'
                placeholder='Confirm new password'
                name='form-newpass2'
                value={formData.password2}
                onChange={(e) =>
                  setFormData({ ...formData, password2: e.target.value })
                }
                required={true}
                error={formError.password2}
              />
            </div>
            <div>
              <button
                className={
                  isLoading
                    ? 'btn btn-loading btn-block'
                    : 'btn btn-primary btn-block'
                }
              >
                Submit
              </button>
            </div>
          </section>
        </form>
      </div>
    </Layout>
  );
};
export default ChangePasswordPage;
