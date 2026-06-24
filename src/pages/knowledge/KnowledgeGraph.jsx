/* eslint-disable */
// ============================================================
// GatiFleet — Knowledge Graph Visualization
// The Logistics Brain — Interactive SVG Graph
// ============================================================
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ZoomIn, ZoomOut, RotateCcw, Tag, Network, GitBranch,
  Download, X, Eye, Edit3, Trash2, Building2, Package, Truck,
  User, Route, Fuel, CreditCard, FileText, Warehouse, Users,
  ChevronRight, Filter, BarChart3, Circle, ArrowRight, Layers,
  Maximize2, Info, Link2, Sparkles, Cpu, Terminal, CheckCircle
} from 'lucide-react';
import {
  knowledgeGraphNodes,
  knowledgeGraphEdges,
  nodeTypeColors,
} from '../../data/mockData';

// ---- Node type icon mapping ----
const nodeTypeIcons = {
  business: Building2,
  agent: Cpu,
  shipment: Package,
  truck: Truck,
  driver: User,
  route: Route,
  fuel: Fuel,
  toll: CreditCard,
  invoice: FileText,
  warehouse: Warehouse,
  customer: Users,
};

const nodeTypeLabels = {
  business: 'Business Hub',
  agent: 'AI Agent',
  shipment: 'Shipment',
  truck: 'Truck Twin',
  driver: 'Driver Twin',
  route: 'Corridor Route',
  fuel: 'Fuel Refuel',
  toll: 'Toll Plaza',
  invoice: 'Invoice Billing',
  warehouse: 'Warehouse Hub',
  customer: 'Customer Account',
};

// ---- Mock detail data for each node type and ID ----
const nodeDetailData = {
  // Type defaults
  business: { revenue: '₹186.7Cr', trucks: 48, drivers: 62, routes: 12, shipments: 234, status: 'Active' },
  agent: { department: 'Operations Control', successRate: '98.2%', tasksCompleted: '4,120 runs', memorySize: '4.2 GB', status: 'Active (Sentinel Mode)' },
  shipment: { weight: '12.4 tonnes', value: '₹4,50,000', status: 'In Transit', eta: '6h 30m', distance: '1,240 km' },
  truck: { model: 'Tata Prima', mileage: '4,52,000 km', fuel: '72%', health: 94, speed: '68 km/h', status: 'Active' },
  driver: { rating: 4.7, trips: 1240, experience: '8 years', safety: 96, attendance: '97%', status: 'On Duty' },
  route: { distance: '1,400 km', avgTime: '22h', efficiency: 94, trips: 12450, toll: 8, status: 'Active' },
  fuel: { amount: '320L', cost: '₹28,480', type: 'Diesel', station: 'Indian Oil, NH44', date: '18 Jun 2026' },
  toll: { amount: '₹1,240', plaza: 'Kherki Daula', highway: 'NH48', fastag: 'Yes', date: '18 Jun 2026' },
  invoice: { amount: '₹4,50,000', gst: '₹81,000', status: 'Paid', date: '15 Jun 2026', customer: 'Reliance' },
  warehouse: { capacity: '50,000 sq ft', utilization: '78%', inventory: 1240, city: 'Delhi', status: 'Operational' },
  customer: { shipments: 234, revenue: '₹12.4Cr', since: '2021', health: 92, churn: 'Low', status: 'Active' },

  // Node ID-specific overrides (for active network gaps)
  inv2: { invoiceId: 'IOC-2026-8923', vendor: 'Indian Oil Corp', discrepancy: '₹27,000', status: 'GST Mismatch' },
  drv3: { name: 'Ashok Pandey', rating: 4.0, safetyScore: 62, fatigueLevel: '75% (Fatigued)', status: 'On Duty' },
  rte3: { corridor: 'Eastern Corridor (Kolkata-Guwahati)', distance: '990 km', delay: '8.5h (Landslide)', status: 'Blocked' },
  fuel2: { name: 'BPCL Fuel Card Wallet', walletBalance: '₹850 (Low)', threshold: '₹1,000', autoRecharge: 'Off' },
  trk1: { id: 'TRK-00012', model: 'Volvo FM420', fuelLevel: '72%', tyrePressure: '82 PSI (Low Leak)', health: 94, status: 'Active' },
  cus4: { name: 'Dabur Distribution', bookingsDrop: '32%', health: 42, churnRisk: 'Critical', status: 'Risk Alert' },
  shp1: { ewayBill: 'EWB892731', value: '₹4,50,000', cargo: 'Dairy FMCG Cold Chain', temp: '14°C (Spike)', status: 'In Transit' },
  inv1: { invoiceId: 'INV-004458', customer: 'Safexpress', amount: '₹1.8L', ewayBill: 'EWB-445892', status: 'Expired (2h ago)' },
  cus1: { name: 'Reliance Industries', revenue: '₹12.8Cr', strategicScore: 95, activeDisputes: 1, status: 'Fee Dispute' },
  trk4: { id: 'TRK-00019', model: 'Eicher Pro 6049', health: 76, telemetrySync: 'Lagging (68%)', status: 'Telemetry Lag' }
};

// ---- Styles ----
const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
    background: 'var(--bg-900)',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text-primary)',
    overflow: 'hidden',
    position: 'relative',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    background: 'var(--bg-800)',
    borderBottom: '1px solid var(--surface-border)',
    zIndex: 20,
    gap: '12px',
    flexShrink: 0,
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  toolbarTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  titleIcon: {
    width: 36,
    height: 36,
    borderRadius: 'var(--radius-md)',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
  },
  titleText: {
    fontSize: '18px',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #e0e0e0, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.3px',
  },
  titleSub: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  toolbarCenter: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'var(--bg-700)',
    borderRadius: 'var(--radius-md)',
    padding: '4px',
    border: '1px solid var(--surface-border)',
  },
  toolBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 34,
    height: 34,
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  toolBtnActive: {
    background: 'rgba(99, 102, 241, 0.15)',
    color: '#818cf8',
  },
  toolBtnGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    background: 'var(--bg-700)',
    borderRadius: 'var(--radius-md)',
    padding: '4px',
    border: '1px solid var(--surface-border)',
  },
  viewToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'var(--font-sans)',
  },
  zoomBadge: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    minWidth: '42px',
    textAlign: 'center',
  },
  mainArea: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  sidebar: {
    width: 280,
    flexShrink: 0,
    background: 'var(--bg-800)',
    borderRight: '1px solid var(--surface-border)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 10,
  },
  sidebarSection: {
    padding: '16px',
    borderBottom: '1px solid var(--surface-border)',
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--text-muted)',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: 'var(--bg-700)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--surface-border)',
    transition: 'border-color 0.2s',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    color: 'var(--text-primary)',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'var(--font-sans)',
  },
  filterItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 8px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'background 0.15s',
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: '4px',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
  },
  statLabel: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
  },
  statValue: {
    fontSize: '14px',
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-primary)',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    flexShrink: 0,
  },
  canvas: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    cursor: 'grab',
  },
  detailPanel: {
    width: 320,
    flexShrink: 0,
    background: 'var(--bg-800)',
    borderLeft: '1px solid var(--surface-border)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 10,
  },
  detailHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid var(--surface-border)',
  },
  detailHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  detailIcon: {
    width: 44,
    height: 44,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'var(--bg-700)',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  detailBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 20px',
  },
  detailMetric: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    background: 'var(--bg-700)',
    borderRadius: 'var(--radius-sm)',
    marginBottom: '6px',
    border: '1px solid var(--surface-border)',
  },
  detailMetricLabel: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  detailMetricValue: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
  },
  connectionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    background: 'var(--bg-700)',
    borderRadius: 'var(--radius-sm)',
    marginBottom: '6px',
    border: '1px solid var(--surface-border)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  },
  actionBtns: {
    display: 'flex',
    gap: '8px',
    padding: '16px 20px',
    borderTop: '1px solid var(--surface-border)',
  },
  actionBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--surface-border)',
    background: 'var(--bg-700)',
    color: 'var(--text-secondary)',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'var(--font-sans)',
  },
  actionBtnPrimary: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'var(--font-sans)',
  },
  toastAlert: {
    position: 'absolute',
    top: '70px',
    left: '300px',
    zIndex: 9999,
    padding: '10px 16px',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(16px)',
    border: '1px solid #38CE3C',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
  },
};

// ---- Keyframe injection for edge animation ----
const EDGE_ANIMATION_STYLE = `
  @keyframes dashFlow {
    to { stroke-dashoffset: -30; }
  }
  @keyframes pulseGlow {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
  @keyframes nodeFloat {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-3px); }
  }
`;

const KnowledgeGraph = () => {
  // ---- State ----
  const [nodes, setNodes] = useState(() =>
    knowledgeGraphNodes.map(n => ({ ...n, x: n.x * 1.15, y: n.y * 1.05 }))
  );
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLabels, setShowLabels] = useState(true);
  const [viewMode, setViewMode] = useState('graph');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [activeFilters, setActiveFilters] = useState(() =>
    Object.keys(nodeTypeColors).reduce((acc, type) => ({ ...acc, [type]: true }), {})
  );

  const [sidebarTab, setSidebarTab] = useState('gaps'); // Default to AI Gap Analyzer to highlight anomalies
  const [nodeDetails, setNodeDetails] = useState(nodeDetailData);
  const [actionAlert, setActionAlert] = useState(null);
  const [terminalLogs, setTerminalLogs] = useState([
    'Knowledge Graph Cognitive Engine initialized.',
    'Graph telemetry synced. 10 anomalies flagged.'
  ]);

  const [gaps, setGaps] = useState([
    { id: 'gap1', nodeTarget: 'inv2', title: 'GST Invoice Mismatch', desc: '₹27,000 GSTR-2B discrepancy with Indian Oil.', status: 'open', solution: 'Reconcile Invoice', log: 'Pushed correct GSTIN tax voucher to GSTR-2B government ledger.' },
    { id: 'gap2', nodeTarget: 'drv3', title: 'Driver HOS Fatigue Alert', desc: 'Ashok Pandey exceeded 11h driving time limits.', status: 'open', solution: 'Force Driver Rest', log: 'Shifted Ashok Pandey to mandatory rest. Assigned backup driver Rajesh Kumar.' },
    { id: 'gap3', nodeTarget: 'rte3', title: 'Siliguri Route Blockage', desc: 'Landslide on Eastern Corridor (NH27) causing 8.5h ETA lag.', status: 'open', solution: 'Route SH-14 Bypass', log: 'Rerouted 8 en-route shipments via green bypass corridor SH-14.' },
    { id: 'gap4', nodeTarget: 'fuel2', title: 'Toll Plaza Balance Low', desc: 'BPCL Toll Card wallet below ₹1,000 threshold.', status: 'open', solution: 'Auto-Recharge Wallet', log: 'Dispatched ₹5,000 auto-payment transfer to BPCL Fastag account.' },
    { id: 'gap5', nodeTarget: 'trk1', title: 'TPMS Tyre Pressure Low', desc: 'Rear drive tyres reporting under-inflated 82 PSI leak.', status: 'open', solution: 'Dispatch Repair Crew', log: 'Alerted nearest roadside recovery crew. Sensor recalibration complete.' },
    { id: 'gap6', nodeTarget: 'cus4', title: 'Enterprise Churn Hazard', desc: 'Dabur distribution booking dropped by 32% (competitor undercuts).', status: 'open', solution: 'Authorize Rebate Code', log: 'Authorized 8% capacity rebate code. Client sentiment restored to Neutral.' },
    { id: 'gap7', nodeTarget: 'shp1', title: 'Reefer Cold Chain Overtemp', desc: 'FMCG dairy shipment cargo temp spiked to 14°C.', status: 'open', solution: 'Remote Reefer Reset', log: 'Transmitted OTA thermostat calibration. Reefer setpoint locked at -4°C.' },
    { id: 'gap8', nodeTarget: 'inv1', title: 'E-Way Bill Validity Expired', desc: 'Vapi corridor bill EWB-445892 expired 2h ago.', status: 'open', solution: 'Extend E-Way Bill 24h', log: 'Logged Nic government extension. E-way bill validity extended for 24h.' },
    { id: 'gap9', nodeTarget: 'cus1', title: 'Billing SLA Fee Dispute', desc: 'Reliance disputed ₹1.5L late delivery penalty fee.', status: 'open', solution: 'Waive Penalty Dispute', log: 'Approved billing credit waiver. Disputed SLA penalty cleared.' },
    { id: 'gap10', nodeTarget: 'trk4', title: 'IoT Gateway Telemetry Lag', desc: 'TRK-00019 gateway packet drops (loss of edge sync).', status: 'open', solution: 'Push Firmware OTA Update', log: 'Dispatched firmware v3.4.1 patch. p99 telemetry latency restored to 22ms.' }
  ]);

  const showToast = (message) => {
    setActionAlert({ message });
    setTimeout(() => setActionAlert(null), 4000);
  };

  const logToTerminal = (msg) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setTerminalLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 8)]);
  };

  const resolveGap = (gapId) => {
    const gap = gaps.find(g => g.id === gapId);
    if (!gap) return;

    setGaps(prev => prev.map(g => g.id === gapId ? { ...g, status: 'resolved' } : g));

    setNodeDetails(prev => {
      const copy = { ...prev };
      if (gap.nodeTarget === 'inv2') {
        copy.inv2 = { ...copy.inv2, status: 'Reconciled', discrepancy: '₹0 (Matched)' };
      } else if (gap.nodeTarget === 'drv3') {
        copy.drv3 = { ...copy.drv3, status: 'Resting', fatigueLevel: '5% (Resting)' };
      } else if (gap.nodeTarget === 'rte3') {
        copy.rte3 = { ...copy.rte3, status: 'Bypass Active', delay: '0 mins (Savings 2h)' };
      } else if (gap.nodeTarget === 'fuel2') {
        copy.fuel2 = { ...copy.fuel2, status: 'Auto-Recharged', walletBalance: '₹5,850 (Nominal)', autoRecharge: 'Active' };
      } else if (gap.nodeTarget === 'trk1') {
        copy.trk1 = { ...copy.trk1, status: 'Calibrated', tyrePressure: '110 PSI (Nominal)', health: 98 };
      } else if (gap.nodeTarget === 'cus4') {
        copy.cus4 = { ...copy.cus4, status: 'Active', churnRisk: 'Low', health: 90 };
      } else if (gap.nodeTarget === 'shp1') {
        copy.shp1 = { ...copy.shp1, status: 'In Transit', temp: '-4°C (Nominal)' };
      } else if (gap.nodeTarget === 'inv1') {
        copy.inv1 = { ...copy.inv1, status: 'Extended 24h' };
      } else if (gap.nodeTarget === 'cus1') {
        copy.cus1 = { ...copy.cus1, status: 'Settled', strategicScore: 100, activeDisputes: 0 };
      } else if (gap.nodeTarget === 'trk4') {
        copy.trk4 = { ...copy.trk4, status: 'Synchronized', telemetrySync: 'Active (100%)', health: 100 };
      }
      return copy;
    });

    logToTerminal(`Remediation executed for ${gap.title}: ${gap.log}`);
    showToast(`Resolved network gap: ${gap.title}`);
  };

  const svgRef = useRef(null);
  const draggingRef = useRef(null);
  const [isDraggingNode, setIsDraggingNode] = useState(false);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const panOffsetRef = useRef({ x: 0, y: 0 });

  // ---- Inject keyframes ----
  useEffect(() => {
    const id = 'kg-edge-anim-style';
    if (!document.getElementById(id)) {
      const styleEl = document.createElement('style');
      styleEl.id = id;
      styleEl.textContent = EDGE_ANIMATION_STYLE;
      document.head.appendChild(styleEl);
    }
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, []);

  // ---- Computed data ----
  const filteredNodes = useMemo(() => {
    return nodes.filter(n => {
      if (!activeFilters[n.type]) return false;
      if (searchQuery && !n.label.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [nodes, activeFilters, searchQuery]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  const filteredEdges = useMemo(() => {
    return knowledgeGraphEdges.filter(e => filteredNodeIds.has(e.from) && filteredNodeIds.has(e.to));
  }, [filteredNodeIds]);

  const nodeTypeCounts = useMemo(() => {
    const counts = {};
    Object.keys(nodeTypeColors).forEach(type => { counts[type] = 0; });
    nodes.forEach(n => { counts[n.type] = (counts[n.type] || 0) + 1; });
    return counts;
  }, [nodes]);

  const getNodeById = useCallback((id) => {
    return nodes.find(n => n.id === id);
  }, [nodes]);

  const getNodeConnections = useCallback((nodeId) => {
    return knowledgeGraphEdges
      .filter(e => e.from === nodeId || e.to === nodeId)
      .map(e => {
        const otherId = e.from === nodeId ? e.to : e.from;
        const other = getNodeById(otherId);
        return { edge: e, node: other, direction: e.from === nodeId ? 'outgoing' : 'incoming' };
      })
      .filter(c => c.node);
  }, [getNodeById]);

  const hoveredConnections = useMemo(() => {
    if (!hoveredNode) return new Set();
    const connections = getNodeConnections(hoveredNode);
    const ids = new Set([hoveredNode]);
    connections.forEach(c => ids.add(c.node.id));
    return ids;
  }, [hoveredNode, getNodeConnections]);

  // ---- Handlers ----
  const toggleFilter = (type) => {
    setActiveFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.15, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.15, 0.3));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleNodeMouseDown = (e, nodeId) => {
    e.stopPropagation();
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    draggingRef.current = {
      nodeId,
      startX: (e.clientX - rect.left) / zoom - pan.x,
      startY: (e.clientY - rect.top) / zoom - pan.y,
    };
    setIsDraggingNode(true);
  };

  const handleMouseMove = useCallback((e) => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();

    if (draggingRef.current) {
      const mx = (e.clientX - rect.left) / zoom - pan.x;
      const my = (e.clientY - rect.top) / zoom - pan.y;
      const node = getNodeById(draggingRef.current.nodeId);
      if (!node) return;
      const dx = mx - draggingRef.current.startX;
      const dy = my - draggingRef.current.startY;
      setNodes(prev =>
        prev.map(n =>
          n.id === draggingRef.current.nodeId
            ? { ...n, x: n.x + dx, y: n.y + dy }
            : n
        )
      );
      draggingRef.current.startX = mx;
      draggingRef.current.startY = my;
    } else if (isPanningRef.current) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      setPan({
        x: panOffsetRef.current.x + dx / zoom,
        y: panOffsetRef.current.y + dy / zoom,
      });
    }
  }, [zoom, pan, getNodeById]);

  const handleMouseUp = useCallback(() => {
    draggingRef.current = null;
    isPanningRef.current = false;
    setIsDraggingNode(false);
  }, []);

  const handleCanvasMouseDown = (e) => {
    if (e.target === svgRef.current || e.target.tagName === 'rect') {
      isPanningRef.current = true;
      panStartRef.current = { x: e.clientX, y: e.clientY };
      panOffsetRef.current = { ...pan };
    }
  };

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setZoom(z => Math.max(0.3, Math.min(3, z + delta)));
  }, []);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (svgEl) {
      svgEl.addEventListener('wheel', handleWheel, { passive: false });
      return () => svgEl.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleNodeClick = (nodeId) => {
    setSelectedNode(nodeId === selectedNode ? null : nodeId);
  };

  // ---- Build curved edge path ----
  const getEdgePath = (fromNode, toNode) => {
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const curvature = Math.min(dist * 0.2, 60);
    const mx = (fromNode.x + toNode.x) / 2;
    const my = (fromNode.y + toNode.y) / 2;
    // Perpendicular offset for curve
    const nx = -dy / dist;
    const ny = dx / dist;
    const cx = mx + nx * curvature;
    const cy = my + ny * curvature;
    return `M ${fromNode.x} ${fromNode.y} Q ${cx} ${cy} ${toNode.x} ${toNode.y}`;
  };

  // ---- Selected node data ----
  const selectedNodeData = selectedNode ? getNodeById(selectedNode) : null;
  const selectedConnections = selectedNode ? getNodeConnections(selectedNode) : [];

  const selectedDetails = useMemo(() => {
    if (!selectedNodeData) return {};
    return nodeDetails[selectedNodeData.id] || nodeDetails[selectedNodeData.type] || {};
  }, [selectedNodeData, nodeDetails]);

  const activeNodeGap = useMemo(() => {
    if (!selectedNode) return null;
    return gaps.find(g => g.nodeTarget === selectedNode && g.status === 'open');
  }, [selectedNode, gaps]);

  // ---- Tree layout (simple top-down BFS from business node) ----
  const treeNodes = useMemo(() => {
    if (viewMode !== 'tree') return filteredNodes;
    const root = filteredNodes.find(n => n.type === 'business') || filteredNodes[0];
    if (!root) return filteredNodes;

    const visited = new Set();
    const levels = [];
    let queue = [root.id];
    visited.add(root.id);

    while (queue.length > 0) {
      levels.push([...queue]);
      const nextQueue = [];
      for (const id of queue) {
        const conns = getNodeConnections(id);
        for (const c of conns) {
          if (!visited.has(c.node.id) && filteredNodeIds.has(c.node.id)) {
            visited.add(c.node.id);
            nextQueue.push(c.node.id);
          }
        }
      }
      queue = nextQueue;
    }

    // Place unvisited nodes
    filteredNodes.forEach(n => {
      if (!visited.has(n.id)) {
        levels.push([n.id]);
        visited.add(n.id);
      }
    });

    const positioned = {};
    const canvasWidth = 800;
    const levelSpacing = 120;

    levels.forEach((level, li) => {
      const count = level.length;
      const spacing = canvasWidth / (count + 1);
      level.forEach((id, ni) => {
        positioned[id] = {
          x: spacing * (ni + 1),
          y: 80 + li * levelSpacing,
        };
      });
    });

    return filteredNodes.map(n => ({
      ...n,
      x: positioned[n.id]?.x ?? n.x,
      y: positioned[n.id]?.y ?? n.y,
    }));
  }, [viewMode, filteredNodes, filteredNodeIds, getNodeConnections]);

  const displayNodes = viewMode === 'tree' ? treeNodes : filteredNodes;
  const displayNodeMap = useMemo(() => {
    const map = {};
    displayNodes.forEach(n => { map[n.id] = n; });
    return map;
  }, [displayNodes]);

  return (
    <div style={styles.page}>
      {/* ---- TOOLBAR ---- */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <div style={styles.toolbarTitle}>
            <div style={styles.titleIcon}>
              <Network size={18} color="#fff" />
            </div>
            <div>
              <div style={styles.titleText}>Knowledge Graph</div>
              <div style={styles.titleSub}>Logistics Intelligence Network</div>
            </div>
          </div>
        </div>

        <div style={styles.toolbarCenter}>
          <button
            style={{
              ...styles.toolBtn,
              ...(showLabels ? styles.toolBtnActive : {}),
            }}
            onClick={() => setShowLabels(!showLabels)}
            title="Toggle labels"
          >
            <Tag size={16} />
          </button>

          <div style={{ width: 1, height: 20, background: 'var(--surface-border)' }} />

          <button style={styles.toolBtn} onClick={handleZoomOut} title="Zoom out">
            <ZoomOut size={16} />
          </button>
          <span style={styles.zoomBadge}>{Math.round(zoom * 100)}%</span>
          <button style={styles.toolBtn} onClick={handleZoomIn} title="Zoom in">
            <ZoomIn size={16} />
          </button>

          <div style={{ width: 1, height: 20, background: 'var(--surface-border)' }} />

          <button style={styles.toolBtn} onClick={handleResetView} title="Reset view">
            <RotateCcw size={16} />
          </button>
          <button style={styles.toolBtn} title="Fit to screen" onClick={() => { setZoom(0.85); setPan({ x: 20, y: 10 }); }}>
            <Maximize2 size={16} />
          </button>
        </div>

        <div style={styles.toolBtnGroup}>
          <button
            style={{
              ...styles.viewToggle,
              background: viewMode === 'graph' ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: viewMode === 'graph' ? '#818cf8' : 'var(--text-muted)',
            }}
            onClick={() => setViewMode('graph')}
          >
            <Network size={14} /> Graph
          </button>
          <button
            style={{
              ...styles.viewToggle,
              background: viewMode === 'tree' ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: viewMode === 'tree' ? '#818cf8' : 'var(--text-muted)',
            }}
            onClick={() => setViewMode('tree')}
          >
            <GitBranch size={14} /> Tree
          </button>

          <div style={{ width: 1, height: 20, background: 'var(--surface-border)' }} />

          <button style={styles.toolBtn} title="Export graph">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* ---- MAIN AREA ---- */}
      <div style={styles.mainArea}>
        {/* ---- LEFT SIDEBAR ---- */}
        <motion.div
          style={styles.sidebar}
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Sidebar Tabs Selector */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--surface-border)', background: 'var(--bg-900)', flexShrink: 0 }}>
            <button
              onClick={() => setSidebarTab('filters')}
              style={{
                flex: 1, padding: '12px 0', fontSize: '10px', fontWeight: 700, border: 'none', cursor: 'pointer',
                background: sidebarTab === 'filters' ? 'var(--bg-800)' : 'transparent',
                color: sidebarTab === 'filters' ? '#818cf8' : 'var(--text-muted)', outline: 'none', textTransform: 'uppercase', letterSpacing: '0.04em'
              }}
            >
              Filters & Legend
            </button>
            <button
              onClick={() => setSidebarTab('gaps')}
              style={{
                flex: 1, padding: '12px 0', fontSize: '10px', fontWeight: 700, border: 'none', cursor: 'pointer',
                background: sidebarTab === 'gaps' ? 'var(--bg-800)' : 'transparent',
                color: sidebarTab === 'gaps' ? '#818cf8' : 'var(--text-muted)', outline: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.04em'
              }}
            >
              <Sparkles size={11} color={sidebarTab === 'gaps' ? '#818cf8' : 'var(--text-muted)'} />
              AI Gaps ({gaps.filter(g => g.status === 'open').length})
            </button>
          </div>

          {sidebarTab === 'filters' ? (
            <>
              {/* Search */}
              <div style={styles.sidebarSection}>
                <div style={styles.sectionTitle}>
                  <Search size={12} /> Search Nodes
                </div>
                <div style={styles.searchBox}>
                  <Search size={14} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="Search nodes..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={styles.searchInput}
                  />
                  {searchQuery && (
                    <button
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, display: 'flex' }}
                      onClick={() => setSearchQuery('')}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  Showing {filteredNodes.length} of {nodes.length} nodes
                </div>
              </div>

              {/* Filters */}
              <div style={{ ...styles.sidebarSection, flex: 1, overflowY: 'auto' }}>
                <div style={styles.sectionTitle}>
                  <Filter size={12} /> Filter by Type
                </div>
                {Object.entries(nodeTypeColors).map(([type, color]) => {
                  const IconComp = nodeTypeIcons[type] || Circle;
                  return (
                    <div
                      key={type}
                      style={{
                        ...styles.filterItem,
                        background: activeFilters[type] ? `${color}08` : 'transparent',
                      }}
                      onClick={() => toggleFilter(type)}
                    >
                      <div
                        style={{
                          ...styles.checkbox,
                          borderColor: color,
                          background: activeFilters[type] ? color : 'transparent',
                        }}
                      >
                        {activeFilters[type] && (
                          <svg width="10" height="10" viewBox="0 0 10 10">
                            <path d="M2 5 L4 7 L8 3" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <IconComp size={14} color={color} />
                      <span style={{ flex: 1 }}>{nodeTypeLabels[type]}</span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-muted)',
                        background: 'var(--bg-700)',
                        padding: '2px 8px',
                        borderRadius: '10px',
                      }}>
                        {nodeTypeCounts[type] || 0}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Stats */}
              <div style={styles.sidebarSection}>
                <div style={styles.sectionTitle}>
                  <BarChart3 size={12} /> Graph Stats
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Total Nodes</span>
                  <span style={{ ...styles.statValue, color: '#818cf8' }}>{nodes.length}</span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Total Edges</span>
                  <span style={{ ...styles.statValue, color: '#38CE3C' }}>{knowledgeGraphEdges.length}</span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Visible Nodes</span>
                  <span style={{ ...styles.statValue, color: '#f59e0b' }}>{filteredNodes.length}</span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Visible Edges</span>
                  <span style={{ ...styles.statValue, color: '#ec4899' }}>{filteredEdges.length}</span>
                </div>
              </div>

              {/* Legend */}
              <div style={styles.sidebarSection}>
                <div style={styles.sectionTitle}>
                  <Layers size={12} /> Legend
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {Object.entries(nodeTypeColors).map(([type, color]) => (
                    <div key={type} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '3px 8px',
                      background: `${color}10`,
                      borderRadius: '12px',
                      border: `1px solid ${color}30`,
                      fontSize: '10px',
                      fontWeight: 600,
                      color: color,
                    }}>
                      <div style={{ ...styles.legendDot, background: color }} />
                      {nodeTypeLabels[type]}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* AI Gaps Checklist tab */}
              <div style={{ ...styles.sidebarSection, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={styles.sectionTitle}>
                  <Sparkles size={12} color="#818cf8" /> Anomaly Diagnostics Feed
                </div>
                {gaps.map(gap => {
                  const node = nodes.find(n => n.id === gap.nodeTarget);
                  const color = nodeTypeColors[node?.type] || '#64748b';
                  return (
                    <div
                      key={gap.id}
                      onClick={() => {
                        setSelectedNode(gap.nodeTarget);
                        if (node) {
                          // Center node inside SVG view
                          setPan({ x: -node.x + 180, y: -node.y + 200 });
                        }
                      }}
                      style={{
                        background: 'var(--bg-700)',
                        border: `1px solid ${gap.status === 'open' ? 'rgba(255, 77, 107, 0.25)' : 'var(--surface-border)'}`,
                        borderRadius: 'var(--radius-sm)',
                        padding: 10,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        opacity: gap.status === 'resolved' ? 0.6 : 1
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 11, color: gap.status === 'open' ? '#FF4D6B' : '#38CE3C' }}>
                          {gap.status === 'open' ? '🚨 ' : '✓ '} {gap.title}
                        </span>
                        <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{nodeTypeLabels[node?.type]}</span>
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.3 }}>{gap.desc}</div>
                      
                      {gap.status === 'open' ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); resolveGap(gap.id); }}
                          style={{
                            background: '#818cf8', border: 'none', color: '#fff', fontSize: 9, fontWeight: 700,
                            padding: '4px 8px', borderRadius: 4, cursor: 'pointer', width: '100%'
                          }}
                        >
                          Authorize: {gap.solution}
                        </button>
                      ) : (
                        <div style={{ fontSize: 9, color: '#38CE3C', fontWeight: 600 }}>Remediation Completed</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Cognitive Terminal Log for Graph Ops */}
              <div style={styles.sidebarSection}>
                <div style={styles.sectionTitle}>
                  <Terminal size={12} /> Graph Operations Console
                </div>
                <div style={{
                  background: '#040711', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 6,
                  padding: '6px 10px', fontFamily: 'monospace', fontSize: 9, color: '#38CE3C', display: 'flex',
                  flexDirection: 'column', gap: 4, height: '85px', overflowY: 'auto'
                }}>
                  {terminalLogs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* ---- SVG CANVAS ---- */}
        <div
          style={{
            ...styles.canvas,
            cursor: isDraggingNode ? 'grabbing' : 'grab',
          }}
          onMouseDown={handleCanvasMouseDown}
        >
          {/* Background pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--surface-border) 1px, transparent 0)`,
            backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
            backgroundPosition: `${pan.x * zoom}px ${pan.y * zoom}px`,
            opacity: 0.5,
            pointerEvents: 'none',
          }} />

          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            style={{ position: 'absolute', inset: 0 }}
          >
            <defs>
              {/* Glow filters for each node type */}
              {Object.entries(nodeTypeColors).map(([type, color]) => (
                <filter key={type} id={`glow-${type}`} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feFlood floodColor={color} floodOpacity="0.6" result="color" />
                  <feComposite in="color" in2="blur" operator="in" result="shadow" />
                  <feMerge>
                    <feMergeNode in="shadow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              ))}
              {/* Highlight glow */}
              <filter id="glow-highlight" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="10" result="blur" />
                <feFlood floodColor="#818cf8" floodOpacity="0.8" result="color" />
                <feComposite in="color" in2="blur" operator="in" result="shadow" />
                <feMerge>
                  <feMergeNode in="shadow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Arrow marker */}
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6" fill="var(--text-muted)" opacity="0.5" />
              </marker>
              {Object.entries(nodeTypeColors).map(([type, color]) => (
                <marker key={`arr-${type}`} id={`arrow-${type}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6" fill={color} opacity="0.7" />
                </marker>
              ))}
            </defs>

            <g transform={`scale(${zoom}) translate(${pan.x}, ${pan.y})`}>
              {/* ---- EDGES ---- */}
              {filteredEdges.map((edge, i) => {
                const fromNode = displayNodeMap[edge.from];
                const toNode = displayNodeMap[edge.to];
                if (!fromNode || !toNode) return null;

                const isHighlighted =
                  hoveredNode &&
                  (edge.from === hoveredNode || edge.to === hoveredNode);
                const isSelected =
                  selectedNode &&
                  (edge.from === selectedNode || edge.to === selectedNode);
                const isDimmed = hoveredNode && !isHighlighted;
                const edgeColor = nodeTypeColors[fromNode.type] || '#64748b';

                return (
                  <g key={`edge-${i}`}>
                    {/* Edge glow on hover */}
                    {(isHighlighted || isSelected) && (
                      <path
                        d={getEdgePath(fromNode, toNode)}
                        fill="none"
                        stroke={edgeColor}
                        strokeWidth={4}
                        opacity={0.15}
                        strokeLinecap="round"
                      />
                    )}
                    {/* Main edge */}
                    <path
                      d={getEdgePath(fromNode, toNode)}
                      fill="none"
                      stroke={isHighlighted || isSelected ? edgeColor : 'var(--text-muted)'}
                      strokeWidth={isHighlighted || isSelected ? 2 : 1.2}
                      strokeDasharray={isHighlighted || isSelected ? '8 4' : '6 4'}
                      opacity={isDimmed ? 0.1 : isHighlighted || isSelected ? 0.9 : 0.3}
                      strokeLinecap="round"
                      markerEnd={isHighlighted || isSelected ? `url(#arrow-${fromNode.type})` : 'url(#arrowhead)'}
                      style={{
                        animation: isHighlighted || isSelected
                          ? 'dashFlow 0.8s linear infinite'
                          : 'dashFlow 3s linear infinite',
                        transition: 'opacity 0.3s, stroke-width 0.3s',
                      }}
                    />
                    {/* Edge label */}
                    {showLabels && (isHighlighted || isSelected) && (
                      <text
                        x={(fromNode.x + toNode.x) / 2}
                        y={(fromNode.y + toNode.y) / 2 - 10}
                        textAnchor="middle"
                        fontSize="10"
                        fontFamily="var(--font-sans)"
                        fontWeight="600"
                        fill={edgeColor}
                        opacity={0.9}
                      >
                        {edge.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* ---- NODES ---- */}
              {displayNodes.map(node => {
                const activeGap = gaps.find(g => g.nodeTarget === node.id && g.status === 'open');
                const color = activeGap ? '#FF4D6B' : (nodeTypeColors[node.type] || '#64748b');
                const IconComp = nodeTypeIcons[node.type] || Circle;
                const isHovered = hoveredNode === node.id;
                const isSelected = selectedNode === node.id;
                const isDimmed =
                  hoveredNode &&
                  !hoveredConnections.has(node.id);
                const radius = (node.size || 25) * (isHovered || isSelected ? 1.15 : 1);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onMouseDown={e => handleNodeMouseDown(e, node.id)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => handleNodeClick(node.id)}
                    style={{
                      cursor: 'pointer',
                      opacity: isDimmed ? 0.15 : 1,
                      transition: 'opacity 0.3s',
                    }}
                  >
                    {/* Anomaly blinking halo ring */}
                    {activeGap && (
                      <circle
                        r={radius + 8}
                        fill="none"
                        stroke="#FF4D6B"
                        strokeWidth={2}
                        opacity={0.6}
                        style={{ animation: 'pulseGlow 1.2s ease-in-out infinite' }}
                      />
                    )}
                    {/* Outer ring pulse on selected */}
                    {isSelected && (
                      <>
                        <circle
                          r={radius + 12}
                          fill="none"
                          stroke={color}
                          strokeWidth={2}
                          opacity={0.2}
                          style={{ animation: 'pulseGlow 2s ease-in-out infinite' }}
                        />
                        <circle
                          r={radius + 6}
                          fill="none"
                          stroke={color}
                          strokeWidth={1.5}
                          opacity={0.4}
                          style={{ animation: 'pulseGlow 2s ease-in-out infinite 0.5s' }}
                        />
                      </>
                    )}

                    {/* Glow ring on hover */}
                    {isHovered && !isSelected && (
                      <circle
                        r={radius + 8}
                        fill="none"
                        stroke={color}
                        strokeWidth={2}
                        opacity={0.3}
                        style={{ animation: 'pulseGlow 1.5s ease-in-out infinite' }}
                      />
                    )}

                    {/* Node background glow */}
                    <circle
                      r={radius + 3}
                      fill={color}
                      opacity={isHovered || isSelected ? 0.15 : 0.06}
                      style={{ transition: 'all 0.3s' }}
                    />

                    {/* Main circle */}
                    <circle
                      r={radius}
                      fill={`${color}18`}
                      stroke={color}
                      strokeWidth={isHovered || isSelected ? 2.5 : 1.5}
                      filter={isHovered || isSelected ? `url(#glow-${node.type})` : undefined}
                      style={{ transition: 'all 0.3s' }}
                    />

                    {/* Inner gradient circle */}
                    <circle
                      r={radius * 0.7}
                      fill={`${color}25`}
                      style={{ transition: 'all 0.3s' }}
                    />

                    {/* Icon (rendered as text since we can't use React components inside SVG foreignObject reliably) */}
                    <foreignObject
                      x={-10}
                      y={-10}
                      width={20}
                      height={20}
                      style={{ overflow: 'visible', pointerEvents: 'none' }}
                    >
                      <div
                        xmlns="http://www.w3.org/1999/xhtml"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 20,
                          height: 20,
                        }}
                      >
                        <IconComp size={radius * 0.5} color={color} strokeWidth={2.2} />
                      </div>
                    </foreignObject>

                    {/* Label */}
                    {showLabels && (
                      <text
                        y={radius + 16}
                        textAnchor="middle"
                        fontSize="11"
                        fontFamily="var(--font-sans)"
                        fontWeight="600"
                        fill="var(--text-secondary)"
                        style={{
                          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
                          opacity: isDimmed ? 0.3 : 1,
                          transition: 'opacity 0.3s',
                        }}
                      >
                        {node.label}
                      </text>
                    )}

                    {/* Type badge */}
                    {(isHovered || isSelected) && (
                      <text
                        y={-radius - 8}
                        textAnchor="middle"
                        fontSize="9"
                        fontFamily="var(--font-sans)"
                        fontWeight="700"
                        fill={color}
                        textTransform="uppercase"
                        letterSpacing="0.5"
                      >
                        {nodeTypeLabels[node.type]}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Canvas info overlay */}
          <div style={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            display: 'flex',
            gap: '8px',
            pointerEvents: 'none',
          }}>
            <div style={{
              padding: '6px 12px',
              background: 'var(--surface)',
              backdropFilter: 'blur(12px)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--surface-border)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <Sparkles size={12} color="#818cf8" />
              {displayNodes.length} nodes · {filteredEdges.length} edges
            </div>
            <div style={{
              padding: '6px 12px',
              background: 'var(--surface)',
              backdropFilter: 'blur(12px)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--surface-border)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <Info size={12} />
              Scroll to zoom · Drag to pan · Click nodes for details
            </div>
          </div>
        </div>

        {/* ---- RIGHT DETAIL PANEL ---- */}
        <AnimatePresence>
          {selectedNodeData && (
            <motion.div
              style={styles.detailPanel}
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Header */}
              <div style={styles.detailHeader}>
                <div style={styles.detailHeaderLeft}>
                  <div style={{
                    ...styles.detailIcon,
                    background: `${nodeTypeColors[selectedNodeData.type]}20`,
                    border: `2px solid ${nodeTypeColors[selectedNodeData.type]}40`,
                    boxShadow: `0 0 20px ${nodeTypeColors[selectedNodeData.type]}20`,
                  }}>
                    {(() => {
                      const Icon = nodeTypeIcons[selectedNodeData.type] || Circle;
                      return <Icon size={22} color={nodeTypeColors[selectedNodeData.type]} />;
                    })()}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {selectedNodeData.label}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: nodeTypeColors[selectedNodeData.type],
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginTop: '2px',
                    }}>
                      {nodeTypeLabels[selectedNodeData.type]}
                    </div>
                  </div>
                </div>
                <button
                  style={styles.closeBtn}
                  onClick={() => setSelectedNode(null)}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div style={styles.detailBody}>
                {/* Active Anomaly Warning Panel */}
                {activeNodeGap && (
                  <div style={{
                    background: 'rgba(255, 77, 107, 0.1)',
                    border: '1px solid rgba(255, 77, 107, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px 14px',
                    marginBottom: '16px',
                    boxShadow: '0 0 15px rgba(255, 77, 107, 0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FF4D6B', fontWeight: 700, fontSize: '11px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <span>🚨</span> Active Operational Gap
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                      {activeNodeGap.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.3, marginBottom: '10px' }}>
                      {activeNodeGap.desc}
                    </div>
                    <button
                      onClick={() => resolveGap(activeNodeGap.id)}
                      style={{
                        background: 'linear-gradient(135deg, #ff4d6b, #c2185b)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        padding: '8px 12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        width: '100%',
                        boxShadow: '0 4px 12px rgba(255, 77, 107, 0.2)',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)'; }}
                    >
                      <Sparkles size={12} /> Authorize: {activeNodeGap.solution}
                    </button>
                  </div>
                )}

                {/* Metrics */}
                <div style={{ ...styles.sectionTitle, marginTop: activeNodeGap ? '8px' : 0 }}>
                  <BarChart3 size={12} /> Properties
                </div>
                {Object.entries(selectedDetails).map(([key, value]) => (
                  <div key={key} style={styles.detailMetric}>
                    <span style={styles.detailMetricLabel}>
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span style={styles.detailMetricValue}>{value}</span>
                  </div>
                ))}

                {/* Connections */}
                <div style={{ ...styles.sectionTitle, marginTop: '20px' }}>
                  <Link2 size={12} /> Connections ({selectedConnections.length})
                </div>
                {selectedConnections.map((conn, i) => {
                  const connColor = nodeTypeColors[conn.node.type] || '#64748b';
                  const ConnIcon = nodeTypeIcons[conn.node.type] || Circle;
                  return (
                    <div
                      key={i}
                      style={styles.connectionItem}
                      onClick={() => setSelectedNode(conn.node.id)}
                    >
                      <div style={{ ...styles.connectionDot, background: connColor, boxShadow: `0 0 6px ${connColor}60` }} />
                      <ConnIcon size={14} color={connColor} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {conn.node.label}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          {conn.direction === 'outgoing' ? (
                            <>
                              <ArrowRight size={10} /> {conn.edge.label}
                            </>
                          ) : (
                            <>
                              <ChevronRight size={10} style={{ transform: 'rotate(180deg)' }} /> {conn.edge.label}
                            </>
                          )}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '9px',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        background: `${connColor}15`,
                        color: connColor,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                      }}>
                        {nodeTypeLabels[conn.node.type]}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div style={styles.actionBtns}>
                <button style={styles.actionBtnPrimary}>
                  <Eye size={14} /> View
                </button>
                <button style={styles.actionBtn}>
                  <Edit3 size={14} /> Edit
                </button>
                <button style={{
                  ...styles.actionBtn,
                  borderColor: 'rgba(255,77,107,0.3)',
                  color: '#FF4D6B',
                }}>
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Toast Notification Alert container */}
      <AnimatePresence>
        {actionAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            style={styles.toastAlert}
          >
            <CheckCircle size={16} color="#38CE3C" />
            <div>
              <div style={{ fontWeight: 700, fontSize: 11, color: '#fff' }}>Remediation Completed</div>
              <div style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: 2 }}>{actionAlert.message}</div>
            </div>
            <button onClick={() => setActionAlert(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', marginLeft: 8 }}>
              <X size={12} color="var(--text-muted)" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default KnowledgeGraph;
