/* eslint-disable */
// ============================================================
// GatiFleet — Customer Workspace
// Full 9-Tab Enterprise Customer Intelligence Operating System
// Modules: CIC, Digital Twin, ARIE, ACAIS, RABIP, ACOIP, Support, AI, Audit
// ============================================================

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Building2, Brain, Zap, TrendingUp, DollarSign, FileText, MessageSquare,
  Activity, Clock, AlertTriangle, CheckCircle, ChevronRight, Search,
  Star, Award, Target, Shield, Globe, Cpu, RefreshCw, Send, X, Plus,
  BarChart3, Layers, Eye, ArrowRight, Sparkles, Bot, Heart, Package, Truck,
  MapPin, Phone, Mail, ExternalLink, Edit3, Download, Bell, Settings, Info,
  AlertCircle, ChevronDown, ChevronUp, Calendar, Flag, Briefcase, PieChart,
  TrendingDown, Bookmark, Share2, UserCheck, UserX, Building, IndianRupee,
  CreditCard, Receipt, ShieldCheck, ShieldAlert, GitBranch, Network, Database,
  Lock, Unlock, Play, Pause, RotateCcw, Maximize2, Copy, Check, Hash, Percent
} from 'lucide-react';
import { RealityEngine } from '../../data/RealityEngine';
import { ALL_CUSTOMERS, LIFECYCLE_STATES, getHealthColor, getLifecycleColor, getChurnColor, getDealHealthColor } from '../../data/customerData';
import { useTheme } from '../../context/ThemeContext';

// ---- CONSTANTS ----
const TABS = [
  { id: 'profile', label: '360° Profile', icon: Building2 },
  { id: 'twins', label: 'Digital Twins', icon: Brain },
  { id: 'pipeline', label: 'Sales Pipeline', icon: Target },
  { id: 'contracts', label: 'Contracts', icon: FileText },
  { id: 'billing', label: 'Billing & Revenue', icon: IndianRupee },
  { id: 'operations', label: 'Operations', icon: Truck },
  { id: 'support', label: 'Support & SLA', icon: MessageSquare },
  { id: 'ai', label: 'AI Intelligence', icon: Sparkles },
  { id: 'journal', label: 'Decision Journal', icon: Clock },
];

const SHIPPER_TABS = [
  { id: 'my_shipments', label: 'My Shipments', icon: Truck },
  { id: 'my_invoices', label: 'My Invoices', icon: Receipt },
  { id: 'book', label: 'Book Shipment', icon: Plus },
  { id: 'my_support', label: 'Support', icon: MessageSquare },
];

const STAGE_COLORS = {
  'Prospect': '#6b7280', 'Qualified': '#3b82f6', 'Opportunity': '#8b5cf6',
  'Proposal': '#a855f7', 'Negotiation': '#f59e0b', 'Won': '#10b981', 'Lost': '#ef4444',
};
const SENTIMENT_COLORS = { Positive: '#10b981', Neutral: '#f59e0b', Negative: '#ef4444', 'Very Positive': '#22c55e', 'Very Negative': '#dc2626' };
const PRIORITY_COLORS = { Urgent: '#ef4444', High: '#f97316', Medium: '#f59e0b', Low: '#6b7280' };
const STATUS_COLORS = { in_transit: '#06b6d4', delivered: '#10b981', delayed: '#ef4444', loading: '#f59e0b', unloading: '#a855f7', scheduled: '#6b7280' };
const SLA_RISK_COLORS = { None: '#10b981', Low: '#06b6d4', Medium: '#f59e0b', High: '#f97316', Critical: '#ef4444' };

// ---- STYLE HELPERS ----
const card = (extra = {}) => ({
  background: 'rgba(17,24,39,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 16px', ...extra,
});
const lbl = (color = '#6b7280') => ({ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color });
const pill = (color = '#6366f1', bg = 'rgba(99,102,241,0.1)') => ({
  display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 99, fontSize: 9, fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.06em', color, background: bg, border: `1px solid ${color}30`,
});

const emitEvent = (type, desc, source = 'CRM/OPERATOR') => {
  RealityEngine.events = [{ id: `ev-${Date.now()}`, timestamp: new Date().toISOString(), type, desc, source }, ...RealityEngine.events];
  RealityEngine.notify();
};

// ---- MINI COMPONENTS ----
function HealthRing({ value, label: lbl2, size = 48 }) {
  const color = getHealthColor(value);
  const r = (size / 2) - 5;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={5} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
        <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle" fontSize={9} fontWeight={800} fill={color}>{value}</text>
      </svg>
      <span style={{ fontSize: 8, color: '#6b7280', textTransform: 'uppercase', textAlign: 'center', maxWidth: 52, lineHeight: 1.2 }}>{lbl2}</span>
    </div>
  );
}

function StatBar({ label: lbl2, value, max = 100, color = '#6366f1' }) {
  const numVal = typeof value === 'number' ? value : parseFloat(value) || 0;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={lbl()}>{lbl2}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color }}>{value}{typeof value === 'number' ? '%' : ''}</span>
      </div>
      <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(numVal / max * 100, 100)}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

function KpiCard({ label: lbl2, value, trend, icon: Icon, color = '#6366f1' }) {
  return (
    <div style={{ ...card(), display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={lbl()}>{lbl2}</span>
        {Icon && <Icon size={12} color={color} />}
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      {trend && <div style={{ fontSize: 9, color: trend.startsWith('+') ? '#10b981' : trend.startsWith('-') ? '#ef4444' : '#6b7280' }}>{trend}</div>}
    </div>
  );
}

function ActionBtn({ children, onClick, color = '#6366f1', size = 'sm', disabled = false }) {
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      padding: size === 'sm' ? '5px 12px' : '8px 18px', borderRadius: 6, border: `1px solid ${color}40`,
      cursor: disabled ? 'not-allowed' : 'pointer', background: `${color}15`, color,
      fontSize: size === 'sm' ? 10 : 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
      transition: 'all 0.2s', opacity: disabled ? 0.5 : 1,
    }}>{children}</button>
  );
}

function SectionHeader({ icon: Icon, title, color = '#818cf8', children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <h3 style={{ fontSize: 10, fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
        {Icon && <Icon size={12} />}{title}
      </h3>
      {children}
    </div>
  );
}

// ---- MAIN COMPONENT ----
export default function CustomerPortal() {
  const { userRole } = useTheme();
  const [viewMode, setViewMode] = useState('internal');
  const [selectedId, setSelectedId] = useState('CUS-001');
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('profile');
  const [shipperTab, setShipperTab] = useState('my_shipments');
  const [engineState, setEngineState] = useState(RealityEngine.getState());
  const [notification, setNotification] = useState(null);
  const [bookingForm, setBookingForm] = useState({ origin: 'Delhi', destination: 'Mumbai', cargo: '', tons: 50, value: '' });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [ticketForm, setTicketForm] = useState({ type: 'SLA Breach', priority: 'High', desc: '' });
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [aiMessages, setAiMessages] = useState([{ sender: 'ai', text: 'GatiFleet Intelligence ready. Select a customer or ask me anything.' }]);
  const [aiInput, setAiInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);

  useEffect(() => {
    const unsub = RealityEngine.subscribe(state => setEngineState(state));
    return () => unsub();
  }, []);

  const customer = useMemo(() => ALL_CUSTOMERS.find(c => c.id === selectedId) || ALL_CUSTOMERS[0], [selectedId]);

  const filteredCustomers = useMemo(() => {
    let list = ALL_CUSTOMERS;
    if (searchQuery) list = list.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase()));
    if (stateFilter !== 'All') list = list.filter(c => c.lifecycleState === stateFilter);
    return list;
  }, [searchQuery, stateFilter]);

  const notify = (msg, type = 'success') => { setNotification({ msg, type }); setTimeout(() => setNotification(null), 3000); };
  const dispatchAction = (eventType, desc) => { emitEvent(eventType, desc); notify(`Event: ${eventType}`); };

  const handleAISubmit = (query) => {
    if (!query.trim()) return;
    setAiMessages(prev => [...prev, { sender: 'user', text: query }]);
    setAiTyping(true);
    setAiInput('');
    setTimeout(() => {
      const q = query.toLowerCase();
      let reply = '';
      if (q.includes('churn') || q.includes('risk')) {
        reply = `Churn analysis for ${customer.name}: Risk ${customer.predictions.churnRisk}%. Factors: ${customer.predictions.churnFactors.join(', ')}. Action: ${customer.predictions.nextBestAction}.`;
      } else if (q.includes('ltv') || q.includes('value')) {
        reply = `LTV for ${customer.name}: ${customer.kpis.ltv} total. 12-month forecast: ${customer.predictions.ltv12m}. Deal health: ${customer.predictions.dealHealthIndex}/100.`;
      } else if (q.includes('contract') || q.includes('renewal')) {
        reply = customer.contracts.length > 0
          ? `${customer.name} has ${customer.contracts.length} contract(s). Renewal likelihood: ${customer.kpis.renewalLikelihood}%. Risk index: ${customer.contracts[0]?.riskIndex}/100.`
          : `${customer.name} has no contracts yet (${customer.lifecycleState} stage). Next: ${customer.predictions.nextBestAction}.`;
      } else if (q.includes('health') || q.includes('score')) {
        reply = `${customer.name} health: ${customer.health.overall}/100. Commercial: ${customer.health.commercial}, Operational: ${customer.health.operational}, Financial: ${customer.health.financial}, Relationship: ${customer.health.relationship}, Strategic: ${customer.health.strategic}.`;
      } else {
        reply = `${customer.name} (${customer.lifecycleState}) — Deal health: ${customer.predictions.dealHealthIndex}/100. Next action: ${customer.predictions.nextBestAction}. Ask me about churn, LTV, contracts, or health.`;
      }
      setAiMessages(prev => [...prev, { sender: 'ai', text: reply }]);
      setAiTyping(false);
    }, 1000);
  };

  // ---- LEFT PANEL ----
  const renderLeftPanel = () => (
    <div style={{ width: 264, minWidth: 264, background: 'rgba(10,14,25,0.9)', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Building2 size={16} color="#6366f1" />
          <span style={{ fontSize: 12, fontWeight: 800, color: '#e5e7eb' }}>Customers</span>
          <span style={{ ...pill('#6366f1'), marginLeft: 'auto' }}>{filteredCustomers.length}</span>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={11} color="#6b7280" style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search customers..."
            style={{ width: '100%', padding: '6px 8px 6px 26px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, color: '#e5e7eb', fontSize: 10, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
          {['All', 'Strategic', 'Active', 'At Risk', 'Prospect'].map(s => (
            <button key={s} onClick={() => setStateFilter(s)} style={{ padding: '2px 7px', borderRadius: 99, fontSize: 8, fontWeight: 700, border: 'none', cursor: 'pointer', background: stateFilter === s ? '#6366f1' : 'rgba(255,255,255,0.05)', color: stateFilter === s ? '#fff' : '#9ca3af' }}>{s}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 8px' }}>
        {filteredCustomers.map(c => {
          const isActive = c.id === selectedId;
          const hc = getHealthColor(c.health.overall);
          const lc = getLifecycleColor(c.lifecycleState);
          const urgentTickets = c.supportTickets?.filter(t => t.priority === 'Urgent').length || 0;
          return (
            <motion.div key={c.id} whileHover={{ scale: 1.01 }} onClick={() => { setSelectedId(c.id); setActiveTab('profile'); }}
              style={{ padding: '9px 10px', borderRadius: 8, marginBottom: 4, cursor: 'pointer', background: isActive ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isActive ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.04)'}`, transition: 'all 0.15s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: isActive ? '#a5b4fc' : '#e5e7eb', lineHeight: 1.2, maxWidth: 160 }}>{c.name}</div>
                  <div style={{ fontSize: 8, color: '#6b7280', marginTop: 1 }}>{c.id} · {c.industry}</div>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${hc}20`, border: `2px solid ${hc}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 8, fontWeight: 800, color: hc }}>{c.health.overall}</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ ...pill(lc, `${lc}15`) }}>{c.lifecycleState}</span>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {urgentTickets > 0 && <span style={{ ...pill('#ef4444', 'rgba(239,68,68,0.1)') }}>🔴 {urgentTickets}</span>}
                  <span style={{ fontSize: 8, color: '#6b7280' }}>{c.accountManager?.split(' ')[0]}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={() => dispatchAction('CUSTOMER_CREATE_REQUESTED', 'New customer creation initiated from Customer Workspace.')}
          style={{ width: '100%', padding: '8px', background: 'rgba(99,102,241,0.1)', border: '1px dashed rgba(99,102,241,0.4)', borderRadius: 8, color: '#818cf8', fontSize: 10, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Plus size={12} /> New Customer
        </button>
      </div>
    </div>
  );

  // ---- HEADER ----
  const renderHeader = () => {
    const hc = getHealthColor(customer.health.overall);
    const lc = getLifecycleColor(customer.lifecycleState);
    const cc = getChurnColor(customer.predictions.churnRisk);
    return (
      <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,14,25,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
              {customer.shortName?.charAt(0)}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 18, fontWeight: 900, color: '#f9fafb', margin: 0 }}>{customer.name}</h1>
                <span style={pill(lc, `${lc}18`)}>{customer.lifecycleState}</span>
                {customer.predictions.churnRisk >= 50 && <span style={pill('#ef4444', 'rgba(239,68,68,0.12)')}>⚠ High Churn Risk</span>}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 9, color: '#6b7280' }}>{customer.id} · {customer.gstin}</span>
                <span style={{ fontSize: 9, color: '#6b7280' }}>{customer.industry} · {customer.legalForm}</span>
                <span style={{ fontSize: 9, color: '#6b7280' }}>📍 {customer.hq}</span>
                <span style={{ fontSize: 9, color: '#6b7280' }}>🕐 {customer.accountAge} tenure</span>
              </div>
              <div style={{ fontSize: 9, color: '#9ca3af', marginTop: 3 }}>
                <span style={{ color: '#818cf8' }}>AM:</span> {customer.accountManager} · <span style={{ color: '#818cf8' }}>Sponsor:</span> {customer.executiveSponsor}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: 2, borderRadius: 6 }}>
              {['internal', 'shipper'].map(m => (
                <button key={m} onClick={() => { setViewMode(m); setShipperTab('my_shipments'); setActiveTab('profile'); }}
                  style={{ padding: '4px 10px', borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', background: viewMode === m ? 'rgba(99,102,241,0.25)' : 'transparent', color: viewMode === m ? '#818cf8' : '#6b7280' }}>
                  {m === 'internal' ? '🏢 Internal CRM' : '📦 Shipper View'}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ l: 'Health', v: customer.health.overall, c: hc }, { l: 'Churn Risk', v: `${customer.predictions.churnRisk}%`, c: cc }, { l: 'ACV', v: customer.kpis.acrRevenue, c: '#06b6d4' }, { l: 'LTV', v: customer.kpis.ltv, c: '#a855f7' }, { l: 'NPS', v: customer.kpis.nps ?? 'N/A', c: '#f59e0b' }].map((k, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: k.c }}>{k.v}</div>
                  <div style={{ fontSize: 7, color: '#6b7280', textTransform: 'uppercase' }}>{k.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <ActionBtn onClick={() => dispatchAction('CUSTOMER_CALL_SCHEDULED', `Call scheduled with ${customer.name}`)} color="#10b981">📞 Call</ActionBtn>
              <ActionBtn onClick={() => dispatchAction('CHURN_ANALYSIS_TRIGGERED', `Churn analysis for ${customer.id}`)} color="#f59e0b">🔍 Analyse</ActionBtn>
              <ActionBtn onClick={() => dispatchAction('EXECUTIVE_BRIEFING_GENERATED', `Executive briefing for ${customer.name}`)} color="#6366f1">📋 Brief</ActionBtn>
            </div>
          </div>
        </div>
        {customer.predictions.nextBestAction && (
          <div style={{ marginTop: 10, padding: '6px 12px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={11} color="#818cf8" />
            <span style={{ fontSize: 9, color: '#a5b4fc', fontWeight: 600 }}>AI Next-Best-Action:</span>
            <span style={{ fontSize: 9, color: '#e5e7eb' }}>{customer.predictions.nextBestAction}</span>
            <button onClick={() => dispatchAction('AI_RECOMMENDATION_ACCEPTED', `Accepted: ${customer.predictions.nextBestAction}`)} style={{ marginLeft: 'auto', ...pill('#10b981', 'rgba(16,185,129,0.1)'), cursor: 'pointer', border: '1px solid rgba(16,185,129,0.3)' }}>✓ Accept</button>
            <button onClick={() => dispatchAction('AI_RECOMMENDATION_OVERRIDDEN', `Overridden: ${customer.predictions.nextBestAction}`)} style={{ ...pill('#6b7280', 'rgba(107,114,128,0.1)'), cursor: 'pointer', border: '1px solid rgba(107,114,128,0.3)' }}>Override</button>
          </div>
        )}
      </div>
    );
  };

  // ---- TAB BAR ----
  const renderTabBar = () => {
    const tabs = viewMode === 'internal' ? TABS : SHIPPER_TABS;
    const active = viewMode === 'internal' ? activeTab : shipperTab;
    const setActive = viewMode === 'internal' ? setActiveTab : setShipperTab;
    return (
      <div style={{ display: 'flex', gap: 2, padding: '8px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto', background: 'rgba(7,10,20,0.4)' }}>
        {tabs.map(t => {
          const isActive = active === t.id;
          const Icon = t.icon;
          const badge = t.id === 'support' ? customer.supportTickets?.filter(x => x.priority === 'Urgent').length : null;
          return (
            <button key={t.id} onClick={() => setActive(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', background: isActive ? 'rgba(99,102,241,0.2)' : 'transparent', color: isActive ? '#a5b4fc' : '#6b7280', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
              <Icon size={11} />{t.label}
              {badge > 0 && <span style={{ ...pill('#ef4444', 'rgba(239,68,68,0.2)'), marginLeft: 4 }}>{badge}</span>}
            </button>
          );
        })}
      </div>
    );
  };

  // ---- TAB 1: PROFILE ----
  const renderProfile = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <div style={card()}>
        <SectionHeader icon={Heart} title="Health Score Engine" color="#10b981" />
        <div style={{ display: 'flex', gap: 12, justifyContent: 'space-around', flexWrap: 'wrap' }}>
          {[{k:'commercial',l:'Commercial'},{k:'operational',l:'Operational'},{k:'financial',l:'Financial'},{k:'relationship',l:'Relationship'},{k:'strategic',l:'Strategic'}].map(d => <HealthRing key={d.k} value={customer.health[d.k] || 0} label={d.l} size={52} />)}
        </div>
        <div style={{ marginTop: 12, padding: '8px 12px', background: `${getHealthColor(customer.health.overall)}15`, border: `1px solid ${getHealthColor(customer.health.overall)}30`, borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: getHealthColor(customer.health.overall) }}>{customer.health.overall}</div>
          <div style={{ fontSize: 9, color: '#9ca3af', textTransform: 'uppercase' }}>Overall Health Score</div>
        </div>
      </div>
      <div style={card()}>
        <SectionHeader icon={BarChart3} title="Key Performance Indicators" color="#06b6d4" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[{l:'Annual Contract Value',v:customer.kpis.acrRevenue,c:'#06b6d4',icon:IndianRupee},{l:'Lifetime Value',v:customer.kpis.ltv,c:'#a855f7',icon:TrendingUp},{l:'Shipments/Month',v:customer.kpis.shipmentsMonth||'N/A',c:'#10b981',icon:Truck},{l:'OTD Rate',v:customer.kpis.otdRate?`${customer.kpis.otdRate}%`:'N/A',c:'#f59e0b',icon:CheckCircle},{l:'SLA Compliance',v:customer.kpis.slaCompliance?`${customer.kpis.slaCompliance}%`:'N/A',c:'#10b981',icon:Shield},{l:'Credit Used',v:`${customer.kpis.creditUsed}%`,c:customer.kpis.creditUsed>70?'#ef4444':'#06b6d4',icon:CreditCard}].map((k,i) => <KpiCard key={i} label={k.l} value={k.v} color={k.c} icon={k.icon} />)}
        </div>
      </div>
      <div style={card()}>
        <SectionHeader icon={Users} title="Buying Committee & Contacts" color="#8b5cf6">
          <ActionBtn onClick={() => dispatchAction('CONTACT_ADDED', `Contact added for ${customer.id}`)} color="#8b5cf6">+ Add</ActionBtn>
        </SectionHeader>
        {customer.contacts.map((c, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)', marginBottom: 6 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: c.champion ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: c.champion ? '#10b981' : '#818cf8', flexShrink: 0 }}>{c.name.charAt(0)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#e5e7eb' }}>{c.name}</span>
                {c.champion && <span style={pill('#10b981', 'rgba(16,185,129,0.1)')}>Champion</span>}
              </div>
              <div style={{ fontSize: 8, color: '#9ca3af' }}>{c.role} · {c.email}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
              <span style={{ ...pill(SENTIMENT_COLORS[c.sentiment]||'#6b7280', `${SENTIMENT_COLORS[c.sentiment]}15`) }}>{c.sentiment}</span>
              <span style={{ fontSize: 8, color: '#6b7280' }}>Influence: {c.influence}/100</span>
            </div>
          </div>
        ))}
      </div>
      <div style={card()}>
        <SectionHeader icon={GitBranch} title="Lifecycle State Machine" color="#f59e0b" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
          {LIFECYCLE_STATES.map(s => {
            const isActive = customer.lifecycleState === s.id;
            return (
              <button key={s.id} onClick={() => { dispatchAction('CUSTOMER_STATE_TRANSITION', `${customer.name}: ${customer.lifecycleState} → ${s.id}`); notify(`State emitted → ${s.id}`); }}
                style={{ padding: '4px 8px', borderRadius: 99, border: `1px solid ${s.color}${isActive?'ff':'40'}`, background: isActive?`${s.color}25`:'rgba(255,255,255,0.02)', color: isActive?s.color:'#6b7280', fontSize: 9, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}>
                {s.id}
              </button>
            );
          })}
        </div>
        <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: `1px solid ${getLifecycleColor(customer.lifecycleState)}30` }}>
          <div style={{ fontSize: 9, color: '#9ca3af' }}>Current State</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: getLifecycleColor(customer.lifecycleState), marginTop: 2 }}>{customer.lifecycleState}</div>
          <div style={{ fontSize: 9, color: '#6b7280', marginTop: 2 }}>Renewal: {customer.kpis.renewalLikelihood??'N/A'}% · Tenure: {customer.accountAge}</div>
        </div>
      </div>
    </div>
  );

  // ---- TAB 2: DIGITAL TWINS ----
  const renderTwins = () => {
    const brains = [
      {key:'commercial',label:'Commercial Brain',icon:IndianRupee,color:'#6366f1'},
      {key:'operational',label:'Operational Brain',icon:Truck,color:'#10b981'},
      {key:'financial',label:'Financial Brain',icon:CreditCard,color:'#06b6d4'},
      {key:'relationship',label:'Relationship Brain',icon:Heart,color:'#ec4899'},
      {key:'strategic',label:'Strategic Brain',icon:Target,color:'#a855f7'},
      {key:'learning',label:'Learning Brain',icon:Brain,color:'#f59e0b'},
    ];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        {brains.map(b => {
          const data = customer.digitalTwin[b.key] || {};
          return (
            <div key={b.key} style={{ ...card(), borderLeft: `3px solid ${b.color}` }}>
              <SectionHeader icon={b.icon} title={b.label} color={b.color}>
                <ActionBtn onClick={() => dispatchAction('DIGITAL_TWIN_SIMULATED', `${b.label} simulation for ${customer.id}`)} color={b.color}>Simulate</ActionBtn>
              </SectionHeader>
              {Object.entries(data).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <span style={lbl()}>{k.replace(/([A-Z])/g,' $1').trim()}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#e5e7eb', textAlign: 'right', maxWidth: 140 }}>{String(v)}</span>
                </div>
              ))}
              {Object.keys(data).length === 0 && <span style={{ fontSize: 9, color: '#6b7280', fontStyle: 'italic' }}>No data — early stage customer</span>}
            </div>
          );
        })}
      </div>
    );
  };

  // ---- TAB 3: PIPELINE ----
  const renderPipeline = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <div style={card()}>
        <SectionHeader icon={Target} title="Active Opportunities" color="#a855f7">
          <ActionBtn onClick={() => dispatchAction('OPPORTUNITY_CREATED', `New opportunity for ${customer.id}`)} color="#a855f7">+ New Opp</ActionBtn>
        </SectionHeader>
        {customer.opportunities.length === 0 && <div style={{ fontSize: 10, color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>No active opportunities</div>}
        {customer.opportunities.map(opp => (
          <div key={opp.id} style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)', marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#e5e7eb' }}>{opp.name}</div>
                <div style={{ fontSize: 8, color: '#6b7280', marginTop: 2 }}>{opp.id} · Close: {opp.closingDate}</div>
              </div>
              <span style={pill(STAGE_COLORS[opp.stage]||'#6b7280', `${STAGE_COLORS[opp.stage]}18`)}>{opp.stage}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#a855f7' }}>{opp.value}</span>
              <span style={{ fontSize: 10, color: '#f59e0b' }}>{opp.probability}% win prob.</span>
            </div>
            <div style={{ marginTop: 8, height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
              <div style={{ width: `${opp.probability}%`, height: '100%', background: 'linear-gradient(90deg,#8b5cf6,#6366f1)', borderRadius: 2 }} />
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <ActionBtn onClick={() => dispatchAction('PROPOSAL_GENERATED', `Proposal for ${opp.id}`)} color="#6366f1">Generate Proposal</ActionBtn>
              <ActionBtn onClick={() => dispatchAction('OPPORTUNITY_WON', `${opp.id} won`)} color="#10b981">Mark Won</ActionBtn>
              <ActionBtn onClick={() => dispatchAction('OPPORTUNITY_LOST', `${opp.id} lost`)} color="#ef4444">Mark Lost</ActionBtn>
            </div>
          </div>
        ))}
      </div>
      <div style={card()}>
        <SectionHeader icon={Cpu} title="AI Pricing Engine" color="#06b6d4" />
        {[
          {label:'Best Price',desc:'Win probability optimized',value:'₹2.4 Cr',margin:'18.4%',color:'#10b981'},
          {label:'Best Margin',desc:'Peak tariff — seasonal demand',value:'₹3.2 Cr',margin:'26.8%',color:'#6366f1'},
          {label:'Negotiation Floor',desc:'Minimum viable — covers opex',value:'₹1.8 Cr',margin:'12.2%',color:'#f59e0b'},
        ].map((tier, i) => (
          <div key={i} style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: `1px solid ${tier.color}25`, marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: tier.color }}>{tier.label}</span>
              <span style={{ fontSize: 8, color: '#6b7280' }}>{tier.desc}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: '#f9fafb' }}>{tier.value}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: tier.color }}>{tier.margin} margin</div>
                <ActionBtn onClick={() => dispatchAction('PRICING_TIER_SELECTED', `${tier.label} selected for ${customer.id}`)} color={tier.color}>Select</ActionBtn>
              </div>
            </div>
          </div>
        ))}
        <SectionHeader icon={Network} title="Buying Committee Influence" color="#8b5cf6" />
        {customer.contacts.slice(0, 3).map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: `${c.influence}%`, height: 4, background: c.champion ? '#8b5cf6' : '#374151', borderRadius: 2, maxWidth: 120 }} />
            <span style={{ fontSize: 9, color: '#9ca3af' }}>{c.name} ({c.role}) — {c.influence}/100</span>
            {c.champion && <span style={pill('#8b5cf6', 'rgba(139,92,246,0.1)')}>Champion</span>}
          </div>
        ))}
      </div>
    </div>
  );

  // ---- TAB 4: CONTRACTS ----
  const renderContracts = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {customer.contracts.length === 0 && (
        <div style={{ ...card(), textAlign: 'center', padding: '30px' }}>
          <FileText size={32} color="#6b7280" style={{ margin: '0 auto 10px' }} />
          <div style={{ fontSize: 12, color: '#6b7280' }}>No active contracts</div>
          <div style={{ fontSize: 9, color: '#4b5563', marginTop: 4 }}>Customer is in {customer.lifecycleState} stage.</div>
          <div style={{ marginTop: 12 }}><ActionBtn onClick={() => dispatchAction('CONTRACT_CREATION_REQUESTED', `Contract creation for ${customer.id}`)} color="#6366f1" size="lg">Create Contract</ActionBtn></div>
        </div>
      )}
      {customer.contracts.map(ctr => (
        <div key={ctr.id} style={card()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#e5e7eb' }}>{ctr.id}</span>
                <span style={pill(ctr.status==='Active'?'#10b981':'#f59e0b')}>{ctr.status}</span>
              </div>
              <div style={{ fontSize: 9, color: '#9ca3af' }}>Lanes: {ctr.lanes}</div>
              <div style={{ fontSize: 9, color: '#9ca3af', marginTop: 2 }}>SLA: {ctr.sla}</div>
              <div style={{ fontSize: 9, color: '#9ca3af', marginTop: 2 }}>{ctr.start} → {ctr.end}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#06b6d4' }}>{ctr.value}</div>
              <div style={{ fontSize: 9, color: '#6b7280', marginTop: 2 }}>Commercial Risk Index</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: ctr.riskIndex<25?'#10b981':ctr.riskIndex<50?'#f59e0b':'#ef4444' }}>{ctr.riskIndex}/100</div>
            </div>
          </div>
          <SectionHeader icon={Shield} title="Executable SLA Clauses" color="#f59e0b" />
          {[
            {clause:'IF Transit_Time > SLA_Target THEN Apply_Penalty(5%)',status:'Active'},
            {clause:'IF Monthly_Volume > Committed_Volume THEN Volume_Rebate(2%)',status:'Active'},
            {clause:'IF Fuel_Price_Delta > 10% THEN Fuel_Surcharge_Revision()',status:'Watching'},
          ].map((cl, i) => (
            <div key={i} style={{ padding: '6px 10px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 6, marginBottom: 6, fontFamily: 'monospace', fontSize: 9, color: '#fbbf24' }}>
              {cl.clause} <span style={{ float: 'right', ...pill(cl.status==='Active'?'#10b981':'#f59e0b') }}>{cl.status}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <ActionBtn onClick={() => dispatchAction('CONTRACT_RENEWAL_INITIATED', `Renewal for ${ctr.id}`)} color="#10b981">Initiate Renewal</ActionBtn>
            <ActionBtn onClick={() => dispatchAction('CONTRACT_AMENDMENT_REQUESTED', `Amendment for ${ctr.id}`)} color="#f59e0b">Request Amendment</ActionBtn>
            <ActionBtn onClick={() => dispatchAction('CONTRACT_AUDIT_REQUESTED', `Compliance audit for ${ctr.id}`)} color="#6366f1">Compliance Audit</ActionBtn>
          </div>
        </div>
      ))}
    </div>
  );

  // ---- TAB 5: BILLING ----
  const renderBilling = () => {
    const b = customer.billing;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={card()}>
          <SectionHeader icon={IndianRupee} title="Revenue Ledger" color="#10b981" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            {[{l:'Total Billed',v:b.totalBilled,c:'#06b6d4'},{l:'Collected',v:b.paid,c:'#10b981'},{l:'Pending',v:b.pending,c:'#f59e0b'},{l:'Overdue',v:b.overdue,c:'#ef4444'}].map((k,i) => <KpiCard key={i} label={k.l} value={k.v} color={k.c} />)}
          </div>
          <SectionHeader icon={Receipt} title="Invoice Register" color="#06b6d4">
            <ActionBtn onClick={() => dispatchAction('INVOICE_GENERATED', `Invoice batch for ${customer.id}`)} color="#06b6d4">+ Generate</ActionBtn>
          </SectionHeader>
          {[
            {id:'INV-4821',amount:'₹18.4 L',status:'Paid',due:'2026-07-15'},
            {id:'INV-4822',amount:'₹14.2 L',status:'Pending',due:'2026-08-20'},
            {id:'INV-4823',amount:'₹9.8 L',status:'Overdue',due:'2026-07-28'},
          ].map((inv, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 6, marginBottom: 5 }}>
              <div><span style={{ fontSize: 10, fontWeight: 700, color: '#e5e7eb' }}>{inv.id}</span><span style={{ fontSize: 8, color: '#6b7280', marginLeft: 8 }}>Due: {inv.due}</span></div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#f9fafb' }}>{inv.amount}</span>
                <span style={pill(inv.status==='Paid'?'#10b981':inv.status==='Pending'?'#f59e0b':'#ef4444')}>{inv.status}</span>
                <button onClick={() => dispatchAction('INVOICE_DISPUTED', `Invoice ${inv.id} disputed`)} style={{ fontSize: 8, color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}>Dispute</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={card()}>
            <SectionHeader icon={AlertTriangle} title="Active Disputes" color="#ef4444" />
            {b.disputes === 0 ? <div style={{ fontSize: 10, color: '#10b981', textAlign: 'center', padding: '12px 0' }}>✓ No active disputes</div> : (
              <>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#ef4444' }}>{b.disputes} disputes</div>
                <div style={{ fontSize: 9, color: '#9ca3af', marginTop: 2 }}>Overdue exposure: {b.overdue}</div>
                <ActionBtn onClick={() => dispatchAction('DISPUTE_RESOLUTION_INITIATED', `Dispute resolution for ${customer.id}`)} color="#ef4444">Initiate Resolution</ActionBtn>
              </>
            )}
          </div>
          <div style={card()}>
            <SectionHeader icon={ShieldCheck} title="GST ITC Reconciliation" color="#a855f7" />
            {[{l:'ITC Claimed',v:'₹4.2 L',s:'OK'},{l:'ITC Pending Match',v:'₹0.8 L',s:'Pending'},{l:'Compliance Rate',v:'97.4%',s:'OK'},{l:'Filing Status',v:'GSTR-2B Matched',s:'OK'}].map((r,i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <span style={lbl()}>{r.l}</span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#e5e7eb' }}>{r.v}</span>
                  <span style={pill(r.s==='OK'?'#10b981':'#f59e0b')}>{r.s}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={card()}>
            <SectionHeader icon={TrendingUp} title="Payment Health" color="#06b6d4" />
            <StatBar label="Avg Payment Days" value={customer.kpis.avgPaymentDays||0} max={60} color={customer.kpis.avgPaymentDays>30?'#ef4444':'#10b981'} />
            <div style={{ marginTop: 8 }}><StatBar label="Credit Line Used" value={customer.kpis.creditUsed} color={customer.kpis.creditUsed>70?'#ef4444':'#06b6d4'} /></div>
            <div style={{ marginTop: 8, fontSize: 9, color: '#9ca3af' }}>Credit Limit: {customer.kpis.creditLine}</div>
          </div>
        </div>
      </div>
    );
  };

  // ---- TAB 6: OPERATIONS ----
  const renderOperations = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <div style={card()}>
        <SectionHeader icon={Truck} title="Active Shipments" color="#06b6d4">
          <ActionBtn onClick={() => dispatchAction('SHIPMENT_BOOKING_INITIATED', `Shipment booking for ${customer.id}`)} color="#06b6d4">+ Book</ActionBtn>
        </SectionHeader>
        {customer.recentShipments.length === 0 && <div style={{ fontSize: 10, color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>No shipments in record</div>}
        {customer.recentShipments.map((s, i) => {
          const sc = STATUS_COLORS[s.status]||'#6b7280';
          const rc = SLA_RISK_COLORS[s.slaRisk]||'#6b7280';
          return (
            <div key={i} style={{ padding: '9px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: `1px solid ${s.status==='delayed'?'rgba(239,68,68,0.3)':'rgba(255,255,255,0.05)'}`, marginBottom: 7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <div><span style={{ fontSize: 10, fontWeight: 700, color: '#e5e7eb' }}>{s.id}</span><div style={{ fontSize: 8, color: '#9ca3af', marginTop: 2 }}>🚛 {s.route}</div></div>
                <span style={pill(sc, `${sc}15`)}>{s.status.replace('_',' ')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#f9fafb' }}>{s.value}</span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 9, color: '#9ca3af' }}>ETA: {s.eta}</span>
                  <span style={pill(rc, `${rc}15`)}>SLA: {s.slaRisk}</span>
                </div>
              </div>
              {s.status === 'delayed' && <ActionBtn onClick={() => dispatchAction('INCIDENT_ESCALATED', `Delay escalation for ${s.id}`)} color="#ef4444">🚨 Escalate Delay</ActionBtn>}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={card()}>
          <SectionHeader icon={Activity} title="Operational Performance" color="#10b981" />
          <StatBar label="OTD Rate" value={customer.kpis.otdRate||0} color={customer.kpis.otdRate>=96?'#10b981':'#f59e0b'} />
          <div style={{ marginTop: 8 }}><StatBar label="SLA Compliance" value={customer.kpis.slaCompliance||0} color="#06b6d4" /></div>
          <div style={{ marginTop: 8 }}><StatBar label="Fleet Utilization" value={parseInt(customer.digitalTwin.operational?.fleetUtilization)||0} color="#a855f7" /></div>
        </div>
        <div style={card()}>
          <SectionHeader icon={AlertTriangle} title="Proactive Risk Radar" color="#f59e0b" />
          {[
            {risk:'Monsoon disruption on NH48 corridor',prob:'28%',impact:'+4.2h delay',severity:'Medium'},
            {risk:'Driver fatigue alert — 2 routes',prob:'14%',impact:'SLA breach risk',severity:'High'},
            {risk:'Fuel price revision scheduled',prob:'82%',impact:'+₹0.8/km surcharge',severity:'Low'},
          ].map((r, i) => (
            <div key={i} style={{ padding: '7px 9px', background: 'rgba(245,158,11,0.04)', borderRadius: 7, border: '1px solid rgba(245,158,11,0.12)', marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <span style={{ fontSize: 9, fontWeight: 600, color: '#fbbf24' }}>{r.risk}</span>
                <span style={pill(PRIORITY_COLORS[r.severity]||'#6b7280', `${PRIORITY_COLORS[r.severity]}15`)}>{r.severity}</span>
              </div>
              <div style={{ fontSize: 8, color: '#9ca3af' }}>Prob: {r.prob} · Impact: {r.impact}</div>
            </div>
          ))}
          <ActionBtn onClick={() => dispatchAction('RISK_SIMULATION_TRIGGERED', `Risk simulation for ${customer.id}`)} color="#f59e0b">Run Recovery Simulation</ActionBtn>
        </div>
      </div>
    </div>
  );

  // ---- TAB 7: SUPPORT ----
  const renderSupport = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 14 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={card()}>
          <SectionHeader icon={MessageSquare} title="Ticket Command Center" color="#ec4899">
            <ActionBtn onClick={() => setShowTicketForm(true)} color="#ec4899">+ Raise Ticket</ActionBtn>
          </SectionHeader>
          {showTicketForm && (
            <div style={{ padding: '12px', background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: 8, marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <select value={ticketForm.type} onChange={e => setTicketForm(p => ({...p, type: e.target.value}))} style={{ flex: 1, padding: '5px 8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 5, color: '#e5e7eb', fontSize: 10 }}>
                  {['SLA Breach','Billing Dispute','Documentation','Operations Issue','Technical'].map(t => <option key={t}>{t}</option>)}
                </select>
                <select value={ticketForm.priority} onChange={e => setTicketForm(p => ({...p, priority: e.target.value}))} style={{ flex: 1, padding: '5px 8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 5, color: '#e5e7eb', fontSize: 10 }}>
                  {['Urgent','High','Medium','Low'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <textarea value={ticketForm.desc} onChange={e => setTicketForm(p => ({...p, desc: e.target.value}))} placeholder="Describe the issue..."
                style={{ width: '100%', padding: '6px 8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 5, color: '#e5e7eb', fontSize: 10, resize: 'vertical', minHeight: 60, boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <ActionBtn onClick={() => { dispatchAction('SUPPORT_CASE_CREATED', `Support ticket for ${customer.id}: ${ticketForm.type} — ${ticketForm.priority}`); setShowTicketForm(false); notify('Ticket created'); }} color="#ec4899">Submit Ticket</ActionBtn>
                <ActionBtn onClick={() => setShowTicketForm(false)} color="#6b7280">Cancel</ActionBtn>
              </div>
            </div>
          )}
          {customer.supportTickets.length === 0 && !showTicketForm && <div style={{ fontSize: 10, color: '#10b981', textAlign: 'center', padding: '20px 0' }}>✓ No active tickets — all SLAs green</div>}
          {customer.supportTickets.map(t => (
            <div key={t.id} style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: `1px solid ${PRIORITY_COLORS[t.priority]||'#6b7280'}30`, marginBottom: 7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 }}>
                <div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 2 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#e5e7eb' }}>{t.id}</span>
                    <span style={pill(PRIORITY_COLORS[t.priority]||'#6b7280', `${PRIORITY_COLORS[t.priority]}15`)}>{t.priority}</span>
                    <span style={{ fontSize: 8, color: '#9ca3af' }}>{t.type}</span>
                  </div>
                  <div style={{ fontSize: 9, color: '#9ca3af' }}>{t.desc}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: t.priority==='Urgent'?'#ef4444':'#f59e0b' }}>⏱ {t.slaTimer}</div>
                  <div style={{ fontSize: 8, color: '#6b7280' }}>SLA Timer</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 8, color: '#9ca3af' }}>{t.assignedAgent} · {t.status}</span>
                <div style={{ display: 'flex', gap: 5 }}>
                  <ActionBtn onClick={() => dispatchAction('TICKET_ESCALATED', `Ticket ${t.id} escalated`)} color="#f97316">Escalate</ActionBtn>
                  <ActionBtn onClick={() => dispatchAction('TICKET_RESOLVED', `Ticket ${t.id} resolved`)} color="#10b981">Resolve</ActionBtn>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={card()}>
          <SectionHeader icon={Shield} title="SLA Compliance" color="#10b981" />
          {[{tier:'OTD SLA',target:'96%',actual:`${customer.kpis.otdRate||0}%`,ok:(customer.kpis.otdRate||0)>=96},{tier:'Resolution SLA',target:'24h',actual:'18.4h avg',ok:true},{tier:'Billing Accuracy',target:'99%',actual:'97.8%',ok:false}].map((s,i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div><div style={{ fontSize: 9, fontWeight: 700, color: '#e5e7eb' }}>{s.tier}</div><div style={{ fontSize: 8, color: '#6b7280' }}>Target: {s.target}</div></div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: s.ok?'#10b981':'#ef4444' }}>{s.actual}</div>
                <div style={{ fontSize: 8, color: s.ok?'#10b981':'#ef4444' }}>{s.ok?'✓ Met':'✗ Breached'}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={card()}>
          <SectionHeader icon={ChevronRight} title="Escalation Matrix" color="#f97316" />
          {[{tier:'Tier 1',desc:'Support Agent',time:'< 4h',color:'#10b981'},{tier:'Tier 2',desc:'Senior Ops',time:'< 8h',color:'#f59e0b'},{tier:'Tier 3',desc:'Account Manager',time:'< 24h',color:'#f97316'},{tier:'Executive',desc:'C-Suite / VP',time:'Immediate',color:'#ef4444'}].map((e,i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: e.color }} />
                <div><div style={{ fontSize: 9, fontWeight: 700, color: '#e5e7eb' }}>{e.tier}</div><div style={{ fontSize: 8, color: '#6b7280' }}>{e.desc}</div></div>
              </div>
              <span style={{ fontSize: 9, color: e.color, fontWeight: 700 }}>{e.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ---- TAB 8: AI INTELLIGENCE ----
  const renderAI = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <div style={card()}>
        <SectionHeader icon={AlertCircle} title="Churn Risk Analysis" color={getChurnColor(customer.predictions.churnRisk)} />
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', border: `6px solid ${getChurnColor(customer.predictions.churnRisk)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: getChurnColor(customer.predictions.churnRisk) }}>{customer.predictions.churnRisk}%</div>
              <div style={{ fontSize: 7, color: '#6b7280' }}>Churn Risk</div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={lbl()}>Contributing Factors</div>
            {customer.predictions.churnFactors.map((f, i) => <div key={i} style={{ fontSize: 9, color: '#9ca3af', marginTop: 4, paddingLeft: 8, borderLeft: `2px solid ${getChurnColor(customer.predictions.churnRisk)}50` }}>• {f}</div>)}
          </div>
        </div>
        <div style={{ padding: '8px 10px', background: 'rgba(99,102,241,0.06)', borderRadius: 7, marginBottom: 10 }}>
          <div style={lbl('#818cf8')}>Recommended Intervention</div>
          <div style={{ fontSize: 10, color: '#e5e7eb', marginTop: 4, lineHeight: 1.5 }}>{customer.predictions.nextBestAction}</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <ActionBtn onClick={() => dispatchAction('CHURN_INTERVENTION_TRIGGERED', `Churn intervention for ${customer.id}`)} color="#6366f1">Trigger Intervention</ActionBtn>
          <ActionBtn onClick={() => dispatchAction('CHURN_ANALYSIS_TRIGGERED', `Churn re-analysis for ${customer.id}`)} color="#06b6d4">Re-Analyze</ActionBtn>
        </div>
      </div>
      <div style={card()}>
        <SectionHeader icon={TrendingUp} title="LTV Forecast & Deal Health" color="#a855f7" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <div style={{ ...card({padding:'10px'}), textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#9ca3af', marginBottom: 4 }}>Total LTV</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#a855f7' }}>{customer.kpis.ltv}</div>
          </div>
          <div style={{ ...card({padding:'10px'}), textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#9ca3af', marginBottom: 4 }}>12-Month Forecast</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#06b6d4' }}>{customer.predictions.ltv12m}</div>
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={lbl()}>Deal Health Index</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
            <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${customer.predictions.dealHealthIndex}%`, height: '100%', background: getDealHealthColor(customer.predictions.dealHealthIndex), borderRadius: 4, transition: 'width 0.8s ease' }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 900, color: getDealHealthColor(customer.predictions.dealHealthIndex) }}>{customer.predictions.dealHealthIndex}</span>
          </div>
        </div>
        <SectionHeader icon={Bot} title="Multi-Agent Consensus" color="#f59e0b" />
        {[
          {agent:'Commercial Agent',view:`Deal health ${customer.predictions.dealHealthIndex>70?'strong — focus on expansion':'weak — prioritize retention'}`,confidence:88},
          {agent:'Risk Agent',view:`Churn risk ${customer.predictions.churnRisk}% — ${customer.predictions.churnRisk>35?'intervention required':'within acceptable range'}`,confidence:92},
          {agent:'Revenue Agent',view:`LTV trajectory ${customer.kpis.renewalLikelihood?(customer.kpis.renewalLikelihood>80?'on track':'at risk'):'undetermined'}`,confidence:76},
        ].map((ag, i) => (
          <div key={i} style={{ padding: '6px 8px', background: 'rgba(245,158,11,0.04)', borderRadius: 6, marginBottom: 5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#fbbf24' }}>🤖 {ag.agent}</span>
              <span style={{ fontSize: 8, color: '#6b7280' }}>Confidence: {ag.confidence}%</span>
            </div>
            <div style={{ fontSize: 9, color: '#9ca3af' }}>{ag.view}</div>
          </div>
        ))}
      </div>
      <div style={{ ...card(), gridColumn: '1 / -1' }}>
        <SectionHeader icon={Sparkles} title="Customer Intelligence Copilot" color="#818cf8" />
        <div style={{ height: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
          {aiMessages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.sender==='user'?'flex-end':'flex-start' }}>
              <div style={{ maxWidth: '80%', padding: '7px 10px', borderRadius: 8, fontSize: 10, lineHeight: 1.6, background: msg.sender==='user'?'rgba(99,102,241,0.2)':'rgba(255,255,255,0.04)', color: msg.sender==='user'?'#a5b4fc':'#e5e7eb', border: `1px solid ${msg.sender==='user'?'rgba(99,102,241,0.3)':'rgba(255,255,255,0.06)'}` }}>{msg.text}</div>
            </div>
          ))}
          {aiTyping && <div style={{ fontSize: 9, color: '#6b7280', fontStyle: 'italic' }}>AI thinking...</div>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key==='Enter' && handleAISubmit(aiInput)}
            placeholder={`Ask about ${customer.shortName}... (churn, LTV, contracts, health)`}
            style={{ flex: 1, padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#e5e7eb', fontSize: 10, outline: 'none' }} />
          <button onClick={() => handleAISubmit(aiInput)} style={{ padding: '8px 14px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#818cf8', cursor: 'pointer' }}><Send size={12} /></button>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          {['Churn risk analysis','LTV projection','Contract renewal forecast','Health score breakdown'].map(q => (
            <button key={q} onClick={() => handleAISubmit(q)} style={{ padding: '3px 8px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 99, fontSize: 8, color: '#818cf8', cursor: 'pointer' }}>{q}</button>
          ))}
        </div>
      </div>
    </div>
  );

  // ---- TAB 9: DECISION JOURNAL ----
  const renderJournal = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={card()}>
        <SectionHeader icon={Clock} title="Decision Timeline & Audit Journal" color="#818cf8">
          <ActionBtn onClick={() => dispatchAction('DECISION_LOGGED', `Decision logged for ${customer.id}`)} color="#818cf8">+ Log Decision</ActionBtn>
        </SectionHeader>
        {customer.decisionJournal.length === 0 && <div style={{ fontSize: 10, color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>No decisions logged for this customer yet</div>}
        {customer.decisionJournal.map((d, i) => (
          <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)', marginBottom: 8, borderLeft: `3px solid ${d.divergence?.startsWith('Positive')?'#10b981':d.divergence?.startsWith('Negative')?'#ef4444':'#f59e0b'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#e5e7eb' }}>{d.action}</div>
                <div style={{ fontSize: 8, color: '#6b7280', marginTop: 2 }}>{d.date} · By: {d.actor}</div>
              </div>
              <span style={pill(d.divergence?.startsWith('Positive')?'#10b981':d.divergence?.startsWith('Negative')?'#ef4444':'#f59e0b')}>{d.divergence}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ padding: '6px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: 6 }}>
                <div style={lbl()}>Expected Outcome</div>
                <div style={{ fontSize: 9, color: '#9ca3af', marginTop: 3 }}>{d.expected}</div>
              </div>
              <div style={{ padding: '6px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: 6 }}>
                <div style={lbl()}>Actual Outcome</div>
                <div style={{ fontSize: 9, color: '#e5e7eb', marginTop: 3 }}>{d.actual}</div>
              </div>
            </div>
            <div style={{ marginTop: 8, padding: '6px 8px', background: 'rgba(99,102,241,0.05)', borderRadius: 6 }}>
              <div style={lbl('#818cf8')}>Learning Lesson</div>
              <div style={{ fontSize: 9, color: '#a5b4fc', marginTop: 3 }}>{d.lesson}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={card()}>
        <SectionHeader icon={Database} title="Live Event Audit Log" color="#06b6d4" />
        <div style={{ maxHeight: 200, overflowY: 'auto' }}>
          {engineState.events?.slice(0, 12).map((ev, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <div>
                <span style={{ fontSize: 8, fontWeight: 700, color: '#818cf8', fontFamily: 'monospace' }}>{ev.type}</span>
                <div style={{ fontSize: 8, color: '#6b7280' }}>{String(ev.desc||'').substring(0, 80)}{(ev.desc||'').length>80?'...':''}</div>
              </div>
              <span style={{ fontSize: 7, color: '#4b5563', flexShrink: 0, marginLeft: 8 }}>{new Date(ev.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
          {(!engineState.events || engineState.events.length === 0) && <div style={{ fontSize: 9, color: '#6b7280' }}>No events recorded yet</div>}
        </div>
      </div>
    </div>
  );

  // ---- SHIPPER TABS ----
  const renderShipperMyShipments = () => (
    <div style={card({padding:'20px'})}>
      <SectionHeader icon={Truck} title={`My Shipments — ${customer.shortName}`} color="#06b6d4" />
      {customer.recentShipments.length === 0 ? <div style={{ textAlign: 'center', padding: '30px', color: '#6b7280', fontSize: 10 }}>No shipments yet. Book your first shipment below.</div> :
        customer.recentShipments.map((s, i) => {
          const sc = STATUS_COLORS[s.status]||'#6b7280';
          return (
            <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: `1px solid ${sc}30`, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><div style={{ fontSize: 13, fontWeight: 800, color: '#e5e7eb' }}>{s.id}</div><div style={{ fontSize: 10, color: '#9ca3af', marginTop: 3 }}>🚛 {s.route}</div></div>
                <div style={{ textAlign: 'right' }}>
                  <span style={pill(sc, `${sc}18`)}>{s.status.replace('_',' ')}</span>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#f9fafb', marginTop: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 9, color: '#9ca3af' }}>ETA: {s.eta}</div>
                </div>
              </div>
            </div>
          );
        })
      }
    </div>
  );

  const renderShipperInvoices = () => (
    <div style={card({padding:'20px'})}>
      <SectionHeader icon={Receipt} title="My Invoices" color="#10b981" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[{l:'Total Billed',v:customer.billing.totalBilled,c:'#06b6d4'},{l:'Amount Paid',v:customer.billing.paid,c:'#10b981'},{l:'Outstanding',v:customer.billing.pending,c:'#f59e0b'}].map((k,i) => <KpiCard key={i} label={k.l} value={k.v} color={k.c} />)}
      </div>
      {[{id:'INV-4821',amount:'₹18.4 L',status:'Paid',due:'2026-07-15'},{id:'INV-4822',amount:'₹14.2 L',status:'Pending',due:'2026-08-20'},{id:'INV-4823',amount:'₹9.8 L',status:'Overdue',due:'2026-07-28'}].map((inv,i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, marginBottom: 7 }}>
          <div><div style={{ fontSize: 11, fontWeight: 700, color: '#e5e7eb' }}>{inv.id}</div><div style={{ fontSize: 8, color: '#6b7280' }}>Due: {inv.due}</div></div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#f9fafb' }}>{inv.amount}</span>
            <span style={pill(inv.status==='Paid'?'#10b981':inv.status==='Pending'?'#f59e0b':'#ef4444')}>{inv.status}</span>
            {inv.status !== 'Paid' && <ActionBtn onClick={() => dispatchAction('PAYMENT_INITIATED', `Payment for ${inv.id}`)} color="#10b981">Pay Now</ActionBtn>}
            <ActionBtn onClick={() => dispatchAction('INVOICE_DOWNLOADED', `Invoice ${inv.id} downloaded`)} color="#6b7280">Download</ActionBtn>
          </div>
        </div>
      ))}
    </div>
  );

  const renderShipperBook = () => (
    <div style={card({padding:'24px', maxWidth:560})}>
      <SectionHeader icon={Plus} title="Book a Shipment" color="#6366f1" />
      {bookingSubmitted ? (
        <div style={{ textAlign: 'center', padding: '24px' }}>
          <CheckCircle size={40} color="#10b981" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: 16, fontWeight: 800, color: '#10b981', marginBottom: 6 }}>Shipment Request Submitted!</div>
          <div style={{ fontSize: 10, color: '#9ca3af' }}>Our team will confirm within 2 hours.</div>
          <div style={{ marginTop: 16 }}><ActionBtn onClick={() => setBookingSubmitted(false)} color="#6366f1">Book Another</ActionBtn></div>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[{label:'Origin City',key:'origin',type:'text'},{label:'Destination City',key:'destination',type:'text'},{label:'Cargo Description',key:'cargo',type:'text'},{label:'Weight (Tons)',key:'tons',type:'number'},{label:'Declared Value',key:'value',type:'text'}].map(f => (
              <div key={f.key}>
                <div style={lbl()}>{f.label}</div>
                <input type={f.type} value={bookingForm[f.key]} onChange={e => setBookingForm(p => ({...p, [f.key]: e.target.value}))}
                  style={{ width: '100%', marginTop: 5, padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#e5e7eb', fontSize: 11, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <button onClick={() => { dispatchAction('SHIPMENT_BOOKING_SUBMITTED', `Booking: ${bookingForm.origin}→${bookingForm.destination}, ${bookingForm.tons} tons`); setBookingSubmitted(true); }}
              style={{ padding: '10px 24px', background: 'linear-gradient(90deg,#6366f1,#06b6d4)', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Submit Shipment Request
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderShipperSupport = () => (
    <div style={card({padding:'20px'})}>
      <SectionHeader icon={MessageSquare} title="My Support Tickets" color="#ec4899">
        <ActionBtn onClick={() => { dispatchAction('SUPPORT_CASE_CREATED', `Self-service ticket by ${customer.name}`); notify('Ticket submitted — our team will contact you within 2 hours'); }} color="#ec4899">+ Raise Issue</ActionBtn>
      </SectionHeader>
      {customer.supportTickets.length === 0 && <div style={{ textAlign: 'center', padding: '20px', color: '#10b981', fontSize: 10 }}>✓ No open issues — all your shipments running smoothly</div>}
      {customer.supportTickets.map((t, i) => (
        <div key={i} style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, marginBottom: 7 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#e5e7eb' }}>{t.type}</div>
          <div style={{ fontSize: 9, color: '#9ca3af', marginTop: 3 }}>{t.desc}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
            <span style={pill(PRIORITY_COLORS[t.priority]||'#6b7280')}>{t.priority}</span>
            <span style={{ fontSize: 9, color: '#6b7280' }}>{t.status}</span>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTabContent = () => {
    if (viewMode === 'shipper') {
      if (shipperTab === 'my_shipments') return renderShipperMyShipments();
      if (shipperTab === 'my_invoices') return renderShipperInvoices();
      if (shipperTab === 'book') return renderShipperBook();
      if (shipperTab === 'my_support') return renderShipperSupport();
    }
    if (activeTab === 'profile') return renderProfile();
    if (activeTab === 'twins') return renderTwins();
    if (activeTab === 'pipeline') return renderPipeline();
    if (activeTab === 'contracts') return renderContracts();
    if (activeTab === 'billing') return renderBilling();
    if (activeTab === 'operations') return renderOperations();
    if (activeTab === 'support') return renderSupport();
    if (activeTab === 'ai') return renderAI();
    if (activeTab === 'journal') return renderJournal();
    return null;
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--topbar-height))', background: '#040711', color: '#f9fafb', fontFamily: 'var(--font-sans)', position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{ position: 'absolute', top: 16, right: 16, zIndex: 100, padding: '8px 16px', background: notification.type==='success'?'rgba(16,185,129,0.9)':'rgba(239,68,68,0.9)', borderRadius: 8, fontSize: 10, fontWeight: 700, color: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
            {notification.msg}
          </motion.div>
        )}
      </AnimatePresence>
      {viewMode === 'internal' && renderLeftPanel()}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {renderHeader()}
        {renderTabBar()}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          <AnimatePresence mode="wait">
            <motion.div key={viewMode==='internal'?activeTab:shipperTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
        <div style={{ padding: '6px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(7,10,20,0.8)', display: 'flex', gap: 12, alignItems: 'center', overflowX: 'auto' }}>
          <span style={lbl('#6366f1')}>Live Events</span>
          {engineState.events?.slice(0, 4).map((ev, i) => (
            <span key={i} style={{ fontSize: 8, color: '#4b5563', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#818cf8' }}>{ev.type}</span> · {String(ev.desc||'').substring(0, 40)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
