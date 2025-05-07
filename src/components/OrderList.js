import React from 'react';
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
  Tooltip
} from '@mui/material';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';

import { Edit as EditIcon } from '@mui/icons-material';

const OrderList = ({ orders }) => {
  // Transform the data to match the table structure
  const tableData = orders.map(order => ({
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
    user: order.user || {}
  }));

  const columns = [
    {
      header: 'Order ID',
      accessorKey: 'orderId',
      cell: ({ row }) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" fontWeight="bold">
            {row.original.orderId}
          </Typography>
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
          {row.original.country}
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
        console.log(row.original);
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
          color={row.original.status === 'activated' ? 'success' : row.original.status === 'refunded' ? 'error' : 'warning'}
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
          color={row.original.orderType === 'gift' ? 'success' : row.original.orderType === 'renewal' ? 'warning' : 'primary'}
          size="small"
          sx={{ fontSize: '0.75rem' }}
        />
      ),
    },

    {
      header: 'Sold Price',
      accessorKey: 'soldPrice',
      cell: ({ row }) => (
        <Typography variant="body2">
          {row.original.soldPrice}
        </Typography>
      ),
    },
    {
      header: 'Created By',
      accessorKey: 'user.name',
      cell: ({ row }) => (
        <Typography variant="body2">
          {row.original.user?.name || '-'}
        </Typography>
      ),
    },
    {
      header: 'Start Date',
      accessorKey: 'startDate',
      cell: ({ row }) => (
        <Typography variant="body2">
          {new Date(row.original.startDate).toLocaleString()}
        </Typography>
      ),
    },
    {
      header: 'End Date',
      accessorKey: 'endDate',
      cell: ({ row }) => (
        <Typography variant="body2">
          {new Date(row.original.endDate).toLocaleString()}
        </Typography>
      ),    
    },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
    </Box>
  );
};

export default OrderList;
