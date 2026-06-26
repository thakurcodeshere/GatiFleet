import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, ShieldAlert, ShieldCheck, Lock, Eye, EyeOff, Key,
  Activity, Trash2, Smartphone, Laptop, AlertTriangle, CheckCircle,
  RefreshCw, Terminal, Play, Server
} from 'lucide-react';
import { RealityEngine } from '../../data/RealityEngine';

export default function SecurityFortress() {
  const { setIsLocked } = useTheme();
  const [activeTab, setActiveTab] = useState('threats');

  // Global Reality Engine State Subscription
  const [engineState, setEngineState] = useState(RealityEngine.getState());
  useEffect(() => {
    return RealityEngine.subscribe((state) => {
      setEngineState(state);
    });
  }, []);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // State 1: Threat Radar & WAF
  const [wafBlockedCount, setWafBlockedCount] = useState(148);
  const [isDdosActive, setIsDdosActive] = useState(false);
  const [rateLimitTimer, setRateLimitTimer] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [threatLogs, setThreatLogs] = useState([
    { id: 1, time: '12:01:10', ip: '184.22.91.4', type: 'SQL Injection', payload: "' OR 1=1; --", severity: 'Critical', action: 'IP Banned' },
    { id: 2, time: '11:45:22', ip: '203.11.45.98', type: 'XSS Attack', payload: '<script>alert("XSS")</script>', severity: 'High', action: 'Cleaned & Blocked' },
    { id: 3, time: '11:32:05', ip: '198.51.100.2', type: 'Honeypot Triggered', payload: 'bot_field_filled', severity: 'Critical', action: 'IP Blocked' },
    { id: 4, time: '10:14:48', ip: '82.204.11.23', type: 'Rate Limit Breach', payload: 'Refuel Spammed', severity: 'Medium', action: 'HTTP 429 Cooldown' }
  ]);

  // State 2: Gatekeeper & Sessions
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const failedLogins = [
    { id: 'fl-1', time: '11:15', ip: '184.22.91.4', location: 'Moscow, RU', device: 'Firefox / Linux' },
    { id: 'fl-2', time: '10:04', ip: '203.11.45.98', location: 'Beijing, CN', device: 'Chrome / Android' }
  ];
  const [activeSessions, setActiveSessions] = useState([
    { id: 'sess-1', device: 'Desktop MacBook Pro', browser: 'Chrome 125.0', ip: '103.241.12.89', location: 'Mumbai, IND', lastActive: 'Active now', current: true },
    { id: 'sess-2', device: 'iPhone 15 Pro Max', browser: 'Safari Mobile', ip: '103.241.13.11', location: 'Delhi, IND', lastActive: '12 mins ago', current: false },
    { id: 'sess-3', device: 'Linux Workstation', browser: 'Firefox Developer Edition', ip: '157.48.24.110', location: 'Bengaluru, IND', lastActive: '2 days ago', current: false }
  ]);

  // State 3: Access Control & Vault
  const [decryptedKeys, setDecryptedKeys] = useState({});
  const [decryptingKeyId, setDecryptingKeyId] = useState(null);
  const [vaultMfaCode, setVaultMfaCode] = useState('');
  const [promptMfaId, setPromptMfaId] = useState(null);
  const vaultKeys = [
    { id: 'v-1', name: 'Salesforce CRM API Key', masked: 'gf_sec_sfdc_••••••••••••2f92', raw: 'gf_sec_sfdc_a2b9f8d7e6c54321', type: 'CRM Partner' },
    { id: 'v-2', name: 'SAP ERP Integration Secret', masked: 'gf_sec_saperp_••••••••••••8a19', raw: 'gf_sec_saperp_f7e6d5c4b3a21098', type: 'Accounting Link' },
    { id: 'v-3', name: 'Indian FASTag Registry Key', masked: 'gf_sec_fastag_••••••••••••c442', raw: 'gf_sec_fastag_0987654321fedcba', type: 'Toll Services' },
    { id: 'v-4', name: 'AWS Production S3 Access', masked: 'gf_sec_awss3_••••••••••••d018', raw: 'gf_sec_awss3_abcdef0123456789', type: 'Cloud Telemetry' }
  ];

  // State 4: Sanitization Sandbox
  const [sandboxInput, setSandboxInput] = useState('');
  const [sandboxOutput, setSandboxOutput] = useState('');
  const [sandboxThreat, setSandboxThreat] = useState('Nominal');
  const [sandboxLogs, setSandboxLogs] = useState([]);

  // DDOS Simulation Ticker
  useEffect(() => {
    let interval;
    if (isDdosActive) {
      interval = setInterval(() => {
        setWafBlockedCount(prev => prev + Math.floor(Math.random() * 8) + 4);
        
        // Add random bot logs
        const ip = `${Math.floor(Math.random() * 200 + 40)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        const payloads = ["' OR 1=1; --", '<img src=x onerror=alert(1)>', 'GET /admin/setup.php', 'bot_field_filled'];
        const types = ['SQL Injection', 'XSS Attack', 'Directory Traversal', 'Honeypot Triggered'];
        const idx = Math.floor(Math.random() * 4);
        
        const newLog = {
          id: Date.now(),
          time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          ip,
          type: types[idx],
          payload: payloads[idx],
          severity: types[idx].includes('Honeypot') || types[idx].includes('SQL') ? 'Critical' : 'High',
          action: 'Blocked & Logged'
        };
        
        setThreatLogs(prev => [newLog, ...prev.slice(0, 19)]);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isDdosActive]);

  // Rate limit cooldown timer effect
  useEffect(() => {
    let timer;
    if (rateLimitTimer > 0) {
      timer = setInterval(() => {
        setRateLimitTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [rateLimitTimer]);

  // Cooldown Action clicker handler
  const handleRateLimitClick = () => {
    const now = Date.now();
    if (rateLimitTimer > 0) {
      showToast('System node temporarily locked under Rate Limit block.', 'warning');
      return;
    }
    
    if (now - lastClickTime < 1800) {
      setRateLimitTimer(5);
      showToast('HTTP 429: Too Many Requests. Cooldown block triggered.', 'warning');
      
      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        ip: '127.0.0.1 (Local Client)',
        type: 'Rate Limit Breach',
        payload: 'Double Click refuel test',
        severity: 'Medium',
        action: 'HTTP 429 Cooldown'
      };
      setThreatLogs(prev => [newLog, ...prev]);

      RealityEngine.events = [{
        id: `ev-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'RATE_LIMIT_BLOCKED',
        desc: 'Security Guard: Client rate limits breached. Temporary HTTP 429 ban enforced.',
        source: 'SYS/GUARD'
      }, ...RealityEngine.events];
      RealityEngine.notify();
    } else {
      showToast('Diagnostic request successful (No abuse detected).');
    }
    setLastClickTime(now);
  };

  // Secure Vault Decrypt
  const triggerDecryptPrompt = (id) => {
    setErrorPrompt('');
    setVaultMfaCode('');
    if (mfaEnabled) {
      setPromptMfaId(id);
    } else {
      executeDecryption(id);
    }
  };

  const [errorPrompt, setErrorPrompt] = useState('');
  const submitVaultMfa = (e) => {
    e.preventDefault();
    if (vaultMfaCode === '123456') {
      const id = promptMfaId;
      setPromptMfaId(null);
      executeDecryption(id);
    } else {
      setErrorPrompt('Invalid MFA security key. Access denied.');
      setVaultMfaCode('');
    }
  };

  const executeDecryption = (id) => {
    setDecryptingKeyId(id);
    
    // Simulate decryption math overhead
    setTimeout(() => {
      const target = vaultKeys.find(k => k.id === id);
      setDecryptedKeys(prev => ({
        ...prev,
        [id]: target.raw
      }));
      setDecryptingKeyId(null);
      showToast('Sensitive credential decrypted into DOM.', 'success');

      // Auto re-lock/mask after 15 seconds
      setTimeout(() => {
        setDecryptedKeys(prev => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
        showToast('Sensitive credential erased from DOM cache.', 'info');
      }, 15000);
    }, 1200);
  };

  // Sandbox scanner
  const handleSandboxScan = (e) => {
    e.preventDefault();
    if (!sandboxInput.trim()) return;

    let sanitized = sandboxInput;
    let threat = 'Nominal';
    let logs = [];

    // XSS check
    if (/<script>/i.test(sandboxInput) || /onload/i.test(sandboxInput) || /onerror/i.test(sandboxInput)) {
      sanitized = sanitized.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      threat = 'Critical';
      logs.push('[XSS Trigger] Malicious HTML tags detected. Script tags sanitized.');
    }

    // SQL Injection check
    if (/'/i.test(sandboxInput) || /OR 1=1/i.test(sandboxInput) || /--/i.test(sandboxInput) || /UNION SELECT/i.test(sandboxInput)) {
      sanitized = sanitized.replace(/'/g, "''").replace(/--/g, '');
      threat = threat === 'Critical' ? 'Critical' : 'High';
      logs.push("[SQLi Trigger] SQL Escape sequences detected. Escape ticks and comments sanitized.");
    }

    // Phone / Zip format check
    if (sandboxInput.length === 10 && /^\d+$/.test(sandboxInput)) {
      logs.push('[Validator] Valid Indian Mobile Hotline format matched.');
    } else if (sandboxInput.length === 6 && /^\d+$/.test(sandboxInput)) {
      logs.push('[Validator] Valid Indian Pincode registry format matched.');
    } else if (/\D/.test(sandboxInput) && (sandboxInput.includes('pincode') || sandboxInput.includes('phone'))) {
      threat = 'Low';
      logs.push('[Format Warning] Strictly numeric formatting required for indices.');
    }

    if (threat !== 'Nominal') {
      const newThreatLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        ip: '127.0.0.1 (Sandbox Lab)',
        type: threat === 'Critical' ? 'XSS Attack' : 'SQL Injection',
        payload: sandboxInput,
        severity: threat,
        action: 'Sanitized'
      };
      setThreatLogs(prev => [newThreatLog, ...prev]);
    }

    setSandboxOutput(sanitized);
    setSandboxThreat(threat);
    setSandboxLogs(logs);
  };

  // Terminate Session
  const handleTerminateSession = (id) => {
    setActiveSessions(activeSessions.filter(s => s.id !== id));
    showToast('Active device session revoked instantly.', 'warning');
  };

  // Toggle MFA
  const handleToggleMfa = () => {
    setMfaEnabled(prev => {
      const next = !prev;
      showToast(next ? 'Fortress MFA verification turned ON.' : 'MFA verification disabled (Warning: High threat exposure!).', next ? 'success' : 'warning');
      return next;
    });
  };

  // Styles definition
  const styles = {
    container: {
      padding: '24px',
      background: 'var(--bg-900)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      minHeight: 'calc(100vh - var(--topbar-height))',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid var(--border-subtle)',
      paddingBottom: '16px'
    },
    tabs: {
      display: 'flex',
      gap: '6px',
      background: 'var(--bg-800)',
      padding: '4px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)',
      width: 'fit-content'
    },
    tabBtn: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      borderRadius: 'var(--radius-sm)',
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      border: 'none',
      cursor: 'pointer',
      color: isActive ? 'white' : 'var(--text-secondary)',
      background: isActive ? 'linear-gradient(135deg, var(--primary-500), #5247e5)' : 'transparent',
      transition: 'all 0.2s'
    }),
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
      background: 'rgba(0,0,0,0.2)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '16px',
      transition: 'all 0.2s'
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
      fontFamily: 'var(--font-sans)'
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, var(--primary-500), #4f46e5)',
      color: 'white',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      padding: '10px 20px',
      fontSize: 'var(--text-sm)',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
    },
    btnSecondary: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '10px 20px',
      fontSize: 'var(--text-sm)',
      fontWeight: 500,
      color: 'var(--text-secondary)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    badge: (severity) => {
      const colors = {
        Critical: { bg: 'rgba(239, 68, 68, 0.1)', fg: '#f87171' },
        High: { bg: 'rgba(249, 115, 22, 0.1)', fg: '#fb923c' },
        Medium: { bg: 'rgba(245, 158, 11, 0.1)', fg: '#fbbf24' },
        Nominal: { bg: 'rgba(16, 185, 129, 0.1)', fg: '#34d399' },
        Low: { bg: 'rgba(59, 130, 246, 0.1)', fg: '#60a5fa' }
      };
      const set = colors[severity] || colors.Nominal;
      return {
        padding: '2px 8px',
        borderRadius: 'var(--radius-full)',
        fontSize: '10px',
        fontWeight: 700,
        background: set.bg,
        color: set.fg,
        display: 'inline-block'
      };
    },
    grid2: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px'
    },
    grid3: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '20px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Toast popup */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            style={{
              position: 'fixed',
              top: '40px',
              right: '40px',
              zIndex: 9999,
              background: 'rgba(15, 23, 42, 0.9)',
              border: `1px solid ${toast.type === 'success' ? '#10b981' : toast.type === 'warning' ? '#ef4444' : '#3b82f6'}`,
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
            {toast.type === 'success' && <CheckCircle size={18} color="#10b981" />}
            {toast.type === 'warning' && <AlertTriangle size={18} color="#ef4444" />}
            {toast.type === 'info' && <ShieldCheck size={18} color="#3b82f6" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MFA Verification Prompt Overlay */}
      {promptMfaId !== null && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            ...styles.card,
            width: '100%',
            maxWidth: '360px',
            background: 'var(--bg-800)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            boxShadow: '0 0 25px rgba(99, 102, 241, 0.25)',
            textAlign: 'center'
          }}>
            <Shield size={42} color="var(--primary-500)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px' }}>MFA Security Verification</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>Enter the 6-digit verification code from your auth app.</p>
            
            {errorPrompt && (
              <div style={{ background: 'rgba(239,68,68,0.1)', color: '#fca5a5', fontSize: '11px', padding: '8px', borderRadius: '6px', marginBottom: '12px', textAlign: 'left' }}>
                {errorPrompt}
              </div>
            )}
            
            <form onSubmit={submitVaultMfa}>
              <input
                type="text"
                placeholder="OTP Code (123456)"
                value={vaultMfaCode}
                onChange={(e) => setVaultMfaCode(e.target.value)}
                style={{ ...styles.input, textAlign: 'center', letterSpacing: '0.2em', fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}
                required
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setPromptMfaId(null)} style={{ ...styles.btnSecondary, flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" style={{ ...styles.btnPrimary, flex: 1, justifyContent: 'center' }}>Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header section */}
      <div style={styles.header}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, background: 'linear-gradient(90deg, #818cf8, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Sentinel-X SOC Fortress
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginTop: 4 }}>
            Security Operations Center & Intrusion Detection Command Center
          </p>
        </div>

        {/* Tab selection */}
        <div style={styles.tabs}>
          {[
            { id: 'threats', label: 'Threat Radar & WAF', icon: Activity },
            { id: 'identity', label: 'Identity Gatekeeper', icon: Lock },
            { id: 'vault', label: 'Secrets Vault & RBAC', icon: Key },
            { id: 'sandbox', label: 'Sanitization Lab', icon: Terminal },
            { id: 'compliance', label: 'Secure Deployment', icon: Server }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={styles.tabBtn(activeTab === tab.id)}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Routing Panels */}
      <div style={{ flex: 1 }}>

        {/* TAB 1: THREAT RADAR & WAF */}
        {activeTab === 'threats' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Top Scorecard KPIs */}
            <div style={styles.grid3}>
              <div style={{ ...styles.card, background: 'rgba(239, 68, 68, 0.03)', borderColor: 'rgba(239, 68, 68, 0.15)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>WAF INTRUSIONS BLOCKED</span>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#ef4444', margin: '8px 0' }}>
                  {wafBlockedCount}
                </div>
                <span style={styles.badge(isDdosActive ? 'Critical' : 'Nominal')}>{isDdosActive ? 'DDoS STOM OVERFLOW' : 'Nominal Shield'}</span>
              </div>

              <div style={{ ...styles.card, background: 'rgba(99, 102, 241, 0.03)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>RATE LIMITER STATUS</span>
                <div style={{ fontSize: '32px', fontWeight: 800, color: rateLimitTimer > 0 ? '#f59e0b' : '#34d399', margin: '8px 0' }}>
                  {rateLimitTimer > 0 ? `Banned (${rateLimitTimer}s)` : 'Active'}
                </div>
                <button onClick={handleRateLimitClick} style={{ ...styles.btnSecondary, padding: '4px 10px', fontSize: '10px', display: 'inline-flex', marginTop: 4 }}>
                  Test Cooldown Click
                </button>
              </div>

              <div style={{ ...styles.card, background: 'rgba(16, 185, 129, 0.03)', borderColor: 'rgba(16, 185, 129, 0.15)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>BOT HONEYPOT STATUS</span>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#10b981', margin: '8px 0' }}>
                  Active
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Active Network Certainty: {engineState.oci.networkCertainty}%
                </span>
              </div>
            </div>

            {/* WAF controls & logs */}
            <div style={styles.grid2}>
              {/* Traffic control */}
              <div style={styles.card}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Server size={16} color="var(--primary-400)" />
                  WAF Firewall Traffic Controls
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  Simulate attack vector vectors to verify live blocking pipelines and network threshold alarms.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => {
                      setIsDdosActive(!isDdosActive);
                      showToast(isDdosActive ? 'DDoS Simulator shut down.' : 'DDoS storm simulator activated!', isDdosActive ? 'info' : 'warning');
                    }}
                    style={{
                      ...styles.btnPrimary,
                      background: isDdosActive ? '#ef4444' : 'linear-gradient(135deg, var(--primary-500), #4f46e5)',
                      boxShadow: isDdosActive ? '0 4px 12px rgba(239, 68, 68, 0.3)' : '0 4px 12px rgba(99, 102, 241, 0.25)'
                    }}
                  >
                    <Play size={14} /> {isDdosActive ? 'Stop DDoS Attack' : 'Simulate DDoS Flood'}
                  </button>
                  <button
                    onClick={() => {
                      setWafBlockedCount(148);
                      setThreatLogs([
                        { id: 1, time: '12:01:10', ip: '184.22.91.4', type: 'SQL Injection', payload: "' OR 1=1; --", severity: 'Critical', action: 'IP Banned' }
                      ]);
                      showToast('Threat logs and counter database flushed.');
                    }}
                    style={styles.btnSecondary}
                  >
                    Clear Database
                  </button>
                </div>

                {/* SVG Traffic monitor */}
                <div style={{ marginTop: '30px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyBetween: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    <span>NETWORK BANDWIDTH EXPOSURE</span>
                    <span style={{ color: isDdosActive ? '#ef4444' : '#10b981', fontWeight: 700 }}>
                      {isDdosActive ? 'TRAFFIC PEAK breached' : 'NOMINAL (140 req/m)'}
                    </span>
                  </div>
                  <svg width="100%" height="80" viewBox="0 0 300 80" style={{ overflow: 'visible' }}>
                    <path
                      d={isDdosActive 
                        ? "M0 70 L30 65 L60 68 L90 50 L120 15 L150 8 L180 12 L210 5 L240 10 L270 8 L300 5" 
                        : "M0 70 L30 68 L60 72 L90 65 L120 70 L150 68 L180 65 L210 68 L240 70 L270 72 L300 68"
                      }
                      fill="none"
                      stroke={isDdosActive ? '#ef4444' : '#10b981'}
                      strokeWidth="2"
                      style={{ transition: 'all 0.5s ease' }}
                    />
                  </svg>
                </div>
              </div>

              {/* Threat Logs */}
              <div style={styles.card}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={16} color="#ef4444" />
                  Intrusion Detection System Log
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '310px', overflowY: 'auto', paddingRight: '4px' }}>
                  {threatLogs.map(log => (
                    <div key={log.id} style={{ ...styles.subCard, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: 'white' }}>{log.type}</span>
                          <span style={styles.badge(log.severity)}>{log.severity}</span>
                        </div>
                        <div style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--primary-300)', marginTop: '4px' }}>
                          Payload: {log.payload}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Source IP: {log.ip} · Triggered at {log.time}
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#34d399' }}>{log.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: IDENTITY GATEKEEPER */}
        {activeTab === 'identity' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Session locking & controls */}
            <div style={styles.card}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={16} color="var(--primary-400)" />
                Gatekeeper Command Hub
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>Force Console Isolation Lock</div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Instantly lock down all active client routes. Unlocking requires Admin passcode + MFA signature credentials.</p>
                  <button
                    onClick={() => {
                      setIsLocked(true);
                      showToast('Super Admin console isolation locked statefully.', 'warning');
                    }}
                    style={{ ...styles.btnPrimary, background: '#ef4444', border: 'none', boxShadow: 'none' }}
                  >
                    <Lock size={14} /> Lock Dashboard Now
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px' }}>Fortress MFA Configuration</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Require dynamic one-time passcode verification for decryption requests.</div>
                  </div>
                  <div
                    onClick={handleToggleMfa}
                    style={{
                      width: 44,
                      height: 22,
                      borderRadius: 11,
                      background: mfaEnabled ? 'var(--primary-500)' : 'rgba(255,255,255,0.08)',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: 'white',
                      position: 'absolute',
                      top: 2,
                      left: mfaEnabled ? 24 : 2,
                      transition: 'all 0.3s'
                    }} />
                  </div>
                </div>
              </div>

              {/* Geolocation Log Vector */}
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                  FAILED LOGINS TRAFFIC RADAR
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {failedLogins.map(login => (
                    <div key={login.id} style={{ ...styles.subCard, display: 'flex', justifyContent: 'space-between', padding: '10px 14px', alignItems: 'center' }}>
                      <div>
                        <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '11px' }}>● FAILED ACCESS BLOCKED</span>
                        <div style={{ fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>IP: {login.ip} ({login.location})</div>
                      </div>
                      <div style={{ textAlign: 'right', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <div>{login.device}</div>
                        <div>{login.time} mins ago</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sessions manager */}
            <div style={styles.card}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={16} color="var(--primary-400)" />
                Active Authorized Session Tokens
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Active digital twin credentials holding valid OAuth WebToken states. Revoke session nodes instantly to force terminal locks.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeSessions.map(sess => (
                  <div key={sess.id} style={{ ...styles.subCard, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      {sess.device.includes('iPhone') ? <Smartphone size={20} color="var(--text-muted)" /> : <Laptop size={20} color="var(--text-muted)" />}
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>
                          {sess.device} {sess.current && <span style={styles.badge('Nominal')}>Current</span>}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {sess.browser} · {sess.ip} ({sess.location})
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sess.lastActive}</span>
                      {!sess.current && (
                        <button
                          onClick={() => handleTerminateSession(sess.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: 'none',
                            color: '#f87171',
                            cursor: 'pointer',
                            padding: '6px',
                            borderRadius: '4px'
                          }}
                          title="Revoke Session Token"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VAULT & RBAC */}
        {activeTab === 'vault' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={styles.grid2}>
              {/* Credentials Decryption Vault */}
              <div style={styles.card}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Key size={16} color="var(--primary-400)" />
                  Ecosystem Secret Credential Vault
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Masked integration tokens for active database adapters. Prompt-locks enforce verification workflows before revealing keys.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {vaultKeys.map(key => {
                    const isDecrypted = !!decryptedKeys[key.id];
                    const isDecrypting = decryptingKeyId === key.id;
                    return (
                      <div key={key.id} style={{ ...styles.subCard, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '13px', color: 'white' }}>{key.name}</div>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{key.type}</span>
                          <div style={{ marginTop: '6px', fontFamily: 'monospace', fontSize: '11px', color: isDecrypted ? 'var(--success-400)' : 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', padding: '4px 8px', borderRadius: '4px', width: 'fit-content' }}>
                            {isDecrypted ? decryptedKeys[key.id] : key.masked}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => isDecrypted ? undefined : triggerDecryptPrompt(key.id)}
                          style={{
                            ...styles.btnSecondary,
                            padding: '6px 12px',
                            fontSize: '11px',
                            color: isDecrypted ? '#10b981' : '#818cf8',
                            borderColor: isDecrypted ? '#10b981' : 'var(--border-subtle)'
                          }}
                          disabled={isDecrypting}
                        >
                          {isDecrypting ? (
                            <>
                              <RefreshCw size={12} className="animate-spin" /> Decrypting...
                            </>
                          ) : isDecrypted ? (
                            <>
                              <EyeOff size={12} /> Decrypted (15s)
                            </>
                          ) : (
                            <>
                              <Eye size={12} /> Decrypt Key
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RBAC matrix */}
              <div style={styles.card}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} color="var(--primary-400)" />
                  Role-Based Access Control (RBAC)
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Verification of module privileges across ecosystem users. Clearance logs audits are logged statefully.
                </p>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                        <th style={{ padding: '8px', color: 'var(--text-muted)', fontWeight: 700 }}>ROLE</th>
                        <th style={{ padding: '8px', color: 'var(--text-muted)', fontWeight: 700 }}>REALITY MAP</th>
                        <th style={{ padding: '8px', color: 'var(--text-muted)', fontWeight: 700 }}>ERP/FINANCIAL</th>
                        <th style={{ padding: '8px', color: 'var(--text-muted)', fontWeight: 700 }}>SECRET VAULT</th>
                        <th style={{ padding: '8px', color: 'var(--text-muted)', fontWeight: 700 }}>AI AGENT LIMITS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { role: 'CEO (Super Admin)', map: 'R/W/Execute', erp: 'R/W/Execute', vault: 'MFA Decrypt', agents: 'Modify Autonomy' },
                        { role: 'CFO (Financial Admin)', map: 'Read-Only', erp: 'R/W/Execute', vault: 'Denied', agents: 'Read-Only' },
                        { role: 'COO (Operations Admin)', map: 'R/W/Execute', erp: 'Read-Only', vault: 'Denied', agents: 'Read-Only' },
                        { role: 'Ecosystem Carrier / Vendor', map: 'Geofence Only', erp: 'Billing Only', vault: 'Denied', agents: 'Denied' },
                        { role: 'Sentinel-X AI (Autonomous)', map: 'R/W/Execute', erp: 'Toll Recharge', vault: 'Auto-Token', agents: 'Self-Improve' }
                      ].map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '12px 8px', fontWeight: 700, color: 'white' }}>{row.role}</td>
                          <td style={{ padding: '12px 8px', color: '#60a5fa' }}>{row.map}</td>
                          <td style={{ padding: '12px 8px', color: '#34d399' }}>{row.erp}</td>
                          <td style={{ padding: '12px 8px', color: row.vault.includes('Denied') ? '#ef4444' : '#fb923c' }}>{row.vault}</td>
                          <td style={{ padding: '12px 8px', color: '#a78bfa' }}>{row.agents}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SANITIZATION SANDBOX */}
        {activeTab === 'sandbox' && (
          <div style={styles.grid2}>
            {/* Input lab */}
            <div style={styles.card}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={16} color="var(--primary-400)" />
                Input Sanitization & Vulnerability Sandbox
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Simulate potential payloads containing SQL Injection scripts, XSS vectors, or formatting exploits. Audit how GatiFleet filters clean variables en-route.
              </p>

              <form onSubmit={handleSandboxScan} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.05em' }}>
                    ENTER DETECTIVE TEST PAYLOAD
                  </label>
                  <textarea
                    rows="3"
                    value={sandboxInput}
                    onChange={(e) => setSandboxInput(e.target.value)}
                    placeholder="e.g. <script>alert(1)</script> or ' OR '1'='1"
                    style={{ ...styles.input, resize: 'none', fontFamily: 'monospace', fontSize: '13px' }}
                  />
                </div>

                {/* Preset chips */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setSandboxInput("<script>alert('Intruder Alert!')</script>")}
                    style={{ ...styles.btnSecondary, padding: '4px 10px', fontSize: '10px' }}
                  >
                    XSS Script tag
                  </button>
                  <button
                    type="button"
                    onClick={() => setSandboxInput("Arjun' OR 1=1; --")}
                    style={{ ...styles.btnSecondary, padding: '4px 10px', fontSize: '10px' }}
                  >
                    SQL Injection Tick
                  </button>
                  <button
                    type="button"
                    onClick={() => setSandboxInput("<img src=x onerror=javascript:alert('Hack')>")}
                    style={{ ...styles.btnSecondary, padding: '4px 10px', fontSize: '10px' }}
                  >
                    XSS Image inline
                  </button>
                  <button
                    type="button"
                    onClick={() => setSandboxInput("98765abc12 (Phone field)")}
                    style={{ ...styles.btnSecondary, padding: '4px 10px', fontSize: '10px' }}
                  >
                    Format Violation
                  </button>
                </div>

                <button type="submit" style={{ ...styles.btnPrimary, width: 'fit-content' }}>
                  Scan & Sanitize Input
                </button>
              </form>
            </div>

            {/* Sandbox results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={styles.card}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px' }}>Sanitization Parsing Output</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={styles.subCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>THREAT RATING CLASSIFICATION</span>
                      <span style={styles.badge(sandboxThreat)}>{sandboxThreat} THREAT LEVEL</span>
                    </div>
                  </div>

                  <div style={styles.subCard}>
                    <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                      CLEANED CONSOLE SAFE CONTEXT
                    </span>
                    <div style={{ fontFamily: 'monospace', fontSize: '13px', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: '6px', color: '#10b981' }}>
                      {sandboxOutput || '(Enter test payload above)'}
                    </div>
                  </div>
                </div>
              </div>

              {sandboxLogs.length > 0 && (
                <div style={styles.card}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Security Filters Processing Logs</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', fontFamily: 'monospace', color: '#9ca3af' }}>
                    {sandboxLogs.map((log, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px' }}>
                        <span style={{ color: '#818cf8' }}>➔</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: COMPLIANCE & SSL */}
        {activeTab === 'compliance' && (
          <div style={styles.grid2}>
            {/* Headers auditing */}
            <div style={styles.card}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Server size={16} color="var(--primary-400)" />
                HTTP Security Headers Inspector
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Auditing of security metadata policies applied at the production deployment edge.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { name: 'Content-Security-Policy (CSP)', status: 'Active (Strict)', desc: 'Blocks unauthorized inline scripts and frame injection threats.', health: 'Nominal' },
                  { name: 'Strict-Transport-Security (HSTS)', status: 'Active (max-age=63072000)', desc: 'Enforces HTTPS encryption for all browser calls.', health: 'Nominal' },
                  { name: 'X-Frame-Options (Clickjack Shield)', status: 'Active (DENY)', desc: 'Prevents GatiFleet framing inside foreign frames.', health: 'Nominal' },
                  { name: 'Access-Control-Allow-Origin (CORS)', status: 'Active (Strict Origin)', desc: 'Restricts API requests to approved transport twins.', health: 'Nominal' },
                  { name: 'X-Content-Type-Options', status: 'Active (nosniff)', desc: 'Enforces strictly declared MIME types, blocking script sniff exploits.', health: 'Nominal' }
                ].map((header, idx) => (
                  <div key={idx} style={{ ...styles.subCard, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '13px', color: 'white' }}>{header.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{header.desc}</div>
                      <div style={{ fontSize: '10px', color: 'var(--primary-400)', marginTop: '4px', fontFamily: 'monospace' }}>Value: {header.status}</div>
                    </div>
                    <span style={styles.badge(header.health)}>{header.health}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SSL/TLS Certification diagnostics */}
            <div style={styles.card}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="var(--primary-400)" />
                SSL/TLS Edge Certificate Diagnostics
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                TLS validation indices verified en-route by Let's Encrypt automated CA tunnels.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={styles.subCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    <span>CERTIFICATE EXPIRY COUNTDOWN</span>
                    <span style={{ color: '#34d399', fontWeight: 700 }}>68 DAYS REMAINING</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                    <div style={{ width: '75%', height: '100%', borderRadius: '3px', background: 'linear-gradient(to right, #ef4444, #10b981)' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Authority Issuer</span>
                    <span style={{ fontWeight: 600, color: 'white' }}>Let's Encrypt Authority R3</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>TLS protocol Cipher Suite</span>
                    <span style={{ fontFamily: 'monospace', color: '#818cf8' }}>TLS_AES_256_GCM_SHA384 (TLSv1.3)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Key Exchange Strength</span>
                    <span style={{ fontWeight: 600, color: 'white' }}>ECDHE 256 bits (Curve X25519)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Certificate Signature</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>SHA256withRSA (2048 bits)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>OCSP Stapling Status</span>
                    <span style={{ color: '#34d399', fontWeight: 600 }}>🟢 Active (Stapled)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
