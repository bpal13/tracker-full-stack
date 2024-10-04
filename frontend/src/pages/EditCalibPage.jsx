import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useApiPrivate from '../hooks/useApiPrivate';
import InputGroup from '../components/InputGroup';
import { SelectGroup } from '../components/SelectGroup';
import Layout from '../components/Layout';
import { calib_ratings } from '../field data/FieldDataLocations';
import toast from 'react-hot-toast';

const EditCalibPage = () => {
  const api = useApiPrivate();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [formData, setFormData] = useState({ ...state });
  // console.log(formData);

  //edit form data wrapper
  const editFormData = async (data) => {
    // console.log(data);
    setFormData({ ...formData, ...data });
  };

  useEffect(() => {
    document.title = 'Edit Calibration - MEO Tracker';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/tools/calibration/${state.id}`);
      navigate('/tool/details', {
        state: {
          id: state.parent_id,
          notif: 'Calibration saved.',
          toastId: 'calibEdit',
        },
      });
    } catch (error) {
      if (!error?.response) {
        toast.error('No response from the server.');
      }
    }
  };

  return (
    <Layout>
      <div className='flex flex-col justify-center items-center w-screen'>
        <form
          className='grid grid-cols-1 p-4 gap-1 border border-solid border-gray-400 rounded-2xl bg-white'
          onSubmit={handleSubmit}
        >
          <section>
            <h1 className='text-2xl text-center font-semibold'>
              Edit Calibration
            </h1>
          </section>
          <section className='grid grid-cols-3 gap-4'>
            <SelectGroup
              label='Értékelés:'
              name='form-rating'
              options={calib_ratings}
              value={formData.rating}
              onChange={(e) => editFormData({ rating: e.target.value })}
            />
            <InputGroup
              label='Hőmérséklet'
              name='form-temperature'
              value={formData.temperature}
              onChange={(e) => editFormData({ temperature: e.target.value })}
            />
            <InputGroup
              label='Mért eltérés:'
              name='form-deviation'
              value={formData.actual_deviation}
              onChange={(e) =>
                editFormData({ actual_deviation: e.target.value })
              }
            />
            <InputGroup
              label='Etalon:'
              name='form-etalon'
              value={formData.etalon}
              onChange={(e) => editFormData({ etalon: e.target.value })}
            />
            <InputGroup
              label='Hasáb:'
              name='form-hasab'
              value={formData.hasab}
              onChange={(e) => editFormData({ hasab: e.target.value })}
            />
            <InputGroup
              label='Gyűrű:'
              name='form-ring'
              value={formData.ring}
              onChange={(e) => editFormData({ ring: e.target.value })}
            />
          </section>
          <div className='divider my-2' />
          <section className='grid grid-cols-3 gap-4'>
            <InputGroup
              label='KULSO I A:'
              name='form-KULSOIA'
              value={formData.KULSO_I_A}
              onChange={(e) => editFormData({ KULSO_I_A: e.target.value })}
            />
            <InputGroup
              label='KULSO II A:'
              name='form-KULSOIIA'
              value={formData.KULSO_II_A}
              onChange={(e) => editFormData({ KULSO_II_A: e.target.value })}
            />
            <InputGroup
              label='KULSO III A:'
              name='form-KULSOIIIA'
              value={formData.KULSO_III_A}
              onChange={(e) => editFormData({ KULSO_III_A: e.target.value })}
            />
            <InputGroup
              label='KULSO I B:'
              name='form-KULSOIB'
              value={formData.KULSO_I_B}
              onChange={(e) => editFormData({ KULSO_I_B: e.target.value })}
            />
            <InputGroup
              label='KULSO II B:'
              name='form-KULSOIIB'
              value={formData.KULSO_II_B}
              onChange={(e) => editFormData({ KULSO_II_B: e.target.value })}
            />
            <InputGroup
              label='KULSO III B:'
              name='form-KULSOIIIB'
              value={formData.KULSO_III_B}
              onChange={(e) => editFormData({ KULSO_III_B: e.target.value })}
            />
            <InputGroup
              label='KULSO I C:'
              name='form-KULSOIC'
              value={formData.KULSO_I_C}
              onChange={(e) => editFormData({ KULSO_I_C: e.target.value })}
            />
            <InputGroup
              label='KULSO II C:'
              name='form-KULSOIIC'
              value={formData.KULSO_II_C}
              onChange={(e) => editFormData({ KULSO_II_C: e.target.value })}
            />
            <InputGroup
              label='KULSO III C:'
              name='form-KULSOIIIC'
              value={formData.KULSO_III_C}
              onChange={(e) => editFormData({ KULSO_III_C: e.target.value })}
            />
          </section>
          <div className='divider my-2' />
          <section className='grid grid-cols-3 gap-4'>
            <InputGroup
              label='BELSO I A:'
              name='form-BELSOIA'
              value={formData.BELSO_I_A}
              onChange={(e) => editFormData({ BELSO_I_A: e.target.value })}
            />
            <InputGroup
              label='BELSO II A:'
              name='form-BELSOIIA'
              value={formData.BELSO_II_A}
              onChange={(e) => editFormData({ BELSO_II_A: e.target.value })}
            />
            <InputGroup
              label='BELSO III A:'
              name='form-BELSOIIIA'
              value={formData.BELSO_III_A}
              onChange={(e) => editFormData({ BELSO_III_A: e.target.value })}
            />
            <InputGroup
              label='BELSO I B:'
              name='form-BELSOIB'
              value={formData.BELSO_I_B}
              onChange={(e) => editFormData({ BELSO_I_B: e.target.value })}
            />
            <InputGroup
              label='BELSO II B:'
              name='form-BELSOIIB'
              value={formData.BELSO_II_B}
              onChange={(e) => editFormData({ BELSO_II_B: e.target.value })}
            />
            <InputGroup
              label='BELSO III B:'
              name='form-BELSOIIIB'
              value={formData.BELSO_III_B}
              onChange={(e) => editFormData({ BELSO_III_B: e.target.value })}
            />
            <InputGroup
              label='BELSO I C:'
              name='form-BELSOIC'
              value={formData.BELSO_I_C}
              onChange={(e) => editFormData({ BELSO_I_C: e.target.value })}
            />
            <InputGroup
              label='BELSO II C:'
              name='form-BELSOIIC'
              value={formData.BELSO_II_C}
              onChange={(e) => editFormData({ BELSO_II_C: e.target.value })}
            />
            <InputGroup
              label='BELSO III C:'
              name='form-BELSOIIIC'
              value={formData.BELSO_III_C}
              onChange={(e) => editFormData({ BELSO_III_C: e.target.value })}
            />
          </section>
          <div className='divider my-2' />
          <section>
            <div className='grid grid-cols-1'>
              <label htmlFor='form-notes'>Notes:</label>
              <textarea
                id='forn-notes'
                className='textarea'
                cols={8}
                rows={3}
                value={
                  formData.calib_notes === null ? '' : formData.calib_notes
                }
                onChange={(e) => editFormData({ calib_notes: e.target.value })}
              ></textarea>
            </div>
          </section>
          <div className='divider my-2' />
          <section className='flex flex-row gap-2'>
            <button className='btn btn-primary btn-block' type='submit'>
              Submit
            </button>
            <Link
              to='/tool/calibration/details'
              className='btn btn-outline-primary btn-block'
              state={state}
            >
              Back
            </Link>
          </section>
        </form>
      </div>
    </Layout>
  );
};
export default EditCalibPage;
