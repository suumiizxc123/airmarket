import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import ActivateSIM from './components/ActivateSIM';
import Orders from './pages/Orders';
import DataUsage from './pages/DataUsage';
import Navigation from './components/Navigation';
import { useAuth } from './services/authService';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
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

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/data/:orderId" element={<DataUsage />} />
          <Route
            path="/activate"
            element={
              isAuthenticated() ? (
                <>
                  <Navigation />
                  <ActivateSIM />
                </>
              ) : (
                <Login />
              )
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                <>
                  <Navigation />
                  <Orders />
                </>
              ) : (
                <Login />
              )
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
