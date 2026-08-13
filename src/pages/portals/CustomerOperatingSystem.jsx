/* eslint-disable */
// ============================================================
// GatiFleet — Customer Operating System (COS)
// 16-Tab Customer Command Environment
// Spec: §1–§50 | Event-Driven | AI-Native | Tenant-Isolated
// ============================================================

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Truck, Plus, Map, FileText, Shield, Package, IndianRupee,
  AlertTriangle, MessageSquare, BarChart3, Sparkles, Network, Brain, Settings,
  Link2, Search, Filter, ChevronRight, ChevronDown, Clock, CheckCircle, X,
  AlertCircle, TrendingUp, TrendingDown, Upload, Download, Send, RefreshCw,
  Eye, Zap, Target, Globe, Activity, Users, Building, CreditCard, Receipt,
  ShieldCheck, Bot, Play, RotateCcw, Info, Star, Award, Cpu, GitBranch,
  MapPin, Phone, Mail, Bell, Lock, Key, Webhook, Database
} from 'lucide-react';
import { RealityEngine } from '../../data/RealityEngine';
import {
  EVENT_TAXONOMY, SHIPMENT_STAGES, AUTONOMY_LEVELS, ORG_HIERARCHY,
  CUSTOMER_ROLES, PERMISSION_TYPES, NOTIFICATION_EVENTS, INTEGRATIONS,
  MOCK_SHIPMENTS, MOCK_QUOTES, MOCK_DOCUMENTS, MOCK_CLAIMS, MOCK_EXCEPTIONS,
  ANALYTICS_DATA, AI_AGENTS, NETWORK_LOCATIONS, SIMULATION_SCENARIOS,
  SELF_EVOLUTION_STEPS, KGW_CASE_STUDY, calculateFreightCost, formatINR
} from '../../data/customerOSData';

// ---- TABS (16) ----
const COS_TABS = [
  { id: 'overview',     label: 'Overview',          icon: LayoutDashboard },
  { id: 'shipments',    label: 'Shipments',          icon: Truck },
  { id: 'book',         label: 'Book a Truck',        icon: Plus },
  { id: 'live',         label: 'Live Operations',     icon: Map },
  { id: 'quotes',       label: 'Quotes & Rates',      icon: FileText },
  { id: 'contracts',    label: 'Contracts & SLA',     icon: Shield },
  { id: 'documents',    label: 'Documents & POD',     icon: Package },
  { id: 'finance',      label: 'Finance & Billing',   icon: IndianRupee },
  { id: 'claims',       label: 'Claims & Exceptions', icon: AlertTriangle },
  { id: 'support',      label: 'Support',             icon: MessageSquare },
  { id: 'analytics',    label: 'Analytics',           icon: BarChart3 },
  { id: 'ai',           label: 'AI Workspace',        icon: Sparkles },
  { id: 'network',      label: 'Network & KG',        icon: Network },
  { id: 'twin',         label: 'Digital Twin',        icon: Brain },
  { id: 'admin',        label: 'Administration',      icon: Settings },
  { id: 'integrations', label: 'Integrations',        icon: Link2 },
];

// ---- STYLE HELPERS ----
const s = {
  card: (extra={}) => ({
    background: 'var(--surface-solid)',
    border: '1px solid var(--border-default)',
    borderRadius: 10,
    padding: '14px 16px',
    color: 'var(--text-primary)',
    boxShadow: 'var(--shadow-sm)',
    ...extra
  }),
  lbl: (c) => ({
    fontSize: 9,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: !c || c === '#6b7280' ? 'var(--text-muted)' : c
  }),
  pill: (c='#6366f1', bg) => ({
    display:'inline-flex',
    alignItems:'center',
    gap:4,
    padding:'2px 8px',
    borderRadius:99,
    fontSize:9,
    fontWeight:700,
    textTransform:'uppercase',
    letterSpacing:'0.06em',
    color:c,
    background: bg||`${c}15`,
    border:`1px solid ${c}30`
  }),
  hd: (c='#4f46e5') => ({
    fontSize:10,
    fontWeight:800,
    color: c==='#818cf8'?'#4f46e5':c,
    textTransform:'uppercase',
    letterSpacing:'0.1em',
    display:'flex',
    alignItems:'center',
    gap:6,
    margin:0
  }),
  row: (extra={}) => ({ display:'flex', alignItems:'center', gap:8, ...extra }),
  grid2: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 },
  grid3: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 },
  section: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 },
};

const STAGE_COLORS = { IN_TRANSIT:'#06b6d4', DELAYED:'#ef4444', DELIVERED:'#10b981', BOOKED:'#8b5cf6', REQUESTED:'#6b7280', QUOTED:'#3b82f6', CAPACITY_RESERVED:'#06b6d4', ASSIGNED:'#0ea5e9', DISPATCHED:'#f59e0b', AT_DESTINATION:'#a855f7', POD_VERIFIED:'#22c55e', BILLED:'#06b6d4', PAID:'#10b981', CLOSED:'#6b7280' };
const SEV_COLORS = { High:'#ef4444', Medium:'#f59e0b', Low:'#06b6d4', Critical:'#dc2626', None:'#10b981' };
const INT_STATUS_COLORS = { Connected:'#10b981', Configured:'#f59e0b', Disconnected:'#ef4444' };

const emitCOS = (type, desc) => {
  RealityEngine.events = [{ id:`ev-${Date.now()}`, timestamp:new Date().toISOString(), type, desc, source:'COS/CUSTOMER' }, ...RealityEngine.events];
  RealityEngine.notify?.();
};

// ---- REUSABLE MINI COMPONENTS ----
function Btn({ children, onClick, color='#6366f1', outline=false, sm=true }) {
  return (
    <button onClick={onClick} style={{ padding: sm?'5px 12px':'8px 18px', borderRadius:6, border:`1px solid ${color}40`, cursor:'pointer', background: outline?'transparent':`${color}18`, color, fontSize: sm?10:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', transition:'all 0.2s' }}>
      {children}
    </button>
  );
}

function SH({ icon:Icon, title, color='#818cf8', children }) {
  return (
    <div style={s.section}>
      <h3 style={s.hd(color)}>{Icon&&<Icon size={12}/>}{title}</h3>
      {children}
    </div>
  );
}

function MiniBar({ label, value, max=100, color='#6366f1' }) {
  const pct = Math.min((parseFloat(value)||0)/max*100,100);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <span style={s.lbl()}>{label}</span>
        <span style={{ fontSize:10, fontWeight:700, color }}>{value}{typeof value==='number'?'%':''}</span>
      </div>
      <div style={{ height:3, background:'rgba(255,255,255,0.05)', borderRadius:2 }}>
        <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:2, transition:'width 0.6s' }}/>
      </div>
    </div>
  );
}

function KPI({ label, value, sub, color='#06b6d4', onClick, urgent }) {
  return (
    <div onClick={onClick} style={{ ...s.card(), cursor:onClick?'pointer':'default', borderColor:urgent?`${color}50`:'rgba(255,255,255,0.07)', transition:'all 0.15s', minWidth:0 }}>
      <div style={{ fontSize:8, color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:18, fontWeight:900, color, lineHeight:1 }}>{value}</div>
      {sub&&<div style={{ fontSize:8, color:'#9ca3af', marginTop:3 }}>{sub}</div>}
      {onClick&&<div style={{ fontSize:7, color:`${color}80`, marginTop:4, textTransform:'uppercase' }}>→ click to drill down</div>}
    </div>
  );
}

function StageChip({ status }) {
  const c = STAGE_COLORS[status]||'#6b7280';
  return <span style={s.pill(c)}>{status.replace(/_/g,' ')}</span>;
}

function Drawer({ title, open, onClose, children, width=520 }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:200 }}/>
          <motion.div initial={{x:width}} animate={{x:0}} exit={{x:width}} transition={{type:'spring',damping:28,stiffness:300}}
            style={{ position:'fixed', right:0, top:68, bottom:0, width, background:'var(--bg-900)', borderLeft:'1px solid var(--border-default)', zIndex:201, overflowY:'auto', padding:20, boxShadow:'var(--shadow-xl)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h2 style={{ fontSize:14, fontWeight:800, color:'var(--text-primary)', margin:0 }}>{title}</h2>
              <button onClick={onClose} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer' }}><X size={18}/></button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Notification({ msg, type='success' }) {
  return (
    <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}
      style={{ position:'fixed', top:80, right:20, zIndex:300, padding:'8px 16px', background:type==='success'?'rgba(16,185,129,0.95)':'rgba(239,68,68,0.95)', borderRadius:8, fontSize:10, fontWeight:700, color:'#fff', boxShadow:'0 4px 20px rgba(0,0,0,0.4)', maxWidth:340 }}>
      {msg}
    </motion.div>
  );
}

// ============================================================
// TAB 1 — OVERVIEW / COMMAND CENTER (§3, §4)
// ============================================================
function TabOverview({ customer, navigateTo, showNotify }) {
  const kpis = [
    { label:'Active Shipments',   value: MOCK_SHIPMENTS.filter(s=>['IN_TRANSIT','DISPATCHED','ASSIGNED'].includes(s.status)).length, color:'#06b6d4', tab:'shipments', filter:'active', urgent:false },
    { label:'In-Transit Trucks',  value: MOCK_SHIPMENTS.filter(s=>s.status==='IN_TRANSIT').length, color:'#a855f7', tab:'live',      filter:null,    urgent:false },
    { label:'Delivered Today',    value: MOCK_SHIPMENTS.filter(s=>s.status==='DELIVERED').length, color:'#10b981', tab:'shipments', filter:'delivered', urgent:false },
    { label:'Delayed',            value: MOCK_SHIPMENTS.filter(s=>s.status==='DELAYED').length, color:'#ef4444', tab:'claims',    filter:'delay', urgent:true },
    { label:'SLA Compliance',     value: `${customer.kpis.slaCompliance||96.4}%`, color:'#10b981', tab:'contracts', filter:null, urgent:false },
    { label:'OTD Rate',           value: `${customer.kpis.otdRate||97.2}%`, color:'#06b6d4', tab:'analytics', filter:null, urgent:false },
    { label:'Pending POD',        value: MOCK_SHIPMENTS.filter(s=>s.status==='DELIVERED').length, color:'#f59e0b', tab:'documents', filter:'pod', urgent:true },
    { label:'Pending Invoices',   value: 3, color:'#f97316', tab:'finance', filter:'approval_queue', urgent:true },
    { label:'Outstanding Amount', value: customer.billing?.pending||'₹14.2 L', color:'#ef4444', tab:'finance', filter:'outstanding', urgent:false },
    { label:'Open Claims',        value: MOCK_CLAIMS.filter(c=>c.status!=='Closed').length, color:'#a855f7', tab:'claims', filter:'open', urgent:false },
    { label:'Active Exceptions',  value: MOCK_EXCEPTIONS.filter(e=>e.severity==='High').length, color:'#ef4444', tab:'claims', filter:'exceptions', urgent:true },
  ];

  const aiInsights = [
    { icon:'⚠️', title:'3 shipments at SLA risk', entity:'SHP-8822, SHP-8810, SHP-8819', confidence:91, financialImpact:'₹4.8L penalty exposure', operationalImpact:'Kolkata→Guwahati OTD drops below 88%', evidence:'Contract CF-9281 clause 8.2; telemetry logs 2026-08-13', recommendation:'Trigger reroute on SHP-8822 immediately', timestamp:'13:48', action:'claims', color:'#ef4444' },
    { icon:'💰', title:'₹4.7L savings opportunity detected', entity:'Kolkata→Guwahati lane', confidence:88, financialImpact:'+₹4.7L/month savings', operationalImpact:'SLA compliance +12% on Eastern corridor', evidence:'Historical lane data (38 trips), Digital Twin simulation B', recommendation:'Implement Siliguri relay depot — approved in digital twin', timestamp:'11:22', action:'twin', color:'#10b981' },
    { icon:'📋', title:'2 invoices require urgent review', entity:'INV-4822, INV-4823', confidence:99, financialImpact:'₹24L at risk of overdue status', operationalImpact:'Payment delay increases credit utilization to 68%', evidence:'Invoice aging report — 2 items beyond 30-day threshold', recommendation:'Finance approval required within 6 hours', timestamp:'09:15', action:'finance', color:'#f59e0b' },
    { icon:'🔮', title:'1 SLA breach predicted — SHP-8822', entity:'SHP-8822 Pune→Bangalore', confidence:78, financialImpact:'₹2.4L penalty if unresolved', operationalImpact:'NH4 traffic adds 2.5h — SLA target: 18h; current ETA: 20.5h', evidence:'Live traffic API + telemetry SHP-8822 + contract clause 8.2', recommendation:'Accept AI reroute option B — saves 1.7h', timestamp:'13:52', action:'live', color:'#f97316' },
    { icon:'🚛', title:'4 vehicles showing unusual driving behaviour', entity:'MH-14-CD-6612 (Suresh Patil)', confidence:84, financialImpact:'₹0 direct; ₹8K increased insurance risk', operationalImpact:'Harsh braking events +3 vs baseline — fatigue indicator', evidence:'OBD-II telemetry: 6 harsh braking events since 06:00', recommendation:'Schedule mandatory rest stop at Kolhapur or reassign driver', timestamp:'10:44', action:'live', color:'#a855f7' },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {/* KPI Grid */}
      <div>
        <SH icon={LayoutDashboard} title="Operational Command Strip" color="#06b6d4"/>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:8 }}>
          {kpis.map((k,i) => (
            <KPI key={i} label={k.label} value={k.value} color={k.color} urgent={k.urgent}
              onClick={() => { navigateTo(k.tab, k.filter); }} />
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div style={s.card()}>
        <SH icon={Sparkles} title="AI Operational Intelligence" color="#818cf8">
          <span style={s.pill('#818cf8')}>5 Insights Active</span>
        </SH>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {aiInsights.map((ins,i) => (
            <motion.div key={i} whileHover={{ scale:1.005 }}
              style={{ padding:'10px 12px', background:`${ins.color}08`, border:`1px solid ${ins.color}25`, borderRadius:8, cursor:'pointer', borderLeft:`3px solid ${ins.color}` }}
              onClick={() => { navigateTo(ins.action); }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <span style={{ fontSize:14 }}>{ins.icon}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:'#f9fafb' }}>{ins.title}</span>
                  <span style={s.pill(ins.color)}>Conf: {ins.confidence}%</span>
                </div>
                <span style={{ fontSize:8, color:'#6b7280', flexShrink:0 }}>🕐 {ins.timestamp}</span>
              </div>
              <div style={s.grid2}>
                <div>
                  <div style={s.lbl()}>Financial Impact</div>
                  <div style={{ fontSize:9, color:'#f9fafb', marginTop:2 }}>{ins.financialImpact}</div>
                </div>
                <div>
                  <div style={s.lbl()}>Operational Impact</div>
                  <div style={{ fontSize:9, color:'#9ca3af', marginTop:2 }}>{ins.operationalImpact}</div>
                </div>
              </div>
              <div style={{ marginTop:6, display:'flex', gap:10, flexWrap:'wrap' }}>
                <div><span style={s.lbl('#818cf8')}>Entity: </span><span style={{ fontSize:9, color:'#a5b4fc' }}>{ins.entity}</span></div>
                <div><span style={s.lbl()}>Evidence: </span><span style={{ fontSize:9, color:'#9ca3af' }}>{ins.evidence}</span></div>
              </div>
              <div style={{ marginTop:6, padding:'4px 8px', background:'rgba(99,102,241,0.08)', borderRadius:5 }}>
                <span style={{ fontSize:9, color:'#818cf8', fontWeight:600 }}>→ </span>
                <span style={{ fontSize:9, color:'#e5e7eb' }}>{ins.recommendation}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div style={s.card()}>
        <SH icon={Clock} title="Recent Activity" color="#06b6d4"/>
        {[
          { time:'13:52', event:'SLA risk detected — SHP-8822', type:'SLAAtRisk', color:'#ef4444' },
          { time:'13:45', event:'ETA recalculated — SHP-8821 → 08:30 Aug-14', type:'ETAUpdated', color:'#06b6d4' },
          { time:'11:02', event:'SHP-8819 delivered — Jaipur WH', type:'ShipmentDelivered', color:'#10b981' },
          { time:'09:15', event:'Traffic exception detected — SHP-8822 NH4', type:'ExceptionDetected', color:'#f97316' },
          { time:'08:10', event:'Booking confirmed — SHP-8821 Mumbai→Delhi', type:'ShipmentCreated', color:'#8b5cf6' },
        ].map((e,i) => (
          <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize:8, color:'#6b7280', width:36, flexShrink:0, fontFamily:'monospace' }}>{e.time}</span>
            <div style={{ width:6, height:6, borderRadius:'50%', background:e.color, marginTop:3, flexShrink:0 }}/>
            <span style={{ fontSize:9, color:'#e5e7eb' }}>{e.event}</span>
            <span style={{ marginLeft:'auto', ...s.pill(e.color) }}>{e.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// TAB 2 — SHIPMENT COMMAND CENTER (§5, §10)
// ============================================================
function TabShipments({ customer, showNotify, initFilter }) {
  const [filter, setFilter] = useState(initFilter||'all');
  const [search, setSearch] = useState('');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [detailTab, setDetailTab] = useState('overview');
  const [savedView, setSavedView] = useState('All Shipments');

  const filtered = useMemo(() => {
    return MOCK_SHIPMENTS.filter(s => {
      if (search && !s.id.toLowerCase().includes(search.toLowerCase()) && !s.route.toLowerCase().includes(search.toLowerCase())) return false;
      if (filter==='active') return ['IN_TRANSIT','DISPATCHED','ASSIGNED','CAPACITY_RESERVED'].includes(s.status);
      if (filter==='delivered') return ['DELIVERED','POD_VERIFIED'].includes(s.status);
      if (filter==='delayed') return s.status==='DELAYED';
      return true;
    });
  }, [filter, search]);

  const triggerTransition = (shp, newStage) => {
    emitCOS('ShipmentCreated', `State transition: ${shp.id} → ${newStage}`);
    showNotify(`Event emitted: ${shp.id} → ${newStage}`);
  };

  return (
    <div>
      {/* Filters & Search */}
      <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ position:'relative', flex:1, maxWidth:260 }}>
          <Search size={11} color="#6b7280" style={{ position:'absolute', left:8, top:'50%', transform:'translateY(-50%)' }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search shipment ID or route..."
            style={{ width:'100%', padding:'6px 8px 6px 26px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:6, color:'#e5e7eb', fontSize:10, outline:'none', boxSizing:'border-box' }}/>
        </div>
        {['all','active','delivered','delayed'].map(f => (
          <button key={f} onClick={()=>setFilter(f)}
            style={{ padding:'5px 12px', borderRadius:99, border:'none', cursor:'pointer', fontSize:9, fontWeight:700, textTransform:'uppercase', background:filter===f?'rgba(99,102,241,0.25)':'rgba(255,255,255,0.04)', color:filter===f?'#a5b4fc':'#6b7280' }}>
            {f}
          </button>
        ))}
        <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
          <Btn onClick={()=>{emitCOS('ShipmentCreated','New shipment booking initiated');showNotify('New booking started');}} color="#6366f1">+ New Booking</Btn>
          <Btn onClick={()=>showNotify('Bulk POD downloaded')} color="#10b981" outline>Download POD</Btn>
        </div>
      </div>

      {/* Shipment Table */}
      <div style={{ ...s.card({ padding:0 }), overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'rgba(0,0,0,0.3)' }}>
              {['Shipment ID','Route','Cargo','Vehicle / Driver','Status','SLA Risk','Value','Actions'].map(h => (
                <th key={h} style={{ padding:'8px 12px', textAlign:'left', ...s.lbl(), whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((shp,i) => (
              <tr key={shp.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', cursor:'pointer', transition:'background 0.1s' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <td style={{ padding:'10px 12px' }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'#a5b4fc' }}>{shp.id}</div>
                  <div style={{ fontSize:8, color:'#6b7280' }}>{shp.contractRef}</div>
                </td>
                <td style={{ padding:'10px 12px' }}>
                  <div style={{ fontSize:10, color:'#e5e7eb' }}>{shp.route}</div>
                  <div style={{ fontSize:8, color:'#6b7280' }}>Distance: {shp.distance}</div>
                </td>
                <td style={{ padding:'10px 12px' }}>
                  <div style={{ fontSize:9, color:'#9ca3af' }}>{shp.cargo}</div>
                  <div style={{ fontSize:8, color:'#6b7280' }}>{shp.weight}</div>
                </td>
                <td style={{ padding:'10px 12px' }}>
                  <div style={{ fontSize:9, color:'#9ca3af' }}>{shp.vehicle}</div>
                  <div style={{ fontSize:8, color:'#6b7280' }}>{shp.driver}</div>
                </td>
                <td style={{ padding:'10px 12px' }}><StageChip status={shp.status}/></td>
                <td style={{ padding:'10px 12px' }}>
                  <span style={s.pill(SEV_COLORS[shp.slaRisk]||'#6b7280')}>{shp.slaRisk}</span>
                </td>
                <td style={{ padding:'10px 12px', fontSize:11, fontWeight:700, color:'#f9fafb' }}>{shp.value}</td>
                <td style={{ padding:'10px 12px' }}>
                  <div style={{ display:'flex', gap:4 }}>
                    <button onClick={()=>setSelectedShipment(shp)} style={{ padding:'3px 8px', fontSize:8, fontWeight:700, background:'rgba(99,102,241,0.15)', border:'1px solid rgba(99,102,241,0.3)', borderRadius:4, color:'#818cf8', cursor:'pointer' }}>Detail</button>
                    <button onClick={()=>{emitCOS('PODUploaded',`POD view for ${shp.id}`);}} style={{ padding:'3px 8px', fontSize:8, fontWeight:700, background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', borderRadius:4, color:'#10b981', cursor:'pointer' }}>POD</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0 && <div style={{ padding:'24px', textAlign:'center', fontSize:10, color:'#6b7280' }}>No shipments match this filter.</div>}
      </div>

      {/* Shipment Detail Drawer (§10) */}
      <Drawer title={`Shipment Detail — ${selectedShipment?.id||''}`} open={!!selectedShipment} onClose={()=>setSelectedShipment(null)} width={600}>
        {selectedShipment && (
          <div>
            {/* Header */}
            <div style={{ ...s.card({ marginBottom:12 }), borderLeft:`3px solid ${STAGE_COLORS[selectedShipment.status]||'#6b7280'}` }}>
              <div style={s.grid2}>
                {[['Route',selectedShipment.route],['Cargo',selectedShipment.cargo],['Vehicle',selectedShipment.vehicle],['Driver',selectedShipment.driver],['Carrier',selectedShipment.carrier],['Distance',selectedShipment.distance],['ETA',selectedShipment.eta],['Value',selectedShipment.value]].map(([k,v])=>(
                  <div key={k}><div style={s.lbl()}>{k}</div><div style={{ fontSize:10, color:'#e5e7eb', marginTop:2 }}>{v}</div></div>
                ))}
              </div>
              <div style={{ marginTop:10, display:'flex', gap:6, flexWrap:'wrap' }}>
                <StageChip status={selectedShipment.status}/>
                <span style={s.pill(SEV_COLORS[selectedShipment.slaRisk]||'#6b7280')}>SLA: {selectedShipment.slaRisk}</span>
                <span style={s.pill('#818cf8')}>OTD: {selectedShipment.otd}%</span>
              </div>
            </div>
            {/* Sub-tabs */}
            <div style={{ display:'flex', gap:4, marginBottom:12, overflowX:'auto' }}>
              {['overview','events','exceptions','communications','ai'].map(t=>(
                <button key={t} onClick={()=>setDetailTab(t)}
                  style={{ padding:'5px 10px', borderRadius:5, border:'none', cursor:'pointer', fontSize:9, fontWeight:700, textTransform:'uppercase', background:detailTab===t?'rgba(99,102,241,0.2)':'rgba(255,255,255,0.04)', color:detailTab===t?'#a5b4fc':'#6b7280', whiteSpace:'nowrap' }}>
                  {t==='overview'?'Overview':t==='events'?'Event Timeline':t==='exceptions'?'Exceptions':t==='communications'?'Communications':'AI Recs'}
                </button>
              ))}
            </div>
            {/* Sub-tab content */}
            {detailTab==='overview' && (
              <div>
                <div style={s.card({ marginBottom:8 })}>
                  <SH icon={Shield} title="13-Stage Lifecycle" color="#06b6d4"/>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                    {SHIPMENT_STAGES.map((st,i) => {
                      const stageIdx = SHIPMENT_STAGES.findIndex(x=>x.id===selectedShipment.status);
                      const isDone = i<stageIdx;
                      const isCurr = st.id===selectedShipment.status;
                      return (
                        <button key={st.id} onClick={()=>triggerTransition(selectedShipment,st.id)}
                          style={{ padding:'3px 7px', borderRadius:99, border:`1px solid ${isCurr?st.color:isDone?'#10b981':'rgba(255,255,255,0.1)'}`, background: isCurr?`${st.color}25`:isDone?'rgba(16,185,129,0.1)':'transparent', color:isCurr?st.color:isDone?'#10b981':'#4b5563', fontSize:8, fontWeight:700, cursor:'pointer', textTransform:'uppercase' }}>
                          {isDone?'✓':isCurr?'▶':''} {st.icon} {st.id.replace(/_/g,' ')}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <Btn onClick={()=>{emitCOS('InvoiceGenerated',`Invoice for ${selectedShipment.id}`);}} color="#06b6d4">Generate Invoice</Btn>
                  <Btn onClick={()=>{emitCOS('PODUploaded',`POD request ${selectedShipment.id}`);}} color="#10b981">Upload POD</Btn>
                  <Btn onClick={()=>{emitCOS('ClaimCreated',`Claim filed for ${selectedShipment.id}`);}} color="#ef4444">File Claim</Btn>
                </div>
              </div>
            )}
            {detailTab==='events' && (
              <div>
                <SH icon={Clock} title="Operational Event Timeline" color="#f59e0b"/>
                {selectedShipment.events.length===0 && <div style={{ fontSize:9, color:'#6b7280', fontStyle:'italic' }}>No events recorded yet.</div>}
                {selectedShipment.events.map((ev,i) => (
                  <div key={i} style={{ padding:'8px 10px', background:'rgba(255,255,255,0.02)', borderRadius:7, marginBottom:6, borderLeft:`2px solid #6366f1` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontSize:10, fontWeight:700, color:'#e5e7eb' }}>{ev.event}</span>
                      <span style={{ fontSize:8, color:'#6b7280', fontFamily:'monospace' }}>{ev.time}</span>
                    </div>
                    <div style={s.grid2}>
                      {[['Type',ev.type],['Location',ev.location],['Source','GatiFleet IoT/Telemetry'],['AI Involved','No']].map(([k,v])=>(
                        <div key={k}><span style={s.lbl()}>{k}: </span><span style={{ fontSize:9, color:'#9ca3af' }}>{v}</span></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {detailTab==='exceptions' && (
              <div>
                {selectedShipment.exceptions.length===0 ? <div style={{ fontSize:9, color:'#10b981', textAlign:'center', padding:'16px 0' }}>✓ No exceptions — all clear</div> :
                  selectedShipment.exceptions.map((ex,i) => (
                    <div key={i} style={{ ...s.card(), borderColor:'rgba(239,68,68,0.3)', marginBottom:8 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:'#ef4444', marginBottom:4 }}>{ex.type}</div>
                      <div style={{ fontSize:9, color:'#9ca3af' }}>Reason: {ex.reason}</div>
                      <div style={{ fontSize:9, color:'#9ca3af', marginTop:2 }}>ETA Delta: {ex.etaDelta} | Additional Cost: {ex.cost}</div>
                    </div>
                  ))
                }
              </div>
            )}
            {detailTab==='communications' && (
              <div>
                <SH icon={MessageSquare} title="Communication Log" color="#ec4899"/>
                {[{ from:'GatiFleet AI', msg:'SLA risk detected — reroute recommended.', time:'13:52' },{ from:'Driver Ramesh', msg:'Vehicle departed JNPT Gate on schedule.', time:'11:15' },{ from:'System', msg:'Booking confirmed — capacity reserved.', time:'08:10' }].map((c,i) => (
                  <div key={i} style={{ padding:'8px 10px', background:'rgba(255,255,255,0.02)', borderRadius:7, marginBottom:6 }}>
                    <div style={{ fontSize:8, color:'#818cf8', fontWeight:700, marginBottom:2 }}>{c.from} · {c.time}</div>
                    <div style={{ fontSize:9, color:'#e5e7eb' }}>{c.msg}</div>
                  </div>
                ))}
              </div>
            )}
            {detailTab==='ai' && (
              <div style={{ ...s.card(), borderColor:'rgba(99,102,241,0.2)' }}>
                <SH icon={Sparkles} title="AI Recommendations" color="#818cf8"/>
                <div style={{ padding:'8px 10px', background:'rgba(99,102,241,0.06)', borderRadius:7 }}>
                  <div style={{ fontSize:10, color:'#e5e7eb', marginBottom:6 }}>{selectedShipment.aiRec}</div>
                  <div style={{ display:'flex', gap:6 }}>
                    <Btn onClick={()=>{emitCOS('AgentActionTaken','AI recommendation accepted');}} color="#10b981">Accept</Btn>
                    <Btn onClick={()=>{emitCOS('AgentActionTaken','AI recommendation overridden');}} color="#6b7280" outline>Override</Btn>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}

// ============================================================
// TAB 3 — BOOK A TRUCK (§6, §7, §8, §9)
// ============================================================
function TabBook({ customer, showNotify }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    shipmentType:'Full Truck Load', pickup:{ location:'Mumbai', contact:'', date:'', timeWindow:'08:00–12:00' },
    delivery:{ location:'Delhi', contact:'', date:'', timeWindow:'06:00–10:00' },
    cargo:{ material:'Auto Components', weight:18, volume:240, packaging:'Crated', special:'' },
    vehicle:{ type:'Container 40FT', capacity:20, temp:'Ambient', special:'', insurance:'Standard' },
    selectedQuote: null,
  });
  const [calc, setCalc] = useState(null);
  const [bookingResult, setBookingResult] = useState(null);
  const [execStep, setExecStep] = useState(0);

  const EXECUTION_STEPS = ['Validating authorization','Validating contract CF-9281','Validating rate','Checking capacity','Reserving capacity','Creating shipment','Generating shipment ID','Creating financial transaction','Creating tracking session','Updating Knowledge Graph','Creating notification jobs','Starting AI monitoring','Writing audit event'];

  const setF = useCallback((key, val) => setForm(p => ({...p, [key]:val})), []);

  const calcCost = useCallback(() => {
    const distMap = { 'Full Truck Load':1421, 'Part Truck Load':836, 'Container':836, 'Trailer':1014, 'Open Truck':282, 'Special Vehicle':626 };
    const dist = distMap[form.shipmentType]||800;
    const result = calculateFreightCost({ distanceKm:dist, weightMT:form.cargo.weight, vehicleType:form.vehicle.type, contractAdjPct:3 });
    setCalc(result);
    setStep(9);
  }, [form]);

  const executeBooking = useCallback(() => {
    setStep(12);
    let i = 0;
    const run = () => {
      if (i < EXECUTION_STEPS.length) { setExecStep(i+1); i++; setTimeout(run, 220); }
      else {
        const id = `SHP-${Math.floor(Math.random()*9000)+1000}`;
        setBookingResult({ id, msg:`Booking confirmed. Shipment ${id} created.` });
        emitCOS('BookingConfirmed', `Booking ${id}: ${form.shipmentType} ${form.pickup.location}→${form.delivery.location}`);
        showNotify(`✓ Booking Confirmed — ${id}`);
        setStep(13);
      }
    };
    run();
  }, [form]);

  const QUOTE_OPTIONS = calc ? [
    { type:'Recommended',      price: formatINR(calc.total),      etaH:28, margin:'18.4%', risk:'Low',    confidence:91, sla:'OTD 96%', reason:'Best balance of cost and delivery time. Current diesel rate factored.' },
    { type:'Cheapest',         price: formatINR(Math.round(calc.total*0.88)), etaH:36, margin:'12.2%', risk:'Medium', confidence:82, sla:'OTD 91%', reason:'Uses shared capacity with 2-day transit extension.' },
    { type:'Fastest',          price: formatINR(Math.round(calc.total*1.18)), etaH:22, margin:'24.8%', risk:'Low',    confidence:88, sla:'OTD 98%', reason:'Express lane with priority loading and night driving.' },
    { type:'Highest Reliability', price: formatINR(Math.round(calc.total*1.12)), etaH:30, margin:'21.6%', risk:'Very Low', confidence:96, sla:'OTD 99%', reason:'Premium fleet with dual-driver and IoT reefer monitoring.' },
  ] : [];

  const inpStyle = { width:'100%', padding:'7px 10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'#e5e7eb', fontSize:10, outline:'none', boxSizing:'border-box', marginTop:4 };

  return (
    <div style={{ maxWidth:720, margin:'0 auto' }}>
      {/* Step Progress */}
      <div style={{ display:'flex', gap:0, marginBottom:20, overflowX:'auto' }}>
        {['Shipment Type','Pickup','Delivery','Cargo','Vehicle Req.','Calculate','Check Contract','Check Capacity','Quote','Accept','Confirm','Execute','Done'].map((st,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:0, flexShrink:0 }}>
            <div style={{ width:24, height:24, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, background:step>i+1?'#10b981':step===i+1?'#6366f1':'rgba(255,255,255,0.05)', color:step>i+1||step===i+1?'#fff':'#4b5563' }}>
              {step>i+1?'✓':i+1}
            </div>
            <span style={{ fontSize:7, color:step===i+1?'#a5b4fc':'#4b5563', width:42, textAlign:'center', lineHeight:1.2, textTransform:'uppercase', fontWeight:700 }}>{st}</span>
            {i<12 && <div style={{ width:14, height:1, background:'rgba(255,255,255,0.08)' }}/>}
          </div>
        ))}
      </div>

      {step===13 && bookingResult && (
        <div style={{ textAlign:'center', padding:'32px 0' }}>
          <CheckCircle size={48} color="#10b981" style={{ margin:'0 auto 12px' }}/>
          <div style={{ fontSize:18, fontWeight:900, color:'#10b981', marginBottom:8 }}>{bookingResult.id} — Confirmed!</div>
          <div style={{ fontSize:10, color:'#9ca3af', marginBottom:16 }}>Truck assigned, tracking session active, finance transaction created.</div>
          <Btn onClick={()=>{setStep(1);setCalc(null);setBookingResult(null);setExecStep(0);}} color="#6366f1" sm={false}>Book Another Shipment</Btn>
        </div>
      )}

      {step===12 && (
        <div style={s.card()}>
          <SH icon={Play} title="Booking Execution Pipeline" color="#10b981"/>
          <div style={{ fontSize:9, color:'#9ca3af', marginBottom:12 }}>Processing {execStep} of {EXECUTION_STEPS.length} steps...</div>
          {EXECUTION_STEPS.map((st,i) => (
            <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'5px 0', opacity:i<execStep?1:0.3 }}>
              <div style={{ width:16, height:16, borderRadius:'50%', background:i<execStep?'rgba(16,185,129,0.2)':'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {i<execStep ? <span style={{ fontSize:8, color:'#10b981' }}>✓</span> : <span style={{ fontSize:7, color:'#4b5563' }}>{i+1}</span>}
              </div>
              <span style={{ fontSize:9, color:i<execStep?'#10b981':'#4b5563' }}>{st}</span>
            </div>
          ))}
        </div>
      )}

      {step===11 && (
        <div style={s.card()}>
          <SH icon={CheckCircle} title="Confirm Booking" color="#10b981"/>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
            {[['Type',form.shipmentType],['From',form.pickup.location],['To',form.delivery.location],['Cargo',form.cargo.material],['Weight',`${form.cargo.weight} MT`],['Vehicle',form.vehicle.type],['Quote',form.selectedQuote?.type||'Recommended'],['Total',form.selectedQuote?.price||formatINR(calc?.total||0)]].map(([k,v])=>(
              <div key={k}><div style={s.lbl()}>{k}</div><div style={{ fontSize:10, color:'#e5e7eb', marginTop:2 }}>{v}</div></div>
            ))}
          </div>
          <div style={{ padding:'8px 12px', background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:7, marginBottom:12, fontSize:9, color:'#fbbf24' }}>
            ⚠ By confirming, you authorize GatiFleet to reserve capacity, create a financial obligation under contract CF-9281, and initiate all 13 booking execution steps.
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <Btn onClick={executeBooking} color="#10b981" sm={false}>Confirm & Execute Booking</Btn>
            <Btn onClick={()=>setStep(10)} color="#6b7280" outline>← Back</Btn>
          </div>
        </div>
      )}

      {step===10 && (
        <div style={s.card()}>
          <SH icon={CheckCircle} title="Step 11 — Customer Accept / Reject Quote" color="#a855f7"/>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
            {QUOTE_OPTIONS.map((q,i) => (
              <div key={i} onClick={()=>setF('selectedQuote',q)}
                style={{ padding:'12px', background: form.selectedQuote?.type===q.type?'rgba(99,102,241,0.15)':'rgba(255,255,255,0.02)', border:`1px solid ${form.selectedQuote?.type===q.type?'rgba(99,102,241,0.5)':'rgba(255,255,255,0.06)'}`, borderRadius:8, cursor:'pointer' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:10, fontWeight:700, color:'#e5e7eb' }}>{q.type}</span>
                  <span style={s.pill(q.risk==='Low'||q.risk==='Very Low'?'#10b981':'#f59e0b')}>{q.risk} risk</span>
                </div>
                <div style={{ fontSize:18, fontWeight:900, color:'#f9fafb', marginBottom:4 }}>{q.price}</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4, marginBottom:6 }}>
                  {[['ETA',`${q.etaH}h`],['Margin',q.margin],['Confidence',`${q.confidence}%`],['SLA',q.sla]].map(([k,v])=>(
                    <div key={k}><div style={s.lbl()}>{k}</div><div style={{ fontSize:9, color:'#9ca3af' }}>{v}</div></div>
                  ))}
                </div>
                <div style={{ fontSize:8, color:'#6b7280', fontStyle:'italic' }}>🤖 {q.reason}</div>
              </div>
            ))}
          </div>
          {/* AI Price Explanation (§8) */}
          <div style={{ ...s.card({ background:'rgba(99,102,241,0.06)', marginBottom:12 }) }}>
            <div style={s.lbl('#818cf8')}>AI Price Explanation</div>
            <div style={{ fontSize:9, color:'#a5b4fc', marginTop:4 }}>Rate components: Diesel +{(((calc?.fuelCurrent-calc?.fuelBaseline)/calc?.fuelBaseline)*100).toFixed(1)}% vs contract baseline (₹{calc?.fuelBaseline}/L → ₹{calc?.fuelCurrent}/L) · Market demand +7.8% (Mumbai-Delhi peak season) · Available capacity -6.2% · Contract CF-9281 adjustment -3%.</div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <Btn onClick={()=>{if(!form.selectedQuote) return; setStep(11);}} color="#10b981" sm={false}>Accept Quote → Confirm</Btn>
            <Btn onClick={()=>{emitCOS('QuoteRejected','Customer rejected all quotes');showNotify('Quote rejected — request re-quote?');}} color="#ef4444" outline>Reject All</Btn>
          </div>
        </div>
      )}

      {[6,7,8,9].includes(step) && calc && step===9 && (
        <div style={s.card()}>
          <SH icon={IndianRupee} title="Price Calculation (§7)" color="#10b981"/>
          <div style={{ marginBottom:10 }}>
            {[['Base Freight','baseFright','#e5e7eb'],['+ Fuel Surcharge','fuelSurcharge','#f59e0b'],['+ Toll','toll','#06b6d4'],['+ Loading','loading','#9ca3af'],['+ Unloading','unloading','#9ca3af'],['+ Detention','detention','#9ca3af'],['+ Special Service Charges','specialService','#9ca3af'],['− Discount','discount','#10b981'],['− Contract Adjustment (CF-9281 -3%)','contractAdj','#10b981'],].map(([lbl,key,color])=>(
              <div key={key} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize:9, color:'#9ca3af' }}>{lbl}</span>
                <span style={{ fontSize:10, fontWeight:600, color }}>{lbl.startsWith('−')?'−':'+'}  {formatINR(calc[key])}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderTop:'1px solid rgba(255,255,255,0.12)', marginTop:4 }}>
              <span style={{ fontSize:10, fontWeight:700, color:'#e5e7eb' }}>= Taxable Amount</span>
              <span style={{ fontSize:13, fontWeight:900, color:'#06b6d4' }}>{formatINR(calc.taxable)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', padding:'5px 0' }}>
              <span style={{ fontSize:9, color:'#9ca3af' }}>+ GST (18%)</span>
              <span style={{ fontSize:10, fontWeight:600, color:'#9ca3af' }}>+ {formatINR(calc.gst)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 10px', background:'rgba(16,185,129,0.08)', borderRadius:7, marginTop:4 }}>
              <span style={{ fontSize:12, fontWeight:800, color:'#f9fafb' }}>Invoice Total</span>
              <span style={{ fontSize:18, fontWeight:900, color:'#10b981' }}>{formatINR(calc.total)}</span>
            </div>
          </div>
          {/* Audit trail */}
          <div style={{ ...s.card({ background:'rgba(255,255,255,0.02)', padding:'8px 10px' }), marginBottom:10 }}>
            <div style={s.lbl('#6b7280')}>Calculation Audit Trail</div>
            <div style={{ fontSize:8, color:'#6b7280', marginTop:4, fontFamily:'monospace', lineHeight:1.8 }}>
              Contract Ref: {calc.contractRef} · Version: {calc.calculationVersion} · Timestamp: {new Date(calc.timestamp).toLocaleTimeString()}<br/>
              Fuel Baseline: ₹{calc.fuelBaseline}/L · Current: ₹{calc.fuelCurrent}/L<br/>
              Formula: {calc.formula}
            </div>
          </div>
          <Btn onClick={()=>setStep(10)} color="#6366f1" sm={false}>Proceed to Quote Options →</Btn>
        </div>
      )}

      {step===8 && (
        <div style={s.card()}>
          <SH icon={CheckCircle} title="Step 8 — Checking Available Capacity" color="#06b6d4"/>
          <div style={{ padding:'16px', textAlign:'center' }}>
            <div style={{ fontSize:12, color:'#06b6d4', fontWeight:700, marginBottom:8 }}>✓ Capacity Available</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:14 }}>
              <div style={s.card({ textAlign:'center' })}><div style={{ fontSize:16, fontWeight:900, color:'#10b981' }}>4</div><div style={s.lbl()}>Available Trucks</div></div>
              <div style={s.card({ textAlign:'center' })}><div style={{ fontSize:16, fontWeight:900, color:'#06b6d4' }}>96%</div><div style={s.lbl()}>Fleet Utilization</div></div>
              <div style={s.card({ textAlign:'center' })}><div style={{ fontSize:16, fontWeight:900, color:'#a855f7' }}>28h</div><div style={s.lbl()}>Estimated Transit</div></div>
            </div>
            <Btn onClick={calcCost} color="#10b981" sm={false}>Calculate Cost →</Btn>
          </div>
        </div>
      )}

      {step===7 && (
        <div style={s.card()}>
          <SH icon={Shield} title="Step 7 — Contract Check" color="#f59e0b"/>
          <div style={{ padding:'12px', background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:8, marginBottom:12 }}>
            <div style={{ fontSize:10, fontWeight:700, color:'#10b981', marginBottom:6 }}>✓ Active Contract Found — CF-9281</div>
            <div style={s.grid2}>
              {[['Contract Rate','₹42/km (Container 40FT)'],['SLA','OTD 96% in 28h'],['Fuel Clause','Surcharge at 8% + delta'],['Discount','-3% volume commitment'],['Expiry','2026-12-31'],['Status','Active']].map(([k,v])=>(
                <div key={k}><div style={s.lbl()}>{k}</div><div style={{ fontSize:9, color:'#e5e7eb', marginTop:2 }}>{v}</div></div>
              ))}
            </div>
          </div>
          <Btn onClick={()=>setStep(8)} color="#10b981" sm={false}>Contract Validated → Check Capacity</Btn>
        </div>
      )}

      {step===6 && (
        <div style={s.card()}>
          <SH icon={Cpu} title="Step 6 — Transportation Requirement Calculation" color="#8b5cf6"/>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:14 }}>
            {[['Shipment Type',form.shipmentType],['Vehicle Required',form.vehicle.type],['Estimated Distance','~1,400 km'],['Loading Point',form.pickup.location],['Delivery Point',form.delivery.location],['Cargo Weight',`${form.cargo.weight} MT`]].map(([k,v])=>(
              <div key={k} style={s.card({ padding:'8px' })}><div style={s.lbl()}>{k}</div><div style={{ fontSize:10, color:'#e5e7eb', marginTop:3 }}>{v}</div></div>
            ))}
          </div>
          <Btn onClick={()=>setStep(7)} color="#8b5cf6" sm={false}>Proceed to Contract Check →</Btn>
        </div>
      )}

      {step===5 && (
        <div style={s.card()}>
          <SH icon={Truck} title="Step 5 — Vehicle Requirements" color="#06b6d4"/>
          <div style={s.grid2}>
            {[['Vehicle Type',['Container 40FT','Trailer 20W','Car Carrier','Open Body 14W','Reefer Truck'],'type'],[`Capacity (MT)`,null,'capacity'],['Temperature Requirements',['Ambient','0-4°C','0-8°C','-18°C'],'temp'],['Insurance',['Standard','Enhanced','Full Coverage'],'insurance']].map(([lbl,opts,key])=>(
              <div key={key}>
                <div style={s.lbl({ marginBottom:4 })}>{lbl}</div>
                {opts ? <select value={form.vehicle[key]} onChange={e=>setF('vehicle',{...form.vehicle,[key]:e.target.value})} style={inpStyle}>
                  {opts.map(o=><option key={o}>{o}</option>)}
                </select> : <input type="number" value={form.vehicle[key]} onChange={e=>setF('vehicle',{...form.vehicle,[key]:e.target.value})} style={inpStyle}/>}
              </div>
            ))}
          </div>
          <div style={{ marginTop:12 }}><Btn onClick={()=>setStep(6)} color="#06b6d4" sm={false}>Next: Calculate Requirement →</Btn></div>
        </div>
      )}

      {step===4 && (
        <div style={s.card()}>
          <SH icon={Package} title="Step 4 — Cargo Details" color="#a855f7"/>
          <div style={s.grid2}>
            {[['Material / Commodity','material','text'],['Weight (MT)','weight','number'],['Volume (CFT)','volume','number'],['Packaging','packaging','text'],['Special Handling','special','text']].map(([lbl,key,type])=>(
              <div key={key}>
                <div style={s.lbl({ marginBottom:4 })}>{lbl}</div>
                <input type={type} value={form.cargo[key]} onChange={e=>setF('cargo',{...form.cargo,[key]:e.target.value})} style={inpStyle}/>
              </div>
            ))}
          </div>
          <div style={{ marginTop:12 }}><Btn onClick={()=>setStep(5)} color="#a855f7" sm={false}>Next: Vehicle Requirements →</Btn></div>
        </div>
      )}

      {step===3 && (
        <div style={s.card()}>
          <SH icon={MapPin} title="Step 3 — Delivery Details" color="#10b981"/>
          <div style={s.grid2}>
            {[['Delivery Location','location'],['Contact Person','contact'],['Delivery Date','date'],['Time Window','timeWindow']].map(([lbl,key])=>(
              <div key={key}>
                <div style={s.lbl({ marginBottom:4 })}>{lbl}</div>
                <input value={form.delivery[key]} onChange={e=>setF('delivery',{...form.delivery,[key]:e.target.value})} style={inpStyle}/>
              </div>
            ))}
          </div>
          <div style={{ marginTop:12 }}><Btn onClick={()=>setStep(4)} color="#10b981" sm={false}>Next: Cargo Details →</Btn></div>
        </div>
      )}

      {step===2 && (
        <div style={s.card()}>
          <SH icon={MapPin} title="Step 2 — Pickup Details" color="#f59e0b"/>
          <div style={s.grid2}>
            {[['Pickup Location','location'],['Contact Person','contact'],['Pickup Date','date'],['Time Window','timeWindow']].map(([lbl,key])=>(
              <div key={key}>
                <div style={s.lbl({ marginBottom:4 })}>{lbl}</div>
                <input value={form.pickup[key]} onChange={e=>setF('pickup',{...form.pickup,[key]:e.target.value})} style={inpStyle}/>
              </div>
            ))}
          </div>
          <div style={{ marginTop:12 }}><Btn onClick={()=>setStep(3)} color="#f59e0b" sm={false}>Next: Delivery Details →</Btn></div>
        </div>
      )}

      {step===1 && (
        <div style={s.card()}>
          <SH icon={Truck} title="Step 1 — Shipment Type" color="#6366f1"/>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:14 }}>
            {['Full Truck Load','Part Truck Load','Container','Trailer','Open Truck','Special Vehicle'].map(t => (
              <div key={t} onClick={()=>setF('shipmentType',t)}
                style={{ padding:'14px 10px', borderRadius:8, border:`1px solid ${form.shipmentType===t?'rgba(99,102,241,0.5)':'rgba(255,255,255,0.08)'}`, background:form.shipmentType===t?'rgba(99,102,241,0.15)':'rgba(255,255,255,0.02)', cursor:'pointer', textAlign:'center' }}>
                <div style={{ fontSize:20, marginBottom:6 }}>🚛</div>
                <div style={{ fontSize:9, fontWeight:700, color:form.shipmentType===t?'#a5b4fc':'#9ca3af', textTransform:'uppercase' }}>{t}</div>
              </div>
            ))}
          </div>
          <Btn onClick={()=>setStep(2)} color="#6366f1" sm={false}>Next: Pickup Details →</Btn>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TAB 4 — LIVE OPERATIONS & TRACKING (§11, §12, §13)
// ============================================================
function TabLive({ showNotify }) {
  const [selVehicle, setSelVehicle] = useState(null);
  const [showReplay, setShowReplay] = useState(false);

  const vehicles = MOCK_SHIPMENTS.filter(s=>['IN_TRANSIT','DISPATCHED'].includes(s.status));

  // SVG India route map positions
  const nodes = [
    { id:'MUM', label:'Mumbai',    x:120, y:260, type:'depot' },
    { id:'PUN', label:'Pune',      x:130, y:290, type:'plant' },
    { id:'DEL', label:'Delhi',     x:240, y:130, type:'dc' },
    { id:'JAI', label:'Jaipur',    x:210, y:185, type:'wh' },
    { id:'KOL', label:'Kolkata',   x:430, y:230, type:'dc' },
    { id:'GUW', label:'Guwahati',  x:490, y:170, type:'plant' },
    { id:'CHE', label:'Chennai',   x:290, y:380, type:'dc' },
    { id:'HYD', label:'Hyderabad', x:290, y:310, type:'plant' },
  ];
  const routes = [
    { from:'MUM', to:'DEL', shpId:'SHP-8821', color:'#06b6d4', active:true, progress:0.45 },
    { from:'PUN', to:'HYD', shpId:'SHP-8822', color:'#ef4444', active:true, progress:0.62 },
  ];

  const getNode = id => nodes.find(n=>n.id===id);

  return (
    <div style={s.grid2}>
      {/* Map */}
      <div style={{ ...s.card(), gridRow:'span 2' }}>
        <SH icon={Map} title="Live Operations Map" color="#06b6d4">
          <div style={{ display:'flex', gap:6 }}>
            {[['🔵','In Transit'],['🔴','Delayed'],['🏭','Depot'],['⭕','Risk Zone']].map(([i,l])=>(
              <span key={l} style={{ fontSize:8, color:'#9ca3af' }}>{i} {l}</span>
            ))}
          </div>
        </SH>
        <svg viewBox="0 0 600 480" style={{ width:'100%', height:320, background:'rgba(0,0,0,0.3)', borderRadius:8 }}>
          {/* Grid lines */}
          {[0,1,2,3,4,5].map(i=><line key={i} x1={i*100} y1={0} x2={i*100} y2={480} stroke="rgba(255,255,255,0.03)" strokeWidth={1}/>)}
          {[0,1,2,3,4].map(i=><line key={i} x1={0} y1={i*100} x2={600} y2={i*100} stroke="rgba(255,255,255,0.03)" strokeWidth={1}/>)}

          {/* Routes */}
          {routes.map((r,i) => {
            const fn=getNode(r.from), tn=getNode(r.to);
            if(!fn||!tn) return null;
            const px = fn.x + (tn.x-fn.x)*r.progress;
            const py = fn.y + (tn.y-fn.y)*r.progress;
            return (
              <g key={i}>
                <line x1={fn.x*1.6} y1={fn.y*1.3} x2={tn.x*1.6} y2={tn.y*1.3} stroke={`${r.color}30`} strokeWidth={2} strokeDasharray="6,4"/>
                <line x1={fn.x*1.6} y1={fn.y*1.3} x2={px*1.6} y2={py*1.3} stroke={r.color} strokeWidth={2.5}/>
                <circle cx={px*1.6} cy={py*1.3} r={8} fill={r.color} opacity={0.9}/>
                <text x={px*1.6+10} y={py*1.3+4} fontSize={8} fill="#fff">{r.shpId}</text>
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map(n => (
            <g key={n.id}>
              <circle cx={n.x*1.6} cy={n.y*1.3} r={7} fill={n.type==='plant'?'#a855f7':n.type==='dc'?'#06b6d4':'#f59e0b'} opacity={0.8}/>
              <text x={n.x*1.6} y={n.y*1.3-12} textAnchor="middle" fontSize={9} fill="#e5e7eb" fontWeight="bold">{n.label}</text>
            </g>
          ))}

          {/* Risk Zone */}
          <ellipse cx={208} cy={377} rx={28} ry={18} fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.4)" strokeWidth={1.5} strokeDasharray="4,3"/>
          <text x={208} y={408} textAnchor="middle" fontSize={7} fill="#ef4444">NH4 Risk Zone</text>
          <text x={208} y={420} textAnchor="middle" fontSize={6} fill="#6b7280">Accident reported</text>

          {/* Toll icon */}
          <rect x={156} y={187} width={14} height={14} rx={3} fill="rgba(245,158,11,0.3)" stroke="rgba(245,158,11,0.5)" strokeWidth={1}/>
          <text x={163} y={198} textAnchor="middle" fontSize={7} fill="#fbbf24">₹</text>
        </svg>

        {/* Vehicle Cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:10 }}>
          {vehicles.map(v => (
            <div key={v.id} onClick={()=>setSelVehicle(v)} style={{ padding:'8px 10px', background:'rgba(255,255,255,0.03)', borderRadius:7, border:`1px solid ${v.status==='DELAYED'?'rgba(239,68,68,0.35)':'rgba(255,255,255,0.06)'}`, cursor:'pointer', display:'flex', gap:10, alignItems:'center' }}>
              <span style={{ fontSize:18 }}>🚛</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, fontWeight:700, color:'#e5e7eb' }}>{v.vehicle} · {v.id}</div>
                <div style={{ fontSize:8, color:'#9ca3af' }}>{v.route} · ETA: {v.eta}</div>
              </div>
              <StageChip status={v.status}/>
            </div>
          ))}
        </div>
      </div>

      {/* ETA Prediction Engine (§13) */}
      <div style={s.card()}>
        <SH icon={Cpu} title="ETA & Prediction Engine" color="#a855f7"/>
        {MOCK_SHIPMENTS.filter(s=>s.status==='IN_TRANSIT'||s.status==='DELAYED').map((shp,i) => (
          <div key={i} style={{ ...s.card({ padding:'10px', marginBottom:8 }), borderLeft:`3px solid ${shp.status==='DELAYED'?'#ef4444':'#06b6d4'}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:10, fontWeight:700, color:'#e5e7eb' }}>{shp.id} · {shp.route}</span>
              <span style={{ fontSize:11, fontWeight:900, color: shp.status==='DELAYED'?'#ef4444':'#10b981' }}>{shp.eta}</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, marginBottom:8 }}>
              <div style={{ textAlign:'center' }}><div style={{ fontSize:12, fontWeight:900, color: shp.status==='DELAYED'?'#ef4444':'#06b6d4' }}>{shp.status==='DELAYED'?'78%':'14%'}</div><div style={s.lbl()}>Delay Prob.</div></div>
              <div style={{ textAlign:'center' }}><div style={{ fontSize:12, fontWeight:900, color:'#10b981' }}>{shp.status==='DELAYED'?'31%':'91%'}</div><div style={s.lbl()}>SLA Prob.</div></div>
              <div style={{ textAlign:'center' }}><div style={{ fontSize:12, fontWeight:900, color:'#f59e0b' }}>{shp.status==='DELAYED'?'High':'Low'}</div><div style={s.lbl()}>Route Risk</div></div>
              <div style={{ textAlign:'center' }}><div style={{ fontSize:12, fontWeight:900, color:'#a855f7' }}>{shp.status==='DELAYED'?'62%':'94%'}</div><div style={s.lbl()}>Confidence</div></div>
            </div>
            {shp.status==='DELAYED' && (
              <div style={{ padding:'5px 8px', background:'rgba(239,68,68,0.06)', borderRadius:6, marginBottom:6 }}>
                <div style={s.lbl('#ef4444')}>Reason</div>
                <div style={{ fontSize:9, color:'#fca5a5' }}>NH4 accident near Satara causing +2.5h delay. Police clearance in progress.</div>
              </div>
            )}
            <div style={{ padding:'5px 8px', background:'rgba(99,102,241,0.06)', borderRadius:6 }}>
              <div style={s.lbl('#818cf8')}>AI Recommendation</div>
              <div style={{ fontSize:9, color:'#a5b4fc' }}>{shp.aiRec}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Trip Replay (§12) */}
      <div style={s.card()}>
        <SH icon={RotateCcw} title="Trip Replay — SHP-8821" color="#f59e0b">
          <Btn onClick={()=>setShowReplay(!showReplay)} color="#f59e0b">▶ Replay</Btn>
        </SH>
        {MOCK_SHIPMENTS[0].events.map((ev,i) => (
          <div key={i} style={{ display:'flex', gap:10, padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', cursor:'pointer' }}
            onClick={()=>{}}>
            <span style={{ fontSize:8, fontFamily:'monospace', color:'#6b7280', width:36, flexShrink:0 }}>{ev.time}</span>
            <div style={{ width:5, height:5, borderRadius:'50%', background:'#6366f1', marginTop:4, flexShrink:0 }}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:9, fontWeight:600, color:'#e5e7eb' }}>{ev.event}</div>
              <div style={{ fontSize:8, color:'#6b7280' }}>📍 {ev.location} · Type: {ev.type} · AI Involved: No</div>
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle Intelligence Drawer (§11) */}
      <Drawer title={`Vehicle Intelligence — ${selVehicle?.vehicle||''}`} open={!!selVehicle} onClose={()=>setSelVehicle(null)}>
        {selVehicle && (
          <div>
            <div style={{ ...s.card(), marginBottom:12, borderLeft:`3px solid ${selVehicle.status==='DELAYED'?'#ef4444':'#06b6d4'}` }}>
              <div style={s.grid2}>
                {[['Vehicle',selVehicle.vehicle],['Driver',selVehicle.driver],['Carrier',selVehicle.carrier],['Route',selVehicle.route],['Speed','68 km/h'],['Fuel Level','72%'],['Temperature','Ambient'],['GPS Quality','Strong (4/4)'],['Last Update','13:58:22'],['Route Deviation','None'],['Driving Behavior','Normal — 2 harsh braking'],['Trip Status',selVehicle.status]].map(([k,v])=>(
                  <div key={k}><div style={s.lbl()}>{k}</div><div style={{ fontSize:10, color:'#e5e7eb', marginTop:2 }}>{v}</div></div>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              <Btn onClick={()=>{emitCOS('RouteChanged',`Manual reroute triggered for ${selVehicle.vehicle}`);showNotify('Reroute event emitted');}} color="#f59e0b">Reroute</Btn>
              <Btn onClick={()=>{emitCOS('AgentActionTaken',`AI monitoring escalated for ${selVehicle.vehicle}`);}} color="#6366f1">Escalate to AI</Btn>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

// ============================================================
// TAB 5 — QUOTES & RATES (§16)
// ============================================================
function TabQuotes({ showNotify }) {
  const [filter, setFilter] = useState('All');
  const filtered = filter==='All' ? MOCK_QUOTES : MOCK_QUOTES.filter(q=>q.status===filter);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', gap:6 }}>
        {['All','Active','Accepted','Rejected','Negotiated'].map(f => (
          <button key={f} onClick={()=>setFilter(f)} style={{ padding:'5px 12px', borderRadius:99, border:'none', cursor:'pointer', fontSize:9, fontWeight:700, textTransform:'uppercase', background:filter===f?'rgba(99,102,241,0.25)':'rgba(255,255,255,0.05)', color:filter===f?'#a5b4fc':'#6b7280' }}>{f}</button>
        ))}
        <div style={{ marginLeft:'auto' }}><Btn onClick={()=>{emitCOS('ShipmentCreated','New quote request initiated');showNotify('Quote request created');}} color="#6366f1">+ New Quote Request</Btn></div>
      </div>

      {filtered.map(q => (
        <div key={q.id} style={s.card()}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
            <div>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                <span style={{ fontSize:12, fontWeight:800, color:'#e5e7eb' }}>{q.id}</span>
                <span style={s.pill(q.status==='Active'?'#10b981':q.status==='Accepted'?'#06b6d4':q.status==='Rejected'?'#ef4444':'#f59e0b')}>{q.status}</span>
              </div>
              <div style={{ fontSize:10, color:'#9ca3af' }}>🛣️ {q.lane} · {q.cargo} · {q.vehicleType}</div>
              <div style={{ fontSize:8, color:'#6b7280', marginTop:2 }}>Valid until: {q.validity} · Requested: {q.date}</div>
            </div>
          </div>
          {/* 4-Way Rate Comparison (§16) */}
          <div style={{ ...s.grid2, gap:8, marginBottom:10 }}>
            {[{l:'Contract Rate',v:q.contractRate,c:'#10b981',desc:'Per CF-9281'},{ l:'Spot Rate',v:q.spotRate,c:'#ef4444',desc:'Current market'},{l:'Previous Rate',v:q.prevRate,c:'#06b6d4',desc:'Last quarter avg'},{l:'AI Recommendation',v:q.aiRec,c:'#818cf8',desc:'Optimal for SLA+margin'}].map((r,i)=>(
              <div key={i} style={s.card({ padding:'10px', borderLeft:`3px solid ${r.c}` })}>
                <div style={s.lbl()}>{r.l}</div>
                <div style={{ fontSize:16, fontWeight:900, color:r.c, margin:'4px 0 2px' }}>{r.v}</div>
                <div style={{ fontSize:8, color:'#6b7280' }}>{r.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:6 }}>
            <Btn onClick={()=>{emitCOS('BookingConfirmed',`Quote ${q.id} accepted`);showNotify(`Quote ${q.id} accepted`);}} color="#10b981">Accept</Btn>
            <Btn onClick={()=>{emitCOS('ShipmentCreated',`Negotiation on ${q.id}`);showNotify('Negotiation started');}} color="#f59e0b">Negotiate</Btn>
            <Btn onClick={()=>{emitCOS('ShipmentCreated',`Quote ${q.id} rejected`);}} color="#ef4444" outline>Reject</Btn>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// TAB 6 — CONTRACTS & SLA (§17, §18)
// ============================================================
function TabContracts({ customer, showNotify }) {
  const [selSection, setSelSection] = useState('Commercial Terms');
  const CONTRACT_SECTIONS = ['Commercial Terms','Operational Terms','Pricing','SLA','Penalties','Exceptions','Documents','Performance','Renewal'];

  const slaTypes = [
    { type:'Pickup SLA', target:'2h', actual:'1.8h avg', met:true },
    { type:'Transit SLA', target:'28h', actual:'27.4h avg', met:true },
    { type:'POD SLA', target:'4h', actual:'6.2h avg', met:false },
    { type:'Invoice SLA', target:'24h', actual:'38h avg', met:false },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      {/* Contract Card */}
      <div style={s.card()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
          <div>
            <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
              <span style={{ fontSize:14, fontWeight:900, color:'#e5e7eb' }}>CF-9281</span>
              <span style={s.pill('#10b981')}>Active</span>
            </div>
            <div style={{ fontSize:9, color:'#9ca3af' }}>Tata Motors Logistics × GatiFleet | Pan-India Framework Contract</div>
            <div style={{ fontSize:8, color:'#6b7280', marginTop:2 }}>2026-01-01 → 2026-12-31 · Annual Value: ₹9.8 Cr</div>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            <Btn onClick={()=>{emitCOS('ContractRenewed','Renewal initiated CF-9281');showNotify('Renewal initiated');}} color="#10b981">Initiate Renewal</Btn>
            <Btn onClick={()=>{emitCOS('ContractRenewed','Amendment requested CF-9281');}} color="#f59e0b" outline>Request Amendment</Btn>
          </div>
        </div>
        {/* 9-Section Tabs */}
        <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:12 }}>
          {CONTRACT_SECTIONS.map(sec => (
            <button key={sec} onClick={()=>setSelSection(sec)}
              style={{ padding:'4px 10px', borderRadius:99, border:'none', cursor:'pointer', fontSize:8, fontWeight:700, textTransform:'uppercase', background:selSection===sec?'rgba(99,102,241,0.25)':'rgba(255,255,255,0.04)', color:selSection===sec?'#a5b4fc':'#6b7280' }}>
              {sec}
            </button>
          ))}
        </div>
        {selSection==='Commercial Terms' && (
          <div style={s.grid2}>
            {[['Rate Card','₹38–52/km by vehicle type & lane'],['Payment Terms','30 days from invoice date'],['Volume Commitment','3,000 MT/month minimum'],['Rate Escalation','CPI-linked, annual review'],['Currency','INR'],['Discount Structure','-3% volume, -1.5% prompt pay']].map(([k,v])=>(
              <div key={k}><div style={s.lbl()}>{k}</div><div style={{ fontSize:9, color:'#e5e7eb', marginTop:2 }}>{v}</div></div>
            ))}
          </div>
        )}
        {selSection==='Pricing' && (
          <div>
            {[['Mumbai → Delhi','Container 40FT','₹42/km'],['Pune → Bangalore','Car Carrier','₹38/km'],['Kolkata → Guwahati','Trailer 20W','₹44/km'],['Delhi → Jaipur','Open Body 14W','₹35/km'],['Chennai → Hyderabad','Container 20FT','₹40/km']].map(([lane,veh,rate])=>(
              <div key={lane} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <div><div style={{ fontSize:9, color:'#e5e7eb' }}>{lane}</div><div style={{ fontSize:8, color:'#6b7280' }}>{veh}</div></div>
                <span style={{ fontSize:11, fontWeight:800, color:'#06b6d4' }}>{rate}</span>
              </div>
            ))}
          </div>
        )}
        {selSection==='Penalties' && (
          <div>
            {[['Transit SLA Breach > 2h','5% of freight value'],['POD Delay > 24h','₹2,500 flat per case'],['Temperature Violation (Reefer)','Full cargo value (insurance claim)'],['Vehicle No-Show','₹8,000 per incident'],['Invoice Error Rate > 2%','₹5,000 per month above threshold']].map(([clause,penalty])=>(
              <div key={clause} style={{ padding:'7px 10px', background:'rgba(239,68,68,0.04)', borderRadius:6, marginBottom:6, fontFamily:'monospace', fontSize:9 }}>
                <span style={{ color:'#fca5a5' }}>IF {clause} THEN Penalty({penalty})</span>
              </div>
            ))}
          </div>
        )}
        {selSection==='SLA' && (
          <div>
            {slaTypes.map((sla,i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 10px', background:'rgba(255,255,255,0.02)', borderRadius:7, marginBottom:6 }}>
                <div><div style={{ fontSize:10, fontWeight:700, color:'#e5e7eb' }}>{sla.type}</div><div style={{ fontSize:8, color:'#6b7280' }}>Target: {sla.target}</div></div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:11, fontWeight:800, color:sla.met?'#10b981':'#ef4444' }}>{sla.actual}</div>
                  <div style={{ fontSize:8, color:sla.met?'#10b981':'#ef4444' }}>{sla.met?'✓ Met':'✗ Breached'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!['Commercial Terms','Pricing','Penalties','SLA'].includes(selSection) && (
          <div style={{ fontSize:9, color:'#6b7280', fontStyle:'italic', padding:'10px 0' }}>
            {selSection} data loaded from contract CF-9281. Click to expand individual clauses.
          </div>
        )}
      </div>

      {/* SLA Violation Cascade (§18) */}
      {slaTypes.filter(s=>!s.met).length>0 && (
        <div style={{ ...s.card(), borderColor:'rgba(239,68,68,0.25)' }}>
          <SH icon={AlertTriangle} title="SLA Breach — 7-Step Response Cascade (§18)" color="#ef4444"/>
          {['Calculate financial impact','Check contract clause 8.2','Create incident ticket','Notify stakeholders','Generate remediation plan','Calculate financial exposure','Update customer health score'].map((step,i) => (
            <div key={i} style={{ display:'flex', gap:10, padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', alignItems:'center' }}>
              <div style={{ width:18, height:18, borderRadius:'50%', background:i<4?'rgba(16,185,129,0.2)':'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, fontWeight:700, color:i<4?'#10b981':'#4b5563', flexShrink:0 }}>{i<4?'✓':i+1}</div>
              <span style={{ fontSize:9, color:i<4?'#10b981':'#9ca3af' }}>{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// TAB 7 — DOCUMENTS & POD (§19, §20)
// ============================================================
function TabDocuments({ showNotify }) {
  const [filter, setFilter] = useState('All');
  const [podState, setPodState] = useState({ stage:'idle', confidence:0, fields:{} });

  const filtered = filter==='All' ? MOCK_DOCUMENTS : MOCK_DOCUMENTS.filter(d=>d.type===filter);

  const runPOD = () => {
    setPodState({ stage:'uploading', confidence:0, fields:{} });
    setTimeout(()=>setPodState({ stage:'extracting', confidence:0, fields:{} }),800);
    setTimeout(()=>setPodState({ stage:'verifying', confidence:72, fields:{ type:'POD', number:'POD-8819', date:'2026-08-13', receiver:'Raju Sharma', signature:true, location:'Jaipur WH Gate', shipment:'SHP-8819' } }),1800);
    setTimeout(()=>{
      setPodState({ stage:'complete', confidence:97, fields:{ type:'POD', number:'POD-8819', date:'2026-08-13', receiver:'Raju Sharma', signature:true, location:'Jaipur WH Gate', shipment:'SHP-8819' } });
      emitCOS('PODVerified','SHP-8819 POD verified — billing eligibility confirmed');
      showNotify('✓ POD Verified — Invoice workflow triggered');
    },2800);
  };

  return (
    <div style={s.grid2}>
      {/* Document Library */}
      <div>
        <SH icon={Package} title="Document Library" color="#06b6d4">
          <div style={{ display:'flex', gap:4 }}>
            {['All','POD','Invoice','LR','E-Way Bill','Contract'].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{ padding:'3px 8px', borderRadius:99, border:'none', cursor:'pointer', fontSize:8, fontWeight:700, background:filter===f?'rgba(99,102,241,0.25)':'rgba(255,255,255,0.05)', color:filter===f?'#a5b4fc':'#6b7280' }}>{f}</button>
            ))}
          </div>
        </SH>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {filtered.map(doc => (
            <div key={doc.id} style={{ padding:'9px 10px', background:'rgba(255,255,255,0.02)', borderRadius:8, border:'1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                <div>
                  <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                    <span style={{ fontSize:10, fontWeight:700, color:'#e5e7eb' }}>{doc.number}</span>
                    <span style={s.pill(doc.type==='POD'?'#10b981':doc.type==='Invoice'?'#06b6d4':'#6b7280')}>{doc.type}</span>
                    <span style={s.pill(doc.status==='Verified'||doc.status==='Valid'||doc.status==='Active'?'#10b981':doc.status==='Filed'?'#06b6d4':'#6b7280')}>{doc.status}</span>
                  </div>
                  <div style={{ fontSize:8, color:'#6b7280', marginTop:2 }}>Conf: {doc.confidence}% · {doc.date}{doc.expiry?` · Exp: ${doc.expiry}`:''}{doc.shipmentId?` · ${doc.shipmentId}`:''}</div>
                </div>
                <Btn onClick={()=>{emitCOS('PODUploaded',`Document ${doc.id} downloaded`);showNotify('Downloaded');}} color="#6b7280" outline>↓</Btn>
              </div>
              {doc.amount && <div style={{ fontSize:9, color:'#9ca3af' }}>Amount: {doc.amount}{doc.gst?` · GST: ${doc.gst}`:''}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* POD Verification Pipeline (§20) */}
      <div style={s.card()}>
        <SH icon={ShieldCheck} title="POD Verification Pipeline" color="#10b981"/>
        {podState.stage==='idle' && (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <Upload size={36} color="#6b7280" style={{ margin:'0 auto 12px' }}/>
            <div style={{ fontSize:10, color:'#9ca3af', marginBottom:12 }}>Upload POD to begin AI verification</div>
            <Btn onClick={runPOD} color="#10b981" sm={false}>Upload & Verify POD</Btn>
          </div>
        )}
        {['uploading','extracting','verifying'].includes(podState.stage) && (
          <div>
            {['Upload','OCR/Vision Extract','Verify Fields','Human Review (if needed)','Mark POD Verified'].map((step,i) => {
              const stageIdx = { uploading:0, extracting:1, verifying:2, complete:4 }[podState.stage]||0;
              return (
                <div key={i} style={{ display:'flex', gap:10, padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', alignItems:'center' }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', background:i<stageIdx?'rgba(16,185,129,0.2)':i===stageIdx?'rgba(99,102,241,0.2)':'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:i<stageIdx?'#10b981':i===stageIdx?'#818cf8':'#4b5563', flexShrink:0 }}>
                    {i<stageIdx?'✓':i===stageIdx?'⟳':i+1}
                  </div>
                  <span style={{ fontSize:9, color:i===stageIdx?'#818cf8':i<stageIdx?'#10b981':'#6b7280' }}>{step}</span>
                </div>
              );
            })}
          </div>
        )}
        {podState.stage==='complete' && (
          <div>
            <div style={{ padding:'10px', background:'rgba(16,185,129,0.06)', borderRadius:8, border:'1px solid rgba(16,185,129,0.2)', marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <span style={{ fontSize:11, fontWeight:800, color:'#10b981' }}>✓ POD Verified</span>
                <span style={s.pill('#10b981')}>Confidence: {podState.confidence}%</span>
              </div>
              {/* 11 AI-extracted fields */}
              <div style={s.grid2}>
                {[['Document Type',podState.fields.type],['Number',podState.fields.number],['Date',podState.fields.date],['Receiver',podState.fields.receiver],['Signature',podState.fields.signature?'✓ Present':'✗ Missing'],['Location',podState.fields.location],['Shipment',podState.fields.shipment],['GST','₹2.23 L'],['Amount','₹12.4 L'],['Vehicle','HR-26-EF-9901'],['Expiry','N/A — one-time doc']].map(([k,v])=>(
                  <div key={k}><div style={s.lbl()}>{k}</div><div style={{ fontSize:9, color:'#e5e7eb', marginTop:2 }}>{v}</div></div>
                ))}
              </div>
            </div>
            <div style={{ padding:'7px 10px', background:'rgba(99,102,241,0.06)', borderRadius:7 }}>
              <div style={s.lbl('#818cf8')}>Downstream chain triggered (§20)</div>
              <div style={{ fontSize:8, color:'#a5b4fc', marginTop:3 }}>POD Verified → Delivery Complete → Billing Eligible → Invoice workflow started → Finance notified</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// TAB 8 — FINANCE & BILLING (§21, §22, §23, §24)
// ============================================================
function TabFinance({ customer, showNotify, initFilter }) {
  const [view, setView] = useState(initFilter||'overview');
  const [expandedInv, setExpandedInv] = useState(null);
  const [disputeForm, setDisputeForm] = useState({ reason:'', evidence:'' });
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [payStep, setPayStep] = useState(0);

  const buckets = [
    { label:'Unbilled',      value:'₹38 L',  count:2, color:'#6b7280' },
    { label:'Draft',         value:'₹14 L',  count:1, color:'#3b82f6' },
    { label:'Approval Queue', value:'₹24 L', count:2, color:'#f59e0b' },
    { label:'Sent',          value:'₹18.4 L', count:1, color:'#8b5cf6' },
    { label:'Paid',          value:'₹82 L',  count:6, color:'#10b981' },
    { label:'Overdue',       value:'₹9.8 L', count:1, color:'#ef4444' },
    { label:'Disputed',      value:'₹14.2 L', count:1, color:'#f97316' },
  ];

  const invoiceLines = [
    { item:'Base Freight (Delhi→Jaipur, 282km)', amount:'₹9,876', src:'Contract CF-9281', baseline:'₹35/km', ref:'₹35/km', formula:'282km × ₹35/km' },
    { item:'Fuel Surcharge (+5.5% diesel delta)', amount:'₹1,190', src:'Contract CF-9281 §4.2', baseline:'₹91/L', ref:'₹96/L', formula:'Base × 8% × (96-91)/91' },
    { item:'Toll NH8 (3 plazas)', amount:'₹688', src:'NHAI FASTag log', baseline:'₹228/plaza avg', ref:'Live FASTag data', formula:'3 × ₹228 actual' },
    { item:'Loading Charges', amount:'₹1,800', src:'Contract Schedule B', baseline:'₹1,800 flat', ref:'Schedule B', formula:'Flat rate per shipment' },
    { item:'Unloading Charges', amount:'₹1,800', src:'Contract Schedule B', baseline:'₹1,800 flat', ref:'Schedule B', formula:'Flat rate per shipment' },
    { item:'Volume Discount (-3%)', amount:'-₹459', src:'Contract CF-9281 §6.1', baseline:'3% of base', ref:'3% volume tier', formula:'Base × -3%' },
    { item:'GST (18%)', amount:'₹2,682', src:'GST Act §9 — transport services', baseline:'18% on taxable', ref:'GSTN', formula:'Taxable × 18%' },
  ];

  const runPayment = () => {
    setPayStep(1);
    const steps = [1,2,3,4,5,6,7,8];
    steps.forEach((s,i) => setTimeout(()=>{
      setPayStep(s);
      if(s===8){emitCOS('PaymentReceived','Payment INV-4822 processed');showNotify('✓ Payment processed');}
    },(i+1)*300));
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      {/* Billing Pipeline (§21) */}
      <div style={s.card()}>
        <SH icon={Activity} title="Billing Pipeline: Shipment → POD → Billing Engine" color="#06b6d4"/>
        <div style={{ display:'flex', gap:0, alignItems:'center', overflowX:'auto' }}>
          {['Shipment Delivered','POD Uploaded','POD Verified','Billing Engine','Rate Applied','Tax Calculated','Invoice Drafted','Approval','Invoice Sent','Payment'].map((st,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
              <div style={{ padding:'4px 8px', borderRadius:6, background:i<7?'rgba(16,185,129,0.1)':'rgba(255,255,255,0.04)', border:`1px solid ${i<7?'rgba(16,185,129,0.25)':'rgba(255,255,255,0.08)'}`, fontSize:8, fontWeight:700, color:i<7?'#10b981':'#4b5563', textAlign:'center', whiteSpace:'nowrap' }}>
                {i<7?'✓ ':''}{st}
              </div>
              {i<9 && <ChevronRight size={10} color="#4b5563"/>}
            </div>
          ))}
        </div>
      </div>

      {/* Buckets */}
      <div style={{ display:'flex', gap:8, overflowX:'auto' }}>
        {buckets.map(b => (
          <div key={b.label} onClick={()=>setView(b.label.toLowerCase().replace(' ','_'))}
            style={{ ...s.card({ padding:'10px 14px', cursor:'pointer', flexShrink:0, borderLeft:`3px solid ${b.color}` }) }}>
            <div style={{ fontSize:8, color:'#9ca3af', textTransform:'uppercase', marginBottom:4 }}>{b.label}</div>
            <div style={{ fontSize:16, fontWeight:900, color:b.color }}>{b.value}</div>
            <div style={{ fontSize:8, color:'#6b7280', marginTop:2 }}>{b.count} invoices</div>
          </div>
        ))}
      </div>

      {/* Invoice Lines with Drill-down (§22) */}
      <div style={s.card()}>
        <SH icon={Receipt} title="Invoice INV-4819 — Line Item Detail" color="#06b6d4">
          <div style={{ display:'flex', gap:6 }}>
            <Btn onClick={()=>setDisputeOpen(true)} color="#ef4444" outline>Dispute</Btn>
            <Btn onClick={runPayment} color="#10b981">Pay Now</Btn>
          </div>
        </SH>
        {invoiceLines.map((line,i) => (
          <div key={i}>
            <div onClick={()=>setExpandedInv(expandedInv===i?null:i)}
              style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', cursor:'pointer' }}>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <ChevronRight size={10} color="#6b7280" style={{ transform:expandedInv===i?'rotate(90deg)':'none', transition:'transform 0.15s' }}/>
                <span style={{ fontSize:9, color:'#e5e7eb' }}>{line.item}</span>
              </div>
              <span style={{ fontSize:10, fontWeight:700, color:line.amount.startsWith('-')?'#10b981':'#f9fafb' }}>{line.amount}</span>
            </div>
            {expandedInv===i && (
              <div style={{ padding:'8px 18px', background:'rgba(99,102,241,0.04)', borderRadius:6, marginBottom:4 }}>
                <div style={s.grid2}>
                  {[['Source',line.src],['Baseline',line.baseline],['Reference Price',line.ref],['Formula',line.formula]].map(([k,v])=>(
                    <div key={k}><div style={s.lbl()}>{k}</div><div style={{ fontSize:9, color:'#9ca3af', marginTop:2, fontFamily:'monospace' }}>{v}</div></div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        <div style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderTop:'1px solid rgba(255,255,255,0.1)', marginTop:4 }}>
          <span style={{ fontSize:11, fontWeight:700, color:'#f9fafb' }}>Invoice Total</span>
          <span style={{ fontSize:14, fontWeight:900, color:'#10b981' }}>₹17,577</span>
        </div>
      </div>

      {/* Payment Pipeline (§24) */}
      {payStep>0 && (
        <div style={s.card()}>
          <SH icon={CreditCard} title="Payment Processing Pipeline" color="#10b981"/>
          {['Invoice selected','Payment initiated by customer','Payment provider gateway','Provider verification','Ledger update','Invoice status → Paid','Customer notification','Audit event written'].map((st,i) => (
            <div key={i} style={{ display:'flex', gap:10, padding:'4px 0', alignItems:'center' }}>
              <div style={{ width:16, height:16, borderRadius:'50%', background:i<payStep?'rgba(16,185,129,0.2)':'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, color:i<payStep?'#10b981':'#4b5563', flexShrink:0 }}>{i<payStep?'✓':i+1}</div>
              <span style={{ fontSize:9, color:i<payStep?'#10b981':'#6b7280' }}>{st}</span>
            </div>
          ))}
          {payStep===8 && <div style={{ fontSize:9, color:'#ef4444', marginTop:8, fontStyle:'italic' }}>* Invoice marked Paid only after ledger verification — not on frontend action alone (§24)</div>}
        </div>
      )}

      {/* Dispute Drawer (§23) */}
      <Drawer title="Dispute Invoice" open={disputeOpen} onClose={()=>setDisputeOpen(false)}>
        <div>
          <SH icon={AlertTriangle} title="8-Step Dispute Pipeline (§23)" color="#ef4444"/>
          <div style={{ marginBottom:12 }}>
            {['File dispute','AI classification','Contract verification','Evidence verification','Finance review','Resolution decision','Adjustment if approved','Audit event'].map((st,i)=>(
              <div key={i} style={{ display:'flex', gap:8, padding:'4px 0', alignItems:'center' }}>
                <div style={{ width:16, height:16, borderRadius:'50%', background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, color:'#4b5563' }}>{i+1}</div>
                <span style={{ fontSize:9, color:'#9ca3af' }}>{st}</span>
              </div>
            ))}
          </div>
          <div style={{ marginBottom:10 }}>
            <div style={s.lbl({ marginBottom:4 })}>Dispute Reason</div>
            <select value={disputeForm.reason} onChange={e=>setDisputeForm(p=>({...p,reason:e.target.value}))}
              style={{ width:'100%', padding:'7px 10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'#e5e7eb', fontSize:10, outline:'none' }}>
              <option value="">Select reason...</option>
              {['Wrong rate','Duplicate invoice','Missing POD','Incorrect tax','Incorrect quantity','SLA penalty dispute','Unauthorized charge','Other'].map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
          <div style={{ marginBottom:10 }}>
            <div style={s.lbl({ marginBottom:4 })}>Evidence / Description</div>
            <textarea value={disputeForm.evidence} onChange={e=>setDisputeForm(p=>({...p,evidence:e.target.value}))}
              placeholder="Describe the dispute and upload evidence..." rows={3}
              style={{ width:'100%', padding:'7px 10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'#e5e7eb', fontSize:10, outline:'none', resize:'vertical', boxSizing:'border-box' }}/>
          </div>
          <div style={{ marginBottom:10 }}>
            <div style={s.lbl({ marginBottom:4 })}>Upload Evidence</div>
            <div style={{ padding:'12px', border:'1px dashed rgba(255,255,255,0.15)', borderRadius:6, textAlign:'center', color:'#6b7280', fontSize:9 }}>
              📎 Click to upload documents or drag & drop
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, padding:'8px', background:'rgba(239,68,68,0.05)', borderRadius:7, marginBottom:12 }}>
            {[['Dispute Amount','₹3,240'],['Status','Pending'],['Assigned Team','Finance — Dispute Desk'],['Expected Resolution','3 business days']].map(([k,v])=>(
              <div key={k}><div style={s.lbl()}>{k}</div><div style={{ fontSize:9, color:'#e5e7eb', marginTop:2 }}>{v}</div></div>
            ))}
          </div>
          <Btn onClick={()=>{emitCOS('InvoiceGenerated','Dispute filed INV-4819');showNotify('Dispute filed — AI classification started');setDisputeOpen(false);}} color="#ef4444" sm={false}>Submit Dispute</Btn>
        </div>
      </Drawer>
    </div>
  );
}

// ============================================================
// MAIN CUSTOMER OPERATING SYSTEM COMPONENT
// ============================================================
export default function CustomerOperatingSystem({ customer }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [notification, setNotification] = useState(null);
  const [tabFilter, setTabFilter] = useState({});

  const showNotify = useCallback((msg, type='success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  const navigateTo = useCallback((tab, filter=null) => {
    setActiveTab(tab);
    if (filter) setTabFilter(p=>({...p,[tab]:filter}));
  }, []);

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':    return <TabOverview customer={customer} navigateTo={navigateTo} showNotify={showNotify}/>;
      case 'shipments':   return <TabShipments customer={customer} showNotify={showNotify} initFilter={tabFilter.shipments}/>;
      case 'book':        return <TabBook customer={customer} showNotify={showNotify}/>;
      case 'live':        return <TabLive showNotify={showNotify}/>;
      case 'quotes':      return <TabQuotes showNotify={showNotify}/>;
      case 'contracts':   return <TabContracts customer={customer} showNotify={showNotify}/>;
      case 'documents':   return <TabDocuments showNotify={showNotify}/>;
      case 'finance':     return <TabFinance customer={customer} showNotify={showNotify} initFilter={tabFilter.finance}/>;
      case 'claims':      return <TabClaims showNotify={showNotify} initFilter={tabFilter.claims}/>;
      case 'support':     return <TabSupport customer={customer} showNotify={showNotify}/>;
      case 'analytics':   return <TabAnalytics/>;
      case 'ai':          return <TabAI customer={customer} showNotify={showNotify}/>;
      case 'network':     return <TabNetwork/>;
      case 'twin':        return <TabTwin showNotify={showNotify}/>;
      case 'admin':       return <TabAdmin showNotify={showNotify}/>;
      case 'integrations': return <TabIntegrations showNotify={showNotify}/>;
      default: return null;
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      {/* Notification Toast */}
      <AnimatePresence>{notification && <Notification msg={notification.msg} type={notification.type}/>}</AnimatePresence>

      {/* 16-Tab Bar */}
      <div style={{ display:'flex', gap:2, padding:'6px 0 0', borderBottom:'1px solid var(--border-default)', overflowX:'auto', background:'var(--bg-800)', flexShrink:0 }}>
        {COS_TABS.map(t => {
          const isActive = activeTab===t.id;
          const Icon = t.icon;
          const urgentBadge = t.id==='claims'&&MOCK_EXCEPTIONS.filter(e=>e.severity==='High').length;
          return (
            <button key={t.id} onClick={()=>setActiveTab(t.id)}
              style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 10px', borderRadius:'6px 6px 0 0', border:`1px solid ${isActive?'var(--border-default)':'transparent'}`, borderBottom:isActive?'1px solid var(--surface-solid)':'none', cursor:'pointer', background:isActive?'var(--surface-solid)':'transparent', color:isActive?'#4f46e5':'var(--text-muted)', fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap', transition:'all 0.15s', flexShrink:0 }}>
              <Icon size={10}/>{t.label}
              {urgentBadge>0&&<span style={{ ...s.pill('#ef4444','rgba(239,68,68,0.15)'), marginLeft:2 }}>{urgentBadge}</span>}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-6}} transition={{duration:0.16}}>
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---- PLACEHOLDER IMPORTS for tabs 9-16 (defined in Part 2) ----
// These are imported from CustomerOperatingSystem_P2.jsx and re-exported
import { TabClaims, TabSupport, TabAnalytics, TabAI, TabNetwork, TabTwin, TabAdmin, TabIntegrations } from './CustomerOperatingSystem_P2';
