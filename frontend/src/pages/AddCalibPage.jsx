import { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import InputGroup from '../components/InputGroup';
import { SelectGroup } from '../components/SelectGroup';
import { calib_ratings } from '../field data/FieldDataLocations';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import useApiPrivate from '../hooks/useApiPrivate';
import toast from 'react-hot-toast';

const AddCalibPage = () => {
  const api = useApiPrivate();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [formData, setFormData] = useState({
    rating: '',
    temperature: 0,
    actual_deviation: 0,
    etalon: '',
    hasab: '',
    ring: '',
    KULSO_I_A: 0,
    KULSO_II_A: 0,
    KULSO_III_A: 0,
    KULSO_I_B: 0,
    KULSO_II_B: 0,
    KULSO_III_B: 0,
    KULSO_I_C: 0,
    KULSO_II_C: 0,
    KULSO_III_C: 0,
    BELSO_I_A: 0,
    BELSO_II_A: 0,
    BELSO_III_A: 0,
    BELSO_I_B: 0,
    BELSO_II_B: 0,
    BELSO_III_B: 0,
    BELSO_I_C: 0,
    BELSO_II_C: 0,
    BELSO_III_C: 0,
    calib_notes: '',
  });

  // console.log(formData);

  const hasabRef = useRef();

  // form edit wrapper
  const editFormData = async (data) => {
    setFormData({ ...formData, ...data });
  };

  // set the focus on the form
  useEffect(() => {
    document.title = 'New Calibration - MEO Tracker';
    hasabRef.current.focus();
  }, []);

  // Send the data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await api.post(`/tools/calibrate/${state.id}`, {
        ...formData,
      });
      navigate('/tool/details', {
        state: { id: state.id, notif: 'Tool Calibrated.', toastId: 'calib' },
      });
    } catch (error) {
      if (!error?.response) {
        toast.error('Server is not responding.');
      }
      toast.error(error);
    }
  };

  return (
    <Layout>
      <div className='flex flex-col justify-center items-center w-screen'>
        <form
          className='grid grid-cols-1 gap-4 bg-white border border-solid border-gray-400 rounded-2xl p-4 w-fit'
          onSubmit={handleSubmit}
        >
          <section className='text-center'>
            <h1 className='text-2xl font-semibold'>Calibrate Tool</h1>
            <p className='text-sm'>{state.tool_serial}</p>
          </section>
          <section className='grid grid-cols-3 gap-4'>
            <InputGroup
              label='Hasáb:'
              name='form-hasab'
              fieldRef={hasabRef}
              value={formData.hasab}
              onChange={(e) => editFormData({ hasab: e.target.value })}
            />
            <InputGroup
              label='Gyűrű:'
              name='form-ring'
              value={formData.ring}
              onChange={(e) => editFormData({ ring: e.target.value })}
            />
            <InputGroup
              label='Etalon:'
              name='form-etalon'
              value={formData.etalon}
              onChange={(e) => editFormData({ etalon: e.target.value })}
            />
            <InputGroup
              label='Mért eltérés:'
              name='form-deviation'
              value={formData.actual_deviation}
              onChange={(e) =>
                editFormData({ actual_deviation: e.target.value })
              }
            />
            <SelectGroup
              label='Értékelés:'
              name='form-rating'
              options={calib_ratings}
              value={formData.rating}
              onChange={(e) => editFormData({ rating: e.target.value })}
            />
            <InputGroup
              label='Hőmérséklet:'
              name='form-temperature'
              type='number'
              value={formData.temperature}
              onChange={(e) => editFormData({ temperature: e.target.value })}
            />
          </section>
          <div className='divider my-0' />
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
          <div className='divider my-0' />
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
          <div className='divider my-0' />
          <section className='flex flex-row'>
            <div>
              <label htmlFor='form-notes'>Megjegyzés:</label>
              <textarea
                id='form-notes'
                value={formData.calib_notes}
                onChange={(e) => editFormData({ calib_notes: e.target.value })}
                className='textarea focus:textarea-primary'
                rows={4}
              ></textarea>
            </div>
          </section>
          <section className='flex flex-row gap-2'>
            <button type='submit' className='btn btn-block btn-primary'>
              Submit
            </button>
            <Link
              to={!state?.prevPath ? '/tool/details' : state.prevPath}
              state={state}
              className='btn btn-block btn-outline-primary'
            >
              Back
            </Link>
          </section>
        </form>
      </div>
    </Layout>
  );
};

export default AddCalibPage;
