import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoginPage from './pages/LoginPage';
import ActivateSIM from './components/ActivateSIM';
import Orders from './pages/Orders';
import DataUsage from './pages/DataUsage';
import Navigation from './components/Navigation';
import { isAuthenticated } from './services/authService';
import DataPage from './pages/DataPage';
import Footer from './components/Footer';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#dc004e',
    },
    secondary: {
      main: '#ff4081',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'linear-gradient(135deg, #ff4d4d, #dc004e)',
            boxShadow: '0 4px 15px rgba(220, 0, 78, 0.3)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #dc004e, #ff4d4d)',
          '&:hover': {
            background: 'linear-gradient(135deg, #ff4d4d, #dc004e)',
          },
        },
      },
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Routes>
              {/* Redirect root to orders */}
              <Route path="/" element={<Navigate to="/orders" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/data/:orderId" element={<DataPage />} />
              <Route
                path="/activate"
                element={
                  <ProtectedRoute>
                    <ActivateSIM />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              {/* Fallback route - redirect to orders */}
              <Route path="*" element={<Navigate to="/orders" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
