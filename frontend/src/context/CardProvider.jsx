import { createContext, useState } from 'react';

const CardContext = createContext({});

export const CardProvider = ({ children }) => {
  const [cards, setCards] = useState([]);
  const [display, setDisplay] = useState({ refresh: 'home', table: false });
  return (
    <CardContext.Provider value={{ cards, setCards, display, setDisplay }}>
      {children}
    </CardContext.Provider>
  );
};
export default CardContext;
