import React from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const OrderForm = ({ onCreate }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      externalOrderId: 'EP1ASXAXDAD',
      iccid: '8982200000000000000',
      last6Digits: '123456',
      simType: 'physical',
      country: 'South Korea',
      status: 'pending',
      dataGB: '3',
      duration: '7',
      orderType: 'gift',
      soldPrice: '10000',
      userId: 'air001',
      name: 'Bayarkhuu'
    }
  });
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await onCreate(data);
      setSuccess(true);
      setError('');
      setTimeout(() => {
        setSuccess(false);
        navigate('/orders');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Order creation failed');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        margin: '0 auto',
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Create New Order
      </Typography>

      <TextField
        fullWidth
        label="Phone Number"
        {...register('phoneNumber', {
          required: 'Phone number is required',
          pattern: {
            value: /^[0-9]{8}$/,
            message: 'Please enter a valid 8-digit phone number',
          },
        })}
        error={!!errors.phoneNumber}
        helperText={errors.phoneNumber?.message}
      />

      <TextField
        fullWidth
        label="Last 6 Digits"
        {...register('last6Digits', {
          pattern: {
            value: /^[0-9]{6}$/,
            message: 'Please enter exactly 6 digits',
          },
        })}
        error={!!errors.last6Digits}
        helperText={errors.last6Digits?.message}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Data (GB)"
        {...register('dataGB', {
          pattern: {
            value: /^[0-9]+$/,
            message: 'Please enter a valid number',
          },
        })}
        error={!!errors.dataGB}
        helperText={errors.dataGB?.message}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Duration (days)"
        {...register('duration', {
          pattern: {
            value: /^[0-9]+$/,
            message: 'Please enter a valid number',
          },
        })}
        error={!!errors.duration}
        helperText={errors.duration?.message}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Order Type"
        {...register('orderType')}
        error={!!errors.orderType}
        helperText={errors.orderType?.message}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Price (KRW)"
        {...register('soldPrice', {
          pattern: {
            value: /^[0-9]+$/,
            message: 'Please enter a valid number',
          },
        })}
        error={!!errors.soldPrice}
        helperText={errors.soldPrice?.message}
      />

      {success && (
        <Alert severity="success" sx={{ my: 2 }}>
          SIM card created and activated successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        disabled={loading}
        sx={{
          mt: 2,
          py: 1.5,
          fontSize: '1.1rem',
        }}
      >
        {loading ? 'Processing...' : 'Create & Activate Order'}
      </Button>
    </Box>
  );
};

export default OrderForm;
