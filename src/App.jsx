import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Lazy imports for code splitting
import Dashboard from './pages/Dashboard';
import FleetOverview from './pages/fleet/FleetOverview';
import LiveTracking from './pages/fleet/LiveTracking';
import KnowledgeGraph from './pages/knowledge/KnowledgeGraph';
import ERPDashboard from './pages/erp/ERPDashboard';
import CRMDashboard from './pages/crm/CRMDashboard';
import HCMDashboard from './pages/hcm/HCMDashboard';
import AICopilot from './pages/copilot/AICopilot';
import AgentsDashboard from './pages/agents/AgentsDashboard';
import Analytics from './pages/analytics/Analytics';
import PortalsWorkspace from './pages/portals/PortalsWorkspace';
import CustomerPortal from './pages/portals/CustomerPortal';
import ProfileSettings from './pages/profile/ProfileSettings';
import SecurityFortress from './pages/security/SecurityFortress';

import { ThemeContext } from './context/ThemeContext';
import { Lock, Shield, Fingerprint, AlertCircle, CheckCircle } from 'lucide-react';
import { RealityEngine } from './data/RealityEngine';

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('gatifleet-theme') || 'dark'
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gatifleet-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);
  const toggleCopilot = () => setCopilotOpen(prev => !prev);

  // Global Context Provider Values
  const contextValue = {
    theme, toggleTheme, 
    sidebarCollapsed, toggleSidebar,
    copilotOpen, toggleCopilot,
    isLocked, setIsLocked
  };

  if (isLocked) {
    return (
      <ThemeContext.Provider value={contextValue}>
        <LockScreen onUnlock={() => setIsLocked(false)} />
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fleet" element={<FleetOverview />} />
          <Route path="/tracking" element={<LiveTracking />} />
          <Route path="/knowledge-graph" element={<KnowledgeGraph />} />
          <Route path="/erp" element={<ERPDashboard />} />
          <Route path="/crm" element={<CRMDashboard />} />
          <Route path="/hcm" element={<HCMDashboard />} />
          <Route path="/copilot" element={<AICopilot />} />
          <Route path="/agents" element={<AgentsDashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/portals" element={<PortalsWorkspace />} />
          <Route path="/customer-portal" element={<CustomerPortal />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/security" element={<SecurityFortress />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </ThemeContext.Provider>
  );
}

// Fullscreen Premium Lock Screen Component
function LockScreen({ onUnlock }) {
  const [passcode, setPasscode] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [timeString, setTimeString] = useState('');
  const [dateString, setDateString] = useState('');

  // Clock Update Effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateString(now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Standard unlock credential verify
  const handlePasscodeUnlock = (e) => {
    e.preventDefault();
    if (passcode === 'arjun100' && mfaToken === '123456') {
      triggerUnlockSuccess();
    } else {
      triggerUnlockFailure();
    }
  };

  // Holographic Biometric scanner unlock simulation
  const handleBiometricScan = () => {
    if (isScanning || success) return;
    setIsScanning(true);
    setError('');
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            triggerUnlockSuccess();
          }, 400);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const triggerUnlockSuccess = () => {
    setSuccess(true);
    setError('');
    // Dispatch success to Event Ledger
    RealityEngine.events = [{
      id: `ev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'IDENTITY_VERIFIED',
      desc: 'Super Admin Arjun Kapoor successfully verified via Sentinel-X Biometrics.',
      source: 'SYS/GUARD'
    }, ...RealityEngine.events];
    RealityEngine.notify();

    setTimeout(() => {
      onUnlock();
    }, 1000);
  };

  const triggerUnlockFailure = () => {
    setError('Access Denied: Invalid passcode credentials or MFA OTP token.');
    setPasscode('');
    setMfaToken('');
    
    // Dispatch violation event to RealityEngine
    RealityEngine.events = [{
      id: `ev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'AUTH_FAILED',
      desc: 'Failed console unlock attempt using invalid passcode and MFA signature.',
      source: 'SYS/GUARD'
    }, ...RealityEngine.events];
    RealityEngine.notify();
  };

  const styles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      background: 'radial-gradient(circle at center, #0b1120 0%, #030712 100%)',
      color: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      zIndex: 99999,
      padding: '20px',
      overflow: 'hidden'
    },
    cyberGrid: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px)',
      backgroundSize: '30px 30px',
      opacity: 0.7,
      pointerEvents: 'none'
    },
    hudClock: {
      position: 'absolute',
      top: '40px',
      right: '40px',
      textAlign: 'right',
      zIndex: 10
    },
    clockText: {
      fontSize: '36px',
      fontWeight: 800,
      fontFamily: 'monospace',
      color: '#818cf8',
      letterSpacing: '0.05em',
      textShadow: '0 0 15px rgba(99, 102, 241, 0.3)'
    },
    dateText: {
      fontSize: '12px',
      color: '#9ca3af',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      marginTop: '4px'
    },
    lockBox: {
      width: '100%',
      maxWidth: '420px',
      background: 'rgba(15, 23, 42, 0.65)',
      border: success ? '1px solid #10b981' : error ? '1px solid #ef4444' : '1px solid rgba(99, 102, 241, 0.25)',
      borderRadius: '24px',
      padding: '40px',
      backdropFilter: 'blur(35px)',
      boxShadow: success ? '0 0 40px rgba(16, 185, 129, 0.25)' : error ? '0 0 40px rgba(239, 68, 68, 0.25)' : '0 10px 40px rgba(0, 0, 0, 0.5)',
      textAlign: 'center',
      zIndex: 20,
      transition: 'all 0.3s ease'
    },
    avatarOuter: {
      width: '90px',
      height: '90px',
      borderRadius: '50%',
      margin: '0 auto 24px',
      padding: '4px',
      background: success ? 'linear-gradient(to right, #10b981, #34d399)' : 'linear-gradient(to right, #6366f1, #ec4899)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: success ? '0 0 25px rgba(16, 185, 129, 0.4)' : '0 0 25px rgba(99, 102, 241, 0.3)',
      position: 'relative'
    },
    avatarInner: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      background: '#0f172a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
      fontWeight: 800,
      color: '#ffffff'
    },
    badge: {
      position: 'absolute',
      bottom: '2px',
      right: '2px',
      background: success ? '#10b981' : '#f59e0b',
      border: '3px solid #0f172a',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    h1: {
      fontSize: '22px',
      fontWeight: 800,
      marginBottom: '4px',
      color: '#ffffff'
    },
    p: {
      fontSize: '13px',
      color: '#9ca3af',
      marginBottom: '30px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      background: 'rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px',
      color: '#ffffff',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box',
      marginBottom: '14px',
      transition: 'border-color 0.2s',
      fontFamily: 'inherit'
    },
    btnSubmit: {
      width: '100%',
      padding: '12px',
      background: success ? '#10b981' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 700,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxShadow: success ? '0 4px 15px rgba(16, 185, 129, 0.3)' : '0 4px 15px rgba(99, 102, 241, 0.3)',
      transition: 'all 0.2s ease',
      marginBottom: '16px'
    },
    biometricBtn: {
      width: '100%',
      padding: '12px',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px',
      color: '#818cf8',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.2s'
    },
    biometricScanner: {
      marginTop: '20px',
      background: 'rgba(99, 102, 241, 0.05)',
      border: '1px dashed #6366f1',
      padding: '16px',
      borderRadius: '12px',
      position: 'relative',
      overflow: 'hidden'
    },
    scanBar: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: '3px',
      background: 'linear-gradient(to right, transparent, #818cf8, transparent)',
      boxShadow: '0 0 10px #818cf8',
      animation: 'scanMotion 1.5s infinite linear'
    },
    errorBox: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      borderRadius: '10px',
      padding: '10px 14px',
      color: '#fca5a5',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '20px',
      textAlign: 'left'
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.cyberGrid} />

      {/* Clock HUD */}
      <div style={styles.hudClock}>
        <div style={styles.clockText}>{timeString}</div>
        <div style={styles.dateText}>{dateString}</div>
      </div>

      <div style={styles.lockBox}>
        {/* Avatar Profile */}
        <div style={styles.avatarOuter}>
          <div style={styles.avatarInner}>AK</div>
          <div style={styles.badge}>
            {success ? <CheckCircle size={12} color="white" /> : <Lock size={12} color="white" />}
          </div>
        </div>

        <h2 style={styles.h1}>Sentinel-X Gatekeeper</h2>
        <p style={styles.p}>Super Admin Console Locked · Arjun Kapoor</p>

        {error && (
          <div style={styles.errorBox}>
            <AlertCircle size={14} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Biometric Scanning Overlay */}
        {isScanning ? (
          <div style={styles.biometricScanner}>
            <div style={styles.scanBar} />
            <Fingerprint size={48} color="#818cf8" style={{ animation: 'pulse 1s infinite' }} />
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>
              SCANNING RETINAL & BIOMETRIC SIGNATURE: {scanProgress}%
            </div>
            <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
              <div style={{ width: `${scanProgress}%`, height: '100%', background: '#818cf8', transition: 'width 0.15s ease' }} />
            </div>
          </div>
        ) : success ? (
          <div style={{ color: '#10b981', fontWeight: 700, fontSize: '14px', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={36} />
            AUTHENTICATION VERIFIED. UNLOCKING CONSOLE...
          </div>
        ) : (
          <form onSubmit={handlePasscodeUnlock}>
            <input
              type="password"
              placeholder="Admin Passcode (arjun100)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="MFA OTP Token (123456)"
              value={mfaToken}
              onChange={(e) => setMfaToken(e.target.value)}
              style={styles.input}
              required
            />
            <button type="submit" style={styles.btnSubmit}>
              <UnlockIcon size={16} /> Unlock Console
            </button>

            <button type="button" onClick={handleBiometricScan} style={styles.biometricBtn}>
              <Fingerprint size={16} /> Holographic Biometric Scan
            </button>
          </form>
        )}
      </div>

      {/* Dynamic Keyframe Animations injected */}
      <style>{`
        @keyframes scanMotion {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}

// Helper icons
function UnlockIcon({ size }) {
  return <Shield size={size} />;
}

export default App;
