import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authService';

const Navigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          <img
            src="https://www.airmarket.mn/assets/images/airmarket_logo.png"
            alt="AirMarket Logo"
            style={{ height: '40px', width: 'auto' }}
          />
        </Box>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          SIM Management System
        </Typography>
        {isAuthenticated() && (
          <Box>
            <Button color="inherit" onClick={() => navigate('/orders')}>
              Orders
            </Button>
            <Button color="inherit" onClick={() => navigate('/activate')}>
              Activate SIM
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
