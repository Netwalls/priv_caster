import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AleoWalletProvider } from './context/AleoWalletProvider';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import WalletPage from './pages/WalletPage';
import ProfilePage from './pages/ProfilePage';
import GroupsPage from './pages/GroupsPage';
import LandingPage from './pages/LandingPage';
import WalletDebug from './components/WalletDebug';
import ErrorBoundary from './components/ErrorBoundary';

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
              <Route path="/wallet" element={
                <ErrorBoundary fallbackMessage="The wallet module encountered an error. This may be due to the Leo Wallet extension not being installed or SDK initialization issues.">
                  <WalletPage />
                </ErrorBoundary>
              } />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/notifications" element={<div className="p-10 text-center text-gray-500">Notifications work in progress</div>} />
              <Route path="/settings" element={<div className="p-10 text-center text-gray-500">Settings work in progress</div>} />
              <Route path="/explore" element={<div className="p-10 text-center text-gray-500">Explore work in progress</div>} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {/* Debug component - remove after troubleshooting */}
          <WalletDebug />
        </BrowserRouter>
      </AppProvider>
    </AleoWalletProvider>
  );
}

export default App;

