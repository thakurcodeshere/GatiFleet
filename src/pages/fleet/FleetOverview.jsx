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
  AlertTriangle, BarChart3, Route, Calendar, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { generateTrucks, formatCurrency } from '../../data/mockData';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState(null);
  const ITEMS_PER_PAGE = 10;

  // ---- Derived data ----
  const statusCounts = useMemo(() => {
    const counts = { active: 0, idle: 0, maintenance: 0, offline: 0 };
    ALL_TRUCKS.forEach(t => counts[t.status]++);
    return counts;
  }, []);

  const filteredTrucks = useMemo(() => {
    let result = ALL_TRUCKS;

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
  }, [searchQuery, statusFilter]);

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
    const avgAge = (ALL_TRUCKS.reduce((s, t) => s + t.mileage, 0) / ALL_TRUCKS.length / 100000).toFixed(1);
    const totalDistToday = ALL_TRUCKS.filter(t => t.status === 'active').reduce((s, t) => s + t.speed * 4, 0);
    const fuelConsumption = ALL_TRUCKS.filter(t => t.status === 'active').length * 38;
    const maintenanceAlerts = ALL_TRUCKS.filter(t => t.healthScore < 75).length;
    return { avgAge, totalDistToday, fuelConsumption, maintenanceAlerts };
  }, []);

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
            {statusCounts.active} active of {ALL_TRUCKS.length} total vehicles &nbsp;•&nbsp; Last synced 2 min ago
          </p>
        </div>
        <div style={styles.headerActions}>
          <motion.button
            style={styles.btnPrimary}
            whileHover={{ scale: 1.03, boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)' }}
            whileTap={{ scale: 0.97 }}
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
              const percent = ((count / ALL_TRUCKS.length) * 100).toFixed(1);
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
                            <span style={styles.regNumber}>{truck.regNumber}</span>
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
              const pct = ((statusCounts[key] / ALL_TRUCKS.length) * 100).toFixed(1);
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
    </div>
  );
}
