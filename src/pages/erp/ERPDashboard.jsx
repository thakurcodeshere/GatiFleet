/* eslint-disable */
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, TrendingUp, TrendingDown, IndianRupee, ArrowUpRight,
  ArrowDownRight, FileText, Clock, AlertTriangle, CheckCircle2,
  Receipt, ShieldCheck, BarChart3, Landmark, Package, Scale,
  ChevronRight, Filter, Download, Calendar, RefreshCw, Search,
  CreditCard, Wallet, PieChart, BadgeCheck, ArrowRight, Star,
  Fuel, Wrench, Truck, CircleDollarSign, Eye, MoreVertical,
  ExternalLink, Percent, Timer, FileCheck, ShieldAlert, Check,
  Zap, AlertCircle, PlusCircle, User, Banknote
} from 'lucide-react';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler
} from 'chart.js';
import { 
  erpData, 
  formatCurrency, 
  formatNumber, 
  fastagAccounts, 
  ewayBills, 
  gstReconciliationLog 
} from '../../data/mockData';
import { RealityEngine } from '../../data/RealityEngine';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler
);

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'compliance', label: 'Compliance Hub', icon: Scale, badge: 'Active' },
  { id: 'procurement', label: 'Procurement', icon: Package },
  { id: 'accounting', label: 'Accounting', icon: Landmark },
  { id: 'invoicing', label: 'Invoicing', icon: Receipt },
];

const initialProcurementOrders = [
  { id: 'PO-2026-901', vendor: 'Indian Oil Corporation', date: '2026-06-18', amount: 4800000, items: 'Bulk Diesel - 50KL', status: 'Pending Approval', requestedBy: 'Amit Tiwari (Operations)' },
  { id: 'PO-2026-898', vendor: 'Bridgestone India', date: '2026-06-17', amount: 1560000, items: 'Radial Tyres R16 - 120 Units', status: 'Approved', requestedBy: 'Rajesh Kumar (Fleet Main.)' },
  { id: 'PO-2026-894', vendor: 'Bosch Limited', date: '2026-06-15', amount: 840000, items: 'Alternators & Fuel Injectors', status: 'Approved', requestedBy: 'Ganesh Patil (Inventory)' },
  { id: 'PO-2026-890', vendor: 'Hindustan Petroleum', date: '2026-06-14', amount: 3500000, items: 'Bulk Diesel - 35KL', status: 'Pending Approval', requestedBy: 'Amit Tiwari (Operations)' },
  { id: 'PO-2026-886', vendor: 'BPCL Fuel Cards', date: '2026-06-12', amount: 5000000, items: 'Fleet Card Reload Balance', status: 'Approved', requestedBy: 'Arjun Kapoor (CEO)' }
];

const initialInvoices = [
  { id: 'INV-2026-1048', customer: 'Reliance Supply Chain', date: '2026-06-19', amount: 450000, status: 'Paid', cargo: 'Electronics', route: 'Delhi → Mumbai' },
  { id: 'INV-2026-1047', customer: 'Tata Motors Logistics', date: '2026-06-18', amount: 890000, status: 'Pending', cargo: 'Automotive Parts', route: 'Pune → Bangalore' },
  { id: 'INV-2026-1046', customer: 'Gati Logistics', date: '2026-06-17', amount: 240000, status: 'Pending', cargo: 'FMCG', route: 'Bangalore → Chennai' },
  { id: 'INV-2026-1045', customer: 'Delhivery Express', date: '2026-06-16', amount: 620000, status: 'Paid', cargo: 'Merchandise', route: 'Noida → Kolkata' },
  { id: 'INV-2026-1044', customer: 'Safexpress', date: '2026-06-15', amount: 180000, status: 'Overdue', cargo: 'Textiles', route: 'Jaipur → Indore' },
  { id: 'INV-2026-1043', customer: 'BlueDart Cargo', date: '2026-06-14', amount: 310000, status: 'Paid', cargo: 'Medications', route: 'Hyderabad → Delhi' }
];

const financialCards = [
  { label: 'Revenue', value: '₹128.4Cr', change: '+12.8%', trend: 'up', icon: TrendingUp, color: '#38CE3C', subtext: 'vs ₹113.8Cr last year' },
  { label: 'Expenses', value: '₹96.8Cr', change: '+8.2%', trend: 'up', icon: TrendingDown, color: '#FF4D6B', subtext: 'vs ₹89.5Cr last year' },
  { label: 'Net Profit', value: '₹31.6Cr', change: '24.6%', trend: 'up', icon: IndianRupee, color: '#6366f1', subtext: '24.6% profit margin' },
  { label: 'Cash Flow', value: '₹14.2Cr', change: '+6.4%', trend: 'up', icon: Wallet, color: '#3b82f6', subtext: 'Operating cash flow' },
];

const topVendors = [
  { name: 'Indian Oil Corporation', category: 'Fuel', spend: '₹18.4Cr', orders: 4523, rating: 4.6, status: 'Active' },
  { name: 'Hindustan Petroleum (HPCL)', category: 'Fuel', spend: '₹14.2Cr', orders: 3891, rating: 4.5, status: 'Active' },
  { name: 'Bharat Petroleum (BPCL)', category: 'Fuel', spend: '₹11.8Cr', orders: 3245, rating: 4.4, status: 'Active' },
  { name: 'Bridgestone India', category: 'Tyres', spend: '₹8.6Cr', orders: 1876, rating: 4.7, status: 'Active' },
  { name: 'Bosch Limited', category: 'Parts', spend: '₹6.2Cr', orders: 1234, rating: 4.8, status: 'Active' },
];

const monthlyPnL = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  revenue: [9.8, 10.2, 10.8, 11.4, 10.6, 11.2, 11.8, 12.1, 11.6, 10.4, 10.8, 8.8],
  expenses: [7.4, 7.8, 8.2, 8.6, 8.0, 8.4, 8.9, 9.1, 8.7, 7.9, 8.2, 6.5],
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg-900)',
    padding: '24px 28px 40px',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text-primary)',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  headerIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  iconBadge: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-md)',
    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    letterSpacing: '-0.5px',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    margin: 0,
    marginLeft: '62px',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    padding: '9px 16px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--surface-border)',
    background: 'var(--surface)',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    backdropFilter: 'blur(12px)',
    transition: 'all 0.2s ease',
    fontFamily: 'var(--font-sans)',
  },
  primaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    padding: '9px 18px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)',
    fontFamily: 'var(--font-sans)',
  },
  tabsBar: {
    display: 'flex',
    gap: '4px',
    marginBottom: '28px',
    background: 'var(--surface)',
    backdropFilter: 'blur(16px)',
    borderRadius: 'var(--radius-md)',
    padding: '5px',
    border: '1px solid var(--surface-border)',
    width: 'fit-content',
  },
  tab: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: active ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'transparent',
    color: active ? '#fff' : 'var(--text-secondary)',
    fontSize: '13px',
    fontWeight: active ? '600' : '500',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    fontFamily: 'var(--font-sans)',
    boxShadow: active ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none',
    position: 'relative',
  }),
  tabBadge: {
    position: 'absolute',
    top: '-6px',
    right: '-4px',
    padding: '2px 6px',
    borderRadius: '8px',
    background: 'var(--danger-500)',
    color: '#fff',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.5px',
  },
  bentoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '24px',
  },
  card: {
    background: 'var(--surface)',
    backdropFilter: 'blur(16px)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--surface-border)',
    padding: '22px',
    position: 'relative',
    overflow: 'hidden',
  },
  cardGlow: (color) => ({
    position: 'absolute',
    top: '-40px',
    right: '-40px',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: color,
    opacity: 0.08,
    filter: 'blur(30px)',
    pointerEvents: 'none',
  }),
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '14px',
  },
  cardLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardIconSmall: (color) => ({
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-sm)',
    background: `${color}18`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  cardValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '6px',
    letterSpacing: '-0.5px',
  },
  cardChange: (trend) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    fontWeight: '600',
    color: trend === 'up' ? '#38CE3C' : '#FF4D6B',
    background: trend === 'up' ? 'rgba(56, 206, 60, 0.1)' : 'rgba(255, 77, 107, 0.1)',
    padding: '3px 8px',
    borderRadius: '20px',
  }),
  cardSubtext: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '8px',
  },
  bentoRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.6fr',
    gap: '20px',
    marginBottom: '24px',
  },
  bentoRowAlt: {
    display: 'grid',
    gridTemplateColumns: '1.6fr 1fr',
    gap: '20px',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  invoiceStat: (color) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: 'var(--radius-sm)',
    background: `${color}0a`,
    border: `1px solid ${color}22`,
    marginBottom: '10px',
  }),
  invoiceDot: (color) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
  }),
  invoiceLabel: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    flex: 1,
  },
  invoiceCount: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
  },
  chartWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 0',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 6px',
  },
  th: {
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    padding: '8px 14px',
  },
  tr: {
    background: 'var(--bg-800)',
    transition: 'all 0.2s ease',
  },
  td: {
    padding: '14px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    borderTop: '1px solid var(--surface-border)',
    borderBottom: '1px solid var(--surface-border)',
  },
  tdFirst: {
    padding: '14px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    borderTop: '1px solid var(--surface-border)',
    borderBottom: '1px solid var(--surface-border)',
    borderLeft: '1px solid var(--surface-border)',
    borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
  },
  tdLast: {
    padding: '14px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    borderTop: '1px solid var(--surface-border)',
    borderBottom: '1px solid var(--surface-border)',
    borderRight: '1px solid var(--surface-border)',
    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
  },
  vendorName: {
    fontWeight: '600',
    color: 'var(--text-primary)',
    fontSize: '13.5px',
  },
  vendorCategory: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
  categoryBadge: (cat) => {
    const colors = { Fuel: '#3b82f6', Tyres: '#f59e0b', Parts: '#10b981' };
    const c = colors[cat] || '#6366f1';
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '600',
      color: c,
      background: `${c}15`,
    };
  },
  ratingStars: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
  gstGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
    marginBottom: '18px',
  },
  gstItem: {
    padding: '16px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-800)',
    border: '1px solid var(--surface-border)',
  },
  gstLabel: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginBottom: '6px',
    fontWeight: '500',
  },
  gstValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    background: 'var(--bg-600)',
    overflow: 'hidden',
    marginTop: '12px',
  },
  progressFill: (pct, color) => ({
    height: '100%',
    width: `${pct}%`,
    borderRadius: '4px',
    background: `linear-gradient(90deg, ${color}, ${color}cc)`,
    transition: 'width 1s ease',
  }),
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#38CE3C',
    background: 'rgba(56, 206, 60, 0.1)',
  },
  // COMPLIANCE HUB SPECIFIC STYLES
  complianceGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr 1fr',
    gap: '20px',
    marginBottom: '24px',
  },
  badgeStatus: (status) => {
    let bg = 'rgba(99, 102, 241, 0.1)';
    let text = 'var(--primary-400)';
    if (status === 'critical' || status === 'EXPIRED' || status === 'ROUTE_MISMATCH') {
      bg = 'rgba(255, 77, 107, 0.1)';
      text = 'var(--danger-500)';
    } else if (status === 'warning' || status === 'NEAR_DESTINATION') {
      bg = 'rgba(255, 222, 115, 0.1)';
      text = 'var(--warning-500)';
    } else if (status === 'healthy' || status === 'MATCHED' || status === 'Reconciled' || status === 'Approved') {
      bg = 'rgba(56, 206, 60, 0.1)';
      text = 'var(--success-500)';
    }
    return {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '600',
      background: bg,
      color: text
    };
  },
  actionMiniBtn: (type = 'primary') => ({
    border: 'none',
    background: type === 'primary' ? 'var(--gradient-primary)' : 'var(--bg-600)',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    boxShadow: type === 'primary' ? '0 2px 6px rgba(99, 102, 241, 0.2)' : 'none',
    transition: 'all 0.2s',
  }),
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    background: 'var(--bg-800)',
    border: '1px solid var(--primary-500)',
    borderRadius: 'var(--radius-md)',
    boxShadow: '0 8px 30px rgba(99,102,241,0.2)',
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    zIndex: 9999,
  },
  // PO MODAL & INVOICE MODAL
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    width: '460px',
    background: 'var(--bg-700)',
    border: '1px solid var(--surface-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '28px',
    boxShadow: 'var(--shadow-2xl)',
  },
  formGroup: {
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    background: 'var(--bg-800)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontSize: '13.5px',
    outline: 'none',
    fontFamily: 'var(--font-sans)',
  },
  label: {
    fontSize: '12px',
    fontWeight: '500',
    color: 'var(--text-secondary)',
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 28 },
  },
};

const ERPDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [engineState, setEngineState] = useState(RealityEngine.getState());

  // STATE-DRIVEN COMPLIANCE WIDGETS
  const [fastags, setFastags] = useState(fastagAccounts);
  const [ewbs, setEwbs] = useState(ewayBills);
  const [gstDiscrepancies, setGstDiscrepancies] = useState(gstReconciliationLog.discrepancies);
  const [gstMatchRate, setGstMatchRate] = useState(gstReconciliationLog.matchingRate);
  
  // INVOICES & PROCUREMENT STATE
  const [invoices, setInvoices] = useState(initialInvoices);
  const [procurementOrders, setProcurementOrders] = useState(initialProcurementOrders);
  
  // MODALS & INPUTS STATE
  const [toast, setToast] = useState(null);
  const [isRecharging, setIsRecharging] = useState(null); // Fastag ID
  const [rechargeVal, setRechargeVal] = useState(5000);
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [newInvoiceData, setNewInvoiceData] = useState({ customer: '', amount: '', cargo: '', route: '' });

  // Sync state with RealityEngine singleton
  useEffect(() => {
    const unsubscribe = RealityEngine.subscribe((state) => {
      setEngineState(state);
    });
    return () => unsubscribe();
  }, []);

  // AUTO-TRIGGER TOAST TIMEOUT
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // DERIVED COUNTERS FOR COMPLIANCE BADGING
  const criticalFastags = useMemo(() => fastags.filter(f => f.status === 'critical').length, [fastags]);
  const mismatchEwbs = useMemo(() => ewbs.filter(e => e.status === 'ROUTE_MISMATCH' || e.status === 'EXPIRED').length, [ewbs]);

  // RECHARGE ACTION
  const handleRecharge = (id) => {
    setIsRecharging(id);
  };

  const confirmRecharge = () => {
    if (!isRecharging) return;
    setFastags(prev => prev.map(f => {
      if (f.id === isRecharging) {
        const newBal = f.balance + Number(rechargeVal);
        let newStatus = 'healthy';
        if (newBal < f.threshold) newStatus = 'warning';
        return { ...f, balance: newBal, status: newStatus };
      }
      return f;
    }));
    const targetAcc = fastags.find(f => f.id === isRecharging);
    setToast({
      title: 'FASTag Recharged',
      message: `Successfully loaded ₹${rechargeVal.toLocaleString('en-IN')} to ${targetAcc.regNumber} via ${targetAcc.bank}.`,
      type: 'success'
    });
    setIsRecharging(null);
  };

  // AUTO RECHARGE RULE TOGGLE
  const toggleAutoRecharge = (id) => {
    setFastags(prev => prev.map(f => {
      if (f.id === id) {
        const nextState = !f.autoRecharge;
        return { ...f, autoRecharge: nextState };
      }
      return f;
    }));
  };

  // EXTEND E-WAY BILL VALIDITY
  const handleExtendEwb = (id) => {
    setEwbs(prev => prev.map(e => {
      if (e.id === id) {
        return { ...e, status: 'MATCHED', expiresAt: '24h 00m (Extended)', routeCompliance: 100 };
      }
      return e;
    }));
    const targetEwb = ewbs.find(e => e.id === id);
    setToast({
      title: 'E-Way Bill Extended',
      message: `Tax authority approved 24h validity extension for EWB-${id} (${targetEwb.regNumber}).`,
      type: 'success'
    });
  };

  // RECONCILE GST DISCREPANCY
  const handleReconcileGst = (id) => {
    setGstDiscrepancies(prev => prev.map(d => {
      if (d.id === id) return { ...d, status: 'Reconciled' };
      return d;
    }));
    
    // Recalculate match rates dynamically
    const remainingOpen = gstDiscrepancies.filter(d => d.id !== id && d.status === 'Open').length;
    const reconciledCount = gstReconciliationLog.discrepancies.length - remainingOpen;
    const newRate = +(((gstReconciliationLog.matchedCount + reconciledCount) / (gstReconciliationLog.totalInvoices)) * 100).toFixed(1);
    setGstMatchRate(newRate);

    const targetDsc = gstDiscrepancies.find(d => d.id === id);
    setToast({
      title: 'GST Credit Matched',
      message: `Matched GSTR-2B entry for ${targetDsc.vendor} (Inv: ${targetDsc.invoiceNo}). Input credit released.`,
      type: 'success'
    });
  };

  // APPROVE PO
  const handleApprovePO = (id) => {
    setProcurementOrders(prev => prev.map(po => {
      if (po.id === id) return { ...po, status: 'Approved' };
      return po;
    }));
    const po = procurementOrders.find(p => p.id === id);
    setToast({
      title: 'Purchase Order Approved',
      message: `PO-${id} for ${po.vendor} worth ₹${(po.amount/100000).toFixed(1)}L auto-sent to vendor.`,
      type: 'success'
    });
  };

  // CREATE INVOICE
  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (!newInvoiceData.customer || !newInvoiceData.amount) return;
    const newInv = {
      id: `INV-2026-${1000 + invoices.length + 1}`,
      customer: newInvoiceData.customer,
      date: new Date().toISOString().split('T')[0],
      amount: Number(newInvoiceData.amount),
      status: 'Pending',
      cargo: newInvoiceData.cargo || 'General Freight',
      route: newInvoiceData.route || 'Mumbai → Delhi'
    };
    setInvoices(prev => [newInv, ...prev]);
    setToast({
      title: 'Invoice Dispatched',
      message: `Invoice ${newInv.id} dispatched to ${newInv.customer} (E-sign complete).`,
      type: 'success'
    });
    setShowNewInvoice(false);
    setNewInvoiceData({ customer: '', amount: '', cargo: '', route: '' });
  };

  // DERIVED DATA FOR CHARTS
  const invoiceOverviewData = useMemo(() => {
    const paidVal = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
    const pendingVal = invoices.filter(i => i.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
    const overdueVal = invoices.filter(i => i.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0);
    return { paidVal, pendingVal, overdueVal };
  }, [invoices]);

  const doughnutData = useMemo(() => ({
    labels: ['Paid', 'Pending', 'Overdue'],
    datasets: [{
      data: [
        invoices.filter(i => i.status === 'Paid').length,
        invoices.filter(i => i.status === 'Pending').length,
        invoices.filter(i => i.status === 'Overdue').length
      ],
      backgroundColor: ['#38CE3C', '#FFDE73', '#FF4D6B'],
      borderWidth: 0,
      hoverOffset: 6,
      cutout: '72%',
      spacing: 3,
      borderRadius: 6,
    }],
  }), [invoices]);

  const doughnutOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(10, 14, 26, 0.9)',
        titleFont: { family: 'Inter', size: 13, weight: '600' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        cornerRadius: 8,
        borderColor: 'rgba(99, 102, 241, 0.2)',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed} invoices`,
        },
      },
    },
  }), []);

  const lineData = useMemo(() => ({
    labels: monthlyPnL.labels,
    datasets: [
      {
        label: 'Revenue',
        data: monthlyPnL.revenue,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
      {
        label: 'Expenses',
        data: monthlyPnL.expenses,
        borderColor: '#FF4D6B',
        backgroundColor: 'rgba(255, 77, 107, 0.05)',
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#FF4D6B',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
    ],
  }), []);

  const lineOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          color: 'var(--text-secondary)',
          font: { family: 'Inter', size: 12, weight: '500' },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(10, 14, 26, 0.9)',
        titleFont: { family: 'Inter', size: 13, weight: '600' },
        bodyFont: { family: 'Inter', size: 12 },
        padding: 12,
        cornerRadius: 8,
        borderColor: 'rgba(99, 102, 241, 0.2)',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ₹${ctx.parsed.y}Cr`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(99, 102, 241, 0.06)', drawBorder: false },
        ticks: { color: 'var(--text-muted)', font: { family: 'Inter', size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(99, 102, 241, 0.06)', drawBorder: false },
        ticks: {
          color: 'var(--text-muted)',
          font: { family: 'Inter', size: 11 },
          callback: (v) => `₹${v}Cr`,
        },
        border: { display: false },
      },
    },
  }), []);

  // SUB-TAB RENDERERS
  const renderOverviewTab = () => {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        {/* Financial KPI Strip */}
        <div style={styles.bentoGrid}>
          {financialCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div key={i} style={styles.card} variants={itemVariants} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
                <div style={styles.cardGlow(card.color)} />
                <div style={styles.cardHeader}>
                  <span style={styles.cardLabel}>{card.label}</span>
                  <div style={styles.cardIconSmall(card.color)}>
                    <Icon size={18} color={card.color} />
                  </div>
                </div>
                <div style={styles.cardValue}>{card.value}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={styles.cardChange(card.trend)}>
                    {card.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {card.change}
                  </span>
                </div>
                <div style={styles.cardSubtext}>{card.subtext}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Invoice Summary + Top Vendors */}
        <div style={styles.bentoRow}>
          {/* Invoice Summary Card */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>
              <Receipt size={18} color="#6366f1" />
              Invoicing & Cash Pipeline
              <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>
                Active: {invoices.length} invoices
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'center' }}>
              <div style={{ ...styles.chartWrap, height: '180px', position: 'relative' }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
                    {((invoices.filter(i => i.status === 'Paid').length / invoices.length) * 100).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Paid Rate</div>
                </div>
              </div>

              <div>
                <div style={styles.invoiceStat('#38CE3C')}>
                  <div style={styles.invoiceDot('#38CE3C')} />
                  <span style={styles.invoiceLabel}>Paid</span>
                  <span style={styles.invoiceCount}>₹{(invoiceOverviewData.paidVal/100000).toFixed(1)}L</span>
                </div>
                <div style={styles.invoiceStat('#FFDE73')}>
                  <div style={styles.invoiceDot('#FFDE73')} />
                  <span style={styles.invoiceLabel}>Pending</span>
                  <span style={styles.invoiceCount}>₹{(invoiceOverviewData.pendingVal/100000).toFixed(1)}L</span>
                </div>
                <div style={styles.invoiceStat('#FF4D6B')}>
                  <div style={styles.invoiceDot('#FF4D6B')} />
                  <span style={styles.invoiceLabel}>Overdue</span>
                  <span style={styles.invoiceCount}>₹{(invoiceOverviewData.overdueVal/100000).toFixed(1)}L</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Vendors Card */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>
              <Package size={18} color="#3b82f6" />
              Strategic Vendors
              <span style={{ marginLeft: 'auto' }}>
                <button onClick={() => setActiveTab('procurement')} style={{ ...styles.actionBtn, padding: '6px 12px', fontSize: '12px' }}>
                  Procurement Panel <ChevronRight size={13} />
                </button>
              </span>
            </div>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Vendor</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Spend</th>
                  <th style={styles.th}>Orders</th>
                  <th style={styles.th}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {topVendors.map((vendor, i) => {
                  const CatIcon = vendor.category === 'Fuel' ? Fuel : vendor.category === 'Tyres' ? Truck : Wrench;
                  return (
                    <tr key={i} style={styles.tr}>
                      <td style={styles.tdFirst}>
                        <div style={styles.vendorName}>{vendor.name}</div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.categoryBadge(vendor.category)}>
                          <CatIcon size={11} />
                          {vendor.category}
                        </span>
                      </td>
                      <td style={{ ...styles.td, fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
                        {vendor.spend}
                      </td>
                      <td style={{ ...styles.td, fontFamily: 'var(--font-mono)' }}>
                        {vendor.orders.toLocaleString('en-IN')}
                      </td>
                      <td style={styles.tdLast}>
                        <div style={styles.ratingStars}>
                          <Star size={13} color="#FFDE73" fill="#FFDE73" />
                          <span style={{ fontSize: '13px', fontWeight: '600', marginLeft: '4px' }}>{vendor.rating}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Profit Trend + Quick Compliance Card */}
        <div style={styles.bentoRowAlt}>
          <div style={styles.card}>
            <div style={styles.sectionTitle}>
              <BarChart3 size={18} color="#6366f1" />
              P&L Trend — Corporate Accountancy
            </div>
            <div style={{ height: '260px', padding: '4px 0' }}>
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.sectionTitle}>
              <ShieldCheck size={18} color="#38CE3C" />
              Compliance Snapshot
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>GST Filings on Time</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#38CE3C' }}>{erpData.gstCompliance.filedOnTime}%</span>
              </div>
              <div style={styles.progressBar}>
                <div style={styles.progressFill(erpData.gstCompliance.filedOnTime, '#38CE3C')} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '4px' }}>
                <div style={{ ...styles.gstItem, background: 'var(--bg-900)' }}>
                  <div style={styles.gstLabel}>FASTag Low Balances</div>
                  <div style={{ ...styles.gstValue, color: criticalFastags > 0 ? 'var(--danger-500)' : 'var(--success-500)' }}>
                    {criticalFastags} vehicles
                  </div>
                </div>
                <div style={{ ...styles.gstItem, background: 'var(--bg-900)' }}>
                  <div style={styles.gstLabel}>EWB Discrepancies</div>
                  <div style={{ ...styles.gstValue, color: mismatchEwbs > 0 ? 'var(--danger-500)' : 'var(--success-500)' }}>
                    {mismatchEwbs} flagged
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setActiveTab('compliance')} 
                style={{
                  ...styles.primaryBtn, 
                  justifyContent: 'center', 
                  padding: '12px', 
                  marginTop: '6px',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <Scale size={15} /> Go to Compliance Hub
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderComplianceTab = () => {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        {/* Compliance Status Cards */}
        <div style={styles.bentoGrid}>
          <div style={styles.card}>
            <div style={styles.cardGlow('var(--danger-500)')} />
            <div style={styles.cardHeader}>
              <span style={styles.cardLabel}>FASTag Toll Security</span>
              <div style={styles.cardIconSmall('var(--danger-500)')}>
                <CreditCard size={18} color="var(--danger-500)" />
              </div>
            </div>
            <div style={styles.cardValue}>
              {fastags.filter(f => f.balance < f.threshold).length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <AlertTriangle size={13} color="var(--warning-500)" />
              <span>Vehicles below threshold limits</span>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardGlow('var(--warning-500)')} />
            <div style={styles.cardHeader}>
              <span style={styles.cardLabel}>Active E-way Bills</span>
              <div style={styles.cardIconSmall('var(--warning-500)')}>
                <FileText size={18} color="var(--warning-500)" />
              </div>
            </div>
            <div style={styles.cardValue}>{ewbs.length}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <Zap size={13} color="var(--primary-400)" />
              <span>{ewbs.filter(e => e.status === 'ROUTE_MISMATCH').length} GPS Route Mismatches</span>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardGlow('var(--success-500)')} />
            <div style={styles.cardHeader}>
              <span style={styles.cardLabel}>GST Match Rate (ITC)</span>
              <div style={styles.cardIconSmall('var(--success-500)')}>
                <ShieldCheck size={18} color="var(--success-500)" />
              </div>
            </div>
            <div style={styles.cardValue}>{gstMatchRate}%</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={13} color="var(--success-500)" />
              <span>Reconciled with GSTR-2B ledger</span>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardGlow('var(--primary-500)')} />
            <div style={styles.cardHeader}>
              <span style={styles.cardLabel}>Compliance Rating</span>
              <div style={styles.cardIconSmall('var(--primary-500)')}>
                <BadgeCheck size={18} color="var(--primary-400)" />
              </div>
            </div>
            <div style={styles.cardValue}>A+</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <Scale size={13} color="var(--primary-400)" />
              <span>Zero pending tax violations</span>
            </div>
          </div>
        </div>

        {/* 1. FASTag Wallet Optimizer */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>
            <CreditCard size={18} color="#3b82f6" />
            FASTag Fleet Wallets & Smart-Recharge Controls
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)' }}>
              Connected Banks: ICICI, HDFC, SBI, Axis
            </span>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Vehicle ID</th>
                <th style={styles.th}>Registration</th>
                <th style={styles.th}>Clearing Bank</th>
                <th style={styles.th}>Wallet Balance</th>
                <th style={styles.th}>Avg Toll/Day</th>
                <th style={styles.th}>Auto-Recharge Rule</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fastags.map((f) => (
                <tr key={f.id} style={styles.tr}>
                  <td style={styles.tdFirst}>
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{f.vehicleId}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontWeight: 600 }}>{f.regNumber}</span>
                  </td>
                  <td style={styles.td}>{f.bank}</td>
                  <td style={{ ...styles.td, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    ₹{f.balance.toLocaleString('en-IN')}
                  </td>
                  <td style={{ ...styles.td, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    ₹{f.avgDailySpend}/day
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox"
                        checked={f.autoRecharge}
                        onChange={() => toggleAutoRecharge(f.id)}
                        style={{ cursor: 'pointer', width: '15px', height: '15px', accentColor: 'var(--primary-500)' }}
                      />
                      <span style={{ fontSize: '12px', color: f.autoRecharge ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                        {f.autoRecharge ? `Auto (Thresh: ₹${f.threshold})` : 'Disabled'}
                      </span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badgeStatus(f.status)}>
                      {f.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ ...styles.tdLast, textAlign: 'right' }}>
                    <button 
                      onClick={() => handleRecharge(f.id)}
                      style={styles.actionMiniBtn('primary')}
                    >
                      <Banknote size={12} /> Recharge
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2. E-way Bill GPS validation */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>
            <FileText size={18} color="#FFDE73" />
            E-way Bill Validity & Real-time GPS Compliance
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)' }}>
              Filing integration with NIC / GST Portal
            </span>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>EWB Number</th>
                <th style={styles.th}>Truck</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Route</th>
                <th style={styles.th}>Cargo Value</th>
                <th style={styles.th}>GPS Match Score</th>
                <th style={styles.th}>Expiry Countdown</th>
                <th style={styles.th}>GPS Route Status</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ewbs.map((e) => (
                <tr key={e.id} style={styles.tr}>
                  <td style={styles.tdFirst}>
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{e.id}</span>
                  </td>
                  <td style={styles.td}>{e.regNumber}</td>
                  <td style={styles.td}>{e.customer}</td>
                  <td style={styles.td}>{e.origin} → {e.destination}</td>
                  <td style={{ ...styles.td, fontFamily: 'var(--font-mono)' }}>
                    ₹{(e.value / 100000).toFixed(1)}L
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ ...styles.progressBar, width: '60px', margin: 0 }}>
                        <div style={styles.progressFill(e.routeCompliance, e.routeCompliance > 85 ? '#38CE3C' : '#FF4D6B')} />
                      </div>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>{e.routeCompliance}%</span>
                    </div>
                  </td>
                  <td style={{ ...styles.td, fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} color={e.status === 'EXPIRED' ? 'var(--danger-500)' : 'var(--text-muted)'} />
                      <span style={{ color: e.status === 'EXPIRED' ? 'var(--danger-500)' : 'inherit' }}>{e.expiresAt}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badgeStatus(e.status)}>
                      {e.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ ...styles.tdLast, textAlign: 'right' }}>
                    {e.status !== 'MATCHED' && (
                      <button 
                        onClick={() => handleExtendEwb(e.id)}
                        style={styles.actionMiniBtn('secondary')}
                      >
                        <Timer size={12} /> Extend 24h
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. GST Input Tax Credit Reconciliation */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>
            <ShieldCheck size={18} color="#38CE3C" />
            GST Input Tax Credit (ITC) Matching Log
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)' }}>
              Matching transporter logs against GSTR-2B returns
            </span>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Discrepancy ID</th>
                <th style={styles.th}>Vendor</th>
                <th style={styles.th}>GSTIN</th>
                <th style={styles.th}>Invoice No</th>
                <th style={styles.th}>Discrepancy Type</th>
                <th style={styles.th}>Book Value</th>
                <th style={styles.th}>GSTR-2B Value</th>
                <th style={styles.th}>Variance</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {gstDiscrepancies.map((d) => (
                <tr key={d.id} style={styles.tr}>
                  <td style={styles.tdFirst}>
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{d.id}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ fontWeight: 600 }}>{d.vendor}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Date: {d.date}</div>
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{d.gstIn}</td>
                  <td style={{ ...styles.td, fontFamily: 'var(--font-mono)' }}>{d.invoiceNo}</td>
                  <td style={{ ...styles.td, color: d.status === 'Open' ? '#FFDE73' : 'var(--text-muted)' }}>
                    {d.type}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'var(--font-mono)' }}>
                    ₹{d.bookValue.toLocaleString('en-IN')}
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'var(--font-mono)' }}>
                    {d.gstr2bValue === 0 ? '-' : `₹${d.gstr2bValue.toLocaleString('en-IN')}`}
                  </td>
                  <td style={{ ...styles.td, color: 'var(--danger-500)', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
                    {d.discrepancy > 0 ? `+₹${d.discrepancy.toLocaleString('en-IN')}` : '-'}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badgeStatus(d.status)}>
                      {d.status}
                    </span>
                  </td>
                  <td style={{ ...styles.tdLast, textAlign: 'right' }}>
                    {d.status === 'Open' && (
                      <button 
                        onClick={() => handleReconcileGst(d.id)}
                        style={styles.actionMiniBtn('primary')}
                      >
                        <Check size={12} /> Reconcile
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  };

  const renderProcurementTab = () => {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        <div style={styles.bentoGrid}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardLabel}>Procurement Spend</span>
              <div style={styles.cardIconSmall('var(--primary-500)')}>
                <IndianRupee size={18} color="var(--primary-400)" />
              </div>
            </div>
            <div style={styles.cardValue}>₹28.4Cr</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total procurement budget spent</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardLabel}>Pending Approvals</span>
              <div style={styles.cardIconSmall('var(--warning-500)')}>
                <Clock size={18} color="var(--warning-500)" />
              </div>
            </div>
            <div style={styles.cardValue}>
              {procurementOrders.filter(p => p.status === 'Pending Approval').length}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Orders awaiting CEO/VP sign-off</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardLabel}>Active Purchase Orders</span>
              <div style={styles.cardIconSmall('var(--success-500)')}>
                <FileCheck size={18} color="var(--success-500)" />
              </div>
            </div>
            <div style={styles.cardValue}>
              {procurementOrders.filter(p => p.status === 'Approved').length}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Approved orders in dispatch/billing</div>
          </div>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardLabel}>Avg Vendor Lead Time</span>
              <div style={styles.cardIconSmall('var(--primary-500)')}>
                <Timer size={18} color="var(--primary-400)" />
              </div>
            </div>
            <div style={styles.cardValue}>2.4 days</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Time from PO issue to delivery</div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.sectionTitle}>
            <Package size={18} color="var(--primary-500)" />
            Procurement & Purchase Approvals Queue
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>PO Number</th>
                <th style={styles.th}>Vendor</th>
                <th style={styles.th}>Request Date</th>
                <th style={styles.th}>Items Description</th>
                <th style={styles.th}>Requested By</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {procurementOrders.map((po) => (
                <tr key={po.id} style={styles.tr}>
                  <td style={styles.tdFirst}>
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{po.id}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontWeight: 600 }}>{po.vendor}</span>
                  </td>
                  <td style={styles.td}>{po.date}</td>
                  <td style={styles.td}>{po.items}</td>
                  <td style={styles.td}>{po.requestedBy}</td>
                  <td style={{ ...styles.td, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    ₹{po.amount.toLocaleString('en-IN')}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badgeStatus(po.status)}>
                      {po.status}
                    </span>
                  </td>
                  <td style={{ ...styles.tdLast, textAlign: 'right' }}>
                    {po.status === 'Pending Approval' ? (
                      <button 
                        onClick={() => handleApprovePO(po.id)}
                        style={styles.actionMiniBtn('primary')}
                      >
                        <CheckCircle2 size={12} /> Approve PO
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={12} color="var(--success-500)" /> Dispatched
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  };

  const renderAccountingTab = () => {
    // Generate dummy ledger logs
    const ledgers = [
      { code: 'AC-1002', name: 'Operational Fuel Account', type: 'Expense', balance: 184500000, margin: 'Fuel contracts' },
      { code: 'AC-1005', name: 'FASTag National Toll Ledger', type: 'Expense', balance: 54600000, margin: 'NHAI clearances' },
      { code: 'AC-1010', name: 'Driver Salaries & Allowances', type: 'Expense', balance: 213000000, margin: 'HCM core' },
      { code: 'AC-3001', name: 'Enterprise SaaS Receivables', type: 'Asset', balance: 186000000, margin: 'Invoice dues' },
      { code: 'AC-3005', name: 'HPCL Procurement Payables', type: 'Liability', balance: 124000000, margin: 'Procurement bills' },
      { code: 'AC-5001', name: 'GST Input Tax Credit Accruals', type: 'Asset', balance: 92000000, margin: 'Tax ledger' }
    ];

    const projectionData = {
      labels: ['Jun 19', 'Jun 20', 'Jun 21', 'Jun 22', 'Jun 23', 'Jun 24', 'Jun 25'],
      actual: [14.2, 14.5, 14.8, 14.4, 15.1, 15.6, 16.2],
      predicted: [14.2, 14.6, 14.9, 14.6, 15.3, 16.0, 16.8]
    };

    const projectionChartData = {
      labels: projectionData.labels,
      datasets: [
        {
          label: 'Projected Cash Balance',
          data: projectionData.predicted,
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.05)',
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          borderDash: [5, 5]
        },
        {
          label: 'Actual Cash Balance',
          data: projectionData.actual,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.3
        }
      ]
    };

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* General Ledger */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>
              <Landmark size={18} color="var(--primary-500)" />
              General Ledger Accounts (FY 2026-27)
            </div>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Code</th>
                  <th style={styles.th}>Account Name</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Current Balance</th>
                  <th style={styles.th}>Description</th>
                </tr>
              </thead>
              <tbody>
                {ledgers.map((l, i) => (
                  <tr key={i} style={styles.tr}>
                    <td style={styles.tdFirst}>
                      <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{l.code}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ fontWeight: 600 }}>{l.name}</span>
                    </td>
                    <td style={styles.td}>{l.type}</td>
                    <td style={{ ...styles.td, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      ₹{(l.balance/10000000).toFixed(2)}Cr
                    </td>
                    <td style={styles.tdLast}>{l.margin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Cash Flow Forecast */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>
              <TrendingUp size={18} color="var(--success-500)" />
              Daily Cash Flow Projection (₹Cr)
            </div>
            <div style={{ height: '220px', padding: '4px 0' }}>
              <Line 
                data={projectionChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'top', labels: { color: 'var(--text-secondary)' } } },
                  scales: {
                    x: { grid: { color: 'rgba(99,102,241,0.05)' }, ticks: { color: 'var(--text-muted)' } },
                    y: { grid: { color: 'rgba(99,102,241,0.05)' }, ticks: { color: 'var(--text-muted)' } }
                  }
                }} 
              />
            </div>
          </div>

          {/* Budget Limits control */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>
              <PlusCircle size={18} color="var(--primary-500)" />
              Operational Budget Cap Limits
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>Daily Fuel Purchase limit per vehicle</span>
                  <span style={{ fontWeight: 600 }}>₹25,000</span>
                </div>
                <input type="range" min="5000" max="50000" defaultValue="25000" style={{ width: '100%', accentColor: 'var(--primary-500)' }} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>Daily FASTag Auto-Trigger Recharge</span>
                  <span style={{ fontWeight: 600 }}>₹5,000</span>
                </div>
                <input type="range" min="1000" max="15000" defaultValue="5000" style={{ width: '100%', accentColor: 'var(--primary-500)' }} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderInvoicingTab = () => {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            List of invoices matching e-way bills and customer contracts
          </div>
          <button 
            onClick={() => setShowNewInvoice(true)} 
            style={styles.primaryBtn}
          >
            <PlusCircle size={15} /> Create E-Invoice
          </button>
        </div>

        <div style={styles.card}>
          <div style={styles.sectionTitle}>
            <Receipt size={18} color="var(--primary-500)" />
            Invoicing Register
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Invoice ID</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Invoice Date</th>
                <th style={styles.th}>Route Details</th>
                <th style={styles.th}>Cargo Description</th>
                <th style={styles.th}>Invoice Amount</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} style={styles.tr}>
                  <td style={styles.tdFirst}>
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{inv.id}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ fontWeight: 600 }}>{inv.customer}</span>
                  </td>
                  <td style={styles.td}>{inv.date}</td>
                  <td style={styles.td}>{inv.route}</td>
                  <td style={styles.td}>{inv.cargo}</td>
                  <td style={{ ...styles.td, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    ₹{inv.amount.toLocaleString('en-IN')}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badgeStatus(inv.status)}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ ...styles.tdLast, textAlign: 'right' }}>
                    {inv.status !== 'Paid' ? (
                      <button 
                        onClick={() => {
                          setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: 'Paid' } : i));
                          setToast({
                            title: 'Invoice Settled',
                            message: `Marked ${inv.id} as paid. Receivables updated.`,
                            type: 'success'
                          });
                        }}
                        style={styles.actionMiniBtn('primary')}
                      >
                        Settle Payment
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} color="var(--success-500)" /> Paid & Reconciled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  };

  return (
    <div style={styles.page}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            style={styles.toast}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(56, 206, 60, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Check size={16} color="#38CE3C" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-primary)' }}>{toast.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{toast.message}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FASTag Recharge Modal */}
      <AnimatePresence>
        {isRecharging && (
          <div style={styles.modalOverlay}>
            <motion.div 
              style={styles.modal}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div style={{ ...styles.sectionTitle, marginBottom: '20px' }}>
                <CreditCard size={18} color="var(--primary-500)" />
                Confirm Toll Wallet Recharge
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
                You are performing an instant gateway payment recharge for truck{' '}
                <strong>{fastags.find(f => f.id === isRecharging)?.regNumber}</strong>.
              </p>
              
              <div style={styles.formGroup}>
                <span style={styles.label}>Select Recharge Amount</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[2000, 5000, 10000].map(amt => (
                    <button 
                      key={amt} 
                      onClick={() => setRechargeVal(amt)}
                      style={{
                        ...styles.actionBtn, 
                        justifyContent: 'center', 
                        borderColor: rechargeVal === amt ? 'var(--primary-500)' : 'var(--surface-border)',
                        background: rechargeVal === amt ? 'rgba(99,102,241,0.1)' : 'var(--surface)',
                        color: rechargeVal === amt ? 'var(--primary-400)' : 'var(--text-secondary)'
                      }}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.formGroup}>
                <span style={styles.label}>Custom Amount (₹)</span>
                <input 
                  type="number" 
                  value={rechargeVal}
                  onChange={(e) => setRechargeVal(Number(e.target.value))}
                  style={styles.input}
                  placeholder="Enter amount"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                <button onClick={() => setIsRecharging(null)} style={styles.actionBtn}>Cancel</button>
                <button onClick={confirmRecharge} style={styles.primaryBtn}>Initiate Payment</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Invoice Modal */}
      <AnimatePresence>
        {showNewInvoice && (
          <div style={styles.modalOverlay}>
            <motion.div 
              style={styles.modal}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div style={{ ...styles.sectionTitle, marginBottom: '20px' }}>
                <Receipt size={18} color="var(--primary-500)" />
                Generate Tax Invoice
              </div>
              <form onSubmit={handleCreateInvoice}>
                <div style={styles.formGroup}>
                  <span style={styles.label}>Customer Name</span>
                  <input 
                    type="text" 
                    required 
                    value={newInvoiceData.customer} 
                    onChange={e => setNewInvoiceData(prev => ({ ...prev, customer: e.target.value }))}
                    style={styles.input} 
                    placeholder="e.g. Reliance Supply Chain" 
                  />
                </div>
                <div style={styles.formGroup}>
                  <span style={styles.label}>Amount (₹)</span>
                  <input 
                    type="number" 
                    required 
                    value={newInvoiceData.amount} 
                    onChange={e => setNewInvoiceData(prev => ({ ...prev, amount: e.target.value }))}
                    style={styles.input} 
                    placeholder="e.g. 450000" 
                  />
                </div>
                <div style={styles.formGroup}>
                  <span style={styles.label}>Route Description</span>
                  <input 
                    type="text" 
                    value={newInvoiceData.route} 
                    onChange={e => setNewInvoiceData(prev => ({ ...prev, route: e.target.value }))}
                    style={styles.input} 
                    placeholder="e.g. Delhi → Mumbai" 
                  />
                </div>
                <div style={styles.formGroup}>
                  <span style={styles.label}>Cargo Cargo type</span>
                  <input 
                    type="text" 
                    value={newInvoiceData.cargo} 
                    onChange={e => setNewInvoiceData(prev => ({ ...prev, cargo: e.target.value }))}
                    style={styles.input} 
                    placeholder="e.g. Polymers, Electronics" 
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowNewInvoice(false)} style={styles.actionBtn}>Cancel</button>
                  <button type="submit" style={styles.primaryBtn}>Generate & Dispatch</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div style={styles.headerRow}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <div style={styles.iconBadge}>
              <Building2 size={24} color="#fff" />
            </div>
            <h1 style={styles.title}>Enterprise Resource Planning</h1>
          </div>
          <p style={styles.subtitle}>
            Financial operations, procurement, and real-time compliance management
          </p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.actionBtn}>
            <Calendar size={15} />
            FY 2026-27
          </button>
          <button style={styles.actionBtn}>
            <Download size={15} />
            Export Audit Logs
          </button>
          <button style={styles.primaryBtn}>
            <RefreshCw size={15} />
            Sync GSTN Portal
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsBar}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isCompliance = tab.id === 'compliance';
          const alertCount = criticalFastags + mismatchEwbs;
          
          return (
            <motion.button
              key={tab.id}
              style={styles.tab(activeTab === tab.id)}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={15} />
              {tab.label}
              {isCompliance && alertCount > 0 && (
                <span style={styles.tabBadge}>{alertCount}</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Dynamic Tab Contents */}
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'compliance' && renderComplianceTab()}
      {activeTab === 'procurement' && renderProcurementTab()}
      {activeTab === 'accounting' && renderAccountingTab()}
      {activeTab === 'invoicing' && renderInvoicingTab()}
    </div>
  );
};

export default ERPDashboard;
