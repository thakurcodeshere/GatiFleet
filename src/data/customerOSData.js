// ============================================================
// GatiFleet — Customer Operating System Data Layer
// Extended data for all 16 Customer OS tabs
// ============================================================

// ---- EVENT TAXONOMY (§43) ----
export const EVENT_TAXONOMY = [
  'ShipmentCreated','TruckAssigned','TripStarted','VehicleDelayed',
  'RouteChanged','PODUploaded','PODVerified','InvoiceGenerated',
  'PaymentReceived','SLAAtRisk','ClaimCreated','ContractRenewed',
  'CapacityReserved','BookingConfirmed','ExceptionDetected','AgentActionTaken',
];

// ---- SHIPMENT LIFECYCLE STAGES (§5) ----
export const SHIPMENT_STAGES = [
  { id: 'REQUESTED',       color: '#6b7280', icon: '📋' },
  { id: 'QUOTED',          color: '#3b82f6', icon: '💬' },
  { id: 'BOOKED',          color: '#8b5cf6', icon: '📦' },
  { id: 'CAPACITY_RESERVED', color: '#06b6d4', icon: '🏷️' },
  { id: 'ASSIGNED',        color: '#0ea5e9', icon: '🚛' },
  { id: 'DISPATCHED',      color: '#f59e0b', icon: '🟡' },
  { id: 'IN_TRANSIT',      color: '#f97316', icon: '🔵' },
  { id: 'AT_DESTINATION',  color: '#a855f7', icon: '📍' },
  { id: 'DELIVERED',       color: '#10b981', icon: '✅' },
  { id: 'POD_VERIFIED',    color: '#22c55e', icon: '🔏' },
  { id: 'BILLED',          color: '#06b6d4', icon: '🧾' },
  { id: 'PAID',            color: '#10b981', icon: '💰' },
  { id: 'CLOSED',          color: '#6b7280', icon: '🔒' },
];

// ---- AUTONOMY LEVELS (§35) ----
export const AUTONOMY_LEVELS = [
  { level: 0, label: 'Observe',                    desc: 'AI watches and logs only. No actions.' },
  { level: 1, label: 'Recommend',                  desc: 'AI suggests actions. Human approves all.' },
  { level: 2, label: 'Prepare Actions',            desc: 'AI drafts action plans for human review.' },
  { level: 3, label: 'Execute Low-Risk',           desc: 'AI auto-executes pre-approved low-risk ops.' },
  { level: 4, label: 'Execute Approved Categories', desc: 'AI runs full approved action categories.' },
  { level: 5, label: 'Continuous Optimization',    desc: 'AI optimizes autonomously within constraints.' },
];

// ---- ORGANIZATION HIERARCHY (§37) ----
export const ORG_HIERARCHY = {
  level: 'Enterprise', name: 'Tata Motors Logistics', children: [
    { level: 'Business Unit', name: 'Commercial Vehicles', children: [
      { level: 'Region', name: 'West India', children: [
        { level: 'Branch', name: 'Mumbai HQ', children: [
          { level: 'Warehouse', name: 'JNPT Dock Warehouse', children: [
            { level: 'Cost Center', name: 'CC-MW-001' },
          ]},
        ]},
        { level: 'Branch', name: 'Pune Plant', children: [
          { level: 'Warehouse', name: 'Pune Assembly WH', children: [] },
        ]},
      ]},
      { level: 'Region', name: 'North India', children: [
        { level: 'Branch', name: 'Delhi NCR', children: [
          { level: 'Warehouse', name: 'Gurgaon DC', children: [
            { level: 'Cost Center', name: 'CC-DN-001' },
          ]},
        ]},
      ]},
    ]},
  ],
};

// ---- USER ROLES (§36) ----
export const CUSTOMER_ROLES = [
  { id: 'customer_admin',      label: 'Customer Admin',      permissions: ['view','create','edit','approve','export','book','cancel','pay','negotiate','execute_ai'] },
  { id: 'logistics_manager',   label: 'Logistics Manager',   permissions: ['view','create','edit','book','cancel','export'] },
  { id: 'finance',             label: 'Finance',             permissions: ['view','approve','pay','export'] },
  { id: 'procurement',         label: 'Procurement',         permissions: ['view','create','negotiate','book','export'] },
  { id: 'warehouse',           label: 'Warehouse',           permissions: ['view','create','export'] },
  { id: 'executive',           label: 'Executive',           permissions: ['view','approve','export'] },
  { id: 'viewer',              label: 'Viewer',              permissions: ['view'] },
];

// ---- PERMISSION TYPES (§36) ----
export const PERMISSION_TYPES = ['view','create','edit','approve','export','book','cancel','pay','negotiate','execute_ai'];

// ---- NOTIFICATION EVENTS (§38) ----
export const NOTIFICATION_EVENTS = [
  { id: 'booking',          label: 'Booking Confirmed',      critical: false },
  { id: 'assignment',       label: 'Truck Assigned',         critical: false },
  { id: 'delay',            label: 'Shipment Delayed',       critical: true },
  { id: 'sla_breach',       label: 'SLA Breach',             critical: true },
  { id: 'invoice',          label: 'Invoice Generated',      critical: false },
  { id: 'payment',          label: 'Payment Received',       critical: false },
  { id: 'claim',            label: 'Claim Status Update',    critical: false },
  { id: 'contract_expiry',  label: 'Contract Expiring Soon', critical: true },
  { id: 'security_event',   label: 'Security Alert',         critical: true },
  { id: 'ai_recommendation', label: 'AI Recommendation',    critical: false },
];

// ---- INTEGRATION CATALOGUE (§39) ----
export const INTEGRATIONS = [
  { id: 'sap',      name: 'SAP ERP',          category: 'ERP',         status: 'Connected',    lastSync: '2026-08-13 13:45', version: 'v4.2', health: 98 },
  { id: 'oracle',   name: 'Oracle SCM',        category: 'ERP',         status: 'Connected',    lastSync: '2026-08-13 12:00', version: 'v3.1', health: 99 },
  { id: 'tally',    name: 'Tally Prime',       category: 'Finance',     status: 'Connected',    lastSync: '2026-08-13 10:00', version: 'v2.0', health: 97 },
  { id: 'wms',      name: 'Manhattan WMS',     category: 'Warehouse',   status: 'Connected',    lastSync: '2026-08-13 13:00', version: 'v5.1', health: 95 },
  { id: 'hdfc',     name: 'HDFC Bank API',     category: 'Banking',     status: 'Connected',    lastSync: '2026-08-13 13:50', version: 'v1.8', health: 100 },
  { id: 'gps_main', name: 'Rosmerta GPS',      category: 'Telematics',  status: 'Connected',    lastSync: '2026-08-13 13:55', version: 'v3.4', health: 96 },
  { id: 'iot',      name: 'Bosch IoT Suite',   category: 'IoT',         status: 'Configured',   lastSync: '2026-08-12 09:00', version: 'v2.1', health: 88 },
  { id: 'msft',     name: 'Microsoft 365',     category: 'Productivity', status: 'Connected',   lastSync: '2026-08-13 14:00', version: 'v1.0', health: 100 },
  { id: 'hrms',     name: 'Darwinbox HRMS',    category: 'HR',          status: 'Disconnected', lastSync: '2026-08-10 08:00', version: 'v1.5', health: 0 },
  { id: 'gstn',     name: 'GSTN Portal',       category: 'Tax',         status: 'Connected',    lastSync: '2026-08-13 11:30', version: 'v2.3', health: 99 },
];

// ---- MOCK SHIPMENTS (§5, §10) ----
export const MOCK_SHIPMENTS = [
  {
    id: 'SHP-8821', route: 'Mumbai → Delhi', origin: 'JNPT, Mumbai', destination: 'Gurgaon DC, Delhi',
    cargo: 'Auto Components', weight: '18 MT', volume: '240 CFT', value: '₹42.6 L',
    status: 'IN_TRANSIT', stage: 6, driver: 'Ramesh Kumar', vehicle: 'MH-12-AB-4421',
    carrier: 'GatiFleet Primary', distance: '1,421 km', eta: '2026-08-14 08:30',
    slaRisk: 'Low', otd: 97, contractRef: 'CF-9281',
    exceptions: [], aiRec: 'On track — no action required.',
    events: [
      { time: '08:10', event: 'Booking Created', location: 'Mumbai HQ', type: 'ShipmentCreated' },
      { time: '09:42', event: 'Truck Assigned — MH-12-AB-4421', location: 'Mumbai Depot', type: 'TruckAssigned' },
      { time: '11:15', event: 'Trip Started', location: 'JNPT Gate', type: 'TripStarted' },
      { time: '13:28', event: 'NH48 Toll Crossed', location: 'Vadodara Toll', type: 'Waypoint' },
      { time: '16:40', event: 'ETA Recalculated → 08:30', location: 'Udaipur Bypass', type: 'ETAUpdated' },
    ],
  },
  {
    id: 'SHP-8822', route: 'Pune → Bangalore', origin: 'Pune Plant', destination: 'Bangalore Depot',
    cargo: 'Finished Vehicles', weight: '28 MT', volume: '480 CFT', value: '₹1.8 Cr',
    status: 'DELAYED', stage: 6, driver: 'Suresh Patil', vehicle: 'MH-14-CD-6612',
    carrier: 'GatiFleet Express', distance: '836 km', eta: '2026-08-13 22:00',
    slaRisk: 'High', otd: 82, contractRef: 'CF-9281',
    exceptions: [{ type: 'Traffic Delay', reason: 'NH4 accident near Satara', etaDelta: '+2.5h', cost: '₹0' }],
    aiRec: 'Reroute via Kolhapur bypass — saves 1.8h.',
    events: [
      { time: '06:00', event: 'Trip Started', location: 'Pune Plant Gate', type: 'TripStarted' },
      { time: '09:15', event: 'Traffic Detected — NH4 accident', location: 'Satara Bypass', type: 'VehicleDelayed' },
      { time: '09:22', event: 'Route Change Recommended by AI', location: 'System', type: 'RouteChanged' },
    ],
  },
  {
    id: 'SHP-8819', route: 'Delhi → Jaipur', origin: 'Gurgaon DC', destination: 'Jaipur Warehouse',
    cargo: 'Spare Parts', weight: '8 MT', volume: '120 CFT', value: '₹12.4 L',
    status: 'DELIVERED', stage: 8, driver: 'Ajay Singh', vehicle: 'HR-26-EF-9901',
    carrier: 'GatiFleet Primary', distance: '282 km', eta: '2026-08-13 11:00',
    slaRisk: 'None', otd: 100, contractRef: 'CF-9281',
    exceptions: [],
    aiRec: 'POD upload pending — trigger verification.',
    events: [
      { time: '06:00', event: 'Trip Started', location: 'Gurgaon DC', type: 'TripStarted' },
      { time: '10:48', event: 'Arrived at Destination', location: 'Jaipur WH', type: 'AT_DESTINATION' },
      { time: '11:02', event: 'Delivery Completed', location: 'Jaipur WH', type: 'DELIVERED' },
    ],
  },
  {
    id: 'SHP-8815', route: 'Chennai → Hyderabad', origin: 'Chennai Port', destination: 'HYD Assembly Plant',
    cargo: 'CKD Kits', weight: '22 MT', volume: '380 CFT', value: '₹86 L',
    status: 'POD_VERIFIED', stage: 9, driver: 'Krishnamurthy R', vehicle: 'TN-22-GH-5544',
    carrier: 'GatiFleet South', distance: '626 km', eta: 'Delivered',
    slaRisk: 'None', otd: 98, contractRef: 'CF-9281',
    exceptions: [],
    aiRec: 'Invoice generation ready — all POD fields verified.',
    events: [],
  },
  {
    id: 'SHP-8810', route: 'Kolkata → Guwahati', origin: 'Kolkata DC', destination: 'Guwahati Plant',
    cargo: 'Engine Parts', weight: '15 MT', volume: '200 CFT', value: '₹38 L',
    status: 'BILLED', stage: 10, driver: 'Bikram Das', vehicle: 'WB-06-IJ-1122',
    carrier: 'GatiFleet East', distance: '1,014 km', eta: 'Delivered',
    slaRisk: 'None', otd: 89, contractRef: 'CF-9281',
    exceptions: [],
    aiRec: 'Invoice INV-4823 awaiting approval — ₹38L.',
    events: [],
  },
];

// ---- MOCK QUOTES (§16) ----
export const MOCK_QUOTES = [
  {
    id: 'QT-2241', lane: 'Mumbai → Delhi', date: '2026-08-12', status: 'Active',
    contractRate: '₹42/km', spotRate: '₹48/km', prevRate: '₹40/km', aiRec: '₹44/km',
    validity: '2026-08-20', cargo: 'Auto Components', vehicleType: 'Container 40FT',
  },
  {
    id: 'QT-2238', lane: 'Pune → Bangalore', date: '2026-08-10', status: 'Accepted',
    contractRate: '₹38/km', spotRate: '₹45/km', prevRate: '₹37/km', aiRec: '₹40/km',
    validity: '2026-08-18', cargo: 'Finished Vehicles', vehicleType: 'Car Carrier',
  },
  {
    id: 'QT-2230', lane: 'Delhi → Jaipur', date: '2026-08-05', status: 'Rejected',
    contractRate: '₹35/km', spotRate: '₹41/km', prevRate: '₹35/km', aiRec: '₹36/km',
    validity: 'Expired', cargo: 'Spare Parts', vehicleType: 'Open Body 14W',
  },
  {
    id: 'QT-2225', lane: 'Kolkata → Guwahati', date: '2026-08-01', status: 'Negotiated',
    contractRate: '₹44/km', spotRate: '₹52/km', prevRate: '₹42/km', aiRec: '₹46/km',
    validity: '2026-08-25', cargo: 'Engine Parts', vehicleType: 'Trailer 20W',
  },
];

// ---- MOCK DOCUMENTS (§19) ----
export const MOCK_DOCUMENTS = [
  { id: 'DOC-5501', type: 'Invoice',          shipmentId: 'SHP-8815', number: 'INV-4819', date: '2026-08-11', amount: '₹86 L',  gst: '₹15.48 L', status: 'Verified', confidence: 99 },
  { id: 'DOC-5502', type: 'POD',              shipmentId: 'SHP-8815', number: 'POD-8815', date: '2026-08-12', amount: null,     gst: null,         status: 'Verified', confidence: 97, receiver: 'Suresh Nair', signature: true, location: 'HYD Plant Gate' },
  { id: 'DOC-5503', type: 'LR',               shipmentId: 'SHP-8821', number: 'LR-44201', date: '2026-08-13', amount: '₹42.6 L',gst: '₹7.67 L',   status: 'Active',   confidence: 100 },
  { id: 'DOC-5504', type: 'E-Way Bill',       shipmentId: 'SHP-8821', number: 'EWB-99182', date: '2026-08-13', amount: null,    gst: null,         status: 'Active',   confidence: 100, expiry: '2026-08-16' },
  { id: 'DOC-5505', type: 'Weighbridge Slip', shipmentId: 'SHP-8822', number: 'WB-Pune-441', date: '2026-08-13', amount: null,  gst: null,         status: 'Filed',    confidence: 100 },
  { id: 'DOC-5506', type: 'Insurance',        shipmentId: 'SHP-8822', number: 'INS-MH-2026', date: '2026-08-01', amount: null,  gst: null,         status: 'Active',   confidence: 100, expiry: '2026-12-31' },
  { id: 'DOC-5507', type: 'Vehicle RC',       shipmentId: null,        number: 'MH-12-AB-4421-RC', date: '2024-01-01', amount: null, gst: null,   status: 'Valid',    confidence: 100, expiry: '2028-01-01' },
  { id: 'DOC-5508', type: 'Driver License',   shipmentId: null,        number: 'MH-DL-82441', date: '2020-06-01', amount: null,  gst: null,        status: 'Valid',    confidence: 100, expiry: '2030-06-01' },
  { id: 'DOC-5509', type: 'Delivery Receipt', shipmentId: 'SHP-8819', number: 'DR-8819',   date: '2026-08-13', amount: '₹12.4 L',gst: '₹2.23 L',  status: 'Filed',    confidence: 100 },
  { id: 'DOC-5510', type: 'Contract',         shipmentId: null,        number: 'CF-9281',   date: '2026-01-01', amount: '₹9.8 Cr/yr', gst: null,  status: 'Active',   confidence: 100, expiry: '2026-12-31' },
];

// ---- MOCK CLAIMS (§25) ----
export const MOCK_CLAIMS = [
  {
    id: 'CLM-441', type: 'Delay', shipmentId: 'SHP-8822', date: '2026-08-13',
    amount: '₹2.4 L', status: 'Under Review', stage: 3,
    stages: ['Filed','AI Classification','Contract Verification','Responsibility Analysis','Insurance Verification','Approval','Settlement','Closed'],
    reason: 'NH4 accident caused 3.5h delay — SLA breach of 2.5h. Penalty applicable per contract clause 8.2.',
    evidence: ['SHP-8822 telemetry log', 'NH4 accident report', 'Contract CF-9281 SLA clause 8.2'],
    contractRef: 'CF-9281', insuranceRef: 'INS-MH-2026',
    responsibleParty: 'External/Traffic', aiClassification: 'Force Majeure — Partial',
  },
  {
    id: 'CLM-438', type: 'Temperature Violation', shipmentId: 'SHP-8810', date: '2026-08-11',
    amount: '₹8.6 L', status: 'Approved', stage: 6,
    stages: ['Filed','AI Classification','Contract Verification','Responsibility Analysis','Insurance Verification','Approval','Settlement','Closed'],
    reason: 'Reefer unit temperature deviation detected between Siliguri and Guwahati. Cargo partially damaged.',
    evidence: ['IoT temperature log', 'Cargo inspection photos', 'Reefer maintenance records'],
    contractRef: 'CF-9281', insuranceRef: 'INS-MH-2026',
    responsibleParty: 'GatiFleet Fleet', aiClassification: 'Carrier Liability',
  },
];

// ---- MOCK EXCEPTIONS (§14) ----
export const MOCK_EXCEPTIONS = [
  {
    id: 'EXC-991', type: 'Traffic Delay', severity: 'High', shipmentId: 'SHP-8822',
    detected: '2026-08-13 09:15', what: 'Vehicle stopped for 45 min on NH4 near Satara.',
    why: 'Major accident blocking all 3 lanes. Police clearance ongoing.',
    next: 'Current ETA shifts by +2.5h. SLA breach probability: 78%.',
    cost: '₹0 direct. SLA penalty exposure: ₹2.4L.',
    options: [
      { label: 'Continue current route', etaDelta: '+2.5h', addCost: '₹0',    confidence: 92 },
      { label: 'Reroute via Kolhapur bypass', etaDelta: '+0.8h', addCost: '₹1,800', confidence: 86 },
      { label: 'Transfer to standby truck at Satara depot', etaDelta: '-0.5h', addCost: '₹5,200', confidence: 74 },
    ],
    autonomyPolicyGate: 'auto_reroute',
  },
  {
    id: 'EXC-988', type: 'GPS Failure', severity: 'Medium', shipmentId: 'SHP-8821',
    detected: '2026-08-13 12:40', what: 'GPS signal lost for 18 minutes between Vadodara and Surat.',
    why: 'Network dead zone on NH48 near Bharuch. Device reconnected at 12:58.',
    next: 'Tracking restored. Last known location confirmed. ETA unaffected.',
    cost: '₹0',
    options: [
      { label: 'Continue monitoring — gap filled by cell-tower triangulation', etaDelta: '0', addCost: '₹0', confidence: 95 },
    ],
    autonomyPolicyGate: null,
  },
  {
    id: 'EXC-985', type: 'SLA Risk', severity: 'Low', shipmentId: 'SHP-8810',
    detected: '2026-08-12 14:00', what: 'Invoice generation pending 48h beyond POD verification.',
    why: 'Finance team approval queue backlog — 3 invoices ahead.',
    next: 'Invoice SLA breach in 6 hours.',
    cost: '₹0 penalty if resolved within 6h.',
    options: [
      { label: 'Escalate to Finance Manager', etaDelta: 'N/A', addCost: '₹0', confidence: 90 },
      { label: 'Auto-approve if under threshold (AI Level 3)', etaDelta: 'N/A', addCost: '₹0', confidence: 85 },
    ],
    autonomyPolicyGate: 'auto_approve_invoice',
  },
];

// ---- MOCK ANALYTICS DATA (§28) ----
export const ANALYTICS_DATA = {
  otdTrend: [
    { month: 'Mar', otd: 94.2 }, { month: 'Apr', otd: 95.8 }, { month: 'May', otd: 96.4 },
    { month: 'Jun', otd: 97.1 }, { month: 'Jul', otd: 97.2 }, { month: 'Aug', otd: 96.8 },
  ],
  spendTrend: [
    { month: 'Mar', spend: 7.8 }, { month: 'Apr', spend: 8.2 }, { month: 'May', spend: 7.6 },
    { month: 'Jun', spend: 8.8 }, { month: 'Jul', spend: 9.4 }, { month: 'Aug', spend: 9.1 },
  ],
  lanePerformance: [
    { lane: 'Mumbai → Delhi',    trips: 84, avgOTD: 97.2, avgCostKm: 42, emissionsTrip: 2.4, avgDelayMin: 18 },
    { lane: 'Pune → Bangalore',  trips: 62, avgOTD: 93.8, avgCostKm: 38, emissionsTrip: 1.9, avgDelayMin: 42 },
    { lane: 'Delhi → Jaipur',    trips: 148, avgOTD: 99.1, avgCostKm: 35, emissionsTrip: 0.9, avgDelayMin: 6 },
    { lane: 'Kolkata → Guwahati', trips: 38, avgOTD: 87.4, avgCostKm: 44, emissionsTrip: 2.8, avgDelayMin: 88 },
    { lane: 'Chennai → Hyderabad', trips: 56, avgOTD: 96.2, avgCostKm: 40, emissionsTrip: 1.6, avgDelayMin: 22 },
  ],
  carrierPerformance: [
    { carrier: 'GatiFleet Primary', trips: 182, otd: 97.8, incidents: 2, score: 94 },
    { carrier: 'GatiFleet Express', trips: 98,  otd: 94.1, incidents: 6, score: 86 },
    { carrier: 'GatiFleet South',   trips: 56,  otd: 96.2, incidents: 3, score: 91 },
    { carrier: 'GatiFleet East',    trips: 38,  otd: 87.4, incidents: 9, score: 74 },
  ],
  driverPerformance: [
    { driver: 'Ramesh Kumar',   trips: 42, safetyScore: 91, fuelEfficiency: '88%', fatigue: 'Low' },
    { driver: 'Suresh Patil',   trips: 38, safetyScore: 84, fuelEfficiency: '82%', fatigue: 'Medium' },
    { driver: 'Ajay Singh',     trips: 56, safetyScore: 96, fuelEfficiency: '93%', fatigue: 'Low' },
    { driver: 'Bikram Das',     trips: 28, safetyScore: 78, fuelEfficiency: '79%', fatigue: 'High' },
  ],
  emptyKmTrend: [
    { month: 'Mar', pct: 14.2 }, { month: 'Apr', pct: 12.8 }, { month: 'May', pct: 11.4 },
    { month: 'Jun', pct: 10.6 }, { month: 'Jul', pct: 9.8 }, { month: 'Aug', pct: 9.2 },
  ],
  sustainability: { fuelConsumption: '82,400 L/mo', co2Total: '221 MT/mo', co2PerTrip: '1.94 MT', co2PerLane: { 'Mumbai → Delhi': '2.4 MT', 'Pune → Bangalore': '1.9 MT', 'Kolkata → Guwahati': '2.8 MT' } },
  warehousePerformance: [
    { warehouse: 'JNPT Dock WH', utilization: 88, avgDwell: '4.2h', incidents: 1 },
    { warehouse: 'Gurgaon DC',   utilization: 76, avgDwell: '3.1h', incidents: 0 },
    { warehouse: 'Pune Assembly', utilization: 92, avgDwell: '5.8h', incidents: 2 },
  ],
};

// ---- AI AGENTS STATUS (§30) ----
export const AI_AGENTS = [
  { id: 'logistics', name: 'Logistics Agent',   icon: '🚛', domain: 'Routing & shipment optimization',     confidence: 91, lastAction: 'Rerouted SHP-8822 via Kolhapur bypass', recommendations: 3, status: 'Active' },
  { id: 'cost',      name: 'Cost Agent',         icon: '💰', domain: 'Cost reduction & efficiency',          confidence: 88, lastAction: 'Detected ₹4.7L savings on lane consolidation', recommendations: 2, status: 'Active' },
  { id: 'procurement', name: 'Procurement Agent', icon: '📋', domain: 'Capacity & rate optimization',        confidence: 85, lastAction: 'Recommended contract renegotiation for Kolkata lane', recommendations: 1, status: 'Active' },
  { id: 'finance',   name: 'Finance Agent',       icon: '📊', domain: 'Billing & payment intelligence',      confidence: 94, lastAction: 'Flagged INV-4823 for unusual fuel surcharge', recommendations: 2, status: 'Active' },
  { id: 'sla',       name: 'SLA Agent',           icon: '🎯', domain: 'Contract performance monitoring',     confidence: 96, lastAction: 'Raised SLA risk on SHP-8822 — penalty exposure ₹2.4L', recommendations: 1, status: 'Active' },
  { id: 'risk',      name: 'Risk Agent',           icon: '⚡', domain: 'Operational risk forecasting',       confidence: 89, lastAction: 'Monsoon risk advisory for Guwahati corridor', recommendations: 4, status: 'Active' },
  { id: 'executive', name: 'Executive Agent',     icon: '🏆', domain: 'Strategic intelligence & portfolio',  confidence: 82, lastAction: 'Generated monthly transport ROI report', recommendations: 1, status: 'Standby' },
  { id: 'sustainability', name: 'Sustainability Agent', icon: '🌱', domain: 'Environmental optimization', confidence: 87, lastAction: 'CO₂ reduction plan: route consolidation saves 18 MT/mo', recommendations: 2, status: 'Active' },
];

// ---- NETWORK LOCATIONS (§32) ----
export const NETWORK_LOCATIONS = [
  { id: 'LOC-01', name: 'JNPT Dock Warehouse',   type: 'Warehouse', city: 'Mumbai',    lat: 18.95, lng: 72.95, shipmentsMonth: 84, avgDwell: '4.2h' },
  { id: 'LOC-02', name: 'Pune Assembly Plant',    type: 'Plant',     city: 'Pune',      lat: 18.52, lng: 73.86, shipmentsMonth: 62, avgDwell: '5.8h' },
  { id: 'LOC-03', name: 'Gurgaon Distribution DC', type: 'DC',      city: 'Delhi',     lat: 28.45, lng: 77.03, shipmentsMonth: 148, avgDwell: '3.1h' },
  { id: 'LOC-04', name: 'Jaipur Plant Warehouse', type: 'Warehouse', city: 'Jaipur',   lat: 26.92, lng: 75.82, shipmentsMonth: 44, avgDwell: '2.8h' },
  { id: 'LOC-05', name: 'Kolkata Distribution Hub', type: 'DC',     city: 'Kolkata',   lat: 22.57, lng: 88.36, shipmentsMonth: 38, avgDwell: '6.1h' },
  { id: 'LOC-06', name: 'Guwahati Assembly Plant', type: 'Plant',   city: 'Guwahati', lat: 26.14, lng: 91.74, shipmentsMonth: 38, avgDwell: '7.2h' },
  { id: 'LOC-07', name: 'Chennai Port DC',         type: 'DC',      city: 'Chennai',  lat: 13.08, lng: 80.27, shipmentsMonth: 56, avgDwell: '8.4h' },
  { id: 'LOC-08', name: 'Hyderabad Assembly',      type: 'Plant',   city: 'Hyderabad', lat: 17.38, lng: 78.49, shipmentsMonth: 56, avgDwell: '4.6h' },
];

// ---- DIGITAL TWIN SIMULATION SCENARIOS (§33) ----
export const SIMULATION_SCENARIOS = [
  { id: 'vol_up25',   label: 'Volume +25%',         param: 'volume',  delta: 25,   unit: '%'  },
  { id: 'diesel_10',  label: 'Diesel +10%',          param: 'diesel',  delta: 10,   unit: '%'  },
  { id: 'no_gf_east', label: 'Remove GatiFleet East', param: 'carrier', delta: null, unit: 'carrier' },
  { id: 'siliguri_relay', label: 'Add Siliguri Relay', param: 'relay',  delta: null, unit: 'location' },
  { id: 'vol_down15', label: 'Volume -15%',          param: 'volume',  delta: -15,  unit: '%'  },
];

// ---- SELF-EVOLUTION LOOP STEPS (§34) ----
export const SELF_EVOLUTION_STEPS = [
  { step: 1,  label: 'OBSERVE',          desc: 'Ingest live telemetry, events, and outcomes.' },
  { step: 2,  label: 'DETECT PATTERN',   desc: 'Statistical analysis identifies recurring anomaly.' },
  { step: 3,  label: 'IDENTIFY PROBLEM', desc: 'Problem scoped to specific route, carrier, or process.' },
  { step: 4,  label: 'ROOT CAUSE',       desc: '5-Whys analysis traces back to primary cause.' },
  { step: 5,  label: 'HYPOTHESIS',       desc: 'AI generates improvement hypotheses.' },
  { step: 6,  label: 'SIMULATE',         desc: 'Digital Twin runs all hypothesis scenarios.' },
  { step: 7,  label: 'RECOMMEND',        desc: 'Best option ranked by cost, SLA, and risk.' },
  { step: 8,  label: 'APPROVE',          desc: 'Human or authorized AI approves recommendation.' },
  { step: 9,  label: 'EXECUTE',          desc: 'Workflow updated; routing strategy changed.' },
  { step: 10, label: 'MEASURE',          desc: 'Real-world outcome tracked over 30 days.' },
  { step: 11, label: 'VERIFY',           desc: 'Predicted vs actual compared and scored.' },
  { step: 12, label: 'LEARN',            desc: 'Model updated with verified outcome data.' },
  { step: 13, label: 'UPDATE KNOWLEDGE', desc: 'Knowledge Graph node relationships refreshed.' },
  { step: 14, label: 'IMPROVE WORKFLOW', desc: 'New heuristics applied to future dispatching.' },
];

// ---- KOLKATA→GUWAHATI CASE STUDY (§45) ----
export const KGW_CASE_STUDY = {
  observation: 'Kolkata → Guwahati corridor missed SLA 12 of last 38 trips (68% breach rate).',
  rootCause: 'Siliguri bottleneck (avg +3.2h) + driver fatigue after 820km non-stop run.',
  strategies: [
    { option: 'A', label: 'Continue current route', slaImprovement: '0%',   costDelta: '₹0', risk: 'High' },
    { option: 'B', label: 'Siliguri relay depot',   slaImprovement: '84%',  costDelta: '+₹4,200/trip', risk: 'Low' },
    { option: 'C', label: 'Additional truck capacity', slaImprovement: '61%', costDelta: '+₹18,000/trip', risk: 'Medium' },
  ],
  aiRecommendation: 'Option B — Siliguri relay depot. SLA recovery from 68% breach to projected 6% breach.',
  status: 'Approved & Executing',
  outcomeTracking: '8 trips post-implementation — 7 on-time (87.5% OTD vs 31.6% before).',
  confidenceImprovement: '+14 points on Kolkata→Guwahati prediction model.',
};

// ---- HELPER: Price Calculation Engine (§7) ----
export function calculateFreightCost({ distanceKm, weightMT, vehicleType, contractAdjPct = 0, fuelBaseline = 91, fuelCurrent = 96 }) {
  const baseRate = vehicleType === 'Container 40FT' ? 42 : vehicleType === 'Car Carrier' ? 52 : vehicleType === 'Trailer 20W' ? 44 : 38;
  const baseFright = Math.round(distanceKm * baseRate * (weightMT / 25));
  const fuelDelta = ((fuelCurrent - fuelBaseline) / fuelBaseline);
  const fuelSurcharge = Math.round(baseFright * 0.08 * (1 + fuelDelta));
  const toll = Math.round(distanceKm * 2.4);
  const loading = 1800;
  const unloading = 1800;
  const detention = 0;
  const specialService = 0;
  const discount = Math.round(baseFright * 0.03);
  const contractAdj = Math.round(baseFright * (contractAdjPct / 100));
  const taxable = baseFright + fuelSurcharge + toll + loading + unloading + detention + specialService - discount - contractAdj;
  const gst = Math.round(taxable * 0.18);
  const total = taxable + gst;
  return {
    baseFright, fuelSurcharge, toll, loading, unloading, detention, specialService,
    discount, contractAdj, taxable, gst, total,
    formula: `Base(${distanceKm}km × ₹${baseRate}/km × ${weightMT}MT/25) + FuelSurcharge(8% × fuel_delta_${((fuelDelta)*100).toFixed(1)}%) + Toll(₹2.4/km) + Handling - Discount(3%) - ContractAdj(${contractAdjPct}%) + GST(18%)`,
    contractRef: 'CF-9281',
    calculationVersion: 'v2.4.1',
    timestamp: new Date().toISOString(),
    fuelBaseline, fuelCurrent,
  };
}

export function formatINR(val) {
  if (val >= 10000000) return `₹${(val/10000000).toFixed(2)} Cr`;
  if (val >= 100000)   return `₹${(val/100000).toFixed(2)} L`;
  if (val >= 1000)     return `₹${(val/1000).toFixed(1)}K`;
  return `₹${val}`;
}
