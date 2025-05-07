import React from 'react';
import { AppBar, Box, CssBaseline, Drawer, IconButton, Toolbar, Typography, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authService';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', path: '/' },
  { text: 'Orders', path: '/orders' },
  { text: 'Activate SIM', path: '/activate' },
];

const AdminLayout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated()) {
    navigate('/login');
    return null;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="menu"
            edge="start"
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            AirMarket Admin
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{ ml: 2 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ overflow: 'auto', p: 2 }}>
          {menuItems.map((item) => (
            <Box
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                p: 2,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              {item.text}
            </Box>
          ))}
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
