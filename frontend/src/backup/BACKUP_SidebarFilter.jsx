import useApiPrivate from '../hooks/useApiPrivate';
import { useState } from 'react';
import useCard from '../hooks/useCard';

const SidebarFilter = () => {
  const apiPrivate = useApiPrivate();
  const { setDisplay, setCards } = useCard();
  const [tool_location, setToolLocation] = useState('');
  const [tool_status, setToolStatus] = useState('');
  const [tool_name, setToolName] = useState('');

  const handleSubmit = async (ev) => {
    //Prevent Default
    ev.preventDefault();

    //Make API call
    try {
      const response = await apiPrivate(
        `/tools/?search_name=${tool_name}&search_loc=${tool_location}&search_status=${tool_status}`
      );
      console.log(response);
      setCards(response.data);
      setDisplay('search');
      // console.log(tool_location);
      // console.log(tool_status);
      // console.log(tool_name);
    } catch (error) {}
  };

  const resetFilters = async () => {
    setDisplay('home');
  };

  return (
    <form className='flex flex-col gap-2 p-4 ' onSubmit={handleSubmit}>
      <h1 className='text-center text-lg font-semibold mb-2'>Filter Tools</h1>
      <div>
        <label htmlFor='order_by' className='text-sm'>
          Rendezes:
        </label>
        <select id='order_by' className='select select-sm '>
          <option value='1'>Alapertelmezett</option>
          <option value='2'>Legujabbak elol</option>
          <option value='3'>Azonosito(novekvo)</option>
          <option value='4'>Azonosito(csokkeno)</option>
        </select>
      </div>
      <div>
        <label htmlFor='tool_location' className='text-sm'>
          Tarolas helye:
        </label>
        <select
          id='tool_location'
          className='select select-sm'
          value={tool_location}
          onChange={(e) => setToolLocation(e.target.value)}
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
          value={tool_status}
          onChange={(e) => setToolStatus(e.target.value)}
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
          value={tool_name}
          onChange={(e) => setToolName(e.target.value)}
        >
          <option value=''>Mindegy</option>
          <option value='Tolómérő'>Tolómérő</option>
          <option value='Kengyeles mikrométer'>Kengyeles mikrométer</option>
          <option value='Furatmikrométer'>Furatmikrométer</option>
          <option value='Kengyeles mikrométer készlet'>
            Kengyeles mikrométer készlet
          </option>
          <option value='Mélységmérő mikrométer'>Mélységmérő mikrométer</option>
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
    </form>
  );
};
export default SidebarFilter;
