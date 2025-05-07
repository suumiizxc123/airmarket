import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

// Logo URLs
const airMarketLogoUrl = "https://www.airmarket.mn/assets/images/airmarket_logo.png";
const globalSimLogoUrl = "https://cdn.zochil.shop/4087253b-5388-4a37-b0ac-b57a5172a378_t500.png";

const Logo = ({ variant = 'primary', size = 'medium', showText = false, showBothLogos = true }) => {
  // Size configurations
  const sizes = {
    small: { width: 40, height: 40, fontSize: '1rem' },
    medium: { width: 50, height: 50, fontSize: '1.25rem' },
    large: { width: 60, height: 60, fontSize: '1.5rem' }
  };
  
  // Variant configurations
  const variants = {
    primary: { color: '#dc004e', textColor: '#333' },
    light: { color: '#fff', textColor: '#fff' },
    dark: { color: '#333', textColor: '#333' }
  };
  
  const currentSize = sizes[size];
  const currentVariant = variants[variant];
  
  return (
    <Link to="/" style={{ textDecoration: 'none' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        {/* AirMarket Logo */}
        <Box
          component="img"
          src={airMarketLogoUrl}
          alt="AirMarket Logo"
          sx={{
            width: currentSize.width * 1.8,
            height: 'auto',
            objectFit: 'contain',
            opacity: 1,
          }}
        />
        
        {showBothLogos && (
          <>
            {/* Divider */}
            <Box
              sx={{
                height: currentSize.height * 0.8,
                width: '1px',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                mx: 1,
              }}
            />
            
            {/* GlobalSIM Logo */}
            <Box
              component="img"
              src={globalSimLogoUrl}
              alt="GlobalSIM Logo"
              sx={{
                width: currentSize.width * 1.2,
                height: 'auto',
                objectFit: 'contain',
                opacity: 1,
              }}
            />
          </>
        )}
        
        {showText && (
          <Typography
            variant="h6"
            sx={{
              ml: 1,
              fontWeight: 700,
              color: currentVariant.textColor,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -2,
                left: 0,
                width: 0,
                height: 2,
                backgroundColor: '#dc004e',
                transition: 'width 0.3s ease'
              },
              '&:hover::after': {
                width: '100%'
              }
            }}
          >
            Partners
          </Typography>
        )}
      </Box>
    </Link>
  );
};

export default Logo; 