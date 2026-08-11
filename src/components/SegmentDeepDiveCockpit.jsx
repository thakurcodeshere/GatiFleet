/* eslint-disable */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Line, Bar, Doughnut
} from 'react-chartjs-2';
import {
  Calendar, MapPin, Filter, Layers, RefreshCw, Download,
  Sparkles, Zap, ShieldAlert, CheckCircle, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Info, Eye, ExternalLink,
  IndianRupee, Gauge, Clock, Truck, Fuel, Users, Cpu, FileText
} from 'lucide-react';

const segmentConfigs = {
  revenueToday: {
    title: 'Revenue Today Analytics & Dynamic Tariff Intelligence',
    metric: '₹42.9M',
    unit: '₹ Millions',
    trend: '+8.3%',
    trendUp: true,
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    featuresTitle: 'Revenue Features & Surcharge Control',
    features: [
      { name: 'Dynamic Fuel Surcharge Optimizer', desc: 'Auto-adjusts tariff contracts based on daily WTI & IndianOil diesel indices.', status: 'Active (Auto-calc)', actionText: 'Re-run Surcharge Engine' },
      { name: 'Freight Dispute Auto-Resolver', desc: 'Cross-checks detention claims with IoT GPS & FASTag toll timestamps.', status: '3 Pending Audits', actionText: 'Audit Disputes' },
      { name: 'Contract Margin Leakage Monitor', desc: 'Flags lanes delivering under the 18.5% minimum gross margin floor.', status: '98.2% Margin Health', actionText: 'View Margin Heatmap' },
      { name: 'Automated Invoice Reconciliation', desc: 'Syncs SAP/Tally ERP cash receipts with double-entry GatiFleet ledger.', status: '100% Synced', actionText: 'Generate Ledger PDF' }
    ]
  },

  fleetUtilization: {
    title: 'Fleet Utilization & Capacity Rebalancing Engine',
    metric: '87.4%',
    unit: 'Utilization %',
    trend: '+2.1%',
    trendUp: true,
    color: '#38CE3C',
    gradient: 'linear-gradient(135deg, #38CE3C, #10b981)',
    featuresTitle: 'Fleet Capacity & Logistics Operations',
    features: [
      { name: 'Corridor Capacity Heatmap', desc: 'Identifies high-density freight corridors and empty return backhauls.', status: 'NH48 at 92.1%', actionText: 'View Corridor Map' },
      { name: 'Standby Asset Auto-Rebalancer', desc: 'Dispatches idle standby trailers to high-demand cross-dock terminals.', status: '14 Units Staged', actionText: 'Trigger Rebalance' },
      { name: 'Depot Turnaround Predictor', desc: 'Monitors loading dock dwell times to enforce 90-minute bay turnaround.', status: 'Avg 64 min Dwell', actionText: 'Inspect Dock Bays' },
      { name: 'Deadhead Kilometer Minimizer', desc: 'Calculates shortest route linkages to limit empty runs below 8%.', status: '5.8% Deadhead', actionText: 'Optimize Backhauls' }
    ]
  },

  onTimeDelivery: {
    title: 'On-Time Delivery (OTD) & Predictive Delay Mitigation',
    metric: '94.2%',
    unit: 'SLA Pass %',
    trend: '+1.8%',
    trendUp: true,
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    featuresTitle: 'Delivery Operations & SLA Risk Controls',
    features: [
      { name: 'Predictive SLA Breach Detector', desc: 'Scans live congestion, weather, and toll queues to forecast ETA deviations.', status: '4 Trips at Risk', actionText: 'Inspect Delayed Trips' },
      { name: 'Autonomous Traffic Rerouter', desc: 'Pushes navigation route updates to driver app around NH48 roadblocks.', status: 'Active (24 Reroutes)', actionText: 'Execute Auto-Reroute' },
      { name: 'Customer ETA Sync Matrix', desc: 'Streams live shipment location and arrival timestamps to customer portals.', status: 'Live Webhook Stream', actionText: 'View Portal Feeds' },
      { name: 'SLA Penalty Prevention Desk', desc: 'Recommends express standby vehicle swaps before contractual penalty trigger.', status: 'Zero Penalty Today', actionText: 'Check Penalty Limits' }
    ]
  },

  activeTrucks: {
    title: 'Active Trucks Uptime & IoT Telemetry Grid',
    metric: '488K',
    unit: 'Active Vehicles',
    trend: '+3.4%',
    trendUp: true,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
    featuresTitle: 'Vehicle Diagnostics & Preventive Maintenance',
    features: [
      { name: 'IoT Telemetry Health Monitor', desc: 'Ingests OBD-II CAN bus pings every 30s across engine, tyres, and brakes.', status: '487,621 Pinging', actionText: 'Inspect Sensor Feeds' },
      { name: 'Remaining Useful Life (RUL) Alert', desc: 'Predicts component failure timelines for brake pads, tyres, and injectors.', status: '12 Service Needed', actionText: 'Schedule Workshop' },
      { name: 'Refrigeration Temperature Guard', desc: 'Maintains cold-chain temperature limits for pharma and perishables.', status: 'All Reefers Normal', actionText: 'Check Reefer Temp' },
      { name: 'Depot Maintenance Dispatcher', desc: 'Reserves service bays and spare parts automatically based on mileage.', status: '18 Bays Reserved', actionText: 'View Depot Worksheets' }
    ]
  },

  fuelEfficiency: {
    title: 'Fuel Efficiency & Carbon Footprint Optimization',
    metric: '4.8 km/L',
    unit: 'km / Litre Average',
    trend: '+4.3%',
    trendUp: true,
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
    featuresTitle: 'Fuel Management & Eco-Driver Rewards',
    features: [
      { name: 'Driver Eco-Scoring Leaderboard', desc: 'Evaluates drivers on harsh acceleration, coasting, and speed control.', status: 'Avg Score 88/100', actionText: 'View Eco Ranking' },
      { name: 'Excess Idling Waste Monitor', desc: 'Alerts operators when engines idle over 15 minutes at rest stops.', status: '142L Saved Today', actionText: 'Inspect Idle Logs' },
      { name: 'Fuel Theft & Discrepancy Detector', desc: 'Compares fuel card tank fills against ultrasonic tank sensor levels.', status: '0 Discrepancies', actionText: 'Run Theft Audit' },
      { name: 'EV vs Diesel Economy Comparator', desc: 'Tracks energy consumption per km for electric freight fleets vs diesel.', status: 'EV 1.8 kWh/km', actionText: 'Compare Fuel Costs' }
    ]
  },

  customerGrowth: {
    title: 'Customer Growth & ACMS Onboarding Intelligence',
    metric: '+12.6%',
    unit: 'Shipper Growth %',
    trend: '+12.6%',
    trendUp: true,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    featuresTitle: 'Customer Success & Contract Expansion',
    features: [
      { name: 'Autonomous Mobilization (ACMS)', desc: 'Parallelizes 9 onboarding lanes from plant setup to first shipment.', status: '6 Clients Onboarding', actionText: 'Track Mobilization' },
      { name: 'Customer Churn Risk Predictor', desc: 'Scans shipment volume drops and ticket sentiment to trigger intervention.', status: '97.4% Health Score', actionText: 'Review Risk Radar' },
      { name: 'Contract Expansion Recommender', desc: 'Identifies high-performing corridors for spot-to-dedicated upgrades.', status: '₹14.2M Opportunity', actionText: 'View Upsell Deals' },
      { name: 'Executive Cadence Tracker', desc: 'Schedules quarterly business reviews (QBR) for Top 50 enterprise accounts.', status: '4 QBRs This Week', actionText: 'Schedule QBR' }
    ]
  }
};

// Generates dynamic data based on selected filters
const generateChartData = (segmentKey, timeframe, region, category, scaleMode) => {
  let labels = [];
  let baseValues = [];
  let targetValues = [];

  const pointsCount = timeframe === '24h' ? 24 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 12 : 12;

  if (timeframe === '24h') {
    labels = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
  } else if (timeframe === '7d') {
    labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  } else if (timeframe === '30d') {
    labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
  } else {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }

  // Multipliers based on region & category
  const regionMultiplier = region === 'north' ? 1.08 : region === 'west' ? 1.15 : region === 'south' ? 0.96 : region === 'east' ? 0.88 : 1.0;
  const categoryMultiplier = category === 'express' ? 1.12 : category === 'reefer' ? 1.05 : category === 'ev' ? 0.92 : 1.0;

  switch (segmentKey) {
    case 'revenueToday':
      baseValues = labels.map((_, i) => (35 + Math.sin(i * 0.4) * 6 + i * 0.4) * regionMultiplier * categoryMultiplier);
      targetValues = labels.map((_, i) => (40 + i * 0.35) * regionMultiplier);
      break;
    case 'fleetUtilization':
      baseValues = labels.map((_, i) => Math.min(98, (80 + Math.cos(i * 0.5) * 5 + i * 0.3) * regionMultiplier));
      targetValues = labels.map(() => 92);
      break;
    case 'onTimeDelivery':
      baseValues = labels.map((_, i) => Math.min(99.5, (91 + Math.sin(i * 0.6) * 3 + (i % 4) * 0.8) * regionMultiplier));
      targetValues = labels.map(() => 95);
      break;
    case 'activeTrucks':
      baseValues = labels.map((_, i) => (440 + Math.sin(i * 0.3) * 20 + i * 1.5) * regionMultiplier * categoryMultiplier);
      targetValues = labels.map((_, i) => 470 + i * 1.2);
      break;
    case 'fuelEfficiency':
      baseValues = labels.map((_, i) => (4.1 + Math.sin(i * 0.4) * 0.4 + i * 0.02) * categoryMultiplier);
      targetValues = labels.map(() => 5.0);
      break;
    case 'customerGrowth':
      baseValues = labels.map((_, i) => (8 + Math.cos(i * 0.3) * 2 + i * 0.25) * regionMultiplier);
      targetValues = labels.map(() => 12);
      break;
    default:
      baseValues = labels.map(() => 50);
      targetValues = labels.map(() => 60);
  }

  // Normalize scale mode if requested
  if (scaleMode === 'normalized') {
    const maxVal = Math.max(...baseValues) || 1;
    baseValues = baseValues.map(v => (v / maxVal) * 100);
    targetValues = targetValues.map(v => (v / maxVal) * 100);
  }

  return { labels, baseValues, targetValues };
};

const SegmentDeepDiveCockpit = ({ segmentKey, onOpenArchitecture }) => {
  const [timeframe, setTimeframe] = useState('30d');
  const [region, setRegion] = useState('all');
  const [category, setCategory] = useState('all');
  const [viewType, setViewType] = useState('line'); // line | bar
  const [scaleMode, setScaleMode] = useState('auto'); // auto | normalized
  const [notification, setNotification] = useState(null);

  const config = segmentConfigs[segmentKey] || segmentConfigs.revenueToday;

  const chartData = useMemo(() => {
    return generateChartData(segmentKey, timeframe, region, category, scaleMode);
  }, [segmentKey, timeframe, region, category, scaleMode]);

  const triggerFeatureAction = (featureName) => {
    setNotification(`Action Triggered: "${featureName}" — Event emitted to GatiFleet ledger.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: { color: '#94a3b8', font: { size: 11, family: 'Inter, sans-serif' } }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: { color: '#94a3b8', font: { size: 10 } }
      }
    }
  };

  const reactChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: `${config.title.split(' ')[0]} (${scaleMode === 'normalized' ? '%' : config.unit})`,
        data: chartData.baseValues,
        borderColor: config.color,
        backgroundColor: (ctx) => {
          if (!ctx.chart.chartArea) return 'rgba(99, 102, 241, 0.1)';
          const gradient = ctx.chart.ctx.createLinearGradient(0, ctx.chart.chartArea.top, 0, ctx.chart.chartArea.bottom);
          gradient.addColorStop(0, `${config.color}40`);
          gradient.addColorStop(1, `${config.color}00`);
          return gradient;
        },
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
      {
        label: 'Benchmark SLA Target',
        data: chartData.targetValues,
        borderColor: '#fbbf24',
        borderDash: [5, 5],
        borderWidth: 1.5,
        fill: false,
        pointRadius: 0,
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={styles.cockpitRoot}
    >
      {/* Top Header Bar */}
      <div style={styles.topHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ ...styles.segmentBadgeIcon, background: config.gradient }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h3 style={styles.cockpitTitle}>{config.title}</h3>
              <span style={{ ...styles.liveMetricBadge, color: config.color }}>{config.metric}</span>
              <span style={styles.trendTag}>{config.trend}</span>
            </div>
            <p style={styles.cockpitSub}>
              Scalable real-time intelligence telemetry graph with multi-dimensional parameter filtering.
            </p>
          </div>
        </div>

        <button style={styles.blueprintBtn} onClick={() => onOpenArchitecture(segmentKey)}>
          <Cpu size={14} color="#818cf8" />
          View Section Architecture Blueprint
        </button>
      </div>

      {/* Action Notification Banner */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={styles.notificationBanner}
          >
            <CheckCircle size={14} color="var(--success-500)" />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter & Control Bar */}
      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>
            <Calendar size={12} /> Timeframe:
          </span>
          <div style={styles.tabGroup}>
            {['24h', '7d', '30d', '90d', 'YTD'].map((tf) => (
              <button
                key={tf}
                style={styles.tabBtn(timeframe === tf)}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>
            <MapPin size={12} /> Corridor/Region:
          </span>
          <select
            style={styles.selectInput}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="all">All India (National)</option>
            <option value="west">Western Corridor (NH48)</option>
            <option value="north">Northern Region (NCR/Punjab)</option>
            <option value="south">Southern Corridor (BLR/CHN)</option>
            <option value="east">Eastern Hub (Kolkata/OD)</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>
            <Filter size={12} /> Fleet Class:
          </span>
          <select
            style={styles.selectInput}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Vehicle Types</option>
            <option value="express">Express Commercial (32FT)</option>
            <option value="reefer">Refrigerated Cold Chain</option>
            <option value="ev">Electric Fleet (EV)</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Chart View:</span>
          <div style={styles.tabGroup}>
            <button style={styles.tabBtn(viewType === 'line')} onClick={() => setViewType('line')}>Line</button>
            <button style={styles.tabBtn(viewType === 'bar')} onClick={() => setViewType('bar')}>Bar</button>
          </div>
        </div>

        <div style={styles.filterGroup}>
          <span style={styles.filterLabel}>Scale Mode:</span>
          <button
            style={styles.scaleToggleBtn(scaleMode === 'normalized')}
            onClick={() => setScaleMode(scaleMode === 'auto' ? 'normalized' : 'auto')}
          >
            {scaleMode === 'auto' ? 'Auto Scale' : 'Normalized (0-100%)'}
          </button>
        </div>
      </div>

      {/* Main Content Grid: Scalable Graph (7 cols) + Features Panel (5 cols) */}
      <div style={styles.contentGrid}>
        {/* Chart Canvas Card */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={15} color={config.color} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                Scalable Telemetry & Forecast Graph
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={styles.activeFilterTag}>
                {region === 'all' ? 'All Regions' : region.toUpperCase()} • {timeframe}
              </span>
            </div>
          </div>

          <div style={{ height: 280, position: 'relative', width: '100%', marginTop: 10 }}>
            {viewType === 'line' ? (
              <Line data={reactChartData} options={chartOptions} />
            ) : (
              <Bar data={reactChartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Features & Actions Panel */}
        <div style={styles.featuresCard}>
          <div style={styles.featuresHeader}>
            <Layers size={15} color="var(--primary-400)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              {config.featuresTitle}
            </span>
          </div>

          <div style={styles.featureList}>
            {config.features.map((feat, idx) => (
              <div key={idx} style={styles.featureBox}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={styles.featName}>{feat.name}</span>
                  <span style={styles.featStatus}>{feat.status}</span>
                </div>
                <p style={styles.featDesc}>{feat.desc}</p>
                <button
                  style={styles.featActionBtn}
                  onClick={() => triggerFeatureAction(feat.name)}
                >
                  <RefreshCw size={11} />
                  {feat.actionText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const styles = {
  cockpitRoot: {
    gridColumn: 'span 12',
    background: 'var(--surface, #1e293b)',
    backdropFilter: 'blur(16px)',
    border: '1px solid var(--primary-500, #6366f1)',
    borderRadius: 'var(--radius-lg, 16px)',
    padding: 20,
    marginBottom: 8,
    boxShadow: '0 12px 32px rgba(99, 102, 241, 0.15)',
  },
  topHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottom: '1px solid var(--surface-border, rgba(255, 255, 255, 0.08))',
  },
  segmentBadgeIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  cockpitTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--text-primary, #f8fafc)',
    margin: 0,
  },
  liveMetricBadge: {
    fontSize: 15,
    fontWeight: 800,
    background: 'rgba(255,255,255,0.06)',
    padding: '2px 8px',
    borderRadius: 6,
  },
  trendTag: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--success-500, #10b981)',
  },
  cockpitSub: {
    fontSize: 12,
    color: 'var(--text-muted, #94a3b8)',
    margin: '2px 0 0',
  },
  blueprintBtn: {
    background: 'rgba(129, 140, 248, 0.12)',
    border: '1px solid rgba(129, 140, 248, 0.3)',
    color: '#818cf8',
    padding: '8px 14px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  notificationBanner: {
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: '#34d399',
    padding: '8px 14px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    marginTop: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  filterBar: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 16,
    padding: '12px 14px',
    background: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 10,
    marginTop: 14,
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-muted, #94a3b8)',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  tabGroup: {
    display: 'flex',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 6,
    padding: 2,
  },
  tabBtn: (active) => ({
    background: active ? 'var(--primary-600, #4f46e5)' : 'transparent',
    color: active ? '#fff' : 'var(--text-muted, #94a3b8)',
    border: 'none',
    borderRadius: 5,
    padding: '3px 9px',
    fontSize: 11,
    fontWeight: 600,
    cursor: 'pointer',
  }),
  selectInput: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'var(--text-primary, #f8fafc)',
    padding: '3px 8px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 500,
    outline: 'none',
    cursor: 'pointer',
  },
  scaleToggleBtn: (active) => ({
    background: active ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
    border: active ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
    color: active ? '#fbbf24' : 'var(--text-muted, #94a3b8)',
    borderRadius: 6,
    padding: '3px 10px',
    fontSize: 11,
    fontWeight: 600,
    cursor: 'pointer',
  }),
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: 16,
    marginTop: 16,
  },
  chartCard: {
    gridColumn: 'span 7',
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    padding: 14,
  },
  chartHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeFilterTag: {
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--primary-400, #818cf8)',
    background: 'rgba(129, 140, 248, 0.15)',
    padding: '2px 8px',
    borderRadius: 4,
  },
  featuresCard: {
    gridColumn: 'span 5',
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    padding: 14,
    display: 'flex',
    flexDirection: 'column',
  },
  featuresHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    overflowY: 'auto',
    maxHeight: 280,
  },
  featureBox: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: 8,
    padding: 10,
  },
  featName: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-primary, #f8fafc)',
  },
  featStatus: {
    fontSize: 10,
    fontWeight: 700,
    color: 'var(--success-500, #10b981)',
    background: 'rgba(16, 185, 129, 0.12)',
    padding: '1px 6px',
    borderRadius: 4,
  },
  featDesc: {
    fontSize: 11,
    color: 'var(--text-muted, #94a3b8)',
    margin: '4px 0 8px',
    lineHeight: 1.4,
  },
  featActionBtn: {
    background: 'rgba(99, 102, 241, 0.15)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    color: '#818cf8',
    borderRadius: 6,
    padding: '4px 8px',
    fontSize: 10,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  }
};

export default SegmentDeepDiveCockpit;
