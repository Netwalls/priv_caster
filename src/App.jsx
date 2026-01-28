import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AleoWalletProvider } from './context/AleoWalletProvider';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import WalletPage from './pages/WalletPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <AleoWalletProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* App Layout Routes */}
            <Route element={<AppLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notifications" element={<div className="p-10 text-center text-gray-500">Notifications work in progress</div>} />
              <Route path="/settings" element={<div className="p-10 text-center text-gray-500">Settings work in progress</div>} />
              <Route path="/explore" element={<div className="p-10 text-center text-gray-500">Explore work in progress</div>} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AleoWalletProvider>
  );
}

export default App;
