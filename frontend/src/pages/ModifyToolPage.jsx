import Layout from '../components/Layout';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import useApiPrivate from '../hooks/useApiPrivate';
import InputGroup from '../components/InputGroup';
import { SelectGroup } from '../components/SelectGroup';
import {
  tool_locations,
  tool_names,
  tool_types,
} from '../field data/FieldDataLocations';
import toast from 'react-hot-toast';

const ModifyToolPage = () => {
  const [formError, setFormError] = useState({});
  const navigate = useNavigate();

  const api = useApiPrivate();
  let { state } = useLocation();
  const [formData, setFormData] = useState({ ...state });
  // console.log(formData);

  const toolIDRef = useRef();
  const toolBrandRef = useRef();
  const toolSerialRef = useRef();
  const toolAccRef = useRef();
  const toolRangeRef = useRef();
  const toolDevRef = useRef();

  // console.log(state);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/tools/update/${state.id}`, {
        tool_id: formData.tool_id,
        tool_name: formData.tool_name,
        tool_location: formData.tool_location,
        tool_type: formData.tool_type,
        tool_brand: formData.tool_brand,
        tool_serial: formData.tool_serial,
        tool_accuracy: formData.tool_accuracy,
        tool_range: formData.tool_range,
        max_deviation: formData.max_deviation,
        notes: formData.notes,
      });
      navigate('/tool/details', {
        state: { id: state.id, notif: 'Tool Saved.', toastId: 'edit' },
      });
    } catch (error) {
      if (!error?.response) {
        toast.error('No response from the server');
      } else {
        toast.error(error);
      }
    }
  };

  return (
    <Layout>
      <div className='flex flex-col justify-center items-center w-screen'>
        <form
          className='border rounded-xl p-4 bg-white'
          onSubmit={handleSubmit}
        >
          <h1 className='text-center font-medium text-2xl my-2'>Edit Tool</h1>
          <div className='grid gap-4'>
            <div className='grid grid-cols-2'>
              <SelectGroup
                label='Tool Location'
                name='tool_location'
                options={tool_locations}
                value={formData.tool_location}
                onChange={(e) =>
                  setFormData({ ...formData, tool_location: e.target.value })
                }
              />
              <InputGroup
                label='Tool ID'
                placeholder='pl: 4128'
                name='tool_id'
                fieldRef={toolIDRef}
                required={true}
                error={formError.tool_id}
                value={formData.tool_id}
                onChange={(e) =>
                  setFormData({ ...formData, tool_id: e.target.value })
                }
              />
            </div>
            <div className='grid grid-cols-2'>
              <InputGroup
                label='Tool Brand'
                placeholder='pl: Mitutoyo'
                name='tool_brand'
                fieldRef={toolBrandRef}
                required={true}
                error={formError.tool_brand}
                value={formData.tool_brand}
                onChange={(e) =>
                  setFormData({ ...formData, tool_brand: e.target.value })
                }
              />
              <InputGroup
                label='Factory S/N'
                placeholder='gyari szam'
                name='tool_serial'
                fieldRef={toolSerialRef}
                required={true}
                error={formError.tool_serial}
                value={formData.tool_serial}
                onChange={(e) =>
                  setFormData({ ...formData, tool_serial: e.target.value })
                }
              />
            </div>
            <div className='grid grid-cols-2'>
              <SelectGroup
                label='Tool Name'
                name='tool_name'
                options={tool_names}
                value={formData.tool_name}
                onChange={(e) =>
                  setFormData({ ...formData, tool_name: e.target.value })
                }
              />
              <SelectGroup
                label='Tool Type'
                name='tool_type'
                options={tool_types}
                value={formData.tool_type}
                onChange={(e) =>
                  setFormData({ ...formData, tool_type: e.target.value })
                }
              />
            </div>
            <div className='grid grid-cols-3 gap-2'>
              <InputGroup
                label='Tool Accuracy'
                placeholder='pl: 0.02'
                name='tool_accuracy'
                fieldRef={toolAccRef}
                required={true}
                error={formError.tool_accuracy}
                value={formData.tool_accuracy}
                onChange={(e) =>
                  setFormData({ ...formData, tool_accuracy: e.target.value })
                }
              />
              <InputGroup
                label='Meas. Range'
                placeholder='pl: 0-150'
                name='tool_range'
                fieldRef={toolRangeRef}
                required={true}
                error={formError.tool_range}
                value={formData.tool_range}
                onChange={(e) =>
                  setFormData({ ...formData, tool_range: e.target.value })
                }
              />
              <InputGroup
                label='Max Deviation'
                placeholder='pl: 0.01'
                name='max_deviation'
                fieldRef={toolDevRef}
                required={true}
                error={formError.max_deviation}
                value={formData.max_deviation}
                onChange={(e) =>
                  setFormData({ ...formData, max_deviation: e.target.value })
                }
              />
            </div>
            <div className='grid grid-cols-1'>
              <label htmlFor='notes'>Notes:</label>
              <textarea
                id='notes'
                className='textarea textarea-solid max-w-full'
                rows={6}
                value={formData.notes === null ? '' : formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              ></textarea>
            </div>
          </div>
          <div className='flex flex-row mt-4 gap-2'>
            <button className='btn btn-primary btn-block'>Submit</button>
            <Link
              className='btn btn-outline-primary btn-block'
              to={!state?.prevPath ? '/tool/details' : state.prevPath}
              state={state}
            >
              Back
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};
export default ModifyToolPage;
