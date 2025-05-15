import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Stack, 
  IconButton, 
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  alpha,
  Paper,
  Button,
  Grid,
  Divider
} from '@mui/material';
import { 
  WechatOutlined, 
  PhoneOutlined, 
  FacebookFilled,
  SendOutlined,
  GlobalOutlined,
  MailOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import WeChatQR from '../assets/image/wechat_qr.jpg';
import TelegramQR from '../assets/image/telegram_qr.jpg';

const Footer = () => {
  const [isQRVisible, setIsQRVisible] = useState(false);
  const [isTelegramQRVisible, setIsTelegramQRVisible] = useState(false);
  const theme = useTheme();

  const socialLinks = [
    { 
      icon: <PhoneOutlined />, 
      text: 'Viber', 
      href: 'viber://chat?number=+97699613355',
      color: '#7367f0'
    },
    { 
      icon: <SendOutlined />, 
      text: 'Telegram', 
      onClick: () => setIsTelegramQRVisible(true),
      color: '#0088cc'
    },
    { 
      icon: <WechatOutlined />, 
      text: 'WeChat', 
      onClick: () => setIsQRVisible(true),
      color: '#07c160'
    },
    { 
      icon: <FacebookFilled />, 
      text: 'Facebook', 
      href: 'https://facebook.com/globalsimstore/', 
      external: true,
      color: '#1877f2'
    },
  ];

  return (
    <>
      <Paper 
        elevation={0}
        sx={{ 
          background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
          borderTop: 1,
          borderColor: 'divider',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.4)}, transparent)`
          }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} sx={{ py: 5 }}>
            {/* Logo and Description */}
            {/* <Grid item xs={12} md={4}>
              <Stack spacing={4}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      transition: 'transform 0.2s ease-in-out'
                    }
                  }}
                >
                  <Box 
                    sx={{ 
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <GlobalOutlined style={{ fontSize: 32, color: theme.palette.primary.main }} />
                  </Box>
                  <Typography 
                    variant="h4" 
                    fontWeight={700} 
                    color="primary"
                    sx={{ 
                      letterSpacing: 1,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.7)})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Global SIM
                  </Typography>
                </Box>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{ 
                    maxWidth: 320,
                    lineHeight: 1.8,
                    fontSize: '1.1rem'
                  }}
                >
                  Дэлхийн 200 гаруй улс, бүс нутагт ажиллах олон улсын SIM карт. Таны аялал, бизнес хэрэгцээнд зориулсан хамгийн найдвартай шийдэл.
                </Typography>
              </Stack>
            </Grid> */}

            {/* Contact Info */}
            <Grid item xs={12} md={4}>
              <Stack spacing={4}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 600,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -12,
                      left: 0,
                      width: 48,
                      height: 3,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
                      borderRadius: 1.5
                    }
                  }}
                >
                  Дэмжлэг туслалцаа
                </Typography>
                <Stack spacing={3}>
                  <Stack direction="row" spacing={2.5} alignItems="center">
                    <Box 
                      sx={{ 
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          bgcolor: alpha(theme.palette.primary.main, 0.15)
                        }
                      }}
                    >
                      <PhoneOutlined style={{ fontSize: 18, color: theme.palette.primary.main }} />
                    </Box>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                        Утас
                      </Typography>
                      <Stack spacing={0.5}>
                        <Typography variant="body1" color="text.primary" fontWeight={500} sx={{ fontSize: '0.95rem' }}>
                          +976 75353355
                        </Typography>
                        <Typography variant="body1" color="text.primary" fontWeight={500} sx={{ fontSize: '0.95rem' }}>
                          +976 99613355
                        </Typography>
                        <Typography variant="body1" color="text.primary" fontWeight={500} sx={{ fontSize: '0.95rem' }}>
                          +976 80363355
                        </Typography>
                        <Typography variant="body1" color="text.primary" fontWeight={500} sx={{ fontSize: '0.95rem' }}>
                          +976 85163355
                        </Typography>
                        <Typography variant="body1" color="text.primary" fontWeight={500} sx={{ fontSize: '0.95rem' }}>
                          +976 86413355
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={2.5} alignItems="center">
                    <Box 
                      sx={{ 
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          bgcolor: alpha(theme.palette.primary.main, 0.15)
                        }
                      }}
                    >
                      <MailOutlined style={{ fontSize: 18, color: theme.palette.primary.main }} />
                    </Box>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                        И-мэйл
                      </Typography>
                      <Typography variant="body1" color="text.primary" fontWeight={500} sx={{ fontSize: '0.95rem' }}>
                        info@globalsim.mn
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={2.5} alignItems="center">
                    <Box 
                      sx={{ 
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          bgcolor: alpha(theme.palette.primary.main, 0.15)
                        }
                      }}
                    >
                      <EnvironmentOutlined style={{ fontSize: 18, color: theme.palette.primary.main }} />
                    </Box>
                    <Stack spacing={0.5}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                        Хаяг
                      </Typography>
                      <Typography variant="body1" color="text.primary" fontWeight={500} sx={{ fontSize: '0.95rem' }}>
                        Улаанбаатар хот
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>

            {/* Social Links */}
            <Grid item xs={12} md={4}>
              <Stack spacing={4}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 600,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    position: 'relative',
                    fontSize: '1rem',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -12,
                      left: 0,
                      width: 48,
                      height: 3,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
                      borderRadius: 1.5
                    }
                  }}
                >
                  Сошиал
                </Typography>
                <Stack spacing={2}>
                  {socialLinks.map((link) => (
                    <Button
                      key={link.text}
                      onClick={link.onClick}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      variant="outlined"
                      startIcon={link.icon}
                      fullWidth
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        borderColor: alpha(link.color, 0.2),
                        color: link.color,
                        justifyContent: 'flex-start',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        '&:hover': {
                          borderColor: link.color,
                          backgroundColor: alpha(link.color, 0.08),
                          transform: 'translateX(8px)',
                          transition: 'all 0.3s ease-in-out'
                        }
                      }}
                    >
                      {link.text}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </Grid>
          </Grid>

          {/* Copyright */}
          <Box 
            sx={{ 
              position: 'relative',
              textAlign: 'center',
              mt: 8,
              pt: 4,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40%',
                height: '1px',
                background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.3)}, transparent)`
              }
            }}
          >
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                letterSpacing: 0.5,
                fontWeight: 500,
                fontSize: '0.95rem'
              }}
            >
              © 2025 Global SIM. Бүх эрх хуулиар хамгаалагдсан.
            </Typography>
          </Box>
        </Container>
      </Paper>

      {/* WeChat QR Modal */}
      <Dialog
        open={isQRVisible}
        onClose={() => setIsQRVisible(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            textAlign: 'center', 
            pb: 1,
            background: `linear-gradient(90deg, ${alpha('#07c160', 0.1)}, ${alpha('#07c160', 0.05)})`
          }}
        >
          <Typography variant="h6" fontWeight={600} color="#07c160">
            WeChat QR
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} alignItems="center" sx={{ p: 3 }}>
            <Box 
              sx={{ 
                p: 2,
                background: `linear-gradient(135deg, ${alpha('#07c160', 0.1)}, ${alpha('#07c160', 0.05)})`,
                borderRadius: 3,
                boxShadow: '0 4px 16px rgba(7,193,96,0.1)'
              }}
            >
              <Box
                component="img"
                src={WeChatQR}
                alt="WeChat QR Code"
                sx={{
                  width: 240,
                  height: 240,
                  objectFit: 'contain',
                  borderRadius: 2
                }}
              />
            </Box>
            <Typography variant="body1" color="text.secondary" align="center" fontWeight={500}>
              QR кодыг уншуулан холбогдоно уу
            </Typography>
            <Typography 
              variant="h6" 
              color="#07c160" 
              fontWeight={600}
              sx={{ 
                background: `linear-gradient(90deg, ${alpha('#07c160', 0.1)}, ${alpha('#07c160', 0.05)})`,
                px: 3,
                py: 1,
                borderRadius: 2
              }}
            >
              +976 99613355
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Telegram QR Modal */}
      <Dialog
        open={isTelegramQRVisible}
        onClose={() => setIsTelegramQRVisible(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            textAlign: 'center', 
            pb: 1,
            background: `linear-gradient(90deg, ${alpha('#0088cc', 0.1)}, ${alpha('#0088cc', 0.05)})`
          }}
        >
          <Typography variant="h6" fontWeight={600} color="#0088cc">
            Telegram QR
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} alignItems="center" sx={{ p: 3 }}>
            <Box 
              sx={{ 
                p: 2,
                background: `linear-gradient(135deg, ${alpha('#0088cc', 0.1)}, ${alpha('#0088cc', 0.05)})`,
                borderRadius: 3,
                boxShadow: '0 4px 16px rgba(0,136,204,0.1)'
              }}
            >
              <Box
                component="img"
                src={TelegramQR}
                alt="Telegram QR Code"
                sx={{
                  width: 240,
                  height: 240,
                  objectFit: 'contain',
                  borderRadius: 2
                }}
              />
            </Box>
            <Typography variant="body1" color="text.secondary" align="center" fontWeight={500}>
              QR кодыг уншуулан холбогдоно уу
            </Typography>
            <Typography 
              variant="h6" 
              color="#0088cc" 
              fontWeight={600}
              sx={{ 
                background: `linear-gradient(90deg, ${alpha('#0088cc', 0.1)}, ${alpha('#0088cc', 0.05)})`,
                px: 3,
                py: 1,
                borderRadius: 2
              }}
            >
              +976 99613355
            </Typography>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Footer; 