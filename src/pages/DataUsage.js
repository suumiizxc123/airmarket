import React from 'react';
import { Box, Typography, Paper, Grid, Button, Chip, } from '@mui/material';

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

const DataUsage = () => {
  // const theme = useTheme();
  
  const usagePercentage = (mockUsageData.dataUsage.used / mockUsageData.dataUsage.total) * 100;
  const startDate = new Date(mockUsageData.period.start);
  const endDate = new Date(mockUsageData.period.end);
  const daysLeft = Math.round((endDate - new Date()) / (1000 * 60 * 60 * 24));

  // Available renewal plans
  const renewalPlans = [
    { datagb: "1", duration: "1-3 days", price: "15000" },
    { datagb: "3", duration: "4-7 days", price: "35000" },
    { datagb: "5", duration: "8-10 days", price: "60000" },
    { datagb: "10", duration: "11-15 days", price: "95000" },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      px: 3,
      py: 4,
      background: 'linear-gradient(135deg, #dc004e 0%, #c50046 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite'
    }}>
      <Box sx={{ 
        width: '100%',
        maxWidth: 800,
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 16,
        p: 3,
        boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(8px)',
        mb: 4
      }}>
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img 
              src="https://www.airmarket.mn/assets/images/airmarket_logo.png" 
              alt="AirMarket Logo" 
              style={{ 
                height: 32,
                width: 'auto',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            />
            <img 
              src="https://user.globalsim.mn/static/media/globalsimlogo.f25ee68ddbfa49c67854.png" 
              alt="GlobalSIM Logo" 
              style={{ 
                height: 32,
                width: 'auto',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            />
          </Box>
          <Typography variant="h5" sx={{ 
            color: '#dc004e',
            fontWeight: 600
          }}>
            SIM Card Usage
          </Typography>
        </Box>

        <Paper sx={{ 
          p: 3,
          borderRadius: 12,
          background: 'linear-gradient(145deg, #fff5f8 0%, #ffebf1 100%)',
          boxShadow: '0 10px 20px rgba(220, 0, 78, 0.1)',
          mb: 3,
          overflow: 'hidden',
          position: 'relative'
        }}>
          {/* Decorative elements */}
          <Box sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0) 70%)',
            zIndex: 0
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(25,118,210,0.08) 0%, rgba(25,118,210,0) 70%)',
            zIndex: 0
          }} />

          {/* Main content */}
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Status and country chip row */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 3,
              flexWrap: 'wrap',
              gap: 1
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  label={mockUsageData.status} 
                  color="success" 
                  size="small"
                  sx={{ 
                    fontWeight: 600,
                    borderRadius: '8px',
                    px: 1
                  }}
                />
                <Chip 
                  label={mockUsageData.country} 
                  color="primary" 
                  variant="outlined"
                  size="small"
                  sx={{ 
                    fontWeight: 500,
                    borderRadius: '8px',
                    px: 1
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={`${daysLeft} days left`}
                  color={daysLeft < 3 ? "error" : daysLeft < 5 ? "warning" : "info"}
                  size="small"
                  sx={{ 
                    fontWeight: 500,
                    borderRadius: '8px',
                    px: 1
                  }}
                />
                <Typography variant="body2" sx={{ 
                  color: '#666',
                  fontWeight: 500
                }}>
                  ID: {mockUsageData.orderId}
                </Typography>
              </Box>
            </Box>

            {/* Data usage visualization - improved with glow effect */}
            <Box sx={{ 
              mb: 4,
              p: 3,
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.7)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Background decorative elements */}
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '220px',
                height: '220px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(25,118,210,0.03) 0%, rgba(25,118,210,0) 70%)',
                zIndex: 0
              }} />
              
              <Box sx={{ 
                position: 'relative', 
                width: '180px', 
                height: '180px', 
                margin: '0 auto',
                mb: 2,
                zIndex: 1
              }}>
                {/* Circular progress visualization with glow effect */}
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: `conic-gradient(
                    #1976d2 0% ${usagePercentage}%, 
                    #e0e0e0 ${usagePercentage}% 100%
                  )`,
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  filter: 'drop-shadow(0 0 8px rgba(25, 118, 210, 0.3))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Box sx={{
                    width: '70%',
                    height: '70%',
                    borderRadius: '50%',
                    background: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
                      {usagePercentage.toFixed(0)}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Used
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                  <Typography variant="body2" sx={{ color: '#666' }}>Total</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {mockUsageData.dataUsage.total / 1000} GB
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" sx={{ color: '#666' }}>Used</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                    {mockUsageData.dataUsage.used / 1000} GB
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" sx={{ color: '#666' }}>Remaining</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#4caf50' }}>
                    {mockUsageData.dataUsage.remaining / 1000} GB
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {/* SIM and validity info */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ 
                    color: '#1976d2',
                    fontWeight: 600,
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 5h-8v2h8V8zm0 4h-8v2h8v-2zm-4 4h-4v2h4v-2z" fill="#1976d2"/>
                    </svg>
                    SIM Details
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 1.5,
                    pl: 1
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ color: '#666', minWidth: 100, fontSize: '0.9rem' }}>Phone:</Typography>
                      <Typography sx={{ fontWeight: 500 }}>{mockUsageData.phoneNumber}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ color: '#666', minWidth: 100, fontSize: '0.9rem' }}>ICCID:</Typography>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>{mockUsageData.iccid}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ color: '#666', minWidth: 100, fontSize: '0.9rem' }}>Last 6:</Typography>
                      <Typography sx={{ fontWeight: 500 }}>{mockUsageData.last6Digits}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ color: '#666', minWidth: 100, fontSize: '0.9rem' }}>Type:</Typography>
                      <Typography sx={{ fontWeight: 500 }}>
                        {mockUsageData.simType} ({mockUsageData.orderType})
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="subtitle1" sx={{ 
                    color: '#1976d2',
                    fontWeight: 600,
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" fill="#1976d2"/>
                    </svg>
                    Validity Period
                  </Typography>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 1.5,
                    pl: 1
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ color: '#666', minWidth: 100, fontSize: '0.9rem' }}>Start:</Typography>
                      <Typography sx={{ fontWeight: 500 }}>{startDate.toLocaleDateString()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ color: '#666', minWidth: 100, fontSize: '0.9rem' }}>End:</Typography>
                      <Typography sx={{ fontWeight: 500 }}>{endDate.toLocaleDateString()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ color: '#666', minWidth: 100, fontSize: '0.9rem' }}>Duration:</Typography>
                      <Typography sx={{ fontWeight: 500 }}>
                        {Math.round((endDate - startDate) / (1000 * 60 * 60 * 24))} days
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ color: '#666', minWidth: 100, fontSize: '0.9rem' }}>Price:</Typography>
                      <Typography sx={{ fontWeight: 600, color: '#1976d2' }}>
                        {mockUsageData.price} ₮
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Renewal options section */}
        <Paper sx={{ 
          p: 3,
          borderRadius: 12,
          background: 'linear-gradient(145deg, #f0f7ff 0%, #e0f0ff 100%)',
          boxShadow: '0 10px 20px rgba(25, 118, 210, 0.1)',
          mb: 3,
          overflow: 'hidden',
          position: 'relative'
        }}>
          <Typography variant="h6" sx={{ 
            color: '#1976d2',
            fontWeight: 600,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z" fill="#1976d2"/>
            </svg>
            Renewal Options
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                {renewalPlans.map((plan, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper sx={{
                      p: 2,
                      borderRadius: 8,
                      background: 'white',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(25, 118, 210, 0.15)',
                      },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      height: '100%'
                    }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                        {plan.datagb} GB
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                        {plan.duration}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
                        {plan.price} ₮
                      </Typography>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        size="small"
                        sx={{ 
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 500,
                          mt: 'auto'
                        }}
                      >
                        Select
                      </Button>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            
            <Grid item xs={12} md={4}>
              {/* Empty space for future content */}
              <Box sx={{ 
                height: '100%', 
                minHeight: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                border: '1px dashed rgba(25, 118, 210, 0.3)',
                p: 2
              }}>
                <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.4)', fontStyle: 'italic', textAlign: 'center' }}>
                  Need help choosing a plan?
                  <Box component="span" sx={{ display: 'block', mt: 1 }}>
                    Contact customer support
                  </Box>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ 
              px: 4, 
              py: 1.5,
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
              background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
              '&:hover': {
                boxShadow: '0 6px 12px rgba(25, 118, 210, 0.4)',
                background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z" fill="white"/>
              </svg>
              <span>Renew Now</span>
            </Box>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default DataUsage;
