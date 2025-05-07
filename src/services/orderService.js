import mockOrders from '../mock/orders.json';
// We'll keep axios for future use but add a comment to explain
// import axios from 'axios'; // Uncomment when API is ready
import { getToken } from './authService';

// API URL from environment variable - will be used when API is ready
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Mock API delay
const mockAPIDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Configure axios with auth token - will be used when API is ready
// const getAuthHeader = () => {
//   const token = getToken();
//   return {
//     headers: {
//       Authorization: token ? `Bearer ${token}` : '',
//     },
//   };
// };

// Default values for SIM card activation
const DEFAULT_VALUES = {
  country: 'South Korea',
  soldPrice: 10000,
  createdBy: 'Bayarkhuu',
  orderType: 'gift',
  dataGB: 3,
  duration: 7 // days
};

// Generate a random ICCID
const generateIccid = () => {
  const prefix = '8999';
  const randomDigits = Math.floor(Math.random() * 10000000000000).toString().padStart(14, '0');
  return prefix + randomDigits;
};

// Generate dates for validity period
const generateValidityPeriod = (durationDays = 7) => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + durationDays);
  
  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  };
};

// Get the next order ID
const getNextOrderId = () => {
  return Math.max(...mockOrders.map(order => order.orderId), 0) + 1;
};

export const getOrders = async () => {
  try {
    await mockAPIDelay();
    return mockOrders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

export const activateSIM = async (last6Digits) => {
  try {
    await mockAPIDelay();
    
    const order = mockOrders.find(o => o.last6Digits === last6Digits);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === 'activated') {
      throw new Error('SIM is already activated');
    }

    const activatedOrder = {
      ...order,
      status: 'activated',
      activatedAt: new Date().toISOString(),
      user: {
        userId: 'air001',
        name: 'Bayarkhuu'
      }
    };

    const index = mockOrders.indexOf(order);
    mockOrders[index] = activatedOrder;

    return activatedOrder;
  } catch (error) {
    throw new Error('Failed to activate SIM');
  }
};

export const createOrder = async (orderData) => {
  try {
    await mockAPIDelay();
    
    // Generate a new order ID
    const newOrderId = getNextOrderId();
    
    // Generate ICCID if needed
    const iccid = generateIccid();
    const last6Digits = orderData.last6Digits || iccid.slice(-6);
    
    // Generate validity period
    const { startDate, endDate } = generateValidityPeriod(DEFAULT_VALUES.duration);
    
    // Create new order object
    const newOrder = {
      orderId: newOrderId,
      phoneNumber: orderData.phoneNumber || "88001234",
      externalOrderId: orderData.externalOrderId || "",
      iccid,
      last6Digits,
      status: 'activated',
      createdAt: new Date().toISOString(),
      activatedAt: null,
      country: DEFAULT_VALUES.country,
      soldPrice: DEFAULT_VALUES.soldPrice,
      createdBy: DEFAULT_VALUES.createdBy,
      orderType: DEFAULT_VALUES.orderType,
      dataGB: DEFAULT_VALUES.dataGB,
      duration: DEFAULT_VALUES.duration,
      startDate,
      endDate,
      user: null
    };

    mockOrders.push(newOrder);

    return newOrder;
  } catch (error) {
    throw new Error('Failed to create order');
  }
};

export const bulkImportSims = async (simCards) => {
  try {
    await mockAPIDelay(2000); // Longer delay for bulk operations
    
    if (!Array.isArray(simCards) || simCards.length === 0) {
      throw new Error('No valid SIM cards provided');
    }
    
    // Create new orders for each SIM card
    let nextOrderId = getNextOrderId();
    const newOrders = simCards.map(card => {
      const iccid = generateIccid();
      const last6Digits = card.last6Digits || iccid.slice(-6);
      const { startDate, endDate } = generateValidityPeriod(DEFAULT_VALUES.duration);
      
      return {
        orderId: nextOrderId++,
        phoneNumber: card.phoneNumber || "88001234",
        externalOrderId: card.externalOrderId || "",
        iccid,
        last6Digits,
        status: 'active',
        createdAt: new Date().toISOString(),
        activatedAt: null,
        country: DEFAULT_VALUES.country,
        soldPrice: DEFAULT_VALUES.soldPrice,
        createdBy: DEFAULT_VALUES.createdBy,
        orderType: DEFAULT_VALUES.orderType,
        dataGB: DEFAULT_VALUES.dataGB,
        duration: DEFAULT_VALUES.duration,
        startDate,
        endDate,
        user: null
      };
    });
    
    // Add all new orders to the mock database
    mockOrders.push(...newOrders);
    
    return newOrders;
  } catch (error) {
    console.error('Error importing SIM cards:', error);
    throw new Error('Failed to import SIM cards');
  }
};

export const getOrderById = async (orderId) => {
  try {
    await mockAPIDelay();
    return mockOrders.find(order => order.orderId === parseInt(orderId));
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error('Failed to fetch order');
  }
};
