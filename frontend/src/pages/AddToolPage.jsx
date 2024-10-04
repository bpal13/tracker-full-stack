import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectGroup } from '../components/SelectGroup';
import useApiPrivate from '../hooks/useApiPrivate';
// import { apiPrivate } from '../api/ApiClient';
import InputGroup from '../components/InputGroup';
import Layout from '../components/Layout';
import {
  tool_locations,
  tool_names,
  tool_types,
  tool_status,
} from '../field data/FieldDataLocations';
import toast from 'react-hot-toast';

const AddToolPage = () => {
  const apiPrivate = useApiPrivate();
  const navigate = useNavigate();

  const [formError, setFormError] = useState({});
  const [formData, setFormData] = useState({
    toolLoc: '',
    toolID: '',
    toolBrand: '',
    toolSerial: '',
    toolName: '',
    toolType: '',
    toolAccuracy: '',
    toolRange: '',
    toolDeviation: '',
    toolStatus: '',
    toolNotes: '',
  });
  // console.log(formData);

  // form edit wrapper
  const editFormData = async (data) => {
    setFormData({ ...formData, ...data });
  };

  const toolIDRef = useRef();
  const toolBrandRef = useRef();
  const toolSerialRef = useRef();
  const toolAccRef = useRef();
  const toolRangeRef = useRef();
  const toolDevRef = useRef();

  // Set focus on form
  useEffect(() => {
    document.title = 'Add Tool - MEO Tracker';

    toolIDRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiPrivate.post('/tools/new-tool', {
        tool_location: formData.toolLoc,
        tool_id: formData.toolID,
        tool_brand: formData.toolBrand,
        tool_serial: formData.toolSerial,
        tool_name: formData.toolName,
        tool_type: formData.toolType,
        tool_accuracy: formData.toolAccuracy,
        tool_range: formData.toolRange,
        max_deviation: formData.toolDeviation,
        status: formData.toolStatus,
        notes: formData.toolNotes,
      });
      if (response?.status === 201) {
        console.log('success');
        navigate('/', {
          state: { notif: 'New tool has been saved.', toastId: 'add' },
        });
      }
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
      <div className='flex flex-col justify-center items-center h-screen w-screen'>
        <form
          className='flex flex-col border border-solid border-gray-400 rounded-2xl p-6 bg-white'
          onSubmit={handleSubmit}
        >
          <section className='text-center font-medium text-2xl my-3'>
            <h1>Add new Tool</h1>
          </section>
          <section className='grid gap-4'>
            <div className='grid grid-cols-2'>
              <SelectGroup
                label='Tárolás helye'
                name='tool_location'
                options={tool_locations}
                value={formData.toolLoc}
                onChange={(e) => editFormData({ toolLoc: e.target.value })}
              />
              <InputGroup
                label='Azonosító'
                placeholder='pl: 4128'
                name='tool_id'
                fieldRef={toolIDRef}
                required={true}
                error={formError.tool_id}
                value={formData.toolID}
                onChange={(e) => editFormData({ toolID: e.target.value })}
              />
            </div>
            <div className='grid grid-cols-2'>
              <InputGroup
                label='Márka'
                placeholder='pl: Mitutoyo'
                name='tool_brand'
                fieldRef={toolBrandRef}
                required={true}
                error={formError.tool_brand}
                value={formData.toolBrand}
                onChange={(e) => editFormData({ toolBrand: e.target.value })}
              />
              <InputGroup
                label='Gyári szám'
                placeholder='gyari sorozatszam'
                name='tool_serial'
                fieldRef={toolSerialRef}
                required={true}
                error={formError.tool_serial}
                value={formData.toolSerial}
                onChange={(e) => editFormData({ toolSerial: e.target.value })}
              />
            </div>
            <div className='grid grid-cols-2'>
              <SelectGroup
                label='Eszköz neve'
                name='tool_name'
                options={tool_names}
                value={formData.toolName}
                onChange={(e) => editFormData({ toolName: e.target.value })}
              />
              <SelectGroup
                label='Eszköz típusa'
                name='tool_type'
                options={tool_types}
                value={formData.toolType}
                onChange={(e) => editFormData({ toolType: e.target.value })}
              />
            </div>
            <div className='grid grid-cols-3 gap-2'>
              <InputGroup
                label='Pontosság'
                placeholder='pl: 0.02'
                name='tool_accuracy'
                fieldRef={toolAccRef}
                required={true}
                error={formError.tool_accuracy}
                value={formData.toolAccuracy}
                onChange={(e) => editFormData({ toolAccuracy: e.target.value })}
              />
              <InputGroup
                label='Méréstartomány'
                placeholder='pl: 0-150'
                name='tool_range'
                fieldRef={toolRangeRef}
                required={true}
                error={formError.tool_range}
                value={formData.toolRange}
                onChange={(e) => editFormData({ toolRange: e.target.value })}
              />
              <InputGroup
                label='Max eltérés'
                placeholder='pl: 0.01'
                name='max_deviation'
                fieldRef={toolDevRef}
                required={true}
                error={formError.max_deviation}
                value={formData.toolDeviation}
                onChange={(e) =>
                  editFormData({ toolDeviation: e.target.value })
                }
              />
            </div>
            <div className='grid grid-cols-1'>
              <SelectGroup
                label='Eszköz státusza'
                name='tool_status'
                options={tool_status}
                value={formData.toolStatus}
                onChange={(e) => editFormData({ toolStatus: e.target.value })}
              />
            </div>
            <div className='grid grid-cols-1'>
              <label htmlFor='notes'>Megjegyzés:</label>
              <textarea
                id='notes'
                className='textarea textarea-solid max-w-full'
                rows={6}
                value={formData.toolNotes}
                onChange={(e) => editFormData({ toolNotes: e.target.value })}
              ></textarea>
            </div>
            <div className='grid grid-cols-1'>
              <button className='btn btn-primary btn-block'>Add Tool</button>
            </div>
          </section>
        </form>
      </div>
    </Layout>
  );
};
export default AddToolPage;
