import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  Search, Bell, Sun, Moon, Sparkles, User,
  Settings, LogOut, X, Truck, LayoutDashboard,
  Building2, BarChart3, MapPin, Network, Users,
  IndianRupee, UserCircle, Bot, ShieldCheck, ChevronRight, PanelLeft
} from 'lucide-react';
import { generateAlerts } from '../../data/mockData';

// Permission Matrix mapping roles to allowed paths
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

// Global System Search Index covering all GatiFleet entities
const GLOBAL_SEARCH_INDEX = [
  // Modules / Pages
  { title: 'Dashboard', desc: 'Overview of fleet KPIs, live dispatch & operations', category: 'Module', path: '/', icon: LayoutDashboard },
  { title: 'Customer Workspace', desc: 'Shipper digital twins & customer portal workspace', category: 'Module', path: '/customer-portal', icon: Building2 },
  { title: 'Analytics & BI', desc: 'Executive intelligence, OTD & revenue metrics', category: 'Module', path: '/analytics', icon: BarChart3 },
  { title: 'Fleet Management', desc: 'Asset health, telematics & vehicle status', category: 'Module', path: '/fleet', icon: Truck },
  { title: 'Live Tracking', desc: 'Real-time GPS map, route corridors & geofencing', category: 'Module', path: '/tracking', icon: MapPin },
  { title: 'Knowledge Graph', desc: 'Node relationships, operational twin & ontology', category: 'Module', path: '/knowledge-graph', icon: Network },
  { title: 'Partner Portals', desc: 'Carrier, vendor & driver portal workspace', category: 'Module', path: '/portals', icon: Users },
  { title: 'ERP Financials', desc: 'Invoicing, billing, rating engine & tax ledger', category: 'Module', path: '/erp', icon: IndianRupee },
  { title: 'CRM Sales Pipeline', desc: 'Leads, opportunities & ARIE pricing engine', category: 'Module', path: '/crm', icon: UserCircle },
  { title: 'HCM Workforce', desc: 'Driver profiles, duty rosters & safety scores', category: 'Module', path: '/hcm', icon: Users },
  { title: 'AI Copilot', desc: 'Sentinel-X AI companion & smart queries', category: 'Module', path: '/copilot', icon: Sparkles },
  { title: 'AI Autonomous Agents', desc: 'Multi-agent consensus & automated dispatch', category: 'Module', path: '/agents', icon: Bot },
  { title: 'Security Fortress', desc: 'Role permissions, SOC compliance & audit logs', category: 'Module', path: '/security', icon: ShieldCheck },
  { title: 'Profile & Settings', desc: 'User profile, system preferences & security', category: 'Module', path: '/profile', icon: Settings },

  // Operational Assets & Telemetry
  { title: 'MH-12-PQ-9012', desc: 'Heavy Duty Volvo FM Truck · In-Transit BOM-DEL Corridor', category: 'Fleet Asset', path: '/fleet', icon: Truck },
  { title: 'DL-01-AB-1234', desc: 'Reefer Refrigerated Trailer (-18°C Active Temp)', category: 'Fleet Asset', path: '/fleet', icon: Truck },
  { title: 'KA-05-MN-5678', desc: 'Tata Prima 4928.S · Depot Workshop Inspection Due', category: 'Fleet Asset', path: '/fleet', icon: Truck },
  { title: 'TS-09-EX-3412', desc: 'EV Express Cargo Van · 92% Battery Charge', category: 'Fleet Asset', path: '/fleet', icon: Truck },

  // Live Shipments & Trips
  { title: 'TRK-9842', desc: 'Mumbai to Delhi Express (On-Time SLA Active)', category: 'Shipment', path: '/tracking', icon: MapPin },
  { title: 'DEL-4019', desc: 'Bengaluru to Hyderabad Reefer Cold Storage', category: 'Shipment', path: '/tracking', icon: MapPin },
  { title: 'TRK-1092', desc: 'Chennai to Kolkata Heavy Freight Corridor', category: 'Shipment', path: '/fleet', icon: Truck },
  { title: 'BLR-8831', desc: 'Pharma Cold Storage Consignment #4092', category: 'Shipment', path: '/tracking', icon: MapPin },

  // CRM & Customer Accounts
  { title: 'Tata Motors Logistics', desc: 'Enterprise Account · ACV $4.2M Contract', category: 'CRM Account', path: '/crm', icon: UserCircle },
  { title: 'Reliance Retail Logistics', desc: 'Active Corridor Bidding · 120 Dedicated Slots', category: 'CRM Opportunity', path: '/crm', icon: UserCircle },
  { title: 'Amazon Commerce Contract', desc: 'Dedicated Trailer Buffer · SLA Target 99.4%', category: 'CRM Contract', path: '/crm', icon: UserCircle },
  { title: 'DP World Corridor', desc: 'Multi-Modal Port SLA & Yard Logistics', category: 'CRM Deal', path: '/crm', icon: UserCircle },

  // ERP Invoices & Tax Ledger
  { title: 'INV-2026-0891', desc: 'Diesel Surcharge Settlement · ₹14,20,500', category: 'ERP Invoice', path: '/erp', icon: IndianRupee },
  { title: 'INV-2026-0742', desc: 'FASTag Toll Clearance & Reconciliation', category: 'ERP Invoice', path: '/erp', icon: IndianRupee },
  { title: 'GST Audit Q2 2026', desc: 'Tax Compliance & Input Credit Ledger', category: 'ERP Financial', path: '/erp', icon: IndianRupee },

  // Intelligence & Graph Nodes
  { title: 'NH48 Western Corridor Node', desc: 'Live Transit Congestion Index 1.12x', category: 'Knowledge Graph', path: '/knowledge-graph', icon: Network },
  { title: 'Reefer Cold Storage Hub Node', desc: 'Warehouse Racks & Battery Charging Stations', category: 'Knowledge Graph', path: '/knowledge-graph', icon: Network },
  { title: 'Sentinel-X Security Audit Log', desc: 'Role Access & Retinal Scan Verification', category: 'Security Event', path: '/security', icon: ShieldCheck },
  { title: 'CAS-8821 Temperature Anomaly', desc: 'Proactive Reefer Alert · Autonomous Resolution', category: 'AI Copilot Alert', path: '/copilot', icon: Sparkles }
];

export default function Topbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme, toggleSidebar, sidebarCollapsed, copilotOpen, userRole, logoutUser } = useTheme();
  
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const alerts = generateAlerts().slice(0, 5);
  const searchRef = useRef(null);

  const allowedPaths = ROLE_PERMISSIONS[userRole] || [];

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search Results filtered strictly by user role permissions
  const searchResults = searchValue.trim() === ''
    ? GLOBAL_SEARCH_INDEX.filter(item => allowedPaths.includes(item.path)).slice(0, 6)
    : GLOBAL_SEARCH_INDEX.filter(item => {
        if (!allowedPaths.includes(item.path)) return false;
        const q = searchValue.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      });

  const styles = {
    topbar: {
      height: '68px',
      background: 'var(--bg-800)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
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
    right: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    searchContainer: {
      position: 'relative',
      width: 240,
      transition: 'width var(--transition-base)',
    },
    searchContainerFocused: {
      width: 360,
    },
    searchInput: {
      width: '100%',
      padding: '8px 30px 8px 36px',
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
    searchResultsDropdown: {
      position: 'absolute',
      top: 'calc(100% + 8px)',
      left: 0,
      width: '100%',
      minWidth: '360px',
      background: 'var(--bg-700)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--surface-border)',
      boxShadow: 'var(--shadow-xl)',
      zIndex: 'var(--z-dropdown)',
      overflow: 'hidden',
      animation: 'fadeInDown 0.15s ease-out',
    },
    searchHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 14px',
      borderBottom: '1px solid var(--border-subtle)',
      fontSize: '11px',
      fontWeight: 600,
      color: 'var(--text-secondary)',
    },
    searchResultItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 12px',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      transition: 'background var(--transition-fast)',
      marginBottom: '2px',
    },
    searchResultIcon: {
      width: 28,
      height: 28,
      borderRadius: 'var(--radius-md)',
      background: 'rgba(99, 102, 241, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    searchCategoryBadge: {
      fontSize: '9px',
      fontWeight: 600,
      padding: '2px 6px',
      borderRadius: 'var(--radius-xs)',
      background: 'rgba(255, 255, 255, 0.06)',
      color: 'var(--text-muted)',
    },
    iconBtn: (isActive = false) => ({
      width: 34,
      height: 34,
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
      top: 3,
      right: 3,
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'var(--danger-500)',
      border: '1.5px solid var(--bg-800)',
    },
    dropdown: {
      position: 'absolute',
      top: 'calc(100% + 8px)',
      right: 0,
      width: 360,
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
      padding: '4px 8px 4px 10px',
      borderRadius: 'var(--radius-md)',
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
      cursor: 'pointer',
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
  };

  return (
    <header style={styles.topbar}>
      <div style={styles.left}>
        {/* Navigation Sidebar Toggle Button */}
        <button
          style={{ ...styles.iconBtn(), width: 34, height: 34, marginRight: '4px' }}
          onClick={toggleSidebar}
          title={sidebarCollapsed ? "Expand Navigation Sidebar" : "Collapse Navigation Sidebar"}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <PanelLeft size={18} color="var(--primary-400)" />
        </button>

        {/* The Single Unified Brand Logo */}
        <div style={styles.logo} onClick={() => navigate('/')}>
          <div style={styles.logoIcon}>
            <Truck size={18} color="white" />
          </div>
          <div style={styles.logoText}>
            <div style={styles.logoTitle}>GatiFleet</div>
            <div style={styles.logoSub}>Transport AI OS</div>
          </div>
        </div>
      </div>

      <div style={styles.right}>
        {/* Permission-based System-wide Search Engine */}
        <div 
          ref={searchRef}
          style={{ ...styles.searchContainer, ...((searchFocused || searchValue) ? styles.searchContainerFocused : {}) }}
        >
          <Search size={14} style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search modules, shipments, assets, invoices..."
            style={styles.searchInput}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
          />
          {searchValue && (
            <button
              onClick={() => setSearchValue('')}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={12} />
            </button>
          )}

          {/* Search Dropdown Modal */}
          {searchFocused && (
            <div style={styles.searchResultsDropdown}>
              <div style={styles.searchHeader}>
                <span>Search Results ({searchResults.length})</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {userRole} Permission Filter
                </span>
              </div>
              
              {searchResults.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                  No accessible items match "{searchValue}"
                </div>
              ) : (
                <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '4px' }}>
                  {searchResults.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={idx}
                        style={styles.searchResultItem}
                        onClick={() => {
                          navigate(item.path);
                          setSearchFocused(false);
                          setSearchValue('');
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div style={styles.searchResultIcon}>
                          <Icon size={14} color="var(--primary-400)" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                            <span style={{ fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.title}
                            </span>
                            <span style={styles.searchCategoryBadge}>{item.category}</span>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                            {item.desc}
                          </div>
                        </div>
                        <ChevronRight size={14} color="var(--text-muted)" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>



        {/* Theme Toggle Button */}
        <button
          style={styles.iconBtn()}
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Profile Card Container with Bell Icon INSIDE */}
        <div style={{ position: 'relative' }}>
          <div
            style={styles.profileCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            {/* Avatar */}
            <div
              style={styles.avatarContainer}
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            >
              <span style={{ color: 'var(--text-primary)' }}>AK</span>
              <span style={styles.statusDot} />
            </div>

            {/* User Name & Role Block */}
            <div
              style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.1, cursor: 'pointer' }}
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            >
              <span style={{ fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>Arjun Kapoor</span>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{userRole?.toLowerCase()} Console</span>
            </div>

            {/* Vertical Divider inside Profile Block */}
            <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)', margin: '0 4px' }} />

            {/* Notification Bell Button INSIDE Profile Block */}
            <button
              style={{
                ...styles.iconBtn(showNotifications),
                width: 28,
                height: 28,
                borderRadius: '50%',
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              title="Notifications"
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = showNotifications ? 'rgba(99, 102, 241, 0.1)' : 'transparent'; }}
            >
              <Bell size={15} />
              <span style={styles.notifBadge} />
            </button>
          </div>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownHeader}>
                <span>Notifications ({alerts.length})</span>
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

          {/* Profile Dropdown */}
          {showProfile && (
            <div style={styles.profileDropdown}>
              <div style={{ padding: '8px 12px', marginBottom: 4 }}>
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Arjun Kapoor</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>Role: {userRole?.toLowerCase()}</div>
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
                onClick={() => { logoutUser(); setShowProfile(false); }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--danger-bg)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <LogOut size={16} /> Exit Console
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
