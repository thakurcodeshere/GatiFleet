/* eslint-disable */
// ============================================================
// GatiFleet — Customer Operating System — Part 2
// Tabs 9–16: Claims, Support, Analytics, AI, Network, Twin, Admin, Integrations
// ============================================================

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, MessageSquare, BarChart3, Sparkles, Network, Brain, Settings, Link2,
  CheckCircle, X, Search, Filter, ChevronRight, ChevronDown, Clock, TrendingUp, TrendingDown,
  Upload, Download, Send, RefreshCw, Eye, Zap, Target, Globe, Activity, Users,
  Building, CreditCard, Receipt, ShieldCheck, Bot, Play, RotateCcw, Info, Star,
  Award, Cpu, GitBranch, MapPin, Phone, Mail, Bell, Lock, Key, Webhook, Database,
  Shield, Package, IndianRupee, Plus, Map, LayoutDashboard, Truck, Leaf,
  FileText, AlertCircle, Home, Factory, Warehouse, User
} from 'lucide-react';
import { RealityEngine } from '../../data/RealityEngine';
import {
  MOCK_EXCEPTIONS, MOCK_CLAIMS, ANALYTICS_DATA, AI_AGENTS, NETWORK_LOCATIONS,
  SIMULATION_SCENARIOS, SELF_EVOLUTION_STEPS, KGW_CASE_STUDY, INTEGRATIONS,
  CUSTOMER_ROLES, PERMISSION_TYPES, NOTIFICATION_EVENTS, AUTONOMY_LEVELS,
  ORG_HIERARCHY, formatINR, calculateFreightCost
} from '../../data/customerOSData';

// ---- SHARED STYLE HELPERS ----
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

const emitCOS = (type, desc) => {
  RealityEngine.events = [{ id:`ev-${Date.now()}`, timestamp:new Date().toISOString(), type, desc, source:'COS/CUSTOMER' }, ...(RealityEngine.events||[])];
  RealityEngine.notify?.();
};

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

function MiniChart({ data, color='#6366f1', height=60, label }) {
  if(!data||!data.length) return null;
  const vals = data.map(d=>d.value||d.otd||d.spend||d.pct||0);
  const max = Math.max(...vals)||1;
  const min = Math.min(...vals)||0;
  const w=240, h=height;
  const pts = vals.map((v,i)=>`${(i/(vals.length-1))*w},${h-((v-min)/(max-min||1))*(h-8)+4}`).join(' ');
  return (
    <div>
      {label&&<div style={{ ...s.lbl(), marginBottom:4 }}>{label}</div>}
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width:'100%', height }}>
        <defs>
          <linearGradient id={`g${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="100%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#g${color.replace('#','')})`}/>
        <polyline points={pts} fill="none" stroke={color} strokeWidth={2}/>
        {data.map((d,i) => (
          <text key={i} x={(i/(vals.length-1))*w} y={h} textAnchor="middle" fontSize={7} fill="#6b7280">
            {d.month||d.lane||''}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ============================================================
// TAB 9 — CLAIMS & EXCEPTIONS (§14, §15, §25)
// ============================================================
export function TabClaims({ showNotify, initFilter }) {
  const [view, setView] = useState(initFilter==='exceptions'?'exceptions':'claims');
  const [selExc, setSelExc] = useState(null);
  const [selClaim, setSelClaim] = useState(null);
  const [claimForm, setClaimForm] = useState({ type:'', description:'', evidence:'' });
  const [claimOpen, setClaimOpen] = useState(false);

  const SEV_COLORS = { High:'#ef4444', Medium:'#f59e0b', Low:'#06b6d4', Critical:'#dc2626' };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', gap:6 }}>
        <button onClick={()=>setView('exceptions')} style={{ padding:'6px 14px', borderRadius:99, border:'none', cursor:'pointer', fontSize:10, fontWeight:700, background:view==='exceptions'?'rgba(239,68,68,0.25)':'rgba(255,255,255,0.05)', color:view==='exceptions'?'#fca5a5':'#6b7280' }}>Exception Center ({MOCK_EXCEPTIONS.length})</button>
        <button onClick={()=>setView('claims')} style={{ padding:'6px 14px', borderRadius:99, border:'none', cursor:'pointer', fontSize:10, fontWeight:700, background:view==='claims'?'rgba(99,102,241,0.25)':'rgba(255,255,255,0.05)', color:view==='claims'?'#a5b4fc':'#6b7280' }}>Claims ({MOCK_CLAIMS.length})</button>
        <div style={{ marginLeft:'auto' }}><Btn onClick={()=>setClaimOpen(true)} color="#ef4444">+ File New Claim</Btn></div>
      </div>

      {view==='exceptions' && (
        <div>
          {/* Auto-detection categories (§14) */}
          <div style={{ ...s.card({ marginBottom:14 }), borderColor:'rgba(239,68,68,0.2)' }}>
            <SH icon={Zap} title="Auto-Detected Exception Types" color="#ef4444"/>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {['Traffic Delay','Breakdown','Route Deviation','Weather Alert','Driver Issue','Warehouse Delay','Customer Delay','Documentation Problem','GPS Failure','Sensor Failure','SLA Risk'].map(t=>(
                <span key={t} style={s.pill(MOCK_EXCEPTIONS.some(e=>e.type===t)?'#ef4444':'#6b7280')}>{t}</span>
              ))}
            </div>
          </div>

          {MOCK_EXCEPTIONS.map(exc => (
            <div key={exc.id} style={{ ...s.card({ marginBottom:10 }), borderLeft:`3px solid ${SEV_COLORS[exc.severity]||'#6b7280'}`, borderColor:`${SEV_COLORS[exc.severity]}35` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <div>
                  <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                    <span style={{ fontSize:12, fontWeight:800, color:'#e5e7eb' }}>{exc.id}</span>
                    <span style={s.pill(SEV_COLORS[exc.severity]||'#6b7280')}>{exc.severity} Severity</span>
                    <span style={s.pill('#06b6d4')}>{exc.type}</span>
                  </div>
                  <div style={{ fontSize:9, color:'#6b7280' }}>Detected: {exc.detected} · Shipment: {exc.shipmentId}</div>
                </div>
              </div>

              <div style={s.grid2}>
                <div style={s.card({ padding:'8px', background:'rgba(239,68,68,0.04)' })}>
                  <div style={s.lbl('#ef4444')}>What happened?</div>
                  <div style={{ fontSize:9, color:'#e5e7eb', marginTop:4 }}>{exc.what}</div>
                </div>
                <div style={s.card({ padding:'8px', background:'rgba(245,158,11,0.04)' })}>
                  <div style={s.lbl('#f59e0b')}>Why?</div>
                  <div style={{ fontSize:9, color:'#e5e7eb', marginTop:4 }}>{exc.why}</div>
                </div>
                <div style={s.card({ padding:'8px', background:'rgba(6,182,212,0.04)' })}>
                  <div style={s.lbl('#06b6d4')}>What happens next?</div>
                  <div style={{ fontSize:9, color:'#e5e7eb', marginTop:4 }}>{exc.next}</div>
                </div>
                <div style={s.card({ padding:'8px', background:'rgba(168,85,247,0.04)' })}>
                  <div style={s.lbl('#a855f7')}>What will it cost?</div>
                  <div style={{ fontSize:9, color:'#e5e7eb', marginTop:4 }}>{exc.cost}</div>
                </div>
              </div>

              {/* AI Resolution Options (§15) */}
              <div style={{ marginTop:10 }}>
                <SH icon={Sparkles} title="AI Resolution Options" color="#818cf8">
                  {exc.autonomyPolicyGate && <span style={s.pill('#f59e0b')}>Policy gate: {exc.autonomyPolicyGate}</span>}
                </SH>
                <div style={s.grid3}>
                  {exc.options.map((opt,i) => (
                    <div key={i} style={{ padding:'8px', background:'rgba(99,102,241,0.04)', borderRadius:8, border:'1px solid rgba(99,102,241,0.12)' }}>
                      <div style={{ fontSize:10, fontWeight:700, color:'#e5e7eb', marginBottom:6 }}>Option {String.fromCharCode(65+i)}</div>
                      <div style={{ fontSize:9, color:'#9ca3af', marginBottom:6 }}>{opt.label}</div>
                      <div style={s.grid2}>
                        {[['ETA',opt.etaDelta],['Cost',opt.addCost],['Conf',`${opt.confidence}%`]].map(([k,v])=>(
                          <div key={k}><div style={s.lbl()}>{k}</div><div style={{ fontSize:9, color:'#e5e7eb' }}>{v}</div></div>
                        ))}
                      </div>
                      <div style={{ display:'flex', gap:4, marginTop:8 }}>
                        <Btn onClick={()=>{
                          if(exc.autonomyPolicyGate){
                            emitCOS('AgentActionTaken',`Policy gate checked: ${exc.autonomyPolicyGate} — approved. Option ${String.fromCharCode(65+i)} executed on ${exc.shipmentId}`);
                            showNotify(`✓ Policy approved — Option ${String.fromCharCode(65+i)} executing`);
                          } else {
                            emitCOS('AgentActionTaken',`Option ${String.fromCharCode(65+i)} approved for ${exc.shipmentId}`);
                            showNotify(`Option ${String.fromCharCode(65+i)} approved`);
                          }
                        }} color="#10b981">Approve</Btn>
                        <Btn onClick={()=>{emitCOS('AgentActionTaken',`Option ${String.fromCharCode(65+i)} delegated to AI`);showNotify('Delegated to AI');}} color="#818cf8" outline>Delegate AI</Btn>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize:8, color:'#4b5563', marginTop:6, fontStyle:'italic' }}>
                  ⚠ AI cannot autonomously execute unless autonomy policy permits for this action category (§15).
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view==='claims' && (
        <div>
          {/* Claim Types (§25) */}
          <div style={{ ...s.card({ marginBottom:14 }) }}>
            <SH icon={AlertTriangle} title="Claim Types" color="#f59e0b"/>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {['Damage','Loss','Shortage','Theft','Delay','Temperature Violation'].map(t=>(
                <span key={t} style={s.pill(MOCK_CLAIMS.some(c=>c.type===t)?'#f59e0b':'#6b7280')}>{t}</span>
              ))}
            </div>
          </div>

          {MOCK_CLAIMS.map(claim => (
            <div key={claim.id} style={{ ...s.card({ marginBottom:10 }) }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <div>
                  <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                    <span style={{ fontSize:12, fontWeight:800, color:'#e5e7eb' }}>{claim.id}</span>
                    <span style={s.pill('#f59e0b')}>{claim.type}</span>
                    <span style={s.pill(claim.status==='Approved'?'#10b981':claim.status==='Under Review'?'#06b6d4':'#6b7280')}>{claim.status}</span>
                  </div>
                  <div style={{ fontSize:9, color:'#6b7280' }}>Shipment: {claim.shipmentId} · Filed: {claim.date} · Amount: <span style={{ color:'#f9fafb', fontWeight:700 }}>{claim.amount}</span></div>
                </div>
              </div>
              <div style={{ fontSize:9, color:'#9ca3af', marginBottom:10 }}>{claim.reason}</div>

              {/* 9-Step Claim Pipeline (§25) */}
              <div style={{ display:'flex', gap:0, overflowX:'auto', marginBottom:10 }}>
                {claim.stages.map((st,i) => {
                  const done = i<claim.stage; const curr = i===claim.stage;
                  return (
                    <div key={i} style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
                      <div style={{ padding:'3px 8px', borderRadius:4, background: done?'rgba(16,185,129,0.1)':curr?'rgba(99,102,241,0.15)':'rgba(255,255,255,0.03)', border:`1px solid ${done?'rgba(16,185,129,0.3)':curr?'rgba(99,102,241,0.4)':'rgba(255,255,255,0.06)'}`, fontSize:8, fontWeight:700, color:done?'#10b981':curr?'#a5b4fc':'#4b5563', whiteSpace:'nowrap' }}>
                        {done?'✓ ':curr?'▶ ':''}{st}
                      </div>
                      {i<claim.stages.length-1&&<ChevronRight size={8} color="#4b5563"/>}
                    </div>
                  );
                })}
              </div>

              <div style={s.grid2}>
                <div><div style={s.lbl()}>AI Classification</div><div style={{ fontSize:9, color:'#a5b4fc', marginTop:2 }}>{claim.aiClassification}</div></div>
                <div><div style={s.lbl()}>Responsible Party</div><div style={{ fontSize:9, color:'#e5e7eb', marginTop:2 }}>{claim.responsibleParty}</div></div>
                <div><div style={s.lbl()}>Contract Reference</div><div style={{ fontSize:9, color:'#e5e7eb', marginTop:2 }}>{claim.contractRef}</div></div>
                <div><div style={s.lbl()}>Insurance Reference</div><div style={{ fontSize:9, color:'#e5e7eb', marginTop:2 }}>{claim.insuranceRef}</div></div>
              </div>

              <div style={{ marginTop:10, display:'flex', gap:6 }}>
                <Btn onClick={()=>{emitCOS('ClaimCreated',`Claim ${claim.id} approved by customer`);showNotify('Claim approval sent');}} color="#10b981">Approve Settlement</Btn>
                <Btn onClick={()=>{emitCOS('ClaimCreated',`Claim ${claim.id} rejected by customer`);}} color="#ef4444" outline>Reject</Btn>
                <Btn onClick={()=>{emitCOS('AgentActionTaken',`Claim ${claim.id} escalated`);showNotify('Escalated to senior team');}} color="#f59e0b" outline>Escalate</Btn>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File Claim Form (§25) */}
      {claimOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <motion.div initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} style={{ ...s.card({ maxWidth:480, width:'90%' }) }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <h3 style={s.hd('#ef4444')}>File New Claim</h3>
              <button onClick={()=>setClaimOpen(false)} style={{ background:'none', border:'none', color:'#6b7280', cursor:'pointer' }}><X size={16}/></button>
            </div>
            <div style={{ marginBottom:10 }}>
              <div style={s.lbl({ marginBottom:4 })}>Claim Type</div>
              <select value={claimForm.type} onChange={e=>setClaimForm(p=>({...p,type:e.target.value}))}
                style={{ width:'100%', padding:'7px 10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'#e5e7eb', fontSize:10, outline:'none' }}>
                <option value="">Select type...</option>
                {['Damage','Loss','Shortage','Theft','Delay','Temperature Violation'].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{ marginBottom:10 }}>
              <div style={s.lbl({ marginBottom:4 })}>Description</div>
              <textarea value={claimForm.description} onChange={e=>setClaimForm(p=>({...p,description:e.target.value}))} rows={3}
                style={{ width:'100%', padding:'7px 10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'#e5e7eb', fontSize:10, outline:'none', resize:'vertical', boxSizing:'border-box' }}/>
            </div>
            <div style={{ padding:'8px', border:'1px dashed rgba(255,255,255,0.15)', borderRadius:6, textAlign:'center', color:'#6b7280', fontSize:9, marginBottom:12 }}>📎 Upload evidence (photos, logs, docs)</div>
            <div style={{ display:'flex', gap:8 }}>
              <Btn onClick={()=>{emitCOS('ClaimCreated',`New claim: ${claimForm.type}`);showNotify('Claim filed — 9-step pipeline started');setClaimOpen(false);}} color="#ef4444" sm={false}>Submit Claim</Btn>
              <Btn onClick={()=>setClaimOpen(false)} color="#6b7280" outline sm={false}>Cancel</Btn>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TAB 10 — SUPPORT & COMMUNICATION (§26, §27)
// ============================================================
export function TabSupport({ customer, showNotify }) {
  const [view, setView] = useState('tickets');
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { from:'support', msg:'Hello! How can we help you today?', time:'09:00' },
  ]);
  const [timelineSearch, setTimelineSearch] = useState('');
  const [selTicket, setSelTicket] = useState(null);

  const tickets = [
    { id:'TKT-8821', priority:'High', category:'SLA Breach', sla:'1h remaining', owner:'Meena Reddy', status:'Open', customerImpact:'Delayed delivery — customer missed production schedule.', financialImpact:'₹2.4L penalty exposure', shipment:'SHP-8822', contract:'CF-9281', invoice:'Pending' },
    { id:'TKT-8812', priority:'Medium', category:'Invoice Query', sla:'4h remaining', owner:'Arun Kumar', status:'In Progress', customerImpact:'Incorrect fuel surcharge charged.', financialImpact:'₹3,240 in dispute', shipment:'SHP-8810', contract:'CF-9281', invoice:'INV-4819' },
    { id:'TKT-8804', priority:'Low', category:'POD Missing', sla:'Closed', owner:'Sunita Rao', status:'Resolved', customerImpact:'Billing delayed by 48h.', financialImpact:'₹0 (resolved)', shipment:'SHP-8805', contract:'CF-9281', invoice:'INV-4811' },
  ];

  const timelineEvents = [
    { time:'08:10', event:'Booking confirmed — SHP-8821', type:'Booking', color:'#8b5cf6' },
    { time:'09:42', event:'Truck assigned — MH-12-AB-4421, Driver: Ramesh Kumar', type:'Assignment', color:'#06b6d4' },
    { time:'09:50', event:'Driver contact: Ramesh +91-98XXX-12341 (WhatsApp)', type:'DriverContact', color:'#a855f7' },
    { time:'11:15', event:'Departure from JNPT Gate', type:'Departure', color:'#10b981' },
    { time:'13:28', event:'Toll crossed — Vadodara', type:'Waypoint', color:'#6b7280' },
    { time:'09:15', event:'Traffic delay exception detected — SHP-8822 NH4', type:'ExceptionDetected', color:'#ef4444' },
    { time:'09:22', event:'Customer notification: SHP-8822 delay — +2.5h', type:'CustomerNotification', color:'#f97316' },
    { time:'11:02', event:'SHP-8819 delivered — Jaipur WH', type:'Delivery', color:'#10b981' },
    { time:'11:35', event:'POD uploaded by Ajay Singh', type:'PODUploaded', color:'#22c55e' },
    { time:'11:42', event:'POD verified — billing eligibility confirmed', type:'PODVerified', color:'#10b981' },
    { time:'12:00', event:'Invoice INV-4820 generated — ₹17,577', type:'InvoiceGenerated', color:'#06b6d4' },
  ].filter(e=>!timelineSearch||e.event.toLowerCase().includes(timelineSearch.toLowerCase())||e.type.toLowerCase().includes(timelineSearch.toLowerCase()));

  const sendChat = () => {
    if(!chatMsg.trim()) return;
    const newHistory = [...chatHistory, { from:'customer', msg:chatMsg, time: new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) }];
    setChatHistory(newHistory);
    setChatMsg('');
    setTimeout(()=>{
      setChatHistory(p=>[...p,{ from:'support', msg:`Thank you! We're looking into "${chatMsg.substring(0,30)}..." — a case has been opened.`, time: new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) }]);
      emitCOS('AgentActionTaken','Customer chat message received — case created');
    },1200);
  };

  const SEV = { High:'#ef4444', Medium:'#f59e0b', Low:'#06b6d4' };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', gap:6 }}>
        {['tickets','timeline','chat'].map(v=>(
          <button key={v} onClick={()=>setView(v)} style={{ padding:'6px 14px', borderRadius:99, border:'none', cursor:'pointer', fontSize:10, fontWeight:700, background:view===v?'rgba(99,102,241,0.25)':'rgba(255,255,255,0.05)', color:view===v?'#a5b4fc':'#6b7280', textTransform:'capitalize' }}>{v==='tickets'?'Support Tickets':v==='timeline'?'Communication Timeline':'Live Chat'}</button>
        ))}
        <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
          <Btn onClick={()=>{emitCOS('AgentActionTaken','Call request sent');showNotify('Call request sent — agent will contact in 5 min');}} color="#10b981">📞 Request Call</Btn>
          <Btn onClick={()=>{emitCOS('AgentActionTaken','New support ticket created');showNotify('Ticket created');}} color="#6366f1">+ New Ticket</Btn>
        </div>
      </div>

      {view==='tickets' && (
        <div>
          {tickets.map(t=>(
            <div key={t.id} style={{ ...s.card({ marginBottom:10 }), borderLeft:`3px solid ${SEV[t.priority]||'#6b7280'}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                <div>
                  <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                    <span style={{ fontSize:12, fontWeight:800, color:'#e5e7eb' }}>{t.id}</span>
                    <span style={s.pill(SEV[t.priority]||'#6b7280')}>{t.priority}</span>
                    <span style={s.pill('#06b6d4')}>{t.category}</span>
                    <span style={s.pill(t.status==='Resolved'?'#10b981':t.status==='In Progress'?'#f59e0b':'#ef4444')}>{t.status}</span>
                  </div>
                  <div style={{ fontSize:8, color:'#6b7280' }}>SLA: {t.sla} · Owner: {t.owner}</div>
                </div>
                <div style={{ display:'flex', gap:4 }}>
                  <Btn onClick={()=>setSelTicket(t)} color="#818cf8">Detail</Btn>
                  <Btn onClick={()=>{emitCOS('AgentActionTaken',`Escalation requested for ${t.id}`);showNotify('Escalated');}} color="#f59e0b" outline>Escalate</Btn>
                </div>
              </div>
              <div style={s.grid2}>
                <div><div style={s.lbl()}>Customer Impact</div><div style={{ fontSize:9, color:'#e5e7eb', marginTop:2 }}>{t.customerImpact}</div></div>
                <div><div style={s.lbl()}>Financial Impact</div><div style={{ fontSize:9, color:'#fbbf24', marginTop:2 }}>{t.financialImpact}</div></div>
                <div><div style={s.lbl()}>Related Shipment</div><div style={{ fontSize:9, color:'#a5b4fc', marginTop:2 }}>{t.shipment}</div></div>
                <div><div style={s.lbl()}>Related Invoice</div><div style={{ fontSize:9, color:'#a5b4fc', marginTop:2 }}>{t.invoice}</div></div>
              </div>
              <div style={{ marginTop:6 }}>
                <div style={{ display:'flex', gap:4, marginBottom:4 }}>
                  <span style={{ fontSize:8, color:'#6b7280' }}>Upload evidence:</span>
                </div>
                <div style={{ padding:'5px 8px', border:'1px dashed rgba(255,255,255,0.1)', borderRadius:5, textAlign:'center', color:'#6b7280', fontSize:8, cursor:'pointer' }}>
                  📎 Attach files — photos, screenshots, logs
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view==='timeline' && (
        <div style={s.card()}>
          <SH icon={Clock} title="Unified Communication Timeline — All Events" color="#06b6d4">
            <div style={{ position:'relative' }}>
              <Search size={10} color="#6b7280" style={{ position:'absolute', left:6, top:'50%', transform:'translateY(-50%)' }}/>
              <input value={timelineSearch} onChange={e=>setTimelineSearch(e.target.value)} placeholder="Search events..."
                style={{ padding:'4px 8px 4px 22px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:5, color:'#e5e7eb', fontSize:9, outline:'none' }}/>
            </div>
          </SH>
          {timelineEvents.map((ev,i) => (
            <div key={i} style={{ display:'flex', gap:10, padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize:8, color:'#6b7280', width:36, flexShrink:0, fontFamily:'monospace' }}>{ev.time}</span>
              <div style={{ width:5, height:5, borderRadius:'50%', background:ev.color, marginTop:5, flexShrink:0 }}/>
              <span style={{ fontSize:9, color:'#e5e7eb', flex:1 }}>{ev.event}</span>
              <span style={{ ...s.pill(ev.color), flexShrink:0 }}>{ev.type}</span>
            </div>
          ))}
        </div>
      )}

      {view==='chat' && (
        <div style={s.card()}>
          <SH icon={MessageSquare} title="Live Support Chat" color="#10b981">
            <span style={s.pill('#10b981')}>● Agent Online</span>
          </SH>
          <div style={{ height:300, overflowY:'auto', display:'flex', flexDirection:'column', gap:8, marginBottom:12 }}>
            {chatHistory.map((m,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:m.from==='customer'?'flex-end':'flex-start' }}>
                <div style={{ maxWidth:'75%', padding:'8px 12px', borderRadius:10, background:m.from==='customer'?'rgba(99,102,241,0.2)':'rgba(255,255,255,0.06)', border:`1px solid ${m.from==='customer'?'rgba(99,102,241,0.3)':'rgba(255,255,255,0.08)'}` }}>
                  <div style={{ fontSize:9, color:'#e5e7eb' }}>{m.msg}</div>
                  <div style={{ fontSize:7, color:'#6b7280', marginTop:3, textAlign:'right' }}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendChat()} placeholder="Type a message..."
              style={{ flex:1, padding:'8px 10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'#e5e7eb', fontSize:10, outline:'none' }}/>
            <Btn onClick={sendChat} color="#10b981">Send</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TAB 11 — ANALYTICS (§28)
// ============================================================
export function TabAnalytics() {
  const [view, setView] = useState('operations');
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        {[['operations','Operations'],['financial','Financial'],['carrier','Carrier & Driver'],['network','Network'],['sustainability','Sustainability']].map(([v,l])=>(
          <button key={v} onClick={()=>setView(v)} style={{ padding:'5px 12px', borderRadius:99, border:'none', cursor:'pointer', fontSize:9, fontWeight:700, background:view===v?'rgba(99,102,241,0.25)':'rgba(255,255,255,0.05)', color:view===v?'#a5b4fc':'#6b7280', textTransform:'uppercase' }}>{l}</button>
        ))}
      </div>

      {view==='operations' && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={s.grid2}>
            <div style={s.card()}>
              <SH icon={TrendingUp} title="OTD Rate Trend" color="#10b981"/>
              <MiniChart data={ANALYTICS_DATA.otdTrend.map(d=>({...d,value:d.otd}))} color="#10b981" height={80}/>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
                <span style={s.lbl()}>Current: <span style={{ color:'#10b981' }}>96.8%</span></span>
                <span style={s.lbl()}>Target: <span style={{ color:'#06b6d4' }}>96%</span></span>
              </div>
            </div>
            <div style={s.card()}>
              <SH icon={Activity} title="Empty KM Trend" color="#f59e0b"/>
              <MiniChart data={ANALYTICS_DATA.emptyKmTrend.map(d=>({...d,value:d.pct}))} color="#f59e0b" height={80}/>
              <div style={{ marginTop:6 }}><span style={s.lbl()}>Current: <span style={{ color:'#f59e0b' }}>9.2%</span></span></div>
            </div>
          </div>
          <div style={s.card()}>
            <SH icon={Target} title="Lane Performance" color="#06b6d4"/>
            {ANALYTICS_DATA.lanePerformance.map((ln,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <div><div style={{ fontSize:9, color:'#e5e7eb' }}>{ln.lane}</div><div style={{ fontSize:8, color:'#6b7280' }}>{ln.trips} trips</div></div>
                <div style={{ display:'flex', gap:14 }}>
                  {[['OTD',`${ln.avgOTD}%`,ln.avgOTD>95?'#10b981':'#ef4444'],['₹/km',`₹${ln.avgCostKm}`,'#06b6d4'],['CO₂/trip',`${ln.emissionsTrip}MT`,'#22c55e'],['Delay',`${ln.avgDelayMin}min`,ln.avgDelayMin<30?'#10b981':'#f59e0b']].map(([k,v,c])=>(
                    <div key={k} style={{ textAlign:'center' }}><div style={{ fontSize:11, fontWeight:800, color:c }}>{v}</div><div style={s.lbl()}>{k}</div></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view==='financial' && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={s.card()}>
            <SH icon={TrendingUp} title="Monthly Spend Trend" color="#06b6d4"/>
            <MiniChart data={ANALYTICS_DATA.spendTrend.map(d=>({...d,value:d.spend}))} color="#06b6d4" height={90}/>
          </div>
          <div style={s.grid3}>
            {[['Total Spend (Aug)','₹9.1 Cr','#f9fafb'],['Cost/km (avg)','₹41.2','#06b6d4'],['Cost/trip (avg)','₹48,400','#a855f7'],['Lane Variance','+8.4%','#f59e0b'],['Savings (YTD)','₹28.4 L','#10b981'],['Outstanding','₹14.2 L','#ef4444']].map(([l,v,c])=>(
              <div key={l} style={s.card({ textAlign:'center' })}><div style={{ fontSize:14, fontWeight:900, color:c }}>{v}</div><div style={s.lbl({ marginTop:4 })}>{l}</div></div>
            ))}
          </div>
        </div>
      )}

      {view==='carrier' && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={s.card()}>
            <SH icon={Truck} title="Carrier Performance" color="#06b6d4"/>
            {ANALYTICS_DATA.carrierPerformance.map((c,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <div><div style={{ fontSize:9, color:'#e5e7eb' }}>{c.carrier}</div><div style={{ fontSize:8, color:'#6b7280' }}>{c.trips} trips</div></div>
                <div style={{ display:'flex', gap:12 }}>
                  {[['OTD',`${c.otd}%`,c.otd>95?'#10b981':'#f59e0b'],['Incidents',c.incidents,c.incidents<4?'#10b981':'#ef4444'],['Score',`${c.score}/100`,c.score>90?'#10b981':c.score>80?'#f59e0b':'#ef4444']].map(([k,v,col])=>(
                    <div key={k} style={{ textAlign:'center' }}><div style={{ fontSize:11, fontWeight:800, color:col }}>{v}</div><div style={s.lbl()}>{k}</div></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={s.card()}>
            <SH icon={User} title="Driver Performance" color="#a855f7"/>
            {ANALYTICS_DATA.driverPerformance.map((d,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <div><div style={{ fontSize:9, color:'#e5e7eb' }}>{d.driver}</div><div style={{ fontSize:8, color:'#6b7280' }}>{d.trips} trips</div></div>
                <div style={{ display:'flex', gap:12 }}>
                  {[['Safety',`${d.safetyScore}%`,d.safetyScore>90?'#10b981':'#f59e0b'],['Fuel Eff.',d.fuelEfficiency,'#06b6d4'],['Fatigue',d.fatigue,d.fatigue==='Low'?'#10b981':d.fatigue==='Medium'?'#f59e0b':'#ef4444']].map(([k,v,col])=>(
                    <div key={k} style={{ textAlign:'center' }}><div style={{ fontSize:10, fontWeight:800, color:col }}>{v}</div><div style={s.lbl()}>{k}</div></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view==='network' && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={s.card()}>
            <SH icon={Warehouse} title="Warehouse Performance" color="#a855f7"/>
            {ANALYTICS_DATA.warehousePerformance.map((w,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <div><div style={{ fontSize:9, color:'#e5e7eb' }}>{w.warehouse}</div></div>
                <div style={{ display:'flex', gap:12 }}>
                  {[['Utilization',`${w.utilization}%`,w.utilization>85?'#f59e0b':'#10b981'],['Avg Dwell',w.avgDwell,'#06b6d4'],['Incidents',w.incidents,w.incidents===0?'#10b981':'#f59e0b']].map(([k,v,col])=>(
                    <div key={k} style={{ textAlign:'center' }}><div style={{ fontSize:10, fontWeight:800, color:col }}>{v}</div><div style={s.lbl()}>{k}</div></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={s.card()}>
            <SH icon={Globe} title="Lane Heatmap (OTD %)" color="#06b6d4"/>
            {ANALYTICS_DATA.lanePerformance.map((ln,i)=>{
              const pct=ln.avgOTD; const color=pct>97?'#10b981':pct>93?'#f59e0b':'#ef4444';
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 0' }}>
                  <div style={{ fontSize:8, color:'#9ca3af', width:200, flexShrink:0 }}>{ln.lane}</div>
                  <div style={{ flex:1, height:16, background:'rgba(255,255,255,0.04)', borderRadius:3, overflow:'hidden' }}>
                    <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:3, transition:'width 0.6s' }}/>
                  </div>
                  <span style={{ fontSize:9, fontWeight:800, color, width:40, textAlign:'right' }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view==='sustainability' && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={s.grid3}>
            {[['Total CO₂/mo',ANALYTICS_DATA.sustainability.co2Total,'#22c55e'],['CO₂/Trip',ANALYTICS_DATA.sustainability.co2PerTrip,'#10b981'],['Fuel Consumed',ANALYTICS_DATA.sustainability.fuelConsumption,'#f59e0b']].map(([l,v,c])=>(
              <div key={l} style={s.card({ textAlign:'center' })}><div style={{ fontSize:14, fontWeight:900, color:c }}>{v}</div><div style={s.lbl({ marginTop:4 })}>{l}</div></div>
            ))}
          </div>
          <div style={s.card()}>
            <SH icon={Leaf} title="CO₂ Emissions per Lane" color="#22c55e"/>
            {Object.entries(ANALYTICS_DATA.sustainability.co2PerLane).map(([lane,em])=>(
              <div key={lane} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize:9, color:'#9ca3af' }}>{lane}</span>
                <span style={{ fontSize:10, fontWeight:700, color:'#22c55e' }}>{em}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// TAB 12 — AI WORKSPACE (§29, §30, §31, §35)
// ============================================================
export function TabAI({ customer, showNotify }) {
  const [view, setView] = useState('copilot');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role:'ai', content:'Hello! I\'m your GatiFleet AI Copilot. I have full context on your 38 recent shipments, 4 active exceptions, 2 contract alerts, and this month\'s spend trend. Ask me anything.', evidence:'', actions:[] },
  ]);
  const [autonomyLevel, setAutonomyLevel] = useState(2);
  const [actionToggles, setActionToggles] = useState({ auto_reroute:true, auto_book:false, auto_negotiate:false, auto_pay:false, auto_waive:false, auto_notify:true });
  const [auditLog, setAuditLog] = useState([]);

  const SAMPLE_PROMPTS = [
    'What happened today?',
    'Which shipments are at risk?',
    'Why did cost increase this month?',
    'Which carrier is underperforming?',
    'Show invoices with unusual charges',
    'How can I save ₹10L this month?',
  ];

  const AI_RESPONSES = {
    'What happened today?': { content:`Today (Aug 13): 3 active shipments. SHP-8821 in transit (ETA Aug 14 08:30, OTD 97%). SHP-8822 delayed by NH4 accident — 78% SLA breach probability. SHP-8819 delivered to Jaipur. 2 pending invoices (₹24L in approval queue). Exception EXC-991 requires your decision on reroute option.`, evidence:'Real-time telemetry × 3 shipments; Invoice aging report; Exception center log', actions:['View SHP-8822','Resolve EXC-991','Approve INV queue'] },
    'Which shipments are at risk?': { content:`2 shipments at high risk: (1) SHP-8822 Pune→Bangalore — SLA breach probability 78%, NH4 accident adds 2.5h. AI recommends Kolhapur reroute (Option B). (2) SHP-8810 Kolkata→Guwahati — invoice SLA breach in 6h, finance approval backlog. Rerouting SHP-8822 has 86% confidence of saving 1.7h.`, evidence:'Contract CF-9281 clause 8.2; telemetry SHP-8822 13:10; NH4 traffic report', actions:['Approve Reroute B','Escalate Finance'] },
    'Why did cost increase this month?': { content:`August spend +8.7% vs July. 3 factors: (1) Diesel index rose from ₹91→₹96/L (+5.5%) — adds ~₹1.2L/month to fuel surcharge pool. (2) Emergency reroute on EXC-985 added ₹18K. (3) Kolkata corridor saw 6 delay-related penalties (₹15K total). Recommendation: Diesel clause renegotiation at next contract renewal.`, evidence:'ERP fuel surcharge ledger; SHP telemetry Aug 1–13; Contract CF-9281 §4.2', actions:['View Cost Breakdown','Start Contract Review'] },
    'Which carrier is underperforming?': { content:`GatiFleet East is underperforming on the Kolkata→Guwahati lane: OTD 87.4% (target 96%), 9 incidents in 38 trips (23.7% incident rate vs 5% for GatiFleet Primary). Root cause: Siliguri bottleneck. The Digital Twin shows Siliguri relay depot improves OTD to 93.6%. Recommendation: Approve Digital Twin scenario B.`, evidence:'Carrier performance data Aug 1–13; Telemetry log KOL→GUW 38 trips; Digital Twin simulation results', actions:['View Twin Scenario B','Escalate to Procurement'] },
    'Show invoices with unusual charges': { content:`INV-4819 flagged: Fuel surcharge at 8% base × 5.5% delta = ₹1,190. Contract CF-9281 §4.2 stipulates surcharge basis from ₹91/L baseline. Current diesel at ₹96/L is within contract range — charge is VALID. However, INV-4823 shows toll ₹1,240 vs actual FASTag log ₹688 — discrepancy of ₹552. Recommend dispute INV-4823.`, evidence:'Invoice lines INV-4819, INV-4823; FASTag transaction logs Aug 10; Contract CF-9281 §4.2 fuel clause', actions:['Dispute INV-4823','Approve INV-4819'] },
    'How can I save ₹10L this month?': { content:`3 savings opportunities identified totaling ₹12.8L: (1) Lane consolidation Mumbai→Delhi + Pune→Bangalore (shared trips Wed/Sat) — saves ₹4.7L/month. (2) Siliguri relay depot reduces empty KM on KOL→GUW from 18% to 9% — saves ₹3.8L. (3) Prompt payment discount at -1.5% on ₹28L outstanding — saves ₹4.2L (but reduces cashflow). Approve all three for ₹12.7L savings.`, evidence:'Fleet utilization data; Empty KM analysis; Contract CF-9281 §6.2 prompt pay clause; Digital Twin scenario B', actions:['Approve Consolidation','Implement Relay','Apply Prompt Pay'] },
  };

  const sendPrompt = (prompt) => {
    const userMsg = { role:'user', content:prompt };
    const resp = AI_RESPONSES[prompt] || { content:`Analyzing "${prompt}" across your 38 shipments, 5 active contracts, and 847 historical records...`, evidence:'Full customer KG traversal', actions:['View Details'] };
    const aiMsg = { role:'ai', ...resp };
    setMessages(p=>[...p, userMsg, aiMsg]);
    setChatInput('');
    const log = { agent:'AI Copilot', user:'CUST-ADMIN', data:'Customer KG + recent events', reasoning:prompt, confidence:88, action:'Context-aware response', authorization:'Level 1 — Recommend only', result:'Response generated', timestamp:new Date().toLocaleTimeString() };
    setAuditLog(p=>[log,...p]);
    emitCOS('AgentActionTaken', `AI Copilot query: ${prompt.substring(0,50)}`);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', gap:6 }}>
        {[['copilot','AI Copilot'],['agents','8 AI Agents'],['autonomy','Autonomy Center'],['audit','AI Audit Log']].map(([v,l])=>(
          <button key={v} onClick={()=>setView(v)} style={{ padding:'6px 14px', borderRadius:99, border:'none', cursor:'pointer', fontSize:9, fontWeight:700, background:view===v?'rgba(99,102,241,0.25)':'rgba(255,255,255,0.05)', color:view===v?'#a5b4fc':'#6b7280', textTransform:'uppercase' }}>{l}</button>
        ))}
      </div>

      {view==='copilot' && (
        <div style={s.card()}>
          <SH icon={Sparkles} title="AI Customer Copilot" color="#818cf8">
            <span style={s.pill('#818cf8')}>Context-Aware · Evidence-Backed</span>
          </SH>
          <div style={{ fontSize:8, color:'#4b5563', marginBottom:8, fontStyle:'italic' }}>AI operates under your permissions — never bypasses authorization. All responses include evidence. (§31)</div>
          {/* Sample Prompts (§29) */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
            {SAMPLE_PROMPTS.map(p=>(
              <button key={p} onClick={()=>sendPrompt(p)}
                style={{ padding:'5px 10px', borderRadius:6, border:'1px solid rgba(99,102,241,0.25)', background:'rgba(99,102,241,0.06)', color:'#818cf8', fontSize:9, cursor:'pointer', fontWeight:500 }}>
                {p}
              </button>
            ))}
          </div>
          {/* Chat */}
          <div style={{ height:360, overflowY:'auto', display:'flex', flexDirection:'column', gap:10, marginBottom:12 }}>
            {messages.map((m,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start' }}>
                <div style={{ maxWidth:'85%', padding:'10px 12px', borderRadius:10, background:m.role==='user'?'rgba(99,102,241,0.2)':'rgba(255,255,255,0.04)', border:`1px solid ${m.role==='user'?'rgba(99,102,241,0.3)':'rgba(255,255,255,0.07)'}` }}>
                  {m.role==='ai' && <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:6 }}><Bot size={12} color="#818cf8"/><span style={{ fontSize:8, color:'#818cf8', fontWeight:700 }}>GatiFleet AI</span></div>}
                  <div style={{ fontSize:10, color:'#e5e7eb', lineHeight:1.6 }}>{m.content}</div>
                  {m.evidence && <div style={{ fontSize:8, color:'#6b7280', marginTop:6, borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:4 }}>📑 Evidence: {m.evidence}</div>}
                  {m.actions&&m.actions.length>0 && (
                    <div style={{ display:'flex', gap:6, marginTop:8, flexWrap:'wrap' }}>
                      {m.actions.map((act,j)=>(
                        <button key={j} onClick={()=>{emitCOS('AgentActionTaken',`AI action button: ${act}`);showNotify(`Action: ${act}`);}}
                          style={{ padding:'4px 10px', borderRadius:5, border:'1px solid rgba(99,102,241,0.35)', background:'rgba(99,102,241,0.12)', color:'#a5b4fc', fontSize:8, fontWeight:700, cursor:'pointer' }}>
                          → {act}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendPrompt(chatInput)} placeholder="Ask the AI anything about your operations..."
              style={{ flex:1, padding:'8px 12px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, color:'#e5e7eb', fontSize:10, outline:'none' }}/>
            <Btn onClick={()=>sendPrompt(chatInput)} color="#818cf8">Ask AI</Btn>
          </div>
        </div>
      )}

      {view==='agents' && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ fontSize:8, color:'#4b5563', fontStyle:'italic' }}>All agents operate under the same permissions and data boundaries as human users. (§30)</div>
          <div style={s.grid2}>
            {AI_AGENTS.map(agent=>(
              <div key={agent.id} style={{ ...s.card(), borderLeft:`3px solid ${agent.status==='Active'?'#10b981':'#6b7280'}` }}>
                <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:8 }}>
                  <span style={{ fontSize:20 }}>{agent.icon}</span>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:'#e5e7eb' }}>{agent.name}</div>
                    <div style={{ fontSize:8, color:'#6b7280' }}>{agent.domain}</div>
                  </div>
                  <span style={{ marginLeft:'auto', ...s.pill(agent.status==='Active'?'#10b981':'#6b7280') }}>{agent.status}</span>
                </div>
                <div style={{ fontSize:8, color:'#9ca3af', marginBottom:6 }}>Last: {agent.lastAction}</div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <span style={s.lbl()}>Confidence: <span style={{ color:'#a5b4fc' }}>{agent.confidence}%</span></span>
                  <span style={s.lbl()}>Recs: <span style={{ color:'#f9fafb' }}>{agent.recommendations}</span></span>
                </div>
                <div style={{ marginTop:8, display:'flex', gap:4 }}>
                  <Btn onClick={()=>{emitCOS('AgentActionTaken',`Briefing from ${agent.name}`);showNotify(`${agent.name} briefing opened`);}} color="#6366f1">Get Briefing</Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view==='autonomy' && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {/* 6 Levels (§35) */}
          <div style={s.card()}>
            <SH icon={Zap} title="AI Autonomy Level" color="#a855f7">
              <span style={s.pill('#a855f7')}>Level {autonomyLevel}: {AUTONOMY_LEVELS[autonomyLevel]?.label}</span>
            </SH>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
              {AUTONOMY_LEVELS.map((l,i)=>(
                <button key={i} onClick={()=>setAutonomyLevel(i)}
                  style={{ padding:'6px 12px', borderRadius:7, border:`1px solid ${autonomyLevel===i?'rgba(168,85,247,0.5)':'rgba(255,255,255,0.08)'}`, background:autonomyLevel===i?'rgba(168,85,247,0.15)':'rgba(255,255,255,0.03)', cursor:'pointer', textAlign:'left' }}>
                  <div style={{ fontSize:9, fontWeight:700, color:autonomyLevel===i?'#c4b5fd':'#9ca3af' }}>L{i}: {l.label}</div>
                  <div style={{ fontSize:7, color:'#6b7280', marginTop:2, maxWidth:120 }}>{l.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Per-action toggles */}
          <div style={s.card()}>
            <SH icon={Settings} title="Per-Action Autonomy Toggles" color="#06b6d4"/>
            <div style={{ fontSize:8, color:'#4b5563', marginBottom:10, fontStyle:'italic' }}>Configurable by: role, action type, financial limit, risk level (§35)</div>
            {[['auto_reroute','Auto-Reroute','>₹5K savings, Low risk'],['auto_book','Auto-Book Capacity','Pre-approved lanes only'],['auto_negotiate','Auto-Negotiate Rates','Executive approval required'],['auto_pay','Auto-Pay Invoices','Finance + CFO approval required'],['auto_waive','Auto-Waive Penalties','Legal approval required'],['auto_notify','Auto-Notify Stakeholders','All levels — notifications only']].map(([key,label,rule])=>(
              <div key={key} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <div>
                  <div style={{ fontSize:9, fontWeight:700, color:'#e5e7eb' }}>{label}</div>
                  <div style={{ fontSize:8, color:'#6b7280' }}>{rule}</div>
                </div>
                <button onClick={()=>setActionToggles(p=>({...p,[key]:!p[key]}))}
                  style={{ width:36, height:20, borderRadius:99, border:'none', cursor:'pointer', background:actionToggles[key]?'#10b981':'rgba(255,255,255,0.1)', transition:'background 0.2s', position:'relative' }}>
                  <div style={{ position:'absolute', top:2, left:actionToggles[key]?18:2, width:16, height:16, borderRadius:'50%', background:'#fff', transition:'left 0.2s' }}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {view==='audit' && (
        <div style={s.card()}>
          <SH icon={ShieldCheck} title="AI Action Audit Log (§31)" color="#10b981"/>
          <div style={{ fontSize:8, color:'#4b5563', marginBottom:8, fontStyle:'italic' }}>Every AI action records 9 fields: requesting user, agent, data used, reasoning, confidence, proposed action, authorization, result, outcome.</div>
          {(auditLog.length===0?[{ agent:'AI Copilot', user:'SYSTEM', data:'Startup context', reasoning:'Workspace initialized', confidence:100, action:'Context loaded', authorization:'System', result:'Ready', timestamp:'08:00:00' }]:auditLog).map((log,i)=>(
            <div key={i} style={{ padding:'8px 10px', background:'rgba(255,255,255,0.02)', borderRadius:7, marginBottom:6 }}>
              <div style={s.grid2}>
                {Object.entries(log).map(([k,v])=>(
                  <div key={k}><div style={s.lbl()}>{k}</div><div style={{ fontSize:8, color:'#9ca3af', marginTop:1 }}>{v}</div></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// TAB 13 — NETWORK & KNOWLEDGE GRAPH (§32)
// ============================================================
export function TabNetwork() {
  const [selLoc, setSelLoc] = useState(null);
  const TYPE_ICON = { Plant:'🏭', DC:'🏬', Warehouse:'🏪' };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      {/* KG Relationship Path (§32) */}
      <div style={s.card()}>
        <SH icon={Network} title="Knowledge Graph Traversal Path (§32)" color="#818cf8"/>
        <div style={{ fontSize:8, color:'#4b5563', marginBottom:8, fontStyle:'italic' }}>Customer → Shipment → Route → Vehicle → Driver → Delay → SLA → Financial Impact</div>
        <div style={{ display:'flex', gap:0, alignItems:'center', overflowX:'auto', padding:'8px 0' }}>
          {[['Customer','Tata Motors','#a855f7'],['Shipment','SHP-8822','#06b6d4'],['Route','Pune→Bangalore','#f59e0b'],['Vehicle','MH-14-CD-6612','#10b981'],['Driver','Suresh Patil','#818cf8'],['Delay','NH4 +2.5h','#ef4444'],['SLA','Breach L8.2','#ef4444'],['Financial Impact','₹2.4L penalty','#ef4444']].map(([type,val,c],i,arr)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
              <div style={{ padding:'6px 10px', borderRadius:8, border:`1px solid ${c}40`, background:`${c}10`, textAlign:'center' }}>
                <div style={{ fontSize:7, color:'#6b7280', textTransform:'uppercase' }}>{type}</div>
                <div style={{ fontSize:9, fontWeight:700, color:c }}>{val}</div>
              </div>
              {i<arr.length-1 && <div style={{ width:20, height:1, background:`${c}40`, position:'relative' }}>
                <span style={{ position:'absolute', top:-5, right:2, fontSize:8, color:c }}>→</span>
              </div>}
            </div>
          ))}
        </div>
      </div>

      {/* Entity Coverage (§32) */}
      <div style={s.card()}>
        <SH icon={Database} title="Knowledge Graph Entities" color="#06b6d4"/>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {['Locations','Shipments','Contracts','Vehicles','Drivers','Carriers','Invoices','Payments','Claims','SLA Records','Employees','Policies','Routes','Exceptions','AI Recommendations'].map(e=>(
            <span key={e} style={s.pill('#06b6d4')}>{e}</span>
          ))}
        </div>
        <div style={{ fontSize:8, color:'#4b5563', marginTop:8, fontStyle:'italic' }}>AI uses contextual retrieval across all entity types — authorization-gated (§31)</div>
      </div>

      {/* Network Locations */}
      <div style={s.card()}>
        <SH icon={MapPin} title="Customer Locations Network" color="#10b981">
          <span style={s.pill('#10b981')}>{NETWORK_LOCATIONS.length} locations</span>
        </SH>
        <div style={s.grid2}>
          {NETWORK_LOCATIONS.map(loc=>(
            <div key={loc.id} onClick={()=>setSelLoc(selLoc?.id===loc.id?null:loc)}
              style={{ padding:'10px', background:'rgba(255,255,255,0.02)', borderRadius:8, border:`1px solid ${selLoc?.id===loc.id?'rgba(16,185,129,0.4)':'rgba(255,255,255,0.06)'}`, cursor:'pointer' }}>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                <span style={{ fontSize:16 }}>{TYPE_ICON[loc.type]||'📍'}</span>
                <div><div style={{ fontSize:9, fontWeight:700, color:'#e5e7eb' }}>{loc.name}</div><div style={{ fontSize:8, color:'#6b7280' }}>{loc.city} · {loc.type}</div></div>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <div><div style={{ fontSize:11, fontWeight:800, color:'#06b6d4' }}>{loc.shipmentsMonth}</div><div style={s.lbl()}>trips/mo</div></div>
                <div><div style={{ fontSize:11, fontWeight:800, color:'#a855f7' }}>{loc.avgDwell}</div><div style={s.lbl()}>avg dwell</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lane Performance Matrix */}
      <div style={s.card()}>
        <SH icon={Activity} title="Lane Performance Matrix" color="#a855f7"/>
        {ANALYTICS_DATA.lanePerformance.map((ln,i)=>(
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize:9, color:'#e5e7eb', flex:1 }}>{ln.lane}</span>
            <div style={{ display:'flex', gap:12 }}>
              {[['Trips',ln.trips,'#9ca3af'],['OTD',`${ln.avgOTD}%`,ln.avgOTD>95?'#10b981':'#f59e0b'],['₹/km',`₹${ln.avgCostKm}`,'#06b6d4']].map(([k,v,c])=>(
                <div key={k} style={{ textAlign:'center' }}><div style={{ fontSize:10, fontWeight:800, color:c }}>{v}</div><div style={s.lbl()}>{k}</div></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// TAB 14 — DIGITAL TWIN & SIMULATION (§33, §34, §45)
// ============================================================
export function TabTwin({ showNotify }) {
  const [scenario, setScenario] = useState(null);
  const [evolStep, setEvolStep] = useState(8); // KGW case at step 8

  const twinState = {
    demand: '3,200 MT/month', fleet: '18 dedicated vehicles', routes: '5 active corridors',
    warehouses: '8 locations', carriers: '4 contracted', costs: '₹9.1 Cr/month',
    contracts: 'CF-9281 (active)', sla: '96.8% OTD', capacity: '94% utilized',
    risks: '3 active flags', financialExposure: '₹18.4 L at risk',
  };

  const simOutput = (sc) => {
    const outputs = {
      vol_up25:  { cost:'₹11.4 Cr/mo', capacity:'118%', sla:'91.2%', fleet:'+5 trucks', drivers:'+8 drivers', risk:'Medium', savings:'N/A' },
      diesel_10: { cost:'₹9.94 Cr/mo', capacity:'94%', sla:'96.8%', fleet:'No change', drivers:'No change', risk:'Low', savings:'₹3.8L hedging' },
      no_gf_east:{ cost:'₹9.8 Cr/mo', capacity:'84%', sla:'88.4%', fleet:'Reallocate 4 to GF South', drivers:'No change', risk:'High', savings:'N/A' },
      siliguri_relay:{ cost:'₹9.3 Cr/mo', capacity:'93%', sla:'97.8%', fleet:'No change', drivers:'+2 relay drivers', risk:'Low', savings:'₹3.8L/mo' },
      vol_down15:{ cost:'₹7.9 Cr/mo', capacity:'81%', sla:'98.1%', fleet:'-3 trucks', drivers:'No change', risk:'Low', savings:'₹1.2L/mo' },
    };
    return outputs[sc]||{};
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      {/* Digital Twin State (§33) */}
      <div style={s.card()}>
        <SH icon={Brain} title="Customer Transportation Digital Twin — Current State" color="#818cf8">
          <span style={s.pill('#818cf8')}>Live Model</span>
        </SH>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:8 }}>
          {Object.entries(twinState).map(([k,v])=>(
            <div key={k} style={{ padding:'8px', background:'rgba(99,102,241,0.06)', borderRadius:7, border:'1px solid rgba(99,102,241,0.1)' }}>
              <div style={s.lbl()}>{k.replace(/([A-Z])/g,' $1').trim()}</div>
              <div style={{ fontSize:10, fontWeight:700, color:'#e5e7eb', marginTop:3 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulation Scenarios (§33) */}
      <div style={s.card()}>
        <SH icon={Play} title="Simulation Scenarios" color="#10b981"/>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:12 }}>
          {SIMULATION_SCENARIOS.map(sc=>(
            <button key={sc.id} onClick={()=>setScenario(scenario===sc.id?null:sc.id)}
              style={{ padding:'6px 12px', borderRadius:7, border:`1px solid ${scenario===sc.id?'rgba(16,185,129,0.5)':'rgba(255,255,255,0.08)'}`, background:scenario===sc.id?'rgba(16,185,129,0.12)':'rgba(255,255,255,0.03)', color:scenario===sc.id?'#10b981':'#9ca3af', fontSize:9, fontWeight:700, cursor:'pointer' }}>
              {sc.label}
            </button>
          ))}
        </div>
        {scenario && (() => {
          const out = simOutput(scenario);
          return (
            <div style={{ ...s.card({ background:'rgba(16,185,129,0.04)', padding:'12px' }) }}>
              <div style={s.lbl('#10b981')}>Simulation Output</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))', gap:8, marginTop:8 }}>
                {[['Cost/mo',out.cost,'#f9fafb'],['Capacity',out.capacity,'#06b6d4'],['SLA',out.sla,'#10b981'],['Fleet',out.fleet,'#a855f7'],['Drivers',out.drivers,'#f59e0b'],['Risk',out.risk,out.risk==='Low'?'#10b981':out.risk==='Medium'?'#f59e0b':'#ef4444'],['Savings',out.savings,'#22c55e']].map(([k,v,c])=>(
                  <div key={k} style={{ textAlign:'center' }}><div style={{ fontSize:11, fontWeight:800, color:c }}>{v}</div><div style={s.lbl({ marginTop:3 })}>{k}</div></div>
                ))}
              </div>
              <div style={{ marginTop:10, display:'flex', gap:6 }}>
                <Btn onClick={()=>{emitCOS('AgentActionTaken',`Simulation scenario ${scenario} approved`);showNotify('Scenario approved — governance review initiated');}} color="#10b981">Approve & Execute</Btn>
                <Btn onClick={()=>setScenario(null)} color="#6b7280" outline>Cancel</Btn>
              </div>
              <div style={{ fontSize:8, color:'#4b5563', marginTop:6, fontStyle:'italic' }}>⚠ System will never silently rewrite business rules. Changes pass governance and approval policies. (§34)</div>
            </div>
          );
        })()}
      </div>

      {/* Self-Evolution Engine (§34, §45) */}
      <div style={s.card()}>
        <SH icon={GitBranch} title="Self-Evolution Engine (§34) — Kolkata→Guwahati Case (§45)" color="#a855f7">
          <span style={s.pill('#10b981')}>Step {evolStep}/14</span>
        </SH>
        <div style={{ fontSize:8, color:'#6b7280', marginBottom:10 }}>Observation: {KGW_CASE_STUDY.observation}</div>
        <div style={{ display:'flex', flexDirection:'column', gap:4, marginBottom:12 }}>
          {SELF_EVOLUTION_STEPS.map((st,i) => {
            const done=i<evolStep; const curr=i===evolStep;
            return (
              <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ width:22, height:22, borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, background:done?'rgba(16,185,129,0.2)':curr?'rgba(168,85,247,0.2)':'rgba(255,255,255,0.05)', color:done?'#10b981':curr?'#c4b5fd':'#4b5563', fontWeight:800 }}>{done?'✓':st.step}</div>
                <div>
                  <div style={{ fontSize:9, fontWeight:700, color:done?'#10b981':curr?'#c4b5fd':'#6b7280' }}>{st.label}</div>
                  <div style={{ fontSize:8, color:'#6b7280' }}>{st.desc}</div>
                  {curr && st.step<=8 && (
                    <div style={{ fontSize:8, color:'#a5b4fc', marginTop:2 }}>
                      {st.step===7&&`AI Rec: ${KGW_CASE_STUDY.aiRecommendation}`}
                      {st.step===8&&`Status: ${KGW_CASE_STUDY.status}`}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ ...s.card({ background:'rgba(16,185,129,0.06)', padding:'10px' }), marginBottom:10 }}>
          <div style={s.lbl('#10b981')}>Outcome Tracking</div>
          <div style={{ fontSize:9, color:'#e5e7eb', marginTop:4 }}>{KGW_CASE_STUDY.outcomeTracking}</div>
          <div style={{ fontSize:8, color:'#a5b4fc', marginTop:2 }}>{KGW_CASE_STUDY.confidenceImprovement}</div>
        </div>
        <div style={{ display:'flex', gap:6 }}>
          <Btn onClick={()=>setEvolStep(Math.min(13,evolStep+1))} color="#a855f7">Advance Loop →</Btn>
          <Btn onClick={()=>setEvolStep(0)} color="#6b7280" outline>Reset</Btn>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB 15 — ADMINISTRATION (§36, §37, §38)
// ============================================================
export function TabAdmin({ showNotify }) {
  const [view, setView] = useState('users');
  const [notifPrefs, setNotifPrefs] = useState(() => {
    const prefs = {};
    NOTIFICATION_EVENTS.forEach(e=>{ prefs[e.id]={ inApp:true, email:e.critical, sms:e.critical, whatsapp:false, push:true }; });
    return prefs;
  });

  const mockUsers = [
    { name:'Arjun Kapoor', role:'Customer Admin', email:'arjun.kapoor@tatamotors.com', status:'Active', lastLogin:'Today 09:10' },
    { name:'Ritu Mehta', role:'Logistics Manager', email:'ritu.mehta@tatamotors.com', status:'Active', lastLogin:'Today 08:42' },
    { name:'Anjali Verma', role:'Finance', email:'anjali.verma@tatamotors.com', status:'Active', lastLogin:'Yesterday 16:30' },
    { name:'Deepak Sharma', role:'Procurement', email:'deepak.sharma@tatamotors.com', status:'Active', lastLogin:'Today 10:15' },
  ];

  function renderOrgNode(node, depth=0) {
    const ICONS = { Enterprise:'🏛️', 'Business Unit':'🏢', Region:'🗺️', Branch:'🏬', Warehouse:'🏪', 'Cost Center':'💰' };
    return (
      <div key={node.name} style={{ paddingLeft:depth*16 }}>
        <div style={{ display:'flex', gap:8, alignItems:'center', padding:'5px 0', borderBottom:'1px solid rgba(255,255,255,0.03)' }}>
          <span>{ICONS[node.level]||'📍'}</span>
          <span style={s.pill('#6366f1')}>{node.level}</span>
          <span style={{ fontSize:9, color:'#e5e7eb' }}>{node.name}</span>
        </div>
        {node.children?.map(c=>renderOrgNode(c,depth+1))}
      </div>
    );
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        {[['users','Users & Roles'],['org','Organization'],['notifications','Notifications'],['security','Security Status']].map(([v,l])=>(
          <button key={v} onClick={()=>setView(v)} style={{ padding:'6px 14px', borderRadius:99, border:'none', cursor:'pointer', fontSize:9, fontWeight:700, background:view===v?'rgba(99,102,241,0.25)':'rgba(255,255,255,0.05)', color:view===v?'#a5b4fc':'#6b7280', textTransform:'uppercase' }}>{l}</button>
        ))}
      </div>

      {view==='users' && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:4 }}>
            <span style={{ fontSize:10, fontWeight:700, color:'#e5e7eb' }}>Users</span>
            <Btn onClick={()=>{emitCOS('AgentActionTaken','New user invited');showNotify('Invite sent');}} color="#6366f1">+ Invite User</Btn>
          </div>
          {mockUsers.map((u,i)=>(
            <div key={i} style={{ padding:'10px 12px', background:'rgba(255,255,255,0.02)', borderRadius:8, border:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'rgba(99,102,241,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'#818cf8', fontWeight:900, flexShrink:0 }}>{u.name[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, fontWeight:700, color:'#e5e7eb' }}>{u.name}</div>
                <div style={{ fontSize:8, color:'#6b7280' }}>{u.email} · Last: {u.lastLogin}</div>
              </div>
              <span style={s.pill('#818cf8')}>{u.role}</span>
              <span style={s.pill('#10b981')}>{u.status}</span>
            </div>
          ))}

          <div style={s.card()}>
            <SH icon={Shield} title="Roles & Permission Matrix" color="#818cf8"/>
            <div style={{ fontSize:8, color:'#4b5563', marginBottom:8 }}>10 permission types per role. All actions validated at gateway layer. (§36)</div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:8 }}>
                <thead>
                  <tr style={{ background:'rgba(0,0,0,0.3)' }}>
                    <th style={{ padding:'5px 8px', textAlign:'left', color:'#6b7280', textTransform:'uppercase' }}>Role</th>
                    {PERMISSION_TYPES.map(p=><th key={p} style={{ padding:'5px 4px', textAlign:'center', color:'#6b7280', textTransform:'uppercase', whiteSpace:'nowrap' }}>{p.replace('_',' ')}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {CUSTOMER_ROLES.map(role=>(
                    <tr key={role.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding:'5px 8px', color:'#e5e7eb', fontWeight:600, whiteSpace:'nowrap' }}>{role.label}</td>
                      {PERMISSION_TYPES.map(p=>(
                        <td key={p} style={{ padding:'5px 4px', textAlign:'center', color:role.permissions.includes(p)?'#10b981':'#374151' }}>
                          {role.permissions.includes(p)?'✓':'–'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {view==='org' && (
        <div style={s.card()}>
          <SH icon={Building} title="6-Level Organization Hierarchy (§37)" color="#06b6d4"/>
          <div style={{ fontSize:8, color:'#4b5563', marginBottom:10 }}>Permissions, budgets, reporting, and visibility all respect this hierarchy.</div>
          {renderOrgNode(ORG_HIERARCHY)}
        </div>
      )}

      {view==='notifications' && (
        <div style={s.card()}>
          <SH icon={Bell} title="Notification Preferences (§38)" color="#f59e0b"/>
          <div style={{ fontSize:8, color:'#4b5563', marginBottom:10 }}>⚠ Critical alerts (marked 🔴) override normal preferences as per contractual/operational requirement.</div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:9 }}>
              <thead>
                <tr style={{ background:'rgba(0,0,0,0.3)' }}>
                  <th style={{ padding:'6px 10px', textAlign:'left', color:'#6b7280', textTransform:'uppercase', fontSize:8 }}>Event</th>
                  {['In-App','Email','SMS','WhatsApp','Push'].map(ch=><th key={ch} style={{ padding:'6px 8px', textAlign:'center', color:'#6b7280', textTransform:'uppercase', fontSize:8 }}>{ch}</th>)}
                </tr>
              </thead>
              <tbody>
                {NOTIFICATION_EVENTS.map(ev=>(
                  <tr key={ev.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding:'6px 10px', color:'#e5e7eb', whiteSpace:'nowrap' }}>
                      {ev.critical&&<span style={{ color:'#ef4444', marginRight:4 }}>🔴</span>}{ev.label}
                    </td>
                    {['inApp','email','sms','whatsapp','push'].map(ch=>(
                      <td key={ch} style={{ padding:'6px 8px', textAlign:'center' }}>
                        {ev.critical && ch!=='inApp' ? (
                          <span style={{ color:'#10b981', fontSize:10 }}>✓</span>
                        ) : (
                          <button onClick={()=>setNotifPrefs(p=>({...p,[ev.id]:{...p[ev.id],[ch]:!p[ev.id][ch]}}))}
                            style={{ width:22, height:12, borderRadius:99, border:'none', cursor:'pointer', background:notifPrefs[ev.id]?.[ch]?'#10b981':'rgba(255,255,255,0.1)', position:'relative', transition:'background 0.2s' }}>
                            <div style={{ position:'absolute', top:1, left:notifPrefs[ev.id]?.[ch]?10:1, width:10, height:10, borderRadius:'50%', background:'#fff', transition:'left 0.2s' }}/>
                          </button>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view==='security' && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {[['Session Security','Active session · MFA ✓ · Last login: Today 09:10 · IP: 192.168.1.x','#10b981'],['RBAC Status','Customer Admin role · 10 permissions · Tenant: TML-001 · Isolation: Active','#06b6d4'],['Rate Limiting','Current: 12 req/min · Limit: 100/min · No violations','#10b981'],['Audit Logging','All actions logged · 247 events today · Retention: 7 years','#a855f7'],['Anomaly Detection','No anomalies detected today · ML model v2.4 · Last scan: 13:58','#10b981']].map(([k,v,c])=>(
            <div key={k} style={{ ...s.card(), borderLeft:`3px solid ${c}` }}>
              <div style={{ fontSize:10, fontWeight:700, color:c, marginBottom:4 }}>{k}</div>
              <div style={{ fontSize:9, color:'#9ca3af' }}>{v}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// TAB 16 — INTEGRATIONS (§2, §39)
// ============================================================
export function TabIntegrations({ showNotify }) {
  const [view, setView] = useState('catalogue');
  const [apiKey, setApiKey] = useState(null);

  const INT_STATUS_COLORS = { Connected:'#10b981', Configured:'#f59e0b', Disconnected:'#ef4444' };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <div style={{ display:'flex', gap:6 }}>
        {[['catalogue','Integration Catalogue'],['api','API Hub'],['webhooks','Webhooks'],['audit','Integration Audit']].map(([v,l])=>(
          <button key={v} onClick={()=>setView(v)} style={{ padding:'6px 14px', borderRadius:99, border:'none', cursor:'pointer', fontSize:9, fontWeight:700, background:view===v?'rgba(99,102,241,0.25)':'rgba(255,255,255,0.05)', color:view===v?'#a5b4fc':'#6b7280', textTransform:'uppercase' }}>{l}</button>
        ))}
      </div>

      {view==='catalogue' && (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ fontSize:8, color:'#4b5563', fontStyle:'italic' }}>All integrations are authenticated, authorized, rate-limited, audited, versioned, and monitorable. Secrets never exposed in frontend. (§39)</div>
          {['ERP','Finance','Telematics','Warehouse','Banking','Tax','Productivity','HR','IoT'].map(cat=>{
            const items=INTEGRATIONS.filter(i=>i.category===cat);
            if(!items.length) return null;
            return (
              <div key={cat}>
                <div style={s.lbl({ marginBottom:6, marginTop:6 })}>{cat}</div>
                <div style={s.grid2}>
                  {items.map(int=>(
                    <div key={int.id} style={{ padding:'10px 12px', background:'rgba(255,255,255,0.02)', borderRadius:8, border:`1px solid ${(INT_STATUS_COLORS[int.status]+'30')||'rgba(255,255,255,0.06)'}`, display:'flex', gap:10, alignItems:'flex-start' }}>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:4 }}>
                          <span style={{ fontSize:10, fontWeight:700, color:'#e5e7eb' }}>{int.name}</span>
                          <span style={s.pill(INT_STATUS_COLORS[int.status]||'#6b7280')}>{int.status}</span>
                        </div>
                        <div style={{ fontSize:8, color:'#6b7280' }}>v{int.version} · Last sync: {int.lastSync}</div>
                        <div style={{ marginTop:4, display:'flex', gap:4, alignItems:'center' }}>
                          <div style={{ flex:1, height:3, background:'rgba(255,255,255,0.05)', borderRadius:2 }}>
                            <div style={{ width:`${int.health}%`, height:'100%', background:int.health>90?'#10b981':int.health>50?'#f59e0b':'#ef4444', borderRadius:2 }}/>
                          </div>
                          <span style={{ fontSize:8, color:'#6b7280' }}>{int.health}%</span>
                        </div>
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                        <Btn onClick={()=>{emitCOS('AgentActionTaken',`Integration ${int.name} synced`);showNotify(`${int.name} sync triggered`);}} color="#6366f1">Sync</Btn>
                        {int.status==='Disconnected'&&<Btn onClick={()=>{emitCOS('AgentActionTaken',`${int.name} reconnect attempted`);showNotify('Reconnect initiated');}} color="#10b981">Reconnect</Btn>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view==='api' && (
        <div style={s.card()}>
          <SH icon={Key} title="API Hub" color="#06b6d4">
            <Btn onClick={()=>{ setApiKey('gft_'+Math.random().toString(36).substring(2,18)); showNotify('API key generated — store securely, shown only once'); }} color="#10b981">Generate Key</Btn>
          </SH>
          {apiKey && (
            <div style={{ padding:'10px 12px', background:'rgba(16,185,129,0.06)', borderRadius:8, border:'1px solid rgba(16,185,129,0.2)', marginBottom:12 }}>
              <div style={s.lbl('#ef4444')}>⚠ API Key — Copy now, shown only once</div>
              <div style={{ fontFamily:'monospace', fontSize:11, color:'#10b981', marginTop:4, wordBreak:'break-all' }}>{apiKey}</div>
              <div style={{ fontSize:8, color:'#6b7280', marginTop:4 }}>Never expose in frontend code. Use server-side only. (§39)</div>
            </div>
          )}
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[['REST API Endpoint','https://api.gatifleet.com/v2/customer'],['OAuth 2.0 Token URL','https://auth.gatifleet.com/oauth/token'],['WebSocket (Live Tracking)','wss://ws.gatifleet.com/v2/tracking'],['SFTP Endpoint','sftp://sftp.gatifleet.com/customer/{id}'],['EDI Gateway','https://edi.gatifleet.com/v1/transactions']].map(([k,v])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <div><div style={s.lbl()}>{k}</div><div style={{ fontSize:9, fontFamily:'monospace', color:'#a5b4fc', marginTop:2 }}>{v}</div></div>
                <Btn onClick={()=>showNotify('Endpoint copied')} color="#6b7280" outline>Copy</Btn>
              </div>
            ))}
          </div>
        </div>
      )}

      {view==='webhooks' && (
        <div style={s.card()}>
          <SH icon={Webhook} title="Webhook Registry" color="#a855f7">
            <Btn onClick={()=>showNotify('Webhook endpoint configured')} color="#a855f7">+ Add Webhook</Btn>
          </SH>
          <div style={{ fontSize:8, color:'#4b5563', marginBottom:10 }}>Subscribe to named events. All webhooks authenticated and rate-limited.</div>
          {[{ event:'ShipmentStatusChanged', url:'https://tatamotors.com/hooks/gf-status', active:true },{ event:'InvoiceGenerated', url:'https://sap.tatamotors.com/api/invoice-in', active:true },{ event:'SLAAtRisk', url:'https://ops.tatamotors.com/alerts', active:false }].map((wh,i)=>(
            <div key={i} style={{ padding:'9px 10px', background:'rgba(255,255,255,0.02)', borderRadius:7, border:'1px solid rgba(255,255,255,0.06)', marginBottom:6 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                <span style={s.pill('#818cf8')}>{wh.event}</span>
                <span style={s.pill(wh.active?'#10b981':'#6b7280')}>{wh.active?'Active':'Paused'}</span>
              </div>
              <div style={{ fontFamily:'monospace', fontSize:8, color:'#6b7280' }}>{wh.url}</div>
            </div>
          ))}
        </div>
      )}

      {view==='audit' && (
        <div style={s.card()}>
          <SH icon={Database} title="Integration Audit Log" color="#10b981"/>
          {[{ time:'13:58', int:'Rosmerta GPS', event:'Telemetry sync', status:'OK', records:284 },{ time:'13:45', int:'SAP ERP', event:'Invoice push', status:'OK', records:3 },{ time:'13:00', int:'Manhattan WMS', event:'Inventory sync', status:'OK', records:128 },{ time:'12:00', int:'Oracle SCM', event:'Order export', status:'OK', records:42 },{ time:'09:00', int:'Bosch IoT', event:'Sensor heartbeat', status:'Warn', records:0 }].map((log,i)=>(
            <div key={i} style={{ display:'flex', gap:10, alignItems:'center', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize:8, color:'#6b7280', fontFamily:'monospace', width:36 }}>{log.time}</span>
              <span style={{ fontSize:9, color:'#e5e7eb', flex:1 }}>{log.int} — {log.event}</span>
              <span style={{ fontSize:8, color:'#6b7280' }}>{log.records} records</span>
              <span style={s.pill(log.status==='OK'?'#10b981':'#f59e0b')}>{log.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
