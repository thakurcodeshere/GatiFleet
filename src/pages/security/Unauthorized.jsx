import { useTheme } from '../../context/ThemeContext';
import { ShieldAlert, ArrowLeft, Key } from 'lucide-react';

export default function Unauthorized() {
  const { userRole, logoutUser } = useTheme();

  const handleReturn = () => {
    if (logoutUser) {
      logoutUser();
    } else {
      localStorage.removeItem('gatifleet-user-role');
      window.location.hash = '#/';
      window.location.reload();
    }
  };

  const styles = {
    container: {
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      color: '#f8fafc',
      fontFamily: 'var(--font-sans)'
    },
    box: {
      width: '100%',
      maxWidth: '560px',
      background: 'rgba(15, 23, 42, 0.65)',
      border: '1px solid #ef4444',
      borderRadius: '24px',
      padding: '40px',
      backdropFilter: 'blur(35px)',
      boxShadow: '0 10px 40px rgba(239, 68, 68, 0.15)',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    },
    accentGlow: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #ef4444, #f59e0b)'
    },
    iconOuter: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'rgba(239, 68, 68, 0.08)',
      border: '1px solid rgba(239, 68, 68, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 24px',
      color: '#ef4444'
    },
    h2: {
      fontSize: '24px',
      fontWeight: 800,
      color: '#ffffff',
      marginBottom: '8px',
      letterSpacing: '-0.02em'
    },
    p: {
      fontSize: '13px',
      color: '#94a3b8',
      marginBottom: '24px',
      lineHeight: 1.5
    },
    diagnostics: {
      background: 'rgba(0, 0, 0, 0.25)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '16px',
      textAlign: 'left',
      marginBottom: '32px',
      fontFamily: 'var(--font-mono)'
    },
    diagLine: {
      fontSize: '11px',
      color: '#cbd5e1',
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '6px',
      borderBottom: '1px dashed rgba(255, 255, 255, 0.03)',
      paddingBottom: '4px'
    },
    btnContainer: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center'
    },
    btnBack: {
      padding: '10px 20px',
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      color: '#cbd5e1',
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s'
    },
    btnAuth: {
      padding: '10px 20px',
      borderRadius: '12px',
      background: '#ef4444',
      color: '#ffffff',
      border: 'none',
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
      transition: 'all 0.2s'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.accentGlow} />

        <div style={styles.iconOuter}>
          <ShieldAlert size={36} />
        </div>

        <h2 style={styles.h2}>ACCESS REFUSED</h2>
        <p style={styles.p}>
          Sentinel-X Security Policy Guard blocked access to this operational node. Your current authorization profile does not possess appropriate access credentials.
        </p>

        <div style={styles.diagnostics}>
          <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px', letterSpacing: '0.05em' }}>
            Diagnostic Context
          </div>
          <div style={styles.diagLine}>
            <span style={{ color: '#64748b' }}>Active Profile:</span>
            <span style={{ color: '#f59e0b', fontWeight: 600 }}>{userRole || 'ANONYMOUS'}</span>
          </div>
          <div style={styles.diagLine}>
            <span style={{ color: '#64748b' }}>Security Clearance:</span>
            <span style={{ color: '#ef4444' }}>RESTRICTED</span>
          </div>
          <div style={styles.diagLine}>
            <span style={{ color: '#64748b' }}>Target Node URI:</span>
            <span style={{ color: '#3b82f6' }}>{window.location.hash || '#/'}</span>
          </div>
          <div style={{ ...styles.diagLine, marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
            <span style={{ color: '#64748b' }}>Sentinel-X Policy:</span>
            <span style={{ color: '#10b981' }}>POL-403-ROLE_ENFORCEMENT</span>
          </div>
        </div>

        <div style={styles.btnContainer}>
          <button style={styles.btnBack} onClick={() => window.history.back()}>
            <ArrowLeft size={14} /> Back to Safety
          </button>
          <button style={styles.btnAuth} onClick={handleReturn}>
            <Key size={14} /> Re-Authenticate
          </button>
        </div>
      </div>
    </div>
  );
}
