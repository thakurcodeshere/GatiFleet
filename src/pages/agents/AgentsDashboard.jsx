/* eslint-disable */
// ============================================================
// GatiFleet — AI Agents Dashboard
// Autonomous agents powering your operations
// ============================================================
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, IndianRupee, Users, TrendingUp, Route, Server, Brain,
  Zap, CheckCircle2, Clock, ArrowRight, Activity, Sparkles,
  CircleDot, ListChecks, BarChart3, Eye, ChevronRight,
  Layers, Timer, Target, BadgeCheck, Play, Check, RefreshCw, X,
  ShieldAlert, Cpu, Terminal, ChevronLeft
} from 'lucide-react';
import { aiAgents, aiAgentsExtendedData } from '../../data/mockData';

// ---- Icon map ----
const ICON_MAP = {
  IndianRupee, Users, TrendingUp, Route, Server, Brain,
};

// ---- Keyframes injected once ----
const KEYFRAMES_ID = 'gatifleet-agents-keyframes';
const injectKeyframes = () => {
  if (document.getElementById(KEYFRAMES_ID)) return;
  const style = document.createElement('style');
  style.id = KEYFRAMES_ID;
  style.textContent = `
    @keyframes gati-pulse-ring {
      0% { transform: scale(0.85); opacity: 0.7; }
      70% { transform: scale(1.35); opacity: 0; }
      100% { transform: scale(1.35); opacity: 0; }
    }
    @keyframes gati-glow-breathe {
      0%, 100% { opacity: 0.35; }
      50% { opacity: 0.65; }
    }
    @keyframes gati-status-dot {
      0%, 100% { box-shadow: 0 0 0 0 currentColor; }
      50% { box-shadow: 0 0 8px 3px currentColor; }
    }
    @keyframes gati-timeline-line {
      from { height: 0; }
      to   { height: 100%; }
    }
    @keyframes gati-console-cursor {
      0%, 100% { opacity: 0; }
      50% { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
};

// ---- Circular progress ring ----
const CircularProgress = ({ value, size = 52, stroke = 4, color }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="var(--bg-600)" strokeWidth={stroke}
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)' }}
      />
      <text
        x={size / 2} y={size / 2}
        textAnchor="middle" dominantBaseline="central"
        style={{
          transform: 'rotate(90deg)',
          transformOrigin: 'center',
          fill: 'var(--text-primary)',
          fontSize: size * 0.24,
          fontWeight: 700,
          fontFamily: 'var(--font-mono)',
        }}
      >
        {value}%
      </text>
    </svg>
  );
};

// ============================================================
// Main Component
// ============================================================
const AgentsDashboard = () => {
  useEffect(() => { injectKeyframes(); }, []);

  const [hoveredAgent, setHoveredAgent] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [agents, setAgents] = useState(aiAgents);
  
  // Execution Console State
  const [executingTool, setExecutingTool] = useState(null); // tool name
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const selectedAgent = useMemo(() => {
    if (!selectedAgentId) return null;
    return agents.find(a => a.id === selectedAgentId);
  }, [selectedAgentId, agents]);

  const extendedDetails = useMemo(() => {
    if (!selectedAgentId) return null;
    return aiAgentsExtendedData[selectedAgentId];
  }, [selectedAgentId]);

  // Compute summary stats
  const summary = useMemo(() => {
    const totalTasks = agents.reduce((s, a) => s + a.tasksCompleted, 0);
    const inQueue = agents.reduce((s, a) => s + a.tasksInQueue, 0);
    const avgSuccess = +(agents.reduce((s, a) => s + a.successRate, 0) / agents.length).toFixed(1);
    const activeCount = agents.filter(a => a.status === 'active').length;
    const totalCount = agents.length;
    return { totalTasks, inQueue, avgSuccess, activeCount, totalCount };
  }, [agents]);

  // Build global timeline from all agents
  const timeline = useMemo(() => {
    return agents
      .flatMap(agent =>
        agent.recentActions.map(action => ({ ...action, agentName: agent.name, agentColor: agent.color, agentIcon: agent.icon }))
      )
      .sort((a, b) => {
        const parseTime = t => {
          const n = parseFloat(t);
          if (t.includes('min')) return n;
          if (t.includes('h')) return n * 60;
          return n * 60;
        };
        return parseTime(a.time) - parseTime(b.time);
      })
      .slice(0, 10);
  }, [agents]);

  // Manually execute an agent tool
  const handleExecuteTool = (tool) => {
    if (executingTool) return;
    setExecutingTool(tool.name);
    setConsoleLogs([
      `[SYSTEM] Initializing Agent Tool: ${tool.name}...`,
      `[SYSTEM] Binding reasoning engine variables...`
    ]);

    setTimeout(() => {
      setConsoleLogs(prev => [...prev, `[PROCESSING] Core routine loaded. Action: ${tool.actionText}`]);
    }, 800);

    setTimeout(() => {
      setConsoleLogs(prev => [...prev, `[AUDITING] Validation telemetry variables: Success.`]);
    }, 1600);

    setTimeout(() => {
      setConsoleLogs(prev => [...prev, `[SUCCESS] Automated execute sequence finished. Task registry updated.`]);
      
      // Update agent metrics statefully
      setAgents(prev => prev.map(a => {
        if (a.id === selectedAgentId) {
          return {
            ...a,
            tasksCompleted: a.tasksCompleted + 1,
            tasksInQueue: Math.max(a.tasksInQueue - 1, 0),
            lastAction: `Manual execution: ${tool.name} successfully run.`
          };
        }
        return a;
      }));

      setExecutingTool(null);
      showToast(`AI ${selectedAgent.name} successfully executed tool: ${tool.name}`);
    }, 2400);
  };

  // ---- Styles ----
  const styles = {
    page: {
      minHeight: '100vh',
      padding: '32px',
      background: 'var(--bg-900)',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-primary)',
    },
    header: {
      marginBottom: '32px',
    },
    titleRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '6px',
    },
    titleIcon: {
      width: 48, height: 48,
      borderRadius: 'var(--radius-md)',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 24px rgba(99,102,241,0.3)',
    },
    title: {
      fontSize: '28px',
      fontWeight: 800,
      background: 'linear-gradient(135deg, #e0e0e0, #818cf8)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: '-0.5px',
    },
    subtitle: {
      fontSize: '14px',
      color: 'var(--text-secondary)',
      marginLeft: '64px',
    },
    liveIndicator: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      marginLeft: '16px',
      padding: '4px 12px',
      borderRadius: '20px',
      background: 'rgba(56,206,60,0.1)',
      border: '1px solid rgba(56,206,60,0.25)',
      fontSize: '11px',
      fontWeight: 600,
      color: '#38CE3C',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
    },
    liveDot: {
      width: 8, height: 8,
      borderRadius: '50%',
      background: '#38CE3C',
      animation: 'gati-status-dot 2s ease-in-out infinite',
      color: '#38CE3C',
    },

    // Summary bar
    summaryBar: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '32px',
    },
    summaryCard: {
      background: 'var(--surface)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--surface-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    summaryIconWrap: (color) => ({
      width: 44, height: 44,
      borderRadius: 'var(--radius-md)',
      background: `${color}18`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }),
    summaryLabel: {
      fontSize: '12px',
      color: 'var(--text-muted)',
      marginBottom: '2px',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    summaryValue: {
      fontSize: '24px',
      fontWeight: 800,
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-primary)',
    },

    // Agent grid
    agentGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '24px',
      marginBottom: '40px',
    },

    // Agent card
    agentCard: (color, isHovered) => ({
      position: 'relative',
      background: 'var(--surface)',
      backdropFilter: 'blur(20px)',
      border: `1px solid ${isHovered ? color + '50' : 'var(--surface-border)'}`,
      borderRadius: 'var(--radius-xl)',
      padding: '28px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'border-color 0.3s ease',
    }),
    cardGlow: (color) => ({
      position: 'absolute',
      top: 0, left: 0, right: 0,
      height: '3px',
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      animation: 'gati-glow-breathe 3s ease-in-out infinite',
    }),
    cardBgGlow: (color) => ({
      position: 'absolute',
      top: '-40px', right: '-40px',
      width: '140px', height: '140px',
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color}12, transparent 70%)`,
      pointerEvents: 'none',
    }),
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
      position: 'relative',
      zIndex: 1,
    },
    cardIconWrap: (color) => ({
      width: 48, height: 48,
      borderRadius: 'var(--radius-md)',
      background: `${color}18`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }),
    cardPulse: (color) => ({
      position: 'absolute',
      inset: 0,
      borderRadius: 'var(--radius-md)',
      border: `2px solid ${color}40`,
      animation: 'gati-pulse-ring 2.5s ease-out infinite',
    }),
    statusBadge: (status) => ({
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.6px',
      background: status === 'active' ? 'rgba(56,206,60,0.12)' : 'rgba(255,222,115,0.12)',
      color: status === 'active' ? '#38CE3C' : '#FFDE73',
      border: `1px solid ${status === 'active' ? 'rgba(56,206,60,0.25)' : 'rgba(255,222,115,0.25)'}`,
    }),
    statusDotSmall: (status) => ({
      width: 6, height: 6,
      borderRadius: '50%',
      background: status === 'active' ? '#38CE3C' : '#FFDE73',
      animation: status === 'active' ? 'gati-status-dot 2s ease-in-out infinite' : 'none',
      color: status === 'active' ? '#38CE3C' : '#FFDE73',
    }),
    agentName: {
      fontSize: '18px',
      fontWeight: 700,
      color: 'var(--text-primary)',
      marginBottom: '4px',
    },
    lastAction: {
      fontSize: '12px',
      color: 'var(--text-secondary)',
      marginBottom: '20px',
      lineHeight: 1.4,
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    statsRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '20px',
    },
    statBlock: {
      flex: 1,
    },
    statLabel: {
      fontSize: '10px',
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '2px',
    },
    statValue: {
      fontSize: '18px',
      fontWeight: 700,
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-primary)',
    },
    capabilitiesWrap: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      marginBottom: '20px',
    },
    capBadge: (color) => ({
      padding: '3px 10px',
      borderRadius: '10px',
      fontSize: '10px',
      fontWeight: 600,
      background: `${color}14`,
      color: color,
      border: `1px solid ${color}28`,
      whiteSpace: 'nowrap',
    }),
    recentHeader: {
      fontSize: '11px',
      fontWeight: 600,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.6px',
      marginBottom: '10px',
    },
    recentItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      padding: '8px 0',
      borderBottom: '1px solid var(--surface-border)',
    },
    recentDot: (color) => ({
      width: 6, height: 6,
      borderRadius: '50%',
      background: color,
      marginTop: '5px',
      flexShrink: 0,
    }),
    recentText: {
      fontSize: '12px',
      color: 'var(--text-secondary)',
      flex: 1,
      lineHeight: 1.4,
    },
    recentTime: {
      fontSize: '10px',
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap',
      marginTop: '2px',
    },
    viewBtn: (color) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      width: '100%',
      padding: '10px 0',
      marginTop: '16px',
      borderRadius: 'var(--radius-md)',
      background: `${color}14`,
      border: `1px solid ${color}28`,
      color: color,
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }),

    // Timeline section
    timelineSection: {
      background: 'var(--surface)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--surface-border)',
      borderRadius: 'var(--radius-xl)',
      padding: '28px 32px',
    },
    timelineTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '18px',
      fontWeight: 700,
      color: 'var(--text-primary)',
      marginBottom: '24px',
    },
    timelineList: {
      position: 'relative',
      paddingLeft: '28px',
    },
    timelineLine: {
      position: 'absolute',
      left: '7px',
      top: '8px',
      bottom: '8px',
      width: '2px',
      background: 'linear-gradient(180deg, var(--primary-500), var(--bg-600))',
      borderRadius: '1px',
    },
    timelineItem: {
      position: 'relative',
      paddingBottom: '20px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
    },
    timelineDot: (color) => ({
      position: 'absolute',
      left: '-24px',
      top: '4px',
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      background: color,
      border: '3px solid var(--bg-800)',
      boxShadow: `0 0 8px ${color}50`,
      zIndex: 2,
      flexShrink: 0,
    }),
    timelineContent: {
      flex: 1,
    },
    timelineAgent: (color) => ({
      fontSize: '11px',
      fontWeight: 700,
      color: color,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '2px',
    }),
    timelineAction: {
      fontSize: '13px',
      color: 'var(--text-primary)',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    timelineTime: {
      fontSize: '11px',
      color: 'var(--text-muted)',
      whiteSpace: 'nowrap',
      marginTop: '2px',
    },

    // Drawer Styles
    drawerOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(10, 14, 26, 0.65)',
      backdropFilter: 'blur(5px)',
      zIndex: 100,
    },
    drawer: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '440px',
      background: 'var(--surface)',
      borderLeft: '1px solid var(--surface-border)',
      boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.65)',
      zIndex: 101,
      padding: '28px',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      paddingBottom: '20px',
      borderBottom: '1px solid var(--surface-border)',
    },
    drawerAgentTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
    },
    consoleWindow: {
      background: '#070a13',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      borderRadius: 'var(--radius-md)',
      padding: '16px',
      fontFamily: 'var(--font-mono)',
      fontSize: '12px',
      color: '#38CE3C',
      height: '180px',
      overflowY: 'auto',
      marginBottom: '24px',
      boxShadow: 'inset 0 0 15px rgba(0,0,0,0.8)',
    },
    consoleLine: {
      marginBottom: '6px',
      lineHeight: 1.4,
    },
    actionCenter: (color) => ({
      background: `${color}06`,
      border: `1px solid ${color}1d`,
      borderRadius: '8px',
      padding: '18px',
      marginTop: 'auto',
    })
  };

  // Summary cards data
  const summaryCards = [
    { label: 'Tasks Completed', value: summary.totalTasks.toLocaleString('en-IN'), icon: <CheckCircle2 size={20} />, color: '#38CE3C' },
    { label: 'Tasks in Queue', value: summary.inQueue.toString(), icon: <ListChecks size={20} />, color: '#3b82f6' },
    { label: 'Avg Success Rate', value: `${summary.avgSuccess}%`, icon: <Target size={20} />, color: '#f59e0b' },
    { label: 'Agents Active', value: `${summary.activeCount}/${summary.totalCount}`, icon: <Bot size={20} />, color: '#6366f1' },
  ];

  return (
    <div style={styles.page}>
      {/* ---- Header ---- */}
      <header style={styles.header}>
        <div style={styles.titleRow}>
          <div style={styles.titleIcon}>
            <Bot size={26} color="#fff" />
          </div>
          <h1 style={styles.title}>AI Agents</h1>
          <span style={styles.liveIndicator}>
            <span style={styles.liveDot} />
            Live
          </span>
        </div>
        <p style={styles.subtitle}>Autonomous agents powering your operations</p>
      </header>

      {/* ---- Summary Bar ---- */}
      <motion.div
        style={styles.summaryBar}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            style={styles.summaryCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.45 }}
          >
            <div style={styles.summaryIconWrap(card.color)}>
              {React.cloneElement(card.icon, { color: card.color })}
            </div>
            <div>
              <div style={styles.summaryLabel}>{card.label}</div>
              <div style={styles.summaryValue}>{card.value}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ---- Agent Cards Grid ---- */}
      <div style={styles.agentGrid}>
        {agents.map((agent, idx) => {
          const IconComp = ICON_MAP[agent.icon] || Bot;
          const isHovered = hoveredAgent === agent.id;

          return (
            <motion.div
              key={agent.id}
              style={styles.agentCard(agent.color, isHovered)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedAgentId(agent.id)}
              transition={{ delay: 0.12 + idx * 0.08, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{
                y: -4,
                boxShadow: `0 12px 40px ${agent.color}18`,
                transition: { duration: 0.25 },
              }}
              onMouseEnter={() => setHoveredAgent(agent.id)}
              onMouseLeave={() => setHoveredAgent(null)}
            >
              {/* Top glow bar */}
              <div style={styles.cardGlow(agent.color)} />
              {/* Background glow */}
              <div style={styles.cardBgGlow(agent.color)} />

              {/* Card Header */}
              <div style={styles.cardHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={styles.cardIconWrap(agent.color)}>
                    <IconComp size={22} color={agent.color} />
                    {agent.status === 'active' && <div style={styles.cardPulse(agent.color)} />}
                  </div>
                  <div>
                    <div style={styles.agentName}>{agent.name}</div>
                  </div>
                </div>
                <div style={styles.statusBadge(agent.status)}>
                  <span style={styles.statusDotSmall(agent.status)} />
                  {agent.status === 'active' ? 'Active' : 'Idle'}
                </div>
              </div>

              {/* Last action */}
              <div style={styles.lastAction}>
                <Sparkles size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle', color: agent.color }} />
                {agent.lastAction}
              </div>

              {/* Stats Row */}
              <div style={styles.statsRow}>
                <div style={styles.statBlock}>
                  <div style={styles.statLabel}>Completed</div>
                  <div style={styles.statValue}>{agent.tasksCompleted.toLocaleString('en-IN')}</div>
                </div>
                <div style={styles.statBlock}>
                  <div style={styles.statLabel}>In Queue</div>
                  <div style={styles.statValue}>{agent.tasksInQueue}</div>
                </div>
                <CircularProgress value={agent.successRate} color={agent.color} />
              </div>

              {/* Capabilities */}
              <div style={styles.capabilitiesWrap}>
                {agent.capabilities.slice(0, 3).map(cap => (
                  <span key={cap} style={styles.capBadge(agent.color)}>{cap}</span>
                ))}
                {agent.capabilities.length > 3 && (
                  <span style={styles.capBadge(agent.color)}>+{agent.capabilities.length - 3} more</span>
                )}
              </div>

              {/* Recent Actions */}
              <div style={styles.recentHeader}>Recent Actions</div>
              {agent.recentActions.slice(0, 2).map((action, i) => (
                <div key={i} style={{
                  ...styles.recentItem,
                  borderBottom: i === 1 ? 'none' : '1px solid var(--surface-border)',
                }}>
                  <div style={styles.recentDot(agent.color)} />
                  <div style={styles.recentText}>{action.action}</div>
                  <div style={styles.recentTime}>{action.time}</div>
                </div>
              ))}

              {/* View Details Button */}
              <motion.button
                style={styles.viewBtn(agent.color)}
                whileHover={{ scale: 1.02, background: `${agent.color}22` }}
                whileTap={{ scale: 0.98 }}
              >
                <Eye size={14} />
                Command Center Workspace
                <ChevronRight size={14} />
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* ---- Activity Timeline ---- */}
      <motion.div
        style={styles.timelineSection}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div style={styles.timelineTitle}>
          <Activity size={20} color="var(--primary-400)" />
          Activity Timeline
          <span style={{
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--text-muted)',
            marginLeft: 'auto',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Latest across all agents
          </span>
        </div>

        <div style={styles.timelineList}>
          <div style={styles.timelineLine} />
          {timeline.map((item, i) => {
            const IconComp = ICON_MAP[item.agentIcon] || Bot;
            return (
              <motion.div
                key={i}
                style={styles.timelineItem}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.06, duration: 0.35 }}
              >
                <div style={styles.timelineDot(item.agentColor)} />
                <div style={styles.timelineContent}>
                  <div style={styles.timelineAgent(item.agentColor)}>{item.agentName}</div>
                  <div style={styles.timelineAction}>{item.action}</div>
                </div>
                <div style={styles.timelineTime}>
                  <Clock size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  {item.time}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ---- AI AGENT COGNITIVE WORKSPACE DRAWER ---- */}
      <AnimatePresence>
        {selectedAgent && extendedDetails && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!executingTool) setSelectedAgentId(null);
              }}
              style={styles.drawerOverlay}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              style={styles.drawer}
            >
              {/* Header */}
              <div style={styles.drawerHeader}>
                <div style={styles.drawerAgentTitle}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: `${selectedAgent.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${selectedAgent.color}40`,
                  }}>
                    {React.createElement(ICON_MAP[selectedAgent.icon] || Bot, { size: 20, color: selectedAgent.color })}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>{selectedAgent.name} Workspace</h2>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Autonomous Reasoning Console</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAgentId(null)}
                  disabled={!!executingTool}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: executingTool ? 'not-allowed' : 'pointer',
                    padding: '4px',
                    opacity: executingTool ? 0.4 : 1
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Agent Focus Memory State */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={13} color={selectedAgent.color} />
                  Agent Focus Memory Parameters
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {extendedDetails.memoryState.map((mem) => (
                    <div key={mem.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-800)', borderRadius: '6px', border: '1px solid var(--surface-border)', fontSize: '12px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{mem.key}</span>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{mem.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cognitive Reasoning Logs */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Brain size={13} color={selectedAgent.color} />
                  Chain-of-Thought Reasoning
                </div>
                <div style={{
                  background: '#070a13',
                  border: '1px solid var(--surface-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.7)',
                  maxHeight: '120px',
                  overflowY: 'auto'
                }}>
                  {extendedDetails.thinkingConsole.map((line, i) => (
                    <div key={i} style={{ marginBottom: '6px', lineHeight: 1.4, color: i === 3 ? selectedAgent.color : 'rgba(255,255,255,0.75)' }}>{line}</div>
                  ))}
                </div>
              </div>

              {/* Live Terminal Console */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Terminal size={13} color="#38CE3C" />
                  Live Action Log Console
                </div>
                <div style={styles.consoleWindow}>
                  {consoleLogs.length > 0 ? (
                    consoleLogs.map((line, i) => (
                      <div key={i} style={styles.consoleLine}>
                        {line}
                      </div>
                    ))
                  ) : (
                    <div style={{ color: 'rgba(56, 206, 60, 0.4)', fontSize: '11px' }}>
                      Console idle. Flashing trigger ready...
                      <span style={{ display: 'inline-block', width: '8px', height: '12px', background: '#38CE3C', marginLeft: '4px', animation: 'gati-console-cursor 1s step-end infinite', verticalAlign: 'middle' }} />
                    </div>
                  )}
                  {executingTool && (
                    <div style={styles.consoleLine}>
                      <span>Running automated audit sequences...</span>
                      <span style={{ display: 'inline-block', width: '8px', height: '12px', background: '#38CE3C', marginLeft: '4px', animation: 'gati-console-cursor 1s step-end infinite', verticalAlign: 'middle' }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Command Center Tools Trigger */}
              <div style={styles.actionCenter(selectedAgent.color)}>
                <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: selectedAgent.color, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Cpu size={14} />
                  Automation Override Command Center
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {extendedDetails.tools.map((tool) => (
                    <button
                      key={tool.name}
                      onClick={() => handleExecuteTool(tool)}
                      disabled={!!executingTool}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '10px 14px',
                        background: executingTool === tool.name 
                          ? 'var(--bg-700)' 
                          : `linear-gradient(135deg, ${selectedAgent.color}, ${selectedAgent.color}cc)`,
                        color: executingTool === tool.name ? 'var(--text-muted)' : '#1a1a2e',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                        fontWeight: '700',
                        fontFamily: 'var(--font-sans)',
                        cursor: executingTool ? 'not-allowed' : 'pointer',
                        boxShadow: executingTool ? 'none' : `0 2px 10px ${selectedAgent.color}25`,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {executingTool === tool.name ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        <Play size={12} fill="#1a1a2e" />
                      )}
                      {executingTool === tool.name ? "Executing automated audit..." : tool.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Toasts */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              background: 'linear-gradient(135deg, #38CE3C, #4ade80)',
              color: '#1a1a2e',
              padding: '12px 20px',
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 4px 15px rgba(56, 206, 60, 0.3)',
              fontWeight: '600',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              zIndex: 200,
            }}
          >
            <CheckCircle2 size={16} color="#1a1a2e" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AgentsDashboard;
