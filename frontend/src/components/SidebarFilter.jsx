import useApiPrivate from '../hooks/useApiPrivate';
import { useState } from 'react';
import useCard from '../hooks/useCard';
import toast from 'react-hot-toast';

const SidebarFilter = () => {
  const apiPrivate = useApiPrivate();
  const { display, setDisplay, setCards } = useCard();
  const [formData, setFormData] = useState({
    toolLoc: '',
    toolStatus: '',
    toolName: '',
    toolOrder: '',
  });

  const handleSubmit = async (ev) => {
    //Prevent Default
    ev.preventDefault();

    //Make API call
    try {
      const response = await apiPrivate(
        `/tools/?search_name=${formData.toolName}&search_loc=${formData.toolLoc}&search_status=${formData.toolStatus}&search_order=${formData.toolOrder}`
      );
      setCards(response.data);
      setDisplay({ ...display, refresh: 'search' });
    } catch (error) {}
  };

  const resetFilters = async () => {
    setDisplay({ ...display, refresh: 'home' });
  };

  const checkboxClick = async () => {
    toast.error('Please wait...');
    setDisplay({ ...display, table: !display.table });
  };

  // console.log(display);

  return (
    <>
      <form className='flex flex-col gap-2 p-4 ' onSubmit={handleSubmit}>
        <h1 className='text-center text-lg font-semibold mb-2'>Filter Tools</h1>
        <div>
          <label htmlFor='order_by' className='text-sm'>
            Rendezes:
          </label>
          <select
            id='order_by'
            className='select select-sm '
            value={formData.toolOrder}
            onChange={(e) =>
              setFormData({ ...formData, toolOrder: e.target.value })
            }
          >
            <option value='id_asc'>Azonosito(novekvo)</option>
            <option value='id_desc'>Azonosito(csokkeno)</option>
            <option value='newest'>Legujabbak elol</option>
            <option value='oldest'>Regiek elol </option>
          </select>
        </div>
        <div>
          <label htmlFor='tool_location' className='text-sm'>
            Tarolas helye:
          </label>
          <select
            id='tool_location'
            className='select select-sm'
            value={formData.toolLoc}
            onChange={(e) =>
              setFormData({ ...formData, toolLoc: e.target.value })
            }
          >
            <option value=''>Mindegy</option>
            <option value='MEO'>MEO</option>
            <option value='Raktár'>Raktár</option>
            <option value='Tanműhely'>Tanműhely</option>
            <option value='Tartalék'>Tartalék</option>
            <option value='Kisgépes csarnok'>Kisgépes csarnok</option>
            <option value='Nagygépes csarnok'>Nagygépes csarnok</option>
            <option value='Köszörű'>Köszörű</option>
            <option value='Szerelde'>Szerelde</option>
            <option value='Egyéb'>Egyéb</option>
            <option value='Digma'>Digma</option>
            <option value='Huzal'>Huzal</option>
            <option value='TEK'>TEK</option>
            <option value='HERMLE'>HERMLE</option>
            <option value='Tömbszikra'>Tömbszikra</option>
            <option value='Személyek'>Személyek</option>
            <option value='Eszterga'>Eszterga</option>
            <option value='1150'>1150</option>
            <option value='IXION'>IXION</option>
          </select>
        </div>
        <div>
          <label htmlFor='tool_status' className='text-sm'>
            Eszkoz statusz:
          </label>
          <select
            id='tool_status'
            className='select select-sm'
            value={formData.toolStatus}
            onChange={(e) =>
              setFormData({ ...formData, toolStatus: e.target.value })
            }
          >
            <option value=''>Mindegy</option>
            <option value='Kalibrált'>Kalibrált</option>
            <option value='Lejárt kalibrálás'>Lejárt kalibrálás</option>
            <option value='Nincs kalibrálva'>Nincs kalibrálva</option>
            <option value='Nem található'>Nem található</option>
            <option value='Selejt'>Selejt</option>
          </select>
        </div>
        <div>
          <label htmlFor='tool_name' className='text-sm'>
            Eszkoz megnevezes
          </label>
          <select
            name=''
            id='tool_name'
            className='select select-sm'
            value={formData.toolName}
            onChange={(e) =>
              setFormData({ ...formData, toolName: e.target.value })
            }
          >
            <option value=''>Mindegy</option>
            <option value='Tolómérő'>Tolómérő</option>
            <option value='Kengyeles mikrométer'>Kengyeles mikrométer</option>
            <option value='Furatmikrométer'>Furatmikrométer</option>
            <option value='Kengyeles mikrométer készlet'>
              Kengyeles mikrométer készlet
            </option>
            <option value='Mélységmérő mikrométer'>
              Mélységmérő mikrométer
            </option>
            <option value='Mélységmérő Tolómérő'>Mélységmérő Tolómérő</option>
            <option value='Furatmikrométer készlet'>
              Furatmikrométer készlet
            </option>
            <option value='Mérőóra'>Mérőóra</option>
            <option value='Szögtapintós mérőóra'>Szögtapintós mérőóra</option>
            <option value='Derékszög'>Derékszög</option>
            <option value='Menetidomszer'>Menetidomszer</option>
          </select>
        </div>
        <button type='submit' className='btn btn-sm btn-secondary'>
          Filter
        </button>
        <button
          type='button'
          className='btn btn-sm btn-outline-secondary'
          onClick={resetFilters}
        >
          Reset Filters
        </button>
        {/* Toggle table view mode */}
        {/* <div>
          <label className='flex cursor-pointer gap-2'>
            <input
              type='checkbox'
              className='checkbox'
              value={display.table}
              onChange={checkboxClick}
            />
            <span>Table Mode</span>
          </label>
        </div> */}
      </form>
    </>
  );
};
export default SidebarFilter;
