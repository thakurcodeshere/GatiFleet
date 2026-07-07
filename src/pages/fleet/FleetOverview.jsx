/* eslint-disable */
// ============================================================
// GatiFleet — Fleet Management Overview
// India's Transportation Intelligence Network
// ============================================================

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck, Search, Filter, Plus, Download, ChevronUp, ChevronDown,
  Activity, PauseCircle, Wrench, WifiOff, Fuel, Heart,
  Clock, MapPin, Gauge, ArrowUpRight, ArrowDownRight,
  AlertTriangle, BarChart3, Route, Calendar, ChevronLeft, ChevronRight, X,
  FileText
} from 'lucide-react';
import { generateTrucks, formatCurrency } from '../../data/mockData';
import { RealityEngine } from '../../data/RealityEngine';

// ---- Generate stable data at module level ----
const ALL_TRUCKS = generateTrucks(50);

// ---- Status config ----
const STATUS_CONFIG = {
  active: { label: 'Active', color: '#38CE3C', bg: 'rgba(56, 206, 60, 0.12)', icon: Activity },
  idle: { label: 'Idle', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', icon: PauseCircle },
  maintenance: { label: 'Maintenance', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', icon: Wrench },
  offline: { label: 'Offline', color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)', icon: WifiOff },
};

// ---- Styles ----
const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg-900)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
    padding: '24px',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: 0,
  },
  titleIcon: {
    width: '40px',
    height: '40px',
    borderRadius: 'var(--radius-md)',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    margin: 0,
    marginLeft: '52px',
  },
  headerActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: 'var(--font-sans)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)',
  },
  btnSecondary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--surface-border)',
    background: 'var(--surface)',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontWeight: 500,
    fontFamily: 'var(--font-sans)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(12px)',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '24px',
    alignItems: 'flex-start',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    minWidth: 0,
  },
  // ---- Status Cards ----
  statusCardsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  statusCard: {
    background: 'var(--surface)',
    backdropFilter: 'blur(20px)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--surface-border)',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  statusCardActive: {
    border: '1px solid',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
  },
  statusCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  statusIconWrap: {
    width: '42px',
    height: '42px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCount: {
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: 1,
    margin: '0 0 4px 0',
  },
  statusLabel: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    margin: 0,
  },
  statusPercent: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    fontSize: '13px',
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: '20px',
  },
  // ---- Filter / Search ----
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  searchWrap: {
    position: 'relative',
    flex: 1,
    minWidth: '240px',
  },
  searchInput: {
    width: '100%',
    padding: '10px 14px 10px 40px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--surface-border)',
    background: 'var(--surface)',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    backdropFilter: 'blur(12px)',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  filterChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '20px',
    border: '1px solid var(--surface-border)',
    background: 'var(--surface)',
    color: 'var(--text-secondary)',
    fontSize: '12px',
    fontWeight: 500,
    fontFamily: 'var(--font-sans)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(12px)',
    whiteSpace: 'nowrap',
  },
  filterChipActive: {
    border: '1px solid',
    fontWeight: 600,
  },
  // ---- Table ----
  tableContainer: {
    background: 'var(--surface)',
    backdropFilter: 'blur(20px)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--surface-border)',
    overflow: 'hidden',
  },
  tableScroll: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  th: {
    textAlign: 'left',
    padding: '14px 16px',
    fontWeight: 600,
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--surface-border)',
    background: 'var(--bg-800)',
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    transition: 'color 0.2s',
  },
  thActive: {
    color: 'var(--primary-400)',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid var(--surface-border)',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
  },
  trHover: {
    transition: 'background 0.15s ease',
  },
  vehicleId: {
    fontWeight: 600,
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--primary-400)',
  },
  regNumber: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'capitalize',
  },
  routeText: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
  },
  speedCell: {
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
  },
  fuelBar: {
    width: '80px',
    height: '6px',
    borderRadius: '3px',
    background: 'var(--bg-600)',
    overflow: 'hidden',
  },
  fuelFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.5s ease',
  },
  healthScore: {
    fontWeight: 700,
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
  },
  lastUpdate: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  // ---- Pagination ----
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderTop: '1px solid var(--surface-border)',
    background: 'var(--bg-800)',
  },
  paginationInfo: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  paginationControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  pageBtn: {
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--surface-border)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontFamily: 'var(--font-sans)',
    transition: 'all 0.15s ease',
  },
  pageBtnActive: {
    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
    color: '#fff',
    border: '1px solid #6366f1',
    fontWeight: 600,
  },
  // ---- Sidebar ----
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    position: 'sticky',
    top: '24px',
  },
  sidebarCard: {
    background: 'var(--surface)',
    backdropFilter: 'blur(20px)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--surface-border)',
    padding: '20px',
  },
  sidebarTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: '0 0 16px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid var(--surface-border)',
  },
  statLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  statValue: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  alertItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '10px 0',
    borderBottom: '1px solid var(--surface-border)',
  },
  alertDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    marginTop: '5px',
    flexShrink: 0,
  },
  alertText: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  alertTime: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '2px',
  },
};

// ---- Component ----
export default function FleetOverview() {
  const [trucks, setTrucks] = useState(() => ALL_TRUCKS);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedTruckForDocs, setSelectedTruckForDocs] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState(null);
  const ITEMS_PER_PAGE = 10;

  // ---- Derived data ----
  const statusCounts = useMemo(() => {
    const counts = { active: 0, idle: 0, maintenance: 0, offline: 0 };
    trucks.forEach(t => {
      if (counts[t.status] !== undefined) {
        counts[t.status]++;
      }
    });
    return counts;
  }, [trucks]);

  const filteredTrucks = useMemo(() => {
    let result = trucks;

    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.id.toLowerCase().includes(q) ||
        t.regNumber.toLowerCase().includes(q) ||
        t.driver.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q) ||
        t.origin.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q)
      );
    }

    return result;
  }, [searchQuery, statusFilter, trucks]);

  const sortedTrucks = useMemo(() => {
    const sorted = [...filteredTrucks];
    sorted.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredTrucks, sortConfig]);

  const totalPages = Math.ceil(sortedTrucks.length / ITEMS_PER_PAGE);
  const paginatedTrucks = sortedTrucks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ---- Handlers ----
  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setCurrentPage(1);
  }, []);

  const handleStatusFilter = useCallback((status) => {
    setStatusFilter(prev => prev === status ? 'all' : status);
    setCurrentPage(1);
  }, []);

  // ---- Quick Stats ----
  const quickStats = useMemo(() => {
    const totalCount = trucks.length || 1;
    const avgAge = (trucks.reduce((s, t) => s + (t.mileage || 0), 0) / totalCount / 100000).toFixed(1);
    const totalDistToday = trucks.filter(t => t.status === 'active').reduce((s, t) => s + (t.speed || 0) * 4, 0);
    const fuelConsumption = trucks.filter(t => t.status === 'active').length * 38;
    const maintenanceAlerts = trucks.filter(t => (t.healthScore || 0) < 75).length;
    return { avgAge, totalDistToday, fuelConsumption, maintenanceAlerts };
  }, [trucks]);

  // ---- Helpers ----
  const getFuelColor = (level) => {
    if (level > 60) return '#38CE3C';
    if (level > 30) return '#f59e0b';
    return '#FF4D6B';
  };

  const getHealthColor = (score) => {
    if (score >= 85) return '#38CE3C';
    if (score >= 70) return '#f59e0b';
    return '#FF4D6B';
  };

  const formatTime = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ChevronUp size={12} style={{ opacity: 0.2 }} />;
    return sortConfig.direction === 'asc'
      ? <ChevronUp size={12} style={{ opacity: 1, color: '#818cf8' }} />
      : <ChevronDown size={12} style={{ opacity: 1, color: '#818cf8' }} />;
  };

  const columns = [
    { key: 'id', label: 'Vehicle ID' },
    { key: 'regNumber', label: 'Reg. Number' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'driver', label: 'Driver' },
    { key: 'route', label: 'Route' },
    { key: 'speed', label: 'Speed' },
    { key: 'fuelLevel', label: 'Fuel' },
    { key: 'healthScore', label: 'Health' },
    { key: 'lastUpdate', label: 'Last Update' },
  ];

  const maintenanceAlerts = [
    { text: 'TRK-00012 brake pad replacement due', time: '2h ago', color: '#FF4D6B' },
    { text: 'TRK-00028 oil change overdue by 500km', time: '4h ago', color: '#f59e0b' },
    { text: 'TRK-00041 tyre pressure warning', time: '6h ago', color: '#f59e0b' },
    { text: 'TRK-00007 engine check light active', time: '8h ago', color: '#FF4D6B' },
    { text: '18 vehicles due for service this week', time: '12h ago', color: '#3b82f6' },
  ];

  return (
    <div style={styles.page}>
      {/* ---- Header ---- */}
      <motion.div
        style={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>
            <div style={styles.titleIcon}>
              <Truck size={22} color="#fff" />
            </div>
            Fleet Management
          </h1>
          <p style={styles.subtitle}>
            {statusCounts.active} active of {trucks.length} total vehicles &nbsp;•&nbsp; Last synced 2 min ago
          </p>
        </div>
        <div style={styles.headerActions}>
          <motion.button
            style={styles.btnPrimary}
            whileHover={{ scale: 1.03, boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setAddModalOpen(true)}
          >
            <Plus size={16} /> Add Vehicle
          </motion.button>
          <motion.button
            style={styles.btnSecondary}
            whileHover={{ scale: 1.02, background: 'var(--bg-600)' }}
            whileTap={{ scale: 0.97 }}
          >
            <Download size={16} /> Export
          </motion.button>
          <motion.button
            style={styles.btnSecondary}
            whileHover={{ scale: 1.02, background: 'var(--bg-600)' }}
            whileTap={{ scale: 0.97 }}
          >
            <Filter size={16} /> Filter
          </motion.button>
        </div>
      </motion.div>

      {/* ---- Content Grid ---- */}
      <div style={styles.contentGrid}>
        <div style={styles.mainContent}>
          {/* ---- Status Cards ---- */}
          <div style={styles.statusCardsRow}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg], i) => {
              const count = statusCounts[key];
              const percent = ((count / trucks.length) * 100).toFixed(1);
              const isActive = statusFilter === key;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={key}
                  style={{
                    ...styles.statusCard,
                    ...(isActive ? {
                      ...styles.statusCardActive,
                      borderColor: cfg.color,
                      boxShadow: `0 0 24px ${cfg.color}20`,
                    } : {}),
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  whileHover={{
                    y: -3,
                    boxShadow: `0 8px 32px ${cfg.color}15`,
                  }}
                  onClick={() => handleStatusFilter(key)}
                >
                  <div style={styles.statusCardHeader}>
                    <div style={{
                      ...styles.statusIconWrap,
                      background: cfg.bg,
                    }}>
                      <Icon size={20} color={cfg.color} />
                    </div>
                  </div>
                  <p style={{ ...styles.statusCount, color: cfg.color }}>{count}</p>
                  <p style={styles.statusLabel}>{cfg.label} Vehicles</p>
                  <span style={{
                    ...styles.statusPercent,
                    color: cfg.color,
                    background: cfg.bg,
                  }}>
                    {percent}%
                  </span>
                  {/* Glow bar at bottom */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: isActive
                      ? `linear-gradient(90deg, transparent, ${cfg.color}, transparent)`
                      : 'transparent',
                    transition: 'background 0.3s ease',
                  }} />
                </motion.div>
              );
            })}
          </div>

          {/* ---- Filter Bar ---- */}
          <motion.div
            style={styles.filterBar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div style={styles.searchWrap}>
              <Search size={16} style={styles.searchIcon} />
              <input
                style={styles.searchInput}
                placeholder="Search by Vehicle ID, Reg No., Driver, Type, Route..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                    padding: '4px',
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
              const isActive = statusFilter === key;
              return (
                <motion.button
                  key={key}
                  style={{
                    ...styles.filterChip,
                    ...(isActive ? {
                      ...styles.filterChipActive,
                      borderColor: cfg.color,
                      color: cfg.color,
                      background: cfg.bg,
                    } : {}),
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleStatusFilter(key)}
                >
                  <span style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: cfg.color,
                  }} />
                  {cfg.label} ({statusCounts[key]})
                </motion.button>
              );
            })}
            {statusFilter !== 'all' && (
              <motion.button
                style={{
                  ...styles.filterChip,
                  color: '#FF4D6B',
                  borderColor: 'rgba(255, 77, 107, 0.3)',
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <X size={12} /> Clear Filter
              </motion.button>
            )}
          </motion.div>

          {/* ---- Fleet Table ---- */}
          <motion.div
            style={styles.tableContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div style={styles.tableScroll}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {columns.map(col => (
                      <th
                        key={col.key}
                        style={{
                          ...styles.th,
                          ...(sortConfig.key === col.key ? styles.thActive : {}),
                        }}
                        onClick={() => handleSort(col.key === 'route' ? 'origin' : col.key)}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {col.label}
                          <SortIcon columnKey={col.key === 'route' ? 'origin' : col.key} />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {paginatedTrucks.map((truck, idx) => {
                      const scfg = STATUS_CONFIG[truck.status];
                      return (
                        <motion.tr
                          key={truck.id}
                          style={{
                            ...styles.trHover,
                            background: hoveredRow === truck.id
                              ? 'var(--bg-600)'
                              : 'transparent',
                          }}
                          onMouseEnter={() => setHoveredRow(truck.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2, delay: idx * 0.02 }}
                        >
                          <td style={styles.td}>
                            <span style={styles.vehicleId}>{truck.id}</span>
                          </td>
                           <td style={styles.td}>
                             <div 
                               style={{ 
                                 display: 'flex', 
                                 alignItems: 'center', 
                                 gap: '6px',
                                 cursor: 'pointer',
                               }}
                               onClick={() => setSelectedTruckForDocs(truck)}
                               title="Click to view Vahan Registration Documents"
                             >
                               <span style={{ 
                                 ...styles.regNumber, 
                                 color: 'var(--primary-400)', 
                                 textDecoration: 'underline',
                               }}>
                                 {truck.regNumber}
                               </span>
                               <FileText size={12} color="var(--primary-400)" style={{ opacity: 0.8 }} />
                             </div>
                           </td>
                          <td style={styles.td}>
                            <span style={{ fontSize: '12px' }}>{truck.type}</span>
                          </td>
                          <td style={styles.td}>
                            <span style={{
                              ...styles.statusBadge,
                              color: scfg.color,
                              background: scfg.bg,
                            }}>
                              <span style={{
                                width: '6px', height: '6px', borderRadius: '50%',
                                background: scfg.color,
                                ...(truck.status === 'active' ? {
                                  animation: 'pulse 1.5s ease-in-out infinite',
                                  boxShadow: `0 0 6px ${scfg.color}`,
                                } : {}),
                              }} />
                              {scfg.label}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <span style={{ fontSize: '12px' }}>{truck.driver}</span>
                          </td>
                          <td style={styles.td}>
                            <div style={styles.routeText}>
                              <MapPin size={11} color="var(--text-muted)" />
                              <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                                {truck.origin}
                              </span>
                              <span style={{ color: 'var(--text-muted)', margin: '0 2px' }}>→</span>
                              <span style={{ fontSize: '12px' }}>{truck.destination}</span>
                            </div>
                          </td>
                          <td style={styles.td}>
                            <span style={{
                              ...styles.speedCell,
                              color: truck.speed > 0 ? '#38CE3C' : 'var(--text-muted)',
                            }}>
                              {truck.speed > 0 ? `${truck.speed} km/h` : '—'}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={styles.fuelBar}>
                                <div style={{
                                  ...styles.fuelFill,
                                  width: `${truck.fuelLevel}%`,
                                  background: getFuelColor(truck.fuelLevel),
                                }} />
                              </div>
                              <span style={{
                                fontSize: '11px',
                                fontFamily: 'var(--font-mono)',
                                color: getFuelColor(truck.fuelLevel),
                              }}>
                                {truck.fuelLevel}%
                              </span>
                            </div>
                          </td>
                          <td style={styles.td}>
                            <span style={{
                              ...styles.healthScore,
                              color: getHealthColor(truck.healthScore),
                            }}>
                              {truck.healthScore}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <span style={styles.lastUpdate}>
                              {formatTime(truck.lastUpdate)}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                  {paginatedTrucks.length === 0 && (
                    <tr>
                      <td colSpan={10} style={{
                        ...styles.td,
                        textAlign: 'center',
                        padding: '48px 16px',
                        color: 'var(--text-muted)',
                        fontSize: '14px',
                      }}>
                        <Search size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
                        <br />
                        No vehicles match your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ---- Pagination ---- */}
            <div style={styles.pagination}>
              <span style={styles.paginationInfo}>
                Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, sortedTrucks.length)}
                –{Math.min(currentPage * ITEMS_PER_PAGE, sortedTrucks.length)} of {sortedTrucks.length} vehicles
              </span>
              <div style={styles.paginationControls}>
                <motion.button
                  style={{ ...styles.pageBtn, opacity: currentPage === 1 ? 0.4 : 1 }}
                  whileHover={currentPage > 1 ? { scale: 1.1 } : {}}
                  whileTap={currentPage > 1 ? { scale: 0.9 } : {}}
                  onClick={() => currentPage > 1 && setCurrentPage(p => p - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={14} />
                </motion.button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <motion.button
                    key={page}
                    style={{
                      ...styles.pageBtn,
                      ...(currentPage === page ? styles.pageBtnActive : {}),
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </motion.button>
                ))}
                <motion.button
                  style={{ ...styles.pageBtn, opacity: currentPage === totalPages ? 0.4 : 1 }}
                  whileHover={currentPage < totalPages ? { scale: 1.1 } : {}}
                  whileTap={currentPage < totalPages ? { scale: 0.9 } : {}}
                  onClick={() => currentPage < totalPages && setCurrentPage(p => p + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={14} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ---- Quick Stats Sidebar ---- */}
        <motion.div
          style={styles.sidebar}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Fleet Quick Stats */}
          <div style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>
              <BarChart3 size={16} color="#6366f1" />
              Quick Stats
            </h3>
            <div style={styles.statRow}>
              <span style={styles.statLabel}>Average Fleet Age</span>
              <span style={styles.statValue}>{quickStats.avgAge} yrs</span>
            </div>
            <div style={styles.statRow}>
              <span style={styles.statLabel}>Total Distance Today</span>
              <span style={{ ...styles.statValue, color: '#38CE3C' }}>
                {(quickStats.totalDistToday).toLocaleString('en-IN')} km
              </span>
            </div>
            <div style={styles.statRow}>
              <span style={styles.statLabel}>Fuel Consumption</span>
              <span style={{ ...styles.statValue, color: '#f59e0b' }}>
                {quickStats.fuelConsumption.toLocaleString('en-IN')} L
              </span>
            </div>
            <div style={{ ...styles.statRow, borderBottom: 'none' }}>
              <span style={styles.statLabel}>Maintenance Alerts</span>
              <span style={{
                ...styles.statValue,
                color: quickStats.maintenanceAlerts > 0 ? '#FF4D6B' : '#38CE3C',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                {quickStats.maintenanceAlerts > 0 && <AlertTriangle size={14} />}
                {quickStats.maintenanceAlerts}
              </span>
            </div>
          </div>

          {/* Fleet Utilization */}
          <div style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>
              <Gauge size={16} color="#38CE3C" />
              Fleet Utilization
            </h3>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
              const pct = ((statusCounts[key] / trucks.length) * 100).toFixed(1);
              return (
                <div key={key} style={{ marginBottom: '14px' }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginBottom: '6px',
                  }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {cfg.label}
                    </span>
                    <span style={{
                      fontSize: '12px', fontWeight: 600,
                      fontFamily: 'var(--font-mono)', color: cfg.color,
                    }}>
                      {pct}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%', height: '6px', borderRadius: '3px',
                    background: 'var(--bg-600)', overflow: 'hidden',
                  }}>
                    <motion.div
                      style={{
                        height: '100%', borderRadius: '3px',
                        background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}88)`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Maintenance Alerts */}
          <div style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>
              <AlertTriangle size={16} color="#FF4D6B" />
              Maintenance Alerts
            </h3>
            {maintenanceAlerts.map((alert, i) => (
              <motion.div
                key={i}
                style={styles.alertItem}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
              >
                <div style={{ ...styles.alertDot, background: alert.color }} />
                <div>
                  <div style={styles.alertText}>{alert.text}</div>
                  <div style={styles.alertTime}>{alert.time}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Today's Activity */}
          <div style={styles.sidebarCard}>
            <h3 style={styles.sidebarTitle}>
              <Calendar size={16} color="#3b82f6" />
              Today's Activity
            </h3>
            <div style={styles.statRow}>
              <span style={styles.statLabel}>Trips Started</span>
              <span style={{ ...styles.statValue, display: 'flex', alignItems: 'center', gap: '4px' }}>
                34
                <ArrowUpRight size={14} color="#38CE3C" />
              </span>
            </div>
            <div style={styles.statRow}>
              <span style={styles.statLabel}>Trips Completed</span>
              <span style={{ ...styles.statValue, display: 'flex', alignItems: 'center', gap: '4px' }}>
                28
                <ArrowUpRight size={14} color="#38CE3C" />
              </span>
            </div>
            <div style={styles.statRow}>
              <span style={styles.statLabel}>Avg Speed</span>
              <span style={styles.statValue}>62 km/h</span>
            </div>
            <div style={{ ...styles.statRow, borderBottom: 'none' }}>
              <span style={styles.statLabel}>Fuel Cost</span>
              <span style={{ ...styles.statValue, color: '#f59e0b' }}>
                ₹3.1L
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ---- Inline keyframes for pulse animation ---- */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
      `}</style>

      <AnimatePresence>
        {addModalOpen && (
          <AddVehicleModal
            onClose={() => setAddModalOpen(false)}
            onAdd={(newTruck) => {
              setTrucks(prev => [newTruck, ...prev]);
              setAddModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTruckForDocs && (
          <VehicleDocumentsModal
            truck={selectedTruckForDocs}
            onClose={() => setSelectedTruckForDocs(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Indian Commercial Vehicle Models Map
const VEHICLE_MODELS_MAP = {
  'Tata Motors': ['Tata Signa 4825.T', 'Tata Prima 5530.S', 'Tata Ultra T.16', 'Tata LPT 1918', 'Tata Signa 2821.T', 'Tata Prima 3530.K'],
  'Ashok Leyland': ['Ashok Leyland 4825 HN', 'Ashok Leyland 5520', 'Ashok Leyland Ecomet 1615', 'Ashok Leyland Boss 1215', 'Ashok Leyland AVTR 3120', 'Ashok Leyland Bada Dost'],
  'Mahindra & Mahindra': ['Mahindra Blazo X 49', 'Mahindra Furio 14', 'Mahindra Blazo X 35', 'Mahindra Cruzio', 'Mahindra Bolero Maxx'],
  'BharatBenz': ['BharatBenz 4828R', 'BharatBenz 5528TT', 'BharatBenz 1917R', 'BharatBenz 2823R', 'BharatBenz 3523R'],
  'Eicher Motors': ['Eicher Pro 6048', 'Eicher Pro 3019', 'Eicher Pro 2049', 'Eicher Pro 8055', 'Eicher Pro 6028'],
  'Volvo Trucks': ['Volvo FMX 460 Tipper', 'Volvo FH 520 Puller', 'Volvo FM 420 Haulage'],
  'Scania India': ['Scania R500 Heavy Puller', 'Scania G410 Tipper', 'Scania P410 Coal Hauler'],
  'AMW': ['AMW 2518 TP Tipper', 'AMW 3118 HL Haulage'],
  'Isuzu Motors': ['Isuzu D-Max S-Cab', 'Isuzu MU-X Support Utility']
};

// ---- REGISTRATION HELPER / MODAL COMPONENT ----
function AddVehicleModal({ onClose, onAdd }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    stateCode: 'MH',
    rtoCode: '12',
    series: 'QE',
    regNum: '4592',
    maker: 'Tata Motors',
    model: 'Tata Signa 4825.T',
    type: 'Heavy Goods Vehicle (HGV)',
    fuelType: 'Diesel',
    chassisNumber: '',
    engineNumber: '',
    gvw: '35000',
    unladenWeight: '12000',
    nationalPermit: '',
    fastagId: '',
    pucNumber: '',
    fitnessValidity: '2027-07-06',
    insurancePolicy: '',
    driver: 'Rajesh Kumar',
    origin: 'Mumbai',
    destination: 'Delhi',
    business: 'Tata Motors Logistics'
  });

  const [errors, setErrors] = useState({});

  // Autogenerate compliant details to help the user/tester bypass writing Vin/fastag manually
  const autogenerateDetails = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const randomChassis = 'MAT' + Array.from({ length: 14 }, () => Math.random().toString(36).charAt(2).toUpperCase()).join('');
    const randomEngine = 'ENG' + Math.floor(10000000 + Math.random() * 90000000);
    const randomPermit = 'NP/' + new Date().getFullYear() + '/' + formData.stateCode + '/' + Math.floor(10000 + Math.random() * 90000);
    const randomFastag = 'FT-' + Math.floor(1000000000000000 + Math.random() * 9000000000000000);
    const randomPuc = 'PUC/' + formData.stateCode + '/' + Math.floor(1000000 + Math.random() * 900000);
    const randomInsurance = 'INS/CR-' + Math.floor(100000 + Math.random() * 900000);

    setFormData(prev => ({
      ...prev,
      regNum: String(randomNum),
      chassisNumber: randomChassis,
      engineNumber: randomEngine,
      nationalPermit: randomPermit,
      fastagId: randomFastag,
      pucNumber: randomPuc,
      insurancePolicy: randomInsurance
    }));
    setErrors({});
  };

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  const validateStep = () => {
    const newErrs = {};
    if (step === 1) {
      if (!formData.regNum || !/^\d{4}$/.test(formData.regNum)) {
        newErrs.regNum = 'Must be exactly 4 digits';
      }
      if (!formData.rtoCode || !/^\d{2}$/.test(formData.rtoCode)) {
        newErrs.rtoCode = 'Must be 2 digits';
      }
      if (!formData.series || !/^[A-Z]{1,3}$/i.test(formData.series)) {
        newErrs.series = '1-3 Letters';
      }
    } else if (step === 2) {
      if (!formData.chassisNumber || formData.chassisNumber.length !== 17) {
        newErrs.chassisNumber = 'VIN / Chassis must be exactly 17 characters';
      }
      if (!formData.engineNumber || formData.engineNumber.length < 6) {
        newErrs.engineNumber = 'Engine number is required (min 6 chars)';
      }
      if (!formData.gvw || isNaN(formData.gvw) || Number(formData.gvw) <= 0) {
        newErrs.gvw = 'Must be positive weight';
      }
      if (!formData.unladenWeight || isNaN(formData.unladenWeight) || Number(formData.unladenWeight) >= Number(formData.gvw)) {
        newErrs.unladenWeight = 'Must be less than GVW';
      }
    } else if (step === 3) {
      if (!formData.nationalPermit) {
        newErrs.nationalPermit = 'National Permit number is mandatory';
      }
      if (!formData.fastagId || !/^FT-\d{16}$/.test(formData.fastagId)) {
        newErrs.fastagId = 'FASTag ID format: FT- followed by 16 digits';
      }
      if (!formData.pucNumber) {
        newErrs.pucNumber = 'PUC details required';
      }
    }
    setErrors(newErrs);
    return Object.keys(newErrs).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 4) return;
    if (!validateStep()) return;

    const fullRegNo = `${formData.stateCode}-${formData.rtoCode}-${formData.series.toUpperCase()}-${formData.regNum}`;

    // Assemble new truck object
    const newTruck = {
      id: `TRK-${String(Math.floor(51 + Math.random() * 950)).padStart(5, '0')}`,
      regNumber: fullRegNo.replace(/-/g, ''),
      type: formData.model,
      status: 'idle', // newly registered start as idle
      driver: formData.driver,
      driverId: `DRV-${String(Math.floor(100 + Math.random() * 400)).padStart(5, '0')}`,
      origin: formData.origin,
      destination: formData.destination,
      lat: 19.0760, // default Mumbai
      lng: 72.8777,
      speed: 0,
      fuelLevel: 100,
      fuelType: formData.fuelType,
      fastagBalance: 10000,
      lastUpdate: new Date().toISOString(),
      eta: '-',
      loadWeight: 0,
      temperature: null,
      mileage: 0,
      nextService: '5000 km',
      healthScore: 100,
      dailyCost: 12000,
      business: formData.business,
      chassisNumber: formData.chassisNumber,
      engineNumber: formData.engineNumber,
      gvw: formData.gvw,
      unladenWeight: formData.unladenWeight,
      nationalPermit: formData.nationalPermit,
      fastagId: formData.fastagId,
      pucNumber: formData.pucNumber,
      fitnessValidity: formData.fitnessValidity,
      insurancePolicy: formData.insurancePolicy
    };

    // Emit event to simulation engine
    RealityEngine.dispatchEvent('VEHICLE_COMMISSIONED', {
      vehicleId: newTruck.id,
      regNumber: newTruck.regNumber,
      operator: 'Arjun Kapoor',
      nationalPermit: newTruck.nationalPermit,
      fastagId: newTruck.fastagId
    });

    onAdd(newTruck);
  };

  // Styles
  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(10, 15, 30, 0.75)',
      backdropFilter: 'blur(12px)',
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    container: {
      width: '100%',
      maxWidth: '680px',
      background: '#131929',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '28px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      position: 'relative',
    },
    closeBtn: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'transparent',
      border: 'none',
      color: 'var(--text-secondary)',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s',
    },
    titleSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    badge: {
      fontSize: '10px',
      fontWeight: 700,
      padding: '3px 8px',
      background: 'rgba(99, 102, 241, 0.15)',
      color: 'var(--primary-400)',
      borderRadius: '10px',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    headerText: {
      fontSize: '20px',
      fontWeight: 700,
      color: '#fff',
      margin: 0,
    },
    wizardBar: {
      display: 'flex',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      paddingBottom: '12px',
      marginBottom: '8px',
    },
    stepIndicator: (active) => ({
      fontSize: '12px',
      fontWeight: 600,
      color: active ? 'var(--primary-400)' : 'var(--text-muted)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      paddingBottom: '4px',
      borderBottom: active ? '2px solid var(--primary-500)' : 'none',
    }),
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    row: {
      display: 'flex',
      gap: '16px',
    },
    col: (span) => ({
      flex: span,
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      minWidth: 0,
    }),
    label: {
      fontSize: '11px',
      fontWeight: 600,
      color: 'var(--text-secondary)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    input: {
      width: '100%',
      boxSizing: 'border-box',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '8px',
      padding: '10px 14px',
      color: '#fff',
      fontSize: '13px',
      outline: 'none',
      transition: 'border-color 0.2s',
      fontFamily: 'var(--font-sans)',
    },
    select: {
      width: '100%',
      boxSizing: 'border-box',
      background: '#161d30',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '8px',
      padding: '10px 14px',
      color: '#fff',
      fontSize: '13px',
      outline: 'none',
      fontFamily: 'var(--font-sans)',
      cursor: 'pointer',
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '12px',
      alignItems: 'center',
    },
    errorText: {
      fontSize: '10px',
      color: '#FF4D6B',
      marginTop: '2px',
      fontWeight: 500,
    },
    infoBox: {
      background: 'rgba(59, 130, 246, 0.08)',
      border: '1px solid rgba(59, 130, 246, 0.2)',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '11px',
      color: '#93c5fd',
      lineHeight: 1.5,
      display: 'flex',
      gap: '8px',
      alignItems: 'flex-start'
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <motion.div
        style={modalStyles.container}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
      >
        <button style={modalStyles.closeBtn} onClick={onClose}>
          <X size={18} />
        </button>

        <div style={modalStyles.titleSection}>
          <div style={modalStyles.badge}>CMVR Form 20</div>
          <h2 style={modalStyles.headerText}>Vahan e-Registry Portal</h2>
        </div>

        {/* Wizard Steps */}
        <div style={modalStyles.wizardBar}>
          <span style={modalStyles.stepIndicator(step === 1)}>1. RTO & Maker</span>
          <span style={modalStyles.stepIndicator(step === 2)}>2. Engine & Weights</span>
          <span style={modalStyles.stepIndicator(step === 3)}>3. Permits & FASTag</span>
          <span style={modalStyles.stepIndicator(step === 4)}>4. Hub Assignment</span>
        </div>

        <form onSubmit={handleSubmit} style={modalStyles.form}>
          {/* STEP 1: Registration and Maker */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={modalStyles.infoBox}>
                <Truck size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Under CMV Rules, commercial vehicles must be registered with their state/RTO codes. Enter the Registration Number details below.</span>
              </div>
              <div style={modalStyles.row}>
                <div style={modalStyles.col(6)}>
                  <label style={modalStyles.label}>State Code</label>
                  <select
                    style={modalStyles.select}
                    value={formData.stateCode}
                    onChange={(e) => handleInputChange('stateCode', e.target.value)}
                  >
                    {[
                      { c: 'AN', n: 'Andaman & Nicobar' },
                      { c: 'AP', n: 'Andhra Pradesh' },
                      { c: 'AR', n: 'Arunachal Pradesh' },
                      { c: 'AS', n: 'Assam' },
                      { c: 'BR', n: 'Bihar' },
                      { c: 'CH', n: 'Chandigarh' },
                      { c: 'CG', n: 'Chhattisgarh' },
                      { c: 'DN', n: 'Dadra & Nagar Haveli' },
                      { c: 'DL', n: 'Delhi' },
                      { c: 'GA', n: 'Goa' },
                      { c: 'GJ', n: 'Gujarat' },
                      { c: 'HR', n: 'Haryana' },
                      { c: 'HP', n: 'Himachal Pradesh' },
                      { c: 'JK', n: 'Jammu & Kashmir' },
                      { c: 'JH', n: 'Jharkhand' },
                      { c: 'KA', n: 'Karnataka' },
                      { c: 'KL', n: 'Kerala' },
                      { c: 'LA', n: 'Ladakh' },
                      { c: 'LD', n: 'Lakshadweep' },
                      { c: 'MP', n: 'Madhya Pradesh' },
                      { c: 'MH', n: 'Maharashtra' },
                      { c: 'MN', n: 'Manipur' },
                      { c: 'ML', n: 'Meghalaya' },
                      { c: 'MZ', n: 'Mizoram' },
                      { c: 'NL', n: 'Nagaland' },
                      { c: 'OD', n: 'Odisha' },
                      { c: 'PB', n: 'Punjab' },
                      { c: 'PY', n: 'Puducherry' },
                      { c: 'RJ', n: 'Rajasthan' },
                      { c: 'SK', n: 'Sikkim' },
                      { c: 'TN', n: 'Tamil Nadu' },
                      { c: 'TS', n: 'Telangana' },
                      { c: 'TR', n: 'Tripura' },
                      { c: 'UP', n: 'Uttar Pradesh' },
                      { c: 'UK', n: 'Uttarakhand' },
                      { c: 'WB', n: 'West Bengal' }
                    ].map(st => (
                      <option key={st.c} value={st.c}>{st.c} - {st.n}</option>
                    ))}
                  </select>
                </div>
                <div style={modalStyles.col(6)}>
                  <label style={modalStyles.label}>RTO Office Code</label>
                  <input
                    style={modalStyles.input}
                    value={formData.rtoCode}
                    maxLength={2}
                    placeholder="e.g. 12"
                    onChange={(e) => handleInputChange('rtoCode', e.target.value.replace(/\D/g, ''))}
                  />
                  {errors.rtoCode && <span style={modalStyles.errorText}>{errors.rtoCode}</span>}
                </div>
              </div>

              <div style={modalStyles.row}>
                <div style={modalStyles.col(6)}>
                  <label style={modalStyles.label}>Series (Alphabets)</label>
                  <input
                    style={modalStyles.input}
                    value={formData.series}
                    maxLength={3}
                    placeholder="e.g. AB"
                    onChange={(e) => handleInputChange('series', e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                  />
                  {errors.series && <span style={modalStyles.errorText}>{errors.series}</span>}
                  
                  {/* Series Sequence Suggestions */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                    {['AA', 'QE', 'BH', 'TR', 'T', 'G'].map(sfx => (
                      <button
                        key={sfx}
                        type="button"
                        style={{
                          fontSize: '9px',
                          padding: '2px 6px',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '4px',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-mono)'
                        }}
                        onClick={() => handleInputChange('series', sfx)}
                      >
                        {sfx === 'BH' ? 'BH (Bharat)' : sfx === 'TR' ? 'TR (Temp)' : sfx === 'T' ? 'T (Transport)' : sfx === 'G' ? 'G (Govt)' : sfx}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={modalStyles.col(6)}>
                  <label style={modalStyles.label}>Unique 4-Digits</label>
                  <input
                    style={modalStyles.input}
                    value={formData.regNum}
                    maxLength={4}
                    placeholder="e.g. 9840"
                    onChange={(e) => handleInputChange('regNum', e.target.value.replace(/\D/g, ''))}
                  />
                  {errors.regNum && <span style={modalStyles.errorText}>{errors.regNum}</span>}
                </div>
              </div>

              <div style={modalStyles.row}>
                <div style={modalStyles.col(6)}>
                  <label style={modalStyles.label}>Maker (Manufacturer)</label>
                  <select
                    style={modalStyles.select}
                    value={formData.maker}
                    onChange={(e) => {
                      const newMaker = e.target.value;
                      const defaultModel = VEHICLE_MODELS_MAP[newMaker]?.[0] || '';
                      setFormData(prev => ({
                        ...prev,
                        maker: newMaker,
                        model: defaultModel
                      }));
                    }}
                  >
                    {Object.keys(VEHICLE_MODELS_MAP).map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div style={modalStyles.col(6)}>
                  <label style={modalStyles.label}>Model & Classification</label>
                  <select
                    style={modalStyles.select}
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                  >
                    {(VEHICLE_MODELS_MAP[formData.maker] || []).map(mo => (
                      <option key={mo} value={mo}>{mo}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={modalStyles.row}>
                <div style={modalStyles.col(6)}>
                  <label style={modalStyles.label}>Fuel Type</label>
                  <select
                    style={modalStyles.select}
                    value={formData.fuelType}
                    onChange={(e) => handleInputChange('fuelType', e.target.value)}
                  >
                    {['Diesel', 'CNG', 'LNG', 'Electric'].map(fl => (
                      <option key={fl} value={fl}>{fl}</option>
                    ))}
                  </select>
                </div>
                <div style={modalStyles.col(6)}>
                  <label style={modalStyles.label}>Vehicle Class</label>
                  <select
                    style={modalStyles.select}
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    {[
                      'Heavy Goods Vehicle (HGV)',
                      'Medium Goods Vehicle (MGV)',
                      'Light Commercial Vehicle (LCV)',
                      'Multi-Axle Articulated Trailer',
                      'Tipper / Dumper Truck',
                      'Reefer Container (Cold Chain)',
                      'Liquid/Gas Tanker',
                      'Tractor-Trailer Unit',
                      'Box Container Truck',
                      'Special Purpose Vehicle (SPV)'
                    ].map(vc => (
                      <option key={vc} value={vc}>{vc}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Engine Specs & Weight */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={modalStyles.infoBox}>
                <Wrench size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Enter technical details below. Chassis numbers must match the 17-character VIN standard, and Weights must comply with legal axle load limits.</span>
              </div>
              <div style={modalStyles.row}>
                <div style={modalStyles.col(12)}>
                  <label style={modalStyles.label}>Chassis Number (VIN)</label>
                  <input
                    style={{ ...modalStyles.input, fontFamily: 'var(--font-mono)' }}
                    value={formData.chassisNumber}
                    maxLength={17}
                    placeholder="e.g. MAT42981084920194"
                    onChange={(e) => handleInputChange('chassisNumber', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                  />
                  {errors.chassisNumber && <span style={modalStyles.errorText}>{errors.chassisNumber}</span>}
                </div>
              </div>
              <div style={modalStyles.row}>
                <div style={modalStyles.col(12)}>
                  <label style={modalStyles.label}>Engine Number</label>
                  <input
                    style={{ ...modalStyles.input, fontFamily: 'var(--font-mono)' }}
                    value={formData.engineNumber}
                    placeholder="e.g. ENG9920183"
                    onChange={(e) => handleInputChange('engineNumber', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                  />
                  {errors.engineNumber && <span style={modalStyles.errorText}>{errors.engineNumber}</span>}
                </div>
              </div>

              <div style={modalStyles.row}>
                <div style={modalStyles.col(6)}>
                  <label style={modalStyles.label}>Gross Vehicle Weight (GVW) (kg)</label>
                  <input
                    style={modalStyles.input}
                    value={formData.gvw}
                    placeholder="e.g. 35000"
                    onChange={(e) => handleInputChange('gvw', e.target.value.replace(/\D/g, ''))}
                  />
                  {errors.gvw && <span style={modalStyles.errorText}>{errors.gvw}</span>}
                </div>
                <div style={modalStyles.col(6)}>
                  <label style={modalStyles.label}>Unladen Weight (Kerb) (kg)</label>
                  <input
                    style={modalStyles.input}
                    value={formData.unladenWeight}
                    placeholder="e.g. 12000"
                    onChange={(e) => handleInputChange('unladenWeight', e.target.value.replace(/\D/g, ''))}
                  />
                  {errors.unladenWeight && <span style={modalStyles.errorText}>{errors.unladenWeight}</span>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Permits & Compliance */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={modalStyles.infoBox}>
                <FileText size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>National Permits and FASTag identifiers are required for interstate transport under MoRTH rules. Fastags are NPCI-linked RFID codes.</span>
              </div>
              <div style={modalStyles.row}>
                <div style={modalStyles.col(12)}>
                  <label style={modalStyles.label}>National Permit (NP) ID</label>
                  <input
                    style={{ ...modalStyles.input, fontFamily: 'var(--font-mono)' }}
                    value={formData.nationalPermit}
                    placeholder="e.g. NP/2026/MH/10892"
                    onChange={(e) => handleInputChange('nationalPermit', e.target.value.toUpperCase())}
                  />
                  {errors.nationalPermit && <span style={modalStyles.errorText}>{errors.nationalPermit}</span>}
                </div>
              </div>
              <div style={modalStyles.row}>
                <div style={modalStyles.col(12)}>
                  <label style={modalStyles.label}>FASTag ID (NPCI-Mapped)</label>
                  <input
                    style={{ ...modalStyles.input, fontFamily: 'var(--font-mono)' }}
                    value={formData.fastagId}
                    placeholder="e.g. FT-8829103982710328"
                    maxLength={20}
                    onChange={(e) => handleInputChange('fastagId', e.target.value)}
                  />
                  {errors.fastagId && <span style={modalStyles.errorText}>{errors.fastagId}</span>}
                </div>
              </div>

              <div style={modalStyles.row}>
                <div style={modalStyles.col(6)}>
                  <label style={modalStyles.label}>PUC Certificate Number</label>
                  <input
                    style={modalStyles.input}
                    value={formData.pucNumber}
                    placeholder="e.g. PUC/MH/88219"
                    onChange={(e) => handleInputChange('pucNumber', e.target.value.toUpperCase())}
                  />
                  {errors.pucNumber && <span style={modalStyles.errorText}>{errors.pucNumber}</span>}
                </div>
                <div style={modalStyles.col(6)}>
                  <label style={modalStyles.label}>Carrier Insurance Policy</label>
                  <input
                    style={modalStyles.input}
                    value={formData.insurancePolicy}
                    placeholder="e.g. INS/CR-9921"
                    onChange={(e) => handleInputChange('insurancePolicy', e.target.value.toUpperCase())}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Assignment & Hubs */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={modalStyles.infoBox}>
                <MapPin size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Specify the operating hubs, business division, and designate a licensed driver for the newly commissioned fleet asset.</span>
              </div>
              <div style={modalStyles.row}>
                <div style={modalStyles.col(12)}>
                  <label style={modalStyles.label}>Designated Driver</label>
                  <select
                    style={modalStyles.select}
                    value={formData.driver}
                    onChange={(e) => handleInputChange('driver', e.target.value)}
                  >
                    {['Rajesh Kumar', 'Amit Singh', 'Sukhwinder Singh', 'Gurpreet Singh', 'Harpreet Singh', 'Mohammad Ali', 'Vijay Yadav'].map(dr => (
                      <option key={dr} value={dr}>{dr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={modalStyles.row}>
                <div style={modalStyles.col(6)}>
                  <label style={modalStyles.label}>Base Origin Hub</label>
                  <select
                    style={modalStyles.select}
                    value={formData.origin}
                    onChange={(e) => handleInputChange('origin', e.target.value)}
                  >
                    {['Mumbai', 'Delhi', 'Chennai', 'Kolkata', 'Ahmedabad', 'Pune', 'Guwahati', 'Hyderabad', 'Bangalore'].map(cit => (
                      <option key={cit} value={cit}>{cit}</option>
                    ))}
                  </select>
                </div>
                <div style={modalStyles.col(6)}>
                  <label style={modalStyles.label}>Route Destination Hub</label>
                  <select
                    style={modalStyles.select}
                    value={formData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                  >
                    {['Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Ahmedabad', 'Pune', 'Guwahati', 'Hyderabad', 'Bangalore'].map(cit => (
                      <option key={cit} value={cit} disabled={cit === formData.origin}>{cit}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={modalStyles.row}>
                <div style={modalStyles.col(12)}>
                  <label style={modalStyles.label}>Associated Business Account</label>
                  <select
                    style={modalStyles.select}
                    value={formData.business}
                    onChange={(e) => handleInputChange('business', e.target.value)}
                  >
                    {['Tata Motors Logistics', 'Reliance Retail Ltd', 'ITC Foods Division', 'Amazon India Core', 'Ambuja Cements'].map(bs => (
                      <option key={bs} value={bs}>{bs}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div style={modalStyles.actions}>
            {/* Left aligned: Auto-fill suggestion (only on Step 1) */}
            <div>
              {step === 1 && (
                <button
                  type="button"
                  style={{ ...styles.btnSecondary, background: 'rgba(99, 102, 241, 0.08)', color: 'var(--primary-400)', border: '1px dashed var(--primary-500)', padding: '8px 16px' }}
                  onClick={autogenerateDetails}
                >
                  Auto-fill Mock Info
                </button>
              )}
            </div>

            {/* Right aligned: Back and Next/Submit side-by-side */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {step > 1 && (
                <button
                  key="btn-back-step"
                  type="button"
                  style={{ ...styles.btnSecondary, padding: '8px 16px' }}
                  onClick={handleBack}
                >
                  Back
                </button>
              )}

              {step < 4 ? (
                <button
                  key="btn-next-step"
                  type="button"
                  style={{ ...styles.btnPrimary, padding: '8px 20px' }}
                  onClick={handleNext}
                >
                  Next Step
                </button>
              ) : (
                <button
                  key="btn-commission-submit"
                  type="submit"
                  style={{ ...styles.btnPrimary, background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)', padding: '8px 24px' }}
                >
                  Commission Vehicle
                </button>
              )}
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ---- VEHICLE DOCUMENTS / CERTIFICATE VIEW MODAL ----
function VehicleDocumentsModal({ truck, onClose }) {
  // Format registration number for neat display: MH12QE4592 -> MH-12-QE-4592
  const formattedReg = useMemo(() => {
    const reg = truck.regNumber || '';
    if (reg.includes('-')) return reg;
    if (reg.length === 10) {
      return `${reg.slice(0, 2)}-${reg.slice(2, 4)}-${reg.slice(4, 6)}-${reg.slice(6)}`;
    }
    return reg;
  }, [truck.regNumber]);

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(10, 15, 30, 0.75)',
      backdropFilter: 'blur(12px)',
      zIndex: 1100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    container: {
      width: '100%',
      maxWidth: '560px',
      background: '#131929',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '28px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      position: 'relative',
    },
    closeBtn: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'transparent',
      border: 'none',
      color: 'var(--text-secondary)',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s',
    },
    titleSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    badge: {
      fontSize: '10px',
      fontWeight: 700,
      padding: '3px 8px',
      background: 'rgba(16, 185, 129, 0.15)',
      color: '#10b981',
      borderRadius: '10px',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    headerText: {
      fontSize: '18px',
      fontWeight: 700,
      color: '#fff',
      margin: 0,
    },
    certificateCard: {
      background: 'linear-gradient(135deg, #161e33, #0f1524)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '12px',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    },
    watermark: {
      position: 'absolute',
      right: '-30px',
      bottom: '-30px',
      opacity: 0.03,
      transform: 'rotate(-15deg)',
      pointerEvents: 'none',
    },
    certHeader: {
      textAlign: 'center',
      borderBottom: '2px solid rgba(255,255,255,0.06)',
      paddingBottom: '12px',
      marginBottom: '16px',
    },
    govtText: {
      fontSize: '10px',
      fontWeight: 700,
      color: 'var(--text-muted)',
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },
    rcTitle: {
      fontSize: '14px',
      fontWeight: 700,
      color: '#fff',
      marginTop: '4px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px',
    },
    label: {
      fontSize: '9px',
      fontWeight: 600,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    val: {
      fontSize: '12px',
      fontWeight: 600,
      color: 'var(--text-primary)',
      marginTop: '2px',
      wordBreak: 'break-all',
    },
    verifiedItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 12px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.04)',
      borderRadius: '6px',
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <motion.div
        style={modalStyles.container}
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
      >
        <button style={modalStyles.closeBtn} onClick={onClose}>
          <X size={18} />
        </button>

        <div style={modalStyles.titleSection}>
          <div style={modalStyles.badge}>Vahan e-Docs</div>
          <h2 style={modalStyles.headerText}>Vehicle Registry Wallet</h2>
        </div>

        <div style={modalStyles.certificateCard}>
          <div style={modalStyles.watermark}>
            <Truck size={200} color="#fff" />
          </div>

          <div style={modalStyles.certHeader}>
            <div style={modalStyles.govtText}>Ministry of Road Transport & Highways</div>
            <div style={modalStyles.rcTitle}>Certificate of Registration (Form 23)</div>
            <div style={{
              fontSize: '16px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: 'var(--primary-400)',
              marginTop: '8px',
              letterSpacing: '1px',
            }}>
              {formattedReg}
            </div>
          </div>

          <div style={modalStyles.grid}>
            <div>
              <div style={modalStyles.label}>Owner Name</div>
              <div style={modalStyles.val}>GatiFleet Carriers Ltd</div>
            </div>
            <div>
              <div style={modalStyles.label}>Maker / Model</div>
              <div style={modalStyles.val}>{truck.type}</div>
            </div>
            <div>
              <div style={modalStyles.label}>Chassis Number (VIN)</div>
              <div style={{ ...modalStyles.val, fontFamily: 'var(--font-mono)' }}>
                {truck.chassisNumber || 'MAT48291039281038'}
              </div>
            </div>
            <div>
              <div style={modalStyles.label}>Engine Number</div>
              <div style={{ ...modalStyles.val, fontFamily: 'var(--font-mono)' }}>
                {truck.engineNumber || 'ENG992019482'}
              </div>
            </div>
            <div>
              <div style={modalStyles.label}>Fuel Type</div>
              <div style={modalStyles.val}>{truck.fuelType || 'Diesel'}</div>
            </div>
            <div>
              <div style={modalStyles.label}>Unladen Weight / GVW</div>
              <div style={modalStyles.val}>
                {truck.unladenWeight || '12000'} / {truck.gvw || '35000'} kg
              </div>
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', margin: '4px 0 0', letterSpacing: '0.5px' }}>
          Compliance & Permit Ledgers
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={modalStyles.verifiedItem}>
            <div>
              <div style={modalStyles.label}>National Transport Permit</div>
              <div style={{ fontSize: '11px', fontWeight: 600, marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                {truck.nationalPermit || 'NP/2026/MH/10892'}
              </div>
            </div>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#38CE3C', background: 'rgba(56, 206, 60, 0.12)', padding: '2px 6px', borderRadius: '4px' }}>
              VALID
            </span>
          </div>

          <div style={modalStyles.verifiedItem}>
            <div>
              <div style={modalStyles.label}>FASTag ID (NPCI RFID Link)</div>
              <div style={{ fontSize: '11px', fontWeight: 600, marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                {truck.fastagId || 'FT-8829103982710328'}
              </div>
            </div>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#38CE3C', background: 'rgba(56, 206, 60, 0.12)', padding: '2px 6px', borderRadius: '4px' }}>
              ACTIVE
            </span>
          </div>

          <div style={modalStyles.verifiedItem}>
            <div>
              <div style={modalStyles.label}>Pollution Under Control (PUC)</div>
              <div style={{ fontSize: '11px', fontWeight: 600, marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                {truck.pucNumber || 'PUC/MH/88219'}
              </div>
            </div>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#38CE3C', background: 'rgba(56, 206, 60, 0.12)', padding: '2px 6px', borderRadius: '4px' }}>
              VERIFIED
            </span>
          </div>

          <div style={modalStyles.verifiedItem}>
            <div>
              <div style={modalStyles.label}>Carrier Insurance Policy</div>
              <div style={{ fontSize: '11px', fontWeight: 600, marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                {truck.insurancePolicy || 'INS/CR-992182'}
              </div>
            </div>
            <span style={{ fontSize: '9px', fontWeight: 700, color: '#38CE3C', background: 'rgba(56, 206, 60, 0.12)', padding: '2px 6px', borderRadius: '4px' }}>
              ACTIVE
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              flex: 1
            }}
            onClick={() => alert('Certificate downloaded to wallet successfully!')}
          >
            Download RC PDF
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.02)',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              flex: 1
            }}
            onClick={onClose}
          >
            Close Wallet
          </button>
        </div>
      </motion.div>
    </div>
  );
}
