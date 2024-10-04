import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
  return (
    <div className='bg-slate-200 sticky flex h-screen flex-row gap-4 overflow-y-auto rounded-lg sm:overflow-x-hidden'>
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
      <Sidebar />
      {children}
    </div>
  );
};
export default Layout;
