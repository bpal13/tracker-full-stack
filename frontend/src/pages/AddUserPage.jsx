import { useState, useRef, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useApiPrivate from '../hooks/useApiPrivate';
import Layout from '../components/Layout';
import InputGroup from '../components/InputGroup';
import toast from 'react-hot-toast';
import NoPermission from '../components/error/NoPermission';

const AddUserPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullname: '',
    password: '',
    employee_id: 0,
    user_role: 0,
  });
  const [formError, setFormError] = useState();
  const usernameRef = useRef();
  const api = useApiPrivate();
  const { auth } = useAuth();

  useEffect(() => {
    if (auth.role === 'admin') {
      usernameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    document.title = 'Add user - MEO Tracker';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // clear form error
    setFormError();
    console.log(formData);
    if (formData.user_role === 0 || formData.user_role === '0') {
      setFormError('Choose a user role.');
    } else {
      try {
        const resp = await api.post('/admin/register', { ...formData });
        if (resp.status === 201) {
          toast.success('Registration Successful.');
          setFormData({});
        }
      } catch (error) {
        if (!error?.resp) {
          toast.error('No response from the server.');
        } else {
          toast.error(error);
        }
      }
    }
  };

  return (
    <Layout>
      {auth.role === 'admin' ? (
        <div className='flex flex-col justify-center items-center w-screen'>
          <form
            className='flex flex-col gap-4 bg-white border border-solid rounded-xl p-4'
            onSubmit={handleSubmit}
          >
            <section className='text-center'>
              <h1 className='font-semibold text-2xl'>New user</h1>
            </section>
            <section className='grid grid-cols-2 gap-4'>
              <InputGroup
                label='Username'
                name='form-username'
                placeholder='user.name'
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                fieldRef={usernameRef}
              />
              <InputGroup
                label='Email Address'
                type='email'
                name='form-email'
                placeholder='email@example.com'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <InputGroup
                label='Full Name'
                name='form-fullname'
                placeholder='John Doe'
                value={formData.fullname}
                onChange={(e) =>
                  setFormData({ ...formData, fullname: e.target.value })
                }
              />
              <InputGroup
                label='Password'
                type='password'
                name='form-psw'
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <InputGroup
                label='Employee ID'
                name='form-employee'
                type='number'
                value={formData.employee_id}
                onChange={(e) =>
                  setFormData({ ...formData, employee_id: e.target.value })
                }
              />
              <div className='flex flex-col'>
                <label htmlFor='form-roles' className='text-sm'>
                  User Role
                </label>
                <select
                  id='form-roles'
                  className='select focus:select-primary'
                  value={formData.user_role}
                  onChange={(e) =>
                    setFormData({ ...formData, user_role: e.target.value })
                  }
                >
                  <option value={0}>Válassz...</option>
                  <option value={1}>Admin</option>
                  <option value={2}>Operator</option>
                  <option value={3}>Viewer</option>
                </select>
                {formError && (
                  <p className='text-red-600 font-semibold text-sm mt-1'>
                    {formError}
                  </p>
                )}
              </div>
            </section>
            <section>
              <button className='btn btn-primary btn-block'>Register</button>
            </section>
          </form>
        </div>
      ) : (
        <div className='flex flex-col justify-center w-screen h-screen items-center'>
          <NoPermission />
        </div>
      )}
    </Layout>
  );
};
export default AddUserPage;
