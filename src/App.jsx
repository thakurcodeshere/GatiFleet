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

import { ThemeContext } from './context/ThemeContext';

function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('gatifleet-theme') || 'dark'
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gatifleet-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);
  const toggleCopilot = () => setCopilotOpen(prev => !prev);

  return (
    <ThemeContext.Provider value={{ 
      theme, toggleTheme, 
      sidebarCollapsed, toggleSidebar,
      copilotOpen, toggleCopilot
    }}>
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </ThemeContext.Provider>
  );
}

export default App;
