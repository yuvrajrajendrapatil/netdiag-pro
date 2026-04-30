import React, { createContext, useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Auth Context
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Theme Context
export const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

// Protected Layout
function ProtectedLayout({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{
          flex: 1,
          padding: '32px',
          overflowY: 'auto',
          background: 'var(--bg-primary)'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  // Apply CSS variables based on theme
  React.useEffect(() => {
    const root = document.documentElement;
    const vars = theme === 'dark' ? {
      '--bg-main': '#070e1a',
      '--bg-card': 'rgba(12,20,36,0.9)',
      '--bg-sidebar': '#0a1525',
      '--bg-header': 'rgba(7,14,26,0.97)',
      '--bg-secondary': '#141b2d',
      '--bg-primary': '#0a0e27',
      '--border-color': 'rgba(255,255,255,0.07)',
      '--text-primary': '#e5e7eb',
      '--text-secondary': '#9ca3af',
      '--accent-blue': '#3b82f6',
      '--accent-green': '#10b981',
      '--accent-yellow': '#f59e0b',
      '--accent-red': '#ef4444',
    } : {
      '--bg-main': '#f0f4f8',
      '--bg-card': '#ffffff',
      '--bg-sidebar': '#1a2540',
      '--bg-header': 'rgba(255,255,255,0.97)',
      '--bg-secondary': '#e5e7eb',
      '--bg-primary': '#f8fafc',
      '--border-color': 'rgba(0,0,0,0.08)',
      '--text-primary': '#0f1923',
      '--text-secondary': '#4a5568',
      '--accent-blue': '#3b82f6',
      '--accent-green': '#10b981',
      '--accent-yellow': '#f59e0b',
      '--accent-red': '#ef4444',
    };

    Object.keys(vars).forEach(key => {
      root.style.setProperty(key, vars[key]);
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthContext.Provider value={{ user, login, logout }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route
              path="/home"
              element={
                user ? (
                  <ProtectedLayout>
                    <Home />
                  </ProtectedLayout>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            <Route
              path="/reports"
              element={
                user ? (
                  <ProtectedLayout>
                    <Reports />
                  </ProtectedLayout>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            <Route
              path="/settings"
              element={
                user ? (
                  <ProtectedLayout>
                    <Settings />
                  </ProtectedLayout>
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}