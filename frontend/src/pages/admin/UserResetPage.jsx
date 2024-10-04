import UserResetForm from '../../components/forms/UserResetForm';
import Layout from '../../components/Layout';

const UserResetPage = () => {
  return (
    <Layout>
      <div className='flex flex-col items-center justify-center w-screen'>
        <UserResetForm />
      </div>
    </Layout>
  );
};
export default UserResetPage;
