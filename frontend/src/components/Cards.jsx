import Card from './Card';
import useCard from '../hooks/useCard';

const Cards = () => {
  const { cards } = useCard();
  return (
    <div className='flex w-full flex-row flex-wrap gap-4 p-6'>
      {cards.map((tool) => {
        return <Card tool={tool} key={tool.tool_id} />;
      })}
    </div>
  );
};
export default Cards;
