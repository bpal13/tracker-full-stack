import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AddToolPage from './pages/AddToolPage';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import RequireLogin from './components/RequireLogin';
import PersistLogin from './components/PersistLogin';
import RestrictedRoutes from './components/RestrictedRoutes';
import ModifyToolPage from './pages/ModifyToolPage';
import AddCalibPage from './pages/AddCalibPage';
import ToolDetailsPage from './pages/ToolDetailsPage';
import CalibDetails from './pages/CalibDetails';
import EditCalibPage from './pages/EditCalibPage';
import AddUserPage from './pages/AddUserPage';
import UserResetPage from './pages/admin/UserResetPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import VerifyUserPage from './pages/VerifyUserPage';
import NoPersmissionPage from './pages/NoPersmissionPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NewPasswordPage from './pages/NewPasswordPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path='/login' element={<LoginPage />} />
      <Route path='/user/change-password' element={<ChangePasswordPage />} />
      <Route path='/user/verify' element={<VerifyUserPage />} />
      <Route path='/user/reset-password' element={<ResetPasswordPage />} />
      <Route path='/user/password-reset/:token' element={<NewPasswordPage />} />

      {/* Private Routes */}
      <Route element={<PersistLogin />}>
        <Route element={<RequireLogin />}>
          <Route path='/error' element={<NoPersmissionPage />} />
          {/* Sidebar Items */}
          <Route path='/' element={<HomePage />} />
          <Route path='/statistics' element={<StatsPage />} />
          {/* Card Links */}
          <Route path='/tool/details' element={<ToolDetailsPage />} />
          <Route path='/tool/calibration/details' element={<CalibDetails />} />
          {/* Restricted routes */}
          <Route element={<RestrictedRoutes />}>
            <Route path='/tool/calibrate' element={<AddCalibPage />} />
            <Route path='/tool/modify' element={<ModifyToolPage />} />
            <Route path='/tool/calibration/edit' element={<EditCalibPage />} />
            <Route path='/tool/new' element={<AddToolPage />} />
          </Route>
          {/* Admin Routes */}
          <Route path='/admin/new-user' element={<AddUserPage />} />
          <Route path='/admin/reset-user' element={<UserResetPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
