import React from 'react';
import { Box, Typography, Paper, Grid, LinearProgress, Button, Chip } from '@mui/material';

const mockUsageData = {
  orderId: 29036,
  phoneNumber: "88001234",
  iccid: "1231239192XXX123123",
  last6Digits: "123456",
  status: "activated",
  dataUsage: {
    total: 3000, // 3GB in MB
    used: 1250, // 1.25GB used
    remaining: 1750, // 1.75GB remaining
  },
  period: {
    start: "2025-05-06T05:30:00Z",
    end: "2025-05-13T05:30:00Z",
  },
  price: "10000",
  country: "Korea",
  simType: "physical",
  orderType: "gift"
};

const OrderDetails = () => {
  const usagePercentage = (mockUsageData.dataUsage.used / mockUsageData.dataUsage.total) * 100;
  const startDate = new Date(mockUsageData.period.start);
  const endDate = new Date(mockUsageData.period.end);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#dc004e', fontWeight: 600 }}>
        SIM Card Usage Details
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            height: '100%',
            boxShadow: '0 4px 20px rgba(220, 0, 78, 0.1)',
            borderRadius: 2
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#dc004e', fontWeight: 600 }}>
              SIM Card Information
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography>Order ID: {mockUsageData.orderId}</Typography>
              <Typography>Phone Number: {mockUsageData.phoneNumber}</Typography>
              <Typography>ICCID: {mockUsageData.iccid}</Typography>
              <Typography>Last 6 Digits: {mockUsageData.last6Digits}</Typography>
              <Typography>Status: <Chip label={mockUsageData.status} color="success" size="small" /></Typography>
              <Typography>Country: {mockUsageData.country}</Typography>
              <Typography>Order Type: {mockUsageData.orderType}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ 
            p: 3, 
            height: '100%',
            boxShadow: '0 4px 20px rgba(220, 0, 78, 0.1)',
            borderRadius: 2
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#dc004e', fontWeight: 600 }}>
              Data Usage
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography>Total Data: {mockUsageData.dataUsage.total / 1000} GB</Typography>
                <Typography>Used: {mockUsageData.dataUsage.used / 1000} GB</Typography>
                <Typography>Remaining: {mockUsageData.dataUsage.remaining / 1000} GB</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={usagePercentage} 
                  color="secondary"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                {usagePercentage.toFixed(1)}% used
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ 
            p: 3,
            boxShadow: '0 4px 20px rgba(220, 0, 78, 0.1)',
            borderRadius: 2
          }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#dc004e', fontWeight: 600 }}>
              Validity Period
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography>Start Date: {startDate.toLocaleString()}</Typography>
              <Typography>End Date: {endDate.toLocaleString()}</Typography>
              <Typography>Duration: {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} days</Typography>
              <Typography>Price: {mockUsageData.price} ₮</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="secondary"
          size="large"
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
          Refresh Data
        </Button>
      </Box>
    </Box>
  );
};

export default OrderDetails;
