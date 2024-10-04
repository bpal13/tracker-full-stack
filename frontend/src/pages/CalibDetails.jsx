import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import Layout from '../components/Layout';
import moment from 'moment';

const CalibDetails = () => {
  const { state } = useLocation();
  const { auth } = useAuth();

  useEffect(() => {
    document.title = 'Calibration Detail  - MEO Tracker';
  }, []);

  return (
    <Layout>
      <div className='flex flex-col justify-center items-center w-screen'>
        <div className=' grid grid-cols-1 gap-4 bg-white p-4 rounded-xl h-fit max-w-2xl border border-solid border-gray-400'>
          <h1 className='text-2xl font-semibold text-center'>
            Calibration Details
          </h1>
          <section className='grid grid-cols-3 gap-4'>
            <div>
              <p className='text-md font-semibold'>Kalibrálta:</p>
              <p>{state.calibration_by}</p>
            </div>
            <div>
              <p className='text-md font-semibold'>Értékelés:</p>
              <p>{state.rating}</p>
            </div>
            <div>
              <p className='text-md font-semibold'>Hömérséklet:</p>
              <p>{state.temperature} °C</p>
            </div>
            <div>
              <p className='text-md font-semibold'>Mért eltérés:</p>
              <p>{state.actual_deviation} mm</p>
            </div>
            <div>
              <p className='text-md font-semibold'>Kalibráció napja:</p>
              <p>{moment(state.calibration_date).format('LL')}</p>
            </div>
            <div>
              <p className='text-md font-semibold'>Következő kalibráció:</p>
              <p>{moment(state.next_calibration).format('LL')}</p>
            </div>
            <div>
              <p className='text-md font-semibold'>Hasáb:</p>
              <p>{state.hasab === null ? 'N/A' : state.hasab}</p>
            </div>
            <div>
              <p className='text-md font-semibold'>Gyűrű:</p>
              <p>{state.ring === null ? 'N/A' : state.ring}</p>
            </div>
            <div>
              <p className='text-md font-semibold'>Etalon:</p>
              <p>{state.etalon === null ? 'N/A' : state.etalon}</p>
            </div>
          </section>
          <div className='divider' />
          <section className='grid grid-cols-3 gap-4'>
            <div>
              <p className='text-md font-semibold'>KULSO I A</p>
              <p>{state.KULSO_I_A} mm</p>
            </div>
            <div>
              <p className='text-md font-semibold'>KULSO II A</p>
              <p>{state.KULSO_II_A} mm</p>
            </div>
            <div>
              <p className='text-md font-semibold'>KULSO III A</p>
              <p>{state.KULSO_III_A} mm</p>
            </div>
            <div>
              <p className='text-md font-semibold'>KULSO I B</p>
              <p>{state.KULSO_I_B} mm</p>
            </div>
            <div>
              <p className='text-md font-semibold'>KULSO II B</p>
              <p>{state.KULSO_II_B} mm</p>
            </div>
            <div>
              <p className='text-md font-semibold'>KULSO III B</p>
              <p>{state.KULSO_III_B} mm</p>
            </div>
            <div>
              <p className='text-md font-semibold'>KULSO I C</p>
              <p>{state.KULSO_I_C} mm</p>
            </div>
            <div>
              <p className='text-md font-semibold'>KULSO II C</p>
              <p>{state.KULSO_II_C} mm</p>
            </div>
            <div>
              <p className='text-md font-semibold'>KULSO III C</p>
              <p>{state.KULSO_III_C} mm</p>
            </div>
            <div>
              <p className='text-md font-semibold'>BELSO I A</p>
              <p>{state.BELSO_I_A} mm</p>
            </div>
            <div>
              <p className='text-md font-semibold'>BELSO II A</p>
              <p>{state.BELSO_II_A} mm</p>
            </div>
            <div>
              <p className='text-md font-semibold'>BELSO III A</p>
              <p>{state.BELSO_III_A} mm</p>
            </div>
            <div>
              <p className='text-md font-semibold'>BELSO I B</p>
              <p>{state.BELSO_I_B} mm</p>
            </div>
            <div>
              <p className='text-md font-semibold'>BELSO II B</p>
              <p>{state.BELSO_II_B} mm</p>
            </div>
            <div>
              <p className='text-md font-semibold'>BELSO III B</p>
              <p>{state.BELSO_III_B} mm</p>
            </div>
            <div>
              <p className='text-md font-semibold'>BELSO I C</p>
              <p>{state.BELSO_I_C} mm</p>
            </div>
            <div>
              <p className='text-md font-semibold'>BELSO II C</p>
              <p>{state.BELSO_II_C} mm</p>
            </div>
            <div>
              <p className='text-md font-semibold'>BELSO III C</p>
              <p>{state.BELSO_III_C} mm</p>
            </div>
            <div>
              <p className='text-md font-semibold'>Notes:</p>
              <p className='border-2 border-solid border-gray-300 rounded-2xl p-2 text-sm bg-white h-28 w-96 overflow-scroll'>
                {state.calib_notes === null
                  ? 'Nincs Megjegyzes.'
                  : state.calib_notes}
              </p>
            </div>
          </section>
          <section className='flex flex-row gap-2'>
            {auth?.role === 'viewer' || (
              <Link
                className='btn btn-primary btn-block'
                state={state}
                to='/tool/calibration/edit'
              >
                Edit Calibration
              </Link>
            )}
            <button
              type='button'
              className='btn btn-error btn-block'
              disabled={auth?.role === 'viewer' ? true : false}
            >
              Delete
            </button>
            <Link
              className='btn btn-outline-primary btn-block'
              to='/tool/details'
              state={{ ...state.prevTool }}
            >
              Back
            </Link>
          </section>
        </div>
      </div>
    </Layout>
  );
};
export default CalibDetails;
