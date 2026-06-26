/* eslint-disable */
// ============================================================
// GatiFleet — AI Agents Dashboard
// Autonomous agents powering your operations
// ============================================================
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, IndianRupee, Users, TrendingUp, Route, Server, Brain,
  Zap, CheckCircle2, Clock, ArrowRight, Activity, Sparkles,
  CircleDot, ListChecks, BarChart3, Eye, ChevronRight,
  Layers, Timer, Target, BadgeCheck, Play, Check, RefreshCw, X,
  ShieldAlert, Cpu, Terminal, ChevronLeft
} from 'lucide-react';
import { aiAgents, aiAgentsExtendedData } from '../../data/mockData';

// ---- Icon map ----
const ICON_MAP = {
  IndianRupee, Users, TrendingUp, Route, Server, Brain,
};

// ---- Keyframes injected once ----
const KEYFRAMES_ID = 'gatifleet-agents-keyframes';
const injectKeyframes = () => {
  if (document.getElementById(KEYFRAMES_ID)) return;
  const style = document.createElement('style');
  style.id = KEYFRAMES_ID;
  style.textContent = `
    @keyframes gati-pulse-ring {
      0% { transform: scale(0.85); opacity: 0.7; }
      70% { transform: scale(1.35); opacity: 0; }
      100% { transform: scale(1.35); opacity: 0; }
    }
    @keyframes gati-glow-breathe {
      0%, 100% { opacity: 0.35; }
      50% { opacity: 0.65; }
    }
    @keyframes gati-status-dot {
      0%, 100% { box-shadow: 0 0 0 0 currentColor; }
      50% { box-shadow: 0 0 8px 3px currentColor; }
    }
    @keyframes gati-timeline-line {
      from { height: 0; }
      to   { height: 100%; }
    }
    @keyframes gati-console-cursor {
      0%, 100% { opacity: 0; }
      50% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
};

// ---- Circular progress ring ----
const CircularProgress = ({ value, size = 52, stroke = 4, color }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="var(--bg-600)" strokeWidth={stroke}
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }}
      />
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle" dominantBaseline="central"
        style={{
          transform: 'rotate(90deg)',
          transformOrigin: 'center',
          fill: 'var(--text-primary)',
          fontSize: size * 0.24,
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
        }}
      >
        {value}%
      </text>
    </svg>
  );
};

// ============================================================
// Main Component
// ============================================================
const AgentsDashboard = () => {
  useEffect(() => { injectKeyframes(); }, []);

  const [hoveredAgent, setHoveredAgent] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [agents, setAgents] = useState(aiAgents);
  
  // Level +100 Finance Agent States
  const [financeAuditThreshold, setFinanceAuditThreshold] = useState(10000);
  const [financeLedgerBalance, setFinanceLedgerBalance] = useState(14.2);
  const [financeSavings, setFinanceSavings] = useState(23000);
  const [financeDisputes, setFinanceDisputes] = useState([
    { id: 'txn1', label: 'IOCL Pune Refuel Discrepancy', amount: '₹12,500', type: 'Fuel Card', status: 'pending', desc: 'TRK-00012 pumped fuel twice within 1 hour. Suspected nozzle sensor error.' },
    { id: 'txn2', label: 'NH48 FASTag Toll Double-Debit', amount: '₹1,400', type: 'Toll plaza', status: 'pending', desc: 'FASTag gateway logged duplicate exits at Khalapur plaza.' },
    { id: 'txn3', label: 'Bridgestone GSTR-2B Mismatch', amount: '₹38,00,000', type: 'GST Credit', status: 'pending', desc: 'Transporter GSTR-2B ledger doesn\'t match purchase invoice.' }
  ]);

  // Level +100 Sales Agent States
  const [salesRebateRate, setSalesRebateRate] = useState(12);
  const [salesPipelineValue, setSalesPipelineValue] = useState(248);
  const [salesConversions, setSalesConversions] = useState(18.0);
  const [salesDeals, setSalesDeals] = useState([
    { id: 'deal1', label: 'Wipro Renewal Pitch', value: '₹4.5Cr', type: 'SLA Renewal', status: 'negotiating', desc: 'Safexpress pitching 12% lower rates. Wipro demanding volume discounts to renew.' },
    { id: 'deal2', label: 'Dabur Route Contract', value: '₹3.2Cr', type: 'Retention', status: 'at_risk', desc: 'SLA delay penalties causing negative sentiment. Booking volumes dropped by 32.4%.' },
    { id: 'deal3', label: 'Godrej Multimodal Bid', value: '₹5.8Cr', type: 'New Contract', status: 'negotiating', desc: 'Competitive bid submitted. Godrej requesting guaranteed capacity commitments.' }
  ]);

  // Level +100 HR Agent States
  const [hrFatigueThreshold, setHrFatigueThreshold] = useState(40);
  const [hrWorkforceSize, setHrWorkforceSize] = useState(1842);
  const [hrRosterCompliance, setHrRosterCompliance] = useState(98.2);
  const [hrDriverAlerts, setHrDriverAlerts] = useState([
    { id: 'hr1', label: 'Ashok Pandey Fatigue', value: '78% Fatigue', type: 'HOS Violation', status: 'warning', desc: 'Driver active for 11.5 hours without mandatory rest break. High microsleep risk.' },
    { id: 'hr2', label: 'Rajesh Kumar Credentials', value: 'Expiring in 12D', type: 'License Audit', status: 'action_required', desc: 'Commercial driver license expiring on July 07, 2026. Renewal notification pending.' },
    { id: 'hr3', label: 'Vikram Singh Harsh Braking', value: '5 Events Today', type: 'Safety Violation', status: 'warning', desc: 'IoT telemetry flagged 5 harsh deceleration sequences on ghat sections.' }
  ]);

  // Level +100 Supply Chain Agent States
  const [scTargetUtilization, setScTargetUtilization] = useState(88);
  const [scRouteEfficiency, setScRouteEfficiency] = useState(86.5);
  const [scActiveShipments, setScActiveShipments] = useState(89432);
  const [scRouteAlerts, setScRouteAlerts] = useState([
    { id: 'sc1', label: 'NH-48 Surat Bottleneck', value: 'Delay +1.5h', type: 'Corridor Congestion', status: 'warning', desc: 'Heavy traffic congestion near Surat. 5 en-route trucks affected.' },
    { id: 'sc2', label: 'JNPT Port Backlog', value: 'Dwell +3.2h', type: 'Terminal Backlog', status: 'warning', desc: 'Container terminal congestion at JNPT Mumbai. 12 trucks in queue.' },
    { id: 'sc3', label: 'Siliguri Corridor Blockage', value: 'Blocked Route', type: 'Weather/Monsoon', status: 'danger', desc: 'Landslide corridor blockage near Siliguri route. 4 trucks stalled.' }
  ]);

  // Level +100 Engineering Agent States
  const [engCpuThreshold, setEngCpuThreshold] = useState(75);
  const [engApiLatency, setEngApiLatency] = useState(23);
  const [engActiveGateways, setEngActiveGateways] = useState(3124500);
  const [engServerUptime, setEngServerUptime] = useState(99.98);
  const [engServerAlerts, setEngServerAlerts] = useState([
    { id: 'eng1', label: 'Mumbai-1 API Gateway Slowdown', value: 'Latency: 345ms', type: 'Microservice Delay', status: 'critical', desc: 'High container load detected at Mumbai edge gateway. Slowing down downstream telemetry pipelines.' },
    { id: 'eng2', label: 'TRK-00045 GPS Telemetry Fault', value: 'Sync Rate: 12%', type: 'IoT Telemetry Anomaly', status: 'warning', desc: 'GPS transceiver is transmitting invalid checksum signatures. Core telemetry engine flagging coordinates.' },
    { id: 'eng3', label: 'Elasticsearch Log Rotation Block', value: 'NVMe Space: 88%', type: 'Storage Leak', status: 'action_required', desc: 'Log index rotation cron has stalled. NVMe system partition running low on allocated space.' }
  ]);

  // Level +100 Executive Decision Agent States
  const [execAutonomyLevel, setExecAutonomyLevel] = useState(85);
  const [execRiskIndex, setExecRiskIndex] = useState(12);
  const [execMonthlyGrowth, setExecMonthlyGrowth] = useState(8.3);
  const [execOperatingMargin, setExecOperatingMargin] = useState(24.6);
  const [execStrategicDecisions, setExecStrategicDecisions] = useState([
    { id: 'dec1', label: 'Fuel Price Hike Surcharges', value: 'Impact: -₹1.2Cr/Mo', type: 'Cost Containment', status: 'pending', desc: 'Crude prices surging. Recommend introducing 2.5% shipper fuel surcharges to secure net margins.' },
    { id: 'dec2', label: 'Western Depot Land Expansion', value: 'CAPEX: ₹8.5Cr', type: 'Capital Allocation', status: 'pending', desc: 'Mumbai port volumes exceed threshold by 34%. Recommend acquiring 5-acre yard facility near JNPT.' },
    { id: 'dec3', label: 'Driver Mileage Retention Bonus', value: 'Attrition: 8.2%', type: 'HCM Risk', status: 'pending', desc: 'Driver shortage looming on long-haul routes. Recommend adjusting base mileage bonuses by +5%.' }
  ]);

  // Reconcile dispute handler
  const handleReconcileDispute = (disputeId) => {
    if (executingTool) return;
    const targetDispute = financeDisputes.find(d => d.id === disputeId);
    if (!targetDispute || targetDispute.status === 'reconciled') return;

    setExecutingTool(`Reconciling ${targetDispute.id}`);
    setConsoleLogs([
      `[FINANCE SENTINEL] Initiating trace on transaction ${disputeId}...`,
      `[FINANCE SENTINEL] Target anomaly: ${targetDispute.label} (${targetDispute.amount})`,
      `[TELEMETRY] Querying GPS coordinates and flow sensors for TRK-00012...`
    ]);

    setTimeout(() => {
      setConsoleLogs(prev => [...prev, `[AUDITING] Comparing invoice signatures with scanned receipts...`]);
    }, 600);

    setTimeout(() => {
      setConsoleLogs(prev => [...prev, `[RESOLVING] Discrepancy verified. Correcting ledger balances...`]);
    }, 1200);

    setTimeout(() => {
      setConsoleLogs(prev => [...prev, `[SUCCESS] Reconciled statefully! Credited savings index.`]);
      
      setFinanceDisputes(prev => prev.map(d => {
        if (d.id === disputeId) {
          return { ...d, status: 'reconciled' };
        }
        return d;
      }));

      setAgents(prev => prev.map(a => {
        if (a.id === 'finance') {
          return {
            ...a,
            tasksCompleted: a.tasksCompleted + 1,
            tasksInQueue: Math.max(a.tasksInQueue - 1, 0),
            lastAction: `Resolved dispute on ${targetDispute.label}`
          };
        }
        return a;
      }));

      const numVal = parseInt(targetDispute.amount.replace(/[^0-9]/g, ''), 10) || 0;
      setFinanceSavings(prev => prev + numVal);

      setExecutingTool(null);
      showToast(`Reconciled: ${targetDispute.label} (${targetDispute.amount})`);
    }, 1800);
  };

  // Reconcile/Negotiate sales deal handler
  const handleReconcileDeal = (dealId) => {
    if (executingTool) return;
    const targetDeal = salesDeals.find(d => d.id === dealId);
    if (!targetDeal || targetDeal.status === 'secured') return;

    setExecutingTool(`Negotiating ${targetDeal.id}`);
    setConsoleLogs([
      `[SALES COGNITION] Initiating negotiation sequence on ${dealId}...`,
      `[SALES COGNITION] Target opportunity: ${targetDeal.label} (${targetDeal.value})`,
      `[CRM INTEGRATION] Querying contract history and margin parameters...`
    ]);

    setTimeout(() => {
      setConsoleLogs(prev => [...prev, `[ANALYTICS] Simulating rebate match at current autopilot rate of ${salesRebateRate}%...`]);
    }, 600);

    setTimeout(() => {
      setConsoleLogs(prev => [...prev, `[CAPACITY] Allocating lane guarantee buffers to secure customer trust...`]);
    }, 1200);

    setTimeout(() => {
      setConsoleLogs(prev => [...prev, `[SUCCESS] Contract terms accepted! Appending secured value to active pipeline.`]);
      
      setSalesDeals(prev => prev.map(d => {
        if (d.id === dealId) {
          return { ...d, status: 'secured' };
        }
        return d;
      }));

      setAgents(prev => prev.map(a => {
        if (a.id === 'sales') {
          return {
            ...a,
            tasksCompleted: a.tasksCompleted + 1,
            tasksInQueue: Math.max(a.tasksInQueue - 1, 0),
            lastAction: `Secured contract for ${targetDeal.label}`
          };
        }
        return a;
      }));

      const numVal = parseFloat(targetDeal.value.replace(/[^0-9.]/g, '')) || 0;
      setSalesPipelineValue(prev => +(prev + numVal).toFixed(1));
      setSalesConversions(prev => +(prev + 1.2).toFixed(1));

      setExecutingTool(null);
      showToast(`Secured: ${targetDeal.label} (${targetDeal.value})`);
    }, 1800);
  };

  // Resolve HR driver alert handler
  const handleResolveDriverAlert = (alertId) => {
    if (executingTool) return;
    const targetAlert = hrDriverAlerts.find(a => a.id === alertId);
    if (!targetAlert || targetAlert.status === 'resolved' || targetAlert.status === 'resting') return;

    setExecutingTool(`Resolving ${targetAlert.id}`);
    
    let actionText = '';
    if (targetAlert.id === 'hr1') {
      actionText = 'Trigger Rest';
      setConsoleLogs([
        `[HR COMPLIANCE] Scanning Hours-of-Service logs for driver Ashok Pandey...`,
        `[HR COMPLIANCE] Target: ${targetAlert.label} (${targetAlert.value})`,
        `[ROSTER] Dispatching active shift relief driver...`
      ]);
    } else if (targetAlert.id === 'hr2') {
      actionText = 'Renew License';
      setConsoleLogs([
        `[CREDENTIALS AUDIT] Connecting to regional transport authority (RTO) gateway...`,
        `[CREDENTIALS AUDIT] Fetching license records for driver Rajesh Kumar...`,
        `[API] CDL verification pipeline initialized...`
      ]);
    } else {
      actionText = 'Assign Coaching';
      setConsoleLogs([
        `[SAFETY ACADEMY] Enrolling driver Vikram Singh in Defensive Driving course...`,
        `[SAFETY ACADEMY] Ingesting harsh braking telemetry vectors...`
      ]);
    }

    setTimeout(() => {
      if (targetAlert.id === 'hr1') {
        setConsoleLogs(prev => [...prev, `[ROSTER] Ashok Pandey set to OFF DUTY status. Standby driver dispatched.`]);
      } else if (targetAlert.id === 'hr2') {
        setConsoleLogs(prev => [...prev, `[SUCCESS] CDL renewal payment verified. Database expiry date extended +5 years.`]);
      } else {
        setConsoleLogs(prev => [...prev, `[SUCCESS] Safety module assigned. Auto-notification sent to driver mobile app.`]);
      }
    }, 600);

    setTimeout(() => {
      if (targetAlert.id === 'hr1') {
        setConsoleLogs(prev => [...prev, `[SAFETY] Fatigue index reset to 5%. Driver locked from dispatch for 24 hours.`]);
      } else {
        setConsoleLogs(prev => [...prev, `[HR GATEWAY] Database record synchronized. Compliance checklists verified.`]);
      }
    }, 1200);

    setTimeout(() => {
      setConsoleLogs(prev => [...prev, `[SUCCESS] Driver compliance alert resolved successfully!`]);
      
      setHrDriverAlerts(prev => prev.map(a => {
        if (a.id === alertId) {
          return { ...a, status: targetAlert.id === 'hr1' ? 'resting' : 'resolved' };
        }
        return a;
      }));

      setAgents(prev => prev.map(a => {
        if (a.id === 'hr') {
          return {
            ...a,
            tasksCompleted: a.tasksCompleted + 1,
            tasksInQueue: Math.max(a.tasksInQueue - 1, 0),
            lastAction: `Resolved safety/compliance warning: ${targetAlert.label}`
          };
        }
        return a;
      }));

      if (targetAlert.id === 'hr1') {
        setHrRosterCompliance(prev => +(prev + 0.8).toFixed(1));
      } else if (targetAlert.id === 'hr2') {
        setHrWorkforceSize(prev => prev + 1);
      } else {
        setHrRosterCompliance(prev => +(prev + 0.4).toFixed(1));
      }

      setExecutingTool(null);
      showToast(`Resolved: ${targetAlert.label}`);
    }, 1800);
  };

  // Resolve Supply Chain route alert handler
  const handleResolveRouteAlert = (alertId) => {
    if (executingTool) return;
    const targetAlert = scRouteAlerts.find(a => a.id === alertId);
    if (!targetAlert || targetAlert.status === 'resolved' || targetAlert.status === 'rerouted' || targetAlert.status === 'rescheduled' || targetAlert.status === 'bypassed') return;

    setExecutingTool(`Resolving ${targetAlert.id}`);
    
    if (targetAlert.id === 'sc1') {
      setConsoleLogs([
        `[ROUTE MONITOR] Fetching real-time traffic vectors for NH-48 near Surat...`,
        `[ROUTE MONITOR] Anomaly detected: speed drops to 12 km/h. Affected trucks: 5.`,
        `[OPTIMIZER] Calculating green routing bypass via SH-14 highway...`
      ]);
    } else if (targetAlert.id === 'sc2') {
      setConsoleLogs([
        `[JNPT GATEWAY] Connecting to JNPT container terminal queue API...`,
        `[JNPT GATEWAY] Scanned 12 en-route trucks waiting in yard staging queue...`,
        `[OPTIMIZER] Re-scheduling gate-in appointments with port managers...`
      ]);
    } else {
      setConsoleLogs([
        `[WEATHER WATCH] Monitoring monsoon landslide blocks on Siliguri corridors...`,
        `[WEATHER WATCH] Blockage confirmed on SH-31. Stalled trucks: 4.`,
        `[OPTIMIZER] Generating alternative multimodal rail-freight relay schedules...`
      ]);
    }

    setTimeout(() => {
      if (targetAlert.id === 'sc1') {
        setConsoleLogs(prev => [...prev, `[OPTIMIZER] SH-14 bypass route confirmed. Transit time savings: 45 min per truck.`]);
      } else if (targetAlert.id === 'sc2') {
        setConsoleLogs(prev => [...prev, `[SUCCESS] 12 yard queue gate-in slots rescheduled for off-peak night hours.`]);
      } else {
        setConsoleLogs(prev => [...prev, `[SUCCESS] Multimodal rail relays booked. 4 container loads dispatched via rail.`]);
      }
    }, 600);

    setTimeout(() => {
      if (targetAlert.id === 'sc1') {
        setConsoleLogs(prev => [...prev, `[GPS TICK] Transmitting route update code to 5 active vehicle navigation displays.`]);
      } else {
        setConsoleLogs(prev => [...prev, `[LEDGER] Reroute transactions synced. Port container manifests updated.`]);
      }
    }, 1200);

    setTimeout(() => {
      setConsoleLogs(prev => [...prev, `[SUCCESS] Route bottleneck alert resolved successfully!`]);
      
      setScRouteAlerts(prev => prev.map(a => {
        if (a.id === alertId) {
          return { ...a, status: targetAlert.id === 'sc1' ? 'rerouted' : targetAlert.id === 'sc2' ? 'rescheduled' : 'bypassed' };
        }
        return a;
      }));

      setAgents(prev => prev.map(a => {
        if (a.id === 'supply_chain') {
          return {
            ...a,
            tasksCompleted: a.tasksCompleted + 1,
            tasksInQueue: Math.max(a.tasksInQueue - 1, 0),
            lastAction: `Resolved route backlog: ${targetAlert.label}`
          };
        }
        return a;
      }));

      if (targetAlert.id === 'sc1') {
        setScRouteEfficiency(prev => +(prev + 1.2).toFixed(1));
      } else if (targetAlert.id === 'sc2') {
        setScActiveShipments(prev => prev + 12);
      } else {
        setScRouteEfficiency(prev => +(prev + 1.8).toFixed(1));
      }

      setExecutingTool(null);
      showToast(`Resolved: ${targetAlert.label}`);
    }, 1800);
  };

  // Resolve Engineering Server Alert handler
  const handleResolveServerAlert = (alertId) => {
    if (executingTool) return;
    const targetAlert = engServerAlerts.find(a => a.id === alertId);
    if (!targetAlert || targetAlert.status === 'resolved') return;

    setExecutingTool(`Resolving ${targetAlert.id}`);

    if (alertId === 'eng1') {
      setConsoleLogs([
        `[DEVOPS Sentinel] Connecting to Mumbai-1 API Gateway...`,
        `[DEVOPS Sentinel] Initiating container replication diagnostic...`,
        `[CONTAINER] Inspecting load distribution across active pods...`
      ]);
    } else if (alertId === 'eng2') {
      setConsoleLogs([
        `[IOT SENSOR] Poking TRK-00045 GPS gateway buffer...`,
        `[IOT SENSOR] Capturing telemetry data packets for checksum validation...`,
        `[TELEMETRY] Querying GPS buffer stream for corrupt bytes...`
      ]);
    } else {
      setConsoleLogs([
        `[STORAGE AUDIT] Inspecting Elasticsearch NVMe storage pool...`,
        `[STORAGE AUDIT] Analyzing log index rotation schedule...`,
        `[CRON] Locating stalled rotation process...`
      ]);
    }

    setTimeout(() => {
      if (alertId === 'eng1') {
        setConsoleLogs(prev => [...prev, `[DEVOPS] Replicating docker container instances: Spawning +3 API containers...`]);
      } else if (alertId === 'eng2') {
        setConsoleLogs(prev => [...prev, `[IOT] Resetting transceiver buffer. Re-transmitting coordinates telemetry...`]);
      } else {
        setConsoleLogs(prev => [...prev, `[STORAGE] Flushing NVMe write-ahead log logs. Re-indexing completed.`]);
      }
    }, 600);

    setTimeout(() => {
      if (alertId === 'eng1') {
        setConsoleLogs(prev => [...prev, `[SUCCESS] Edge gateway latency stabilized. Ingestion traffic balanced.`]);
      } else if (alertId === 'eng2') {
        setConsoleLogs(prev => [...prev, `[SUCCESS] Telemetry checksum matches. GPS Sync rate recovered to 100%.`]);
      } else {
        setConsoleLogs(prev => [...prev, `[SUCCESS] Free space restored on NVMe drive. Index cron restarted.`]);
      }
    }, 1200);

    setTimeout(() => {
      setConsoleLogs(prev => [...prev, `[SUCCESS] Engineering server alert resolved statefully!`]);

      setEngServerAlerts(prev => prev.map(a => {
        if (a.id === alertId) {
          return { ...a, status: 'resolved' };
        }
        return a;
      }));

      setAgents(prev => prev.map(a => {
        if (a.id === 'engineering') {
          return {
            ...a,
            tasksCompleted: a.tasksCompleted + 1,
            tasksInQueue: Math.max(a.tasksInQueue - 1, 0),
            lastAction: `Resolved server incident: ${targetAlert.label}`
          };
        }
        return a;
      }));

      if (alertId === 'eng1') {
        setEngApiLatency(15);
      } else if (alertId === 'eng2') {
        setEngActiveGateways(prev => prev + 1);
      } else {
        setEngServerUptime(99.99);
      }

      setExecutingTool(null);
      showToast(`Resolved: ${targetAlert.label}`);
    }, 1800);
  };

  // Scale Up Nodes handler
  const handleScaleUpNodes = () => {
    if (executingTool) return;
    setExecutingTool('Scaling API Nodes');
    setConsoleLogs([
      `[LOAD BALANCER] Connecting to load balancer gateway...`,
      `[LOAD BALANCER] Initiating system scaling command...`
    ]);

    setTimeout(() => {
      setConsoleLogs(prev => [
        ...prev,
        `[DEVOPS Sentinel] Scaled API container nodes. p99 Ingestion Latency reduced from ${engApiLatency}ms to 14ms.`
      ]);
      setEngApiLatency(14);

      setAgents(prev => prev.map(a => {
        if (a.id === 'engineering') {
          return {
            ...a,
            tasksCompleted: a.tasksCompleted + 1,
            lastAction: 'Manually scaled API gateways clusters (+4 nodes)'
          };
        }
        return a;
      }));

      setExecutingTool(null);
      showToast('API gateways manually scaled to 14ms Latency!');
    }, 800);
  };

  // Approve Executive Decision handler
  const handleApproveDecision = (decisionId) => {
    if (executingTool) return;
    const targetDecision = execStrategicDecisions.find(d => d.id === decisionId);
    if (!targetDecision || targetDecision.status === 'approved') return;

    setExecutingTool(`Approving ${targetDecision.id}`);

    if (decisionId === 'dec1') {
      setConsoleLogs([
        `[STRATEGY ENGINE] Analysing fuel surcharge implications...`,
        `[FINANCIALS] Calculating yield protection margin offsets...`,
        `[LEDGER] Adjusting shipping base tariff multipliers by +2.5%...`
      ]);
    } else if (decisionId === 'dec2') {
      setConsoleLogs([
        `[CAPITAL ALLOCATION] Querying Mumbai depot expansion plans...`,
        `[CAPITAL ALLOCATION] Reserving ₹8.5Cr CAPEX from strategic reserves...`,
        `[REGISTRY] Initiating land procurement documentation near JNPT port...`
      ]);
    } else {
      setConsoleLogs([
        `[HCM AUDIT] Analyzing driver mileage attrition statistics...`,
        `[HCM AUDIT] Adjusting commercial base mileage bonuses by +5%...`,
        `[API] Connecting to Darwinbox payroll APIs...`
      ]);
    }

    setTimeout(() => {
      if (decisionId === 'dec1') {
        setConsoleLogs(prev => [...prev, `[SUCCESS] 2.5% fuel surcharges active on all customer portals.`]);
      } else if (decisionId === 'dec2') {
        setConsoleLogs(prev => [...prev, `[SUCCESS] Land contract approved. Mumbai yard capacity increased by +2,500 containers.`]);
      } else {
        setConsoleLogs(prev => [...prev, `[SUCCESS] Base mileage bonus active. Expected attrition reduction: -4.2%.`]);
      }
    }, 600);

    setTimeout(() => {
      if (decisionId === 'dec1') {
        setConsoleLogs(prev => [...prev, `[SUCCESS] Net monthly cost impact mitigated. Risk index stabilized.`]);
      } else if (decisionId === 'dec2') {
        setConsoleLogs(prev => [...prev, `[SUCCESS] Asset registration complete. Western region capacity unlocked.`]);
      } else {
        setConsoleLogs(prev => [...prev, `[SUCCESS] Driver attendance and roster compliance synchronized.`]);
      }
    }, 1200);

    setTimeout(() => {
      setConsoleLogs(prev => [...prev, `[SUCCESS] Executive decision approved statefully!`]);

      setExecStrategicDecisions(prev => prev.map(d => {
        if (d.id === decisionId) {
          return { ...d, status: 'approved' };
        }
        return d;
      }));

      setAgents(prev => prev.map(a => {
        if (a.id === 'executive') {
          return {
            ...a,
            tasksCompleted: a.tasksCompleted + 1,
            tasksInQueue: Math.max(a.tasksInQueue - 1, 0),
            lastAction: `Approved strategic decision: ${targetDecision.label}`
          };
        }
        return a;
      }));

      if (decisionId === 'dec1') {
        setExecOperatingMargin(26.2);
        setExecRiskIndex(prev => Math.max(prev - 4, 2));
      } else if (decisionId === 'dec2') {
        setExecMonthlyGrowth(9.8);
      } else {
        setExecRiskIndex(prev => Math.max(prev - 3, 2));
      }

      setExecutingTool(null);
      showToast(`Approved: ${targetDecision.label}`);
    }, 1800);
  };

  // Run Risk Audit handler
  const handleRunRiskAudit = () => {
    if (executingTool) return;
    setExecutingTool('Auditing Risks');
    setConsoleLogs([
      `[RISK ANALYTICS] Scanning regional cost variance databases...`,
      `[RISK ANALYTICS] Ingesting competitor pricing vectors...`
    ]);

    setTimeout(() => {
      setConsoleLogs(prev => [
        ...prev,
        `[STRATEGY ENGINE] Audit complete. Enterprise risk index verified at ${execRiskIndex}%.`
      ]);

      setAgents(prev => prev.map(a => {
        if (a.id === 'executive') {
          return {
            ...a,
            tasksCompleted: a.tasksCompleted + 1,
            lastAction: 'Executed strategic risk audit scan'
          };
        }
        return a;
      }));

      setExecutingTool(null);
      showToast('Strategic risk audit executed successfully!');
    }, 800);
  };

  // Fund escrow account handler
  const handleFundEscrow = () => {
    if (executingTool) return;
    setExecutingTool('Funding Escrow');
    setConsoleLogs([
      `[SYSTEM] Connecting to ScyllaDB ledger pool...`,
      `[SYSTEM] Executing payment transfer command to YES Bank API...`
    ]);

    setTimeout(() => {
      setConsoleLogs(prev => [
        ...prev,
        `[FINANCE SENTINEL] Transferred ₹50,000. Active ledger balance updated to ₹${(financeLedgerBalance + 0.005).toFixed(3)}Cr.`
      ]);
      setFinanceLedgerBalance(prev => prev + 0.005);
      
      setAgents(prev => prev.map(a => {
        if (a.id === 'finance') {
          return {
            ...a,
            tasksCompleted: a.tasksCompleted + 1,
            lastAction: 'Funded carrier escrow account with ₹50,000'
          };
        }
        return a;
      }));

      setExecutingTool(null);
      showToast('Escrow account funded with ₹50,000');
    }, 800);
  };
  
  // Execution Console State
  const [executingTool, setExecutingTool] = useState(null); // tool name
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const selectedAgent = useMemo(() => {
    if (!selectedAgentId) return null;
    return agents.find(a => a.id === selectedAgentId);
  }, [selectedAgentId, agents]);

  const extendedDetails = useMemo(() => {
    if (!selectedAgentId) return null;
    return aiAgentsExtendedData[selectedAgentId];
  }, [selectedAgentId]);

  // Compute summary stats
  const summary = useMemo(() => {
    const totalTasks = agents.reduce((s, a) => s + a.tasksCompleted, 0);
    const inQueue = agents.reduce((s, a) => s + a.tasksInQueue, 0);
    const avgSuccess = +(agents.reduce((s, a) => s + a.successRate, 0) / agents.length).toFixed(1);
    const activeCount = agents.filter(a => a.status === 'active').length;
    const totalCount = agents.length;
    return { totalTasks, inQueue, avgSuccess, activeCount, totalCount };
  }, [agents]);

  // Build global timeline from all agents
  const timeline = useMemo(() => {
    return agents
      .flatMap(agent =>
        agent.recentActions.map(action => ({ ...action, agentName: agent.name, agentColor: agent.color, agentIcon: agent.icon }))
      )
      .sort((a, b) => {
        const parseTime = t => {
          const n = parseFloat(t);
          if (t.includes('min')) return n;
          if (t.includes('h')) return n * 60;
          return n * 60;
        };
        return parseTime(a.time) - parseTime(b.time);
      })
      .slice(0, 10);
  }, [agents]);

  // Manually execute an agent tool
  const handleExecuteTool = (tool) => {
    if (executingTool) return;
    setExecutingTool(tool.name);
    
    if (selectedAgentId === 'finance') {
      if (tool.name === "Run Toll Audit Scan") {
        setConsoleLogs([
          `[SYSTEM] Connecting to national FASTag toll plaza gateway...`,
          `[AUDIT] Scanning 342 transactions for vehicle route mismatches...`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[PROCESSING] Checking GPS coordinates against toll timestamps...`]);
        }, 600);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[COMPLIANCE] Verified 340 valid debits. Identified 2 duplicate exits.`]);
        }, 1200);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[RESOLVED] Discrepancy of ₹23,000 corrected statefully on the ledger.`]);
          setFinanceSavings(prev => prev + 23000);
          setAgents(prev => prev.map(a => {
            if (a.id === 'finance') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                tasksInQueue: Math.max(a.tasksInQueue - 1, 0),
                lastAction: 'Corrected FASTag toll plazas discrepancy worth ₹23,000'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("FASTag Toll Audit scan resolved discrepancies worth ₹23,000!");
        }, 1800);
        return;
      }
      
      if (tool.name === "Process Fuel Payments") {
        setConsoleLogs([
          `[SYSTEM] Authorizing corporate fuel cards balance pool transfer...`,
          `[LEDGER] Routing ₹8.4L token batch to HPCL & IOCL cards...`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[SECURITY] Verifying OTP biometric signatures of fleet managers...`]);
        }, 600);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[SUCCESS] Payments settled. Refuel limits re-authorized for 89 active trucks.`]);
          setFinanceLedgerBalance(prev => +(prev - 0.084).toFixed(3));
          setAgents(prev => prev.map(a => {
            if (a.id === 'finance') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                lastAction: 'Dispatched corporate fuel payments worth ₹8.4L'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("Processed batch fuel card payments worth ₹8.4L!");
        }, 1200);
        return;
      }

      if (tool.name === "Verify GST Compliance") {
        setConsoleLogs([
          `[SYSTEM] Connecting to GSTR-2B compliance registry via API...`,
          `[AUDIT] Ingesting corporate parts invoice files...`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[COMPLIANCE] Checking tax mismatch exceptions under GSTR-2B...`]);
        }, 600);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[SUCCESS] 98.2% GST matching rate verified. Accrued input credits synced.`]);
          setAgents(prev => prev.map(a => {
            if (a.id === 'finance') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                lastAction: 'Verified GST ledger compliance (98.2% rate)'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("GST GSTR-2B compliance verified successfully!");
        }, 1200);
        return;
      }

      if (tool.name === "Detect Fuel Siphoning") {
        setConsoleLogs([
          `[SYSTEM] Scanning fuel level sensors across all active trucks...`,
          `[ANALYTICS] Running gradient siphoning detection algorithm...`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[TELEMETRY] Comparing fuel drop angles en-route vs static coordinates...`]);
        }, 600);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[ALERT] 0 siphoning indicators detected. Fuel thrift profiles normal.`]);
          setAgents(prev => prev.map(a => {
            if (a.id === 'finance') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                lastAction: 'Scanned active fleet for fuel siphoning anomalies'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("Fuel siphoning scan completed. 0 threats detected.");
        }, 1200);
        return;
      }
    } else if (selectedAgentId === 'sales') {
      if (tool.name === "Run Churn Analysis") {
        setConsoleLogs([
          `[CRM ANALYTICS] Scanning VIP customer accounts database...`,
          `[CHURN DETECT] Flagged Dabur (CUS-008) at 85% risk due to a 32.4% booking drop.`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[ACTION] Generated rebate recommendation: 15% lane discount code.`]);
        }, 600);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[SUCCESS] Churn risk report processed. Retention cards refreshed in CRM.`]);
          setAgents(prev => prev.map(a => {
            if (a.id === 'sales') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                tasksInQueue: Math.max(a.tasksInQueue - 1, 0),
                lastAction: 'Ran VIP customer churn analytics scan'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("Churn analysis complete. Flagged 1 high-risk VIP account.");
        }, 1200);
        return;
      }

      if (tool.name === "Generate Renewal Reminders") {
        setConsoleLogs([
          `[CONTRACTS] Querying expiring service agreements...`,
          `[CLIENT MANAGER] Drafting terms for Wipro Transport (proposal pending).`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[SUCCESS] Dispatched 8 automated email reminders with renewed rates.`]);
          setAgents(prev => prev.map(a => {
            if (a.id === 'sales') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                lastAction: 'Sent contract renewal reminders to 8 accounts'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("Dispatched contract renewal reminders successfully!");
        }, 1000);
        return;
      }

      if (tool.name === "Optimize Spot Rate Bids") {
        setConsoleLogs([
          `[MARKET ANALYSIS] Fetching Spot Rate index values from GatiFleet Terminal...`,
          `[OPTIMIZER] Comparing bid pricing with owned capacity curves...`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[SUCCESS] Adjusted spot pricing by -2.5% for Western corridor bids, increasing match chance by 18%.`]);
          setAgents(prev => prev.map(a => {
            if (a.id === 'sales') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                lastAction: 'Optimized spot rate bids for Western corridor'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("Optimized spot rates for 12 open bidding tenders!");
        }, 1200);
        return;
      }

      if (tool.name === "Analyze Competitor Intelligence") {
        setConsoleLogs([
          `[INTELLIGENCE] Scraping competitor freight quotes (Safexpress, Delhivery, BlackBuck)...`,
          `[COMPETITOR ANALYTICS] Found competitor pitch to Wipro at ₹42,000 per round-trip.`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[ACTION] Recommended action code: Offer capacity guarantee to counter pitch.`]);
          setAgents(prev => prev.map(a => {
            if (a.id === 'sales') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                lastAction: 'Analyzed competitor quote patterns'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("Competitor pricing scan completed. 1 threat flagged.");
        }, 1200);
        return;
      }
    } else if (selectedAgentId === 'hr') {
      if (tool.name === "Scan License Expiries") {
        setConsoleLogs([
          `[CREDENTIALS] Initiating scan of commercial driver licenses...`,
          `[AUDIT] Scanned 1,842 driver database records...`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[SUCCESS] 2 CDL licenses expiring under 30 days. Auto-notifications dispatched.`]);
          setAgents(prev => prev.map(a => {
            if (a.id === 'hr') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                lastAction: 'Audited commercial driver credentials'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("Audited driver licenses. 2 expiring notifications sent.");
        }, 1200);
        return;
      }

      if (tool.name === "Roster Shift Audit") {
        setConsoleLogs([
          `[ROSTER] Auditing July 2026 route rosters for shift vacancies...`,
          `[ROSTER] Found 3 unassigned shift slots on Pune-Bangalore corridors.`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[SUCCESS] Auto-matched and assigned 3 standby drivers. Roster compliance secured.`]);
          setAgents(prev => prev.map(a => {
            if (a.id === 'hr') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                lastAction: 'Audited and filled roster vacancies'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("Roster audit complete. Filled 3 shift vacancies.");
        }, 1200);
        return;
      }

      if (tool.name === "Run Fatigue Risk Scan") {
        setConsoleLogs([
          `[TELEMETRY] Querying Hours-of-Service (HOS) data for active fleet...`,
          `[BIOMETRICS] Pulling real-time fatigue indexes from driver mobile apps...`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[ALERT] Ashok Pandey fatigue index at 78% (high risk). Roster block recommended.`]);
          setAgents(prev => prev.map(a => {
            if (a.id === 'hr') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                tasksInQueue: Math.max(a.tasksInQueue - 1, 0),
                lastAction: 'Ran real-time driver fatigue risk scan'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("Fatigue scan completed. 1 high-risk driver flagged.");
        }, 1200);
        return;
      }

      if (tool.name === "Simulate Shift Dispatch") {
        setConsoleLogs([
          `[DISPATCH] Simulating shift routing permutations for next 24 hours...`,
          `[DISPATCH] Minimizing back-to-back night shift assignments...`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[SUCCESS] Roster plan simulated. Fatigue exposure reduced by 14.5% across fleet.`]);
          setAgents(prev => prev.map(a => {
            if (a.id === 'hr') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                lastAction: 'Simulated fatigue-minimized shift dispatches'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("Roster shift dispatch simulated successfully.");
        }, 1200);
        return;
      }
    } else if (selectedAgentId === 'supply_chain') {
      if (tool.name === "Recalculate Route Optimization") {
        setConsoleLogs([
          `[ROUTE] Scanning GPS telemetry variables for 487,621 active trucks...`,
          `[OPTIMIZER] Identifying congestion vectors on national corridors...`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[SUCCESS] Rerouted 8 trucks around NH48 bottleneck. Estimated transit saving: 45 min per vehicle.`]);
          setAgents(prev => prev.map(a => {
            if (a.id === 'supply_chain') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                lastAction: 'Rerouted 8 trucks around NH48 bottleneck'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("Route optimization completed. Rerouted 8 trucks.");
        }, 1200);
        return;
      }

      if (tool.name === "Match Idle Trucks") {
        setConsoleLogs([
          `[CAPACITY] Scanning regional depots for idle carrier trucks...`,
          `[LOAD MATCH] Ingesting pending freight orders from CRM ledger...`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[SUCCESS] Matched 14 idle trucks with pending cargo loads in Mumbai and Bangalore hubs.`]);
          setAgents(prev => prev.map(a => {
            if (a.id === 'supply_chain') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                lastAction: 'Matched 14 idle trucks with pending cargo'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("Match idle trucks complete. Dispatched 14 loads.");
        }, 1200);
        return;
      }

      if (tool.name === "Run Corridor Load Balance") {
        setConsoleLogs([
          `[LANE ANALYSIS] Monitoring lane volumes on Western vs Northern corridors...`,
          `[LOAD BALANCE] Shifted 18% cargo volumes to alternative railway relay lanes...`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[SUCCESS] Lane volume balanced. Peak-hour corridor congestion risk reduced by 22%.`]);
          setAgents(prev => prev.map(a => {
            if (a.id === 'supply_chain') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                lastAction: 'Balanced corridor load distributions'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("Corridor load balancing completed successfully.");
        }, 1200);
        return;
      }

      if (tool.name === "Forecast Regional Demand") {
        setConsoleLogs([
          `[DEMAND DETECT] Scraping regional booking signals and monsoon indicators...`,
          `[FORECAST] Processing 30-day forecast curves for Gujarat and Maharashtra hubs...`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[SUCCESS] Demand maps refreshed. Projected +14% capacity requirement in Western hubs.`]);
          setAgents(prev => prev.map(a => {
            if (a.id === 'supply_chain') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                lastAction: 'Generated 30-day regional demand forecast'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("Demand forecast maps updated.");
        }, 1200);
        return;
      }
    } else if (selectedAgentId === 'engineering') {
      if (tool.name === "IoT Sensor Health Scan") {
        setConsoleLogs([
          `[SYSTEM] Connecting to IoT Gateway cluster controller...`,
          `[SCAN] Auditing 3,124,500 active telemetry sensors...`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[PROCESSING] Measuring signal strength & gateway packet latency...`]);
        }, 600);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[AUDIT] Found 2 malfunctioning edge gateways on North-East corridor.`]);
        }, 1200);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[RESOLVED] Anomaly logged. Subsystems flagged for workshop replacement.`]);
          setAgents(prev => prev.map(a => {
            if (a.id === 'engineering') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                tasksInQueue: Math.max(a.tasksInQueue - 1, 0),
                lastAction: 'Completed IoT Sensor Health Scan across 3.1M gateways'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("IoT Sensor Health Scan completed successfully!");
        }, 1800);
        return;
      }

      if (tool.name === "Firmware Update Dispatch") {
        setConsoleLogs([
          `[SYSTEM] Connecting to OTA update deployment coordinator...`,
          `[DEPLOY] Initializing firmware v3.4.1 batch update to 12,000 devices...`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[PROCESSING] Uploading payload signatures. Broadcasting to gateway fleet...`]);
        }, 600);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[SUCCESS] Firmware packages installed. Success rate: 99.8%.`]);
          setAgents(prev => prev.map(a => {
            if (a.id === 'engineering') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                lastAction: 'Deployed firmware update v3.4.1 to 12K devices'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("Firmware v3.4.1 update dispatched successfully!");
        }, 1200);
        return;
      }

      if (tool.name === "Flush Database Logs") {
        setConsoleLogs([
          `[SYSTEM] Connecting to ScyllaDB and Elasticsearch cluster nodes...`,
          `[FLUSH] Scanning system NVMe partitions for log buildup...`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[PROCESSING] Rotating index files. Compressing archive log storage...`]);
        }, 600);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[SUCCESS] Re-indexed database clusters. NVMe storage partition cleared.`]);
          setEngServerUptime(99.99);
          setEngServerAlerts(prev => prev.map(a => {
            if (a.id === 'eng3') return { ...a, status: 'resolved' };
            return a;
          }));
          setAgents(prev => prev.map(a => {
            if (a.id === 'engineering') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                tasksInQueue: Math.max(a.tasksInQueue - 1, 0),
                lastAction: 'Flushed write-ahead database logs, freeing storage'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("Database log flush and rotation completed!");
        }, 1200);
        return;
      }

      if (tool.name === "Autoscale Server Nodes") {
        setConsoleLogs([
          `[SYSTEM] Connecting to Kubernetes edge ingress controller...`,
          `[SCALE] Inspecting edge request routing metrics...`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[PROCESSING] Spawning microservice containers. Balancing edge TCP nodes...`]);
        }, 600);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[SUCCESS] Kubernetes scaled edge gateways to +4 nodes. Latency stabilized.`]);
          setEngApiLatency(14);
          setEngServerAlerts(prev => prev.map(a => {
            if (a.id === 'eng1') return { ...a, status: 'resolved' };
            return a;
          }));
          setAgents(prev => prev.map(a => {
            if (a.id === 'engineering') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                tasksInQueue: Math.max(a.tasksInQueue - 1, 0),
                lastAction: 'Auto-scaled central edge ingestion microservices'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("Edge server nodes scaled successfully!");
        }, 1200);
        return;
      }
    } else if (selectedAgentId === 'executive') {
      if (tool.name === "Run Strategic Risk Assessment") {
        setConsoleLogs([
          `[SYSTEM] Connecting to risk intelligence databases...`,
          `[RISK] Auditing enterprise revenue leakage & cost indices...`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[PROCESSING] Inspecting current fuel surcharge recovery matrices...`]);
        }, 600);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[AUDIT] Risk indices analyzed. Strategic Risk Index locked at Low (${execRiskIndex}%).`]);
        }, 1200);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[SUCCESS] Assessment report generated and uploaded to secure PDF directory.`]);
          setAgents(prev => prev.map(a => {
            if (a.id === 'executive') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                tasksInQueue: Math.max(a.tasksInQueue - 1, 0),
                lastAction: 'Ran corporate strategic risk assessment audit'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("Strategic Risk Assessment completed!");
        }, 1800);
        return;
      }

      if (tool.name === "Generate Board Summary") {
        setConsoleLogs([
          `[SYSTEM] Syncing quarterly KPIs across ERP, CRM and HCM databases...`,
          `[BOARD] Compiling Q2 strategic performance summaries for board members...`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[PROCESSING] Generating revenue yields, SLA levels, and compliance logs...`]);
        }, 600);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[SUCCESS] Board summary report compiled and queued for CEO approval.`]);
          setAgents(prev => prev.map(a => {
            if (a.id === 'executive') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                lastAction: 'Generated board-ready monthly performance report'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("Executive Board Summary generated successfully!");
        }, 1200);
        return;
      }

      if (tool.name === "Analyze Market Competitors") {
        setConsoleLogs([
          `[SYSTEM] Ingesting competitor shipping tariffs and spot rate indices...`,
          `[MARKET] Running competitive corridor pricing analysis...`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[PROCESSING] Comparing owned tariff margins vs Safexpress and BlackBuck indexes...`]);
        }, 600);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[SUCCESS] Peak-hour price adjustments calculated. Recommendations generated.`]);
          setExecMonthlyGrowth(prev => +(prev + 0.4).toFixed(1));
          setAgents(prev => prev.map(a => {
            if (a.id === 'executive') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                tasksInQueue: Math.max(a.tasksInQueue - 1, 0),
                lastAction: 'Completed competitor market pricing analytics scan'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("Competitor pricing scan completed!");
        }, 1200);
        return;
      }

      if (tool.name === "Optimize Capital Ratios") {
        setConsoleLogs([
          `[SYSTEM] Accessing corporate treasury balance statements...`,
          `[CAPITAL] Calculating working capital optimization targets...`
        ]);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[PROCESSING] Adjusting accounts receivable timelines vs accounts payable cycles...`]);
        }, 600);
        setTimeout(() => {
          setConsoleLogs(prev => [...prev, `[SUCCESS] Capital reserves allocation optimized. Working capital cycles reduced.`]);
          setExecOperatingMargin(prev => +(prev + 0.6).toFixed(1));
          setAgents(prev => prev.map(a => {
            if (a.id === 'executive') {
              return {
                ...a,
                tasksCompleted: a.tasksCompleted + 1,
                tasksInQueue: Math.max(a.tasksInQueue - 1, 0),
                lastAction: 'Optimized working capital allocation ratios'
              };
            }
            return a;
          }));
          setExecutingTool(null);
          showToast("Working capital ratios optimized!");
        }, 1200);
        return;
      }
    }

    setConsoleLogs([
      `[SYSTEM] Initializing Agent Tool: ${tool.name}...`,
      `[SYSTEM] Binding reasoning engine variables...`
    ]);

    setTimeout(() => {
      setConsoleLogs(prev => [...prev, `[PROCESSING] Core routine loaded. Action: ${tool.actionText}`]);
    }, 800);

    setTimeout(() => {
      setConsoleLogs(prev => [...prev, `[AUDITING] Validation telemetry variables: Success.`]);
    }, 1600);

    setTimeout(() => {
      setConsoleLogs(prev => [...prev, `[SUCCESS] Automated execute sequence finished. Task registry updated.`]);
      
      setAgents(prev => prev.map(a => {
        if (a.id === selectedAgentId) {
          return {
            ...a,
            tasksCompleted: a.tasksCompleted + 1,
            tasksInQueue: Math.max(a.tasksInQueue - 1, 0),
            lastAction: `Manual execution: ${tool.name} successfully run.`
          };
        }
        return a;
      }));

      setExecutingTool(null);
      showToast(`AI ${selectedAgent.name} successfully executed tool: ${tool.name}`);
    }, 2400);
  };

  // ---- Styles ----
  const styles = {
    page: {
      minHeight: '100vh',
      padding: '32px',
      background: 'var(--bg-900)',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-primary)',
    },
    header: {
      marginBottom: '32px',
    },
    titleRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '6px',
    },
    titleIcon: {
      width: 48, height: 48,
      borderRadius: 'var(--radius-md)',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 24px rgba(99,102,241,0.3)',
    },
    title: {
      fontSize: '28px',
      fontWeight: 800,
      background: 'linear-gradient(135deg, #e0e0e0, #818cf8)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-0.5px',
    },
    subtitle: {
      fontSize: '14px',
      color: 'var(--text-secondary)',
      marginLeft: '64px',
    },
    liveIndicator: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      marginLeft: '16px',
      padding: '4px 12px',
      borderRadius: '20px',
      background: 'rgba(56,206,60,0.1)',
      border: '1px solid rgba(56,206,60,0.25)',
      fontSize: '11px',
      fontWeight: 600,
      color: '#38CE3C',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
    },
    liveDot: {
      width: 8, height: 8,
      borderRadius: '50%',
      background: '#38CE3C',
      animation: 'gati-status-dot 2s ease-in-out infinite',
      color: '#38CE3C',
    },

    // Summary bar
    summaryBar: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '32px',
    },
    summaryCard: {
      background: 'var(--surface)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--surface-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    summaryIconWrap: (color) => ({
      width: 44, height: 44,
      borderRadius: 'var(--radius-md)',
      background: `${color}18`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }),
    summaryLabel: {
      fontSize: '12px',
      color: 'var(--text-muted)',
      marginBottom: '2px',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    summaryValue: {
      fontSize: '24px',
      fontWeight: 800,
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-primary)',
    },

    // Agent grid
    agentGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px',
      marginBottom: '40px',
    },

    // Agent card
    agentCard: (color, isHovered) => ({
      position: 'relative',
      background: 'var(--surface)',
      backdropFilter: 'blur(20px)',
      border: `1px solid ${isHovered ? color + '50' : 'var(--surface-border)'}`,
      borderRadius: 'var(--radius-xl)',
      padding: '28px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'border-color 0.3s ease',
    }),
    cardGlow: (color) => ({
      position: 'absolute',
      top: 0, left: 0, right: 0,
      height: '3px',
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      animation: 'gati-glow-breathe 3s ease-in-out infinite',
    }),
    cardBgGlow: (color) => ({
      position: 'absolute',
      top: '-40px', right: '-40px',
      width: '140px', height: '140px',
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color}12, transparent 70%)`,
      pointerEvents: 'none',
    }),
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
      position: 'relative',
      zIndex: 1,
    },
    cardIconWrap: (color) => ({
      width: 48, height: 48,
      borderRadius: 'var(--radius-md)',
      background: `${color}18`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }),
    cardPulse: (color) => ({
      position: 'absolute',
      inset: 0,
      borderRadius: 'var(--radius-md)',
      border: `2px solid ${color}40`,
      animation: 'gati-pulse-ring 2.5s ease-out infinite',
    }),
    statusBadge: (status) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.6px',
      background: status === 'active' ? 'rgba(56,206,60,0.12)' : 'rgba(255,222,115,0.12)',
      color: status === 'active' ? '#38CE3C' : '#FFDE73',
      border: `1px solid ${status === 'active' ? 'rgba(56,206,60,0.25)' : 'rgba(255,222,115,0.25)'}`,
    }),
    statusDotSmall: (status) => ({
      width: 6, height: 6,
      borderRadius: '50%',
      background: status === 'active' ? '#38CE3C' : '#FFDE73',
      animation: status === 'active' ? 'gati-status-dot 2s ease-in-out infinite' : 'none',
      color: status === 'active' ? '#38CE3C' : '#FFDE73',
    }),
    agentName: {
      fontSize: '18px',
      fontWeight: 700,
      color: 'var(--text-primary)',
      marginBottom: '4px',
    },
    lastAction: {
      fontSize: '12px',
      color: 'var(--text-secondary)',
      marginBottom: '20px',
      lineHeight: 1.4,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    statsRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '20px',
    },
    statBlock: {
      flex: 1,
    },
    statLabel: {
      fontSize: '10px',
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '2px',
    },
    statValue: {
      fontSize: '18px',
      fontWeight: 700,
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-primary)',
    },
    capabilitiesWrap: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      marginBottom: '20px',
    },
    capBadge: (color) => ({
      padding: '3px 10px',
      borderRadius: '10px',
      fontSize: '10px',
      fontWeight: 600,
      background: `${color}14`,
      color: color,
      border: `1px solid ${color}28`,
      whiteSpace: 'nowrap',
    }),
    recentHeader: {
      fontSize: '11px',
      fontWeight: 600,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.6px',
      marginBottom: '10px',
    },
    recentItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      padding: '8px 0',
      borderBottom: '1px solid var(--surface-border)',
    },
    recentDot: (color) => ({
      width: 6, height: 6,
      borderRadius: '50%',
      background: color,
      marginTop: '5px',
      flexShrink: 0,
    }),
    recentText: {
      fontSize: '12px',
      color: 'var(--text-secondary)',
      flex: 1,
      lineHeight: 1.4,
    },
    recentTime: {
      fontSize: '10px',
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap',
      marginTop: '2px',
    },
    viewBtn: (color) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      width: '100%',
      padding: '10px 0',
      marginTop: '16px',
      borderRadius: 'var(--radius-md)',
      background: `${color}14`,
      border: `1px solid ${color}28`,
      color: color,
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),

    // Timeline section
    timelineSection: {
      background: 'var(--surface)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--surface-border)',
      borderRadius: 'var(--radius-xl)',
      padding: '28px 32px',
    },
    timelineTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '18px',
      fontWeight: 700,
      color: 'var(--text-primary)',
      marginBottom: '24px',
    },
    timelineList: {
      position: 'relative',
      paddingLeft: '28px',
    },
    timelineLine: {
      position: 'absolute',
      left: '7px',
      top: '8px',
      bottom: '8px',
      width: '2px',
      background: 'linear-gradient(180deg, var(--primary-500), var(--bg-600))',
      borderRadius: '1px',
    },
    timelineItem: {
      position: 'relative',
      paddingBottom: '20px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
    },
    timelineDot: (color) => ({
      position: 'absolute',
      left: '-24px',
      top: '4px',
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      background: color,
      border: '3px solid var(--bg-800)',
      boxShadow: `0 0 8px ${color}50`,
      zIndex: 2,
      flexShrink: 0,
    }),
    timelineContent: {
      flex: 1,
    },
    timelineAgent: (color) => ({
      fontSize: '11px',
      fontWeight: 700,
      color: color,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '2px',
    }),
    timelineAction: {
      fontSize: '13px',
      color: 'var(--text-primary)',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    timelineTime: {
      fontSize: '11px',
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap',
      marginTop: '2px',
    },

    // Drawer Styles
    drawerOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(10, 14, 26, 0.65)',
      backdropFilter: 'blur(5px)',
      zIndex: 100,
    },
    drawer: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '440px',
      background: 'var(--surface)',
      borderLeft: '1px solid var(--surface-border)',
      boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.65)',
      zIndex: 101,
      padding: '28px',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      paddingBottom: '20px',
      borderBottom: '1px solid var(--surface-border)',
    },
    drawerAgentTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
    },
    consoleWindow: {
      background: '#070a13',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      borderRadius: 'var(--radius-md)',
      padding: '16px',
      fontFamily: 'var(--font-mono)',
      fontSize: '12px',
      color: '#38CE3C',
      height: '180px',
      overflowY: 'auto',
      marginBottom: '24px',
      boxShadow: 'inset 0 0 15px rgba(0,0,0,0.8)',
    },
    consoleLine: {
      marginBottom: '6px',
      lineHeight: 1.4,
    },
    actionCenter: (color) => ({
      background: `${color}06`,
      border: `1px solid ${color}1d`,
      borderRadius: '8px',
      padding: '18px',
      marginTop: 'auto',
    })
  };

  // Summary cards data
  const summaryCards = [
    { label: 'Tasks Completed', value: summary.totalTasks.toLocaleString('en-IN'), icon: <CheckCircle2 size={20} />, color: '#38CE3C' },
    { label: 'Tasks in Queue', value: summary.inQueue.toString(), icon: <ListChecks size={20} />, color: '#3b82f6' },
    { label: 'Avg Success Rate', value: `${summary.avgSuccess}%`, icon: <Target size={20} />, color: '#f59e0b' },
    { label: 'Agents Active', value: `${summary.activeCount}/${summary.totalCount}`, icon: <Bot size={20} />, color: '#6366f1' },
  ];

  return (
    <div style={styles.page}>
      {/* ---- Header ---- */}
      <header style={styles.header}>
        <div style={styles.titleRow}>
          <div style={styles.titleIcon}>
            <Bot size={26} color="#fff" />
          </div>
          <h1 style={styles.title}>AI Agents</h1>
          <span style={styles.liveIndicator}>
            <span style={styles.liveDot} />
            Live
          </span>
        </div>
        <p style={styles.subtitle}>Autonomous agents powering your operations</p>
      </header>

      {/* ---- Summary Bar ---- */}
      <motion.div
        style={styles.summaryBar}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            style={styles.summaryCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.45 }}
          >
            <div style={styles.summaryIconWrap(card.color)}>
              {React.cloneElement(card.icon, { color: card.color })}
            </div>
            <div>
              <div style={styles.summaryLabel}>{card.label}</div>
              <div style={styles.summaryValue}>{card.value}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ---- Agent Cards Grid ---- */}
      <div style={styles.agentGrid}>
        {agents.map((agent, idx) => {
          const IconComp = ICON_MAP[agent.icon] || Bot;
          const isHovered = hoveredAgent === agent.id;

          return (
            <motion.div
              key={agent.id}
              style={styles.agentCard(agent.color, isHovered)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedAgentId(agent.id)}
              transition={{ delay: 0.12 + idx * 0.08, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{
                y: -4,
                boxShadow: `0 12px 40px ${agent.color}18`,
                transition: { duration: 0.25 },
              }}
              onMouseEnter={() => setHoveredAgent(agent.id)}
              onMouseLeave={() => setHoveredAgent(null)}
            >
              {/* Top glow bar */}
              <div style={styles.cardGlow(agent.color)} />
              {/* Background glow */}
              <div style={styles.cardBgGlow(agent.color)} />

              {/* Card Header */}
              <div style={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={styles.cardIconWrap(agent.color)}>
                    <IconComp size={22} color={agent.color} />
                    {agent.status === 'active' && <div style={styles.cardPulse(agent.color)} />}
                  </div>
                  <div>
                    <div style={styles.agentName}>{agent.name}</div>
                  </div>
                </div>
                <div style={styles.statusBadge(agent.status)}>
                  <span style={styles.statusDotSmall(agent.status)} />
                  {agent.status === 'active' ? 'Active' : 'Idle'}
                </div>
              </div>

              {/* Last action */}
              <div style={styles.lastAction}>
                <Sparkles size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle', color: agent.color }} />
                {agent.lastAction}
              </div>

              {/* Stats Row */}
              <div style={styles.statsRow}>
                <div style={styles.statBlock}>
                  <div style={styles.statLabel}>Completed</div>
                  <div style={styles.statValue}>{agent.tasksCompleted.toLocaleString('en-IN')}</div>
                </div>
                <div style={styles.statBlock}>
                  <div style={styles.statLabel}>In Queue</div>
                  <div style={styles.statValue}>{agent.tasksInQueue}</div>
                </div>
                <CircularProgress value={agent.successRate} color={agent.color} />
              </div>

              {/* Capabilities */}
              <div style={styles.capabilitiesWrap}>
                {agent.capabilities.slice(0, 3).map(cap => (
                  <span key={cap} style={styles.capBadge(agent.color)}>{cap}</span>
                ))}
                {agent.capabilities.length > 3 && (
                  <span style={styles.capBadge(agent.color)}>+{agent.capabilities.length - 3} more</span>
                )}
              </div>

              {/* Recent Actions */}
              <div style={styles.recentHeader}>Recent Actions</div>
              {agent.recentActions.slice(0, 2).map((action, i) => (
                <div key={i} style={{
                  ...styles.recentItem,
                  borderBottom: i === 1 ? 'none' : '1px solid var(--surface-border)',
                }}>
                  <div style={styles.recentDot(agent.color)} />
                  <div style={styles.recentText}>{action.action}</div>
                  <div style={styles.recentTime}>{action.time}</div>
                </div>
              ))}

              {/* View Details Button */}
              <motion.button
                style={styles.viewBtn(agent.color)}
                whileHover={{ scale: 1.02, background: `${agent.color}22` }}
                whileTap={{ scale: 0.98 }}
              >
                <Eye size={14} />
                Command Center Workspace
                <ChevronRight size={14} />
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* ---- Activity Timeline ---- */}
      <motion.div
        style={styles.timelineSection}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div style={styles.timelineTitle}>
          <Activity size={20} color="var(--primary-400)" />
          Activity Timeline
          <span style={{
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--text-muted)',
            marginLeft: 'auto',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Latest across all agents
          </span>
        </div>

        <div style={styles.timelineList}>
          <div style={styles.timelineLine} />
          {timeline.map((item, i) => {
            const IconComp = ICON_MAP[item.agentIcon] || Bot;
            return (
              <motion.div
                key={i}
                style={styles.timelineItem}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.06, duration: 0.35 }}
              >
                <div style={styles.timelineDot(item.agentColor)} />
                <div style={styles.timelineContent}>
                  <div style={styles.timelineAgent(item.agentColor)}>{item.agentName}</div>
                  <div style={styles.timelineAction}>{item.action}</div>
                </div>
                <div style={styles.timelineTime}>
                  <Clock size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  {item.time}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ---- AI AGENT COGNITIVE WORKSPACE DRAWER ---- */}
      <AnimatePresence>
        {selectedAgent && extendedDetails && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!executingTool) setSelectedAgentId(null);
              }}
              style={styles.drawerOverlay}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              style={styles.drawer}
            >
              {/* Header */}
              <div style={styles.drawerHeader}>
                <div style={styles.drawerAgentTitle}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: `${selectedAgent.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${selectedAgent.color}40`,
                  }}>
                    {React.createElement(ICON_MAP[selectedAgent.icon] || Bot, { size: 20, color: selectedAgent.color })}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>{selectedAgent.name} Workspace</h2>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Autonomous Reasoning Console</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAgentId(null)}
                  disabled={!!executingTool}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: executingTool ? 'not-allowed' : 'pointer',
                    padding: '4px',
                    opacity: executingTool ? 0.4 : 1
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Agent Focus Memory State */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={13} color={selectedAgent.color} />
                  Agent Focus Memory Parameters
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedAgent.id === 'finance' ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Target Discrepancy Limit</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>₹{financeAuditThreshold.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Active Ledger Balance</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>₹{financeLedgerBalance.toFixed(3)}Cr</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Yield Savings Accrued</span>
                        <span style={{ fontWeight: 700, color: '#38CE3C', fontFamily: 'var(--font-mono)' }}>₹{financeSavings.toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  ) : selectedAgent.id === 'sales' ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Active Contracts Value</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>₹{salesPipelineValue}Cr</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Sales Conversion Rate</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{salesConversions}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Autopilot Retention Rebate</span>
                        <span style={{ fontWeight: 700, color: '#f59e0b', fontFamily: 'var(--font-mono)' }}>{salesRebateRate}%</span>
                      </div>
                    </>
                  ) : selectedAgent.id === 'hr' ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Driver Fatigue Threshold</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{hrFatigueThreshold}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Active Workforce Size</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{hrWorkforceSize.toLocaleString()} employees</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Roster Compliance Rate</span>
                        <span style={{ fontWeight: 700, color: '#38CE3C', fontFamily: 'var(--font-mono)' }}>{hrRosterCompliance}%</span>
                      </div>
                    </>
                  ) : selectedAgent.id === 'supply_chain' ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Target Truck Utilization</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{scTargetUtilization}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Avg Route Efficiency Index</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{scRouteEfficiency}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Active Shipments in Transit</span>
                        <span style={{ fontWeight: 700, color: '#38CE3C', fontFamily: 'var(--font-mono)' }}>{scActiveShipments.toLocaleString()}</span>
                      </div>
                    </>
                  ) : selectedAgent.id === 'engineering' ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Auto-scale CPU Limit</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{engCpuThreshold}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Ingestion Latency (p99)</span>
                        <span style={{ fontWeight: 700, color: engApiLatency > 20 ? '#FF4D6B' : '#38CE3C', fontFamily: 'var(--font-mono)' }}>{engApiLatency}ms</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>System Active Uptime</span>
                        <span style={{ fontWeight: 700, color: '#38CE3C', fontFamily: 'var(--font-mono)' }}>{engServerUptime}%</span>
                      </div>
                    </>
                  ) : selectedAgent.id === 'executive' ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Autonomy Level Limit</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{execAutonomyLevel}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Enterprise Risk Index</span>
                        <span style={{ fontWeight: 700, color: execRiskIndex > 15 ? '#FF4D6B' : '#38CE3C', fontFamily: 'var(--font-mono)' }}>{execRiskIndex}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Monthly Growth Trend</span>
                        <span style={{ fontWeight: 700, color: '#38CE3C', fontFamily: 'var(--font-mono)' }}>+{execMonthlyGrowth}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Operating Profit Margin</span>
                        <span style={{ fontWeight: 700, color: '#38CE3C', fontFamily: 'var(--font-mono)' }}>{execOperatingMargin}%</span>
                      </div>
                    </>
                  ) : (
                    extendedDetails.memoryState.map((mem) => (
                      <div key={mem.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{mem.key}</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{mem.value}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Custom Level +100 Finance Agent Control Center */}
              {selectedAgent.id === 'finance' && (
                <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Slider: Discrepancy Limit */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Activity size={13} color={selectedAgent.color} />
                      Audit Anomaly Threshold
                    </div>
                    <div style={{ background: 'var(--bg-800)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Scan Level Sensitivity</span>
                        <span style={{ fontWeight: 700, color: selectedAgent.color, fontFamily: 'var(--font-mono)' }}>₹{financeAuditThreshold.toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        type="range"
                        min="5000"
                        max="50000"
                        step="5000"
                        value={financeAuditThreshold}
                        onChange={(e) => {
                          setFinanceAuditThreshold(Number(e.target.value));
                        }}
                        style={{
                          width: '100%',
                          accentColor: selectedAgent.color,
                          background: 'var(--bg-600)',
                          height: '4px',
                          borderRadius: '2px',
                          outline: 'none',
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: 'var(--text-muted)' }}>
                        <span>High Sensitivity</span>
                        <span>Standard Audit</span>
                      </div>
                    </div>
                  </div>

                  {/* Escrow Funding dial */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IndianRupee size={13} color={selectedAgent.color} />
                      Escrow Funding & Liquidity Dial
                    </div>
                    <div style={{ background: 'var(--bg-800)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700 }}>Carrier Escrow Pool</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Auto-debit from cash flow reserve</div>
                      </div>
                      <button
                        onClick={handleFundEscrow}
                        disabled={!!executingTool}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: `linear-gradient(135deg, ${selectedAgent.color}, ${selectedAgent.color}cc)`,
                          border: 'none',
                          color: '#1a1a2e',
                          fontWeight: '700',
                          fontSize: '11px',
                          cursor: executingTool ? 'not-allowed' : 'pointer',
                        }}
                      >
                        + ₹50k Escrow
                      </button>
                    </div>
                  </div>

                  {/* Disputed Transactions Feed */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldAlert size={13} color="#FF4D6B" />
                      Disputed Telemetry Transactions
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {financeDisputes.map((dispute) => {
                        const isReconciled = dispute.status === 'reconciled';
                        return (
                          <div
                            key={dispute.id}
                            style={{
                              background: 'var(--bg-800)',
                              border: `1px solid ${isReconciled ? 'rgba(56,206,60,0.2)' : 'var(--surface-border)'}`,
                              borderRadius: 'var(--radius-md)',
                              padding: '10px 12px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>{dispute.label}</span>
                              <span style={{
                                fontSize: '9px',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '10px',
                                background: isReconciled ? 'rgba(56,206,60,0.1)' : 'rgba(255,77,107,0.1)',
                                color: isReconciled ? '#38CE3C' : '#FF4D6B',
                                border: `1px solid ${isReconciled ? 'rgba(56,206,60,0.2)' : 'rgba(255,77,107,0.2)'}`,
                                textTransform: 'uppercase'
                              }}>
                                {dispute.status}
                              </span>
                            </div>
                            <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>{dispute.desc}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: isReconciled ? '#38CE3C' : 'var(--text-secondary)' }}>
                                {dispute.amount}
                              </span>
                              {!isReconciled && (
                                <button
                                  onClick={() => handleReconcileDispute(dispute.id)}
                                  disabled={!!executingTool}
                                  style={{
                                    padding: '4px 10px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'rgba(56,206,60,0.12)',
                                    border: '1px solid rgba(56,206,60,0.25)',
                                    color: '#38CE3C',
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    cursor: executingTool ? 'not-allowed' : 'pointer',
                                  }}
                                >
                                  Reconcile
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SVG savings chart */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BarChart3 size={13} color={selectedAgent.color} />
                      Daily Yield Audit Savings Accrued (7D)
                    </div>
                    <div style={{ background: 'var(--bg-800)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                      <svg viewBox="0 0 300 80" style={{ width: '100%', height: 'auto', display: 'block' }}>
                        <defs>
                          <linearGradient id="finance-chart-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#38CE3C" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#38CE3C" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="0" y1="20" x2="300" y2="20" stroke="var(--surface-border)" strokeWidth="0.5" strokeDasharray="3,3" />
                        <line x1="0" y1="50" x2="300" y2="50" stroke="var(--surface-border)" strokeWidth="0.5" strokeDasharray="3,3" />
                        {/* Area under curve */}
                        <path
                          d="M0 80 L0 50 Q50 40 100 60 T200 25 T300 15 L300 80 Z"
                          fill="url(#finance-chart-grad)"
                        />
                        {/* Chart Line */}
                        <path
                          d="M0 50 Q50 40 100 60 T200 25 T300 15"
                          fill="none"
                          stroke="#38CE3C"
                          strokeWidth="2"
                        />
                        {/* Data Points */}
                        <circle cx="100" cy="60" r="3" fill="#38CE3C" stroke="var(--bg-800)" strokeWidth="1" />
                        <circle cx="200" cy="25" r="3" fill="#38CE3C" stroke="var(--bg-800)" strokeWidth="1" />
                        <circle cx="300" cy="15" r="3" fill="#38CE3C" stroke="var(--bg-800)" strokeWidth="1" />
                        {/* Labels */}
                        <text x="5" y="75" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">Mon</text>
                        <text x="100" y="75" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">Wed</text>
                        <text x="200" y="75" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">Fri</text>
                        <text x="275" y="75" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">Today</text>
                        <text x="245" y="14" fill="#38CE3C" fontSize="8" fontWeight="700" fontFamily="var(--font-mono)">₹{financeSavings.toLocaleString('en-IN')}</text>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Level +100 Sales Agent Control Center */}
              {selectedAgent.id === 'sales' && (
                <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Slider: Rebate Rate */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Activity size={13} color={selectedAgent.color} />
                      Retention Rebate Configuration
                    </div>
                    <div style={{ background: 'var(--bg-800)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Autopilot Retention Rebate</span>
                        <span style={{ fontWeight: 700, color: selectedAgent.color, fontFamily: 'var(--font-mono)' }}>{salesRebateRate}%</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="25"
                        step="1"
                        value={salesRebateRate}
                        onChange={(e) => {
                          setSalesRebateRate(Number(e.target.value));
                        }}
                        style={{
                          width: '100%',
                          accentColor: selectedAgent.color,
                          background: 'var(--bg-600)',
                          height: '4px',
                          borderRadius: '2px',
                          outline: 'none',
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: 'var(--text-muted)' }}>
                        <span>Conservative (5%)</span>
                        <span>Aggressive (25%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Deals / Opportunities Feed */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldAlert size={13} color="#f59e0b" />
                      Active Negotiations & Churn Risks
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {salesDeals.map((deal) => {
                        const isSecured = deal.status === 'secured';
                        return (
                          <div
                            key={deal.id}
                            style={{
                              background: 'var(--bg-800)',
                              border: `1px solid ${isSecured ? 'rgba(56,206,60,0.2)' : 'var(--surface-border)'}`,
                              borderRadius: 'var(--radius-md)',
                              padding: '10px 12px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>{deal.label}</span>
                              <span style={{
                                fontSize: '9px',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '10px',
                                background: isSecured ? 'rgba(56,206,60,0.1)' : 'rgba(245,158,11,0.1)',
                                color: isSecured ? '#38CE3C' : '#f59e0b',
                                border: `1px solid ${isSecured ? 'rgba(56,206,60,0.2)' : 'rgba(245,158,11,0.2)'}`,
                                textTransform: 'uppercase'
                              }}>
                                {deal.status.replace('_', ' ')}
                              </span>
                            </div>
                            <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>{deal.desc}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: isSecured ? '#38CE3C' : 'var(--text-secondary)' }}>
                                {deal.value}
                              </span>
                              {!isSecured && (
                                <button
                                  onClick={() => handleReconcileDeal(deal.id)}
                                  disabled={!!executingTool}
                                  style={{
                                    padding: '4px 10px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'rgba(245,158,11,0.12)',
                                    border: '1px solid rgba(245,158,11,0.25)',
                                    color: '#f59e0b',
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    cursor: executingTool ? 'not-allowed' : 'pointer',
                                  }}
                                >
                                  Negotiate
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SVG Conversion Funnel Chart */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BarChart3 size={13} color={selectedAgent.color} />
                      Sales Pipeline Yield Funnel (Cr)
                    </div>
                    <div style={{ background: 'var(--bg-800)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', justifyContent: 'center' }}>
                      <svg viewBox="0 0 300 120" style={{ width: '100%', height: 'auto', display: 'block' }}>
                        <defs>
                          <linearGradient id="funnel-grad-1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#d97706" stopOpacity="0.6" />
                          </linearGradient>
                          <linearGradient id="funnel-grad-2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
                          </linearGradient>
                          <linearGradient id="funnel-grad-3" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
                          </linearGradient>
                          <linearGradient id="funnel-grad-4" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#38CE3C" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#38CE3C" stopOpacity="0.4" />
                          </linearGradient>
                        </defs>
                        
                        {/* Funnel Stage 1 */}
                        <polygon points="20,5 280,5 240,30 60,30" fill="url(#funnel-grad-1)" />
                        <text x="150" y="20" fill="#1a1a2e" fontSize="9" fontWeight="800" textAnchor="middle">Leads: ₹380Cr</text>
                        
                        {/* Funnel Stage 2 */}
                        <polygon points="62,33 238,33 205,58 95,58" fill="url(#funnel-grad-2)" />
                        <text x="150" y="48" fill="#1a1a2e" fontSize="9" fontWeight="800" textAnchor="middle">Qualified: ₹290Cr</text>
                        
                        {/* Funnel Stage 3 */}
                        <polygon points="97,61 203,61 178,86 122,86" fill="url(#funnel-grad-3)" />
                        <text x="150" y="76" fill="var(--text-primary)" fontSize="9" fontWeight="800" textAnchor="middle">Proposed: ₹120Cr</text>
                        
                        {/* Funnel Stage 4 */}
                        <polygon points="124,89 176,89 155,114 145,114" fill="url(#funnel-grad-4)" />
                        <text x="150" y="104" fill="#1a1a2e" fontSize="9" fontWeight="900" textAnchor="middle">Won: ₹{salesPipelineValue}Cr</text>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Level +100 HR Agent Control Center */}
              {selectedAgent.id === 'hr' && (
                <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Slider: Fatigue Threshold */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Activity size={13} color={selectedAgent.color} />
                      Fatigue Warning Threshold
                    </div>
                    <div style={{ background: 'var(--bg-800)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Max Fatigue Limit</span>
                        <span style={{ fontWeight: 700, color: selectedAgent.color, fontFamily: 'var(--font-mono)' }}>{hrFatigueThreshold}%</span>
                      </div>
                      <input
                        type="range"
                        min="30"
                        max="80"
                        step="5"
                        value={hrFatigueThreshold}
                        onChange={(e) => {
                          setHrFatigueThreshold(Number(e.target.value));
                        }}
                        style={{
                          width: '100%',
                          accentColor: selectedAgent.color,
                          background: 'var(--bg-600)',
                          height: '4px',
                          borderRadius: '2px',
                          outline: 'none',
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: 'var(--text-muted)' }}>
                        <span>High Sensitivity (30%)</span>
                        <span>Lenient Rest Limit (80%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Driver Alerts / Safety Sentinel Feed */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldAlert size={13} color={selectedAgent.color} />
                      Driver Compliance & Safety Alerts
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {hrDriverAlerts.map((alert) => {
                        const isResolved = alert.status === 'resolved' || alert.status === 'resting';
                        return (
                          <div
                            key={alert.id}
                            style={{
                              background: 'var(--bg-800)',
                              border: `1px solid ${isResolved ? 'rgba(56,206,60,0.2)' : 'var(--surface-border)'}`,
                              borderRadius: 'var(--radius-md)',
                              padding: '10px 12px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>{alert.label}</span>
                              <span style={{
                                fontSize: '9px',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '10px',
                                background: isResolved ? 'rgba(56,206,60,0.1)' : 'rgba(239,68,68,0.1)',
                                color: isResolved ? '#38CE3C' : '#ef4444',
                                border: `1px solid ${isResolved ? 'rgba(56,206,60,0.2)' : 'rgba(239,68,68,0.2)'}`,
                                textTransform: 'uppercase'
                              }}>
                                {alert.status}
                              </span>
                            </div>
                            <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>{alert.desc}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: isResolved ? '#38CE3C' : 'var(--text-secondary)' }}>
                                {alert.value}
                              </span>
                              {!isResolved && (
                                <button
                                  onClick={() => handleResolveDriverAlert(alert.id)}
                                  disabled={!!executingTool}
                                  style={{
                                    padding: '4px 10px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid var(--surface-border)',
                                    color: 'var(--text-primary)',
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    cursor: executingTool ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  {alert.id === 'hr1' ? 'Trigger Rest' : alert.id === 'hr2' ? 'Renew CDL' : 'Coach Driver'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SVG Biometrics wave chart */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BarChart3 size={13} color={selectedAgent.color} />
                      Workforce Biometric Stress Wave (7D)
                    </div>
                    <div style={{ background: 'var(--bg-800)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                      <svg viewBox="0 0 300 80" style={{ width: '100%', height: 'auto', display: 'block' }}>
                        <defs>
                          <linearGradient id="hr-chart-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={selectedAgent.color} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={selectedAgent.color} stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="0" y1="20" x2="300" y2="20" stroke="var(--surface-border)" strokeWidth="0.5" strokeDasharray="3,3" />
                        <line x1="0" y1="50" x2="300" y2="50" stroke="var(--surface-border)" strokeWidth="0.5" strokeDasharray="3,3" />
                        {/* Area under curve */}
                        <path
                          d="M0 80 L0 60 Q40 30 80 55 T160 25 T240 65 T300 35 L300 80 Z"
                          fill="url(#hr-chart-grad)"
                        />
                        {/* Chart Line */}
                        <path
                          d="M0 60 Q40 30 80 55 T160 25 T240 65 T300 35"
                          fill="none"
                          stroke={selectedAgent.color}
                          strokeWidth="2"
                        />
                        {/* Data Points */}
                        <circle cx="80" cy="55" r="3" fill={selectedAgent.color} stroke="var(--bg-800)" strokeWidth="1" />
                        <circle cx="160" cy="25" r="3" fill={selectedAgent.color} stroke="var(--bg-800)" strokeWidth="1" />
                        <circle cx="240" cy="65" r="3" fill={selectedAgent.color} stroke="var(--bg-800)" strokeWidth="1" />
                        <circle cx="300" cy="35" r="3" fill={selectedAgent.color} stroke="var(--bg-800)" strokeWidth="1" />
                        {/* Labels */}
                        <text x="5" y="75" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">Mon</text>
                        <text x="80" y="75" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">Wed</text>
                        <text x="160" y="75" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">Fri</text>
                        <text x="275" y="75" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">Today</text>
                        <text x="200" y="14" fill={selectedAgent.color} fontSize="8" fontWeight="700" fontFamily="var(--font-mono)">Roster Compliance: {hrRosterCompliance}%</text>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Level +100 Supply Chain Agent Control Center */}
              {selectedAgent.id === 'supply_chain' && (
                <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Slider: Utilization Target */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Activity size={13} color={selectedAgent.color} />
                      Target Truck Utilization
                    </div>
                    <div style={{ background: 'var(--bg-800)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Target Fleet Utilization</span>
                        <span style={{ fontWeight: 700, color: selectedAgent.color, fontFamily: 'var(--font-mono)' }}>{scTargetUtilization}%</span>
                      </div>
                      <input
                        type="range"
                        min="70"
                        max="95"
                        step="1"
                        value={scTargetUtilization}
                        onChange={(e) => {
                          setScTargetUtilization(Number(e.target.value));
                        }}
                        style={{
                          width: '100%',
                          accentColor: selectedAgent.color,
                          background: 'var(--bg-600)',
                          height: '4px',
                          borderRadius: '2px',
                          outline: 'none',
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: 'var(--text-muted)' }}>
                        <span>Conservative (70%)</span>
                        <span>High Density (95%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Route Bottlenecks & Congestion Sentinel Feed */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldAlert size={13} color={selectedAgent.color} />
                      Route Congestion & Backlog Alerts
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {scRouteAlerts.map((alert) => {
                        const isResolved = alert.status === 'resolved' || alert.status === 'rerouted' || alert.status === 'rescheduled' || alert.status === 'bypassed';
                        return (
                          <div
                            key={alert.id}
                            style={{
                              background: 'var(--bg-800)',
                              border: `1px solid ${isResolved ? 'rgba(56,206,60,0.2)' : 'var(--surface-border)'}`,
                              borderRadius: 'var(--radius-md)',
                              padding: '10px 12px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>{alert.label}</span>
                              <span style={{
                                fontSize: '9px',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '10px',
                                background: isResolved ? 'rgba(56,206,60,0.1)' : 'rgba(239,68,68,0.1)',
                                color: isResolved ? '#38CE3C' : '#ef4444',
                                border: `1px solid ${isResolved ? 'rgba(56,206,60,0.2)' : 'rgba(239,68,68,0.2)'}`,
                                textTransform: 'uppercase'
                              }}>
                                {alert.status}
                              </span>
                            </div>
                            <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>{alert.desc}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: isResolved ? '#38CE3C' : 'var(--text-secondary)' }}>
                                {alert.value}
                              </span>
                              {!isResolved && (
                                <button
                                  onClick={() => handleResolveRouteAlert(alert.id)}
                                  disabled={!!executingTool}
                                  style={{
                                    padding: '4px 10px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'rgba(255,255,255,0.08)',
                                    border: '1px solid var(--surface-border)',
                                    color: 'var(--text-primary)',
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    cursor: executingTool ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  {alert.id === 'sc1' ? 'Reroute Trucks' : alert.id === 'sc2' ? 'Reschedule queue' : 'Bypass Corridor'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SVG Traffic density wave chart */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BarChart3 size={13} color={selectedAgent.color} />
                      Logistics Corridor Traffic Density (7D)
                    </div>
                    <div style={{ background: 'var(--bg-800)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                      <svg viewBox="0 0 300 80" style={{ width: '100%', height: 'auto', display: 'block' }}>
                        <defs>
                          <linearGradient id="sc-chart-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={selectedAgent.color} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={selectedAgent.color} stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="0" y1="20" x2="300" y2="20" stroke="var(--surface-border)" strokeWidth="0.5" strokeDasharray="3,3" />
                        <line x1="0" y1="50" x2="300" y2="50" stroke="var(--surface-border)" strokeWidth="0.5" strokeDasharray="3,3" />
                        {/* Area under curve */}
                        <path
                          d="M0 80 L0 45 Q50 65 100 35 T200 55 T300 20 L300 80 Z"
                          fill="url(#sc-chart-grad)"
                        />
                        {/* Chart Line */}
                        <path
                          d="M0 45 Q50 65 100 35 T200 55 T300 20"
                          fill="none"
                          stroke={selectedAgent.color}
                          strokeWidth="2"
                        />
                        {/* Data Points */}
                        <circle cx="100" cy="35" r="3" fill={selectedAgent.color} stroke="var(--bg-800)" strokeWidth="1" />
                        <circle cx="200" cy="55" r="3" fill={selectedAgent.color} stroke="var(--bg-800)" strokeWidth="1" />
                        <circle cx="300" cy="20" r="3" fill={selectedAgent.color} stroke="var(--bg-800)" strokeWidth="1" />
                        {/* Labels */}
                        <text x="5" y="75" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">Mon</text>
                        <text x="100" y="75" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">Wed</text>
                        <text x="200" y="75" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">Fri</text>
                        <text x="275" y="75" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">Today</text>
                        <text x="180" y="14" fill={selectedAgent.color} fontSize="8" fontWeight="700" fontFamily="var(--font-mono)">Efficiency Index: {scRouteEfficiency}%</text>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Level +100 Engineering Agent Control Center */}
              {selectedAgent.id === 'engineering' && (
                <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Slider: Auto-scale CPU Limit */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Activity size={13} color={selectedAgent.color} />
                      Autoscale CPU Threshold Limit
                    </div>
                    <div style={{ background: 'var(--bg-800)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Auto-scale Trigger Limit</span>
                        <span style={{ fontWeight: 700, color: selectedAgent.color, fontFamily: 'var(--font-mono)' }}>{engCpuThreshold}% CPU</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="95"
                        step="5"
                        value={engCpuThreshold}
                        onChange={(e) => {
                          setEngCpuThreshold(Number(e.target.value));
                        }}
                        style={{
                          width: '100%',
                          accentColor: selectedAgent.color,
                          background: 'var(--bg-600)',
                          height: '4px',
                          borderRadius: '2px',
                          outline: 'none',
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: 'var(--text-muted)' }}>
                        <span>High Sensitivity (50%)</span>
                        <span>Performance Focus (95%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Manual autoscale up nodes */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Server size={13} color={selectedAgent.color} />
                      Kubernetes Container Cluster Scale
                    </div>
                    <div style={{ background: 'var(--bg-800)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700 }}>Mumbai Edge API Gateway</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Deploy container pods replication</div>
                      </div>
                      <button
                        onClick={handleScaleUpNodes}
                        disabled={!!executingTool}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: `linear-gradient(135deg, ${selectedAgent.color}, ${selectedAgent.color}cc)`,
                          border: 'none',
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: '11px',
                          cursor: executingTool ? 'not-allowed' : 'pointer',
                        }}
                      >
                        Scale +4 Pods
                      </button>
                    </div>
                  </div>

                  {/* Server Incidents Sentinel Feed */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldAlert size={13} color="#FF4D6B" />
                      Active DevOps & Infrastructure Incidents
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {engServerAlerts.map((alert) => {
                        const isResolved = alert.status === 'resolved';
                        return (
                          <div
                            key={alert.id}
                            style={{
                              background: 'var(--bg-800)',
                              border: `1px solid ${isResolved ? 'rgba(56,206,60,0.2)' : 'var(--surface-border)'}`,
                              borderRadius: 'var(--radius-md)',
                              padding: '10px 12px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>{alert.label}</span>
                              <span style={{
                                fontSize: '9px',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '10px',
                                background: isResolved ? 'rgba(56,206,60,0.1)' : 'rgba(255,77,107,0.1)',
                                color: isResolved ? '#38CE3C' : '#FF4D6B',
                                border: `1px solid ${isResolved ? 'rgba(56,206,60,0.2)' : 'rgba(255,77,107,0.2)'}`,
                                textTransform: 'uppercase'
                              }}>
                                {alert.status}
                              </span>
                            </div>
                            <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>{alert.desc}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: isResolved ? '#38CE3C' : 'var(--text-secondary)' }}>
                                {alert.value}
                              </span>
                              {!isResolved && (
                                <button
                                  onClick={() => handleResolveServerAlert(alert.id)}
                                  disabled={!!executingTool}
                                  style={{
                                    padding: '4px 10px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'rgba(255,77,107,0.12)',
                                    border: '1px solid rgba(255,77,107,0.25)',
                                    color: '#FF4D6B',
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    cursor: executingTool ? 'not-allowed' : 'pointer',
                                  }}
                                >
                                  {alert.id === 'eng1' ? 'Scale API Gateways' : alert.id === 'eng2' ? 'Re-calibrate Sensors' : 'Flush DB Logs'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SVG server health telemetry chart */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BarChart3 size={13} color={selectedAgent.color} />
                      Server CPU Utilization & Load Index (24h)
                    </div>
                    <div style={{ background: 'var(--bg-800)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                      <svg viewBox="0 0 300 80" style={{ width: '100%', height: 'auto', display: 'block' }}>
                        <defs>
                          <linearGradient id="eng-chart-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={selectedAgent.color} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={selectedAgent.color} stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="0" y1="20" x2="300" y2="20" stroke="var(--surface-border)" strokeWidth="0.5" strokeDasharray="3,3" />
                        <line x1="0" y1="50" x2="300" y2="50" stroke="var(--surface-border)" strokeWidth="0.5" strokeDasharray="3,3" />
                        {/* Area under curve */}
                        <path
                          d="M0 80 L0 35 Q50 20 100 50 T200 30 T300 42 L300 80 Z"
                          fill="url(#eng-chart-grad)"
                        />
                        {/* Chart Line */}
                        <path
                          d="M0 35 Q50 20 100 50 T200 30 T300 42"
                          fill="none"
                          stroke={selectedAgent.color}
                          strokeWidth="2"
                        />
                        {/* Data Points */}
                        <circle cx="100" cy="50" r="3" fill={selectedAgent.color} stroke="var(--bg-800)" strokeWidth="1" />
                        <circle cx="200" cy="30" r="3" fill={selectedAgent.color} stroke="var(--bg-800)" strokeWidth="1" />
                        <circle cx="300" cy="42" r="3" fill={selectedAgent.color} stroke="var(--bg-800)" strokeWidth="1" />
                        {/* Labels */}
                        <text x="5" y="75" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">12am</text>
                        <text x="100" y="75" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">8am</text>
                        <text x="200" y="75" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">4pm</text>
                        <text x="275" y="75" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">Now</text>
                        <text x="180" y="14" fill={selectedAgent.color} fontSize="8" fontWeight="700" fontFamily="var(--font-mono)">Active Uptime: {engServerUptime}%</text>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Level +100 Executive Decision Agent Control Center */}
              {selectedAgent.id === 'executive' && (
                <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Slider: Auto-execute Autonomy Level */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Activity size={13} color={selectedAgent.color} />
                      AI Autopilot Autonomy Level
                    </div>
                    <div style={{ background: 'var(--bg-800)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Auto-execute Autonomy Limit</span>
                        <span style={{ fontWeight: 700, color: selectedAgent.color, fontFamily: 'var(--font-mono)' }}>{execAutonomyLevel}% Confidence</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="95"
                        step="5"
                        value={execAutonomyLevel}
                        onChange={(e) => {
                          setExecAutonomyLevel(Number(e.target.value));
                        }}
                        style={{
                          width: '100%',
                          accentColor: selectedAgent.color,
                          background: 'var(--bg-600)',
                          height: '4px',
                          borderRadius: '2px',
                          outline: 'none',
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: 'var(--text-muted)' }}>
                        <span>Human-in-the-Loop (50%)</span>
                        <span>Full Autopilot (95%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Manual trigger risk audit */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Brain size={13} color={selectedAgent.color} />
                      Strategic Risk & Intelligence Engine
                    </div>
                    <div style={{ background: 'var(--bg-800)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700 }}>Corporate Risk Audit Scan</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Scan cash flow, fuel index and CRM risk</div>
                      </div>
                      <button
                        onClick={handleRunRiskAudit}
                        disabled={!!executingTool}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          background: `linear-gradient(135deg, ${selectedAgent.color}, ${selectedAgent.color}cc)`,
                          border: 'none',
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: '11px',
                          cursor: executingTool ? 'not-allowed' : 'pointer',
                        }}
                      >
                        Run Risk Scan
                      </button>
                    </div>
                  </div>

                  {/* Strategic Decisions Feed */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldAlert size={13} color="#f97316" />
                      Pending Strategic Decision Approvals
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {execStrategicDecisions.map((decision) => {
                        const isApproved = decision.status === 'approved';
                        return (
                          <div
                            key={decision.id}
                            style={{
                              background: 'var(--bg-800)',
                              border: `1px solid ${isApproved ? 'rgba(56,206,60,0.2)' : 'var(--surface-border)'}`,
                              borderRadius: 'var(--radius-md)',
                              padding: '10px 12px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>{decision.label}</span>
                              <span style={{
                                fontSize: '9px',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '10px',
                                background: isApproved ? 'rgba(56,206,60,0.1)' : 'rgba(249,115,22,0.1)',
                                color: isApproved ? '#38CE3C' : '#f97316',
                                border: `1px solid ${isApproved ? 'rgba(56,206,60,0.2)' : 'rgba(249,115,22,0.2)'}`,
                                textTransform: 'uppercase'
                              }}>
                                {decision.status}
                              </span>
                            </div>
                            <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>{decision.desc}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: isApproved ? '#38CE3C' : 'var(--text-secondary)' }}>
                                {decision.value}
                              </span>
                              {!isApproved && (
                                <button
                                  onClick={() => handleApproveDecision(decision.id)}
                                  disabled={!!executingTool}
                                  style={{
                                    padding: '4px 10px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'rgba(249,115,22,0.12)',
                                    border: '1px solid rgba(249,115,22,0.25)',
                                    color: '#f97316',
                                    fontSize: '10px',
                                    fontWeight: '700',
                                    cursor: executingTool ? 'not-allowed' : 'pointer',
                                  }}
                                >
                                  Approve
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SVG ROI yield chart */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BarChart3 size={13} color={selectedAgent.color} />
                      AI Decisions Strategic ROI & Cost Yield (Q2)
                    </div>
                    <div style={{ background: 'var(--bg-800)', border: '1px solid var(--surface-border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                      <svg viewBox="0 0 300 80" style={{ width: '100%', height: 'auto', display: 'block' }}>
                        <defs>
                          <linearGradient id="exec-chart-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={selectedAgent.color} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={selectedAgent.color} stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="0" y1="20" x2="300" y2="20" stroke="var(--surface-border)" strokeWidth="0.5" strokeDasharray="3,3" />
                        <line x1="0" y1="50" x2="300" y2="50" stroke="var(--surface-border)" strokeWidth="0.5" strokeDasharray="3,3" />
                        {/* Area under curve */}
                        <path
                          d="M0 80 L0 65 Q50 55 100 45 T200 25 T300 12 L300 80 Z"
                          fill="url(#exec-chart-grad)"
                        />
                        {/* Chart Line */}
                        <path
                          d="M0 65 Q50 55 100 45 T200 25 T300 12"
                          fill="none"
                          stroke={selectedAgent.color}
                          strokeWidth="2"
                        />
                        {/* Data Points */}
                        <circle cx="100" cy="45" r="3" fill={selectedAgent.color} stroke="var(--bg-800)" strokeWidth="1" />
                        <circle cx="200" cy="25" r="3" fill={selectedAgent.color} stroke="var(--bg-800)" strokeWidth="1" />
                        <circle cx="300" cy="12" r="3" fill={selectedAgent.color} stroke="var(--bg-800)" strokeWidth="1" />
                        {/* Labels */}
                        <text x="5" y="75" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">Apr</text>
                        <text x="100" y="75" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">May</text>
                        <text x="200" y="75" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">Jun</text>
                        <text x="275" y="75" fill="var(--text-muted)" fontSize="8" fontFamily="var(--font-mono)">Now</text>
                        <text x="160" y="14" fill={selectedAgent.color} fontSize="8" fontWeight="700" fontFamily="var(--font-mono)">ROI Value: ₹28.5Cr (+{execMonthlyGrowth}%)</text>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Cognitive Reasoning Logs */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Brain size={13} color={selectedAgent.color} />
                  Chain-of-Thought Reasoning
                </div>
                <div style={{
                  background: '#070a13',
                  border: '1px solid var(--surface-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.7)',
                  maxHeight: '120px',
                  overflowY: 'auto'
                }}>
                  {extendedDetails.thinkingConsole.map((line, i) => (
                    <div key={i} style={{ marginBottom: '6px', lineHeight: 1.4, color: i === 3 ? selectedAgent.color : 'rgba(255,255,255,0.75)' }}>{line}</div>
                  ))}
                </div>
              </div>

              {/* Live Terminal Console */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Terminal size={13} color="#38CE3C" />
                  Live Action Log Console
                </div>
                <div style={styles.consoleWindow}>
                  {consoleLogs.length > 0 ? (
                    consoleLogs.map((line, i) => (
                      <div key={i} style={styles.consoleLine}>
                        {line}
                      </div>
                    ))
                  ) : (
                    <div style={{ color: 'rgba(56, 206, 60, 0.4)', fontSize: '11px' }}>
                      Console idle. Flashing trigger ready...
                      <span style={{ display: 'inline-block', width: '8px', height: '12px', background: '#38CE3C', marginLeft: '4px', animation: 'gati-console-cursor 1s step-end infinite', verticalAlign: 'middle' }} />
                    </div>
                  )}
                  {executingTool && (
                    <div style={styles.consoleLine}>
                      <span>Running automated audit sequences...</span>
                      <span style={{ display: 'inline-block', width: '8px', height: '12px', background: '#38CE3C', marginLeft: '4px', animation: 'gati-console-cursor 1s step-end infinite', verticalAlign: 'middle' }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Command Center Tools Trigger */}
              <div style={styles.actionCenter(selectedAgent.color)}>
                <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: selectedAgent.color, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Cpu size={14} />
                  Automation Override Command Center
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {extendedDetails.tools.map((tool) => (
                    <button
                      key={tool.name}
                      onClick={() => handleExecuteTool(tool)}
                      disabled={!!executingTool}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '10px 14px',
                        background: executingTool === tool.name 
                          ? 'var(--bg-700)' 
                          : `linear-gradient(135deg, ${selectedAgent.color}, ${selectedAgent.color}cc)`,
                        color: executingTool === tool.name ? 'var(--text-muted)' : '#1a1a2e',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                        fontWeight: '700',
                        fontFamily: 'var(--font-sans)',
                        cursor: executingTool ? 'not-allowed' : 'pointer',
                        boxShadow: executingTool ? 'none' : `0 2px 10px ${selectedAgent.color}25`,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {executingTool === tool.name ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        <Play size={12} fill="#1a1a2e" />
                      )}
                      {executingTool === tool.name ? "Executing automated audit..." : tool.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Toasts */}
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
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentsDashboard;
