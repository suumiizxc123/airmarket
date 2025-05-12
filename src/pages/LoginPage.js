import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';

const API_URL = 'https://esimbackend-78d0b12a97f7.herokuapp.com';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      const response = await fetch(`${API_URL}/api/user/login`, {
        method: 'POST',
        body: params,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        mode: 'cors'
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.status === 200 && data.message === 'success') {
        // Store user data in localStorage for persistence
        const userData = {
          uid: data.uid,
          email: data.email,
          role: data.role,
          auth_token: data.auth_token,
          pareto: data.pareto
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('Stored user data:', userData);

        // Clear form
        setUsername('');
        setPassword('');
        setError('');

        // Redirect to orders page on successful login
        navigate('/orders', { replace: true });
      } else {
        setError(data.message || 'Нэвтрэхэд алдаа гарлаа');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Системд холбогдоход алдаа гарлаа. Дараа дахин оролдоно уу.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
      p: 2
    }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: 4,
          background: 'white',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.1)
        }}
      >
        <Stack spacing={3}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                color: theme.palette.primary.main,
                fontWeight: 700,
                mb: 1
              }}
            >
              Нэвтрэх
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Системд нэвтрэх хэрэгтэй
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 2,
                '& .MuiAlert-message': {
                  width: '100%',
                  textAlign: 'center'
                }
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Имэйл"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                type="email"
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              <TextField
                fullWidth
                label="Нууц үг"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={<LoginIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  '&:hover': {
                    background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                  }
                }}
              >
                {loading ? 'Ажиллаж байна...' : 'Нэвтрэх'}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LoginPage; 