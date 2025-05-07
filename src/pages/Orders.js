import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Container, useTheme, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import OrderForm from '../components/OrderForm';
import OrderList from '../components/OrderList';
import { isAuthenticated } from '../services/authService';
import { createOrder, getOrders, bulkImportSims } from '../services/orderService';

function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  // Check authentication and fetch orders in a single useEffect
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Fetch orders
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrders();
        setOrders(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, location.pathname]); // Only re-run if navigation changes

  const handleCreateOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      const newOrder = await createOrder(orderData);
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to create order. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleBulkImport = async (simCards) => {
    try {
      setLoading(true);
      setError(null);
      const newOrders = await bulkImportSims(simCards);
      setOrders(prevOrders => [...newOrders, ...prevOrders]);
      return newOrders;
    } catch (error) {
      console.error('Error importing SIM cards:', error);
      setError('Failed to import SIM cards. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth and fetching initial data
  if (loading && orders.length === 0) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#f9f9f9'
      }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#f9f9f9',
      py: 4
    }}>
      <Container>
        <Typography variant="h4" gutterBottom sx={{ 
          fontWeight: 600,
          color: '#dc004e',
          mb: 4
        }}>
          SIM Card Management
        </Typography>
        
        {/* Order Form */}
        <Paper sx={{ 
          p: 3, 
          mb: 4,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(220, 0, 78, 0.1)',
          bgcolor: theme.palette.background.paper,
        }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#dc004e' }}>
            Activate GlobalSIM Card
          </Typography>
          
          <OrderForm onSubmit={handleCreateOrder} onBulkImport={handleBulkImport} />
        </Paper>
        
        {/* Loading indicator for subsequent data fetches */}
        {loading && orders.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress color="secondary" />
          </Box>
        )}
        
        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Order List Section */}
        {!loading && orders.length > 0 && (
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(220, 0, 78, 0.1)',
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#dc004e' }}>
              Recent Activations
            </Typography>
            
            <OrderList orders={orders} />
          </Paper>
        )}
      </Container>
    </Box>
  );
}

export default Orders;
