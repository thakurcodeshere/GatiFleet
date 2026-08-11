/* eslint-disable */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Brain, Cpu, Database, Network, ShieldCheck, Zap,
  Activity, ArrowRight, CheckCircle2, AlertTriangle, Layers,
  FileText, TrendingUp, RefreshCw, BarChart3, Scale, Clock,
  IndianRupee, Gauge, Truck, Fuel, Users
} from 'lucide-react';

const segmentArchitectures = {
  revenueToday: {
    title: 'Revenue Today — System Architecture & Workflow Structure',
    metric: '₹42.9M',
    trend: '+8.3% vs yesterday',
    icon: IndianRupee,
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    systemEngine: 'Autonomous Revenue Intelligence Engine (ARIE) & RABIP',
    businessGoal: 'Protect gross operational margins, dynamically optimize fuel/toll surcharges, and eliminate billing leakage across all contract corridors.',
    userIntent: 'Monitor real-time cash inflows, validate tariff calculations against telemetry logs, and auto-reconcile freight disputes.',
    l1Events: [
      { name: 'REVENUE_EVENT_PROCESSED', desc: 'Emitted upon IoT delivery confirmation and telemetry validation.' },
      { name: 'TARIFF_SURCHARGE_RECALCULATED', desc: 'Emitted when diesel/CNG index triggers dynamic rate adjustment.' },
      { name: 'BILLING_DISPUTE_RAISED', desc: 'Emitted when customer detention claim triggers automated audit.' },
      { name: 'INVOICE_AUTO_RECONCILED', desc: 'Emitted when payment matches double-entry ERP ledger record.' }
    ],
    knowledgeGraphNodes: [
      { from: 'Customer (CUS-1042)', rel: 'Has Active Contract', to: 'Contract (CTR-8921)' },
      { from: 'Contract (CTR-8921)', rel: 'Defines Surcharge Formula', to: 'Fuel Index (WTI/Diesel)' },
      { from: 'Shipment (SHP-99201)', rel: 'Generates Billing Line', to: 'Invoice (INV-44120)' },
      { from: 'Invoice (INV-44120)', rel: 'Synchronizes Ledger', to: 'ERP Financial Twin' }
    ],
    digitalTwinBrains: [
      { name: 'Commercial Brain', status: 'Optimal', detail: 'Tracks ACV, gross margin, and expansion ARR across 12 product lines.' },
      { name: 'Financial Brain', status: 'Synchronized', detail: 'Models AR, credit limits, dispute reserve caps, and tax allocations.' },
      { name: 'Learning Brain', status: 'Active', detail: 'Retrains tariff concession models based on historical customer payment velocity.' }
    ],
    policyGuardrails: [
      { rule: 'Exposure Limit Check', threshold: '< ₹5.0M unbilled', status: 'PASS' },
      { rule: 'Margin Floor Guard', threshold: 'Min 18.5% Gross Margin', status: 'ENFORCED' },
      { rule: 'Dispute Settlement Approval', threshold: 'Auto-approve < ₹25,000', status: 'ACTIVE' }
    ],
    calculationFormula: 'Daily Revenue = ∑ (Base Freight Rate + Dynamic Fuel Surcharge + Toll Clearance + Detention Fee) - Contractual Rebates'
  },

  fleetUtilization: {
    title: 'Fleet Utilization — System Architecture & Workflow Structure',
    metric: '87.4%',
    trend: '+2.1% vs last week',
    icon: Gauge,
    gradient: 'linear-gradient(135deg, #38CE3C, #10b981)',
    systemEngine: 'Autonomous Transportation Planning & Dispatch System (ATPDS)',
    businessGoal: 'Maximize loaded asset operational hours while minimizing deadhead transit kilometers and idle depot turnaround times.',
    userIntent: 'Identify underutilized corridors, auto-rebalance fleet standby units, and optimize inter-state load matching.',
    l1Events: [
      { name: 'FLEET_DISPATCHED', desc: 'Emitted when truck exits origin geofence with assigned manifest.' },
      { name: 'CONTAINER_LOADED', desc: 'Emitted when door sensor and RFID scan confirm cargo loading.' },
      { name: 'DEPOT_BAY_RELEASED', desc: 'Emitted when loading dock slot signals completion.' },
      { name: 'IDLE_TIME_ALERT', desc: 'Emitted when vehicle remains unassigned > 120 minutes.' }
    ],
    knowledgeGraphNodes: [
      { from: 'Truck (TRK-08420)', rel: 'Traverses Corridor', to: 'NH48 Western Route' },
      { from: 'NH48 Western Route', rel: 'Connects Depots', to: 'Mumbai Cross-Dock' },
      { from: 'Mumbai Cross-Dock', rel: 'Allocates Fleet Buffer', to: 'Reefer Dedicated Slot' },
      { from: 'Reefer Dedicated Slot', rel: 'Feeds Telemetry', to: 'ATPDS Solver Engine' }
    ],
    digitalTwinBrains: [
      { name: 'Operational Brain', status: 'Optimal', detail: 'Tracks live asset status, deadhead ratio, and turnaround cycles.' },
      { name: 'Logistics Brain', status: 'Optimizing', detail: 'Simulates 24-hour forward load balance to eliminate backhaul empties.' },
      { name: 'Physical Brain', status: 'Synchronized', detail: 'Monitors container door seals, load weight sensors, and trailer tire pressures.' }
    ],
    policyGuardrails: [
      { rule: 'Maximum Deadhead Buffer', threshold: '< 8% total mileage', status: 'PASS' },
      { rule: 'Turnaround Window Guard', threshold: '< 90 mins at Cross-Dock', status: 'ENFORCED' },
      { rule: 'Driver Rest Compliance', threshold: 'Mandatory 8h per 14h shift', status: 'ACTIVE' }
    ],
    calculationFormula: 'Fleet Utilization % = (Active Loaded Moving Hours / Total Available Capacity Hours) × 100'
  },

  onTimeDelivery: {
    title: 'On-Time Delivery — System Architecture & Workflow Structure',
    metric: '94.2%',
    trend: '+1.8% SLA compliance',
    icon: Clock,
    gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    systemEngine: 'Autonomous Customer Operations Intelligence Platform (ACOIP)',
    businessGoal: 'Predict delivery delays 4 hours before SLA breach and execute autonomous rerouting to maintain 95%+ OTD.',
    userIntent: 'Track live trip variances, mitigate route bottlenecks, and notify shippers proactively of ETA updates.',
    l1Events: [
      { name: 'CHECKPOINT_PASSED', desc: 'Emitted when FASTag or GPS geofence verifies corridor progress.' },
      { name: 'SLA_BREACH_WARNING', desc: 'Emitted when predicted ETA exceeds promised window by > 30 mins.' },
      { name: 'AUTO_REROUTE_EXECUTED', desc: 'Emitted when navigation algorithm updates route around congestion.' },
      { name: 'SHIPMENT_DELIVERED', desc: 'Emitted upon electronic Proof-of-Delivery (ePOD) sign-off.' }
    ],
    knowledgeGraphNodes: [
      { from: 'Shipment (SHP-8812)', rel: 'Monitored By', to: 'ACOIP Risk Engine' },
      { from: 'ACOIP Risk Engine', rel: 'Evaluates Edge', to: 'Delhi-Jaipur Toll Checkpoint' },
      { from: 'Delhi-Jaipur Checkpoint', rel: 'Pulls Live Data', to: 'NHAI Traffic Feed' },
      { from: 'NHAI Traffic Feed', rel: 'Updates ETA', to: 'Customer Portal Twin' }
    ],
    digitalTwinBrains: [
      { name: 'Operational Brain', status: 'Optimal', detail: 'Calculates minute-by-minute ETA projections based on live traffic/weather.' },
      { name: 'Customer Brain', status: 'Synchronized', detail: 'Updates customer digital twin health score and SLA compliance index.' },
      { name: 'Learning Brain', status: 'Active', detail: 'Feeds bottleneck delay patterns back to route planning heuristics.' }
    ],
    policyGuardrails: [
      { rule: 'SLA Penalty Threshold', threshold: 'Zero breach on Enterprise Tier', status: 'ENFORCED' },
      { rule: 'Auto-Reroute Authorization', threshold: 'Cost delta < ₹1,500 auto-approved', status: 'PASS' },
      { rule: 'Customer Notification Delay', threshold: '< 3 minutes from alert', status: 'ACTIVE' }
    ],
    calculationFormula: 'OTD % = (Shipments Delivered Within Promised SLA Window / Total Completed Shipments) × 100'
  },

  activeTrucks: {
    title: 'Active Trucks — System Architecture & Workflow Structure',
    metric: '488K',
    trend: '+3.4% vehicle uptime',
    icon: Truck,
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
    systemEngine: 'Intelligent Fleet & Asset Operations System (IFAOS)',
    businessGoal: 'Maintain continuous IoT telemetry connection for all 488,000+ commercial vehicles and predict mechanical failures before breakdown.',
    userIntent: 'Monitor live vehicle status, track maintenance health scores, and dispatch automated depot servicing.',
    l1Events: [
      { name: 'TELEMATICS_PING', desc: 'Emitted every 30 seconds per vehicle via CAN bus OBD-II node.' },
      { name: 'TRUCK_ONLINE', desc: 'Emitted when ignition state registers active engine start.' },
      { name: 'MECHANICAL_FAULT_DETECTED', desc: 'Emitted when engine DTC code indicates subsystem wear.' },
      { name: 'WORKSHOP_DISPATCH_CREATED', desc: 'Emitted when RUL algorithm reserves workshop bay.' }
    ],
    knowledgeGraphNodes: [
      { from: 'Truck (TRK-44910)', rel: 'Hosts Sensor Unit', to: 'Telematics Gateway v4' },
      { from: 'Telematics Gateway v4', rel: 'Streams Telemetry', to: 'IFAOS Ingestion Pipeline' },
      { from: 'IFAOS Ingestion Pipeline', rel: 'Monitors Component', to: 'Tyre Pressure Sensor Set' },
      { from: 'Tyre Pressure Sensor Set', rel: 'Schedules Bay', to: 'Bengaluru Service Hub' }
    ],
    digitalTwinBrains: [
      { name: 'Physical Brain', status: 'Optimal', detail: 'Tracks Remaining Useful Life (RUL) for engines, brakes, and tyres.' },
      { name: 'Operational Brain', status: 'Synchronized', detail: 'Maps vehicle location, speed, fuel level, and cargo weight.' },
      { name: 'Executive Brain', status: 'Active', detail: 'Aggregates fleet capital efficiency and asset replacement schedule.' }
    ],
    policyGuardrails: [
      { rule: 'Telemetry Latency Boundary', threshold: '< 45 seconds per ping', status: 'PASS' },
      { rule: 'Critical DTC Action', threshold: 'Stop advice within 5 mins for Red Faults', status: 'ENFORCED' },
      { rule: 'Preventive Maintenance SLA', threshold: 'Within 500 km of service window', status: 'ACTIVE' }
    ],
    calculationFormula: 'Active Trucks = Count(Vehicles with Telemetry Ping < 5m AND Status ∈ {In-Transit, Loading, Ready Buffer})'
  },

  fuelEfficiency: {
    title: 'Fuel Efficiency — System Architecture & Workflow Structure',
    metric: '4.8 km/L',
    trend: '+4.3% eco optimization',
    icon: Fuel,
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
    systemEngine: 'Driver Workforce Intelligence Platform (DWIP) & Eco-Routing Engine',
    businessGoal: 'Reduce fleet carbon footprint and fuel costs by monitoring consumption patterns, eliminating idle waste, and training drivers.',
    userIntent: 'Analyze vehicle mileage trends across fuel types, prevent fuel theft, and reward high-performing drivers.',
    l1Events: [
      { name: 'FUEL_REFILL_RECORDED', desc: 'Emitted when fuel sensor and FASTag fuel card record tank fill.' },
      { name: 'EXCESS_IDLE_DETECTED', desc: 'Emitted when engine idles > 15 minutes while vehicle is stationary.' },
      { name: 'ECO_SCORE_UPDATED', desc: 'Emitted after trip completion aggregating speed, braking, and gear shifts.' },
      { name: 'FUEL_LEAKAGE_ALERT', desc: 'Emitted when tank sensor detects rapid level drop during stop.' }
    ],
    knowledgeGraphNodes: [
      { from: 'Driver (DRV-9021)', rel: 'Operates Truck', to: 'Truck (TRK-10294)' },
      { from: 'Truck (TRK-10294)', rel: 'Pulls Fuel At', to: 'IndianOil Smart Station' },
      { from: 'IndianOil Smart Station', rel: 'Logs Transaction', to: 'Fuel Ledger Node' },
      { from: 'Fuel Ledger Node', rel: 'Feeds DWIP Model', to: 'Eco Incentive Engine' }
    ],
    digitalTwinBrains: [
      { name: 'Operational Brain', status: 'Optimal', detail: 'Tracks fleet-wide km/L average, EV efficiency, and idle burn rates.' },
      { name: 'Driver Brain', status: 'Synchronized', detail: 'Scores drivers on acceleration, coasting, and speed governor compliance.' },
      { name: 'Financial Brain', status: 'Active', detail: 'Calculates direct fuel savings impact on per-kilometer operating margins.' }
    ],
    policyGuardrails: [
      { rule: 'Idling Limit Policy', threshold: 'Max 10 mins continuous idle', status: 'ENFORCED' },
      { rule: 'Fuel Discrepancy Variance', threshold: '< 1.5% between pump receipt & sensor', status: 'PASS' },
      { rule: 'Driver Eco Reward', threshold: 'Bonus paid on > 5.2 km/L achievement', status: 'ACTIVE' }
    ],
    calculationFormula: 'Fuel Efficiency (km/L) = Total Distance Covered (km) / Total Fuel Volume Consumed (Litres)'
  },

  customerGrowth: {
    title: 'Customer Growth — System Architecture & Workflow Structure',
    metric: '+12.6%',
    trend: '+12.6% YoY growth rate',
    icon: Users,
    gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    systemEngine: 'Customer Intelligence Core (CIC) & Autonomous Customer Mobilization System (ACMS)',
    businessGoal: 'Accelerate client onboarding, maximize customer lifetime value (LTV), and detect churn signals early.',
    userIntent: 'Track lead conversion rates, monitor 30-day mobilization hypercare, and execute targeted expansion programs.',
    l1Events: [
      { name: 'LEAD_QUALIFIED', desc: 'Emitted when AI scoring model scores prospect readiness > 80%.' },
      { name: 'DEAL_WON', desc: 'Emitted when commercial contract is signed and validated.' },
      { name: 'MOBILIZATION_STARTED', desc: 'Emitted when ACMS initializes 9 parallel launch lanes.' },
      { name: 'CUSTOMER_ACTIVATED', desc: 'Emitted upon first successful shipment delivery.' }
    ],
    knowledgeGraphNodes: [
      { from: 'Customer (CUS-5012)', rel: 'Assigned To', to: 'Key Account Manager' },
      { from: 'Key Account Manager', rel: 'Manages Lanes', to: 'Delhi-Mumbai Express Corridor' },
      { from: 'Delhi-Mumbai Corridor', rel: 'Generates Shipment Volume', to: 'Monthly Revenue Stream' },
      { from: 'Monthly Revenue Stream', rel: 'Updates Score', to: 'CIC Health Matrix' }
    ],
    digitalTwinBrains: [
      { name: 'Commercial Brain', status: 'Optimal', detail: 'Tracks customer LTV, expansion potential, and rebate milestones.' },
      { name: 'Relationship Brain', status: 'Synchronized', detail: 'Monitors executive meeting cadence, support ticket sentiment, and NPS.' },
      { name: 'Strategic Brain', status: 'Active', detail: 'Identifies expansion opportunities in new geographic corridors.' }
    ],
    policyGuardrails: [
      { rule: 'Mobilization SLA', threshold: '< 7 days from Deal Won to First Shipment', status: 'ENFORCED' },
      { rule: 'Churn Risk Trigger', threshold: 'Intervene if Health Score < 65%', status: 'PASS' },
      { rule: 'Executive Cadence Rule', threshold: 'Quarterly review required for Top 50 ACV', status: 'ACTIVE' }
    ],
    calculationFormula: 'Net Customer Growth % = ((Active Shippers End Period - Active Shippers Start Period) / Active Shippers Start Period) × 100'
  }
};

const SegmentArchitectureModal = ({ segmentKey, onClose }) => {
  if (!segmentKey || !segmentArchitectures[segmentKey]) return null;

  const data = segmentArchitectures[segmentKey];
  const Icon = data.icon;

  return (
    <AnimatePresence>
      <div style={styles.backdrop} onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={styles.modalCard}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={styles.header}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ ...styles.iconBox, background: data.gradient }}>
                <Icon size={24} color="#fff" />
              </div>
              <div>
                <h2 style={styles.title}>{data.title}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                  <span style={styles.metricBadge}>{data.metric}</span>
                  <span style={styles.trendText}>{data.trend}</span>
                  <span style={styles.engineTag}>
                    <Cpu size={12} />
                    {data.systemEngine}
                  </span>
                </div>
              </div>
            </div>
            <button style={styles.closeBtn} onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          {/* Body Content */}
          <div style={styles.body}>
            {/* Overview Banner */}
            <div style={styles.overviewGrid}>
              <div style={styles.overviewBox}>
                <div style={styles.boxTitle}>
                  <Zap size={14} color="var(--primary-400)" />
                  Strategic Business Goal
                </div>
                <div style={styles.boxContent}>{data.businessGoal}</div>
              </div>
              <div style={styles.overviewBox}>
                <div style={styles.boxTitle}>
                  <Brain size={14} color="var(--success-500)" />
                  User Intent & Actionability
                </div>
                <div style={styles.boxContent}>{data.userIntent}</div>
              </div>
            </div>

            {/* Calculations & Formula */}
            <div style={styles.formulaSection}>
              <div style={styles.sectionHeader}>
                <Scale size={15} color="var(--warning-400)" />
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>
                  Business Calculation & State Formula
                </span>
              </div>
              <div style={styles.formulaBox}>
                <code>{data.calculationFormula}</code>
              </div>
            </div>

            {/* Grid 2x2: Events, Knowledge Graph, Digital Twin, Policies */}
            <div style={styles.mainGrid}>
              {/* L1 Events Taxonomy */}
              <div style={styles.gridCard}>
                <div style={styles.cardHeader}>
                  <Activity size={16} color="var(--primary-400)" />
                  <span style={styles.cardTitle}>L1 Business Events Emitted</span>
                </div>
                <div style={styles.listContainer}>
                  {data.l1Events.map((evt, idx) => (
                    <div key={idx} style={styles.listItem}>
                      <div style={styles.eventName}>{evt.name}</div>
                      <div style={styles.eventDesc}>{evt.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Knowledge Graph Synchronizations */}
              <div style={styles.gridCard}>
                <div style={styles.cardHeader}>
                  <Network size={16} color="#8b5cf6" />
                  <span style={styles.cardTitle}>Knowledge Graph Node Links</span>
                </div>
                <div style={styles.listContainer}>
                  {data.knowledgeGraphNodes.map((node, idx) => (
                    <div key={idx} style={styles.graphItem}>
                      <span style={styles.graphNode}>{node.from}</span>
                      <span style={styles.graphRel}>── {node.rel} ──►</span>
                      <span style={styles.graphNode}>{node.to}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Digital Twin Brains */}
              <div style={styles.gridCard}>
                <div style={styles.cardHeader}>
                  <Brain size={16} color="var(--success-500)" />
                  <span style={styles.cardTitle}>Digital Twin 6-Brain Sync</span>
                </div>
                <div style={styles.listContainer}>
                  {data.digitalTwinBrains.map((brain, idx) => (
                    <div key={idx} style={styles.brainItem}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={styles.brainName}>{brain.name}</span>
                        <span style={styles.brainStatus}>{brain.status}</span>
                      </div>
                      <div style={styles.brainDetail}>{brain.detail}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy Guardrails & Compliance */}
              <div style={styles.gridCard}>
                <div style={styles.cardHeader}>
                  <ShieldCheck size={16} color="var(--info-400)" />
                  <span style={styles.cardTitle}>Corporate Policy Guardrails</span>
                </div>
                <div style={styles.listContainer}>
                  {data.policyGuardrails.map((policy, idx) => (
                    <div key={idx} style={styles.policyItem}>
                      <div>
                        <div style={styles.policyRule}>{policy.rule}</div>
                        <div style={styles.policyThreshold}>Threshold: {policy.threshold}</div>
                      </div>
                      <span style={styles.policyTag}>{policy.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Layers size={13} />
              GatiFleet CRM Operating System — Blueprint Standard (Rule AGENTS.md Compliant)
            </div>
            <button style={styles.doneBtn} onClick={onClose}>
              Close Blueprint View
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    background: 'var(--surface-dark, #0f172a)',
    border: '1px solid var(--surface-border, rgba(255, 255, 255, 0.12))',
    borderRadius: 16,
    width: '100%',
    maxWidth: 960,
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid var(--surface-border, rgba(255, 255, 255, 0.08))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(255, 255, 255, 0.02)',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: 'var(--text-primary, #f8fafc)',
    margin: 0,
  },
  metricBadge: {
    fontSize: 14,
    fontWeight: 700,
    color: '#6366f1',
    background: 'rgba(99, 102, 241, 0.15)',
    padding: '2px 8px',
    borderRadius: 6,
  },
  trendText: {
    fontSize: 12,
    color: 'var(--success-500, #10b981)',
    fontWeight: 600,
  },
  engineTag: {
    fontSize: 11,
    color: 'var(--text-muted, #94a3b8)',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: 'rgba(255,255,255,0.05)',
    padding: '2px 8px',
    borderRadius: 6,
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted, #94a3b8)',
    cursor: 'pointer',
    padding: 8,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 24,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  overviewBox: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    borderRadius: 12,
    padding: 14,
  },
  boxTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-secondary, #cbd5e1)',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  boxContent: {
    fontSize: 12,
    color: 'var(--text-muted, #94a3b8)',
    lineHeight: 1.5,
  },
  formulaSection: {
    background: 'rgba(245, 158, 11, 0.05)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    borderRadius: 12,
    padding: 14,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  formulaBox: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#fbbf24',
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '10px 14px',
    borderRadius: 8,
    overflowX: 'auto',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  gridCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    borderRadius: 12,
    padding: 14,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-primary, #f8fafc)',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  listItem: {
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 8,
  },
  eventName: {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--primary-400, #818cf8)',
    fontFamily: 'monospace',
  },
  eventDesc: {
    fontSize: 11,
    color: 'var(--text-muted, #94a3b8)',
    marginTop: 2,
  },
  graphItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 11,
    background: 'rgba(0,0,0,0.2)',
    padding: '8px 10px',
    borderRadius: 8,
    overflowX: 'auto',
  },
  graphNode: {
    fontWeight: 600,
    color: '#a78bfa',
    whiteSpace: 'nowrap',
  },
  graphRel: {
    color: 'var(--text-muted, #94a3b8)',
    fontSize: 10,
    whiteSpace: 'nowrap',
  },
  brainItem: {
    background: 'rgba(0,0,0,0.2)',
    padding: 8,
    borderRadius: 8,
  },
  brainName: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-primary, #f8fafc)',
  },
  brainStatus: {
    fontSize: 10,
    fontWeight: 700,
    color: 'var(--success-500, #10b981)',
    background: 'rgba(16, 185, 129, 0.15)',
    padding: '1px 6px',
    borderRadius: 4,
  },
  brainDetail: {
    fontSize: 11,
    color: 'var(--text-muted, #94a3b8)',
    marginTop: 4,
  },
  policyItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(0,0,0,0.2)',
    padding: 8,
    borderRadius: 8,
  },
  policyRule: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-primary, #f8fafc)',
  },
  policyThreshold: {
    fontSize: 10,
    color: 'var(--text-muted, #94a3b8)',
  },
  policyTag: {
    fontSize: 10,
    fontWeight: 700,
    color: 'var(--info-400, #38bdf8)',
    background: 'rgba(56, 189, 248, 0.15)',
    padding: '2px 6px',
    borderRadius: 4,
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid var(--surface-border, rgba(255, 255, 255, 0.08))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(0, 0, 0, 0.2)',
  },
  doneBtn: {
    background: 'var(--primary-600, #4f46e5)',
    border: 'none',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
  }
};

export default SegmentArchitectureModal;
