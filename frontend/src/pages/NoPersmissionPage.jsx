import Layout from '../components/Layout';
import NoPermission from '../components/error/NoPermission';

const NoPersmissionPage = () => {
  useEffect(() => {
    document.title = 'Error - MEO Tracker';
  }, []);
  return (
    <Layout>
      <div className='flex flex-col w-screen justify-center items-center'>
        <NoPermission />
      </div>
    </Layout>
  );
};
export default NoPersmissionPage;
