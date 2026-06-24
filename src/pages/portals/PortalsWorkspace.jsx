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
  Landmark, ShieldCheck, UserPlus, X
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
    value: 2500000
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
    mileage: 4.8,
    fuelCostSaved: 4800
  });

  // Stateful Fleet parameters
  const [fleetState, setFleetState] = useState({
    utilization: 87.4,
    revenueToday: 428500,
    activeAlerts: 4,
    fuelEfficiency: 4.8
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
    setBookingOpen(false);
    showToast(`Shipment ${newShpId} booked successfully!`, 'success');
    
    // Dispatch Unified Event to graph
    pushEvent(
      'Customer Books Load',
      `Client booked ${newShpId} (${bookingForm.senderDistrict}➔${bookingForm.receiverDistrict}, ${bookingForm.weight}t). Invoice Net Cost: ₹${cost.toLocaleString()} (Base: ₹${costs.baseFreight.toLocaleString()}, Tolls: ₹${costs.FASTagTolls.toLocaleString()}, Fuel Surcharge: ₹${costs.fuelSurcharge.toLocaleString()}, GST: ₹${costs.gst.toLocaleString()}).`,
      'CRM/ERP'
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

  // 5. Fleet Owner Action: Complete Service
  const triggerFleetService = (truckId) => {
    showToast(`Service scheduled for ${truckId}`, 'success');
    pushEvent(
      'Preventive Maintenance Logged',
      `TRK-00045 scheduled for brake pad overhaul at Pune Workshop. Updates: ERP fleet depreciation ledger +₹12,500, Supply Chain Agent re-assigning cargo lines.`,
      'ERP/FLEET'
    );
  };

  // 6. Vendor Action: Refuel Event
  const triggerVendorRefuel = () => {
    showToast("Fuel receipt logged with ERP", "success");
    pushEvent(
      'Fuel Card Transaction',
      `TRK-00019 refueled 280L diesel at IOC depot, Nagpur (₹25,200). Updates: Finance Agent automated ledger reconciliation, ERP spend accounts.`,
      'ERP/VENDOR'
    );
  };

  // 7. Broker Action: Post spot load
  const triggerBrokerPost = () => {
    showToast("Spot load posted on market board", "success");
    pushEvent(
      'Spot Load Posted',
      `Posted 32t structural steel shipment (Delhi➔Ahmedabad). Updates: Broker spot matching queue, Sales Agent recommendation ledger.`,
      'CRM/BROKER'
    );
  };

  // 8. Warehouse Action: Outbound Dispatch
  const triggerWarehouseDispatch = () => {
    showToast("Outbound cargo gate-out complete", "success");
    pushEvent(
      'Outbound Gate-Out Completed',
      `Container cargo SHP-104921 departed Delhi Depot. Inbound dwell time finalized at 1.4h. Updates: Supply Chain Agent, Executive KPIs.`,
      'WH/ECOSYSTEM'
    );
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
        {activePortal === 'customer' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-6)' }}>
            
            {/* Left: Shipment Command Center & Intelligence */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              
              {/* Top Banner Actions */}
              <div style={{
                display: 'flex', justify: 'space-between', align: 'center',
                background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)'
              }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>Consigner Shipment Command Center</h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Track active shipments, predicted delay alerts, and carbon scores en-route.</p>
                </div>
                <button
                  onClick={() => setBookingOpen(true)}
                  style={{
                    background: 'var(--gradient-primary)', color: '#fff', border: 'none',
                    borderRadius: 'var(--radius-md)', padding: '8px 16px', fontSize: 'var(--text-xs)',
                    fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                    boxShadow: 'var(--shadow-glow)'
                  }}
                >
                  <UserPlus size={14} /> Book New Shipment
                </button>
              </div>

              {/* Shipment List (Stateful cards) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                {shipments.map(s => (
                  <div key={s.id} style={{
                    background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
                    flexDirection: 'column', gap: 10, position: 'relative', overflow: 'hidden'
                  }}>
                    {/* Glow side border */}
                    <div style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
                      background: s.status === 'delayed' ? 'var(--danger-500)' : s.status === 'scheduled' ? 'var(--primary-400)' : 'var(--success-500)'
                    }} />

                    {/* Card Header */}
                    <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', paddingLeft: 4 }}>
                      <div>
                        <span style={{ fontWeight: 800, fontSize: 'var(--text-base)', color: '#fff' }}>{s.id}</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: 8 }}>{s.ewayBill}</span>
                      </div>
                      <span style={{
                        fontSize: '9px', fontWeight: 800, padding: '2px 8px', borderRadius: 'var(--radius-full)',
                        background: s.status === 'delayed' ? 'var(--danger-bg)' : s.status === 'scheduled' ? 'rgba(99,102,241,0.1)' : 'var(--success-bg)',
                        color: s.status === 'delayed' ? 'var(--danger-500)' : s.status === 'scheduled' ? 'var(--primary-400)' : 'var(--success-500)'
                      }}>
                        {s.status.toUpperCase().replace('_', ' ')}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ width: '100%', background: 'rgba(255,255,255,0.04)', height: 6, borderRadius: 3, marginTop: 4 }}>
                      <div style={{
                        width: `${s.progress}%`, height: '100%', borderRadius: 3,
                        background: s.status === 'delayed' ? 'var(--danger-500)' : 'var(--gradient-primary)'
                      }} />
                    </div>

                    {/* Route Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 30px 1fr', alignItems: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>ORIGIN</div>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{s.origin}</div>
                      </div>
                      <div style={{ textAlign: 'center' }}><ChevronRight size={14} color="var(--text-muted)" /></div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>DESTINATION</div>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{s.destination}</div>
                      </div>
                    </div>

                    {/* Cargo Specs Grid */}
                    <div style={{
                      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
                      borderTop: '1px solid var(--border-subtle)', paddingTop: 10,
                      fontSize: '11px', color: 'var(--text-secondary)'
                    }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>ETA COUNTDOWN</div>
                        <div style={{ fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={10} color="var(--primary-400)" /> {s.eta}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>CO2 RATING</div>
                        <div style={{ fontWeight: 700, color: '#38CE3C', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Zap size={10} color="#38CE3C" /> {s.carbon}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '9px' }}>RISK FACTOR</div>
                        <div style={{
                          fontWeight: 700,
                          color: s.risk === 'High' ? 'var(--danger-500)' : s.risk === 'Medium' ? '#f59e0b' : '#38CE3C'
                        }}>{s.risk}</div>
                      </div>
                    </div>

                    {/* Cost & Delay Info */}
                    <div style={{
                      display: 'flex', justify: 'space-between', align: 'center',
                      background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.02)',
                      padding: 6, borderRadius: 'var(--radius-sm)', fontSize: '10px'
                    }}>
                      <span style={{ color: 'var(--text-muted)' }}>Cost Breakdown: <span style={{ color: '#fff', fontWeight: 600 }}>₹{s.cost.toLocaleString()}</span></span>
                      {s.status === 'delayed' && (
                        <span style={{ color: 'var(--danger-400)', fontWeight: 600 }}>⚠️ {s.delay}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Intelligence Workspace Analytics */}
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)'
              }}>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Customer Intelligence Registry</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 12 }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Credit Utilization</div>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: '#fff', margin: '4px 0' }}>₹38.4L <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>/ ₹50L</span></div>
                    <div style={{ width: '100%', background: 'rgba(255,255,255,0.04)', height: 4, borderRadius: 2 }}>
                      <div style={{ width: '76.8%', height: '100%', background: 'var(--primary-400)', borderRadius: 2 }} />
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 12 }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Quote Acceptance</div>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: '#38CE3C', margin: '4px 0' }}>87.2%</div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Above network target (82%)</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 12 }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Account Churn Risk</div>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: '#38CE3C', margin: '4px 0' }}>Low (12%)</div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Sentiment: Highly Positive</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 12 }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Invoice Disputes</div>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: '#fff', margin: '4px 0' }}>0 <span style={{ fontSize: '10px', color: '#38CE3C' }}>Reconciled</span></div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Last dispute: 45d ago</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: AI Logistics Copilot */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', height: '100%'
            }}>
              <div style={{
                padding: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)',
                display: 'flex', justify: 'space-between', align: 'center'
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
                    color: '#fff', padding: '8px 12px', fontSize: 'var(--text-xs)', borderRadius: 'var(--radius-sm)',
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
        )}

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
                <div style={{ display: 'flex', justify: 'space-between', align: 'center', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>Driver Navigation & Safety Assistant</h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Real-time telemetry companion monitoring overspeeding, rest periods, and weather alerts.</p>
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--primary-400)', fontWeight: 600 }}>Active Route: Delhi ➔ Mumbai</span>
                </div>

                {/* Stylized Route Trace Map */}
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
                    
                    {/* Depots */}
                    <circle cx="20" cy="100" r="4" fill="#fff" />
                    <text x="20" y="115" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Delhi Depot</text>

                    <circle cx="320" cy="100" r="4" fill="#fff" />
                    <text x="320" y="115" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Mumbai Hub</text>

                    {/* Warning hotspot */}
                    <circle cx="230" cy="67" r="16" fill="rgba(255, 77, 107, 0.12)" stroke="rgba(255, 77, 107, 0.4)" strokeWidth="1" />
                    <circle cx="230" cy="67" r="3" fill="var(--danger-500)" />
                    <text x="230" y="90" fill="var(--danger-400)" fontSize="8" textAnchor="middle" fontWeight="bold">Monsoon Warning</text>
                  </svg>
                </div>

                {/* Upcoming Waypoints */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 12 }}>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', padding: 10, borderRadius: 'var(--radius-sm)', fontSize: '10px' }}>
                    <div style={{ color: 'var(--text-muted)' }}>NEXT FUEL PLAZA</div>
                    <div style={{ fontWeight: 700, color: '#fff', marginTop: 2 }}>IOC NH48 (42km away)</div>
                    <span style={{ color: '#38CE3C' }}>Fastag Discount Enabled</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', padding: 10, borderRadius: 'var(--radius-sm)', fontSize: '10px' }}>
                    <div style={{ color: 'var(--text-muted)' }}>REST ZONE</div>
                    <div style={{ fontWeight: 700, color: '#fff', marginTop: 2 }}>BPCL Plaza (90km away)</div>
                    <span style={{ color: 'var(--text-muted)' }}>Bed capacity: 18 vacant</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', padding: 10, borderRadius: 'var(--radius-sm)', fontSize: '10px' }}>
                    <div style={{ color: 'var(--text-muted)' }}>WEATHER CELL</div>
                    <div style={{ fontWeight: 700, color: 'var(--danger-400)', marginTop: 2 }}>Heavy Rain near Vapi</div>
                    <span style={{ color: 'var(--text-muted)' }}>Est. Delay: +45 mins</span>
                  </div>
                </div>
              </div>

              {/* Safety Controls & Twin updates */}
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)'
              }}>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 12 }}>Driver Safety Actuators</h3>
                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <button
                    onClick={triggerHarshBraking}
                    style={{
                      flex: 1, background: 'var(--danger-bg)', color: 'var(--danger-500)',
                      border: '1px solid var(--danger-500)', borderRadius: 'var(--radius-md)',
                      padding: '12px 0', fontSize: 'var(--text-xs)', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justify: 'center', gap: 6
                    }}
                  >
                    <AlertTriangle size={14} /> Report Harsh Braking
                  </button>
                  <button
                    onClick={triggerRestCheckIn}
                    style={{
                      flex: 1, background: 'rgba(56,206,60,0.1)', color: '#38CE3C',
                      border: '1px solid #38CE3C', borderRadius: 'var(--radius-md)',
                      padding: '12px 0', fontSize: 'var(--text-xs)', fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justify: 'center', gap: 6
                    }}
                  >
                    <Clock size={14} /> Check In Rest Stop
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Earnings, safety twin and coach */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              
              {/* Earnings & Rewards */}
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
                flexDirection: 'column', gap: 12
              }}>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Award size={14} color="#f59e0b" /> EARNINGS & INCENTIVES
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', padding: 10, borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>TODAY'S PAY</div>
                    <div style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: '#fff' }}>₹{driverState.todayEarnings.toLocaleString()}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', padding: 10, borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>MONTH TOTAL</div>
                    <div style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: '#fff' }}>₹{driverState.monthlyEarnings.toLocaleString()}</div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10, fontSize: '11px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justify: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Safety Bonus Pool:</span>
                    <span style={{ color: '#38CE3C', fontWeight: 600 }}>+₹{driverState.bonuses.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justify: 'space-between' }}>
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

              {/* AI Driver Coach */}
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)',
                borderLeft: '4px solid #f59e0b', display: 'flex', flexDirection: 'column', gap: 8
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 'var(--text-xs)', color: '#f59e0b' }}>
                  <Bot size={13} /> AI DRIVER COACH ADVISORY
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  "Your fuel efficiency dropped 8% last trip due to hard acceleration near Rajasthan state borders. Reduce harsh deceleration to maintain your safety bonus and save ₹2,300/month."
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-6)' }}>
            
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
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: 2 }}>Avg mileage: 4.8 km/L</div>
                </div>
                <div style={kpiCardStyle}>
                  <div style={kpiLabelStyle}>Maintenance Queue</div>
                  <div style={{ ...kpiValStyle, color: 'var(--primary-400)' }}>4 Trucks</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: 2 }}>Next service due: 3d</div>
                </div>
              </div>

              {/* Transporter Active Assets Grid */}
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)'
              }}>
                <div style={{ display: 'flex', justify: 'space-between', align: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>Fleet Assets Registry (OBD Diagnostics)</h3>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>10 Active twins synchronizing en-route.</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  {[
                    { id: 'TRK-00012', model: 'Volvo FM420', route: 'Delhi➔Mumbai', speed: '72 km/h', fuel: '82%', health: 95, status: 'active' },
                    { id: 'TRK-00028', model: 'Tata Prima', route: 'Mumbai➔Chennai', speed: '0 km/h (Idle)', fuel: '45%', health: 68, status: 'idle' },
                    { id: 'TRK-00045', model: 'BharatBenz 3523', route: 'Kolkata➔Guwahati', speed: '48 km/h', fuel: '68%', health: 88, status: 'active' },
                    { id: 'TRK-00019', model: 'Eicher Pro 6049', route: 'Chennai➔Hyderabad', speed: '84 km/h', fuel: '92%', health: 91, status: 'active' }
                  ].map(t => (
                    <div key={t.id} style={{
                      background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)', padding: 12, position: 'relative'
                    }}>
                      <div style={{ display: 'flex', justify: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 800, color: '#fff', fontSize: 'var(--text-base)' }}>{t.id} <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500 }}>({t.model})</span></span>
                        <span style={{
                          fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: 4,
                          background: t.status === 'idle' ? 'rgba(245,158,11,0.1)' : 'rgba(56,206,60,0.1)',
                          color: t.status === 'idle' ? '#f59e0b' : '#38CE3C'
                        }}>{t.status.toUpperCase()}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                        <span>Route: {t.route}</span>
                        <span>Speed: {t.speed}</span>
                        <span>Fuel Level: {t.fuel}</span>
                        <span>Health: <span style={{ color: t.health > 80 ? '#38CE3C' : 'var(--danger-500)' }}>{t.health}%</span></span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <button onClick={() => triggerFleetService(t.id)} style={{
                          flex: 1, padding: '4px 0', fontSize: '9px', border: 'none',
                          borderRadius: 4, background: 'var(--bg-600)', color: '#fff', cursor: 'pointer'
                        }}>Schedule Service</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right: AI Fleet Advisor */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
              flexDirection: 'column', gap: 12
            }}>
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Bot size={14} color="var(--primary-400)" /> AI FLEET ADVISOR
              </h3>
              
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

              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-subtle)', padding: 12, borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', marginBottom: 4 }}>Profitability Risk identified</div>
                <p style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  "VRL cargo rates on Eastern Corridor (Kolkata-Guwahati) dipped 4.2% due to Siliguri traffic blocks. Alternate highway SH-14 bypass recommended."
                </p>
                <button
                  onClick={() => {
                    showToast("Alternate highway bypass routing enabled", "success");
                    pushEvent("Route Bypass Configured", "Supply Chain Agent rerouted Kolkata-Guwahati carriers via SH-14. Profitability stabilized.");
                  }}
                  style={{
                    width: '100%', marginTop: 8, padding: '4px 0', border: 'none',
                    borderRadius: 4, background: '#f59e0b', color: '#000', fontSize: '9px', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Bypass Siliguri block (SH-14)
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ==================== LAYER 4: VENDOR PORTAL ==================== */}
        {activePortal === 'vendor' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-6)' }}>
            
            {/* Left: Vendor Services */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)'
              }}>
                <div style={{ display: 'flex', justify: 'space-between', align: 'center', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>Logistics Service Operations</h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Track refuels, tyre swaps, and structural maintenance logged at BPCL, Bridgestone, and local workshops.</p>
                  </div>
                  <button onClick={triggerVendorRefuel} style={{
                    background: 'var(--primary-500)', border: 'none', color: '#fff',
                    borderRadius: 4, padding: '6px 12px', fontSize: '10px', fontWeight: 700, cursor: 'pointer'
                  }}>Log Diesel Refuel</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { id: 'SVC-92841', type: 'Fuel Supply', truck: 'TRK-00012', location: 'IOC Plaza, NH48', detail: '250L Diesel', cost: 22500, time: '14:22' },
                    { id: 'SVC-92839', type: 'Tyre Swap', truck: 'TRK-00028', location: 'Bridgestone Workshop, Pune', detail: 'Rear-axle wheel replacement', cost: 18400, time: '12:10' },
                    { id: 'SVC-92834', type: 'ECU Tuning', truck: 'TRK-00045', location: 'Tata Motors Center, Nagpur', detail: 'Engine diagnostics scan', cost: 6500, time: 'Yesterday' }
                  ].map(log => (
                    <div key={log.id} style={listItemStyle}>
                      <div style={{ display: 'flex', justify: 'space-between', align: 'center' }}>
                        <div>
                          <span style={{ fontWeight: 700, color: '#fff', fontSize: '11px' }}>{log.id} - {log.type}</span>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{log.location} | {log.detail}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 700, color: '#fff', fontSize: '11px' }}>₹{log.cost.toLocaleString()}</span>
                          <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{log.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right: Vendor Analytics Scorecard */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
                flexDirection: 'column', gap: 12
              }}>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800 }}>Vendor Quality Scorecard</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', justify: 'space-between' }}>
                    <span>Average Quality Rating:</span>
                    <span style={{ color: '#38CE3C', fontWeight: 600 }}>4.8 / 5.0</span>
                  </div>
                  <div style={{ display: 'flex', justify: 'space-between' }}>
                    <span>Fuel Cost Index:</span>
                    <span style={{ color: '#38CE3C', fontWeight: 600 }}>94.2% (Nominal)</span>
                  </div>
                  <div style={{ display: 'flex', justify: 'space-between' }}>
                    <span>Service Reliability Rate:</span>
                    <span style={{ color: '#38CE3C', fontWeight: 600 }}>98.2%</span>
                  </div>
                  <div style={{ display: 'flex', justify: 'space-between' }}>
                    <span>Average Lead Time:</span>
                    <span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>1.8 Hours</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10, fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  This data automatically feeds into the GatiFleet procurement ERP dashboard for contract compliance audits.
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== LAYER 5: BROKER PORTAL ==================== */}
        {activePortal === 'broker' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-6)' }}>
            
            {/* Left: Broker loads */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)'
              }}>
                <div style={{ display: 'flex', justify: 'space-between', align: 'center', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>Broker Spot Market Board</h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Match immediate cargo loads with transporter capacity in the network.</p>
                  </div>
                  <button onClick={triggerBrokerPost} style={{
                    background: 'var(--gradient-primary)', color: '#fff', border: 'none',
                    borderRadius: 4, padding: '6px 12px', fontSize: '10px', fontWeight: 700, cursor: 'pointer'
                  }}>Post Spot Load</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { id: 'LOD-901', cargo: 'Structural Steel', weight: '32t', route: 'Delhi➔Ahmedabad', budget: 112000, bids: 3, status: 'open' },
                    { id: 'LOD-892', cargo: 'Polymers', weight: '20t', route: 'Kolkata➔Guwahati', budget: 58000, bids: 1, status: 'matched' },
                    { id: 'LOD-884', cargo: 'Electronics', weight: '12t', route: 'Bangalore➔Chennai', budget: 28000, bids: 5, status: 'open' }
                  ].map(l => (
                    <div key={l.id} style={listItemStyle}>
                      <div style={{ display: 'flex', justify: 'space-between', align: 'center' }}>
                        <div>
                          <span style={{ fontWeight: 700, color: '#fff', fontSize: '11px' }}>{l.id} - {l.cargo} ({l.weight})</span>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{l.route} | Active Bids: {l.bids}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 700, color: '#38CE3C', fontSize: '11px' }}>₹{l.budget.toLocaleString()}</span>
                          <div style={{ fontSize: '9px', color: l.status === 'open' ? '#f59e0b' : '#38CE3C', fontWeight: 600 }}>{l.status.toUpperCase()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right: Broker Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
                flexDirection: 'column', gap: 12
              }}>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800 }}>Agent Conversion Metrics</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', justify: 'space-between' }}>
                    <span>Loads Posted:</span>
                    <span>234 units</span>
                  </div>
                  <div style={{ display: 'flex', justify: 'space-between' }}>
                    <span>Loads Closed:</span>
                    <span>189 units</span>
                  </div>
                  <div style={{ display: 'flex', justify: 'space-between' }}>
                    <span>Spot Conversion Rate:</span>
                    <span style={{ color: '#38CE3C', fontWeight: 600 }}>80.7%</span>
                  </div>
                  <div style={{ display: 'flex', justify: 'space-between' }}>
                    <span>Client Satisfaction:</span>
                    <span style={{ color: '#38CE3C', fontWeight: 600 }}>4.6 / 5.0</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10, fontSize: '10px', color: 'var(--text-muted)' }}>
                  Loads matched by brokers directly feed the GatiFleet CRM pipeline.
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== LAYER 6: WAREHOUSE PORTAL ==================== */}
        {activePortal === 'warehouse' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-6)' }}>
            
            {/* Left: Warehouse queue */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)'
              }}>
                <div style={{ display: 'flex', justify: 'space-between', align: 'center', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>Depot Dock Management</h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Track inbound loading bays, outbound dispatch schedules, and labor productivity.</p>
                  </div>
                  <button onClick={triggerWarehouseDispatch} style={{
                    background: 'var(--primary-500)', border: 'none', color: '#fff',
                    borderRadius: 4, padding: '6px 12px', fontSize: '10px', fontWeight: 700, cursor: 'pointer'
                  }}>Complete Gate-Out</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { id: 'BAY-1', action: 'Inbound Loading', truck: 'TRK-00012', carrier: 'Reliance Cargo', status: 'active', dwell: '1.2h' },
                    { id: 'BAY-2', action: 'Outbound Dispatch', truck: 'TRK-00045', carrier: 'Tata Logistics', status: 'loading', dwell: '0.8h' },
                    { id: 'BAY-3', action: 'Staging Queue', truck: 'TRK-00019', carrier: 'BlueDart express', status: 'waiting', dwell: '2.1h' }
                  ].map(bay => (
                    <div key={bay.id} style={listItemStyle}>
                      <div style={{ display: 'flex', justify: 'space-between', align: 'center' }}>
                        <div>
                          <span style={{ fontWeight: 700, color: '#fff', fontSize: '11px' }}>{bay.id} - {bay.action}</span>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Truck: {bay.truck} ({bay.carrier})</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: 700, color: '#fff', fontSize: '11px' }}>Dwell: {bay.dwell}</span>
                          <div style={{ fontSize: '9px', color: bay.status === 'active' ? '#38CE3C' : '#f59e0b', fontWeight: 600 }}>{bay.status.toUpperCase()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right: Warehouse KPIs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
                flexDirection: 'column', gap: 12
              }}>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800 }}>Depot Performance Index</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', justify: 'space-between' }}>
                    <span>Inbound Queues:</span>
                    <span>12 Trucks</span>
                  </div>
                  <div style={{ display: 'flex', justify: 'space-between' }}>
                    <span>Outbound Queues:</span>
                    <span>8 Trucks</span>
                  </div>
                  <div style={{ display: 'flex', justify: 'space-between' }}>
                    <span>Average Dwell Time:</span>
                    <span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>1.8 Hours</span>
                  </div>
                  <div style={{ display: 'flex', justify: 'space-between' }}>
                    <span>Labor Productivity:</span>
                    <span style={{ color: '#38CE3C', fontWeight: 600 }}>94.2%</span>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10, fontSize: '10px', color: 'var(--text-muted)' }}>
                  Depot logs feed the Supply Chain Agent to optimize loading bay assignments.
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ==================== BOTTOM MODULE: UNIFIED EVENT STREAM ==================== */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
        flexDirection: 'column', gap: 10
      }}>
        <div style={{ display: 'flex', justify: 'space-between', align: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
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
              <span style={{ color: '#fff', fontWeight: 600, flexShrink: 0 }}>{e.event}:</span>
              <span style={{ color: '#38CE3C' }}>{e.desc}</span>
            </div>
          ))}
          <div ref={streamEndRef} />
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
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>Select Logistics Hub</div>
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
                          color: '#fff', fontSize: '11px', width: '100%', fontFamily: 'inherit'
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
  background: 'rgba(255,255,255,0.02)',
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
  color: '#fff'
};
