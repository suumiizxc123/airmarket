import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  useTheme,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  alpha,
  List,
  ListItem,
  MobileStepper
} from '@mui/material';
import { 
  DataUsage as DataUsageIcon, 
  Public as PublicIcon, 
  SimCard as SimCardIcon,
  CalendarToday as CalendarIcon,
  ArrowBackIos as ArrowBackIos,
  ArrowForwardIos as ArrowForwardIos,
  Close as CloseIcon,
  QrCode as QrCodeIcon,
  ShoppingCart as ShoppingCartIcon,
  PlayCircleOutlined,
  ZoomIn as ZoomInIcon
} from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';

// Import images
// import iphone_manual_1_2 from '../images/iphone_manual_1_2.jpg';
// import iphone_manual_3_4 from '../images/iphone_manual_3_4.jpg';
// import iphone_manual_5_6 from '../images/iphone_manual_5_6.jpg';
import guide1 from '../images/guide1.jpeg';
import guide2 from '../images/guide2.jpeg';
import huawei_guide from '../images/huawei_guide2.jpeg';
import iphone_guide from '../images/iphone_guide2.jpeg';
import redmi_guide from '../images/redmi_guide2.jpeg';
import samsung_guide from '../images/samsung1_guide2.jpeg';

import samsung_guide2 from '../images/samsung2_guide2.jpeg';
import logo512 from '../images/logo512.png';

const DataPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPhone, setSelectedPhone] = useState('huawei');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const theme = useTheme();

  // Image data for the carousel
  const images = [
    guide1,
    guide2
  ];

  const imageAlts = [
    "Huawei Phone Guide",
    "Redmi Phone Guide"
  ];

  // Guide content data
  const guideContent = {
    'samsung-dual': {
      title: 'Samsung 2 симтэй утасны тохиргоо',
      image: samsung_guide2,
      steps: [
        'Settings - Connection - SIM manager ороод доошоо гүйлгээд Mobile data хэсэгт (Global sim)-р тохируулах',
        'Settings - Connection - Mobile Networks руу орж Data roaming асаах'
      ]
    },
    'samsung-single': {
      title: 'Samsung 1 симтэй утасны тохиргоо',
      image: samsung_guide,
      steps: [
        'Settings - Connections - Data usage - Mobile data ON',
        'Settings - Connections - Global roaming - Data roaming ON'
      ]
    },
    'iphone': {
      title: 'iPhone утасны тохиргоо',
      image: iphone_guide,
      steps: [
        'Settings - Cellular - Cellular Data Options - Data roaming ON',
        'Settings - Cellular - Cellular Data ON'
      ]
    },
    'huawei': {
      title: 'Huawei утасны тохиргоо',
      image: huawei_guide,
      steps: [
        'Settings (Тохиргоо) цэс рүү орно',
        'Wireless & networks (Утасгүй сүлжээ) сонгоно',
        'Mobile network (Гар утасны сүлжээ) сонгоно',
        'Roaming (Роуминг) асаана',
        'OK товчийг дарж дуусгана'
      ]
    },
    'redmi': {
      title: 'Redmi утасны тохиргоо',
      image: redmi_guide,
      steps: [
        'Settings (Тохиргоо) цэс рүү орно',
        'SIM cards & mobile networks (SIM карт & гар утасны сүлжээ) сонгоно',
        'Advanced settings (Нэмэлт тохиргоо) сонгоно',
        'Data roaming (Дата роуминг) сонгоно',
        'Always (Үргэлж) болгож солино'
      ]
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`https://clientsvc.globalsim.mn/api/user/page/price-by-orderid?order_id=${orderId}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        setData(result.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  // Set initial selected duration to the first available duration
  useEffect(() => {
    if (data?.priceinfo) {
      const groupedPlans = groupPlansByDuration(data.priceinfo);
      const durationTabs = Object.keys(groupedPlans).sort((a, b) => {
        const aMin = parseInt(a.split('-')[0]);
        const bMin = parseInt(b.split('-')[0]);
        return aMin - bMin;
      });
      if (durationTabs.length > 0 && !selectedDuration) {
        setSelectedDuration(durationTabs[0]);
      }
    }
  }, [data, selectedDuration]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: 'MNT',
      maximumFractionDigits: 0
    }).format(price);
  };

  const extractDurationRange = (duration) => {
    // Remove "хоног" and any extra spaces
    const cleanDuration = duration.replace(/хоног/g, '').trim();
    
    // Extract numbers from the duration string
    const numbers = cleanDuration.match(/\d+/g);
    if (!numbers) return null;

    // If it's a range (e.g., "11-15")
    if (numbers.length === 2) {
      return {
        min: parseInt(numbers[0]),
        max: parseInt(numbers[1]),
        label: `${numbers[0]}-${numbers[1]} days`
      };
    }
    
    // If it's a single number
    return {
      min: parseInt(numbers[0]),
      max: parseInt(numbers[0]),
      label: `${numbers[0]} days`
    };
  };

  const groupPlansByDuration = (plans) => {
    const groups = {};

    // First, collect all unique duration ranges
    const durationRanges = new Set();
    plans?.forEach(plan => {
      const range = extractDurationRange(plan.duration);
      if (range) {
        durationRanges.add(range.label);
      }
    });

    // Initialize groups for each duration range
    durationRanges.forEach(range => {
      groups[range] = [];
    });

    // Sort all plans by price in ascending order
    const sortedPlans = [...(plans || [])].sort((a, b) => {
      // First sort by price (ascending)
      const priceDiff = a.price - b.price;
      if (priceDiff !== 0) return priceDiff;
      
      // If prices are the same, sort by data amount (descending)
      return b.datagb - a.datagb;
    });

    // Group plans by duration
    sortedPlans.forEach(plan => {
      const range = extractDurationRange(plan.duration);
      if (range) {
        groups[range.label].push(plan);
      }
    });

    // Sort duration tabs by minimum days
    const sortedGroups = {};
    Object.keys(groups)
      .sort((a, b) => {
        const aMin = parseInt(a.split('-')[0]);
        const bMin = parseInt(b.split('-')[0]);
        return aMin - bMin;
      })
      .forEach(key => {
        sortedGroups[key] = groups[key];
      });

    return sortedGroups;
  };

  const handleDurationChange = (event, newValue) => {
    setSelectedDuration(newValue);
  };

  const handleCreateOrder = async (plan, iccid) => {
    try {
      setCreatingOrder(true);
      setError(null);
      
      const response = await fetch('https://clientsvc.globalsim.mn/api/user/page/create-qpos-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          simorderid: iccid,
          pricerowid: plan.rowid,
          prevordernum: orderId,
          phonenumber: "00000000"
        })
      });

      if (!response.ok) throw new Error('Failed to create order');
      
      const result = await response.json();
      setPaymentData(result);
      setPaymentDialog(true);
      setPaymentStatus(null);
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to create order. Please try again.');
    } finally {
      setCreatingOrder(false);
    }
  };

  const handleCheckPayment = async () => {
    if (!paymentData?.qr_text) return;
    
    try {
      setCheckingPayment(true);
      const encodedQrText = encodeURIComponent(paymentData.qr_text);
      const response = await fetch(`https://clientsvc.globalsim.mn/api/user/page/check-payment-qpos?qr_text=${encodedQrText}`);
      
      if (!response.ok) throw new Error('Failed to check payment status');
      
      const result = await response.json();
      setPaymentStatus(result.message);
      
      if (result.message === 'success') {
        // Close dialog and refresh page after successful payment
        setTimeout(() => {
          handleClosePaymentDialog();
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      console.error('Error checking payment:', err);
      setError('Failed to check payment status. Please try again.');
    } finally {
      setCheckingPayment(false);
    }
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialog(false);
    setPaymentData(null);
  };

  const handleOpenQPayWallet = (url) => {
    window.location.href = url;
  };

  const handleZoomImage = (index) => {
    // Implementation of handleZoomImage function
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)'
      }}>
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ borderRadius: 2 }}>No data found</Alert>
      </Box>
    );
  }

  const country = data.priceinfo?.[0]?.countryname || 'Unknown';
  const groupedPlans = groupPlansByDuration(data.priceinfo);
  const currentPlans = groupedPlans[selectedDuration] || [];
  const durationTabs = Object.keys(groupedPlans).sort((a, b) => {
    const aMin = parseInt(a.split('-')[0]);
    const bMin = parseInt(b.split('-')[0]);
    return aMin - bMin;
  });

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
      py: 4
    }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 2 }}>
        {/* Main Title with Logo */}
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" mb={3}>
          <Box
            component="img"
            src={logo512}
            alt="GlobalSIM Logo"
            sx={{
              width: 32,
              height: 32,
              objectFit: 'contain'
            }}
          />
          <Typography 
            variant="h5" 
            sx={{ 
              color: theme.palette.primary.main,
              fontWeight: 500,
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              letterSpacing: '-0.5px',
              fontSize: { xs: '1.25rem', sm: '1.375rem', md: '1.5rem' }
            }}
          >
            GlobalSIM картын мэдээлэл
          </Typography>
        </Stack>

        <Stack spacing={4}>
          {/* Basic Information */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 2,
              borderRadius: 2,
              background: 'white',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.08)
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Box sx={{ 
                p: 1, 
                borderRadius: 1.5, 
                bgcolor: alpha(theme.palette.primary.main, 0.08) 
              }}>
                <SimCardIcon color="primary" sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, fontWeight: 500 }}>
                Сим картын мэдээлэл - {data.iccid}
              </Typography>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={2}>

                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ 
                      p: 0.75, 
                      borderRadius: 1.5, 
                      bgcolor: alpha(theme.palette.primary.main, 0.08) 
                    }}>
                      <PublicIcon color="primary" sx={{ fontSize: 16 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                        Улс
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {country}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ 
                      p: 0.75, 
                      borderRadius: 1.5, 
                      bgcolor: alpha(theme.palette.primary.main, 0.08) 
                    }}>
                      <CalendarIcon color="primary" sx={{ fontSize: 16 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                        Аялах өдөр
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {data.travelday}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ 
                      p: 0.75, 
                      borderRadius: 1.5, 
                      bgcolor: alpha(theme.palette.primary.main, 0.08) 
                    }}>
                      <DataUsageIcon color="primary" sx={{ fontSize: 16 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                        Дата ашиглалт
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {data.usedgb}GB / {data.allgb}GB
                      </Typography>
                    </Box>
                  </Stack>

                  <Box sx={{ width: '100%', maxWidth: 280 }}>
                    <Box
                      sx={{
                        height: 8,
                        backgroundColor: alpha(theme.palette.primary.main, 0.08),
                        borderRadius: 4,
                        overflow: 'hidden',
                        mb: 0.5,
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: `${(data.usedgb / data.allgb) * 100}%`,
                          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {((data.usedgb / data.allgb) * 100).toFixed(1)}% ашиглагдсан
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* Available Plans */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 2,
              borderRadius: 2,
              background: 'white',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.08)
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Box sx={{ 
                p: 1, 
                borderRadius: 1.5, 
                bgcolor: alpha(theme.palette.primary.main, 0.08) 
              }}>
                <ShoppingCartIcon color="primary" sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, fontWeight: 500 }}>
                Дата багц сунгах
              </Typography>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            
            {/* Duration Tabs */}
            <Box sx={{ 
              borderBottom: 1, 
              borderColor: 'divider', 
              mb: 3,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                minWidth: 120,
                fontSize: '0.875rem'
              }
            }}>
              <Tabs 
                value={selectedDuration} 
                onChange={handleDurationChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: 3
                  }
                }}
              >
                {durationTabs.map((duration) => (
                  <Tab 
                    key={duration}
                    label={duration === 'all' ? 'All Plans' : duration.replace("days", "хоног")} 
                    value={duration}
                  />
                ))}
              </Tabs>
            </Box>

            {/* Plans Grid */}
            <Grid container spacing={{ xs: 1, sm: 1.5, md: 2 }}>
              {currentPlans.map((plan) => (
                <Grid item xs={12} sm={6} md={4} key={plan.rowid}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: { xs: 1, sm: 1.5, md: 2 },
                      height: '100%',
                      border: '1px solid',
                      borderColor: alpha(theme.palette.primary.main, 0.1),
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        borderColor: theme.palette.primary.main,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                      }
                    }}
                  >
                    <Stack spacing={{ xs: 0.75, sm: 1, md: 1.5 }} sx={{ flex: 1 }}>
                      <Stack direction="row" alignItems="baseline" spacing={0.5}>
                        <Typography 
                          variant="h6" 
                          color="primary" 
                          sx={{ 
                            fontWeight: 600,
                            fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.375rem' }
                          }}
                        >
                          {formatPrice(plan.price)}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                        >
                          / {plan.duration.replace('days', '')}
                        </Typography>
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Typography 
                            variant="subtitle1" 
                            fontWeight="bold" 
                            sx={{ 
                              color: theme.palette.primary.main,
                              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                            }}
                          >
                            {plan.datagb}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}
                          >
                            GB
                          </Typography>
                        </Stack>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                        >
                          -
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                        >
                          {plan.countryname}
                        </Typography>
                      </Stack>

                      {/* <Chip 
                        label={plan.countryname}
                        size="small"
                        sx={{ 
                          alignSelf: 'flex-start',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                          fontSize: { xs: '0.625rem', sm: '0.75rem' },
                          height: { xs: 20, sm: 24 },
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                          }
                        }}
                      /> */}

                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleCreateOrder(plan, data.iccid)}
                        disabled={creatingOrder}
                        startIcon={<ShoppingCartIcon sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }} />}
                        sx={{
                          mt: 'auto',
                          py: { xs: 0.5, sm: 0.75 },
                          px: { xs: 1, sm: 1.5 },
                          borderRadius: 2,
                          textTransform: 'none',
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          fontWeight: 600,
                          minHeight: { xs: 32, sm: 36 },
                          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                          '&:hover': {
                            background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                          }
                        }}
                      >
                        {creatingOrder ? 'Ажиллаж байна...' : 'Худалдаж авах'}
                      </Button>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* eSIM Guide Section */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              borderRadius: 3,
              background: 'white',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.08)
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Box sx={{ 
                p: 1, 
                borderRadius: 1.5, 
                bgcolor: alpha(theme.palette.primary.main, 0.08) 
              }}>
                <QrCodeIcon color="primary" sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, fontWeight: 500 }}>
                Биет сим идэвхжүүлэх заавар
              </Typography>
            </Stack>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ maxWidth: 'md', mx: 'auto' }}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 3
                }}
              >
                {/* Phone Selection Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Tabs 
                    value={selectedPhone} 
                    onChange={(e, newValue) => setSelectedPhone(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      '& .MuiTabs-indicator': {
                        height: 3,
                        borderRadius: 3
                      },
                      '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        minWidth: { xs: 100, sm: 120 },
                        px: { xs: 1, sm: 2 }
                      }
                    }}
                  >
                    <Tab 
                      label="Samsung 2 симтэй" 
                      value="samsung-dual"
                    />
                    <Tab 
                      label="Samsung 1 симтэй" 
                      value="samsung-single"
                    />
                    <Tab 
                      label="iPhone" 
                      value="iphone"
                    />
                    <Tab 
                      label="Huawei" 
                      value="huawei"
                    />
                    <Tab 
                      label="Redmi" 
                      value="redmi"
                    />
                  </Tabs>
                </Box>

                {/* Content Grid */}
                <Grid container spacing={2}>
                  {/* Image */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      position: 'relative', 
                      width: '100%', 
                      height: { xs: 250, sm: 300 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Box
                        component="img"
                        src={guideContent[selectedPhone].image}
                        alt={guideContent[selectedPhone].title}
                        sx={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          borderRadius: 2,
                          cursor: 'pointer'
                        }}
                        onClick={() => handleZoomImage(0)}
                      />
                      <IconButton
                        onClick={() => handleZoomImage(0)}
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          bgcolor: alpha(theme.palette.primary.main, 0.8),
                          color: 'white',
                          '&:hover': { 
                            bgcolor: theme.palette.primary.main 
                          }
                        }}
                      >
                        <ZoomInIcon />
                      </IconButton>
                    </Box>
                  </Grid>

                  {/* Instructions */}
                  <Grid item xs={12} md={6}>
                    <Box>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: theme.palette.primary.main, 
                          fontWeight: 600, 
                          mb: 1.5,
                          fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                        }}
                      >
                        {guideContent[selectedPhone].title}
                      </Typography>
                      <List sx={{ pl: 1 }}>
                        {guideContent[selectedPhone].steps.map((step, index) => (
                          <ListItem 
                            key={index} 
                            sx={{ 
                              py: 0.5, 
                              color: 'text.primary',
                              display: 'flex',
                              alignItems: 'flex-start'
                            }}
                          >
                            <Typography 
                              component="span" 
                              sx={{ 
                                mr: 1,
                                color: theme.palette.primary.main,
                                fontWeight: 500,
                                fontSize: { xs: '0.875rem', sm: '1rem' }
                              }}
                            >
                              {index + 1}.
                            </Typography>
                            <Typography 
                              component="span"
                              sx={{
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                lineHeight: 1.5
                              }}
                            >
                              {step}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </Paper>
        </Stack>
      </Box>

      {/* Payment Dialog */}
      <Dialog 
        open={paymentDialog} 
        onClose={handleClosePaymentDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
      >
        <DialogTitle sx={{ 
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Худалдаж авах
            </Typography>
            <IconButton 
              onClick={handleClosePaymentDialog} 
              size="small"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {paymentData && (
            <Stack spacing={3}>
              {paymentData.qr_image && (
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3,
                    textAlign: 'center',
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.02)
                  }}
                >
                 
                  
                  {/* QR Code Section */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
                      QR кодоор төлөх
                    </Typography>
                    <Box
                      sx={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: 'white',
                        p: 2,
                        borderRadius: 2,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                        width: 240,
                        height: 240,
                        mx: 'auto'
                      }}
                    >
                      <QRCodeSVG
                        value={paymentData.qr_text}
                        size={200}
                        level="H"
                        includeMargin={true}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      эсвэл
                    </Typography>
                  </Divider>

                  {/* QPos Payment Section */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
                      QPos төлбөр төлөх
                    </Typography>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        p: 2,
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: alpha(theme.palette.primary.main, 0.1),
                        borderRadius: 3,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          borderColor: theme.palette.primary.main,
                          transform: 'translateY(-2px)'
                        }
                      }}
                      onClick={() => window.open(paymentData.qr_image, '_blank')}
                    >
                      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            QPos
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            QPos төлбөрийн систем
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Box>

                  {/* Payment Status */}
                  {paymentStatus && (
                    <Box sx={{ mt: 3 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: paymentStatus === 'success' ? 'success.main' : 
                                 paymentStatus === 'PENDING' ? 'warning.main' : 'error.main',
                          fontWeight: 500
                        }}
                      >
                        {paymentStatus === 'success' ? 'Төлөлт амжилттай' :
                         paymentStatus === 'PENDING' ? 'Төлөлт хүлээгдэж байна' :
                         'Төлөлт амжилтгүй'}
                      </Typography>
                    </Box>
                  )}

                  {/* Check Payment Button */}
                  <Button
                    variant="contained"
                    onClick={handleCheckPayment}
                    disabled={checkingPayment}
                    sx={{
                      mt: 3,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      '&:hover': {
                        background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                      }
                    }}
                  >
                    {checkingPayment ? 'Шалгаж байна...' : 'Төлөлт шалгах'}
                  </Button>
                </Paper>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            onClick={handleClosePaymentDialog}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            Хаах
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataPage; 