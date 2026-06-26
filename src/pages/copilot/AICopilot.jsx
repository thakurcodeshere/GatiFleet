/* eslint-disable */
// ============================================================
// GatiFleet — AI Copilot (Full-Page)
// Split layout: Chat + Context Panels
// ============================================================
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Send, Sparkles, MessageSquare, TrendingUp, Truck,
  Package, AlertTriangle, IndianRupee, BarChart3, Users,
  Clock, ChevronRight, Lightbulb, Zap, Search,
  ArrowUpRight, Layers, Brain, Compass, Shield, Route,
  Star, Hash, BookOpen, Cpu, Mic, Paperclip, CornerDownLeft,
  CheckCircle2, XCircle, Copy, ThumbsUp, ThumbsDown, RefreshCw,
  Settings, Network, User, ChevronLeft, MapPin
} from 'lucide-react';
import {
  platformKPIs,
  copilotSuggestions,
  copilotConversations,
  formatCurrency,
  formatNumber,
} from '../../data/mockData';

// ---- Keyframes ----
const KEYFRAMES_ID = 'gatifleet-copilot-keyframes';
const injectKeyframes = () => {
  if (document.getElementById(KEYFRAMES_ID)) return;
  const style = document.createElement('style');
  style.id = KEYFRAMES_ID;
  style.textContent = `
    @keyframes gati-copilot-typing {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }
    @keyframes gati-copilot-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes gati-copilot-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.15); }
      50% { box-shadow: 0 0 32px rgba(99,102,241,0.3); }
    }
  `;
  document.head.appendChild(style);
};

// ---- Typing indicator ----
const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 0' }}>
    {[0, 1, 2].map(i => (
      <div
        key={i}
        style={{
          width: 7, height: 7,
          borderRadius: '50%',
          background: 'var(--primary-400)',
          animation: `gati-copilot-typing 1.4s ease-in-out ${i * 0.2}s infinite`,
        }}
      />
    ))}
  </div>
);

// ---- Data card for AI response ----
const DataCard = ({ title, items, color = '#6366f1' }) => (
  <div style={{
    background: 'var(--bg-700)',
    border: '1px solid var(--surface-border)',
    borderRadius: 'var(--radius-md)',
    padding: '16px 20px',
    marginTop: '10px',
  }}>
    <div style={{
      fontSize: '13px',
      fontWeight: 700,
      color,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    }}>
      <BarChart3 size={15} />
      {title}
    </div>
    {items.map((item, i) => (
      <div
        key={i}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '9px 0',
          borderBottom: i < items.length - 1 ? '1px solid var(--surface-border)' : 'none',
          fontSize: '13px',
        }}
      >
        <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
        <span style={{
          fontWeight: 600,
          color: item.highlight ? color : 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
        }}>{item.value}</span>
      </div>
    ))}
  </div>
);

// ---- Confidence bar ----
const ConfidenceBar = ({ value, color = '#6366f1' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
    <div style={{
      flex: 1, height: 4,
      background: 'var(--bg-600)',
      borderRadius: 2,
      overflow: 'hidden',
    }}>
      <div style={{
        height: '100%',
        width: `${value}%`,
        background: `linear-gradient(90deg, ${color}, ${color}99)`,
        borderRadius: 2,
        transition: 'width 0.8s ease',
      }} />
    </div>
    <span style={{ fontSize: '10px', fontWeight: 600, color, fontFamily: 'var(--font-mono)' }}>{value}%</span>
  </div>
);

// ---- Guided Command Center Wizard Data ----
const WIZARD_CATEGORIES = [
  {
    id: 'dashboard',
    name: 'Executive Dashboard',
    icon: <BarChart3 size={14} />,
    color: '#6366f1',
    questions: [
      {
        id: 'db_leakage',
        text: 'Analyze financial leakage in operations',
        options: ['Show Fuel Theft Risks', 'Show FASTag Toll Overcharges', 'Show Maintenance Cost Breaches'],
        inputLabel: 'Or enter specific account/cost category:',
        placeholder: 'e.g. Staging Labor...'
      },
      {
        id: 'db_utilization',
        text: 'Optimize region fleet utilization gaps',
        options: ['Western India (92.1% utilization)', 'Eastern India (81.2% utilization)', 'North-East India (72.4% utilization)'],
        inputLabel: 'Or enter custom region name:',
        placeholder: 'e.g. Southern India...'
      },
      {
        id: 'db_carbon',
        text: 'Review CEO-level carbon offset targets',
        options: ['Achieve Net-Zero by 2028', 'Purchase 500t Carbon Credits', 'Reduce Empty Backhaul by 15%'],
        inputLabel: 'Or specify custom offset target (tonnes):',
        placeholder: 'e.g. 1000 tonnes...'
      },
      {
        id: 'db_revenue_routes',
        text: 'Analyze top revenue routes',
        options: ['Delhi-Mumbai Lane', 'Mumbai-Bangalore Lane', 'Kolkata-Guwahati Lane'],
        inputLabel: 'Or enter custom corridor name:',
        placeholder: 'e.g. Chennai-Hyderabad...'
      }
    ]
  },
  {
    id: 'fleet',
    name: 'Fleet Management',
    icon: <Truck size={14} />,
    color: '#3b82f6',
    questions: [
      {
        id: 'fl_dtc',
        text: 'Clear sensor DTC fault codes',
        options: ['TRK-00028 (P0300 - Random Misfire)', 'TRK-00019 (P0420 - Catalyst System)', 'TRK-00012 (No Faults)'],
        inputLabel: 'Or enter custom Truck ID to scan:',
        placeholder: 'e.g. TRK-00045...'
      },
      {
        id: 'fl_maint',
        text: 'Schedule preventive maintenance service',
        options: ['Brake Pad Overhaul', 'Tyre Rotation & Swap', 'Engine Oil Calibration'],
        inputLabel: 'Or enter custom maintenance task:',
        placeholder: 'e.g. Coolant flush...'
      },
      {
        id: 'fl_fuel_opt',
        text: 'Enforce speed limiters & fuel policy',
        options: ['Enforce speed limiters (80 km/h)', 'Route via low-altitude corridors', 'Retire vehicles older than 8 years'],
        inputLabel: 'Or specify custom fuel efficiency policy:',
        placeholder: 'e.g. Idle shutdown timeout...'
      },
      {
        id: 'fl_battery',
        text: 'Check vehicle battery health status',
        options: ['TRK-00012 (Battery health 94%)', 'TRK-00028 (Battery health 62% - Alert)', 'TRK-00019 (Battery health 88%)'],
        inputLabel: 'Or enter custom vehicle ID to check:',
        placeholder: 'e.g. TRK-00099...'
      }
    ]
  },
  {
    id: 'tracking',
    name: 'Live Tracking & SOS',
    icon: <MapPin size={14} />,
    color: '#FF4D6B',
    questions: [
      {
        id: 'tr_reroute',
        text: 'Reroute delayed trucks en-route',
        options: ['Reroute TRK-00028 via NH48 Bypass', 'Reroute TRK-00012 via Nagpur State Highway', 'Reroute TRK-00045 via Siliguri Bypass'],
        inputLabel: 'Or specify custom corridor bypass:',
        placeholder: 'e.g. Mumbai-Pune Express...'
      },
      {
        id: 'tr_emergency',
        text: 'Trigger emergency SOS response',
        options: ['TRK-00028 Nagpur Breakdown Alert', 'TRK-00045 Cargo Temp Breach Alert', 'TRK-00019 Door Unlocked Alert'],
        inputLabel: 'Or specify other vehicle ID for SOS:',
        placeholder: 'e.g. TRK-00099...'
      },
      {
        id: 'tr_eta_accuracy',
        text: 'Check current ETA prediction accuracy',
        options: ['DEL-BOM (94% confidence)', 'BOM-BLR (88% confidence)', 'CCU-GAU (72% confidence - Monsoon)'],
        inputLabel: 'Or enter custom shipment ID to audit ETA:',
        placeholder: 'e.g. SHP-104921...'
      },
      {
        id: 'tr_temp_control',
        text: 'Monitor temperature control deviations',
        options: ['Reefer Unit 4 (Normal: 4°C)', 'Reefer Unit 12 (Critical: 14°C)', 'Reefer Unit 8 (Normal: -2°C)'],
        inputLabel: 'Or specify custom reefer sensor ID:',
        placeholder: 'e.g. REF-8293...'
      }
    ]
  },
  {
    id: 'knowledge',
    name: 'Knowledge Graph',
    icon: <Network size={14} />,
    color: '#a855f7',
    questions: [
      {
        id: 'kg_gap',
        text: 'Scan operational gap anomalies in graph',
        options: ['Active Disputes to Invoice links', 'Driver Rest violations to Duty roster', 'FASTag low balances to Toll logs'],
        inputLabel: 'Or type custom entity relation to scan:',
        placeholder: 'e.g. Shipment to Carrier...'
      },
      {
        id: 'kg_trace',
        text: 'Trace shipment cascading breakdown links',
        options: ['Trace SHP-104921 (FMCG delay)', 'Trace SHP-104922 (Monsoon block)', 'Trace SHP-104923 (Asset repair)'],
        inputLabel: 'Or enter specific shipment ID to trace:',
        placeholder: 'e.g. SHP-104924...'
      },
      {
        id: 'kg_driver_overlap',
        text: 'Identify driver-vehicle mapping overlaps',
        options: ['Driver Suresh Yadav double allocation', 'Unassigned truck TRK-00028', 'Overlapping shifts on Delhi lane'],
        inputLabel: 'Or enter specific driver name:',
        placeholder: 'e.g. Ashok Pandey...'
      },
      {
        id: 'kg_customer_depend',
        text: 'Analyze customer-order dependency clusters',
        options: ['BlueDart shipment clusters', 'Safexpress volume hotspots', 'DTDC delivery bottlenecks'],
        inputLabel: 'Or enter specific customer account:',
        placeholder: 'e.g. Tata Motors...'
      }
    ]
  },
  {
    id: 'portals',
    name: 'Partner Portals',
    icon: <Users size={14} />,
    color: '#06b6d4',
    questions: [
      {
        id: 'pt_warehouse',
        text: 'Dock yard staging trailer to Bay doors',
        options: ['Dock TRK-00088 to BAY-4', 'Dock TRK-00094 to BAY-6', 'Dock TRK-00102 to BAY-5'],
        inputLabel: 'Or specify custom trailer and bay:',
        placeholder: 'e.g. TRK-00012 to BAY-4...'
      },
      {
        id: 'pt_vendor',
        text: 'Log diesel refuels & settle fuel card transactions',
        options: ['Refuel 250L on TRK-00012 (IOC NH48)', 'Refuel 400L on TRK-00028 (BPCL Pune)', 'Refuel 150L on TRK-00045 (HPCL Nagpur)'],
        inputLabel: 'Or specify custom refuel details:',
        placeholder: 'e.g. TRK-00019, 300L...'
      },
      {
        id: 'pt_broker_bid',
        text: 'Verify broker bid submission approvals',
        options: ['Bid #8291 (DEL-BOM) by Carrier X', 'Bid #8292 (BOM-BLR) by Carrier Y', 'Bid #8293 (CCU-GAU) by Carrier Z'],
        inputLabel: 'Or specify custom bid ID to audit:',
        placeholder: 'e.g. #8294...'
      },
      {
        id: 'pt_staging_schedule',
        text: 'Update warehouse staging schedules',
        options: ['Morning shift (06:00 - 14:00)', 'Evening shift (14:00 - 22:00)', 'Night shift (22:00 - 06:00)'],
        inputLabel: 'Or enter custom shift parameter:',
        placeholder: 'e.g. Overtime A...'
      }
    ]
  },
  {
    id: 'erp',
    name: 'ERP Compliance',
    icon: <IndianRupee size={14} />,
    color: '#10b981',
    questions: [
      {
        id: 'er_toll',
        text: 'Verify FASTag balance and auto-recharge rules',
        options: ['Recharge ₹15,000 on TRK-00019', 'Recharge ₹5,000 on TRK-00012', 'Recharge ₹20,000 on TRK-00028'],
        inputLabel: 'Or specify custom recharge amount:',
        placeholder: 'e.g. TRK-00045, ₹10000...'
      },
      {
        id: 'er_gst',
        text: 'Reconcile GST input credits GSTR-2B discrepancy',
        options: ['Reconcile IOCL fuel bill GST (₹9.2L credit)', 'Reconcile Bridgestone tyre invoice (₹3.4L credit)', 'Reconcile Bosch parts purchase (₹1.8L credit)'],
        inputLabel: 'Or enter custom invoice number:',
        placeholder: 'e.g. INV-8927...'
      },
      {
        id: 'er_payable',
        text: 'Audit vendor accounts payable balances',
        options: ['Indian Oil (₹4.2Cr payable)', 'HPCL (₹2.8Cr payable)', 'Bridgestone (₹85L payable)'],
        inputLabel: 'Or specify custom vendor name:',
        placeholder: 'e.g. Bosch...'
      },
      {
        id: 'er_compliance_report',
        text: 'Generate monthly tax compliance report',
        options: ['Q1 GST Return Filings', 'TDS Challan Reconciliation', 'E-way Bill Audit Trail'],
        inputLabel: 'Or enter specific month/year:',
        placeholder: 'e.g. June 2026...'
      }
    ]
  },
  {
    id: 'crm',
    name: 'CRM Customer Health',
    icon: <User size={14} />,
    color: '#ec4899',
    questions: [
      {
        id: 'cr_churn',
        text: 'Audit VIP customer churn risk factors',
        options: ['BlueDart Cargo (89% Risk)', 'Safexpress (76% Risk)', 'DTDC Supply (71% Risk)'],
        inputLabel: 'Or enter specific customer name:',
        placeholder: 'e.g. Tata Motors...'
      },
      {
        id: 'cr_support',
        text: 'Escalate open support tickets in queue',
        options: ['Ticket #1893: Late delivery Nagpur detour (Escalate to COO)', 'Ticket #1562: FASTag charge dispute (Escalate to Finance)', 'Ticket #1244: Temperature sensor mismatch (Escalate to Eng)'],
        inputLabel: 'Or specify support ticket ID to escalate:',
        placeholder: 'e.g. #1042...'
      },
      {
        id: 'cr_sales_conv',
        text: 'Analyze sales pipeline conversion rates',
        options: ['Proposal to Negotiation (42%)', 'Lead to Qualified (68%)', 'Negotiation to Closed Won (18%)'],
        inputLabel: 'Or enter custom pipeline stage to analyze:',
        placeholder: 'e.g. Prospecting...'
      },
      {
        id: 'cr_client_feedback',
        text: 'Schedule customer feedback review sessions',
        options: ['Tata Motors (Satisfaction: 4.8/5)', 'Safexpress (Satisfaction: 3.9/5)', 'BlueDart (Satisfaction: 4.2/5)'],
        inputLabel: 'Or enter specific client account:',
        placeholder: 'e.g. Reliance Retail...'
      }
    ]
  },
  {
    id: 'hcm',
    name: 'HCM Safety Academy',
    icon: <Users size={14} />,
    color: '#f59e0b',
    questions: [
      {
        id: 'hc_score',
        text: 'Enroll driver in safety coaching program',
        options: ['Enroll Suresh Yadav (Safety score: 72)', 'Enroll Ashok Pandey (Safety score: 68)', 'Enroll Deepak Gupta (Safety score: 75)'],
        inputLabel: 'Or specify driver name:',
        placeholder: 'e.g. Rajesh Kumar...'
      },
      {
        id: 'hc_fatigue',
        text: 'Trigger mandatory driver rest hours',
        options: ['Rest Ashok Pandey (Fatigue: 85%)', 'Rest Suresh Yadav (Fatigue: 72%)', 'Rest Kiran Naik (Fatigue: 68%)'],
        inputLabel: 'Or specify custom driver to rest:',
        placeholder: 'e.g. Manoj Singh...'
      },
      {
        id: 'hc_payroll',
        text: 'Review driver payroll status & bonuses',
        options: ['Ashok Pandey (₹45k base + ₹5k bonus)', 'Suresh Yadav (₹42k base + ₹3k bonus)', 'Deepak Gupta (₹48k base + ₹8k bonus)'],
        inputLabel: 'Or enter custom employee ID:',
        placeholder: 'e.g. EMP-1823...'
      },
      {
        id: 'hc_compliance',
        text: 'Monitor driver compliance & licensing',
        options: ['Commercial License expiry checks', 'Medical clearance certificates', 'State permit authorization renewals'],
        inputLabel: 'Or specify custom permit state:',
        placeholder: 'e.g. MH permit...'
      }
    ]
  },
  {
    id: 'agents',
    name: 'AI Agents Matrix',
    icon: <Bot size={14} />,
    color: '#ff7300',
    questions: [
      {
        id: 'ag_memory',
        text: 'Scan cognitive memory variables',
        options: ['Scan Supply Chain Agent (Memory buffer: 82%)', 'Scan Finance Agent (Memory buffer: 94%)', 'Scan Engineering Agent (Memory buffer: 78%)'],
        inputLabel: 'Or specify custom agent ID:',
        placeholder: 'e.g. Sales Agent...'
      },
      {
        id: 'ag_reasoning',
        text: 'Audit en-route decision packages',
        options: ['Review last 10 auto-bidding actions', 'Review auto-dispatch compliance decisions', 'Review sensor recalibration logs'],
        inputLabel: 'Or enter specific query for agent logic:',
        placeholder: 'e.g. Why did it skip Jaipur?...'
      },
      {
        id: 'ag_scale',
        text: 'Scale agent cognitive compute instances',
        options: ['Allocate +2 CPU cores to Finance Agent', 'Allocate +4 CPU cores to Supply Chain Agent', 'Reset Executive Agent cluster'],
        inputLabel: 'Or enter specific scaling instructions:',
        placeholder: 'e.g. scale HR Agent...'
      },
      {
        id: 'ag_auto_logs',
        text: 'Review autonomous action logs',
        options: ['Auto-dispatch: 142 actions taken', 'Auto-bidding: 89 bids processed', 'Auto-maintenance: 12 triggers active'],
        inputLabel: 'Or specify custom agent role:',
        placeholder: 'e.g. Engineering Agent...'
      }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics & Forecast',
    icon: <BarChart3 size={14} />,
    color: '#059669',
    questions: [
      {
        id: 'an_forecast',
        text: 'Review demand volume forecasts (+6 Months)',
        options: ['Western Corridor peak demand projection', 'Northern Corridor regional capacity forecast', 'Eastern Corridor monsoon volume impact'],
        inputLabel: 'Or specify custom route corridor:',
        placeholder: 'e.g. Bangalore-Chennai...'
      },
      {
        id: 'an_fuel',
        text: 'Compare fuel efficiency across truck models',
        options: ['Volvo FM420 (Avg: 3.8 km/L)', 'Tata Prima (Avg: 4.2 km/L)', 'Eicher Pro 6049 (Avg: 5.2 km/L)'],
        inputLabel: 'Or specify specific model to compare:',
        placeholder: 'e.g. BharatBenz...'
      },
      {
        id: 'an_cost_breakdown',
        text: 'Analyze regional cost breakdown',
        options: ['Fuel expenses (38% of total)', 'Driver salaries (22% of total)', 'Toll expenses (14% of total)'],
        inputLabel: 'Or specify custom cost category:',
        placeholder: 'e.g. Maintenance...'
      },
      {
        id: 'an_carbon_trend',
        text: 'Track carbon footprint reduction trends',
        options: ['Q1: -8.4% CO2 emissions', 'Q2: -12.1% CO2 emissions', 'Target: -15% CO2 emissions by year-end'],
        inputLabel: 'Or specify custom carbon limit (tonnes):',
        placeholder: 'e.g. 200 tonnes...'
      }
    ]
  },
  {
    id: 'profile',
    name: 'Profile & Security',
    icon: <Settings size={14} />,
    color: '#8b5cf6',
    questions: [
      {
        id: 'pr_token',
        text: 'Generate scoped API token key credentials',
        options: ['Generate Write-Access Token (ScyllaDB sync)', 'Generate Read-Only Token (Audit logger)', 'Generate Admin Token (Full controls)'],
        inputLabel: 'Or specify token purpose/name:',
        placeholder: 'e.g. Mobile App API...'
      },
      {
        id: 'pr_device',
        text: 'Revoke active authorized device sessions',
        options: ['Revoke MacBook Pro session (IP: 192.168.1.15)', 'Revoke iPhone 15 Pro session (IP: 103.44.12.8)', 'Revoke Ubuntu Server session (IP: 18.24.90.1)'],
        inputLabel: 'Or enter custom IP/session token:',
        placeholder: 'e.g. Session #891...'
      },
      {
        id: 'pr_mfa',
        text: 'Toggle two-factor security protocols',
        options: ['Enable SMS Multi-Factor Authentication', 'Enable Biometric TouchID Gateway', 'Enable Google Authenticator TOTP'],
        inputLabel: 'Or specify custom security policy details:',
        placeholder: 'e.g. hardware security key...'
      },
      {
        id: 'pr_audit',
        text: 'Review security audit trails',
        options: ['Audit: 3 login failures from Mumbai IP', 'Audit: API key created by Admin', 'Audit: Driver rest policy updated'],
        inputLabel: 'Or enter custom search keyword for audit logs:',
        placeholder: 'e.g. Billing...'
      }
    ]
  }
];

// ============================================================
// Main Component
// ============================================================
const AICopilot = () => {
  useEffect(() => { injectKeyframes(); }, []);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [customInputValue, setCustomInputValue] = useState('');

  const [messages, setMessages] = useState(() => {
    const initialMessages = [];
    copilotConversations.forEach(conv => {
      initialMessages.push({ id: `q-${conv.id}`, type: 'user', text: conv.query, time: new Date(Date.now() - (conv.id * 3600000)) });
      initialMessages.push({
        id: `a-${conv.id}`,
        type: 'ai',
        text: conv.response.summary,
        data: conv.response,
        time: new Date(Date.now() - (conv.id * 3600000) + 2000),
      });
    });
    return initialMessages;
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;

    const userMsg = { id: `u-${Date.now()}`, type: 'user', text, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        text: `I've analyzed your query: "${text}". Based on current fleet data across ${formatNumber(platformKPIs.totalTrucks)} trucks and ${formatNumber(platformKPIs.totalDrivers)} drivers, here's what I found:`,
        data: {
          summary: `Analysis complete. The fleet is operating at ${platformKPIs.fleetUtilization}% utilization with an on-time delivery rate of ${platformKPIs.onTimeDelivery}%.`,
          recommendation: 'I recommend reviewing the detailed analytics dashboard for deeper insights on this topic.',
        },
        time: new Date(),
      };
      setIsTyping(false);
      setMessages(prev => [...prev, aiMsg]);
    }, 1800);
  }, [inputValue]);

  const handleWizardSubmit = (category, question, selectedOpt, writeInVal) => {
    const parameterText = selectedOpt 
      ? `Selected Choice: "${selectedOpt}"` 
      : writeInVal 
        ? `Custom Parameter: "${writeInVal}"` 
        : 'None selected';
        
    const textQuery = `[AI OS Wizard — ${category.name}] ${question.text}\n${parameterText}`;
    
    const userMsg = { id: `u-${Date.now()}`, type: 'user', text: textQuery, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    
    // Simulate AI response based on question ID and parameter
    setTimeout(() => {
      let responseText = '';
      let dataCardTitle = '';
      let dataCardItems = [];
      let dataCardColor = '#6366f1';
      let recommendation = '';
      let sources = [];
      const targetParam = selectedOpt || writeInVal || 'Default Core';
      
      switch (question.id) {
        case 'db_leakage':
          responseText = `Scanning active ledgers for financial leakage related to "${targetParam}"... AI audit has identified discrepancy anomalies in sub-accounts.`;
          dataCardTitle = 'Operations Cost Audit';
          dataCardColor = '#FF4D6B';
          dataCardItems = [
            { label: 'Unreconciled FASTag Debits', value: '₹1,84,500', highlight: true },
            { label: 'Idle Fuel Staging Variance', value: '₹3,12,000', highlight: true },
            { label: 'Contract Billing Deviations', value: '₹84,000', highlight: false }
          ];
          recommendation = 'Activate auto-billing reconciliation and restrict manual invoice postings above ₹50,000.';
          sources = ['ERP Ledger L6', 'IOCL Fuel Log #284', 'FASTag Audit'];
          break;
          
        case 'db_utilization':
          responseText = `Analyzing freight density and utilization margins for "${targetParam}"... Capacity balance is highly constrained by regional routing gaps.`;
          dataCardTitle = 'Corridor Utilization';
          dataCardColor = '#3b82f6';
          dataCardItems = [
            { label: 'Active Fleet Load Factor', value: '78.4%', highlight: false },
            { label: 'Empty Backhaul Mileage', value: '22.8%', highlight: true },
            { label: 'Avg Dwell Delay Hours', value: '4.2h', highlight: true }
          ];
          recommendation = 'Deploy empty-return brokers and run AI Spot Auto-Matcher to capture regional backhaul demand.';
          sources = ['Fleet OS telemetry', 'Broker Spot Registry', 'Regional KPIs'];
          break;

        case 'db_carbon':
          responseText = `Evaluating executive green compliance targets and carbon offset performance for "${targetParam}"... Offset ledger audited.`;
          dataCardTitle = 'CEO Carbon Index';
          dataCardColor = '#059669';
          dataCardItems = [
            { label: 'Total Carbon Offset', value: '1,420 tonnes', highlight: false },
            { label: 'Offset Budget Remaining', value: '₹12,45,000', highlight: false },
            { label: 'Target Emissions Variance', value: '-12.4%', highlight: true }
          ];
          recommendation = 'Authorize carbon credit purchase under CFO ledger to reach the Net-Zero Q3 milestone.';
          sources = ['Green Ledger API', 'CFO Financial Twin', 'Carbon Emissions Register'];
          break;

        case 'db_revenue_routes':
          responseText = `Scanning high-density freight corridors for yield margins matching "${targetParam}"... Yield analysis complete.`;
          dataCardTitle = 'Route Profitability Index';
          dataCardColor = '#6366f1';
          dataCardItems = [
            { label: 'Average Yield per km', value: '₹148.50', highlight: true },
            { label: 'Daily Bookings Count', value: '184 shipments', highlight: false },
            { label: 'Profitability Margin', value: '28.4%', highlight: true }
          ];
          recommendation = 'Increase spot rates by 4.5% on this corridor to match capacity constraints and peak demand.';
          sources = ['Vantage Route Pricing', 'CRM Booking Database', 'Revenue Streams Matrix'];
          break;
          
        case 'fl_dtc':
          responseText = `Running vehicle telemetry scan on target "${targetParam}"... Diagnostics connection successful. Check logs below for sensor trouble codes.`;
          dataCardTitle = 'ECU Telemetry Diagnostics';
          dataCardColor = '#ec4899';
          dataCardItems = [
            { label: 'Coolant Temperature', value: '98 °C', highlight: true },
            { label: 'Oil Pressure Sensor', value: '42 psi', highlight: false },
            { label: 'OBD-II Fault Status', value: 'Clear Pending', highlight: true }
          ];
          recommendation = 'Click "Clear Codes & Recalibrate Sensors" in Fleet OS (Layer 3) to execute target channel reset.';
          sources = ['OBD-II Telemetry Link', 'Volvo/Tata ECU Registers'];
          break;
          
        case 'fl_maint':
          responseText = `Scheduling preventive service request for task "${targetParam}"... Maintenance dispatch queue initialized.`;
          dataCardTitle = 'Service Schedule Status';
          dataCardColor = '#f59e0b';
          dataCardItems = [
            { label: 'Assigned Workshop', value: 'Nagpur GIDC Hub', highlight: false },
            { label: 'Estimated Cost Quote', value: '₹18,400', highlight: true },
            { label: 'Transit Down-Time Est', value: '1.5 days', highlight: true }
          ];
          recommendation = 'Approve service ticket under Vendor Portal (Layer 4) to authorize repair crew staging.';
          sources = ['Vendor Service Ledger', 'Asset Maintenance History'];
          break;

        case 'fl_fuel_opt':
          responseText = `Analyzing fleet governor constraints and efficiency thresholds for policy: "${targetParam}"... Telemetry audit complete.`;
          dataCardTitle = 'Fleet Efficiency Audit';
          dataCardColor = '#3b82f6';
          dataCardItems = [
            { label: 'Idle Fuel Waste Limit', value: '5 min/hr max', highlight: true },
            { label: 'Speed Governor Status', value: 'Active (80 km/h)', highlight: false },
            { label: 'Carbon Compliance Factor', value: '94.2%', highlight: true }
          ];
          recommendation = 'Deploy speed limiter profile updates to all long-haul tata trucks en-route.';
          sources = ['Fleet OS Speed Registers', 'Fuel Card Programs API'];
          break;

        case 'fl_battery':
          responseText = `Scanning vehicle electrical diagnostic systems for telemetry battery: "${targetParam}"... Voltage scan complete.`;
          dataCardTitle = 'Battery Diagnostic Scan';
          dataCardColor = '#f59e0b';
          dataCardItems = [
            { label: 'Voltage Under Load', value: '23.8V (Normal)', highlight: false },
            { label: 'Cell Degradation Rate', value: '14.2% (Healthy)', highlight: false },
            { label: 'Alternator Diagnostic', value: 'Operational', highlight: true }
          ];
          recommendation = 'No immediate action required. Schedule next physical check in 60 days.';
          sources = ['OBD-II Electrical Link', 'ECU Volts Log'];
          break;
          
        case 'tr_reroute':
          responseText = `Calculating optimized dynamic route bypass for target "${targetParam}" en-route... Corridor congestion analyzed.`;
          dataCardTitle = 'Dynamic Reroute Analysis';
          dataCardColor = '#38CE3C';
          dataCardItems = [
            { label: 'Bypass Alternate Path', value: 'State Hwy 12 detour', highlight: false },
            { label: 'Time Reclaimed en-route', value: '1.8 hours saved', highlight: true },
            { label: 'FASTag extra Toll cost', value: '₹750', highlight: false }
          ];
          recommendation = 'Execute route re-direction immediately. SMS instructions and map coordinates dispatched to driver.';
          sources = ['Supply Chain Bypass Router', 'Google Maps API v3'];
          break;
          
        case 'tr_emergency':
          responseText = `🚨 EMERGENCY SOS RESPONSE TRIGGERED for "${targetParam}"! Highway patrol notified. Global status bar alerts active.`;
          dataCardTitle = 'SOS Incident Sentinel';
          dataCardColor = '#FF4D6B';
          dataCardItems = [
            { label: 'Incident GPS Coordinates', value: '21.145, 79.088', highlight: true },
            { label: 'Assigned Patrol Unit', value: 'Highway Police Div 4', highlight: false },
            { label: 'SLA At-Risk Value', value: '₹48,00,000', highlight: true }
          ];
          recommendation = 'Flashes viewport border warnings. Open Live Tracking (Layer 2) Emergency sidebar to review resolution workflow.';
          sources = ['OBD Crash Telemetry', 'Driver SOS Button Link'];
          break;

        case 'tr_eta_accuracy':
          responseText = `Calculating predictive corridor delay probabilities for shipment: "${targetParam}"... Confidence matrix generated.`;
          dataCardTitle = 'ETA Certainty Engine';
          dataCardColor = '#06b6d4';
          dataCardItems = [
            { label: 'Historical Route Delay', value: '1.4h average', highlight: false },
            { label: 'Congestion Variance', value: '+35 min risk', highlight: true },
            { label: 'ETA Confidence Margin', value: '91.8%', highlight: true }
          ];
          recommendation = 'Confirm the estimated delivery window to customer via automated WhatsApp notification.';
          sources = ['Certainty Predictor API', 'Google Traffic Historical API'];
          break;

        case 'tr_temp_control':
          responseText = `Auditing cold-chain thermal logger diagnostics for reefer target: "${targetParam}"... Temperature logs analyzed.`;
          dataCardTitle = 'Cold Chain Sentinel';
          dataCardColor = '#FF4D6B';
          dataCardItems = [
            { label: 'Ambient Box Temperature', value: '4.2 °C (Stable)', highlight: false },
            { label: 'Compressor Duty Cycle', value: '78% operational', highlight: false },
            { label: 'Thermal Excursion Hazard', value: 'Low Risk', highlight: true }
          ];
          recommendation = 'Verify reefer fuel levels to prevent compression shutoff over the next 12 hours.';
          sources = ['IoT Reefer Sensor Link', 'Cold-Chain Telemetry Hub'];
          break;
          
        case 'kg_gap':
          responseText = `Scanning Logistics Knowledge Graph for operational discrepancies matching "${targetParam}"...`;
          dataCardTitle = 'Graph Anomaly Detection';
          dataCardColor = '#a855f7';
          dataCardItems = [
            { label: 'Transporter-Disputes Gaps', value: '4 anomalies found', highlight: true },
            { label: 'Unlinked E-Way Bills', value: '12 items', highlight: true },
            { label: 'Driver HOS Violation Gaps', value: '2 items', highlight: false }
          ];
          recommendation = 'Review details under Knowledge Graph (Layer 5) and authorize AI Agents to auto-reconcile relations.';
          sources = ['Unified Graph Database', 'Compliance ledger'];
          break;
          
        case 'kg_trace':
          responseText = `Running relationship trace cascade analysis for "${targetParam}"... Downstream impact matrix calculated.`;
          dataCardTitle = 'Cascading Impact Trace';
          dataCardColor = '#06b6d4';
          dataCardItems = [
            { label: 'Stalled Cargo value', value: '₹34,00,000', highlight: true },
            { label: 'Plant Stockout Risk', value: 'Medium (9h margin)', highlight: false },
            { label: 'SLA Invoice Penalty Est', value: '₹1,20,000', highlight: true }
          ];
          recommendation = 'Reroute en-route trucks immediately to protect client margins.';
          sources = ['Relationship Graph Linker', 'CRM Contract Registry'];
          break;

        case 'kg_driver_overlap':
          responseText = `Running resource allocation checks on driver shifts for: "${targetParam}"... Graph audit complete.`;
          dataCardTitle = 'Roster Conflict Auditor';
          dataCardColor = '#a855f7';
          dataCardItems = [
            { label: 'Overlapping Shift Count', value: '0 active conflicts', highlight: false },
            { label: 'Truck Double Allocations', value: 'Clear', highlight: false },
            { label: 'HOS Rest Compliance Rate', value: '98.5%', highlight: true }
          ];
          recommendation = 'No modifications needed. Roster structure complies with government shift requirements.';
          sources = ['Unified Graph Database', 'HCM Attendance Roster'];
          break;

        case 'kg_customer_depend':
          responseText = `Analyzing supplier concentration risks and route dependency clusters for customer: "${targetParam}"... Graph analysis compiled.`;
          dataCardTitle = 'Customer Concentration Risk';
          dataCardColor = '#ec4899';
          dataCardItems = [
            { label: 'Volume Concentration Ratio', value: '42.8% high', highlight: true },
            { label: 'Shipper Node Connectivity', value: '12 connections', highlight: false },
            { label: 'Supply Chain Reliance Index', value: 'High Dependence', highlight: true }
          ];
          recommendation = 'Acquire secondary backup carrier bids to spread transit failure risks on the primary lanes.';
          sources = ['Unified Graph Database', 'CRM Client Contract Portal'];
          break;
          
        case 'pt_warehouse':
          responseText = `Initiating yard queue trailer docking for "${targetParam}"... Dock door scheduling check ok.`;
          dataCardTitle = 'Yard Dock Schedule';
          dataCardColor = '#10b981';
          dataCardItems = [
            { label: 'Assigned Dock Door', value: 'BAY-4 Door Terminal', highlight: false },
            { label: 'Estimated Dwell Hours', value: '1.2h limit', highlight: false },
            { label: 'Labor Productivity Index', value: '94.2%', highlight: true }
          ];
          recommendation = 'Click "Start Loading" under Warehouse Hub (Layer 6) to begin forklift cargo telemetry.';
          sources = ['Warehouse yard Management', 'OBD Gate-In Link'];
          break;
          
        case 'pt_vendor':
          responseText = `Logging refuel order and settling fuel card transaction for "${targetParam}"... Finance budget debit approved.`;
          dataCardTitle = 'Fuel Transaction Receipt';
          dataCardColor = '#38CE3C';
          dataCardItems = [
            { label: 'Fuel Volume Filled', value: '250 Liters Diesel', highlight: false },
            { label: 'Total Settled Expense', value: '₹22,500', highlight: true },
            { label: 'FASTag Card Remaining', value: '₹14,500', highlight: false }
          ];
          recommendation = 'Refuel transaction posted. Updates: ERP Accounting Ledger L6.';
          sources = ['IOCL Fleet Program Link', 'ERP Invoices API'];
          break;

        case 'pt_broker_bid':
          responseText = `Auditing open carrier spot bid validations and escrow compliance for: "${targetParam}"... Bid audit complete.`;
          dataCardTitle = 'Carrier Spot Bid Audit';
          dataCardColor = '#06b6d4';
          dataCardItems = [
            { label: 'Average Bid Deviation', value: '+4.2% vs target', highlight: false },
            { label: 'Carrier Trust Rating', value: '4.8 stars', highlight: true },
            { label: 'Escrow Account Balance', value: '₹2,50,000 locked', highlight: false }
          ];
          recommendation = 'Authorize the auto-dispatch script to lock in the carrier bid immediately.';
          sources = ['Broker Spot Market API', 'Escrow Ledger L5'];
          break;

        case 'pt_staging_schedule':
          responseText = `Optimizing terminal yard dock scheduling and worker shifts for: "${targetParam}"... Yard staging model updated.`;
          dataCardTitle = 'Depot Staging Schedule';
          dataCardColor = '#10b981';
          dataCardItems = [
            { label: 'Scheduled Queue Count', value: '8 trailers en-route', highlight: false },
            { label: 'Bay Door Util Limit', value: '87.4% threshold', highlight: true },
            { label: 'Yard Crew Availability', value: '14 crew active', highlight: false }
          ];
          recommendation = 'Deploy depot overtime schedules to handle the afternoon inbound container surge.';
          sources = ['Warehouse Gate-In Logs', 'HCM Shift Scheduler'];
          break;
          
        case 'er_toll':
          responseText = `Executing FASTag toll card balance auto-recharge policy on target "${targetParam}"...`;
          dataCardTitle = 'FASTag Account Recharge';
          dataCardColor = '#10b981';
          dataCardItems = [
            { label: 'Recharged Amount value', value: '₹15,000', highlight: true },
            { label: 'FASTag Account Balance', value: '₹18,500', highlight: false },
            { label: 'Auto-Recharge Rule status', value: 'Active (Threshold: ₹500)', highlight: false }
          ];
          recommendation = 'FASTag toll accounts verified. Direct debit routed from cash flow account.';
          sources = ['National Highway Toll API', 'ERP Accounting'];
          break;
          
        case 'er_gst':
          responseText = `Scanning GSTR-2B discrepancy ledger for invoice reconcile: "${targetParam}"... Reconciled successfully.`;
          dataCardTitle = 'GST ITC Reconciliation';
          dataCardColor = '#3b82f6';
          dataCardItems = [
            { label: 'Matched Input Tax Credit', value: '₹9,20,000', highlight: true },
            { label: 'GSTR-2B Matching Rate', value: '98.2%', highlight: true },
            { label: 'Pending GST returns logs', value: '2 remaining', highlight: false }
          ];
          recommendation = 'Tax credit reconciled. Updates: Working capital cycle adjusted.';
          sources = ['GSTIN GSTN API portal', 'ERP compliance register'];
          break;

        case 'er_payable':
          responseText = `Auditing accounts payable balances and cash outflows to vendor: "${targetParam}"... AP audit complete.`;
          dataCardTitle = 'Accounts Payable Ledger';
          dataCardColor = '#10b981';
          dataCardItems = [
            { label: 'Outstanding Balance', value: '₹4,12,00,000', highlight: true },
            { label: 'Active Credit Memos', value: '₹8,45,000', highlight: false },
            { label: 'Due Days Aging Limit', value: '45 days average', highlight: false }
          ];
          recommendation = 'Trigger priority wire payments to HPCL to prevent fuel card transaction suspension.';
          sources = ['ERP Financial Ledger', 'Vendor Invoicing Registry'];
          break;

        case 'er_compliance_report':
          responseText = `Compiling e-way bill transaction audit trail logs and tax compliance sheets for: "${targetParam}"... Compliance file ready.`;
          dataCardTitle = 'GST & E-Way Audit';
          dataCardColor = '#3b82f6';
          dataCardItems = [
            { label: 'GST Filings Status', value: 'Filed (GSTR-1, GSTR-3B)', highlight: false },
            { label: 'E-Way Bill Compliance', value: '99.8% accurate', highlight: true },
            { label: 'TDS Reconciled Balance', value: '₹14,80,000', highlight: false }
          ];
          recommendation = 'Download full CSV ledger records and submit to the corporate legal portal.';
          sources = ['GSTN API Gateway', 'E-Way Bill National Database'];
          break;
          
        case 'cr_churn':
          responseText = `Auditing client churn threat metrics for "${targetParam}"... Accounts diagnostic details compiled.`;
          dataCardTitle = 'VIP Accounts Risk Audit';
          dataCardColor = '#FF4D6B';
          dataCardItems = [
            { label: 'Calculated Churn Risk', value: '89%', highlight: true },
            { label: 'Declining Bookings Margin', value: '-42% (60 days)', highlight: true },
            { label: 'active Complaints Count', value: '8 tickets', highlight: false }
          ];
          recommendation = 'Assign priority manager and trigger rebate controls in CRM (Layer 4) immediately.';
          sources = ['CRM Customer Health Engine', 'Salesforce Contract API'];
          break;
          
        case 'cr_support':
          responseText = `Escalating support ticket "${targetParam}" to critical priority queue... Alert dispatched.`;
          dataCardTitle = 'Support Ticket Escalation';
          dataCardColor = '#ec4899';
          dataCardItems = [
            { label: 'Target SLA Limit Hours', value: '2.4 hrs response', highlight: false },
            { label: 'Escalation Level status', value: 'Level 2 (COO Direct)', highlight: true },
            { label: 'Resolution State target', value: 'Assigned en-route', highlight: false }
          ];
          recommendation = 'COO Arjun Kapoor escalations notified. Incident response active.';
          sources = ['CRM Helpdesk API', 'HCM Driver Roster'];
          break;

        case 'cr_sales_conv':
          responseText = `Analyzing pipeline progression velocities and sales margin yields for stage: "${targetParam}"... Pipeline audit complete.`;
          dataCardTitle = 'Sales Pipeline Velocity';
          dataCardColor = '#ec4899';
          dataCardItems = [
            { label: 'Lead Progression Rate', value: '62.4%', highlight: false },
            { label: 'Proposal Win Margin', value: '24.6%', highlight: true },
            { label: 'Negotiation Age Limit', value: '18 days average', highlight: false }
          ];
          recommendation = 'Send executive pricing proposal template directly to qualified FMCG accounts.';
          sources = ['CRM Pipeline Ledger', 'Salesforce Contract API'];
          break;

        case 'cr_client_feedback':
          responseText = `Retrieving Net Promoter Scores and survey metrics for VIP account: "${targetParam}"... Feedback metrics retrieved.`;
          dataCardTitle = 'Client Satisfaction Registry';
          dataCardColor = '#3b82f6';
          dataCardItems = [
            { label: 'NPS Client Index', value: '4.3 / 5 stars', highlight: true },
            { label: 'Open Complaints count', value: '2 items pending', highlight: false },
            { label: 'Billing Error Rates', value: '1.2% ratio', highlight: false }
          ];
          recommendation = 'Initiate monthly review call with operations director to address transit delays.';
          sources = ['CRM Client Support Ledger', 'Customer Survey database'];
          break;
          
        case 'hc_score':
          responseText = `Enrolling driver in safety coaching modules for "${targetParam}"... Academy roster registered.`;
          dataCardTitle = 'Safety Coaching Academy';
          dataCardColor = '#f59e0b';
          dataCardItems = [
            { label: 'Calculated Safety Index', value: '72%', highlight: true },
            { label: 'safety violations Counter', value: '0 cleared', highlight: false },
            { label: 'Expected score gain', value: '+10 points', highlight: true }
          ];
          recommendation = 'Enrollment complete. Safety score updates dynamically upon course completion.';
          sources = ['HCM Safety Academy register', 'Telemetry safety Log'];
          break;
          
        case 'hc_fatigue':
          responseText = `Flagging mandatory rest request for driver: "${targetParam}"... Shift block active.`;
          dataCardTitle = 'HOS Duty Rest Order';
          dataCardColor = '#FF4D6B';
          dataCardItems = [
            { label: 'Driver Fatigue Index', value: '5%', highlight: false },
            { label: 'ELD Duty Roster status', value: 'Rest / Sleeper Berth', highlight: true },
            { label: 'Mandatory Rest Duration', value: '24 Hours shift lock', highlight: false }
          ];
          recommendation = 'Driver HOS rest logs submitted. Telemetry tracking disabled en-route.';
          sources = ['HCM attendance roster', 'ELD Hours of Service Clock'];
          break;

        case 'hc_payroll':
          responseText = `Auditing employee salary ledgers and active safety bonus payout records for: "${targetParam}"... Payroll audit complete.`;
          dataCardTitle = 'Driver Payroll Ledger';
          dataCardColor = '#f59e0b';
          dataCardItems = [
            { label: 'Base Payroll Value', value: '₹36,900 / month', highlight: false },
            { label: 'Safety Bonus Credit', value: '₹5,00,000 approved', highlight: true },
            { label: 'Overtime Hours Index', value: '18.5h total', highlight: false }
          ];
          recommendation = 'Authorize payroll execution and release direct deposit instructions to bank portal.';
          sources = ['HCM Payroll Registry', 'Financial Cash Flow'];
          break;

        case 'hc_compliance':
          responseText = `Verifying state permit updates and driver licensing certifications for: "${targetParam}"... Compliance check complete.`;
          dataCardTitle = 'Driver Permit Sentinel';
          dataCardColor = '#10b981';
          dataCardItems = [
            { label: 'State Permit Validity', value: 'Active permit (All-India)', highlight: false },
            { label: 'Medical Fitness Status', value: 'Approved (Certified)', highlight: true },
            { label: 'Driver License Validity', value: 'Expiring: 14-Oct-2027', highlight: false }
          ];
          recommendation = 'Permit credentials verified. Driver remains fully active en-route.';
          sources = ['HCM Safety Register', 'RTO National Parivahan Database'];
          break;
          
        case 'ag_memory':
          responseText = `Executing cognitive variables scan on target "${targetParam}"... Agent database diagnostics active.`;
          dataCardTitle = 'Cognitive Memory Console';
          dataCardColor = '#ec4899';
          dataCardItems = [
            { label: 'Memory Buffer Index', value: '82%', highlight: false },
            { label: 'Thinking Presets limit', value: '2,00,000 steps/sec', highlight: true },
            { label: 'Active Tasks Queue', value: '23 pending', highlight: false }
          ];
          recommendation = 'Cognitive limits check ok. Tool configurations verified.';
          sources = ['AI Cognitive Console', 'Engineering Agent API'];
          break;
          
        case 'ag_reasoning':
          responseText = `Auditing agent reasoning terminals for query: "${targetParam}"... Decision chain traced.`;
          dataCardTitle = 'Decision Package Audit';
          dataCardColor = '#f97316';
          dataCardItems = [
            { label: 'Primary Learning Model', value: 'XGBoost v4', highlight: false },
            { label: 'Decision Confidence Pct', value: '94.2%', highlight: true },
            { label: 'Action execution status', value: 'Auto-Approved en-route', highlight: false }
          ];
          recommendation = 'Reasoning check ok. Learning weights updated based on route results.';
          sources = ['AI Cognitive Console', 'Executive Agent Log'];
          break;

        case 'ag_scale':
          responseText = `Allocating extra hardware clusters and thread capacities for agent matrix: "${targetParam}"... Scale command executed.`;
          dataCardTitle = 'Agent Compute Controller';
          dataCardColor = '#ff7300';
          dataCardItems = [
            { label: 'Allocated CPU Limits', value: '8 Cores (+2 boost)', highlight: true },
            { label: 'RAM Buffer Capacity', value: '16GB cluster limit', highlight: false },
            { label: 'Node Cluster Status', value: 'Online Re-Balanced', highlight: true }
          ];
          recommendation = 'Monitor system dashboard (Layer 12) for response latency gains over the next hour.';
          sources = ['DevOps Cluster Monitor', 'Engineering Agent API'];
          break;

        case 'ag_auto_logs':
          responseText = `Scanning autonomous audit files and closed-loop decisions registry for agent: "${targetParam}"... Decision logs compiled.`;
          dataCardTitle = 'Autonomy Actions Log';
          dataCardColor = '#ff7300';
          dataCardItems = [
            { label: 'Bids Processed Count', value: '89 bids approved', highlight: false },
            { label: 'Route Recalculations', value: '12 active triggers', highlight: true },
            { label: 'Telemetry Diagnostics', value: '4 clear commands', highlight: false }
          ];
          recommendation = 'Review detailed agent reasoning terminals to verify autonomous bidding margins.';
          sources = ['Aut Autonomy Console', 'ScyllaDB Decision Logs'];
          break;
          
        case 'an_forecast':
          responseText = `Reviewing regional capacity and volume demand forecasts for "${targetParam}"... Analytics charts calculated.`;
          dataCardTitle = 'Demand Forecast Index';
          dataCardColor = '#059669';
          dataCardItems = [
            { label: 'Predicted Peak Volumes', value: '1,18,000 tonnes', highlight: true },
            { label: 'Confidence Band range', value: '1,12,000 - 1,24,000', highlight: false },
            { label: 'Expected Growth rate', value: '+12.6%', highlight: true }
          ];
          recommendation = 'Allocate partner fleet capacity to Western and Northern corridors to match peak volume spikes.';
          sources = ['Analytics Demand Engine', 'Market Bloomberg Index'];
          break;
          
        case 'an_fuel':
          responseText = `Comparing fuel efficiency benchmarks for truck model "${targetParam}"... OBD averages compiled.`;
          dataCardTitle = 'Fuel Thrift Comparison';
          dataCardColor = '#3b82f6';
          dataCardItems = [
            { label: 'Avg fuel consumption', value: '4.8 km/L', highlight: false },
            { label: 'optimized route savings', value: '+0.4 km/L', highlight: true },
            { label: 'Daily fuel spend offset', value: '₹12,00,000 savings', highlight: false }
          ];
          recommendation = 'Deploy CNG and electric models to city corridors to maximize cost-efficiency.';
          sources = ['OBD-II Telemetry Link', 'Fuel Card Programs API'];
          break;

        case 'an_cost_breakdown':
          responseText = `Analyzing operational spend divisions and expense distribution indexes for cost category: "${targetParam}"... Analytics complete.`;
          dataCardTitle = 'Regional Cost Allocation';
          dataCardColor = '#059669';
          dataCardItems = [
            { label: 'Fuel Expenses Share', value: '38% of total spend', highlight: false },
            { label: 'Maintenance Cost Share', value: '12% of total spend', highlight: false },
            { label: 'Driver Salaries Share', value: '22% of total spend', highlight: true }
          ];
          recommendation = 'Implement empty-mile minimization policies to offset fuel cost projections.';
          sources = ['Analytics Profit & Loss Engine', 'ERP Invoice Ledger L6'];
          break;

        case 'an_carbon_trend':
          responseText = `Scanning carbon emission reductions and credits ledger matching: "${targetParam}"... Carbon logs compiled.`;
          dataCardTitle = 'Carbon Offset Registry';
          dataCardColor = '#38CE3C';
          dataCardItems = [
            { label: 'Active Offsets Bought', value: '540 credit tonnes', highlight: true },
            { label: 'Fleet Emissions Offset', value: '18% gross offset', highlight: false },
            { label: 'Compliance Trend Factor', value: 'Excellent (Green)', highlight: true }
          ];
          recommendation = 'Continue carbon credit investments under Customer Portal Tab 4 to sustain current targets.';
          sources = ['Green Ledger API', 'CFO Financial Twin'];
          break;
          
        case 'pr_token':
          responseText = `Generating scoped API token credentials for purpose "${targetParam}"... Key sync active.`;
          dataCardTitle = 'API Token Hub Status';
          dataCardColor = '#8b5cf6';
          dataCardItems = [
            { label: 'Generated Token Scopes', value: 'Write-Access ScyllaDB', highlight: true },
            { label: 'Token Expiry duration', value: '90 Days limit', highlight: false },
            { label: 'Sync compliance status', value: 'Secure (SHA-256)', highlight: false }
          ];
          recommendation = 'API key generated. Restrict token scope to designated integration channels.';
          sources = ['API Gateway controller', 'Security Fortress'];
          break;
          
        case 'pr_device':
          responseText = `Terminating session and revoking credentials for target "${targetParam}"... Action logged.`;
          dataCardTitle = 'Fortress Session Revoked';
          dataCardColor = '#FF4D6B';
          dataCardItems = [
            { label: 'Revoked Device IP', value: '192.168.1.15', highlight: true },
            { label: 'Revocation Time logged', value: 'Instant / Real-Time', highlight: false },
            { label: 'Authorized Device count', value: '2 remaining', highlight: false }
          ];
          recommendation = 'Session terminated. Updates: User security twin notifications flagged.';
          sources = ['Identity Access Controller', 'DevOps monitoring'];
          break;

        case 'pr_mfa':
          responseText = `Updating two-factor validation policies and biometric security access rules for: "${targetParam}"... Security portal config updated.`;
          dataCardTitle = 'Fortress MFA Protocols';
          dataCardColor = '#8b5cf6';
          dataCardItems = [
            { label: 'MFA Verification status', value: 'SMS / TOTP Active', highlight: true },
            { label: 'Biometric TouchID Gateway', value: 'Enabled', highlight: false },
            { label: 'Trusted Devices Count', value: '3 verified devices', highlight: true }
          ];
          recommendation = 'Verify new biometric profiles under Security Tab on mobile client to register sensors.';
          sources = ['Fortress Security Panel', 'Identity Access Controller'];
          break;

        case 'pr_audit':
          responseText = `Scanning system audit logs and DevOps security ledger logs matching keyword: "${targetParam}"... Audit scan complete.`;
          dataCardTitle = 'Fortress Audit Log Scan';
          dataCardColor = '#8b5cf6';
          dataCardItems = [
            { label: 'Failed Login Attempts', value: '3 attempts recorded', highlight: true },
            { label: 'API Key Revisions count', value: '1 event today', highlight: false },
            { label: 'Config updates logs', value: '2 events logged', highlight: false }
          ];
          recommendation = 'Investigate the failed login attempts originating from IP 184.22.91.4.';
          sources = ['Fortress Audit Registry', 'API Gateway Logger'];
          break;
          
        default:
          responseText = `Analyzing query: "${question.text}". Selected Parameter: "${targetParam}"... Core diagnostics check completed successfully.`;
          dataCardTitle = 'AI OS Diagnostic';
          dataCardColor = '#6366f1';
          dataCardItems = [
            { label: 'Status Code', value: 'Success 200', highlight: false },
            { label: 'Confidence Margin', value: '96%', highlight: true }
          ];
          recommendation = 'No anomalies detected. Operations are running within target parameters.';
          sources = ['GatiFleet Transport AI OS Kernel'];
      }
      
      const aiMsg = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        text: responseText,
        data: {
          summary: responseText,
          reasons: null,
          recommendation,
          sources
        },
        time: new Date(),
        wizardData: {
          title: dataCardTitle,
          items: dataCardItems,
          color: dataCardColor
        }
      };
      
      setIsTyping(false);
      setMessages(prev => [...prev, aiMsg]);
    }, 1800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // ---- Recent queries (from conversations + extra) ----
  const recentQueries = [
    ...copilotConversations.map(c => c.query),
    'Show fuel efficiency by truck type',
    'Which routes have the highest delay rates?',
    'Predict maintenance needs for next week',
  ];

  // ---- Trending topics ----
  const trendingTopics = [
    { topic: 'Fuel cost optimization', count: 234, trend: 'up' },
    { topic: 'Route delay analysis', count: 189, trend: 'up' },
    { topic: 'Driver performance', count: 156, trend: 'stable' },
    { topic: 'Revenue forecasting', count: 142, trend: 'up' },
    { topic: 'Fleet utilization gaps', count: 118, trend: 'down' },
  ];

  // ---- Capabilities ----
  const capabilities = [
    { category: 'Fleet Intelligence', items: ['Real-time tracking', 'Route optimization', 'Fuel analytics'], icon: <Truck size={14} />, color: '#38CE3C' },
    { category: 'Financial Insights', items: ['Revenue analysis', 'Cost breakdown', 'Toll reconciliation'], icon: <IndianRupee size={14} />, color: '#6366f1' },
    { category: 'Predictive Analytics', items: ['Demand forecasting', 'Churn prediction', 'Maintenance alerts'], icon: <Brain size={14} />, color: '#f59e0b' },
    { category: 'Operations', items: ['Load matching', 'Driver scheduling', 'Compliance checks'], icon: <Route size={14} />, color: '#3b82f6' },
  ];

  // ---- KPI cards ----
  const quickStats = [
    { label: 'Revenue', value: formatCurrency(platformKPIs.revenue.thisMonth), change: `+${platformKPIs.revenue.growth}%`, icon: <IndianRupee size={16} />, color: '#38CE3C' },
    { label: 'Fleet', value: formatNumber(platformKPIs.activeTrucks), change: `${platformKPIs.fleetUtilization}% util`, icon: <Truck size={16} />, color: '#3b82f6' },
    { label: 'Deliveries', value: formatNumber(platformKPIs.dailyShipments), change: `${platformKPIs.onTimeDelivery}% on-time`, icon: <Package size={16} />, color: '#6366f1' },
    { label: 'Alerts', value: '12', change: '3 critical', icon: <AlertTriangle size={16} />, color: '#FF4D6B' },
  ];

  // ---- Styles ----
  const s = {
    page: {
      display: 'flex',
      height: 'calc(100vh - var(--topbar-height) - 48px)',
      width: '100%',
      background: 'var(--surface-solid)',
      border: '1px solid var(--surface-border)',
      borderRadius: 'var(--radius-lg)',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-primary)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-lg)',
    },

    // Left panel — Chat
    leftPanel: {
      flex: '0 0 60%',
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid var(--surface-border)',
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.01)',
      overflow: 'hidden',
    },
    chatHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '24px 32px',
      borderBottom: '1px solid var(--surface-border)',
      background: 'var(--surface-solid)',
      flexShrink: 0,
    },
    chatHeaderIcon: {
      width: 48, height: 48,
      borderRadius: 'var(--radius-md)',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 20px rgba(99,102,241,0.25)',
    },
    chatHeaderTitle: {
      fontSize: '20px',
      fontWeight: 700,
    },
    chatHeaderSub: {
      fontSize: '13px',
      color: 'var(--text-muted)',
    },
    onlineBadge: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '11px',
      fontWeight: 600,
      color: '#38CE3C',
      padding: '4px 12px',
      borderRadius: '14px',
      background: 'rgba(56,206,60,0.1)',
      border: '1px solid rgba(56,206,60,0.2)',
    },
    onlineDot: {
      width: 7, height: 7,
      borderRadius: '50%',
      background: '#38CE3C',
      boxShadow: '0 0 6px #38CE3C',
    },

    // Messages area
    messagesArea: {
      flex: 1,
      overflowY: 'auto',
      padding: '24px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    welcomeCard: {
      textAlign: 'center',
      padding: '40px 32px',
      marginBottom: '8px',
    },
    welcomeIconWrap: {
      width: 72, height: 72,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 16px',
      animation: 'gati-copilot-glow 3s ease-in-out infinite',
    },
    welcomeTitle: {
      fontSize: '22px',
      fontWeight: 800,
      background: 'linear-gradient(135deg, var(--text-primary), var(--primary-400))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '6px',
    },
    welcomeSubtitle: {
      fontSize: '13px',
      color: 'var(--text-secondary)',
      maxWidth: '420px',
      margin: '0 auto',
      lineHeight: 1.5,
    },

    // User message
    userBubble: {
      alignSelf: 'flex-end',
      maxWidth: '75%',
      background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
      color: '#fff',
      padding: '14px 20px',
      borderRadius: '18px 18px 4px 18px',
      fontSize: '15px',
      lineHeight: 1.5,
    },
    // AI message
    aiBubble: {
      alignSelf: 'flex-start',
      maxWidth: '85%',
      background: 'var(--bg-700)',
      border: '1px solid var(--surface-border)',
      padding: '18px 22px',
      borderRadius: '4px 18px 18px 18px',
      fontSize: '15px',
      lineHeight: 1.6,
      color: 'var(--text-primary)',
    },
    aiHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '10px',
    },
    aiAvatarSmall: {
      width: 28, height: 28,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    aiName: {
      fontSize: '13px',
      fontWeight: 700,
      color: 'var(--primary-400)',
    },
    msgTime: {
      fontSize: '11px',
      color: 'var(--text-muted)',
      marginTop: '8px',
    },
    msgActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginTop: '12px',
    },
    msgActionBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32, height: 32,
      borderRadius: '50%',
      background: 'var(--bg-600)',
      border: 'none',
      color: 'var(--text-muted)',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    },

    // Reason cards in AI responses
    reasonCard: {
      background: 'var(--bg-800)',
      border: '1px solid var(--surface-border)',
      borderRadius: 'var(--radius-sm)',
      padding: '10px 14px',
      marginTop: '8px',
    },
    reasonRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '12px',
      marginBottom: '4px',
    },

    // Input area
    inputArea: {
      padding: '16px 28px 20px',
      borderTop: '1px solid var(--surface-border)',
      background: 'var(--surface-solid)',
      flexShrink: 0,
    },
    suggestionsRow: {
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      paddingBottom: '12px',
      scrollbarWidth: 'none',
    },
    suggestionChip: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      padding: '6px 14px',
      borderRadius: '20px',
      background: 'var(--bg-700)',
      border: '1px solid var(--surface-border)',
      color: 'var(--text-secondary)',
      fontSize: '12px',
      fontWeight: 500,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'all 0.2s ease',
      flexShrink: 0,
    },
    inputRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: 'var(--bg-700)',
      border: '1px solid var(--surface-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '6px 8px 6px 18px',
    },
    textInput: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      color: 'var(--text-primary)',
      fontSize: '15px',
      fontFamily: 'var(--font-sans)',
      resize: 'none',
      minHeight: '24px',
      maxHeight: '100px',
    },
    sendBtn: (hasText) => ({
      width: 40, height: 40,
      borderRadius: 'var(--radius-md)',
      background: hasText ? 'linear-gradient(135deg, #6366f1, #7c3aed)' : 'var(--bg-600)',
      border: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: hasText ? 'pointer' : 'default',
      color: hasText ? '#fff' : 'var(--text-muted)',
      transition: 'all 0.2s ease',
      flexShrink: 0,
    }),
    inputHint: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '8px',
      fontSize: '10px',
      color: 'var(--text-muted)',
    },

    // Right panel — Context
    rightPanel: {
      flex: '0 0 40%',
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      padding: '24px',
      gap: '20px',
      background: 'var(--bg-800)',
    },
    panelCard: {
      background: 'var(--surface-solid)',
      border: '1px solid var(--surface-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
    },
    panelTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: 700,
      color: 'var(--text-primary)',
      marginBottom: '16px',
    },

    // Quick stats
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
    },
    statMini: (color) => ({
      background: 'var(--bg-700)',
      border: '1px solid var(--surface-border)',
      borderRadius: 'var(--radius-md)',
      padding: '14px',
      position: 'relative',
      overflow: 'hidden',
    }),
    statMiniIcon: (color) => ({
      width: 32, height: 32,
      borderRadius: 'var(--radius-sm)',
      background: `${color}15`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: '8px',
    }),
    statMiniLabel: {
      fontSize: '11px',
      color: 'var(--text-muted)',
      marginBottom: '2px',
    },
    statMiniValue: {
      fontSize: '18px',
      fontWeight: 800,
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-primary)',
    },
    statMiniChange: (color) => ({
      fontSize: '10px',
      fontWeight: 600,
      color,
      marginTop: '2px',
    }),

    // Recent queries list
    queryItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 12px',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      transition: 'background 0.15s',
      fontSize: '12px',
      color: 'var(--text-secondary)',
      lineHeight: 1.4,
    },
    queryIcon: {
      width: 28, height: 28,
      borderRadius: '50%',
      background: 'var(--bg-600)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    },

    // Trending
    trendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 0',
      borderBottom: '1px solid var(--surface-border)',
    },
    trendRank: (i) => ({
      width: 22, height: 22,
      borderRadius: '50%',
      background: i < 3 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'var(--bg-600)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '10px',
      fontWeight: 700,
      color: i < 3 ? '#fff' : 'var(--text-muted)',
      flexShrink: 0,
    }),
    trendText: {
      flex: 1,
      fontSize: '12px',
      color: 'var(--text-secondary)',
    },
    trendCount: {
      fontSize: '10px',
      fontWeight: 600,
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
    },
    trendArrow: (trend) => ({
      color: trend === 'up' ? '#38CE3C' : trend === 'down' ? '#FF4D6B' : 'var(--text-muted)',
    }),

    // Capabilities
    capCategory: {
      marginBottom: '14px',
    },
    capCategoryTitle: (color) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '12px',
      fontWeight: 700,
      color,
      marginBottom: '8px',
    }),
    capItem: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '3px 10px',
      borderRadius: '10px',
      background: 'var(--bg-700)',
      border: '1px solid var(--surface-border)',
      fontSize: '11px',
      color: 'var(--text-secondary)',
      marginRight: '6px',
      marginBottom: '6px',
    },
  };

  const formatTime = (date) => {
    if (!(date instanceof Date)) return '';
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div style={s.page}>
      {/* =============== LEFT PANEL — Chat =============== */}
      <div style={s.leftPanel}>
        {/* Chat Header */}
        <div style={s.chatHeader}>
          <div style={s.chatHeaderIcon}>
            <Bot size={22} color="#fff" />
          </div>
          <div>
            <div style={s.chatHeaderTitle}>GatiFleet Copilot</div>
            <div style={s.chatHeaderSub}>Your AI-powered transportation intelligence assistant</div>
          </div>
          <div style={s.onlineBadge}>
            <span style={s.onlineDot} />
            Online
          </div>
        </div>

        {/* Messages */}
        <div style={s.messagesArea}>
          {/* Welcome */}
          <motion.div
            style={s.welcomeCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={s.welcomeIconWrap}>
              <Sparkles size={32} color="#818cf8" />
            </div>
            <div style={s.welcomeTitle}>Welcome to GatiFleet Copilot</div>
            <p style={s.welcomeSubtitle}>
              I can help you analyze fleet performance, track shipments, forecast demand, and optimize operations across India's largest transportation network.
            </p>
          </motion.div>

          {/* Messages */}
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start', maxWidth: msg.type === 'user' ? '75%' : '85%' }}
              >
                {msg.type === 'user' ? (
                  <div>
                    <div style={s.userBubble}>{msg.text}</div>
                    <div style={{ ...s.msgTime, textAlign: 'right' }}>{formatTime(msg.time)}</div>
                  </div>
                ) : (
                  <div>
                    <div style={s.aiBubble}>
                      <div style={s.aiHeader}>
                        <div style={s.aiAvatarSmall}>
                          <Bot size={13} color="#fff" />
                        </div>
                        <span style={s.aiName}>GatiFleet AI</span>
                      </div>
                      <div>{msg.text}</div>

                      {/* Render reason cards if available */}
                      {msg.data?.reasons && (
                        <DataCard
                          title="Root Cause Analysis"
                          color="#f59e0b"
                          items={msg.data.reasons.map(r => ({
                            label: r.factor,
                            value: r.impact,
                            highlight: r.confidence > 90,
                          }))}
                        />
                      )}

                      {/* Render customer churn cards if available */}
                      {msg.data?.customers && (
                        <DataCard
                          title="Churn Risk Analysis"
                          color="#FF4D6B"
                          items={msg.data.customers.map(c => ({
                            label: c.name,
                            value: `${c.risk}% risk — ${c.value}`,
                            highlight: c.risk > 80,
                          }))}
                        />
                      )}

                      {/* Render custom wizard data card if available */}
                      {msg.wizardData && (
                        <DataCard
                          title={msg.wizardData.title}
                          color={msg.wizardData.color}
                          items={msg.wizardData.items}
                        />
                      )}

                      {/* Recommendation */}
                      {msg.data?.recommendation && (
                        <div style={{
                          marginTop: '12px',
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(99,102,241,0.08)',
                          border: '1px solid rgba(99,102,241,0.15)',
                          fontSize: '13px',
                          color: 'var(--primary-400)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          lineHeight: 1.5,
                        }}>
                          <Lightbulb size={16} style={{ marginTop: '1px', flexShrink: 0 }} />
                          {msg.data.recommendation}
                        </div>
                      )}

                      {/* Sources */}
                      {msg.data?.sources && (
                        <div style={{
                          marginTop: '12px',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px',
                        }}>
                          {msg.data.sources.map((src, si) => (
                            <span key={si} style={{
                              padding: '4px 10px',
                              borderRadius: '8px',
                              background: 'var(--bg-600)',
                              fontSize: '11px',
                              color: 'var(--text-muted)',
                              fontFamily: 'var(--font-mono)',
                            }}>
                              📎 {src}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div style={s.msgActions}>
                        <button style={s.msgActionBtn} title="Copy"><Copy size={14} /></button>
                        <button style={s.msgActionBtn} title="Helpful"><ThumbsUp size={14} /></button>
                        <button style={s.msgActionBtn} title="Not helpful"><ThumbsDown size={14} /></button>
                        <button style={s.msgActionBtn} title="Regenerate"><RefreshCw size={14} /></button>
                      </div>
                    </div>
                    <div style={s.msgTime}>{formatTime(msg.time)}</div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ alignSelf: 'flex-start' }}
            >
              <div style={s.aiBubble}>
                <div style={s.aiHeader}>
                  <div style={s.aiAvatarSmall}>
                    <Bot size={13} color="#fff" />
                  </div>
                  <span style={s.aiName}>GatiFleet AI</span>
                </div>
                <TypingIndicator />
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div style={s.inputArea}>
          {/* Guided AI Command Center Wizard */}
          <div style={{
            background: 'var(--bg-700)',
            border: '1px solid var(--surface-border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            marginBottom: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            {/* Wizard Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              borderBottom: '1px solid var(--surface-border)',
              paddingBottom: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--primary-400)' }}>
                <Compass size={14} />
                <span>GUIDED AI COMMAND CENTER</span>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {!selectedCategory ? 'STEP 1: SELECT MODULE' : !selectedQuestion ? 'STEP 2: SELECT QUERY' : 'STEP 3: RUN DIAGNOSTICS'}
              </span>
            </div>

            {/* Wizard Steps */}
            {!selectedCategory ? (
              /* Step 1: Select Category */
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                {WIZARD_CATEGORIES.map((cat) => (
                  <motion.button
                    key={cat.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      borderRadius: '20px',
                      background: 'var(--bg-800)',
                      border: '1px solid var(--surface-border)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                    }}
                    whileHover={{ scale: 1.03, borderColor: cat.color, boxShadow: `0 0 10px ${cat.color}25` }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSelectedQuestion(null);
                      setSelectedOption(null);
                      setCustomInputValue('');
                    }}
                  >
                    <span style={{ color: cat.color, display: 'flex', alignItems: 'center' }}>{cat.icon}</span>
                    {cat.name}
                  </motion.button>
                ))}
              </div>
            ) : !selectedQuestion ? (
              /* Step 2: Select Question */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <ChevronLeft size={14} /> Back to Modules
                  </button>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: selectedCategory.color }}>{selectedCategory.name}</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedCategory.questions.map((q) => (
                    <motion.button
                      key={q.id}
                      style={{
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-800)',
                        border: '1px solid var(--surface-border)',
                        color: 'var(--text-secondary)',
                        fontSize: '12px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                      whileHover={{ color: 'var(--text-primary)', borderColor: selectedCategory.color, background: 'rgba(255,255,255,0.02)' }}
                      onClick={() => {
                        setSelectedQuestion(q);
                        setSelectedOption(null);
                        setCustomInputValue('');
                      }}
                    >
                      <span>{q.text}</span>
                      <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              /* Step 3: Options & Custom Input */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setSelectedQuestion(null);
                      setSelectedOption(null);
                      setCustomInputValue('');
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <ChevronLeft size={14} /> Back to Questions
                  </button>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: selectedCategory.color }}>{selectedCategory.name}</span>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                  {selectedQuestion.text}
                </div>

                {/* Pre-defined Options (Pills) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedQuestion.options.map((opt) => {
                    const isSelected = selectedOption === opt;
                    return (
                      <motion.button
                        key={opt}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '16px',
                          background: isSelected ? selectedCategory.color : 'var(--bg-800)',
                          border: isSelected ? `1px solid ${selectedCategory.color}` : '1px solid var(--surface-border)',
                          color: isSelected ? '#fff' : 'var(--text-secondary)',
                          fontSize: '11px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        whileHover={isSelected ? {} : { borderColor: selectedCategory.color, background: 'rgba(255,255,255,0.02)' }}
                        onClick={() => {
                          setSelectedOption(opt);
                          setCustomInputValue(''); // mutually exclusive
                        }}
                      >
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Separator / Or text */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--surface-border)' }}></div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>OR ENTER PARAMETER</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--surface-border)' }}></div>
                </div>

                {/* Custom Write-in Parameter Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {selectedQuestion.inputLabel}
                  </label>
                  <input
                    type="text"
                    style={{
                      background: 'var(--bg-800)',
                      border: '1px solid var(--surface-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 12px',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      outline: 'none',
                    }}
                    placeholder={selectedQuestion.placeholder}
                    value={customInputValue}
                    onChange={(e) => {
                      setCustomInputValue(e.target.value);
                      setSelectedOption(null); // mutually exclusive
                    }}
                  />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                  <button
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'transparent',
                      border: '1px solid var(--surface-border)',
                      color: 'var(--text-secondary)',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedQuestion(null);
                      setSelectedOption(null);
                      setCustomInputValue('');
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    style={{
                      padding: '6px 16px',
                      borderRadius: 'var(--radius-sm)',
                      background: `linear-gradient(135deg, ${selectedCategory.color}, ${selectedCategory.color}cc)`,
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      opacity: (selectedOption || customInputValue.trim()) ? 1 : 0.5,
                      pointerEvents: (selectedOption || customInputValue.trim()) ? 'auto' : 'none',
                    }}
                    onClick={() => {
                      handleWizardSubmit(selectedCategory, selectedQuestion, selectedOption, customInputValue);
                      // Reset states
                      setSelectedCategory(null);
                      setSelectedQuestion(null);
                      setSelectedOption(null);
                      setCustomInputValue('');
                    }}
                  >
                    Analyze & Run Query
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={s.inputRow}>
            <input
              ref={inputRef}
              style={s.textInput}
              placeholder="Ask anything about your fleet, finances, or operations..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <motion.button
              style={s.sendBtn(!!inputValue.trim())}
              whileHover={inputValue.trim() ? { scale: 1.05 } : {}}
              whileTap={inputValue.trim() ? { scale: 0.95 } : {}}
              onClick={handleSend}
              disabled={!inputValue.trim()}
            >
              <Send size={18} />
            </motion.button>
          </div>
          <div style={s.inputHint}>
            <span><CornerDownLeft size={10} style={{ verticalAlign: 'middle', marginRight: '3px' }} />Enter to send</span>
            <span>Powered by GatiFleet AI</span>
          </div>
        </div>
      </div>

      {/* =============== RIGHT PANEL — Context =============== */}
      <div style={s.rightPanel}>
        {/* Quick Stats */}
        <motion.div
          style={s.panelCard}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div style={s.panelTitle}>
            <BarChart3 size={16} color="var(--primary-400)" />
            Quick Stats
          </div>
          <div style={s.statsGrid}>
            {quickStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                style={s.statMini(stat.color)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
              >
                <div style={s.statMiniIcon(stat.color)}>
                  {React.cloneElement(stat.icon, { color: stat.color })}
                </div>
                <div style={s.statMiniLabel}>{stat.label}</div>
                <div style={s.statMiniValue}>{stat.value}</div>
                <div style={s.statMiniChange(stat.color)}>{stat.change}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Queries */}
        <motion.div
          style={s.panelCard}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div style={s.panelTitle}>
            <Clock size={16} color="#f59e0b" />
            Recent Queries
          </div>
          {recentQueries.slice(0, 5).map((q, i) => (
            <motion.div
              key={i}
              style={s.queryItem}
              whileHover={{ background: 'var(--bg-700)' }}
              onClick={() => handleSuggestionClick(q)}
            >
              <div style={s.queryIcon}>
                <MessageSquare size={12} color="var(--text-muted)" />
              </div>
              <span style={{ flex: 1 }}>{q}</span>
              <ChevronRight size={12} color="var(--text-muted)" />
            </motion.div>
          ))}
        </motion.div>

        {/* Trending Topics */}
        <motion.div
          style={s.panelCard}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div style={s.panelTitle}>
            <TrendingUp size={16} color="#ec4899" />
            Trending Topics
          </div>
          {trendingTopics.map((t, i) => (
            <div key={i} style={{
              ...s.trendItem,
              borderBottom: i === trendingTopics.length - 1 ? 'none' : '1px solid var(--surface-border)',
            }}>
              <div style={s.trendRank(i)}>{i + 1}</div>
              <span style={s.trendText}>{t.topic}</span>
              <span style={s.trendCount}>{t.count}</span>
              <span style={s.trendArrow(t.trend)}>
                {t.trend === 'up' ? <ArrowUpRight size={12} /> : t.trend === 'down' ? <TrendingUp size={12} style={{ transform: 'rotate(90deg)' }} /> : <span>—</span>}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Capabilities */}
        <motion.div
          style={s.panelCard}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div style={s.panelTitle}>
            <Cpu size={16} color="#38CE3C" />
            Capabilities
          </div>
          {capabilities.map((cat, i) => (
            <div key={i} style={s.capCategory}>
              <div style={s.capCategoryTitle(cat.color)}>
                {cat.icon}
                {cat.category}
              </div>
              <div>
                {cat.items.map((item, j) => (
                  <span key={j} style={s.capItem}>
                    <CheckCircle2 size={10} color="#38CE3C" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AICopilot;
