import { useState, useRef, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import CopilotPanel from '../shared/CopilotPanel';

export default function Layout({ children }) {
  const { copilotOpen, toggleCopilot, sidebarCollapsed } = useTheme();

  const [copilotWidth, setCopilotWidth] = useState(420);
  const [isResizing, setIsResizing] = useState(false);
  const isResizingRef = useRef(false);

  const startResizing = useCallback((e) => {
    e.preventDefault();
    isResizingRef.current = true;
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent) => {
      if (!isResizingRef.current) return;
      const newWidth = window.innerWidth - moveEvent.clientX;
      if (newWidth > 320 && newWidth < 800) {
        setCopilotWidth(newWidth);
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
  }, []);

  const sidebarWidth = sidebarCollapsed ? 72 : 260;

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg-900)',
    },
    main: {
      flex: 1,
      marginLeft: `${sidebarWidth}px`,
      width: `calc(100% - ${sidebarWidth}px)`,
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      transition: 'margin-left var(--transition-base), width var(--transition-base)',
    },
    content: {
      flex: 1,
      padding: '24px',
      overflow: 'auto',
      animation: 'fadeIn 0.3s ease-out',
    },
    copilotWrapper: {
      position: 'fixed',
      right: copilotOpen ? 0 : -copilotWidth,
      top: 0,
      width: copilotWidth,
      height: '100vh',
      zIndex: 'var(--z-overlay)',
      transition: isResizing ? 'none' : 'right var(--transition-base)',
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
        {/* Left resize handle */}
        <div
          onMouseDown={startResizing}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
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
        <CopilotPanel />
      </div>
    </div>
  );
}
