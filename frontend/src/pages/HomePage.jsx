import Layout from '../components/Layout';
import Cards from '../components/Cards';
import { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import useApiPrivate from '../hooks/useApiPrivate';
import useCard from '../hooks/useCard';
import toast from 'react-hot-toast';

const HomePage = () => {
  const { setCards, display } = useCard();
  const [isLoading, setIsLoading] = useState(true);
  const apiPrivate = useApiPrivate();

  useEffect(() => {
    const getCards = async () => {
      try {
        const response = await apiPrivate.get('/tools/');
        if (response.status === 200) {
          setCards(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        if (!error?.response) {
          toast.error('No response from the server.');
        } else {
          toast.error(error);
        }
      }
    };
    if (display.refresh === 'home' || display.refresh === 'refresh') {
      getCards();
    }
  }, [display]);

  useEffect(() => {
    document.title = 'Home - MEO Tracker';
  }, []);

  return <Layout>{isLoading ? <Spinner /> : <Cards />}</Layout>;
};
export default HomePage;
