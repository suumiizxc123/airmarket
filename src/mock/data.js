export const mockUsers = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  },
  {
    username: 'operator',
    password: 'operator123',
    name: 'Operator User',
    role: 'operator'
  }
];

export const mockOrders = [
  {
    orderId: 29036,
    phoneNumber: "88001234",
    externalOrderId: "EP1ASXAXDAD",
    iccid: "1231239192XXX123123",
    last6Digits: "123456",
    simType: "physical",
    country: "South Korea",
    status: "activated",
    startDate: "2025-05-06T05:30:00Z",
    endDate: "2025-05-13T05:30:00Z",
    createdAt: "2025-05-06T05:30:00Z",
    activatedAt: "2025-05-06T05:35:00Z",
    user: {
      userId: "air001",
      name: "Bayarkhuu"
    }
  },
  {
    orderId: 29037,
    phoneNumber: "88001235",
    externalOrderId: "EP1ASXAXDAD2",
    iccid: "1231239192XXX123124",
    last6Digits: "123457",
    simType: "physical",
    country: "South Korea",
    status: "pending",
    startDate: "2025-05-07T05:30:00Z",
    endDate: "2025-05-14T05:30:00Z",
    createdAt: "2025-05-07T05:30:00Z",
    activatedAt: null,
    user: null
  }
];
