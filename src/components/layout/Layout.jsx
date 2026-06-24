import { useTheme } from '../../context/ThemeContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import CopilotPanel from '../shared/CopilotPanel';

export default function Layout({ children }) {
  const { sidebarCollapsed, copilotOpen, toggleCopilot } = useTheme();

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg-900)',
    },
    main: {
      flex: 1,
      marginLeft: sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
      transition: 'margin-left var(--transition-base)',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      position: 'relative',
    },
    content: {
      flex: 1,
      padding: '24px',
      overflow: 'auto',
      animation: 'fadeIn 0.3s ease-out',
    },
    copilotWrapper: {
      position: 'fixed',
      right: copilotOpen ? 0 : -420,
      top: 0,
      width: 420,
      height: '100vh',
      zIndex: 'var(--z-overlay)',
      transition: 'right var(--transition-base)',
    },
    copilotOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.4)',
      zIndex: 'var(--z-overlay)',
      opacity: copilotOpen ? 1 : 0,
      pointerEvents: copilotOpen ? 'auto' : 'none',
      transition: 'opacity var(--transition-base)',
    },
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.main}>
        <Topbar />
        <main style={styles.content}>
          {children}
        </main>
      </div>

      {/* AI Copilot Side Panel */}
      <div
        style={styles.copilotOverlay}
        onClick={toggleCopilot}
      />
      <div style={styles.copilotWrapper}>
        <CopilotPanel />
      </div>
    </div>
  );
}
