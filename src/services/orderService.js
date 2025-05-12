import axios from 'axios';
import { addDays } from 'date-fns';
import { getUser } from './authService';

// API URL from environment variable
const API_URL = 'https://esimbackend-78d0b12a97f7.herokuapp.com';

// Transform API response to match our application's data structure
const transformOrderData = (apiOrder) => {
  const startDate = new Date(apiOrder.travel_start_date);
  const endDate = addDays(startDate, 7);

  return {
    orderId: apiOrder.orderid,
    phoneNumber: apiOrder.phone_number,
    iccid: apiOrder.iccid,
    last6Digits: apiOrder.iccid?.slice(-6),
    status: apiOrder.refund_status === 'disabled' ? 'active' : 'cancelled',
    country: apiOrder.skuid,
    createdAt: apiOrder.snapshot_date,
    activatedAt: apiOrder.beginDate,
    dataGB: apiOrder.packageInfo?.replace('GB', ''),
    duration: apiOrder.daypassDays,
    startDate: apiOrder.travel_start_date,
    endDate: endDate.toISOString().split('T')[0],
    soldPrice: apiOrder.price,
    orderType: apiOrder.order_type,
    user: { name: apiOrder.createdBy }
  };
};

export const getOrders = async () => {
  try {
    const userData = getUser();
    if (!userData?.pareto) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/api/user/page/get-order-list-air-market-gift?createdBy=AIR_MARKET_GIFT`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': userData.pareto
      },
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Oops, we haven't got JSON!");
    }

    const data = await response.json();
    if (!data || !data.data) {
      throw new Error('Invalid response format');
    }

    return data.data.map(transformOrderData);
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
};

export const activateSIM = async (last6Digits) => {
  try {
    const userData = getUser();
    if (!userData?.pareto) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/api/user/activate-sim`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': userData.pareto
      },
      body: JSON.stringify({ last6Digits }),
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return transformOrderData(data);
  } catch (error) {
    console.error('Error activating SIM:', error);
    throw new Error('Failed to activate SIM');
  }
};

export const createOrder = async (orderData) => {
  try {
    const ICCID_PREFIX = '898520302103';
    const today = new Date().toISOString().split('T')[0];

    const response = await fetch('https://esimbackend-78d0b12a97f7.herokuapp.com/api/user/page/add-physicial-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/11.1.0'
      },
      body: JSON.stringify({
        country: '16',
        packageid: '10997',
        description: 'AIRMARKET GIFT 3GB 7DAYS',
        user_email: 'AIR_MARKET_GIFT',
        renewal_type: '0',
        phone_number: '00000000',
        travel_start_date: today,
        travel_day: '4-7',
        new_price: '0',
        iccid: `${ICCID_PREFIX}${orderData.last6Digits}`,
        dpid: '21',
        saleschannel: 'AIRMARKET'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return transformOrderData(data);
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
};

export const bulkImportSims = async (simCards) => {
  try {
    // const response = await api.post('/api/user/bulk-import-sims', { simCards });
    // return response.data.map(transformOrderData);
  } catch (error) {
    console.error('Error importing SIM cards:', error);
    throw new Error('Failed to import SIM cards');
  }
};

export const getOrderById = async (orderId) => {
  try {
    // const response = await api.get(`/api/user/order/${orderId}`);
    // return transformOrderData(response.data);
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error('Failed to fetch order');
  }
};
