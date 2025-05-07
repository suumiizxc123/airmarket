import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Grid, Alert } from '@mui/material';

const OrderForm = ({ onCreate }) => {
  const [last6Digits, setLast6Digits] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!last6Digits || last6Digits.length !== 6 || !/^\d+$/.test(last6Digits)) {
      setError('Please enter valid 6 digits');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      
      // Create order with default values, only using the last6Digits
      const orderData = {
        last6Digits,
        // Default values that are hidden from the user
        country: 'Korea',
        dataGB: '3',
        duration: '7 days',
        price: '10000'
      };
      
      await onCreate(orderData);
      setSuccess('SIM card order created successfully!');
      setLast6Digits(''); // Reset form
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper sx={{ 
      p: 4, 
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(220, 0, 78, 0.08)',
      maxWidth: 600,
      mx: 'auto'
    }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ 
        fontWeight: 600,
        color: '#dc004e',
        mb: 3
      }}>
        Create New SIM Order
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Last 6 Digits of ICCID"
              fullWidth
              value={last6Digits}
              onChange={(e) => setLast6Digits(e.target.value)}
              inputProps={{ maxLength: 6 }}
              placeholder="Enter last 6 digits"
              helperText="Enter the last 6 digits of the SIM card ICCID"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                },
                '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#dc004e',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#dc004e',
                }
              }}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            size="large"
            disabled={isSubmitting}
            sx={{ 
              px: 4, 
              py: 1.5,
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(220, 0, 78, 0.3)',
              background: 'linear-gradient(45deg, #dc004e 30%, #ff4081 90%)',
              '&:hover': {
                boxShadow: '0 6px 12px rgba(220, 0, 78, 0.4)',
                background: 'linear-gradient(45deg, #c50046 30%, #e91e63 90%)',
              }
            }}
          >
            {isSubmitting ? 'Creating...' : 'Create Order'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default OrderForm;
