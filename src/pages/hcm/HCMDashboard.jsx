/* eslint-disable */
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, UserMinus, Award, Truck, Building2,
  Calendar, Download, Star, CircleDot, ArrowUpRight, ArrowDownRight,
  Wallet, IndianRupee, CheckCircle2, Trophy, AlertCircle,
  GraduationCap, BadgeCheck, Medal, Activity, ShieldAlert,
  HeartPulse, Gauge, PlayCircle, ShieldCheck, RefreshCw, X,
  AlertTriangle, UserCheck, CalendarDays, Check, RotateCcw,
  Sparkles, Plus, Search, Filter, Clock, Heart, ChevronRight
} from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { hcmDrivers, formatCurrency, formatNumber } from '../../data/mockData';
import { RealityEngine } from '../../data/RealityEngine';

ChartJS.register(ArcElement, Tooltip, Legend);

// Tabs Configuration
const tabs = [
  { id: 'overview', label: 'Overview', icon: Users },
  { id: 'safety', label: 'Safety Academy', icon: ShieldAlert, badge: 'Digital Twin' },
  { id: 'roster', label: 'Attendance & Roster', icon: CalendarDays },
  { id: 'payroll', label: 'Payroll & Benefits', icon: Wallet },
  { id: 'training', label: 'Training Academy', icon: GraduationCap },
];

const workforceCards = [
  {
    label: 'Total Employees',
    value: '1,842',
    change: '+45 this month',
    icon: Users,
    color: '#f59e0b',
    subItems: [
      { label: 'Drivers', value: '1,240', icon: Truck },
      { label: 'Office', value: '602', icon: Building2 },
    ],
  },
  {
    label: 'New Hires',
    value: '45',
    change: '+12% vs last month',
    icon: UserPlus,
    color: '#38CE3C',
    trend: 'up',
  },
  {
    label: 'Attrition Rate',
    value: '3.8%',
    change: '-0.4% vs last quarter',
    icon: UserMinus,
    color: '#FF4D6B',
    trend: 'down',
  },
  {
    label: 'Avg Tenure',
    value: '3.2 yrs',
    change: 'Industry avg: 2.1 yrs',
    icon: Award,
    color: '#6366f1',
  },
];

const attendanceData = {
  present: 1678,
  absent: 82,
  onLeave: 56,
  late: 26,
  total: 1842,
  rate: 94.2,
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
    background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
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
    background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    color: '#1a1a2e',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(245, 158, 11, 0.3)',
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
    background: active ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : 'transparent',
    color: active ? '#1a1a2e' : 'var(--text-secondary)',
    fontSize: '13px',
    fontWeight: active ? '600' : '500',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    fontFamily: 'var(--font-sans)',
    boxShadow: active ? '0 2px 8px rgba(245, 158, 11, 0.3)' : 'none',
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
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  bentoGrid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '24px',
  },
  workforceCard: {
    background: 'var(--surface)',
    backdropFilter: 'blur(16px)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--surface-border)',
    padding: '22px',
    position: 'relative',
    overflow: 'hidden',
  },
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
    color: trend === 'up' ? '#38CE3C' : trend === 'down' ? '#FF4D6B' : 'var(--text-muted)',
    background: trend ? (trend === 'up' ? 'rgba(56, 206, 60, 0.1)' : 'rgba(255, 77, 107, 0.1)') : 'transparent',
    padding: trend ? '3px 8px' : '0',
    borderRadius: '20px',
  }),
  subItems: {
    display: 'flex',
    gap: '12px',
    marginTop: '14px',
    paddingTop: '14px',
    borderTop: '1px solid var(--surface-border)',
  },
  subItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    flex: 1,
  },
  bentoRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.8fr',
    gap: '20px',
    marginBottom: '24px',
  },
  bentoRowAlt: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '20px',
    marginBottom: '24px',
  },
  attendanceGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '16px',
  },
  attendanceItem: (color) => ({
    padding: '14px 16px',
    borderRadius: 'var(--radius-sm)',
    background: `${color}0a`,
    border: `1px solid ${color}22`,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  }),
  attendanceDot: (color) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: color,
    flexShrink: 0,
  }),
  attendanceLabel: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  attendanceValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 5px',
  },
  th: {
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    padding: '8px 10px',
  },
  tr: {
    background: 'var(--bg-800)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  td: {
    padding: '11px 10px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    borderTop: '1px solid var(--surface-border)',
    borderBottom: '1px solid var(--surface-border)',
  },
  tdFirst: {
    padding: '11px 10px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    borderTop: '1px solid var(--surface-border)',
    borderBottom: '1px solid var(--surface-border)',
    borderLeft: '1px solid var(--surface-border)',
    borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
  },
  tdLast: {
    padding: '11px 10px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    borderTop: '1px solid var(--surface-border)',
    borderBottom: '1px solid var(--surface-border)',
    borderRight: '1px solid var(--surface-border)',
    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
  },
  statusBadge: (status) => {
    const map = {
      'on-trip': { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', label: 'On Trip' },
      'available': { color: '#38CE3C', bg: 'rgba(56, 206, 60, 0.1)', label: 'Available' },
      'on-leave': { color: '#FFDE73', bg: 'rgba(255, 222, 115, 0.15)', label: 'On Leave' },
      'rest': { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', label: 'Rest' },
    };
    const m = map[status] || map.available;
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '600',
      color: m.color,
      background: m.bg,
    };
  },
  statusLabel: (status) => {
    const map = { 'on-trip': 'On Trip', 'available': 'Available', 'on-leave': 'On Leave', 'rest': 'Rest' };
    return map[status] || 'Available';
  },
  ratingStars: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
  safetyScore: (score) => {
    const color = score >= 95 ? '#38CE3C' : score >= 85 ? '#FFDE73' : '#FF4D6B';
    return {
      fontWeight: '700',
      fontSize: '13px',
      fontFamily: 'var(--font-mono)',
      color,
    };
  },
  payrollGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  payrollItem: {
    padding: '16px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-800)',
    border: '1px solid var(--surface-border)',
  },
  payrollLabel: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginBottom: '6px',
    fontWeight: '500',
  },
  payrollValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  perfGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '14px',
  },
  perfCard: () => ({
    padding: '18px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-800)',
    border: '1px solid var(--surface-border)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  }),
  perfGlow: (color) => ({
    position: 'absolute',
    top: '-20px',
    right: '-20px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: color,
    opacity: 0.1,
    filter: 'blur(20px)',
    pointerEvents: 'none',
  }),
  perfValue: {
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  perfLabel: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    background: 'var(--bg-600)',
    overflow: 'hidden',
  },
  progressFill: (pct, color) => ({
    height: '100%',
    width: `${pct}%`,
    borderRadius: '4px',
    background: `linear-gradient(90deg, ${color}, ${color}cc)`,
  }),
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

const HCMDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [engineState, setEngineState] = useState(RealityEngine.getState());
  const [drivers, setDrivers] = useState(hcmDrivers);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [safetyFilter, setSafetyFilter] = useState('all'); // all, high-fatigue, low-safety, bonus-eligible
  const [rosterShiftFilter, setRosterShiftFilter] = useState('all'); // all, morning, evening, night
  const [toast, setToast] = useState(null);

  // Sync state with RealityEngine singleton
  useEffect(() => {
    const unsubscribe = RealityEngine.subscribe((state) => {
      setEngineState(state);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Toast Notification handler
  const handleAssignTraining = (drvId) => {
    setDrivers(prev => prev.map(drv => {
      if (drv.id === drvId) {
        return {
          ...drv,
          safety: Math.min(drv.safety + 10, 100),
          fatigue: Math.max(drv.fatigue - 15, 5),
          trainingStatus: 'Completed',
          violationsCount: { harshBraking: 0, overSpeeding: 0, tailgating: 0, hos: 0 },
          incidents: drv.incidents.map(inc => ({ ...inc, status: 'Resolved' })),
          recommendation: 'None'
        };
      }
      return drv;
    }));
    const d = drivers.find(x => x.id === drvId);
    showToast(`AI Performance Agent assigned Defensive Driving Training to ${d.name}`);
    
    // Dispatch training compliance event
    RealityEngine.dispatchEvent('DRIVER_CHECK_IN', {
      desc: `Defensive Driving Training assigned to driver ${d.name} (${d.id}). Safety limits reset.`,
      module: 'M9',
      entityType: 'DRIVER',
      entityId: drvId
    });

    // Update active drawer if open
    setSelectedDriver(prev => {
      if (prev && prev.id === drvId) {
        return {
          ...prev,
          safety: Math.min(prev.safety + 10, 100),
          fatigue: Math.max(prev.fatigue - 15, 5),
          trainingStatus: 'Completed',
          violationsCount: { harshBraking: 0, overSpeeding: 0, tailgating: 0, hos: 0 },
          incidents: prev.incidents.map(inc => ({ ...inc, status: 'Resolved' })),
          recommendation: 'None'
        };
      }
      return prev;
    });
  };

  const handleApproveBonus = (drvId) => {
    setDrivers(prev => prev.map(drv => {
      if (drv.id === drvId) {
        return {
          ...drv,
          bonusStatus: 'Paid',
          recommendation: 'None'
        };
      }
      return drv;
    }));
    const d = drivers.find(x => x.id === drvId);
    showToast(`AI Performance Agent approved ₹5,000 Safety Bonus for ${d.name}`);

    // Dispatch bonus payroll event
    RealityEngine.dispatchEvent('DRIVER_PAYROLL_CALCULATED', {
      desc: `Approved safety compliance bonus for driver ${d.name} (${d.id}). Settle ledger active.`,
      module: 'M9',
      entityType: 'DRIVER',
      entityId: drvId
    });

    setSelectedDriver(prev => {
      if (prev && prev.id === drvId) {
        return { ...prev, bonusStatus: 'Paid', recommendation: 'None' };
      }
      return prev;
    });
  };

  const handleTriggerRest = (drvId) => {
    setDrivers(prev => prev.map(drv => {
      if (drv.id === drvId) {
        return {
          ...drv,
          status: 'rest',
          fatigue: 5,
          recommendation: 'None'
        };
      }
      return drv;
    }));
    const d = drivers.find(x => x.id === drvId);
    showToast(`Mandatory 24h rest period triggered for ${d.name}. Vehicle locked.`);

    // Dispatch fatigue swap event
    RealityEngine.dispatchEvent('DRIVER_FATIGUE_ALERT', {
      desc: `Mandatory 24h HOS rest swap triggered for driver ${d.name} (${d.id}). Shift roster updated, vehicle locked.`,
      module: 'M9',
      entityType: 'DRIVER',
      entityId: drvId
    });

    setSelectedDriver(prev => {
      if (prev && prev.id === drvId) {
        return { ...prev, status: 'rest', fatigue: 5, recommendation: 'None' };
      }
      return prev;
    });
  };

  // Memoized calculations
  const attendanceDoughnut = useMemo(() => ({
    labels: ['Present', 'Absent', 'On Leave', 'Late'],
    datasets: [{
      data: [
        attendanceData.present,
        attendanceData.absent,
        attendanceData.onLeave,
        attendanceData.late,
      ],
      backgroundColor: ['#38CE3C', '#FF4D6B', '#FFDE73', '#f97316'],
      borderColor: ['transparent', 'transparent', 'transparent', 'transparent'],
      borderWidth: 0,
      hoverOffset: 6,
      cutout: '74%',
      spacing: 3,
      borderRadius: 6,
    }],
  }), []);

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
        borderColor: 'rgba(245, 158, 11, 0.2)',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.parsed.toLocaleString('en-IN')}`,
        },
      },
    },
  }), []);

  // Filtered drivers for Safety tab
  const filteredDrivers = useMemo(() => {
    return drivers.filter(drv => {
      const matchesSearch = drv.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            drv.truck.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (safetyFilter === 'high-fatigue') return drv.fatigue > 30;
      if (safetyFilter === 'low-safety') return drv.safety < 80;
      if (safetyFilter === 'bonus-eligible') return drv.bonusStatus === 'Eligible';
      
      return true;
    });
  }, [drivers, searchQuery, safetyFilter]);

  // Roster drivers with Shift
  const rosterDrivers = useMemo(() => {
    return drivers.map((drv, i) => {
      let shift = 'Morning Shift (08:00 - 16:00)';
      if (i % 3 === 1) shift = 'Evening Shift (16:00 - 00:00)';
      if (i % 3 === 2) shift = 'Night Shift (00:00 - 08:00)';

      let checkIn = '07:45 AM';
      if (i % 3 === 1) checkIn = '03:50 PM';
      if (i % 3 === 2) checkIn = '11:42 PM';
      if (drv.status === 'on-leave') checkIn = '—';
      if (drv.status === 'rest') checkIn = 'Resting';

      return { ...drv, shift, checkIn };
    }).filter(drv => {
      if (rosterShiftFilter === 'morning') return drv.shift.includes('Morning');
      if (rosterShiftFilter === 'evening') return drv.shift.includes('Evening');
      if (rosterShiftFilter === 'night') return drv.shift.includes('Night');
      return true;
    });
  }, [drivers, rosterShiftFilter]);

  // Aggregate safety calculations
  const safetyStats = useMemo(() => {
    const total = drivers.length;
    const avgSafety = Math.round(drivers.reduce((acc, d) => acc + d.safety, 0) / total);
    const avgSkill = Math.round(drivers.reduce((acc, d) => acc + d.skill, 0) / total);
    const avgFatigue = Math.round(drivers.reduce((acc, d) => acc + d.fatigue, 0) / total);
    const avgFuel = Math.round(drivers.reduce((acc, d) => acc + d.fuel, 0) / total);
    const criticalFatigue = drivers.filter(d => d.fatigue > 40).length;
    const lowSafety = drivers.filter(d => d.safety < 80).length;
    
    return { avgSafety, avgSkill, avgFatigue, avgFuel, criticalFatigue, lowSafety };
  }, [drivers]);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.headerRow}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <div style={styles.iconBadge}>
              <Users size={24} color="#1a1a2e" />
            </div>
            <h1 style={styles.title}>Human Capital Management</h1>
          </div>
          <p style={styles.subtitle}>
            Workforce analytics, safety academy twins, shift rosters & payroll ledger
          </p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.actionBtn}>
            <Calendar size={15} />
            June 2026
          </button>
          <button style={styles.actionBtn}>
            <Download size={15} />
            Export Report
          </button>
          <button style={styles.primaryBtn}>
            <UserPlus size={15} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={styles.tabsBar}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedDriver(null);
              }}
              style={styles.tab(activeTab === tab.id)}
            >
              <Icon size={16} />
              {tab.label}
              {tab.badge && <span style={styles.tabBadge}>{tab.badge}</span>}
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" key={activeTab}>
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* Workforce Summary Cards */}
            <motion.div style={styles.bentoGrid4} variants={containerVariants}>
              {workforceCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={i}
                    style={styles.workforceCard}
                    variants={itemVariants}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  >
                    <div style={styles.cardGlow(card.color)} />
                    <div style={styles.cardHeader}>
                      <span style={styles.cardLabel}>{card.label}</span>
                      <div style={styles.cardIconSmall(card.color)}>
                        <Icon size={18} color={card.color} />
                      </div>
                    </div>
                    <div style={styles.cardValue}>{card.value}</div>
                    <div style={styles.cardChange(card.trend)}>
                      {card.trend === 'up' && <ArrowUpRight size={12} />}
                      {card.trend === 'down' && <ArrowDownRight size={12} />}
                      {card.change}
                    </div>
                    {card.subItems && (
                      <div style={styles.subItems}>
                        {card.subItems.map((sub, j) => {
                          const SubIcon = sub.icon;
                          return (
                            <div key={j} style={styles.subItem}>
                              <SubIcon size={13} color="var(--text-muted)" />
                              <span>{sub.label}:</span>
                              <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                                {sub.value}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Attendance + Roster Row */}
            <motion.div style={styles.bentoRow} variants={containerVariants}>
              
              {/* Attendance Donut */}
              <motion.div style={styles.card} variants={itemVariants}>
                <div style={styles.cardGlow('#38CE3C')} />
                <div style={styles.sectionTitle}>
                  <CheckCircle2 size={18} color="#38CE3C" />
                  Attendance Status
                </div>

                <div style={{ height: '180px', position: 'relative', marginBottom: '20px' }}>
                  <Doughnut data={attendanceDoughnut} options={doughnutOptions} />
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '26px', fontWeight: '800', color: '#38CE3C' }}>
                      {attendanceData.rate}%
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>
                      Attendance Rate
                    </div>
                  </div>
                </div>

                <div style={styles.attendanceGrid}>
                  <div style={styles.attendanceItem('#38CE3C')}>
                    <div style={styles.attendanceDot('#38CE3C')} />
                    <div>
                      <div style={styles.attendanceLabel}>Present</div>
                      <div style={styles.attendanceValue}>{attendanceData.present.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                  <div style={styles.attendanceItem('#FF4D6B')}>
                    <div style={styles.attendanceDot('#FF4D6B')} />
                    <div>
                      <div style={styles.attendanceLabel}>Absent</div>
                      <div style={styles.attendanceValue}>{attendanceData.absent}</div>
                    </div>
                  </div>
                  <div style={styles.attendanceItem('#FFDE73')}>
                    <div style={styles.attendanceDot('#FFDE73')} />
                    <div>
                      <div style={styles.attendanceLabel}>On Leave</div>
                      <div style={styles.attendanceValue}>{attendanceData.onLeave}</div>
                    </div>
                  </div>
                  <div style={styles.attendanceItem('#f97316')}>
                    <div style={styles.attendanceDot('#f97316')} />
                    <div>
                      <div style={styles.attendanceLabel}>Late</div>
                      <div style={styles.attendanceValue}>{attendanceData.late}</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Roster Overview Table */}
              <motion.div style={styles.card} variants={itemVariants}>
                <div style={styles.sectionTitle}>
                  <Truck size={18} color="#f59e0b" />
                  Active Driver Roster Summary
                  <span style={{ marginLeft: 'auto', fontSize: '13px', color: 'var(--text-muted)', fontWeight: '400' }}>
                    Click driver for telemetry twin
                  </span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Driver</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Rating</th>
                        <th style={styles.th}>Trips</th>
                        <th style={styles.th}>Safety</th>
                        <th style={styles.th}>Assigned Truck</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drivers.slice(0, 8).map((drv, i) => (
                        <motion.tr
                          key={drv.id}
                          style={styles.tr}
                          onClick={() => {
                            setSelectedDriver(drv);
                          }}
                          whileHover={{ background: 'var(--bg-700)' }}
                        >
                          <td style={styles.tdFirst}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${['#6366f1', '#ec4899', '#3b82f6', '#f59e0b', '#38CE3C'][i % 5]}, ${['#818cf8', '#f472b6', '#60a5fa', '#fbbf24', '#4ade80'][i % 5]})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: '700',
                                color: '#fff',
                              }}>
                                {drv.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div style={{ fontWeight: '600' }}>{drv.name}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{drv.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.statusBadge(drv.status)}>
                              <CircleDot size={9} />
                              {styles.statusLabel(drv.status)}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <div style={styles.ratingStars}>
                              <Star size={12} color="#FFDE73" fill="#FFDE73" />
                              <span style={{ fontSize: '12px', fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
                                {drv.rating}
                              </span>
                            </div>
                          </td>
                          <td style={{ ...styles.td, fontFamily: 'var(--font-mono)', fontWeight: '600' }}>
                            {drv.trips.toLocaleString('en-IN')}
                          </td>
                          <td style={styles.td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{
                                width: '40px',
                                height: '5px',
                                borderRadius: '3px',
                                background: 'var(--bg-600)',
                                overflow: 'hidden',
                              }}>
                                <div style={{
                                  height: '100%',
                                  width: `${drv.safety}%`,
                                  background: drv.safety >= 90 ? '#38CE3C' : drv.safety >= 80 ? '#FFDE73' : '#FF4D6B',
                                }} />
                              </div>
                              <span style={styles.safetyScore(drv.safety)}>{drv.safety}</span>
                            </div>
                          </td>
                          <td style={styles.tdLast}>
                            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                              {drv.truck}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}

        {/* SAFETY ACADEMY TAB */}
        {activeTab === 'safety' && (
          <>
            {/* Safety Score Telemetry Grid */}
            <motion.div style={styles.bentoGrid4} variants={containerVariants}>
              <div style={styles.workforceCard}>
                <div style={styles.cardGlow('#38CE3C')} />
                <div style={styles.cardHeader}>
                  <span style={styles.cardLabel}>Fleet Safety Index</span>
                  <div style={styles.cardIconSmall('#38CE3C')}>
                    <ShieldAlert size={18} color="#38CE3C" />
                  </div>
                </div>
                <div style={styles.cardValue}>{safetyStats.avgSafety}/100</div>
                <div style={styles.cardChange('up')}>
                  <ArrowUpRight size={12} />
                  +1.4 points vs last week
                </div>
              </div>
              <div style={styles.workforceCard}>
                <div style={styles.cardGlow('#6366f1')} />
                <div style={styles.cardHeader}>
                  <span style={styles.cardLabel}>Average Skill Index</span>
                  <div style={styles.cardIconSmall('#6366f1')}>
                    <Activity size={18} color="#6366f1" />
                  </div>
                </div>
                <div style={styles.cardValue}>{safetyStats.avgSkill}%</div>
                <div style={styles.cardChange('up')}>
                  <ArrowUpRight size={12} />
                  +2.1% course completion
                </div>
              </div>
              <div style={styles.workforceCard}>
                <div style={styles.cardGlow('#FF4D6B')} />
                <div style={styles.cardHeader}>
                  <span style={styles.cardLabel}>Fatigue Risk Alerts</span>
                  <div style={styles.cardIconSmall('#FF4D6B')}>
                    <HeartPulse size={18} color="#FF4D6B" />
                  </div>
                </div>
                <div style={{ ...styles.cardValue, color: '#FF4D6B' }}>{safetyStats.criticalFatigue} Drivers</div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Fatigue score exceeds 40% threshold
                </span>
              </div>
              <div style={styles.workforceCard}>
                <div style={styles.cardGlow('#06b6d4')} />
                <div style={styles.cardHeader}>
                  <span style={styles.cardLabel}>Avg Fuel Eco Index</span>
                  <div style={styles.cardIconSmall('#06b6d4')}>
                    <Gauge size={18} color="#06b6d4" />
                  </div>
                </div>
                <div style={styles.cardValue}>{safetyStats.avgFuel}%</div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Based on target 4.8 km/L
                </span>
              </div>
            </motion.div>

            {/* Drivers Telemetry List */}
            <motion.div style={styles.card} variants={itemVariants}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '12px',
              }}>
                <div style={styles.sectionTitle}>
                  <ShieldAlert size={18} color="#f59e0b" />
                  Driver Digital Twins - Safety Telemetry
                </div>
                
                {/* Search & Filter Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Search */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--surface-border)',
                    background: 'var(--bg-800)',
                    width: '240px',
                  }}>
                    <Search size={14} color="var(--text-muted)" />
                    <input
                      type="text"
                      placeholder="Search driver or truck..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        fontSize: '13px',
                        outline: 'none',
                        width: '100%',
                        fontFamily: 'var(--font-sans)',
                      }}
                    />
                  </div>
                  
                  {/* Filters */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'high-fatigue', label: 'High Fatigue' },
                      { id: 'low-safety', label: 'Low Safety' },
                      { id: 'bonus-eligible', label: 'Eligible for Bonus' },
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setSafetyFilter(f.id)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--surface-border)',
                          background: safetyFilter === f.id ? 'var(--bg-600)' : 'var(--surface)',
                          color: safetyFilter === f.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Driver Twin Details</th>
                      <th style={styles.th}>Safety score</th>
                      <th style={styles.th}>Skill Index</th>
                      <th style={styles.th}>Fatigue Risk</th>
                      <th style={styles.th}>Fuel Index</th>
                      <th style={styles.th}>Violations (30d)</th>
                      <th style={styles.th}>AI Recommendation</th>
                      <th style={styles.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDrivers.map((drv, i) => {
                      const hasIncidents = drv.violationsCount.harshBraking + drv.violationsCount.overSpeeding + drv.violationsCount.tailgating + drv.violationsCount.hos > 0;
                      return (
                        <motion.tr
                          key={drv.id}
                          style={{
                            ...styles.tr,
                            borderLeft: hasIncidents && drv.safety < 80 ? '3px solid #FF4D6B' : '3px solid transparent'
                          }}
                          onClick={() => setSelectedDriver(drv)}
                          whileHover={{ background: 'var(--bg-700)' }}
                        >
                          <td style={styles.tdFirst}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${['#f59e0b', '#6366f1', '#38CE3C', '#FF4D6B', '#06b6d4'][i % 5]}, ${['#fbbf24', '#818cf8', '#4ade80', '#ff7b93', '#22d3ee'][i % 5]})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '13px',
                                color: '#1a1a2e',
                              }}>
                                {drv.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div style={{ fontWeight: '600', fontSize: '13px' }}>{drv.name}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                  ID: {drv.id} • Truck: {drv.truck}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={styles.td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={styles.safetyScore(drv.safety)}>{drv.safety}</span>
                              <div style={{ width: '60px', height: '6px', background: 'var(--bg-600)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${drv.safety}%`, background: drv.safety >= 90 ? '#38CE3C' : drv.safety >= 80 ? '#FFDE73' : '#FF4D6B' }} />
                              </div>
                            </div>
                          </td>
                          <td style={{ ...styles.td, fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
                            {drv.skill}%
                          </td>
                          <td style={styles.td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                color: drv.fatigue > 50 ? '#FF4D6B' : drv.fatigue > 20 ? '#FFDE73' : '#38CE3C',
                                fontWeight: '700',
                                fontFamily: 'var(--font-mono)'
                              }}>
                                {drv.fatigue}%
                              </span>
                              <span style={{
                                fontSize: '10px',
                                padding: '2px 6px',
                                borderRadius: '10px',
                                fontWeight: '700',
                                background: drv.fatigue > 50 ? 'rgba(255, 77, 107, 0.15)' : drv.fatigue > 20 ? 'rgba(255, 222, 115, 0.15)' : 'rgba(56, 206, 60, 0.1)',
                                color: drv.fatigue > 50 ? '#FF4D6B' : drv.fatigue > 20 ? '#FFDE73' : '#38CE3C'
                              }}>
                                {drv.fatigue > 50 ? 'Critical' : drv.fatigue > 20 ? 'Warning' : 'Normal'}
                              </span>
                            </div>
                          </td>
                          <td style={{ ...styles.td, fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
                            {drv.fuel}%
                          </td>
                          <td style={styles.td}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              {drv.violationsCount.harshBraking > 0 && <span style={{ padding: '2px 5px', background: 'rgba(255,77,107,0.12)', color: '#FF4D6B', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>HB:{drv.violationsCount.harshBraking}</span>}
                              {drv.violationsCount.overSpeeding > 0 && <span style={{ padding: '2px 5px', background: 'rgba(255,222,115,0.12)', color: '#FFDE73', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>OS:{drv.violationsCount.overSpeeding}</span>}
                              {drv.violationsCount.tailgating > 0 && <span style={{ padding: '2px 5px', background: 'rgba(99,102,241,0.12)', color: '#818cf8', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>TG:{drv.violationsCount.tailgating}</span>}
                              {drv.violationsCount.hos > 0 && <span style={{ padding: '2px 5px', background: 'rgba(249,115,22,0.12)', color: '#f97316', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>HOS:{drv.violationsCount.hos}</span>}
                              {!hasIncidents && <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Clean Record</span>}
                            </div>
                          </td>
                          <td style={styles.td}>
                            {drv.recommendation !== 'None' ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                color: drv.recommendation.includes('Training') ? '#f59e0b' : drv.recommendation.includes('Rest') ? '#FF4D6B' : '#38CE3C',
                                fontWeight: '600',
                                fontSize: '11px',
                              }}>
                                <Sparkles size={11} />
                                {drv.recommendation}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>No recommendations</span>
                            )}
                          </td>
                          <td style={styles.tdLast}>
                            <span style={styles.statusBadge(drv.status)}>
                              <CircleDot size={9} />
                              {styles.statusLabel(drv.status)}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}

        {/* ATTENDANCE & ROSTER TAB */}
        {activeTab === 'roster' && (
          <motion.div style={styles.card} variants={itemVariants}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={styles.sectionTitle}>
                <CalendarDays size={18} color="#6366f1" />
                Workforce Shift Roster Scheduler
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[
                  { id: 'all', label: 'All Shifts' },
                  { id: 'morning', label: 'Morning Shift' },
                  { id: 'evening', label: 'Evening Shift' },
                  { id: 'night', label: 'Night Shift' },
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setRosterShiftFilter(s.id)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--surface-border)',
                      background: rosterShiftFilter === s.id ? 'var(--bg-600)' : 'var(--surface)',
                      color: rosterShiftFilter === s.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Employee Name</th>
                    <th style={styles.th}>Assigned Shift</th>
                    <th style={styles.th}>Check-In Time</th>
                    <th style={styles.th}>Current Status</th>
                    <th style={styles.th}>Route Assignment</th>
                    <th style={styles.th}>Assigned Truck</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rosterDrivers.map((drv, i) => (
                    <tr key={drv.id} style={styles.tr}>
                      <td style={styles.tdFirst}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'var(--bg-600)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: '700',
                            color: 'var(--text-secondary)'
                          }}>
                            {drv.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <span style={{ fontWeight: '600' }}>{drv.name}</span>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ID: {drv.id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                          {drv.shift}
                        </span>
                      </td>
                      <td style={{ ...styles.td, fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                        {drv.checkIn}
                      </td>
                      <td style={styles.td}>
                        <span style={styles.statusBadge(drv.status)}>
                          <CircleDot size={9} />
                          {styles.statusLabel(drv.status)}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>
                          {drv.route !== '—' ? drv.route : 'Standby / Maintenance'}
                        </span>
                      </td>
                      <td style={{ ...styles.td, fontFamily: 'var(--font-mono)' }}>
                        {drv.truck}
                      </td>
                      <td style={styles.tdLast}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => {
                              setDrivers(prev => prev.map(x => x.id === drv.id ? { ...x, status: x.status === 'on-leave' ? 'available' : 'on-leave' } : x));
                              showToast(`${drv.name} status updated statefully.`);
                            }}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              background: 'rgba(245, 158, 11, 0.12)',
                              color: '#f59e0b',
                              border: 'none',
                              fontSize: '11px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            Toggle Status
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* PAYROLL & BENEFITS TAB */}
        {activeTab === 'payroll' && (
          <>
            {/* Payroll Info Grid */}
            <motion.div style={styles.bentoRow} variants={containerVariants}>
              <motion.div style={styles.card} variants={itemVariants}>
                <div style={styles.cardGlow('#6366f1')} />
                <div style={styles.sectionTitle}>
                  <Wallet size={18} color="#6366f1" />
                  Monthly Payroll Register
                </div>
                
                <div style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(129, 140, 248, 0.04))',
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '500' }}>
                      Total Monthly Payroll
                    </div>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-1px' }}>
                      ₹6.8Cr
                    </div>
                  </div>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(99, 102, 241, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <IndianRupee size={26} color="#6366f1" />
                  </div>
                </div>

                <div style={styles.payrollGrid}>
                  <div style={styles.payrollItem}>
                    <div style={styles.payrollLabel}>Avg Salary</div>
                    <div style={styles.payrollValue}>₹36,900</div>
                  </div>
                  <div style={styles.payrollItem}>
                    <div style={styles.payrollLabel}>Next Payroll Payout</div>
                    <div style={{ ...styles.payrollValue, fontSize: '15px', color: 'var(--primary-400)' }}>
                      July 1, 2026
                    </div>
                  </div>
                  <div style={styles.payrollItem}>
                    <div style={styles.payrollLabel}>Total Bonuses Paid</div>
                    <div style={{ ...styles.payrollValue, color: '#38CE3C' }}>
                      {formatCurrency(drivers.reduce((acc, d) => acc + (d.bonusStatus === 'Paid' ? 5000 : 0), 0) + 4200000)}
                    </div>
                  </div>
                  <div style={styles.payrollItem}>
                    <div style={styles.payrollLabel}>Overtime Dispatched</div>
                    <div style={{ ...styles.payrollValue, color: '#f59e0b' }}>₹18.4L</div>
                  </div>
                </div>
              </motion.div>

              <motion.div style={styles.card} variants={itemVariants}>
                <div style={styles.sectionTitle}>
                  <CheckCircle2 size={18} color="#38CE3C" />
                  AI agent Auto-Payout Ledger Status
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)' }}>
                    <ShieldCheck size={20} color="#38CE3C" />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>Compliance Validation Passed</div>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>PF, ESI & Professional Tax matching calculations complete.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)' }}>
                    <Activity size={20} color="#6366f1" />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>Active Driver Bonus Pool</div>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>₹5,000 release capability for drivers with Safety score &gt;= 95.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      showToast("Monthly payroll batch successfully submitted to Stripe Banking API. Payout pending July 1.");
                    }}
                    style={{
                      ...styles.primaryBtn,
                      width: '100%',
                      padding: '12px',
                      justifyContent: 'center',
                      fontSize: '14px',
                      marginTop: '10px'
                    }}
                  >
                    Process & Dispatch June Payroll Batch
                  </button>
                </div>
              </motion.div>
            </motion.div>

            {/* Drivers Payroll Ledger Table */}
            <motion.div style={styles.card} variants={itemVariants}>
              <div style={styles.sectionTitle}>
                <IndianRupee size={18} color="#f59e0b" />
                Employee Compensation & Ledger Table
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Employee</th>
                      <th style={styles.th}>Base Salary</th>
                      <th style={styles.th}>Overtime</th>
                      <th style={styles.th}>Safety Bonus</th>
                      <th style={styles.th}>Deductions</th>
                      <th style={styles.th}>Net Payout</th>
                      <th style={styles.th}>Bonus Status</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map((drv, i) => {
                      const base = 32000;
                      const ot = (i % 4) * 1250;
                      const safetyBonusAmt = drv.bonusStatus === 'Paid' ? 5000 : 0;
                      const deductions = 1800;
                      const net = base + ot + safetyBonusAmt - deductions;

                      return (
                        <tr key={drv.id} style={styles.tr}>
                          <td style={styles.tdFirst}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ fontWeight: '600' }}>{drv.name}</div>
                              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>({drv.id})</span>
                            </div>
                          </td>
                          <td style={{ ...styles.td, fontFamily: 'var(--font-mono)' }}>₹{base.toLocaleString('en-IN')}</td>
                          <td style={{ ...styles.td, fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>₹{ot.toLocaleString('en-IN')}</td>
                          <td style={{ ...styles.td, fontFamily: 'var(--font-mono)', color: '#38CE3C' }}>₹{safetyBonusAmt.toLocaleString('en-IN')}</td>
                          <td style={{ ...styles.td, fontFamily: 'var(--font-mono)', color: '#FF4D6B' }}>₹{deductions.toLocaleString('en-IN')}</td>
                          <td style={{ ...styles.td, fontFamily: 'var(--font-mono)', fontWeight: '700' }}>₹{net.toLocaleString('en-IN')}</td>
                          <td style={styles.td}>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: '700',
                              color: drv.bonusStatus === 'Paid' ? '#38CE3C' : drv.bonusStatus === 'Eligible' ? '#f59e0b' : 'var(--text-muted)'
                            }}>
                              {drv.bonusStatus}
                            </span>
                          </td>
                          <td style={styles.tdLast}>
                            {drv.bonusStatus === 'Eligible' && (
                              <button
                                onClick={() => handleApproveBonus(drv.id)}
                                style={{
                                  padding: '4px 10px',
                                  background: 'linear-gradient(135deg, #38CE3C, #4ade80)',
                                  color: '#1a1a2e',
                                  border: 'none',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  cursor: 'pointer'
                                }}
                              >
                                Release Bonus
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </>
        )}

        {/* TRAINING ACADEMY TAB */}
        {activeTab === 'training' && (
          <>
            <motion.div style={styles.bentoGrid4} variants={containerVariants}>
              <div style={styles.workforceCard}>
                <div style={styles.cardGlow('#6366f1')} />
                <div style={styles.cardHeader}>
                  <span style={styles.cardLabel}>Active Training Enrollment</span>
                  <GraduationCap size={18} color="#6366f1" />
                </div>
                <div style={styles.cardValue}>892 Courses</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>45 in progress today</div>
              </div>
              <div style={styles.workforceCard}>
                <div style={styles.cardGlow('#38CE3C')} />
                <div style={styles.cardHeader}>
                  <span style={styles.cardLabel}>Certification Rate</span>
                  <BadgeCheck size={18} color="#38CE3C" />
                </div>
                <div style={styles.cardValue}>92.4%</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>984 certifications active</div>
              </div>
              <div style={styles.workforceCard}>
                <div style={styles.cardGlow('#f59e0b')} />
                <div style={styles.cardHeader}>
                  <span style={styles.cardLabel}>Average rating</span>
                  <Star size={18} color="#f59e0b" fill="#f59e0b" />
                </div>
                <div style={{ ...styles.cardValue, color: '#f59e0b' }}>3.8/5</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Industry average: 3.2/5</div>
              </div>
              <div style={styles.workforceCard}>
                <div style={styles.cardGlow('#FF4D6B')} />
                <div style={styles.cardHeader}>
                  <span style={styles.cardLabel}>Needs coaching</span>
                  <AlertCircle size={18} color="#FF4D6B" />
                </div>
                <div style={{ ...styles.cardValue, color: '#FF4D6B' }}>
                  {drivers.filter(x => x.safety < 80).length} Drivers
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Safety score under 80 threshold</div>
              </div>
            </motion.div>

            <motion.div style={styles.bentoRow} variants={containerVariants}>
              
              {/* Courses list */}
              <motion.div style={styles.card} variants={itemVariants}>
                <div style={styles.sectionTitle}>
                  <GraduationCap size={18} color="#6366f1" />
                  Active Safety Training Programs
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { title: 'Defensive Driving & Mountain Terrain', desc: 'Critical handling techniques for hill sections, ice patches, and brake checks.', count: 189, duration: '4 hours', progress: 75, color: '#f59e0b' },
                    { title: 'Eco-Driving & Fuel Optimization', desc: 'Throttle regulation, gear shifting control, and idle-time management to maximize km/L.', count: 342, duration: '2.5 hours', progress: 92, color: '#38CE3C' },
                    { title: 'Fatigue & Sleep Regimes', desc: 'Understanding hours-of-service compliance, circadian rest, and fatigue recovery cycles.', desc2: 'Critical for high-risk drivers.', count: 86, duration: '1 hour', progress: 40, color: '#FF4D6B' }
                  ].map((course, j) => (
                    <div key={j} style={{ padding: '16px', background: 'var(--bg-800)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--surface-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '600', fontSize: '13px' }}>{course.title}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{course.duration}</span>
                      </div>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 10px' }}>{course.desc}</p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        <span>Enrolled: {course.count} drivers</span>
                        <span>Completion: {course.progress}%</span>
                      </div>
                      <div style={styles.progressBar}>
                        <div style={styles.progressFill(course.progress, course.color)} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Academy Leaderboard */}
              <motion.div style={styles.card} variants={itemVariants}>
                <div style={styles.sectionTitle}>
                  <Trophy size={18} color="#f59e0b" />
                  Top Performance Safety Academy Leaderboard
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {drivers
                    .sort((a, b) => b.safety - a.safety || b.rating - a.rating)
                    .slice(0, 5)
                    .map((drv, idx) => (
                      <div key={drv.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: 'var(--bg-800)',
                        borderRadius: '6px',
                        border: '1px solid var(--surface-border)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            width: '24px',
                            height: '24px',
                            background: idx === 0 ? 'rgba(245,158,11,0.15)' : idx === 1 ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.06)',
                            color: idx === 0 ? '#f59e0b' : idx === 1 ? '#818cf8' : 'var(--text-muted)',
                            fontWeight: '800',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px'
                          }}>
                            {idx + 1}
                          </span>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: '600' }}>{drv.name}</div>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Truck: {drv.truck}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '13px', fontWeight: '800', color: '#38CE3C' }}>{drv.safety} pts</div>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Rating: {drv.rating}/5</span>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>

            </motion.div>
          </>
        )}
      </motion.div>

      {/* DRIVER DIGITAL TWIN DIAGNOSTIC DRAWER */}
      <AnimatePresence>
        {selectedDriver && (
          <>
            {/* Drawer Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDriver(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(10, 14, 26, 0.6)',
                backdropFilter: 'blur(4px)',
                zIndex: 100,
              }}
            />
            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '420px',
                background: 'var(--surface)',
                borderLeft: '1px solid var(--surface-border)',
                boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.65)',
                zIndex: 101,
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
              }}
            >
              {/* Close Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Driver Safety Twin Diagnostic
                </span>
                <button
                  onClick={() => setSelectedDriver(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Driver Header Profile */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--surface-border)' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: '800',
                  color: '#1a1a2e',
                }}>
                  {selectedDriver.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>{selectedDriver.name}</h2>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>ID: {selectedDriver.id}</span>
                    <span>•</span>
                    <span style={styles.statusBadge(selectedDriver.status)}>
                      <CircleDot size={8} />
                      {styles.statusLabel(selectedDriver.status)}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Truck: {selectedDriver.truck} • Route: {selectedDriver.route}
                  </div>
                </div>
              </div>

              {/* Digital Twin Scores */}
              <div style={{ marginBottom: '24px' }}>
                <div style={styles.sectionTitle}>
                  <Activity size={15} color="#f59e0b" />
                  Twin Telemetry Metrics
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Safety */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Safety Index</span>
                      <span style={styles.safetyScore(selectedDriver.safety)}>{selectedDriver.safety}/100</span>
                    </div>
                    <div style={styles.progressBar}>
                      <div style={styles.progressFill(selectedDriver.safety, selectedDriver.safety >= 90 ? '#38CE3C' : selectedDriver.safety >= 80 ? '#FFDE73' : '#FF4D6B')} />
                    </div>
                  </div>

                  {/* Skill */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Skill Rating</span>
                      <span style={{ color: '#6366f1', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>{selectedDriver.skill}%</span>
                    </div>
                    <div style={styles.progressBar}>
                      <div style={styles.progressFill(selectedDriver.skill, '#6366f1')} />
                    </div>
                  </div>

                  {/* Fatigue */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Fatigue Level</span>
                      <span style={{
                        color: selectedDriver.fatigue > 50 ? '#FF4D6B' : selectedDriver.fatigue > 20 ? '#FFDE73' : '#38CE3C',
                        fontWeight: '700',
                        fontFamily: 'var(--font-mono)'
                      }}>
                        {selectedDriver.fatigue}%
                      </span>
                    </div>
                    <div style={styles.progressBar}>
                      <div style={styles.progressFill(selectedDriver.fatigue, selectedDriver.fatigue > 50 ? '#FF4D6B' : selectedDriver.fatigue > 20 ? '#FFDE73' : '#38CE3C')} />
                    </div>
                  </div>

                  {/* Fuel Eco */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Fuel Eco Index</span>
                      <span style={{ color: '#06b6d4', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>{selectedDriver.fuel}%</span>
                    </div>
                    <div style={styles.progressBar}>
                      <div style={styles.progressFill(selectedDriver.fuel, '#06b6d4')} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Violations Incident Logs */}
              <div style={{ marginBottom: '24px', flex: 1 }}>
                <div style={styles.sectionTitle}>
                  <AlertTriangle size={15} color="#FF4D6B" />
                  Telemetry Incident & Violation logs
                </div>
                
                {selectedDriver.incidents.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {selectedDriver.incidents.map((inc) => (
                      <div key={inc.id} style={{
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        background: inc.status === 'Active' ? 'rgba(255, 77, 107, 0.08)' : 'rgba(56, 206, 60, 0.05)',
                        border: inc.status === 'Active' ? '1px solid rgba(255, 77, 107, 0.18)' : '1px solid rgba(56, 206, 60, 0.12)',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            color: inc.severity === 'Critical' || inc.severity === 'High' ? '#FF4D6B' : '#FFDE73',
                            textTransform: 'uppercase'
                          }}>
                            {inc.type} ({inc.severity})
                          </span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{inc.date}</span>
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 6px' }}>{inc.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Ticket: {inc.id}</span>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: '700',
                            color: inc.status === 'Active' ? '#FF4D6B' : '#38CE3C'
                          }}>
                            {inc.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed var(--surface-border)', borderRadius: '6px' }}>
                    <CheckCircle2 size={24} color="#38CE3C" style={{ margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '12px', fontWeight: '600' }}>No active telemetry violations</div>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>This digital twin record meets all safety compliance parameters.</p>
                  </div>
                )}
              </div>

              {/* AI Agent Action Center */}
              <div style={{
                background: 'rgba(245, 158, 11, 0.05)',
                border: '1px solid rgba(245, 158, 11, 0.15)',
                borderRadius: '8px',
                padding: '16px',
                marginTop: 'auto'
              }}>
                <div style={{ ...styles.sectionTitle, marginBottom: '12px', fontSize: '14px' }}>
                  <Sparkles size={14} color="#f59e0b" />
                  AI Performance Agent Action Center
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Action 1: Assign Safety Training */}
                  {selectedDriver.safety < 95 && (
                    <button
                      onClick={() => handleAssignTraining(selectedDriver.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px',
                        background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                        color: '#1a1a2e',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(245, 158, 11, 0.2)'
                      }}
                    >
                      <PlayCircle size={14} />
                      Enroll in Safety Training Program
                    </button>
                  )}

                  {/* Action 2: Approve Safety Bonus */}
                  {selectedDriver.bonusStatus === 'Eligible' && (
                    <button
                      onClick={() => handleApproveBonus(selectedDriver.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px',
                        background: 'linear-gradient(135deg, #38CE3C, #4ade80)',
                        color: '#1a1a2e',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(56, 206, 60, 0.2)'
                      }}
                    >
                      <Trophy size={14} />
                      Approve ₹5,000 Safety Payout Bonus
                    </button>
                  )}

                  {/* Action 3: Trigger Mandatory Rest */}
                  {selectedDriver.fatigue > 30 && selectedDriver.status !== 'rest' && (
                    <button
                      onClick={() => handleTriggerRest(selectedDriver.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px',
                        background: 'linear-gradient(135deg, #FF4D6B, #ff7b93)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(255, 77, 107, 0.2)'
                      }}
                    >
                      <Clock size={14} />
                      Trigger Mandatory 24h Fatigue Rest
                    </button>
                  )}
                  
                  {selectedDriver.safety >= 95 && selectedDriver.fatigue <= 30 && selectedDriver.bonusStatus !== 'Eligible' && (
                    <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', padding: '6px 0' }}>
                      No corrective AI actions required.
                    </div>
                  )}
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Stateful Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              background: 'linear-gradient(135deg, #38CE3C, #4ade80)',
              color: '#1a1a2e',
              padding: '12px 20px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 4px 15px rgba(56, 206, 60, 0.3)',
              fontWeight: '600',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              zIndex: 200,
            }}
          >
            <CheckCircle2 size={16} color="#1a1a2e" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HCMDashboard;
