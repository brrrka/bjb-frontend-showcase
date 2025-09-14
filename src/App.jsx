import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './index.css';

import LoginPage from './pages/Auth';
import OverviewDashboard from './pages/OverviewDashboard';
import MainDashboard from './pages/MainDashboard';
import Profile from './pages/Profile';
import FeeBased from './pages/FeeBased';
import QRISMerchant from './pages/QRISMerchant';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import File from './pages/File';
import UserManagement from './pages/UserManagement';
import Panduan from './pages/Panduan';
import DummyDataBanner from './components/DummyDataBanner';

function App() {
  return (
    <>
      <DummyDataBanner />
      <Routes>
        <Route
          path="/"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <OverviewDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/konsolidasi"
          element={
            <ProtectedRoute>
              <MainDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/:region"
          element={
            <ProtectedRoute>
              <MainDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/feebased"
          element={
            <ProtectedRoute>
              <FeeBased />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/qris"
          element={
            <ProtectedRoute>
              <QRISMerchant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/files"
          element={
            <ProtectedRoute>
              <File />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard/users" element={
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/user-management" element={
          <ProtectedRoute>
            <UserManagement />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/panduan" element={
          <ProtectedRoute>
            <Panduan />
          </ProtectedRoute>
        } />
      </Routes>
      <ToastContainer limit={1} />
    </>

  );
}

export default App;
