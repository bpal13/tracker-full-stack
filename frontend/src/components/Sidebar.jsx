import SidebarFilter from './SidebarFilter';
import logo from '../assets/icon-nobg.png';
import SidebarSearch from './SidebarSearch';
import useAuth from '../hooks/useAuth';
import { NavLink } from 'react-router-dom';
import useApiPrivate from '../hooks/useApiPrivate';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const api = useApiPrivate();

  const username = auth?.username || 'USER NAME';
  const AVATAR_URL = 'https://ui-avatars.com/api/?size=150&name=' + username;

  const logout = async () => {
    try {
      const resp = await api.get('/logout');
      if (resp.status === 200) {
        setAuth({});
        navigate('/');
      }
    } catch (error) {
      if (!error?.resp) {
        toast.error('No response from the server. Try again later.');
      } else {
        console.log(error);
      }
    }
  };

  return (
    <aside className=' h-screen sidebar sidebar-sticky'>
      <section className='flex flex-row gap-1 p-2 mt-2'>
        <div className='sidebar-icon p-1 border border-solid border-black rounded-lg '>
          <img src={logo} alt='caliper icon' className='h-10 w-10' />
        </div>
        <div>
          <h1 className='text-lg font-bold'>MEO Tracker</h1>
          <p className='text-sm'>Version: 1.5</p>
        </div>
      </section>
      <section className='mt-3'>
        <SidebarSearch />
      </section>
      <section className='sidebar-content min-h-[20rem]'>
        <nav className='menu rounded-md'>
          <section className='menu-section px-4'>
            <span className='menu-title'>Main menu</span>
            <ul className='menu-items'>
              <NavLink
                to='/'
                className={({ isActive }) =>
                  isActive ? 'menu-item menu-active' : 'menu-item'
                }
                end
              >
                <span className='material-symbols-outlined'>home</span>
                Home
              </NavLink>
              <NavLink
                to='/statistics'
                className={({ isActive }) =>
                  isActive ? 'menu-item menu-active' : 'menu-item'
                }
                end
              >
                <span className='material-symbols-outlined'>bar_chart</span>
                Statistics
              </NavLink>

              {auth?.role === 'viewer' || (
                <NavLink
                  to='/tool/new'
                  className={({ isActive }) =>
                    isActive ? 'menu-item menu-active' : 'menu-item'
                  }
                  end
                >
                  <span className='material-symbols-outlined'>library_add</span>
                  Add Tool
                </NavLink>
              )}
              {auth?.role === 'admin' && (
                <li>
                  <input
                    type='checkbox'
                    id='menu-admin'
                    className='menu-toggle'
                  />
                  <label
                    className='menu-item justify-between'
                    htmlFor='menu-admin'
                  >
                    <div className='flex gap-2'>
                      <span className='material-symbols-outlined'>person</span>
                      <span>Admin</span>
                    </div>

                    <span className='menu-icon'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </span>
                  </label>

                  <div className='menu-item-collapse'>
                    <div className='min-h-0'>
                      <NavLink
                        to='/admin/new-user'
                        className={({ isActive }) =>
                          isActive
                            ? 'menu-item ml-6 menu-active'
                            : 'menu-item ml-6'
                        }
                        end
                      >
                        <span className='material-symbols-outlined'>
                          person_add
                        </span>
                        Create User
                      </NavLink>
                      <NavLink
                        to='/admin/reset-user'
                        className={({ isActive }) =>
                          isActive
                            ? 'menu-item ml-6 menu-active'
                            : 'menu-item ml-6'
                        }
                        end
                      >
                        <span className='material-symbols-outlined'>key</span>
                        Reset a password
                      </NavLink>
                    </div>
                  </div>
                </li>
              )}
              <li>
                <input type='checkbox' id='menu-2' className='menu-toggle' />
                <label className='menu-item justify-between' htmlFor='menu-2'>
                  <div className='flex gap-2'>
                    <span className='material-symbols-outlined'>person</span>
                    <span>Account</span>
                  </div>

                  <span className='menu-icon'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </span>
                </label>

                <div className='menu-item-collapse'>
                  <div className='min-h-0'>
                    <label className='menu-item menu-item-disabled ml-6'>
                      <span className='material-symbols-outlined'>
                        contact_page
                      </span>
                      Profile
                    </label>
                    {auth?.role === 'viewer' || (
                      <NavLink
                        to='/user/change-password'
                        className={({ isActive }) =>
                          isActive
                            ? 'menu-item ml-6 menu-active'
                            : 'menu-item ml-6'
                        }
                        end
                      >
                        <span className='material-symbols-outlined'>key</span>
                        Change Password
                      </NavLink>
                    )}
                    <label className='menu-item ml-6' onClick={logout}>
                      <span className='material-symbols-outlined'>logout</span>
                      Logout
                    </label>
                  </div>
                </div>
              </li>
            </ul>
          </section>
        </nav>
        <div className='divider'></div>
        <section className='sidebar-filter'>
          <SidebarFilter />
        </section>
      </section>

      <section className='sidebar-footer bg-gray-2 pt-2'>
        <div className='divider my-0'></div>
        <div className='flex flex-row gap-4 p-4'>
          <div className='avatar avatar-md'>
            <img src={AVATAR_URL} alt='avatar' />
          </div>

          <div className='flex flex-col'>
            <span>{auth?.fullname || 'FULL NAME'}</span>
            <span className='text-xs font-normal text-content2'>
              {auth?.username || 'USERNAME'}
            </span>
          </div>
        </div>
      </section>
    </aside>
  );
};
export default Sidebar;
