import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Settings, Shield, Bot, Bell, Key, Cpu, Globe, Activity,
  Database, Save, AlertTriangle, Share2, Lock, RefreshCw,
  Eye, EyeOff, Plus, Trash2, Smartphone, Laptop, Network,
  Grid, SlidersHorizontal, FileText, CheckCircle2, Info
} from 'lucide-react';
import { RealityEngine } from '../../data/RealityEngine';

// Pure deterministic helper to generate heatmap cells statically
const generateActivityCells = () => {
  const weeks = 52;
  const days = 7;
  const cells = [];
  let seed = 42;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < days; d++) {
      let intensity = 0;
      const val = random();
      if (val > 0.4) intensity = 1;
      if (val > 0.7) intensity = 2;
      if (val > 0.85) intensity = 3;
      if (val > 0.95) intensity = 4;
      if (d === 0 && random() > 0.3) intensity = 0;
      if ((d === 2 || d === 3) && intensity > 0) intensity = Math.min(intensity + 1, 4);
      cells.push({ w, d, intensity });
    }
  }
  return cells;
};

const HEATMAP_CELLS = generateActivityCells();

// Custom CSS animation for avatar rotating ring added dynamically
const injectAvatarAnimation = () => {
  const id = 'avatar-animation-styles';
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.innerHTML = `
    @keyframes rotateRing {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes gridPulse {
      0%, 100% { opacity: 0.15; }
      50% { opacity: 0.35; }
    }
    .profile-container {
      display: flex;
      flex-direction: row;
      gap: 24px;
      width: 100%;
      box-sizing: border-box;
      align-items: flex-start;
    }
    .profile-sidebar {
      width: 300px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .profile-content-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
      min-width: 0;
    }
    @media (max-width: 1150px) {
      .profile-container {
        flex-direction: column !important;
        gap: 20px !important;
      }
      .profile-sidebar {
        width: 100% !important;
      }
      .profile-content-area {
        width: 100% !important;
      }
    }
  `;
  document.head.appendChild(style);
};

export default function ProfileSettings() {
  const { theme, toggleTheme, setIsLocked } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Handle Tab Navigation via search params
  const activeTab = searchParams.get('tab') || 'overview';

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  useEffect(() => {
    injectAvatarAnimation();
  }, []);

  // Global Reality Engine State Subscription
  const [engineState, setEngineState] = useState(RealityEngine.getState());
  useEffect(() => {
    return RealityEngine.subscribe((state) => {
      setEngineState(state);
    });
  }, []);

  // Stateful User Settings & Profile data
  const [profile, setProfile] = useState({
    name: 'Arjun Kapoor',
    role: 'CEO',
    company: 'GatiFleet Logistics',
    email: 'arjun.kapoor@gatifleet.ai',
    phone: '+91 98765 43210',
    location: 'Mumbai, Maharashtra, India',
    bio: 'Pioneering the Transportation Reality Engine. Building autonomous agent systems to coordinate logistics infrastructure across 800+ districts in India.',
    timezone: 'Asia/Kolkata (GMT+05:30)',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR (₹)',
    units: 'metric',
    accentColor: 'indigo'
  });

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // Profile Save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    showToast('Digital Twin Profile Identity updated statefully in Reality Engine.');
    RealityEngine.events = [{
      id: `ev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'IDENTITY_UPDATED',
      desc: `User profile fields updated statefully by Super Admin ${profile.name}.`,
      source: 'SYS/PROFILE'
    }, ...RealityEngine.events];
    RealityEngine.notify();
  };

  // Tab 2: Security Fortress State
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [password, setPassword] = useState('•••••••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [apiKeys, setApiKeys] = useState([
    { id: 'key-1', name: 'Production Live Telemetry API', key: 'gf_live_pk_••••••••••••e42f', scope: 'Read/Write', created: '12 May 2026', lastUsed: '2 mins ago' },
    { id: 'key-2', name: 'ZKP Smart Ledger Integration', key: 'gf_zkp_sk_••••••••••••a891', scope: 'Read-Only', created: '18 Jun 2026', lastUsed: '1 hour ago' }
  ]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScope, setNewKeyScope] = useState('Read-Only');

  const handleGenerateKey = () => {
    if (!newKeyName.trim()) return;
    const randomHex = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      key: `gf_${newKeyScope === 'Read-Only' ? 'ro' : 'rw'}_pk_••••••••••••${randomHex.substring(0, 4)}`,
      scope: newKeyScope,
      created: 'Just now',
      lastUsed: 'Never'
    };
    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
    showToast('New secure API Key generated successfully.', 'success');
  };

  const handleRevokeKey = (id) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
    showToast('API access key revoked instantly.', 'warning');
  };

  const [activeSessions, setActiveSessions] = useState([
    { id: 'sess-1', device: 'Desktop MacBook Pro', browser: 'Chrome 125.0', ip: '103.241.12.89', location: 'Mumbai, IND', lastActive: 'Active now', current: true },
    { id: 'sess-2', device: 'iPhone 15 Pro Max', browser: 'Safari Mobile', ip: '103.241.13.11', location: 'Delhi, IND', lastActive: '12 mins ago', current: false },
    { id: 'sess-3', device: 'Linux Workstation', browser: 'Firefox Developer Edition', ip: '157.48.24.110', location: 'Bengaluru, IND', lastActive: '2 days ago', current: false }
  ]);

  const handleTerminateSession = (id) => {
    setActiveSessions(activeSessions.filter(s => s.id !== id));
    showToast('Active device session terminated. Authentication tokens revoked.', 'warning');
  };

  // Tab 3: AI Preferences State
  const [aiSettings, setAiSettings] = useState({
    selectedModel: 'ETA-XGBoost-v4',
    copilotPersona: 'Detailed', // Concise, Balanced, Detailed
    sensitivity: 'Balanced', // Conservative, Balanced, Aggressive
    autoPilotLimit: 90, // Confidence rating above which system autosends executions
    autoPilotOn: true
  });

  // Tab 4: Notifications State
  const [notifMatrix, setNotifMatrix] = useState({
    critical: { email: true, sms: true, push: true, slack: true },
    high: { email: true, sms: false, push: true, slack: true },
    medium: { email: true, sms: false, push: false, slack: true },
    low: { email: false, sms: false, push: false, slack: false }
  });

  const toggleNotifCell = (tier, channel) => {
    setNotifMatrix({
      ...notifMatrix,
      [tier]: {
        ...notifMatrix[tier],
        [channel]: !notifMatrix[tier][channel]
      }
    });
    showToast('Notification preference matrix updated.', 'info');
  };

  // Tab 5: Integration Hub Connections
  const [integrations, setIntegrations] = useState([
    { id: 'int-1', name: 'SAP ERP Logistics', category: 'ERP', status: 'connected', lastSync: '3 mins ago', logo: '💼' },
    { id: 'int-2', name: 'Salesforce CRM Client Hub', category: 'CRM', status: 'connected', lastSync: '10 mins ago', logo: '🌐' },
    { id: 'int-3', name: 'Darwinbox HCM Workforce', category: 'HCM', status: 'connected', lastSync: '1 hour ago', logo: '👥' },
    { id: 'int-4', name: 'Indian National FASTag Registry', category: 'Tolls', status: 'connected', lastSync: 'Just now', logo: '⚡' },
    { id: 'int-5', name: 'Indian Oil (IOCL) Fuel Fleet', category: 'Fuel', status: 'connected', lastSync: '12 mins ago', logo: '⛽' },
    { id: 'int-6', name: 'BlackBuck Broker Marketplace', category: 'Freight', status: 'disconnected', lastSync: '2 days ago', logo: '🚛' }
  ]);

  const toggleIntegration = (id) => {
    setIntegrations(integrations.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'connected' ? 'disconnected' : 'connected';
        showToast(`${item.name} has been ${nextStatus === 'connected' ? 'reconnected' : 'disconnected'}.`, nextStatus === 'connected' ? 'success' : 'warning');
        return { ...item, status: nextStatus, lastSync: nextStatus === 'connected' ? 'Just now' : '-' };
      }
      return item;
    }));
  };

  // Tab 6: Org Tree state (hover node)
  const [hoveredNode, setHoveredNode] = useState(null);

  // Tab 8: Custom Shortcut keys mapping
  const shortcuts = [
    { action: 'Open AI Copilot Sidebar', keys: 'Ctrl + /' },
    { action: 'Navigate to Reality Command Map', keys: 'Ctrl + M' },
    { action: 'Trigger Simulation Scenario run', keys: 'Ctrl + Enter' },
    { action: 'Lock Session instantly', keys: 'Ctrl + Alt + L' },
    { action: 'Export Current Page PDF Report', keys: 'Ctrl + P' }
  ];

  // Design Styling Constants
  const colors = {
    indigo: { primary: '#6366f1', glow: 'rgba(99, 102, 241, 0.2)', bg: 'rgba(99, 102, 241, 0.05)' },
    cyan: { primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.2)', bg: 'rgba(6, 182, 212, 0.05)' },
    emerald: { primary: '#10b981', glow: 'rgba(16, 185, 129, 0.2)', bg: 'rgba(16, 185, 129, 0.05)' },
    rose: { primary: '#f43f5e', glow: 'rgba(244, 63, 94, 0.2)', bg: 'rgba(244, 63, 94, 0.05)' },
    amber: { primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.2)', bg: 'rgba(245, 158, 11, 0.05)' },
    violet: { primary: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.2)', bg: 'rgba(139, 92, 246, 0.05)' }
  };

  const activeColorSet = colors[profile.accentColor] || colors.indigo;

  const styles = {
    container: {
      display: 'flex',
      minHeight: 'calc(100vh - var(--topbar-height))',
      background: 'var(--bg-900)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      padding: '24px',
      gap: '24px',
      boxSizing: 'border-box'
    },
    sidebar: {
      width: '300px',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    contentArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      minWidth: 0 // Prevents layout blowouts
    },
    card: {
      background: 'var(--surface)',
      border: '1px solid var(--surface-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      backdropFilter: 'blur(20px)',
      boxShadow: 'var(--shadow-lg)',
      position: 'relative',
      overflow: 'hidden'
    },
    subCard: {
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '16px',
      transition: 'all 0.3s ease'
    },
    input: {
      width: '100%',
      padding: '10px 14px',
      background: 'rgba(0, 0, 0, 0.25)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      color: 'var(--text-primary)',
      fontSize: 'var(--text-sm)',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s ease',
      fontFamily: 'var(--font-sans)'
    },
    label: {
      display: 'block',
      fontSize: '11px',
      fontWeight: 600,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      marginBottom: '6px'
    },
    btnPrimary: {
      background: `linear-gradient(135deg, ${activeColorSet.primary}, ${activeColorSet.primary}dd)`,
      color: 'var(--text-primary)',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      padding: '10px 20px',
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: `0 4px 12px ${activeColorSet.glow}`,
      transition: 'all 0.2s ease'
    },
    btnSecondary: {
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 20px',
      fontSize: 'var(--text-sm)',
      fontWeight: 500,
      color: 'var(--text-secondary)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s ease'
    },
    grid2: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px'
    },
    grid3: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '16px'
    },
    badge: (bgColor, textColor) => ({
      padding: '2px 8px',
      borderRadius: 'var(--radius-full)',
      fontSize: '10px',
      fontWeight: 700,
      background: bgColor,
      color: textColor,
      display: 'inline-block'
    }),
    toggleContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: '1px solid var(--border-subtle)'
    }
  };

  // Generate Activity Grid data (Heatmap)
  const renderActivityHeatmap = () => {
    const colorsList = [
      'rgba(255,255,255,0.03)', // zero
      'rgba(99, 102, 241, 0.15)', // low
      'rgba(99, 102, 241, 0.35)', // mid
      'rgba(99, 102, 241, 0.65)', // high
      '#6366f1' // extreme
    ];

    return (
      <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
        <svg width="720" height="110" style={{ minWidth: '720px' }}>
          <g transform="translate(10, 10)">
            {HEATMAP_CELLS.map((cell, idx) => {
              const x = cell.w * 13;
              const y = cell.d * 13;
              return (
                <rect
                  key={idx}
                  x={x}
                  y={y}
                  width="10.5"
                  height="10.5"
                  rx="2.5"
                  fill={colorsList[cell.intensity]}
                  style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.2)';
                    e.target.style.transformOrigin = `${x + 5.25}px ${y + 5.25}px`;
                    e.target.style.stroke = 'white';
                    e.target.style.strokeWidth = '1px';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.stroke = 'none';
                  }}
                />
              );
            })}
          </g>
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 10px', fontSize: '10px', color: 'var(--text-muted)' }}>
          <span>Jun 2025</span>
          <span>Dec 2025</span>
          <span>Jun 2026</span>
          <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
            <span>Less</span>
            <span style={{ width: 8, height: 8, background: colorsList[0], borderRadius: 1 }} />
            <span style={{ width: 8, height: 8, background: colorsList[1], borderRadius: 1 }} />
            <span style={{ width: 8, height: 8, background: colorsList[2], borderRadius: 1 }} />
            <span style={{ width: 8, height: 8, background: colorsList[3], borderRadius: 1 }} />
            <span style={{ width: 8, height: 8, background: colorsList[4], borderRadius: 1 }} />
            <span>More</span>
          </div>
        </div>
      </div>
    );
  };

  // Render Org Hierarchy Tree (Interactive SVG)
  const renderOrgTree = () => {
    const nodes = [
      { id: 'root', name: 'Arjun Kapoor', role: 'CEO', x: 250, y: 30, depth: 0, avatar: 'AK' },
      { id: 'cto', name: 'Rajesh Sinha', role: 'CTO (Reality & Tech)', x: 90, y: 110, depth: 1, avatar: 'RS' },
      { id: 'coo', name: 'Priya Nair', role: 'COO (Operations)', x: 250, y: 110, depth: 1, avatar: 'PN' },
      { id: 'cfo', name: 'Amit Sharma', role: 'CFO (Financial Twin)', x: 410, y: 110, depth: 1, avatar: 'AS' },
      { id: 'ai', name: 'Sentinel-X', role: 'Lead AI Orchestrator', x: 90, y: 190, depth: 2, avatar: '🤖' },
      { id: 'wh', name: 'Karan Joshi', role: 'VP Warehousing', x: 250, y: 190, depth: 2, avatar: 'KJ' },
      { id: 'fleet', name: 'R. K. Prasad', role: 'Director Fleets', x: 410, y: 190, depth: 2, avatar: 'RP' }
    ];

    const connections = [
      { from: 'root', to: 'cto' },
      { from: 'root', to: 'coo' },
      { from: 'root', to: 'cfo' },
      { from: 'cto', to: 'ai' },
      { from: 'coo', to: 'wh' },
      { from: 'coo', to: 'fleet' }
    ];

    return (
      <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-md)', padding: '16px', border: '1px solid var(--border-subtle)', position: 'relative' }}>
        <svg width="100%" height="240" viewBox="0 0 500 240" style={{ maxWidth: '100%' }}>
          {/* Edge Connector Lines */}
          {connections.map((conn, idx) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;
            // Draw a clean curved bezier line
            const dy = toNode.y - fromNode.y;
            const pathData = `M ${fromNode.x} ${fromNode.y} C ${fromNode.x} ${fromNode.y + dy/2}, ${toNode.x} ${fromNode.y + dy/2}, ${toNode.x} ${toNode.y}`;
            return (
              <path
                key={idx}
                d={pathData}
                fill="none"
                stroke="rgba(99, 102, 241, 0.2)"
                strokeWidth="2"
                strokeDasharray="4,4"
                className="animated-flow-line"
              />
            );
          })}

          {/* Node Circles */}
          {nodes.map((node) => {
            const isHovered = hoveredNode === node.id;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Node Outer Glow Glow */}
                {isHovered && (
                  <circle
                    r="24"
                    fill="none"
                    stroke={activeColorSet.primary}
                    strokeWidth="3"
                    style={{ filter: `drop-shadow(0 0 8px ${activeColorSet.primary})` }}
                  />
                )}
                {/* Node Background */}
                <circle
                  r="18"
                  fill="var(--bg-700)"
                  stroke={isHovered ? activeColorSet.primary : 'var(--border-subtle)'}
                  strokeWidth="2"
                />
                {/* Avatar text */}
                <text
                  textAnchor="middle"
                  dy="4"
                  fill="var(--text-primary)"
                  style={{ fontSize: '10px', fontWeight: 'bold' }}
                >
                  {node.avatar}
                </text>

                {/* Info Text Bubble (visible always but highlighted) */}
                <g transform="translate(0, 28)">
                  <rect
                    x="-60"
                    y="-8"
                    width="120"
                    height="24"
                    rx="4"
                    fill="rgba(10, 14, 26, 0.85)"
                    stroke={isHovered ? activeColorSet.primary : 'rgba(255,255,255,0.05)'}
                    strokeWidth="1"
                  />
                  <text
                    textAnchor="middle"
                    dy="3"
                    fill="var(--text-primary)"
                    style={{ fontSize: '9px', fontWeight: 600 }}
                  >
                    {node.name}
                  </text>
                  <text
                    textAnchor="middle"
                    dy="11"
                    fill="var(--text-muted)"
                    style={{ fontSize: '7px' }}
                  >
                    {node.role}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {hoveredNode && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: 'var(--bg-700)',
            border: `1px solid ${activeColorSet.primary}`,
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            fontSize: 'var(--text-xs)',
            boxShadow: 'var(--shadow-md)',
            animation: 'fadeIn 0.2s ease'
          }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              {nodes.find(n => n.id === hoveredNode)?.name}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              {nodes.find(n => n.id === hoveredNode)?.role}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '9px', marginTop: 4 }}>
              System clearance: {hoveredNode === 'root' ? 'All (Super Admin)' : 'Standard Read/Write'}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Helper for rendering custom switch
  const renderSwitch = (checked, onChange, activeColor = activeColorSet.primary) => (
    <div
      onClick={onChange}
      style={{
        width: 44,
        height: 22,
        borderRadius: 11,
        background: checked ? activeColor : 'rgba(255,255,255,0.08)',
        border: `1px solid ${checked ? activeColor : 'var(--border-subtle)'}`,
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s ease',
        boxShadow: checked ? `0 0 10px ${activeColor}55` : 'none'
      }}
    >
      <div style={{
        width: 16,
        height: 16,
        borderRadius: '50%',
        background: '#ffffff',
        position: 'absolute',
        top: 2,
        left: checked ? 24 : 2,
        transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }} />
    </div>
  );

  return (
    <div className="profile-container">
      {/* Toast Notification Popup */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            style={{
              position: 'fixed',
              top: '40px',
              right: '40px',
              zIndex: 9999,
              background: 'rgba(26, 35, 50, 0.9)',
              border: `1px solid ${toast.type === 'success' ? 'var(--success-500)' : toast.type === 'warning' ? 'var(--danger-500)' : 'var(--info-500)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '14px 20px',
              color: 'var(--text-primary)',
              fontSize: 'var(--text-sm)',
              boxShadow: 'var(--shadow-xl)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            {toast.type === 'success' && <CheckCircle2 size={18} color="var(--success-500)" />}
            {toast.type === 'warning' && <AlertTriangle size={18} color="var(--danger-500)" />}
            {toast.type === 'info' && <Info size={18} color="var(--info-500)" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT COLUMN: IDENTITY CARD SIDEBAR */}
      <div className="profile-sidebar">
        <div style={styles.card}>
          {/* Background vector line effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: `linear-gradient(90deg, ${activeColorSet.primary}, #ff007f)`
          }} />

          {/* User avatar with animated rotating ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '12px' }}>
            <div style={{
              position: 'relative',
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              padding: '4px',
              background: `linear-gradient(to right, ${activeColorSet.primary}, #ff007f)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 20px ${activeColorSet.glow}`
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'var(--bg-800)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                fontSize: 'var(--text-3xl)',
                fontWeight: 800
              }}>
                AK
              </div>
              <span style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: 'var(--success-500)',
                border: '3px solid var(--bg-800)',
                boxShadow: '0 0 10px var(--success-500)'
              }} />
            </div>

            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginTop: '16px', marginBottom: '2px', color: 'var(--text-primary)' }}>
              {profile.name}
            </h2>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontWeight: 500 }}>
              {profile.role} · {profile.company}
            </span>
          </div>

          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '20px 0' }} />

          {/* Operational Twin parameters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status</span>
              <span style={{ color: 'var(--success-400)', fontWeight: 600 }}>🟢 Online</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Digital Twin ID</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)' }}>USR-CEO-9801</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
              <span style={{ color: 'var(--text-muted)' }}>OCI Impact Score</span>
              <span style={{ color: activeColorSet.primary, fontWeight: 700 }}>{engineState.oci.customerCertainty}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Total Sessions</span>
              <span style={{ color: 'var(--text-primary)' }}>1,247 logins</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Events Dispatched</span>
              <span style={{ color: 'var(--text-primary)' }}>48,512 telemetry</span>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '20px 0' }} />

          {/* Sparkline mini-graph representing Global Operational Certainty Trend */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>GLOBAL NETWORK CERTAINTY</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--success-500)', fontFamily: 'var(--font-mono)' }}>
                {engineState.oci.globalCertainty}%
              </span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: 'var(--radius-sm)' }}>
              {/* Sparkline SVG */}
              <svg width="100%" height="32" viewBox="0 0 200 32" style={{ overflow: 'visible' }}>
                <path
                  d="M0 24 Q 25 10, 50 18 T 100 8 T 150 14 T 200 6"
                  fill="none"
                  stroke={`url(#sparkline-grad-${profile.accentColor})`}
                  strokeWidth="2"
                />
                <defs>
                  <linearGradient id={`sparkline-grad-${profile.accentColor}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={activeColorSet.primary} />
                    <stop offset="100%" stopColor="#ff007f" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Quick Identity Actions */}
          <div style={{ display: 'flex', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
            <button
              onClick={() => {
                alert('Secure Identity Profile exported to Ledger audit archive.');
                showToast('Identity PDF saved in logs/audit/arjun_profile.pdf');
              }}
              style={{ ...styles.btnSecondary, flex: 1, padding: '8px 10px', justifyContent: 'center', fontSize: 'var(--text-xs)' }}
              title="Export Identity Audit Package"
            >
              <FileText size={14} /> Export
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('Secure profile link copied to clipboard.');
              }}
              style={{ ...styles.btnSecondary, flex: 1, padding: '8px 10px', justifyContent: 'center', fontSize: 'var(--text-xs)' }}
              title="Share Identity Code"
            >
              <Share2 size={14} /> Share
            </button>
            <button
              onClick={() => {
                setIsLocked(true);
                showToast('Super Admin console locked.', 'warning');
              }}
              style={{ ...styles.btnSecondary, flex: 1, padding: '8px 10px', justifyContent: 'center', fontSize: 'var(--text-xs)', color: 'var(--danger-500)' }}
              title="Lock System Node"
            >
              <Lock size={14} /> Lock
            </button>
          </div>
        </div>

        {/* Small Reality Engine Watcher */}
        <div style={{ ...styles.card, padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Cpu size={14} color={activeColorSet.primary} />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.05em' }}>REALITY ENGINE HEARTBEAT</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>L1 Active Events</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{engineState.events.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>L2 Entity Graph Size</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{Object.keys(engineState.entities).length} nodes</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>AI Engine Models</span>
              <span style={{ color: 'var(--success-400)' }}>Online ({engineState.learningStats.activeModels.length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: 8-TAB CONSOLE AREA */}
      <div className="profile-content-area">
        {/* TABS SELECTOR BAR */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'var(--bg-800)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          maxWidth: '100%'
        }}>
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'personalization', label: 'AI Preferences', icon: Bot },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'integrations', label: 'Integrations', icon: LinkIcon }, // custom helper for LinkIcon
            { id: 'organization', label: 'Organization', icon: Network },
            { id: 'intelligence', label: 'Intelligence', icon: Cpu },
            { id: 'platform', label: 'Platform Config', icon: Settings }
          ].map((tab) => {
            const isTabActive = activeTab === tab.id;
            const TabIcon = tab.id === 'integrations' ? Globe : tab.icon; // Use Globe as fallback
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  color: isTabActive ? 'white' : 'var(--text-secondary)',
                  background: isTabActive ? `linear-gradient(135deg, ${activeColorSet.primary}, ${activeColorSet.primary}aa)` : 'transparent',
                  transition: 'all 0.2s ease',
                  boxShadow: isTabActive ? `0 2px 6px ${activeColorSet.glow}` : 'none'
                }}
              >
                <TabIcon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ACTIVE TAB CONTENT WINDOW */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {/* ========================================================
                TAB 1: OVERVIEW (DIGITAL IDENTITY TWIN)
                ======================================================== */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={styles.grid2}>
                  {/* L3 User Digital Twin specifications */}
                  <div style={styles.card}>
                    <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={16} color={activeColorSet.primary} />
                      User L3 Digital Twin Dimensions
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={styles.subCard}>
                        <div style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-primary)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px' }}>👤</span> PHYSICAL DIMENSION
                        </div>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: 0 }}>
                          Secure biometric nodes. Geolocation: {profile.location}. Device footprint: Chrome 125, macOS, Android.
                        </p>
                      </div>
                      <div style={styles.subCard}>
                        <div style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-primary)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px' }}>⚡</span> OPERATIONAL DIMENSION
                        </div>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: 0 }}>
                          Super Admin authorization. Oversees Delhi-Mumbai corridors. Directing 6 active AI Agents, 12,480 decisions.
                        </p>
                      </div>
                      <div style={styles.subCard}>
                        <div style={{ fontWeight: 600, fontSize: '12px', color: 'var(--text-primary)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span style={{ fontSize: '14px' }}>📊</span> BEHAVIORAL DIMENSION
                        </div>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: 0 }}>
                          Highly risk-averse. 88% decisions aligned with freight cost minimization goals. Active window: 9 AM - 11 AM IST.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Operational Impact & Behavioral Summary */}
                  <div style={{ ...styles.card, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Bot size={16} color={activeColorSet.primary} />
                        AI Learned Behavioral Profile
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: activeColorSet.primary, marginTop: 6 }} />
                          <div style={{ fontSize: 'var(--text-sm)' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>High Simulation Intensity:</span> Often executes "what-if" fuel and route scenarios prior to scheduling dispatch plans.
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: activeColorSet.primary, marginTop: 6 }} />
                          <div style={{ fontSize: 'var(--text-sm)' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Preferred Analytics:</span> Focuses heavy view metrics on Route Certainty over HCM driver rosters.
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: activeColorSet.primary, marginTop: 6 }} />
                          <div style={{ fontSize: 'var(--text-sm)' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Co-Pilot Synergy:</span> Autonomy settings set to Balanced. Relies on AI recommendations with 90%+ confidence thresholds.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ background: `${activeColorSet.bg}`, border: `1px solid ${activeColorSet.glow}`, borderRadius: 'var(--radius-md)', padding: '12px 16px', marginTop: '16px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: activeColorSet.primary, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        TRE Evolution Upgrade Recommendation
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                        The Reality Engine suggests automating standard Delhi Depot toll refills based on your historical 100% approval rate. Toggle this in AI preferences.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SVG 52-Week Platform Activity Heatmap */}
                <div style={styles.card}>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={16} color={activeColorSet.primary} />
                    Platform Operational Activity History
                  </h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '18px' }}>
                    Capturing events triggered across the GatiFleet Transportation Reality Engine.
                  </p>
                  {renderActivityHeatmap()}
                </div>

                {/* Recent Decision Timeline Ledger */}
                <div style={styles.card}>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <SlidersHorizontal size={16} color={activeColorSet.primary} />
                    Identity Decision Audit Log
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { action: 'Approved Route Divergence NH48 Bypass', status: 'SLA Protected (+22m)', time: '10 mins ago', impact: '₹14,500 penalty avoided', color: 'var(--success-500)' },
                      { action: 'Triggered Sensor Recalibration (TRK-90482)', status: 'OBD Cleared', time: '1 hour ago', impact: 'Breakdown risk minimized', color: 'var(--info-500)' },
                      { action: 'Executed FASTag Plazas Refill (₹4,500)', status: 'Liquidity OK', time: '3 hours ago', impact: 'Zero tolls delay', color: 'var(--success-500)' },
                      { action: 'Authorized Overtime Bonus payout for Rajesh Kumar', status: 'HCM Updated', time: '1 day ago', impact: 'Resignation risk dropped 20%', color: 'var(--success-500)' },
                      { action: 'Modified Autopilot Confidence limit to 90%', status: 'Rule Saved', time: '2 days ago', impact: 'Control threshold aligned', color: 'var(--info-500)' }
                    ].map((item, idx) => (
                      <div key={idx} style={{ ...styles.subCard, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '14px', color: item.color }}>●</span>
                          <div>
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{item.action}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.impact}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={styles.badge('rgba(255,255,255,0.04)', 'var(--text-secondary)')}>{item.status}</span>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: 4 }}>{item.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 2: SECURITY FORTRESS
                ======================================================== */}
            {activeTab === 'security' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={styles.grid2}>
                  {/* Password & MFA controls */}
                  <div style={styles.card}>
                    <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Lock size={16} color={activeColorSet.primary} />
                      Credential Configuration
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={styles.label}>Super Admin Password</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ ...styles.input, paddingRight: '40px' }}
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Animated Password Strength Indicator */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: 4 }}>
                          <span>PASSWORD STRENGTH</span>
                          <span style={{ fontWeight: 600, color: 'var(--success-500)' }}>FORTRESS GRADE (98%)</span>
                        </div>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', display: 'flex', gap: '2px' }}>
                          <div style={{ flex: 1, background: 'var(--danger-500)', borderRadius: '2px' }} />
                          <div style={{ flex: 1, background: 'var(--warning-500)', borderRadius: '2px' }} />
                          <div style={{ flex: 1, background: 'var(--success-500)', borderRadius: '2px' }} />
                          <div style={{ flex: 1, background: 'var(--success-500)', borderRadius: '2px' }} />
                        </div>
                      </div>

                      <div style={styles.divider} />

                      {/* Multi Factor Authentication Toggle */}
                      <div style={styles.toggleContainer}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>Multi-Factor Authentication (MFA)</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Require time-based authentication token on logins.</div>
                        </div>
                        {renderSwitch(mfaEnabled, () => {
                          setMfaEnabled(!mfaEnabled);
                          showToast(mfaEnabled ? 'MFA disabled. Security risk level elevated.' : 'MFA enabled. Security fortified.', mfaEnabled ? 'warning' : 'success');
                        })}
                      </div>

                      <button
                        onClick={() => showToast('Super Admin credential token refreshed.')}
                        style={{ ...styles.btnPrimary, width: '100%', justifyContent: 'center', marginTop: 10 }}
                      >
                        <RefreshCw size={14} /> Update Credentials
                      </button>
                    </div>
                  </div>

                  {/* Active Sessions list */}
                  <div style={styles.card}>
                    <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Smartphone size={16} color={activeColorSet.primary} />
                      Authorized Device Sessions
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {activeSessions.map((sess) => (
                        <div key={sess.id} style={{ ...styles.subCard, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px' }}>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            {sess.device.includes('iPhone') ? <Smartphone size={18} color="var(--text-muted)" /> : <Laptop size={18} color="var(--text-muted)" />}
                            <div>
                              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                                {sess.device} {sess.current && <span style={styles.badge('rgba(99, 102, 241, 0.1)', 'var(--primary-400)')}>current</span>}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                {sess.browser} · {sess.ip} ({sess.location})
                              </div>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sess.lastActive}</span>
                            {!sess.current && (
                              <button
                                onClick={() => handleTerminateSession(sess.id)}
                                style={{
                                  display: 'block',
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--danger-500)',
                                  fontSize: '10px',
                                  cursor: 'pointer',
                                  padding: 0,
                                  marginTop: 4,
                                  fontWeight: 600
                                }}
                              >
                                Terminate
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* API Keys and Token Hub */}
                <div style={styles.card}>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Key size={16} color={activeColorSet.primary} />
                    Secure API Tokens & Integrations
                  </h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    Manage access credentials for subcontractor tracking servers and automated custom script callbacks.
                  </p>

                  {/* Generate Key Input */}
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <label style={styles.label}>Token Name / Purpose</label>
                      <input
                        type="text"
                        placeholder="e.g. Siliguri Depot Telematics sync"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    <div>
                      <label style={styles.label}>Permissions</label>
                      <select
                        value={newKeyScope}
                        onChange={(e) => setNewKeyScope(e.target.value)}
                        style={{ ...styles.input, width: '130px', background: 'var(--bg-800)' }}
                      >
                        <option value="Read-Only">Read-Only</option>
                        <option value="Read/Write">Read/Write</option>
                      </select>
                    </div>
                    <button onClick={handleGenerateKey} style={styles.btnPrimary}>
                      <Plus size={14} /> Generate
                    </button>
                  </div>

                  {/* Keys Grid */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {apiKeys.map((k) => (
                      <div key={k.id} style={{ ...styles.subCard, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{k.name}</div>
                          <div style={{ display: 'flex', gap: '12px', marginTop: 4, alignItems: 'center' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: activeColorSet.primary, background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '4px' }}>
                              {k.key}
                            </span>
                            <span style={styles.badge(k.scope === 'Read-Only' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)', k.scope === 'Read-Only' ? 'var(--info-400)' : 'var(--success-400)')}>
                              {k.scope}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-muted)' }}>
                            <div>Created: {k.created}</div>
                            <div>Last Used: {k.lastUsed}</div>
                          </div>
                          <button
                            onClick={() => handleRevokeKey(k.id)}
                            style={{ background: 'rgba(255,77,107,0.1)', border: 'none', width: 28, height: 28, borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--danger-500)' }}
                            title="Revoke Access Token"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 3: AI PERSONALIZATION ENGINE
                ======================================================== */}
            {activeTab === 'personalization' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={styles.card}>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bot size={16} color={activeColorSet.primary} />
                    Reality Engine AI Agent Personalization
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={styles.grid2}>
                      <div>
                        <label style={styles.label}>Primary Learning Model Selector</label>
                        <select
                          value={aiSettings.selectedModel}
                          onChange={(e) => {
                            setAiSettings({ ...aiSettings, selectedModel: e.target.value });
                            showToast(`Active predictive model updated to ${e.target.value}.`);
                          }}
                          style={{ ...styles.input, background: 'var(--bg-800)' }}
                        >
                          <option value="ETA-XGBoost-v4">ETA-XGBoost-v4 (Recommended)</option>
                          <option value="TollPath-RNN-v1">TollPath-RNN-v1</option>
                          <option value="DynamicSourcing-Transformer">DynamicSourcing-Transformer</option>
                        </select>
                      </div>

                      <div>
                        <label style={styles.label}>AI Copilot Persona Tone</label>
                        <select
                          value={aiSettings.copilotPersona}
                          onChange={(e) => {
                            setAiSettings({ ...aiSettings, copilotPersona: e.target.value });
                            showToast(`Copilot response style configured as ${e.target.value}.`);
                          }}
                          style={{ ...styles.input, background: 'var(--bg-800)' }}
                        >
                          <option value="Concise">Concise & Actionable</option>
                          <option value="Balanced">Balanced Strategy</option>
                          <option value="Detailed">Detailed Diagnostics & Logs</option>
                        </select>
                      </div>
                    </div>

                    <div style={styles.divider} />

                    {/* Autopilot autonomy sliders */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>Autonomous Action Dispatch Limits</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Confidence score threshold before AI Agents execute re-routes, dispatches, and toll loads autonomously.</div>
                        </div>
                        <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: activeColorSet.primary, fontFamily: 'var(--font-mono)' }}>
                          {aiSettings.autoPilotLimit}% confidence
                        </span>
                      </div>
                      <input
                        type="range"
                        min="60"
                        max="99"
                        value={aiSettings.autoPilotLimit}
                        onChange={(e) => setAiSettings({ ...aiSettings, autoPilotLimit: parseInt(e.target.value) })}
                        style={{
                          width: '100%',
                          accentColor: activeColorSet.primary,
                          background: 'rgba(255,255,255,0.06)',
                          height: '6px',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                      />
                    </div>

                    <div style={styles.divider} />

                    <div style={styles.toggleContainer}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>Activate Agent Autopilot</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Allow AI agents to resolve telemetry anomalies, fuel drops, and scheduling exceptions below warning thresholds.</div>
                      </div>
                      {renderSwitch(aiSettings.autoPilotOn, () => {
                        setAiSettings({ ...aiSettings, autoPilotOn: !aiSettings.autoPilotOn });
                        showToast(`Autopilot has been turned ${!aiSettings.autoPilotOn ? 'ON' : 'OFF'}.`, !aiSettings.autoPilotOn ? 'success' : 'warning');
                      })}
                    </div>

                    {/* Recommendation sensitivity */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>Strategic Alert Sensitivity</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Adjust how aggressively recommendations appear on your Executive Dashboard feed.</div>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-800)', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
                        {['Conservative', 'Balanced', 'Aggressive'].map((sens) => {
                          const isSel = aiSettings.sensitivity === sens;
                          return (
                            <button
                              key={sens}
                              onClick={() => {
                                setAiSettings({ ...aiSettings, sensitivity: sens });
                                showToast(`Alert frequency optimized for ${sens} operations.`);
                              }}
                              style={{
                                border: 'none',
                                background: isSel ? activeColorSet.primary : 'transparent',
                                color: isSel ? 'white' : 'var(--text-secondary)',
                                padding: '6px 12px',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {sens}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 4: NOTIFICATION ORCHESTRATOR
                ======================================================== */}
            {activeTab === 'notifications' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={styles.card}>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={16} color={activeColorSet.primary} />
                    Alert Matrix & Delivery Orchestration
                  </h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '20px' }}>
                    Fine-tune priority alert routing rules across multiple communication networks.
                  </p>

                  {/* Channel Matrix Table */}
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                          <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>ALERT TIER</th>
                          <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>SYSTEM EMAIL</th>
                          <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>SMS MODEM</th>
                          <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>IN-APP PUSH</th>
                          <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>SLACK WEBHOOK</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { key: 'critical', label: '🚨 CRITICAL (SOS, Collisions, Theft)', desc: 'Immediate execution exceptions' },
                          { key: 'high', label: '⚠️ HIGH (Delays >1h, Fuel Drops)', desc: 'Active dispatch issues' },
                          { key: 'medium', label: '📊 MEDIUM (SLA Forecast limits)', desc: 'Operational bottlenecks' },
                          { key: 'low', label: 'ℹ️ LOW (GST filed, Roster change)', desc: 'Routine administrative events' }
                        ].map((row) => (
                          <tr key={row.key} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.01)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                            <td style={{ padding: '16px 12px' }}>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.label}</div>
                              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{row.desc}</div>
                            </td>
                            <td style={{ padding: '16px 12px' }}>
                              {renderSwitch(notifMatrix[row.key].email, () => toggleNotifCell(row.key, 'email'))}
                            </td>
                            <td style={{ padding: '16px 12px' }}>
                              {renderSwitch(notifMatrix[row.key].sms, () => toggleNotifCell(row.key, 'sms'))}
                            </td>
                            <td style={{ padding: '16px 12px' }}>
                              {renderSwitch(notifMatrix[row.key].push, () => toggleNotifCell(row.key, 'push'))}
                            </td>
                            <td style={{ padding: '16px 12px' }}>
                              {renderSwitch(notifMatrix[row.key].slack, () => toggleNotifCell(row.key, 'slack'))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={styles.divider} style={{ margin: '24px 0 20px' }} />

                  {/* Escalation Rules & Quiet Hours */}
                  <div style={styles.grid2}>
                    <div>
                      <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>Smart Quiet Hours</h4>
                      <div style={styles.grid2}>
                        <div>
                          <label style={styles.label}>Start Time</label>
                          <input type="time" defaultValue="22:00" style={styles.input} />
                        </div>
                        <div>
                          <label style={styles.label}>End Time</label>
                          <input type="time" defaultValue="06:00" style={styles.input} />
                        </div>
                      </div>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
                        * Only Critical (SOS) alarms bypass quiet hours. Low and Medium alerts are queued as digest payloads.
                      </p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>AI Alert Bundling</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Group Telemetry Flaps</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Auto-combine recurring sensors alerts.</div>
                          </div>
                          {renderSwitch(true, () => showToast('Telemetry grouping active.'))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Digest Reports Delivery</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Send summarized accounting logs daily.</div>
                          </div>
                          {renderSwitch(false, () => showToast('Daily digest active.'))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 5: INTEGRATION HUB
                ======================================================== */}
            {activeTab === 'integrations' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={styles.card}>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={16} color={activeColorSet.primary} />
                    Connected Enterprise Ecosystem
                  </h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '20px' }}>
                    Monitor data streams and authorization status for logistics endpoints, state fastag registries, and fuel card vendors.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {integrations.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          ...styles.subCard,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '12px',
                          borderColor: item.status === 'connected' ? 'rgba(99, 102, 241, 0.15)' : 'var(--border-subtle)',
                          background: item.status === 'connected' ? 'rgba(99, 102, 241, 0.02)' : 'rgba(255,255,255,0.01)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyBetween: 'space-between', width: '100%', alignItems: 'center' }}>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <span style={{ fontSize: '20px' }}>{item.logo}</span>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{item.name}</div>
                              <span style={styles.badge('rgba(255,255,255,0.04)', 'var(--text-muted)')}>{item.category}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {item.status === 'connected' ? `Synced ${item.lastSync}` : 'Offline'}
                          </div>
                          <button
                            onClick={() => toggleIntegration(item.id)}
                            style={{
                              background: item.status === 'connected' ? 'rgba(255, 77, 107, 0.1)' : `rgba(99, 102, 241, 0.15)`,
                              border: 'none',
                              borderRadius: 'var(--radius-sm)',
                              padding: '5px 12px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              color: item.status === 'connected' ? 'var(--danger-500)' : activeColorSet.primary,
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {item.status === 'connected' ? 'Disconnect' : 'Connect'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 6: ORGANIZATION & TEAM
                ======================================================== */}
            {activeTab === 'organization' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={styles.grid2}>
                  {/* Org Tree (Interactive SVG) */}
                  <div style={styles.card}>
                    <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Network size={16} color={activeColorSet.primary} />
                      Organization Identity Structure
                    </h3>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      Interactive map of user hierarchies controlling GatiFleet's intelligence portals.
                    </p>
                    {renderOrgTree()}
                  </div>

                  {/* Team Permissions Matrix */}
                  <div style={styles.card}>
                    <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Shield size={16} color={activeColorSet.primary} />
                      Super Admin Clearance Matrix
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { title: 'Reality Engine (L1 - L10)', desc: 'Access to modify base simulations and autopilots limits.', active: true },
                        { title: 'Compliance ledgers (ERP/FASTag)', desc: 'Access to trigger FASTag refills and input credit payouts.', active: true },
                        { title: 'HCM Telemetry Logs', desc: 'Read/Write telemetry thresholds and safety training dispatches.', active: true },
                        { title: 'Connected API Credentials', desc: 'Revoke and generate system-wide webhook keys.', active: true },
                        { title: 'Department Budget allocations', desc: 'Override transaction volume triggers above ₹5.0 Cr.', active: false }
                      ].map((perm, idx) => (
                        <div key={idx} style={{ ...styles.toggleContainer, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                          <div>
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{perm.title}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{perm.desc}</div>
                          </div>
                          {renderSwitch(perm.active, () => {
                            showToast('Security clearance scopes must be modified by compliance officer.', 'warning');
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 7: SYSTEM INTELLIGENCE
                ======================================================== */}
            {activeTab === 'intelligence' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={styles.grid3}>
                  <div style={{ ...styles.card, textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.05em' }}>SESSION RUNTIME</div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text-primary)', margin: '10px 0' }}>148.5h</div>
                    <span style={styles.badge('rgba(16,185,129,0.1)', 'var(--success-400)')}>Active 99.8%</span>
                  </div>

                  <div style={{ ...styles.card, textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.05em' }}>DATA FOOTPRINT</div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text-primary)', margin: '10px 0' }}>42.8 GB</div>
                    <span style={styles.badge('rgba(59,130,246,0.1)', 'var(--info-400)')}>2.4M DB records</span>
                  </div>

                  <div style={{ ...styles.card, textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '11px', letterSpacing: '0.05em' }}>API CALLS (MONTHLY)</div>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--text-primary)', margin: '10px 0' }}>874.2K</div>
                    <span style={styles.badge('rgba(245,158,11,0.1)', 'var(--warning-400)')}>87% of Quota</span>
                  </div>
                </div>

                <div style={styles.card}>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Database size={16} color={activeColorSet.primary} />
                    Platform Resource Quota Allocations
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        <span>SYSTEM TELEMETRY DATABASE STORAGE</span>
                        <span>42.8 GB / 100 GB</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                        <div style={{ width: '42.8%', height: '100%', borderRadius: '3px', background: activeColorSet.primary }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        <span>DAILY API LIMIT (TATA MOTORS & GPSTRACKERS)</span>
                        <span>87,420 / 100,000 calls</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                        <div style={{ width: '87.4%', height: '100%', borderRadius: '3px', background: 'var(--warning-500)' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        <span>AUTONOMOUS AGENT DECISIONS DISPATCHED</span>
                        <span>12,480 / 15,000 units</span>
                      </div>
                      <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                        <div style={{ width: '83.2%', height: '100%', borderRadius: '3px', background: 'var(--success-500)' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 8: PLATFORM CONFIGURATION
                ======================================================== */}
            {activeTab === 'platform' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={styles.card}>
                    <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Settings size={16} color={activeColorSet.primary} />
                      Platform Themes & Regional settings
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {/* Theme Toggle & Accent Colors */}
                      <div style={styles.grid2}>
                        <div>
                          <label style={styles.label}>Global UI Theme Mode</label>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={theme === 'light' ? toggleTheme : undefined}
                              style={{
                                ...styles.btnSecondary,
                                flex: 1,
                                justifyContent: 'center',
                                borderColor: theme === 'dark' ? activeColorSet.primary : 'var(--border-subtle)',
                                background: theme === 'dark' ? activeColorSet.bg : 'rgba(255,255,255,0.01)',
                                color: theme === 'dark' ? 'white' : 'var(--text-secondary)'
                              }}
                            >
                              🌌 Futuristic Dark
                            </button>
                            <button
                              type="button"
                              onClick={theme === 'dark' ? toggleTheme : undefined}
                              style={{
                                ...styles.btnSecondary,
                                flex: 1,
                                justifyContent: 'center',
                                borderColor: theme === 'light' ? activeColorSet.primary : 'var(--border-subtle)',
                                background: theme === 'light' ? activeColorSet.bg : 'rgba(255,255,255,0.01)',
                                color: theme === 'light' ? 'white' : 'var(--text-secondary)'
                              }}
                            >
                              ☀️ Clean Light
                            </button>
                          </div>
                        </div>

                        <div>
                          <label style={styles.label}>Console Accent Neon Color</label>
                          <div style={{ display: 'flex', gap: '10px', height: '40px', alignItems: 'center' }}>
                            {Object.keys(colors).map((colorKey) => (
                              <button
                                key={colorKey}
                                type="button"
                                onClick={() => {
                                  setProfile({ ...profile, accentColor: colorKey });
                                  showToast(`Console accent color updated to ${colorKey}.`);
                                }}
                                style={{
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '50%',
                                  background: colors[colorKey].primary,
                                  border: profile.accentColor === colorKey ? '3px solid white' : 'none',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                  boxShadow: profile.accentColor === colorKey ? `0 0 10px ${colors[colorKey].primary}` : 'none'
                                }}
                                title={colorKey}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div style={styles.divider} />

                      {/* Regionals Settings */}
                      <div style={styles.grid3}>
                        <div>
                          <label style={styles.label}>Regional Timezone</label>
                          <select
                            value={profile.timezone}
                            onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                            style={{ ...styles.input, background: 'var(--bg-800)' }}
                          >
                            <option value="Asia/Kolkata (GMT+05:30)">Asia/Kolkata (GMT+05:30)</option>
                            <option value="Europe/London (GMT+00:00)">Europe/London (GMT+00:00)</option>
                            <option value="America/New_York (GMT-05:00)">America/New_York (GMT-05:00)</option>
                          </select>
                        </div>

                        <div>
                          <label style={styles.label}>Date Format Pattern</label>
                          <select
                            value={profile.dateFormat}
                            onChange={(e) => setProfile({ ...profile, dateFormat: e.target.value })}
                            style={{ ...styles.input, background: 'var(--bg-800)' }}
                          >
                            <option value="DD/MM/YYYY">DD/MM/YYYY (Indian Standard)</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY (US format)</option>
                          </select>
                        </div>

                        <div>
                          <label style={styles.label}>Measurement Metric</label>
                          <select
                            value={profile.units}
                            onChange={(e) => setProfile({ ...profile, units: e.target.value })}
                            style={{ ...styles.input, background: 'var(--bg-800)' }}
                          >
                            <option value="metric">Metric (Kilometers, km/h)</option>
                            <option value="imperial">Imperial (Miles, mph)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Edit fields */}
                  <div style={styles.card}>
                    <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={16} color={activeColorSet.primary} />
                      Identity Profile Information
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={styles.grid2}>
                        <div>
                          <label style={styles.label}>Identity Name</label>
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            style={styles.input}
                          />
                        </div>
                        <div>
                          <label style={styles.label}>Department Role</label>
                          <input
                            type="text"
                            value={profile.role}
                            onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                            style={styles.input}
                          />
                        </div>
                      </div>

                      <div style={styles.grid2}>
                        <div>
                          <label style={styles.label}>System Email Address</label>
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            style={styles.input}
                          />
                        </div>
                        <div>
                          <label style={styles.label}>Mobile Hotline No.</label>
                          <input
                            type="text"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            style={styles.input}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={styles.label}>Location / HQ Depot</label>
                        <input
                          type="text"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          style={styles.input}
                        />
                      </div>

                      <div>
                        <label style={styles.label}>Identity Bio / Purpose</label>
                        <textarea
                          rows="3"
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          style={{ ...styles.input, resize: 'none' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hotkeys and Keyboard Shortcuts */}
                  <div style={styles.card}>
                    <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Grid size={16} color={activeColorSet.primary} />
                      Console Keyboard Shortcuts
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {shortcuts.map((sh, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-sm)' }}>
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{sh.action}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: activeColorSet.primary, background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                            {sh.keys}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit Actions */}
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: 10 }}>
                    <button type="button" onClick={() => navigate('/')} style={styles.btnSecondary}>
                      Cancel
                    </button>
                    <button type="submit" style={styles.btnPrimary}>
                      <Save size={16} /> Save Platform Preference
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Dummy helper to bypass unused icon link errors
function LinkIcon({ size }) {
  return <Network size={size} />;
}
