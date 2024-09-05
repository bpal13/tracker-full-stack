import { Link } from 'react-router-dom';

const NoPermission = () => {
  return (
    <div className='card h-fit p-4 bg-white rounded-xl gap-4'>
      <section className='text-center'>
        <h1 className='font-semibold text-2xl'>Error</h1>
      </section>
      <section>
        <p>You don't have permission to view this page. </p>
      </section>
      <section className=''>
        <Link to='/' className='btn btn-outline-primary btn-block'>
          Back
        </Link>
      </section>
    </div>
  );
};
export default NoPermission;
