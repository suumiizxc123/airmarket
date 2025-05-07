import React from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { activateSIM } from '../services/orderService';

const ActivateSIM = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');

  const onSubmit = async (data) => {
    try {
      await activateSIM(data.last6Digits);
      setSuccess(true);
      setError('');
      setTimeout(() => {
        setSuccess(false);
        navigate('/orders');
      }, 2000);
    } catch (error) {
      setError(error.message || 'Activation failed');
      setSuccess(false);
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
      }}
    >
      <Typography variant="h6" gutterBottom>
        Activate GlobalSIM Card
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom>
        Physical SIM Prefix: 8982200000000000000
      </Typography>
      
      <TextField
        fullWidth
        label="Last 6 Digits"
        {...register('last6Digits', {
          required: 'This field is required',
          pattern: {
            value: /^[0-9]{6}$/, // Exactly 6 digits
            message: 'Please enter exactly 6 digits',
          },
        })}
        error={!!errors.last6Digits}
        helperText={errors.last6Digits?.message}
      />

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          SIM activation successful!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Activate GlobalSIM
      </Button>
    </Box>
  );
};

export default ActivateSIM;
