import ResetPasswordForm from '../components/forms/ResetPasswordForm';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

const NewPasswordPage = () => {
  useEffect(() => {
    document.title = 'Password Reset - MEO Tracker';
  }, []);

  return (
    <>
      <Toaster
        position='top-center'
        toastOptions={{
          success: {
            className: 'alert alert-success',
            duration: 3000,
          },
          error: {
            duration: 3000,
            className: 'alert alert-error',
          },
        }}
      />
      <div className='flex flex-col items-center justify-center w-screen h-screen bg-slate-300'>
        <ResetPasswordForm />
      </div>
    </>
  );
};
export default NewPasswordPage;
