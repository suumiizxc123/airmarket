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
  Chip
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
  createdBy: 'Bayarkhuu',
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
    last6Digits: '',
    phoneNumber: '', // Keeping in state but not showing in UI
    externalOrderId: '' // Keeping in state but not showing in UI
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.last6Digits) {
      setError('Last 6 digits of SIM card are required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess(false);
      setImportSuccess(false);
      
      // Pass all formData to maintain API compatibility
      await onSubmit(formData);
      
      // Reset form after successful submission
      setFormData({
        last6Digits: '',
        phoneNumber: '',
        externalOrderId: ''
      });
      
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to activate SIM card');
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
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Enter the last 6 digits of your SIM card to activate it
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <TextField
            label="Last 6 Digits of SIM"
            name="last6Digits"
            value={formData.last6Digits}
            onChange={handleChange}
            fullWidth
            required
            autoFocus
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#dc004e',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#dc004e',
              },
            }}
            helperText="Required for SIM card activation"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
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
                      minWidth: '140px'
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Activate'}
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
      
      {/* Default values display */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
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
          icon={<CalendarTodayIcon fontSize="small" />} 
          label={`Start: ${formatDate(today)}`} 
          variant="outlined" 
          color="secondary" 
          size="small"
        />
        <Chip 
          icon={<EventIcon fontSize="small" />} 
          label={`End: ${formatDate(endDate)}`} 
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
  );
};

export default OrderForm;
