import React, { useState, useRef } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  CircularProgress, 
  Alert,
  Typography,
  Divider,
  Paper,
  Tooltip,
  IconButton,
  InputAdornment,
  Chip,
  Grid
} from '@mui/material';
import { 
  CloudUpload as UploadIcon,
  Info as InfoIcon,
  Flag as FlagIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  Event as EventIcon,
  CardGiftcard as CardGiftcardIcon,
  DataUsage as DataUsageIcon
} from '@mui/icons-material';

// Default values
const DEFAULT_VALUES = {
  country: 'South Korea',
  soldPrice: 10000,
  createdBy: (() => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user).email : 'Guest';
    } catch (error) {
      return 'Guest';
    }
  })(),
  orderType: 'gift',
  dataGB: 3,
  duration: 7 // days
};

// Format price with currency
const formatPrice = (price) => {
  if (price === undefined || price === null) return 'N/A';
  return new Intl.NumberFormat('mn-MN', { 
    style: 'currency', 
    currency: 'MNT',
    maximumFractionDigits: 0
  }).format(price);
};

// Format date for display
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Calculate end date
const calculateEndDate = (startDate, days) => {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days);
  return endDate;
};

// Current date
const today = new Date();
const endDate = calculateEndDate(today, DEFAULT_VALUES.duration);

const OrderForm = ({ onSubmit, onBulkImport }) => {
  const [formData, setFormData] = useState({
    last6Digits: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.last6Digits) {
      setError('Please enter the last 6 digits');
      return;
    }

    if (formData.last6Digits.length !== 6) {
      setError('Last 6 digits must be exactly 6 characters');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        last6Digits: formData.last6Digits
      });
      setFormData({
        last6Digits: ''
      });
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setError('');
      setSuccess(false);
      setImportSuccess(false);

      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const content = event.target.result;
          const lines = content.split(/\r?\n/).filter(line => line.trim());
          
          const simCards = lines.map(line => {
            const [last6Digits, phoneNumber, externalOrderId] = line.split(',');
            return { 
              last6Digits: last6Digits?.trim(), 
              phoneNumber: phoneNumber?.trim(), 
              externalOrderId: externalOrderId?.trim() 
            };
          });
          
          if (simCards.length === 0) {
            throw new Error('No valid SIM cards found in the file');
          }
          
          await onBulkImport(simCards);
          setImportSuccess(true);
          
          // Reset file input
          e.target.value = null;
        } catch (error) {
          setError(error.message || 'Failed to process file');
        } finally {
          setLoading(false);
        }
      };
      
      reader.onerror = () => {
        setError('Failed to read file');
        setLoading(false);
      };
      
      reader.readAsText(file);
    } catch (err) {
      setError(err.message || 'Failed to upload file');
      setLoading(false);
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          SIM card activated successfully!
        </Alert>
      )}
      
      {importSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          SIM cards imported and activated successfully!
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Last 6 Digits"
              value={formData.last6Digits}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                setFormData(prev => ({ ...prev, last6Digits: value }));
              }}
              required
              error={!!error}
              helperText={error || "Enter the last 6 digits of the SIM card"}
              placeholder="Enter last 6 digits"
              inputProps={{
                maxLength: 6,
                pattern: '[0-9]*',
                inputMode: 'numeric',
                style: { 
                  fontSize: '1.2rem',
                  letterSpacing: '0.5rem',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      sx={{ 
                        borderRadius: '8px',
                        boxShadow: '0 4px 10px rgba(220, 0, 78, 0.3)',
                        background: 'linear-gradient(45deg, #dc004e 30%, #ff4081 90%)',
                        '&:hover': {
                          boxShadow: '0 6px 12px rgba(220, 0, 78, 0.4)',
                          background: 'linear-gradient(45deg, #c50046 30%, #e91e63 90%)',
                        },
                        height: '40px',
                        minWidth: '140px',
                        ml: 2
                      }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Activate GlobalSIM'}
                    </Button>
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '0 4px 20px rgba(220, 0, 78, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 6px 25px rgba(220, 0, 78, 0.15)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 8px 30px rgba(220, 0, 78, 0.2)',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#dc004e',
                      borderWidth: '2px'
                    }
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(220, 0, 78, 0.3)',
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#666',
                  '&.Mui-focused': {
                    color: '#dc004e',
                    fontWeight: 'bold'
                  }
                },
                '& .MuiInputBase-input': {
                  padding: '16px',
                  height: '1.5rem'
                },
                '& .MuiFormHelperText-root': {
                  marginLeft: '8px',
                  fontSize: '0.9rem'
                }
              }}
            />
          </Grid>
        </Grid>
        
        {/* Default values display */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3, mt: 3 }}>
          <Chip 
            icon={<FlagIcon fontSize="small" />} 
            label={`Country: ${DEFAULT_VALUES.country}`} 
            variant="outlined" 
            color="secondary" 
            size="small"
          />
          <Chip 
            icon={<MoneyIcon fontSize="small" />} 
            label={`Price: ${formatPrice(DEFAULT_VALUES.soldPrice)}`} 
            variant="outlined" 
            color="secondary" 
            size="small"
          />
          <Chip 
            icon={<PersonIcon fontSize="small" />} 
            label={`Created by: ${DEFAULT_VALUES.createdBy}`} 
            variant="outlined" 
            color="secondary" 
            size="small"
          />
          <Chip 
            icon={<CardGiftcardIcon fontSize="small" />} 
            label={`Type: ${DEFAULT_VALUES.orderType}`} 
            variant="outlined" 
            color="secondary" 
            size="small"
          />
          <Chip 
            icon={<DataUsageIcon fontSize="small" />} 
            label={`Data: ${DEFAULT_VALUES.dataGB}GB`} 
            variant="outlined" 
            color="secondary" 
            size="small"
          />
        </Box>
        
        <Divider sx={{ my: 4 }}>
          <Typography variant="body2" color="text.secondary">OR</Typography>
        </Divider>
        
        <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'rgba(220, 0, 78, 0.03)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#dc004e', flexGrow: 1 }}>
              Bulk Import SIM Cards
            </Typography>
            <Tooltip title="Upload a CSV or TXT file with one SIM card per line. Format: last6Digits,phoneNumber,externalOrderId (only last6Digits is required)">
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Upload a file containing multiple SIM card details for bulk activation
          </Typography>
          
          <input
            type="file"
            accept=".csv,.txt"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<UploadIcon />}
            onClick={triggerFileInput}
            disabled={loading}
            fullWidth
            sx={{ 
              py: 1.5,
              borderRadius: '8px',
              borderColor: '#dc004e',
              color: '#dc004e',
              '&:hover': {
                borderColor: '#c50046',
                bgcolor: 'rgba(220, 0, 78, 0.05)',
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload SIM Card File'}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
};

export default OrderForm;
