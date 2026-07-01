/* eslint-disable */
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, TrendingUp, Target, Handshake, Trophy, Star,
  MessageSquare, Clock, CheckCircle2, AlertTriangle, AlertCircle, Phone,
  Mail, Building2, ArrowUpRight, ArrowDownRight, ChevronRight,
  Filter, Download, Calendar, RefreshCw, Search, Eye,
  MoreVertical, ExternalLink, Heart, Shield, Zap, Award,
  ThumbsUp, ThumbsDown, FileText, Timer, UserCheck, UserX,
  CircleDot, Sparkles, BarChart3, Megaphone, HeartHandshake,
  IndianRupee, BadgeCheck, Gauge, BellRing, RotateCcw, ShieldAlert,
  Check, Play, PlusCircle, Trash, Truck, CircleDollarSign, Percent,
  History, Brain, Scale, Activity, TrendingDown, Network
} from 'lucide-react';
import { 
  crmData, 
  crmCustomers, 
  formatCurrency 
} from '../../data/mockData';
import { RealityEngine } from '../../data/RealityEngine';

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'health', label: 'Customer Health Engine', icon: Heart, badge: 'Intelligence' },
  { id: 'pipeline', label: 'Sales Pipeline', icon: Target },
  { id: 'support', label: 'SLA & Support', icon: MessageSquare },
  { id: 'contracts', label: 'Contracts', icon: FileText },
];

const initialPipeline = [
  {
    id: 'leads',
    title: 'Leads',
    gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    color: '#3b82f6',
    deals: [
      { id: 'DL-001', name: 'Flipkart Logistics', value: 24000000, contact: 'Arjun Reddy', days: 3, priority: 'high' },
      { id: 'DL-002', name: 'BigBasket Express', value: 18000000, contact: 'Priya Sharma', days: 7, priority: 'medium' },
      { id: 'DL-003', name: 'Myntra Fulfillment', value: 31000000, contact: 'Rahul Jain', days: 1, priority: 'high' },
    ],
  },
  {
    id: 'qualified',
    title: 'Qualified',
    gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    color: '#8b5cf6',
    deals: [
      { id: 'DL-004', name: 'Reliance Retail', value: 56000000, contact: 'Anita Desai', days: 12, priority: 'high' },
      { id: 'DL-005', name: 'DMart Supply Chain', value: 42000000, contact: 'Vikram Patel', days: 8, priority: 'medium' },
    ],
  },
  {
    id: 'proposals',
    title: 'Proposals',
    gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    color: '#f59e0b',
    deals: [
      { id: 'DL-006', name: 'Tata Steel Transport', value: 84000000, contact: 'Suresh Kumar', days: 15, priority: 'high' },
      { id: 'DL-007', name: 'Hindustan Unilever', value: 68000000, contact: 'Deepa Nair', days: 10, priority: 'medium' },
    ],
  },
  {
    id: 'negotiations',
    title: 'Negotiations',
    gradient: 'linear-gradient(135deg, #f97316, #fb923c)',
    color: '#f97316',
    deals: [
      { id: 'DL-008', name: 'Amazon India', value: 125000000, contact: 'Karan Mehta', days: 22, priority: 'high' },
      { id: 'DL-009', name: 'ITC Limited', value: 72000000, contact: 'Sneha Gupta', days: 18, priority: 'high' },
    ],
  },
  {
    id: 'closed',
    title: 'Closed Won',
    gradient: 'linear-gradient(135deg, #38CE3C, #4ade80)',
    color: '#38CE3C',
    deals: [
      { id: 'DL-010', name: 'Maruti Suzuki', value: 98000000, contact: 'Anil Singh', days: 0, priority: 'high' },
      { id: 'DL-011', name: 'Asian Paints', value: 54000000, contact: 'Meera Iyer', days: 2, priority: 'medium' },
    ],
  },
];

const initialTickets = [
  { id: 'TCK-2940', customer: 'Larsen & Toubro', issue: 'TRK-00019 axle breakage delayed high-value turbine', priority: 'Urgent', status: 'In Progress', time: '1h ago', assignedTo: 'Supply Chain Agent' },
  { id: 'TCK-2938', customer: 'Wipro Transport', issue: 'Cold-chain sensor high temp alarm (>12°C) on reefer run', priority: 'High', status: 'Open', time: '2h ago', assignedTo: 'Engineering Agent' },
  { id: 'TCK-2931', customer: 'Godrej Consumer', issue: 'NH48 transit delay on Siliguri run due to detour', priority: 'Medium', status: 'Resolved', time: '4h ago', assignedTo: 'Finance Agent' },
  { id: 'TCK-2924', customer: 'Reliance Industries', issue: 'Billing discrepancy on invoice fuel surcharge credit', priority: 'Low', status: 'Resolved', time: '1d ago', assignedTo: 'Finance Agent' }
];

const contractData = {
  active: 342,
  expiringSoon: 28,
  renewalRate: 89.2,
  totalValue: '₹248Cr',
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg-900)',
    padding: '24px 28px 40px',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text-primary)',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'flex-start',
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
  headerIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  iconBadge: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-md)',
    background: 'linear-gradient(135deg, #ec4899, #f472b6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(236, 72, 153, 0.35)',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    letterSpacing: '-0.5px',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    margin: 0,
    marginLeft: '62px',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    padding: '9px 16px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--surface-border)',
    background: 'var(--surface)',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    backdropFilter: 'blur(12px)',
    transition: 'all 0.2s ease',
    fontFamily: 'var(--font-sans)',
  },
  primaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    padding: '9px 18px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'linear-gradient(135deg, #ec4899, #f472b6)',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(236, 72, 153, 0.3)',
    fontFamily: 'var(--font-sans)',
  },
  tabsBar: {
    display: 'flex',
    gap: '4px',
    marginBottom: '28px',
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
    padding: '10px 18px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: active ? 'linear-gradient(135deg, #ec4899, #f472b6)' : 'transparent',
    color: active ? '#fff' : 'var(--text-secondary)',
    fontSize: '13px',
    fontWeight: active ? '600' : '500',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    fontFamily: 'var(--font-sans)',
    boxShadow: active ? '0 2px 8px rgba(236, 72, 153, 0.3)' : 'none',
    position: 'relative',
  }),
  tabBadge: {
    position: 'absolute',
    top: '-6px',
    right: '-4px',
    padding: '2px 6px',
    borderRadius: '8px',
    background: 'var(--danger-500)',
    color: '#fff',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.5px',
  },
  bentoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '24px',
  },
  card: {
    background: 'var(--surface)',
    backdropFilter: 'blur(16px)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--surface-border)',
    padding: '22px',
    position: 'relative',
    overflow: 'hidden',
  },
  cardGlow: (color) => ({
    position: 'absolute',
    top: '-40px',
    right: '-40px',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: color,
    opacity: 0.08,
    filter: 'blur(30px)',
    pointerEvents: 'none',
  }),
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '14px',
  },
  cardLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardIconSmall: (color) => ({
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-sm)',
    background: `${color}18`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  cardValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '6px',
    letterSpacing: '-0.5px',
  },
  cardSubtext: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginTop: '8px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  bentoRow: {
    display: 'grid',
    gridTemplateColumns: '1.8fr 1fr',
    gap: '20px',
    marginBottom: '24px',
  },
  bentoRowBottom: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '24px',
  },
  pipelineRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '14px',
    marginBottom: '24px',
  },
  pipelineCol: {
    background: 'var(--surface)',
    backdropFilter: 'blur(16px)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--surface-border)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '450px',
  },
  pipelineHeader: (gradient) => ({
    padding: '14px 16px',
    background: gradient,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }),
  pipelineTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  pipelineCount: {
    fontSize: '15px',
    fontWeight: '800',
    color: '#fff',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '20px',
    padding: '2px 10px',
  },
  pipelineBody: {
    padding: '12px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    overflowY: 'auto',
  },
  dealCard: {
    padding: '14px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-800)',
    border: '1px solid var(--surface-border)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  dealName: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginBottom: '6px',
  },
  dealValue: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--primary-400)',
    fontFamily: 'var(--font-mono)',
    marginBottom: '8px',
  },
  dealMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  dealPriority: (priority) => {
    const colors = { high: '#FF4D6B', medium: '#FFDE73', low: '#38CE3C' };
    const c = colors[priority] || '#6366f1';
    return {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: c,
      display: 'inline-block',
      marginRight: '4px',
    };
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: '0 6px',
  },
  th: {
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    padding: '8px 12px',
  },
  tr: {
    background: 'var(--bg-800)',
    transition: 'all 0.2s ease',
  },
  td: {
    padding: '14px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    borderTop: '1px solid var(--surface-border)',
    borderBottom: '1px solid var(--surface-border)',
  },
  tdFirst: {
    padding: '14px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    borderTop: '1px solid var(--surface-border)',
    borderBottom: '1px solid var(--surface-border)',
    borderLeft: '1px solid var(--surface-border)',
    borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
  },
  tdLast: {
    padding: '14px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    borderTop: '1px solid var(--surface-border)',
    borderBottom: '1px solid var(--surface-border)',
    borderRight: '1px solid var(--surface-border)',
    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
  },
  healthBar: (score) => {
    const color = score >= 80 ? '#38CE3C' : score >= 60 ? '#FFDE73' : score >= 40 ? '#f97316' : '#FF4D6B';
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color,
      fontWeight: '700',
      fontSize: '13px',
      fontFamily: 'var(--font-mono)',
    };
  },
  healthTrack: {
    width: '60px',
    height: '6px',
    borderRadius: '3px',
    background: 'var(--bg-600)',
    overflow: 'hidden',
  },
  healthFill: (score) => {
    const color = score >= 80 ? '#38CE3C' : score >= 60 ? '#FFDE73' : score >= 40 ? '#f97316' : '#FF4D6B';
    return {
      height: '100%',
      width: `${score}%`,
      borderRadius: '3px',
      background: color,
    };
  },
  badgeStatus: (status) => {
    let bg = 'rgba(99, 102, 241, 0.1)';
    let text = 'var(--primary-400)';
    if (status === 'critical' || status === 'high' || status === 'EXPIRED' || status === 'ROUTE_MISMATCH' || status === 'Urgent') {
      bg = 'rgba(255, 77, 107, 0.1)';
      text = 'var(--danger-500)';
    } else if (status === 'medium' || status === 'NEAR_DESTINATION' || status === 'In Progress' || status === 'Warning') {
      bg = 'rgba(255, 222, 115, 0.1)';
      text = 'var(--warning-500)';
    } else if (status === 'low' || status === 'healthy' || status === 'MATCHED' || status === 'Resolved' || status === 'Active') {
      bg = 'rgba(56, 206, 60, 0.1)';
      text = 'var(--success-500)';
    }
    return {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '600',
      background: bg,
      color: text
    };
  },
  actionMiniBtn: (type = 'primary') => ({
    border: 'none',
    background: type === 'primary' ? 'var(--gradient-primary)' : 'var(--bg-600)',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    boxShadow: type === 'primary' ? '0 2px 6px rgba(99, 102, 241, 0.2)' : 'none',
    transition: 'all 0.2s',
  }),
  // SUPPORT CARDS
  supportCard: (color) => ({
    padding: '18px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-800)',
    border: '1px solid var(--surface-border)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  }),
  supportGlow: (color) => ({
    position: 'absolute',
    top: '-20px',
    right: '-20px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: color,
    opacity: 0.1,
    filter: 'blur(20px)',
    pointerEvents: 'none',
  }),
  supportValue: {
    fontSize: '26px',
    fontWeight: '800',
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  supportLabel: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  starRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
    marginTop: '6px',
  },
  contractItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 18px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-800)',
    border: '1px solid var(--surface-border)',
    marginBottom: '10px',
  },
  contractLabel: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  contractValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--text-primary)',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    background: 'var(--bg-600)',
    overflow: 'hidden',
  },
  progressFill: (pct, color) => ({
    height: '100%',
    width: `${pct}%`,
    borderRadius: '4px',
    background: `linear-gradient(90deg, ${color}, ${color}cc)`,
  }),
  // DRAWER STYLES
  drawerOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    backdropFilter: 'blur(3px)',
  },
  drawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '420px',
    height: '100vh',
    background: 'var(--bg-800)',
    borderLeft: '1px solid var(--surface-border)',
    boxShadow: 'var(--shadow-2xl)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  drawerHeader: {
    padding: '24px 28px',
    background: 'var(--bg-700)',
    borderBottom: '1px solid var(--border-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawerTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  drawerSubtitle: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  drawerClose: {
    border: 'none',
    background: 'transparent',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  drawerBody: {
    padding: '24px 28px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  drawerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  drawerLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  aiInsightBox: {
    background: 'rgba(236, 72, 153, 0.06)',
    border: '1px solid rgba(236, 72, 153, 0.15)',
    borderRadius: 'var(--radius-md)',
    padding: '16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  aiRecommendationBtn: {
    width: '100%',
    padding: '12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--surface-border)',
    background: 'var(--surface)',
    color: 'var(--text-secondary)',
    fontSize: '13px',
    fontWeight: '600',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  toast: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    background: 'var(--bg-800)',
    border: '1px solid #ec4899',
    borderRadius: 'var(--radius-md)',
    boxShadow: '0 8px 30px rgba(236,72,153,0.2)',
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    zIndex: 9999,
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    width: '440px',
    background: 'var(--bg-700)',
    border: '1px solid var(--surface-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '28px',
    boxShadow: 'var(--shadow-2xl)',
  },
  formGroup: {
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    background: 'var(--bg-800)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontSize: '13.5px',
    outline: 'none',
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 28 },
  },
};

const SignalBox = ({ title, what, why, will, should, auto }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    <div style={{ borderLeft: '3px solid #ec4899', paddingLeft: '12px', marginBottom: '4px' }}>
      <div style={{ fontSize: '11px', color: '#ec4899', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>What Happened</div>
      <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', marginTop: '2px', lineHeight: 1.4 }}>{what}</div>
    </div>
    <div style={{ borderLeft: '3px solid var(--warning-500)', paddingLeft: '12px', marginBottom: '4px' }}>
      <div style={{ fontSize: '11px', color: 'var(--warning-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Why</div>
      <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', marginTop: '2px', lineHeight: 1.4 }}>{why}</div>
    </div>
    <div style={{ borderLeft: '3px solid #8b5cf6', paddingLeft: '12px', marginBottom: '4px' }}>
      <div style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>What Will Happen (Prediction)</div>
      <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', marginTop: '2px', lineHeight: 1.4 }}>{will}</div>
    </div>
    <div style={{ borderLeft: '3px solid var(--success-500)', paddingLeft: '12px', marginBottom: '4px' }}>
      <div style={{ fontSize: '11px', color: 'var(--success-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>What Should Happen (AI Prescription)</div>
      <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', marginTop: '2px', lineHeight: 1.4 }}>{should}</div>
    </div>
    {auto && (
      <div style={{ borderLeft: '3px solid #3b82f6', paddingLeft: '12px' }}>
        <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Auto-healed by Sentinel-X</div>
        <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', marginTop: '2px', lineHeight: 1.4 }}>{auto}</div>
      </div>
    )}
  </div>
);

const getEvolutionTimeline = (custId) => {
  const timelines = {
    'CUS-001': [
      { year: '2019', title: 'Onboarded', desc: 'Onboarded for auto component transit. Initial contract margin 22%.' },
      { year: '2021', title: 'SLA Peak', desc: 'Reached record 98% SLA compliance. Expanded logistics corridor in West Zone.' },
      { year: '2023', title: 'FASTag Integration', desc: 'Smart GPS & FASTag auto-billing launched. Payment cycles dropped to 2 days.' },
      { year: '2025', title: 'Spot Negotiations', desc: 'Successfully renewed contract against regional spot pricing competitors.' },
      { year: '2026', title: 'Current state', desc: 'Highly stable enterprise partnership. Expansion planned for Q3.' }
    ],
    'CUS-002': [
      { year: '2019', title: 'Jamnagar Refinery Run', desc: 'Onboarded for refinery cargo logistics. Dedicated fuel surcharges active.' },
      { year: '2022', title: 'Refinery Disruption', desc: 'Refinery detours caused billing dispute. Settlement delayed by 30 days.' },
      { year: '2024', title: 'Dedicated Reefers', desc: 'Allocated 50 temperature-controlled reefers to Jamnagar-Jaipur route.' },
      { year: '2025', title: 'BlackBuck Threat', desc: 'Competitor spot rate pitches detected on Western corridor.' },
      { year: '2026', title: 'Billing Deadlock', desc: 'Detention charges disputed. Active churn threat rising due to spot rates.' }
    ],
    'CUS-004': [
      { year: '2019', title: 'Infrastructure Contract', desc: 'Onboarded for heavy machinery transit. Initial margin baseline 20%.' },
      { year: '2021', title: 'Payment Backlogs', desc: 'Project financing issues. Payment delay days spiked to 18 days.' },
      { year: '2023', title: 'SLA Stabilization', desc: 'Dedicated terminal allocation restored OTD SLA to 92%.' },
      { year: '2025', title: 'VRL Pitch', desc: 'VRL Logistics pitch detected near Kolkata depot.' },
      { year: '2026', title: 'Axle Breakdown', desc: 'Axle breakage on TRK-00019 near Gurugram; heavy machinery cargo delayed by 12 hours. Sentiment negative.' }
    ]
  };
  
  return timelines[custId] || [
    { year: '2019', title: 'Account Onboarded', desc: 'Onboarded for regional container shipment runs.' },
    { year: '2022', title: 'Route Expansion', desc: 'Expanded contract volume across interstate lanes.' },
    { year: '2025', title: 'GPS Upgrade', desc: 'All contract trailers upgraded to live ADAS telemetry.' },
    { year: '2026', title: 'Operational Status', desc: 'Steady performance; regular billing cycles.' }
  ];
};

const CRMDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // STATE MANAGEMENT FOR ENGINE
  const [customers, setCustomers] = useState(crmCustomers);
  const [pipeline, setPipeline] = useState(initialPipeline);
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  
  // REALITY LOOP & LEDGER STATES
  const [activities, setActivities] = useState([
    { id: 'act-0', timestamp: new Date(Date.now() - 3600000).toLocaleTimeString(), type: 'SYSTEM_BOOT', desc: 'Transportation OS CRM Session initialized for Arjun Kapoor (CEO).' },
    { id: 'act-1', timestamp: new Date(Date.now() - 1800000).toLocaleTimeString(), type: 'CONTRACT_AUTO_RENEW', desc: 'Auto-renew policy scanned. 342 contracts verified Active.' },
    { id: 'act-2', timestamp: new Date(Date.now() - 900000).toLocaleTimeString(), type: 'ALGORITHM_HEAL', desc: 'NOC Auto-exception resolution: Rerouted BlueDart run away from NH8 flooding.' }
  ]);

  const [decisionLogs, setDecisionLogs] = useState({
    'CUS-001': [
      { timestamp: '2026-06-18 10:20', overrideAction: 'Waive Toll Dispute Surcharge', expectedOutcome: 'Maintain 97% OTD SLA', actualOutcome: 'SLA maintained at 97.4%', divergence: '0.0%', approvedBy: 'Arjun Kapoor (CEO)', learnedPolicy: 'Auto-approve surcharge disputes under ₹15,000.' }
    ],
    'CUS-002': [
      { timestamp: '2026-06-15 14:05', overrideAction: 'Match Spot Rate (Jaipur Route)', expectedOutcome: 'Prevent Jamnagar refinery volume leakage', actualOutcome: 'Volume secured; margin impact -0.4%', divergence: '-0.1%', approvedBy: 'Arjun Kapoor (CEO)', learnedPolicy: 'Targeted spot pricing matching active.' }
    ]
  });

  const [drawerTab, setDrawerTab] = useState('commercial');

  // INTERACTIVE OPPORTUNITY STATES
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showEditDeal, setShowEditDeal] = useState(false);
  
  // MODALS & INPUTS
  const [showNewLead, setShowNewLead] = useState(false);
  const [newLeadData, setNewLeadData] = useState({ name: '', value: '', contact: '', priority: 'high' });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const selectedCustomer = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  // UNIFIED EVENT DISPATCHER
  const dispatchEvent = (type, desc, meta = {}) => {
    const newEvent = {
      id: `ev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type,
      desc,
      source: 'CRM/COCKPIT',
      metadata: meta
    };
    RealityEngine.events = [newEvent, ...RealityEngine.events];
    RealityEngine.notify();

    setActivities(prev => [
      {
        id: `act-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type,
        desc,
        meta
      },
      ...prev
    ]);
  };

  // DERIVED METRICS FOR METRICS STRIP
  const avgHealth = useMemo(() => {
    return Math.round(customers.reduce((acc, curr) => acc + curr.health, 0) / customers.length);
  }, [customers]);

  const criticalRiskCount = useMemo(() => {
    return customers.filter(c => c.riskStatus === 'critical' || c.riskStatus === 'high').length;
  }, [customers]);

  const pipelineTotal = useMemo(() => {
    let total = 0;
    pipeline.forEach(col => {
      col.deals.forEach(deal => {
        total += deal.value;
      });
    });
    return total;
  }, [pipeline]);

  // GROWTH AGENT ACTION HANDLERS
  const handleWaivePenalty = (id) => {
    const cust = customers.find(c => c.id === id);
    if (!cust) return;

    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const newHealth = Math.min(100, c.health + 8);
        const newRisk = Math.max(0, c.riskScore - 15);
        let newStatus = 'low';
        if (newRisk > 40) newStatus = 'high';
        else if (newRisk > 20) newStatus = 'medium';

        return {
          ...c,
          health: newHealth,
          riskScore: newRisk,
          riskStatus: newStatus,
          disputes: [],
          activeDisputes: 0
        };
      }
      return c;
    }));

    dispatchEvent('PENALTY_WAIVED', `Waived invoice penalty fee for ${cust.name}. Disputed balance resolved.`, { customerId: id });

    setDecisionLogs(prev => ({
      ...prev,
      [id]: [
        {
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          overrideAction: 'Waive Dispute SLA Penalty Fee',
          expectedOutcome: 'Resolve billing deadlock, increase health by +8%',
          actualOutcome: `Health score rose to ${Math.min(100, cust.health + 8)}%`,
          divergence: '0.0% variance',
          approvedBy: 'Arjun Kapoor (CEO)',
          learnedPolicy: 'Auto-approve SLA penalty disputes up to ₹50k for VIP shippers.'
        },
        ...(prev[id] || [])
      ]
    }));
    
    setToast({
      title: 'SLA Penalty Waived',
      message: `Waived invoice penalty fee for ${cust.name}. Disputed balance resolved.`,
      type: 'success'
    });
  };

  const handleGuaranteeCapacity = (id) => {
    const cust = customers.find(c => c.id === id);
    if (!cust) return;

    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const newHealth = Math.min(100, c.health + 10);
        const newRisk = Math.max(0, c.riskScore - 20);
        let newStatus = 'low';
        if (newRisk > 40) newStatus = 'high';
        else if (newRisk > 20) newStatus = 'medium';

        return {
          ...c,
          health: newHealth,
          riskScore: newRisk,
          riskStatus: newStatus,
          slaCompliance: 96.5,
          incidents: c.incidents.map(i => ({ ...i, status: 'Resolved' })),
          capacityDemands: 'Locked (40 dedicated vehicles allocated)'
        };
      }
      return c;
    }));

    dispatchEvent('CAPACITY_GUARANTEED', `Allocated 40 dedicated logistics units for ${cust.name}. SLA index stabilized.`, { customerId: id });

    setDecisionLogs(prev => ({
      ...prev,
      [id]: [
        {
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          overrideAction: 'Guarantee Dedicated Capacity',
          expectedOutcome: 'Secure contract volume, stabilize SLA compliance index',
          actualOutcome: 'SLA index stabilized at 96.5%; 40 units dedicated.',
          divergence: '0.0% variance',
          approvedBy: 'Arjun Kapoor (CEO)',
          learnedPolicy: 'Lock capacity routes 7 days prior to peak festival seasons.'
        },
        ...(prev[id] || [])
      ]
    }));

    setToast({
      title: 'Capacity Secured',
      message: `Allocated 40 dedicated logistics units for ${cust.name}. SLA index stabilized.`,
      type: 'success'
    });
  };

  const handleCeoEscalation = (id) => {
    const cust = customers.find(c => c.id === id);
    if (!cust) return;

    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          strategicScore: 100,
          supportSentiment: 'Positive'
        };
      }
      return c;
    }));

    dispatchEvent('CEO_ESCALATION_TRIGGERED', `Priority corporate review scheduled between Arjun Kapoor & CEO of ${cust.name}.`, { customerId: id });

    setDecisionLogs(prev => ({
      ...prev,
      [id]: [
        {
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          overrideAction: 'CEO Relationship Escalation',
          expectedOutcome: 'Restore strategic alignment; set support sentiment to Positive',
          actualOutcome: 'Scheduled executive call; support sentiment set to Positive.',
          divergence: '+20% trust index gain',
          approvedBy: 'Arjun Kapoor (CEO)',
          learnedPolicy: 'Establish automatic quarterly alignments for premium tier shippers.'
        },
        ...(prev[id] || [])
      ]
    }));

    setToast({
      title: 'Executive Escalate Scheduled',
      message: `Priority corporate review scheduled between Arjun Kapoor & CEO of ${cust.name}.`,
      type: 'success'
    });
  };

  const handleApplyRebate = (id) => {
    const cust = customers.find(c => c.id === id);
    if (!cust) return;

    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const newGrowth = c.growthScore + 10;
        return {
          ...c,
          growthScore: newGrowth,
          competitorActivity: 'Counter-offer applied (Match Rate active)'
        };
      }
      return c;
    }));

    dispatchEvent('REBATE_APPLIED', `Applied 5% contract rebate to competitive route lanes for ${cust.name}.`, { customerId: id });

    setDecisionLogs(prev => ({
      ...prev,
      [id]: [
        {
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          overrideAction: 'Apply Temporary Lane Rebate',
          expectedOutcome: 'Secure competitive route volume; growth score +10',
          actualOutcome: `Growth score rose to ${cust.growthScore + 10}%; volume secured.`,
          divergence: '-0.2% margin deviation',
          approvedBy: 'Arjun Kapoor (CEO)',
          learnedPolicy: 'Spot rate matching policies protect lanes better than general rebates.'
        },
        ...(prev[id] || [])
      ]
    }));

    setToast({
      title: 'Lane Discount Applied',
      message: `Applied 5% contract rebate to competitive route lanes for ${cust.name}.`,
      type: 'success'
    });
  };

  const handleUpdateDeal = (updatedDeal) => {
    setPipeline(prev => prev.map(col => {
      const filteredDeals = col.deals.filter(d => d.id !== updatedDeal.id);
      
      if (col.id === updatedDeal.stage) {
        const exists = col.deals.some(d => d.id === updatedDeal.id);
        const updatedList = exists 
          ? col.deals.map(d => d.id === updatedDeal.id ? updatedDeal : d)
          : [...col.deals, updatedDeal];
        return { ...col, deals: updatedList };
      } else {
        return { ...col, deals: filteredDeals };
      }
    }));

    dispatchEvent('SALES_OPPORTUNITY_UPDATED', `Opportunity ${updatedDeal.name} updated: Stage: ${updatedDeal.stage}, Value: ₹${(updatedDeal.value/10000000).toFixed(1)}Cr.`, { dealId: updatedDeal.id, value: updatedDeal.value });

    setToast({
      title: 'Opportunity Updated',
      message: `Updated deal details for ${updatedDeal.name}.`,
      type: 'success'
    });
    setShowEditDeal(false);
    setSelectedDeal(null);
  };

  const handleDeleteDeal = (dealId, dealName) => {
    setPipeline(prev => prev.map(col => ({
      ...col,
      deals: col.deals.filter(d => d.id !== dealId)
    })));

    dispatchEvent('SALES_OPPORTUNITY_DELETED', `Opportunity ${dealName} (${dealId}) removed from sales pipeline.`, { dealId });

    setToast({
      title: 'Opportunity Removed',
      message: `Removed ${dealName} from sales pipeline.`,
      type: 'success'
    });
    setShowEditDeal(false);
    setSelectedDeal(null);
  };

  // ADD LEAD TO PIPELINE
  const handleAddLead = (e) => {
    e.preventDefault();
    if (!newLeadData.name || !newLeadData.value) return;

    const newDeal = {
      id: `DL-${100 + pipeline.length + 1}`,
      name: newLeadData.name,
      value: Number(newLeadData.value),
      contact: newLeadData.contact || 'Sponsor Pending',
      days: 1,
      priority: newLeadData.priority
    };

    setPipeline(prev => prev.map(col => {
      if (col.id === 'leads') {
        return { ...col, deals: [newDeal, ...col.deals], count: col.count + 1 };
      }
      return col;
    }));

    dispatchEvent('LEAD_OPPORTUNITY_CREATED', `Added ${newDeal.name} worth ₹${(newDeal.value/10000000).toFixed(1)}Cr to sales pipeline.`, { dealId: newDeal.id, value: newDeal.value });

    setToast({
      title: 'Lead Created',
      message: `Added ${newDeal.name} worth ₹${(newDeal.value/10000000).toFixed(1)}Cr to sales pipeline.`,
      type: 'success'
    });
    setShowNewLead(false);
    setNewLeadData({ name: '', value: '', contact: '', priority: 'high' });
  };

  // SUB-TAB LAYOUTS
  const renderOverviewTab = () => {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* KPI Strip */}
        <div style={styles.bentoGrid}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardLabel}>Average Account Health</span>
              <div style={styles.cardIconSmall('var(--primary-500)')}>
                <Heart size={18} color="var(--primary-400)" />
              </div>
            </div>
            <div style={styles.cardValue}>{avgHealth}%</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <Gauge size={13} color="var(--success-500)" />
              <span>SLA & Financial audit index</span>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardLabel}>Accounts at Risk</span>
              <div style={styles.cardIconSmall('var(--danger-500)')}>
                <ShieldAlert size={18} color="var(--danger-500)" />
              </div>
            </div>
            <div style={{ ...styles.cardValue, color: criticalRiskCount > 0 ? 'var(--danger-500)' : 'var(--text-primary)' }}>
              {criticalRiskCount}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <AlertCircle size={13} color="var(--danger-500)" />
              <span>Requires Growth Agent override</span>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardLabel}>Total Pipeline Value</span>
              <div style={styles.cardIconSmall('var(--primary-500)')}>
                <IndianRupee size={18} color="var(--primary-400)" />
              </div>
            </div>
            <div style={styles.cardValue}>₹{(pipelineTotal/10000000).toFixed(1)}Cr</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <TrendingUp size={13} color="var(--success-500)" />
              <span>Across 5 qualification stages</span>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.cardLabel}>SLA Renewal Rate</span>
              <div style={styles.cardIconSmall('var(--success-500)')}>
                <Handshake size={18} color="var(--success-500)" />
              </div>
            </div>
            <div style={styles.cardValue}>{contractData.renewalRate}%</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              <BadgeCheck size={13} color="var(--success-500)" />
              <span>Target: 90% benchmark</span>
            </div>
          </div>
        </div>

        {/* Pipeline & Contract split */}
        <div style={styles.bentoRow}>
          {/* Top customer health snapshot */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>
              <Heart size={18} color="#ec4899" />
              Customer Health Snapshot
              <span style={{ marginLeft: 'auto' }}>
                <button onClick={() => setActiveTab('health')} style={{ ...styles.actionBtn, padding: '6px 12px', fontSize: '12px' }}>
                  Open Health Engine <ChevronRight size={13} />
                </button>
              </span>
            </div>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Health</th>
                  <th style={styles.th}>SLA Compliance</th>
                  <th style={styles.th}>Annualized Revenue</th>
                  <th style={styles.th}>Churn Risk Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.slice(0, 5).map((cust) => (
                  <tr key={cust.id} style={styles.tr}>
                    <td style={styles.tdFirst}>
                      <div style={{ fontWeight: '600', fontSize: '13px' }}>{cust.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {cust.trips.toLocaleString('en-IN')} operations trips
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.healthBar(cust.health)}>
                        <div style={styles.healthTrack}>
                          <div style={styles.healthFill(cust.health)} />
                        </div>
                        {cust.health}
                      </div>
                    </td>
                    <td style={{ ...styles.td, fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
                      {cust.slaCompliance}%
                    </td>
                    <td style={{ ...styles.td, fontWeight: '600', fontFamily: 'var(--font-mono)' }}>
                      ₹{(cust.revenue/10000000).toFixed(1)}Cr
                    </td>
                    <td style={styles.tdLast}>
                      <span style={styles.badgeStatus(cust.riskStatus)}>
                        {cust.riskStatus.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SLA summary */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>
              <Clock size={18} color="var(--primary-500)" />
              SLA Contract Status
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={styles.contractItem}>
                <div>
                  <div style={styles.contractLabel}>Active Enterprise Contracts</div>
                  <div style={{ ...styles.contractValue, color: 'var(--success-500)' }}>{contractData.active}</div>
                </div>
                <CheckCircle2 size={20} color="var(--success-500)" />
              </div>

              <div style={styles.contractItem}>
                <div>
                  <div style={styles.contractLabel}>Contracts Expiring (30d)</div>
                  <div style={{ ...styles.contractValue, color: 'var(--warning-500)' }}>{contractData.expiringSoon}</div>
                </div>
                <BellRing size={20} color="var(--warning-500)" />
              </div>

              <div style={{ padding: '12px', background: 'rgba(236,72,153,0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(236,72,153,0.12)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#ec4899', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={13} /> Churn Proactive Guard
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                  Account Growth Agent suggests dedicated capacity reallocations to stabilize L&T and Wipro contracts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Ledger Activity Feed & Simulation Snapshot */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          {/* Live Activity Feed */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>
              <Activity size={18} color="#ec4899" />
              Growth Agent Reality Ledger (Business Events)
            </div>
            <div style={{
              maxHeight: '220px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              paddingRight: '6px'
            }}>
              {activities.map((act) => (
                <div key={act.id} style={{
                  padding: '10px 14px',
                  background: 'var(--bg-900)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  fontSize: '12.5px'
                }}>
                  <div style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    marginTop: '2px'
                  }}>{act.timestamp}</div>
                  <div style={{ flex: 1 }}>
                    <span style={{
                      fontWeight: 700,
                      color: act.type.includes('WAIV') || act.type.includes('RESOLV') || act.type.includes('GUAR') ? 'var(--success-500)' : act.type.includes('FAIL') || act.type.includes('DEL') ? 'var(--danger-500)' : 'var(--primary-400)',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginRight: '8px',
                      display: 'inline-block',
                      background: 'rgba(255,255,255,0.03)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-subtle)'
                    }}>{act.type}</span>
                    <p style={{ display: 'inline', color: 'var(--text-primary)' }}>{act.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Decision Consensus Overview */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>
              <Brain size={18} color="var(--primary-400)" />
              Autonomous Decision Consensus Matrix
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
              The current overall policy execution certainty benchmark is validated across 5 autonomous AI peer agents.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Scale size={14} color="var(--primary-400)" /> Combined Agent Consensus</span>
                <span style={{ fontWeight: 700, color: 'var(--success-500)' }}>92% Compliance</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--bg-900)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, var(--primary-500), var(--success-500))' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', marginTop: '10px', textAlign: 'center' }}>
                {['RET', 'FIN', 'OPS', 'RSK', 'EXE'].map((agent, i) => {
                  const scores = [98, 85, 90, 92, 95];
                  return (
                    <div key={agent} style={{ padding: '6px 4px', background: 'var(--bg-900)', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>{agent}</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>{scores[i]}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderHealthEngineTab = () => {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Customer list with deep AI signals */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>
            <Heart size={18} color="#ec4899" />
            Customer Health & Risk Diagnostic Engine
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)' }}>
              Real-time monitoring of Operational, Financial, and Sentimental signals
            </span>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Customer ID</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Health Score</th>
                <th style={styles.th}>SLA Performance</th>
                <th style={styles.th}>Payment Delay</th>
                <th style={styles.th}>Bookings Change</th>
                <th style={styles.th}>Support Sentiment</th>
                <th style={styles.th}>Churn Risk Status</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((cust) => (
                <tr key={cust.id} style={styles.tr}>
                  <td style={styles.tdFirst}>
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{cust.id}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ fontWeight: 600, fontSize: '13.5px' }}>{cust.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Revenue: ₹{(cust.revenue/10000000).toFixed(1)}Cr | Growth: +{cust.growthScore}%
                    </div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.healthBar(cust.health)}>
                      <div style={styles.healthTrack}>
                        <div style={styles.healthFill(cust.health)} />
                      </div>
                      {cust.health}%
                    </div>
                  </td>
                  <td style={{ ...styles.td, fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: cust.slaCompliance > 90 ? 'var(--success-500)' : 'var(--danger-500)' }}>
                      {cust.slaCompliance}%
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ color: cust.paymentDelayDays > 15 ? 'var(--danger-500)' : 'var(--text-primary)' }}>
                      {cust.paymentDelayDays} days delay
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ color: cust.bookingsDropPct > 10 ? 'var(--danger-500)' : cust.bookingsDropPct < 0 ? 'var(--success-500)' : 'var(--text-primary)' }}>
                      {cust.bookingsDropPct > 0 ? `-${cust.bookingsDropPct}%` : `+${Math.abs(cust.bookingsDropPct)}%`}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ 
                      fontWeight: 600,
                      color: cust.supportSentiment === 'Positive' ? 'var(--success-500)' : cust.supportSentiment === 'Negative' ? 'var(--danger-500)' : 'var(--warning-500)'
                    }}>
                      {cust.supportSentiment}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badgeStatus(cust.riskStatus)}>
                      {cust.riskStatus.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ ...styles.tdLast, textAlign: 'right' }}>
                    <button 
                      onClick={() => setSelectedCustomerId(cust.id)}
                      style={{ ...styles.actionMiniBtn('secondary'), border: '1px solid var(--surface-border)', background: 'var(--surface)' }}
                    >
                      <Eye size={12} /> Diagnostic
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  };

  const renderPipelineTab = () => {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Enterprise RFQ negotiation and client onboard stages
          </span>
          <button onClick={() => setShowNewLead(true)} style={styles.primaryBtn}>
            <PlusCircle size={15} /> Add New Lead
          </button>
        </div>

        <div style={styles.pipelineRow}>
          {pipeline.map((col) => (
            <div key={col.id} style={styles.pipelineCol}>
              <div style={styles.pipelineHeader(col.gradient)}>
                <span style={styles.pipelineTitle}>{col.title}</span>
                <span style={styles.pipelineCount}>{col.deals.length}</span>
              </div>
              <div style={styles.pipelineBody}>
                {col.deals.map((deal) => (
                  <div 
                    key={deal.id} 
                    style={{
                      ...styles.dealCard,
                      border: '1px solid var(--surface-border)',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setSelectedDeal({ ...deal, stage: col.id });
                      setShowEditDeal(true);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--primary-400)';
                      e.currentTarget.style.boxShadow = '0 0 10px rgba(99, 102, 241, 0.15)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--surface-border)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={styles.dealName}>{deal.name}</div>
                    <div style={styles.dealValue}>₹{(deal.value/10000000).toFixed(1)}Cr</div>
                    <div style={styles.dealMeta}>
                      <span>{deal.contact}</span>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: deal.priority === 'high' ? 'var(--danger-500)' : deal.priority === 'medium' ? 'var(--warning-500)' : 'var(--success-500)'
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: deal.priority === 'high' ? 'var(--danger-500)' : deal.priority === 'medium' ? 'var(--warning-500)' : 'var(--success-500)'
                        }} />
                        {deal.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderSlaSupportTab = () => {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px' }}>
        {/* Support ticket log */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>
            <MessageSquare size={18} color="var(--primary-500)" />
            Active SLA Incidents & Support Log
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Ticket ID</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Issue / Description</th>
                <th style={styles.th}>Priority</th>
                <th style={styles.th}>Assigned Agent</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} style={styles.tr}>
                  <td style={styles.tdFirst}>
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{t.id}</span>
                  </td>
                  <td style={styles.td}>{t.customer}</td>
                  <td style={styles.td}>
                    <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={t.issue}>
                      {t.issue}
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badgeStatus(t.priority)}>
                      {t.priority}
                    </span>
                  </td>
                  <td style={styles.td}>{t.assignedTo}</td>
                  <td style={styles.td}>
                    <span style={styles.badgeStatus(t.status)}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ ...styles.tdLast, textAlign: 'right' }}>
                    {t.status !== 'Resolved' ? (
                      <button 
                        onClick={() => {
                          setTickets(prev => prev.map(tk => tk.id === t.id ? { ...tk, status: 'Resolved' } : tk));
                          dispatchEvent('SUPPORT_CASE_RESOLVED', `Ticket ${t.id} for ${t.customer} marked as resolved. SLA log closed.`, { ticketId: t.id });
                          setToast({
                            title: 'Ticket Resolved',
                            message: `Ticket ${t.id} for ${t.customer} marked as resolved. SLA log closed.`,
                            type: 'success'
                          });
                        }}
                        style={styles.actionMiniBtn('primary')}
                      >
                        Resolve
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={12} color="var(--success-500)" /> Resolved
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Escalation desk stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={styles.card}>
            <div style={styles.sectionTitle}>
              <Timer size={18} color="var(--primary-500)" />
              SLA Resolution Performance
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ ...styles.supportCard('#3b82f6'), background: 'var(--bg-900)' }}>
                <div style={{ ...styles.supportValue, color: 'var(--primary-400)' }}>2.4h</div>
                <div style={styles.supportLabel}>Avg Response Time</div>
              </div>
              <div style={{ ...styles.supportCard('#38CE3C'), background: 'var(--bg-900)' }}>
                <div style={{ ...styles.supportValue, color: 'var(--success-500)' }}>94.2%</div>
                <div style={styles.supportLabel}>FCR Rate</div>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.sectionTitle}>
              <Shield size={18} color="var(--danger-500)" />
              VIP Support SLA Escapes
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>Tata Motors SLA breach risk</span>
                <span style={{ color: 'var(--success-500)', fontWeight: 600 }}>0%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>Wipro SLA breach risk</span>
                <span style={{ color: 'var(--danger-500)', fontWeight: 600 }}>25%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderContractsTab = () => {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={styles.card}>
          <div style={styles.sectionTitle}>
            <FileText size={18} color="var(--primary-500)" />
            Enterprise Service Agreements Register
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Annual Value</th>
                <th style={styles.th}>SLA Commitment</th>
                <th style={styles.th}>Contract End Date</th>
                <th style={styles.th}>Friction Points</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} style={styles.tr}>
                  <td style={styles.tdFirst}>
                    <span style={{ fontWeight: 600 }}>{c.name}</span>
                  </td>
                  <td style={{ ...styles.td, fontFamily: 'var(--font-mono)' }}>
                    ₹{(c.revenue/10000000).toFixed(1)}Cr
                  </td>
                  <td style={styles.td}>{c.slaCompliance}% OTD SLA</td>
                  <td style={styles.td}>{c.contractEnd}</td>
                  <td style={styles.td}>
                    {c.activeDisputes > 0 ? (
                      <span style={{ color: 'var(--danger-500)', fontWeight: 500 }}>
                        {c.activeDisputes} open billing disputes
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>None detected</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badgeStatus(c.riskStatus === 'low' ? 'Active' : 'Warning')}>
                      {c.riskStatus === 'low' ? 'Active' : 'At Churn Risk'}
                    </span>
                  </td>
                  <td style={{ ...styles.tdLast, textAlign: 'right' }}>
                    <button 
                      onClick={() => {
                        dispatchEvent('CONTRACT_RENEWAL_COMMITTED', `Contract for ${c.name} auto-renewed for 12 months (rate locked).`, { customerId: c.id });
                        setToast({
                          title: 'Contract Extended',
                          message: `Contract for ${c.name} auto-renewed for 12 months (rate locked).`,
                          type: 'success'
                        });
                      }}
                      style={styles.actionMiniBtn('primary')}
                    >
                      Auto-Renew
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  };

  return (
    <div style={styles.page}>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            style={styles.toast}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(56, 206, 60, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Check size={16} color="#38CE3C" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-primary)' }}>{toast.title}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{toast.message}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Lead Modal */}
      <AnimatePresence>
        {showNewLead && (
          <div style={styles.modalOverlay}>
            <motion.div 
              style={styles.modal}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div style={{ ...styles.sectionTitle, marginBottom: '20px' }}>
                <Target size={18} color="#ec4899" />
                Add Opportunity to Pipeline
              </div>
              <form onSubmit={handleAddLead}>
                <div style={styles.formGroup}>
                  <span style={styles.label}>Corporate Account</span>
                  <input 
                    type="text" 
                    required 
                    value={newLeadData.name} 
                    onChange={e => setNewLeadData(prev => ({ ...prev, name: e.target.value }))}
                    style={styles.input} 
                    placeholder="e.g. Flipkart Logistics" 
                  />
                </div>
                <div style={styles.formGroup}>
                  <span style={styles.label}>Annual Deal Value (₹)</span>
                  <input 
                    type="number" 
                    required 
                    value={newLeadData.value} 
                    onChange={e => setNewLeadData(prev => ({ ...prev, value: e.target.value }))}
                    style={styles.input} 
                    placeholder="e.g. 24000000" 
                  />
                </div>
                <div style={styles.formGroup}>
                  <span style={styles.label}>Key Executive Sponsor</span>
                  <input 
                    type="text" 
                    value={newLeadData.contact} 
                    onChange={e => setNewLeadData(prev => ({ ...prev, contact: e.target.value }))}
                    style={styles.input} 
                    placeholder="e.g. Arjun Reddy" 
                  />
                </div>
                <div style={styles.formGroup}>
                  <span style={styles.label}>Deal Priority</span>
                  <select 
                    value={newLeadData.priority} 
                    onChange={e => setNewLeadData(prev => ({ ...prev, priority: e.target.value }))}
                    style={{ ...styles.input, background: 'var(--bg-800)' }}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowNewLead(false)} style={styles.actionBtn}>Cancel</button>
                  <button type="submit" style={styles.primaryBtn}>Create Lead</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Customer Diagnostic Side Drawer */}
      <AnimatePresence>
        {selectedCustomerId && selectedCustomer && (
          <>
            <div style={styles.drawerOverlay} onClick={() => setSelectedCustomerId(null)} />
            <motion.div 
              style={{
                ...styles.drawer,
                width: '560px',
                background: 'rgba(15, 22, 36, 0.95)',
                backdropFilter: 'blur(20px)',
                borderLeft: '1px solid rgba(99, 102, 241, 0.2)',
                display: 'flex',
                flexDirection: 'column',
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 210 }}
            >
              {/* Twin Drawer Header */}
              <div style={{
                padding: '24px 28px',
                background: 'var(--bg-700)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={styles.drawerTitle}>{selectedCustomer.name}</div>
                    <span style={styles.badgeStatus(selectedCustomer.riskStatus)}>
                      {selectedCustomer.riskStatus.toUpperCase()} RISK
                    </span>
                  </div>
                  <div style={{ ...styles.drawerSubtitle, display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>ID: {selectedCustomer.id}</span>
                    <span style={{ color: 'var(--text-muted)' }}>|</span>
                    <span style={{ fontWeight: 600, color: 'var(--success-500)' }}>Twin Certainty: 94.6%</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Health Score</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: selectedCustomer.health >= 80 ? 'var(--success-500)' : selectedCustomer.health >= 60 ? 'var(--warning-500)' : 'var(--danger-500)' }}>
                      {selectedCustomer.health}%
                    </div>
                  </div>
                  <button style={styles.drawerClose} onClick={() => setSelectedCustomerId(null)}>✕</button>
                </div>
              </div>

              {/* Cognitive Tab Grid Selector */}
              <div style={{
                padding: '12px 28px',
                background: 'var(--bg-800)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '6px'
              }}>
                {[
                  { id: 'commercial', label: 'Comm.', icon: Building2 },
                  { id: 'operational', label: 'Ops', icon: Truck },
                  { id: 'relationship', label: 'Relation', icon: HeartHandshake },
                  { id: 'financial', label: 'Fin.', icon: CircleDollarSign },
                  { id: 'risk', label: 'Risk', icon: ShieldAlert },
                  { id: 'supply_chain', label: 'Network', icon: Network },
                  { id: 'market', label: 'Market', icon: TrendingUp },
                  { id: 'ai_consensus', label: 'AI Review', icon: Brain },
                  { id: 'prediction', label: 'Simulate', icon: Gauge },
                  { id: 'timelines', label: 'Timeline', icon: Clock }
                ].map(dTab => {
                  const Icon = dTab.icon;
                  const active = drawerTab === dTab.id;
                  return (
                    <button
                      key={dTab.id}
                      onClick={() => setDrawerTab(dTab.id)}
                      style={{
                        padding: '8px 4px',
                        borderRadius: 'var(--radius-sm)',
                        border: active ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-subtle)',
                        background: active ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.01)',
                        color: active ? 'var(--primary-400)' : 'var(--text-secondary)',
                        fontSize: '10px',
                        fontWeight: active ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => { if(!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseLeave={(e) => { if(!active) e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; }}
                    >
                      <Icon size={14} color={active ? 'var(--primary-400)' : 'var(--text-muted)'} />
                      {dTab.label}
                    </button>
                  );
                })}
              </div>

              {/* Drawer Scrollable Content */}
              <div style={{ ...styles.drawerBody, padding: '20px 28px', flex: 1, overflowY: 'auto' }}>
                
                {/* 1. Commercial Brain */}
                {drawerTab === 'commercial' && (
                  <div style={styles.drawerSection}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={styles.drawerLabel}>Commercial Brain Overview</span>
                      <span style={{ fontSize: '11px', color: 'var(--success-500)', fontWeight: 600 }}>VIP Gold Account</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                      <div style={{ padding: '12px', background: 'var(--bg-900)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>LTV Projection</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>₹72.0 Cr</div>
                      </div>
                      <div style={{ padding: '12px', background: 'var(--bg-900)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Contract Margin Target</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>24.6%</div>
                      </div>
                    </div>
                    <SignalBox 
                      title="Commercial Brain"
                      what={`Current annualized shipping contract values stand at ₹${(selectedCustomer.revenue/10000000).toFixed(1)}Cr with active matches.`}
                      why="Corridor expansion in Western and Southern lanes locked via master agreement."
                      will="Expected contract value expansion of +15% in Q3 due to regional hub integrations."
                      should="Initiate match-rate routing rebates on disputed lanes to protect margins."
                      auto="Auto-negotiated fuel surcharge surcharge rate index matches hourly spot price revisions."
                    />
                  </div>
                )}

                {/* 2. Operational Brain */}
                {drawerTab === 'operational' && (
                  <div style={styles.drawerSection}>
                    <span style={styles.drawerLabel}>Operational Brain Signals</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                      <div style={{ padding: '12px', background: 'var(--bg-900)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Operations Trips</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{selectedCustomer.trips}</div>
                      </div>
                      <div style={{ padding: '12px', background: 'var(--bg-900)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SLA compliance</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: selectedCustomer.slaCompliance >= 90 ? 'var(--success-500)' : 'var(--danger-500)', marginTop: '4px' }}>{selectedCustomer.slaCompliance}%</div>
                      </div>
                    </div>
                    <SignalBox 
                      title="Operational Brain"
                      what={`Completed ${selectedCustomer.trips} runs with active capacity demands: ${selectedCustomer.capacityDemands}.`}
                      why="Direct Freight Corridor routes utilized for 68% of runs; axle breakage on TRK-00019 delayed machinery runs."
                      will="ETA delay risks could rise to 12% if Western regional highway flooding continues."
                      should="Guarantee dedicated capacity allocations to stabilize OTD (On Time Delivery) index."
                      auto="NOC automatic rerouting bypassed NH48 toll gridlocks, saving +4.2h average delay."
                    />
                  </div>
                )}

                {/* 3. Relationship Brain */}
                {drawerTab === 'relationship' && (
                  <div style={styles.drawerSection}>
                    <span style={styles.drawerLabel}>Relationship Brain Signals</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                      <div style={{ padding: '12px', background: 'var(--bg-900)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>NPS score</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>78 / 100</div>
                      </div>
                      <div style={{ padding: '12px', background: 'var(--bg-900)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Support Sentiment</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: selectedCustomer.supportSentiment === 'Positive' ? 'var(--success-500)' : selectedCustomer.supportSentiment === 'Negative' ? 'var(--danger-500)' : 'var(--warning-500)', marginTop: '4px' }}>{selectedCustomer.supportSentiment}</div>
                      </div>
                    </div>
                    <SignalBox 
                      title="Relationship Brain"
                      what={`Support tickets logged: ${selectedCustomer.incidents.length} active incidents. Support sentiment rated ${selectedCustomer.supportSentiment}.`}
                      why="SLA incident delays triggered customer disputes and local stakeholder negative feedback loops."
                      will="Escalation risk could breach VP threshold within 48h if disputes remain unsettled."
                      should="Authorize immediate CEO relationship escalation to schedule executive review."
                      auto="Dispatched VIP tokens automatically to account supervisors upon SLA delay logging."
                    />
                  </div>
                )}

                {/* 4. Financial Brain */}
                {drawerTab === 'financial' && (
                  <div style={styles.drawerSection}>
                    <span style={styles.drawerLabel}>Financial Brain Signals</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                      <div style={{ padding: '12px', background: 'var(--bg-900)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Payment Delay Days</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{selectedCustomer.paymentDelayDays} days avg</div>
                      </div>
                      <div style={{ padding: '12px', background: 'var(--bg-900)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Active Disputes</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: selectedCustomer.activeDisputes > 0 ? 'var(--danger-500)' : 'var(--text-primary)', marginTop: '4px' }}>{selectedCustomer.activeDisputes} open</div>
                      </div>
                    </div>
                    <SignalBox 
                      title="Financial Brain"
                      what={`Outstanding disputes: ${selectedCustomer.activeDisputes} disputes. Average payment delay stands at ${selectedCustomer.paymentDelayDays} days.`}
                      why="Detention charge discrepancy siphoned invoice payment clearances."
                      will="Revenue flow lag to increase if penalty chargebacks are held by audit desk."
                      should="Waive penalty fee to release invoice holds and accelerate payment cycles."
                      auto="Auto-credited ₹12,000 for weather delays based on geolocation verification ledger."
                    />
                  </div>
                )}

                {/* 5. Risk Brain */}
                {drawerTab === 'risk' && (
                  <div style={styles.drawerSection}>
                    <span style={styles.drawerLabel}>Risk Brain & Safety Signals</span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                      <div style={{ padding: '12px', background: 'var(--bg-900)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Churn Probability</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: selectedCustomer.riskScore > 30 ? 'var(--danger-500)' : 'var(--success-500)', marginTop: '4px' }}>{selectedCustomer.riskScore}%</div>
                      </div>
                      <div style={{ padding: '12px', background: 'var(--bg-900)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ADAS Safety Rating</div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>91.2% Safe</div>
                      </div>
                    </div>
                    <SignalBox 
                      title="Risk Brain"
                      what={`Churn status flagged as ${selectedCustomer.riskStatus.toUpperCase()} (Risk Score: ${selectedCustomer.riskScore}%).`}
                      why="Axle failures and aggressive competitor matches created relationship friction."
                      will="Competitor spot bids on West lanes could trigger volume leakage of 12%."
                      should="Apply temporary lane match rebate to block competitor pitch."
                      auto="Auto-flagged VRL Logistics matching pitch metrics using email keyword audit scrapers."
                    />
                  </div>
                )}

                {/* 6. Supply Chain Network Brain */}
                {drawerTab === 'supply_chain' && (
                  <div style={styles.drawerSection}>
                    <span style={styles.drawerLabel}>Supply Chain Corridor Utilization</span>
                    <div style={{ padding: '14px', background: 'var(--bg-900)', borderRadius: '6px', border: '1px solid var(--border-subtle)', marginBottom: '14px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Lane Load Factors</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                            <span>Delhi ➔ Mumbai (NH48)</span>
                            <span style={{ fontWeight: 600 }}>68% load factor</span>
                          </div>
                          <div style={{ width: '100%', height: '4px', background: 'var(--bg-600)', borderRadius: '2px', overflow: 'hidden', marginTop: '2px' }}>
                            <div style={{ width: '68%', height: '100%', background: 'var(--primary-500)' }} />
                          </div>
                        </div>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px' }}>
                            <span>Jaipur ➔ Delhi (NH8)</span>
                            <span style={{ fontWeight: 600 }}>82% load factor</span>
                          </div>
                          <div style={{ width: '100%', height: '4px', background: 'var(--bg-600)', borderRadius: '2px', overflow: 'hidden', marginTop: '2px' }}>
                            <div style={{ width: '82%', height: '100%', background: 'var(--primary-500)' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <SignalBox 
                      title="Supply Chain Brain"
                      what="Major logistics flows operate across Western logistics corridors."
                      why="Dedicated warehouse space leased at Jaipur Hub and Panvel Docks."
                      will="Storage congestion forecasted at Panvel Hub due to vessel arrivals."
                      should="Reroute regional backup fleet to secondary transshipment points."
                      auto="Auto-locked 15 reserve container boxes at Delhi Depot for emergency peak dispatch."
                    />
                  </div>
                )}

                {/* 7. Market Intelligence Brain */}
                {drawerTab === 'market' && (
                  <div style={styles.drawerSection}>
                    <span style={styles.drawerLabel}>Market & Competitive Index</span>
                    <div style={{ padding: '14px', background: 'var(--bg-900)', borderRadius: '6px', border: '1px solid var(--border-subtle)', marginBottom: '14px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Tariff Comparison</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '8px' }}>
                        <span>GatiContract Rate</span>
                        <span style={{ fontWeight: 600 }}>₹78.2 / Km</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '4px' }}>
                        <span>Competitor Spot Bids</span>
                        <span style={{ fontWeight: 600, color: 'var(--danger-500)' }}>₹71.8 / Km</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '4px' }}>
                        <span>Spot rate variance</span>
                        <span style={{ fontWeight: 600, color: 'var(--danger-500)' }}>-8.2%</span>
                      </div>
                    </div>
                    <SignalBox 
                      title="Market Brain"
                      what={`Competitor activity: ${selectedCustomer.competitorActivity}.`}
                      why="Carrier oversupply on Mumbai transit route lowered market tariffs."
                      will="Competitor contract pitch could trigger lane volume migration next month."
                      should="Activate matching rebate rates to block seasonal bid requests."
                      auto="Scraped competitive pricing index records directly from spot freight logs."
                    />
                  </div>
                )}

                {/* 8. AI Peer Review & Consensus */}
                {drawerTab === 'ai_consensus' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Agent Review Panel */}
                    <div style={styles.card}>
                      <div style={{ ...styles.sectionTitle, fontSize: '14px', marginBottom: '12px' }}>
                        <Brain size={16} color="var(--primary-400)" />
                        AI Agent Consensus Board
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                          { name: 'Retention Agent', score: 98, rec: 'Allocating dedicated fleet blocks competitor threat.' },
                          { name: 'Finance Agent', score: 85, rec: 'Authorized rebate limit <= 5% to protect margins.' },
                          { name: 'Operations Agent', score: 90, rec: 'Confirmed trailer availability at Jaipur hub.' },
                          { name: 'Risk Agent', score: 92, rec: 'OTD SLA compliance liabilities resolved.' },
                          { name: 'Executive Agent', score: 95, rec: 'Strategic LTV value outweighs override cost.' }
                        ].map((ag) => (
                          <div key={ag.name} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', fontSize: '11.5px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ag.name}</div>
                              <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '1px' }}>{ag.rec}</div>
                            </div>
                            <span style={{ fontWeight: 700, color: 'var(--primary-400)', fontFamily: 'var(--font-mono)' }}>{ag.score}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Account Growth Override Actions */}
                    <div style={styles.card}>
                      <div style={{ ...styles.sectionTitle, fontSize: '14px', marginBottom: '12px' }}>
                        <Zap size={16} color="#ec4899" />
                        AI Action Center overrides
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button 
                          onClick={() => handleGuaranteeCapacity(selectedCustomer.id)}
                          style={styles.aiRecommendationBtn}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-500)'; e.currentTarget.style.color = 'var(--primary-400)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--surface-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                        >
                          <Truck size={15} color="var(--primary-400)" />
                          <div>
                            <div style={{ textAlign: 'left', fontWeight: 600 }}>Guarantee Capacity (Dedicated Fleet)</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 400, marginTop: '2px' }}>Allocates 40 dedicated units. Elevates SLA score to 96.5%.</div>
                          </div>
                        </button>

                        {selectedCustomer.activeDisputes > 0 && (
                          <button 
                            onClick={() => handleWaivePenalty(selectedCustomer.id)}
                            style={styles.aiRecommendationBtn}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--success-500)'; e.currentTarget.style.color = 'var(--success-500)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--surface-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                          >
                            <CircleDollarSign size={15} color="var(--success-500)" />
                            <div>
                              <div style={{ textAlign: 'left', fontWeight: 600 }}>Waive Dispute SLA Penalty Fee</div>
                              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 400, marginTop: '2px' }}>Resolves billing disputes. Increases health score +8%.</div>
                            </div>
                          </button>
                        )}

                        <button 
                          onClick={() => handleApplyRebate(selectedCustomer.id)}
                          style={styles.aiRecommendationBtn}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--warning-500)'; e.currentTarget.style.color = 'var(--warning-500)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--surface-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                        >
                          <Percent size={15} color="var(--warning-500)" />
                          <div>
                            <div style={{ textAlign: 'left', fontWeight: 600 }}>Apply 5% Temporary Route Rebate</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 400, marginTop: '2px' }}>Counter competitor spot offers. Locks contract volume.</div>
                          </div>
                        </button>

                        <button 
                          onClick={() => handleCeoEscalation(selectedCustomer.id)}
                          style={styles.aiRecommendationBtn}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.color = '#ec4899'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--surface-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                        >
                          <Users size={15} color="#ec4899" />
                          <div>
                            <div style={{ textAlign: 'left', fontWeight: 600 }}>CEO-to-CEO Relationship Escalation</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 400, marginTop: '2px' }}>Schedules call between Arjun Kapoor and client sponsors.</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. Scenario & Predict Simulation */}
                {drawerTab === 'prediction' && (
                  <div style={styles.drawerSection}>
                    <span style={styles.drawerLabel}>Multimodal Route Scenario Simulator</span>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
                      Simulating pricing and reliability coefficients across alternative route strategies before dispatch overrides:
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {[
                        { title: 'Scenario A: Dedicated Fleet', cost: '₹4.2L', sla: '96%', margin: '-1.5%', active: true },
                        { title: 'Scenario B: Shared Fleet Allocation', cost: '₹3.6L', sla: '81%', margin: '+0.4%', active: false },
                        { title: 'Scenario C: Third-Party Carrier', cost: '₹3.9L', sla: '78%', margin: '-0.8%', active: false },
                        { title: 'Scenario D: Multimodal Rail Shift', cost: '₹3.1L', sla: '89%', margin: '+1.2%', active: false }
                      ].map((sc) => (
                        <div key={sc.title} style={{
                          padding: '12px',
                          background: sc.active ? 'rgba(99, 102, 241, 0.06)' : 'var(--bg-900)',
                          borderRadius: '6px',
                          border: sc.active ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--border-subtle)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 600 }}>
                            <span style={{ color: sc.active ? 'var(--primary-400)' : 'var(--text-primary)' }}>{sc.title}</span>
                            <span style={{ color: 'var(--success-500)' }}>{sc.sla} SLA Certainty</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                            <span>Estimated Cost: {sc.cost}</span>
                            <span>Margin impact: {sc.margin}</span>
                          </div>
                          <div style={{ width: '100%', height: '4px', background: 'var(--bg-600)', borderRadius: '2px', overflow: 'hidden', marginTop: '6px' }}>
                            <div style={{
                              width: sc.sla,
                              height: '100%',
                              background: sc.active ? 'linear-gradient(90deg, var(--primary-500), var(--success-500))' : 'var(--primary-500)'
                            }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 10. Timelines & Playbooks */}
                {drawerTab === 'timelines' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Evolution Timeline */}
                    <div style={styles.card}>
                      <div style={{ ...styles.sectionTitle, fontSize: '14px', marginBottom: '14px' }}>
                        <Clock size={16} color="var(--primary-400)" />
                        Customer Evolution Timeline (2019-2026)
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderLeft: '2px solid var(--border-subtle)', marginLeft: '8px', paddingLeft: '14px', position: 'relative' }}>
                        {getEvolutionTimeline(selectedCustomer.id).map((evt) => (
                          <div key={evt.year} style={{ position: 'relative', fontSize: '12px' }}>
                            <span style={{
                              position: 'absolute',
                              left: '-20px',
                              top: '2px',
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              background: 'var(--primary-500)',
                              border: '2px solid var(--bg-800)',
                            }} />
                            <div style={{ fontWeight: 700, color: 'var(--primary-400)', fontFamily: 'var(--font-mono)' }}>{evt.year} - {evt.title}</div>
                            <div style={{ color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>{evt.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Organizational Memory Ledger */}
                    <div style={styles.card}>
                      <div style={{ ...styles.sectionTitle, fontSize: '14px', marginBottom: '14px' }}>
                        <History size={16} color="#ec4899" />
                        Organizational Memory Ledger
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {!decisionLogs[selectedCustomer.id] || decisionLogs[selectedCustomer.id].length === 0 ? (
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '14px 0' }}>
                            No session overrides committed yet. Use the AI Review tab to apply override actions.
                          </div>
                        ) : (
                          decisionLogs[selectedCustomer.id].map((log, i) => (
                            <div key={i} style={{ padding: '10px 14px', background: 'var(--bg-900)', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '11.5px', lineHeight: 1.4 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '10.5px', marginBottom: '4px' }}>
                                <span>{log.timestamp}</span>
                                <span style={{ fontWeight: 600 }}>By: {log.approvedBy}</span>
                              </div>
                              <div style={{ fontWeight: 700, color: 'var(--primary-400)' }}>Action: {log.overrideAction}</div>
                              <div style={{ marginTop: '4px' }}><span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Expected Outcome:</span> {log.expectedOutcome}</div>
                              <div style={{ marginTop: '2px' }}><span style={{ color: 'var(--success-500)', fontWeight: 600 }}>Actual Outcome:</span> {log.actualOutcome}</div>
                              <div style={{ marginTop: '2px' }}><span style={{ color: 'var(--warning-500)', fontWeight: 600 }}>Divergence:</span> {log.divergence}</div>
                              <div style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px dashed var(--border-subtle)', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                <span style={{ fontWeight: 700, color: '#ec4899' }}>Playbook Policy:</span> {log.learnedPolicy}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div style={styles.headerRow}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <div style={styles.iconBadge}>
              <HeartHandshake size={24} color="#fff" />
            </div>
            <h1 style={styles.title}>Customer Relationship Management</h1>
          </div>
          <p style={styles.subtitle}>
            Sales pipeline, customer health engine, support tickets & SLA contracts
          </p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.actionBtn}>
            <Calendar size={15} />
            Q2 FY 2026-27
          </button>
          <button style={styles.actionBtn}>
            <Download size={15} />
            Export CRM Report
          </button>
          <button style={styles.primaryBtn}>
            <RefreshCw size={15} />
            Sync Salesforce
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabsBar}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isHealth = tab.id === 'health';
          
          return (
            <motion.button
              key={tab.id}
              style={styles.tab(activeTab === tab.id)}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={15} />
              {tab.label}
              {isHealth && criticalRiskCount > 0 && (
                <span style={styles.tabBadge}>{criticalRiskCount}</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Dynamic Tab Contents */}
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'health' && renderHealthEngineTab()}
      {activeTab === 'pipeline' && renderPipelineTab()}
      {activeTab === 'support' && renderSlaSupportTab()}
      {activeTab === 'contracts' && renderContractsTab()}

      {/* Edit Opportunity Modal */}
      <AnimatePresence>
        {showEditDeal && selectedDeal && (
          <div style={styles.modalOverlay}>
            <motion.div 
              style={styles.modal}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div style={{ ...styles.sectionTitle, marginBottom: '20px' }}>
                <Target size={18} color="#ec4899" />
                Manage Opportunity: {selectedDeal.name}
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateDeal(selectedDeal);
              }}>
                <div style={styles.formGroup}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Corporate Account</span>
                  <input 
                    type="text" 
                    required 
                    value={selectedDeal.name} 
                    onChange={e => setSelectedDeal(prev => ({ ...prev, name: e.target.value }))}
                    style={styles.input} 
                  />
                </div>
                <div style={styles.formGroup}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Annual Deal Value (₹)</span>
                  <input 
                    type="number" 
                    required 
                    value={selectedDeal.value} 
                    onChange={e => setSelectedDeal(prev => ({ ...prev, value: Number(e.target.value) }))}
                    style={styles.input} 
                  />
                </div>
                <div style={styles.formGroup}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Key Executive Sponsor</span>
                  <input 
                    type="text" 
                    value={selectedDeal.contact || ''} 
                    onChange={e => setSelectedDeal(prev => ({ ...prev, contact: e.target.value }))}
                    style={styles.input} 
                  />
                </div>
                <div style={styles.formGroup}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Deal Priority</span>
                  <select 
                    value={selectedDeal.priority} 
                    onChange={e => setSelectedDeal(prev => ({ ...prev, priority: e.target.value }))}
                    style={{ ...styles.input, background: 'var(--bg-800)' }}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Pipeline Stage</span>
                  <select 
                    value={selectedDeal.stage} 
                    onChange={e => setSelectedDeal(prev => ({ ...prev, stage: e.target.value }))}
                    style={{ ...styles.input, background: 'var(--bg-800)' }}
                  >
                    <option value="leads">Leads</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposals">Proposals</option>
                    <option value="negotiations">Negotiations</option>
                    <option value="closed">Closed Won</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                  <button 
                    type="button" 
                    onClick={() => handleDeleteDeal(selectedDeal.id, selectedDeal.name)} 
                    style={{ ...styles.actionBtn, borderColor: 'var(--danger-500)', color: 'var(--danger-500)', marginRight: 'auto' }}
                  >
                    <Trash size={14} /> Remove Opportunity
                  </button>
                  <button type="button" onClick={() => { setShowEditDeal(false); setSelectedDeal(null); }} style={styles.actionBtn}>Cancel</button>
                  <button type="submit" style={styles.primaryBtn}>Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CRMDashboard;
