import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  Search, Bell, Sun, Moon, Sparkles, User,
  Settings, LogOut, X, Truck, LayoutDashboard,
  Building2, BarChart3, MapPin, Network, Users,
  IndianRupee, UserCircle, Bot, ShieldCheck
} from 'lucide-react';
import { generateAlerts } from '../../data/mockData';

const menuSections = [
  {
    key: 'overview',
    label: 'Overview',
    items: [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/customer-portal', label: 'Customer Workspace', icon: Building2, badge: 'AI' },
      { path: '/analytics', label: 'Analytics', icon: BarChart3 }
    ]
  },
  {
    key: 'operations',
    label: 'Operations',
    items: [
      { path: '/fleet', label: 'Fleet Management', icon: Truck },
      { path: '/tracking', label: 'Live Tracking', icon: MapPin },
      { path: '/knowledge-graph', label: 'Knowledge Graph', icon: Network },
      { path: '/portals', label: 'Partner Portals', icon: Users, badge: '6' }
    ]
  },
  {
    key: 'enterprise',
    label: 'Enterprise',
    items: [
      { path: '/erp', label: 'ERP', icon: IndianRupee },
      { path: '/crm', label: 'CRM', icon: UserCircle },
      { path: '/hcm', label: 'HCM', icon: Users }
    ]
  },
  {
    key: 'intelligence',
    label: 'AI Intelligence',
    items: [
      { path: '/copilot', label: 'AI Copilot', icon: Sparkles, badge: 'AI' },
      { path: '/agents', label: 'AI Agents', icon: Bot }
    ]
  },
  {
    key: 'security',
    label: 'Security',
    items: [
      { path: '/security', label: 'Security Fortress', icon: ShieldCheck, badge: 'SOC' }
    ]
  }
];

export default function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme, toggleCopilot, copilotOpen } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const alerts = generateAlerts().slice(0, 5);

  const styles = {
    topbar: {
      height: '68px',
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
      gap: '12px',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
    },
    logoIcon: {
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-md)',
      background: 'var(--gradient-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    logoText: {
      display: 'block',
    },
    logoTitle: {
      fontSize: '16px',
      fontWeight: 800,
      background: 'var(--gradient-primary)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    logoSub: {
      fontSize: '8px',
      color: 'var(--text-muted)',
      fontWeight: 500,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    navStrip: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    navHeaderBtn: (isActive, isOpen) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 14px',
      borderRadius: 'var(--radius-md)',
      background: isOpen ? 'rgba(255,255,255,0.03)' : 'transparent',
      border: 'none',
      color: isActive ? 'var(--primary-400)' : isOpen ? 'var(--text-primary)' : 'var(--text-secondary)',
      fontWeight: isActive || isOpen ? 600 : 500,
      fontSize: 'var(--text-sm)',
      cursor: 'pointer',
      transition: 'all var(--transition-fast)',
      position: 'relative',
      fontFamily: 'var(--font-sans)',
    }),
    arrow: (isOpen) => ({
      fontSize: '8px',
      transition: 'transform var(--transition-fast)',
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      color: 'var(--text-muted)',
    }),
    activeDot: {
      position: 'absolute',
      bottom: '2px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      background: 'var(--primary-500)',
      boxShadow: '0 0 6px var(--primary-500)',
    },
    navDropdown: {
      position: 'absolute',
      top: 'calc(100% + 4px)',
      left: 0,
      width: '220px',
      background: 'var(--bg-700)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--surface-border)',
      boxShadow: 'var(--shadow-xl)',
      zIndex: 'var(--z-dropdown)',
      padding: '6px',
      animation: 'fadeInDown 0.15s ease-out',
    },
    dropdownItem: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 12px',
      borderRadius: 'var(--radius-md)',
      fontSize: 'var(--text-sm)',
      color: isActive ? 'var(--primary-400)' : 'var(--text-secondary)',
      background: isActive ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
      cursor: 'pointer',
      border: 'none',
      width: '100%',
      textAlign: 'left',
      transition: 'all var(--transition-fast)',
      marginBottom: '2px',
      fontFamily: 'var(--font-sans)',
    }),
    badge: {
      padding: '1px 6px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--gradient-primary)',
      color: 'white',
      fontSize: '9px',
      fontWeight: 700,
    },
    right: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    searchContainer: {
      position: 'relative',
      width: 220,
      transition: 'width var(--transition-base)',
    },
    searchContainerFocused: {
      width: 280,
    },
    searchInput: {
      width: '100%',
      padding: '8px 14px 8px 36px',
      background: searchFocused ? 'var(--bg-700)' : 'var(--bg-900)',
      border: `1px solid ${searchFocused ? 'var(--primary-500)' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-full)',
      color: 'var(--text-primary)',
      fontSize: 'var(--text-xs)',
      outline: 'none',
      transition: 'all var(--transition-fast)',
      fontFamily: 'var(--font-sans)',
    },
    searchIcon: {
      position: 'absolute',
      left: 12,
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
      fontSize: '9px',
      color: 'var(--text-muted)',
      pointerEvents: 'none',
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
      gap: '6px',
      padding: '6px 14px',
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
      fontFamily: 'var(--font-sans)',
    },
    profileCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '4px 10px',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '1px solid var(--border-subtle)',
      background: 'rgba(255,255,255,0.02)',
    },
    avatarContainer: {
      position: 'relative',
      width: 30,
      height: 30,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--primary-500), #ff007f)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      fontSize: '10px',
      color: 'var(--text-primary)',
      flexShrink: 0,
    },
    statusDot: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--success-500)',
      border: '1.5px solid var(--bg-800)',
      boxShadow: '0 0 4px var(--success-500)',
    },
    divider: {
      height: 1,
      background: 'var(--border-subtle)',
      margin: '4px 0',
    },
    statusPill: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 10px',
      background: 'rgba(16, 185, 129, 0.06)',
      border: '1px solid rgba(16, 185, 129, 0.15)',
      borderRadius: 'var(--radius-full)',
      fontSize: '11px',
      color: 'var(--success-400)',
    },
  };

  return (
    <header style={styles.topbar}>
      <div style={styles.left}>
        {/* Logo */}
        <div style={styles.logo} onClick={() => navigate('/')}>
          <div style={styles.logoIcon}>
            <Truck size={18} color="white" />
          </div>
          <div style={styles.logoText}>
            <div style={styles.logoTitle}>GatiFleet</div>
            <div style={styles.logoSub}>Transport AI OS</div>
          </div>
        </div>

        {/* Vertical divider */}
        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)', margin: '0 12px' }} />

        {/* Horizontal Navigation Strip */}
        <nav style={styles.navStrip}>
          {menuSections.map((sec) => {
            const isSecActive = sec.items.some(item => location.pathname === item.path);
            const isOpen = activeMenu === sec.key;
            
            return (
              <div
                key={sec.key}
                style={{ position: 'relative' }}
                onMouseEnter={() => setActiveMenu(sec.key)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button 
                  style={styles.navHeaderBtn(isSecActive, isOpen)}
                  onMouseEnter={(e) => {
                    if (!isSecActive && !isOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSecActive && !isOpen) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span>{sec.label}</span>
                  <span style={styles.arrow(isOpen)}>▼</span>
                  {isSecActive && <span style={styles.activeDot} />}
                </button>

                {isOpen && (
                  <div style={styles.navDropdown}>
                    {sec.items.map((item) => {
                      const isItemActive = location.pathname === item.path;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.path}
                          style={styles.dropdownItem(isItemActive)}
                          onClick={() => {
                            navigate(item.path);
                            setActiveMenu(null);
                          }}
                          onMouseEnter={(e) => {
                            if (!isItemActive) e.currentTarget.style.background = 'var(--surface-hover)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isItemActive) e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <Icon size={16} />
                          <span style={{ flex: 1 }}>{item.label}</span>
                          {item.badge && <span style={styles.badge}>{item.badge}</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div style={styles.right}>
        {/* Search Input */}
        <div style={{ ...styles.searchContainer, ...(searchFocused ? styles.searchContainerFocused : {}) }}>
          <Search size={14} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search..."
            style={styles.searchInput}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {!searchFocused && !searchValue && (
            <div style={styles.searchHint}>
              <Sparkles size={9} /> AI Search
            </div>
          )}
        </div>

        {/* Status Pill */}
        <div style={styles.statusPill}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success-500)', display: 'inline-block' }} />
          <span>99.97% Uptime</span>
        </div>

        <button
          style={styles.copilotBtn}
          onClick={toggleCopilot}
          onMouseEnter={(e) => {
            if (!copilotOpen) e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Sparkles size={12} />
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

        {/* Notifications */}
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

        {/* Profile Card Trigger */}
        <div style={{ position: 'relative' }}>
          <div
            style={styles.profileCard}
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <div style={styles.avatarContainer}>
              <span style={{ color: 'var(--text-primary)' }}>AK</span>
              <span style={styles.statusDot} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.1 }}>
              <span style={{ fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>Arjun Kapoor</span>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>CEO</span>
            </div>
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
