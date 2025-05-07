import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  useMediaQuery,
  useTheme,
  Divider
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Dashboard as DashboardIcon,
  DataUsage as DataUsageIcon,
  ExitToApp as LogoutIcon,
  ShoppingCart as OrdersIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../services/authService';
import Logo from '../components/Logo';

const Navigation = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { 
      text: 'Orders', 
      icon: <OrdersIcon />, 
      path: '/orders',
      active: location.pathname === '/orders'
    },
    { 
      text: 'Data Usage', 
      icon: <DataUsageIcon />, 
      path: '/data/1',
      active: location.pathname.startsWith('/data')
    }
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: 'rgba(220, 0, 78, 0.05)'
      }}>
        <Logo size="medium" />
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#dc004e', mt: 1 }}>
          Admin Portal
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {navItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => handleNavigation(item.path)}
            sx={{ 
              bgcolor: item.active ? 'rgba(220, 0, 78, 0.1)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(220, 0, 78, 0.05)'
              }
            }}
          >
            <ListItemIcon sx={{ color: item.active ? '#dc004e' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontWeight: item.active ? 600 : 400,
                color: item.active ? '#dc004e' : 'inherit'
              }}
            />
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          bgcolor: 'white', 
          color: '#333',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Logo size={isMobile ? "small" : "medium"} />
            <Typography variant="h6" component="div" sx={{ 
              display: { xs: 'none', sm: 'block' },
              ml: 1,
              fontWeight: 600,
              color: '#dc004e'
            }}>
              Admin Portal
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {!isMobile && (
            <Box sx={{ display: 'flex' }}>
              {navItems.map((item) => (
                <Button 
                  key={item.text}
                  color="inherit"
                  onClick={() => handleNavigation(item.path)}
                  sx={{ 
                    mx: 1,
                    fontWeight: item.active ? 600 : 400,
                    color: item.active ? '#dc004e' : 'inherit',
                    '&:hover': {
                      bgcolor: 'rgba(220, 0, 78, 0.05)'
                    }
                  }}
                  startIcon={item.icon}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
          
          <Button 
            color="inherit" 
            onClick={handleLogout}
            sx={{ ml: 2 }}
            startIcon={<LogoutIcon />}
          >
            {!isMobile && 'Logout'}
          </Button>
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;
