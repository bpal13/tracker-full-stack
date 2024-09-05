import { useContext } from 'react';
import CardContext from '../context/CardProvider';
const useCard = () => {
  return useContext(CardContext);
};
export default useCard;
