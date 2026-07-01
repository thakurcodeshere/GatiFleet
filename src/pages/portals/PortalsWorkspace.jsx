/* eslint-disable */
// ============================================================
// GatiFleet — Ecosystem Partner & Network Portals Workspace (Layers 1-6)
// India's Logistics Network Operating System (Samsara-Grade Command Tower)
// ============================================================

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Truck, MapPin, Bot, Sparkles, Clock, Activity, CheckCircle,
  AlertTriangle, Send, ChevronRight, Coins, Zap, Award, Building2,
  Landmark, ShieldCheck, UserPlus, X,
  Search, Fuel, Thermometer, Gauge, Box, Settings, RotateCcw
} from 'lucide-react';
import { generateShipments, generateTrucks, CITIES, formatCurrency } from '../../data/mockData';
import { RealityEngine } from '../../data/RealityEngine';

// Simulated default shipments for Layer 1
const DEFAULT_SHIPMENTS = [
  { id: 'SHP-104921', ewayBill: 'EWB92841029', origin: 'Delhi', destination: 'Mumbai', status: 'in_transit', eta: '4h 12m', progress: 82, lat: 21.0, lng: 74.2, driver: 'Rajesh Kumar', weight: 18, cost: 72000, value: 3400000, delay: 'None', carbon: '1.2t CO2 (-14%)', risk: 'Low' },
  { id: 'SHP-104922', ewayBill: 'EWB92841030', origin: 'Mumbai', destination: 'Bangalore', status: 'delayed', eta: '12h 45m', progress: 55, lat: 15.6, lng: 75.8, driver: 'Suresh Yadav', weight: 24, cost: 96000, value: 4800000, delay: 'Nagpur Monsoon (+2.5h)', carbon: '1.6t CO2 (-18%)', risk: 'Medium' },
  { id: 'SHP-104923', ewayBill: 'EWB92841031', origin: 'Kolkata', destination: 'Guwahati', status: 'in_transit', eta: '8h 30m', progress: 68, lat: 24.8, lng: 90.2, driver: 'Deepak Gupta', weight: 14, cost: 58000, value: 2900000, delay: 'None', carbon: '0.9t CO2 (-12%)', risk: 'Low' },
  { id: 'SHP-104924', ewayBill: 'EWB92841032', origin: 'Delhi', destination: 'Kolkata', status: 'loading', eta: '24h 00m', progress: 10, lat: 28.6, lng: 77.2, driver: 'Ashok Pandey', weight: 20, cost: 84000, value: 4200000, delay: 'None', carbon: '1.4t CO2 (Baseline)', risk: 'Low' },
];

// Logistics Indian States, Districts and Coordinate projection databases
const STATES_AND_UTS = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const STATE_DISTRICTS = {
  "Maharashtra": ["Raigad", "Mumbai City", "Mumbai Suburban", "Pune", "Thane", "Nagpur", "Nashik", "Aurangabad", "Kolhapur", "Solapur", "Amravati"],
  "Delhi": ["New Delhi", "South Delhi", "North Delhi", "East Delhi", "West Delhi", "Central Delhi"],
  "Karnataka": ["Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Dakshina Kannada", "Belagavi", "Dharwad", "Kalaburagi"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tiruppur", "Kancheepuram"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Mehsana", "Kutch"],
  "Uttar Pradesh": ["Gautam Buddha Nagar (Noida)", "Lucknow", "Kanpur Nagar", "Ghaziabad", "Agra", "Varanasi", "Prayagraj", "Meerut"],
  "West Bengal": ["Kolkata", "Howrah", "North 24 Parganas", "South 24 Parganas", "Purba Medinipur", "Darjeeling"],
  "Haryana": ["Gurugram", "Faridabad", "Sonipat", "Panipat", "Ambala", "Panchkula", "Rohtak"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner", "Alwar"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga"],
  "Telangana": ["Hyderabad", "Medchal-Malkajgiri", "Rangareddy", "Warangal", "Nalgonda"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  "Kerala": ["Ernakulam (Kochi)", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Malappuram"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati"],
  "Assam": ["Kamrup Metropolitan (Guwahati)", "Dibrugarh", "Silchar", "Jorhat"],
  "Odisha": ["Khurda (Bhubaneswar)", "Cuttack", "Ganjam", "Sundargarh"]
};

const LOGISTICS_HUBS = [
  { name: "JNPT Port Mumbai Hub", state: "Maharashtra", district: "Raigad", street: "Sector 11, CBD Belapur Docks", pincode: "400707", lat: 18.95, lng: 72.95, phone: "+91 98200 12345" },
  { name: "Noida Sector 62 Depot", state: "Uttar Pradesh", district: "Gautam Buddha Nagar (Noida)", street: "C-56, Sector 62 Industrial Area", pincode: "201301", lat: 28.62, lng: 77.36, phone: "+91 99100 98765" },
  { name: "Peenya Industrial Hub Bengaluru", state: "Karnataka", district: "Bengaluru Urban", street: "4th Cross, Peenya 1st Stage", pincode: "560058", lat: 13.03, lng: 77.52, phone: "+91 98450 54321" },
  { name: "Chennai Port Container Terminal", state: "Tamil Nadu", district: "Chennai", street: "Gate No 3, Rajaji Salai", pincode: "600001", lat: 13.09, lng: 80.29, phone: "+91 97900 87654" },
  { name: "Dankuni Logistics Center Kolkata", state: "West Bengal", district: "Howrah", street: "NH2 Bypass Crossing, Dankuni", pincode: "712311", lat: 22.68, lng: 88.30, phone: "+91 98300 23456" },
  { name: "Sanand Industrial Gate Gujarat", state: "Gujarat", district: "Ahmedabad", street: "Plot 124, GIDC Sanand Estate", pincode: "382110", lat: 23.02, lng: 72.38, phone: "+91 99000 34567" },
  { name: "Gurugram Cargo Warehouse", state: "Haryana", district: "Gurugram", street: "Sector 35, Pace City II", pincode: "122001", lat: 28.44, lng: 77.01, phone: "+91 98110 45678" }
];

const getEstimatedTransit = (originState, destState) => {
  if (!originState || !destState) return { distance: 0, hours: 0, mins: 0 };
  if (originState === destState) return { distance: 150, hours: 4, mins: 15 };
  
  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };
  
  const h1 = hashString(originState);
  const h2 = hashString(destState);
  const distance = 400 + ((h1 + h2) % 1200); // 400km to 1600km
  const hours = Math.floor(distance / 45); // Avg driving speed 45 km/h in India
  const mins = Math.floor(((distance / 45) - hours) * 60);
  return { distance, hours, mins };
};

const calculateBookingCosts = (weight, cargoValue, distance, dieselSurchargePct) => {
  const baseRatePerTonneKm = 3.5;
  const baseFreight = Math.floor(weight * distance * baseRatePerTonneKm);
  
  const tollPlazas = Math.max(1, Math.floor(distance / 120));
  const FASTagTolls = tollPlazas * 350;
  
  const baseFuelSurchargeRate = 0.15;
  const activeFuelSurchargeRate = baseFuelSurchargeRate + (dieselSurchargePct / 100);
  const fuelSurcharge = Math.floor(baseFreight * activeFuelSurchargeRate);
  
  const laborLoadingFee = weight * 150;
  const transitInsurance = Math.floor(cargoValue * 0.0005);
  
  const subtotal = baseFreight + FASTagTolls + fuelSurcharge + laborLoadingFee + transitInsurance;
  const gst = Math.floor(subtotal * 0.12);
  const netCost = subtotal + gst;
  
  return {
    baseFreight,
    FASTagTolls,
    fuelSurcharge,
    laborLoadingFee,
    transitInsurance,
    gst,
    netCost
  };
};

const getStateCoordinates = (stateName) => {
  const coords = {
    "Maharashtra": { lat: 18.95, lng: 72.82 },
    "Delhi": { lat: 28.61, lng: 77.20 },
    "Karnataka": { lat: 12.97, lng: 77.59 },
    "Tamil Nadu": { lat: 13.08, lng: 80.27 },
    "West Bengal": { lat: 22.57, lng: 88.36 },
    "Gujarat": { lat: 23.02, lng: 72.57 },
    "Uttar Pradesh": { lat: 26.84, lng: 80.94 },
    "Haryana": { lat: 28.45, lng: 77.02 }
  };
  return coords[stateName] || { lat: 20.59, lng: 78.96 };
};

export default function PortalsWorkspace() {
  const [activePortal, setActivePortal] = useState('customer'); // customer | driver | fleet | vendor | broker | warehouse
  const [shipments, setShipments] = useState(DEFAULT_SHIPMENTS);
  const [toast, setToast] = useState(null);
  
  // Customer Portal Level-Up states
  const [selectedShipmentId, setSelectedShipmentId] = useState('SHP-104921');
  const [shipmentSearchQuery, setShipmentSearchQuery] = useState('');
  const [shipmentStatusFilter, setShipmentStatusFilter] = useState('all');
  const [activeShipmentTab, setActiveShipmentTab] = useState('route'); // route | financials | documents
  
  // Vendor Level-Up states
  const [vendorSearchQuery, setVendorSearchQuery] = useState('');
  const [vendorStatusFilter, setVendorStatusFilter] = useState('all');
  const [activeVendorTab, setActiveVendorTab] = useState('overview'); // overview | invoice | diagnostics

  // Broker Level-Up states
  const [brokerSearchQuery, setBrokerSearchQuery] = useState('');
  const [brokerStatusFilter, setBrokerStatusFilter] = useState('all');
  const [activeBrokerTab, setActiveBrokerTab] = useState('specs'); // specs | bids | financials

  // Warehouse Level-Up states
  const [warehouseSearchQuery, setWarehouseSearchQuery] = useState('');
  const [warehouseStatusFilter, setWarehouseStatusFilter] = useState('all');
  const [activeWarehouseTab, setActiveWarehouseTab] = useState('dock'); // dock | manifest | roster

  // +100 Level Up State variables
  const [carbonOffsetTotal, setCarbonOffsetTotal] = useState(1240);
  const [selectedChassisHotspot, setSelectedChassisHotspot] = useState('engine'); // engine | tyres | reefer | brakes
  const [autonomySettings, setAutonomySettings] = useState({
    autoDispatch: true,
    autoBidding: false,
    autoMaintenance: true
  });
  const [autopilotReasoning, setAutopilotReasoning] = useState([
    { agent: 'Supply Chain', time: '14:24:02', action: 'Bypass Congestion', reason: 'Nagpur Bypass route selected for TRK-00012 to reclaim 1.2h delay.' },
    { agent: 'Compliance', time: '13:52:10', action: 'FASTag Auto-Recharge', reason: 'Recharged ₹15,000 on TRK-00019 to prevent border toll hold.' },
    { agent: 'Engineering', time: '12:05:44', action: 'Clear OBD DTC Code P0300', reason: 'Reset sensor calibration on TRK-00028 after checking spark plugs.' }
  ]);

  // Modals & Forms
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    senderName: 'Tata Motors India',
    senderPhone: '9820012345',
    senderStreet: 'Sector 11, CBD Belapur Docks',
    senderState: 'Maharashtra',
    senderDistrict: 'Raigad',
    senderPincode: '400707',
    receiverName: 'Reliance Industries',
    receiverPhone: '9910098765',
    receiverStreet: 'C-56, Sector 62 Industrial Area',
    receiverState: 'Uttar Pradesh',
    receiverDistrict: 'Gautam Buddha Nagar (Noida)',
    receiverPincode: '201301',
    pickupTime: new Date(Date.now() + 7200000).toISOString().slice(0, 16),
    weight: 15,
    value: 2500000,
    website_url: '' // honeypot trap
  });
  const [mapDestinationTarget, setMapDestinationTarget] = useState('sender');
  const [mapHubSearch, setMapHubSearch] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [mapSelectedHub, setMapSelectedHub] = useState(null);
  const [mapHubListExpanded, setMapHubListExpanded] = useState(false);

  // Stateful Driver parameters
  const [driverState, setDriverState] = useState({
    safetyScore: 92,
    violations: 0,
    fatigue: 12,
    todayEarnings: 4800,
    monthlyEarnings: 68000,
    bonuses: 12500,
    marginSaved: 4800,
    fuelCostSaved: 4800
  });

  const [driverTelemetry, setDriverTelemetry] = useState({
    speed: '72 km/h',
    coolant: '92 °C',
    heartRate: '78 bpm',
    spo2: '98%',
    satellites: 12,
    activeWaypoint: 'IOC Plaza, NH48'
  });

  const [driverStressMode, setDriverStressMode] = useState(false);
  const [driverDutyStatus, setDriverDutyStatus] = useState('driving');

  // Stateful Fleet parameters
  const [fleetState, setFleetState] = useState({
    utilization: 87.4,
    revenueToday: 428500,
    activeAlerts: 4,
    fuelEfficiency: 4.8
  });

  const [fleetTrucks, setFleetTrucks] = useState([
    {
      id: 'TRK-00012', model: 'Volvo FM420', route: 'Delhi ➔ Mumbai', speed: '72 km/h', fuel: '82%', health: 95, status: 'active',
      obd: { coolant: '92 °C', oilPressure: '52 psi', voltage: '24.2 V', rpm: '1420 rpm', faultCodes: [] }
    },
    {
      id: 'TRK-00028', model: 'Tata Prima', route: 'Mumbai ➔ Bangalore', speed: '0 km/h (Idle)', fuel: '45%', health: 68, status: 'idle',
      obd: { coolant: '98 °C', oilPressure: '42 psi', voltage: '23.8 V', rpm: '0 rpm', faultCodes: ['P0113 - Intake Air Temp High', 'P0300 - Random Misfire'] }
    },
    {
      id: 'TRK-00045', model: 'BharatBenz 3523', route: 'Kolkata ➔ Guwahati', speed: '48 km/h', fuel: '68%', health: 88, status: 'active',
      obd: { coolant: '94 °C', oilPressure: '50 psi', voltage: '24.0 V', rpm: '1280 rpm', faultCodes: [] }
    },
    {
      id: 'TRK-00019', model: 'Eicher Pro 6049', route: 'Chennai ➔ Hyderabad', speed: '84 km/h', fuel: '92%', health: 91, status: 'active',
      obd: { coolant: '90 °C', oilPressure: '54 psi', voltage: '24.4 V', rpm: '1550 rpm', faultCodes: ['P0420 - Catalyst System Efficiency Below Threshold'] }
    }
  ]);

  const [selectedFleetTruckId, setSelectedFleetTruckId] = useState('TRK-00012');
  const [fleetRouteOptimization, setFleetRouteOptimization] = useState(false);
  const [activeSubsystemTab, setActiveSubsystemTab] = useState('engine');
  const [fleetSearchQuery, setFleetSearchQuery] = useState('');
  const [fleetStatusFilter, setFleetStatusFilter] = useState('all');

  // Enriched tyre pressure and reefer temperature per truck (for fault simulator)
  const [fleetTyrePressures, setFleetTyrePressures] = useState({
    'TRK-00012': { fl: 110, fr: 108, rl: 112, rr: 110 },
    'TRK-00028': { fl: 105, fr: 102, rl: 108, rr: 106 },
    'TRK-00045': { fl: 110, fr: 110, rl: 112, rr: 111 },
    'TRK-00019': { fl: 109, fr: 107, rl: 111, rr: 110 }
  });
  const [fleetReeferTemps, setFleetReeferTemps] = useState({
    'TRK-00012': 2.0,
    'TRK-00028': 4.0,
    'TRK-00045': 3.0,
    'TRK-00019': 2.5
  });


  const [warehouseBays, setWarehouseBays] = useState([
    { id: 'BAY-1', action: 'Inbound Loading', truck: 'TRK-00012', carrier: 'Reliance Cargo', status: 'active', dwell: 1.2, progress: 75, type: 'Automotive Parts' },
    { id: 'BAY-2', action: 'Outbound Dispatch', truck: 'TRK-00045', carrier: 'Tata Logistics', status: 'loading', dwell: 0.8, progress: 40, type: 'Machinery' },
    { id: 'BAY-3', action: 'Staging Queue', truck: 'TRK-00019', carrier: 'BlueDart express', status: 'waiting', dwell: 2.1, progress: 0, type: 'Electronics' },
    { id: 'BAY-4', action: 'Available', truck: null, carrier: null, status: 'empty', dwell: 0, progress: 0, type: 'None' },
    { id: 'BAY-5', action: 'Blocked', truck: null, carrier: null, status: 'maintenance', dwell: 0, progress: 0, type: 'None' },
    { id: 'BAY-6', action: 'Available', truck: null, carrier: null, status: 'empty', dwell: 0, progress: 0, type: 'None' }
  ]);

  const [yardQueue, setYardQueue] = useState([
    { id: 'TRK-00088', carrier: 'Safexpress', cargo: 'Pharmaceuticals', weight: 12, value: 4500000, arrivalTime: '14:05', status: 'unchecked' },
    { id: 'TRK-00094', carrier: 'Delhivery', cargo: 'Apparel', weight: 8, value: 1800000, arrivalTime: '14:15', status: 'sealed' },
    { id: 'TRK-00102', carrier: 'V-Trans', cargo: 'Chemicals', weight: 16, value: 3200000, arrivalTime: '14:30', status: 'unchecked' }
  ]);

  const [depotKPIs, setDepotKPIs] = useState({
    inboundCount: 12,
    outboundCount: 8,
    avgDwellTime: 1.8,
    laborProductivity: 94.2,
    shiftStrength: 18,
    storageUtilization: 78.4,
    shiftOvertimeActive: false
  });

  const [selectedBayId, setSelectedBayId] = useState('BAY-1');
  const [selectedYardTruckId, setSelectedYardTruckId] = useState('TRK-00088');

  // Stateful Broker parameters
  const [brokerLoads, setBrokerLoads] = useState([
    { id: 'LOD-901', cargo: 'Structural Steel', weight: '32t', route: 'Delhi ➔ Ahmedabad', budget: 112000, bidsCount: 3, status: 'open' },
    { id: 'LOD-892', cargo: 'Polymers', weight: '20t', route: 'Kolkata ➔ Guwahati', budget: 58000, bidsCount: 1, status: 'matched', matchedCarrier: 'Safexpress' },
    { id: 'LOD-884', cargo: 'Electronics', weight: '12t', route: 'Bangalore ➔ Chennai', budget: 28000, bidsCount: 5, status: 'open' }
  ]);

  const [brokerBids, setBrokerBids] = useState([
    { id: 'BID-001', loadId: 'LOD-901', carrier: 'Delhivery', price: 108000, rating: 4.8, truck: 'TRK-00214', status: 'pending' },
    { id: 'BID-002', loadId: 'LOD-901', carrier: 'Safexpress', price: 115000, rating: 4.9, truck: 'TRK-00305', status: 'pending' },
    { id: 'BID-003', loadId: 'LOD-901', carrier: 'V-Trans', price: 105000, rating: 4.6, truck: 'TRK-00184', status: 'pending' },
    { id: 'BID-004', loadId: 'LOD-884', carrier: 'BlueDart', price: 29000, rating: 4.9, truck: 'TRK-00072', status: 'pending' }
  ]);

  const [brokerKPIs, setBrokerKPIs] = useState({
    postedCount: 234,
    closedCount: 189,
    conversionRate: 80.7,
    avgMatchTime: 1.2,
    avgSavings: 8.4
  });

  const [selectedLoadId, setSelectedLoadId] = useState('LOD-901');

  // Modal / Form state for spot posting
  const [brokerPostOpen, setBrokerPostOpen] = useState(false);
  const [brokerForm, setBrokerForm] = useState({
    cargo: 'Industrial Equipment',
    weight: '15',
    originState: 'Maharashtra',
    originDistrict: 'Raigad',
    destState: 'Karnataka',
    destDistrict: 'Bengaluru Urban',
    budget: '54000'
  });

  // Stateful Vendor parameters
  const [vendorServices, setVendorServices] = useState([
    { id: 'SVC-92841', type: 'Fuel Supply', truck: 'TRK-00012', location: 'IOC Plaza, NH48', detail: '250L Diesel Refuel', cost: 22500, time: '14:22', status: 'completed' },
    { id: 'SVC-92839', type: 'Tyre Swap', truck: 'TRK-00028', location: 'Bridgestone Workshop, Pune', detail: 'Rear-axle wheel replacement', cost: 18400, time: '12:10', status: 'completed' },
    { id: 'SVC-92834', type: 'ECU Tuning', truck: 'TRK-00045', location: 'Tata Motors Center, Nagpur', detail: 'Engine diagnostics scan', cost: 6500, time: 'Yesterday', status: 'completed' }
  ]);

  const [vendorKPIs, setVendorKPIs] = useState({
    rating: 4.8,
    costIndex: 94.2,
    reliability: 98.2,
    avgLeadTime: 1.8,
    totalSpent: 47400
  });

  const [selectedServiceId, setSelectedServiceId] = useState('SVC-92841');
  const [vendorRefuelOpen, setVendorRefuelOpen] = useState(false);
  const [vendorForm, setVendorForm] = useState({
    truckId: 'TRK-00012',
    station: 'IOC NH48 Plaza',
    liters: '250',
    unitPrice: '90'
  });

  // Unified Event Stream ledger
  const [eventStream, setEventStream] = useState([
    { id: 1, time: '14:22:15', event: 'Driver Check-in', desc: 'DRV-00124 checked in at Delhi Hub. Attendance verified. Updates: HCM Roster.', tag: 'HCM' },
    { id: 2, time: '13:48:42', event: 'Fuel Card Purchase', desc: 'TRK-00089 refueled 250L diesel (IOC, Surat). Updates: ERP Accounting +₹22,500.', tag: 'ERP' },
    { id: 3, time: '12:10:05', event: 'SLA Milestone Achieved', desc: 'SHP-104889 delivered to Reliance Supply Chain. On-Time. Updates: CRM Health +4%.', tag: 'CRM' }
  ]);

  // AI Copilot state inside Customer Portal
  const [copilotInput, setCopilotInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copilotMsgs, setCopilotMsgs] = useState([
    { sender: 'copilot', text: "Hello! I am your AI Logistics Copilot. I scan the unified GatiFleet Intelligence Graph to answer delay reasons, calculate spot routing quotes, and compare shipping profiles instantly." }
  ]);

  const streamEndRef = useRef(null);

  // Helper to trigger actions with a stateful event log
  const pushEvent = (eventTitle, eventDesc, tag = 'ECOSYSTEM') => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    const newEv = {
      id: Date.now(),
      time,
      event: eventTitle,
      desc: eventDesc,
      tag
    };
    setEventStream(prev => [newEv, ...prev]);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Helper for map hub selection auto-fill
  const handleMapHubSelect = (hub) => {
    if (mapDestinationTarget === 'sender') {
      setBookingForm(prev => ({
        ...prev,
        senderName: hub.name,
        senderPhone: hub.phone.replace('+91 ', ''),
        senderStreet: hub.street,
        senderState: hub.state,
        senderDistrict: hub.district,
        senderPincode: hub.pincode
      }));
      showToast(`Sender address filled from ${hub.name}!`, 'success');
    } else {
      setBookingForm(prev => ({
        ...prev,
        receiverName: hub.name,
        receiverPhone: hub.phone.replace('+91 ', ''),
        receiverStreet: hub.street,
        receiverState: hub.state,
        receiverDistrict: hub.district,
        receiverPincode: hub.pincode
      }));
      showToast(`Receiver address filled from ${hub.name}!`, 'success');
    }
    setMapSelectedHub(hub);
  };

  // Simulate GPS location detection (Blinkit/Zepto style)
  const handleDetectLocation = () => {
    setDetectingLocation(true);
    setTimeout(() => {
      const randomHub = LOGISTICS_HUBS[Math.floor(Math.random() * LOGISTICS_HUBS.length)];
      handleMapHubSelect(randomHub);
      setDetectingLocation(false);
      showToast(`📍 Location detected near ${randomHub.name}`, 'success');
    }, 1800);
  };

  // 1. Action Handler: Customer books a load
  const handleBookShipment = (e) => {
    e.preventDefault();

    // 1. Honeypot check
    if (bookingForm.website_url) {
      alert("Security Block: Bot activity detected! Action aborted.");
      RealityEngine.events = [{
        id: `ev-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'BOT_ATTACK',
        desc: 'Security Shield: Bot request blocked. Honeypot field auto-filled by client robot.',
        source: 'SYS/GUARD'
      }, ...RealityEngine.events];
      RealityEngine.notify();
      return;
    }

    // 2. Cooldown check (Rate limiting: 2 seconds)
    const now = Date.now();
    const lastSubmit = window.__gatifleet_last_submit || 0;
    if (now - lastSubmit < 2000) {
      alert("Security Block: Request rate limit exceeded (HTTP 429). Please wait before submitting again.");
      RealityEngine.events = [{
        id: `ev-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'RATE_LIMIT_BLOCKED',
        desc: 'Security Guard: Client shipment booking spammed. Rate limit enforced.',
        source: 'SYS/GUARD'
      }, ...RealityEngine.events];
      RealityEngine.notify();
      return;
    }
    window.__gatifleet_last_submit = now;

    // 3. XSS / SQLi pattern matching & block
    const checkMalicious = (val, fieldName) => {
      if (/<script/i.test(val) || /onload/i.test(val) || /onerror/i.test(val)) {
        return { isMalicious: true, type: 'XSS Attack', field: fieldName };
      }
      if (/'/i.test(val) || /--/i.test(val) || /OR 1=1/i.test(val) || /UNION SELECT/i.test(val)) {
        return { isMalicious: true, type: 'SQL Injection', field: fieldName };
      }
      return { isMalicious: false };
    };

    const inputsToAudit = [
      { val: bookingForm.senderName, name: 'Sender Name' },
      { val: bookingForm.senderStreet, name: 'Sender Street' },
      { val: bookingForm.receiverName, name: 'Receiver Name' },
      { val: bookingForm.receiverStreet, name: 'Receiver Street' }
    ];

    for (const audit of inputsToAudit) {
      const auditResult = checkMalicious(audit.val, audit.name);
      if (auditResult.isMalicious) {
        alert(`Security Block: Potentially malicious ${auditResult.type} detected in "${auditResult.field}". Submissions blocked.`);
        RealityEngine.events = [{
          id: `ev-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: auditResult.type === 'XSS Attack' ? 'XSS_ATTACK' : 'SQL_INJECTION',
          desc: `Intrusion Warning: Malicious pattern matching ${auditResult.type} blocked in booking input "${auditResult.field}".`,
          source: 'SYS/GUARD'
        }, ...RealityEngine.events];
        RealityEngine.notify();
        return;
      }
    }

    // 4. Contact Phone numbers check (10 digits)
    if (!/^\d{10}$/.test(bookingForm.senderPhone) || !/^\d{10}$/.test(bookingForm.receiverPhone)) {
      alert("Validation Error: Mobile hotline numbers must be exactly 10 digits.");
      return;
    }

    // 5. Pincodes check (6 digits)
    if (!/^\d{6}$/.test(bookingForm.senderPincode) || !/^\d{6}$/.test(bookingForm.receiverPincode)) {
      alert("Validation Error: Indian State Pincodes must be exactly 6 digits.");
      return;
    }

    // 6. Weight & Value bounds checks
    if (bookingForm.weight <= 0 || bookingForm.weight > 100) {
      alert("Validation Error: Shipment load weight must be between 1 and 100 Tonnes.");
      return;
    }
    if (bookingForm.value <= 0) {
      alert("Validation Error: Declared cargo valuation must be greater than zero.");
      return;
    }

    const newShpId = `SHP-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Calculate transit and costs
    const transit = getEstimatedTransit(bookingForm.senderState, bookingForm.receiverState);
    let dieselSpike = 0;
    try {
      dieselSpike = RealityEngine.getState().simulationState.dieselIncrease || 0;
    } catch (err) {
      console.warn("RealityEngine not initialized yet", err);
    }
    const costs = calculateBookingCosts(bookingForm.weight, bookingForm.value, transit.distance, dieselSpike);
    const cost = costs.netCost;
    
    const carbonEst = `${(bookingForm.weight * 0.08).toFixed(1)}t CO2 (-15%)`;
    const senderCoords = getStateCoordinates(bookingForm.senderState);
    
    const newShpObj = {
      id: newShpId,
      ewayBill: `EWB${Math.floor(100000000 + Math.random() * 900000000)}`,
      origin: `${bookingForm.senderDistrict}, ${bookingForm.senderState}`,
      destination: `${bookingForm.receiverDistrict}, ${bookingForm.receiverState}`,
      status: 'scheduled',
      eta: `${transit.hours}h ${transit.mins}m`,
      progress: 0,
      lat: senderCoords.lat,
      lng: senderCoords.lng,
      driver: 'Assigning AI...',
      weight: bookingForm.weight,
      cost,
      value: bookingForm.value,
      delay: 'None',
      carbon: carbonEst,
      risk: 'Low',
      senderName: bookingForm.senderName,
      senderPhone: bookingForm.senderPhone,
      senderStreet: bookingForm.senderStreet,
      senderPincode: bookingForm.senderPincode,
      receiverName: bookingForm.receiverName,
      receiverPhone: bookingForm.receiverPhone,
      receiverStreet: bookingForm.receiverStreet,
      receiverPincode: bookingForm.receiverPincode,
      pickupTime: bookingForm.pickupTime
    };

    setShipments(prev => [newShpObj, ...prev]);
    setSelectedShipmentId(newShpId);
    setBookingOpen(false);
    showToast(`Shipment ${newShpId} booked successfully!`, 'success');
    
    // Dispatch Unified Event to graph
    pushEvent(
      'Customer Books Load',
      `Client booked ${newShpId} (${bookingForm.senderDistrict}➔${bookingForm.receiverDistrict}, ${bookingForm.weight}t). Invoice Net Cost: ₹${cost.toLocaleString()} (Base: ₹${costs.baseFreight.toLocaleString()}, Tolls: ₹${costs.FASTagTolls.toLocaleString()}, Fuel Surcharge: ₹${costs.fuelSurcharge.toLocaleString()}, GST: ₹${costs.gst.toLocaleString()}).`,
      'CRM/ERP'
    );
  };

  const handleSimulateDelay = () => {
    if (!selectedShipmentId) {
      showToast("Select a shipment first", "warning");
      return;
    }
    setShipments(prev => prev.map(s => {
      if (s.id === selectedShipmentId) {
        showToast(`Simulated delay on shipment ${s.id}`, 'warning');
        pushEvent(
          'Monsoon Delay Event',
          `Weather warning on ${s.id} (${s.origin}➔${s.destination}). Nagpur Monsoon (+3.0h delay). Active GPS tracking recalculated.`,
          'CRM/ALERT'
        );
        return {
          ...s,
          status: 'delayed',
          progress: Math.max(10, s.progress - 15),
          delay: 'Nagpur Monsoon (+3.0h)',
          risk: 'High',
          eta: '7h 12m'
        };
      }
      return s;
    }));
  };

  const handleSimulateDelivery = () => {
    if (!selectedShipmentId) {
      showToast("Select a shipment first", "warning");
      return;
    }
    setShipments(prev => prev.map(s => {
      if (s.id === selectedShipmentId) {
        showToast(`Shipment ${s.id} delivered!`, 'success');
        pushEvent(
          'Shipment Delivered',
          `SHP-104921 has arrived at ${s.destination}. All cargo intact. SLA verified. On-Time. Updates: CRM Health +4%.`,
          'CRM/SUCCESS'
        );
        return {
          ...s,
          status: 'delivered',
          progress: 100,
          delay: 'None',
          risk: 'Low',
          eta: 'Arrived'
        };
      }
      return s;
    }));
  };

  const handleResetShipments = () => {
    setShipments(DEFAULT_SHIPMENTS);
    setSelectedShipmentId('SHP-104921');
    showToast("Shipments reset to defaults", "success");
    pushEvent(
      'Reset Shipments',
      `Customer Portal shipments reset to default states.`,
      'CRM/RESET'
    );
  };

  // 2. Action Handler: Customer AI Copilot Questions
  const handleCopilotAsk = (query) => {
    if (!query.trim()) return;
    setCopilotMsgs(prev => [...prev, { sender: 'user', text: query }]);
    setIsTyping(true);
    setCopilotInput('');

    setTimeout(() => {
      let reply = '';
      if (query.toLowerCase().includes('delay') || query.toLowerCase().includes('delayed')) {
        reply = "Looking up live graph... SHP-104922 (Mumbai ➔ Bangalore) is currently delayed by 2.5h near Belagavi due to heavy monsoon downpours on NH48. Our Supply Chain Agent is analyzing a state highway bypass route to reclaim 1.2h.";
      } else if (query.toLowerCase().includes('tons') || query.toLowerCase().includes('move') || query.toLowerCase().includes('50 tons')) {
        reply = "Analyzing available carrier nodes... The Supply Chain Agent detects 3 idle Volvo FM420 trailers at our Delhi Ingestion depot capable of carrying 54 tons cumulative tomorrow. Quote: ₹2,24,000 via NH48. Click 'Book New Shipment' to verify.";
      } else if (query.toLowerCase().includes('cheaper') || query.toLowerCase().includes('cost')) {
        reply = "Optimizing cost parameters... I recommend consolidating LTL (Less-than-Truckload) freight onto our weekly scheduled Delhi-Mumbai DFC rail container line. This reduces dispatch expense by 26% (saving ₹18,000) at the cost of +6h transit delay.";
      } else if (query.toLowerCase().includes('compare') || query.toLowerCase().includes('rail') || query.toLowerCase().includes('road')) {
        reply = "Consigner Corridor Comparison (Delhi-Mumbai):\n\n1. Road (NH48): Time 22h, Carbon: 1.8t CO2, Cost: ₹84,000.\n2. Rail (DFC): Time 28h, Carbon: 0.35t CO2, Cost: ₹62,000. (-80% Carbon footprint, -26% Cost).\n\nRecommendation: Consolidate non-urgent inventory onto Rail lines.";
      } else {
        reply = "Your shipping profile is fully optimized. 3 shipments are en-route, 1 is in loading. Average transit reliability is 96.8% with a 15% carbon reduction versus corridor baselines. Ask me about delays, route costs, or rail detours.";
      }
      setCopilotMsgs(prev => [...prev, { sender: 'copilot', text: reply }]);
      setIsTyping(false);
    }, 1200);
  };

  // 3. Driver App Action: Trigger Harsh Braking
  const triggerHarshBraking = () => {
    setDriverState(prev => ({
      ...prev,
      safetyScore: Math.max(50, prev.safetyScore - 6),
      violations: prev.violations + 1
    }));
    showToast("Safety Event Registered: Harsh Braking!", "warning");
    pushEvent(
      'Harsh Braking Event',
      `DRV-00124 (Tata Prima) logged 1.2G longitudinal decelerative deceleration. Updates: HCM Safety twin score -6%, Insurance actuarial Risk rating +14%, NOC warning alert flagged.`,
      'HCM/SAFETY'
    );
  };

  // 4. Driver App Action: Trigger Rest Check-In
  const triggerRestCheckIn = () => {
    setDriverState(prev => ({
      ...prev,
      fatigue: 5
    }));
    showToast("Rest checked in. Fatigue levels reset.", "success");
    pushEvent(
      'Driver Rest Logged',
      `DRV-00124 checked in at NH44 COCO Rest Plaza. Fatigue levels reset to 5%. Updates: HCM duty roster, ELD Hours of Service compliance clock reset.`,
      'ELD/HCM'
    );
  };

  // Driver biometrics stress toggle
  const handleToggleStressMode = () => {
    setDriverStressMode(prev => {
      const next = !prev;
      setDriverTelemetry(t => ({
        ...t,
        heartRate: next ? '118 bpm' : '78 bpm',
        spo2: next ? '94%' : '98%'
      }));
      showToast(next ? "Elevated stress detected! AI coach recommends resting." : "Heart rate and stress levels returned to normal.", next ? "warning" : "success");
      pushEvent(
        next ? 'Elevated Driver Stress Alert' : 'Driver Stress Normalized',
        next ? `DRV-00124 heart rate spiked to 118 bpm. SpO2 level at 94%.` : `DRV-00124 biometrics stabilized at 78 bpm.`,
        'HCM/BIOMETRICS'
      );
      return next;
    });
  };

  // Driver HOS status changer
  const handleChangeDutyStatus = (status) => {
    setDriverDutyStatus(status);
    let fatigueVal = 12;
    if (status === 'driving') fatigueVal = 35;
    if (status === 'on_duty') fatigueVal = 20;
    if (status === 'off_duty') fatigueVal = 8;
    if (status === 'sleeper') fatigueVal = 3;

    setDriverState(prev => ({
      ...prev,
      fatigue: fatigueVal
    }));

    showToast(`Duty status set to ${status.toUpperCase().replace('_', ' ')}`, "success");
    pushEvent(
      'HOS Duty Status Transitioned',
      `DRV-00124 duty status transitioned to ${status.toUpperCase().replace('_', ' ')}. Fatigue index: ${fatigueVal}%.`,
      'ELD/HCM'
    );
  };

  // Driver Speed simulator
  const handleAccelerateSpeed = () => {
    setDriverTelemetry(t => {
      const nextSpeed = 95;
      setDriverState(prev => ({
        ...prev,
        safetyScore: Math.max(50, prev.safetyScore - 8),
        violations: prev.violations + 1
      }));
      showToast("Speeding Alert: Exceeded 80 km/h limit!", "warning");
      pushEvent(
        'Overspeeding Violation Registered',
        `DRV-00124 speed logged at ${nextSpeed} km/h on NH48 corridor. Safety score decremented.`,
        'HCM/SAFETY'
      );
      return {
        ...t,
        speed: `${nextSpeed} km/h`
      };
    });
  };

  const handleSlowDownSpeed = () => {
    setDriverTelemetry(t => {
      showToast("Speed normalized to 72 km/h", "success");
      pushEvent(
        'Speed Normalized',
        `DRV-00124 speed stabilized to 72 km/h. compliance check ok.`,
        'HCM/SAFETY'
      );
      return {
        ...t,
        speed: '72 km/h'
      };
    });
  };

  // Waypoint checker
  const handleArriveAtWaypoint = (waypoint) => {
    setDriverTelemetry(t => ({
      ...t,
      activeWaypoint: waypoint
    }));
    showToast(`Arrived at waypoint: ${waypoint}`, "success");
    pushEvent(
      'Waypoint Checked In',
      `DRV-00124 reached waypoint: ${waypoint}. Toll plaza Fastag cleared (₹350 deduction logged).`,
      'ELD/ECOSYSTEM'
    );
  };

  // 5. Fleet Owner Action: Complete Service
  const triggerFleetService = (truckId) => {
    setFleetTrucks(prev => prev.map(t => {
      if (t.id === truckId) {
        showToast(`Preventive maintenance scheduled for ${truckId}`, 'success');
        pushEvent(
          'Preventive Maintenance Logged',
          `${truckId} status set to maintenance. Rerouted to GatiFleet Workshop. speed: 0 km/h.`,
          'ERP/FLEET'
        );
        return {
          ...t,
          status: 'maintenance',
          speed: '0 km/h (In Workshop)',
          obd: {
            ...t.obd,
            rpm: '0 rpm'
          }
        };
      }
      return t;
    }));
  };

  const handleRecalibrateOBD = (truckId) => {
    setFleetTrucks(prev => prev.map(t => {
      if (t.id === truckId) {
        showToast(`OBD Diagnostics cleared for ${truckId}!`, 'success');
        pushEvent(
          'OBD Sensors Recalibrated',
          `ECU reset triggered for ${truckId}. Diagnostic trouble codes cleared. health: 100%.`,
          'ERP/FLEET'
        );
        return {
          ...t,
          health: 100,
          obd: {
            ...t.obd,
            faultCodes: []
          }
        };
      }
      return t;
    }));
  };

  const handleToggleRouteOptimization = () => {
    setFleetRouteOptimization(prev => {
      const next = !prev;
      setFleetTrucks(trucks => trucks.map(t => {
        if (t.status === 'active') {
          const speedNum = parseInt(t.speed) || 60;
          const newSpeed = next ? speedNum + 8 : speedNum - 8;
          return {
            ...t,
            speed: `${newSpeed} km/h`
          };
        }
        return t;
      }));
      setFleetState(f => ({
        ...f,
        fuelEfficiency: next ? 5.2 : 4.8
      }));
      showToast(next ? "AI route optimization enabled! Alternate corridors mapped." : "AI route optimization disabled.", "success");
      pushEvent(
        next ? 'AI Route Optimization Enabled' : 'AI Route Optimization Disabled',
        next ? `Bypass routing active. Average fuel efficiency increased to 5.2 km/L.` : `Reverted to default route guidelines.`,
        'ERP/FLEET'
      );
      return next;
    });
  };

  // Fleet OS: Telemetry Fault Simulator
  const handleSimulateTyreDrop = () => {
    const truckId = selectedFleetTruckId;
    setFleetTyrePressures(prev => ({
      ...prev,
      [truckId]: { fl: prev[truckId]?.fl || 110, fr: 65, rl: prev[truckId]?.rl || 112, rr: 65 }
    }));
    setFleetTrucks(prev => prev.map(t => {
      if (t.id === truckId) {
        const existingCodes = t.obd?.faultCodes || [];
        const tyreDTC = 'P0078 - Tyre Low Pressure (FR/RR: 65 psi)';
        return {
          ...t,
          health: Math.min(t.health, 72),
          obd: {
            ...t.obd,
            faultCodes: existingCodes.includes(tyreDTC) ? existingCodes : [...existingCodes, tyreDTC]
          }
        };
      }
      return t;
    }));
    setActiveSubsystemTab('tyres');
    showToast(`⚠ Tyre pressure drop detected on ${truckId}! FR/RR at 65 psi.`, 'warning');
    pushEvent(
      'DTC Alert: Tyre Pressure Drop',
      `${truckId} front-right and rear-right tyres dropped to 65 psi (threshold: 90 psi). DTC P0078 logged. Health: 72%.`,
      'OBD/FLEET'
    );
  };

  const handleSimulateReeferRise = () => {
    const truckId = selectedFleetTruckId;
    setFleetReeferTemps(prev => ({
      ...prev,
      [truckId]: 18.0
    }));
    setFleetTrucks(prev => prev.map(t => {
      if (t.id === truckId) {
        const existingCodes = t.obd?.faultCodes || [];
        const reeferDTC = 'P1200 - Reefer Temp Breach (18 °C > 5 °C limit)';
        return {
          ...t,
          health: Math.min(t.health, 78),
          obd: {
            ...t.obd,
            faultCodes: existingCodes.includes(reeferDTC) ? existingCodes : [...existingCodes, reeferDTC]
          }
        };
      }
      return t;
    }));
    setActiveSubsystemTab('cargo');
    showToast(`🔴 Reefer temperature breach on ${truckId}! 18 °C exceeds 5 °C limit.`, 'warning');
    pushEvent(
      'Cargo Alert: Reefer Temperature Breach',
      `${truckId} reefer container temperature surged to 18 °C (limit: 5 °C). DTC P1200 logged. Cargo spoilage risk elevated.`,
      'OBD/FLEET'
    );
  };

  const handleClearAllFaults = () => {
    const truckId = selectedFleetTruckId;
    setFleetTyrePressures(prev => ({
      ...prev,
      [truckId]: { fl: 110, fr: 110, rl: 112, rr: 110 }
    }));
    setFleetReeferTemps(prev => ({
      ...prev,
      [truckId]: 2.0
    }));
    setFleetTrucks(prev => prev.map(t => {
      if (t.id === truckId) {
        return {
          ...t,
          health: 100,
          obd: {
            ...t.obd,
            faultCodes: []
          }
        };
      }
      return t;
    }));
    setActiveSubsystemTab('engine');
    showToast(`✅ All DTC codes cleared on ${truckId}. Sensors recalibrated.`, 'success');
    pushEvent(
      'ZKP Sensor Recalibration Complete',
      `${truckId} ECU zero-knowledge reset executed. DTC codes cleared. Tyres: 110 psi nominal. Reefer: 2.0 °C. Health: 100%.`,
      'OBD/FLEET'
    );
  };

  const handleSimulateCoolantBreach = () => {
    const truckId = 'TRK-00012';
    setFleetTrucks(prev => prev.map(t => {
      if (t.id === truckId) {
        const existingCodes = t.obd?.faultCodes || [];
        const engineDTC = 'P0117 - Coolant Temp Breach (115 °C > 100 °C limit)';
        return {
          ...t,
          health: 62,
          obd: {
            ...t.obd,
            coolant: '115 °C',
            rpm: '1650 rpm',
            faultCodes: existingCodes.includes(engineDTC) ? existingCodes : [...existingCodes, engineDTC]
          }
        };
      }
      return t;
    }));
    
    setShipments(prev => prev.map(s => {
      if (s.id === 'SHP-104921') {
        return {
          ...s,
          status: 'delayed',
          progress: Math.max(10, s.progress - 12),
          delay: 'Engine Overheat Breach',
          risk: 'High',
          eta: '9h 15m'
        };
      }
      return s;
    }));

    const svcId = `SVC-${Math.floor(90000 + Math.random() * 10000)}`;
    const newSvc = {
      id: svcId,
      type: 'ECU / Coolant Repair',
      truck: truckId,
      location: 'Nagpur Bypass Workshop',
      detail: 'Coolant leak and thermostat sensor recalibration required.',
      cost: 14500,
      time: 'Just Now',
      status: 'pending'
    };
    setVendorServices(prev => [newSvc, ...prev]);
    setSelectedServiceId(svcId);

    setActiveSubsystemTab('engine');
    showToast(`⚠ Coolant breach detected on ${truckId}! Temp: 115 °C. SLA risk high on SHP-104921.`, 'warning');
    pushEvent(
      'Closed-Loop OBD Alert: Coolant Breach',
      `${truckId} coolant temperature surged to 115 °C. DTC P0117 logged. Downstream SLA impact: SHP-104921 delayed. Vendor maintenance ticket generated.`,
      'CRM/FLEET'
    );
  };

  // Computed filtered fleet list
  const filteredFleetTrucks = useMemo(() => {
    return fleetTrucks.filter(t => {
      const matchesSearch = fleetSearchQuery === '' ||
        t.id.toLowerCase().includes(fleetSearchQuery.toLowerCase()) ||
        t.model.toLowerCase().includes(fleetSearchQuery.toLowerCase());
      const matchesStatus = fleetStatusFilter === 'all' || t.status === fleetStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [fleetTrucks, fleetSearchQuery, fleetStatusFilter]);

  // 6. Vendor Actions
  const handleVendorRefuel = (e) => {
    e.preventDefault();
    const svcId = `SVC-${Math.floor(90000 + Math.random() * 10000)}`;
    const litersVal = parseFloat(vendorForm.liters) || 200;
    const priceVal = parseFloat(vendorForm.unitPrice) || 90;
    const cost = Math.floor(litersVal * priceVal);

    const newSvc = {
      id: svcId,
      type: 'Fuel Supply',
      truck: vendorForm.truckId,
      location: vendorForm.station,
      detail: `${litersVal}L Diesel Refuel`,
      cost,
      time: 'Just Now'
    };

    setVendorServices(prev => [newSvc, ...prev]);
    setVendorKPIs(prev => ({
      ...prev,
      totalSpent: prev.totalSpent + cost,
      costIndex: parseFloat((prev.costIndex * 0.99).toFixed(1))
    }));
    setVendorRefuelOpen(false);

    showToast(`Refuel receipt ${svcId} logged in ERP`, 'success');
    pushEvent(
      'Fuel Card Transaction',
      `${vendorForm.truckId} refueled ${litersVal}L diesel at ${vendorForm.station} (Cost: ₹${cost.toLocaleString()} @ ₹${priceVal}/L). Updates: Finance Agent automated ledger reconciliation, ERP spend accounts.`,
      'ERP/VENDOR'
    );
  };

  const handleVendorService = (truckId, serviceType, details, costVal) => {
    const svcId = `SVC-${Math.floor(90000 + Math.random() * 10000)}`;
    const cost = parseFloat(costVal) || 12000;

    const newSvc = {
      id: svcId,
      type: serviceType,
      truck: truckId,
      location: 'GatiFleet Partner Workshop',
      detail: details,
      cost,
      time: 'Just Now'
    };

    setVendorServices(prev => [newSvc, ...prev]);
    setVendorKPIs(prev => ({
      ...prev,
      totalSpent: prev.totalSpent + cost,
      reliability: parseFloat(Math.min(100, prev.reliability + 0.1).toFixed(1))
    }));

    showToast(`Preventive ${serviceType} scheduled for ${truckId}`, 'success');
    pushEvent(
      'Preventive Maintenance Logged',
      `${truckId} scheduled for ${serviceType} (${details}) at GatiFleet Partner Workshop (Est: ₹${cost.toLocaleString()}). Updates: ERP fleet depreciation ledger.`,
      'ERP/VENDOR'
    );
  };

  const handleVendorServiceSettle = (svcId) => {
    const svc = vendorServices.find(s => s.id === svcId);
    if (!svc) return;

    setVendorServices(prev => prev.map(s => s.id === svcId ? { ...s, status: 'completed' } : s));

    setVendorKPIs(prev => ({
      ...prev,
      totalSpent: prev.totalSpent + svc.cost,
      reliability: parseFloat(Math.min(100, prev.reliability + 1.2).toFixed(1))
    }));

    if (svc.truck === 'TRK-00012' && svc.type.includes('Coolant')) {
      setFleetTrucks(prev => prev.map(t => {
        if (t.id === 'TRK-00012') {
          return {
            ...t,
            health: 98,
            obd: {
              ...t.obd,
              coolant: '92 °C',
              rpm: '1420 rpm',
              faultCodes: []
            }
          };
        }
        return t;
      }));

      setShipments(prev => prev.map(s => {
        if (s.id === 'SHP-104921') {
          return {
            ...s,
            status: 'in_transit',
            progress: Math.min(95, s.progress + 10),
            delay: 'None',
            risk: 'Low',
            eta: '3h 45m'
          };
        }
        return s;
      }));

      showToast("Closed-loop service repair completed! TRK-00012 health restored & SHP-104921 en-route.", "success");
      pushEvent(
        'Closed-Loop Service Settle',
        `Workshop completed Coolant Repair on TRK-00012. Spent: ₹${svc.cost.toLocaleString()}. Fleet health restored (98%). Downstream SLA: SHP-104921 returned to In Transit.`,
        'ERP/VENDOR'
      );
    } else {
      showToast(`Service ticket ${svcId} resolved. Cost: ₹${svc.cost.toLocaleString()}`, 'success');
      pushEvent(
        'Maintenance Settle',
        `Service ticket ${svcId} settled at partner workshop for ${svc.truck}. Spent: ₹${svc.cost.toLocaleString()}.`,
        'ERP/VENDOR'
      );
    }
  };

  const handleAutoRunMaintenanceScan = () => {
    showToast("Scanning fleet health...", "info");
    setTimeout(() => {
      pushEvent(
        'AI Maintenance Scan Completed',
        `Scanner scanned 50 fleet nodes. No urgent critical sensor defects found. 2 warnings scheduled for tyre rotations.`,
        'ERP/VENDOR'
      );
      showToast("Preventive scans completed. Health is 98.2%", "success");
    }, 1500);
  };

  // 7. Broker Actions
  const handlePostSpotLoad = (e) => {
    e.preventDefault();
    const loadId = `LOD-${Math.floor(800 + Math.random() * 200)}`;
    const budgetVal = parseFloat(brokerForm.budget) || 50000;
    const weightVal = `${brokerForm.weight}t`;
    
    const newLoad = {
      id: loadId,
      cargo: brokerForm.cargo,
      weight: weightVal,
      route: `${brokerForm.originDistrict} ➔ ${brokerForm.destDistrict}`,
      budget: budgetVal,
      bidsCount: 0,
      status: 'open'
    };

    setBrokerLoads(prev => [newLoad, ...prev]);
    setBrokerKPIs(prev => ({ ...prev, postedCount: prev.postedCount + 1 }));
    setBrokerPostOpen(false);
    setSelectedLoadId(loadId);

    showToast(`Spot Load ${loadId} posted successfully!`, 'success');
    pushEvent(
      'Spot Load Posted',
      `Posted ${weightVal} of ${brokerForm.cargo} (${newLoad.route}) with a target budget of ₹${budgetVal.toLocaleString()}. Updates: Spot matching board.`,
      'CRM/BROKER'
    );

    // Simulate bids arriving in 2-3 seconds
    setTimeout(() => {
      const carriers = ['Delhivery', 'Safexpress', 'BlackBuck', 'Tata Logistics', 'BlueDart'];
      const carrier1 = carriers[Math.floor(Math.random() * carriers.length)];
      let carrier2 = carriers[Math.floor(Math.random() * carriers.length)];
      while (carrier2 === carrier1) {
        carrier2 = carriers[Math.floor(Math.random() * carriers.length)];
      }

      const price1 = Math.floor(budgetVal * (0.9 + Math.random() * 0.15));
      const price2 = Math.floor(budgetVal * (0.9 + Math.random() * 0.15));

      const newBids = [
        {
          id: `BID-${Math.floor(100 + Math.random() * 900)}`,
          loadId,
          carrier: carrier1,
          price: price1,
          rating: parseFloat((4.2 + Math.random() * 0.7).toFixed(1)),
          truck: `TRK-${Math.floor(10000 + Math.random() * 90000)}`,
          status: 'pending'
        },
        {
          id: `BID-${Math.floor(100 + Math.random() * 900)}`,
          loadId,
          carrier: carrier2,
          price: price2,
          rating: parseFloat((4.2 + Math.random() * 0.7).toFixed(1)),
          truck: `TRK-${Math.floor(10000 + Math.random() * 90000)}`,
          status: 'pending'
        }
      ];

      setBrokerBids(prev => [...prev, ...newBids]);
      setBrokerLoads(prev => prev.map(l => l.id === loadId ? { ...l, bidsCount: 2 } : l));
      pushEvent(
        'Bids Received on Spot Load',
        `Received 2 carrier bids for ${loadId}. Lowest bid: ₹${Math.min(price1, price2).toLocaleString()}. Updates: Broker App.`,
        'CRM/BROKER'
      );
    }, 2000);
  };

  const handleAcceptBid = (loadId, bidId) => {
    const bid = brokerBids.find(b => b.id === bidId);
    const load = brokerLoads.find(l => l.id === loadId);
    if (!bid || !load) return;

    const weightNum = parseFloat(load.weight) || 15;
    const shpId = `SHP-${Math.floor(100000 + Math.random() * 900000)}`;
    const newShp = {
      id: shpId,
      ewayBill: `EWB${Math.floor(100000000 + Math.random() * 900000000)}`,
      origin: load.route.split(' ➔ ')[0] || 'Delhi Depot',
      destination: load.route.split(' ➔ ')[1] || 'Mumbai Hub',
      status: 'in_transit',
      eta: '22h 15m',
      progress: 8,
      lat: 28.4,
      lng: 77.1,
      driver: 'Subcontractor Driver',
      weight: weightNum,
      cost: bid.price,
      value: weightNum * 180000,
      delay: 'None',
      carbon: `${(weightNum * 0.08).toFixed(1)}t CO2 (-12%)`,
      risk: 'Low'
    };

    setShipments(prev => [newShp, ...prev]);
    setBrokerLoads(prev => prev.map(l => l.id === loadId ? { ...l, status: 'matched', matchedCarrier: bid.carrier } : l));
    setBrokerBids(prev => prev.map(b => b.id === bidId ? { ...b, status: 'accepted' } : b.loadId === loadId ? { ...b, status: 'rejected' } : b));
    setBrokerKPIs(prev => ({
      ...prev,
      closedCount: prev.closedCount + 1,
      avgSavings: parseFloat((prev.avgSavings + ((load.budget - bid.price) / load.budget * 100) / 2).toFixed(1))
    }));

    showToast(`Bid accepted. Load matched to ${bid.carrier} (${bid.truck})`, 'success');
    pushEvent(
      'Spot Bid Accepted',
      `Matched ${loadId} to ${bid.carrier} at ₹${bid.price.toLocaleString()} (Budget: ₹${load.budget.toLocaleString()}). Dispatched under shipment ${shpId}. Updates: NOC Tracking.`,
      'CRM/BROKER'
    );
  };

  const handleCancelLoad = (loadId) => {
    setBrokerLoads(prev => prev.map(l => l.id === loadId ? { ...l, status: 'cancelled' } : l));
    showToast(`Spot load ${loadId} cancelled`, 'warning');
    pushEvent(
      'Spot Load Cancelled',
      `Spot load ${loadId} has been withdrawn from the matching board.`,
      'CRM/BROKER'
    );
  };

  const handleAutoMatchBids = () => {
    let matchesCount = 0;
    const openLoads = brokerLoads.filter(l => l.status === 'open');

    openLoads.forEach(load => {
      const loadBids = brokerBids.filter(b => b.loadId === load.id && b.status === 'pending');
      if (loadBids.length > 0) {
        const bestBid = loadBids.reduce((best, current) => current.price < best.price ? current : best, loadBids[0]);
        handleAcceptBid(load.id, bestBid.id);
        matchesCount++;
      }
    });

    if (matchesCount > 0) {
      showToast(`AI Spot Matcher matched ${matchesCount} loads!`, 'success');
    } else {
      showToast("No matches available", 'warning');
    }
  };

  const handleTriggerBidWar = (loadId) => {
    const load = brokerLoads.find(l => l.id === loadId);
    if (!load || load.status !== 'open') return;

    const currentBids = brokerBids.filter(b => b.loadId === loadId);
    const lowestPrice = currentBids.length > 0 
      ? Math.min(...currentBids.map(b => b.price)) 
      : load.budget;

    const discount = Math.floor(lowestPrice * 0.05 + Math.random() * 2000);
    const newPrice = Math.max(10000, lowestPrice - discount);
    const bidId = `BID-${Math.floor(800 + Math.random() * 200)}`;
    const carrier = ['Safexpress', 'Delhivery', 'V-Trans', 'BlackBuck', 'BlueDart', 'Eicher Logistics'][Math.floor(Math.random() * 6)];

    const newBid = {
      id: bidId,
      loadId,
      carrier,
      price: newPrice,
      rating: parseFloat((4.3 + Math.random() * 0.6).toFixed(1)),
      truck: `TRK-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'pending'
    };

    setBrokerBids(prev => [...prev, newBid]);
    setBrokerLoads(prev => prev.map(l => l.id === loadId ? { ...l, bidsCount: l.bidsCount + 1 } : l));
    
    showToast(`🔥 Competitive Bid War! ${carrier} placed a lower bid of ₹${newPrice.toLocaleString()}`, 'warning');
    pushEvent(
      'Spot Bid War Triggered',
      `Carrier ${carrier} undercut previous bids for load ${loadId} with a new offer of ₹${newPrice.toLocaleString()}. Updates: Spot Matching Board.`,
      'CRM/BROKER'
    );
  };

  // 8. Warehouse Actions
  const handleDockTrailer = (bayId, truckId) => {
    const truck = yardQueue.find(t => t.id === truckId);
    if (!truck) return;

    setYardQueue(prev => prev.filter(t => t.id !== truckId));
    setWarehouseBays(prev => prev.map(b => b.id === bayId ? {
      ...b,
      truck: truck.id,
      carrier: truck.carrier,
      status: 'loading',
      action: Math.random() > 0.5 ? 'Inbound Loading' : 'Outbound Dispatch',
      dwell: 0.1,
      progress: 10,
      type: truck.cargo
    } : b));

    showToast(`Trailer ${truckId} docked at ${bayId}`, 'success');
    pushEvent(
      'Trailer Docked',
      `Yard trailer ${truckId} (${truck.carrier}) assigned to ${bayId} for loading of ${truck.cargo}. Updates: WH Yard queue.`,
      'WH/ECOSYSTEM'
    );
  };

  const handleStartLoading = (bayId) => {
    setWarehouseBays(prev => prev.map(b => b.id === bayId ? {
      ...b,
      status: 'active',
      progress: 30
    } : b));

    showToast(`Loading operations started at ${bayId}`, 'success');
    pushEvent(
      'Loading Operations Started',
      `Loading crew assigned to ${bayId}. Dynamic container weights updating.`,
      'WH/ECOSYSTEM'
    );
  };

  const handleGateOut = (bayId) => {
    const bay = warehouseBays.find(b => b.id === bayId);
    if (!bay || !bay.truck) return;

    const shpId = `SHP-${Math.floor(100000 + Math.random() * 900000)}`;
    const newShp = {
      id: shpId,
      ewayBill: `EWB${Math.floor(100000000 + Math.random() * 900000000)}`,
      origin: 'Delhi Depot',
      destination: 'Mumbai Hub',
      status: 'in_transit',
      eta: '18h 30m',
      progress: 5,
      lat: 28.6,
      lng: 77.2,
      driver: 'Autonomous AI Driver',
      weight: 15,
      cost: 84000,
      value: 2500000,
      delay: 'None',
      carbon: '1.2t CO2 (-15%)',
      risk: 'Low'
    };

    setShipments(prev => [newShp, ...prev]);
    setWarehouseBays(prev => prev.map(b => b.id === bayId ? {
      ...b,
      truck: null,
      carrier: null,
      status: 'empty',
      action: 'Available',
      dwell: 0,
      progress: 0,
      type: 'None'
    } : b));

    showToast(`Gate-Out complete. ${bay.truck} dispatched as ${shpId}`, 'success');
    pushEvent(
      'Gate-Out Dispatched',
      `Outbound carrier ${bay.truck} departed ${bayId}. Dispatched under dynamic e-way bill. New tracking twin: ${shpId}. Updates: NOC Tracking.`,
      'WH/ECOSYSTEM'
    );
  };

  const handleSimulateGateIn = () => {
    const carriers = ['Safexpress', 'Delhivery', 'V-Trans', 'BlackBuck', 'BlueDart', 'Gati'];
    const cargoTypes = ['Industrial Steel', 'Consumer Goods', 'Cold Chain Food', 'Chemicals', 'Electronics'];
    const weights = [12, 16, 8, 20, 24];
    const values = [1500000, 3200000, 2400000, 4800000, 1800000];

    const carrier = carriers[Math.floor(Math.random() * carriers.length)];
    const cargo = cargoTypes[Math.floor(Math.random() * cargoTypes.length)];
    const weight = weights[Math.floor(Math.random() * weights.length)];
    const value = values[Math.floor(Math.random() * values.length)];
    const truckId = `TRK-${Math.floor(10000 + Math.random() * 90000)}`;

    const newTruck = {
      id: truckId,
      carrier,
      cargo,
      weight,
      value,
      arrivalTime: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5),
      status: Math.random() > 0.5 ? 'sealed' : 'unchecked'
    };

    setYardQueue(prev => [...prev, newTruck]);
    setDepotKPIs(prev => ({ ...prev, inboundCount: prev.inboundCount + 1 }));

    showToast(`Gate-In Check: ${truckId} arrived at yard`, 'success');
    pushEvent(
      'Inbound Gate-In logged',
      `Carrier ${truckId} (${carrier}) checked in at warehouse gate. Manifest details verified. Added to yard queue.`,
      'WH/ECOSYSTEM'
    );
  };

  const handleToggleOvertime = () => {
    setDepotKPIs(prev => {
      const active = !prev.shiftOvertimeActive;
      return {
        ...prev,
        shiftOvertimeActive: active,
        laborProductivity: active ? 98.8 : 94.2,
        avgDwellTime: active ? 1.4 : 1.8,
        shiftStrength: active ? 24 : 18
      };
    });

    showToast(depotKPIs.shiftOvertimeActive ? "Shift overtime ended" : "Overtime loaders dispatched to docks!", 'success');
    pushEvent(
      'Labor Shift Adjusted',
      depotKPIs.shiftOvertimeActive
        ? `Overtime shift ended. Reverting to base loading crew (18 loaders).`
        : `Dispatched 6 emergency loaders to dock bays. Shift strength: 24 loaders. Labor efficiency: 98.8%.`,
      'WH/ECOSYSTEM'
    );
  };

  const handleAutoOptimizeDocks = () => {
    let currentYard = [...yardQueue];
    let baysUpdated = false;

    setWarehouseBays(prev => {
      return prev.map(b => {
        if (b.status === 'empty' && currentYard.length > 0) {
          const truck = currentYard.shift();
          baysUpdated = true;
          return {
            ...b,
            truck: truck.id,
            carrier: truck.carrier,
            status: 'loading',
            action: Math.random() > 0.5 ? 'Inbound Loading' : 'Outbound Dispatch',
            dwell: 0.1,
            progress: 10,
            type: truck.cargo
          };
        }
        return b;
      });
    });

    if (baysUpdated) {
      setYardQueue(currentYard);
      showToast("AI Dock Optimization executed", 'success');
      pushEvent(
        'AI Dock Optimization',
        `Autonomous loading planner reassigned yard vehicles to empty docks. Dwell bottlenecks cleared.`,
        'WH/ECOSYSTEM'
      );
    } else {
      showToast("No empty bays or waiting trailers available", 'warning');
    }
  };

  return (
    <div style={{
      padding: 'var(--space-6)',
      background: 'var(--bg-900)',
      minHeight: 'calc(100vh - var(--topbar-height))',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)',
      position: 'relative'
    }}>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            style={{
              position: 'fixed',
              top: '80px',
              right: '24px',
              zIndex: 9999,
              padding: '12px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface-solid)',
              border: `1px solid ${toast.type === 'success' ? 'var(--success-500)' : 'var(--danger-500)'}`,
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            {toast.type === 'success' ? <CheckCircle size={16} color="var(--success-500)" /> : <AlertTriangle size={16} color="var(--danger-500)" />}
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Role Switcher */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: 'var(--space-4)'
      }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Ecosystem Portals Workspace
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            Consuming the Unified GatiFleet Intelligence Graph across all transportation nodes.
          </p>
        </div>

        {/* 6-Layer Selector Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 8,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-subtle)',
          padding: 4,
          borderRadius: 'var(--radius-lg)'
        }}>
          {[
            { id: 'customer', label: 'Customer Portal', icon: Building2, color: 'var(--primary-400)' },
            { id: 'driver', label: 'Driver App', icon: Users, color: '#38CE3C' },
            { id: 'fleet', label: 'Fleet OS', icon: Truck, color: '#a855f7' },
            { id: 'vendor', label: 'Vendor Portal', icon: Landmark, color: '#f59e0b' },
            { id: 'broker', label: 'Broker App', icon: Coins, color: '#ec4899' },
            { id: 'warehouse', label: 'Warehouse Hub', icon: ShieldCheck, color: '#06b6d4' }
          ].map(role => {
            const isActive = activePortal === role.id;
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => setActivePortal(role.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '10px 0',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  background: isActive ? 'var(--surface-hover)' : 'transparent',
                  color: isActive ? role.color : 'var(--text-secondary)',
                  borderBottom: isActive ? `2px solid ${role.color}` : 'none',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={14} color={isActive ? role.color : 'var(--text-muted)'} />
                <span>{role.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Content Area */}
      <div style={{ flex: 1, minHeight: '480px' }}>
        
        {/* ==================== LAYER 1: CUSTOMER PORTAL ==================== */}
        {/* ==================== LAYER 1: CUSTOMER PORTAL ==================== */}
        {activePortal === 'customer' && (() => {
          const filteredShipments = shipments.filter(s => {
            const query = shipmentSearchQuery.toLowerCase();
            return (s.id.toLowerCase().includes(query) ||
                    s.origin.toLowerCase().includes(query) ||
                    s.destination.toLowerCase().includes(query)) &&
                   (shipmentStatusFilter === 'all' || s.status === shipmentStatusFilter);
          });

          const selectedShipment = shipments.find(s => s.id === selectedShipmentId) || shipments[0];

          const activeSpend = shipments.reduce((sum, s) => s.status !== 'delivered' ? sum + s.cost : sum, 0) + 2500000;
          const creditUtilizationPct = (activeSpend / 5000000) * 100;
          
          const deliveredCount = shipments.filter(s => s.status === 'delivered').length;
          const delayedCount = shipments.filter(s => s.status === 'delayed').length;
          const quoteAcceptance = Math.min(100, Math.max(50, 87.2 + (deliveredCount * 2.0) - (delayedCount * 3.5))).toFixed(1);
          
          const disputes = delayedCount;
          
          const churnRisk = disputes > 1 
            ? { level: 'High', pct: '48%', color: 'var(--danger-500)', sentiment: 'Negative' }
            : disputes === 1 
            ? { level: 'Medium', pct: '24%', color: '#f59e0b', sentiment: 'Neutral' }
            : { level: 'Low', pct: '8%', color: '#38CE3C', sentiment: 'Highly Positive' };

          const healthScore = Math.min(100, Math.max(35, 95 - (delayedCount * 12) + (deliveredCount * 4)));

          // Route coordinates computation for selected shipment
          let progress = selectedShipment ? selectedShipment.progress : 0;
          let truckX = 50;
          let truckY = 70;
          let wp1 = { x: 125, y: 48 };
          let wp2 = { x: 200, y: 40 };
          let wp3 = { x: 275, y: 48 };
          
          if (selectedShipment) {
            const t = progress / 100;
            // Q-bezier curve formula: (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
            // P0 = (50, 70), P1 = (200, 20), P2 = (350, 70)
            truckX = (1 - t) * (1 - t) * 50 + 2 * (1 - t) * t * 200 + t * t * 350;
            truckY = (1 - t) * (1 - t) * 70 + 2 * (1 - t) * t * 20 + t * t * 70;
            
            const getPtOnCurve = (tVal) => {
              const x = (1 - tVal) * (1 - tVal) * 50 + 2 * (1 - tVal) * tVal * 200 + tVal * tVal * 350;
              const y = (1 - tVal) * (1 - tVal) * 70 + 2 * (1 - tVal) * tVal * 20 + tVal * tVal * 70;
              return { x, y };
            };
            wp1 = getPtOnCurve(0.25);
            wp2 = getPtOnCurve(0.5);
            wp3 = getPtOnCurve(0.75);
          }

          const selectedStatusColor = selectedShipment 
            ? (selectedShipment.status === 'delayed' ? 'var(--danger-500)' : selectedShipment.status === 'delivered' ? 'var(--success-500)' : 'var(--primary-400)')
            : 'var(--primary-400)';

          const milestones = [
            { key: 'booked', label: 'Booked', progressLimit: 0, time: '09:00 AM' },
            { key: 'picked_up', label: 'Picked Up', progressLimit: 15, time: '11:30 AM' },
            { key: 'in_transit', label: 'In Transit', progressLimit: 40, time: '02:00 PM' },
            { key: 'customs_toll', label: 'Customs/Toll', progressLimit: 60, time: '06:15 PM' },
            { key: 'out_for_delivery', label: 'Out for Delivery', progressLimit: 85, time: '10:00 AM' },
            { key: 'delivered', label: 'Delivered', progressLimit: 100, time: '01:30 PM' }
          ];

          return (
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 340px', gap: 'var(--space-6)' }}>
              
              {/* Left Column: Shipment Registry */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {/* Search Box */}
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search ID, origin, dest..."
                    value={shipmentSearchQuery}
                    onChange={e => setShipmentSearchQuery(e.target.value)}
                    style={{
                      width: '100%', padding: '8px 10px 8px 32px', border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)', background: 'var(--bg-900)', color: 'var(--text-primary)',
                      fontSize: '12px', outline: 'none'
                    }}
                  />
                </div>

                {/* Filter Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {['all', 'in_transit', 'delayed', 'loading', 'scheduled', 'delivered'].map(f => (
                    <button
                      key={f}
                      onClick={() => setShipmentStatusFilter(f)}
                      style={{
                        padding: '4px 10px', fontSize: '9px', fontWeight: 700, border: 'none',
                        borderRadius: 20, cursor: 'pointer', transition: 'all 0.2s',
                        background: shipmentStatusFilter === f
                          ? (f === 'in_transit' ? 'rgba(56,206,60,0.15)' : f === 'delayed' ? 'rgba(239,68,68,0.15)' : f === 'delivered' ? 'rgba(56,206,60,0.15)' : 'rgba(99,102,241,0.15)')
                          : 'var(--bg-800)',
                        color: shipmentStatusFilter === f
                          ? (f === 'in_transit' ? '#38CE3C' : f === 'delayed' ? '#ef4444' : f === 'delivered' ? '#38CE3C' : 'var(--primary-400)')
                          : 'var(--text-muted)'
                      }}
                    >
                      {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1).replace('_', ' ')}
                    </button>
                  ))}
                </div>

                {/* Registry Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Shipments Registry</h4>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{filteredShipments.length} / {shipments.length} shown</span>
                </div>

                {/* Scrollable Shipment Cards List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxHeight: 'calc(100vh - 290px)', overflowY: 'auto', paddingRight: 4 }}>
                  {filteredShipments.map(s => {
                    const isSelected = selectedShipmentId === s.id;
                    const statusColor = s.status === 'delayed' ? 'var(--danger-500)' : s.status === 'scheduled' ? 'var(--primary-400)' : '#38CE3C';
                    const statusBg = s.status === 'delayed' ? 'var(--danger-bg)' : s.status === 'scheduled' ? 'rgba(99,102,241,0.1)' : 'var(--success-bg)';
                    
                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedShipmentId(s.id)}
                        style={{
                          background: isSelected ? 'rgba(99,102,241,0.05)' : 'var(--surface)',
                          border: isSelected ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-lg)', padding: 12, display: 'flex',
                          flexDirection: 'column', gap: 8, position: 'relative', overflow: 'hidden',
                          cursor: 'pointer', transition: 'all 0.2s',
                          boxShadow: isSelected ? '0 0 12px rgba(99,102,241,0.15)' : 'none'
                        }}
                      >
                        {/* Glow side border */}
                        <div style={{
                          position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
                          background: statusColor
                        }} />

                        {/* Card Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 4 }}>
                          <div>
                            <span style={{ fontWeight: 800, fontSize: '12px', color: 'var(--text-primary)' }}>{s.id}</span>
                            <span style={{ fontSize: '9px', color: 'var(--text-muted)', marginLeft: 6 }}>{s.ewayBill}</span>
                          </div>
                          <span style={{
                            fontSize: '8px', fontWeight: 800, padding: '2px 6px', borderRadius: 'var(--radius-full)',
                            background: statusBg, color: statusColor
                          }}>
                            {s.status.toUpperCase().replace('_', ' ')}
                          </span>
                        </div>

                        {/* Route Details */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', paddingLeft: 4 }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.origin.split(',')[0]}</span>
                          <ChevronRight size={10} color="var(--text-muted)" />
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.destination.split(',')[0]}</span>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ width: '100%', background: 'rgba(255,255,255,0.04)', height: 4, borderRadius: 2 }}>
                          <div style={{
                            width: `${s.progress}%`, height: '100%', borderRadius: 2,
                            background: s.status === 'delayed' ? 'var(--danger-500)' : 'var(--gradient-primary)'
                          }} />
                        </div>

                        {/* Quick Specs */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: 6, paddingLeft: 4 }}>
                          <span>ETA: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{s.eta}</span></span>
                          <span>CO2: <span style={{ color: '#38CE3C', fontWeight: 600 }}>{s.carbon.split(' ')[0]}</span></span>
                          <span>Cost: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{s.cost.toLocaleString()}</span></span>
                        </div>
                      </div>
                    );
                  })}
                  {filteredShipments.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: '11px' }}>
                      No shipments match the query.
                    </div>
                  )}
                </div>
              </div>

              {/* Center Column: Intelligence & Route Inspector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                {/* Top Banner Actions */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                  padding: '12px var(--space-4)', borderRadius: 'var(--radius-lg)'
                }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, margin: 0 }}>Consigner Command Center</h3>
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Track active shipments, predicted delay alerts, and carbon scores en-route.</p>
                  </div>
                  <button
                    onClick={() => setBookingOpen(true)}
                    style={{
                      background: 'var(--gradient-primary)', color: '#fff', border: 'none',
                      borderRadius: 'var(--radius-md)', padding: '6px 12px', fontSize: '11px',
                      fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                      boxShadow: 'var(--shadow-glow)'
                    }}
                  >
                    <UserPlus size={12} /> Book Shipment
                  </button>
                </div>

                {/* Bloomberg-Style Lane Rate Ticker */}
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)', padding: '6px 12px', display: 'flex',
                  alignItems: 'center', gap: 16, overflowX: 'auto', whiteSpace: 'nowrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '9px', fontWeight: 800, color: 'var(--primary-400)', borderRight: '1px solid var(--border-subtle)', paddingRight: 10 }}>
                    <Activity size={10} /> CORRIDOR SPOT RATES
                  </div>
                  <div style={{ display: 'flex', gap: 20, fontSize: '10px', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: 'var(--text-muted)' }}>DEL ➔ BOM:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>₹72,400</strong>
                      <span style={{ color: '#38CE3C', fontSize: '8px' }}>▲ +1.4%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: 'var(--text-muted)' }}>BOM ➔ BLR:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>₹95,800</strong>
                      <span style={{ color: '#ef4444', fontSize: '8px' }}>▼ -0.8%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: 'var(--text-muted)' }}>CCU ➔ GAU:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>₹58,100</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '8px' }}>— Stable</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: 'var(--text-muted)' }}>MAA ➔ HYD:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>₹34,200</strong>
                      <span style={{ color: '#38CE3C', fontSize: '8px' }}>▲ +0.6%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: 'var(--text-muted)' }}>DEL ➔ CCU:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>₹84,500</strong>
                      <span style={{ color: '#ef4444', fontSize: '8px' }}>▼ -1.2%</span>
                    </div>
                  </div>
                </div>

                {/* KPI registry + Health Score circular gauge */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                  <div style={kpiCardStyle}>
                    <div style={kpiLabelStyle}>Credit Utilization</div>
                    <div style={{ ...kpiValStyle, fontSize: '13px', margin: '2px 0' }}>
                      ₹{(activeSpend / 100000).toFixed(1)}L <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>/ ₹50L</span>
                    </div>
                    <div style={{ width: '100%', background: 'rgba(255,255,255,0.04)', height: 3, borderRadius: 2, marginTop: 4 }}>
                      <div style={{ width: `${Math.min(100, creditUtilizationPct)}%`, height: '100%', background: 'var(--primary-400)', borderRadius: 2 }} />
                    </div>
                  </div>
                  <div style={kpiCardStyle}>
                    <div style={kpiLabelStyle}>Quote Acceptance</div>
                    <div style={{ ...kpiValStyle, color: '#38CE3C', fontSize: '15px' }}>{quoteAcceptance}%</div>
                    <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>Above target (82%)</div>
                  </div>
                  <div style={kpiCardStyle}>
                    <div style={kpiLabelStyle}>Account Churn Risk</div>
                    <div style={{ ...kpiValStyle, color: churnRisk.color, fontSize: '14px' }}>{churnRisk.level} ({churnRisk.pct})</div>
                    <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>Sentiment: {churnRisk.sentiment}</div>
                  </div>
                  <div style={kpiCardStyle}>
                    <div style={kpiLabelStyle}>Invoice Disputes</div>
                    <div style={{ ...kpiValStyle, color: disputes > 0 ? 'var(--danger-500)' : 'var(--text-primary)', fontSize: '15px' }}>
                      {disputes} <span style={{ fontSize: '9px', color: disputes === 0 ? '#38CE3C' : 'var(--text-muted)' }}>{disputes === 0 ? 'Reconciled' : 'Active'}</span>
                    </div>
                    <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>Last audit: Today</div>
                  </div>
                  <div style={kpiCardStyle}>
                    <div style={kpiLabelStyle}>Carbon Offsets</div>
                    <div style={{ ...kpiValStyle, color: '#10b981', fontSize: '14px', margin: '2px 0' }}>
                      {carbonOffsetTotal} <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>t CO2</span>
                    </div>
                    <button
                      onClick={() => {
                        setCarbonOffsetTotal(prev => prev + 10);
                        showToast("Purchased 10 tonnes carbon offsets! Sustainability registry updated.", "success");
                        pushEvent("Carbon Offset Purchase", "Purchased 10 tonnes of offset credits. Credited to Sustainability Registry. Cost: ₹4,500.", "ERP/GREEN");
                      }}
                      style={{
                        width: '100%', marginTop: 2, padding: '2px 0', border: '1px solid #10b981',
                        background: 'rgba(16,185,129,0.08)', color: '#10b981', borderRadius: 4,
                        fontSize: '8px', fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      OFFSET +10 TONNES
                    </button>
                  </div>
                  <div style={{ ...kpiCardStyle, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 6px' }}>
                    <div style={{ position: 'relative', width: 32, height: 32 }}>
                      <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                        <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
                        <circle cx="18" cy="18" r="16" fill="none"
                          stroke={healthScore > 80 ? '#38CE3C' : healthScore > 60 ? '#f59e0b' : 'var(--danger-500)'}
                          strokeWidth="4"
                          strokeDasharray="100"
                          strokeDashoffset={100 - healthScore}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                        />
                      </svg>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800 }}>
                        {healthScore}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '7px', color: 'var(--text-muted)', textTransform: 'uppercase', lineHeight: 1 }}>Health</span>
                      <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                        {healthScore > 85 ? 'Premium' : healthScore > 70 ? 'Stable' : 'At Risk'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selected Shipment Detail View & SVG Route Tracker */}
                {selectedShipment ? (
                  <div style={{
                    background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
                    flexDirection: 'column', gap: 12
                  }}>
                    {/* Detail Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>INTELLIGENCE INSPECTOR: {selectedShipment.id}</span>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: 2 }}>
                          E-Way Bill: {selectedShipment.ewayBill} | Route: {selectedShipment.origin} ➔ {selectedShipment.destination}
                        </div>
                      </div>
                      <span style={{
                        fontSize: '9px', fontWeight: 800, padding: '2px 8px', borderRadius: 4,
                        background: selectedShipment.status === 'delayed' ? 'var(--danger-bg)' : selectedShipment.status === 'scheduled' ? 'rgba(99,102,241,0.1)' : 'var(--success-bg)',
                        color: selectedStatusColor
                      }}>
                        {selectedShipment.status.toUpperCase()}
                      </span>
                    </div>

                    {/* SVG Route visualization */}
                    <div style={{
                      background: 'var(--bg-900)', border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)', padding: 10, display: 'flex', flexDirection: 'column', gap: 6
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Activity size={10} color="var(--primary-400)" /> Live Corridor Telemetry
                        </span>
                        <span>Click waypoints for sensor logs</span>
                      </div>
                      <div style={{ position: 'relative', width: '100%', height: '105px' }}>
                        <svg viewBox="0 0 400 110" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                          <defs>
                            <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#38CE3C" />
                              <stop offset="50%" stopColor={selectedStatusColor} />
                              <stop offset="100%" stopColor="#6366f1" />
                            </linearGradient>
                          </defs>
                          
                          {/* Grid Background */}
                          <pattern id="gridPatternCust" width="20" height="20" patternUnits="userSpaceOnUse">
                            <rect width="20" height="20" fill="none" />
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
                          </pattern>
                          <rect width="400" height="110" fill="url(#gridPatternCust)" />

                          {/* Dotted path */}
                          <path d="M 50,70 Q 200,20 350,70" fill="none" stroke="url(#routeGrad)" strokeWidth="3" strokeDasharray="6, 6" />
                          
                          {/* Waypoints */}
                          <g style={{ cursor: 'pointer' }} onClick={() => showToast("Waypoint 1 (Jaipur Toll): Cleared at 11:42 AM. Sensor Audit: Ok.", "success")}>
                            <circle cx={wp1.x} cy={wp1.y} r="5" fill={progress >= 25 ? '#38CE3C' : 'var(--bg-800)'} stroke="var(--border-subtle)" strokeWidth="1" />
                            <text x={wp1.x} y={wp1.y - 10} textAnchor="middle" fontSize="7" fill="var(--text-muted)">Jaipur Toll</text>
                          </g>
                          <g style={{ cursor: 'pointer' }} onClick={() => showToast("Waypoint 2 (Kishangarh): Cleared at 02:15 PM. Sensor Audit: Ok.", "success")}>
                            <circle cx={wp2.x} cy={wp2.y} r="5" fill={progress >= 50 ? '#38CE3C' : 'var(--bg-800)'} stroke="var(--border-subtle)" strokeWidth="1" />
                            <text x={wp2.x} y={wp2.y - 10} textAnchor="middle" fontSize="7" fill="var(--text-muted)">Kishangarh</text>
                          </g>
                          <g style={{ cursor: 'pointer' }} onClick={() => showToast(selectedShipment.status === 'delayed' ? "Waypoint 3 (Nagpur Bypass): Delayed due to heavy monsoon logjam." : "Waypoint 3 (Ahmedabad): In Transit. GPS Lock Active.", selectedShipment.status === 'delayed' ? "warning" : "info")}>
                            <circle cx={wp3.x} cy={wp3.y} r="5" fill={progress >= 75 ? '#38CE3C' : 'var(--bg-800)'} stroke="var(--border-subtle)" strokeWidth="1" />
                            <text x={wp3.x} y={wp3.y - 10} textAnchor="middle" fontSize="7" fill="var(--text-muted)">Ahmedabad</text>
                          </g>

                          {/* Origin and Destination Hub Nodes */}
                          <circle cx="50" cy="70" r="8" fill="#38CE3C" style={{ filter: 'drop-shadow(0 0 4px rgba(56,206,60,0.5))' }} />
                          <text x="50" y="90" textAnchor="middle" fontSize="8" fontWeight="700" fill="var(--text-primary)">{selectedShipment.origin.split(',')[0]}</text>
                          
                          <circle cx="350" cy="70" r="8" fill="#6366f1" style={{ filter: 'drop-shadow(0 0 4px rgba(99,102,241,0.5))' }} />
                          <text x="350" y="90" textAnchor="middle" fontSize="8" fontWeight="700" fill="var(--text-primary)">{selectedShipment.destination.split(',')[0]}</text>

                          {/* Truck Marker */}
                          {selectedShipment.status !== 'delivered' && (
                            <circle cx={truckX} cy={truckY} r="7" fill={selectedStatusColor} style={{ filter: `drop-shadow(0 0 6px ${selectedStatusColor})`, animation: 'pulse 1.5s infinite' }} />
                          )}
                        </svg>
                      </div>
                    </div>

                    {/* Milestone Timeline Stepper */}
                    <div style={{ background: 'var(--bg-800)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 10 }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>Milestone Progress Timeline</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', padding: '0 8px' }}>
                        {/* Background Line */}
                        <div style={{ position: 'absolute', top: '13px', left: '16px', right: '16px', height: 2, background: 'rgba(255,255,255,0.06)', zIndex: 1 }} />
                        {/* Active Line */}
                        <div style={{
                          position: 'absolute', top: '13px', left: '16px',
                          width: `${Math.min(92, selectedShipment.progress * 0.92)}%`,
                          height: 2, background: selectedShipment.status === 'delayed' ? 'var(--danger-500)' : '#38CE3C', zIndex: 2
                        }} />

                        {milestones.map((m, idx) => {
                          const isComplete = selectedShipment.progress >= m.progressLimit;
                          const isActive = (selectedShipment.progress >= m.progressLimit) && (idx === milestones.length - 1 || selectedShipment.progress < milestones[idx + 1].progressLimit);
                          
                          let markerColor = 'rgba(255,255,255,0.1)';
                          let textColor = 'var(--text-muted)';
                          if (isComplete) {
                            markerColor = selectedShipment.status === 'delayed' ? 'var(--danger-500)' : '#38CE3C';
                            textColor = 'var(--text-primary)';
                          }
                          if (isActive) {
                            textColor = 'var(--primary-400)';
                          }

                          return (
                            <div key={m.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, position: 'relative' }}>
                              <div style={{
                                width: 26, height: 26, borderRadius: '50%', background: 'var(--surface-solid)',
                                border: `2px solid ${markerColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: isActive ? '0 0 8px rgba(99,102,241,0.4)' : 'none',
                                transition: 'all 0.3s'
                              }}>
                                {isComplete ? (
                                  <CheckCircle size={12} color={selectedShipment.status === 'delayed' ? 'var(--danger-500)' : '#38CE3C'} />
                                ) : (
                                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)' }} />
                                )}
                              </div>
                              <span style={{ fontSize: '8px', fontWeight: isActive ? 700 : 500, color: textColor, marginTop: 4 }}>{m.label}</span>
                              <span style={{ fontSize: '7px', color: 'var(--text-muted)' }}>{isComplete ? m.time : '--:--'}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Cargo Detail Tabs */}
                    <div>
                      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: 10 }}>
                        {[
                          { id: 'route', label: 'Route Detail', icon: MapPin },
                          { id: 'financials', label: 'Financials', icon: Coins },
                          { id: 'documents', label: 'Documents', icon: Box }
                        ].map(tab => {
                          const Icon = tab.icon;
                          const isTabActive = activeShipmentTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setActiveShipmentTab(tab.id)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                                border: 'none', background: isTabActive ? 'rgba(255,255,255,0.03)' : 'transparent',
                                color: isTabActive ? 'var(--primary-400)' : 'var(--text-muted)',
                                borderBottom: isTabActive ? '2px solid var(--primary-400)' : 'none',
                                borderTopLeftRadius: 4, borderTopRightRadius: 4,
                                fontSize: '10px', fontWeight: 700, cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              <Icon size={12} />
                              {tab.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Tab Content Panels */}
                      <div style={{ minHeight: '90px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {activeShipmentTab === 'route' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            <div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>DRIVER DETAILS</div>
                              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{selectedShipment.driver}</div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>VEHICLE ASSIGNED</div>
                              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>TRK-00012 (Volvo FM)</div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>CURRENT TELEMETRY GPS</div>
                              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
                                {selectedShipment.lat.toFixed(4)}° N, {selectedShipment.lng.toFixed(4)}° E
                              </div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>ETA COUNTDOWN</div>
                              <div style={{ fontWeight: 700, color: selectedStatusColor, marginTop: 2 }}>{selectedShipment.eta}</div>
                            </div>
                          </div>
                        )}

                        {activeShipmentTab === 'financials' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.04)', paddingBottom: 3 }}>
                              <span style={{ color: 'var(--text-muted)' }}>Base Freight:</span>
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₹{Math.floor(selectedShipment.cost * 0.73).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.04)', paddingBottom: 3 }}>
                              <span style={{ color: 'var(--text-muted)' }}>FASTag Tolls:</span>
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₹2,450</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.04)', paddingBottom: 3 }}>
                              <span style={{ color: 'var(--text-muted)' }}>Fuel Surcharge:</span>
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₹{Math.floor(selectedShipment.cost * 0.12).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed rgba(255,255,255,0.04)', paddingBottom: 3 }}>
                              <span style={{ color: 'var(--text-muted)' }}>GST (12%):</span>
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₹{Math.floor(selectedShipment.cost * 0.12).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gridColumn: 'span 2', borderTop: '1px solid var(--border-subtle)', paddingTop: 6, fontWeight: 700 }}>
                              <span style={{ color: 'var(--text-primary)' }}>Net Invoiced Cost:</span>
                              <span style={{ color: 'var(--primary-400)', fontSize: '12px' }}>₹{selectedShipment.cost.toLocaleString()}</span>
                            </div>
                          </div>
                        )}

                        {activeShipmentTab === 'documents' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: 4 }}>
                              <span style={{ fontWeight: 600 }}>E-Way Bill Ledger</span>
                              <span style={{ color: '#38CE3C', fontWeight: 800, fontSize: '9px' }}>VERIFIED & LIVE</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: 4 }}>
                              <span style={{ fontWeight: 600 }}>Proof of Delivery (POD)</span>
                              <span style={{ color: selectedShipment.status === 'delivered' ? '#38CE3C' : 'var(--text-muted)', fontWeight: 800, fontSize: '9px' }}>
                                {selectedShipment.status === 'delivered' ? 'SIGNED_POD.PDF' : 'PENDING'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Risk & Carbon scoring */}
                    <div style={{
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
                      borderTop: '1px solid var(--border-subtle)', paddingTop: 10, fontSize: '10px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Zap size={12} color="#38CE3C" />
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Corridor Carbon footprint:</span>
                          <div style={{ color: '#38CE3C', fontWeight: 700, marginTop: 1 }}>{selectedShipment.carbon}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <AlertTriangle size={12} color={selectedShipment.risk === 'High' ? 'var(--danger-500)' : selectedShipment.risk === 'Medium' ? '#f59e0b' : '#38CE3C'} />
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Calculated SLA Risk:</span>
                          <div style={{
                            color: selectedShipment.risk === 'High' ? 'var(--danger-500)' : selectedShipment.risk === 'Medium' ? '#f59e0b' : '#38CE3C',
                            fontWeight: 700, marginTop: 1
                          }}>{selectedShipment.risk.toUpperCase()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                    Select a shipment from the registry to run telemetry audits.
                  </div>
                )}

                {/* Event Simulator Console */}
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
                  flexDirection: 'column', gap: 10
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Settings size={14} color="var(--primary-400)" />
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>Network Event Simulator</span>
                  </div>
                  <p style={{ fontSize: '9px', color: 'var(--text-muted)', margin: 0 }}>
                    Inject real-time exceptions, complete delivery sequences, or reset ledger state.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 4 }}>
                    <button
                      onClick={handleSimulateDelay}
                      style={{
                        padding: '6px 4px', fontSize: '9px', fontWeight: 700, border: 'none',
                        borderRadius: 4, cursor: 'pointer', background: 'rgba(239,68,68,0.12)', color: '#ef4444',
                        transition: 'all 0.2s', border: '1px solid rgba(239,68,68,0.2)'
                      }}
                    >
                      ⚠️ Inject Delay
                    </button>
                    <button
                      onClick={handleSimulateDelivery}
                      style={{
                        padding: '6px 4px', fontSize: '9px', fontWeight: 700, border: 'none',
                        borderRadius: 4, cursor: 'pointer', background: 'rgba(56,206,60,0.12)', color: '#38CE3C',
                        transition: 'all 0.2s', border: '1px solid rgba(56,206,60,0.2)'
                      }}
                    >
                      ✅ Force Deliver
                    </button>
                    <button
                      onClick={handleResetShipments}
                      style={{
                        padding: '6px 4px', fontSize: '9px', fontWeight: 700, border: 'none',
                        borderRadius: 4, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', color: 'var(--text-primary)',
                        transition: 'all 0.2s', border: '1px solid var(--border-subtle)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                      }}
                    >
                      <RotateCcw size={10} /> Reset Ledger
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: AI Logistics Copilot */}
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', height: '100%'
              }}>
                <div style={{
                  padding: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <span style={{ fontWeight: 800, fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Sparkles size={14} color="var(--primary-400)" /> AI LOGISTICS COPILOT
                  </span>
                  <span style={{ fontSize: '9px', background: 'var(--success-bg)', color: 'var(--success-500)', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>ONLINE</span>
                </div>

                {/* Msg logs */}
                <div style={{
                  flex: 1, overflowY: 'auto', padding: 'var(--space-4)',
                  display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxHeight: '380px'
                }}>
                  {copilotMsgs.map((m, idx) => (
                    <div key={idx} style={{
                      alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%', padding: '10px 12px', borderRadius: 'var(--radius-md)',
                      background: m.sender === 'user' ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${m.sender === 'user' ? 'rgba(99,102,241,0.2)' : 'var(--border-subtle)'}`,
                      fontSize: '11px', color: m.sender === 'user' ? '#fff' : 'var(--text-secondary)',
                      lineHeight: 1.4, whiteSpace: 'pre-line'
                    }}>
                      {m.text}
                    </div>
                  ))}
                  {isTyping && (
                    <div style={{ color: 'var(--text-muted)', fontSize: '10px', fontStyle: 'italic' }}>AI is checking graph nodes...</div>
                  )}
                </div>

                {/* Suggestions */}
                <div style={{
                  padding: '0 var(--space-4)', display: 'flex', flexDirection: 'column', gap: 6,
                  borderTop: '1px solid var(--border-subtle)', paddingTop: 10
                }}>
                  <button onClick={() => handleCopilotAsk("Why is my shipment delayed?")} style={suggestionChipStyle}>Why is my shipment delayed?</button>
                  <button onClick={() => handleCopilotAsk("Can I move 50 tons tomorrow?")} style={suggestionChipStyle}>Can I move 50 tons tomorrow?</button>
                  <button onClick={() => handleCopilotAsk("Compare road vs rail costs")} style={suggestionChipStyle}>Compare road vs rail costs</button>
                </div>

                {/* Input box */}
                <div style={{ padding: 'var(--space-4)', display: 'flex', gap: 6 }}>
                  <input
                    type="text"
                    placeholder="Ask logistics copilot..."
                    value={copilotInput}
                    onChange={e => setCopilotInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleCopilotAsk(copilotInput); }}
                    style={{
                      flex: 1, background: 'var(--bg-900)', border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)', padding: '8px 12px', fontSize: 'var(--text-xs)', borderRadius: 'var(--radius-sm)',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={() => handleCopilotAsk(copilotInput)}
                    style={{
                      background: 'var(--primary-500)', border: 'none', color: '#fff',
                      borderRadius: 'var(--radius-sm)', padding: '0 12px', cursor: 'pointer'
                    }}
                  >
                    <Send size={12} />
                  </button>
                </div>
              </div>

            </div>
          );
        })()}

        {/* ==================== LAYER 2: DRIVER COMPANION ==================== */}
        {activePortal === 'driver' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-6)' }}>
            
            {/* Left Column: Safety & Navigation Assist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              
              {/* Trip Assistant Detail Map */}
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)' }}>Driver Navigation & Safety Assistant</h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Real-time telemetry companion monitoring overspeeding, rest periods, and weather alerts.</p>
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--primary-400)', fontWeight: 600 }}>Active Route: Delhi ➔ Mumbai</span>
                </div>

                {/* Stylized Route Trace Map with interactive waypoint markers */}
                <div style={{
                  background: 'var(--bg-900)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)', height: '180px', display: 'flex',
                  alignItems: 'center', justify: 'center', position: 'relative', overflow: 'hidden'
                }}>
                  {/* Grid Lines background */}
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, opacity: 0.03, background: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px) 0 0/20px 20px, linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px) 0 0/20px 20px' }} />
                  
                  {/* Neon curved line */}
                  <svg width="340" height="120" style={{ overflow: 'visible' }}>
                    <path d="M 20,100 Q 170,20 320,100" fill="none" stroke="#6366f1" strokeWidth="3" strokeDasharray="5, 10" />
                    
                    {/* Flowing particle along path */}
                    <circle cx="170" cy="60" r="8" fill="#38CE3C" style={{ filter: 'drop-shadow(0 0 6px #38CE3C)', animation: 'driverPulse 2s infinite' }} />
                    
                    {/* Waypoint Clickable Nodes */}
                    {[
                      { name: "Delhi Depot", x: 20, y: 100 },
                      { name: "Jaipur Plaza", x: 90, y: 55 },
                      { name: "Ahmedabad Depot", x: 190, y: 50 },
                      { name: "Mumbai Hub", x: 320, y: 100 }
                    ].map((wp, idx) => {
                      const isCurrent = driverTelemetry.activeWaypoint === wp.name;
                      const markerColor = isCurrent ? '#6366f1' : 'rgba(255,255,255,0.4)';
                      return (
                        <g key={wp.name} style={{ cursor: 'pointer' }} onClick={() => handleArriveAtWaypoint(wp.name)}>
                          <circle cx={wp.x} cy={wp.y} r={isCurrent ? 7 : 4} fill={markerColor} stroke="#fff" strokeWidth="1" />
                          <text x={wp.x} y={wp.y + 16} fill={isCurrent ? 'var(--primary-400)' : 'var(--text-muted)'} fontSize="8" textAnchor="middle" fontWeight={isCurrent ? 'bold' : 'normal'}>
                            {wp.name}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Upcoming Waypoints details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 12 }}>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', padding: 10, borderRadius: 'var(--radius-sm)', fontSize: '10px' }}>
                    <div style={{ color: 'var(--text-muted)' }}>CURRENT WAYPOINT</div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{driverTelemetry.activeWaypoint}</div>
                    <span style={{ color: '#38CE3C' }}>SLA logs online</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', padding: 10, borderRadius: 'var(--radius-sm)', fontSize: '10px' }}>
                    <div style={{ color: 'var(--text-muted)' }}>GPS TRACKING</div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>{driverTelemetry.satellites} Satellites locked</div>
                    <span style={{ color: 'var(--text-muted)' }}>Accuracy: &lt; 2.5m</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', padding: 10, borderRadius: 'var(--radius-sm)', fontSize: '10px' }}>
                    <div style={{ color: 'var(--text-muted)' }}>ACTIVE VEHICLE SPEED</div>
                    <div style={{ fontWeight: 700, color: parseInt(driverTelemetry.speed) > 80 ? 'var(--danger-500)' : 'var(--text-primary)', marginTop: 2 }}>{driverTelemetry.speed}</div>
                    <span style={{ color: parseInt(driverTelemetry.speed) > 80 ? 'var(--danger-400)' : 'var(--text-muted)' }}>
                      {parseInt(driverTelemetry.speed) > 80 ? 'OVERSPEED WARNING' : 'Speed Limit: 80 km/h'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Safety Controls & Speed Actuators */}
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)'
              }}>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>Driver Safety & Speed Actuators</h3>
                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                  <button
                    onClick={triggerHarshBraking}
                    style={{
                      flex: 1, minWidth: '150px', background: 'var(--danger-bg)', color: 'var(--danger-500)',
                      border: '1px solid var(--danger-500)', borderRadius: 'var(--radius-md)',
                      padding: '10px 0', fontSize: 'var(--text-xs)', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}
                  >
                    <AlertTriangle size={14} /> Report Harsh Braking
                  </button>
                  <button
                    onClick={handleAccelerateSpeed}
                    style={{
                      flex: 1, minWidth: '150px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b',
                      border: '1px solid #f59e0b', borderRadius: 'var(--radius-md)',
                      padding: '10px 0', fontSize: 'var(--text-xs)', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}
                  >
                    <Zap size={14} /> Exceed Speed Limit
                  </button>
                  <button
                    onClick={handleSlowDownSpeed}
                    style={{
                      flex: 1, minWidth: '150px', background: 'rgba(56,206,60,0.1)', color: '#38CE3C',
                      border: '1px solid #38CE3C', borderRadius: 'var(--radius-md)',
                      padding: '10px 0', fontSize: 'var(--text-xs)', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                    }}
                  >
                    <CheckCircle size={14} /> Stabilize Speed
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Earnings, safety twin and coach */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              
              {/* Earnings & HOS Duty Status */}
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
                flexDirection: 'column', gap: 12
              }}>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-primary)' }}>
                  <Award size={14} color="#f59e0b" /> COMPLIANCE & ELD DUTY
                </h3>

                {/* HOS Duty Status Selector */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                  {[
                    { id: 'driving', label: 'Driving Mode' },
                    { id: 'on_duty', label: 'On-Duty' },
                    { id: 'off_duty', label: 'Off-Duty' },
                    { id: 'sleeper', label: 'Sleeper Berth' }
                  ].map(st => {
                    const isSelected = driverDutyStatus === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={() => handleChangeDutyStatus(st.id)}
                        style={{
                          background: isSelected ? 'var(--primary-500)' : 'var(--bg-800)',
                          border: isSelected ? '1px solid var(--primary-500)' : '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)', padding: '6px 8px', fontSize: '10px', fontWeight: 700,
                          color: isSelected ? '#fff' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        {st.label}
                      </button>
                    );
                  })}
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10, fontSize: '11px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Safety Bonus Pool:</span>
                    <span style={{ color: '#38CE3C', fontWeight: 600 }}>+₹{driverState.bonuses.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Current Driving Score:</span>
                    <span style={{ color: driverState.safetyScore > 80 ? '#38CE3C' : 'var(--danger-500)', fontWeight: 600 }}>{driverState.safetyScore}/100</span>
                  </div>
                  <div style={{ display: 'flex', justify: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Fatigue Index:</span>
                    <span style={{ color: driverState.fatigue > 30 ? 'var(--danger-500)' : '#38CE3C', fontWeight: 600 }}>{driverState.fatigue}%</span>
                  </div>
                  <div style={{ display: 'flex', justify: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Active HOS Violations:</span>
                    <span style={{ color: driverState.violations > 0 ? 'var(--danger-500)' : 'var(--text-muted)', fontWeight: 600 }}>{driverState.violations} logged</span>
                  </div>
                </div>
              </div>

              {/* Biometrics Monitor */}
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
                flexDirection: 'column', gap: 10
              }}>
                <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Activity size={14} color={driverStressMode ? 'var(--danger-500)' : '#38CE3C'} /> BIOMETRIC TELEMETRY
                  </h3>
                  <button
                    onClick={handleToggleStressMode}
                    style={{
                      background: driverStressMode ? 'var(--danger-bg)' : 'rgba(56,206,60,0.1)',
                      color: driverStressMode ? 'var(--danger-500)' : '#38CE3C',
                      border: `1px solid ${driverStressMode ? 'var(--danger-500)' : '#38CE3C'}`,
                      borderRadius: 4, padding: '2px 8px', fontSize: '9px', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    {driverStressMode ? "SIMULATING STRESS" : "SIMULATE STRESS"}
                  </button>
                </div>

                 {/* Animated ECG Waveform */}
                <div style={{ margin: '6px 0' }}>
                  <svg width="100%" height="45" viewBox="0 0 300 45" style={{ background: '#040711', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
                    <path
                      d="M 0 22 L 50 22 L 55 10 L 60 35 L 65 22 L 120 22 L 125 10 L 130 35 L 135 22 L 190 22 L 195 10 L 200 35 L 205 22 L 260 22 L 265 10 L 270 35 L 275 22 L 300 22"
                      fill="none"
                      stroke={driverStressMode ? 'var(--danger-500)' : '#38CE3C'}
                      strokeWidth="2"
                      strokeDasharray="600"
                      strokeDashoffset="600"
                      style={{
                        animation: `ecgLine ${driverStressMode ? '0.8s' : '1.8s'} linear infinite`
                      }}
                    />
                  </svg>
                </div>

                {/* EEG Brainwave Monitor (Alpha, Beta, Theta waves) */}
                <div style={{ marginTop: 4, marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginBottom: 4 }}>
                    <span>EEG NEURAL WAVE DIAGNOSTIC</span>
                    <span style={{ color: driverStressMode ? 'var(--danger-400)' : 'var(--primary-400)', fontWeight: 700 }}>
                      {driverStressMode ? "STRESS SPIKE (BETA ACTIVE)" : "OPTIMAL FOCUS (ALPHA)"}
                    </span>
                  </div>
                  <div style={{ background: '#040711', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', padding: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {/* Alpha Wave */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 12 }}>
                      <span style={{ fontSize: '7px', width: 28, color: '#38CE3C', fontWeight: 'bold' }}>ALPHA</span>
                      <svg width="100%" height="8" viewBox="0 0 200 8" style={{ overflow: 'hidden', flex: 1 }}>
                        <path
                          d={driverStressMode 
                            ? "M 0 4 L 20 4 L 25 2 L 30 6 L 35 4 L 55 4 L 60 2 L 65 6 L 70 4 L 90 4 L 95 2 L 100 6 L 105 4 L 125 4 L 130 2 L 135 6 L 140 4 L 160 4 L 165 2 L 170 6 L 175 4 L 200 4"
                            : "M 0 4 Q 5 1, 10 4 T 20 4 T 30 4 T 40 4 T 50 4 T 60 4 T 70 4 T 80 4 T 90 4 T 100 4 T 110 4 T 120 4 T 130 4 T 140 4 T 150 4 T 160 4 T 170 4 T 180 4 T 190 4 T 200 4"
                          }
                          fill="none"
                          stroke="#38CE3C"
                          strokeWidth="1.2"
                          strokeDasharray="400"
                          strokeDashoffset="400"
                          style={{
                            animation: `ecgLine ${driverStressMode ? '3s' : '1.2s'} linear infinite`
                          }}
                        />
                      </svg>
                    </div>
                    {/* Beta Wave */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 12 }}>
                      <span style={{ fontSize: '7px', width: 28, color: 'var(--danger-500)', fontWeight: 'bold' }}>BETA</span>
                      <svg width="100%" height="8" viewBox="0 0 200 8" style={{ overflow: 'hidden', flex: 1 }}>
                        <path
                          d={driverStressMode 
                            ? "M 0 4 L 3 1 L 6 7 L 9 2 L 12 6 L 15 2 L 18 6 L 21 1 L 24 7 L 27 2 L 30 6 L 33 2 L 36 6 L 39 1 L 42 7 L 45 2 L 48 6 L 51 2 L 54 6 L 57 1 L 60 7 L 63 2 L 66 6 L 69 2 L 72 6 L 75 1 L 78 7 L 81 2 L 84 6 L 87 2 L 90 6 L 93 1 L 96 7 L 99 2 L 102 6 L 105 2 L 108 6 L 111 1 L 114 7 L 117 2 L 120 6 L 123 2 L 126 6 L 129 1 L 132 7 L 135 2 L 138 6 L 141 2 L 144 6 L 147 1 L 150 7 L 153 2 L 156 6 L 159 2 L 162 6 L 165 1 L 168 7 L 171 2 L 174 6 L 177 2 L 180 6 L 183 1 L 186 7 L 189 2 L 192 6 L 195 2 L 198 6 L 200 4"
                            : "M 0 4 L 10 4 L 12 3 L 14 5 L 16 4 L 26 4 L 28 3 L 30 5 L 32 4 L 42 4 L 44 3 L 46 5 L 48 4 L 58 4 L 60 3 L 62 5 L 64 4 L 74 4 L 76 3 L 78 5 L 80 4 L 90 4 L 92 3 L 94 5 L 96 4 L 106 4 L 108 3 L 110 5 L 112 4 L 122 4 L 124 3 L 126 5 L 128 4 L 138 4 L 140 3 L 142 5 L 144 4 L 154 4 L 156 3 L 158 5 L 160 4 L 170 4 L 172 3 L 174 5 T 186 4 L 188 3 L 190 5 L 192 4 L 200 4"
                          }
                          fill="none"
                          stroke="var(--danger-500)"
                          strokeWidth="1.2"
                          strokeDasharray="400"
                          strokeDashoffset="400"
                          style={{
                            animation: `ecgLine ${driverStressMode ? '0.4s' : '4s'} linear infinite`
                          }}
                        />
                      </svg>
                    </div>
                    {/* Theta Wave */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 12 }}>
                      <span style={{ fontSize: '7px', width: 28, color: '#f59e0b', fontWeight: 'bold' }}>THETA</span>
                      <svg width="100%" height="8" viewBox="0 0 200 8" style={{ overflow: 'hidden', flex: 1 }}>
                        <path
                          d="M 0 4 Q 15 -1, 30 4 T 60 4 T 90 4 T 120 4 T 150 4 T 180 4 T 200 4"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="1.2"
                          strokeDasharray="400"
                          strokeDashoffset="400"
                          style={{
                            animation: `ecgLine ${driverStressMode ? '0.6s' : '2.5s'} linear infinite`
                          }}
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Heart Rate:</span>
                    <strong style={{ display: 'block', fontSize: 'var(--text-base)', color: driverStressMode ? 'var(--danger-500)' : 'var(--text-primary)' }}>
                      {driverTelemetry.heartRate}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Oxygen Levels:</span>
                    <strong style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>
                      {driverTelemetry.spo2}
                    </strong>
                  </div>
                </div>
              </div>

              {/* AI Driver Coach */}
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)',
                borderLeft: `4px solid ${driverStressMode ? 'var(--danger-500)' : '#f59e0b'}`, display: 'flex', flexDirection: 'column', gap: 8
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 'var(--text-xs)', color: driverStressMode ? 'var(--danger-500)' : '#f59e0b' }}>
                  <Bot size={13} /> AI DRIVER COACH ADVISORY
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {driverStressMode
                    ? "ECG monitoring detects an elevated stress rate. Take deep breaths. BPCL Rest Plaza is located in 12km; we recommend parking and sleeping for 30 minutes to bypass safety penalties."
                    : "Your safety score is currently optimal. Maintain consistent acceleration trends near city approaches to maximize your safety bonus payout."
                  }
                </p>
                <div style={{ display: 'flex', justify: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: 4 }}>
                  <span>Est. Annual Savings: ₹27,600</span>
                  <span style={{ color: '#38CE3C' }}>Safety Grade: A-</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================== LAYER 3: FLEET OWNER PORTAL ==================== */}
        {activePortal === 'fleet' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 'var(--space-6)' }}>
            
            {/* Left: Fleet OS Overview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              
              {/* Fleet statistics cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
                <div style={kpiCardStyle}>
                  <div style={kpiLabelStyle}>Active Truck Utilization</div>
                  <div style={kpiValStyle}>87.4% <span style={{ fontSize: '10px', color: '#38CE3C' }}>+1.8%</span></div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: 2 }}>Target utility: 85.0%</div>
                </div>
                <div style={kpiCardStyle}>
                  <div style={kpiLabelStyle}>Revenue Generated Today</div>
                  <div style={kpiValStyle}>₹4,28,500</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: 2 }}>Transporter margins: 22.4%</div>
                </div>
                <div style={kpiCardStyle}>
                  <div style={kpiLabelStyle}>Fleet Fuel Cost Index</div>
                  <div style={kpiValStyle}>₹3,12,000</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: 2 }}>Avg mileage: {fleetState.fuelEfficiency} km/L</div>
                </div>
                <div style={kpiCardStyle}>
                  <div style={kpiLabelStyle}>Maintenance Queue</div>
                  <div style={{ ...kpiValStyle, color: 'var(--primary-400)' }}>
                    {fleetTrucks.filter(t => t.status === 'maintenance').length} Trucks
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: 2 }}>Next service due: 3d</div>
                </div>
              </div>

              {/* Search & Filter Controls */}
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)'
              }}>
                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      placeholder="Search by truck ID or model..."
                      value={fleetSearchQuery}
                      onChange={e => setFleetSearchQuery(e.target.value)}
                      style={{
                        width: '100%', padding: '8px 10px 8px 32px', border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)', background: 'var(--bg-900)', color: 'var(--text-primary)',
                        fontSize: '12px', outline: 'none'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {['all', 'active', 'idle', 'maintenance'].map(f => (
                      <button
                        key={f}
                        onClick={() => setFleetStatusFilter(f)}
                        style={{
                          padding: '6px 12px', fontSize: '10px', fontWeight: 700, border: 'none',
                          borderRadius: 20, cursor: 'pointer', transition: 'all 0.2s',
                          background: fleetStatusFilter === f
                            ? (f === 'active' ? 'rgba(56,206,60,0.15)' : f === 'idle' ? 'rgba(245,158,11,0.15)' : f === 'maintenance' ? 'rgba(239,68,68,0.15)' : 'rgba(99,102,241,0.15)')
                            : 'var(--bg-800)',
                          color: fleetStatusFilter === f
                            ? (f === 'active' ? '#38CE3C' : f === 'idle' ? '#f59e0b' : f === 'maintenance' ? '#ef4444' : 'var(--primary-400)')
                            : 'var(--text-muted)'
                        }}
                      >
                        {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)' }}>Fleet Assets Registry (OBD Diagnostics)</h3>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{filteredFleetTrucks.length} / {fleetTrucks.length} assets shown</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  {filteredFleetTrucks.map(t => {
                    const isSelected = selectedFleetTruckId === t.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedFleetTruckId(t.id)}
                        style={{
                          background: isSelected ? 'rgba(99,102,241,0.05)' : 'rgba(255,255,255,0.01)',
                          border: isSelected ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-md)', padding: 12, position: 'relative', cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: 'var(--text-base)' }}>{t.id} <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500 }}>({t.model})</span></span>
                          <span style={{
                            fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: 4,
                            background: t.status === 'idle' ? 'rgba(245,158,11,0.1)' : t.status === 'maintenance' ? 'var(--danger-bg)' : 'rgba(56,206,60,0.1)',
                            color: t.status === 'idle' ? '#f59e0b' : t.status === 'maintenance' ? 'var(--danger-500)' : '#38CE3C'
                          }}>{t.status.toUpperCase()}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                          <span>Route: {t.route}</span>
                          <span>Speed: {t.speed}</span>
                          <span>Fuel Level: {t.fuel}</span>
                          <span>Health: <span style={{ color: t.health > 80 ? '#38CE3C' : 'var(--danger-500)' }}>{t.health}%</span></span>
                        </div>
                        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                          {t.status !== 'maintenance' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerFleetService(t.id);
                              }}
                              style={{
                                flex: 1, padding: '4px 0', fontSize: '9px', border: 'none',
                                borderRadius: 4, background: 'var(--bg-600)', color: '#fff', cursor: 'pointer'
                              }}
                            >
                              Schedule Service
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {filteredFleetTrucks.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: '12px' }}>
                      No trucks match the current search or filter criteria.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right: SVG Digital Twin, Subsystem Inspector & Fault Simulator */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              
              {/* SVG Digital Twin Truck Wireframe */}
              {(() => {
                const t = fleetTrucks.find(truck => truck.id === selectedFleetTruckId);
                if (!t) return <div style={{ fontSize: '11px', color: 'var(--text-muted)', padding: 24, textAlign: 'center' }}>Select a truck to view its Digital Twin.</div>;
                
                const tyres = fleetTyrePressures[t.id] || { fl: 110, fr: 110, rl: 112, rr: 110 };
                const reeferTemp = fleetReeferTemps[t.id] ?? 2.0;
                const hasTyreFault = tyres.fr < 90 || tyres.rr < 90;
                const hasReeferFault = reeferTemp > 5;
                const hasEngineFault = (t.obd?.faultCodes || []).some(c => !c.includes('Tyre') && !c.includes('Reefer'));
                
                return (
                  <>
                    {/* Truck Header */}
                    <div style={{
                      background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Activity size={14} color="var(--primary-400)" /> DIGITAL TWIN: {t.id}
                        </h3>
                        <span style={{
                          fontSize: '9px', fontWeight: 800, padding: '2px 8px', borderRadius: 4,
                          background: t.health > 90 ? 'rgba(56,206,60,0.1)' : t.health > 75 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                          color: t.health > 90 ? '#38CE3C' : t.health > 75 ? '#f59e0b' : '#ef4444'
                        }}>
                          HEALTH: {t.health}%
                        </span>
                      </div>

                      {/* SVG Truck Wireframe */}
                      <svg viewBox="0 0 400 140" style={{ width: '100%', height: 'auto' }}>
                        <defs>
                          <linearGradient id="fleetChassisGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="rgba(99,102,241,0.15)" />
                            <stop offset="100%" stopColor="rgba(139,92,246,0.10)" />
                          </linearGradient>
                        </defs>

                        {/* Chassis frame */}
                        <rect x="20" y="45" width="360" height="50" rx="6" fill="url(#fleetChassisGrad)" stroke="var(--border-subtle)" strokeWidth="1" />

                        {/* Cab (Engine) — clickable hotspot */}
                        <g
                          onClick={() => setActiveSubsystemTab('engine')}
                          style={{ cursor: 'pointer' }}
                        >
                          <rect x="20" y="30" width="90" height="75" rx="8"
                            fill={hasEngineFault ? 'rgba(239,68,68,0.12)' : activeSubsystemTab === 'engine' ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)'}
                            stroke={hasEngineFault ? '#ef4444' : activeSubsystemTab === 'engine' ? '#6366f1' : 'var(--border-subtle)'}
                            strokeWidth={activeSubsystemTab === 'engine' ? 2 : 1}
                          />
                          <text x="65" y="62" textAnchor="middle" fontSize="9" fontWeight="700" fill={hasEngineFault ? '#ef4444' : 'var(--text-primary)'}>ENGINE</text>
                          <text x="65" y="75" textAnchor="middle" fontSize="7" fill="var(--text-muted)">OBD-II</text>
                          {/* Windshield */}
                          <line x1="30" y1="35" x2="100" y2="35" stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray="3,2" />
                        </g>

                        {/* Fuel Tanks — clickable hotspot */}
                        <g
                          onClick={() => setActiveSubsystemTab('fuel')}
                          style={{ cursor: 'pointer' }}
                        >
                          <rect x="120" y="70" width="60" height="28" rx="4"
                            fill={activeSubsystemTab === 'fuel' ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.03)'}
                            stroke={activeSubsystemTab === 'fuel' ? '#f59e0b' : 'var(--border-subtle)'}
                            strokeWidth={activeSubsystemTab === 'fuel' ? 2 : 1}
                          />
                          <text x="150" y="88" textAnchor="middle" fontSize="8" fontWeight="700" fill={activeSubsystemTab === 'fuel' ? '#f59e0b' : 'var(--text-primary)'}>FUEL</text>
                        </g>

                        {/* Cargo / Trailer container — clickable hotspot */}
                        <g
                          onClick={() => setActiveSubsystemTab('cargo')}
                          style={{ cursor: 'pointer' }}
                        >
                          <rect x="195" y="28" width="175" height="62" rx="4"
                            fill={hasReeferFault ? 'rgba(245,158,11,0.12)' : activeSubsystemTab === 'cargo' ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.03)'}
                            stroke={hasReeferFault ? '#f59e0b' : activeSubsystemTab === 'cargo' ? '#8b5cf6' : 'var(--border-subtle)'}
                            strokeWidth={activeSubsystemTab === 'cargo' ? 2 : 1}
                          />
                          <text x="282" y="55" textAnchor="middle" fontSize="9" fontWeight="700" fill={hasReeferFault ? '#f59e0b' : 'var(--text-primary)'}>CARGO / REEFER</text>
                          <text x="282" y="68" textAnchor="middle" fontSize="7" fill="var(--text-muted)">{reeferTemp} °C</text>
                          {hasReeferFault && (
                            <text x="282" y="80" textAnchor="middle" fontSize="7" fontWeight="800" fill="#ef4444">⚠ TEMP BREACH</text>
                          )}
                        </g>

                        {/* Brake Calipers — clickable hotspot */}
                        <g
                          onClick={() => setActiveSubsystemTab('brakes')}
                          style={{ cursor: 'pointer' }}
                        >
                          <circle cx="55" cy="115" r="15" fill="none" stroke={activeSubsystemTab === 'brakes' ? '#ec4899' : 'rgba(236,72,153,0.3)'} strokeWidth="1.5" strokeDasharray="4,2" />
                          <circle cx="95" cy="115" r="15" fill="none" stroke={activeSubsystemTab === 'brakes' ? '#ec4899' : 'rgba(236,72,153,0.3)'} strokeWidth="1.5" strokeDasharray="4,2" />
                          <circle cx="290" cy="115" r="15" fill="none" stroke={activeSubsystemTab === 'brakes' ? '#ec4899' : 'rgba(236,72,153,0.3)'} strokeWidth="1.5" strokeDasharray="4,2" />
                          <circle cx="340" cy="115" r="15" fill="none" stroke={activeSubsystemTab === 'brakes' ? '#ec4899' : 'rgba(236,72,153,0.3)'} strokeWidth="1.5" strokeDasharray="4,2" />
                        </g>

                        {/* Wheels / Tyres — clickable hotspot */}
                        <g
                          onClick={() => setActiveSubsystemTab('tyres')}
                          style={{ cursor: 'pointer' }}
                        >
                          {/* Front-Left */}
                          <circle cx="55" cy="115" r="12"
                            fill={tyres.fl < 90 ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)'}
                            stroke={tyres.fl < 90 ? '#ef4444' : hasTyreFault && activeSubsystemTab === 'tyres' ? '#6366f1' : 'var(--border-subtle)'}
                            strokeWidth={activeSubsystemTab === 'tyres' ? 2 : 1}
                          />
                          <text x="55" y="118" textAnchor="middle" fontSize="6" fontWeight="700" fill="var(--text-primary)">{tyres.fl}</text>
                          
                          {/* Front-Right */}
                          <circle cx="95" cy="115" r="12"
                            fill={tyres.fr < 90 ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)'}
                            stroke={tyres.fr < 90 ? '#ef4444' : activeSubsystemTab === 'tyres' ? '#6366f1' : 'var(--border-subtle)'}
                            strokeWidth={activeSubsystemTab === 'tyres' ? 2 : 1}
                          />
                          <text x="95" y="118" textAnchor="middle" fontSize="6" fontWeight="700" fill={tyres.fr < 90 ? '#ef4444' : 'var(--text-primary)'}>{tyres.fr}</text>

                          {/* Rear-Left */}
                          <circle cx="290" cy="115" r="12"
                            fill={tyres.rl < 90 ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)'}
                            stroke={tyres.rl < 90 ? '#ef4444' : activeSubsystemTab === 'tyres' ? '#6366f1' : 'var(--border-subtle)'}
                            strokeWidth={activeSubsystemTab === 'tyres' ? 2 : 1}
                          />
                          <text x="290" y="118" textAnchor="middle" fontSize="6" fontWeight="700" fill="var(--text-primary)">{tyres.rl}</text>

                          {/* Rear-Right */}
                          <circle cx="340" cy="115" r="12"
                            fill={tyres.rr < 90 ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)'}
                            stroke={tyres.rr < 90 ? '#ef4444' : activeSubsystemTab === 'tyres' ? '#6366f1' : 'var(--border-subtle)'}
                            strokeWidth={activeSubsystemTab === 'tyres' ? 2 : 1}
                          />
                          <text x="340" y="118" textAnchor="middle" fontSize="6" fontWeight="700" fill={tyres.rr < 90 ? '#ef4444' : 'var(--text-primary)'}>{tyres.rr}</text>

                          {/* Axle lines */}
                          <line x1="55" y1="103" x2="55" y2="95" stroke="var(--border-subtle)" strokeWidth="1" />
                          <line x1="95" y1="103" x2="95" y2="95" stroke="var(--border-subtle)" strokeWidth="1" />
                          <line x1="290" y1="103" x2="290" y2="95" stroke="var(--border-subtle)" strokeWidth="1" />
                          <line x1="340" y1="103" x2="340" y2="95" stroke="var(--border-subtle)" strokeWidth="1" />
                          {/* Front axle */}
                          <line x1="55" y1="95" x2="95" y2="95" stroke="var(--border-subtle)" strokeWidth="1.5" />
                          {/* Rear axle */}
                          <line x1="290" y1="95" x2="340" y2="95" stroke="var(--border-subtle)" strokeWidth="1.5" />
                        </g>

                        {/* Labels */}
                        <text x="75" y="135" textAnchor="middle" fontSize="7" fill="var(--text-muted)">Front Axle (psi)</text>
                        <text x="315" y="135" textAnchor="middle" fontSize="7" fill="var(--text-muted)">Rear Axle (psi)</text>
                      </svg>
                    </div>

                    {/* Subsystem Tabs */}
                    <div style={{
                      background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)'
                    }}>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
                        {[
                          { key: 'engine', label: 'Engine', icon: Settings, color: '#6366f1' },
                          { key: 'fuel', label: 'Fuel', icon: Fuel, color: '#f59e0b' },
                          { key: 'tyres', label: 'Tyres', icon: Gauge, color: '#ef4444' },
                          { key: 'cargo', label: 'Cargo', icon: Box, color: '#8b5cf6' },
                          { key: 'brakes', label: 'Brakes', icon: Activity, color: '#ec4899' }
                        ].map(tab => (
                          <button
                            key={tab.key}
                            onClick={() => setActiveSubsystemTab(tab.key)}
                            style={{
                              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                              padding: '6px 0', fontSize: '10px', fontWeight: 700, border: 'none',
                              borderRadius: 4, cursor: 'pointer', transition: 'all 0.2s',
                              background: activeSubsystemTab === tab.key ? `${tab.color}22` : 'var(--bg-800)',
                              color: activeSubsystemTab === tab.key ? tab.color : 'var(--text-muted)',
                              borderBottom: activeSubsystemTab === tab.key ? `2px solid ${tab.color}` : '2px solid transparent'
                            }}
                          >
                            <tab.icon size={12} /> {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Engine Tab */}
                      {activeSubsystemTab === 'engine' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '11px' }}>
                            <div style={{ background: 'var(--bg-900)', padding: 10, borderRadius: 6 }}>
                              <span style={{ color: 'var(--text-muted)', fontSize: '9px', display: 'block', marginBottom: 2 }}>COOLANT TEMP</span>
                              <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{t.obd?.coolant || 'N/A'}</strong>
                              <div style={{
                                height: 4, borderRadius: 2, marginTop: 6,
                                background: 'var(--bg-700)'
                              }}>
                                <div style={{
                                  height: '100%', borderRadius: 2, width: `${Math.min(100, (parseInt(t.obd?.coolant) || 0) / 1.2)}%`,
                                  background: (parseInt(t.obd?.coolant) || 0) > 105 ? '#ef4444' : '#38CE3C',
                                  transition: 'width 0.5s'
                                }} />
                              </div>
                            </div>
                            <div style={{ background: 'var(--bg-900)', padding: 10, borderRadius: 6 }}>
                              <span style={{ color: 'var(--text-muted)', fontSize: '9px', display: 'block', marginBottom: 2 }}>OIL PRESSURE</span>
                              <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{t.obd?.oilPressure || 'N/A'}</strong>
                              <div style={{ height: 4, borderRadius: 2, marginTop: 6, background: 'var(--bg-700)' }}>
                                <div style={{
                                  height: '100%', borderRadius: 2, width: `${Math.min(100, (parseInt(t.obd?.oilPressure) || 0) * 1.5)}%`,
                                  background: '#38CE3C', transition: 'width 0.5s'
                                }} />
                              </div>
                            </div>
                            <div style={{ background: 'var(--bg-900)', padding: 10, borderRadius: 6 }}>
                              <span style={{ color: 'var(--text-muted)', fontSize: '9px', display: 'block', marginBottom: 2 }}>BATTERY VOLTAGE</span>
                              <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{t.obd?.voltage || 'N/A'}</strong>
                            </div>
                            <div style={{ background: 'var(--bg-900)', padding: 10, borderRadius: 6 }}>
                              <span style={{ color: 'var(--text-muted)', fontSize: '9px', display: 'block', marginBottom: 2 }}>ENGINE RPM</span>
                              <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{t.obd?.rpm || 'N/A'}</strong>
                            </div>
                          </div>
                          {/* Active DTC Fault Codes */}
                          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
                            <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 4 }}>ACTIVE DTC FAULT CODES</span>
                            {t.obd?.faultCodes && t.obd.faultCodes.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {t.obd.faultCodes.map(code => (
                                  <div key={code} style={{
                                    background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.2)',
                                    borderRadius: 4, padding: '4px 8px', color: 'var(--danger-500)', fontSize: '10px', display: 'flex', alignItems: 'center', gap: 6
                                  }}>
                                    <AlertTriangle size={12} /> {code}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div style={{ color: '#38CE3C', fontSize: '10px', fontWeight: 600 }}>
                                🟢 No active DTC faults logged. Sensor calibration is nominal.
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Fuel Tab */}
                      {activeSubsystemTab === 'fuel' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={{ background: 'var(--bg-900)', padding: 12, borderRadius: 6 }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '9px', display: 'block', marginBottom: 4 }}>FUEL VOLUME LEVEL</span>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                              <strong style={{ color: 'var(--text-primary)', fontSize: '22px' }}>{t.fuel}</strong>
                              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>/ 400L tank</span>
                            </div>
                            <div style={{ height: 8, borderRadius: 4, marginTop: 8, background: 'var(--bg-700)' }}>
                              <div style={{
                                height: '100%', borderRadius: 4, width: t.fuel,
                                background: parseInt(t.fuel) < 30 ? '#ef4444' : parseInt(t.fuel) < 50 ? '#f59e0b' : '#38CE3C',
                                transition: 'width 0.5s'
                              }} />
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            <div style={{ background: 'var(--bg-900)', padding: 10, borderRadius: 6 }}>
                              <span style={{ color: 'var(--text-muted)', fontSize: '9px', display: 'block', marginBottom: 2 }}>CONSUMPTION RATE</span>
                              <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{fleetState.fuelEfficiency} km/L</strong>
                            </div>
                            <div style={{ background: 'var(--bg-900)', padding: 10, borderRadius: 6 }}>
                              <span style={{ color: 'var(--text-muted)', fontSize: '9px', display: 'block', marginBottom: 2 }}>SIPHON ALERT</span>
                              <strong style={{ color: '#38CE3C', fontSize: '12px' }}>🟢 No anomalies</strong>
                            </div>
                          </div>
                          <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 6, padding: 10 }}>
                            <span style={{ fontSize: '9px', color: '#f59e0b', fontWeight: 700 }}>FUEL CARD LAST TXN</span>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: 4 }}>
                              200L Diesel @ IOCL Surat Bypass — ₹18,400 — 2h ago
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tyres Tab */}
                      {activeSubsystemTab === 'tyres' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {[
                              { label: 'FRONT LEFT', val: tyres.fl, key: 'fl' },
                              { label: 'FRONT RIGHT', val: tyres.fr, key: 'fr' },
                              { label: 'REAR LEFT', val: tyres.rl, key: 'rl' },
                              { label: 'REAR RIGHT', val: tyres.rr, key: 'rr' }
                            ].map(wheel => {
                              const isDanger = wheel.val < 90;
                              return (
                                <div key={wheel.key} style={{
                                  background: isDanger ? 'rgba(239,68,68,0.08)' : 'var(--bg-900)',
                                  border: isDanger ? '1px solid rgba(239,68,68,0.25)' : '1px solid transparent',
                                  padding: 12, borderRadius: 6, textAlign: 'center'
                                }}>
                                  <span style={{ color: 'var(--text-muted)', fontSize: '9px', display: 'block', marginBottom: 4 }}>{wheel.label}</span>
                                  <strong style={{ color: isDanger ? '#ef4444' : 'var(--text-primary)', fontSize: '20px', display: 'block' }}>{wheel.val}</strong>
                                  <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>psi</span>
                                  <div style={{ height: 4, borderRadius: 2, marginTop: 8, background: 'var(--bg-700)' }}>
                                    <div style={{
                                      height: '100%', borderRadius: 2, width: `${Math.min(100, (wheel.val / 120) * 100)}%`,
                                      background: isDanger ? '#ef4444' : '#38CE3C', transition: 'width 0.5s'
                                    }} />
                                  </div>
                                  {isDanger && (
                                    <div style={{ color: '#ef4444', fontSize: '8px', fontWeight: 700, marginTop: 4 }}>⚠ BELOW 90 PSI</div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', background: 'var(--bg-900)', padding: 8, borderRadius: 4 }}>
                            Safe threshold: 90–120 psi | Nominal: 110 psi | Last rotated: 14 days ago
                          </div>
                        </div>
                      )}

                      {/* Cargo Tab */}
                      {activeSubsystemTab === 'cargo' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            <div style={{ background: 'var(--bg-900)', padding: 12, borderRadius: 6 }}>
                              <span style={{ color: 'var(--text-muted)', fontSize: '9px', display: 'block', marginBottom: 2 }}>PAYLOAD WEIGHT</span>
                              <strong style={{ color: 'var(--text-primary)', fontSize: '16px' }}>18.4 tons</strong>
                              <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: 2 }}>Max: 25 tons (73.6%)</div>
                            </div>
                            <div style={{ background: 'var(--bg-900)', padding: 12, borderRadius: 6 }}>
                              <span style={{ color: 'var(--text-muted)', fontSize: '9px', display: 'block', marginBottom: 2 }}>TRAILER DOOR</span>
                              <strong style={{ color: '#38CE3C', fontSize: '14px' }}>🔒 LOCKED</strong>
                              <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: 2 }}>Tamper seal intact</div>
                            </div>
                          </div>
                          <div style={{
                            background: hasReeferFault ? 'rgba(239,68,68,0.08)' : 'var(--bg-900)',
                            border: hasReeferFault ? '1px solid rgba(239,68,68,0.25)' : '1px solid transparent',
                            padding: 12, borderRadius: 6
                          }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '9px', display: 'block', marginBottom: 4 }}>REEFER TEMPERATURE</span>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                              <Thermometer size={16} color={hasReeferFault ? '#ef4444' : '#38CE3C'} />
                              <strong style={{ color: hasReeferFault ? '#ef4444' : 'var(--text-primary)', fontSize: '24px' }}>{reeferTemp} °C</strong>
                              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>/ limit: 5 °C</span>
                            </div>
                            <div style={{ height: 6, borderRadius: 3, marginTop: 8, background: 'var(--bg-700)' }}>
                              <div style={{
                                height: '100%', borderRadius: 3, width: `${Math.min(100, (reeferTemp / 25) * 100)}%`,
                                background: hasReeferFault ? '#ef4444' : '#38CE3C', transition: 'width 0.5s'
                              }} />
                            </div>
                            {hasReeferFault && (
                              <div style={{ color: '#ef4444', fontSize: '9px', fontWeight: 700, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <AlertTriangle size={12} /> CRITICAL: Cargo spoilage risk! Temperature exceeds cold chain limit.
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Brakes Tab */}
                      {activeSubsystemTab === 'brakes' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '11px' }}>
                            <div style={{ background: 'var(--bg-900)', padding: 10, borderRadius: 6 }}>
                              <span style={{ color: 'var(--text-muted)', fontSize: '9px', display: 'block', marginBottom: 2 }}>FRONT AXLE WEAR</span>
                              <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>42% / 80% limit</strong>
                              <div style={{ height: 4, borderRadius: 2, marginTop: 6, background: 'var(--bg-700)' }}>
                                <div style={{ height: '100%', borderRadius: 2, width: '42%', background: '#38CE3C' }} />
                              </div>
                            </div>
                            <div style={{ background: 'var(--bg-900)', padding: 10, borderRadius: 6 }}>
                              <span style={{ color: 'var(--text-muted)', fontSize: '9px', display: 'block', marginBottom: 2 }}>REAR AXLE WEAR</span>
                              <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>76% / 80% limit</strong>
                              <div style={{ height: 4, borderRadius: 2, marginTop: 6, background: 'var(--bg-700)' }}>
                                <div style={{ height: '100%', borderRadius: 2, width: '76%', background: '#f59e0b' }} />
                              </div>
                            </div>
                          </div>
                          <div style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)', padding: 10, borderRadius: 6, fontSize: '10px', color: 'var(--text-secondary)' }}>
                            <div style={{ fontWeight: 'bold', color: '#ec4899', marginBottom: 4 }}>Brake Assembly Wear Advisory</div>
                            Rear axle brake pad wear is at 76%. Replacement scheduled at next scheduled destination (Mumbai Hub).
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Telemetry Fault Simulator Console */}
                    <div style={{
                      background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)'
                    }}>
                      <h4 style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                        <Zap size={12} color="#f59e0b" /> TELEMETRY FAULT SIMULATOR
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <button
                          onClick={handleSimulateTyreDrop}
                          style={{
                            width: '100%', padding: '8px 12px', border: 'none', borderRadius: 6,
                            background: 'rgba(239,68,68,0.08)', color: '#ef4444',
                            fontSize: '10px', fontWeight: 700, cursor: 'pointer', textAlign: 'left',
                            display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s'
                          }}
                        >
                          <Gauge size={14} /> Simulate Tyre Pressure Drop (FR/RR → 65 psi)
                        </button>
                        <button
                          onClick={handleSimulateReeferRise}
                          style={{
                            width: '100%', padding: '8px 12px', border: 'none', borderRadius: 6,
                            background: 'rgba(245,158,11,0.08)', color: '#f59e0b',
                            fontSize: '10px', fontWeight: 700, cursor: 'pointer', textAlign: 'left',
                            display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s'
                          }}
                        >
                          <Thermometer size={14} /> Simulate Reefer Temp Rise (→ 18 °C breach)
                        </button>
                        <button
                          onClick={handleSimulateCoolantBreach}
                          style={{
                            width: '100%', padding: '8px 12px', border: 'none', borderRadius: 6,
                            background: 'rgba(239,68,68,0.08)', color: '#ef4444',
                            fontSize: '10px', fontWeight: 700, cursor: 'pointer', textAlign: 'left',
                            display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s'
                          }}
                        >
                          <Thermometer size={14} /> Inject ECU Coolant Breach (TRK-00012 ➔ 115 °C)
                        </button>
                        <button
                          onClick={handleClearAllFaults}
                          style={{
                            width: '100%', padding: '8px 12px', border: 'none', borderRadius: 6,
                            background: 'rgba(56,206,60,0.08)', color: '#38CE3C',
                            fontSize: '10px', fontWeight: 700, cursor: 'pointer', textAlign: 'left',
                            display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s'
                          }}
                        >
                          <RotateCcw size={14} /> Clear All DTCs & Recalibrate (ZKP Reset)
                        </button>
                      </div>
                    </div>

                    {/* AI Fleet Routing Controls */}
                    <div style={{
                      background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
                      flexDirection: 'column', gap: 12
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-primary)' }}>
                          <Bot size={14} color="var(--primary-400)" /> AI FLEET ROUTING
                        </h3>
                        <button
                          onClick={handleToggleRouteOptimization}
                          style={{
                            background: fleetRouteOptimization ? 'rgba(56,206,60,0.15)' : 'var(--bg-800)',
                            border: `1px solid ${fleetRouteOptimization ? '#38CE3C' : 'var(--border-subtle)'}`,
                            color: fleetRouteOptimization ? '#38CE3C' : 'var(--text-primary)',
                            borderRadius: 4, padding: '2px 8px', fontSize: '9px', fontWeight: 700, cursor: 'pointer'
                          }}
                        >
                          {fleetRouteOptimization ? "OPTIMIZATION ACTIVE" : "ENABLE OPTIMIZER"}
                        </button>
                      </div>

                      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', padding: 12, borderRadius: 'var(--radius-md)' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-400)', marginBottom: 4 }}>Asset Underutilization Alert</div>
                        <p style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          "Tata Prima TRK-00028 has been idle at Mumbai JNPT parking yard for 18 hours. The supply chain corridor shows 15% booking backlog to Bangalore tomorrow."
                        </p>
                        <button
                          onClick={() => {
                            showToast("Assigned TRK-00028 to Mumbai-Bangalore route", "success");
                            pushEvent("Fleet Asset Reallocated", "Supply Chain Agent dispatched TRK-00028 to Mumbai-Bangalore backlog. Updates: ERP utility target achieved.");
                          }}
                          style={{
                            width: '100%', marginTop: 8, padding: '4px 0', border: 'none',
                            borderRadius: 4, background: 'var(--primary-500)', color: '#fff', fontSize: '9px', fontWeight: 700, cursor: 'pointer'
                          }}
                        >
                          Dispatch to Mumbai➔Bangalore
                        </button>
                      </div>
                    </div>
                  </>
                );
              })()}

            </div>

          </div>
        )}

        {/* ==================== LAYER 4: VENDOR PORTAL ==================== */}
        {activePortal === 'vendor' && (() => {
          const filteredServices = vendorServices.filter(s => {
            const matchesSearch = s.id.toLowerCase().includes(vendorSearchQuery.toLowerCase()) ||
                                  s.truck.toLowerCase().includes(vendorSearchQuery.toLowerCase()) ||
                                  s.type.toLowerCase().includes(vendorSearchQuery.toLowerCase());
            const matchesStatus = vendorStatusFilter === 'all' || s.status === vendorStatusFilter;
            return matchesSearch && matchesStatus;
          });

          const selectedService = vendorServices.find(s => s.id === selectedServiceId) || vendorServices[0];

          return (
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 340px', gap: 'var(--space-6)' }}>
              
              {/* Left Column: Service logs list & search */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--text-primary)' }}>Service Tickets ({filteredServices.length})</h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Search and track partner workshop invoices and OBD logs.</p>
                </div>

                <div style={{ display: 'flex', background: 'var(--bg-900)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '6px 12px', alignItems: 'center', gap: 6 }}>
                  <Search size={14} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="Search truck, ticket, type..."
                    value={vendorSearchQuery}
                    onChange={e => setVendorSearchQuery(e.target.value)}
                    style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '11px', width: '100%' }}
                  />
                </div>

                {/* Filter pills */}
                <div style={{ display: 'flex', gap: 6 }}>
                  {['all', 'pending', 'completed'].map(status => (
                    <button
                      key={status}
                      onClick={() => setVendorStatusFilter(status)}
                      style={{
                        padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)',
                        fontSize: '9px', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase',
                        background: vendorStatusFilter === status ? 'var(--primary-500)' : 'transparent',
                        color: vendorStatusFilter === status ? '#fff' : 'var(--text-secondary)'
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                {/* Scrollable list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', maxHeight: '380px', paddingRight: 4 }}>
                  {filteredServices.map(log => {
                    const isSelected = selectedServiceId === log.id;
                    const isPending = log.status === 'pending';
                    return (
                      <div
                        key={log.id}
                        onClick={() => setSelectedServiceId(log.id)}
                        style={{
                          ...listItemStyle,
                          border: isSelected ? '1px solid var(--primary-500)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(99,102,241,0.05)' : 'var(--bg-800)',
                          boxShadow: isSelected ? 'var(--shadow-glow)' : 'none',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '12px' }}>{log.id}</span>
                              <span style={{
                                fontSize: '8px', fontWeight: 800, padding: '2px 6px', borderRadius: 4,
                                background: isPending ? 'rgba(245,158,11,0.1)' : 'var(--success-bg)',
                                color: isPending ? '#f59e0b' : '#38CE3C'
                              }}>
                                {log.status.toUpperCase()}
                              </span>
                            </div>
                            <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)' }}>{log.type}</span>
                            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Truck: {log.truck} | {log.location}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '12px' }}>₹{log.cost.toLocaleString()}</div>
                            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{log.time}</span>
                          </div>
                        </div>
                        {isPending && (
                          <span style={{
                            position: 'absolute', top: 6, right: 6, width: 6, height: 6,
                            borderRadius: '50%', background: '#ef4444', display: 'inline-block'
                          }} className="animate-pulse" />
                        )}
                      </div>
                    );
                  })}
                  {filteredServices.length === 0 && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
                      No service tickets found matching search.
                    </div>
                  )}
                </div>
              </div>

              {/* Center Column: SVG Workshop Floor & Stepper */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--text-primary)' }}>Workshop Floor Twin</h3>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active diagnostics bay highlights based on the selected service type.</p>
                    </div>
                    <button onClick={() => setVendorRefuelOpen(!vendorRefuelOpen)} style={{
                      background: 'var(--gradient-primary)', color: '#fff', border: 'none',
                      borderRadius: 4, padding: '8px 12px', fontSize: '10px', fontWeight: 700, cursor: 'pointer'
                    }}>
                      {vendorRefuelOpen ? "View Stepper Floor" : "Log Diesel Refuel"}
                    </button>
                  </div>

                  {vendorRefuelOpen ? (
                    /* Fuel Card Log Form */
                    <form onSubmit={handleVendorRefuel} style={{
                      background: 'var(--bg-900)', border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 10
                    }}>
                      <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--text-primary)' }}>Log Fuel Card Purchase</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                          <label style={modalLabelStyle}>Select Vehicle ID</label>
                          <select
                            value={vendorForm.truckId}
                            onChange={e => setVendorForm(prev => ({ ...prev, truckId: e.target.value }))}
                            style={formInputStyle}
                          >
                            <option value="TRK-00012">TRK-00012 (Tata Prima)</option>
                            <option value="TRK-00028">TRK-00028 (Ashok Leyland)</option>
                            <option value="TRK-00045">TRK-00045 (Volvo FM)</option>
                            <option value="TRK-00019">TRK-00019 (BharatBenz)</option>
                          </select>
                        </div>
                        <div>
                          <label style={modalLabelStyle}>Fuel Station</label>
                          <input
                            type="text"
                            value={vendorForm.station}
                            onChange={e => setVendorForm(prev => ({ ...prev, station: e.target.value }))}
                            style={formInputStyle}
                            required
                          />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                          <label style={modalLabelStyle}>Volume (Liters)</label>
                          <input
                            type="number"
                            value={vendorForm.liters}
                            onChange={e => setVendorForm(prev => ({ ...prev, liters: e.target.value }))}
                            style={formInputStyle}
                            required
                          />
                        </div>
                        <div>
                          <label style={modalLabelStyle}>Unit Price (₹/L)</label>
                          <input
                            type="number"
                            value={vendorForm.unitPrice}
                            onChange={e => setVendorForm(prev => ({ ...prev, unitPrice: e.target.value }))}
                            style={formInputStyle}
                            required
                          />
                        </div>
                      </div>
                      <div style={{
                        background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)',
                        borderRadius: 4, padding: 8, fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}>
                        <span>Estimated Invoice Cost:</span>
                        <strong style={{ color: '#38CE3C', fontSize: '12px' }}>
                          ₹{(parseFloat(vendorForm.liters || 0) * parseFloat(vendorForm.unitPrice || 0)).toLocaleString()}
                        </strong>
                      </div>
                      <button type="submit" style={{
                        background: 'var(--gradient-primary)', border: 'none', color: '#fff',
                        borderRadius: 4, padding: '10px 0', fontSize: '10px', fontWeight: 700, cursor: 'pointer', marginTop: 4
                      }}>
                        Settle Fuel Transaction Card
                      </button>
                    </form>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {/* Interactive Workshop Floor SVG */}
                      <div style={{ background: 'var(--bg-900)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px 8px' }}>
                        <svg width="100%" height="130" viewBox="0 0 460 130" style={{ overflow: 'visible' }}>
                          <style>{`
                            @keyframes scannerScan {
                              0% { transform: translateY(0); }
                              50% { transform: translateY(40px); }
                              100% { transform: translateY(0); }
                            }
                            @keyframes tyreRotate {
                              from { transform: rotate(0deg); }
                              to { transform: rotate(360deg); }
                            }
                          `}</style>
                          <rect x="10" y="10" width="440" height="110" rx="8" fill="none" stroke="var(--border-subtle)" strokeWidth="1.5" strokeDasharray="3,3" />
                          <text x="230" y="24" fill="var(--text-muted)" fontSize="8" textAnchor="middle" letterSpacing="0.1em" fontWeight="bold">GATIFLEET AUTOMATED WORKSHOP DIGITAL TWIN</text>
                          
                          {/* Bay 1: ECU / Diagnostics */}
                          {(() => {
                            const isDiagnosticsSelected = selectedService && (selectedService.type.includes('ECU') || selectedService.type.includes('Diagnostics') || selectedService.type.includes('Sensor'));
                            return (
                              <g style={{ cursor: 'pointer' }} onClick={() => {
                                const diagnosticsSvc = vendorServices.find(s => s.type.includes('ECU') || s.type.includes('Diagnostics') || s.type.includes('Sensor'));
                                if (diagnosticsSvc) setSelectedServiceId(diagnosticsSvc.id);
                              }}>
                                <rect x="25" y="35" width="90" height="70" rx="6"
                                      fill={isDiagnosticsSelected ? 'rgba(168,85,247,0.1)' : 'rgba(255,255,255,0.01)'}
                                      stroke={isDiagnosticsSelected ? '#a855f7' : 'var(--border-subtle)'}
                                      strokeWidth={isDiagnosticsSelected ? 2.5 : 1.2} />
                                <circle cx="70" cy="55" r="4" fill="#a855f7" />
                                <text x="70" y="72" fill="var(--text-primary)" fontSize="9" fontWeight="bold" textAnchor="middle">BAY 1: ECU DIAG</text>
                                <text x="70" y="84" fill="var(--text-muted)" fontSize="7" textAnchor="middle">
                                  {isDiagnosticsSelected ? selectedService.truck : 'DIAGNOSTICS'}
                                </text>
                                {isDiagnosticsSelected && selectedService.status === 'pending' && (
                                  <>
                                    <circle cx="103" cy="47" r="3" fill="#ef4444" className="animate-pulse" />
                                    <line x1="30" y1="42" x2="110" y2="42" stroke="#a855f7" strokeWidth="1.5" style={{ animation: 'scannerScan 2s ease-in-out infinite', filter: 'drop-shadow(0 0 3px #a855f7)' }} />
                                  </>
                                )}
                              </g>
                            );
                          })()}

                          {/* Bay 2: Tyre Swapping */}
                          {(() => {
                            const isTyreSelected = selectedService && (selectedService.type.includes('Tyre') || selectedService.type.includes('Wheel'));
                            return (
                              <g style={{ cursor: 'pointer' }} onClick={() => {
                                const tyreSvc = vendorServices.find(s => s.type.includes('Tyre') || s.type.includes('Wheel'));
                                if (tyreSvc) setSelectedServiceId(tyreSvc.id);
                              }}>
                                <rect x="130" y="35" width="90" height="70" rx="6"
                                      fill={isTyreSelected ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.01)'}
                                      stroke={isTyreSelected ? '#3b82f6' : 'var(--border-subtle)'}
                                      strokeWidth={isTyreSelected ? 2.5 : 1.2} />
                                
                                {/* Animated spinning wheel */}
                                <g transform="translate(175, 50)">
                                  <circle cx="0" cy="0" r="10" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="3,3" style={{ animation: isTyreSelected && selectedService.status === 'pending' ? 'tyreRotate 2s linear infinite' : 'none', transformOrigin: 'center' }} />
                                  <circle cx="0" cy="0" r="3" fill="var(--text-muted)" />
                                </g>

                                <text x="175" y="72" fill="var(--text-primary)" fontSize="9" fontWeight="bold" textAnchor="middle">BAY 2: TYRE SWAP</text>
                                <text x="175" y="84" fill="var(--text-muted)" fontSize="7" textAnchor="middle">
                                  {isTyreSelected ? selectedService.truck : 'WHEEL SWAPS'}
                                </text>
                              </g>
                            );
                          })()}

                          {/* Bay 3: Diesel Card Terminal */}
                          {(() => {
                            const isFuelSelected = selectedService && (selectedService.type.includes('Fuel') || selectedService.type.includes('Diesel'));
                            return (
                              <g style={{ cursor: 'pointer' }} onClick={() => {
                                const fuelSvc = vendorServices.find(s => s.type.includes('Fuel') || s.type.includes('Diesel'));
                                if (fuelSvc) setSelectedServiceId(fuelSvc.id);
                              }}>
                                <rect x="235" y="35" width="90" height="70" rx="6"
                                      fill={isFuelSelected ? 'rgba(56,206,60,0.1)' : 'rgba(255,255,255,0.01)'}
                                      stroke={isFuelSelected ? '#38CE3C' : 'var(--border-subtle)'}
                                      strokeWidth={isFuelSelected ? 2.5 : 1.2} />
                                <circle cx="280" cy="50" r="4" fill="#38CE3C" />
                                
                                {isFuelSelected && selectedService.status === 'pending' && (
                                  <rect x="245" y="90" width="70" height="4" rx="2" fill="rgba(56,206,60,0.2)" stroke="#38CE3C" strokeWidth="0.5" className="animate-pulse" />
                                )}

                                <text x="280" y="72" fill="var(--text-primary)" fontSize="9" fontWeight="bold" textAnchor="middle">BAY 3: FUEL CO</text>
                                <text x="280" y="84" fill="var(--text-muted)" fontSize="7" textAnchor="middle">
                                  {isFuelSelected ? selectedService.truck : 'DIESEL SUPPLY'}
                                </text>
                              </g>
                            );
                          })()}

                          {/* Bay 4: General Service */}
                          {(() => {
                            const isGeneralSelected = selectedService && (selectedService.type.includes('Brake') || selectedService.type.includes('Tuning') || selectedService.type.includes('Engine') || selectedService.type.includes('Coolant'));
                            return (
                              <g style={{ cursor: 'pointer' }} onClick={() => {
                                const genSvc = vendorServices.find(s => s.type.includes('Brake') || s.type.includes('Tuning') || s.type.includes('Engine') || s.type.includes('Coolant'));
                                if (genSvc) setSelectedServiceId(genSvc.id);
                              }}>
                                <rect x="340" y="35" width="90" height="70" rx="6"
                                      fill={isGeneralSelected ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.01)'}
                                      stroke={isGeneralSelected ? '#f59e0b' : 'var(--border-subtle)'}
                                      strokeWidth={isGeneralSelected ? 2.5 : 1.2} />
                                
                                {/* Ground anchors for mechanical lift */}
                                <rect x="363" y="100" width="4" height="2" fill="var(--text-muted)" />
                                <rect x="403" y="100" width="4" height="2" fill="var(--text-muted)" />

                                {/* Elevating Mechanical Lift and Truck Silhouette */}
                                <g transform={`translate(0, ${isGeneralSelected && selectedService.status === 'pending' ? -12 : 0})`} style={{ transition: 'transform 1s ease-in-out' }}>
                                  {/* Mechanical Lift Platform */}
                                  <line x1="345" y1="95" x2="425" y2="95" stroke="#f59e0b" strokeWidth="2.5" />
                                  <line x1="365" y1="95" x2="365" y2="101" stroke="#f59e0b" strokeWidth="1.5" />
                                  <line x1="405" y1="95" x2="405" y2="101" stroke="#f59e0b" strokeWidth="1.5" />
                                  {/* Truck Cabin Silhouette */}
                                  <rect x="358" y="84" width="54" height="11" rx="2" fill="rgba(245,158,11,0.25)" stroke="#f59e0b" strokeWidth="0.8" />
                                </g>

                                <text x="385" y="72" fill="var(--text-primary)" fontSize="9" fontWeight="bold" textAnchor="middle">BAY 4: LIFT BAY</text>
                                <text x="385" y="84" fill="var(--text-muted)" fontSize="7" textAnchor="middle">
                                  {isGeneralSelected ? selectedService.truck : 'HYDRAULICS'}
                                </text>
                              </g>
                            );
                          })()}
                        </svg>
                      </div>

                      {/* Milestone timeline stepper */}
                      {selectedService && (
                        <div style={{ background: 'var(--surface-hover)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 12 }}>
                          <h4 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Ticket Milestone Stepper ({selectedService.id})</h4>
                          
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', position: 'relative' }}>
                            {/* Connector line */}
                            <div style={{
                              position: 'absolute', top: '16px', left: '20px', right: '20px', height: '2px',
                              background: selectedService.status === 'completed' ? 'var(--success-500)' : 'var(--border-subtle)',
                              zIndex: 1
                            }} />

                            {[
                              { label: 'Ticket', done: true },
                              { label: 'Arrived', done: true },
                              { label: 'Diagnosed', done: true },
                              { label: 'Repaired', done: selectedService.status === 'completed' },
                              { label: 'Audited', done: selectedService.status === 'completed' },
                              { label: 'Settle', done: selectedService.status === 'completed' }
                            ].map((step, idx) => (
                              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, gap: 4 }}>
                                <div style={{
                                  width: '24px', height: '24px', borderRadius: '50%',
                                  background: step.done ? 'var(--success-500)' : 'var(--bg-900)',
                                  border: `2px solid ${step.done ? 'var(--success-500)' : 'var(--border-subtle)'}`,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold', color: '#fff'
                                }}>
                                  {step.done ? '✓' : idx + 1}
                                </div>
                                <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>{step.label}</span>
                              </div>
                            ))}
                          </div>

                          {/* Action alert box for pending loops */}
                          {selectedService.status === 'pending' && (
                            <div style={{
                              marginTop: 12, background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)',
                              borderRadius: 4, padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <AlertTriangle size={14} color="#ef4444" className="animate-pulse" />
                                <div>
                                  <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-primary)' }}>Closed-loop settlement required</div>
                                  <div style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>Clear engine DTC codes & recover delayed customer shipment SHP-104921.</div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleVendorServiceSettle(selectedService.id)}
                                style={{
                                  background: 'var(--gradient-primary)', color: '#fff', border: 'none',
                                  borderRadius: 4, padding: '6px 12px', fontSize: '9px', fontWeight: 800, cursor: 'pointer'
                                }}
                              >
                                AUTHORIZE & SETTLE
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Tabbed Inspector & KPIs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {selectedService ? (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    
                    {/* Tab Selection */}
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)' }}>
                      {['overview', 'invoice', 'diagnostics'].map(tab => (
                        <button
                          key={tab}
                          onClick={() => setActiveVendorTab(tab)}
                          style={{
                            flex: 1, padding: '6px 0', background: 'transparent', border: 'none',
                            borderBottom: activeVendorTab === tab ? '2px solid var(--primary-500)' : 'none',
                            color: activeVendorTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                            fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer'
                          }}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Tab contents */}
                    {activeVendorTab === 'overview' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '11px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Ticket ID:</span>
                          <strong style={{ color: 'var(--text-primary)' }}>{selectedService.id}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Service Category:</span>
                          <span style={{ color: 'var(--text-primary)' }}>{selectedService.type}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Target Vehicle:</span>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedService.truck}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Location:</span>
                          <span style={{ color: 'var(--text-primary)' }}>{selectedService.location}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{ color: 'var(--text-muted)' }}>Details:</span>
                          <p style={{ color: 'var(--text-secondary)', background: 'var(--bg-900)', padding: 6, borderRadius: 4, margin: 0, fontSize: '10px' }}>
                            {selectedService.detail}
                          </p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Total Cost:</span>
                          <span style={{ color: 'var(--primary-400)', fontWeight: 800 }}>₹{selectedService.cost.toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    {activeVendorTab === 'invoice' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4 }}>
                          <span style={{ color: 'var(--text-muted)' }}>ITEMIZED DESCRIPTION</span>
                          <span style={{ color: 'var(--text-muted)' }}>COST</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Spare Parts / Component replacements</span>
                          <span style={{ color: 'var(--text-primary)' }}>₹{Math.floor(selectedService.cost * 0.45).toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Diagnostics & Technician labor hours</span>
                          <span style={{ color: 'var(--text-primary)' }}>₹{Math.floor(selectedService.cost * 0.30).toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Environmental compliance disposal fee</span>
                          <span style={{ color: 'var(--text-primary)' }}>₹{Math.floor(selectedService.cost * 0.10).toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4 }}>
                          <span>Integrated SGST & CGST (15%)</span>
                          <span style={{ color: 'var(--text-primary)' }}>₹{Math.floor(selectedService.cost * 0.15).toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '11px', paddingTop: 4 }}>
                          <span style={{ color: 'var(--text-primary)' }}>Total Settle Bill:</span>
                          <span style={{ color: '#38CE3C' }}>₹{selectedService.cost.toLocaleString()}</span>
                        </div>
                        <div style={{ fontSize: '8px', color: 'var(--text-muted)', marginTop: 4 }}>
                          * Invoice synced automatically to GatiFleet PO compliance audit logs.
                        </div>
                      </div>
                    )}

                    {activeVendorTab === 'diagnostics' && (() => {
                      const truckObj = fleetTrucks.find(t => t.id === selectedService.truck);
                      const coolantTemp = selectedService.truck === 'TRK-00012' && selectedService.status === 'pending' ? '115 °C' : (truckObj ? truckObj.obd?.coolant : '92 °C');
                      const engineRpm = selectedService.truck === 'TRK-00012' && selectedService.status === 'pending' ? '1,650 RPM' : (truckObj ? truckObj.obd?.rpm : '1,420 RPM');
                      const health = selectedService.truck === 'TRK-00012' && selectedService.status === 'pending' ? 62 : (truckObj ? truckObj.health : 98);
                      
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Vehicle OBD Health Status:</span>
                            <span style={{
                              fontWeight: 800, padding: '2px 6px', borderRadius: 4,
                              background: health < 70 ? 'rgba(239,68,68,0.1)' : 'var(--success-bg)',
                              color: health < 70 ? '#ef4444' : '#38CE3C'
                            }}>{health}% Health</span>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Coolant Temperature:</span>
                              <strong style={{ color: health < 70 ? '#ef4444' : 'var(--text-primary)' }}>{coolantTemp}</strong>
                            </div>
                            <div style={{ width: '100%', background: 'rgba(255,255,255,0.04)', height: 4, borderRadius: 2 }}>
                              <div style={{
                                width: `${Math.min(100, parseInt(coolantTemp) || 90)}%`, height: '100%', borderRadius: 2,
                                background: health < 70 ? '#ef4444' : 'var(--primary-500)'
                              }} />
                            </div>
                          </div>

                          <div style={{ display: 'flex', justify: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Engine RPM:</span>
                            <span style={{ color: 'var(--text-primary)' }}>{engineRpm}</span>
                          </div>

                          <div style={{ display: 'flex', justify: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Oil Pressure:</span>
                            <span style={{ color: 'var(--text-primary)' }}>{truckObj ? truckObj.obd?.oilPressure : '52 psi'}</span>
                          </div>

                          <div style={{ display: 'flex', justify: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Battery Voltage:</span>
                            <span style={{ color: 'var(--text-primary)' }}>{truckObj ? truckObj.obd?.voltage : '24.2 V'}</span>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <span style={{ color: 'var(--text-muted)' }}>Active DTC Trouble Codes:</span>
                            <div style={{
                              background: 'var(--bg-900)', border: '1px solid var(--border-subtle)',
                              padding: 6, borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: '8.5px',
                              color: health < 70 ? '#ef4444' : 'var(--text-muted)'
                            }}>
                              {selectedService.truck === 'TRK-00012' && selectedService.status === 'pending' ? (
                                <div>DTC P0117 - Coolant Temperature Overheat Detected</div>
                              ) : (
                                <div>0 Active Diagnostic Codes Found</div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                    Select a ticket from the left column.
                  </div>
                )}

                {/* Performance Metrics */}
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
                  flexDirection: 'column', gap: 12
                }}>
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--text-primary)' }}>Vendor Quality Scorecard</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Average Quality Rating:</span>
                      <span style={{ color: '#38CE3C', fontWeight: 600 }}>{vendorKPIs.rating} / 5.0</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Fuel Cost Index:</span>
                      <span style={{ color: '#38CE3C', fontWeight: 600 }}>{vendorKPIs.costIndex}% (Nominal)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Service Reliability Rate:</span>
                      <span style={{ color: '#38CE3C', fontWeight: 600 }}>{vendorKPIs.reliability}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Average Lead Time:</span>
                      <span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>{vendorKPIs.avgLeadTime} Hours</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Total Vendor Spend:</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{vendorKPIs.totalSpent.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Operations Console */}
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
                  flexDirection: 'column', gap: 10
                }}>
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--text-primary)' }}>Vendor Operations Console</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button onClick={handleAutoRunMaintenanceScan} style={{
                      background: 'var(--gradient-primary)', border: 'none', color: '#fff',
                      borderRadius: 4, padding: '8px 12px', fontSize: '10px', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justify: 'center', gap: 6, boxShadow: 'var(--shadow-glow)'
                    }}>
                      <Sparkles size={12} />
                      <span>Run AI Fleet Health Scan</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          );
        })()}


        {/* ==================== LAYER 5: BROKER PORTAL ==================== */}
        {activePortal === 'broker' && (() => {
          const filteredLoads = brokerLoads.filter(l => {
            const matchesSearch = l.id.toLowerCase().includes(brokerSearchQuery.toLowerCase()) ||
                                  l.cargo.toLowerCase().includes(brokerSearchQuery.toLowerCase()) ||
                                  l.route.toLowerCase().includes(brokerSearchQuery.toLowerCase());
            const matchesStatus = brokerStatusFilter === 'all' || l.status === brokerStatusFilter;
            return matchesSearch && matchesStatus;
          });

          const selectedLoad = brokerLoads.find(l => l.id === selectedLoadId) || brokerLoads[0];

          return (
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 340px', gap: 'var(--space-6)' }}>
              
              {/* Left Column: Loads list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--text-primary)' }}>Spot Load Board ({filteredLoads.length})</h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Match immediate cargo loads with transporter capacity in the network.</p>
                </div>

                <div style={{ display: 'flex', background: 'var(--bg-900)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '6px 12px', alignItems: 'center', gap: 6 }}>
                  <Search size={14} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="Search load description, route..."
                    value={brokerSearchQuery}
                    onChange={e => setBrokerSearchQuery(e.target.value)}
                    style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '11px', width: '100%' }}
                  />
                </div>

                {/* Filter pills */}
                <div style={{ display: 'flex', gap: 4 }}>
                  {['all', 'open', 'matched', 'cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => setBrokerStatusFilter(status)}
                      style={{
                        padding: '4px 8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)',
                        fontSize: '8px', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase',
                        background: brokerStatusFilter === status ? 'var(--primary-500)' : 'transparent',
                        color: brokerStatusFilter === status ? '#fff' : 'var(--text-secondary)'
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                {/* Scrollable List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', maxHeight: '380px', paddingRight: 4 }}>
                  {filteredLoads.map(load => {
                    const isSelected = selectedLoadId === load.id;
                    return (
                      <div
                        key={load.id}
                        onClick={() => setSelectedLoadId(load.id)}
                        style={{
                          ...listItemStyle,
                          border: isSelected ? '1px solid var(--primary-500)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(99,102,241,0.05)' : 'var(--bg-800)',
                          boxShadow: isSelected ? 'var(--shadow-glow)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '12px' }}>{load.id}</span>
                              <span style={{
                                display: 'inline-block', fontSize: '8px', fontWeight: 800, padding: '2px 6px', borderRadius: 4,
                                background: load.status === 'matched' ? 'var(--success-bg)' : load.status === 'cancelled' ? 'var(--danger-bg)' : 'rgba(255, 222, 115, 0.1)',
                                color: load.status === 'matched' ? '#38CE3C' : load.status === 'cancelled' ? 'var(--danger-500)' : '#f59e0b'
                              }}>
                                {load.status.toUpperCase()}
                              </span>
                            </div>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginTop: 4 }}>{load.cargo} ({load.weight}t)</div>
                            <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: 2 }}>Route: {load.route} | Active Bids: {load.bidsCount}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 800, color: '#38CE3C', fontSize: '12px' }}>₹{load.budget.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Center Column: Live Spot map & comparison stepper */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--text-primary)' }}>Trade Corridor Spot Map</h3>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Curving freight corridor routes and carrier bid clusters.</p>
                    </div>
                    <button onClick={() => setBrokerPostOpen(!brokerPostOpen)} style={{
                      background: 'var(--gradient-primary)', color: '#fff', border: 'none',
                      borderRadius: 4, padding: '8px 12px', fontSize: '10px', fontWeight: 700, cursor: 'pointer'
                    }}>
                      {brokerPostOpen ? "View Stepper Corridor" : "Post Spot Load"}
                    </button>
                  </div>

                  {brokerPostOpen ? (
                    /* Post Spot Load Form */
                    <form onSubmit={handlePostSpotLoad} style={{
                      background: 'var(--bg-900)', border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 10
                    }}>
                      <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--text-primary)' }}>Post New Cargo Load</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                          <label style={modalLabelStyle}>Cargo Description</label>
                          <input
                            type="text"
                            value={brokerForm.cargo}
                            onChange={e => setBrokerForm(prev => ({ ...prev, cargo: e.target.value }))}
                            style={formInputStyle}
                            required
                          />
                        </div>
                        <div>
                          <label style={modalLabelStyle}>Total Weight (Tons)</label>
                          <input
                            type="number"
                            value={brokerForm.weight}
                            onChange={e => setBrokerForm(prev => ({ ...prev, weight: e.target.value }))}
                            style={formInputStyle}
                            required
                          />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                          <label style={modalLabelStyle}>Origin State</label>
                          <select
                            value={brokerForm.originState}
                            onChange={e => setBrokerForm(prev => ({ ...prev, originState: e.target.value, originDistrict: STATE_DISTRICTS[e.target.value] ? STATE_DISTRICTS[e.target.value][0] : '' }))}
                            style={formInputStyle}
                          >
                            {STATES_AND_UTS.filter(s => STATE_DISTRICTS[s]).map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={modalLabelStyle}>Origin District</label>
                          <select
                            value={brokerForm.originDistrict}
                            onChange={e => setBrokerForm(prev => ({ ...prev, originDistrict: e.target.value }))}
                            style={formInputStyle}
                          >
                            {(STATE_DISTRICTS[brokerForm.originState] || []).map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                          <label style={modalLabelStyle}>Destination State</label>
                          <select
                            value={brokerForm.destState}
                            onChange={e => setBrokerForm(prev => ({ ...prev, destState: e.target.value, destDistrict: STATE_DISTRICTS[e.target.value] ? STATE_DISTRICTS[e.target.value][0] : '' }))}
                            style={formInputStyle}
                          >
                            {STATES_AND_UTS.filter(s => STATE_DISTRICTS[s]).map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={modalLabelStyle}>Destination District</label>
                          <select
                            value={brokerForm.destDistrict}
                            onChange={e => setBrokerForm(prev => ({ ...prev, destDistrict: e.target.value }))}
                            style={formInputStyle}
                          >
                            {(STATE_DISTRICTS[brokerForm.destState] || []).map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label style={modalLabelStyle}>Target Budget (₹)</label>
                        <input
                          type="number"
                          value={brokerForm.budget}
                          onChange={e => setBrokerForm(prev => ({ ...prev, budget: e.target.value }))}
                          style={formInputStyle}
                          required
                        />
                      </div>
                      <button type="submit" style={{
                        background: 'var(--gradient-primary)', border: 'none', color: '#fff',
                        borderRadius: 4, padding: '10px 0', fontSize: '10px', fontWeight: 700, cursor: 'pointer', marginTop: 4
                      }}>
                        Submit Spot Cargo Post
                      </button>
                    </form>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {/* Interactive Corridor Map SVG */}
                      <div style={{ background: 'var(--bg-900)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                        <svg width="100%" height="130" viewBox="0 0 460 130" style={{ overflow: 'visible' }}>
                          <rect x="5" y="5" width="450" height="120" rx="8" fill="none" stroke="var(--border-subtle)" strokeWidth="1.2" strokeDasharray="2,2" />
                          
                          {/* Hub locations */}
                          {[
                            { name: 'DEL', x: 220, y: 25 },
                            { name: 'BOM', x: 90, y: 75 },
                            { name: 'BLR', x: 120, y: 105 },
                            { name: 'CCU', x: 370, y: 55 },
                            { name: 'MAA', x: 180, y: 105 }
                          ].map(node => (
                            <g key={node.name}>
                              <circle cx={node.x} cy={node.y} r="5" fill="#ec4899" />
                              <text x={node.x} y={node.y - 8} fill="var(--text-primary)" fontSize="8" fontWeight="bold" textAnchor="middle">{node.name}</text>
                            </g>
                          ))}

                          {/* Glowing line for active load route */}
                          {(() => {
                            if (!selectedLoad) return null;
                            const r = selectedLoad.route;
                            let start = { x: 220, y: 25 }; // DEL
                            let end = { x: 90, y: 75 }; // BOM

                            if (r.includes('Delhi') && r.includes('Mumbai')) { start = { x: 220, y: 25 }; end = { x: 90, y: 75 }; }
                            else if (r.includes('Mumbai') && r.includes('Bangalore')) { start = { x: 90, y: 75 }; end = { x: 120, y: 105 }; }
                            else if (r.includes('Kolkata') && r.includes('Guwahati')) { start = { x: 370, y: 55 }; end = { x: 420, y: 35 }; }
                            else if (r.includes('Delhi') && r.includes('Kolkata')) { start = { x: 220, y: 25 }; end = { x: 370, y: 55 }; }

                            return (
                              <g>
                                <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#ec4899" strokeWidth="2.5" strokeDasharray="4,4" />
                                <circle cx={(start.x + end.x) / 2} cy={(start.y + end.y) / 2} r="16" fill="rgba(236,72,153,0.15)" stroke="#ec4899" strokeWidth="1" strokeDasharray="2,2" />
                                <text x={(start.x + end.x) / 2} y={(start.y + end.y) / 2 + 3} fill="#ec4899" fontSize="7" fontWeight="bold" textAnchor="middle">₹</text>
                              </g>
                            );
                          })()}
                        </svg>
                      </div>

                      {/* Candlestick Rate Trends SVG */}
                      <div style={{ background: 'var(--bg-900)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', marginBottom: 8 }}>
                          <span>7-DAY LANE RATE TRENDS (CANDLESTICKS)</span>
                          <span style={{ color: 'var(--primary-400)', fontWeight: 700 }}>DEL-BOM Corridor Index</span>
                        </div>
                        <svg width="100%" height="80" viewBox="0 0 320 80" style={{ overflow: 'visible' }}>
                          {/* Grid Lines */}
                          <line x1="10" y1="15" x2="310" y2="15" stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray="3,3" />
                          <line x1="10" y1="40" x2="310" y2="40" stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray="3,3" />
                          <line x1="10" y1="65" x2="310" y2="65" stroke="var(--border-subtle)" strokeWidth="0.5" strokeDasharray="3,3" />
                          
                          {/* Candlesticks for 7 days */}
                          {[
                            { day: 'Mon', open: 45, close: 30, high: 20, low: 55, color: '#ef4444' }, // red (down)
                            { day: 'Tue', open: 35, close: 50, high: 25, low: 58, color: '#38CE3C' }, // green (up)
                            { day: 'Wed', open: 50, close: 40, high: 30, low: 62, color: '#ef4444' }, // red
                            { day: 'Thu', open: 42, close: 58, high: 35, low: 65, color: '#38CE3C' }, // green
                            { day: 'Fri', open: 55, close: 62, high: 45, low: 68, color: '#38CE3C' }, // green
                            { day: 'Sat', open: 60, close: 52, high: 40, low: 70, color: '#ef4444' }, // red
                            { day: 'Sun', open: 50, close: 65, fillClose: 65, high: 38, low: 72, color: '#38CE3C' }  // green
                          ].map((candle, idx) => {
                            const x = 30 + idx * 40;
                            const bodyY = Math.min(candle.open, candle.close);
                            const bodyH = Math.abs(candle.open - candle.close);
                            return (
                              <g key={idx}>
                                {/* Wick (High to Low) */}
                                <line x1={x} y1={candle.high} x2={x} y2={candle.low} stroke={candle.color} strokeWidth="1.5" />
                                {/* Candle Body */}
                                <rect x={x - 6} y={bodyY} width="12" height={bodyH} fill={candle.color} rx="1" />
                                {/* Label */}
                                <text x={x} y="78" fill="var(--text-muted)" fontSize="7" textAnchor="middle">{candle.day}</text>
                              </g>
                            );
                          })}
                        </svg>
                      </div>

                      {/* Stepper progress */}
                      {selectedLoad && (
                        <div style={{ background: 'var(--surface-hover)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 12 }}>
                          <h4 style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Spot Matching Stepper ({selectedLoad.id})</h4>
                          
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', position: 'relative' }}>
                            <div style={{
                              position: 'absolute', top: '16px', left: '20px', right: '20px', height: '2px',
                              background: selectedLoad.status === 'matched' ? 'var(--success-500)' : 'var(--border-subtle)',
                              zIndex: 1
                            }} />

                            {[
                              { label: 'Posted', done: true },
                              { label: 'AI Scanned', done: true },
                              { label: 'Bids Recv', done: true },
                              { label: 'Negotiate', done: selectedLoad.status === 'matched' },
                              { label: 'Dispatched', done: selectedLoad.status === 'matched' }
                            ].map((step, idx) => (
                              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, gap: 4 }}>
                                <div style={{
                                  width: '24px', height: '24px', borderRadius: '50%',
                                  background: step.done ? 'var(--success-500)' : 'var(--bg-900)',
                                  border: `2px solid ${step.done ? 'var(--success-500)' : 'var(--border-subtle)'}`,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold', color: '#fff'
                                }}>
                                  {step.done ? '✓' : idx + 1}
                                </div>
                                <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>{step.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Inspector tabs & KPIs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {selectedLoad ? (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    
                    {/* Tab selector */}
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)' }}>
                      {['specs', 'bids', 'financials'].map(tab => (
                        <button
                          key={tab}
                          onClick={() => setActiveBrokerTab(tab)}
                          style={{
                            flex: 1, padding: '6px 0', background: 'transparent', border: 'none',
                            borderBottom: activeBrokerTab === tab ? '2px solid var(--primary-500)' : 'none',
                            color: activeBrokerTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                            fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer'
                          }}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Tab contents */}
                    {activeBrokerTab === 'specs' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '11px' }}>
                        <div style={{ display: 'flex', justify: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Cargo:</span>
                          <strong style={{ color: 'var(--text-primary)' }}>{selectedLoad.cargo}</strong>
                        </div>
                        <div style={{ display: 'flex', justify: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Total Weight:</span>
                          <span style={{ color: 'var(--text-primary)' }}>{selectedLoad.weight} Tons</span>
                        </div>
                        <div style={{ display: 'flex', justify: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Route corridor:</span>
                          <span style={{ color: 'var(--text-primary)' }}>{selectedLoad.route}</span>
                        </div>
                        <div style={{ display: 'flex', justify: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Spot Budget Target:</span>
                          <strong style={{ color: '#38CE3C' }}>₹{selectedLoad.budget.toLocaleString()}</strong>
                        </div>
                        {selectedLoad.status === 'matched' && (
                          <div style={{
                            background: 'var(--success-bg)', border: '1px solid rgba(56, 206, 60, 0.2)',
                            padding: 8, borderRadius: 4, marginTop: 4, color: '#38CE3C', fontWeight: 600, fontSize: '10px'
                          }}>
                            🤝 Matched Carrier Node: {selectedLoad.matchedCarrier}
                          </div>
                        )}
                        {selectedLoad.status === 'open' && (
                          <button
                            type="button"
                            onClick={() => handleCancelLoad(selectedLoad.id)}
                            style={{
                              background: 'var(--bg-800)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)',
                              borderRadius: 4, padding: '8px 0', fontSize: '10px', fontWeight: 700, cursor: 'pointer', marginTop: 6
                            }}
                          >
                            Cancel Spot Post
                          </button>
                        )}
                      </div>
                    )}

                    {activeBrokerTab === 'bids' && (() => {
                      const bids = brokerBids.filter(b => b.loadId === selectedLoad.id);
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Carrier Offers ({bids.length})</span>
                            {selectedLoad.status === 'open' && (
                              <button
                                onClick={() => handleTriggerBidWar(selectedLoad.id)}
                                style={{
                                  background: 'rgba(236,72,153,0.1)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.2)',
                                  borderRadius: 4, padding: '2px 6px', fontSize: '8px', fontWeight: 800, cursor: 'pointer'
                                }}
                              >
                                Trigger Bid War
                              </button>
                            )}
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', maxHeight: '160px' }}>
                            {bids.map(b => (
                              <div key={b.id} style={{
                                background: b.status === 'accepted' ? 'var(--success-bg)' : b.status === 'rejected' ? 'rgba(255,77,107,0.02)' : 'var(--bg-800)',
                                border: `1px solid ${b.status === 'accepted' ? '#38CE3C' : 'var(--border-subtle)'}`,
                                borderRadius: 6, padding: '8px 10px', display: 'flex', justify: 'space-between', alignItems: 'center', fontSize: '10px'
                              }}>
                                <div>
                                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{b.carrier} (★{b.rating})</div>
                                  <div style={{ color: 'var(--text-muted)', fontSize: '8.5px' }}>Vehicle: {b.truck}</div>
                                </div>
                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                                  <div style={{ fontWeight: 800, color: b.price <= selectedLoad.budget ? '#38CE3C' : '#f59e0b' }}>
                                    ₹{b.price.toLocaleString()}
                                  </div>
                                  {b.status === 'pending' && selectedLoad.status === 'open' && (
                                    <button
                                      type="button"
                                      onClick={() => handleAcceptBid(selectedLoad.id, b.id)}
                                      style={{
                                        background: 'var(--primary-500)', border: 'none', color: '#fff',
                                        borderRadius: 4, padding: '4px 8px', fontSize: '8.5px', fontWeight: 700, cursor: 'pointer'
                                      }}
                                    >
                                      Accept Bid
                                    </button>
                                  )}
                                  {b.status !== 'pending' && (
                                    <span style={{
                                      fontSize: '8px', fontWeight: 800, textTransform: 'uppercase',
                                      color: b.status === 'accepted' ? '#38CE3C' : 'var(--text-muted)'
                                    }}>{b.status}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                            {bids.length === 0 && (
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
                                {selectedLoad.status === 'cancelled' ? "Load has been cancelled." : "Waiting for carrier bids..."}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {activeBrokerTab === 'financials' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4 }}>
                          <span style={{ color: 'var(--text-muted)' }}>ALLOCATION</span>
                          <span style={{ color: 'var(--text-muted)' }}>PERCENT / VALUE</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Carrier Net Payout</span>
                          <span style={{ color: 'var(--text-primary)' }}>75% (₹{Math.floor(selectedLoad.budget * 0.75).toLocaleString()})</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>GatiFleet Broker Commission</span>
                          <span style={{ color: 'var(--text-primary)' }}>12% (₹{Math.floor(selectedLoad.budget * 0.12).toLocaleString()})</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>FASTag Tolls Buffer Reserve</span>
                          <span style={{ color: 'var(--text-primary)' }}>5% (₹{Math.floor(selectedLoad.budget * 0.05).toLocaleString()})</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4 }}>
                          <span>Integrated IGST compliance tax</span>
                          <span style={{ color: 'var(--text-primary)' }}>8% (₹{Math.floor(selectedLoad.budget * 0.08).toLocaleString()})</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Escrow status:</span>
                          <span style={{
                            fontWeight: 800, fontSize: '9px', padding: '2px 6px', borderRadius: 4,
                            background: selectedLoad.status === 'matched' ? 'var(--success-bg)' : 'rgba(255,255,255,0.05)',
                            color: selectedLoad.status === 'matched' ? '#38CE3C' : 'var(--text-muted)'
                          }}>
                            {selectedLoad.status === 'matched' ? 'ESCROW RELEASED' : 'LOCKED IN ESCROW'}
                          </span>
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                    Select a spot load from the left column.
                  </div>
                )}

                {/* Performance Metrics */}
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
                  flexDirection: 'column', gap: 12
                }}>
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--text-primary)' }}>Broker Performance Matrix</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Spot Loads Posted:</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{brokerKPIs.postedCount} Units</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Spot Loads Closed:</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{brokerKPIs.closedCount} Units</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Spot Conversion Rate:</span>
                      <span style={{ color: '#38CE3C', fontWeight: 600 }}>{brokerKPIs.conversionRate}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Avg Match Latency:</span>
                      <span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>{brokerKPIs.avgMatchTime} Hours</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Average Budget Savings:</span>
                      <span style={{ color: '#38CE3C', fontWeight: 600 }}>{brokerKPIs.avgSavings}%</span>
                    </div>
                  </div>
                </div>

                {/* Operations Console */}
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
                  flexDirection: 'column', gap: 10
                }}>
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--text-primary)' }}>Broker Operations Console</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button onClick={handleAutoMatchBids} style={{
                      background: 'var(--gradient-primary)', border: 'none', color: '#fff',
                      borderRadius: 4, padding: '8px 12px', fontSize: '10px', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justify: 'center', gap: 6, boxShadow: 'var(--shadow-glow)'
                    }}>
                      <Sparkles size={12} />
                      <span>Run AI Spot Auto-Matcher</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          );
        })()}


        {/* ==================== LAYER 6: WAREHOUSE PORTAL ==================== */}
        {activePortal === 'warehouse' && (() => {
          const filteredBays = warehouseBays.filter(b => {
            const matchesSearch = b.id.toLowerCase().includes(warehouseSearchQuery.toLowerCase()) ||
                                  (b.truck && b.truck.toLowerCase().includes(warehouseSearchQuery.toLowerCase())) ||
                                  b.type.toLowerCase().includes(warehouseSearchQuery.toLowerCase());
            const matchesStatus = warehouseStatusFilter === 'all' || b.status === warehouseStatusFilter;
            return matchesSearch && matchesStatus;
          });

          const selectedBay = warehouseBays.find(b => b.id === selectedBayId) || warehouseBays[0];

          return (
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 340px', gap: 'var(--space-6)' }}>
              
              {/* Left Column: Bays List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--text-primary)' }}>Dock Door Bays ({filteredBays.length})</h3>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Monitor load status and dwell times at the warehouse bays.</p>
                </div>

                <div style={{ display: 'flex', background: 'var(--bg-900)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '6px 12px', alignItems: 'center', gap: 6 }}>
                  <Search size={14} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="Search bay number, truck ID..."
                    value={warehouseSearchQuery}
                    onChange={e => setWarehouseSearchQuery(e.target.value)}
                    style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '11px', width: '100%' }}
                  />
                </div>

                {/* Filter pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {['all', 'active', 'loading', 'waiting', 'maintenance'].map(status => (
                    <button
                      key={status}
                      onClick={() => setWarehouseStatusFilter(status)}
                      style={{
                        padding: '3px 8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)',
                        fontSize: '8px', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase',
                        background: warehouseStatusFilter === status ? 'var(--primary-500)' : 'transparent',
                        color: warehouseStatusFilter === status ? '#fff' : 'var(--text-secondary)'
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                {/* Bays list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', maxHeight: '360px', paddingRight: 4 }}>
                  {filteredBays.map(bay => {
                    const isSelected = selectedBayId === bay.id;
                    return (
                      <div
                        key={bay.id}
                        onClick={() => setSelectedBayId(bay.id)}
                        style={{
                          ...listItemStyle,
                          border: isSelected ? '1px solid var(--primary-500)' : '1px solid var(--border-subtle)',
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(99,102,241,0.05)' : 'var(--bg-800)',
                          boxShadow: isSelected ? 'var(--shadow-glow)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '12px' }}>{bay.id}</span>
                              <span style={{
                                fontSize: '8px', fontWeight: 800, padding: '2px 6px', borderRadius: 4,
                                background: bay.status === 'active' ? 'var(--success-bg)' : bay.status === 'loading' ? 'rgba(99,102,241,0.1)' : bay.status === 'maintenance' ? 'var(--danger-bg)' : 'rgba(255,255,255,0.05)',
                                color: bay.status === 'active' ? 'var(--success-500)' : bay.status === 'loading' ? '#818cf8' : bay.status === 'maintenance' ? 'var(--danger-500)' : 'var(--text-muted)'
                              }}>
                                {bay.status.toUpperCase()}
                              </span>
                            </div>
                            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: 4 }}>
                              Truck: <span style={{ fontWeight: 600 }}>{bay.truck || 'AVAILABLE'}</span> | Type: {bay.type}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary-400)' }}>{bay.dwell} hrs</div>
                            {bay.progress > 0 && <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{bay.progress}% loaded</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Center Column: Dock SVG & Forklift route visualizer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                
                {/* SVG Dock door layout */}
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 2, color: 'var(--text-primary)' }}>Warehouse Dock Visualizer</h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 12 }}>Click any dock door bay to inspect details or run operations.</p>
                  
                  <div style={{
                    background: 'var(--bg-900)', border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)', padding: '16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <svg width="100%" height="130" viewBox="0 0 460 130" style={{ overflow: 'visible' }}>
                      {/* Warehouse wall backdrop */}
                      <rect x="10" y="10" width="440" height="90" rx="6" fill="none" stroke="var(--border-subtle)" strokeWidth="1.5" strokeDasharray="3,3" />
                      <text x="230" y="24" fill="var(--text-muted)" fontSize="8" textAnchor="middle" letterSpacing="0.1em" fontWeight="bold">DEPOT INNER ZONE (SECURITY CLEARANCE ONLY)</text>
                      
                      {/* Render 6 clickable Bays */}
                      {warehouseBays.map((bay, idx) => {
                        const isSelected = selectedBayId === bay.id;
                        const x = 20 + idx * 72;
                        const y = 35;
                        const w = 60;
                        const h = 55;
                        
                        let fillColor = 'rgba(255,255,255,0.01)';
                        let strokeColor = 'var(--border-subtle)';
                        let activeDot = null;
                        
                        if (bay.status === 'active') {
                          fillColor = 'rgba(56, 206, 60, 0.1)';
                          strokeColor = '#38CE3C';
                          activeDot = '#38CE3C';
                        } else if (bay.status === 'loading') {
                          fillColor = 'rgba(99, 102, 241, 0.1)';
                          strokeColor = '#818cf8';
                          activeDot = '#818cf8';
                        } else if (bay.status === 'waiting') {
                          fillColor = 'rgba(255, 222, 115, 0.08)';
                          strokeColor = '#FFDE73';
                        } else if (bay.status === 'maintenance') {
                          fillColor = 'rgba(255, 77, 107, 0.08)';
                          strokeColor = '#FF4D6B';
                        }
                        
                        return (
                          <g key={bay.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedBayId(bay.id)}>
                            <rect
                              x={x} y={y} width={w} height={h} rx="4"
                              fill={fillColor}
                              stroke={isSelected ? '#6366f1' : strokeColor}
                              strokeWidth={isSelected ? 2.5 : 1.5}
                              style={{ transition: 'all 0.2s' }}
                            />
                            {activeDot && (
                              <circle cx={x + 30} cy={y + 12} r="3" fill={activeDot} className="animate-pulse" />
                            )}
                            <text x={x + 30} y={y + 26} fill="var(--text-primary)" fontSize="9" fontWeight="bold" textAnchor="middle">{bay.id}</text>
                            <text x={x + 30} y={y + 38} fill="var(--text-muted)" fontSize="7" textAnchor="middle">
                              {bay.truck ? bay.truck : 'AVAILABLE'}
                            </text>
                            {bay.progress > 0 && (
                              <rect x={x + 10} y={y + 44} width="40" height="3" rx="1.5" fill="rgba(255,255,255,0.05)">
                                <rect x={x + 10} y={y + 44} width={40 * (bay.progress / 100)} height="3" rx="1.5" fill={strokeColor} />
                              </rect>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* 2D Forklift Routing Floor Plan SVG */}
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 2, color: 'var(--text-primary)' }}>Forklift Staging & Corridor Routing</h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 12 }}>Visualizes automated forklift corridors routing pallet stock to the selected bay door.</p>

                  <div style={{
                    background: 'var(--bg-900)', border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)', padding: '16px 8px', display: 'flex', justifyContent: 'center'
                  }}>
                    <svg width="100%" height="150" viewBox="0 0 460 150" style={{ overflow: 'visible' }}>
                      {/* Grid overlay */}
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.8" />
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#grid)" />

                      {/* Storage Racks */}
                      {[
                        { x: 30, y: 20, w: 100, h: 25, label: 'Rack A (Industrial)' },
                        { x: 30, y: 65, w: 100, h: 25, label: 'Rack B (Electronics)' },
                        { x: 30, y: 110, w: 100, h: 25, label: 'Rack C (Chemicals)' }
                      ].map((rack, idx) => (
                        <g key={idx}>
                          <rect x={rack.x} y={rack.y} width={rack.w} height={rack.h} rx="4" fill="rgba(255,255,255,0.02)" stroke="var(--border-subtle)" strokeWidth="1" />
                          <text x={rack.x + rack.w / 2} y={rack.y + 15} fill="var(--text-muted)" fontSize="7.5" textAnchor="middle">{rack.label}</text>
                        </g>
                      ))}

                      {/* Selected Bay connection */}
                      {(() => {
                        const bayIdx = warehouseBays.findIndex(b => b.id === selectedBayId);
                        const bayX = 230 + (bayIdx !== -1 ? bayIdx : 0) * 36;
                        const bayY = 135;
                        
                        // Forklift route path
                        const dPath = `M 130,32 L 180,32 L 180,95 L ${bayX},95 L ${bayX},130`;

                        const isLoadingActive = selectedBay && (selectedBay.status === 'active' || selectedBay.status === 'loading');

                        return (
                          <g>
                            {/* Route Line */}
                            <path d={dPath} fill="none" stroke={isLoadingActive ? '#06b6d4' : 'var(--border-subtle)'} strokeWidth="2" strokeDasharray="3,3" />
                            
                            {/* Forklift Dot */}
                            {isLoadingActive ? (
                              <g>
                                <circle r="4" fill="#06b6d4" style={{ filter: 'drop-shadow(0 0 4px #06b6d4)' }}>
                                  <animateMotion dur="3s" repeatCount="indefinite" path={dPath} />
                                </circle>
                                <circle r="6" fill="rgba(6,182,212,0.2)">
                                  <animateMotion dur="3s" repeatCount="indefinite" path={dPath} />
                                </circle>
                              </g>
                            ) : (
                              <circle cx="130" cy="32" r="4.5" fill="var(--text-muted)" />
                            )}
                          </g>
                        );
                      })()}

                      {/* Corridor labels */}
                      <rect x="195" y="60" width="80" height="15" rx="3" fill="var(--bg-800)" stroke="var(--border-subtle)" strokeWidth="0.8" />
                      <text x="235" y="70" fill="var(--text-secondary)" fontSize="7" fontWeight="bold" textAnchor="middle">MAIN FORKLIFT LANE</text>
                    </svg>
                  </div>
                </div>

              </div>

              {/* Right Column: Tabbed operations & KPIs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {selectedBay ? (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    
                    {/* Tab Selector */}
                    <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)' }}>
                      {['dock', 'manifest', 'roster'].map(tab => (
                        <button
                          key={tab}
                          onClick={() => setActiveWarehouseTab(tab)}
                          style={{
                            flex: 1, padding: '6px 0', background: 'transparent', border: 'none',
                            borderBottom: activeWarehouseTab === tab ? '2px solid var(--primary-500)' : 'none',
                            color: activeWarehouseTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                            fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer'
                          }}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Tab contents */}
                    {activeWarehouseTab === 'dock' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '11px' }}>
                        <div style={{ display: 'flex', justify: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Bay Slot:</span>
                          <strong style={{ color: 'var(--text-primary)' }}>{selectedBay.id}</strong>
                        </div>
                        <div style={{ display: 'flex', justify: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{selectedBay.status.toUpperCase()}</span>
                        </div>
                        
                        {selectedBay.truck ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                            <div style={{ display: 'flex', justify: 'space-between' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Docked Truck:</span>
                              <span style={{ color: 'var(--text-primary)' }}>{selectedBay.truck} ({selectedBay.carrier})</span>
                            </div>
                            <div style={{ display: 'flex', justify: 'space-between' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Cargo type:</span>
                              <span style={{ color: 'var(--text-primary)' }}>{selectedBay.type}</span>
                            </div>
                            <div style={{ display: 'flex', justify: 'space-between' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Dwell Duration:</span>
                              <span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>{selectedBay.dwell} hrs</span>
                            </div>

                            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                              {selectedBay.status === 'loading' && (
                                <button onClick={() => handleStartLoading(selectedBay.id)} style={{
                                  flex: 1, background: 'var(--primary-500)', border: 'none', color: '#fff',
                                  borderRadius: 4, padding: '8px 12px', fontSize: '10px', fontWeight: 700, cursor: 'pointer'
                                }}>Start Loading</button>
                              )}
                              {selectedBay.status === 'active' && (
                                <button onClick={() => handleGateOut(selectedBay.id)} style={{
                                  flex: 1, background: 'var(--gradient-primary)', border: 'none', color: '#fff',
                                  borderRadius: 4, padding: '8px 12px', fontSize: '10px', fontWeight: 700, cursor: 'pointer'
                                }}>Complete Gate-Out</button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
                            <span style={{ color: 'var(--text-muted)' }}>No truck parked at this door. Select a waitlisted trailer from the yard queue to begin docking.</span>
                            
                            {yardQueue.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <label style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600 }}>SELECT YARD TRAILER</label>
                                <select
                                  value={selectedYardTruckId}
                                  onChange={e => setSelectedYardTruckId(e.target.value)}
                                  style={{
                                    background: 'var(--bg-900)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)',
                                    padding: '6px 12px', borderRadius: 4, width: '100%', fontSize: '11px', outline: 'none'
                                  }}
                                >
                                  {yardQueue.map(t => (
                                    <option key={t.id} value={t.id}>{t.id} - {t.carrier} ({t.cargo})</option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => handleDockTrailer(selectedBay.id, selectedYardTruckId || (yardQueue[0] && yardQueue[0].id))}
                                  style={{
                                    background: 'var(--primary-500)', border: 'none', color: '#fff',
                                    borderRadius: 4, padding: '8px 12px', fontSize: '10px', fontWeight: 700, cursor: 'pointer', marginTop: 4
                                  }}
                                >
                                  Dock Trailer at {selectedBay.id}
                                </button>
                              </div>
                            ) : (
                              <span style={{ color: '#38CE3C', fontWeight: 600 }}>🟢 All yard staging lines are cleared.</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {activeWarehouseTab === 'manifest' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '10px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>Manifest Checklist</span>
                        
                        {[
                          { label: 'CCTV scan container seal integrity', checked: true },
                          { label: 'Match manifest details to E-Way bill', checked: true },
                          { label: 'Recalibrate axle weights sensor node', checked: selectedBay.status === 'active' },
                          { label: 'Load cargo palettes (Forklift route)', checked: selectedBay.status === 'active' },
                          { label: 'Apply heavy transit security bolt seal', checked: false }
                        ].map((item, idx) => (
                          <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                            <input type="checkbox" defaultChecked={item.checked} style={{ accentColor: 'var(--primary-500)' }} />
                            <span>{item.label}</span>
                          </label>
                        ))}

                        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 8, marginTop: 4 }}>
                          <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>WH SECURITY TELEMETRY SENSORS</span>
                          <div style={{ display: 'flex', justify: 'space-between', marginBottom: 4 }}>
                            <span>Dock CCTV status:</span>
                            <span style={{ color: '#38CE3C', fontWeight: 600 }}>CONNECTED (LIVE)</span>
                          </div>
                          <div style={{ display: 'flex', justify: 'space-between', marginBottom: 4 }}>
                            <span>Depot Temp sensor:</span>
                            <span style={{ color: '#38CE3C', fontWeight: 600 }}>2.8 °C (Cold Chain)</span>
                          </div>
                          <div style={{ display: 'flex', justify: 'space-between' }}>
                            <span>Security Door status:</span>
                            <span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>SECURE / LOCKED</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeWarehouseTab === 'roster' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '11px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>depot Labor roster</span>
                        
                        <div style={{ display: 'flex', justify: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Assigned loaders:</span>
                          <strong style={{ color: 'var(--text-primary)' }}>{depotKPIs.shiftStrength} Loaders</strong>
                        </div>
                        <div style={{ display: 'flex', justify: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Active Shift Foreman:</span>
                          <span style={{ color: 'var(--text-primary)' }}>H. R. Verma</span>
                        </div>
                        <div style={{ display: 'flex', justify: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Workforce attendance:</span>
                          <span style={{ color: '#38CE3C', fontWeight: 600 }}>100% Present</span>
                        </div>
                        <div style={{ display: 'flex', justify: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Labor Productivity:</span>
                          <span style={{ color: '#38CE3C', fontWeight: 600 }}>{depotKPIs.laborProductivity}%</span>
                        </div>
                        <div style={{ display: 'flex', justify: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Overtime Bonus active:</span>
                          <span style={{ color: depotKPIs.shiftOvertimeActive ? '#38CE3C' : 'var(--text-muted)', fontWeight: 600 }}>
                            {depotKPIs.shiftOvertimeActive ? 'YES (+15% speed)' : 'NO'}
                          </span>
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                    Select a dock bay from the left column.
                  </div>
                )}

                {/* Performance Metrics */}
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
                  flexDirection: 'column', gap: 12
                }}>
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--text-primary)' }}>Depot Performance Index</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Inbound Plazas queue:</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{depotKPIs.inboundCount} Trucks</span>
                    </div>
                    <div style={{ display: 'flex', justify: 'space-between' }}>
                      <span>Outbound manifests queue:</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{depotKPIs.outboundCount} Trucks</span>
                    </div>
                    <div style={{ display: 'flex', justify: 'space-between' }}>
                      <span>Average Dock Dwell Time:</span>
                      <span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>{depotKPIs.avgDwellTime} Hours</span>
                    </div>
                    <div style={{ display: 'flex', justify: 'space-between' }}>
                      <span>Storage Volume Util:</span>
                      <span style={{ color: '#38CE3C', fontWeight: 600 }}>{depotKPIs.storageUtilization}%</span>
                    </div>
                  </div>
                </div>

                {/* Operations Console */}
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
                  flexDirection: 'column', gap: 10
                }}>
                  <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--text-primary)' }}>Ecosystem Operations Console</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button onClick={handleSimulateGateIn} style={{
                      background: 'var(--bg-800)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)',
                      borderRadius: 4, padding: '8px 12px', fontSize: '10px', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justify: 'center', gap: 6
                    }}>
                      <span>Simulate Inbound Gate-In</span>
                    </button>
                    
                    <button onClick={handleToggleOvertime} style={{
                      background: depotKPIs.shiftOvertimeActive ? 'rgba(56, 206, 60, 0.15)' : 'var(--bg-800)',
                      border: `1px solid ${depotKPIs.shiftOvertimeActive ? '#38CE3C' : 'var(--border-subtle)'}`,
                      color: depotKPIs.shiftOvertimeActive ? '#38CE3C' : 'var(--text-primary)',
                      borderRadius: 4, padding: '8px 12px', fontSize: '10px', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justify: 'center', gap: 6
                    }}>
                      <span>{depotKPIs.shiftOvertimeActive ? "Deactivate Shift Overtime" : "Call Loaders Overtime"}</span>
                    </button>

                    <button onClick={handleAutoOptimizeDocks} style={{
                      background: 'var(--gradient-primary)', border: 'none', color: '#fff',
                      borderRadius: 4, padding: '8px 12px', fontSize: '10px', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justify: 'center', gap: 6, boxShadow: 'var(--shadow-glow)'
                    }}>
                      <Sparkles size={12} />
                      <span>Run AI Dock Optimization</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          );
        })()}

      </div>
      {/* ==================== BOTTOM MODULE: UNIFIED EVENT STREAM & AUTOPILOT ==================== */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
        
        {/* Autopilot Autonomy Control Console */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
          flexDirection: 'column', gap: 10
        }}>
          <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Bot size={14} color="var(--primary-400)" />
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Agent Autopilot Autonomy</h3>
            </div>
            <span style={{ fontSize: '8px', background: 'rgba(99,102,241,0.15)', color: 'var(--primary-400)', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>TIOS L10</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Autonomous Load Dispatching (L9)</span>
              <button
                onClick={() => setAutonomySettings(prev => ({ ...prev, autoDispatch: !prev.autoDispatch }))}
                style={{
                  background: autonomySettings.autoDispatch ? 'rgba(56, 206, 60, 0.15)' : 'var(--bg-800)',
                  border: `1px solid ${autonomySettings.autoDispatch ? '#38CE3C' : 'var(--border-subtle)'}`,
                  color: autonomySettings.autoDispatch ? '#38CE3C' : 'var(--text-primary)',
                  borderRadius: 4, padding: '2px 8px', fontSize: '9px', fontWeight: 700, cursor: 'pointer'
                }}
              >
                {autonomySettings.autoDispatch ? "AUTOPILOT" : "MANUAL"}
              </button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Auto-Negotiation & Carrier Bidding (L8)</span>
              <button
                onClick={() => setAutonomySettings(prev => ({ ...prev, autoBidding: !prev.autoBidding }))}
                style={{
                  background: autonomySettings.autoBidding ? 'rgba(56, 206, 60, 0.15)' : 'var(--bg-800)',
                  border: `1px solid ${autonomySettings.autoBidding ? '#38CE3C' : 'var(--border-subtle)'}`,
                  color: autonomySettings.autoBidding ? '#38CE3C' : 'var(--text-primary)',
                  borderRadius: 4, padding: '2px 8px', fontSize: '9px', fontWeight: 700, cursor: 'pointer'
                }}
              >
                {autonomySettings.autoBidding ? "AUTOPILOT" : "MANUAL"}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Auto-Authorize Maintenance (L7)</span>
              <button
                onClick={() => setAutonomySettings(prev => ({ ...prev, autoMaintenance: !prev.autoMaintenance }))}
                style={{
                  background: autonomySettings.autoMaintenance ? 'rgba(56, 206, 60, 0.15)' : 'var(--bg-800)',
                  border: `1px solid ${autonomySettings.autoMaintenance ? '#38CE3C' : 'var(--border-subtle)'}`,
                  color: autonomySettings.autoMaintenance ? '#38CE3C' : 'var(--text-primary)',
                  borderRadius: 4, padding: '2px 8px', fontSize: '9px', fontWeight: 700, cursor: 'pointer'
                }}
              >
                {autonomySettings.autoMaintenance ? "AUTOPILOT" : "MANUAL"}
              </button>
            </div>
          </div>
          
          {/* Autopilot Reasoning Mini Logs */}
          <div style={{
            background: 'var(--bg-900)', border: '1px solid var(--border-subtle)',
            borderRadius: 4, padding: '6px 8px', fontSize: '9px', fontFamily: 'var(--font-mono)',
            height: '45px', overflowY: 'auto', color: 'var(--primary-300)', display: 'flex', flexDirection: 'column', gap: 4
          }}>
            {autopilotReasoning.map((log, idx) => (
              <div key={idx} style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                <span style={{ color: 'var(--text-muted)' }}>[{log.time}]</span> <span style={{ fontWeight: 'bold' }}>{log.agent}:</span> {log.action} - {log.reason}
              </div>
            ))}
          </div>
        </div>

        {/* Unified Event Stream Ledger */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
          flexDirection: 'column', gap: 10
        }}>
          <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={14} color="#38CE3C" className="animate-pulse" />
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Unified Ecosystem Event Stream Ledger</h3>
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Updates GatiFleet Knowledge Graph & AI Agents immediately</span>
          </div>

          {/* Console logs */}
          <div style={{
            background: '#040711', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)', padding: 12, fontFamily: 'var(--font-mono)',
            fontSize: '11px', display: 'flex', flexDirection: 'column', gap: 6,
            height: '110px', overflowY: 'auto', color: '#38CE3C'
          }}>
            {eventStream.map(e => (
              <div key={e.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>[{e.time}]</span>
                <span style={{
                  color: e.tag.includes('SAFETY') || e.tag.includes('danger') ? 'var(--danger-500)' : 'var(--primary-400)',
                  fontWeight: 700, flexShrink: 0
                }}>[{e.tag}]</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600, flexShrink: 0 }}>{e.event}:</span>
                <span style={{ color: '#38CE3C' }}>{e.desc}</span>
              </div>
            ))}
            <div ref={streamEndRef} />
          </div>
        </div>

      </div>

      {/* ==================== BOOKING MODAL ==================== */}
      {bookingOpen && (
        <div style={{
          position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, zIndex: 10000,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex',
          alignItems: 'center', justify: 'center', overflowY: 'auto', padding: '20px'
        }}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              background: 'var(--surface-solid)', border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-lg)', width: '920px', maxWidth: '95vw', padding: 'var(--space-5)',
              boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column', gap: 14,
              color: 'var(--text-primary)', maxHeight: '90vh', overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10 }}>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Zap size={16} color="var(--primary-400)" /> Indian Subcontinent Direct Freight Booking Engine
              </h3>
              <button onClick={() => setBookingOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={16} color="var(--text-muted)" />
              </button>
            </div>

            <form onSubmit={handleBookShipment} style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {/* Honeypot field trap */}
              <input
                type="text"
                name="website_url"
                value={bookingForm.website_url || ''}
                onChange={e => setBookingForm(prev => ({ ...prev, website_url: e.target.value }))}
                style={{ display: 'none' }}
                tabIndex="-1"
                autoComplete="off"
              />
              {/* Left Column: Address Panels */}
              <div style={{ flex: '1.2 1 480px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                
                {/* Sender Address Block */}
                <div style={{
                  background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)', padding: 12, display: 'flex', flexDirection: 'column', gap: 8
                }}>
                  <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase' }}>1. Sender Details (Origin Address)</span>
                    <button
                      type="button"
                      onClick={() => { setMapDestinationTarget('sender'); showToast("Click on a hub in the Live Map to fill Sender details", "info"); }}
                      style={{ fontSize: '9px', color: 'var(--primary-400)', display: 'flex', alignItems: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      📍 Auto-Fill from Map
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={modalLabelStyle}>Sender Name / Company</label>
                      <input
                        type="text"
                        value={bookingForm.senderName}
                        onChange={e => setBookingForm(prev => ({ ...prev, senderName: e.target.value }))}
                        placeholder="Company Name"
                        style={formInputStyle}
                        required
                      />
                    </div>
                    <div>
                      <label style={modalLabelStyle}>Sender Contact Phone</label>
                      <input
                        type="tel"
                        pattern="[6-9][0-9]{9}"
                        maxLength={10}
                        value={bookingForm.senderPhone}
                        onChange={e => setBookingForm(prev => ({ ...prev, senderPhone: e.target.value.replace(/\D/g, '') }))}
                        placeholder="10-digit Phone"
                        style={formInputStyle}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label style={modalLabelStyle}>Street Address (Hub / Gate / Landmark)</label>
                    <input
                      type="text"
                      value={bookingForm.senderStreet}
                      onChange={e => setBookingForm(prev => ({ ...prev, senderStreet: e.target.value }))}
                      placeholder="e.g. Plot No 12, GIDC Industrial Complex"
                      style={formInputStyle}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 0.8fr', gap: 8 }}>
                    <div>
                      <label style={modalLabelStyle}>State / UT</label>
                      <select
                        value={bookingForm.senderState}
                        onChange={e => setBookingForm(prev => ({ ...prev, senderState: e.target.value, senderDistrict: (STATE_DISTRICTS[e.target.value] || [''])[0] }))}
                        style={formInputStyle}
                      >
                        {STATES_AND_UTS.map(st => (
                          <option key={st} value={st} style={{ color: 'var(--text-primary)', background: 'var(--bg-800)' }}>{st}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={modalLabelStyle}>District (800+ Dynamic)</label>
                      <input
                        type="text"
                        list="sender-districts"
                        value={bookingForm.senderDistrict}
                        onChange={e => setBookingForm(prev => ({ ...prev, senderDistrict: e.target.value }))}
                        placeholder="Type district"
                        style={formInputStyle}
                        required
                      />
                      <datalist id="sender-districts">
                        {(STATE_DISTRICTS[bookingForm.senderState] || []).map(d => <option key={d} value={d} />)}
                      </datalist>
                    </div>
                    <div>
                      <label style={modalLabelStyle}>Pincode</label>
                      <input
                        type="text"
                        pattern="\d{6}"
                        maxLength={6}
                        value={bookingForm.senderPincode}
                        onChange={e => setBookingForm(prev => ({ ...prev, senderPincode: e.target.value.replace(/\D/g, '') }))}
                        placeholder="6-digit"
                        style={formInputStyle}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Receiver Address Block */}
                <div style={{
                  background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)', padding: 12, display: 'flex', flexDirection: 'column', gap: 8
                }}>
                  <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', color: '#38CE3C', fontWeight: 800, textTransform: 'uppercase' }}>2. Receiver Details (Destination Address)</span>
                    <button
                      type="button"
                      onClick={() => { setMapDestinationTarget('receiver'); showToast("Click on a hub in the Live Map to fill Receiver details", "info"); }}
                      style={{ fontSize: '9px', color: 'var(--primary-400)', display: 'flex', alignItems: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      📍 Auto-Fill from Map
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={modalLabelStyle}>Receiver Name / Company</label>
                      <input
                        type="text"
                        value={bookingForm.receiverName}
                        onChange={e => setBookingForm(prev => ({ ...prev, receiverName: e.target.value }))}
                        placeholder="Company Name"
                        style={formInputStyle}
                        required
                      />
                    </div>
                    <div>
                      <label style={modalLabelStyle}>Receiver Contact Phone</label>
                      <input
                        type="tel"
                        pattern="[6-9][0-9]{9}"
                        maxLength={10}
                        value={bookingForm.receiverPhone}
                        onChange={e => setBookingForm(prev => ({ ...prev, receiverPhone: e.target.value.replace(/\D/g, '') }))}
                        placeholder="10-digit Phone"
                        style={formInputStyle}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label style={modalLabelStyle}>Street Address (Factory / Warehouse / Gate)</label>
                    <input
                      type="text"
                      value={bookingForm.receiverStreet}
                      onChange={e => setBookingForm(prev => ({ ...prev, receiverStreet: e.target.value }))}
                      placeholder="e.g. Gate 4, Container Depot Terminal"
                      style={formInputStyle}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 0.8fr', gap: 8 }}>
                    <div>
                      <label style={modalLabelStyle}>State / UT</label>
                      <select
                        value={bookingForm.receiverState}
                        onChange={e => setBookingForm(prev => ({ ...prev, receiverState: e.target.value, receiverDistrict: (STATE_DISTRICTS[e.target.value] || [''])[0] }))}
                        style={formInputStyle}
                      >
                        {STATES_AND_UTS.map(st => (
                          <option key={st} value={st} style={{ color: 'var(--text-primary)', background: 'var(--bg-800)' }}>{st}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={modalLabelStyle}>District (800+ Dynamic)</label>
                      <input
                        type="text"
                        list="receiver-districts"
                        value={bookingForm.receiverDistrict}
                        onChange={e => setBookingForm(prev => ({ ...prev, receiverDistrict: e.target.value }))}
                        placeholder="Type district"
                        style={formInputStyle}
                        required
                      />
                      <datalist id="receiver-districts">
                        {(STATE_DISTRICTS[bookingForm.receiverState] || []).map(d => <option key={d} value={d} />)}
                      </datalist>
                    </div>
                    <div>
                      <label style={modalLabelStyle}>Pincode</label>
                      <input
                        type="text"
                        pattern="\d{6}"
                        maxLength={6}
                        value={bookingForm.receiverPincode}
                        onChange={e => setBookingForm(prev => ({ ...prev, receiverPincode: e.target.value.replace(/\D/g, '') }))}
                        placeholder="6-digit"
                        style={formInputStyle}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Date Selection */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 10, alignItems: 'center' }}>
                  <div>
                    <label style={modalLabelStyle}>Planned Dispatch Date & Time</label>
                    <input
                      type="datetime-local"
                      value={bookingForm.pickupTime}
                      onChange={e => setBookingForm(prev => ({ ...prev, pickupTime: e.target.value }))}
                      style={formInputStyle}
                      required
                    />
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', lineHeight: 1.4, paddingLeft: 4 }}>
                    <span style={{ color: '#818cf8', fontWeight: 700 }}>AI Scheduling Tip:</span> Avoid Monday morning slots near Western corridors to bypass highway congestion factors.
                  </div>
                </div>

              </div>

              {/* Right Column: Cargo, Cost & Map Picker */}
              <div style={{ flex: '1 1 360px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                
                {/* Weight & Value */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 10 }}>
                  <div>
                    <label style={modalLabelStyle}>Cargo Weight (Tonnes)</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={bookingForm.weight}
                      onChange={e => setBookingForm(prev => ({ ...prev, weight: parseInt(e.target.value) || 1 }))}
                      style={formInputStyle}
                    />
                  </div>
                  <div>
                    <label style={modalLabelStyle}>Declaring Cargo Value (₹)</label>
                    <input
                      type="number"
                      min="1"
                      value={bookingForm.value}
                      onChange={e => setBookingForm(prev => ({ ...prev, value: parseInt(e.target.value) || 0 }))}
                      style={formInputStyle}
                    />
                  </div>
                </div>

                {/* ─── Blinkit/Zepto-Style Address Picker ─── */}
                {(() => {
                  const filteredHubs = LOGISTICS_HUBS.filter(h =>
                    mapHubSearch === '' ||
                    h.name.toLowerCase().includes(mapHubSearch.toLowerCase()) ||
                    h.state.toLowerCase().includes(mapHubSearch.toLowerCase()) ||
                    h.district.toLowerCase().includes(mapHubSearch.toLowerCase()) ||
                    h.pincode.includes(mapHubSearch)
                  );
                  return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-900)' }}>
                  
                  {/* Header: Title + Sender/Receiver Pill Toggle */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 14px 8px', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.04)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '16px' }}>📍</span>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Select Logistics Hub</div>
                        <div style={{ fontSize: '8px', color: 'var(--text-muted)', marginTop: 1 }}>Auto-fill address from hub network</div>
                      </div>
                    </div>
                    <div style={{
                      display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: 2, gap: 2
                    }}>
                      <button type="button" onClick={() => setMapDestinationTarget('sender')} style={{
                        fontSize: '9px', padding: '4px 12px', borderRadius: 16, border: 'none', cursor: 'pointer', fontWeight: 700,
                        background: mapDestinationTarget === 'sender' ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'transparent',
                        color: mapDestinationTarget === 'sender' ? '#fff' : '#9ca3af',
                        boxShadow: mapDestinationTarget === 'sender' ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
                        transition: 'all 0.2s ease'
                      }}>⬆ Sender</button>
                      <button type="button" onClick={() => setMapDestinationTarget('receiver')} style={{
                        fontSize: '9px', padding: '4px 12px', borderRadius: 16, border: 'none', cursor: 'pointer', fontWeight: 700,
                        background: mapDestinationTarget === 'receiver' ? 'linear-gradient(135deg, #22c55e, #38CE3C)' : 'transparent',
                        color: mapDestinationTarget === 'receiver' ? '#fff' : '#9ca3af',
                        boxShadow: mapDestinationTarget === 'receiver' ? '0 2px 8px rgba(56,206,60,0.3)' : 'none',
                        transition: 'all 0.2s ease'
                      }}>⬇ Receiver</button>
                    </div>
                  </div>

                  {/* Search Bar + GPS Detect */}
                  <div style={{ display: 'flex', gap: 6, padding: '8px 12px', background: 'rgba(0,0,0,0.15)' }}>
                    <div style={{
                      flex: 1, display: 'flex', alignItems: 'center', gap: 8,
                      background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '7px 12px',
                      border: '1px solid rgba(255,255,255,0.06)', transition: 'border 0.2s'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <input
                        type="text"
                        value={mapHubSearch}
                        onChange={e => setMapHubSearch(e.target.value)}
                        placeholder="Search hubs, cities, pincodes..."
                        style={{
                          background: 'transparent', border: 'none', outline: 'none',
                          color: 'var(--text-primary)', fontSize: '11px', width: '100%', fontFamily: 'inherit'
                        }}
                      />
                      {mapHubSearch && (
                        <button type="button" onClick={() => setMapHubSearch('')} style={{
                          background: 'none', border: 'none', color: '#9ca3af', fontSize: '12px', cursor: 'pointer', padding: 0
                        }}>✕</button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={detectingLocation}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px',
                        background: detectingLocation ? 'rgba(99,102,241,0.15)' : 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.06))',
                        border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10,
                        color: '#818cf8', fontSize: '10px', fontWeight: 700, cursor: detectingLocation ? 'wait' : 'pointer',
                        whiteSpace: 'nowrap', transition: 'all 0.2s'
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{
                        animation: detectingLocation ? 'hubPulseRotate 1s linear infinite' : 'none'
                      }}>
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
                      </svg>
                      {detectingLocation ? 'Detecting...' : 'Use GPS'}
                    </button>
                  </div>

                  {/* Expanded Interactive Map */}
                  <div style={{
                    position: 'relative', height: 260, overflow: 'hidden',
                    background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(10,15,30,0.98) 100%)'
                  }}>
                    {/* Grid overlay */}
                    <div style={{
                      position: 'absolute', inset: 0, opacity: 0.03,
                      background: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px) 0 0/20px 20px, linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px) 0 0/20px 20px'
                    }} />
                    
                    {/* India Outline (simplified) */}
                    <svg width="100%" height="100%" viewBox="0 0 400 260" style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                      <defs>
                        <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="rgba(99,102,241,0.08)" />
                          <stop offset="100%" stopColor="rgba(99,102,241,0)" />
                        </radialGradient>
                        <filter id="hubGlow">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                      </defs>
                      <ellipse cx="200" cy="140" rx="160" ry="110" fill="url(#mapGlow)" />
                      
                      {/* India boundary path (simplified) */}
                      <path d="M175,18 L195,15 L215,22 L230,18 L240,28 L235,38 L250,35 L260,42 L275,48 L280,40 L295,45 L305,55 L315,68 L330,85 L335,100 L340,115 L332,125 L338,140 L330,155 L318,170 L305,180 L295,195 L280,205 L265,210 L250,218 L238,225 L225,230 L215,238 L205,240 L195,235 L188,225 L180,215 L170,210 L165,200 L155,195 L148,185 L138,180 L130,170 L120,155 L115,140 L108,125 L100,115 L95,100 L90,85 L95,72 L100,60 L110,50 L125,42 L140,35 L155,28 L165,22 Z" 
                        fill="rgba(99,102,241,0.03)" stroke="rgba(99,102,241,0.12)" strokeWidth="1" strokeDasharray="3,3" />

                      {/* Route connectivity lines between hubs */}
                      {filteredHubs.map((hub, i) => {
                        if (i === 0) return null;
                        const prev = filteredHubs[i - 1];
                        const x1 = Math.floor((prev.lng - 68) * (340 / 29) + 30);
                        const y1 = Math.floor((36 - prev.lat) * (210 / 28) + 20);
                        const x2 = Math.floor((hub.lng - 68) * (340 / 29) + 30);
                        const y2 = Math.floor((36 - hub.lat) * (210 / 28) + 20);
                        return (
                          <line key={`route-${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke="rgba(99,102,241,0.1)" strokeWidth="1" strokeDasharray="4,6">
                            <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="3s" repeatCount="indefinite" />
                          </line>
                        );
                      })}

                      {/* Hub markers */}
                      {filteredHubs.map(hub => {
                        const x = Math.floor((hub.lng - 68) * (340 / 29) + 30);
                        const y = Math.floor((36 - hub.lat) * (210 / 28) + 20);
                        const isSelectedSender = bookingForm.senderDistrict === hub.district && bookingForm.senderState === hub.state;
                        const isSelectedReceiver = bookingForm.receiverDistrict === hub.district && bookingForm.receiverState === hub.state;
                        const isSelected = isSelectedSender || isSelectedReceiver;
                        const isHovered = mapSelectedHub?.name === hub.name;
                        const markerColor = isSelectedSender ? '#6366f1' : isSelectedReceiver ? '#38CE3C' : isHovered ? '#f59e0b' : 'rgba(255,255,255,0.5)';

                        return (
                          <g key={hub.name} style={{ cursor: 'pointer' }} onClick={() => handleMapHubSelect(hub)}>
                            {/* Pulse ring for selected */}
                            {isSelected && (
                              <>
                                <circle cx={x} cy={y} r="16" fill="none" stroke={markerColor} strokeWidth="0.6" opacity="0.3">
                                  <animate attributeName="r" values="10;20;10" dur="2s" repeatCount="indefinite" />
                                  <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                                </circle>
                                <circle cx={x} cy={y} r="11" fill="none" stroke={markerColor} strokeWidth="0.8" opacity="0.5" />
                              </>
                            )}
                            {/* Hub dot */}
                            <circle cx={x} cy={y} r={isSelected ? 5 : isHovered ? 4.5 : 3.5}
                              fill={markerColor} filter={isSelected ? 'url(#hubGlow)' : 'none'} />
                            {/* Pin drop shape for selected */}
                            {isSelected && (
                              <path d={`M${x},${y - 6} L${x - 3},${y - 14} Q${x},${y - 18} ${x + 3},${y - 14} Z`}
                                fill={markerColor} opacity="0.8" />
                            )}
                            {/* Label */}
                            <text x={x} y={y - (isSelected ? 20 : 8)} fill="#fff" fontSize={isSelected ? '8' : '6.5'}
                              textAnchor="middle" fontWeight={isSelected ? '800' : '500'} style={{ pointerEvents: 'none' }}>
                              {hub.name.split(' ')[0]}
                            </text>
                            <text x={x} y={y + (isSelected ? 14 : 11)} fill="rgba(255,255,255,0.4)" fontSize="5"
                              textAnchor="middle" style={{ pointerEvents: 'none' }}>
                              {hub.pincode}
                            </text>
                          </g>
                        );
                      })}
                    </svg>

                    {/* Floating Selected Hub Card (Zomato-style bottom sheet) */}
                    {mapSelectedHub && (
                      <div style={{
                        position: 'absolute', bottom: 8, left: 8, right: 8, zIndex: 10,
                        background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(12px)',
                        borderRadius: 12, padding: '10px 14px',
                        border: '1px solid rgba(99,102,241,0.15)',
                        boxShadow: '0 -4px 24px rgba(0,0,0,0.4)',
                        display: 'flex', alignItems: 'center', gap: 10
                      }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                          background: mapDestinationTarget === 'sender' ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'linear-gradient(135deg, #22c55e, #38CE3C)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '16px', boxShadow: '0 2px 10px rgba(99,102,241,0.3)'
                        }}>
                          {mapDestinationTarget === 'sender' ? '⬆' : '⬇'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '11px', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {mapSelectedHub.name}
                          </div>
                          <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.3 }}>
                            {mapSelectedHub.street}, {mapSelectedHub.district}, {mapSelectedHub.state} — {mapSelectedHub.pincode}
                          </div>
                        </div>
                        <div style={{
                          fontSize: '7px', color: mapDestinationTarget === 'sender' ? '#818cf8' : '#38CE3C',
                          background: mapDestinationTarget === 'sender' ? 'rgba(99,102,241,0.1)' : 'rgba(56,206,60,0.1)',
                          padding: '3px 8px', borderRadius: 8, fontWeight: 700, textTransform: 'uppercase', flexShrink: 0
                        }}>
                          ✓ {mapDestinationTarget === 'sender' ? 'Origin' : 'Destination'}
                        </div>
                      </div>
                    )}

                    {/* GPS Detecting Overlay */}
                    {detectingLocation && (
                      <div style={{
                        position: 'absolute', inset: 0, zIndex: 20,
                        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8
                      }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: '50%',
                          border: '2px solid rgba(99,102,241,0.4)',
                          borderTopColor: '#6366f1',
                          animation: 'hubPulseRotate 0.8s linear infinite'
                        }} />
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#818cf8' }}>Detecting your location...</span>
                        <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>Matching nearest logistics hub</span>
                      </div>
                    )}
                  </div>

                  {/* Hub List Cards (Blinkit-style saved addresses) */}
                  <div style={{ padding: '6px 10px 4px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: '8.5px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {mapHubSearch ? `${filteredHubs.length} Result${filteredHubs.length !== 1 ? 's' : ''}` : 'All Hub Locations'}
                      </span>
                      <button type="button" onClick={() => setMapHubListExpanded(prev => !prev)} style={{
                        background: 'none', border: 'none', color: '#818cf8', fontSize: '9px', fontWeight: 600, cursor: 'pointer', padding: 0
                      }}>
                        {mapHubListExpanded ? '▲ Collapse' : '▼ Show All'}
                      </button>
                    </div>
                    <div style={{
                      display: 'flex', flexDirection: 'column', gap: 4,
                      maxHeight: mapHubListExpanded ? 200 : 88, overflowY: 'auto', overflowX: 'hidden',
                      scrollbarWidth: 'thin', scrollbarColor: 'rgba(99,102,241,0.3) transparent'
                    }}>
                      {filteredHubs.map(hub => {
                        const isActive = mapSelectedHub?.name === hub.name;
                        return (
                          <button key={hub.name} type="button" onClick={() => handleMapHubSelect(hub)} style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                            background: isActive ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.015)',
                            border: isActive ? '1px solid rgba(99,102,241,0.25)' : '1px solid rgba(255,255,255,0.04)',
                            borderRadius: 10, cursor: 'pointer', textAlign: 'left', width: '100%',
                            transition: 'all 0.15s ease'
                          }}>
                            <div style={{
                              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                              background: isActive ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'rgba(255,255,255,0.04)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '14px'
                            }}>
                              {isActive ? '📍' : '🏭'}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '10px', fontWeight: 700, color: isActive ? '#fff' : 'var(--text-secondary)',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {hub.name}
                              </div>
                              <div style={{ fontSize: '8px', color: 'var(--text-muted)', marginTop: 1 }}>
                                {hub.district}, {hub.state} — {hub.pincode}
                              </div>
                            </div>
                            <div style={{
                              fontSize: '8px', color: isActive ? '#818cf8' : 'var(--text-muted)',
                              fontWeight: 600, flexShrink: 0
                            }}>
                              {hub.phone.replace('+91 ', '')}
                            </div>
                          </button>
                        );
                      })}
                      {filteredHubs.length === 0 && (
                        <div style={{ padding: 16, textAlign: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>
                          No hubs match "{mapHubSearch}" — try a different search
                        </div>
                      )}
                    </div>
                  </div>

                </div>
                  );
                })()}


                {/* Costs & Estimates Calculations */}
                {(() => {
                  const transit = getEstimatedTransit(bookingForm.senderState, bookingForm.receiverState);
                  let dieselSpike = 0;
                  try {
                    dieselSpike = RealityEngine.getState().simulationState.dieselIncrease || 0;
                  } catch (e) {}
                  
                  const invoice = calculateBookingCosts(bookingForm.weight, bookingForm.value, transit.distance, dieselSpike);
                  const pickupDate = new Date(bookingForm.pickupTime);
                  const deliveryDate = new Date(pickupDate.getTime() + (transit.hours * 60 + transit.mins) * 60 * 1000);
                  
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      
                      {/* Transit Estimation Panel */}
                      <div style={{
                        background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.15)',
                        borderRadius: 'var(--radius-sm)', padding: '6px 10px', fontSize: '9.5px', color: 'var(--text-secondary)'
                      }}>
                        <div style={{ display: 'flex', justify: 'space-between', marginBottom: 2 }}>
                          <span>🛣️ Est. Route Distance:</span>
                          <strong style={{ color: 'var(--text-primary)' }}>~{transit.distance} km</strong>
                        </div>
                        <div style={{ display: 'flex', justify: 'space-between', marginBottom: 2 }}>
                          <span>⏱️ Estimated Transit Time:</span>
                          <strong style={{ color: 'var(--text-primary)' }}>{transit.hours}h {transit.mins}m</strong>
                        </div>
                        <div style={{ display: 'flex', justify: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 4, marginTop: 4 }}>
                          <span>📅 Predicted Delivery:</span>
                          <strong style={{ color: '#818cf8' }}>
                            {deliveryDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} at {deliveryDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </strong>
                        </div>
                      </div>

                      {/* Cost Invoice Panel */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)', padding: 10, display: 'flex', flexDirection: 'column', gap: 4
                      }}>
                        <span style={{ fontSize: '8.5px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, marginBottom: 2 }}>Freight Cost Itemization Invoice</span>
                        
                        <div style={invoiceLineStyle}>
                          <span>Base Freight Surcharge ({bookingForm.weight}t @ ₹3.50/km)</span>
                          <span>₹{invoice.baseFreight.toLocaleString()}</span>
                        </div>
                        <div style={invoiceLineStyle}>
                          <span>FASTag National Tollway Fee ({Math.max(1, Math.floor(transit.distance / 120))} Plazas)</span>
                          <span>₹{invoice.FASTagTolls.toLocaleString()}</span>
                        </div>
                        <div style={invoiceLineStyle}>
                          <span>Dynamic Fuel Surcharge ({15 + dieselSpike}% base + sim spike)</span>
                          <span>₹{invoice.fuelSurcharge.toLocaleString()}</span>
                        </div>
                        <div style={invoiceLineStyle}>
                          <span>Labor Handling Fee (Loading & Staging)</span>
                          <span>₹{invoice.laborLoadingFee.toLocaleString()}</span>
                        </div>
                        <div style={invoiceLineStyle}>
                          <span>Cargo Transit Insurance (0.05% Declared Value)</span>
                          <span>₹{invoice.transitInsurance.toLocaleString()}</span>
                        </div>
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', margin: '4px 0' }} />
                        <div style={invoiceLineStyle}>
                          <span>CGST (6.0%) + SGST (6.0%) Service Taxes</span>
                          <span>₹{invoice.gst.toLocaleString()}</span>
                        </div>
                        
                        <div style={{
                          display: 'flex', justify: 'space-between', alignItems: 'center',
                          borderTop: '1.5px solid var(--border-strong)', paddingTop: 6, marginTop: 4
                        }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-primary)' }}>TOTAL NET PAYABLE COST:</span>
                          <strong style={{ fontSize: '14px', fontWeight: 900, color: '#38CE3C' }}>
                            ₹{invoice.netCost.toLocaleString()}
                          </strong>
                        </div>
                      </div>

                    </div>
                  );
                })()}

                <button
                  type="submit"
                  style={{
                    background: 'var(--gradient-primary)', color: '#fff', border: 'none',
                    borderRadius: 'var(--radius-md)', padding: '12px 0', fontSize: 'var(--text-xs)',
                    fontWeight: 700, cursor: 'pointer', marginTop: 4, boxShadow: 'var(--shadow-glow)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  Authorize ZKP Settle Ledger & Confirm Booking
                </button>

              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Embed Keyframe style for driving animation */}
      <style>{`
        @keyframes driverPulse {
          0% { transform: scale(1); opacity: 0.8; box-shadow: 0 0 0 0 rgba(56, 206, 60, 0.4); }
          70% { transform: scale(1.15); opacity: 1; box-shadow: 0 0 0 10px rgba(56, 206, 60, 0); }
          100% { transform: scale(1); opacity: 0.8; box-shadow: 0 0 0 0 rgba(56, 206, 60, 0); }
        }
        @keyframes hubPulseRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ecgLine {
          to { stroke-dashoffset: 0; }
        }
      `}</style>

    </div>
  );
}

// ---- INLINE WORKSPACE STYLES ----
const suggestionChipStyle = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-sm)',
  padding: '6px 10px',
  color: 'var(--primary-400)',
  fontSize: '10px',
  textAlign: 'left',
  cursor: 'pointer',
  outline: 'none',
  width: '100%',
  transition: 'all var(--transition-fast)'
};

const formInputStyle = {
  background: 'var(--bg-900)',
  border: '1px solid var(--border-subtle)',
  color: 'var(--text-primary)',
  padding: '8px 12px',
  fontSize: 'var(--text-xs)',
  borderRadius: 'var(--radius-sm)',
  outline: 'none',
  width: '100%'
};

const modalLabelStyle = {
  fontSize: '8.5px',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: 3,
  fontWeight: 600,
  letterSpacing: '0.02em'
};

const invoiceLineStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '9.5px',
  color: 'var(--text-secondary)'
};

const listItemStyle = {
  background: 'var(--bg-800)',
  border: '1px solid var(--border-subtle)',
  padding: '10px 12px',
  borderRadius: 'var(--radius-md)',
  transition: 'all var(--transition-fast)'
};

const kpiCardStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border-subtle)',
  padding: '12px 14px',
  borderRadius: 'var(--radius-lg)'
};

const kpiLabelStyle = {
  fontSize: '9px',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  marginBottom: 2
};

const kpiValStyle = {
  fontSize: '15px',
  fontWeight: 800,
  color: 'var(--text-primary)'
};
