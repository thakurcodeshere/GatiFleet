import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  Search, Bell, Sun, Moon, Sparkles, User,
  Settings, LogOut, X
} from 'lucide-react';
import { generateAlerts } from '../../data/mockData';

export default function Topbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme, toggleCopilot, copilotOpen } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const alerts = generateAlerts().slice(0, 5);

  const styles = {
    topbar: {
      height: 'var(--topbar-height)',
      background: 'var(--bg-800)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 'var(--z-sticky)',
      backdropFilter: 'blur(20px)',
    },
    left: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flex: 1,
    },
    searchContainer: {
      position: 'relative',
      maxWidth: 480,
      flex: 1,
    },
    searchInput: {
      width: '100%',
      padding: '8px 16px 8px 40px',
      background: searchFocused ? 'var(--bg-700)' : 'var(--bg-900)',
      border: `1px solid ${searchFocused ? 'var(--primary-500)' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-full)',
      color: 'var(--text-primary)',
      fontSize: 'var(--text-sm)',
      outline: 'none',
      transition: 'all var(--transition-fast)',
      fontFamily: 'var(--font-sans)',
    },
    searchIcon: {
      position: 'absolute',
      left: 14,
      top: '50%',
      transform: 'translateY(-50%)',
      color: searchFocused ? 'var(--primary-400)' : 'var(--text-muted)',
      pointerEvents: 'none',
    },
    searchHint: {
      position: 'absolute',
      right: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '2px 8px',
      background: 'var(--bg-600)',
      borderRadius: 'var(--radius-xs)',
      fontSize: '10px',
      color: 'var(--text-muted)',
      pointerEvents: 'none',
    },
    right: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    iconBtn: (isActive = false) => ({
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: isActive ? 'var(--primary-400)' : 'var(--text-secondary)',
      background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
      cursor: 'pointer',
      border: 'none',
      position: 'relative',
      transition: 'all var(--transition-fast)',
    }),
    copilotBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 16px',
      background: copilotOpen ? 'rgba(99, 102, 241, 0.15)' : 'var(--gradient-primary)',
      borderRadius: 'var(--radius-full)',
      color: copilotOpen ? 'var(--primary-400)' : 'white',
      fontSize: 'var(--text-xs)',
      fontWeight: 600,
      cursor: 'pointer',
      border: copilotOpen ? '1px solid var(--primary-500)' : 'none',
      transition: 'all var(--transition-fast)',
      boxShadow: copilotOpen ? 'none' : '0 2px 8px rgba(99, 102, 241, 0.3)',
    },
    notifBadge: {
      position: 'absolute',
      top: 4,
      right: 4,
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--danger-500)',
      border: '2px solid var(--bg-800)',
    },
    dropdown: {
      position: 'absolute',
      top: 'calc(100% + 8px)',
      right: 0,
      width: 380,
      background: 'var(--bg-700)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--surface-border)',
      boxShadow: 'var(--shadow-xl)',
      zIndex: 'var(--z-dropdown)',
      overflow: 'hidden',
      animation: 'fadeInDown 0.2s ease-out',
    },
    dropdownHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      borderBottom: '1px solid var(--border-subtle)',
      fontWeight: 600,
      fontSize: 'var(--text-sm)',
    },
    alertItem: {
      display: 'flex',
      gap: '12px',
      padding: '12px 16px',
      cursor: 'pointer',
      transition: 'background var(--transition-fast)',
      borderBottom: '1px solid var(--border-subtle)',
    },
    alertDot: (type) => ({
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: type === 'danger' ? 'var(--danger-500)' : type === 'warning' ? 'var(--warning-500)' : type === 'success' ? 'var(--success-500)' : 'var(--info-500)',
      marginTop: 6,
      flexShrink: 0,
    }),
    alertTitle: {
      fontWeight: 600,
      fontSize: 'var(--text-xs)',
      color: 'var(--text-primary)',
      marginBottom: 2,
    },
    alertMsg: {
      fontSize: '11px',
      color: 'var(--text-secondary)',
      lineHeight: 1.4,
    },
    alertTime: {
      fontSize: '10px',
      color: 'var(--text-muted)',
      marginTop: 4,
    },
    profileDropdown: {
      position: 'absolute',
      top: 'calc(100% + 8px)',
      right: 0,
      width: 220,
      background: 'var(--bg-700)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--surface-border)',
      boxShadow: 'var(--shadow-xl)',
      zIndex: 'var(--z-dropdown)',
      padding: '8px',
      animation: 'fadeInDown 0.2s ease-out',
    },
    profileItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 12px',
      borderRadius: 'var(--radius-sm)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)',
      cursor: 'pointer',
      border: 'none',
      background: 'transparent',
      width: '100%',
      textAlign: 'left',
      transition: 'all var(--transition-fast)',
    },
    avatarContainer: {
      position: 'relative',
      cursor: 'pointer',
      padding: '2px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--primary-500), #ff007f)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 34,
      height: 34,
      transition: 'all 0.3s ease',
    },
    avatar: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      background: 'var(--bg-700)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-primary)',
      fontWeight: 700,
      fontSize: '11px',
    },
    statusDot: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--success-500)',
      border: '2px solid var(--bg-800)',
      boxShadow: '0 0 8px var(--success-500)',
    },
    divider: {
      height: 1,
      background: 'var(--border-subtle)',
      margin: '4px 0',
    },
  };

  return (
    <header style={styles.topbar}>
      <div style={styles.left}>
        <div style={styles.searchContainer}>
          <Search size={16} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search trucks, drivers, shipments..."
            style={styles.searchInput}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {!searchFocused && !searchValue && (
            <div style={styles.searchHint}>
              <Sparkles size={10} /> AI Search
            </div>
          )}
        </div>
      </div>

      <div style={styles.right}>
        <button
          style={styles.copilotBtn}
          onClick={toggleCopilot}
          onMouseEnter={(e) => {
            if (!copilotOpen) e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Sparkles size={14} />
          {copilotOpen ? 'Close Copilot' : 'Fleet Copilot'}
        </button>

        <button
          style={styles.iconBtn()}
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div style={{ position: 'relative' }}>
          <button
            style={styles.iconBtn(showNotifications)}
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            onMouseEnter={(e) => { if (!showNotifications) e.currentTarget.style.background = 'var(--surface-hover)'; }}
            onMouseLeave={(e) => { if (!showNotifications) e.currentTarget.style.background = 'transparent'; }}
          >
            <Bell size={18} />
            <span style={styles.notifBadge} />
          </button>
          
          {showNotifications && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownHeader}>
                <span>Notifications</span>
                <button 
                  style={{ ...styles.iconBtn(), width: 24, height: 24 }}
                  onClick={() => setShowNotifications(false)}
                >
                  <X size={14} />
                </button>
              </div>
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  style={styles.alertItem}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={styles.alertDot(alert.type)} />
                  <div>
                    <div style={styles.alertTitle}>{alert.title}</div>
                    <div style={styles.alertMsg}>{alert.message}</div>
                    <div style={styles.alertTime}>{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <div
            style={styles.avatarContainer}
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
          >
            <div style={styles.avatar}>AK</div>
            <span style={styles.statusDot} />
          </div>
          
          {showProfile && (
            <div style={styles.profileDropdown}>
              <div style={{ padding: '8px 12px', marginBottom: 4 }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Arjun Kapoor</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>CEO, GatiFleet</div>
              </div>
              <div style={styles.divider} />
              <button
                style={styles.profileItem}
                onClick={() => { navigate('/profile?tab=overview'); setShowProfile(false); }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <User size={16} /> Profile
              </button>
              <button
                style={styles.profileItem}
                onClick={() => { navigate('/profile?tab=platform'); setShowProfile(false); }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <Settings size={16} /> Settings
              </button>
              <div style={styles.divider} />
              <button
                style={{ ...styles.profileItem, color: 'var(--danger-500)' }}
                onClick={() => { alert('Sign out simulations run: User session logs cleared.'); setShowProfile(false); }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--danger-bg)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
