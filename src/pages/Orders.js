import React, { useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Container, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import OrderForm from '../components/OrderForm';
import { useAuth } from '../services/authService';
import { createOrder } from '../services/orderService';

function Orders() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const theme = useTheme();

  if (!isAuthenticated()) {
    navigate('/login');
    return null;
  }

  const handleCreateOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      const newOrder = await createOrder(orderData);
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order. Please try again later.');
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

        {/* Order Creation Section */}
        <Box sx={{ mb: 4 }}>
          <OrderForm onCreate={handleCreateOrder} />
        </Box>

        {/* Loading indicator */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress color="secondary" size={40} />
          </Box>
        )}
        
        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Container>
    </Box>
  );
}

export default Orders;
