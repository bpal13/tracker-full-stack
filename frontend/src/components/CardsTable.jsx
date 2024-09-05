import useCard from '../hooks/useCard';
import moment from 'moment';
import { Link, useLocation } from 'react-router-dom';

const CardsTable = () => {
  const { cards } = useCard();
  let location = useLocation();

  const deleteTool = async () => {
    //remove tool
    console.log('TODO');
  };

  return (
    <div className='flex w-screen flex-row flex-wrap gap-4 p-4'>
      {cards.map((tool) => {
        return (
          <div className='flex w-full overflow-x-auto bg-white border border-solid rounded-xl p-2'>
            <table className='table'>
              <thead>
                <tr>
                  <th>Tool ID</th>
                  <th>Serial</th>
                  <th>Brand</th>
                  <th>Tool Name</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Valid until</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((tool) => {
                  return (
                    <tr id={tool.id}>
                      <td>{tool.tool_id}</td>
                      <td>{tool.tool_serial}</td>
                      <td>{tool.tool_brand}</td>
                      <td>
                        {tool.tool_type} {tool.tool_name}
                      </td>
                      <td>{tool.tool_location}</td>
                      <td>{tool.status}</td>
                      <td>
                        {tool.valid_until === null
                          ? 'N/A'
                          : moment(tool.valid_until).format('L')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};
export default CardsTable;
