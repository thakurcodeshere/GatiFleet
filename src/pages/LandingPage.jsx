import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Truck, ArrowRight, ShieldCheck, Eye, EyeOff, 
  Terminal, Search, Globe, ChevronRight, 
  Database, Activity, Cpu, Sparkles 
} from 'lucide-react';
import { RealityEngine } from '../data/RealityEngine';

// Predefined roles & credentials for mock authentication
const ROLE_TEMPLATES = [
  {
    id: 'CEO',
    title: 'CEO & Strategic Board',
    icon: Sparkles,
    color: '#a855f7', // Purple
    desc: 'Access Customer Workspace, CRM pipeline, corridor analytics, and high-level strategy loops.',
    passcode: 'ceo2026',
    defaultPath: '/'
  },
  {
    id: 'OPERATIONS',
    title: 'Operations & Dispatcher',
    icon: Truck,
    color: '#3b82f6', // Blue
    desc: 'Access live vehicle tracking, telemetry mapping, knowledge graph, and carrier portal.',
    passcode: 'ops2026',
    defaultPath: '/tracking'
  },
  {
    id: 'FINANCE',
    title: 'Finance & Accounts',
    icon: Activity,
    color: '#10b981', // Green
    desc: 'Access ERP ledgers, revenue rating controllers, toll audit records, and collections forecasting.',
    passcode: 'fin2026',
    defaultPath: '/erp'
  },
  {
    id: 'HR',
    title: 'HR & Personnel (HCM)',
    icon: Cpu,
    color: '#ec4899', // Pink
    desc: 'Access Human Capital Management portal, driver rosters, payroll records, and licensing compliance.',
    passcode: 'hr2026',
    defaultPath: '/hcm'
  },
  {
    id: 'SECURITY',
    title: 'CTO & Security Officer',
    icon: ShieldCheck,
    color: '#f59e0b', // Amber
    desc: 'Access Security Fortress SOC console, PM2 server clusters, and AI neural agent logs.',
    passcode: 'sec2026',
    defaultPath: '/security'
  },
  {
    id: 'ADMIN',
    title: 'Super Admin Access',
    icon: Terminal,
    color: '#ef4444', // Red
    desc: 'Unrestricted developer access across all operational, financial, and security layers.',
    passcode: 'admin2026',
    defaultPath: '/'
  }
];

export default function LandingPage() {
  const { setUserRole } = useTheme();
  const [googleView, setGoogleView] = useState(true); // Start with Google search simulation
  const [selectedRole, setSelectedRole] = useState(null);
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleRoleAuth = (e) => {
    e.preventDefault();
    if (!selectedRole) return;

    if (passcode === selectedRole.passcode) {
      setAuthSuccess(true);
      setError('');
      
      // Dispatch authorization event to RealityEngine
      RealityEngine.events = [{
        id: `ev-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'ROLE_AUTHORIZED',
        desc: `Employee console unlocked successfully. Active session role: ${selectedRole.id}.`,
        source: 'SYS/GUARD'
      }, ...RealityEngine.events];
      RealityEngine.notify();

      setTimeout(() => {
        setUserRole(selectedRole.id);
        localStorage.setItem('gatifleet-user-role', selectedRole.id);
        window.location.hash = `#${selectedRole.defaultPath}`;
      }, 1000);
    } else {
      setError('Invalid passcode token. Check role hint below.');
      
      RealityEngine.events = [{
        id: `ev-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'ROLE_AUTH_FAILED',
        desc: `Failed auth attempt for role: ${selectedRole.id}. Invalid passcode signature.`,
        source: 'SYS/GUARD'
      }, ...RealityEngine.events];
      RealityEngine.notify();
    }
  };

  const handleGoogleClick = () => {
    setGoogleView(false);
  };

  const styles = {
    landing: {
      minHeight: '100vh',
      background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
      color: '#f8fafc',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
      overflowX: 'hidden'
    },
    googleContainer: {
      minHeight: '100vh',
      background: '#202124',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      color: '#bdc1c6',
      boxSizing: 'border-box'
    },
    googleSearchBox: {
      width: '100%',
      maxWidth: '650px',
      background: '#303134',
      borderRadius: '24px',
      border: '1px solid transparent',
      padding: '12px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 1px 6px rgba(32,33,36,.28)',
      marginTop: '40px'
    },
    googleResultCard: {
      width: '100%',
      maxWidth: '650px',
      marginTop: '30px',
      textAlign: 'left',
      padding: '20px',
      background: '#303134',
      borderRadius: '12px',
      border: '1px solid #3c4043',
      cursor: 'pointer',
      transition: 'background 0.2s'
    },
    googleResultLink: {
      color: '#8ab4f8',
      fontSize: '20px',
      fontWeight: 500,
      textDecoration: 'none',
      marginBottom: '4px',
      display: 'block'
    },
    cyberGrid: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px)',
      backgroundSize: '40px 40px',
      pointerEvents: 'none'
    },
    hero: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '80px 24px 40px',
      textAlign: 'center',
      position: 'relative',
      zIndex: 10
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      background: 'rgba(15, 23, 42, 0.3)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    logoIcon: {
      width: '36px',
      height: '36px',
      background: 'linear-gradient(135deg, #6366f1, #d946ef)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    logoText: {
      fontSize: '18px',
      fontWeight: 900,
      letterSpacing: '-0.02em',
      background: 'linear-gradient(to right, #6366f1, #ec4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    btnConsole: {
      padding: '10px 20px',
      borderRadius: '100px',
      background: 'rgba(99, 102, 241, 0.1)',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      color: '#818cf8',
      fontWeight: 600,
      fontSize: '13px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    h1: {
      fontSize: '54px',
      fontWeight: 900,
      letterSpacing: '-0.03em',
      lineHeight: 1.1,
      marginBottom: '20px',
      background: 'linear-gradient(to right, #ffffff, #94a3b8)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    p: {
      fontSize: '18px',
      color: '#94a3b8',
      maxWidth: '700px',
      margin: '0 auto 40px',
      lineHeight: 1.6
    },
    portalContainer: {
      maxWidth: '1100px',
      margin: '40px auto 100px',
      padding: '0 24px',
      position: 'relative',
      zIndex: 10
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: 800,
      textAlign: 'center',
      marginBottom: '30px',
      letterSpacing: '-0.02em'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '20px'
    },
    roleCard: (isSelected, color) => ({
      background: 'rgba(15, 23, 42, 0.45)',
      border: isSelected ? `2px solid ${color}` : '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '20px',
      padding: '24px',
      backdropFilter: 'blur(20px)',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      textAlign: 'left',
      boxShadow: isSelected ? `0 0 30px rgba(${hexToRgb(color)}, 0.15)` : 'none',
      transform: isSelected ? 'scale(1.02)' : 'none'
    }),
    roleIconContainer: (color) => ({
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      background: `rgba(${hexToRgb(color)}, 0.1)`,
      color: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '16px'
    }),
    roleTitle: {
      fontSize: '16px',
      fontWeight: 700,
      color: '#ffffff',
      marginBottom: '8px'
    },
    roleDesc: {
      fontSize: '13px',
      color: '#94a3b8',
      lineHeight: 1.5,
      minHeight: '60px'
    },
    badge: (color) => ({
      display: 'inline-block',
      padding: '3px 8px',
      background: `rgba(${hexToRgb(color)}, 0.1)`,
      border: `1px solid rgba(${hexToRgb(color)}, 0.2)`,
      color: color,
      fontSize: '10px',
      fontWeight: 600,
      borderRadius: '4px',
      marginTop: '12px',
      fontFamily: 'var(--font-mono)'
    }),
    authPanel: {
      maxWidth: '480px',
      margin: '40px auto 0',
      background: 'rgba(15, 23, 42, 0.8)',
      border: '1px solid rgba(99, 102, 241, 0.25)',
      borderRadius: '24px',
      padding: '32px',
      backdropFilter: 'blur(30px)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
      animation: 'fadeInUp 0.3s ease-out'
    },
    formInputContainer: {
      position: 'relative',
      marginBottom: '16px'
    },
    input: {
      width: '100%',
      padding: '12px 40px 12px 16px',
      background: 'rgba(0,0,0,0.4)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      color: '#ffffff',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box'
    },
    inputIcon: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#64748b',
      cursor: 'pointer'
    },
    btnSubmit: {
      width: '100%',
      padding: '12px',
      background: authSuccess ? '#10b981' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
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
      boxShadow: authSuccess ? '0 4px 15px rgba(16,185,129,0.3)' : '0 4px 15px rgba(99,102,241,0.3)',
      transition: 'all 0.2s'
    },
    error: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      borderRadius: '10px',
      padding: '10px 14px',
      color: '#fca5a5',
      fontSize: '12px',
      marginBottom: '16px',
      textAlign: 'left'
    }
  };

  // Helper helper to convert hex to rgb
  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  }

  // Google Search Simulator View
  if (googleView) {
    return (
      <div style={styles.googleContainer}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '24px', fontWeight: 700, color: '#ffffff', fontFamily: 'sans-serif', marginTop: '60px' }}>
          <Globe size={24} color="#8ab4f8" />
          <span>Google</span>
        </div>
        
        <div style={styles.googleSearchBox}>
          <Search size={18} color="#9aa0a6" />
          <input 
            type="text" 
            value="gatifleet" 
            readOnly 
            style={{ background: 'none', border: 'none', outline: 'none', color: '#e8eaed', fontSize: '16px', width: '100%' }} 
          />
        </div>

        <div style={styles.googleResultCard} onClick={handleGoogleClick}>
          <div style={{ fontSize: '12px', color: '#bdc1c6', marginBottom: '4px' }}>https://gatifleet.in</div>
          <span style={styles.googleResultLink}>GatiFleet — India's Transportation OS & Dispatch Intelligence</span>
          <p style={{ fontSize: '14px', color: '#bdc1c6', margin: 0, lineHeight: 1.4 }}>
            Experience GatiFleet, the high-performance enterprise OS for logistics. Real-time telemetry monitoring, automated driver rosters, neural route solvers, and role-based workspaces.
          </p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontSize: '12px', color: '#8ab4f8' }}>
            <span>Operations Portal</span>
            <span>CFO Console</span>
            <span>Security Fortress</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.landing}>
      <div style={styles.cyberGrid} />

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <Truck size={18} color="white" />
          </div>
          <span style={styles.logoText}>GATI FLEET</span>
        </div>
        <button style={styles.btnConsole} onClick={() => {
          const el = document.getElementById('access-portal');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}>
          Control Center <ArrowRight size={14} />
        </button>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.h1}>India's Transportation OS</h1>
        <p style={styles.p}>
          A high-performance enterprise monolith coordinating real-time telemetry, automated dispatching, driver rosters, and corporate ledgers under a single intelligence network.
        </p>
        
        <div style={{ display: 'flex', justifySelf: 'center', justifyContent: 'center', gap: '24px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={16} color="#6366f1" />
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>SQLite Relational Ledger</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} color="#10b981" />
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>Real-time WSS Streams</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color="#f59e0b" />
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>Role-based Guard System</span>
          </div>
        </div>
      </section>

      {/* Role-Based Access Portal */}
      <section id="access-portal" style={styles.portalContainer}>
        <h3 style={styles.sectionTitle}>Sentinel-X Gatekeeper Portal</h3>
        
        <div style={styles.grid}>
          {ROLE_TEMPLATES.map((role) => {
            const isSelected = selectedRole?.id === role.id;
            const Icon = role.icon;
            return (
              <div 
                key={role.id}
                style={styles.roleCard(isSelected, role.color)}
                onClick={() => {
                  setSelectedRole(role);
                  setError('');
                  setPasscode('');
                }}
              >
                <div style={styles.roleIconContainer(role.color)}>
                  <Icon size={20} />
                </div>
                <h4 style={styles.roleTitle}>{role.title}</h4>
                <p style={styles.roleDesc}>{role.desc}</p>
                <span style={styles.badge(role.color)}>Role: {role.id}</span>
              </div>
            );
          })}
        </div>

        {selectedRole && (
          <div style={styles.authPanel}>
            <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px', textAlign: 'center' }}>
              Authorize {selectedRole.title}
            </h4>
            <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', marginBottom: '24px' }}>
              Enter Security Verification Passcode. Hint: <code>{selectedRole.passcode}</code>
            </p>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleRoleAuth}>
              <div style={styles.formInputContainer}>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Security Passcode Token"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  style={styles.input}
                  required
                />
                <span style={styles.inputIcon} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </span>
              </div>

              <button type="submit" style={styles.btnSubmit} disabled={authSuccess}>
                {authSuccess ? (
                  <>🔑 Access Granted. Initializing console...</>
                ) : (
                  <>Unlock Console Workspace <ChevronRight size={16} /></>
                )}
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
}
