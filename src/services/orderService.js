import mockOrders from '../mock/orders.json';

// Mock API delay
const mockAPIDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export const getOrders = async () => {
  try {
    await mockAPIDelay();
    return mockOrders;
  } catch (error) {
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
    
    const maxOrderId = Math.max(...mockOrders.map(order => order.orderId));
    const newOrderId = maxOrderId + 1;

    const last6Digits = Math.floor(100000 + Math.random() * 900000).toString();
    const iccid = `898220000000000000${last6Digits}`;

    const newOrder = {
      orderId: newOrderId,
      phoneNumber: orderData.phoneNumber,
      externalOrderId: orderData.externalOrderId,
      iccid,
      last6Digits,
      simType: "physical",
      country: "South Korea",
      status: "pending",
      startDate: new Date().toISOString(),
      endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), 
      createdAt: new Date().toISOString(),
      activatedAt: null,
      user: null
    };

    mockOrders.push(newOrder);

    return newOrder;
  } catch (error) {
    throw new Error('Failed to create order');
  }
};



export const getOrderById = async (orderId) => {
  await mockAPIDelay();
  return mockOrders.find(order => order.orderId === orderId);
};
