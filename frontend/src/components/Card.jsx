import moment from 'moment';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Card = ({ tool }) => {
  const { auth } = useAuth();
  let location = useLocation();

  const deleteTool = async () => {
    //remove tool
    console.log('TODO');
  };

  return (
    <div className='card h-fit bg-gray-100'>
      <div className='flex flex-col p-8'>
        <div className='flex flex-row'>
          <div>
            <h2 className='text-xs uppercase'>{tool.tool_brand}</h2>
            <h2 className='card-header'>
              {tool.tool_type} {tool.tool_name}
            </h2>
          </div>
          <div className='flex justify-end flex-grow-[2]'>
            <div className='dropdown left-7 bottom-6'>
              <label className=' btn btn-ghost p-1 rounded-full' tabIndex='0'>
                <span className='material-symbols-outlined'>more_vert</span>
              </label>
              <div className='dropdown-menu'>
                <Link
                  to='/tool/details'
                  state={{ id: tool.id }}
                  className='dropdown-item text-sm'
                >
                  Details
                </Link>
                {auth?.role === 'viewer' || (
                  <Link
                    tabIndex='-1'
                    to='/tool/calibrate'
                    state={{ id: tool.id, prevPath: location.pathname }}
                    className='dropdown-item text-sm'
                  >
                    Calibrate
                  </Link>
                )}
                {auth?.role === 'viewer' || (
                  <Link
                    to='tool/modify'
                    state={{ ...tool, prevPath: location.pathname }}
                    tabIndex='-1'
                    className='dropdown-item text-sm'
                  >
                    Edit Tool
                  </Link>
                )}
                {auth?.role === 'admin' && (
                  <Link
                    onClick={deleteTool}
                    tabIndex='-1'
                    className='dropdown-item text-sm text-red-600 hover:bg-red-200 hover:text-black'
                  >
                    Delete Tool
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='divider my-0'></div>
        <div className='flex flex-row gap-2 mt-2'>
          <p className='card-mini'>
            <span className='material-symbols-outlined'>location_on</span>
            {tool.tool_location}
          </p>
          <p className='card-mini'>
            <span className='material-symbols-outlined'>turned_in</span>
            {tool.tool_id}
          </p>
          <p className='card-mini'>
            <span className='material-symbols-outlined'>tag</span>
            {tool.tool_serial}
          </p>
        </div>
        <div className='flex flex-row gap-2 mt-2'>
          <p className='card-mini'>
            <span className='material-symbols-outlined'>arrow_range</span>
            {tool.tool_range}
          </p>
          <p className='card-mini'>
            <span className='material-symbols-outlined'>info</span>
            {tool.status}
          </p>
          <p className='card-mini'>
            <span className='material-symbols-outlined'>event_available</span>
            {tool.valid_until === null
              ? 'N/A'
              : moment(tool.valid_until).format('L')}
          </p>
        </div>
        <div className='divider my-1'></div>
        <div className='flex flex-row gap-1'>
          <p className='p-1 bg-red-600 rounded-lg text-white'>
            {tool.owner.fullname}
          </p>

          <p className='p-1 bg-blue-600 text-white rounded-lg'>
            {moment(tool.issue_date).format('LL')}
          </p>
        </div>
      </div>
    </div>
  );
};
export default Card;
