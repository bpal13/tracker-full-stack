import { useState } from 'react';
import useApiPrivate from '../hooks/useApiPrivate';
import useCard from '../hooks/useCard';
import toast from 'react-hot-toast';

const SidebarSearch = () => {
  const [searchTag, setSearchTag] = useState('');
  const api = useApiPrivate();
  const { setCards } = useCard();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resp = await api.get(`/tools/?search_id=${searchTag}`);
      setCards(resp.data);
    } catch (error) {
      if (!error?.response) {
        toast.error('Server does not respond.');
      }
    }
  };

  return (
    <search className='px-4'>
      <form
        className='flex flex-row border-2 border-solid border-blue-500 rounded-xl items-center'
        onSubmit={handleSubmit}
      >
        <input
          placeholder='Search Tool ID or Serial'
          type='search'
          id='search_bar'
          className='input input-sm border-none'
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
        />
        <button className='btn btn-xs bg-transparent' type='submit'>
          <span className='material-symbols-outlined'>search</span>
        </button>
      </form>
    </search>
  );
};
export default SidebarSearch;
