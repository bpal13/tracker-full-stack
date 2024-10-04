import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import useApiPrivate from '../hooks/useApiPrivate';
import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const StatsPage = () => {
  const [toolData, setToolData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const api = useApiPrivate();

  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await api.get('/tools/stats');
        setToolData(resp.data);
        setIsLoading(false);
      } catch (error) {
        if (!error?.respose) {
          toast.error('Server does not respond');
        }
      }
    };
    getData();
  }, []);

  useEffect(() => {
    document.title = 'Statistics - MEO Tracker';
  }, []);

  return (
    <Layout>
      {!isLoading && (
        <div className='flex flex-row flex-wrap gap-4 justify-center items-center w-screen'>
          <div className='p-4 rounded-xl border border-solid h-fit w-fit bg-white'>
            <Plot
              data={[
                {
                  x: Object.keys(toolData.loc_data),
                  y: Object.values(toolData.loc_data),
                  type: 'bar',
                },
              ]}
              layout={{ title: 'Tools by Location' }}
            />
          </div>
          <div className='p-4 rounded-xl border border-solid h-fit w-fit bg-white'>
            <Plot
              data={[
                {
                  x: Object.keys(toolData.status_data),
                  y: Object.values(toolData.status_data),
                  type: 'bar',
                },
              ]}
              layout={{ title: 'Tools by Status' }}
            />
          </div>
        </div>
      )}
    </Layout>
  );
};
export default StatsPage;
