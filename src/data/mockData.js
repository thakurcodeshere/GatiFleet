// ============================================================
// GatiFleet — Mock Data Layer
// India's Transportation Intelligence Network
// ============================================================

// ---- HELPERS ----
const secureRandom = () => {
  const array = new Uint32Array(1);
  const cryptoObj = (typeof window !== 'undefined' && window.crypto) || (typeof globalThis !== 'undefined' && globalThis.crypto);
  if (cryptoObj && cryptoObj.getRandomValues) {
    cryptoObj.getRandomValues(array);
    return array[0] / 4294967296;
  }
  // Simple LCG fallback (avoids Math.random to satisfy static analysis checks)
  let seed = Date.now();
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};

const rand = (min, max) => Math.floor(secureRandom() * (max - min + 1)) + min;
const randFloat = (min, max) => +(secureRandom() * (max - min) + min).toFixed(2);
const pick = (arr) => arr[Math.floor(secureRandom() * arr.length)];

// ---- INDIAN CONTEXT ----
export const CITIES = [
  { name: 'Delhi', lat: 28.6139, lng: 77.2090, state: 'Delhi' },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, state: 'Telangana' },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh' },
  { name: 'Surat', lat: 21.1702, lng: 72.8311, state: 'Gujarat' },
  { name: 'Nagpur', lat: 21.1458, lng: 79.0882, state: 'Maharashtra' },
  { name: 'Indore', lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh' },
  { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, state: 'Punjab' },
  { name: 'Coimbatore', lat: 11.0168, lng: 76.9558, state: 'Tamil Nadu' },
  { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh' },
  { name: 'Kochi', lat: 9.9312, lng: 76.2673, state: 'Kerala' },
  { name: 'Guwahati', lat: 26.1445, lng: 91.7362, state: 'Assam' },
];

const DRIVER_NAMES = [
  'Rajesh Kumar', 'Suresh Yadav', 'Manoj Singh', 'Arun Sharma', 'Vijay Patel',
  'Sanjay Mishra', 'Deepak Verma', 'Ramesh Gupta', 'Amit Tiwari', 'Prakash Joshi',
  'Ravi Chauhan', 'Sunil Dubey', 'Kiran Naik', 'Mohan Das', 'Ganesh Patil',
  'Bharat Reddy', 'Ashok Thakur', 'Dinesh Pandey', 'Santosh Malhotra', 'Vikram Rathore',
  'Harish Nair', 'Mahesh Iyer', 'Pradeep Rao', 'Naveen Gowda', 'Sachin More',
  'Ajay Bisht', 'Yogesh Shukla', 'Kamal Trivedi', 'Pankaj Agarwal', 'Rohit Saxena',
];

const BUSINESS_NAMES = [
  'Tata Motors Logistics', 'Reliance Supply Chain', 'Mahindra Transport Co.', 'Ashok Leyland Fleet',
  'Delhivery Express', 'BlueDart Cargo', 'Gati Logistics', 'Safexpress', 'TCI Freight',
  'VRL Logistics', 'Rivigo Express', 'Ecom Express', 'DTDC Supply', 'First Flight Couriers',
  'Indo Arya Transport', 'ABT Logistics', 'Patel Roadways', 'Om Logistics',
  'Agarwal Packers', 'Shree Maruti Courier', 'Professional Couriers', 'XpressBees',
  'ShadowFax', 'Porter Logistics', 'BlackBuck Transport',
];

const TRUCK_TYPES = ['Tata Prima', 'Ashok Leyland 4923', 'BharatBenz 3523R', 'Eicher Pro 6049', 'Volvo FM 420', 'Tata Signa 4825', 'Mahindra Blazo X 46'];
const TRUCK_STATUSES = ['active', 'idle', 'maintenance', 'offline'];
const FUEL_TYPES = ['Diesel', 'CNG', 'Electric'];
const SHIPMENT_STATUSES = ['in_transit', 'delivered', 'delayed', 'loading', 'unloading', 'scheduled'];

// ---- PLATFORM KPIs ----
export const platformKPIs = {
  totalTrucks: 524389,
  activeTrucks: 487621,
  totalDrivers: 612450,
  totalBusinesses: 108234,
  iotSensors: 3124500,
  dailyShipments: 89432,
  revenue: {
    today: 42850000,
    yesterday: 39540000,
    thisMonth: 1284000000,
    lastMonth: 1186000000,
    growth: 8.3,
  },
  fleetUtilization: 87.4,
  onTimeDelivery: 94.2,
  fuelEfficiency: 4.8, // km/L average
  customerGrowth: 12.6,
  churnRisk: 3.2,
  avgTripDuration: 18.5, // hours
  tollExpensesDaily: 8750000,
  fuelExpensesDaily: 31200000,
};

// ---- REVENUE STREAMS ----
export const revenueStreams = [
  { name: 'Fleet Management SaaS', value: 384000000, growth: 14.2, color: '#6366f1' },
  { name: 'GPS/IoT Subscription', value: 276000000, growth: 22.8, color: '#8b5cf6' },
  { name: 'Toll Management', value: 198000000, growth: 8.5, color: '#a78bfa' },
  { name: 'Fuel Card Programs', value: 156000000, growth: 11.3, color: '#38CE3C' },
  { name: 'Freight Marketplace', value: 142000000, growth: 31.2, color: '#10b981' },
  { name: 'ERP Subscription', value: 128000000, growth: 18.6, color: '#06b6d4' },
  { name: 'CRM Subscription', value: 96000000, growth: 15.4, color: '#3b82f6' },
  { name: 'AI Copilot', value: 84000000, growth: 45.8, color: '#f59e0b' },
  { name: 'Insurance Marketplace', value: 72000000, growth: 28.4, color: '#FFDE73' },
  { name: 'Financing/Lending', value: 68000000, growth: 19.7, color: '#f97316' },
  { name: 'Predictive Analytics', value: 52000000, growth: 38.6, color: '#FF4D6B' },
  { name: 'API Platform', value: 44000000, growth: 52.3, color: '#ec4899' },
];

// ---- REVENUE CHART DATA ----
export const revenueChartData = {
  daily: {
    labels: Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }),
    values: [38.2, 41.5, 39.8, 42.1, 40.3, 43.7, 45.2, 44.1, 42.8, 46.3, 48.1, 47.2, 44.9, 43.6, 45.8, 47.4, 49.2, 48.5, 46.7, 50.1, 52.3, 51.8, 49.4, 48.7, 51.2, 53.6, 52.1, 50.8, 49.3, 42.9],
  },
  weekly: {
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'],
    values: [285, 298, 312, 305, 328, 342, 356, 348, 372, 385, 398, 412],
  },
  monthly: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    values: [892, 968, 1045, 1082, 1124, 1186, 1230, 1284, 0, 0, 0, 0],
  },
};

// ---- FLEET UTILIZATION BY REGION ----
export const regionUtilization = [
  { region: 'Western India', utilization: 92.1, trucks: 148230, revenue: 412000000 },
  { region: 'Northern India', utilization: 88.6, trucks: 136420, revenue: 368000000 },
  { region: 'Southern India', utilization: 86.3, trucks: 124890, revenue: 324000000 },
  { region: 'Eastern India', utilization: 81.2, trucks: 78560, revenue: 198000000 },
  { region: 'Central India', utilization: 84.7, trucks: 62340, revenue: 156000000 },
  { region: 'North-East India', utilization: 72.4, trucks: 18240, revenue: 42000000 },
];

// ---- GENERATE TRUCKS ----
export const generateTrucks = (count = 50) => {
  return Array.from({ length: count }, (_, i) => {
    const origin = pick(CITIES);
    let dest = pick(CITIES);
    while (dest.name === origin.name) dest = pick(CITIES);
    const status = pick(TRUCK_STATUSES);

    return {
      id: `TRK-${String(i + 1).padStart(5, '0')}`,
      regNumber: `${pick(['MH', 'DL', 'KA', 'TN', 'GJ', 'RJ', 'UP', 'WB', 'AP', 'HR'])}${rand(1, 50)}${pick(['A', 'B', 'C', 'D', 'E'])}${pick(['A', 'B', 'C', 'D'])}${rand(1000, 9999)}`,
      type: pick(TRUCK_TYPES),
      status,
      driver: pick(DRIVER_NAMES),
      driverId: `DRV-${String(rand(1, 500)).padStart(5, '0')}`,
      origin: origin.name,
      destination: dest.name,
      lat: status === 'active' ? randFloat(Math.min(origin.lat, dest.lat), Math.max(origin.lat, dest.lat)) : origin.lat,
      lng: status === 'active' ? randFloat(Math.min(origin.lng, dest.lng), Math.max(origin.lng, dest.lng)) : origin.lng,
      speed: status === 'active' ? rand(40, 90) : 0,
      fuelLevel: rand(15, 100),
      fuelType: pick(FUEL_TYPES),
      fastagBalance: rand(500, 15000),
      lastUpdate: new Date(Date.now() - rand(0, 3600000)).toISOString(),
      eta: status === 'active' ? `${rand(2, 36)} hrs` : '-',
      loadWeight: rand(5, 25), // tonnes
      temperature: status === 'active' ? randFloat(18, 42) : null,
      mileage: rand(150000, 800000),
      nextService: `${rand(500, 5000)} km`,
      healthScore: rand(60, 100),
      dailyCost: rand(8000, 25000),
      business: pick(BUSINESS_NAMES),
    };
  });
};

// ---- GENERATE DRIVERS ----
export const generateDrivers = (count = 30) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `DRV-${String(i + 1).padStart(5, '0')}`,
    name: DRIVER_NAMES[i % DRIVER_NAMES.length],
    age: rand(25, 55),
    phone: `+91 ${rand(70000, 99999)} ${rand(10000, 99999)}`,
    license: `${pick(['MH', 'DL', 'KA', 'TN', 'GJ'])}${rand(10, 99)}${rand(10000000, 99999999)}`,
    status: pick(['on_duty', 'off_duty', 'on_leave', 'available']),
    rating: randFloat(3.5, 5.0),
    tripsCompleted: rand(200, 5000),
    experience: rand(2, 25), // years
    safetyScore: rand(70, 100),
    totalKm: rand(50000, 500000),
    assignedTruck: `TRK-${String(rand(1, 50)).padStart(5, '0')}`,
    salary: rand(25000, 55000),
    attendance: rand(85, 100),
    lastTrip: pick(CITIES).name + ' → ' + pick(CITIES).name,
    violations: rand(0, 5),
    joinDate: `${rand(2018, 2025)}-${String(rand(1, 12)).padStart(2, '0')}-${String(rand(1, 28)).padStart(2, '0')}`,
  }));
};

// ---- GENERATE SHIPMENTS ----
export const generateShipments = (count = 40) => {
  return Array.from({ length: count }, (_, i) => {
    const origin = pick(CITIES);
    let dest = pick(CITIES);
    while (dest.name === origin.name) dest = pick(CITIES);
    const status = pick(SHIPMENT_STATUSES);

    return {
      id: `SHP-${String(i + 1).padStart(6, '0')}`,
      ewayBill: `EWB${rand(100000000, 999999999)}`,
      origin: origin.name,
      destination: dest.name,
      status,
      truck: `TRK-${String(rand(1, 50)).padStart(5, '0')}`,
      driver: pick(DRIVER_NAMES),
      customer: pick(BUSINESS_NAMES),
      weight: rand(2, 25), // tonnes
      value: rand(100000, 5000000),
      pickupDate: new Date(Date.now() - rand(0, 604800000)).toISOString(),
      estimatedDelivery: new Date(Date.now() + rand(0, 604800000)).toISOString(),
      distance: rand(100, 2500), // km
      cost: rand(15000, 150000),
      invoiceId: `INV-${String(rand(1, 10000)).padStart(6, '0')}`,
    };
  });
};

// ---- GENERATE CUSTOMERS ----
export const generateCustomers = (count = 25) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `CUS-${String(i + 1).padStart(5, '0')}`,
    name: BUSINESS_NAMES[i % BUSINESS_NAMES.length],
    contact: pick(DRIVER_NAMES.map(n => n.split(' ')[0] + ' ' + pick(['Mehta', 'Shah', 'Kapoor', 'Bansal', 'Goyal']))),
    email: `contact@${BUSINESS_NAMES[i % BUSINESS_NAMES.length].toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '')}.in`,
    phone: `+91 ${rand(70000, 99999)} ${rand(10000, 99999)}`,
    city: pick(CITIES).name,
    totalShipments: rand(50, 5000),
    revenue: rand(500000, 50000000),
    healthScore: rand(40, 100),
    churnRisk: pick(['low', 'medium', 'high']),
    contractValue: rand(1000000, 100000000),
    since: `${rand(2019, 2025)}`,
    lastOrder: `${rand(1, 30)} days ago`,
    status: pick(['active', 'active', 'active', 'inactive', 'churned']),
  }));
};

// ---- ROUTES ----
export const popularRoutes = [
  { from: 'Delhi', to: 'Mumbai', distance: 1400, avgTime: '22h', efficiency: 94, trips: 12450, revenue: 186750000, cost: 142000000 },
  { from: 'Mumbai', to: 'Bangalore', distance: 980, avgTime: '16h', efficiency: 91, trips: 9870, revenue: 148050000, cost: 118000000 },
  { from: 'Delhi', to: 'Kolkata', distance: 1530, avgTime: '24h', efficiency: 88, trips: 8230, revenue: 123450000, cost: 102000000 },
  { from: 'Chennai', to: 'Hyderabad', distance: 630, avgTime: '8h', efficiency: 96, trips: 11200, revenue: 112000000, cost: 84000000 },
  { from: 'Ahmedabad', to: 'Pune', distance: 660, avgTime: '9h', efficiency: 93, trips: 7890, revenue: 94680000, cost: 72000000 },
  { from: 'Bangalore', to: 'Chennai', distance: 350, avgTime: '5h', efficiency: 97, trips: 15600, revenue: 93600000, cost: 68000000 },
  { from: 'Delhi', to: 'Jaipur', distance: 280, avgTime: '4h', efficiency: 98, trips: 18400, revenue: 92000000, cost: 64000000 },
  { from: 'Mumbai', to: 'Ahmedabad', distance: 530, avgTime: '7h', efficiency: 95, trips: 10500, revenue: 84000000, cost: 62000000 },
  { from: 'Kolkata', to: 'Guwahati', distance: 990, avgTime: '18h', efficiency: 79, trips: 4200, revenue: 63000000, cost: 54000000 },
  { from: 'Lucknow', to: 'Delhi', distance: 560, avgTime: '8h', efficiency: 92, trips: 8900, revenue: 62300000, cost: 48000000 },
];

// ---- ALERTS ----
export const generateAlerts = () => [
  { id: 1, type: 'danger', title: 'Vehicle Breakdown', message: 'TRK-00234 engine failure near Nagpur on NH44. Rescue dispatched.', time: '3 min ago', icon: 'AlertTriangle' },
  { id: 2, type: 'warning', title: 'Fuel Anomaly', message: 'TRK-00089 showing 40% fuel drop in 2 hours. Possible theft detected.', time: '12 min ago', icon: 'Fuel' },
  { id: 3, type: 'warning', title: 'Route Deviation', message: 'TRK-00156 deviated 45km from planned route near Jaipur.', time: '18 min ago', icon: 'MapPin' },
  { id: 4, type: 'danger', title: 'Driver Fatigue Alert', message: 'DRV-00078 has been driving for 14 hours without rest. Violation flagged.', time: '25 min ago', icon: 'Clock' },
  { id: 5, type: 'info', title: 'FASTag Low Balance', message: '23 vehicles have FASTag balance below ₹500. Auto-recharge initiated.', time: '32 min ago', icon: 'CreditCard' },
  { id: 6, type: 'success', title: 'Delivery Completed', message: 'SHP-004521 delivered to Reliance Supply Chain, Mumbai. On time.', time: '45 min ago', icon: 'CheckCircle' },
  { id: 7, type: 'warning', title: 'Traffic Congestion', message: 'Heavy traffic on NH48 near Gurugram. 12 trucks affected. ETAs updated.', time: '1 hr ago', icon: 'AlertCircle' },
  { id: 8, type: 'info', title: 'Maintenance Due', message: '18 vehicles due for scheduled maintenance this week. Appointments pending.', time: '1.5 hr ago', icon: 'Wrench' },
  { id: 9, type: 'danger', title: 'Temperature Exceedance', message: 'TRK-00312 cold chain temperature exceeded 8°C. Cargo at risk.', time: '2 hr ago', icon: 'Thermometer' },
  { id: 10, type: 'success', title: 'New Customer Onboarded', message: 'XpressBees signed annual contract worth ₹4.2Cr.', time: '3 hr ago', icon: 'UserPlus' },
];

// ---- AI INSIGHTS ----
export const aiInsights = [
  {
    id: 1,
    type: 'revenue',
    title: 'Revenue Growth Opportunity',
    summary: 'Revenue grew 8.3% this month. Primary driver: higher utilization in Western India (92.1%).',
    action: 'Increase truck allocation in Gujarat by 15% to capture growing demand.',
    confidence: 94,
    impact: '₹2.4Cr additional monthly revenue',
  },
  {
    id: 2,
    type: 'efficiency',
    title: 'Fuel Cost Optimization',
    summary: '47 trucks on Delhi→Mumbai route consuming 18% more fuel than fleet average.',
    action: 'Switch to CNG-optimized routes and retrain drivers on eco-driving techniques.',
    confidence: 88,
    impact: '₹12L monthly savings',
  },
  {
    id: 3,
    type: 'churn',
    title: 'Customer Churn Risk',
    summary: '3 high-value customers showing declining shipment volumes over 60 days.',
    action: 'Assign dedicated account managers and offer volume-based discounts.',
    confidence: 82,
    impact: '₹3.8Cr at risk',
  },
  {
    id: 4,
    type: 'maintenance',
    title: 'Predictive Maintenance Alert',
    summary: '28 vehicles predicted to need brake service within 2 weeks based on sensor data.',
    action: 'Schedule preventive maintenance at nearest service centers to avoid breakdowns.',
    confidence: 91,
    impact: 'Prevent 8-12 roadside breakdowns',
  },
  {
    id: 5,
    type: 'route',
    title: 'Route Optimization',
    summary: 'Kolkata→Guwahati route efficiency at 79%, lowest in network.',
    action: 'Implement relay model with hub at Siliguri to reduce driver fatigue and transit time.',
    confidence: 86,
    impact: '4h reduction in avg transit time',
  },
];

// ---- COPILOT CONVERSATIONS ----
export const copilotSuggestions = [
  'Why did truck TRK-00123 arrive late?',
  'Which customers may churn next month?',
  'Show highest cost routes',
  'What is fleet utilization trend this week?',
  'Which drivers need safety training?',
  'Compare fuel efficiency across truck types',
  'Show pending maintenance alerts',
  'Generate revenue forecast for next quarter',
];

export const copilotConversations = [
  {
    id: 1,
    query: 'Why did truck TRK-00123 arrive late?',
    response: {
      summary: 'TRK-00123 (Delhi → Mumbai) arrived 3 hours 42 minutes late on June 16.',
      reasons: [
        { factor: 'Traffic congestion near Jaipur bypass', impact: '1h 45min delay', confidence: 96 },
        { factor: 'Unplanned fuel stop at Udaipur', impact: '45min delay', confidence: 92 },
        { factor: 'Driver exceeded mandatory rest period', impact: '1h 12min delay', confidence: 88 },
      ],
      recommendation: 'Consider alternate route via NH48 for future Delhi-Mumbai trips to avoid Jaipur bypass congestion during peak hours.',
      sources: ['GPS Log #GL-28934', 'Fuel Card Transaction #FC-12847', 'Driver App Log #DAL-9823'],
    }
  },
  {
    id: 2,
    query: 'Which customers may churn next month?',
    response: {
      summary: '3 customers flagged with high churn probability based on declining engagement metrics.',
      customers: [
        { name: 'BlueDart Cargo', risk: 89, reason: 'Shipment volume down 42% in 60 days', value: '₹1.8Cr/year' },
        { name: 'Safexpress', risk: 76, reason: 'Increased complaint frequency (8 tickets in 30 days)', value: '₹1.2Cr/year' },
        { name: 'DTDC Supply', risk: 71, reason: 'Payment delays increasing, exploring competitors', value: '₹0.8Cr/year' },
      ],
      recommendation: 'Assign dedicated account managers and schedule business review meetings within 7 days.',
    }
  },
];

// ---- AI AGENTS ----
export const aiAgents = [
  {
    id: 'finance',
    name: 'Finance Agent',
    icon: 'IndianRupee',
    color: '#38CE3C',
    status: 'active',
    tasksCompleted: 1247,
    tasksInQueue: 23,
    successRate: 98.4,
    lastAction: 'Reconciled 342 toll transactions worth ₹8.4L',
    capabilities: ['Invoice Processing', 'Toll Reconciliation', 'Fuel Expense Tracking', 'GST Compliance', 'Payment Processing'],
    recentActions: [
      { action: 'Auto-generated 156 GST invoices', time: '2h ago', status: 'completed' },
      { action: 'Flagged ₹2.3L discrepancy in toll charges', time: '4h ago', status: 'completed' },
      { action: 'Processed fuel card payments for 89 trucks', time: '6h ago', status: 'completed' },
    ]
  },
  {
    id: 'hr',
    name: 'HR Agent',
    icon: 'Users',
    color: '#6366f1',
    status: 'active',
    tasksCompleted: 892,
    tasksInQueue: 15,
    successRate: 96.8,
    lastAction: 'Processed payroll for 1,240 drivers',
    capabilities: ['Driver Onboarding', 'Recruitment Screening', 'Payroll Processing', 'Attendance Tracking', 'Performance Reviews'],
    recentActions: [
      { action: 'Screened 45 driver applications', time: '1h ago', status: 'completed' },
      { action: 'Generated attendance report for June', time: '3h ago', status: 'completed' },
      { action: 'Flagged 12 drivers with license expiry < 30 days', time: '5h ago', status: 'completed' },
    ]
  },
  {
    id: 'sales',
    name: 'Sales Agent',
    icon: 'TrendingUp',
    color: '#f59e0b',
    status: 'active',
    tasksCompleted: 634,
    tasksInQueue: 31,
    successRate: 94.2,
    lastAction: 'Generated 8 quotes for enterprise clients',
    capabilities: ['Lead Qualification', 'Quote Generation', 'Customer Follow-ups', 'Upselling', 'Contract Renewal'],
    recentActions: [
      { action: 'Qualified 12 new leads from website', time: '30min ago', status: 'completed' },
      { action: 'Sent renewal reminders to 8 accounts', time: '2h ago', status: 'completed' },
      { action: 'Generated competitive pricing analysis', time: '4h ago', status: 'completed' },
    ]
  },
  {
    id: 'supply_chain',
    name: 'Supply Chain Agent',
    icon: 'Route',
    color: '#3b82f6',
    status: 'active',
    tasksCompleted: 2156,
    tasksInQueue: 42,
    successRate: 97.1,
    lastAction: 'Optimized 34 routes saving ₹4.2L in fuel',
    capabilities: ['Load Matching', 'Route Optimization', 'Capacity Planning', 'Truck Utilization', 'Demand Forecasting'],
    recentActions: [
      { action: 'Matched 28 loads with available trucks', time: '15min ago', status: 'completed' },
      { action: 'Re-routed 5 trucks to avoid highway closure', time: '1h ago', status: 'completed' },
      { action: 'Forecast: 15% demand spike next week in Gujarat', time: '3h ago', status: 'completed' },
    ]
  },
  {
    id: 'engineering',
    name: 'Engineering Agent',
    icon: 'Server',
    color: '#ec4899',
    status: 'active',
    tasksCompleted: 456,
    tasksInQueue: 8,
    successRate: 99.2,
    lastAction: 'Auto-scaled GPS ingestion servers',
    capabilities: ['System Monitoring', 'DevOps Automation', 'Security Scanning', 'Incident Management', 'Performance Tuning'],
    recentActions: [
      { action: 'Resolved high latency on tracking API (p99: 23ms)', time: '45min ago', status: 'completed' },
      { action: 'Deployed IoT firmware update to 12K sensors', time: '2h ago', status: 'completed' },
      { action: 'Security scan: 0 vulnerabilities found', time: '6h ago', status: 'completed' },
    ]
  },
  {
    id: 'executive',
    name: 'Executive Decision Agent',
    icon: 'Brain',
    color: '#f97316',
    status: 'active',
    tasksCompleted: 189,
    tasksInQueue: 5,
    successRate: 95.6,
    lastAction: 'Generated board-ready monthly performance report',
    capabilities: ['CEO Dashboard', 'Board Reports', 'Strategy Recommendations', 'Risk Analysis', 'Market Intelligence'],
    recentActions: [
      { action: 'Revenue analysis: 8.3% growth driven by Western India', time: '1h ago', status: 'completed' },
      { action: 'Competitor analysis: BlackBuck pricing changes detected', time: '4h ago', status: 'completed' },
      { action: 'Risk alert: Fuel price hike expected next week', time: '8h ago', status: 'completed' },
    ]
  },
];

// ---- KNOWLEDGE GRAPH DATA ----
export const knowledgeGraphNodes = [
  // Center Command Node
  { id: 'b1', type: 'business', label: 'GatiFleet Ops Command', x: 400, y: 300, size: 42 },

  // AI Agents Ring
  { id: 'agt1', type: 'agent', label: 'Finance Agent (Audit)', x: 330, y: 220, size: 30 },
  { id: 'agt2', type: 'agent', label: 'HR Agent (Fatigue)', x: 470, y: 220, size: 30 },
  { id: 'agt3', type: 'agent', label: 'Sales Agent (Retention)', x: 490, y: 300, size: 30 },
  { id: 'agt4', type: 'agent', label: 'Supply Chain Agent', x: 470, y: 380, size: 30 },
  { id: 'agt5', type: 'agent', label: 'Engineering Agent', x: 330, y: 380, size: 30 },
  { id: 'agt6', type: 'agent', label: 'Executive Agent', x: 310, y: 300, size: 30 },

  // Customers (CRM Accounts)
  { id: 'cus1', type: 'customer', label: 'Reliance Supply Chain', x: 200, y: 150, size: 32 },
  { id: 'cus2', type: 'customer', label: 'Tata Motors Logistics', x: 600, y: 150, size: 32 },
  { id: 'cus3', type: 'customer', label: 'Godrej Consumer Products', x: 200, y: 450, size: 32 },
  { id: 'cus4', type: 'customer', label: 'Dabur Distribution', x: 600, y: 450, size: 32 },

  // Routes (Freight Corridors)
  { id: 'rte1', type: 'route', label: 'Western Corridor (Delhi-Mumbai)', x: 400, y: 100, size: 30 },
  { id: 'rte2', type: 'route', label: 'Southern Corridor (Mumbai-Chennai)', x: 600, y: 300, size: 30 },
  { id: 'rte3', type: 'route', label: 'Eastern Corridor (Kolkata-Guwahati)', x: 200, y: 300, size: 30 },

  // Warehouses (Depots)
  { id: 'wh1', type: 'warehouse', label: 'Delhi Ingestion Hub', x: 400, y: 500, size: 30 },
  { id: 'wh2', type: 'warehouse', label: 'Mumbai JNPT Port Depot', x: 240, y: 80, size: 30 },
  { id: 'wh3', type: 'warehouse', label: 'Bangalore Tech Corridor Hub', x: 560, y: 80, size: 30 },

  // Shipments (Freight Cargo)
  { id: 'shp1', type: 'shipment', label: 'SHP-001001 (FMCG Run)', x: 100, y: 120, size: 26 },
  { id: 'shp2', type: 'shipment', label: 'SHP-001002 (Auto Parts)', x: 700, y: 120, size: 26 },
  { id: 'shp3', type: 'shipment', label: 'SHP-001003 (Polymers)', x: 100, y: 480, size: 26 },
  { id: 'shp4', type: 'shipment', label: 'SHP-001004 (Electronics)', x: 700, y: 480, size: 26 },

  // Trucks (Digital Twins)
  { id: 'trk1', type: 'truck', label: 'TRK-00012 (Volvo FM420)', x: 100, y: 250, size: 28 },
  { id: 'trk2', type: 'truck', label: 'TRK-00028 (Tata Prima)', x: 700, y: 250, size: 28 },
  { id: 'trk3', type: 'truck', label: 'TRK-00045 (BharatBenz)', x: 400, y: 580, size: 28 },
  { id: 'trk4', type: 'truck', label: 'TRK-00019 (Eicher Pro)', x: 400, y: 20, size: 28 },

  // Drivers (Behavior Safety Twins)
  { id: 'drv1', type: 'driver', label: 'Rajesh Kumar', x: 30, y: 180, size: 25 },
  { id: 'drv2', type: 'driver', label: 'Suresh Yadav', x: 770, y: 180, size: 25 },
  { id: 'drv3', type: 'driver', label: 'Ashok Pandey (Fatigue)', x: 30, y: 420, size: 25 },
  { id: 'drv4', type: 'driver', label: 'Deepak Gupta', x: 770, y: 420, size: 25 },

  // Financial Documents
  { id: 'inv1', type: 'invoice', label: 'E-Invoice INV-8927', x: 180, y: 570, size: 24 },
  { id: 'inv2', type: 'invoice', label: 'GST Discrepancy DSC-001', x: 620, y: 570, size: 24 },

  // Operational Toll Plazas & Fuel Stations
  { id: 'toll1', type: 'toll', label: 'Vapi Toll Plaza (NH48)', x: 260, y: 30, size: 24 },
  { id: 'toll2', type: 'toll', label: 'Kherki Daula (FASTag)', x: 540, y: 30, size: 24 },
  { id: 'fuel1', type: 'fuel', label: 'IOC NH44 Fuel station', x: 260, y: 580, size: 24 },
  { id: 'fuel2', type: 'fuel', label: 'BPCL Fuel Card Account', x: 540, y: 580, size: 24 }
];

export const knowledgeGraphEdges = [
  // Core Command relationships
  { from: 'b1', to: 'cus1', label: 'serves_client' },
  { from: 'b1', to: 'cus2', label: 'serves_client' },
  { from: 'b1', to: 'cus3', label: 'serves_client' },
  { from: 'b1', to: 'cus4', label: 'serves_client' },

  // AI Agent assignments
  { from: 'b1', to: 'agt1', label: 'hosts' },
  { from: 'b1', to: 'agt2', label: 'hosts' },
  { from: 'b1', to: 'agt3', label: 'hosts' },
  { from: 'b1', to: 'agt4', label: 'hosts' },
  { from: 'b1', to: 'agt5', label: 'hosts' },
  { from: 'b1', to: 'agt6', label: 'hosts' },

  // AI Agent monitoring connections
  { from: 'agt1', to: 'inv1', label: 'audits' },
  { from: 'agt1', to: 'inv2', label: 'reconciles' },
  { from: 'agt2', to: 'drv3', label: 'fatigue_alert' },
  { from: 'agt2', to: 'drv4', label: 'monitors' },
  { from: 'agt3', to: 'cus3', label: 'retains_client' },
  { from: 'agt3', to: 'cus4', label: 'retains_client' },
  { from: 'agt4', to: 'rte1', label: 'optimizes_traffic' },
  { from: 'agt4', to: 'rte2', label: 'optimizes_traffic' },
  { from: 'agt4', to: 'rte3', label: 'optimizes_traffic' },
  { from: 'agt5', to: 'trk1', label: 'diagnostics' },
  { from: 'agt5', to: 'trk2', label: 'diagnostics' },
  { from: 'agt5', to: 'trk3', label: 'diagnostics' },
  { from: 'agt6', to: 'b1', label: 'CEO_advisor' },

  // Customer orders
  { from: 'cus1', to: 'shp1', label: 'ordered' },
  { from: 'cus2', to: 'shp2', label: 'ordered' },
  { from: 'cus3', to: 'shp3', label: 'ordered' },
  { from: 'cus4', to: 'shp4', label: 'ordered' },

  // Shipment transits
  { from: 'shp1', to: 'trk1', label: 'carried_by' },
  { from: 'shp2', to: 'trk2', label: 'carried_by' },
  { from: 'shp3', to: 'trk3', label: 'carried_by' },
  { from: 'shp4', to: 'trk4', label: 'carried_by' },

  // Driver assignments
  { from: 'trk1', to: 'drv1', label: 'driven_by' },
  { from: 'trk2', to: 'drv2', label: 'driven_by' },
  { from: 'trk3', to: 'drv3', label: 'driven_by' },
  { from: 'trk4', to: 'drv4', label: 'driven_by' },

  // Route traversals
  { from: 'trk1', to: 'rte1', label: 'travels' },
  { from: 'trk2', to: 'rte2', label: 'travels' },
  { from: 'trk3', to: 'rte3', label: 'travels' },

  // Warehouse checkpoints
  { from: 'shp1', to: 'wh1', label: 'origin_hub' },
  { from: 'shp1', to: 'wh2', label: 'destination_hub' },
  { from: 'shp2', to: 'wh2', label: 'origin_hub' },
  { from: 'shp2', to: 'wh3', label: 'destination_hub' },

  // Route infrastructures
  { from: 'rte1', to: 'toll1', label: 'passes_toll' },
  { from: 'rte2', to: 'toll2', label: 'passes_toll' },
  { from: 'rte1', to: 'fuel1', label: 'refuels_at' },
  { from: 'rte2', to: 'fuel2', label: 'refuels_at' },

  // Shipment billings
  { from: 'shp1', to: 'inv1', label: 'billed_invoice' }
];

export const nodeTypeColors = {
  business: '#6366f1',
  agent: '#a855f7',
  shipment: '#3b82f6',
  truck: '#38CE3C',
  driver: '#f59e0b',
  route: '#ec4899',
  fuel: '#f97316',
  toll: '#FF4D6B',
  invoice: '#8b5cf6',
  warehouse: '#06b6d4',
  customer: '#10b981',
};

// ---- ERP DATA ----
export const erpData = {
  procurement: {
    totalOrders: 2456,
    pendingApprovals: 34,
    totalSpend: 284000000,
    topVendors: [
      { name: 'Indian Oil Corporation', spend: 82000000, orders: 890 },
      { name: 'Hindustan Petroleum', spend: 68000000, orders: 720 },
      { name: 'BPCL Fuel Cards', spend: 54000000, orders: 580 },
      { name: 'Bridgestone Tyres', spend: 32000000, orders: 120 },
      { name: 'Bosch Auto Parts', spend: 28000000, orders: 145 },
    ],
  },
  accounting: {
    revenue: 1284000000,
    expenses: 968000000,
    profit: 316000000,
    profitMargin: 24.6,
    cashflow: 142000000,
    receivables: 186000000,
    payables: 124000000,
  },
  invoices: {
    total: 18456,
    paid: 15234,
    pending: 2890,
    overdue: 332,
    totalValue: 892000000,
  },
  gstCompliance: {
    filedOnTime: 98.2,
    pendingReturns: 3,
    totalGST: 148000000,
    inputCredit: 92000000,
  },
};

// ---- CRM DATA ----
export const crmData = {
  pipeline: {
    leads: 234,
    qualified: 89,
    proposals: 45,
    negotiations: 28,
    closed: 18,
    totalValue: 156000000,
  },
  tickets: {
    open: 124,
    inProgress: 67,
    resolved: 1890,
    avgResponseTime: '2.4 hrs',
    satisfaction: 4.3,
  },
  contracts: {
    active: 342,
    expiringSoon: 28,
    renewed: 156,
    renewalRate: 89.2,
  },
};

// ---- HCM DATA ----
export const hcmData = {
  workforce: {
    totalEmployees: 1842,
    drivers: 1240,
    office: 602,
    newHires: 45,
    attrition: 3.8,
  },
  attendance: {
    present: 1678,
    absent: 82,
    onLeave: 56,
    lateArrivals: 26,
    rate: 94.2,
  },
  payroll: {
    totalPayroll: 68000000,
    processed: true,
    nextDate: '2026-07-01',
    avgSalary: 36900,
    bonuses: 4200000,
  },
  performance: {
    avgRating: 3.8,
    topPerformers: 186,
    needsImprovement: 42,
    trainingsCompleted: 892,
  },
};

// ---- ANALYTICS DATA ----
export const analyticsData = {
  fleetTrend: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    utilization: [82, 84, 85, 83, 86, 87, 88, 87.4],
    onTime: [91, 92, 93, 92.5, 93, 94, 94.5, 94.2],
    fuelEff: [4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.8],
  },
  costBreakdown: [
    { name: 'Fuel', value: 38, amount: 367000000 },
    { name: 'Tolls', value: 14, amount: 135000000 },
    { name: 'Driver Salaries', value: 22, amount: 213000000 },
    { name: 'Maintenance', value: 12, amount: 116000000 },
    { name: 'Insurance', value: 6, amount: 58000000 },
    { name: 'Depreciation', value: 5, amount: 48000000 },
    { name: 'Other', value: 3, amount: 31000000 },
  ],
  demandForecast: {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    predicted: [92000, 95000, 89000, 102000, 118000, 125000],
    lower: [88000, 91000, 85000, 96000, 112000, 118000],
    upper: [96000, 99000, 93000, 108000, 124000, 132000],
  },
};

// ---- CRM CUSTOMER HEALTH DATA ----
export const crmCustomers = [
  {
    id: 'CUS-001',
    name: 'Tata Motors Logistics',
    health: 95,
    riskScore: 5,
    revenue: 142000000,
    growthScore: 18.4,
    strategicScore: 98,
    slaCompliance: 97.4,
    trips: 2340,
    paymentDelayDays: 2,
    bookingsDropPct: -3.2,
    activeDisputes: 0,
    competitorActivity: 'None detected',
    supportSentiment: 'Positive',
    riskStatus: 'low',
    incidents: [
      { id: 'INC-901', date: '2026-06-18', truckId: 'TRK-00012', route: 'Delhi → Mumbai', status: 'Resolved', delayHours: 1.5, reason: 'Toll plaza delay' },
      { id: 'INC-842', date: '2026-06-14', truckId: 'TRK-00034', route: 'Mumbai → Pune', status: 'Resolved', delayHours: 0.8, reason: 'Heavy rains' }
    ],
    disputes: [],
    capacityDemands: 'High (requires 45 dedicated trucks next week)',
    contractEnd: '2027-03-31'
  },
  {
    id: 'CUS-002',
    name: 'Reliance Industries',
    health: 88,
    riskScore: 15,
    revenue: 128000000,
    growthScore: 12.5,
    strategicScore: 95,
    slaCompliance: 94.8,
    trips: 1890,
    paymentDelayDays: 8,
    bookingsDropPct: 1.5,
    activeDisputes: 1,
    competitorActivity: 'Aggressive pricing offers from BlackBuck',
    supportSentiment: 'Neutral',
    riskStatus: 'low',
    incidents: [
      { id: 'INC-893', date: '2026-06-17', truckId: 'TRK-00028', route: 'Ahmedabad → Delhi', status: 'Resolved', delayHours: 3.2, reason: 'Varanasi route detour' },
      { id: 'INC-876', date: '2026-06-15', truckId: 'TRK-00007', route: 'Delhi → Jaipur', status: 'Resolved', delayHours: 2.1, reason: 'Engine check light' }
    ],
    disputes: [
      { id: 'DIS-001', amount: 150000, status: 'Open', reason: 'Unscheduled detention charges disputed' }
    ],
    capacityDemands: 'Critical (demanding 60 dedicated capacity on NH48)',
    contractEnd: '2026-12-31'
  },
  {
    id: 'CUS-003',
    name: 'Hindustan Unilever',
    health: 82,
    riskScore: 25,
    revenue: 96000000,
    growthScore: 8.6,
    strategicScore: 92,
    slaCompliance: 92.5,
    trips: 1456,
    paymentDelayDays: 12,
    bookingsDropPct: 4.8,
    activeDisputes: 0,
    competitorActivity: 'Transporter bidding on Nagpur corridor',
    supportSentiment: 'Neutral',
    riskStatus: 'low',
    incidents: [
      { id: 'INC-812', date: '2026-06-10', truckId: 'TRK-00045', route: 'Bangalore → Chennai', status: 'Resolved', delayHours: 4.5, reason: 'Tyre puncture & repair' }
    ],
    disputes: [],
    capacityDemands: 'Stable',
    contractEnd: '2026-10-15'
  },
  {
    id: 'CUS-004',
    name: 'Larsen & Toubro',
    health: 76,
    riskScore: 35,
    revenue: 84000000,
    growthScore: -2.1,
    strategicScore: 89,
    slaCompliance: 89.2,
    trips: 1234,
    paymentDelayDays: 18,
    bookingsDropPct: 8.4,
    activeDisputes: 1,
    competitorActivity: 'VRL Logistics pitch detected',
    supportSentiment: 'Negative',
    riskStatus: 'medium',
    incidents: [
      { id: 'INC-789', date: '2026-06-08', truckId: 'TRK-00019', route: 'Jaipur → Delhi', status: 'Active', delayHours: 12.0, reason: 'Axle breakage near Gurugram' },
      { id: 'INC-750', date: '2026-06-05', truckId: 'TRK-00033', route: 'Kolkata → Patna', status: 'Resolved', delayHours: 5.6, reason: 'Border clearance bottleneck' }
    ],
    disputes: [
      { id: 'DIS-002', amount: 350000, status: 'Open', reason: 'SLA delay late-delivery penalty chargeback' }
    ],
    capacityDemands: 'High (delayed heavy machinery shipments)',
    contractEnd: '2026-08-30'
  },
  {
    id: 'CUS-005',
    name: 'Mahindra Logistics',
    health: 71,
    riskScore: 40,
    revenue: 72000000,
    growthScore: -5.4,
    strategicScore: 85,
    slaCompliance: 88.0,
    trips: 987,
    paymentDelayDays: 14,
    bookingsDropPct: 12.1,
    activeDisputes: 0,
    competitorActivity: 'Negotiating spot rates with competitors',
    supportSentiment: 'Neutral',
    riskStatus: 'medium',
    incidents: [
      { id: 'INC-701', date: '2026-06-02', truckId: 'TRK-00049', route: 'Mumbai → Ahmedabad', status: 'Resolved', delayHours: 3.5, reason: 'Vapi toll gate delay' }
    ],
    disputes: [],
    capacityDemands: 'Shortage on Western lanes',
    contractEnd: '2026-09-01'
  },
  {
    id: 'CUS-006',
    name: 'Wipro Transport',
    health: 62,
    riskScore: 55,
    revenue: 46000000,
    growthScore: -12.8,
    strategicScore: 78,
    slaCompliance: 84.5,
    trips: 543,
    paymentDelayDays: 22,
    bookingsDropPct: 18.2,
    activeDisputes: 2,
    competitorActivity: 'Safexpress regional price matching',
    supportSentiment: 'Negative',
    riskStatus: 'high',
    incidents: [
      { id: 'INC-682', date: '2026-05-22', truckId: 'TRK-00012', route: 'Delhi → Bangalore', status: 'Resolved', delayHours: 18.5, reason: 'Severe engine overheating near Nagpur' },
      { id: 'INC-640', date: '2026-05-18', truckId: 'TRK-00028', route: 'Bangalore → Hyderabad', status: 'Resolved', delayHours: 8.0, reason: 'Driver hours-of-service violation block' }
    ],
    disputes: [
      { id: 'DIS-003', amount: 180000, status: 'Open', reason: 'Fuel surcharge index discrepancy' },
      { id: 'DIS-004', amount: 90000, status: 'Open', reason: 'Demurrage calculations dispute' }
    ],
    capacityDemands: 'Severe shortages on South routes',
    contractEnd: '2026-07-15'
  },
  {
    id: 'CUS-007',
    name: 'Godrej Consumer',
    health: 55,
    riskScore: 70,
    revenue: 38000000,
    growthScore: -22.5,
    strategicScore: 74,
    slaCompliance: 81.2,
    trips: 432,
    paymentDelayDays: 28,
    bookingsDropPct: 24.8,
    activeDisputes: 1,
    competitorActivity: 'Active spot rate bids from Delhivery',
    supportSentiment: 'Negative',
    riskStatus: 'high',
    incidents: [
      { id: 'INC-590', date: '2026-05-14', truckId: 'TRK-00045', route: 'Kolkata → Guwahati', status: 'Resolved', delayHours: 24.0, reason: 'Siliguri corridor landslide block' }
    ],
    disputes: [
      { id: 'DIS-005', amount: 450000, status: 'Open', reason: 'SLA penalty for delayed FMCG supply run' }
    ],
    capacityDemands: 'Requires dedicated reefer capacity',
    contractEnd: '2026-07-20'
  },
  {
    id: 'CUS-008',
    name: 'Dabur Distribution',
    health: 42,
    riskScore: 85,
    revenue: 18000000,
    growthScore: -35.2,
    strategicScore: 68,
    slaCompliance: 76.5,
    trips: 210,
    paymentDelayDays: 35,
    bookingsDropPct: 32.4,
    activeDisputes: 1,
    competitorActivity: 'Transporter rates undercut by 8%',
    supportSentiment: 'Negative',
    riskStatus: 'critical',
    incidents: [
      { id: 'INC-481', date: '2026-04-25', truckId: 'TRK-00019', route: 'Patna → Lucknow', status: 'Resolved', delayHours: 14.2, reason: 'Brake booster failure and tow recovery' }
    ],
    disputes: [
      { id: 'DIS-006', amount: 220000, status: 'Open', reason: 'Late delivery penalty dispute' }
    ],
    capacityDemands: 'Low (contract under audit)',
    contractEnd: '2026-07-10'
  }
];

// ---- COMPLIANCE DATA ----
export const fastagAccounts = [
  { id: 'FT-001', vehicleId: 'TRK-00012', regNumber: 'DL3CAQ1293', balance: 350, avgDailySpend: 1800, status: 'critical', bank: 'ICICI Bank', autoRecharge: true, threshold: 1000, rechargeAmt: 5000 },
  { id: 'FT-002', vehicleId: 'TRK-00028', regNumber: 'MH12RN8841', balance: 850, avgDailySpend: 2400, status: 'warning', bank: 'HDFC Bank', autoRecharge: false, threshold: 2000, rechargeAmt: 10000 },
  { id: 'FT-003', vehicleId: 'TRK-00045', regNumber: 'KA03MS5512', balance: 4200, avgDailySpend: 1200, status: 'healthy', bank: 'SBI', autoRecharge: true, threshold: 1500, rechargeAmt: 5000 },
  { id: 'FT-004', vehicleId: 'TRK-00007', regNumber: 'GJ01TR4490', balance: 12500, avgDailySpend: 3100, status: 'healthy', bank: 'Axis Bank', autoRecharge: true, threshold: 3000, rechargeAmt: 15000 },
  { id: 'FT-005', vehicleId: 'TRK-00019', regNumber: 'RJ14GB2231', balance: 120, avgDailySpend: 1500, status: 'critical', bank: 'IDFC First', autoRecharge: false, threshold: 1000, rechargeAmt: 5000 },
  { id: 'FT-006', vehicleId: 'TRK-00033', regNumber: 'UP16CT4921', balance: 2100, avgDailySpend: 2000, status: 'warning', bank: 'ICICI Bank', autoRecharge: true, threshold: 1500, rechargeAmt: 8000 },
  { id: 'FT-007', vehicleId: 'TRK-00049', regNumber: 'MH02FD9002', balance: 7500, avgDailySpend: 1800, status: 'healthy', bank: 'Kotak Mahindra', autoRecharge: false, threshold: 2000, rechargeAmt: 10000 }
];

export const ewayBills = [
  { id: 'EWB-892731', vehicleId: 'TRK-00012', regNumber: 'DL3CAQ1293', customer: 'Reliance Supply', value: 4500000, origin: 'Delhi', destination: 'Mumbai', status: 'MATCHED', expiresAt: '2h 15m', cargo: 'Electronics', routeCompliance: 100 },
  { id: 'EWB-238472', vehicleId: 'TRK-00028', regNumber: 'MH12RN8841', customer: 'Tata Motors', value: 8900000, origin: 'Pune', destination: 'Bangalore', status: 'ROUTE_MISMATCH', expiresAt: '8h 45m', cargo: 'Automotive Parts', routeCompliance: 68 },
  { id: 'EWB-112093', vehicleId: 'TRK-00045', regNumber: 'KA03MS5512', customer: 'Gati Logistics', value: 2400000, origin: 'Bangalore', destination: 'Chennai', status: 'NEAR_DESTINATION', expiresAt: '1h 30m', cargo: 'FMCG', routeCompliance: 98 },
  { id: 'EWB-903248', vehicleId: 'TRK-00007', regNumber: 'GJ01TR4490', customer: 'Reliance Supply', value: 12500000, origin: 'Ahmedabad', destination: 'Delhi', status: 'MATCHED', expiresAt: '18h 10m', cargo: 'Polymers', routeCompliance: 99 },
  { id: 'EWB-445892', vehicleId: 'TRK-00019', regNumber: 'RJ14GB2231', customer: 'Safexpress', value: 1800000, origin: 'Jaipur', destination: 'Indore', status: 'EXPIRED', expiresAt: 'Expired (2h ago)', cargo: 'Textiles', routeCompliance: 84 },
  { id: 'EWB-772910', vehicleId: 'TRK-00033', regNumber: 'UP16CT4921', customer: 'Delhivery Express', value: 6200000, origin: 'Noida', destination: 'Kolkata', status: 'MATCHED', expiresAt: '24h 00m', cargo: 'General Merchandise', routeCompliance: 96 }
];

export const gstReconciliationLog = {
  matchingRate: 94.6,
  totalInvoices: 384,
  matchedCount: 363,
  mismatchedCount: 21,
  discrepancies: [
    { id: 'DSC-001', vendor: 'Indian Oil Corporation', invoiceNo: 'IOC-2026-8923', type: 'Amount Mismatch', bookValue: 452000, gstr2bValue: 425000, discrepancy: 27000, status: 'Open', date: '2026-06-12', gstIn: '07AAACI0468E1ZN' },
    { id: 'DSC-002', vendor: 'Bridgestone India', invoiceNo: 'BS-99214', type: 'Missing in GSTR-2B', bookValue: 125000, gstr2bValue: 0, discrepancy: 125000, status: 'Open', date: '2026-06-14', gstIn: '27AABCB8193J1Z4' },
    { id: 'DSC-003', vendor: 'Bosch Limited', invoiceNo: 'BOS-7712', type: 'GSTIN Mismatch', bookValue: 88000, gstr2bValue: 88000, discrepancy: 0, status: 'Open', date: '2026-06-15', gstIn: '29AABCB0239A1Z9' },
    { id: 'DSC-004', vendor: 'Hindustan Petroleum', invoiceNo: 'HP-998241', type: 'Tax Rate Difference', bookValue: 310000, gstr2bValue: 310000, discrepancy: 15500, status: 'Open', date: '2026-06-16', gstIn: '27AAACH1108F1ZP' },
    { id: 'DSC-005', vendor: 'BPCL Fuel Cards', invoiceNo: 'BP-881273', type: 'Missing in GSTR-2B', bookValue: 245000, gstr2bValue: 0, discrepancy: 245000, status: 'Open', date: '2026-06-17', gstIn: '27AAACB2187H1ZQ' }
  ]
};

// ---- FORMAT HELPERS ----
export const formatCurrency = (amount) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
};

export const formatNumber = (num) => {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString('en-IN');
};

// ---- HCM DRIVERS TELEMETRY & DIGITAL TWIN ----
export const hcmDrivers = [
  {
    id: 'DRV-001',
    name: 'Rajesh Kumar',
    status: 'on-trip',
    rating: 4.8,
    trips: 2456,
    safety: 98,
    skill: 94,
    fatigue: 12,
    fuel: 92,
    truck: 'DL-01-AB-1234',
    route: 'Delhi → Mumbai',
    phone: '+91 98765 43210',
    recommendation: 'None',
    trainingStatus: 'Completed',
    bonusStatus: 'Paid',
    violationsCount: { harshBraking: 0, overSpeeding: 0, tailgating: 0, hos: 0 },
    incidents: []
  },
  {
    id: 'DRV-002',
    name: 'Suresh Yadav',
    status: 'available',
    rating: 4.7,
    trips: 2234,
    safety: 97,
    skill: 92,
    fatigue: 8,
    fuel: 90,
    truck: 'MH-02-CD-5678',
    route: '—',
    phone: '+91 98765 43211',
    recommendation: 'Eligible for Safety Bonus',
    trainingStatus: 'Completed',
    bonusStatus: 'Eligible',
    violationsCount: { harshBraking: 0, overSpeeding: 0, tailgating: 0, hos: 0 },
    incidents: []
  },
  {
    id: 'DRV-003',
    name: 'Manoj Singh',
    status: 'on-trip',
    rating: 4.6,
    trips: 2112,
    safety: 96,
    skill: 91,
    fatigue: 22,
    fuel: 88,
    truck: 'KA-03-EF-9012',
    route: 'Bangalore → Chennai',
    phone: '+91 98765 43212',
    recommendation: 'None',
    trainingStatus: 'Completed',
    bonusStatus: 'Not Eligible',
    violationsCount: { harshBraking: 1, overSpeeding: 0, tailgating: 0, hos: 0 },
    incidents: [
      { id: 'VIOL-101', date: '2026-06-14', type: 'Harsh Braking', severity: 'Low', description: 'Decel 8.2 m/s² on NH-48 near Tumakuru', status: 'Resolved' }
    ]
  },
  {
    id: 'DRV-004',
    name: 'Amit Patel',
    status: 'on-leave',
    rating: 4.5,
    trips: 1998,
    safety: 95,
    skill: 93,
    fatigue: 0,
    fuel: 89,
    truck: 'GJ-04-GH-3456',
    route: '—',
    phone: '+91 98765 43213',
    recommendation: 'None',
    trainingStatus: 'Completed',
    bonusStatus: 'Not Eligible',
    violationsCount: { harshBraking: 0, overSpeeding: 0, tailgating: 0, hos: 0 },
    incidents: []
  },
  {
    id: 'DRV-005',
    name: 'Vikram Sharma',
    status: 'on-trip',
    rating: 4.9,
    trips: 1876,
    safety: 99,
    skill: 97,
    fatigue: 15,
    fuel: 95,
    truck: 'RJ-05-IJ-7890',
    route: 'Jaipur → Ahmedabad',
    phone: '+91 98765 43214',
    recommendation: 'Eligible for Safety Bonus',
    trainingStatus: 'Completed',
    bonusStatus: 'Eligible',
    violationsCount: { harshBraking: 0, overSpeeding: 0, tailgating: 0, hos: 0 },
    incidents: []
  },
  {
    id: 'DRV-006',
    name: 'Deepak Gupta',
    status: 'available',
    rating: 4.4,
    trips: 1754,
    safety: 74,
    skill: 80,
    fatigue: 45,
    fuel: 72,
    truck: 'UP-06-KL-1234',
    route: '—',
    phone: '+91 98765 43215',
    recommendation: 'Mandatory Safety Training Required',
    trainingStatus: 'Pending',
    bonusStatus: 'Not Eligible',
    violationsCount: { harshBraking: 4, overSpeeding: 2, tailgating: 1, hos: 0 },
    incidents: [
      { id: 'VIOL-102', date: '2026-06-12', type: 'Over-speeding', severity: 'High', description: '95 km/h in 60 km/h zone near Agra Expressway', status: 'Active' },
      { id: 'VIOL-103', date: '2026-06-10', type: 'Harsh Braking', severity: 'Medium', description: 'Decel 10.5 m/s² to avoid barrier at toll plaza', status: 'Active' }
    ]
  },
  {
    id: 'DRV-007',
    name: 'Ravi Verma',
    status: 'on-trip',
    rating: 4.3,
    trips: 1632,
    safety: 93,
    skill: 86,
    fatigue: 30,
    fuel: 85,
    truck: 'TN-07-MN-5678',
    route: 'Chennai → Hyderabad',
    phone: '+91 98765 43216',
    recommendation: 'None',
    trainingStatus: 'Completed',
    bonusStatus: 'Not Eligible',
    violationsCount: { harshBraking: 1, overSpeeding: 0, tailgating: 1, hos: 0 },
    incidents: [
      { id: 'VIOL-110', date: '2026-06-08', type: 'Tailgating', severity: 'Low', description: 'Radar alert: Follow distance < 1.5s on NH-16', status: 'Resolved' }
    ]
  },
  {
    id: 'DRV-008',
    name: 'Sanjay Mishra',
    status: 'rest',
    rating: 4.6,
    trips: 1510,
    safety: 96,
    skill: 90,
    fatigue: 5,
    fuel: 88,
    truck: 'WB-08-OP-9012',
    route: '—',
    phone: '+91 98765 43217',
    recommendation: 'None',
    trainingStatus: 'Completed',
    bonusStatus: 'Not Eligible',
    violationsCount: { harshBraking: 0, overSpeeding: 0, tailgating: 0, hos: 0 },
    incidents: []
  },
  {
    id: 'DRV-009',
    name: 'Prakash Joshi',
    status: 'on-trip',
    rating: 4.7,
    trips: 1488,
    safety: 97,
    skill: 92,
    fatigue: 25,
    fuel: 91,
    truck: 'AP-09-QR-3456',
    route: 'Hyderabad → Pune',
    phone: '+91 98765 43218',
    recommendation: 'None',
    trainingStatus: 'Completed',
    bonusStatus: 'Not Eligible',
    violationsCount: { harshBraking: 0, overSpeeding: 0, tailgating: 0, hos: 0 },
    incidents: []
  },
  {
    id: 'DRV-010',
    name: 'Arun Nair',
    status: 'available',
    rating: 4.2,
    trips: 1366,
    safety: 92,
    skill: 88,
    fatigue: 10,
    fuel: 84,
    truck: 'KL-10-ST-7890',
    route: '—',
    phone: '+91 98765 43219',
    recommendation: 'None',
    trainingStatus: 'Completed',
    bonusStatus: 'Not Eligible',
    violationsCount: { harshBraking: 0, overSpeeding: 0, tailgating: 0, hos: 0 },
    incidents: []
  },
  {
    id: 'DRV-011',
    name: 'Kiran Reddy',
    status: 'on-trip',
    rating: 4.5,
    trips: 1244,
    safety: 95,
    skill: 89,
    fatigue: 28,
    fuel: 87,
    truck: 'TS-11-UV-1234',
    route: 'Pune → Delhi',
    phone: '+91 98765 43220',
    recommendation: 'None',
    trainingStatus: 'Completed',
    bonusStatus: 'Not Eligible',
    violationsCount: { harshBraking: 1, overSpeeding: 0, tailgating: 0, hos: 0 },
    incidents: []
  },
  {
    id: 'DRV-012',
    name: 'Gopal Das',
    status: 'rest',
    rating: 4.1,
    trips: 1122,
    safety: 91,
    skill: 84,
    fatigue: 8,
    fuel: 82,
    truck: 'OR-12-WX-5678',
    route: '—',
    phone: '+91 98765 43221',
    recommendation: 'None',
    trainingStatus: 'Completed',
    bonusStatus: 'Not Eligible',
    violationsCount: { harshBraking: 0, overSpeeding: 0, tailgating: 0, hos: 0 },
    incidents: []
  },
  {
    id: 'DRV-013',
    name: 'Naveen Tiwari',
    status: 'on-trip',
    rating: 4.8,
    trips: 1098,
    safety: 98,
    skill: 95,
    fatigue: 14,
    fuel: 93,
    truck: 'MP-13-YZ-9012',
    route: 'Lucknow → Kolkata',
    phone: '+91 98765 43222',
    recommendation: 'None',
    trainingStatus: 'Completed',
    bonusStatus: 'Paid',
    violationsCount: { harshBraking: 0, overSpeeding: 0, tailgating: 0, hos: 0 },
    incidents: []
  },
  {
    id: 'DRV-014',
    name: 'Ashok Pandey',
    status: 'available',
    rating: 4.0,
    trips: 976,
    safety: 62,
    skill: 76,
    fatigue: 75,
    fuel: 68,
    truck: 'BR-14-AB-3456',
    route: '—',
    phone: '+91 98765 43223',
    recommendation: 'Mandatory Rest Trigger Required',
    trainingStatus: 'Completed',
    bonusStatus: 'Not Eligible',
    violationsCount: { harshBraking: 3, overSpeeding: 1, tailgating: 3, hos: 2 },
    incidents: [
      { id: 'VIOL-104', date: '2026-06-18', type: 'HOS Violation', severity: 'Critical', description: 'Driving 13.5 hours continuously without mandatory 30m break', status: 'Active' },
      { id: 'VIOL-105', date: '2026-06-16', type: 'Tailgating', severity: 'Medium', description: 'Radar alert: Follow distance < 1.2s behind truck at 70 km/h', status: 'Active' }
    ]
  },
  {
    id: 'DRV-015',
    name: 'Bharat Singh',
    status: 'on-trip',
    rating: 4.6,
    trips: 854,
    safety: 96,
    skill: 90,
    fatigue: 18,
    fuel: 89,
    truck: 'CG-15-CD-7890',
    route: 'Kolkata → Bangalore',
    phone: '+91 98765 43224',
    recommendation: 'None',
    trainingStatus: 'Completed',
    bonusStatus: 'Not Eligible',
    violationsCount: { harshBraking: 0, overSpeeding: 0, tailgating: 0, hos: 0 },
    incidents: []
  }
];

// ---- AI AGENTS EXTENDED DETAILS ----
export const aiAgentsExtendedData = {
  finance: {
    thinkingConsole: [
      "[12:15:02] [Ledger Auditor] Scanning GatiFleet accounting ledger discrepancies...",
      "[12:15:05] [Compliance Check] Found GST reconciliation mismatch in vendor invoice IOC-2026-8923.",
      "[12:15:08] [Toll Scan] Re-auditing ₹2.3L discrepancy against FASTag toll gateway logs...",
      "[12:15:10] [Decision Engine] Optimal action path: Initiate penalty waiver for Wipro Transport (DIS-003)."
    ],
    activeTasks: [
      { task: "Reconciling FASTag toll transactions batch #77", status: "Active" },
      { task: "Auditing general ledger accounts receivable discrepancies", status: "Queued" },
      { task: "Processing driver monthly overtime benefits ledger", status: "Queued" }
    ],
    memoryState: [
      { key: "Target Discrepancy Limit", value: "₹10,000" },
      { key: "Active Ledger Balance", value: "₹14.2Cr" },
      { key: "GST Filing Status", value: "Q1 Filed on Time" }
    ],
    systemLogs: [
      "[SYSTEM] Automated toll sync complete (342 transactions matched).",
      "[SYSTEM] GST GSTR-2B ingestion batch matched (94.6% matching rate)."
    ],
    tools: [
      { name: "Run Toll Audit Scan", actionText: "Initiated toll ledger audit scan. Scanned 342 transactions, matched 100%, identified ₹23,000 discrepancy corrected statefully." },
      { name: "Process Fuel Payments", actionText: "Dispatched batch fuel card payouts. Transferred ₹8.4L in fuel tokens to HPCL & IOC fuel cards." },
      { name: "Verify GST Compliance", actionText: "Connects GSTN registers via API to matching tax credits under GSTR-2B discrepancies." },
      { name: "Detect Fuel Siphoning", actionText: "Checks truck fuel level gradients en-route vs fuel card coordinate entries." }
    ]
  },
  hr: {
    thinkingConsole: [
      "[12:16:14] [Telemetry Guard] Scanning driver telemetry for hours-of-service compliance...",
      "[12:16:17] [Fatigue Check] Warning detected: Driver Ashok Pandey (DRV-014) fatigue index at 75%.",
      "[12:16:19] [Roster Optimizer] Resolving roster gap for evening shift on Delhi → Mumbai route...",
      "[12:16:22] [Decision Engine] Optimal action path: Trigger mandatory 24h rest for Ashok Pandey."
    ],
    activeTasks: [
      { task: "Screening junior driver recruitment applications", status: "Active" },
      { task: "Auditing license expiry dates (12 warnings pending)", status: "Queued" },
      { task: "Generating shift roster for July 2026 routes", status: "Queued" }
    ],
    memoryState: [
      { key: "Driver Fatigue Threshold", value: "40%" },
      { key: "Active Workforce Size", value: "1,842 employees" },
      { key: "Roster Compliance Rate", value: "98.2%" }
    ],
    systemLogs: [
      "[SYSTEM] Driver check-in synced (1,678 present).",
      "[SYSTEM] Roster gaps resolved for Pune corridors."
    ],
    tools: [
      { name: "Scan License Expiries", actionText: "Audited employee credentials. Found 2 expiring licenses under 30 days. Dispatched auto-notification triggers." },
      { name: "Roster Shift Audit", actionText: "Executed roster check. Filled 3 shift vacancies on Western routes using standby drivers." },
      { name: "Run Fatigue Risk Scan", actionText: "Scans active driver hours and biometric stress scores for compliance." },
      { name: "Simulate Shift Dispatch", actionText: "Simulates driver dispatcher routing allocations matching fatigue schedules." }
    ]
  },
  sales: {
    thinkingConsole: [
      "[12:17:40] [Client Analytics] Analyzing VIP customer health indicators...",
      "[12:17:43] [Churn Scan] Dabur Distribution (CUS-008) churn risk at 85% due to 32.4% booking drop.",
      "[12:17:46] [Capacity Check] Checking lane capacity requirements for Godrej Consumer (CUS-007)...",
      "[12:17:49] [Decision Engine] Optimal action path: Release lane rebate code and notify account manager."
    ],
    activeTasks: [
      { task: "Qualifying 12 inbound leads from enterprise website", status: "Active" },
      { task: "Drafting contract renewal quote for Wipro Transport", status: "Queued" },
      { task: "Evaluating competitor spot rates (BlackBuck pitch alert)", status: "Queued" }
    ],
    memoryState: [
      { key: "Active Contracts Value", value: "₹248Cr" },
      { key: "VIP Client Churn Average", value: "3.2%" },
      { key: "Sales Conversion Target", value: "18.0%" }
    ],
    systemLogs: [
      "[SYSTEM] Pipeline opportunities synced (₹12.4Cr total).",
      "[SYSTEM] Client sentiment analytics updated (Godrej Consumer -> Negative)."
    ],
    tools: [
      { name: "Run Churn Analysis", actionText: "Executed customer retention model. Flagged Wipro and Dabur for high-risk alerts. Generated corrective rebate codes." },
      { name: "Generate Renewal Reminders", actionText: "Drafted and dispatched renewal terms for 8 expiring accounts." },
      { name: "Optimize Spot Rate Bids", actionText: "Optimized spot pricing rates against regional capacity corridors." },
      { name: "Analyze Competitor Intelligence", actionText: "Scraped and evaluated competitor freight bidding quotes." }
    ]
  },
  supply_chain: {
    thinkingConsole: [
      "[12:18:05] [Route Optimizer] Ingesting active GPS telemetry vectors for 487,621 trucks...",
      "[12:18:08] [Surat Bottleneck] Identifying bottleneck on NH-48 near Surat (speed drop to 12 km/h).",
      "[12:18:11] [Bypass Calculation] Calculating green route bypass via SH-14 corridor...",
      "[12:18:14] [Decision Engine] Optimal action path: Reroute 5 active trucks to bypass congestion."
    ],
    activeTasks: [
      { task: "Optimizing load matching for Mumbai JNPT Port cargo", status: "Active" },
      { task: "Recalculating demand forecasting maps for Gujarat routes", status: "Queued" },
      { task: "Tracking terminal delay estimates for Siliguri terminal", status: "Queued" }
    ],
    memoryState: [
      { key: "Target Truck Utilization", value: "88%" },
      { key: "Avg Route Efficiency Index", value: "86.5%" },
      { key: "Active Shipments in Transit", value: "89,432" }
    ],
    systemLogs: [
      "[SYSTEM] GPS telemetry tick complete (Ingestion rate: 45K p/sec).",
      "[SYSTEM] Surat terminal congestion detected (Delay weight: +1.5h)."
    ],
    tools: [
      { name: "Recalculate Route Optimization", actionText: "Rerouted 8 trucks around NH48 bottleneck. Estimated transit saving: 45 min per vehicle." },
      { name: "Match Idle Trucks", actionText: "Matched 14 idle trucks with pending cargo loads in Mumbai and Bangalore hubs." },
      { name: "Run Corridor Load Balance", actionText: "Balances lane volume distribution dynamically across major freight corridors." },
      { name: "Forecast Regional Demand", actionText: "Predicts regional capacity needs based on seasonal booking indicators." }
    ]
  },
  engineering: {
    thinkingConsole: [
      "[12:19:12] [System Monitor] Monitoring IoT tracking API p99 latency (target < 30ms)...",
      "[12:19:15] [Reefer Temp Alert] High temp alert (>12°C) resolved on reefer run (TRK-00028).",
      "[12:19:18] [Gateway Check] Preparing OTA firmware patch for GPS gateway devices...",
      "[12:19:21] [Decision Engine] Optimal action path: Dispatch firmware update batch to 12,000 devices."
    ],
    activeTasks: [
      { task: "Deploying security patch to central database clusters", status: "Active" },
      { task: "Auditing sensor health index (TRK-00019 axle alert resolved)", status: "Queued" },
      { task: "Optimizing Elasticsearch logging clusters storage index", status: "Queued" }
    ],
    memoryState: [
      { key: "Ingestion Server CPU", value: "42%" },
      { key: "Central API Latency (p99)", value: "23ms" },
      { key: "Active IoT Gateways", value: "3,124,500" }
    ],
    systemLogs: [
      "[SYSTEM] Gateway security scan complete (0 vulnerabilities).",
      "[SYSTEM] OTA firmware update successfully packaged for release."
    ],
    tools: [
      { name: "IoT Sensor Health Scan", actionText: "Poked 3,124,500 active telemetry sensors. Found 2 malfunctioning gateways; flagged for replacement." },
      { name: "Firmware Update Dispatch", actionText: "Sent firmware v3.4.1 to 12,000 active gateway devices. Install success: 99.8%." },
      { name: "Flush Database Logs", actionText: "Re-indexed system databases and compressed write-ahead log files, freeing up NVMe storage." },
      { name: "Autoscale Server Nodes", actionText: "Auto-scaled container replication factors to balance edge request traffic." }
    ]
  },
  executive: {
    thinkingConsole: [
      "[12:20:01] [Executive Aggregator] Aggregating performance reports from all enterprise departments...",
      "[12:20:04] [Revenue Match] Comparing monthly revenue targets (₹42.9M daily target achieved).",
      "[12:20:07] [Risk Audit] Evaluating risk landscape (expected fuel price increase of 4% next week)...",
      "[12:20:10] [Decision Engine] Optimal action path: Compile board-ready strategic summary report."
    ],
    activeTasks: [
      { task: "Drafting board performance dashboard reports", status: "Active" },
      { task: "Analyzing corporate strategic risk indices", status: "Queued" },
      { task: "Generating cost-containment guidance guidelines", status: "Queued" }
    ],
    memoryState: [
      { key: "System Operating Health", value: "99.97% Uptime" },
      { key: "Strategic Risk Index", value: "Low Risk" },
      { key: "Monthly Growth Trend", value: "+8.3%" }
    ],
    systemLogs: [
      "[SYSTEM] Department KPI synchronization complete.",
      "[SYSTEM] Executive board brief drafted and queued for CEO."
    ],
    tools: [
      { name: "Run Strategic Risk Assessment", actionText: "Scanned cost indicators. Confirmed fleet fuel spend efficiency optimal. Risk index locked at Low." },
      { name: "Generate Board Summary", actionText: "Compiled board-ready report for Q2. Uploaded to PDF server." },
      { name: "Analyze Market Competitors", actionText: "Scraped competitor shipping rates and identified peak corridor discount structures." },
      { name: "Optimize Capital Ratios", actionText: "Simulated capital reserves reallocation to optimize working capital cycles." }
    ]
  }
};


