import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import AddToolPage from './pages/AddToolPage';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import RequireLogin from './components/RequireLogin';
import ModifyToolPage from './pages/ModifyToolPage';
import AddCalibPage from './pages/AddCalibPage';
import ToolDetailsPage from './pages/ToolDetailsPage';
import CalibDetails from './pages/CalibDetails';
import EditCalibPage from './pages/EditCalibPage';
import AddUserPage from './pages/AddUserPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path='/login' element={<LoginPage />} />

      {/* Private Routes */}
      <Route element={<RequireLogin />}>
        {/* Sidebar Items */}
        <Route path='/' element={<HomePage />} />
        <Route path='/statistics' element={<StatsPage />} />
        <Route path='/tool/new' element={<AddToolPage />} />
        {/* Card Links */}
        <Route path='/tool/details' element={<ToolDetailsPage />} />
        <Route path='/tool/calibrate' element={<AddCalibPage />} />
        <Route path='/tool/modify' element={<ModifyToolPage />} />
        <Route path='/tool/calibration/details' element={<CalibDetails />} />
        <Route path='/tool/calibration/edit' element={<EditCalibPage />} />
        {/* Admin Routes */}
        <Route path='/admin/new-user' element={<AddUserPage />} />
      </Route>
    </Routes>
  );
}

export default App;
