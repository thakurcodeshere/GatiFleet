/* eslint-disable */
// ============================================================
// GatiFleet — Knowledge Graph Visualization
// The Logistics Brain — Interactive 3D SVG Graph
// ============================================================
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import {
  Search, ZoomIn, ZoomOut, RotateCcw, Tag, Network, GitBranch,
  Download, X, Eye, Edit3, Trash2, Building2, Package, Truck,
  User, Route, Fuel, CreditCard, FileText, Warehouse, Users,
  ChevronLeft, ChevronRight, Filter, BarChart3, Circle, ArrowRight, Layers,
  Maximize2, Info, Link2, Sparkles, Cpu, Terminal, CheckCircle,
  Compass, Gauge, ShieldAlert, CircleDot, Lightbulb, Zap
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

// ---- 3D Mapping of Nodes to Truck Anatomy ----
const node3DCoords = {
  // Center Command Node (cabin center)
  b1: { x: 210, y: 0, z: 0 },

  // AI Agents (Steering, Brakes, Accelerator, etc.)
  agt1: { x: 170, y: 80, z: -70 },  // Finance Agent -> Brake Caliper (Far side)
  agt2: { x: 210, y: -45, z: -35 }, // HR Agent -> Brake Control (Cabin safety brake)
  agt3: { x: 280, y: 20, z: 0 },     // Sales Agent -> Accelerator / Throttle (Engine propulsion)
  agt4: { x: 160, y: 40, z: 0 },     // Supply Chain Agent -> Fifth Wheel Coupling (Trailer hitch)
  agt5: { x: 285, y: 60, z: -30 },   // Engineering Agent -> Engine block
  agt6: { x: 240, y: -30, z: 40 },   // Executive Agent -> Steering Wheel (Windshield view)

  // Customers (Trailer Roof Line - cargo payload source)
  cus1: { x: -280, y: -90, z: -60 },
  cus2: { x: -140, y: -90, z: -60 },
  cus3: { x: 0, y: -90, z: -60 },
  cus4: { x: 120, y: -90, z: -60 },

  // Shipments (Inside Trailer Cargo Hold)
  shp1: { x: -220, y: 0, z: 45 },
  shp2: { x: -110, y: 0, z: 45 },
  shp3: { x: 0, y: 0, z: 45 },
  shp4: { x: 110, y: 0, z: 45 },

  // Routes (Headlights projecting forward & beacons)
  rte1: { x: 330, y: 45, z: -60 }, // Front Headlight Left
  rte2: { x: 330, y: 45, z: 60 },  // Front Headlight Right
  rte3: { x: 300, y: -30, z: 0 },   // Roof Warning Beacon

  // Warehouses (Left side tyres / wheels)
  wh1: { x: 280, y: 95, z: -75 },  // Front Left Wheel
  wh2: { x: -200, y: 95, z: -80 }, // Rear Trailer Left Wheel 1
  wh3: { x: -120, y: 95, z: -80 }, // Rear Trailer Left Wheel 2

  // Tolls & Fuel (Right side tyres / wheels)
  toll1: { x: 280, y: 95, z: 75 },  // Front Right Wheel
  toll2: { x: -200, y: 95, z: 80 }, // Rear Trailer Right Wheel 1
  fuel1: { x: -120, y: 95, z: 80 }, // Rear Trailer Right Wheel 2
  fuel2: { x: 0, y: 95, z: 80 },    // Middle Trailer Right Wheel

  // Drivers (Positioned in seats or rear axles)
  drv1: { x: 210, y: -15, z: -25 }, // Driver Cabin Seat Left
  drv2: { x: 210, y: -15, z: 25 },  // Co-driver Cabin Seat Right
  drv3: { x: -280, y: 40, z: -70 }, // Rear Axle left sensor pack
  drv4: { x: -280, y: 40, z: 70 },  // Rear Axle right sensor pack

  // Financial Documents (Chassis & Exhaust/Mudguards)
  inv1: { x: -310, y: 70, z: -50 }, // Exhaust Pipeline
  inv2: { x: -310, y: 70, z: 50 },  // Mudguard Plate

  // Suspension & Chassis points
  trk1: { x: -100, y: 50, z: -70 },
  trk2: { x: -100, y: 50, z: 70 },
  trk3: { x: 80, y: 50, z: -70 },
  trk4: { x: 80, y: 50, z: 70 },
};

// ---- 3D Wireframe Blueprint of the Truck structure ----
const truckVertices = {
  // Trailer Box (8 corners)
  t0: { x: -300, y: -100, z: -80 },
  t1: { x: 150, y: -100, z: -80 },
  t2: { x: 150, y: 80, z: -80 },
  t3: { x: -300, y: 80, z: -80 },
  t4: { x: -300, y: -100, z: 80 },
  t5: { x: 150, y: -100, z: 80 },
  t6: { x: 150, y: 80, z: 80 },
  t7: { x: -300, y: 80, z: 80 },

  // Cabin Box (8 corners)
  c0: { x: 170, y: -80, z: -70 },
  c1: { x: 260, y: -80, z: -70 },
  c2: { x: 320, y: 10, z: -70 },
  c3: { x: 320, y: 80, z: -70 },
  c4: { x: 170, y: 80, z: -70 },
  c5: { x: 170, y: -80, z: 70 },
  c6: { x: 260, y: -80, z: 70 },
  c7: { x: 320, y: 10, z: 70 },
  c8: { x: 320, y: 80, z: 70 },
  c9: { x: 170, y: 80, z: 70 },
  
  // Fuel Tank (box under trailer)
  f0: { x: -50, y: 80, z: -75 },
  f1: { x: 50, y: 80, z: -75 },
  f2: { x: 50, y: 110, z: -75 },
  f3: { x: -50, y: 110, z: -75 },
  f4: { x: -50, y: 80, z: -40 },
  f5: { x: 50, y: 80, z: -40 },
  f6: { x: 50, y: 110, z: -40 },
  f7: { x: -50, y: 110, z: -40 },
};

// Wireframe edges connecting the corners
const truckChassisLines = [
  // Trailer Box outer frames
  ['t0', 't1'], ['t1', 't2'], ['t2', 't3'], ['t3', 't0'],
  ['t4', 't5'], ['t5', 't6'], ['t6', 't7'], ['t7', 't4'],
  ['t0', 't4'], ['t1', 't5'], ['t2', 't6'], ['t3', 't7'],
  
  // Cabin Box outer frames
  ['c0', 'c1'], ['c1', 'c2'], ['c2', 'c3'], ['c3', 'c4'], ['c4', 'c0'],
  ['c5', 'c6'], ['c6', 'c7'], ['c7', 'c8'], ['c8', 'c9'], ['c9', 'c5'],
  ['c0', 'c5'], ['c1', 'c6'], ['c2', 'c7'], ['c3', 'c8'], ['c4', 'c9'],

  // Coupling links
  ['t2', 'c4'], ['t6', 'c9'],
  
  // Fuel Tank frames
  ['f0', 'f1'], ['f1', 'f2'], ['f2', 'f3'], ['f3', 'f0'],
  ['f4', 'f5'], ['f5', 'f6'], ['f6', 'f7'], ['f7', 'f4'],
  ['f0', 'f4'], ['f1', 'f5'], ['f2', 'f6'], ['f3', 'f7'],
];

// Truck 3D Solid Surface Faces
const truckFaces = [
  // Trailer Left Face (Far)
  {
    type: 'trailer-side',
    vertices: ['t0', 't1', 't2', 't3'],
    fill: 'rgba(99, 102, 241, 0.08)',
    stroke: 'rgba(99, 102, 241, 0.45)',
    strokeWidth: 2,
  },
  // Trailer Right Face (Near)
  {
    type: 'trailer-side',
    vertices: ['t4', 't5', 't6', 't7'],
    fill: 'rgba(99, 102, 241, 0.08)',
    stroke: 'rgba(99, 102, 241, 0.45)',
    strokeWidth: 2,
  },
  // Trailer Top
  {
    type: 'trailer-top',
    vertices: ['t0', 't1', 't5', 't4'],
    fill: 'rgba(99, 102, 241, 0.04)',
    stroke: 'rgba(99, 102, 241, 0.25)',
    strokeWidth: 1.5,
  },
  // Trailer Back Face
  {
    type: 'trailer-back',
    vertices: ['t0', 't3', 't7', 't4'],
    fill: 'rgba(99, 102, 241, 0.1)',
    stroke: 'rgba(99, 102, 241, 0.45)',
    strokeWidth: 2,
  },
  
  // Cabin Left Side
  {
    type: 'cabin-side',
    vertices: ['c0', 'c1', 'c2', 'c3', 'c4'],
    fill: 'rgba(168, 85, 247, 0.08)',
    stroke: 'rgba(168, 85, 247, 0.45)',
    strokeWidth: 2,
  },
  // Cabin Right Side
  {
    type: 'cabin-side',
    vertices: ['c5', 'c6', 'c7', 'c8', 'c9'],
    fill: 'rgba(168, 85, 247, 0.08)',
    stroke: 'rgba(168, 85, 247, 0.45)',
    strokeWidth: 2,
  },
  // Windshield (cyan reflective glass)
  {
    type: 'windshield',
    vertices: ['c1', 'c6', 'c7', 'c2'],
    fill: 'rgba(6, 182, 212, 0.16)',
    stroke: '#06b6d4',
    strokeWidth: 2,
  },
  // Front Bumper / Grille
  {
    type: 'bumper',
    vertices: ['c2', 'c7', 'c8', 'c3'],
    fill: 'rgba(148, 163, 184, 0.12)',
    stroke: '#94a3b8',
    strokeWidth: 2,
  },
];

// Tyres definition
const wheelsList = [
  // Left side wheels (Z = -80)
  { cx: -200, cy: 95, cz: -80, r: 22 },
  { cx: -120, cy: 95, cz: -80, r: 22 },
  { cx: 280, cy: 95, cz: -75, r: 22 },
  // Right side wheels (Z = 80)
  { cx: -200, cy: 95, cz: 80, r: 22 },
  { cx: -120, cy: 95, cz: 80, r: 22 },
  { cx: 280, cy: 95, cz: 75, r: 22 },
];

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
  orbitControls: {
    position: 'absolute',
    bottom: '60px',
    right: '20px',
    background: 'rgba(15, 23, 42, 0.85)',
    backdropFilter: 'blur(16px)',
    border: '1px solid var(--surface-border)',
    borderRadius: 'var(--radius-md)',
    padding: '12px',
    width: '240px',
    zIndex: 30,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
  },
  controlHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: 700,
    color: '#fff',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    paddingBottom: '6px',
  },
  controlRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    fontSize: '11px',
    color: 'var(--text-secondary)',
  },
  slider: {
    flex: 1,
    height: '4px',
    borderRadius: '2px',
    background: 'var(--bg-600)',
    outline: 'none',
    cursor: 'pointer',
  },
  controlVal: {
    minWidth: '32px',
    textAlign: 'right',
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
  },
  controlActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '4px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  metaphorCard: {
    background: 'var(--bg-700)',
    border: '1px solid var(--surface-border)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  metaphorCardActive: {
    borderColor: '#818cf8',
    background: 'rgba(99, 102, 241, 0.15)',
    boxShadow: '0 0 15px rgba(99, 102, 241, 0.1)',
  },
  metaphorHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 700,
    fontSize: '12px',
    marginBottom: '6px',
  },
  metaphorDesc: {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    lineHeight: 1.3,
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

// Helper: 3D Orthographic Projection with Rotation
const project3D = (x, y, z, yawDeg, pitchDeg, centerX, centerY, scale) => {
  const yaw = (yawDeg * Math.PI) / 180;
  const pitch = (pitchDeg * Math.PI) / 180;

  // Yaw rotation (Y-axis)
  const x1 = x * Math.cos(yaw) - z * Math.sin(yaw);
  const z1 = x * Math.sin(yaw) + z * Math.cos(yaw);
  const y1 = y;

  // Pitch rotation (X-axis)
  const x2 = x1;
  const y2 = y1 * Math.cos(pitch) - z1 * Math.sin(pitch);
  const z2 = y1 * Math.sin(pitch) + z1 * Math.cos(pitch);

  return {
    x: centerX + x2 * scale,
    y: centerY + y2 * scale,
    z: z2, // Depth for Z-sorting
  };
};

// Helper: Map Node ID to Metaphor group
const isNodeInMetaphor = (nodeId, metaphor) => {
  if (metaphor === 'steering') {
    return nodeId === 'b1' || nodeId === 'agt6';
  }
  if (metaphor === 'accelerator') {
    return nodeId === 'agt3' || nodeId.startsWith('cus') || nodeId.startsWith('shp');
  }
  if (metaphor === 'brake') {
    return nodeId === 'agt1' || nodeId === 'agt2' || nodeId === 'inv2' || nodeId.startsWith('toll');
  }
  if (metaphor === 'tyres') {
    return nodeId.startsWith('wh') || nodeId.startsWith('fuel') || nodeId.startsWith('toll');
  }
  if (metaphor === 'headlights') {
    return nodeId.startsWith('rte');
  }
  if (metaphor === 'fuel') {
    return nodeId.startsWith('fuel');
  }
  if (metaphor === 'exhaust') {
    return nodeId.startsWith('inv');
  }
  return false;
};

const getMetaphorRoleName = (nodeId, metaphor) => {
  if (metaphor === 'steering') {
    return nodeId === 'b1' ? 'HELM' : 'NAVIGATOR';
  }
  if (metaphor === 'accelerator') {
    if (nodeId === 'agt3') return 'THROTTLE';
    if (nodeId.startsWith('cus')) return 'FUEL_INJECT';
    return 'LOAD_WEIGHT';
  }
  if (metaphor === 'brake') {
    if (nodeId === 'agt1') return 'AUDIT_CALIP';
    if (nodeId === 'agt2') return 'SAFETY_PAD';
    return 'DRAG_LINE';
  }
  if (metaphor === 'tyres') {
    return 'AXLE_SPIN';
  }
  if (metaphor === 'headlights') {
    return 'BEAM_LIGHT';
  }
  if (metaphor === 'fuel') {
    return 'ENERGY';
  }
  if (metaphor === 'exhaust') {
    return 'DISCHARGE';
  }
  return 'PART';
};

// Map for darkened colors to provide high contrast in light mode
const darkenedColors = {
  business: '#6b21a8',   // dark purple
  agent: '#3730a3',      // dark indigo
  shipment: '#1e40af',   // dark blue
  truck: '#065f46',      // dark green
  driver: '#92400e',     // dark amber
  route: '#9d174d',      // dark pink
  fuel: '#9a3412',       // dark orange
  toll: '#9f1239',       // dark rose
  warehouse: '#115e59',  // dark teal
  checkpoint: '#3f3f46'   // dark grey
};

const KnowledgeGraph = () => {
  const { theme } = useTheme();
  // ---- Filters Panel Height Resize State ----
  const [filtersHeight, setFiltersHeight] = useState(240);
  const isFiltersResizingRef = useRef(false);

  const startFiltersResizing = useCallback((e) => {
    e.preventDefault();
    isFiltersResizingRef.current = true;
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';

    const startY = e.clientY;
    const startHeight = filtersHeight;

    const handleMouseMove = (moveEvent) => {
      if (!isFiltersResizingRef.current) return;
      const dy = moveEvent.clientY - startY;
      const newHeight = startHeight + dy;
      if (newHeight > 100 && newHeight < 600) {
        setFiltersHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      isFiltersResizingRef.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [filtersHeight]);

  // ---- Left Sidebar Resize & Collapse States ----
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(280);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const isLeftResizingRef = useRef(false);

  const startLeftResizing = useCallback((e) => {
    e.preventDefault();
    isLeftResizingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent) => {
      if (!isLeftResizingRef.current) return;
      const newWidth = moveEvent.clientX;
      if (newWidth > 200 && newWidth < 600) {
        setLeftSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      isLeftResizingRef.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, []);

  // ---- Right Details Panel Resize State ----
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const isRightResizingRef = useRef(false);

  const startRightResizing = useCallback((e) => {
    e.preventDefault();
    isRightResizingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent) => {
      if (!isRightResizingRef.current) return;
      const newWidth = window.innerWidth - moveEvent.clientX;
      if (newWidth > 260 && newWidth < 800) {
        setRightPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      isRightResizingRef.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, []);

  // ---- View, Edit, Remove Modal States ----
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  // Temporary edit states
  const [editLabel, setEditLabel] = useState('');
  const [editType, setEditType] = useState('');
  const [editProperties, setEditProperties] = useState({});

  // Temporary remove states
  const [removeReasonCategory, setRemoveReasonCategory] = useState('Completed Operational Lifecycle');
  const [removeReasonCustom, setRemoveReasonCustom] = useState('');

  const handleOpenEdit = () => {
    if (!selectedNodeData) return;
    setEditLabel(selectedNodeData.label);
    setEditType(selectedNodeData.type);
    setEditProperties({ ...selectedDetails });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedNode) return;

    // Update nodes list
    setNodes(prev => prev.map(n => {
      if (n.id === selectedNode) {
        return { ...n, label: editLabel, type: editType };
      }
      return n;
    }));

    // Update nodeDetails dictionary
    setNodeDetails(prev => ({
      ...prev,
      [selectedNode]: editProperties
    }));

    setIsEditModalOpen(false);
    logToTerminal(`System event: Updated metadata properties for twin node ${selectedNode}.`);
    showToast('Saved node changes successfully');
  };

  const handleConfirmRemove = () => {
    if (!selectedNode) return;

    const finalReason = removeReasonCustom.trim() 
      ? `${removeReasonCategory}: ${removeReasonCustom.trim()}` 
      : removeReasonCategory;

    // Remove the node from state
    setNodes(prev => prev.filter(n => n.id !== selectedNode));
    setIsRemoveModalOpen(false);
    setSelectedNode(null); // deselect

    logToTerminal(`System event: Removed node twin ${selectedNode}. Reason: ${finalReason}`);
    showToast(`Removed node ${selectedNode}`);
  };

  // ---- State ----
  const [nodes, setNodes] = useState(() =>
    knowledgeGraphNodes.map(n => ({ ...n, x: n.x * 1.15, y: n.y * 1.05 }))
  );
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLabels, setShowLabels] = useState(false); // Default hide labels to prevent clutter!
  const [viewMode, setViewMode] = useState('graph');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [activeFilters, setActiveFilters] = useState(() =>
    Object.keys(nodeTypeColors).reduce((acc, type) => ({ ...acc, [type]: true }), {})
  );

  const [sidebarTab, setSidebarTab] = useState('metaphors'); // Default to Metaphors
  const [nodeDetails, setNodeDetails] = useState(nodeDetailData);
  const [actionAlert, setActionAlert] = useState(null);
  const [impactAnalysisData, setImpactAnalysisData] = useState(null);
  const [isAnalyzingImpact, setIsAnalyzingImpact] = useState(false);

  const [terminalLogs, setTerminalLogs] = useState([
    'Knowledge Graph Cognitive Engine initialized (Plane 4).',
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

  // ---- 3D Rotation State ----
  const [rotation, setRotation] = useState({ yaw: 35, pitch: -15 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [highlightedMetaphor, setHighlightedMetaphor] = useState(null);

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

  // ---- Auto Rotation loop ----
  useEffect(() => {
    if (!autoRotate) return;
    let frameId;
    const tick = () => {
      setRotation(prev => ({
        ...prev,
        yaw: (prev.yaw + 0.3) % 360,
      }));
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [autoRotate]);

  // ---- 3D Projection configuration ----
  const center3D = { x: 340, y: 260 };
  const scale3D = 1.35;

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

  // Trace active connections (to keep labels visible)
  const activeConnections = useMemo(() => {
    const activeId = hoveredNode || selectedNode;
    if (!activeId) return new Set();
    const conns = getNodeConnections(activeId);
    const ids = new Set([activeId]);
    conns.forEach(c => ids.add(c.node.id));
    return ids;
  }, [hoveredNode, selectedNode, getNodeConnections]);

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
    setRotation({ yaw: 35, pitch: -15 });
  };

  const handleNodeMouseDown = (e, nodeId) => {
    e.stopPropagation();
    if (viewMode === 'tree') {
      const svgEl = svgRef.current;
      if (!svgEl) return;
      const rect = svgEl.getBoundingClientRect();
      draggingRef.current = {
        nodeId,
        startX: (e.clientX - rect.left) / zoom - pan.x,
        startY: (e.clientY - rect.top) / zoom - pan.y,
      };
      setIsDraggingNode(true);
    } else {
      setSelectedNode(nodeId === selectedNode ? null : nodeId);
    }
  };

  const handleMouseMove = useCallback((e) => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const rect = svgEl.getBoundingClientRect();

    if (draggingRef.current) {
      if (draggingRef.current.nodeId && viewMode === 'tree') {
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
      } else if (draggingRef.current.type === 'canvas-rotate') {
        const dx = e.clientX - draggingRef.current.startX;
        const dy = e.clientY - draggingRef.current.startY;
        const newYaw = (draggingRef.current.startYaw + dx * 0.4) % 360;
        const newPitch = Math.max(-85, Math.min(85, draggingRef.current.startPitch - dy * 0.4));
        setRotation({
          yaw: newYaw < 0 ? newYaw + 360 : newYaw,
          pitch: newPitch,
        });
      }
    } else if (isPanningRef.current) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      setPan({
        x: panOffsetRef.current.x + dx / zoom,
        y: panOffsetRef.current.y + dy / zoom,
      });
    }
  }, [zoom, pan, rotation, viewMode, getNodeById]);

  const handleMouseUp = useCallback(() => {
    draggingRef.current = null;
    isPanningRef.current = false;
    setIsDraggingNode(false);
  }, []);

  const handleCanvasMouseDown = (e) => {
    if (e.target === svgRef.current || e.target.tagName === 'rect') {
      if (e.shiftKey || e.button === 2) {
        // Shift + Drag or Right click drag: PAN
        isPanningRef.current = true;
        panStartRef.current = { x: e.clientX, y: e.clientY };
        panOffsetRef.current = { ...pan };
      } else {
        // Normal drag: ROTATE (in graph view) or PAN (in tree view)
        if (viewMode === 'graph') {
          draggingRef.current = {
            type: 'canvas-rotate',
            startX: e.clientX,
            startY: e.clientY,
            startYaw: rotation.yaw,
            startPitch: rotation.pitch,
          };
        } else {
          isPanningRef.current = true;
          panStartRef.current = { x: e.clientX, y: e.clientY };
          panOffsetRef.current = { ...pan };
        }
      }
    }
  };

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.06 : 0.06;
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
    const curvature = Math.min(dist * 0.15, 45);
    const mx = (fromNode.x + toNode.x) / 2;
    const my = (fromNode.y + toNode.y) / 2;
    const nx = -dy / (dist || 1);
    const ny = dx / (dist || 1);
    const cx = mx + nx * curvature;
    const cy = my + ny * curvature;
    return `M ${fromNode.x} ${fromNode.y} Q ${cx} ${cy} ${toNode.x} ${toNode.y}`;
  };

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

  // ---- Projected 3D nodes for Graph view ----
  const projectedNodes = useMemo(() => {
    return filteredNodes.map(n => {
      const coords = node3DCoords[n.id] || { x: 0, y: 0, z: 0 };
      const proj = project3D(coords.x, coords.y, coords.z, rotation.yaw, rotation.pitch, center3D.x, center3D.y, scale3D);
      return {
        ...n,
        x: proj.x,
        y: proj.y,
        depth: proj.z,
      };
    });
  }, [filteredNodes, rotation]);

  const displayNodes = viewMode === 'tree' ? treeNodes : projectedNodes;
  
  const displayNodeMap = useMemo(() => {
    const map = {};
    displayNodes.forEach(n => { map[n.id] = n; });
    return map;
  }, [displayNodes]);

  // ---- Unified depth-sorted rendering lists (for graph mode) ----
  const renderOrderList = useMemo(() => {
    const items = [];

    if (viewMode === 'graph') {
      // 1. Add Headlight Beams (Left and Right)
      const h1Source = { x: 330, y: 45, z: -60 };
      const h1Spread1 = { x: 480, y: 85, z: -110 };
      const h1Spread2 = { x: 480, y: 5, z: -10 };
      
      const h2Source = { x: 330, y: 45, z: 60 };
      const h2Spread1 = { x: 480, y: 85, z: 10 };
      const h2Spread2 = { x: 480, y: 5, z: 110 };

      const p1S = project3D(h1Source.x, h1Source.y, h1Source.z, rotation.yaw, rotation.pitch, center3D.x, center3D.y, scale3D);
      const p1A = project3D(h1Spread1.x, h1Spread1.y, h1Spread1.z, rotation.yaw, rotation.pitch, center3D.x, center3D.y, scale3D);
      const p1B = project3D(h1Spread2.x, h1Spread2.y, h1Spread2.z, rotation.yaw, rotation.pitch, center3D.x, center3D.y, scale3D);

      const p2S = project3D(h2Source.x, h2Source.y, h2Source.z, rotation.yaw, rotation.pitch, center3D.x, center3D.y, scale3D);
      const p2A = project3D(h2Spread1.x, h2Spread1.y, h2Spread1.z, rotation.yaw, rotation.pitch, center3D.x, center3D.y, scale3D);
      const p2B = project3D(h2Spread2.x, h2Spread2.y, h2Spread2.z, rotation.yaw, rotation.pitch, center3D.x, center3D.y, scale3D);

      const beam1GradientId = 'grad-beam-left-kg';
      const beam2GradientId = 'grad-beam-right-kg';

      items.push({
        type: 'beam',
        z: p1S.z - 20, // offset slightly back to overlay properly
        element: (
          <g key="beam-left" pointerEvents="none">
            <defs>
              <linearGradient id={beam1GradientId} x1={p1S.x} y1={p1S.y} x2={(p1A.x + p1B.x)/2} y2={(p1A.y + p1B.y)/2} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#fef08a" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <polygon
              points={`${p1S.x},${p1S.y} ${p1A.x},${p1A.y} ${p1B.x},${p1B.y}`}
              fill={`url(#${beam1GradientId})`}
            />
          </g>
        )
      });

      items.push({
        type: 'beam',
        z: p2S.z - 20,
        element: (
          <g key="beam-right" pointerEvents="none">
            <defs>
              <linearGradient id={beam2GradientId} x1={p2S.x} y1={p2S.y} x2={(p2A.x + p2B.x)/2} y2={(p2A.y + p2B.y)/2} gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#fef08a" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <polygon
              points={`${p2S.x},${p2S.y} ${p2A.x},${p2A.y} ${p2B.x},${p2B.y}`}
              fill={`url(#${beam2GradientId})`}
            />
          </g>
        )
      });

      // 2. Add Truck Solid Panels (Faces) in 3D
      truckFaces.forEach((face, idx) => {
        const projectedPts = face.vertices.map(vName => {
          const pt = truckVertices[vName];
          return project3D(pt.x, pt.y, pt.z, rotation.yaw, rotation.pitch, center3D.x, center3D.y, scale3D);
        });
        
        const avgZ = projectedPts.reduce((sum, p) => sum + p.z, 0) / projectedPts.length;
        const pointsString = projectedPts.map(p => `${p.x},${p.y}`).join(' ');

        items.push({
          type: 'face',
          z: avgZ - 5, // slightly offset behind nodes in similar depth plane
          element: (
            <polygon
              key={`face-${idx}`}
              points={pointsString}
              fill={face.fill}
              stroke={face.stroke}
              strokeWidth={face.strokeWidth}
              opacity={0.65}
              strokeLinejoin="round"
              pointerEvents="none" // do not block clicks on nodes inside
            />
          )
        });
      });

      // 3. Add Chassis Outline Lines
      truckChassisLines.forEach(([v1, v2], idx) => {
        const pt1 = truckVertices[v1];
        const pt2 = truckVertices[v2];
        const proj1 = project3D(pt1.x, pt1.y, pt1.z, rotation.yaw, rotation.pitch, center3D.x, center3D.y, scale3D);
        const proj2 = project3D(pt2.x, pt2.y, pt2.z, rotation.yaw, rotation.pitch, center3D.x, center3D.y, scale3D);
        const avgZ = (proj1.z + proj2.z) / 2;

        items.push({
          type: 'chassis',
          z: avgZ - 10,
          element: (
            <line
              key={`chassis-${idx}`}
              x1={proj1.x}
              y1={proj1.y}
              x2={proj2.x}
              y2={proj2.y}
              stroke="rgba(148, 163, 184, 0.4)"
              strokeWidth={1.8}
              pointerEvents="none"
            />
          )
        });
      });

      // 4. Add Tyres (Wheels) with rotating spokes
      const rollAngle = (rotation.yaw * 4.5 * Math.PI) / 180;
      wheelsList.forEach((w, idx) => {
        const projCenter = project3D(w.cx, w.cy, w.cz, rotation.yaw, rotation.pitch, center3D.x, center3D.y, scale3D);
        
        // outer wheel shape points
        const numTyrePoints = 16;
        const tyrePathPoints = [];
        const hubPathPoints = [];
        const spokeLines = [];

        for (let i = 0; i <= numTyrePoints; i++) {
          const theta = (i / numTyrePoints) * 2 * Math.PI;
          const tx = w.cx + w.r * Math.cos(theta);
          const ty = w.cy + w.r * Math.sin(theta);
          const tz = w.cz;
          const ptProj = project3D(tx, ty, tz, rotation.yaw, rotation.pitch, center3D.x, center3D.y, scale3D);
          tyrePathPoints.push(`${ptProj.x},${ptProj.y}`);

          const hx = w.cx + 5 * Math.cos(theta);
          const hy = w.cy + 5 * Math.sin(theta);
          const hz = w.cz;
          const hubProj = project3D(hx, hy, hz, rotation.yaw, rotation.pitch, center3D.x, center3D.y, scale3D);
          hubPathPoints.push(`${hubProj.x},${hubProj.y}`);
        }

        // spoke lines
        const numSpokes = 5;
        for (let i = 0; i < numSpokes; i++) {
          const theta = (i / numSpokes) * 2 * Math.PI + rollAngle;
          const outerX = w.cx + w.r * Math.cos(theta);
          const outerY = w.cy + w.r * Math.sin(theta);
          const outerZ = w.cz;
          const outerProj = project3D(outerX, outerY, outerZ, rotation.yaw, rotation.pitch, center3D.x, center3D.y, scale3D);

          const innerX = w.cx + 4 * Math.cos(theta);
          const innerY = w.cy + 4 * Math.sin(theta);
          const innerZ = w.cz;
          const innerProj = project3D(innerX, innerY, innerZ, rotation.yaw, rotation.pitch, center3D.x, center3D.y, scale3D);

          spokeLines.push({ x1: innerProj.x, y1: innerProj.y, x2: outerProj.x, y2: outerProj.y });
        }

        items.push({
          type: 'wheel',
          z: projCenter.z,
          element: (
            <g key={`wheel-${idx}`} pointerEvents="none">
              {/* Outer tyre block */}
              <polygon
                points={tyrePathPoints.join(' ')}
                fill="rgba(15, 23, 42, 0.95)"
                stroke="#334155"
                strokeWidth={2.5}
              />
              <polygon
                points={tyrePathPoints.join(' ')}
                fill="none"
                stroke="rgba(148, 163, 184, 0.4)"
                strokeWidth={1}
              />
              {/* Center Hub */}
              <polygon
                points={hubPathPoints.join(' ')}
                fill="#334155"
                stroke="#64748b"
                strokeWidth={1.5}
              />
              {/* Spokes */}
              {spokeLines.map((sp, sIdx) => (
                <line
                  key={`spoke-${sIdx}`}
                  x1={sp.x1}
                  y1={sp.y1}
                  x2={sp.x2}
                  y2={sp.y2}
                  stroke="#64748b"
                  strokeWidth={1.5}
                  opacity={0.7}
                />
              ))}
            </g>
          )
        });
      });
    }

    // 5. Add Edges
    filteredEdges.forEach((edge, idx) => {
      const fromNode = displayNodeMap[edge.from];
      const toNode = displayNodeMap[edge.to];
      if (!fromNode || !toNode) return;

      const avgZ = viewMode === 'graph' ? ((fromNode.depth || 0) + (toNode.depth || 0)) / 2 : 0;

      const isHighlighted = hoveredNode && (edge.from === hoveredNode || edge.to === hoveredNode);
      const isSelected = selectedNode && (edge.from === selectedNode || edge.to === selectedNode);
      
      let isMetaphorHighlighted = false;
      if (highlightedMetaphor) {
        isMetaphorHighlighted = isNodeInMetaphor(edge.from, highlightedMetaphor) && isNodeInMetaphor(edge.to, highlightedMetaphor);
      }

      const isDimmed = (hoveredNode && !isHighlighted) || (highlightedMetaphor && !isMetaphorHighlighted);
      const edgeColor = nodeTypeColors[fromNode.type] || '#64748b';
      
      const activeGap = gaps.find(g => (g.nodeTarget === edge.from || g.nodeTarget === edge.to) && g.status === 'open');
      const displayColor = activeGap ? '#FF4D6B' : edgeColor;

      items.push({
        type: 'edge',
        z: avgZ,
        element: (
          <g key={`edge-${idx}`}>
            {/* Glow on hover */}
            {(isHighlighted || isSelected || isMetaphorHighlighted) && (
              <path
                d={getEdgePath(fromNode, toNode)}
                fill="none"
                stroke={displayColor}
                strokeWidth={5}
                opacity={0.15}
                strokeLinecap="round"
              />
            )}
            {/* Main edge path */}
            <path
              d={getEdgePath(fromNode, toNode)}
              fill="none"
              stroke={isHighlighted || isSelected || isMetaphorHighlighted ? displayColor : 'var(--text-muted)'}
              strokeWidth={isHighlighted || isSelected || isMetaphorHighlighted ? 2 : 1}
              strokeDasharray={isHighlighted || isSelected || isMetaphorHighlighted ? '8 4' : '6 4'}
              opacity={isDimmed ? 0.04 : isHighlighted || isSelected || isMetaphorHighlighted ? 0.95 : 0.18}
              strokeLinecap="round"
              markerEnd={isHighlighted || isSelected || isMetaphorHighlighted ? `url(#arrow-${fromNode.type})` : 'url(#arrowhead)'}
              style={{
                animation: isHighlighted || isSelected || isMetaphorHighlighted
                  ? 'dashFlow 0.8s linear infinite'
                  : 'dashFlow 3s linear infinite',
                transition: 'opacity 0.3s, stroke-width 0.3s',
              }}
            />
            {/* Label */}
            {showLabels && (isHighlighted || isSelected || isMetaphorHighlighted) && (
              <text
                x={(fromNode.x + toNode.x) / 2}
                y={(fromNode.y + toNode.y) / 2 - 10}
                textAnchor="middle"
                fontSize="9"
                fontFamily="var(--font-sans)"
                fontWeight="700"
                fill={displayColor}
                opacity={0.9}
              >
                {edge.label}
              </text>
            )}
          </g>
        )
      });
    });

    // 6. Add Nodes
    displayNodes.forEach(node => {
      const activeGap = gaps.find(g => g.nodeTarget === node.id && g.status === 'open');
      const color = activeGap ? '#FF4D6B' : (nodeTypeColors[node.type] || '#64748b');
      const IconComp = nodeTypeIcons[node.type] || Circle;
      const isHovered = hoveredNode === node.id;
      const isSelected = selectedNode === node.id;
      
      let isMetaphorHighlighted = false;
      if (highlightedMetaphor) {
        isMetaphorHighlighted = isNodeInMetaphor(node.id, highlightedMetaphor);
      }

      const isDimmed = (hoveredNode && !hoveredConnections.has(node.id)) || (highlightedMetaphor && !isMetaphorHighlighted);
      
      // Node size scaling in graph (3D) mode: make them smaller dots to prevent covering up the truck shape!
      const baseRadius = viewMode === 'graph' ? (node.size * 0.45) : node.size;
      const radius = baseRadius * (isHovered || isSelected || isMetaphorHighlighted ? 1.25 : 1);

      // Label visibility criteria: show only on hover, select, connection, search, or metaphor highlight
      const isLabelVisible = showLabels || (
        isHovered || 
        isSelected || 
        isMetaphorHighlighted || 
        activeConnections.has(node.id) ||
        (searchQuery && node.label.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      items.push({
        type: 'node',
        z: viewMode === 'graph' ? (node.depth || 0) : 0,
        element: (
          <g
            key={`node-${node.id}`}
            transform={`translate(${node.x}, ${node.y})`}
            onMouseDown={e => handleNodeMouseDown(e, node.id)}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => handleNodeClick(node.id)}
            style={{
              cursor: 'pointer',
              opacity: isDimmed ? 0.12 : 1,
              transition: 'opacity 0.3s, transform 0.2s',
            }}
          >
            {/* Blinking anomaly ring */}
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
            {/* Selected glow rings */}
            {isSelected && (
              <>
                <circle
                  r={radius + 10}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  opacity={0.2}
                  style={{ animation: 'pulseGlow 2s ease-in-out infinite' }}
                />
                <circle
                  r={radius + 5}
                  fill="none"
                  stroke={color}
                  strokeWidth={1.5}
                  opacity={0.4}
                  style={{ animation: 'pulseGlow 2s ease-in-out infinite 0.5s' }}
                />
              </>
            )}

            {/* Hover / Metaphor glow ring */}
            {(isHovered || isMetaphorHighlighted) && !isSelected && (
              <circle
                r={radius + 6}
                fill="none"
                stroke={color}
                strokeWidth={1.8}
                opacity={0.35}
                style={{ animation: 'pulseGlow 1.5s ease-in-out infinite' }}
              />
            )}

            {/* Node Background */}
            <circle
              r={radius + 2}
              fill={color}
              opacity={isHovered || isSelected || isMetaphorHighlighted ? 0.18 : 0.08}
              style={{ transition: 'all 0.3s' }}
            />

            {/* Main Outer Circle */}
            <circle
              r={radius}
              fill={`${color}22`}
              stroke={color}
              strokeWidth={isHovered || isSelected || isMetaphorHighlighted ? 2.5 : 1.2}
              filter={isHovered || isSelected || isMetaphorHighlighted ? `url(#glow-${node.type})` : undefined}
              style={{ transition: 'all 0.3s' }}
            />

            {/* Inner Ring */}
            <circle
              r={radius * 0.65}
              fill={`${color}25`}
              style={{ transition: 'all 0.3s' }}
            />

            {/* Icon */}
            <foreignObject
              x={-8}
              y={-8}
              width={16}
              height={16}
              style={{ overflow: 'visible', pointerEvents: 'none' }}
            >
              <div
                xmlns="http://www.w3.org/1999/xhtml"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 16,
                  height: 16,
                }}
              >
                <IconComp size={radius * 0.5} color={color} strokeWidth={2.5} />
              </div>
            </foreignObject>

            {/* Label (clutter controller) */}
            {isLabelVisible && (
              <text
                y={radius + 15}
                textAnchor="middle"
                fontSize="9.5"
                fontFamily="var(--font-sans)"
                fontWeight="600"
                fill="var(--text-secondary)"
                style={{
                  textShadow: '0 1px 4px rgba(0,0,0,0.7)',
                  opacity: isDimmed ? 0.35 : 1,
                  transition: 'opacity 0.3s',
                }}
              >
                {node.label}
              </text>
            )}

            {/* Metaphor Role Badge */}
            {isMetaphorHighlighted && (
              <g transform={`translate(0, ${-radius - 16})`}>
                <rect
                  x={-35}
                  y={-8}
                  width={70}
                  height={16}
                  rx={8}
                  fill={color}
                  opacity={0.88}
                />
                <text
                  textAnchor="middle"
                  y={3}
                  fontSize="8"
                  fontWeight="800"
                  fill="#fff"
                  textTransform="uppercase"
                  letterSpacing="0.5"
                >
                  {getMetaphorRoleName(node.id, highlightedMetaphor)}
                </text>
              </g>
            )}

            {/* Default Type badge */}
            {(isHovered || isSelected) && !isMetaphorHighlighted && (
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
        )
      });
    });

    // Depth Sorting
    return items.sort((a, b) => a.z - b.z);
  }, [viewMode, filteredEdges, displayNodeMap, displayNodes, rotation, hoveredNode, selectedNode, showLabels, highlightedMetaphor, gaps, activeConnections]);

  // ---- Selected node details ----
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
              <div style={styles.titleSub}>Logistics Intelligence Network (3D Truck Twin)</div>
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
            onClick={() => { setViewMode('graph'); setSelectedNode(null); }}
          >
            <Network size={14} /> 3D Truck Graph
          </button>
          <button
            style={{
              ...styles.viewToggle,
              background: viewMode === 'tree' ? 'rgba(99,102,241,0.15)' : 'transparent',
              color: viewMode === 'tree' ? '#818cf8' : 'var(--text-muted)',
            }}
            onClick={() => { setViewMode('tree'); setSelectedNode(null); }}
          >
            <GitBranch size={14} /> 2D Tree View
          </button>

          <div style={{ width: 1, height: 20, background: 'var(--surface-border)' }} />

          <button style={styles.toolBtn} title="Export graph">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* ---- PLANE 4: CASCADE IMPACT ANALYSIS CONTROL BANNER ---- */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.9)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.3)',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Network size={20} color="#818cf8" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>
              Plane 4 Knowledge Graph Engine — Relational Cascade Impact Solver
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Analyzes multi-hop graph dependencies to calculate revenue-at-risk and SLA exposures during operational disruptions.
            </div>
          </div>
        </div>

        <button
          onClick={async () => {
            setIsAnalyzingImpact(true);
            const targetId = selectedNode || 'TRK-001';
            try {
              const res = await fetch('http://localhost:3000/api/kg/impact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ entityId: targetId })
              });
              if (res.ok) {
                const impactData = await res.json();
                setImpactAnalysisData(impactData);
                logToTerminal(`Cascade Impact Solved for [${targetId}]: Revenue at Risk ₹${impactData.financialImpact.revenueAtRiskINR.toLocaleString('en-IN')}`);
              }
            } catch (err) {
              console.error('Impact analysis failed', err);
            }
            setIsAnalyzingImpact(false);
          }}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Sparkles size={14} />
          {isAnalyzingImpact ? 'Solving Graph...' : `Run Cascade Impact Analysis (${selectedNode || 'TRK-001'})`}
        </button>
      </div>

      {/* Render Impact Results Overlay */}
      {impactAnalysisData && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.95)',
          borderBottom: '2px solid #818cf8',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#f87171' }}>
                🚨 CASCADE IMPACT ANALYSIS RESULTS [{impactAnalysisData.triggerEntityId}]
              </span>
              <span style={{ fontSize: '10px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                {impactAnalysisData.affectedNodesCount} DOWNSTREAM NODES AFFECTED
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Revenue at Risk: <strong style={{ color: '#f87171' }}>₹{impactAnalysisData.financialImpact.revenueAtRiskINR.toLocaleString('en-IN')}</strong> ·
              SLA Penalty Exposure: <strong style={{ color: '#fb923c' }}>₹{impactAnalysisData.financialImpact.SLAExposureINR.toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ fontSize: '11px', color: '#818cf8', marginTop: '4px' }}>
              Actions: {impactAnalysisData.recommendedActions.join(' | ')}
            </div>
          </div>
          <button
            onClick={() => setImpactAnalysisData(null)}
            style={{ background: 'transparent', border: '1px solid var(--surface-border)', color: 'var(--text-muted)', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', cursor: 'pointer' }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ---- MAIN AREA ---- */}
      <div style={styles.mainArea}>
        {/* ---- LEFT SIDEBAR ---- */}
        <motion.div
          style={{
            ...styles.sidebar,
            width: leftSidebarCollapsed ? 0 : leftSidebarWidth,
            borderRight: leftSidebarCollapsed ? 'none' : '1px solid var(--surface-border)',
            position: 'relative',
            overflow: leftSidebarCollapsed ? 'hidden' : 'visible',
            transition: isLeftResizingRef.current ? 'none' : 'width 0.3s ease',
          }}
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Sidebar Title Block from Photo */}
          {!leftSidebarCollapsed && (
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--surface-border)',
              background: 'var(--bg-900)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-sm)',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(99, 102, 241, 0.25)',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    handleResetView();
                    logToTerminal('Command: Reset camera view orientation.');
                    showToast('Reset camera viewport');
                  }}
                  title="Click to Reset View"
                >
                  <Network size={16} color="#fff" />
                </div>
                <div>
                  <div
                    onClick={() => {
                      handleResetView();
                      logToTerminal('Command: Reset camera view orientation.');
                      showToast('Reset camera viewport');
                    }}
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#818cf8'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#fff'; }}
                  >
                    Knowledge Graph
                  </div>
                  <div
                    onClick={() => {
                      setAutoRotate(prev => {
                        const next = !prev;
                        logToTerminal(`Command: Auto-rotation set to ${next ? 'ON' : 'OFF'}.`);
                        showToast(`Auto-rotation ${next ? 'enabled' : 'disabled'}`);
                        return next;
                      });
                    }}
                    style={{
                      fontSize: '10px',
                      color: 'var(--text-muted)',
                      fontWeight: 500,
                      marginTop: '1px',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#818cf8'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                  >
                    Logistics Intelligence Network
                  </div>
                </div>
              </div>
              <button
                onClick={() => setLeftSidebarCollapsed(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 4,
                  borderRadius: 4
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          )}

          {/* Sidebar Tabs Selector */}
          {!leftSidebarCollapsed && (
            <div style={{ display: 'flex', borderBottom: '1px solid var(--surface-border)', background: 'var(--bg-900)', flexShrink: 0 }}>
              <button
                onClick={() => setSidebarTab('filters')}
                style={{
                  flex: 1, padding: '12px 0', fontSize: '10px', fontWeight: 700, border: 'none', cursor: 'pointer',
                  background: sidebarTab === 'filters' ? 'var(--bg-800)' : 'transparent',
                  color: sidebarTab === 'filters' ? '#818cf8' : 'var(--text-muted)', outline: 'none', textTransform: 'uppercase', letterSpacing: '0.04em'
                }}
              >
                FILTERS & LEGEND
              </button>
              <button
                onClick={() => setSidebarTab('metaphors')}
                style={{
                  flex: 1, padding: '12px 0', fontSize: '10px', fontWeight: 700, border: 'none', cursor: 'pointer',
                  background: sidebarTab === 'metaphors' ? 'var(--bg-800)' : 'transparent',
                  color: sidebarTab === 'metaphors' ? '#818cf8' : 'var(--text-muted)', outline: 'none', textTransform: 'uppercase', letterSpacing: '0.04em'
                }}
              >
                METAPHORS
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
          )}

          {!leftSidebarCollapsed && sidebarTab === 'filters' && (
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              {/* Search */}
              <div style={styles.sidebarSection}>
                <div
                  style={{ ...styles.sectionTitle, cursor: 'pointer' }}
                  onClick={() => {
                    const input = document.getElementById('kg-search-input');
                    if (input) input.focus();
                    logToTerminal('Command: Search input focused.');
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#818cf8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <Search size={12} /> SEARCH NODES
                </div>
                <div style={styles.searchBox}>
                  <Search size={14} color="var(--text-muted)" />
                  <input
                    id="kg-search-input"
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
                <div
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilters(Object.keys(nodeTypeColors).reduce((acc, type) => ({ ...acc, [type]: true }), {}));
                    logToTerminal('Filters and search reset.');
                    showToast('Reset all filters to show all nodes');
                  }}
                  style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#818cf8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  Showing {filteredNodes.length} of {nodes.length} nodes (Click to Reset)
                </div>
              </div>

              {/* Filters */}
              <div style={{
                ...styles.sidebarSection,
                height: `${filtersHeight}px`,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                flexShrink: 0,
                paddingBottom: '16px'
              }}>
                <div
                  style={{ ...styles.sectionTitle, cursor: 'pointer', marginBottom: '8px' }}
                  onClick={() => {
                    const allTrue = Object.values(activeFilters).every(v => v);
                    const nextVal = !allTrue;
                    setActiveFilters(Object.keys(nodeTypeColors).reduce((acc, type) => ({ ...acc, [type]: nextVal }), {}));
                    logToTerminal(`All type filters toggled: ${nextVal ? 'ON' : 'OFF'}`);
                    showToast(nextVal ? 'Enabled all filters' : 'Disabled all filters');
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#818cf8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <Filter size={12} /> FILTER BY TYPE (Click to Toggle All)
                </div>

                {/* Scrollable Checkbox List */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px', paddingRight: '4px' }}>
                  {Object.entries(nodeTypeColors).map(([type, color]) => {
                    const IconComp = nodeTypeIcons[type] || Circle;
                    return (
                      <div
                        key={type}
                        style={{
                          ...styles.filterItem,
                          background: activeFilters[type] ? `${color}08` : 'transparent',
                          margin: '2px 0'
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

                {/* Vertical ns-resize drag-down handle */}
                <div
                  onMouseDown={startFiltersResizing}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '6px',
                    cursor: 'ns-resize',
                    zIndex: 10,
                    background: isFiltersResizingRef.current ? 'rgba(99, 102, 241, 0.45)' : 'transparent',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                />
              </div>

              {/* Stats */}
              <div style={styles.sidebarSection}>
                <div
                  style={{ ...styles.sectionTitle, cursor: 'pointer' }}
                  onClick={() => {
                    logToTerminal(`Network Density Report: ${(filteredEdges.length / (filteredNodes.length || 1)).toFixed(2)} edges/node. 10 Open gaps diagnostics active.`);
                    showToast('Printed Network Density Report');
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#818cf8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <BarChart3 size={12} /> GRAPH STATS (Click for Report)
                </div>
                <div
                  style={{ ...styles.statRow, cursor: 'pointer', padding: '4px 6px', borderRadius: 4 }}
                  onClick={() => {
                    logToTerminal(`Highlight command: Traced total ${nodes.length} node models.`);
                    showToast(`Selected all ${nodes.length} nodes`);
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={styles.statLabel}>Total Nodes</span>
                  <span style={{ ...styles.statValue, color: '#818cf8' }}>{nodes.length}</span>
                </div>
                <div
                  style={{ ...styles.statRow, cursor: 'pointer', padding: '4px 6px', borderRadius: 4 }}
                  onClick={() => {
                    logToTerminal(`Pulse command: Simulating high speed edge flow across all ${knowledgeGraphEdges.length} connections.`);
                    showToast(`Flow sync active on all ${knowledgeGraphEdges.length} edges`);
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={styles.statLabel}>Total Edges</span>
                  <span style={{ ...styles.statValue, color: '#38CE3C' }}>{knowledgeGraphEdges.length}</span>
                </div>
                <div
                  style={{ ...styles.statRow, cursor: 'pointer', padding: '4px 6px', borderRadius: 4 }}
                  onClick={() => {
                    logToTerminal(`Highlight command: Visible subset is ${filteredNodes.length} nodes.`);
                    showToast(`Highlighting ${filteredNodes.length} visible nodes`);
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={styles.statLabel}>Visible Nodes</span>
                  <span style={{ ...styles.statValue, color: '#f59e0b' }}>{filteredNodes.length}</span>
                </div>
                <div
                  style={{ ...styles.statRow, cursor: 'pointer', padding: '4px 6px', borderRadius: 4 }}
                  onClick={() => {
                    logToTerminal(`Highlight command: Visible subset is ${filteredEdges.length} edges.`);
                    showToast(`Highlighting ${filteredEdges.length} visible edges`);
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={styles.statLabel}>Visible Edges</span>
                  <span style={{ ...styles.statValue, color: '#ec4899' }}>{filteredEdges.length}</span>
                </div>
              </div>

              {/* Legend (from photo) */}
              <div style={{ ...styles.sidebarSection, borderBottom: 'none' }}>
                <div
                  style={{ ...styles.sectionTitle, cursor: 'pointer' }}
                  onClick={() => {
                    logToTerminal('Command: Flashed all node twins on network.');
                    showToast('Flashed all network nodes');
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#818cf8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <Layers size={12} /> LEGEND (Click to Flash Map)
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {Object.entries(nodeTypeColors).map(([type, color]) => {
                    const isLight = theme === 'light';
                    const activeTextCol = isLight ? (darkenedColors[type] || color) : '#fff';
                    const activeBgCol = isLight ? `${color}20` : `${color}18`;
                    const activeBorderCol = isLight ? `${color}70` : `${color}40`;
                    
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          toggleFilter(type);
                          logToTerminal(`Toggled filter for node type: ${type}`);
                          showToast(`${activeFilters[type] ? 'Disabled' : 'Enabled'} type: ${nodeTypeLabels[type]}`);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 10px',
                          borderRadius: '12px',
                          border: activeFilters[type] ? `1px solid ${activeBorderCol}` : '1px solid var(--surface-border)',
                          background: activeFilters[type] ? activeBgCol : 'var(--bg-700)',
                          color: activeFilters[type] ? activeTextCol : 'var(--text-muted)',
                          fontSize: '10px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          outline: 'none',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = activeFilters[type] 
                            ? (isLight ? `${color}30` : `${color}25`) 
                            : 'var(--bg-600)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = activeFilters[type] ? activeBgCol : 'var(--bg-700)';
                        }}
                      >
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
                        {nodeTypeLabels[type]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {!leftSidebarCollapsed && sidebarTab === 'metaphors' && (
            <div style={{ ...styles.sidebarSection, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={styles.sectionTitle}>
                <Sparkles size={12} color="#818cf8" /> Operational Metaphors
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', lineHeight: '1.4' }}>
                Select a truck metaphor component below to isolate and trace its corresponding ledger nodes.
              </div>

              {/* Steering Wheel Card */}
              <div
                onClick={() => setHighlightedMetaphor(highlightedMetaphor === 'steering' ? null : 'steering')}
                style={{
                  ...styles.metaphorCard,
                  ...(highlightedMetaphor === 'steering' ? styles.metaphorCardActive : {})
                }}
              >
                <div style={{ ...styles.metaphorHeader, color: '#6366f1' }}>
                  <Compass size={14} /> Steering (Executive Control)
                </div>
                <div style={styles.metaphorDesc}>
                  The GatiFleet Ops Hub and Executive Advisor nodes direct routing, consensus algorithms, and corporate priorities.
                </div>
              </div>

              {/* Accelerator Card */}
              <div
                onClick={() => setHighlightedMetaphor(highlightedMetaphor === 'accelerator' ? null : 'accelerator')}
                style={{
                  ...styles.metaphorCard,
                  ...(highlightedMetaphor === 'accelerator' ? styles.metaphorCardActive : {})
                }}
              >
                <div style={{ ...styles.metaphorHeader, color: '#10b981' }}>
                  <Gauge size={14} /> Accelerator (Velocity & Growth)
                </div>
                <div style={styles.metaphorDesc}>
                  Sales agents, active bookings, and cargo shipment flows act as the accelerator pedal that boosts dispatch speed.
                </div>
              </div>

              {/* Brakes Card */}
              <div
                onClick={() => setHighlightedMetaphor(highlightedMetaphor === 'brake' ? null : 'brake')}
                style={{
                  ...styles.metaphorCard,
                  ...(highlightedMetaphor === 'brake' ? styles.metaphorCardActive : {})
                }}
              >
                <div style={{ ...styles.metaphorHeader, color: '#FF4D6B' }}>
                  <ShieldAlert size={14} /> Brakes (Compliance & Auditing)
                </div>
                <div style={styles.metaphorDesc}>
                  Finance auditors (stopping tax leaks) and HR safety policies (restricting tired drivers) act as calipers preventing failures.
                </div>
              </div>

              {/* Wheels Card */}
              <div
                onClick={() => setHighlightedMetaphor(highlightedMetaphor === 'tyres' ? null : 'tyres')}
                style={{
                  ...styles.metaphorCard,
                  ...(highlightedMetaphor === 'tyres' ? styles.metaphorCardActive : {})
                }}
              >
                <div style={{ ...styles.metaphorHeader, color: '#06b6d4' }}>
                  <CircleDot size={14} /> Tyres (Ground Telemetry Loops)
                </div>
                <div style={styles.metaphorDesc}>
                  Warehouses, toll networks, and refuel gates provide tire contact with the physical road and verify digital twin data.
                </div>
              </div>

              {/* Headlights Card */}
              <div
                onClick={() => setHighlightedMetaphor(highlightedMetaphor === 'headlights' ? null : 'headlights')}
                style={{
                  ...styles.metaphorCard,
                  ...(highlightedMetaphor === 'headlights' ? styles.metaphorCardActive : {})
                }}
              >
                <div style={{ ...styles.metaphorHeader, color: '#ec4899' }}>
                  <Lightbulb size={14} /> Headlights (Route Forecasting)
                </div>
                <div style={styles.metaphorDesc}>
                  Active freight corridors look ahead, lighting paths and forecasting weather blockages or traffic delays.
                </div>
              </div>

              {/* Fuel Tank Card */}
              <div
                onClick={() => setHighlightedMetaphor(highlightedMetaphor === 'fuel' ? null : 'fuel')}
                style={{
                  ...styles.metaphorCard,
                  ...(highlightedMetaphor === 'fuel' ? styles.metaphorCardActive : {})
                }}
              >
                <div style={{ ...styles.metaphorHeader, color: '#f97316' }}>
                  <Fuel size={14} /> Fuel Tank (Treasury & Wallets)
                </div>
                <div style={styles.metaphorDesc}>
                  Fuel card wallets and billing accounts store the financial liquidity required to maintain operations.
                </div>
              </div>

              {/* Exhaust Card */}
              <div
                onClick={() => setHighlightedMetaphor(highlightedMetaphor === 'exhaust' ? null : 'exhaust')}
                style={{
                  ...styles.metaphorCard,
                  ...(highlightedMetaphor === 'exhaust' ? styles.metaphorCardActive : {})
                }}
              >
                <div style={{ ...styles.metaphorHeader, color: '#8b5cf6' }}>
                  <Zap size={14} /> Exhaust (Dispute Discharging)
                </div>
                <div style={styles.metaphorDesc}>
                  E-Invoices and credit disputes reconcile differences, venting financial anomalies out of the active ledger.
                </div>
              </div>
            </div>
          )}

          {!leftSidebarCollapsed && sidebarTab === 'gaps' && (
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
                          const coords = node3DCoords[gap.nodeTarget] || { x: 0, y: 0, z: 0 };
                          setPan({ x: -coords.x * scale3D + 200, y: -coords.y * scale3D + 200 });
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

          {/* Left Resize Handle */}
          {!leftSidebarCollapsed && (
            <div
              onMouseDown={startLeftResizing}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '6px',
                height: '100%',
                cursor: 'col-resize',
                zIndex: 1000,
                background: isLeftResizingRef.current ? 'rgba(99, 102, 241, 0.45)' : 'transparent',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            />
          )}
        </motion.div>

        {/* Floating Left Expand Button when collapsed */}
        {leftSidebarCollapsed && (
          <button
            onClick={() => setLeftSidebarCollapsed(false)}
            style={{
              position: 'absolute',
              left: 16,
              top: 76,
              zIndex: 99,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
            }}
          >
            <ChevronRight size={18} />
          </button>
        )}

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
              {/* Arrow markers */}
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
              {/* Depth sorted items */}
              {viewMode === 'graph' ? (
                renderOrderList.map(item => item.element)
              ) : (
                <>
                  {/* Edges in 2D Tree */}
                  {renderOrderList.filter(item => item.type === 'edge').map(item => item.element)}
                  {/* Nodes in 2D Tree */}
                  {renderOrderList.filter(item => item.type === 'node').map(item => item.element)}
                </>
              )}
            </g>
          </svg>

          {/* Orbit Control Box (Floating on Canvas) */}
          {viewMode === 'graph' && (
            <div style={styles.orbitControls}>
              <div style={styles.controlHeader}>
                <Compass size={14} color="#818cf8" />
                <span>3D Orbit Controls</span>
              </div>
              
              <div style={styles.controlRow}>
                <label style={{ fontSize: '10px' }}>Yaw (Turntable)</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={Math.round(rotation.yaw)}
                  onChange={e => {
                    setRotation(prev => ({ ...prev, yaw: parseFloat(e.target.value) }));
                    setAutoRotate(false); // pause auto-rotate on manual change
                  }}
                  style={styles.slider}
                />
                <span style={styles.controlVal}>{Math.round(rotation.yaw)}°</span>
              </div>

              <div style={styles.controlRow}>
                <label style={{ fontSize: '10px' }}>Pitch (Height)</label>
                <input
                  type="range"
                  min="-80"
                  max="80"
                  value={Math.round(rotation.pitch)}
                  onChange={e => {
                    setRotation(prev => ({ ...prev, pitch: parseFloat(e.target.value) }));
                    setAutoRotate(false);
                  }}
                  style={styles.slider}
                />
                <span style={styles.controlVal}>{Math.round(rotation.pitch)}°</span>
              </div>

              <div style={styles.controlActions}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <input
                    type="checkbox"
                    checked={autoRotate}
                    onChange={e => setAutoRotate(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  Auto-Rotate
                </label>
                
                <button
                  onClick={handleResetView}
                  style={{
                    background: 'var(--bg-700)', border: '1px solid var(--surface-border)',
                    borderRadius: 4, padding: '2px 8px', fontSize: '9px', color: 'var(--text-secondary)',
                    cursor: 'pointer', fontFamily: 'monospace'
                  }}
                >
                  RESET
                </button>
              </div>
            </div>
          )}

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
              {viewMode === 'graph' ? 'Drag to Orbit · Shift+Drag to Pan · Wheel to Zoom' : 'Drag nodes · Drag background to Pan · Wheel to Zoom'}
            </div>
          </div>
        </div>

        {/* ---- RIGHT DETAIL PANEL ---- */}
        <AnimatePresence>
          {selectedNodeData && (
            <motion.div
              style={{
                ...styles.detailPanel,
                width: rightPanelWidth,
                position: 'relative',
                overflow: 'visible',
                transition: isRightResizingRef.current ? 'none' : 'width 0.3s ease',
              }}
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Left resize handle */}
              <div
                onMouseDown={startRightResizing}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '6px',
                  height: '100%',
                  cursor: 'col-resize',
                  zIndex: 1000,
                  background: isRightResizingRef.current ? 'rgba(99, 102, 241, 0.45)' : 'transparent',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              />
              {/* Header */}
              <div style={styles.detailHeader}>
                <div style={styles.detailHeaderLeft}>
                  <div style={{
                    ...styles.detailIcon,
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-sm)',
                    background: `${nodeTypeColors[selectedNodeData.type]}20`,
                    border: `2px solid ${nodeTypeColors[selectedNodeData.type]}40`,
                    boxShadow: `0 0 20px ${nodeTypeColors[selectedNodeData.type]}20`,
                  }}>
                    {(() => {
                      const Icon = nodeTypeIcons[selectedNodeData.type] || Circle;
                      return <Icon size={16} color={nodeTypeColors[selectedNodeData.type]} />;
                    })()}
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {selectedNodeData.label}
                    </div>
                    <div style={{
                      fontSize: '8px',
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
                  style={{ ...styles.closeBtn, width: 24, height: 24 }}
                  onClick={() => setSelectedNode(null)}
                >
                  <X size={12} />
                </button>
              </div>

              {/* Body */}
              <div style={{ ...styles.detailBody, padding: '12px 15px' }}>
                {/* Active Anomaly Warning Panel */}
                {activeNodeGap && (
                  <div style={{
                    background: 'rgba(255, 77, 107, 0.1)',
                    border: '1px solid rgba(255, 77, 107, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 10px',
                    marginBottom: '12px',
                    boxShadow: '0 0 15px rgba(255, 77, 107, 0.1)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FF4D6B', fontWeight: 700, fontSize: '8px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <span>🚨</span> Active Operational Gap
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                      {activeNodeGap.title}
                    </div>
                    <div style={{ fontSize: '8px', color: 'var(--text-secondary)', lineHeight: 1.3, marginBottom: '8px' }}>
                      {activeNodeGap.desc}
                    </div>
                    <button
                      onClick={() => resolveGap(activeNodeGap.id)}
                      style={{
                        background: 'linear-gradient(135deg, #ff4d6b, #c2185b)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 10px',
                        fontSize: '8px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        width: '100%',
                        boxShadow: '0 4px 12px rgba(255, 77, 107, 0.2)',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.filter = 'brightness(1)'; }}
                    >
                      <Sparkles size={10} /> Authorize: {activeNodeGap.solution}
                    </button>
                  </div>
                )}

                {/* Metrics */}
                <div style={{ ...styles.sectionTitle, fontSize: '8px', marginTop: activeNodeGap ? '8px' : 0 }}>
                  <BarChart3 size={10} /> Properties
                </div>
                {Object.entries(selectedDetails).map(([key, value]) => (
                  <div key={key} style={{ ...styles.detailMetric, padding: '8px 10px' }}>
                    <span style={{ ...styles.detailMetricLabel, fontSize: '9px' }}>
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span style={{ ...styles.detailMetricValue, fontSize: '10.5px' }}>{value}</span>
                  </div>
                ))}

                {/* Connections */}
                <div style={{ ...styles.sectionTitle, fontSize: '8px', marginTop: '14px' }}>
                  <Link2 size={10} /> Connections ({selectedConnections.length})
                </div>
                {selectedConnections.map((conn, i) => {
                  const connColor = nodeTypeColors[conn.node.type] || '#64748b';
                  const ConnIcon = nodeTypeIcons[conn.node.type] || Circle;
                  return (
                    <div
                      key={i}
                      style={{ ...styles.connectionItem, padding: '6px 10px' }}
                      onClick={() => setSelectedNode(conn.node.id)}
                    >
                      <div style={{ ...styles.connectionDot, width: 6, height: 6, background: connColor, boxShadow: `0 0 6px ${connColor}60` }} />
                      <ConnIcon size={12} color={connColor} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '9px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {conn.node.label}
                        </div>
                        <div style={{ fontSize: '7.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                          {conn.direction === 'outgoing' ? (
                            <>
                              <ArrowRight size={8} /> {conn.edge.label}
                            </>
                          ) : (
                            <>
                              <ChevronRight size={8} style={{ transform: 'rotate(180deg)' }} /> {conn.edge.label}
                            </>
                          )}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '7px',
                        padding: '2px 5px',
                        borderRadius: '6px',
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
              <div style={{ ...styles.actionBtns, padding: '12px 15px' }}>
                <button style={{ ...styles.actionBtnPrimary, fontSize: '9px', padding: '8px' }} onClick={() => setIsViewModalOpen(true)}>
                  <Eye size={12} /> View
                </button>
                <button style={{ ...styles.actionBtn, fontSize: '9px', padding: '8px' }} onClick={handleOpenEdit}>
                  <Edit3 size={12} /> Edit
                </button>
                <button 
                  style={{
                    ...styles.actionBtn,
                    fontSize: '9px',
                    padding: '8px',
                    borderColor: 'rgba(255,77,107,0.3)',
                    color: '#FF4D6B',
                  }}
                  onClick={() => setIsRemoveModalOpen(true)}
                >
                  <Trash2 size={12} /> Remove
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
            <span style={{ fontSize: '12px' }}>{actionAlert.icon}</span>
            <span style={{ fontSize: '10px', fontWeight: 600 }}>{actionAlert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- View Modal ---- */}
      {isViewModalOpen && selectedNodeData && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.container}>
            <div style={modalStyles.header}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Network size={14} color={nodeTypeColors[selectedNodeData.type]} />
                <span style={modalStyles.title}>Detailed Node Inspection</span>
              </div>
              <button style={modalStyles.closeBtn} onClick={() => setIsViewModalOpen(false)}>
                <X size={14} />
              </button>
            </div>
            <div style={modalStyles.body}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '8px', 
                  background: `${nodeTypeColors[selectedNodeData.type]}15`,
                  border: `2px solid ${nodeTypeColors[selectedNodeData.type]}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {(() => {
                    const Icon = nodeTypeIcons[selectedNodeData.type] || Circle;
                    return <Icon size={20} color={nodeTypeColors[selectedNodeData.type]} />;
                  })()}
                </div>
                <div>
                  <h4 style={{ margin: 0, color: '#fff', fontSize: '13px', fontWeight: 700 }}>{selectedNodeData.label}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '9px', color: nodeTypeColors[selectedNodeData.type], fontWeight: 700, textTransform: 'uppercase' }}>
                    {nodeTypeLabels[selectedNodeData.type]} (ID: {selectedNodeData.id})
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={modalStyles.infoSection}>
                  <h5 style={modalStyles.sectionHeader}>Operational Brain Status</h5>
                  <p style={modalStyles.sectionDesc}>Active digital twin tracking is operational. Telemetry latency is healthy at 22ms. Consensus validation verified.</p>
                </div>
                
                <div style={modalStyles.infoSection}>
                  <h5 style={modalStyles.sectionHeader}>Properties Dictionary</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {Object.entries(selectedDetails).map(([k, v]) => (
                      <div key={k} style={modalStyles.propRow}>
                        <span style={modalStyles.propKey}>{k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, ' $1')}:</span>
                        <span style={modalStyles.propVal}>{v}</span>
                      </div>
                    ))}
                    {Object.keys(selectedDetails).length === 0 && (
                      <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)' }}>No additional metadata properties registered.</p>
                    )}
                  </div>
                </div>

                <div style={modalStyles.infoSection}>
                  <h5 style={modalStyles.sectionHeader}>Strategic Value Index</h5>
                  <p style={modalStyles.sectionDesc}>This component maps to active GatiFleet CRM logistics intelligence pathways. Removal can trigger operational simulation failures in downstream engines.</p>
                </div>
              </div>
            </div>
            <div style={modalStyles.footer}>
              <button style={modalStyles.btnPrimary} onClick={() => setIsViewModalOpen(false)}>Close Inspection</button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Edit Modal ---- */}
      {isEditModalOpen && selectedNodeData && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.container}>
            <div style={modalStyles.header}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit3 size={14} color="#818cf8" />
                <span style={modalStyles.title}>Edit Node Properties</span>
              </div>
              <button style={modalStyles.closeBtn} onClick={() => setIsEditModalOpen(false)}>
                <X size={14} />
              </button>
            </div>
            <div style={modalStyles.body}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={modalStyles.inputLabel}>Node Name / Label</label>
                  <input
                    type="text"
                    style={modalStyles.input}
                    value={editLabel}
                    onChange={e => setEditLabel(e.target.value)}
                  />
                </div>

                <div>
                  <label style={modalStyles.inputLabel}>Node Type</label>
                  <select
                    style={modalStyles.select}
                    value={editType}
                    onChange={e => setEditType(e.target.value)}
                  >
                    {Object.keys(nodeTypeLabels).map(type => (
                      <option key={type} value={type}>
                        {nodeTypeLabels[type]}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', marginTop: '4px' }}>
                  <h5 style={{ ...modalStyles.sectionHeader, marginBottom: '10px' }}>Custom Properties</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {Object.entries(editProperties).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ width: '120px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1')}:
                        </span>
                        <input
                          type="text"
                          style={{ ...modalStyles.input, flex: 1, margin: 0 }}
                          value={val}
                          onChange={e => {
                            const nextProps = { ...editProperties };
                            nextProps[key] = e.target.value;
                            setEditProperties(nextProps);
                          }}
                        />
                      </div>
                    ))}
                    {Object.keys(editProperties).length === 0 && (
                      <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)' }}>No editable properties.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div style={modalStyles.footer}>
              <button style={modalStyles.btnSecondary} onClick={() => setIsEditModalOpen(false)}>Cancel</button>
              <button style={modalStyles.btnPrimary} onClick={handleSaveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Remove Modal ---- */}
      {isRemoveModalOpen && selectedNodeData && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.container}>
            <div style={modalStyles.header}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trash2 size={14} color="#FF4D6B" />
                <span style={modalStyles.title}>Safe Node Decommissioning</span>
              </div>
              <button style={modalStyles.closeBtn} onClick={() => setIsRemoveModalOpen(false)}>
                <X size={14} />
              </button>
            </div>
            <div style={modalStyles.body}>
              <div style={{ background: 'rgba(255, 77, 107, 0.08)', border: '1px solid rgba(255, 77, 107, 0.25)', borderRadius: '6px', padding: '12px', marginBottom: '16px', display: 'flex', gap: '10px' }}>
                <span style={{ fontSize: '14px' }}>⚠️</span>
                <div style={{ fontSize: '10px', color: '#ff8a9e', lineHeight: 1.4 }}>
                  <strong>Caution:</strong> You are removing node <strong>{selectedNodeData.label}</strong> ({selectedNodeData.id}) from the active digital twin network. All associated routing relationships and live simulation edges will be deleted immediately.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={modalStyles.inputLabel}>Reason for Decommissioning</label>
                  <select
                    style={modalStyles.select}
                    value={removeReasonCategory}
                    onChange={e => setRemoveReasonCategory(e.target.value)}
                  >
                    <option value="Completed Operational Lifecycle">Completed Operational Lifecycle</option>
                    <option value="Duplicate/Incorrect Node Matching">Duplicate/Incorrect Node Matching</option>
                    <option value="Manual Override (Operator Verification)">Manual Override (Operator Verification)</option>
                    <option value="System Disruption/Corrupt Telemetry">System Disruption/Corrupt Telemetry</option>
                    <option value="Resolved via Alternative Route">Resolved via Alternative Route</option>
                  </select>
                </div>

                <div>
                  <label style={modalStyles.inputLabel}>Additional Operator Comments / Log (Optional)</label>
                  <textarea
                    style={modalStyles.textarea}
                    rows={3}
                    placeholder="Enter details or notes regarding this removal for the double-timeline audit ledger..."
                    value={removeReasonCustom}
                    onChange={e => setRemoveReasonCustom(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div style={modalStyles.footer}>
              <button style={modalStyles.btnSecondary} onClick={() => setIsRemoveModalOpen(false)}>Cancel</button>
              <button style={{ ...modalStyles.btnPrimary, background: '#FF4D6B' }} onClick={handleConfirmRemove}>Decommission Node</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles for custom modals
const modalStyles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'rgba(5, 8, 22, 0.75)',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  container: {
    background: 'rgba(15, 23, 42, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)',
    width: '100%',
    maxWidth: '520px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
    borderRadius: '4px',
  },
  body: {
    padding: '20px',
    maxHeight: '450px',
    overflowY: 'auto',
  },
  footer: {
    padding: '12px 20px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    background: 'rgba(0,0,0,0.2)',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '11px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  btnSecondary: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--text-muted)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  infoSection: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '12px',
  },
  sectionHeader: {
    margin: '0 0 6px 0',
    fontSize: '11px',
    fontWeight: 700,
    color: '#818cf8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  sectionDesc: {
    margin: 0,
    fontSize: '11px',
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
  },
  propRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 0',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
  },
  propKey: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  propVal: {
    fontSize: '11px',
    color: 'var(--text-primary)',
    fontWeight: 600,
  },
  inputLabel: {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  input: {
    width: '100%',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '6px',
    padding: '8px 12px',
    color: '#fff',
    fontSize: '12px',
    outline: 'none',
  },
  select: {
    width: '100%',
    background: 'rgba(15, 23, 42, 0.95)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '6px',
    padding: '8px 12px',
    color: '#fff',
    fontSize: '12px',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '6px',
    padding: '8px 12px',
    color: '#fff',
    fontSize: '12px',
    outline: 'none',
    resize: 'none',
  }
};

export default KnowledgeGraph;
