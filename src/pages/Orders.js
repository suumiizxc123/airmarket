import React, { useEffect, useState } from 'react';
import { Box, Tab, Tabs, Typography, CircularProgress, Alert, Grid, Paper, Container, useTheme } from '@mui/material';
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
  const [tab, setTab] = React.useState(0);
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

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{
      bgcolor: theme.palette.background.default,
      minHeight: '100vh',
      pt: 4,
      pb: 4,
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
              color: theme.palette.primary.main,
              mb: 1,
            }}>
              SIM Orders Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage and track all SIM card orders
            </Typography>
          </Box>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tab} onChange={handleTabChange} centered>
            <Tab label="Create Order" />
            <Tab label="View Orders" />
          </Tabs>
        </Box>

        {tab === 0 && (
          <OrderForm 
            onCreate={async (orderData) => {
              try {
                setLoading(true);
                setError(null);
                const newOrder = await createOrder(orderData);
                setOrders([...orders, newOrder]);
              } catch (error) {
                console.error('Error creating order:', error);
                setError('Failed to create order. Please try again later.');
              } finally {
                setLoading(false);
              }
            }}
          />
        )}

        {tab === 1 && (
          <Box sx={{ p: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress color="primary" size={40} />
              </Box>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      boxShadow: theme.shadows[3],
                      bgcolor: theme.palette.background.paper,
                    }}
                  >
                    <OrderList 
                      orders={orders}
                      onActivate={async (last6Digits) => {
                        try {
                          setLoading(true);
                          setError(null);
                          await activateSIM(last6Digits);
                          const updatedOrders = await getOrders();
                          setOrders(updatedOrders);
                        } catch (error) {
                          console.error('Error activating SIM:', error);
                          setError('Failed to activate SIM. Please try again later.');
                        } finally {
                          setLoading(false);
                        }
                      }}
                    />
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Box>
        )}
      </Container>
      {loading && (
        <Box sx={{ mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
    </Box>
  );
}

export default Orders;
