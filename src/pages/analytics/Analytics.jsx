/* eslint-disable */
// ============================================================
// GatiFleet — Analytics & Intelligence Dashboard
// Comprehensive analytics with multi-chart bento grid layout
// ============================================================

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, TrendingUp, PieChart, Map, Activity,
  Download, Calendar, Clock, Fuel, IndianRupee,
  AlertTriangle, ArrowUpRight, ArrowDownRight, Target,
  Layers, ChevronRight, Sparkles, Filter, RefreshCw,
} from 'lucide-react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  revenueStreams,
  analyticsData,
  regionUtilization,
  platformKPIs,
  formatCurrency,
} from '../../data/mockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

// ── Styles ─────────────────────────────────────────────────────
const styles = {
  page: {
    padding: '28px 32px 40px',
    minHeight: '100vh',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text-primary)',
    background: 'var(--bg-900)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
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
  pageTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.5px',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  pageSub: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  dateRangeGroup: {
    display: 'flex',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    border: '1px solid var(--surface-border)',
  },
  dateBtn: (active) => ({
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: 'var(--font-sans)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: active ? 'var(--primary-500)' : 'var(--bg-700)',
    color: active ? '#fff' : 'var(--text-secondary)',
  }),
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 20px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--surface-border)',
    background: 'var(--bg-700)',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontWeight: 600,
    fontFamily: 'var(--font-sans)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  bentoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: '20px',
  },
  card: (colSpan = 6) => ({
    gridColumn: `span ${colSpan}`,
    background: 'var(--surface)',
    backdropFilter: 'blur(16px)',
    border: '1px solid var(--surface-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  }),
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  cardTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  iconWrap: (color) => ({
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `${color}18`,
    color: color,
    flexShrink: 0,
  }),
  cardTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    margin: 0,
  },
  cardSubtitle: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    margin: 0,
  },
  badge: (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
    background: `${color}18`,
    color: color,
  }),
  chartContainer: {
    flex: 1,
    position: 'relative',
    minHeight: '280px',
  },
  chartContainerSmall: {
    flex: 1,
    position: 'relative',
    minHeight: '240px',
  },
  // ── Revenue breakdown specific ──
  revTotal: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginBottom: '16px',
  },
  revTotalValue: {
    fontSize: '32px',
    fontWeight: 800,
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '-1px',
  },
  revTotalLabel: {
    fontSize: '14px',
    color: 'var(--text-muted)',
  },
  // ── Region table ──
  regionTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  regionTh: {
    textAlign: 'left',
    padding: '10px 12px',
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    color: 'var(--text-muted)',
    borderBottom: '1px solid var(--surface-border)',
  },
  regionTd: {
    padding: '12px 12px',
    borderBottom: '1px solid var(--surface-border)',
    color: 'var(--text-primary)',
    verticalAlign: 'middle',
  },
  utilBar: (pct) => {
    const hue = pct >= 90 ? 130 : pct >= 80 ? 60 : 0;
    return {
      height: '8px',
      borderRadius: '4px',
      background: 'var(--bg-600)',
      width: '100%',
      minWidth: '80px',
      position: 'relative',
      overflow: 'hidden',
    };
  },
  utilFill: (pct) => {
    const color = pct >= 90 ? '#38CE3C' : pct >= 80 ? '#f59e0b' : '#FF4D6B';
    return {
      height: '100%',
      width: `${pct}%`,
      borderRadius: '4px',
      background: `linear-gradient(90deg, ${color}99, ${color})`,
      transition: 'width 1s ease',
    };
  },
  // ── Metric cards ──
  metricCardsRow: {
    gridColumn: 'span 12',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  metricCard: {
    background: 'var(--surface)',
    backdropFilter: 'blur(16px)',
    border: '1px solid var(--surface-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    position: 'relative',
    overflow: 'hidden',
  },
  metricCardGlow: (color) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: `linear-gradient(90deg, ${color}, transparent)`,
  }),
  metricLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  metricValue: {
    fontSize: '28px',
    fontWeight: 800,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-primary)',
    letterSpacing: '-0.5px',
  },
  metricDetail: {
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  // ── Donut center ──
  donutCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    pointerEvents: 'none',
  },
  donutCenterValue: {
    fontSize: '22px',
    fontWeight: 800,
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
  },
  donutCenterLabel: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  // ── Legend ──
  legendGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginTop: '16px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  legendDot: (color) => ({
    width: '10px',
    height: '10px',
    borderRadius: '3px',
    background: color,
    flexShrink: 0,
  }),
};

// ── Animation variants ─────────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ── Helpers ────────────────────────────────────────────────────
const getCSSVar = (name) => {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
};

const DATE_RANGES = ['7D', '30D', '90D', '1Y'];

const COST_COLORS = ['#6366f1', '#3b82f6', '#38CE3C', '#f59e0b', '#ec4899', '#f97316', '#64748b'];

// ── Component ─────────────────────────────────────────────────
const Analytics = () => {
  const [dateRange, setDateRange] = useState('30D');

  // ── Revenue totals ──
  const totalRevenue = useMemo(
    () => revenueStreams.reduce((sum, s) => sum + s.value, 0),
    []
  );

  // ── Chart: Revenue Breakdown (horizontal bar) ──
  const revenueBarData = useMemo(() => ({
    labels: revenueStreams.map((s) => s.name),
    datasets: [
      {
        label: 'Revenue',
        data: revenueStreams.map((s) => s.value / 10000000), // to Cr
        backgroundColor: revenueStreams.map((s) => s.color + 'cc'),
        borderColor: revenueStreams.map((s) => s.color),
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.85,
      },
    ],
  }), []);

  const revenueBarOptions = useMemo(() => ({
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(10, 14, 26, 0.92)',
        titleColor: '#E0E0E0',
        bodyColor: '#B0B0B0',
        borderColor: 'rgba(99, 102, 241, 0.25)',
        borderWidth: 1,
        cornerRadius: 10,
        padding: 14,
        displayColors: true,
        callbacks: {
          label: (ctx) => {
            const stream = revenueStreams[ctx.dataIndex];
            return ` ₹${ctx.raw.toFixed(1)}Cr  (↑${stream.growth}%)`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(99, 102, 241, 0.06)', drawBorder: false },
        ticks: {
          color: 'var(--text-muted)',
          font: { family: "'JetBrains Mono', monospace", size: 11 },
          callback: (v) => `₹${v}Cr`,
        },
        border: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: {
          color: 'var(--text-secondary)',
          font: { family: "'Inter', sans-serif", size: 12, weight: 500 },
          padding: 8,
        },
        border: { display: false },
      },
    },
  }), []);

  // ── Chart: Fleet Utilization Trend (multi-line) ──
  const fleetTrendData = useMemo(() => ({
    labels: analyticsData.fleetTrend.labels,
    datasets: [
      {
        label: 'Utilization %',
        data: analyticsData.fleetTrend.utilization,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderWidth: 2.5,
      },
      {
        label: 'On-Time Delivery %',
        data: analyticsData.fleetTrend.onTime,
        borderColor: '#38CE3C',
        backgroundColor: 'transparent',
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: '#38CE3C',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderWidth: 2.5,
      },
      {
        label: 'Fuel Eff (km/L)',
        data: analyticsData.fleetTrend.fuelEff,
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderWidth: 2.5,
        yAxisID: 'y1',
      },
    ],
  }), []);

  const fleetTrendOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: 'var(--text-secondary)',
          usePointStyle: true,
          pointStyle: 'circle',
          font: { family: "'Inter', sans-serif", size: 11, weight: 500 },
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(10, 14, 26, 0.92)',
        titleColor: '#E0E0E0',
        bodyColor: '#B0B0B0',
        borderColor: 'rgba(99, 102, 241, 0.25)',
        borderWidth: 1,
        cornerRadius: 10,
        padding: 14,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(99, 102, 241, 0.06)', drawBorder: false },
        ticks: { color: 'var(--text-muted)', font: { size: 12 } },
        border: { display: false },
      },
      y: {
        position: 'left',
        min: 75,
        max: 100,
        grid: { color: 'rgba(99, 102, 241, 0.06)', drawBorder: false },
        ticks: {
          color: 'var(--text-muted)',
          font: { family: "'JetBrains Mono', monospace", size: 11 },
          callback: (v) => `${v}%`,
        },
        border: { display: false },
      },
      y1: {
        position: 'right',
        min: 3.5,
        max: 5.5,
        grid: { display: false },
        ticks: {
          color: '#f59e0b',
          font: { family: "'JetBrains Mono', monospace", size: 11 },
          callback: (v) => `${v} km/L`,
        },
        border: { display: false },
      },
    },
  }), []);

  // ── Chart: Cost Breakdown (donut) ──
  const costDonutData = useMemo(() => ({
    labels: analyticsData.costBreakdown.map((c) => c.name),
    datasets: [
      {
        data: analyticsData.costBreakdown.map((c) => c.value),
        backgroundColor: COST_COLORS,
        borderColor: 'var(--bg-700)',
        borderWidth: 3,
        hoverBorderColor: '#fff',
        hoverBorderWidth: 2,
        hoverOffset: 8,
      },
    ],
  }), []);

  const totalCost = useMemo(
    () => analyticsData.costBreakdown.reduce((sum, c) => sum + c.amount, 0),
    []
  );

  const costDonutOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(10, 14, 26, 0.92)',
        titleColor: '#E0E0E0',
        bodyColor: '#B0B0B0',
        borderColor: 'rgba(99, 102, 241, 0.25)',
        borderWidth: 1,
        cornerRadius: 10,
        padding: 14,
        callbacks: {
          label: (ctx) => {
            const item = analyticsData.costBreakdown[ctx.dataIndex];
            return ` ${item.name}: ${item.value}% — ${formatCurrency(item.amount)}`;
          },
        },
      },
    },
  }), []);

  // ── Chart: Demand Forecast (area) ──
  const demandForecastData = useMemo(() => ({
    labels: analyticsData.demandForecast.labels,
    datasets: [
      {
        label: 'Upper Bound',
        data: analyticsData.demandForecast.upper,
        borderColor: 'transparent',
        backgroundColor: 'rgba(99, 102, 241, 0.10)',
        fill: '+1',
        pointRadius: 0,
        tension: 0.4,
        borderWidth: 0,
      },
      {
        label: 'Predicted',
        data: analyticsData.demandForecast.predicted,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.10)',
        fill: 'origin',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        borderWidth: 2.5,
      },
      {
        label: 'Lower Bound',
        data: analyticsData.demandForecast.lower,
        borderColor: 'rgba(99, 102, 241, 0.30)',
        borderDash: [5, 5],
        backgroundColor: 'transparent',
        fill: false,
        pointRadius: 0,
        tension: 0.4,
        borderWidth: 1.5,
      },
    ],
  }), []);

  const demandForecastOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: 'var(--text-secondary)',
          usePointStyle: true,
          pointStyle: 'circle',
          font: { family: "'Inter', sans-serif", size: 11, weight: 500 },
          padding: 16,
          filter: (item) => item.text !== 'Upper Bound',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(10, 14, 26, 0.92)',
        titleColor: '#E0E0E0',
        bodyColor: '#B0B0B0',
        borderColor: 'rgba(99, 102, 241, 0.25)',
        borderWidth: 1,
        cornerRadius: 10,
        padding: 14,
        callbacks: {
          label: (ctx) => {
            const labels = ['Upper Bound', 'Predicted', 'Lower Bound'];
            return ` ${labels[ctx.datasetIndex]}: ${(ctx.raw / 1000).toFixed(0)}K shipments`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(99, 102, 241, 0.06)', drawBorder: false },
        ticks: { color: 'var(--text-muted)', font: { size: 12 } },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(99, 102, 241, 0.06)', drawBorder: false },
        ticks: {
          color: 'var(--text-muted)',
          font: { family: "'JetBrains Mono', monospace", size: 11 },
          callback: (v) => `${(v / 1000).toFixed(0)}K`,
        },
        border: { display: false },
      },
    },
  }), []);

  // ── Key metrics ──
  const metrics = [
    {
      label: 'Avg Trip Duration',
      value: `${platformKPIs.avgTripDuration} hrs`,
      icon: Clock,
      color: '#6366f1',
      detail: 'Across 89.4K daily shipments',
    },
    {
      label: 'Daily Toll Expenses',
      value: formatCurrency(platformKPIs.tollExpensesDaily),
      icon: IndianRupee,
      color: '#f59e0b',
      detail: 'FASTag auto-deductions',
    },
    {
      label: 'Daily Fuel Expenses',
      value: formatCurrency(platformKPIs.fuelExpensesDaily),
      icon: Fuel,
      color: '#FF4D6B',
      detail: 'Diesel + CNG + EV charging',
    },
    {
      label: 'Churn Risk',
      value: `${platformKPIs.churnRisk}%`,
      icon: AlertTriangle,
      color: '#ec4899',
      detail: '18 accounts flagged high-risk',
    },
  ];

  return (
    <div style={styles.page}>
      {/* ── Header ─────────────────────────────────────────────── */}
      <motion.div
        style={styles.header}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={styles.headerLeft}>
          <h1 style={styles.pageTitle}>
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Analytics & Intelligence
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #38CE3C, #10b981)',
              color: '#fff',
              padding: '3px 10px',
              borderRadius: '20px',
              WebkitTextFillColor: '#fff',
              letterSpacing: '0.5px',
            }}>
              LIVE
            </span>
          </h1>
          <p style={styles.pageSub}>
            Deep insights across fleet operations, revenue, and demand intelligence
          </p>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.dateRangeGroup}>
            {DATE_RANGES.map((range) => (
              <button
                key={range}
                style={styles.dateBtn(dateRange === range)}
                onClick={() => setDateRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
          <motion.button
            style={styles.exportBtn}
            whileHover={{ scale: 1.02, borderColor: 'var(--primary-500)' }}
            whileTap={{ scale: 0.98 }}
          >
            <Download size={15} />
            Export Report
          </motion.button>
        </div>
      </motion.div>

      {/* ── Bento Grid ─────────────────────────────────────────── */}
      <div style={styles.bentoGrid}>

        {/* ── 1. Revenue Breakdown (span 7) ──────────────────── */}
        <motion.div
          style={styles.card(7)}
          custom={0}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <div style={styles.cardHeader}>
            <div>
              <div style={styles.cardTitleRow}>
                <div style={styles.iconWrap('#6366f1')}>
                  <BarChart3 size={18} />
                </div>
                <div>
                  <h3 style={styles.cardTitle}>Revenue Breakdown</h3>
                  <p style={styles.cardSubtitle}>12 revenue streams performance</p>
                </div>
              </div>
            </div>
            <span style={styles.badge('#38CE3C')}>
              <ArrowUpRight size={13} />
              +8.3% MoM
            </span>
          </div>

          <div style={styles.revTotal}>
            <span style={styles.revTotalValue}>{formatCurrency(totalRevenue)}</span>
            <span style={styles.revTotalLabel}>total monthly revenue</span>
          </div>

          <div style={{ ...styles.chartContainer, minHeight: '420px' }}>
            <Bar data={revenueBarData} options={revenueBarOptions} />
          </div>

          {/* Growth badges row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--surface-border)',
          }}>
            {revenueStreams.slice(0, 5).map((s) => (
              <span key={s.name} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 600,
                background: `${s.color}14`,
                color: s.color,
              }}>
                <ArrowUpRight size={11} />
                {s.name.split(' ')[0]} +{s.growth}%
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── 2. Cost Breakdown (span 5) ─────────────────────── */}
        <motion.div
          style={styles.card(5)}
          custom={1}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <div style={styles.cardHeader}>
            <div style={styles.cardTitleRow}>
              <div style={styles.iconWrap('#ec4899')}>
                <PieChart size={18} />
              </div>
              <div>
                <h3 style={styles.cardTitle}>Cost Breakdown</h3>
                <p style={styles.cardSubtitle}>Monthly operating expenses</p>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '260px' }}>
            <div style={{ width: '240px', height: '240px', position: 'relative' }}>
              <Doughnut data={costDonutData} options={costDonutOptions} />
              <div style={styles.donutCenter}>
                <div style={styles.donutCenterValue}>{formatCurrency(totalCost)}</div>
                <div style={styles.donutCenterLabel}>Total Cost</div>
              </div>
            </div>
          </div>

          <div style={styles.legendGrid}>
            {analyticsData.costBreakdown.map((item, idx) => (
              <div key={item.name} style={styles.legendItem}>
                <span style={styles.legendDot(COST_COLORS[idx])} />
                <span style={{ flex: 1 }}>{item.name}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}>
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── 3. Fleet Utilization Trend (span 7) ────────────── */}
        <motion.div
          style={styles.card(7)}
          custom={2}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <div style={styles.cardHeader}>
            <div style={styles.cardTitleRow}>
              <div style={styles.iconWrap('#38CE3C')}>
                <TrendingUp size={18} />
              </div>
              <div>
                <h3 style={styles.cardTitle}>Fleet Utilization Trend</h3>
                <p style={styles.cardSubtitle}>Monthly performance metrics across fleet</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { label: 'Utilization', value: '87.4%', color: '#6366f1' },
                { label: 'On-Time', value: '94.2%', color: '#38CE3C' },
                { label: 'Fuel Eff', value: '4.8 km/L', color: '#f59e0b' },
              ].map((m) => (
                <div key={m.label} style={{
                  textAlign: 'center',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: `${m.color}0d`,
                  border: `1px solid ${m.color}22`,
                }}>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: m.color,
                  }}>
                    {m.value}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.chartContainer}>
            <Line data={fleetTrendData} options={fleetTrendOptions} />
          </div>
        </motion.div>

        {/* ── 4. Region Performance (span 5) ─────────────────── */}
        <motion.div
          style={styles.card(5)}
          custom={3}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <div style={styles.cardHeader}>
            <div style={styles.cardTitleRow}>
              <div style={styles.iconWrap('#3b82f6')}>
                <Map size={18} />
              </div>
              <div>
                <h3 style={styles.cardTitle}>Region Performance</h3>
                <p style={styles.cardSubtitle}>Fleet distribution & utilization by zone</p>
              </div>
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'auto' }}>
            <table style={styles.regionTable}>
              <thead>
                <tr>
                  <th style={styles.regionTh}>Region</th>
                  <th style={styles.regionTh}>Utilization</th>
                  <th style={{ ...styles.regionTh, textAlign: 'right' }}>Trucks</th>
                  <th style={{ ...styles.regionTh, textAlign: 'right' }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {regionUtilization.map((r, idx) => (
                  <motion.tr
                    key={r.region}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.06 }}
                    style={{ cursor: 'default' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-600)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <td style={styles.regionTd}>
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>
                        {r.region.replace(' India', '')}
                      </span>
                    </td>
                    <td style={styles.regionTd}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={styles.utilBar(r.utilization)}>
                          <motion.div
                            style={styles.utilFill(r.utilization)}
                            initial={{ width: 0 }}
                            animate={{ width: `${r.utilization}%` }}
                            transition={{ delay: 0.6 + idx * 0.08, duration: 0.8 }}
                          />
                        </div>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: r.utilization >= 90 ? '#38CE3C' : r.utilization >= 80 ? '#f59e0b' : '#FF4D6B',
                          minWidth: '42px',
                          textAlign: 'right',
                        }}>
                          {r.utilization}%
                        </span>
                      </div>
                    </td>
                    <td style={{ ...styles.regionTd, textAlign: 'right' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}>
                        {(r.trucks / 1000).toFixed(1)}K
                      </span>
                    </td>
                    <td style={{ ...styles.regionTd, textAlign: 'right' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#38CE3C',
                      }}>
                        {formatCurrency(r.revenue)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '14px 12px 0',
            borderTop: '1px solid var(--surface-border)',
            marginTop: '8px',
          }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              All Regions Total
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              fontWeight: 800,
              color: 'var(--text-primary)',
            }}>
              {formatCurrency(regionUtilization.reduce((s, r) => s + r.revenue, 0))}
            </span>
          </div>
        </motion.div>

        {/* ── 5. Demand Forecast (span 12) ───────────────────── */}
        <motion.div
          style={styles.card(12)}
          custom={4}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          <div style={styles.cardHeader}>
            <div style={styles.cardTitleRow}>
              <div style={styles.iconWrap('#a78bfa')}>
                <Sparkles size={18} />
              </div>
              <div>
                <h3 style={styles.cardTitle}>Demand Forecast</h3>
                <p style={styles.cardSubtitle}>AI-predicted shipment volume for next 6 months with confidence intervals</p>
              </div>
            </div>
            <span style={styles.badge('#6366f1')}>
              <Target size={13} />
              93% Confidence
            </span>
          </div>

          <div style={{ ...styles.chartContainer, minHeight: '300px' }}>
            <Line data={demandForecastData} options={demandForecastOptions} />
          </div>

          {/* Forecast insights strip */}
          <div style={{
            display: 'flex',
            gap: '24px',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--surface-border)',
          }}>
            {[
              { label: 'Peak Month', value: 'December', detail: '125K shipments' },
              { label: 'Avg Growth', value: '+12.4%', detail: 'vs last 6 months' },
              { label: 'Confidence Band', value: '±4.2%', detail: 'prediction interval' },
              { label: 'Seasonal Factor', value: 'Diwali Rush', detail: 'Oct–Dec spike expected' },
            ].map((item) => (
              <div key={item.label} style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                  {item.label}
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {item.value}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {item.detail}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── 6. Key Metrics Cards Row ───────────────────────── */}
        <motion.div
          style={styles.metricCardsRow}
          custom={5}
          initial="hidden"
          animate="visible"
          variants={cardVariants}
        >
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.label}
                style={styles.metricCard}
                whileHover={{
                  scale: 1.015,
                  borderColor: `${m.color}44`,
                  transition: { duration: 0.2 },
                }}
              >
                <div style={styles.metricCardGlow(m.color)} />
                <div style={styles.metricLabel}>
                  <div style={styles.iconWrap(m.color)}>
                    <Icon size={16} />
                  </div>
                  {m.label}
                </div>
                <div style={styles.metricValue}>{m.value}</div>
                <div style={styles.metricDetail}>{m.detail}</div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </div>
  );
};

export default Analytics;
