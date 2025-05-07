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
  country: "South Korea",
  simType: "physical",
  orderType: "gift"
};

const OrderDetails = () => {
  const usagePercentage = (mockUsageData.dataUsage.used / mockUsageData.dataUsage.total) * 100;
  const startDate = new Date(mockUsageData.period.start);
  const endDate = new Date(mockUsageData.period.end);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        SIM Card Usage Details
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
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
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Data Usage
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography>Total Data: {mockUsageData.dataUsage.total / 1000} GB</Typography>
                <Typography>Used: {mockUsageData.dataUsage.used / 1000} GB</Typography>
                <Typography>Remaining: {mockUsageData.dataUsage.remaining / 1000} GB</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <LinearProgress variant="determinate" value={usagePercentage} />
              </Box>
              <Typography variant="caption" color="text.secondary">
                {usagePercentage.toFixed(1)}% used
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Validity Period
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography>Start Date: {startDate.toLocaleString()}</Typography>
              <Typography>End Date: {endDate.toLocaleString()}</Typography>
              <Typography>Duration: {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} days</Typography>
              <Typography>Price: {mockUsageData.price} KRW</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ px: 4, py: 1.5 }}
        >
          Refresh Data
        </Button>
      </Box>
    </Box>
  );
};

export default OrderDetails;
