/* eslint-disable */
// ============================================================
// GatiFleet — Executive Dashboard
// CEO-Level Command Center (Refactored with Multi-Tab Strategic Cockpit)
// ============================================================
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Truck, Gauge, Clock, Users, Fuel,
  IndianRupee, Brain, Lightbulb, ShieldAlert, AlertTriangle,
  ChevronRight, Sparkles, Target, Zap, BarChart3, Activity,
  MapPin, ArrowUpRight, ArrowDownRight, Info, CheckCircle,
  Circle, Eye, MoreHorizontal, Calendar, RefreshCw,
  Settings, Server, Check, FileText, CreditCard, Play, Terminal, X, ShieldCheck
} from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  platformKPIs,
  revenueChartData,
  revenueStreams,
  popularRoutes,
  generateAlerts,
  aiInsights,
  regionUtilization,
  formatCurrency,
  formatNumber,
} from '../data/mockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

// ---- ANIMATED COUNTER HOOK ----
const useAnimatedValue = (target, duration = 1200) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let startTime = null;
    let raf;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
};

// ---- SPARKLINE COMPONENT ----
const Sparkline = ({ data, color = '#6366f1', width = 80, height = 28 }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#spark-${color.replace('#', '')})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// ---- INDIA SVG MAP COMPONENT ----
const CITY_POSITIONS = {
  Delhi:     { x: 185, y: 110 },
  Jaipur:    { x: 160, y: 138 },
  Lucknow:   { x: 225, y: 125 },
  Ahmedabad: { x: 130, y: 185 },
  Mumbai:    { x: 130, y: 240 },
  Pune:      { x: 148, y: 258 },
  Kolkata:   { x: 290, y: 195 },
  Hyderabad: { x: 195, y: 285 },
  Bangalore: { x: 170, y: 330 },
  Chennai:   { x: 210, y: 330 },
};

const IndiaMap = ({ dispatched }) => {
  const [hoveredCity, setHoveredCity] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const getCityTrucksCount = (city) => {
    const base = city === 'Delhi' ? 68420 :
                 city === 'Mumbai' ? 72340 :
                 city === 'Bangalore' ? 58200 :
                 city === 'Chennai' ? 42100 :
                 city === 'Kolkata' ? 45600 :
                 city === 'Hyderabad' ? 52800 :
                 city === 'Ahmedabad' ? 41200 :
                 city === 'Pune' ? 38700 :
                 city === 'Jaipur' ? 32150 : 28900;
    
    if (dispatched) {
      if (city === 'Delhi') return base + 5;
      if (city === 'Mumbai') return base + 3;
    }
    return base;
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 340 }}>
      <svg viewBox="0 0 400 420" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="mapBg" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="var(--primary-500)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ellipse cx="200" cy="220" rx="160" ry="190" fill="url(#mapBg)" />

        {/* Simplified India outline */}
        <path
          d="M185,28 C175,30 155,38 148,52 C140,68 128,82 125,95 C120,112 108,118 105,135
             C102,152 95,165 93,180 C90,198 88,210 92,225 C95,238 100,248 105,260
             C110,272 118,285 125,298 C132,310 140,322 148,335 C155,348 165,358 172,368
             C178,375 185,382 192,388 C198,392 205,395 210,390 C218,382 225,370 230,358
             C235,345 238,332 240,318 C242,305 245,292 248,280 C252,268 258,255 262,242
             C265,230 270,218 272,205 C275,192 280,178 282,165 C284,150 288,138 290,125
             C292,112 295,100 290,88 C285,75 278,65 268,55 C258,45 248,38 238,32
             C228,28 218,25 208,25 C198,25 192,26 185,28Z"
          fill="none"
          stroke="var(--primary-500)"
          strokeWidth="1"
          strokeOpacity="0.2"
          strokeDasharray="4,3"
        />

        {/* Route lines between cities */}
        {[
          ['Delhi', 'Mumbai'], ['Delhi', 'Kolkata'], ['Mumbai', 'Bangalore'],
          ['Chennai', 'Hyderabad'], ['Delhi', 'Jaipur'], ['Mumbai', 'Pune'],
          ['Bangalore', 'Chennai'], ['Ahmedabad', 'Mumbai'],
        ].map(([from, to], i) => (
          <line
            key={i}
            x1={CITY_POSITIONS[from].x}
            y1={CITY_POSITIONS[from].y}
            x2={CITY_POSITIONS[to].x}
            y2={CITY_POSITIONS[to].y}
            stroke="var(--primary-500)"
            strokeWidth="0.6"
            strokeOpacity="0.15"
            strokeDasharray="3,4"
          />
        ))}

        {/* City dots with pulse animation */}
        {Object.entries(CITY_POSITIONS).map(([city, pos]) => {
          const trucks = getCityTrucksCount(city);
          const size = Math.max(3, Math.min(8, trucks / 12000));
          const isHovered = hoveredCity === city;
          return (
            <g
              key={city}
              onMouseEnter={(e) => {
                setHoveredCity(city);
                setTooltipPos({ x: pos.x, y: pos.y });
              }}
              onMouseLeave={() => setHoveredCity(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Outer pulse ring */}
              <circle cx={pos.x} cy={pos.y} r={size + 6} fill="var(--primary-500)" opacity="0.08">
                <animate attributeName="r" values={`${size + 4};${size + 12};${size + 4}`} dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.12;0.02;0.12" dur="3s" repeatCount="indefinite" />
              </circle>
              {/* Inner pulse */}
              <circle cx={pos.x} cy={pos.y} r={size + 2} fill="var(--primary-400)" opacity="0.15">
                <animate attributeName="r" values={`${size + 2};${size + 7};${size + 2}`} dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2.5s" repeatCount="indefinite" />
              </circle>
              {/* Core dot */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? size + 1 : size}
                fill="var(--primary-400)"
                filter={isHovered ? 'url(#glow)' : undefined}
                style={{ transition: 'r 0.2s ease' }}
              />
              {/* City label */}
              <text
                x={pos.x}
                y={pos.y - size - 6}
                textAnchor="middle"
                fill="var(--text-secondary)"
                fontSize="8"
                fontFamily="var(--font-sans)"
                fontWeight="500"
              >
                {city}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredCity && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              left: `${(tooltipPos.x / 400) * 100}%`,
              top: `${(tooltipPos.y / 420) * 100 - 12}%`,
              transform: 'translate(-50%, -100%)',
              background: 'var(--bg-700)',
              border: '1px solid var(--surface-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 12px',
              pointerEvents: 'none',
              zIndex: 20,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
              {hoveredCity}
            </div>
            <div style={{ fontSize: 10, color: 'var(--primary-400)', fontWeight: 500 }}>
              <Truck size={10} style={{ marginRight: 3, verticalAlign: 'middle' }} />
              {getCityTrucksCount(hoveredCity).toLocaleString('en-IN')} trucks
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---- KPI CARD COMPONENT ----
const formatKPIValue = (value, format) => {
  switch (format) {
    case 'currency': return `₹${(value / 1000000).toFixed(1)}M`;
    case 'percent': return `${value.toFixed(1)}%`;
    case 'number': return value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value.toLocaleString('en-IN');
    case 'kmpl': return `${value.toFixed(1)} km/L`;
    case 'growth': return `+${value.toFixed(1)}%`;
    default: return value;
  }
};

const KPICard = ({ config, index }) => {
  const animatedVal = useAnimatedValue(config.value, 1400 + index * 100);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, scale: 1.015 }}
      style={styles.kpiCard}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div
          style={{
            ...styles.kpiIconBox,
            background: config.gradient,
          }}
        >
          <Icon size={18} color="#fff" strokeWidth={2} />
        </div>
        <Sparkline data={config.sparkData} color={config.sparkColor} />
      </div>
      <div style={{ marginTop: 14 }}>
        <div style={styles.kpiValue}>
          {formatKPIValue(animatedVal, config.format)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={styles.kpiLabel}>{config.label}</span>
          <span
            style={{
              ...styles.kpiTrend,
              color: config.trendUp ? 'var(--success-500)' : 'var(--danger-500)',
            }}
          >
            {config.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {config.trend}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ---- SECTION HEADER ----
const SectionHeader = ({ icon: Icon, title, subtitle, action }) => (
  <div style={styles.sectionHeader}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {Icon && <Icon size={16} color="var(--primary-400)" />}
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{subtitle}</div>}
      </div>
    </div>
    {action && action}
  </div>
);

// ---- REVENUE CHART ----
const RevenueChart = () => {
  const [period, setPeriod] = useState('daily');
  const chartRef = useRef(null);

  const chartData = useMemo(() => {
    const data = revenueChartData[period];
    return {
      labels: data.labels,
      datasets: [
        {
          label: period === 'daily' ? 'Revenue (₹M)' : period === 'weekly' ? 'Revenue (₹Cr)' : 'Revenue (₹Cr)',
          data: data.values,
          borderColor: '#6366f1',
          backgroundColor: (ctx) => {
            if (!ctx.chart.chartArea) return 'rgba(99, 102, 241, 0.1)';
            const gradient = ctx.chart.ctx.createLinearGradient(
              0, ctx.chart.chartArea.top, 0, ctx.chart.chartArea.bottom
            );
            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
            gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.08)');
            gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
            return gradient;
          },
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#6366f1',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
        },
      ],
    };
  }, [period]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(10, 14, 26, 0.92)',
        titleColor: '#e0e0e0',
        bodyColor: '#b0b0b0',
        borderColor: 'rgba(99, 102, 241, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: { size: 12, weight: '600', family: 'Inter' },
        bodyFont: { size: 11, family: 'Inter' },
        callbacks: {
          label: (ctx) => {
            const prefix = period === 'daily' ? '₹' : '₹';
            const suffix = period === 'daily' ? 'M' : 'Cr';
            return ` Revenue: ${prefix}${ctx.raw}${suffix}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(99, 102, 241, 0.06)', drawBorder: false },
        ticks: {
          color: 'var(--text-muted)',
          font: { size: 10, family: 'Inter' },
          maxTicksLimit: period === 'daily' ? 10 : undefined,
        },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(99, 102, 241, 0.06)', drawBorder: false },
        ticks: {
          color: 'var(--text-muted)',
          font: { size: 10, family: 'Inter' },
          callback: (v) => period === 'daily' ? `₹${v}M` : `₹${v}Cr`,
        },
        border: { display: false },
      },
    },
  }), [period]);

  const periods = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      style={{ ...styles.card, gridColumn: 'span 8' }}
    >
      <SectionHeader
        icon={BarChart3}
        title="Revenue Overview"
        subtitle="Platform-wide revenue performance"
        action={
          <div style={styles.toggleGroup}>
            {periods.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                style={{
                  ...styles.toggleBtn,
                  ...(period === p.key ? styles.toggleBtnActive : {}),
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        }
      />
      <div style={{ height: 280, marginTop: 16 }}>
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </div>
    </motion.div>
  );
};

// ---- AI INSIGHTS PANEL ----
const insightIcons = {
  revenue: TrendingUp,
  efficiency: Fuel,
  churn: ShieldAlert,
  maintenance: AlertTriangle,
  route: MapPin,
};

const insightColors = {
  revenue: '#38CE3C',
  efficiency: '#3b82f6',
  churn: '#FF4D6B',
  maintenance: '#f59e0b',
  route: '#8b5cf6',
};

const AIInsightsPanel = ({ insights, onAction }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.55 }}
    style={{ ...styles.card, gridColumn: 'span 4', display: 'flex', flexDirection: 'column' }}
  >
    <SectionHeader
      icon={Brain}
      title="AI Insights"
      subtitle="Copilot recommendations"
      action={
        <div style={{ ...styles.badge, background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary-400)' }}>
          <Sparkles size={10} /> {insights.length} New
        </div>
      }
    />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12, overflow: 'auto' }}>
      {insights.slice(0, 4).map((insight, i) => {
        const Icon = insightIcons[insight.type] || Lightbulb;
        const color = insightColors[insight.type] || '#6366f1';
        return (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.08 }}
            whileHover={{ x: 3 }}
            style={styles.insightCard}
          >
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div
                style={{
                  minWidth: 30,
                  height: 30,
                  borderRadius: 'var(--radius-sm)',
                  background: `${color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={14} color={color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                    {insight.title}
                  </div>
                  <button
                    onClick={() => {
                      const caseMap = { revenue: 1, efficiency: 1, churn: 5, route: 3, maintenance: 6 };
                      onAction(caseMap[insight.type] || 1);
                    }}
                    style={styles.insightActionLink}
                  >
                    Optimize
                  </button>
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {insight.summary}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 600, padding: '2px 6px',
                    borderRadius: 4, background: `${color}18`, color,
                  }}>
                    {insight.confidence}% confidence
                  </span>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>
                    {insight.impact}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  </motion.div>
);

// ---- TOP ROUTES TABLE ----
const TopRoutes = ({ routes }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.65 }}
    style={{ ...styles.card, gridColumn: 'span 6', overflow: 'hidden' }}
  >
    <SectionHeader
      icon={MapPin}
      title="Top Routes"
      subtitle="Most popular freight corridors"
      action={
        <button style={styles.viewAllBtn}>
          View All <ChevronRight size={12} />
        </button>
      }
    />
    <div style={{ overflowX: 'auto', marginTop: 12 }}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Route</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>Distance</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>Trips</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>Revenue</th>
            <th style={styles.th}>Efficiency</th>
          </tr>
        </thead>
        <tbody>
          {routes.slice(0, 8).map((route, i) => (
            <motion.tr
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.04 }}
              style={styles.tr}
            >
              <td style={styles.td}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: route.efficiency >= 95 ? 'var(--success-500)' :
                                route.efficiency >= 90 ? 'var(--primary-400)' :
                                route.efficiency >= 85 ? 'var(--warning-500)' : 'var(--danger-500)',
                  }} />
                  <span style={{ fontWeight: 500, fontSize: 12 }}>
                    {route.from}
                  </span>
                  <ChevronRight size={10} color="var(--text-muted)" />
                  <span style={{ fontWeight: 500, fontSize: 12 }}>
                    {route.to}
                  </span>
                </div>
              </td>
              <td style={{ ...styles.td, textAlign: 'right', fontSize: 12 }}>
                {route.distance.toLocaleString('en-IN')} km
              </td>
              <td style={{ ...styles.td, textAlign: 'right', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                {route.trips.toLocaleString('en-IN')}
              </td>
              <td style={{ ...styles.td, textAlign: 'right', fontSize: 12, fontWeight: 600, color: 'var(--success-500)' }}>
                {formatCurrency(route.revenue)}
              </td>
              <td style={styles.td}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={styles.progressBarBg}>
                    <div
                      style={{
                        ...styles.progressBarFill,
                        width: `${route.efficiency}%`,
                        transition: 'width 0.6s ease',
                        background: route.efficiency >= 95
                          ? 'linear-gradient(90deg, #38CE3C, #10b981)'
                          : route.efficiency >= 90
                            ? 'linear-gradient(90deg, #6366f1, #818cf8)'
                            : route.efficiency >= 85
                              ? 'linear-gradient(90deg, #f59e0b, #FFDE73)'
                              : 'linear-gradient(90deg, #FF4D6B, #f43f5e)',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)', minWidth: 28, textAlign: 'right' }}>
                    {route.efficiency}%
                  </span>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

// ---- INDIA MAP SECTION ----
const FleetMapSection = ({ dispatched }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.6 }}
    style={{ ...styles.card, gridColumn: 'span 6' }}
  >
    <SectionHeader
      icon={MapPin}
      title="Fleet Distribution"
      subtitle="Active truck clusters across India"
      action={
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success-500)' }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%', background: 'var(--success-500)',
              animation: 'pulse 2s infinite',
            }} />
          </div>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Live</span>
        </div>
      }
    />
    <IndiaMap dispatched={dispatched} />
  </motion.div>
);

// ---- REVENUE STREAMS CHART ----
const RevenueStreamsChart = () => {
  const sortedStreams = useMemo(() =>
    [...revenueStreams].sort((a, b) => b.value - a.value),
    []
  );
  const maxVal = sortedStreams[0]?.value || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.75 }}
      style={{ ...styles.card, gridColumn: 'span 8' }}
    >
      <SectionHeader
        icon={BarChart3}
        title="Revenue Streams"
        subtitle={`${revenueStreams.length} product verticals`}
        action={
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Total: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              {formatCurrency(revenueStreams.reduce((sum, s) => sum + s.value, 0))}
            </span>
          </div>
        }
      />
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sortedStreams.map((stream, i) => (
          <motion.div
            key={stream.name}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.04 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <div style={{
              width: 140, fontSize: 11, color: 'var(--text-secondary)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              flexShrink: 0,
            }}>
              {stream.name}
            </div>
            <div style={{ flex: 1, position: 'relative', height: 22, borderRadius: 4, background: 'var(--bg-600)', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stream.value / maxVal) * 100}%` }}
                transition={{ duration: 0.9, delay: 0.85 + i * 0.05 }}
                style={{
                  height: '100%',
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${stream.color}cc, ${stream.color})`,
                  position: 'relative',
                }}
              />
            </div>
            <div style={{ width: 65, fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
              {formatCurrency(stream.value)}
            </div>
            <div style={{
              width: 50, fontSize: 10, fontWeight: 600, textAlign: 'right', flexShrink: 0,
              color: stream.growth >= 30 ? 'var(--success-500)' : stream.growth >= 15 ? 'var(--primary-400)' : 'var(--text-secondary)',
            }}>
              +{stream.growth}%
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ---- ALERTS FEED ----
const alertTypeColors = {
  danger: 'var(--danger-500)',
  warning: 'var(--warning-500)',
  success: 'var(--success-500)',
  info: 'var(--info-500)',
};

const AlertsFeed = ({ alerts, onResolveClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.85 }}
      style={{ ...styles.card, gridColumn: 'span 4', display: 'flex', flexDirection: 'column' }}
    >
      <SectionHeader
        icon={AlertTriangle}
        title="Operational Alerts"
        subtitle="Real-time fleet notifications"
        action={
          <div style={{ ...styles.badge, background: 'rgba(255, 77, 107, 0.15)', color: 'var(--danger-500)' }}>
            {alerts.filter(a => a.type === 'danger').length} Critical
          </div>
        }
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, marginTop: 10 }}>
        {alerts.slice(0, 5).map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + i * 0.06 }}
            whileHover={{ backgroundColor: 'var(--bg-600)' }}
            style={styles.alertItem}
          >
            <div style={{
              minWidth: 8, height: 8, borderRadius: '50%',
              background: alertTypeColors[alert.type],
              boxShadow: `0 0 8px ${alertTypeColors[alert.type]}60`,
              marginTop: 4,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 2,
              }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {alert.title}
                </span>
                {(alert.title.includes('Breakdown') || alert.title.includes('FASTag') || alert.title.includes('Temperature') || alert.title.includes('Fatigue')) && alert.type !== 'success' ? (
                  <button
                    onClick={() => {
                      const alertCaseMap = {
                        'Breakdown': 6,
                        'Temperature': 6,
                        'FASTag': 7,
                        'Fatigue': 4
                      };
                      const key = Object.keys(alertCaseMap).find(k => alert.title.includes(k) || alert.message.includes(k));
                      onResolveClick(alertCaseMap[key] || 7);
                    }}
                    style={styles.alertResolveBtn}
                  >
                    Resolve
                  </button>
                ) : null}
              </div>
              <div style={{
                fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.4,
                overflow: 'hidden', textOverflow: 'ellipsis',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
              }}>
                {alert.message}
              </div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 3, opacity: 0.7 }}>
                {alert.time}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ---- MAIN DASHBOARD ----
const Dashboard = () => {
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  // --- Tabs Configuration ---
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = [
    { id: 'overview', label: 'Executive Overview', icon: BarChart3 },
    { id: 'cockpit', label: 'AI Strategic Cockpit', icon: Brain },
    { id: 'insights', label: 'AI Insights Directory', icon: Lightbulb },
    { id: 'alerts', label: 'Operational Alerts Feed', icon: AlertTriangle },
  ];

  // --- Stateful variables for platform metrics ---
  const [kpis, setKpis] = useState({
    revenueToday: platformKPIs.revenue.today,
    fleetUtilization: platformKPIs.fleetUtilization,
    onTimeDelivery: platformKPIs.onTimeDelivery,
    activeTrucks: platformKPIs.activeTrucks,
    fuelEfficiency: platformKPIs.fuelEfficiency,
    customerGrowth: platformKPIs.customerGrowth,
  });

  const [insights, setInsights] = useState(aiInsights);
  const [alerts, setAlerts] = useState(() => generateAlerts().slice(0, 5));
  const [routes, setRoutes] = useState(popularRoutes);

  // --- Autonomy states ---
  const [isAutonomyEnabled, setIsAutonomyEnabled] = useState(false);
  const [autonomyLogs, setAutonomyLogs] = useState([
    "[11:04 AM] AI Finance Agent verified GST ledger compliance.",
    "[11:42 AM] HR Agent synchronized attendance roster patterns."
  ]);
  const [toasts, setToasts] = useState([]);

  // --- Specific control values ---
  const [fastagBalance, setFastagBalance] = useState(8500);
  const [apiGatewaysCount, setApiGatewaysCount] = useState(3);
  const [apiGatewayLoad, setApiGatewayLoad] = useState(94);

  const consoleRef = useRef(null);
  const selectedCaseRef = useRef(null);
  const [activeCaseId, setActiveCaseId] = useState(null);

  // --- Cases Array ---
  const [cases, setCases] = useState([
    {
      id: 1,
      title: 'Fuel Price Spike Mitigation',
      department: 'Finance & Supply Chain',
      status: 'pending',
      confidence: 94,
      description: 'Diesel prices jumped +8.3%. Projecting a ₹2.4Cr monthly margin reduction across contracts.',
      recommendation: 'Finance Agent suggests applying an automatic 3.8% fuel surcharge; Supply Chain Agent suggests shifting 40% cargo to rail multimodal corridors.',
      icon: Fuel,
      color: '#6366f1',
    },
    {
      id: 2,
      title: 'JNPT Port Cargo Backlog',
      department: 'Supply Chain',
      status: 'pending',
      confidence: 88,
      description: 'Container dwell time has increased by 48h at JNPT Terminal. 12 VIP accounts affected.',
      recommendation: 'Supply Chain Agent suggests matching idle trucks from Ahmedabad and auto-dispatching 8 standby units.',
      icon: Truck,
      color: '#38CE3C',
    },
    {
      id: 3,
      title: 'Route Corridor Underperformance',
      department: 'Supply Chain',
      status: 'pending',
      confidence: 86,
      description: 'Kolkata→Guwahati corridor efficiency drops to 79% due to NH-27 driver fatigue delays.',
      recommendation: 'Supply Chain Agent suggests pivoting to a hub-and-spoke relay model with a dedicated driver rest-hub at Siliguri.',
      icon: MapPin,
      color: '#8b5cf6',
    },
    {
      id: 4,
      title: 'Driver Safety Incentives',
      department: 'HR & Safety Academy',
      status: 'pending',
      confidence: 95,
      description: '18 high-performing drivers maintained Safety scores > 95 for 30 consecutive days.',
      recommendation: 'HR Agent suggests auto-disbursing ₹5,000 monthly safety bonuses to promote driver retention and fuel thrift.',
      icon: Users,
      color: '#ec4899',
    },
    {
      id: 5,
      title: 'VIP Retention: Tata Motors Churn Risk',
      department: 'Sales & CRM',
      status: 'pending',
      confidence: 92,
      description: 'VIP Account Tata Motors Logistics shows a 78% churn risk due to booking volumes dropping by 24%.',
      recommendation: 'Sales Agent recommends escalating to a CEO relationship call and offering a temporary 15% dedicated lane rebate.',
      icon: ShieldAlert,
      color: '#f59e0b',
    },
    {
      id: 6,
      title: 'Engine Thermal Warning (Nagpur)',
      department: 'Operations & Engineering',
      status: 'pending',
      confidence: 91,
      description: 'Vehicle TRK-00312 reports engine temperature critical at 108°C on Nagpur bypass NH-44.',
      recommendation: 'Engineering Agent recommends rerouting vehicle to the nearest Nagpur depot immediately and notifying the crew.',
      icon: AlertTriangle,
      color: '#f97316',
    },
    {
      id: 7,
      title: 'FASTag Balance Depletion',
      department: 'ERP Compliance',
      status: 'pending',
      confidence: 98,
      description: 'Total toll gateway balances fall to ₹8,500, breaching the regulatory safety threshold of ₹11,000.',
      recommendation: 'ERP Agent recommends auto-recharging ₹15,000 instantly to prevent vehicle stops at toll plazas.',
      icon: CreditCard,
      color: '#06b6d4',
    },
    {
      id: 8,
      title: 'E-Way Bill Validity Expiry',
      department: 'ERP Compliance',
      status: 'pending',
      confidence: 96,
      description: 'E-way bill EWB-88491 expiring in 2 hours for in-transit load SHP-99238.',
      recommendation: 'Compliance Agent recommends executing a 24h validity extension statefully and notifying the compliance desk.',
      icon: FileText,
      color: '#10b981',
    },
    {
      id: 9,
      title: 'DevOps Health: Tracking Latency',
      department: 'AI Systems & Infrastructure',
      status: 'pending',
      confidence: 97,
      description: 'API tracking gateways under heavy load (94% CPU). Telemetry package latency rising.',
      recommendation: 'Engineering DevOps Agent recommends auto-scaling API gateway container instances from 3 to 6.',
      icon: Server,
      color: '#a78bfa',
    },
    {
      id: 10,
      title: 'AI Confidence Policy & Autonomy',
      department: 'Executive Agent Configuration',
      status: 'pending',
      confidence: 99,
      description: 'Autonomy rules can be authorized. System is ready to auto-execute decisions with confidence scores > 90%.',
      recommendation: 'Enable autonomous mode to automate recurring operations under safety limits.',
      icon: Brain,
      color: '#3b82f6',
    }
  ]);

  // --- Helper to trigger a toast notification ---
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // --- Scroll triggers ---
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [autonomyLogs]);

  useEffect(() => {
    if (activeCaseId && selectedCaseRef.current) {
      selectedCaseRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeCaseId, activeTab]);

  // --- Resolve Case Logic ---
  const resolveCase = (caseId, isAuto = false) => {
    let alreadyResolved = false;
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        if (c.status === 'resolved') alreadyResolved = true;
        return { ...c, status: 'resolved' };
      }
      return c;
    }));

    if (alreadyResolved) return;

    const logPrefix = `[${new Date().toLocaleTimeString('en-IN', { hour12: false })}] ${isAuto ? 'AUTO-EXECUTE' : 'CEO-APPROVED'}:`;

    switch(caseId) {
      case 1: // Fuel Price Spike
        setKpis(prev => ({
          ...prev,
          revenueToday: prev.revenueToday + 2400000,
          fuelEfficiency: 5.2
        }));
        setAutonomyLogs(prev => [...prev, `${logPrefix} Fuel surcharge applied (+3.8% tariff, +₹24L/day) & multimodal rail shift activated (fuel efficiency 5.2 km/L).`]);
        showToast("Fuel surcharge applied & Rail pivot active", "success");
        break;
      case 2: // JNPT Port Backlog
        setKpis(prev => ({
          ...prev,
          fleetUtilization: 89.8,
          activeTrucks: prev.activeTrucks + 8
        }));
        setAlerts(prev => prev.map(a => a.id === 7 || a.title.includes('Traffic') || a.title.includes('Congestion') ? {
          ...a,
          type: 'success',
          title: 'Congestion Cleared',
          message: 'RESOLVED: Idle trucks matched & dispatched. Backlog cleared.',
          time: 'Just now'
        } : a));
        setAutonomyLogs(prev => [...prev, `${logPrefix} Dispatched 8 idle trucks to JNPT port backlog. Fleet utilization now 89.8%.`]);
        showToast("JNPT Port Backlog: 8 idle trucks dispatched", "success");
        break;
      case 3: // Route optimization (Kolkata-Guwahati)
        setRoutes(prev => prev.map(r => r.from === 'Kolkata' && r.to === 'Guwahati' ? { ...r, efficiency: 96 } : r));
        setKpis(prev => ({
          ...prev,
          onTimeDelivery: 95.1
        }));
        setAutonomyLogs(prev => [...prev, `${logPrefix} Siliguri relay model deployed. Kolkata→Guwahati route efficiency rose to 96%.`]);
        showToast("Siliguri Relay: Kolkata→Guwahati optimized to 96%", "success");
        break;
      case 4: // Driver Safety Bonuses
        setAutonomyLogs(prev => [...prev, `${logPrefix} Disbursed ₹5,000 safety bonuses to 18 eligible drivers. Total: ₹90,000 ledger post.`]);
        setAlerts(prev => prev.map(a => a.title.includes('Fatigue') ? {
          ...a,
          type: 'success',
          title: 'Rest Logged & Bonus Issued',
          message: 'RESOLVED: Safety bonus posted, fatigue warning cleared.',
          time: 'Just now'
        } : a));
        showToast("₹5,000 safety bonuses dispatched to 18 drivers", "success");
        break;
      case 5: // Churn Risk (Tata Motors)
        setKpis(prev => ({
          ...prev,
          customerGrowth: prev.customerGrowth + 1.5
        }));
        setInsights(prev => prev.map(i => i.type === 'churn' ? {
          ...i,
          confidence: 99,
          summary: 'RESOLVED: Churn risk mitigated via CEO Call and 15% dedicated lane rebate.',
          impact: '₹3.8Cr CLV secured'
        } : i));
        setAutonomyLogs(prev => [...prev, `${logPrefix} Scheduled CEO relationship call with Tata Motors. Offered 15% lane rebate. Churn risk reduced.`]);
        showToast("Tata Motors churn threat mitigated. CEO call booked.", "success");
        break;
      case 6: // Nagpur Engine Temperature
        setAlerts(prev => prev.map(a => a.title.includes('Breakdown') || a.message.includes('Nagpur') || a.title.includes('Temperature') ? {
          ...a,
          type: 'success',
          title: 'Vehicle Safely Parked',
          message: 'RESOLVED: TRK-00312 engine thermal warning cleared. Vehicle parked at Nagpur depot.',
          time: 'Just now'
        } : a));
        setAutonomyLogs(prev => [...prev, `${logPrefix} Rerouted TRK-00312 to nearest Nagpur warehouse depot. Maintenance alert created.`]);
        showToast("TRK-00312 rerouted to Nagpur depot", "success");
        break;
      case 7: // FASTag Recharge
        setFastagBalance(23500);
        setAlerts(prev => prev.map(a => a.title.includes('FASTag') || a.message.includes('FASTag') ? {
          ...a,
          type: 'success',
          title: 'FASTag Balance Restored',
          message: 'RESOLVED: recharged ₹15,000. Account balance: ₹23,500.',
          time: 'Just now'
        } : a));
        setAutonomyLogs(prev => [...prev, `${logPrefix} FASTag gateway account recharged with ₹15,000. Current Balance: ₹23,500.`]);
        showToast("FASTag balance auto-recharged to ₹23,500", "success");
        break;
      case 8: // E-Way Bill extension
        setAutonomyLogs(prev => [...prev, `${logPrefix} E-Way bill validity auto-extended by 24h. Validity matching rate is 99.4%.`]);
        showToast("E-way bill validity extended for 24h", "success");
        break;
      case 9: // API Gateway load
        setApiGatewaysCount(6);
        setApiGatewayLoad(45);
        setAutonomyLogs(prev => [...prev, `${logPrefix} Scaled API tracking gateways to 6 instances. Load stabilized to 45% CPU.`]);
        showToast("API tracking gateway auto-scaled to 6 instances", "success");
        break;
      case 10: // AI Autonomy Toggle
        setIsAutonomyEnabled(true);
        setAutonomyLogs(prev => [...prev, `${logPrefix} Autonomous operations policy authorized. Executing decisions > 90% confidence.`]);
        showToast("AI Autonomy policy authorized successfully", "success");
        break;
      default:
        break;
    }
  };

  // --- Auto-execution loop when Autonomy is enabled ---
  useEffect(() => {
    if (isAutonomyEnabled) {
      let delay = 600;
      cases.forEach((c) => {
        if (c.status === 'pending' && c.confidence >= 90) {
          setTimeout(() => {
            resolveCase(c.id, true);
          }, delay);
          delay += 1200;
        }
      });
    }
  }, [isAutonomyEnabled]);

  // --- Dynamic KPI configuration creation ---
  const kpiConfigs = useMemo(() => [
    {
      label: 'Revenue Today',
      value: kpis.revenueToday,
      format: 'currency',
      trend: platformKPIs.revenue.growth,
      trendUp: true,
      icon: IndianRupee,
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      sparkData: [38.2, 41.5, 39.8, 42.1, 40.3, 43.7, 45.2, 42.8, 46.3, 42.9],
      sparkColor: '#818cf8',
    },
    {
      label: 'Fleet Utilization',
      value: kpis.fleetUtilization,
      format: 'percent',
      trend: 2.1,
      trendUp: true,
      icon: Gauge,
      gradient: 'linear-gradient(135deg, #38CE3C, #10b981)',
      sparkData: [82, 84, 85, 83, 86, 87, 88, 87.4],
      sparkColor: '#38CE3C',
    },
    {
      label: 'On-Time Delivery',
      value: kpis.onTimeDelivery,
      format: 'percent',
      trend: 1.8,
      trendUp: true,
      icon: Clock,
      gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
      sparkData: [91, 92, 93, 92.5, 93, 94, 94.5, 94.2],
      sparkColor: '#3b82f6',
    },
    {
      label: 'Active Trucks',
      value: kpis.activeTrucks,
      format: 'number',
      trend: 3.4,
      trendUp: true,
      icon: Truck,
      gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
      sparkData: [450, 458, 462, 470, 475, 480, 485, 487.6],
      sparkColor: '#f59e0b',
    },
    {
      label: 'Fuel Efficiency',
      value: kpis.fuelEfficiency,
      format: 'kmpl',
      trend: 4.3,
      trendUp: true,
      icon: Fuel,
      gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
      sparkData: [4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.8],
      sparkColor: '#ec4899',
    },
    {
      label: 'Customer Growth',
      value: kpis.customerGrowth,
      format: 'growth',
      trend: 12.6,
      trendUp: true,
      icon: Users,
      gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
      sparkData: [6.2, 7.1, 8.4, 9.2, 10.1, 11.0, 11.8, 12.6],
      sparkColor: '#a78bfa',
    },
  ], [kpis]);

  const hasPendingBacklog = cases.find(c => c.id === 2)?.status === 'pending';
  const dispatchedActive = !hasPendingBacklog;

  // --- Inline action trigger ---
  const handleInlineActionTrigger = (caseId) => {
    setActiveCaseId(caseId);
    setActiveTab('cockpit');
  };

  return (
    <div style={styles.dashboardRoot}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={styles.pageHeader}
      >
        <div>
          <h1 style={styles.pageTitle}>
            {greeting}, <span style={{ color: 'var(--primary-400)' }}>Commander</span>
          </h1>
          <p style={styles.pageSubtitle}>
            Your fleet intelligence dashboard — {now.toLocaleDateString('en-IN', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Quick-Jump to Strategic Cockpit */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab('cockpit')}
            style={{
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--primary-400)',
              padding: '6px 14px',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'var(--font-sans)',
            }}
          >
            <Brain size={12} />
            Strategic Cockpit
          </motion.button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'flex' }}
            >
              <RefreshCw size={12} color="var(--success-500)" />
            </motion.div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Live</span>
            <div style={{
              width: 7, height: 7, borderRadius: '50%', background: 'var(--success-500)',
              boxShadow: '0 0 8px var(--success-500)',
            }} />
          </div>
        </div>
      </motion.div>

      {/* Tabs Menu Bar */}
      <div style={styles.tabsBar}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isCockpit = tab.id === 'cockpit';
          const alertCount = cases.filter(c => c.status === 'pending').length;
          return (
            <motion.button
              key={tab.id}
              style={styles.tab(activeTab === tab.id)}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={14} />
              {tab.label}
              {isCockpit && alertCount > 0 && (
                <span style={styles.tabBadge}>{alertCount}</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Dynamic Tab Contents */}
      {activeTab === 'overview' && (
        <div style={styles.bentoGrid}>
          {/* Row 1: KPI Strip */}
          {kpiConfigs.map((config, i) => (
            <div key={config.label} style={{ gridColumn: 'span 2' }}>
              <KPICard config={config} index={i} />
            </div>
          ))}

          {/* Row 2: Revenue Chart + AI Insights */}
          <RevenueChart />
          <AIInsightsPanel insights={insights} onAction={handleInlineActionTrigger} />

          {/* Row 3: Fleet Map + Top Routes */}
          <FleetMapSection dispatched={dispatchedActive} />
          <TopRoutes routes={routes} />

          {/* Row 4: Revenue Streams + Alerts */}
          <RevenueStreamsChart />
          <AlertsFeed alerts={alerts} onResolveClick={handleInlineActionTrigger} />
        </div>
      )}

      {activeTab === 'cockpit' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
          {/* Left panel: Autonomy console & System status indicators */}
          <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Agent Autonomy config panel */}
            <div style={styles.autonomySection}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Zap size={14} color={isAutonomyEnabled ? "var(--success-500)" : "var(--primary-400)"} />
                    Agent Autonomy Mode
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Auto-execute decisions &gt; 90% confidence</div>
                </div>
                <label style={styles.switch}>
                  <input
                    type="checkbox"
                    checked={isAutonomyEnabled}
                    onChange={(e) => setIsAutonomyEnabled(e.target.checked)}
                  />
                  <div style={{
                    ...styles.slider,
                    backgroundColor: isAutonomyEnabled ? 'var(--success-500)' : 'var(--bg-600)',
                  }}>
                    <div style={{
                      ...styles.sliderKnob,
                      transform: isAutonomyEnabled ? 'translateX(18px)' : 'translateX(2px)',
                    }} />
                  </div>
                </label>
              </div>

              {/* Console log window */}
              <div style={styles.consoleContainer}>
                <div style={styles.consoleHeader}>
                  <Terminal size={11} style={{ marginRight: 4 }} />
                  <span>AUTONOMOUS EXECUTION LOG</span>
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: isAutonomyEnabled ? 'var(--success-500)' : 'var(--warning-500)',
                      animation: isAutonomyEnabled ? 'pulse 1.5s infinite' : 'none'
                    }} />
                    {isAutonomyEnabled ? 'ACTIVE' : 'STANDBY'}
                  </span>
                </div>
                <div style={styles.consoleBody} ref={consoleRef}>
                  {autonomyLogs.map((log, idx) => (
                    <div key={idx} style={styles.consoleLine}>{log}</div>
                  ))}
                  {isAutonomyEnabled && (
                    <div style={{ ...styles.consoleLine, color: 'var(--success-400)', opacity: 0.8 }}>
                      &gt; Monitoring operational telemetry...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Real-time system states cards */}
            <div style={styles.card}>
              <SectionHeader icon={Settings} title="Operational Threshold Controls" />
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-muted)' }}>FASTag Balance Gateways</span>
                    <span style={{ color: fastagBalance > 10000 ? 'var(--success-500)' : 'var(--danger-500)', fontWeight: 600 }}>
                      ₹{fastagBalance.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-600)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (fastagBalance / 25000) * 100)}%`, background: fastagBalance > 10000 ? 'var(--success-500)' : 'var(--danger-500)', transition: 'width 0.4s ease' }} />
                  </div>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2, display: 'block' }}>Min safety limit: ₹11,000</span>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-muted)' }}>API Tracking Gateways</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{apiGatewaysCount} nodes active</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Gateway Core Load</span>
                    <span style={{ color: apiGatewayLoad < 50 ? 'var(--success-500)' : 'var(--danger-500)', fontWeight: 600 }}>{apiGatewayLoad}% CPU</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-600)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${apiGatewayLoad}%`, background: apiGatewayLoad < 50 ? 'var(--success-500)' : 'var(--danger-500)', transition: 'width 0.4s ease' }} />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Active Autonomy Confidence Target</span>
                  <span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>&gt; 90%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: 10 Collapsible Strategic Cases */}
          <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cases.map((c) => {
              const CaseIcon = c.icon;
              const isSelected = activeCaseId === c.id;
              return (
                <div
                  key={c.id}
                  ref={isSelected ? selectedCaseRef : null}
                  style={{
                    ...styles.caseCard,
                    borderColor: isSelected ? 'var(--primary-500)' : 'var(--surface-border)',
                    boxShadow: isSelected ? '0 0 15px rgba(99, 102, 241, 0.18)' : 'none',
                    background: isSelected ? 'rgba(30, 41, 59, 0.65)' : 'rgba(30, 41, 59, 0.35)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 6,
                        background: `${c.color}15`, display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                      }}>
                        <CaseIcon size={14} color={c.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>{c.department}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{c.title}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: 'var(--bg-600)', color: 'var(--text-secondary)' }}>
                        Conf: {c.confidence}%
                      </span>
                      {c.status === 'resolved' ? (
                        <span style={{ ...styles.badge, background: 'rgba(56, 206, 60, 0.15)', color: 'var(--success-500)' }}>
                          <CheckCircle size={10} /> Resolved
                        </span>
                      ) : (
                        <span style={{ ...styles.badge, background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning-500)' }}>
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {c.description}
                  </div>

                  <div style={{
                    marginTop: 8, padding: '8px', background: 'var(--bg-800)',
                    borderRadius: 'var(--radius-sm)', borderLeft: `2px solid ${c.color}`
                  }}>
                    <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Brain size={10} color="var(--primary-400)" /> AI Recommendation
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.3 }}>{c.recommendation}</div>
                  </div>

                  {/* State Indicators */}
                  <div style={styles.caseIndicators}>
                    {c.id === 1 && (
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        Surcharge: <span style={{ color: kpis.revenueToday > 42850000 ? 'var(--success-500)' : 'var(--text-primary)', fontWeight: 600 }}>{kpis.revenueToday > 42850000 ? 'APPLIED (+3.8%)' : 'STANDBY'}</span> | Fuel Efficiency: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{kpis.fuelEfficiency} km/L</span>
                      </div>
                    )}
                    {c.id === 2 && (
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        JNPT Dispatch: <span style={{ color: dispatchedActive ? 'var(--success-500)' : 'var(--text-primary)', fontWeight: 600 }}>{dispatchedActive ? 'COMPLETED (+8 Trucks)' : 'STANDBY'}</span>
                      </div>
                    )}
                    {c.id === 3 && (
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        Siliguri Hub: <span style={{ color: routes.find(r => r.from === 'Kolkata' && r.to === 'Guwahati')?.efficiency === 96 ? 'var(--success-500)' : 'var(--text-primary)', fontWeight: 600 }}>{routes.find(r => r.from === 'Kolkata' && r.to === 'Guwahati')?.efficiency === 96 ? 'ACTIVE (96% Efficiency)' : 'INACTIVE (79%)'}</span>
                      </div>
                    )}
                    {c.id === 7 && (
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        FASTag Balance: <span style={{ color: fastagBalance > 10000 ? 'var(--success-500)' : 'var(--danger-500)', fontWeight: 600 }}>₹{fastagBalance.toLocaleString('en-IN')}</span> (Limit: ₹11,000)
                      </div>
                    )}
                    {c.id === 9 && (
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        Instances: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{apiGatewaysCount} active</span> | Telemetry Load: <span style={{ color: apiGatewayLoad < 50 ? 'var(--success-500)' : 'var(--danger-500)', fontWeight: 600 }}>{apiGatewayLoad}% CPU</span>
                      </div>
                    )}
                  </div>

                  {/* Manual trigger button */}
                  {c.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      {c.id === 1 && (
                        <>
                          <button onClick={() => resolveCase(1)} style={styles.actionBtnPrimary}>
                            <Zap size={11} style={{ marginRight: 4 }} /> Apply Surcharge
                          </button>
                          <button onClick={() => resolveCase(1)} style={styles.actionBtnSecondary}>
                            Shift to Rail
                          </button>
                        </>
                      )}
                      {c.id === 2 && (
                        <button onClick={() => resolveCase(2)} style={styles.actionBtnPrimary}>
                          <Truck size={11} style={{ marginRight: 4 }} /> Match & Auto-Dispatch
                        </button>
                      )}
                      {c.id === 3 && (
                        <button onClick={() => resolveCase(3)} style={styles.actionBtnPrimary}>
                          <MapPin size={11} style={{ marginRight: 4 }} /> Siliguri Relay Pivot
                        </button>
                      )}
                      {c.id === 4 && (
                        <button onClick={() => resolveCase(4)} style={styles.actionBtnPrimary}>
                          <IndianRupee size={11} style={{ marginRight: 4 }} /> Disburse Payouts
                        </button>
                      )}
                      {c.id === 5 && (
                        <button onClick={() => resolveCase(5)} style={styles.actionBtnPrimary}>
                          <Users size={11} style={{ marginRight: 4 }} /> CEO Escalation
                        </button>
                      )}
                      {c.id === 6 && (
                        <button onClick={() => resolveCase(6)} style={styles.actionBtnPrimary}>
                          <Activity size={11} style={{ marginRight: 4 }} /> Reroute TRK-00312
                        </button>
                      )}
                      {c.id === 7 && (
                        <button onClick={() => resolveCase(7)} style={styles.actionBtnPrimary}>
                          <CreditCard size={11} style={{ marginRight: 4 }} /> Recharge ₹15,000
                        </button>
                      )}
                      {c.id === 8 && (
                        <button onClick={() => resolveCase(8)} style={styles.actionBtnPrimary}>
                          <FileText size={11} style={{ marginRight: 4 }} /> Extend 24h
                        </button>
                      )}
                      {c.id === 9 && (
                        <button onClick={() => resolveCase(9)} style={styles.actionBtnPrimary}>
                          <Server size={11} style={{ marginRight: 4 }} /> Scale to 6 Nodes
                        </button>
                      )}
                      {c.id === 10 && (
                        <button onClick={() => resolveCase(10)} style={styles.actionBtnPrimary}>
                          <Brain size={11} style={{ marginRight: 4 }} /> Enable Autonomy Policy
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {insights.map((insight) => {
            const Icon = insightIcons[insight.type] || Lightbulb;
            const color = insightColors[insight.type] || '#6366f1';
            return (
              <div key={insight.id} style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-md)',
                    background: `${color}18`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon size={18} color={color} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-600)', color: 'var(--text-secondary)' }}>
                    {insight.confidence}% confidence
                  </span>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary)' }}>{insight.title}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 12px', minHeight: 48 }}>{insight.summary}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--success-500)' }}>{insight.impact}</span>
                  <button
                    onClick={() => {
                      const caseMap = { revenue: 1, efficiency: 1, churn: 5, route: 3, maintenance: 6 };
                      handleInlineActionTrigger(caseMap[insight.type] || 1);
                    }}
                    style={styles.actionBtnPrimary}
                  >
                    Optimize <ChevronRight size={10} style={{ marginLeft: 2 }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {generateAlerts().map((alert) => (
            <div key={alert.id} style={{ ...styles.card, display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: alertTypeColors[alert.type] || 'var(--info-500)',
                boxShadow: `0 0 10px ${alertTypeColors[alert.type]}80`,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{alert.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{alert.message}</div>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{alert.time}</div>
              <button
                onClick={() => {
                  const alertCaseMap = { 'Breakdown': 6, 'Temperature': 6, 'FASTag': 7, 'Fatigue': 4 };
                  const key = Object.keys(alertCaseMap).find(k => alert.title.includes(k) || alert.message.includes(k));
                  handleInlineActionTrigger(alertCaseMap[key] || 7);
                }}
                style={{ ...styles.actionBtnSecondary, flex: 'none', padding: '6px 14px' }}
              >
                Resolve Anomaly
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Toast notifications */}
      <div style={styles.toastContainer}>
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
              style={styles.toast}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={13} color="var(--success-500)" />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>{t.message}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pulse animation keyframes injected via style tag */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.8); }
          100% { opacity: 0; transform: scale(2.5); }
        }
      `}</style>
    </div>
  );
};

// ============================================================
// STYLES
// ============================================================
const styles = {
  dashboardRoot: {
    padding: '24px',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text-primary)',
    minHeight: '100vh',
    position: 'relative',
  },

  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  pageTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
  },

  pageSubtitle: {
    margin: '4px 0 0',
    fontSize: 13,
    color: 'var(--text-muted)',
  },

  bentoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: 16,
  },

  card: {
    background: 'var(--surface)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid var(--surface-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },

  kpiCard: {
    background: 'var(--surface)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid var(--surface-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '18px',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    height: '100%',
  },

  kpiIconBox: {
    width: 36,
    height: 36,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },

  kpiValue: {
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
    fontFamily: 'var(--font-sans)',
  },

  kpiLabel: {
    fontSize: 11,
    color: 'var(--text-muted)',
    fontWeight: 500,
  },

  kpiTrend: {
    fontSize: 11,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },

  toggleGroup: {
    display: 'flex',
    background: 'var(--bg-600)',
    borderRadius: 'var(--radius-sm)',
    padding: 2,
    gap: 2,
  },

  toggleBtn: {
    padding: '5px 12px',
    fontSize: 11,
    fontWeight: 500,
    border: 'none',
    borderRadius: 4,
    background: 'transparent',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'var(--font-sans)',
  },

  toggleBtnActive: {
    background: 'var(--primary-500)',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
  },

  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 10,
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: 'var(--radius-sm)',
  },

  insightCard: {
    padding: '10px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-800)',
    border: '1px solid var(--surface-border)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  insightActionLink: {
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--primary-400)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: 4,
    transition: 'background 0.15s ease',
  },

  viewAllBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 11,
    fontWeight: 500,
    color: 'var(--primary-400)',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    padding: 0,
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 12,
  },

  th: {
    textAlign: 'left',
    padding: '8px 10px',
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid var(--surface-border)',
    whiteSpace: 'nowrap',
  },

  tr: {
    transition: 'background 0.15s ease',
    cursor: 'pointer',
  },

  td: {
    padding: '10px 10px',
    color: 'var(--text-secondary)',
    borderBottom: '1px solid rgba(99, 102, 241, 0.05)',
    whiteSpace: 'nowrap',
  },

  progressBarBg: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    background: 'var(--bg-600)',
    overflow: 'hidden',
    minWidth: 50,
  },

  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  alertItem: {
    display: 'flex',
    gap: 10,
    padding: '10px 8px',
    borderRadius: 'var(--radius-sm)',
    transition: 'background 0.15s ease',
    cursor: 'pointer',
  },

  alertResolveBtn: {
    fontSize: 9,
    fontWeight: 600,
    color: 'var(--primary-400)',
    background: 'rgba(99, 102, 241, 0.12)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    borderRadius: 4,
    padding: '2px 8px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },

  // --- Tabs Styles ---
  tabsBar: {
    display: 'flex',
    gap: '4px',
    marginBottom: '20px',
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
    padding: '8px 16px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: active ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'transparent',
    color: active ? '#fff' : 'var(--text-secondary)',
    fontSize: '12px',
    fontWeight: active ? '600' : '500',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    fontFamily: 'var(--font-sans)',
    boxShadow: active ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none',
    position: 'relative',
  }),

  tabBadge: {
    background: 'var(--danger-500)',
    color: '#fff',
    fontSize: '9px',
    fontWeight: '700',
    borderRadius: '10px',
    padding: '2px 6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '2px',
  },

  autonomySection: {
    background: 'rgba(9, 13, 22, 0.55)',
    borderRadius: 'var(--radius-lg)',
    padding: '16px',
    border: '1px solid var(--surface-border)',
  },

  switch: {
    position: 'relative',
    display: 'inline-block',
    width: 38,
    height: 20,
    cursor: 'pointer',
  },

  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    transition: 'background-color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
  },

  sliderKnob: {
    height: 16,
    width: 16,
    borderRadius: '50%',
    backgroundColor: '#fff',
    transition: 'transform 0.2s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
  },

  consoleContainer: {
    background: '#040711',
    border: '1px solid #14213d',
    borderRadius: 'var(--radius-sm)',
    overflow: 'hidden',
    marginTop: 10,
    fontFamily: 'var(--font-mono)',
  },

  consoleHeader: {
    background: '#0d1321',
    padding: '6px 10px',
    fontSize: 9,
    fontWeight: 600,
    color: '#818cf8',
    borderBottom: '1px solid #14213d',
    display: 'flex',
    alignItems: 'center',
  },

  consoleBody: {
    padding: '10px',
    height: '110px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },

  consoleLine: {
    fontSize: 9,
    color: '#34d399',
    lineHeight: 1.3,
  },

  caseCard: {
    border: '1px solid var(--surface-border)',
    borderRadius: 'var(--radius-md)',
    padding: '14px',
    transition: 'all 0.2s ease',
  },

  caseIndicators: {
    marginTop: 8,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: 8,
  },

  actionBtnPrimary: {
    padding: '6px 14px',
    fontSize: 10,
    fontWeight: 600,
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--primary-500)',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionBtnSecondary: {
    padding: '6px 14px',
    fontSize: 10,
    fontWeight: 600,
    border: '1px solid var(--surface-border)',
    borderRadius: 'var(--radius-sm)',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  toastContainer: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    zIndex: 9999,
  },

  toast: {
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(56, 206, 60, 0.3)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
};

export default Dashboard;
