// Mock data matching the exact demo videos of Pizza Lab

export const mockCustomers = [
  {
    id: "1",
    name: "Moiz Chouhan",
    phone: "923166511225",
    totalOrders: 12,
    lifetimeSpend: 17470,
    isVip: true,
    favourite: "Cold Drink"
  },
  {
    id: "2",
    name: "Zubair Shah",
    phone: "923009598776",
    totalOrders: 1,
    lifetimeSpend: 1600,
    isVip: false,
    favourite: "Chicken Tikka Pizza"
  },
  {
    id: "3",
    name: "Engr. Muazam",
    phone: "923356444271",
    totalOrders: 1,
    lifetimeSpend: 1050,
    isVip: false,
    favourite: "Behari Tikka"
  },
  {
    id: "4",
    name: "Zainab Bibi",
    phone: "923026870543",
    totalOrders: 1,
    lifetimeSpend: 820,
    isVip: false,
    favourite: "Chicken Sandwich"
  },
  {
    id: "5",
    name: "Ahmad Raza",
    phone: "923198681104",
    totalOrders: 1,
    lifetimeSpend: 600,
    isVip: false,
    favourite: "B.B.Q Tikka"
  },
  {
    id: "6",
    name: "Hamid Hassan",
    phone: "923234435050",
    totalOrders: 1,
    lifetimeSpend: 540,
    isVip: false,
    favourite: "Chicken Fajita"
  },
  {
    id: "7",
    name: "Ali Raza",
    phone: "0123456789",
    totalOrders: 2,
    lifetimeSpend: 350,
    isVip: false,
    favourite: "B.B.Q Tikka"
  },
  {
    id: "8",
    name: "Kamran",
    phone: "923305671168",
    totalOrders: 1,
    lifetimeSpend: 200,
    isVip: false,
    favourite: "BBQ"
  }
]

export const mockRiders = [
  {
    id: "r1",
    name: "Haris Sohail",
    phone: "923164522326",
    status: "AVAILABLE",
    cashInHand: 0,
    currentLat: 30.1575,
    currentLng: 71.5249
  },
  {
    id: "r2",
    name: "Zeeshan Tariq",
    phone: "923009159243",
    status: "AVAILABLE",
    cashInHand: 0,
    currentLat: 30.1985,
    currentLng: 71.4682
  },
  {
    id: "r3",
    name: "Haider Ali",
    phone: "923354622317",
    status: "ON_DELIVERY",
    cashInHand: 350,
    currentLat: 30.2123,
    currentLng: 71.4756
  },
  {
    id: "r4",
    name: "Suleman Kamran",
    phone: "923154342125",
    status: "ON_DELIVERY",
    cashInHand: 600,
    currentLat: 30.1856,
    currentLng: 71.5123
  }
]

export const mockOrders = [
  {
    id: "o1",
    orderNumber: "#PL5770854278944",
    customerName: "Moiz Chouhan",
    customerPhone: "923166511225",
    address: "Gulgasht Colony, Multan",
    items: [{ name: "Arabic Green", size: "Large", qty: 1, price: 550 }],
    total: 550,
    status: "PENDING",
    source: "WHATSAPP",
    createdAt: "2026-09-01T03:15:00",
    shipping: 0
  },
  {
    id: "o2",
    orderNumber: "#PL5716878801216",
    customerName: "Ali Raza",
    customerPhone: "0123456789",
    address: "Gulgasht Colony, Multan",
    items: [{ name: "B.B.Q Tikka", size: "Large", qty: 1, price: 450 }],
    total: 450,
    status: "PENDING",
    source: "VOICE",
    createdAt: "2026-09-01T03:11:00",
    shipping: 0
  },
  {
    id: "o3",
    orderNumber: "#PL521814243889",
    customerName: "Moiz Chouhan",
    customerPhone: "923166511225",
    address: "Gulgasht Colony, Multan",
    items: [{ name: "Chicken Tikka", size: "Regular", qty: 1, price: 450 }],
    total: 450,
    status: "PENDING",
    source: "WHATSAPP",
    createdAt: "2026-09-01T01:41:00",
    shipping: 0
  },
  {
    id: "o4",
    orderNumber: "#ORD-20250902-012",
    customerName: "Zubair Shah",
    customerPhone: "923009598776",
    address: "Bosan Road, Multan",
    items: [{ name: "Chicken Tikka Pizza", size: "Large", qty: 1, price: 1450 }],
    total: 1600,
    status: "OUT_FOR_DELIVERY",
    source: "WHATSAPP",
    createdAt: "2026-09-01T00:24:00",
    shipping: 150,
    riderName: "Suleman Kamran"
  }
]

export const mockMenu = [
  { name: "Chicken Fajita", large: 450, regular: 300, small: 200 },
  { name: "Malai Boti", large: 450, regular: 300, small: 200 },
  { name: "Cheese Lover", large: 450, regular: 300, small: 200 },
  { name: "Green Shawarma Delight", large: 450, regular: 300, small: 200 },
  { name: "Italian Lab", large: 450, regular: 300, small: 200 },
  { name: "Fajita Sensation", large: 450, regular: 300, small: 200 },
  { name: "Behari Tikka", large: 450, regular: 300, small: 200 },
  { name: "Chicken Tikka", large: 450, regular: 300, small: 200 },
  { name: "Chicken Supreme", large: 550, regular: 350, small: 250 },
  { name: "Spicy Italian", large: 550, regular: 350, small: 250 },
  { name: "Arabic Green", large: 550, regular: 350, small: 250 },
  { name: "Yorgi Cheese", large: 550, regular: 350, small: 250 },
  { name: "Cheese Cream", large: 550, regular: 350, small: 250 },
  { name: "B.B.Q Tikka", large: 450, regular: 300, small: 200 }
]

export const dashboardStats = {
  totalRevenue: 0,
  pendingOrders: 3,
  needsAttention: 1,
  activeDeliveries: 0,
  riderUtilization: 0,
  totalOrders: 24,
  kitchenQueue: 19,
  outForDelivery: 5,
  delivered: 0,
  totalRevenueToday: 24080
}
