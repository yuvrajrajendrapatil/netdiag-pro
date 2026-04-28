// Main Routing Logic - Saglya pages yethe connect kelya ahet
import React, { createContext, useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Auth Context - Login state track karnyasathi
export const AuthContext = createContext(null);

// useAuth hook - Components madhe use karnyasathi
export const useAuth = () => useContext(AuthContext);

// Protected Layout - Login kelya shivay access nahi milnar
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

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />

          {/* Protected Routes */}
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

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}