import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Paper, Container, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import OrderList from '../components/OrderList';
import OrderForm from '../components/OrderForm';
import { useAuth } from '../services/authService';
import {
  getOrders,
  activateSIM,
  createOrder
} from '../services/orderService';

function Orders() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = useTheme();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrders();
        console.log("orders", data);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (!isAuthenticated()) {
    navigate('/login');
    return null;
  }

  const handleCreateOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      const newOrder = await createOrder(orderData);
      setOrders([newOrder, ...orders]); // Add new order to the top of the list
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateSIM = async (last6Digits) => {
    try {
      setLoading(true);
      setError(null);
      await activateSIM(last6Digits);
      // Refresh orders after activation
      const updatedOrders = await getOrders();
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error activating SIM:', error);
      setError('Failed to activate SIM. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      bgcolor: theme.palette.background.default,
      minHeight: '100vh',
      pt: 4,
      pb: 4,
      background: 'linear-gradient(135deg, #ffeeee 0%, #ffffff 100%)',
    }}>
      <Container maxWidth="xl">
        <Box sx={{
          mb: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{
              fontWeight: 700,
              color: '#dc004e',
              mb: 1,
            }}>
              SIM Orders Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage and track all SIM card orders
            </Typography>
          </Box>
        </Box>

        {/* Order Creation Section - Now at the top */}
        <Box sx={{ mb: 4 }}>
          <OrderForm onCreate={handleCreateOrder} />
        </Box>

        {/* Order List Section - Now below the creation form */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(220, 0, 78, 0.1)',
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#dc004e' }}>
            Current Orders
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress color="secondary" size={40} />
            </Box>
          ) : (
            <OrderList 
              orders={orders}
              onActivate={handleActivateSIM}
            />
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default Orders;
