import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import './App.css';

import Home from './pages/Home';
import T1 from './pages/T1';
import T2 from './pages/T2';
import T3 from './pages/T3';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import FlagList from './pages/FlagList';

const TopBar = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    return (
        <div style={{ 
            position: 'absolute', 
            top: '20px', 
            right: '20px', 
            zIndex: 1000,
            display: 'flex', 
            gap: '10px' 
        }}>
            <NavLink 
                to="/flags" 
                className="nav-btn" 
                style={{ background: '#FF9800', fontSize: '0.9rem', color: 'white', border: '1px solid', borderColor: '#b8861b' }}
            >
                🏳️ {t('flagsListBtn')}
            </NavLink>
            <NavLink 
                to={user ? "/profile" : "/auth"} 
                className="nav-btn" 
                style={{ background: user ? '#E91E63' : '#419db4', fontSize: '0.9rem', border: '1px solid', borderColor: '#206b9c' }}
            >
                {user ? `👤 ${user.username}` : t('log_in')}
            </NavLink>
        </div>
    );
};

const  AppContent = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const isGameMode = ['/T1', '/T2', '/T3'].includes(location.pathname);

  useEffect(() => {
    if (isGameMode) {
      document.body.classList.add('paused');
    } else {
      document.body.classList.remove('paused');
    }
    return () => {
      document.body.classList.remove('paused');
    };
  }, [isGameMode]);

  return (
    <div className="App">
      <LanguageSwitcher />
      <TopBar />
      <h1>{t('headerTitle')}</h1>

      <nav style={{ marginBottom: '20px'}}>
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-btn active-link" : "nav-btn"}>
          {t('home')}
        </NavLink>

        <NavLink to="/T1" className={({ isActive }) => isActive ? "nav-btn active-link" : "nav-btn"}>
          {t('mode1')}
        </NavLink>

        <NavLink to="/T2" className={({ isActive }) => isActive ? "nav-btn active-link" : "nav-btn"}>
          {t('mode2')}
        </NavLink>

        <NavLink to="/T3" className={({ isActive }) => isActive ? "nav-btn active-link" : "nav-btn"}>
          {t('mode3')}
        </NavLink>
      </nav>
    <hr />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="T1" element={<T1 />} />
      <Route path="T2" element={<T2 />} />
      <Route path="T3" element={<T3 />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/flags" element={<FlagList />} />
    </Routes>
  </div>
  );
};

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;