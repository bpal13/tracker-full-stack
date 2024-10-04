import { useState, useEffect, useRef } from 'react';
import InputGroup from '../InputGroup';
import useApiPrivate from '../../hooks/useApiPrivate';

import toast from 'react-hot-toast';

const ResetPasswordRequest = () => {
  const [formData, setFormData] = useState('');
  const formRef = useRef();
  const api = useApiPrivate();

  useEffect(() => {
    formRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await api.post('/password-reset', { email: formData });
      if (resp.status === 200) {
        toast.success(resp.data.message);
        setFormData('');
      }
    } catch (error) {
      if (!error.resp) {
        toast.error('Server is not responding. Try again later.');
      } else {
        console.log(error);
      }
    }
  };

  return (
    <form
      className='bg-white border border-solid border-gray-400 rounded-xl p-6 flex flex-row max-w-[600px]'
      onSubmit={handleSubmit}
    >
      <section className='max-w-[50%]'>
        <p>
          You will receive an email containing your password reset link, if your
          email is valid.
        </p>
      </section>
      <div className='divider divider-vertical' />
      <section className='flex flex-col gap-4'>
        <h1 className='text-center font-semibold text-xl text-wrap'>
          Reset your password
        </h1>
        <div>
          <InputGroup
            label='Email Address'
            type='email'
            name='form-email'
            fieldRef={formRef}
            required={true}
            value={formData}
            onChange={(e) => {
              setFormData(e.target.value);
            }}
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
