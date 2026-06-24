/* eslint-disable */
// ============================================================
// GatiFleet — Unified Transportation Reality Engine (TRE) Cockpit
// Combining both: 5-Tab Business Workspace & 10-Layer Core Engine Cockpit
// ============================================================

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Truck, MapPin, Bot, Sparkles, Clock, Activity, CheckCircle,
  AlertTriangle, Send, ChevronRight, Coins, Zap, Award, Building2,
  Landmark, ShieldCheck, UserPlus, X, ShieldAlert, Sliders, Globe, Compass,
  DollarSign, AlertCircle, TrendingUp, BarChart3, Database, Layers, Settings, Share2,
  FileText, Brain, RefreshCw, Cpu
} from 'lucide-react';
import { RealityEngine } from '../../data/RealityEngine';
import { CITIES, formatCurrency } from '../../data/mockData';

// Role-based adaptations
const ROLE_DETAILS = {
  CEO: {
    title: "Chief Executive Command Console",
    description: "Enterprise strategic margins, long-term capital exposure, growth hedges, and corporate carbon liability.",
    kpis: {
      revProtected: "₹42.9 Cr",
      revProtectedTrend: "+8.3%",
      revAtRisk: "₹1.8 Cr",
      revAtRiskTrend: "-12.5%",
      inventoryValue: "₹184.2 Cr",
      workingCapital: "₹34.6 Cr",
      costVariance: "+1.2%",
      slaPredict: "98.4%",
      netHealth: "Nominal (99.8%)",
      cashImpact: "₹14.2 Cr"
    },
    alerts: [
      { id: 'ceo-1', title: 'Customer Churn Risk', desc: 'Tata Motors contract flags 12% churn risk due to recent Siliguri delays.', type: 'danger' },
      { id: 'ceo-2', title: 'Strategic Carbon Penalty', desc: 'Emissions offset requirements projected to rise 8% in Q4 if road share exceeds 65%.', type: 'warning' }
    ],
    actions: [
      { label: "Reserve Diwali capacity", detail: "Authorize spot contracts with BlueDart at 6% rebate.", event: "CAPACITY_RESERVED", desc: "Reserved 120 trailer contracts" },
      { label: "Contact Arjun Kapoor (Tata)", detail: "Initiate VIP CRM alignment call to waive demurrage fees.", event: "VIP_CRM_ALIGN", desc: "Demurrage waiver proposal sent" }
    ],
    presets: [
      "Can we support 30% growth next quarter?",
      "Review Q3 strategic profit margins",
      "What is our corporate carbon risk?"
    ]
  },
  CFO: {
    title: "Logistics CFO Office",
    description: "Freight spend analytics, GST reconciliation buffers, fuel card inflation hedges, and working capital cycles.",
    kpis: {
      revProtected: "₹28.4 Cr",
      revProtectedTrend: "+4.1%",
      revAtRisk: "₹3.2 Cr",
      revAtRiskTrend: "+15.0%",
      inventoryValue: "₹120.4 Cr",
      workingCapital: "₹18.4 Cr",
      costVariance: "+3.8% (Diesel)",
      slaPredict: "96.5%",
      netHealth: "Audit Required",
      cashImpact: "₹9.8 Cr"
    },
    alerts: [
      { id: 'cfo-1', title: 'Fuel Rate Inflation Surcharge', desc: 'NH48 transporter billing claims average +2.4% fuel surcharge over standard rates.', type: 'warning' },
      { id: 'cfo-2', title: 'GST Reconciliation Discrepancy', desc: '₹14.8 Lakhs ITC mismatch detected between GSTR-2B and cargo e-way bills.', type: 'danger' }
    ],
    actions: [
      { label: "Apply diesel surcharge hedge", detail: "Execute 10-day volume fuel card pre-buy contract.", event: "FUEL_CARD_BUY", desc: "Hedging 50k Litres at ₹94.2/L" },
      { label: "Audit GST ledger mismatches", detail: "Trigger automatic supplier reconcile message to Carrier.", event: "GST_RECON_SENT", desc: "Sent ITC reconciliations to Safexpress" }
    ],
    presets: [
      "Why did freight costs increase 6.2% this week?",
      "Reconcile outstanding transport invoices",
      "Analyze NH48 toll surcharge inflation"
    ]
  },
  COO: {
    title: "Operations & Network command",
    description: "Live warehouse dwell bottlenecks, regional fleet distributions, port congestions, and operational SLAs.",
    kpis: {
      revProtected: "₹36.8 Cr",
      revProtectedTrend: "+6.2%",
      revAtRisk: "₹2.9 Cr",
      revAtRiskTrend: "-4.2%",
      inventoryValue: "₹152.0 Cr",
      workingCapital: "₹24.0 Cr",
      costVariance: "+0.8%",
      slaPredict: "97.8%",
      netHealth: "Nominal (99.2%)",
      cashImpact: "₹11.5 Cr"
    },
    alerts: [
      { id: 'coo-1', title: 'JNPT Port congestion delay', desc: 'Container dwell average spikes to 14.2 hours. 8 inbound trailers affected.', type: 'danger' },
      { id: 'coo-2', title: 'Driver Shift allocation shortage', desc: 'NCR hub registry flags 14 driver roster vacancies for night shifts.', type: 'warning' }
    ],
    actions: [
      { label: "Auto-reallocate shift roster", detail: "Trigger standby driver roster pool via HR HCM integrations.", event: "ROSTER_FILL", desc: "Dispatched 14 standby drivers" },
      { label: "Reroute JNPT inbound trailers", detail: "Divert container queue to secondary customs warehouse depot.", event: "PORT_DIVERT", desc: "Diverted 8 trucks to Panvel hub" }
    ],
    presets: [
      "Show active warehouse dock congestion",
      "Optimize driver fatigue roster schedules",
      "Which regional hubs are operating at capacity?"
    ]
  },
  CONSIGNER: {
    title: "Consigner Booking & visibility Panel",
    description: "Direct spot booking engines, e-way bills generation, live location pins, and POD document control.",
    kpis: {
      revProtected: "₹18.2 Cr",
      revProtectedTrend: "+12.1%",
      revAtRisk: "₹0.9 Cr",
      revAtRiskTrend: "-18.5%",
      inventoryValue: "₹62.0 Cr",
      workingCapital: "₹6.4 Cr",
      costVariance: "-0.5% (Contracted)",
      slaPredict: "99.1%",
      netHealth: "Optimal",
      cashImpact: "₹3.8 Cr"
    },
    alerts: [
      { id: 'con-1', title: 'E-way Bill expiring in 4h', desc: 'EWB92841029 (Delhi-Mumbai) will expire. Cargo is 82km away from destination.', type: 'warning' },
      { id: 'con-2', title: 'Pending POD confirmation', desc: 'Shipment SHP-CT-90483 delivered but consignee signature hash pending.', type: 'warning' }
    ],
    actions: [
      { label: "Extend E-way Bill validity", detail: "Submit GPS telemetry coordinates verification to GST portal.", event: "EWB_EXTENDED", desc: "Extended EWB92841029 by 24 hours" },
      { label: "Trigger digital POD request", detail: "Ping receiver operator mobile to verify OTP lock status.", event: "POD_PINGED", desc: "Sent OTP ping to consignee" }
    ],
    presets: [
      "Where is my active shipment SHP-CT-90481?",
      "Book 500 tons Delhi to Chennai route",
      "Download invoice for last week shipments"
    ]
  },
  SUPPLY_CHAIN_MGR: {
    title: "Supply Chain Manager cockpit",
    description: "Production supply alignment, factory stockout margins, temperature-controlled cargo, and lane transit risk indices.",
    kpis: {
      revProtected: "₹31.4 Cr",
      revProtectedTrend: "+5.3%",
      revAtRisk: "₹4.5 Cr",
      revAtRiskTrend: "+28.2%",
      inventoryValue: "₹118.6 Cr",
      workingCapital: "₹16.2 Cr",
      costVariance: "+1.9%",
      slaPredict: "95.2%",
      netHealth: "High Risk Corridor",
      cashImpact: "₹8.4 Cr"
    },
    alerts: [
      { id: 'scm-1', title: 'Nagpur Bypass Corridor Blockage', desc: 'Monsoon flash flood surge reports. ETA penalty margin degraded by 4.5h.', type: 'danger' },
      { id: 'scm-2', title: 'Cold Chain Temp Breach Alert', desc: 'Reefer truck TRK-00052 reports cabinet temperature rise to 5.8°C.', type: 'danger' }
    ],
    actions: [
      { label: "Reroute Nagpur en-route trucks", detail: "Authorize bypass SH-14 corridor reroute instructions.", event: "NAGPUR_REROUTE", desc: "Bypassed Nagpur via SH-14 detour" },
      { label: "Trigger remote reefer cooling", detail: "Send telemetry override to restore reefer compressor to 2.0°C.", event: "REEFER_COOL", desc: "Compressor override set to 2°C" }
    ],
    presets: [
      "Predict factory assembly downtime risk",
      "Show risk indices for NH48 Western corridor",
      "Which refrigerated shipments are near boundaries?"
    ]
  },
  LOGISTICS_HEAD: {
    title: "Logistics Head command dashboard",
    description: "Transporter trust indices, driver behavior logs, tire/coolant OBD diagnostics, and fuel consumption optimization.",
    kpis: {
      revProtected: "₹24.9 Cr",
      revProtectedTrend: "+2.6%",
      revAtRisk: "₹1.4 Cr",
      revAtRiskTrend: "-8.4%",
      inventoryValue: "₹92.0 Cr",
      workingCapital: "₹10.5 Cr",
      costVariance: "+2.1%",
      slaPredict: "98.1%",
      netHealth: "Nominal",
      cashImpact: "₹6.8 Cr"
    },
    alerts: [
      { id: 'lh-1', title: 'Transporter compliance review', desc: 'BlackBuck compliance score drops to 91.8% after 3 driver fatigue events.', type: 'warning' },
      { id: 'lh-2', title: 'Toll Card low balance alert', desc: 'FASTag account ID FT82481029 has less than ₹5,000 balance remaining.', type: 'warning' }
    ],
    actions: [
      { label: "Auto-recharge FASTag balance", detail: "Top up ₹50,000 using strategic bank accounts credit lines.", event: "TOLL_TOPUP", desc: "Deposited ₹50,000 into FASTag balance" },
      { label: "Enforce driver safety coaching", detail: "Enroll high-fatigue carrier logs into mandatory safety modules.", event: "SAFETY_COACH", desc: "Assigned safety course to BlackBuck driver" }
    ],
    presets: [
      "Compare road vs rail costs Delhi-Chennai",
      "Show driver safety radar compliance charts",
      "Audit active trucks diagnostic trouble codes"
    ]
  }
};

const TRACE_STEPS = [
  { step: 1, name: "L1 Event Capture", desc: "SHIPMENT_CREATED emitted to Event Bus. Copies dispatched to driver/truck/route twins.", event: "SHIPMENT_CREATED" },
  { step: 2, name: "L2 Entity Generation", desc: "Instantiated active Shipment Entity in dynamic Neo4j topological memory.", event: "ENTITY_INIT" },
  { step: 3, name: "L3 Digital Twin Hydration", desc: "Hydrated Physical, Operational, Financial, Behavioral, and Risk twins.", event: "TWIN_HYDRATE" },
  { step: 4, name: "L4 Memory Scan", desc: "Scanned Neo4j database to retrieve similar historic shipment outcomes and lessons.", event: "MEMORY_SCAN" },
  { step: 5, name: "L5 Learning Retrieval", desc: "Pulled learned Monday Congestion Factors and toll gate transit delays.", event: "LEARN_PULL" },
  { step: 6, name: "L6 Prediction Analysis", desc: "Evaluated driver resignation threats (82%) and breakdown risks (4.2%).", event: "PREDICT_RUN" },
  { step: 7, name: "L7 Simulation Search", desc: "Simulated 500 route variations. Evaluated cost spikes and toll queue delays.", event: "SIM_ITERATE" },
  { step: 8, name: "L8 Decision Package", desc: "Goal policy evaluated. Selected Dedicated DFC Rail corridor as cost/reliability match.", event: "DECISION_SELECT" },
  { step: 9, name: "L9 Execution Agent", desc: "Assigned TRK-90482, updated ETA, notified customer, generated e-invoice.", event: "EXEC_AUTONOMOUS" },
  { step: 10, name: "L10 Evolution Audit", desc: "Logged metrics to compare prediction vs actual. Model auto-upgrade check complete.", event: "EVO_AUDIT" }
];

export default function CustomerPortal() {
  const [viewMode, setViewMode] = useState('workspace'); // workspace | engine
  const [currentRole, setCurrentRole] = useState('CEO');
  const [activeTab, setActiveTab] = useState('command'); // command | planning | twins | market | cfo
  const [activeLayer, setActiveLayer] = useState(1); // 1 to 10
  const [engineState, setEngineState] = useState(RealityEngine.getState());
  const [selectedGraphNode, setSelectedGraphNode] = useState(null);
  
  // AI Copilot variables
  const [copilotInput, setCopilotInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copilotMsgs, setCopilotMsgs] = useState([
    { sender: 'copilot', text: "Welcome back. I am GatiFleet's Transportation Reality Engine Advisor. Select a preset query or ask me about active lanes, costs, or delays." }
  ]);

  // Tab 2: Planning & Simulator variables
  const [tonsInput, setTonsInput] = useState(500);
  const [bookingOrigin, setBookingOrigin] = useState('Delhi');
  const [bookingDest, setBookingDest] = useState('Chennai');
  const [selectedObjective, setSelectedObjective] = useState('minimize_cost'); // minimize_cost | maximize_speed | zero_carbon | high_reliability
  const [costSpeedModifiers, setCostSpeedModifiers] = useState({ cheaper: 50, safter: 50, greener: 50 });

  // Booking loop traceback state
  const [activeTraceStep, setActiveTraceStep] = useState(null); // null or 1 to 10
  const [traceLogs, setTraceLogs] = useState([]);

  // Tab 3: Digital Twin time machine
  const [futureSlider, setFutureSlider] = useState(0); // +0h to +24h
  const [selectedTwin, setSelectedTwin] = useState('shipment'); // shipment | driver | route | customer
  const [customEventText, setCustomEventText] = useState('');

  // Stateful Alerts list
  const [roleAlerts, setRoleAlerts] = useState({});

  // Sync state with RealityEngine singleton
  useEffect(() => {
    const unsubscribe = RealityEngine.subscribe((state) => {
      setEngineState(state);
    });
    return () => unsubscribe();
  }, []);

  // Update alerts on role switch
  useEffect(() => {
    setRoleAlerts(prev => ({
      ...prev,
      [currentRole]: ROLE_DETAILS[currentRole].alerts
    }));
    RealityEngine.events = [{
      id: `ev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'RoleSwitched',
      desc: `Console context modified to ${currentRole} workspace.`,
      source: 'USER/INTERFACE'
    }, ...RealityEngine.events];
    RealityEngine.notify();
  }, [currentRole]);

  const handleResolveAlert = (alertId, alertTitle) => {
    setRoleAlerts(prev => ({
      ...prev,
      [currentRole]: prev[currentRole].filter(a => a.id !== alertId)
    }));
    RealityEngine.events = [{
      id: `ev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'AlertResolved',
      desc: `Strategic Alert Resolved: "${alertTitle}"`,
      source: 'NOC/AGENT'
    }, ...RealityEngine.events];
    RealityEngine.notify();
  };

  const handleActionClick = (action) => {
    RealityEngine.events = [{
      id: `ev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: action.event,
      desc: action.desc,
      source: 'AUTONOMY/BROKER'
    }, ...RealityEngine.events];
    RealityEngine.notify();
    alert(`Autonomous Execution Complete!\n\nAction: ${action.label}\nDetail: ${action.detail}`);
  };

  // AI Copilot Handler
  const handleCopilotSubmit = (query) => {
    if (!query.trim()) return;
    setCopilotMsgs(prev => [...prev, { sender: 'user', text: query }]);
    setIsTyping(true);
    setCopilotInput('');

    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();
      if (q.includes('2,000 tons') || q.includes('2000 tons')) {
        reply = `**Capacity Analysis for Moving 2,000 Tons next week:**\n\n` +
                `* **Capacity Availability:** **92% Confidence** (Rail DFC surplus capacity available: 42%).\n` +
                `* **Route Path:** Dedicated Delhi ➔ Chennai container rail line bypasses NH44 road bottlenecks.\n` +
                `* **Estimated Cost:** ₹28.6 Lakhs (Rail pricing is 24% cheaper than road transport for this bulk).\n` +
                `* **Transit Time:** 42.5 Hours (Road average is 58 hours due to monsoon lane limits).\n` +
                `* **Active Risks:** Minor monsoon alerts at Jhansi rail interchange (Low risk, delay probability <5%).\n` +
                `* **Recommended Action:** Execute **DFC Rail Route Reservation** now to secure contract rates.`;
      } else if (q.includes('risk') || q.includes('revenue')) {
        reply = "Strategic Threat Detected:\n\nSHP-CT-90482 (carrying ₹36.0L components) is en-route to Bangalore but flagged with 'Critical Delay Risk' due to Nagpur bypass blockages.\n\nRevenue impact: Stockout threat at Bangalore factory in 6.2h. Autonomy recommend: Reroute via DFC Rail.";
      } else if (q.includes('costs') || q.includes('increase')) {
        reply = "CFO Ledger cost audit:\n\nTransportation expenses rose 3.8% this week. Primary factors: toll changes on NH48 (+1.2%) and fuel card diesel rate inflation (+2%). DFC rail routes are priced 24% cheaper.";
      } else {
        reply = `GatiFleet intelligence twin reports nominal status. Predictive Certainty index stands at ${engineState.oci.globalCertainty}%. Ask me about delays, inventory exposure, or green route planners.`;
      }
      setCopilotMsgs(prev => [...prev, { sender: 'copilot', text: reply }]);
      setIsTyping(false);
    }, 1200);
  };

  // Cost speed plan calculations
  const planningPlans = useMemo(() => {
    const baseCost = tonsInput * 1600;
    const baseHours = 48;

    let roadCost = baseCost;
    let railCost = baseCost * 0.72;
    let multiCost = baseCost * 0.84;
    let dedCost = baseCost * 1.15;
    let sharedCost = baseCost * 0.65;

    let roadHours = baseHours;
    let railHours = baseHours * 1.25;
    let multiHours = baseHours * 1.05;
    let dedHours = baseHours * 0.90;
    let sharedHours = baseHours * 1.50;

    let roadReliability = 94.2;
    let railReliability = 98.5;
    let multiReliability = 96.0;
    let dedReliability = 99.4;
    let sharedReliability = 89.8;

    let roadCarbon = tonsInput * 0.08;
    let railCarbon = tonsInput * 0.02;
    let multiCarbon = tonsInput * 0.04;
    let dedCarbon = tonsInput * 0.07;
    let sharedCarbon = tonsInput * 0.09;

    // Apply objectives multiplier
    if (selectedObjective === 'minimize_cost') {
      roadCost *= 0.95; railCost *= 0.90; sharedCost *= 0.85;
      roadReliability -= 1.5;
    } else if (selectedObjective === 'maximize_speed') {
      roadHours *= 0.88; dedHours *= 0.82;
      roadCost *= 1.10; dedCost *= 1.15;
    } else if (selectedObjective === 'zero_carbon') {
      railCarbon *= 0.80; multiCarbon *= 0.85;
      railCost *= 1.05;
    } else if (selectedObjective === 'high_reliability') {
      dedReliability = 99.8; railReliability = 99.1;
      dedCost *= 1.12;
    }

    return [
      { name: 'Road Corridor (NH44)', cost: Math.floor(roadCost), hours: roadHours.toFixed(1), carbon: roadCarbon.toFixed(1), reliability: roadReliability.toFixed(1), risk: 'Medium', confidence: '94%' },
      { name: 'Dedicated Rail DFC Line', cost: Math.floor(railCost), hours: railHours.toFixed(1), carbon: railCarbon.toFixed(1), reliability: railReliability.toFixed(1), risk: 'Low', confidence: '98%' },
      { name: 'Multimodal (Road + Rail)', cost: Math.floor(multiCost), hours: multiHours.toFixed(1), carbon: multiCarbon.toFixed(1), reliability: multiReliability.toFixed(1), risk: 'Low', confidence: '96%' },
      { name: 'Dedicated Fleet (Gati Motors)', cost: Math.floor(dedCost), hours: dedHours.toFixed(1), carbon: dedCarbon.toFixed(1), reliability: dedReliability.toFixed(1), risk: 'Low', confidence: '99%' },
      { name: 'Shared LTL Consolidated', cost: Math.floor(sharedCost), hours: sharedHours.toFixed(1), carbon: sharedCarbon.toFixed(1), reliability: sharedReliability.toFixed(1), risk: 'High', confidence: '88%' }
    ];
  }, [tonsInput, selectedObjective]);

  // Run book shipment loop simulation
  const handleBookOption = (optionName, optionCost) => {
    setActiveTraceStep(1);
    setTraceLogs([`[Step 1] Emitted Event SHIPMENT_CREATED to Event Bus.`]);
    RealityEngine.events = [{
      id: `ev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'SHIPMENT_CREATED',
      desc: `Booked ${tonsInput} Tons via ${optionName}. Loop initialized.`,
      source: 'ORDER/CLIENT'
    }, ...RealityEngine.events];
    RealityEngine.notify();

    // Trigger step sequence
    let currentStep = 1;
    const interval = setInterval(() => {
      currentStep += 1;
      if (currentStep <= 10) {
        const stepDef = TRACE_STEPS.find(s => s.step === currentStep);
        setActiveTraceStep(currentStep);
        setTraceLogs(prev => [...prev, `[Step ${currentStep}] ${stepDef.name}: ${stepDef.desc}`]);
        RealityEngine.events = [{
          id: `ev-${Date.now()}-${currentStep}`,
          timestamp: new Date().toISOString(),
          type: stepDef.event,
          desc: stepDef.desc,
          source: 'REALITY_ENGINE'
        }, ...RealityEngine.events];
        RealityEngine.notify();
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setActiveTraceStep(null);
          setTraceLogs([]);
          alert(`Ecosystem Loop Complete!\n\nPlan Booked: ${optionName}\nCost: ₹${optionCost.toLocaleString()}\nOutcome logged in Evolution Matrix.`);
        }, 1000);
      }
    }, 1500);
  };

  const handleManualEventInject = () => {
    if (!customEventText.trim()) return;
    RealityEngine.events = [{
      id: `ev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'ManualEventInjected',
      desc: customEventText,
      source: 'USER/COCKPIT'
    }, ...RealityEngine.events];
    RealityEngine.notify();
    setCustomEventText('');
  };

  const getCertaintyColor = (val) => {
    if (val > 95) return '#10b981';
    if (val > 88) return '#06b6d4';
    if (val > 80) return '#f59e0b';
    return '#ef4444';
  };

  const getAlertsForCurrentRole = () => {
    return roleAlerts[currentRole] || ROLE_DETAILS[currentRole].alerts;
  };

  // Node Positions for Connected SVG Graph
  const graphNodes = [
    { id: 'customer', label: 'Customer', cx: 60, cy: 50, color: '#10b981', desc: 'Arjun Kapoor (CEO)' },
    { id: 'order', label: 'Order', cx: 160, cy: 50, color: '#6366f1', desc: 'PO-928410 (500 Tons)' },
    { id: 'shipment', label: 'Shipment', cx: 260, cy: 50, color: '#3b82f6', desc: 'SHP-CT-90481' },
    { id: 'truck', label: 'Truck', cx: 360, cy: 50, color: '#22c55e', desc: 'TRK-90482 (Tata Prima)' },
    { id: 'driver', label: 'Driver', cx: 460, cy: 50, color: '#f59e0b', desc: 'Rajesh Kumar' },
    { id: 'route', label: 'Route', cx: 460, cy: 125, color: '#ec4899', desc: 'Delhi-Mumbai NH48 Corridor' },
    { id: 'fuel', label: 'Fuel', cx: 460, cy: 200, color: '#f97316', desc: 'Diesel card ledger pre-buy' },
    { id: 'toll', label: 'Toll', cx: 360, cy: 200, color: '#ef4444', desc: 'FASTag accounts FT82481029' },
    { id: 'warehouse', label: 'Warehouse', cx: 160, cy: 125, color: '#06b6d4', desc: 'Panvel dock storage' },
    { id: 'carrier', label: 'Carrier', cx: 360, cy: 125, color: '#8b5cf6', desc: 'Tata Dedicated Transporter' },
    { id: 'invoice', label: 'Invoice', cx: 260, cy: 125, color: '#a855f7', desc: 'INV-90481 (₹96,000)' },
    { id: 'payment', label: 'Payment', cx: 260, cy: 200, color: '#14b8a6', desc: 'ZKP accounts settle ledger' },
  ];

  const graphEdges = [
    { from: 'customer', to: 'order' },
    { from: 'order', to: 'shipment' },
    { from: 'shipment', to: 'truck' },
    { from: 'truck', to: 'driver' },
    { from: 'driver', to: 'route' },
    { from: 'route', to: 'fuel' },
    { from: 'route', to: 'toll' },
    { from: 'truck', to: 'carrier' },
    { from: 'shipment', to: 'warehouse' },
    { from: 'shipment', to: 'invoice' },
    { from: 'invoice', to: 'payment' },
    { from: 'carrier', to: 'invoice' }
  ];

  const isNodeImpacted = (nodeId) => {
    if (engineState.entities.truck.state !== 'broken_down') return false;
    const impacted = ['truck', 'driver', 'route', 'shipment', 'order', 'customer', 'warehouse', 'invoice', 'payment'];
    return impacted.includes(nodeId);
  };

  return (
    <div style={{
      padding: 'var(--space-6)',
      background: '#040711',
      minHeight: 'calc(100vh - var(--topbar-height))',
      color: '#f9fafb',
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)',
      position: 'relative'
    }}>

      {/* TOP HEADER SECTION & MODE/ROLE SELECTORS */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        paddingBottom: 'var(--space-4)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Building2 size={24} color="#6366f1" />
            <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, background: 'linear-gradient(90deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              GatiFleet Transportation Reality Engine (TRE)
            </h1>
          </div>
          <p style={{ color: '#9ca3af', fontSize: 'var(--text-xs)', marginTop: 4 }}>
            Strategic Decision Tower • Predictable Outcomes & 10 Core Architectural Engine Layers
          </p>
        </div>

        {/* Stateful Controls Panel */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          
          {/* Workspace Mode Switcher */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
            <span style={{ fontSize: '9px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>Workspace Mode</span>
            <div style={{
              display: 'flex', gap: 2, background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)', padding: 2, borderRadius: 4
            }}>
              <button
                onClick={() => setViewMode('workspace')}
                style={{
                  padding: '3px 8px', borderRadius: 2, border: 'none', cursor: 'pointer',
                  fontSize: '8px', fontWeight: 800, textTransform: 'uppercase',
                  background: viewMode === 'workspace' ? 'rgba(99,102,241,0.2)' : 'transparent',
                  color: viewMode === 'workspace' ? '#818cf8' : '#6b7280'
                }}
              >
                Customer Workspace
              </button>
              <button
                onClick={() => setViewMode('engine')}
                style={{
                  padding: '3px 8px', borderRadius: 2, border: 'none', cursor: 'pointer',
                  fontSize: '8px', fontWeight: 800, textTransform: 'uppercase',
                  background: viewMode === 'engine' ? 'rgba(99,102,241,0.2)' : 'transparent',
                  color: viewMode === 'engine' ? '#818cf8' : '#6b7280'
                }}
              >
                10-Layer Engine
              </button>
            </div>
          </div>

          {/* Role Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
            <span style={{ fontSize: '9px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>Ecosystem Role</span>
            <div style={{
              display: 'flex', gap: 2, background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)', padding: 2, borderRadius: 4
            }}>
              {Object.keys(ROLE_DETAILS).map(role => (
                <button
                  key={role}
                  onClick={() => setCurrentRole(role)}
                  style={{
                    padding: '3px 6px', borderRadius: 2, border: 'none', cursor: 'pointer',
                    fontSize: '8px', fontWeight: 800, textTransform: 'uppercase',
                    background: currentRole === role ? 'rgba(99,102,241,0.2)' : 'transparent',
                    color: currentRole === role ? '#818cf8' : '#6b7280'
                  }}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* GLOBAL HUD: OPERATIONAL CERTAINTY INDEX */}
      <div style={{
        background: 'rgba(17, 24, 39, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
        flexDirection: 'column', gap: 10
      }}>
        <div style={{ display: 'flex', justify: 'space-between', align: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
          <h2 style={{ fontSize: 'var(--text-xs)', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Brain size={12} /> Live Operational Certainty Index (OCI)
          </h2>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 900, color: getCertaintyColor(engineState.oci.globalCertainty) }}>
            {engineState.oci.globalCertainty}%
          </span>
        </div>

        {/* Certainty Meter Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8 }}>
          {[
            { label: 'ETA Certainty', val: engineState.oci.etaCertainty },
            { label: 'Cost Certainty', val: engineState.oci.costCertainty },
            { label: 'Capacity Certainty', val: engineState.oci.capacityCertainty },
            { label: 'Demand Certainty', val: engineState.oci.demandCertainty },
            { label: 'Customer Certainty', val: engineState.oci.customerCertainty },
            { label: 'Driver Certainty', val: engineState.oci.driverCertainty },
            { label: 'Network Certainty', val: engineState.oci.networkCertainty },
            { label: 'Revenue Certainty', val: engineState.oci.revenueCertainty }
          ].map((c, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '6px 8px', borderRadius: 4 }}>
              <div style={{ fontSize: '8px', color: '#9ca3af', textTransform: 'uppercase', marginBottom: 4 }}>{c.label}</div>
              <div style={{ height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 1, overflow: 'hidden' }}>
                <div style={{ width: `${c.val}%`, height: '100%', background: getCertaintyColor(c.val) }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOOKING LOOP TRACE ANIMATION MODAL PANEL */}
      {activeTraceStep !== null && (
        <div style={{
          background: 'rgba(10,15,30,0.95)', border: '1.5px solid #6366f1',
          padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: 10,
          boxShadow: '0 0 20px rgba(99,102,241,0.4)', marginBottom: 10
        }}>
          <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#818cf8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Brain size={12} className="animate-spin" /> CLOSED-LOOP SELF-IMPROVING BOOKING SIMULATOR ACTIVATED
            </span>
            <span style={{ fontSize: '10px', color: '#fff', fontWeight: 700 }}>Step {activeTraceStep} of 10</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 4 }}>
            {TRACE_STEPS.map(s => (
              <div key={s.step} style={{
                height: 4, borderRadius: 2,
                background: s.step < activeTraceStep ? '#10b981' : s.step === activeTraceStep ? '#6366f1' : 'rgba(255,255,255,0.05)',
                boxShadow: s.step === activeTraceStep ? '0 0 6px #6366f1' : 'none'
              }} />
            ))}
          </div>

          <div style={{
            background: '#040711', border: '1px solid rgba(255,255,255,0.05)',
            padding: 8, borderRadius: 4, maxHeight: '80px', overflowY: 'auto',
            fontFamily: 'var(--font-mono)', fontSize: '9.5px', color: '#10b981'
          }}>
            {traceLogs.map((log, i) => <div key={i}>{log}</div>)}
          </div>
        </div>
      )}

      {/* VIEW MODE BRANCHING */}

      {/* 1. CUSTOMER WORKSPACE VIEW MODE */}
      {viewMode === 'workspace' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', flex: 1 }}>
          
          {/* Stateful Tabs selectors */}
          <div style={{
            display: 'flex', gap: 4, background: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(255,255,255,0.05)', padding: 4, borderRadius: 'var(--radius-md)'
          }}>
            {[
              { id: 'command', label: 'Command Center & Graph', icon: Compass },
              { id: 'planning', label: 'Freight Designer & Sim', icon: Sliders },
              { id: 'twins', label: 'Shipment Twins & Causality', icon: Activity },
              { id: 'market', label: 'Market & Capacity Forecast', icon: Globe },
              { id: 'cfo', label: 'CFO, Learning & Evolution', icon: Landmark }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
                    background: isActive ? 'rgba(99,102,241,0.1)' : 'transparent',
                    color: isActive ? '#818cf8' : '#9ca3af',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <Icon size={13} color={isActive ? '#818cf8' : '#6b7280'} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Render Tab Contents */}
          <div style={{ flex: 1 }}>
            
            {/* TAB 1: Command Center */}
            {activeTab === 'command' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-5)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  
                  {/* KPIs */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
                    <div style={kpiCardStyle}>
                      <div style={kpiLabelStyle}>Protected Revenue</div>
                      <div style={kpiValStyle}>{ROLE_DETAILS[currentRole].kpis.revProtected} <span style={{ fontSize: '9px', color: '#10b981' }}>{ROLE_DETAILS[currentRole].kpis.revProtectedTrend}</span></div>
                    </div>
                    <div style={kpiCardStyle}>
                      <div style={kpiLabelStyle}>At-Risk Revenue</div>
                      <div style={{ ...kpiValStyle, color: '#ef4444' }}>{ROLE_DETAILS[currentRole].kpis.revAtRisk} <span style={{ fontSize: '9px', color: '#ef4444' }}>{ROLE_DETAILS[currentRole].kpis.revAtRiskTrend}</span></div>
                    </div>
                    <div style={kpiCardStyle}>
                      <div style={kpiLabelStyle}>SLA Performance</div>
                      <div style={kpiValStyle}>{ROLE_DETAILS[currentRole].kpis.slaPredict}</div>
                    </div>
                    <div style={kpiCardStyle}>
                      <div style={kpiLabelStyle}>Working Capital</div>
                      <div style={kpiValStyle}>{ROLE_DETAILS[currentRole].kpis.workingCapital}</div>
                    </div>
                  </div>

                  {/* SVG Map and SVG Graph */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 'var(--space-4)' }}>
                    <div style={{ background: 'rgba(17,24,39,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                      <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 800, marginBottom: 8 }}>Transportation Control Tower</h3>
                      <div style={{ background: '#02040a', borderRadius: 4, height: '150px', display: 'flex', alignItems: 'center', justify: 'center' }}>
                        <svg width="220" height="130" style={{ overflow: 'visible' }}>
                          <path d="M 30,20 Q 70,60 30,100" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="3" />
                          <circle cx="40" cy="50" r="4" fill={engineState.entities.truck.state === 'broken_down' ? '#ef4444' : '#10b981'} />
                        </svg>
                      </div>
                    </div>

                    <div style={{ background: 'rgba(17,24,39,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 800, marginBottom: 4 }}>connected Knowledge Graph</h3>
                      <div style={{ height: '110px', display: 'flex', alignItems: 'center', justify: 'center' }}>
                        <svg width="220" height="110" style={{ overflow: 'visible' }}>
                          {graphEdges.map((edge, idx) => {
                            const fromNode = graphNodes.find(n => n.id === edge.from);
                            const toNode = graphNodes.find(n => n.id === edge.to);
                            if (!fromNode || !toNode) return null;
                            const isImpactedEdge = isNodeImpacted(edge.from) && isNodeImpacted(edge.to);
                            return (
                              <line
                                key={idx}
                                x1={fromNode.cx / 2.2} y1={fromNode.cy / 2}
                                x2={toNode.cx / 2.2} y2={toNode.cy / 2}
                                stroke={isImpactedEdge ? '#ef4444' : 'rgba(255,255,255,0.05)'}
                                strokeWidth="1"
                              />
                            );
                          })}
                          {graphNodes.map(node => (
                            <circle
                              key={node.id} cx={node.cx / 2.2} cy={node.cy / 2} r={selectedGraphNode?.id === node.id ? 5 : 3.5}
                              fill={isNodeImpacted(node.id) ? '#ef4444' : node.color}
                              onMouseEnter={() => setSelectedGraphNode(node)} onMouseLeave={() => setSelectedGraphNode(null)}
                            />
                          ))}
                        </svg>
                      </div>
                      <div style={{ fontSize: '8px', color: '#9ca3af', height: '12px' }}>
                        {selectedGraphNode && <span>Node: {selectedGraphNode.label} • {selectedGraphNode.desc}</span>}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right columns: Alerts & Copilot */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  <div style={{ background: 'rgba(17,24,39,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                    <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 800, marginBottom: 8 }}>AI Alerts & Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {getAlertsForCurrentRole().map(alert => (
                        <div key={alert.id} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: 6, borderRadius: 4, borderLeft: `3px solid ${alert.type === 'danger' ? '#ef4444' : '#f59e0b'}` }}>
                          <div style={{ display: 'flex', justify: 'space-between', align: 'center' }}>
                            <span style={{ fontSize: '9px', fontWeight: 800, color: '#fff' }}>{alert.title}</span>
                            <button onClick={() => handleResolveAlert(alert.id, alert.title)} style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '8px' }}>RESOLVE</button>
                          </div>
                        </div>
                      ))}
                      {ROLE_DETAILS[currentRole].actions.map((act, idx) => (
                        <div key={idx} style={{ background: 'rgba(99,102,241,0.03)', padding: 6, borderRadius: 4, display: 'flex', justify: 'space-between', align: 'center' }}>
                          <span style={{ fontSize: '9px', color: '#818cf8', fontWeight: 700 }}>{act.label}</span>
                          <button onClick={() => handleActionClick(act)} style={{ background: '#6366f1', border: 'none', color: '#fff', padding: '2px 6px', borderRadius: 2, fontSize: '8px', cursor: 'pointer' }}>EXECUTE</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(17,24,39,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', height: '170px' }}>
                    <div style={{ flex: 1, overflowY: 'auto', padding: 6, fontSize: '9px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {copilotMsgs.map((m, idx) => <div key={idx} style={{ padding: 4, borderRadius: 2, background: m.sender === 'user' ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.01)' }}>{m.text}</div>)}
                    </div>
                    <div style={{ padding: 4, display: 'flex', gap: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <input type="text" placeholder="Ask copilot..." value={copilotInput} onChange={e => setCopilotInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleCopilotSubmit(copilotInput); }} style={{ flex: 1, background: '#090d16', border: '1px solid rgba(255,255,255,0.05)', color: '#fff', fontSize: '9px', padding: 4 }} />
                      <button onClick={() => handleCopilotSubmit(copilotInput)} style={{ background: '#6366f1', border: 'none', color: '#fff', padding: '0 6px', borderRadius: 2 }}><Send size={8} /></button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: Freight Planning */}
            {activeTab === 'planning' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-5)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  <div style={{ background: 'rgba(17,24,39,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                    <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 800, marginBottom: 8 }}>AI Route Designer</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
                      <div>
                        <label style={{ fontSize: '8px', color: '#6b7280', display: 'block', marginBottom: 2 }}>Tons</label>
                        <input type="number" value={tonsInput} onChange={e => setTonsInput(parseInt(e.target.value) || 0)} style={formInputStyle} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {planningPlans.slice(0, 3).map((opt, idx) => (
                        <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: 8, borderRadius: 4, display: 'flex', justify: 'space-between', align: 'center' }}>
                          <span style={{ fontSize: '10px', color: '#fff' }}>{opt.name}</span>
                          <button onClick={() => handleBookOption(opt.name, opt.cost)} style={{ background: '#10b981', border: 'none', color: '#fff', fontSize: '8px', padding: '3px 8px', borderRadius: 2 }}>Book</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Sandbox */}
                <div style={{ background: 'rgba(17,24,39,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 800 }}>Simulation Sandbox</h3>
                  <div>
                    <label style={{ fontSize: '9px', color: '#9ca3af', display: 'block', marginBottom: 2 }}>Diesel price spike: +{engineState.simulationState.dieselIncrease}%</label>
                    <input type="range" min="0" max="50" value={engineState.simulationState.dieselIncrease} onChange={e => RealityEngine.setDieselSimulation(parseInt(e.target.value))} style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: twins */}
            {activeTab === 'twins' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-5)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  <div style={{ background: 'rgba(17,24,39,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', justify: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: '10px', fontWeight: 800 }}>Digital Twins</span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {['shipment', 'driver', 'route'].map(t => (
                          <button key={t} onClick={() => setSelectedTwin(t)} style={{ fontSize: '8px', color: selectedTwin === t ? '#818cf8' : '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}>{t}</button>
                        ))}
                      </div>
                    </div>
                    {selectedTwin === 'shipment' && <div style={twinGridStyle}><div>Reefer: {engineState.twins.shipment.physical}</div><div>Operational: {engineState.twins.shipment.operational}</div></div>}
                    {selectedTwin === 'driver' && <div style={twinGridStyle}><div>Fatigue: {engineState.twins.driver.risk}</div><div>Operational: {engineState.twins.driver.operational}</div></div>}
                    {selectedTwin === 'route' && <div style={twinGridStyle}><div>Operational: {engineState.twins.route.operational}</div><div>Theft risk: {engineState.twins.route.risk}</div></div>}
                  </div>
                </div>
                {/* Autonomy breakdown */}
                <div style={{ background: 'rgba(17,24,39,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                  <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 800, marginBottom: 8 }}>Autonomy Resolver</h3>
                  {engineState.entities.truck.state === 'broken_down' ? (
                    <button onClick={() => RealityEngine.resolveIncidentBreakdown()} style={{ width: '100%', padding: '6px 0', border: 'none', borderRadius: 4, background: '#10b981', color: '#fff', fontSize: '9px', fontWeight: 800, cursor: 'pointer' }}>Resolve Breakdown</button>
                  ) : (
                    <button onClick={() => RealityEngine.triggerIncidentBreakdown()} style={{ width: '100%', padding: '6px 0', border: '1px solid #ef4444', color: '#ef4444', background: 'transparent', borderRadius: 4, fontSize: '9px', fontWeight: 800, cursor: 'pointer' }}>Trigger Breakdown</button>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: Market */}
            {activeTab === 'market' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-5)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  <div style={{ background: 'rgba(17,24,39,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800 }}>Capacity & Demand Forecast</span>
                    <div style={{ fontSize: '9px', color: '#9ca3af', marginTop: 6 }}>Forecast: {engineState.predictions.capacity.reason}</div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: CFO */}
            {activeTab === 'cfo' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-5)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                  <div style={{ background: 'rgba(17,24,39,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800 }}>CFO Ledger</span>
                    <div style={{ fontSize: '11px', marginTop: 6 }}>Accrued Spend: {engineState.twins.customer.financial}</div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* 2. REALITY ENGINE VIEW MODE */}
      {viewMode === 'engine' && (
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 'var(--space-5)', flex: 1 }}>
          
          {/* Sidebar */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 'var(--radius-lg)', padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 6
          }}>
            {[
              { id: 1, label: 'L1 Event Layer', icon: Compass },
              { id: 2, label: 'L2 Entity Layer', icon: Database },
              { id: 3, label: 'L3 Digital Twin Layer', icon: Layers },
              { id: 4, label: 'L4 Memory Layer', icon: FileText },
              { id: 5, label: 'L5 Learning Layer', icon: RefreshCw },
              { id: 6, label: 'L6 Prediction Layer', icon: Cpu },
              { id: 7, label: 'L7 Simulation Layer', icon: Sliders },
              { id: 8, label: 'L8 Decision Layer', icon: Brain },
              { id: 9, label: 'L9 Execution Layer', icon: ShieldCheck },
              { id: 10, label: 'L10 Evolution Layer', icon: TrendingUp }
            ].map(layer => {
              const Icon = layer.icon;
              const active = activeLayer === layer.id;
              return (
                <button
                  key={layer.id} onClick={() => setActiveLayer(layer.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                    borderRadius: 4, border: 'none', cursor: 'pointer',
                    fontSize: '10px', fontWeight: active ? 800 : 500, textAlign: 'left',
                    background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                    color: active ? '#818cf8' : '#9ca3af'
                  }}
                >
                  <Icon size={12} />
                  {layer.label}
                </button>
              );
            })}
          </div>

          {/* Engine Workspace */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.2)', border: '1px solid rgba(255, 255, 255, 0.03)',
            borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', minHeight: '360px'
          }}>
            
            {/* L1 Event */}
            {activeLayer === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <h4 style={{ fontSize: '11px', fontWeight: 800 }}>Layer 1: Event Capture</h4>
                <div style={{ display: 'flex', gap: 4 }}>
                  <input type="text" placeholder="Inject event..." value={customEventText} onChange={e => setCustomEventText(e.target.value)} style={{ flex: 1, background: '#090d16', border: '1px solid rgba(255,255,255,0.05)', color: '#fff', fontSize: '9px', padding: 6 }} />
                  <button onClick={handleManualEventInject} style={{ background: '#6366f1', border: 'none', color: '#fff', padding: '0 10px', fontSize: '9px', borderRadius: 2, cursor: 'pointer' }}>Inject</button>
                </div>
              </div>
            )}

            {/* L2 Entity */}
            {activeLayer === 2 && (
              <div>
                <h4 style={{ fontSize: '11px', fontWeight: 800, marginBottom: 8 }}>Layer 2: Universal Entity Graph</h4>
                <div style={{ background: '#02040a', borderRadius: 4, height: '180px', display: 'flex', alignItems: 'center', justify: 'center' }}>
                  <svg width="240" height="130" style={{ overflow: 'visible' }}>
                    {graphNodes.map(n => (
                      <circle key={n.id} cx={n.cx / 2} cy={n.cy / 2} r="4" fill={isNodeImpacted(n.id) ? '#ef4444' : n.color} />
                    ))}
                  </svg>
                </div>
              </div>
            )}

            {/* L3 twins */}
            {activeLayer === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h4 style={{ fontSize: '11px', fontWeight: 800, marginBottom: 6 }}>Layer 3: 5-Dimension Digital Twins</h4>
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', padding: 10, borderRadius: 4, fontSize: '9px', color: '#9ca3af' }}>
                  <strong style={{ color: '#fff' }}>Driver Twin (Rajesh Kumar):</strong>
                  <ul style={{ margin: '4px 0 0 10px', padding: 0 }}>
                    <li>Physical: {engineState.twins.driver.physical}</li>
                    <li>Operational: {engineState.twins.driver.operational}</li>
                    <li>Financial: {engineState.twins.driver.financial}</li>
                    <li>Behavioral: {engineState.twins.driver.behavioral}</li>
                    <li>Risk: {engineState.twins.driver.risk}</li>
                  </ul>
                </div>
              </div>
            )}

            {/* L4 Memory */}
            {activeLayer === 4 && (
              <div>
                <h4 style={{ fontSize: '11px', fontWeight: 800, marginBottom: 6 }}>Layer 4: Memory lessons</h4>
                {engineState.lessons.map((l, i) => (
                  <div key={i} style={{ fontSize: '9px', color: '#9ca3af', marginBottom: 6, background: 'rgba(255,255,255,0.01)', padding: 6, borderRadius: 2 }}>
                    <strong>{l.event}</strong>: Factors: {l.factors}
                    <div style={{ color: '#10b981', marginTop: 2 }}>Prevention: {l.recovery}</div>
                  </div>
                ))}
              </div>
            )}

            {/* L5 Learning */}
            {activeLayer === 5 && (
              <div>
                <h4 style={{ fontSize: '11px', fontWeight: 800, marginBottom: 6 }}>Layer 5: Continuous Learning Patterns</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {engineState.learningStats.learnedFeatures.map((f, i) => (
                    <div key={i} style={{ background: 'rgba(99,102,241,0.03)', padding: 6, borderRadius: 2, fontSize: '9px' }}>
                      <strong style={{ color: '#818cf8' }}>{f.name}</strong>: {f.impact}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* L6 Predictions */}
            {activeLayer === 6 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h4 style={{ fontSize: '11px', fontWeight: 800, marginBottom: 6 }}>Layer 6: Foresight Predictions</h4>
                <div style={{ background: 'rgba(255,255,255,0.01)', padding: 10, borderRadius: 4, fontSize: '9.5px' }}>
                  <div style={{ color: '#ef4444', fontWeight: 800 }}>Resignation Risk: {engineState.predictions.resignation.probability}</div>
                  <div style={{ color: '#9ca3af', marginTop: 4 }}>Driver: {engineState.predictions.resignation.driver}</div>
                  <div style={{ color: '#9ca3af', marginTop: 2 }}>Causal factors: {engineState.predictions.resignation.reason}</div>
                </div>
              </div>
            )}

            {/* L7 Simulation */}
            {activeLayer === 7 && (
              <div>
                <h4 style={{ fontSize: '11px', fontWeight: 800, marginBottom: 6 }}>Layer 7: Scenario Simulation Sandbox</h4>
                <label style={{ fontSize: '9px', display: 'block', marginBottom: 4 }}>Diesel Spike: +{engineState.simulationState.dieselIncrease}%</label>
                <input type="range" min="0" max="50" value={engineState.simulationState.dieselIncrease} onChange={e => RealityEngine.setDieselSimulation(parseInt(e.target.value))} />
                {engineState.simulationState.scenarioResult && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: 6, borderRadius: 2, fontSize: '9px', color: '#9ca3af', marginTop: 8 }}>
                    <div>Margin impact: <strong style={{ color: '#ef4444' }}>{engineState.simulationState.scenarioResult.marginImpact}</strong></div>
                    <div>Region risk: <strong>{engineState.simulationState.scenarioResult.regionRisk}</strong></div>
                    <div style={{ color: '#10b981', marginTop: 2 }}>Proposal: {engineState.simulationState.scenarioResult.recommendation}</div>
                  </div>
                )}
              </div>
            )}

            {/* L8 Decision */}
            {activeLayer === 8 && (
              <div>
                <h4 style={{ fontSize: '11px', fontWeight: 800, marginBottom: 6 }}>Layer 8: Decision Engine</h4>
                <div style={{ background: 'rgba(255,255,255,0.01)', padding: 8, borderRadius: 4, fontSize: '9.5px', color: '#9ca3af' }}>
                  <div>Target order: {engineState.decisionPackage.target}</div>
                  <div>Simulated possibilities: <strong>30,000,000</strong></div>
                  <div>Plan Selected: <strong style={{ color: '#10b981' }}>{engineState.decisionPackage.selectedPlan}</strong></div>
                  <div style={{ marginTop: 4 }}>Reasoning: {engineState.decisionPackage.reasoning}</div>
                </div>
              </div>
            )}

            {/* L9 Execution */}
            {activeLayer === 9 && (
              <div>
                <h4 style={{ fontSize: '11px', fontWeight: 800, marginBottom: 6 }}>Layer 9: Autonomous Execution Agents</h4>
                <div style={{ fontSize: '9.5px', color: '#9ca3af' }}>
                  <div>Last automated execution: <strong style={{ color: '#fff' }}>{engineState.executionAgentStatus.lastExecutedAction}</strong></div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 6 }}>
                    {engineState.executionAgentStatus.autoDispatches.map((d, i) => <div key={i} style={{ color: '#10b981' }}>✓ {d}</div>)}
                  </div>
                </div>
              </div>
            )}

            {/* L10 Evolution */}
            {activeLayer === 10 && (
              <div>
                <h4 style={{ fontSize: '11px', fontWeight: 800, marginBottom: 6 }}>Layer 10: Self-Audit Evolution</h4>
                <div style={{ background: 'rgba(255,255,255,0.01)', padding: 8, borderRadius: 4, fontSize: '9.5px', color: '#9ca3af' }}>
                  <div style={{ color: '#ef4444', fontWeight: 800 }}>Weakness: {engineState.evolutionMatrix.selfUpgrades.weakness}</div>
                  <div>Root Cause: {engineState.evolutionMatrix.selfUpgrades.rootCause}</div>
                  <div style={{ color: '#10b981' }}>Action: {engineState.evolutionMatrix.selfUpgrades.newRequirement}</div>
                  <div style={{ color: '#10b981', fontWeight: 800, marginTop: 4 }}>Status: {engineState.evolutionMatrix.selfUpgrades.modelStatus}</div>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Footer Event Ledger Stream */}
      <div style={{
        background: 'rgba(17,24,39,0.3)', border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex',
        flexDirection: 'column', gap: 8
      }}>
        <div style={{ display: 'flex', justify: 'space-between', align: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Activity size={12} color="#10b981" />
            <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ecosystem Event Stream Ledger (Layer 1)</h3>
          </div>
        </div>

        <div style={{
          background: '#02040a', border: '1px solid rgba(255,255,255,0.03)',
          borderRadius: 'var(--radius-md)', padding: 8, fontFamily: 'var(--font-mono)',
          fontSize: '9px', display: 'flex', flexDirection: 'column', gap: 4,
          height: '90px', overflowY: 'auto', color: '#10b981'
        }}>
          {engineState.events.map((e, idx) => (
            <div key={e.id || idx} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
              <span style={{ color: '#6b7280', flexShrink: 0 }}>[{e.timestamp.substring(11, 19)}]</span>
              <span style={{ color: '#818cf8', fontWeight: 700, flexShrink: 0 }}>[{e.type}]</span>
              <span style={{ color: '#fff', flexShrink: 0 }}>{e.source}:</span>
              <span style={{ color: '#10b981' }}>{e.desc}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ---- STYLES ----
const formInputStyle = {
  background: '#090d16',
  border: '1px solid rgba(255,255,255,0.05)',
  color: '#fff',
  padding: '6px 10px',
  fontSize: 'var(--text-xs)',
  borderRadius: 'var(--radius-sm)',
  outline: 'none',
  width: '100%'
};

const kpiCardStyle = {
  background: 'rgba(17,24,39,0.3)',
  border: '1px solid rgba(255,255,255,0.05)',
  padding: '10px 12px',
  borderRadius: 'var(--radius-lg)'
};

const kpiLabelStyle = {
  fontSize: '8px',
  color: '#6b7280',
  textTransform: 'uppercase',
  marginBottom: 2
};

const kpiValStyle = {
  fontSize: '13px',
  fontWeight: 800,
  color: '#fff'
};

const twinGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '6px 10px',
  fontSize: '9px',
  color: '#9ca3af',
  marginTop: 8
};
