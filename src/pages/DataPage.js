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

// Import images
// import iphone_manual_1_2 from '../images/iphone_manual_1_2.jpg';
// import iphone_manual_3_4 from '../images/iphone_manual_3_4.jpg';
// import iphone_manual_5_6 from '../images/iphone_manual_5_6.jpg';
import guide1 from '../images/guide1.jpeg';
import guide2 from '../images/guide2.jpeg';
import huawei_guide from '../images/huawei_guide.png';
import iphone_guide from '../images/iphone_guide.png';
import redmi_guide from '../images/redmi_guide.png';
import samsung_guide from '../images/samsung_guide.png';

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
      image: samsung_guide,
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

  const handleCreateOrder = async (plan) => {
    try {
      setCreatingOrder(true);
      setError(null);
      
      const response = await fetch('https://clientsvc.globalsim.mn/api/user/page/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          simorderid: "",
          pricerowid: plan.rowid,
          prevordernum: orderId,
          phonenumber: "00000000",
          ispreorder: "false"
        })
      });

      if (!response.ok) throw new Error('Failed to create order');
      
      const result = await response.json();
      setPaymentData(result);
      setPaymentDialog(true);
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to create order. Please try again.');
    } finally {
      setCreatingOrder(false);
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
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            color: theme.palette.primary.main,
            fontWeight: 700,
            textAlign: 'center',
            mb: 4,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            letterSpacing: '-0.5px'
          }}
        >
          СИМ Картын мэдээлэл
        </Typography>

        <Stack spacing={4}>
          {/* Basic Information */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              borderRadius: 4,
              background: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.1)
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 2, 
                bgcolor: alpha(theme.palette.primary.main, 0.1) 
              }}>
                <SimCardIcon color="primary" sx={{ fontSize: 28 }} />
              </Box>
              <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                Үндсэн мэдээлэл
              </Typography>
            </Stack>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: alpha(theme.palette.primary.main, 0.1) 
                  }}>
                    <SimCardIcon color="primary" fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                      ICCID
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {data.iccid}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: alpha(theme.palette.primary.main, 0.1) 
                  }}>
                    <PublicIcon color="primary" fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Улс
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {country}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ 
                    p: 1, 
                    borderRadius: 2, 
                    bgcolor: alpha(theme.palette.primary.main, 0.1) 
                  }}>
                    <CalendarIcon color="primary" fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Аялах өдөр
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {data.travelday}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>

          {/* Data Usage */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              borderRadius: 4,
              background: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.1)
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 2, 
                bgcolor: alpha(theme.palette.primary.main, 0.1) 
              }}>
                <DataUsageIcon color="primary" sx={{ fontSize: 28 }} />
              </Box>
              <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                Дата ашиглалт
              </Typography>
            </Stack>
            <Divider sx={{ mb: 3 }} />
            <Stack spacing={2}>
              <Box>
                <Stack direction="row" alignItems="center" spacing={3}>
                  <Box sx={{ width: '100%', maxWidth: 300 }}>
                    <Box
                      sx={{
                        height: 16,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        borderRadius: 8,
                        overflow: 'hidden',
                        mb: 1,
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
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
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, minWidth: 120 }}>
                    {data.usedgb}GB / {data.allgb}GB
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, ml: 1 }}>
                  {((data.usedgb / data.allgb) * 100).toFixed(1)}% ашиглагдсан
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Available Plans */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              borderRadius: 4,
              background: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.1)
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 2, 
                bgcolor: alpha(theme.palette.primary.main, 0.1) 
              }}>
                <ShoppingCartIcon color="primary" sx={{ fontSize: 28 }} />
              </Box>
              <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                Дата багцууд
              </Typography>
            </Stack>
            <Divider sx={{ mb: 3 }} />
            
            {/* Duration Tabs */}
            <Box sx={{ 
              borderBottom: 1, 
              borderColor: 'divider', 
              mb: 4,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                minWidth: 120,
                fontSize: '1rem'
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
            <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
              {currentPlans.map((plan) => (
                <Grid item xs={6} sm={6} md={4} key={plan.rowid}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: { xs: 1.5, sm: 2, md: 3 },
                      height: '100%',
                      border: '1px solid',
                      borderColor: alpha(theme.palette.primary.main, 0.1),
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: theme.palette.primary.main,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                      }
                    }}
                  >
                    <Stack spacing={{ xs: 1, sm: 1.5, md: 2 }} sx={{ flex: 1 }}>
                      <Typography 
                        variant="h4" 
                        color="primary" 
                        sx={{ 
                          fontWeight: 700,
                          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
                        }}
                      >
                        {formatPrice(plan.price)}
                      </Typography>
                      <Typography 
                        variant="h5" 
                        fontWeight="bold" 
                        sx={{ 
                          color: theme.palette.primary.main,
                          fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
                        }}
                      >
                        {plan.datagb}GB
                      </Typography>
                      <Typography 
                        variant="body1" 
                        color="text.secondary"
                        sx={{ 
                          fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                        }}
                      >
                        {plan.duration.replace('days', '')}
                      </Typography>
                      <Chip 
                        label={plan.countryname}
                        size="small"
                        sx={{ 
                          alignSelf: 'flex-start',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          fontWeight: 500,
                          fontSize: { xs: '0.625rem', sm: '0.75rem', md: '0.875rem' },
                          height: { xs: 20, sm: 24, md: 28 },
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.2),
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleCreateOrder(plan)}
                        disabled={creatingOrder}
                        startIcon={<ShoppingCartIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }} />}
                        sx={{
                          mt: 'auto',
                          py: { xs: 0.75, sm: 1, md: 1.5 },
                          px: { xs: 1, sm: 1.5, md: 2 },
                          borderRadius: 2,
                          textTransform: 'none',
                          fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                          fontWeight: 600,
                          minHeight: { xs: 32, sm: 36, md: 40 },
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
              p: 4,
              borderRadius: 4,
              background: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.1)
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 2, 
                bgcolor: alpha(theme.palette.primary.main, 0.1) 
              }}>
                <QrCodeIcon color="primary" sx={{ fontSize: 28 }} />
              </Box>
              <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                Биет сим идэвхжүүлэх заавар
              </Typography>
            </Stack>
            <Divider sx={{ mb: 3 }} />

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
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                  <Tabs 
                    value={selectedPhone} 
                    onChange={(e, newValue) => setSelectedPhone(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      '& .MuiTabs-indicator': {
                        height: 3,
                        borderRadius: 3
                      }
                    }}
                  >
                    <Tab 
                      label="Samsung 2 симтэй" 
                      value="samsung-dual"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '1rem'
                      }}
                    />
                    <Tab 
                      label="Samsung 1 симтэй" 
                      value="samsung-single"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '1rem'
                      }}
                    />
                    <Tab 
                      label="iPhone" 
                      value="iphone"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '1rem'
                      }}
                    />
                    <Tab 
                      label="Huawei" 
                      value="huawei"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '1rem'
                      }}
                    />
                    <Tab 
                      label="Redmi" 
                      value="redmi"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '1rem'
                      }}
                    />
                  </Tabs>
                </Box>

                {/* Content Grid */}
                <Grid container spacing={3}>
                  {/* Image */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ 
                      position: 'relative', 
                      width: '100%', 
                      height: 300,
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
                          mb: 2 
                        }}
                      >
                        {guideContent[selectedPhone].title}
                      </Typography>
                      <List sx={{ pl: 2 }}>
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
                                fontWeight: 500
                              }}
                            >
                              {index + 1}.
                            </Typography>
                            <Typography component="span">
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
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                    QR кодоор төлөх
                  </Typography>
                  <Box
                    component="img"
                    src={`data:image/png;base64,${paymentData.qr_image}`}
                    alt="Payment QR Code"
                    sx={{ 
                      maxWidth: 240,
                      width: '100%',
                      borderRadius: 2,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                    }}
                  />
                </Paper>
              )}

              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  textAlign: 'center',
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderRadius: 3
                }}
              >
                <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                  {formatPrice(paymentData.amount)}
                </Typography>
              </Paper>

              {paymentData.urls?.map((url, index) => (
                <Paper 
                  key={index}
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
                  onClick={() => handleOpenQPayWallet(url.link)}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      component="img"
                      src={url.logo}
                      alt={url.name}
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {url.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {url.description}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
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