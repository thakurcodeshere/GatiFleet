/* eslint-disable */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Line, Bar } from 'react-chartjs-2';
import {
  Calendar, MapPin, Filter, Layers, RefreshCw, Download,
  Sparkles, Zap, ShieldCheck, CheckCircle, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Info, Eye, ExternalLink,
  IndianRupee, Gauge, Clock, Truck, Fuel, Users, Cpu, FileText,
  X, Maximize2, Minimize2, Network, Brain, Scale, Activity
} from 'lucide-react';

const segmentConfigs = {
  revenueToday: {
    title: 'Revenue Today Analytics & Dynamic Tariff Intelligence',
    metric: '₹42.9M',
    unit: '₹ Millions',
    trend: '+8.3%',
    trendUp: true,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    systemEngine: 'Autonomous Revenue Intelligence Engine (ARIE) & RABIP',
    businessGoal: 'Protect gross operational margins, dynamically optimize fuel/toll surcharges, and eliminate billing leakage across all contract corridors.',
    userIntent: 'Monitor real-time cash inflows, validate tariff calculations against telemetry logs, and auto-reconcile freight disputes.',
    l1Events: [
      { name: 'REVENUE_EVENT_PROCESSED', desc: 'Emitted upon IoT delivery confirmation and telemetry validation.' },
      { name: 'TARIFF_SURCHARGE_RECALCULATED', desc: 'Emitted when diesel/CNG index triggers dynamic rate adjustment.' },
      { name: 'BILLING_DISPUTE_RAISED', desc: 'Emitted when customer detention claim triggers automated audit.' },
      { name: 'INVOICE_AUTO_RECONCILED', desc: 'Emitted when payment matches double-entry ERP ledger record.' }
    ],
    knowledgeGraphNodes: [
      { from: 'Customer (CUS-1042)', rel: 'Has Active Contract', to: 'Contract (CTR-8921)' },
      { from: 'Contract (CTR-8921)', rel: 'Defines Surcharge Formula', to: 'Fuel Index (WTI/Diesel)' },
      { from: 'Shipment (SHP-99201)', rel: 'Generates Billing Line', to: 'Invoice (INV-44120)' },
      { from: 'Invoice (INV-44120)', rel: 'Synchronizes Ledger', to: 'ERP Financial Twin' }
    ],
    digitalTwinBrains: [
      { name: 'Commercial Brain', status: 'Optimal', detail: 'Tracks ACV, gross margin, and expansion ARR across 12 product lines.' },
      { name: 'Financial Brain', status: 'Synchronized', detail: 'Models AR, credit limits, dispute reserve caps, and tax allocations.' },
      { name: 'Learning Brain', status: 'Active', detail: 'Retrains tariff concession models based on historical customer payment velocity.' }
    ],
    policyGuardrails: [
      { rule: 'Exposure Limit Check', threshold: '< ₹5.0M unbilled', status: 'PASS' },
      { rule: 'Margin Floor Guard', threshold: 'Min 18.5% Gross Margin', status: 'ENFORCED' },
      { rule: 'Dispute Settlement Approval', threshold: 'Auto-approve < ₹25,000', status: 'ACTIVE' }
    ],
    calculationFormula: 'Daily Revenue = ∑ (Base Freight Rate + Dynamic Fuel Surcharge + Toll Clearance + Detention Fee) - Contractual Rebates',
    featuresTitle: 'Revenue Features & Surcharge Control',
    features: [
      { name: 'Dynamic Fuel Surcharge Optimizer', desc: 'Auto-adjusts tariff contracts based on daily WTI & IndianOil diesel indices.', status: 'Active (Auto-calc)', actionText: 'Re-run Surcharge Engine' },
      { name: 'Freight Dispute Auto-Resolver', desc: 'Cross-checks detention claims with IoT GPS & FASTag toll timestamps.', status: '3 Pending Audits', actionText: 'Audit Disputes' },
      { name: 'Contract Margin Leakage Monitor', desc: 'Flags lanes delivering under the 18.5% minimum gross margin floor.', status: '98.2% Margin Health', actionText: 'View Margin Heatmap' },
      { name: 'Automated Invoice Reconciliation', desc: 'Syncs SAP/Tally ERP cash receipts with double-entry GatiFleet ledger.', status: '100% Synced', actionText: 'Generate Ledger PDF' }
    ]
  },

  fleetUtilization: {
    title: 'Fleet Utilization & Capacity Rebalancing Engine',
    metric: '87.4%',
    unit: 'Utilization %',
    trend: '+2.1%',
    trendUp: true,
    color: '#16a34a',
    gradient: 'linear-gradient(135deg, #16a34a, #10b981)',
    systemEngine: 'Autonomous Transportation Planning & Dispatch System (ATPDS)',
    businessGoal: 'Maximize loaded asset operational hours while minimizing deadhead transit kilometers and idle depot turnaround times.',
    userIntent: 'Identify underutilized corridors, auto-rebalance fleet standby units, and optimize inter-state load matching.',
    l1Events: [
      { name: 'FLEET_DISPATCHED', desc: 'Emitted when truck exits origin geofence with assigned manifest.' },
      { name: 'CONTAINER_LOADED', desc: 'Emitted when door sensor and RFID scan confirm cargo loading.' },
      { name: 'DEPOT_BAY_RELEASED', desc: 'Emitted when loading dock slot signals completion.' },
      { name: 'IDLE_TIME_ALERT', desc: 'Emitted when vehicle remains unassigned > 120 minutes.' }
    ],
    knowledgeGraphNodes: [
      { from: 'Truck (TRK-08420)', rel: 'Traverses Corridor', to: 'NH48 Western Route' },
      { from: 'NH48 Western Route', rel: 'Connects Depots', to: 'Mumbai Cross-Dock' },
      { from: 'Mumbai Cross-Dock', rel: 'Allocates Fleet Buffer', to: 'Reefer Dedicated Slot' },
      { from: 'Reefer Dedicated Slot', rel: 'Feeds Telemetry', to: 'ATPDS Solver Engine' }
    ],
    digitalTwinBrains: [
      { name: 'Operational Brain', status: 'Optimal', detail: 'Tracks live asset status, deadhead ratio, and turnaround cycles.' },
      { name: 'Logistics Brain', status: 'Optimizing', detail: 'Simulates 24-hour forward load balance to eliminate backhaul empties.' },
      { name: 'Physical Brain', status: 'Synchronized', detail: 'Monitors container door seals, load weight sensors, and trailer tire pressures.' }
    ],
    policyGuardrails: [
      { rule: 'Maximum Deadhead Buffer', threshold: '< 8% total mileage', status: 'PASS' },
      { rule: 'Turnaround Window Guard', threshold: '< 90 mins at Cross-Dock', status: 'ENFORCED' },
      { rule: 'Driver Rest Compliance', threshold: 'Mandatory 8h per 14h shift', status: 'ACTIVE' }
    ],
    calculationFormula: 'Fleet Utilization % = (Active Loaded Moving Hours / Total Available Capacity Hours) × 100',
    featuresTitle: 'Fleet Capacity & Logistics Operations',
    features: [
      { name: 'Corridor Capacity Heatmap', desc: 'Identifies high-density freight corridors and empty return backhauls.', status: 'NH48 at 92.1%', actionText: 'View Corridor Map' },
      { name: 'Standby Asset Auto-Rebalancer', desc: 'Dispatches idle standby trailers to high-demand cross-dock terminals.', status: '14 Units Staged', actionText: 'Trigger Rebalance' },
      { name: 'Depot Turnaround Predictor', desc: 'Monitors loading dock dwell times to enforce 90-minute bay turnaround.', status: 'Avg 64 min Dwell', actionText: 'Inspect Dock Bays' },
      { name: 'Deadhead Kilometer Minimizer', desc: 'Calculates shortest route linkages to limit empty runs below 8%.', status: '5.8% Deadhead', actionText: 'Optimize Backhauls' }
    ]
  },

  onTimeDelivery: {
    title: 'On-Time Delivery (OTD) & Predictive Delay Mitigation',
    metric: '94.2%',
    unit: 'SLA Pass %',
    trend: '+1.8%',
    trendUp: true,
    color: '#2563eb',
    gradient: 'linear-gradient(135deg, #2563eb, #06b6d4)',
    systemEngine: 'Autonomous Customer Operations Intelligence Platform (ACOIP)',
    businessGoal: 'Predict delivery delays 4 hours before SLA breach and execute autonomous rerouting to maintain 95%+ OTD.',
    userIntent: 'Track live trip variances, mitigate route bottlenecks, and notify shippers proactively of ETA updates.',
    l1Events: [
      { name: 'CHECKPOINT_PASSED', desc: 'Emitted when FASTag or GPS geofence verifies corridor progress.' },
      { name: 'SLA_BREACH_WARNING', desc: 'Emitted when predicted ETA exceeds promised window by > 30 mins.' },
      { name: 'AUTO_REROUTE_EXECUTED', desc: 'Emitted when navigation algorithm updates route around congestion.' },
      { name: 'SHIPMENT_DELIVERED', desc: 'Emitted upon electronic Proof-of-Delivery (ePOD) sign-off.' }
    ],
    knowledgeGraphNodes: [
      { from: 'Shipment (SHP-8812)', rel: 'Monitored By', to: 'ACOIP Risk Engine' },
      { from: 'ACOIP Risk Engine', rel: 'Evaluates Edge', to: 'Delhi-Jaipur Toll Checkpoint' },
      { from: 'Delhi-Jaipur Checkpoint', rel: 'Pulls Live Data', to: 'NHAI Traffic Feed' },
      { from: 'NHAI Traffic Feed', rel: 'Updates ETA', to: 'Customer Portal Twin' }
    ],
    digitalTwinBrains: [
      { name: 'Operational Brain', status: 'Optimal', detail: 'Calculates minute-by-minute ETA projections based on live traffic/weather.' },
      { name: 'Customer Brain', status: 'Synchronized', detail: 'Updates customer digital twin health score and SLA compliance index.' },
      { name: 'Learning Brain', status: 'Active', detail: 'Feeds bottleneck delay patterns back to route planning heuristics.' }
    ],
    policyGuardrails: [
      { rule: 'SLA Penalty Threshold', threshold: 'Zero breach on Enterprise Tier', status: 'ENFORCED' },
      { rule: 'Auto-Reroute Authorization', threshold: 'Cost delta < ₹1,500 auto-approved', status: 'PASS' },
      { rule: 'Customer Notification Delay', threshold: '< 3 minutes from alert', status: 'ACTIVE' }
    ],
    calculationFormula: 'OTD % = (Shipments Delivered Within Promised SLA Window / Total Completed Shipments) × 100',
    featuresTitle: 'Delivery Operations & SLA Risk Controls',
    features: [
      { name: 'Predictive SLA Breach Detector', desc: 'Scans live congestion, weather, and toll queues to forecast ETA deviations.', status: '4 Trips at Risk', actionText: 'Inspect Delayed Trips' },
      { name: 'Autonomous Traffic Rerouter', desc: 'Pushes navigation route updates to driver app around NH48 roadblocks.', status: 'Active (24 Reroutes)', actionText: 'Execute Auto-Reroute' },
      { name: 'Customer ETA Sync Matrix', desc: 'Streams live shipment location and arrival timestamps to customer portals.', status: 'Live Webhook Stream', actionText: 'View Portal Feeds' },
      { name: 'SLA Penalty Prevention Desk', desc: 'Recommends express standby vehicle swaps before contractual penalty trigger.', status: 'Zero Penalty Today', actionText: 'Check Penalty Limits' }
    ]
  },

  activeTrucks: {
    title: 'Active Trucks Uptime & IoT Telemetry Grid',
    metric: '488K',
    unit: 'Active Vehicles',
    trend: '+3.4%',
    trendUp: true,
    color: '#d97706',
    gradient: 'linear-gradient(135deg, #d97706, #f97316)',
    systemEngine: 'Intelligent Fleet & Asset Operations System (IFAOS)',
    businessGoal: 'Maintain continuous IoT telemetry connection for all 488,000+ commercial vehicles and predict mechanical failures before breakdown.',
    userIntent: 'Monitor live vehicle status, track maintenance health scores, and dispatch automated depot servicing.',
    l1Events: [
      { name: 'TELEMATICS_PING', desc: 'Emitted every 30 seconds per vehicle via CAN bus OBD-II node.' },
      { name: 'TRUCK_ONLINE', desc: 'Emitted when ignition state registers active engine start.' },
      { name: 'MECHANICAL_FAULT_DETECTED', desc: 'Emitted when engine DTC code indicates subsystem wear.' },
      { name: 'WORKSHOP_DISPATCH_CREATED', desc: 'Emitted when RUL algorithm reserves workshop bay.' }
    ],
    knowledgeGraphNodes: [
      { from: 'Truck (TRK-44910)', rel: 'Hosts Sensor Unit', to: 'Telematics Gateway v4' },
      { from: 'Telematics Gateway v4', rel: 'Streams Telemetry', to: 'IFAOS Ingestion Pipeline' },
      { from: 'IFAOS Ingestion Pipeline', rel: 'Monitors Component', to: 'Tyre Pressure Sensor Set' },
      { from: 'Tyre Pressure Sensor Set', rel: 'Schedules Bay', to: 'Bengaluru Service Hub' }
    ],
    digitalTwinBrains: [
      { name: 'Physical Brain', status: 'Optimal', detail: 'Tracks Remaining Useful Life (RUL) for engines, brakes, and tyres.' },
      { name: 'Operational Brain', status: 'Synchronized', detail: 'Maps vehicle location, speed, fuel level, and cargo weight.' },
      { name: 'Executive Brain', status: 'Active', detail: 'Aggregates fleet capital efficiency and asset replacement schedule.' }
    ],
    policyGuardrails: [
      { rule: 'Telemetry Latency Boundary', threshold: '< 45 seconds per ping', status: 'PASS' },
      { rule: 'Critical DTC Action', threshold: 'Stop advice within 5 mins for Red Faults', status: 'ENFORCED' },
      { rule: 'Preventive Maintenance SLA', threshold: 'Within 500 km of service window', status: 'ACTIVE' }
    ],
    calculationFormula: 'Active Trucks = Count(Vehicles with Telemetry Ping < 5m AND Status ∈ {In-Transit, Loading, Ready Buffer})',
    featuresTitle: 'Vehicle Diagnostics & Preventive Maintenance',
    features: [
      { name: 'IoT Telemetry Health Monitor', desc: 'Ingests OBD-II CAN bus pings every 30s across engine, tyres, and brakes.', status: '487,621 Pinging', actionText: 'Inspect Sensor Feeds' },
      { name: 'Remaining Useful Life (RUL) Alert', desc: 'Predicts component failure timelines for brake pads, tyres, and injectors.', status: '12 Service Needed', actionText: 'Schedule Workshop' },
      { name: 'Refrigeration Temperature Guard', desc: 'Maintains cold-chain temperature limits for pharma and perishables.', status: 'All Reefers Normal', actionText: 'Check Reefer Temp' },
      { name: 'Depot Maintenance Dispatcher', desc: 'Reserves service bays and spare parts automatically based on mileage.', status: '18 Bays Reserved', actionText: 'View Depot Worksheets' }
    ]
  },

  fuelEfficiency: {
    title: 'Fuel Efficiency & Carbon Footprint Optimization',
    metric: '4.8 km/L',
    unit: 'km / Litre Average',
    trend: '+4.3%',
    trendUp: true,
    color: '#db2777',
    gradient: 'linear-gradient(135deg, #db2777, #f43f5e)',
    systemEngine: 'Driver Workforce Intelligence Platform (DWIP) & Eco-Routing Engine',
    businessGoal: 'Reduce fleet carbon footprint and fuel costs by monitoring consumption patterns, eliminating idle waste, and training drivers.',
    userIntent: 'Analyze vehicle mileage trends across fuel types, prevent fuel theft, and reward high-performing drivers.',
    l1Events: [
      { name: 'FUEL_REFILL_RECORDED', desc: 'Emitted when fuel sensor and FASTag fuel card record tank fill.' },
      { name: 'EXCESS_IDLE_DETECTED', desc: 'Emitted when engine idles > 15 minutes while vehicle is stationary.' },
      { name: 'ECO_SCORE_UPDATED', desc: 'Emitted after trip completion aggregating speed, braking, and gear shifts.' },
      { name: 'FUEL_LEAKAGE_ALERT', desc: 'Emitted when tank sensor detects rapid level drop during stop.' }
    ],
    knowledgeGraphNodes: [
      { from: 'Driver (DRV-9021)', rel: 'Operates Truck', to: 'Truck (TRK-10294)' },
      { from: 'Truck (TRK-10294)', rel: 'Pulls Fuel At', to: 'IndianOil Smart Station' },
      { from: 'IndianOil Smart Station', rel: 'Logs Transaction', to: 'Fuel Ledger Node' },
      { from: 'Fuel Ledger Node', rel: 'Feeds DWIP Model', to: 'Eco Incentive Engine' }
    ],
    digitalTwinBrains: [
      { name: 'Operational Brain', status: 'Optimal', detail: 'Tracks fleet-wide km/L average, EV efficiency, and idle burn rates.' },
      { name: 'Driver Brain', status: 'Synchronized', detail: 'Scores drivers on acceleration, coasting, and speed governor compliance.' },
      { name: 'Financial Brain', status: 'Active', detail: 'Calculates direct fuel savings impact on per-kilometer operating margins.' }
    ],
    policyGuardrails: [
      { rule: 'Idling Limit Policy', threshold: 'Max 10 mins continuous idle', status: 'ENFORCED' },
      { rule: 'Fuel Discrepancy Variance', threshold: '< 1.5% between pump receipt & sensor', status: 'PASS' },
      { rule: 'Driver Eco Reward', threshold: 'Bonus paid on > 5.2 km/L achievement', status: 'ACTIVE' }
    ],
    calculationFormula: 'Fuel Efficiency (km/L) = Total Distance Covered (km) / Total Fuel Volume Consumed (Litres)',
    featuresTitle: 'Fuel Management & Eco-Driver Rewards',
    features: [
      { name: 'Driver Eco-Scoring Leaderboard', desc: 'Evaluates drivers on harsh acceleration, coasting, and speed control.', status: 'Avg Score 88/100', actionText: 'View Eco Ranking' },
      { name: 'Excess Idling Waste Monitor', desc: 'Alerts operators when engines idle over 15 minutes at rest stops.', status: '142L Saved Today', actionText: 'Inspect Idle Logs' },
      { name: 'Fuel Theft & Discrepancy Detector', desc: 'Compares fuel card tank fills against ultrasonic tank sensor levels.', status: '0 Discrepancies', actionText: 'Run Theft Audit' },
      { name: 'EV vs Diesel Economy Comparator', desc: 'Tracks energy consumption per km for electric freight fleets vs diesel.', status: 'EV 1.8 kWh/km', actionText: 'Compare Fuel Costs' }
    ]
  },

  customerGrowth: {
    title: 'Customer Growth & ACMS Onboarding Intelligence',
    metric: '+12.6%',
    unit: 'Shipper Growth %',
    trend: '+12.6%',
    trendUp: true,
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
    systemEngine: 'Customer Intelligence Core (CIC) & Autonomous Customer Mobilization System (ACMS)',
    businessGoal: 'Accelerate client onboarding, maximize customer lifetime value (LTV), and detect churn signals early.',
    userIntent: 'Track lead conversion rates, monitor 30-day mobilization hypercare, and execute targeted expansion programs.',
    l1Events: [
      { name: 'LEAD_QUALIFIED', desc: 'Emitted when AI scoring model scores prospect readiness > 80%.' },
      { name: 'DEAL_WON', desc: 'Emitted when commercial contract is signed and validated.' },
      { name: 'MOBILIZATION_STARTED', desc: 'Emitted when ACMS initializes 9 parallel launch lanes.' },
      { name: 'CUSTOMER_ACTIVATED', desc: 'Emitted upon first successful shipment delivery.' }
    ],
    knowledgeGraphNodes: [
      { from: 'Customer (CUS-5012)', rel: 'Assigned To', to: 'Key Account Manager' },
      { from: 'Key Account Manager', rel: 'Manages Lanes', to: 'Delhi-Mumbai Express Corridor' },
      { from: 'Delhi-Mumbai Corridor', rel: 'Generates Shipment Volume', to: 'Monthly Revenue Stream' },
      { from: 'Monthly Revenue Stream', rel: 'Updates Score', to: 'CIC Health Matrix' }
    ],
    digitalTwinBrains: [
      { name: 'Commercial Brain', status: 'Optimal', detail: 'Tracks customer LTV, expansion potential, and rebate milestones.' },
      { name: 'Relationship Brain', status: 'Synchronized', detail: 'Monitors executive meeting cadence, support ticket sentiment, and NPS.' },
      { name: 'Strategic Brain', status: 'Active', detail: 'Identifies expansion opportunities in new geographic corridors.' }
    ],
    policyGuardrails: [
      { rule: 'Mobilization SLA', threshold: '< 7 days from Deal Won to First Shipment', status: 'ENFORCED' },
      { rule: 'Churn Risk Trigger', threshold: 'Intervene if Health Score < 65%', status: 'PASS' },
      { rule: 'Executive Cadence Rule', threshold: 'Quarterly review required for Top 50 ACV', status: 'ACTIVE' }
    ],
    calculationFormula: 'Net Customer Growth % = ((Active Shippers End Period - Active Shippers Start Period) / Active Shippers Start Period) × 100',
    featuresTitle: 'Customer Success & Contract Expansion',
    features: [
      { name: 'Autonomous Mobilization (ACMS)', desc: 'Parallelizes 9 onboarding lanes from plant setup to first shipment.', status: '6 Clients Onboarding', actionText: 'Track Mobilization' },
      { name: 'Customer Churn Risk Predictor', desc: 'Scans shipment volume drops and ticket sentiment to trigger intervention.', status: '97.4% Health Score', actionText: 'Review Risk Radar' },
      { name: 'Contract Expansion Recommender', desc: 'Identifies high-performing corridors for spot-to-dedicated upgrades.', status: '₹14.2M Opportunity', actionText: 'View Upsell Deals' },
      { name: 'Executive Cadence Tracker', desc: 'Schedules quarterly business reviews (QBR) for Top 50 enterprise accounts.', status: '4 QBRs This Week', actionText: 'Schedule QBR' }
    ]
  }
};

const generateChartData = (segmentKey, timeframe, region, category, scaleMode) => {
  let labels = [];
  let baseValues = [];
  let targetValues = [];

  if (timeframe === '24h') {
    labels = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
  } else if (timeframe === '7d') {
    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  } else if (timeframe === '30d') {
    labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
  } else {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }

  const regionMultiplier = region === 'north' ? 1.08 : region === 'west' ? 1.15 : region === 'south' ? 0.96 : region === 'east' ? 0.88 : 1.0;
  const categoryMultiplier = category === 'express' ? 1.12 : category === 'reefer' ? 1.05 : category === 'ev' ? 0.92 : 1.0;

  switch (segmentKey) {
    case 'revenueToday':
      baseValues = labels.map((_, i) => (35 + Math.sin(i * 0.4) * 6 + i * 0.4) * regionMultiplier * categoryMultiplier);
      targetValues = labels.map((_, i) => (40 + i * 0.35) * regionMultiplier);
      break;
    case 'fleetUtilization':
      baseValues = labels.map((_, i) => Math.min(98, (80 + Math.cos(i * 0.5) * 5 + i * 0.3) * regionMultiplier));
      targetValues = labels.map(() => 92);
      break;
    case 'onTimeDelivery':
      baseValues = labels.map((_, i) => Math.min(99.5, (91 + Math.sin(i * 0.6) * 3 + (i % 4) * 0.8) * regionMultiplier));
      targetValues = labels.map(() => 95);
      break;
    case 'activeTrucks':
      baseValues = labels.map((_, i) => (440 + Math.sin(i * 0.3) * 20 + i * 1.5) * regionMultiplier * categoryMultiplier);
      targetValues = labels.map((_, i) => 470 + i * 1.2);
      break;
    case 'fuelEfficiency':
      baseValues = labels.map((_, i) => (4.1 + Math.sin(i * 0.4) * 0.4 + i * 0.02) * categoryMultiplier);
      targetValues = labels.map(() => 5.0);
      break;
    case 'customerGrowth':
      baseValues = labels.map((_, i) => (8 + Math.cos(i * 0.3) * 2 + i * 0.25) * regionMultiplier);
      targetValues = labels.map(() => 12);
      break;
    default:
      baseValues = labels.map(() => 50);
      targetValues = labels.map(() => 60);
  }

  if (scaleMode === 'normalized') {
    const maxVal = Math.max(...baseValues) || 1;
    baseValues = baseValues.map(v => (v / maxVal) * 100);
    targetValues = targetValues.map(v => (v / maxVal) * 100);
  }

  return { labels, baseValues, targetValues };
};

const SegmentDeepDiveCockpit = ({ segmentKey, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('graph'); // graph | features | blueprint
  const [timeframe, setTimeframe] = useState('30d');
  const [region, setRegion] = useState('all');
  const [category, setCategory] = useState('all');
  const [viewType, setViewType] = useState('line');
  const [scaleMode, setScaleMode] = useState('auto');
  const [notification, setNotification] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const config = segmentConfigs[segmentKey] || segmentConfigs.revenueToday;

  const chartData = useMemo(() => {
    return generateChartData(segmentKey, timeframe, region, category, scaleMode);
  }, [segmentKey, timeframe, region, category, scaleMode]);

  const triggerFeatureAction = (featureName) => {
    setNotification(`Action Triggered: "${featureName}" — Business Event emitted to GatiFleet Ledger.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const chartTextColor = isDark ? '#cbd5e1' : '#334155';
  const chartGridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { color: chartTextColor, font: { size: 11, family: 'Inter, sans-serif' } }
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        bodyColor: isDark ? '#cbd5e1' : '#334155',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { color: chartGridColor },
        ticks: { color: chartTextColor, font: { size: 10 } }
      },
      y: {
        grid: { color: chartGridColor },
        ticks: { color: chartTextColor, font: { size: 10 } }
      }
    }
  };

  const reactChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: `${config.title.split(' ')[0]} (${scaleMode === 'normalized' ? '%' : config.unit})`,
        data: chartData.baseValues,
        borderColor: config.color,
        backgroundColor: (ctx) => {
          if (!ctx.chart.chartArea) return 'rgba(99, 102, 241, 0.1)';
          const gradient = ctx.chart.ctx.createLinearGradient(0, ctx.chart.chartArea.top, 0, ctx.chart.chartArea.bottom);
          gradient.addColorStop(0, `${config.color}35`);
          gradient.addColorStop(1, `${config.color}00`);
          return gradient;
        },
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
      {
        label: 'Benchmark SLA Target',
        data: chartData.targetValues,
        borderColor: '#d97706',
        borderDash: [5, 5],
        borderWidth: 1.5,
        fill: false,
        pointRadius: 0,
      }
    ]
  };

  // High contrast theme styles
  const panelStyles = {
    backdrop: {
      position: 'fixed',
      top: '60px',
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.35)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      zIndex: 1200,
      display: 'flex',
      justifyContent: 'flex-end',
    },
    drawer: {
      width: isExpanded ? 'calc(100vw - 280px)' : '620px',
      maxWidth: '100%',
      height: 'calc(100vh - 60px)',
      background: isDark ? '#0f172a' : '#ffffff',
      borderLeft: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
      boxShadow: isDark ? '-10px 0 30px rgba(0,0,0,0.5)' : '-10px 0 30px rgba(0,0,0,0.12)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'width 0.3s ease',
    },
    header: {
      padding: '16px 20px',
      background: isDark ? 'rgba(30, 41, 59, 0.8)' : '#f8fafc',
      borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 15,
      fontWeight: 700,
      color: isDark ? '#f8fafc' : '#0f172a',
      margin: 0,
    },
    subTitle: {
      fontSize: 12,
      color: isDark ? '#94a3b8' : '#475569',
      marginTop: 2,
    },
    tabsBar: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 20px',
      background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#ffffff',
      borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
    },
    tabBtn: (active) => ({
      background: active ? config.gradient : 'transparent',
      color: active ? '#ffffff' : isDark ? '#94a3b8' : '#475569',
      border: 'none',
      borderRadius: 8,
      padding: '6px 12px',
      fontSize: 12,
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      transition: 'all 0.2s ease',
    }),
    body: {
      flex: 1,
      padding: '20px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    },
    card: {
      background: isDark ? 'rgba(30, 41, 59, 0.5)' : '#ffffff',
      border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #cbd5e1',
      borderRadius: 12,
      padding: 16,
      boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
    },
    filterBar: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10,
      alignItems: 'center',
      padding: '10px 12px',
      background: isDark ? 'rgba(0,0,0,0.2)' : '#f1f5f9',
      borderRadius: 8,
      border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e2e8f0',
    },
    selectInput: {
      background: isDark ? '#1e293b' : '#ffffff',
      border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
      color: isDark ? '#f8fafc' : '#0f172a',
      padding: '4px 8px',
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 600,
      outline: 'none',
      cursor: 'pointer',
    },
    featureBox: {
      background: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
      border: isDark ? '1px solid rgba(255, 255, 255, 0.07)' : '1px solid #e2e8f0',
      borderRadius: 10,
      padding: 12,
      marginBottom: 10,
    },
    featName: {
      fontSize: 13,
      fontWeight: 700,
      color: isDark ? '#f8fafc' : '#0f172a',
    },
    featDesc: {
      fontSize: 12,
      color: isDark ? '#cbd5e1' : '#334155',
      margin: '4px 0 8px',
      lineHeight: 1.4,
    },
    featActionBtn: {
      background: config.gradient,
      border: 'none',
      color: '#ffffff',
      borderRadius: 6,
      padding: '6px 12px',
      fontSize: 11,
      fontWeight: 600,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
    }
  };

  return (
    <AnimatePresence>
      <div style={panelStyles.backdrop} onClick={onClose}>
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={panelStyles.drawer}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar anchored beside vertical sidebar */}
          <div style={panelStyles.header}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: config.gradient, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}>
                <Sparkles size={18} color="#fff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h3 style={panelStyles.title}>{config.title}</h3>
                  <span style={{
                    fontSize: 13, fontWeight: 800, color: config.color,
                    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                    padding: '2px 8px', borderRadius: 6
                  }}>
                    {config.metric}
                  </span>
                </div>
                <div style={panelStyles.subTitle}>
                  {config.systemEngine} • <span style={{ color: '#16a34a', fontWeight: 600 }}>{config.trend}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                  background: 'transparent', border: 'none',
                  color: isDark ? '#94a3b8' : '#475569', cursor: 'pointer', padding: 6
                }}
                title={isExpanded ? 'Collapse Drawer' : 'Expand Drawer'}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                onClick={onClose}
                style={{
                  background: 'transparent', border: 'none',
                  color: isDark ? '#94a3b8' : '#475569', cursor: 'pointer', padding: 6
                }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Action Notification Banner */}
          {notification && (
            <div style={{
              background: 'rgba(22, 163, 74, 0.12)', borderBottom: '1px solid rgba(22, 163, 74, 0.3)',
              color: '#15803d', padding: '8px 20px', fontSize: 12, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <CheckCircle size={14} color="#16a34a" />
              {notification}
            </div>
          )}

          {/* Tab Navigation */}
          <div style={panelStyles.tabsBar}>
            <button
              style={panelStyles.tabBtn(activeTab === 'graph')}
              onClick={() => setActiveTab('graph')}
            >
              <Zap size={14} />
              Scalable Graph & Telemetry
            </button>
            <button
              style={panelStyles.tabBtn(activeTab === 'features')}
              onClick={() => setActiveTab('features')}
            >
              <Layers size={14} />
              Operational Features ({config.features.length})
            </button>
            <button
              style={panelStyles.tabBtn(activeTab === 'blueprint')}
              onClick={() => setActiveTab('blueprint')}
            >
              <Cpu size={14} />
              Section Architecture Blueprint
            </button>
          </div>

          {/* Tab Contents */}
          <div style={panelStyles.body}>
            {activeTab === 'graph' && (
              <>
                {/* Filter Toolbar */}
                <div style={panelStyles.filterBar}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155' }}>
                      Timeframe:
                    </span>
                    <div style={{ display: 'flex', gap: 2, background: isDark ? '#1e293b' : '#e2e8f0', padding: 2, borderRadius: 6 }}>
                      {['24h', '7d', '30d', '90d', 'YTD'].map((tf) => (
                        <button
                          key={tf}
                          onClick={() => setTimeframe(tf)}
                          style={{
                            background: timeframe === tf ? config.color : 'transparent',
                            color: timeframe === tf ? '#fff' : isDark ? '#94a3b8' : '#475569',
                            border: 'none', borderRadius: 4, padding: '2px 8px', fontSize: 10, fontWeight: 700, cursor: 'pointer'
                          }}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155' }}>
                      Region:
                    </span>
                    <select
                      style={panelStyles.selectInput}
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    >
                      <option value="all">All India (National)</option>
                      <option value="west">Western Corridor (NH48)</option>
                      <option value="north">Northern Region (NCR/Punjab)</option>
                      <option value="south">Southern Corridor (BLR/CHN)</option>
                      <option value="east">Eastern Hub (Kolkata/OD)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155' }}>
                      Fleet:
                    </span>
                    <select
                      style={panelStyles.selectInput}
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="all">All Fleet Types</option>
                      <option value="express">Express Commercial 32FT</option>
                      <option value="reefer">Cold Chain Reefer</option>
                      <option value="ev">Electric Fleet (EV)</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      onClick={() => setViewType(viewType === 'line' ? 'bar' : 'line')}
                      style={{
                        background: isDark ? '#1e293b' : '#ffffff',
                        border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                        color: isDark ? '#f8fafc' : '#0f172a',
                        borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      View: {viewType.toUpperCase()}
                    </button>
                    <button
                      onClick={() => setScaleMode(scaleMode === 'auto' ? 'normalized' : 'auto')}
                      style={{
                        background: scaleMode === 'normalized' ? 'rgba(217, 119, 6, 0.15)' : isDark ? '#1e293b' : '#ffffff',
                        border: scaleMode === 'normalized' ? '1px solid #d97706' : isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                        color: scaleMode === 'normalized' ? '#d97706' : isDark ? '#f8fafc' : '#0f172a',
                        borderRadius: 6, padding: '4px 8px', fontSize: 11, fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      {scaleMode === 'auto' ? 'Auto Scale' : 'Normalized %'}
                    </button>
                  </div>
                </div>

                {/* Main Scalable Chart Canvas */}
                <div style={panelStyles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>
                      Telemetry Scalable Trend
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: config.color,
                      background: `${config.color}15`, padding: '2px 8px', borderRadius: 6
                    }}>
                      {region === 'all' ? 'All Corridors' : region.toUpperCase()} • {timeframe}
                    </span>
                  </div>
                  <div style={{ height: 280, width: '100%' }}>
                    {viewType === 'line' ? (
                      <Line data={reactChartData} options={chartOptions} />
                    ) : (
                      <Bar data={reactChartData} options={chartOptions} />
                    )}
                  </div>
                </div>

                {/* Features Quick Strip */}
                <div style={panelStyles.card}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', marginBottom: 10 }}>
                    {config.featuresTitle}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {config.features.map((feat, idx) => (
                      <div key={idx} style={{
                        background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc',
                        border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0',
                        borderRadius: 8, padding: 10
                      }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>{feat.name}</div>
                        <div style={{ fontSize: 11, color: isDark ? '#cbd5e1' : '#475569', margin: '4px 0 8px' }}>{feat.desc}</div>
                        <button
                          style={{
                            background: config.gradient, border: 'none', color: '#fff',
                            borderRadius: 6, padding: '4px 8px', fontSize: 10, fontWeight: 600, cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center', gap: 4
                          }}
                          onClick={() => triggerFeatureAction(feat.name)}
                        >
                          <RefreshCw size={10} /> {feat.actionText}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'features' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>
                  {config.featuresTitle}
                </div>
                {config.features.map((feat, idx) => (
                  <div key={idx} style={panelStyles.featureBox}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={panelStyles.featName}>{feat.name}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: '#16a34a',
                        background: 'rgba(22, 163, 74, 0.12)', padding: '2px 8px', borderRadius: 6
                      }}>
                        {feat.status}
                      </span>
                    </div>
                    <p style={panelStyles.featDesc}>{feat.desc}</p>
                    <button
                      style={panelStyles.featActionBtn}
                      onClick={() => triggerFeatureAction(feat.name)}
                    >
                      <RefreshCw size={12} />
                      {feat.actionText}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'blueprint' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Blueprint Overview */}
                <div style={panelStyles.card}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', marginBottom: 8 }}>
                    Strategic Business Goal & Intent
                  </div>
                  <div style={{ fontSize: 12, color: isDark ? '#cbd5e1' : '#334155', lineHeight: 1.5, marginBottom: 12 }}>
                    <strong>Goal:</strong> {config.businessGoal}
                  </div>
                  <div style={{ fontSize: 12, color: isDark ? '#cbd5e1' : '#334155', lineHeight: 1.5 }}>
                    <strong>User Intent:</strong> {config.userIntent}
                  </div>
                </div>

                {/* State Formula */}
                <div style={{
                  background: isDark ? 'rgba(217, 119, 6, 0.1)' : '#fffbe6',
                  border: isDark ? '1px solid rgba(217, 119, 6, 0.3)' : '1px solid #ffe58f',
                  borderRadius: 10, padding: 12
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#fbbf24' : '#d97706', marginBottom: 6 }}>
                    State Calculation & Formula
                  </div>
                  <code style={{ fontSize: 11, fontFamily: 'monospace', color: isDark ? '#fbbf24' : '#b45309', display: 'block', wordBreak: 'break-all' }}>
                    {config.calculationFormula}
                  </code>
                </div>

                {/* 2x2 Grid for Events & Knowledge Graph */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={panelStyles.card}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#818cf8' : '#4f46e5', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Activity size={14} /> L1 Events Emitted
                    </div>
                    {config.l1Events.map((evt, idx) => (
                      <div key={idx} style={{ marginBottom: 8, paddingBottom: 6, borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: config.color, fontFamily: 'monospace' }}>{evt.name}</div>
                        <div style={{ fontSize: 11, color: isDark ? '#cbd5e1' : '#475569', marginTop: 2 }}>{evt.desc}</div>
                      </div>
                    ))}
                  </div>

                  <div style={panelStyles.card}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Network size={14} /> Knowledge Graph Links
                    </div>
                    {config.knowledgeGraphNodes.map((node, idx) => (
                      <div key={idx} style={{ fontSize: 11, color: isDark ? '#cbd5e1' : '#334155', marginBottom: 8, padding: '4px 6px', background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', borderRadius: 6 }}>
                        <strong>{node.from}</strong> <span style={{ color: '#7c3aed' }}>── {node.rel} ──►</span> <strong>{node.to}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Digital Twins & Policies */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div style={panelStyles.card}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Brain size={14} /> 6-Brain Digital Twins
                    </div>
                    {config.digitalTwinBrains.map((brain, idx) => (
                      <div key={idx} style={{ marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>{brain.name}</span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#16a34a' }}>{brain.status}</span>
                        </div>
                        <div style={{ fontSize: 11, color: isDark ? '#cbd5e1' : '#475569' }}>{brain.detail}</div>
                      </div>
                    ))}
                  </div>

                  <div style={panelStyles.card}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ShieldCheck size={14} /> Policy Guardrails
                    </div>
                    {config.policyGuardrails.map((policy, idx) => (
                      <div key={idx} style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>{policy.rule}</div>
                        <div style={{ fontSize: 10, color: isDark ? '#cbd5e1' : '#475569' }}>Threshold: {policy.threshold}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SegmentDeepDiveCockpit;
