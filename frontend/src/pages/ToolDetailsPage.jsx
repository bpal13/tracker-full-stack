import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import useApiPrivate from '../hooks/useApiPrivate';
import { useLocation, Link } from 'react-router-dom';
import moment from 'moment';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const ToolDetailsPage = () => {
  const [calib, setCalib] = useState(null);
  const [toolData, setToolData] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const api = useApiPrivate();
  //tool data in the state
  let { state } = useLocation();

  // console.log(state);

  // Get the calibration and the tool data
  useEffect(() => {
    const getData = async () => {
      try {
        const [respTool, respCalib] = await Promise.all([
          api.get(`/tools/${state.id}`),
          api.get(`/tools/calibration/${state.id}/all`),
        ]);
        setCalib(respCalib.data);
        setToolData(respTool.data);
      } catch (error) {
        if (error.status === 404) {
          toast.error('Tool does not exist.');
          setCalib(null);
        }
        if (!error?.response) {
          toast.error('No response from the server');
        }
        // console.log(error.response);
      }
    };
    getData();
  }, [refresh]);

  // Delete Calibration API Call
  const deleteRecord = async ({ id }) => {
    try {
      const resp = await api.delete(`/tools/calibration/${id}`);
      if (resp.status === 204) {
        setRefresh(!refresh);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <Layout>
      {state?.notif && toast.success(state.notif, { id: state.toastId })}
      {toolData === null ? (
        <Spinner />
      ) : (
        <div className='flex flex-col justify-center items-center w-screen'>
          <div className='bg-white border border-solid border-gray-200 rounded-2xl p-4 gap-4 flex flex-col h-fit max-w-xl'>
            <h1 className='text-center text-2xl font-semibold'>
              Muszer, meroeszkoz adatai
            </h1>
            <section className=' bg-slate-100 p-4 rounded-xl'>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <p className='text-md font-semibold'>Muszer neve:</p>
                  <p>
                    {toolData.tool_type} {toolData.tool_name}
                  </p>
                </div>
                <div>
                  <p className='text-md font-semibold'>Gyarto:</p>
                  <p>{toolData.tool_brand}</p>
                </div>
                <div>
                  <p className='text-md font-semibold'>Tarolas helye:</p>
                  <p>{toolData.tool_location}</p>
                </div>

                <div>
                  <p className='text-md font-semibold'>Azonosito:</p>
                  <p>{toolData.tool_id}</p>
                </div>
                <div>
                  <p className='text-md font-semibold'>Gyari szam:</p>
                  <p>{toolData.tool_serial}</p>
                </div>
                <div>
                  <p className='text-md font-semibold'>Mereshatar:</p>
                  <p>{toolData.tool_range}</p>
                </div>
                <div>
                  <p className='text-md font-semibold'>Pontossag:</p>
                  <p>{toolData.tool_accuracy}</p>
                </div>
                <div>
                  <p className='text-md font-semibold'>Max eletres:</p>
                  <p>{toolData.max_deviation}</p>
                </div>
                <div>
                  <p className='text-md font-semibold'>Statusz:</p>
                  <p>{toolData.status}</p>
                </div>
                <div>
                  <p className='text-md font-semibold'>Ervenyesseg:</p>
                  <p>
                    {toolData.valid_until === null
                      ? 'N/A'
                      : moment(toolData.valid_until).format('LL')}
                  </p>
                </div>
              </div>
              <div>
                <p className='text-md font-semibold'>Megjegyzes:</p>
                <p className='border-2 border-solid border-gray-300 rounded-2xl p-2 text-sm bg-white h-28 w-96 overflow-scroll'>
                  {toolData.notes === null
                    ? 'Nincs Megjegyzes'
                    : toolData.notes}
                </p>
              </div>
            </section>
            <section className='flex flex-col gap-2'>
              <h1 className='text-center text-xl font-semibold'>
                Calibrations
              </h1>
              <div className='bg-slate-100 p-4 rounded-xl flex flex-row gap-4 overflow-x-scroll'>
                {calib === null ? (
                  <div className='card'>
                    <p>No Calibrations Found</p>
                  </div>
                ) : (
                  calib.map((cal) => {
                    return (
                      <div className='card w-fit p-2 bg-white' key={cal.id}>
                        <h1 className='text-md font-semibold'>
                          {moment(cal.calibration_date).format('LL')}
                        </h1>
                        <p>
                          <span
                            className={
                              cal.rating === 'Megfelel'
                                ? 'dot dot-success'
                                : 'dot dot-error'
                            }
                          ></span>{' '}
                          {cal.rating}
                        </p>
                        <p>
                          <span className='dot'></span> {cal.calibration_by}
                        </p>
                        <div className='flex flex-row gap-1'>
                          <Link
                            to='/tool/calibration/details'
                            state={{ ...cal, prevTool: state }}
                            className='btn btn-primary btn-sm'
                          >
                            Details
                          </Link>
                          <button
                            className='btn btn-outline-error btn-sm'
                            onClick={() => deleteRecord({ id: cal.id })}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
            <section className='flex flex-row gap-2'>
              <Link
                className='btn btn-block btn-primary'
                to='/tool/modify'
                state={toolData}
              >
                Edit Tool
              </Link>
              <Link
                className='btn btn-block btn-outline-primary'
                to='/tool/calibrate'
                state={state}
              >
                Calibrate Tool
              </Link>
              <Link className='btn btn-block btn-outline-primary' to='/'>
                Back
              </Link>
            </section>
          </div>
        </div>
      )}
    </Layout>
  );
};
export default ToolDetailsPage;
