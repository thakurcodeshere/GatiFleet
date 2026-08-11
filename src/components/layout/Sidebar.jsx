import { useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard, Truck, MapPin, Network, Users,
  Bot, BarChart3, ChevronLeft, ChevronRight, Sparkles,
  IndianRupee, UserCircle, Building2, ShieldCheck
} from 'lucide-react';

const ROLE_PERMISSIONS = {
  OPERATIONS: ['/', '/customer-portal', '/fleet', '/tracking', '/knowledge-graph', '/portals', '/erp', '/copilot', '/profile'],
  FINANCE: ['/', '/customer-portal', '/analytics', '/erp', '/copilot', '/profile'],
  HR: ['/', '/customer-portal', '/hcm', '/profile', '/copilot'],
  CEO: ['/', '/customer-portal', '/analytics', '/crm', '/copilot', '/agents', '/knowledge-graph', '/profile'],
  ADVISOR: ['/', '/customer-portal', '/analytics', '/crm', '/copilot', '/knowledge-graph', '/profile'],
  CFO: ['/', '/customer-portal', '/analytics', '/erp', '/copilot', '/profile'],
  CTO: ['/', '/customer-portal', '/knowledge-graph', '/copilot', '/agents', '/security', '/profile'],
  CRO: ['/', '/customer-portal', '/analytics', '/crm', '/security', '/copilot', '/profile'],
  ADMIN: ['/', '/customer-portal', '/analytics', '/fleet', '/tracking', '/knowledge-graph', '/portals', '/erp', '/crm', '/hcm', '/copilot', '/agents', '/security', '/profile']
};

const navItems = [
  { path: '/agents', label: 'AI Agents', icon: Bot },
  { path: '/copilot', label: 'AI Copilot', icon: Sparkles, badge: 'AI' },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/crm', label: 'CRM', icon: UserCircle },
  { path: '/customer-portal', label: 'Customer Workspace', icon: Building2, badge: 'AI' },
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/erp', label: 'ERP', icon: IndianRupee },
  { path: '/fleet', label: 'Fleet Management', icon: Truck },
  { path: '/hcm', label: 'HCM', icon: Users },
  { path: '/knowledge-graph', label: 'Knowledge Graph', icon: Network },
  { path: '/tracking', label: 'Live Tracking', icon: MapPin },
  { path: '/portals', label: 'Partner Portals', icon: Users, badge: '6' },
  { path: '/security', label: 'Security Fortress', icon: ShieldCheck, badge: 'SOC' },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, userRole } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const allowedPaths = ROLE_PERMISSIONS[userRole] || [];
  const filteredNavItems = navItems.filter(item => allowedPaths.includes(item.path));

  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);
  const isResizingRef = useRef(false);

  const startResizing = useCallback((e) => {
    e.preventDefault();
    if (sidebarCollapsed) return;
    isResizingRef.current = true;
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent) => {
      if (!isResizingRef.current) return;
      const newWidth = moveEvent.clientX;
      if (newWidth > 180 && newWidth < 500) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      setIsResizing(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [sidebarCollapsed]);

  const styles = {
    sidebar: {
      width: sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : `${sidebarWidth}px`,
      height: 'calc(100vh - 68px)',
      background: 'var(--bg-800)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      transition: isResizing ? 'none' : 'width var(--transition-base)',
      position: 'fixed',
      left: 0,
      top: '68px',
      zIndex: 'var(--z-sticky)',
      overflow: 'hidden',
    },
    logo: {
      padding: sidebarCollapsed ? '16px 12px' : '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      borderBottom: '1px solid var(--border-subtle)',
      minHeight: 'var(--topbar-height)',
      cursor: 'pointer',
    },
    logoIcon: {
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-md)',
      background: 'var(--gradient-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    logoText: {
      display: sidebarCollapsed ? 'none' : 'block',
      whiteSpace: 'nowrap',
    },
    logoTitle: {
      fontSize: 'var(--text-lg)',
      fontWeight: 800,
      background: 'var(--gradient-primary)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-0.02em',
    },
    logoSub: {
      fontSize: '10px',
      color: 'var(--text-muted)',
      fontWeight: 500,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
    nav: {
      flex: 1,
      overflow: 'auto',
      padding: '12px 0',
    },
    section: {
      padding: sidebarCollapsed ? '16px 0 4px' : '16px 20px 4px',
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.1em',
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      display: sidebarCollapsed ? 'none' : 'block',
    },
    navItem: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: sidebarCollapsed ? '10px 0' : '10px 20px',
      justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
      margin: sidebarCollapsed ? '2px 8px' : '2px 12px',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      color: isActive ? 'var(--primary-400)' : 'var(--text-secondary)',
      background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
      fontWeight: isActive ? 600 : 400,
      fontSize: 'var(--text-sm)',
      transition: 'all var(--transition-fast)',
      border: 'none',
      width: sidebarCollapsed ? 'auto' : 'calc(100% - 24px)',
      textAlign: 'left',
      position: 'relative',
    }),
    navItemHover: {
      background: 'var(--surface-hover)',
      color: 'var(--text-primary)',
    },
    activeBar: {
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 3,
      height: 20,
      borderRadius: '0 3px 3px 0',
      background: 'var(--primary-500)',
    },
    badge: {
      marginLeft: 'auto',
      padding: '1px 8px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--gradient-primary)',
      color: 'white',
      fontSize: '10px',
      fontWeight: 700,
      display: sidebarCollapsed ? 'none' : 'inline',
    },
    collapseBtn: {
      padding: '12px',
      margin: '8px 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
      gap: '12px',
      borderRadius: 'var(--radius-md)',
      color: 'var(--text-muted)',
      cursor: 'pointer',
      border: '1px solid var(--border-subtle)',
      background: 'transparent',
      fontSize: 'var(--text-sm)',
      transition: 'all var(--transition-fast)',
    },
    stats: {
      padding: sidebarCollapsed ? '12px 8px' : '10px 16px',
      borderTop: '1px solid var(--border-subtle)',
      display: sidebarCollapsed ? 'none' : 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
    },
    statRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '11px',
    },
    statLabel: {
      color: 'var(--text-muted)',
    },
    statValue: {
      color: 'var(--success-500)',
      fontWeight: 600,
      fontFamily: 'var(--font-mono)',
    },
  };

  return (
    <aside style={styles.sidebar}>

      <nav style={styles.nav}>
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              style={styles.navItem(isActive)}
              onClick={() => navigate(item.path)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--surface-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
              title={sidebarCollapsed ? item.label : undefined}
            >
              {isActive && !sidebarCollapsed && <span style={styles.activeBar} />}
              <Icon size={18} />
              {!sidebarCollapsed && <span>{item.label}</span>}
              {item.badge && !sidebarCollapsed && (
                <span style={styles.badge}>{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {!sidebarCollapsed && (
        <div style={styles.stats}>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Status:</span>
            <span style={styles.statValue}>● Operational</span>
          </div>
          <div style={{ width: '1px', height: '12px', background: 'var(--border-subtle)' }} />
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Uptime:</span>
            <span style={{ ...styles.statValue, color: 'var(--text-secondary)' }}>99.97%</span>
          </div>
        </div>
      )}



      <button
        style={styles.collapseBtn}
        onClick={toggleSidebar}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        {!sidebarCollapsed && 'Collapse'}
      </button>

      {/* Drag-to-Resize Handle */}
      {!sidebarCollapsed && (
        <div
          onMouseDown={startResizing}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '6px',
            height: '100%',
            cursor: 'col-resize',
            zIndex: 1000,
            background: isResizing ? 'rgba(99, 102, 241, 0.45)' : 'transparent',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        />
      )}
    </aside>
  );
}
