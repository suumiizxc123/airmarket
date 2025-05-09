import React, { useMemo, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Grid
} from '@mui/material';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Edit as EditIcon, Info as InfoIcon } from '@mui/icons-material';

const OrderList = React.memo(({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Format date for display
  const formatDate = useMemo(() => (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  }, []);

  // Get status chip color
  const getStatusColor = useMemo(() => (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'activated':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  }, []);

  // Format price with currency
  const formatPrice = useMemo(() => (price) => {
    if (price === undefined || price === null) return 'N/A';
    return new Intl.NumberFormat('mn-MN', { 
      style: 'currency', 
      currency: 'MNT',
      maximumFractionDigits: 0
    }).format(price);
  }, []);

  const handleOrderClick = (orderId) => {
    // Use the current window location to construct the URL
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}/#/data/${orderId}`;
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`https://clientsvc.globalsim.mn/api/user/page/price-by-orderid?order_id=${orderId}`);
      if (!response.ok) throw new Error('Failed to fetch order details');
      const data = await response.json();
      
      // Transform the API response data
      const orderData = {
        iccid: data.data.iccid,
        orderId: data.data.orderid,
        skuid: data.data.skuid,
        travelday: data.data.travelday,
        country: data.data.disp,
        phoneNumber: data.data.phonenumber,
        usedgb: data.data.usedgb,
        allgb: data.data.allgb,
        priceinfo: data.data.priceinfo,
        lpcode: data.data.lpcode
      };
      
      setOrderDetails(orderData);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to fetch order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
    setOrderDetails(null);
    setError(null);
  };

  // Transform the data to match the table structure
  const tableData = useMemo(() => orders.map(order => ({
    orderId: order.orderId,
    phoneNumber: order.phoneNumber,
    iccid: order.iccid,
    last6Digits: order.last6Digits,
    status: order.status,
    country: order.country,
    createdAt: order.createdAt,
    activatedAt: order.activatedAt,
    dataGB: order.dataGB,
    duration: order.duration,
    startDate: order.startDate,
    endDate: order.endDate,
    soldPrice: order.soldPrice,
    orderType: order.orderType,
    user: order.user || {},
    usedgb: order.usedgb,
    allgb: order.allgb
  })), [orders]);

  const columns = useMemo(() => [
    {
      header: 'Order ID',
      accessorKey: 'orderId',
      cell: ({ row }) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Button
            onClick={() => handleOrderClick(row.original.orderId)}
            sx={{ 
              textTransform: 'none',
              fontWeight: 'bold',
              color: 'primary.main',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            {row.original.orderId}
          </Button>
          <Tooltip title="Edit Order">
            <IconButton size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
    // {
    //   header: 'Phone Number',
    //   accessorKey: 'phoneNumber',
    //   cell: ({ row }) => (
    //     <Typography variant="body2" color="primary">
    //       {row.original.phoneNumber}
    //     </Typography>
    //   ),
    // },
    {
      header: 'Full SIM Number',
      accessorKey: 'iccid',
      cell: ({ row }) => {
        const last6Digits = row.original.last6Digits;
        const fullNumber = `${row.original.iccid.slice(0, -6)}${last6Digits}`;
        return (
          <Box>
            <Typography variant="body2">
              {fullNumber}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Prefix: {row.original.iccid.slice(0, -6)} | Last 6: {last6Digits}
            </Typography>
          </Box>
        );
      },
    },
    {
      header: 'Country',
      accessorKey: 'country',
      cell: ({ row }) => (
        <Typography variant="body2">
          {row.original.country || 'South Korea'}
        </Typography>
      ),
    },
    {
      header: 'Data GB',
      accessorKey: 'dataGB',
      cell: ({ row }) => (
        <Typography variant="body2">
          {row.original.dataGB}GB
        </Typography>
      ),
    },
    {
      header: 'Duration',
      accessorKey: 'duration',
      cell: ({ row }) => {
        return (
          <Typography variant="body2">
            {row.original.duration} days
          </Typography>
        );
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <Chip
          label={row.original.status}
          color={getStatusColor(row.original.status)}
          size="small"
          sx={{ fontSize: '0.75rem' }}
        />
      ),
    },
    {
      header: 'Order Type',
      accessorKey: 'orderType',
      cell: ({ row }) => (
        <Chip
          label={row.original.orderType}
          color={row.original.orderType === 'new' ? 'success' : row.original.orderType === 'gift' ? 'success' : row.original.orderType === 'renewal' ? 'warning' : 'primary'}
          size="small"
          sx={{ 
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}
        />
      ),
    },

    {
      header: 'Sold Price',
      accessorKey: 'soldPrice',
      cell: ({ row }) => (
        <Typography variant="body2">
          {formatPrice(row.original.soldPrice)}
        </Typography>
      ),
    },
    {
      header: 'Created By',
      accessorKey: 'user.name',
      cell: ({ row }) => (
        <Typography variant="body2">
          {row.original.user?.name || 'Bayarkhuu'}
        </Typography>
      ),
    },
    {
      header: 'Start Date',
      accessorKey: 'startDate',
      cell: ({ row }) => (
        <Typography variant="body2">
          {formatDate(row.original.startDate)}
        </Typography>
      ),
    },
    {
      header: 'End Date',
      accessorKey: 'endDate',
      cell: ({ row }) => (
        <Typography variant="body2">
          {formatDate(row.original.endDate)}
        </Typography>
      ),    
    },
    {
      header: 'Data Usage',
      accessorKey: 'dataUsage',
      cell: ({ row }) => {
        const usedGB = row.original.usedgb || 0;
        const allGB = row.original.allgb || 0;
        const percentage = allGB > 0 ? (usedGB / allGB) * 100 : 0;
        
        return (
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box sx={{ width: '100%', maxWidth: 100 }}>
                <Box
                  sx={{
                    height: 8,
                    backgroundColor: 'grey.200',
                    borderRadius: 4,
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${percentage}%`,
                      backgroundColor: percentage > 80 ? 'error.main' : 'success.main',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </Box>
              </Box>
              <Typography variant="body2" sx={{ minWidth: 80 }}>
                {usedGB}GB / {allGB}GB
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {percentage.toFixed(1)}% used
            </Typography>
          </Box>
        );
      }
    },
  ], [formatDate, formatPrice, getStatusColor]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Update the dialog content section
  const renderOrderDetails = (details) => (
    <Box sx={{ mt: 2 }}>
      <Stack spacing={3}>
        {/* Basic Information */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Basic Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">ICCID</Typography>
              <Typography variant="body1">{details.iccid}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Order ID</Typography>
              <Typography variant="body1">{details.orderId}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Phone Number</Typography>
              <Typography variant="body1">{details.phoneNumber}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Country</Typography>
              <Typography variant="body1">{details.country}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">SKU ID</Typography>
              <Typography variant="body1">{details.skuid}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">Travel Day</Typography>
              <Typography variant="body1">{details.travelday}</Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Data Usage */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Data Usage
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ width: '100%', maxWidth: 200 }}>
                  <Box
                    sx={{
                      height: 12,
                      backgroundColor: 'grey.200',
                      borderRadius: 6,
                      overflow: 'hidden',
                      mb: 1
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${(details.usedgb / details.allgb) * 100}%`,
                        backgroundColor: details.usedgb / details.allgb > 0.8 ? 'error.main' : 'success.main',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </Box>
                </Box>
                <Typography variant="h6">
                  {details.usedgb}GB / {details.allgb}GB
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {((details.usedgb / details.allgb) * 100).toFixed(1)}% used
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Available Plans */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Available Plans
          </Typography>
          <Grid container spacing={2}>
            {details.priceinfo?.map((plan) => (
              <Grid item xs={12} sm={6} md={4} key={plan.rowid}>
                <Paper 
                  sx={{ 
                    p: 2,
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: 1
                    }
                  }}
                >
                  <Stack spacing={1}>
                    <Typography variant="h6" color="primary">
                      {formatPrice(plan.price)}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {plan.datagb}GB
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {plan.duration}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {plan.countryname}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* LP Code */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            LP Code
          </Typography>
          <Typography variant="body2" sx={{ 
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            bgcolor: 'grey.100',
            p: 1,
            borderRadius: 1
          }}>
            {details.lpcode}
          </Typography>
        </Paper>
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Orders List
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell 
                    key={header.column.id}
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      backgroundColor: 'background.default',
                      borderBottom: 1,
                      borderColor: 'divider'
                    }}
                  >
                    {header.column.columnDef.header}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow 
                key={row.id}
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'action.hover' 
                  }
                }}
              >
                {row.getVisibleCells().map(cell => {
                  const column = cell.column.columnDef;
                  if (column.cell) {
                    return <TableCell key={cell.id} sx={{ p: 2 }}>{column.cell({ row })}</TableCell>;
                  }
                  return <TableCell key={cell.id} sx={{ p: 2 }}>{cell.getValue()}</TableCell>;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Order Details Dialog */}
      <Dialog 
        open={!!selectedOrder} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Order Details
          {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
        </DialogTitle>
        <DialogContent>
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : orderDetails ? (
            renderOrderDetails(orderDetails)
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

OrderList.displayName = 'OrderList';

export default OrderList;
