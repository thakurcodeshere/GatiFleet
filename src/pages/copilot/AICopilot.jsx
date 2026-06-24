/* eslint-disable */
// ============================================================
// GatiFleet — AI Copilot (Full-Page)
// Split layout: Chat + Context Panels
// ============================================================
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot, Send, Sparkles, MessageSquare, TrendingUp, Truck,
  Package, AlertTriangle, IndianRupee, BarChart3, Users,
  Clock, ChevronRight, Lightbulb, Zap, Search,
  ArrowUpRight, Layers, Brain, Compass, Shield, Route,
  Star, Hash, BookOpen, Cpu, Mic, Paperclip, CornerDownLeft,
  CheckCircle2, XCircle, Copy, ThumbsUp, ThumbsDown, RefreshCw,
} from 'lucide-react';
import {
  platformKPIs,
  copilotSuggestions,
  copilotConversations,
  formatCurrency,
  formatNumber,
} from '../../data/mockData';

// ---- Keyframes ----
const KEYFRAMES_ID = 'gatifleet-copilot-keyframes';
const injectKeyframes = () => {
  if (document.getElementById(KEYFRAMES_ID)) return;
  const style = document.createElement('style');
  style.id = KEYFRAMES_ID;
  style.textContent = `
    @keyframes gati-copilot-typing {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }
    @keyframes gati-copilot-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes gati-copilot-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.15); }
      50% { box-shadow: 0 0 32px rgba(99,102,241,0.3); }
    }
  `;
  document.head.appendChild(style);
};

// ---- Typing indicator ----
const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 0' }}>
    {[0, 1, 2].map(i => (
      <div
        key={i}
        style={{
          width: 7, height: 7,
          borderRadius: '50%',
          background: 'var(--primary-400)',
          animation: `gati-copilot-typing 1.4s ease-in-out ${i * 0.2}s infinite`,
        }}
      />
    ))}
  </div>
);

// ---- Data card for AI response ----
const DataCard = ({ title, items, color = '#6366f1' }) => (
  <div style={{
    background: 'var(--bg-700)',
    border: '1px solid var(--surface-border)',
    borderRadius: 'var(--radius-md)',
    padding: '14px 16px',
    marginTop: '10px',
  }}>
    <div style={{
      fontSize: '12px',
      fontWeight: 700,
      color,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    }}>
      <BarChart3 size={13} />
      {title}
    </div>
    {items.map((item, i) => (
      <div
        key={i}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '7px 0',
          borderBottom: i < items.length - 1 ? '1px solid var(--surface-border)' : 'none',
          fontSize: '12px',
        }}
      >
        <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
        <span style={{
          fontWeight: 600,
          color: item.highlight ? color : 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
        }}>{item.value}</span>
      </div>
    ))}
  </div>
);

// ---- Confidence bar ----
const ConfidenceBar = ({ value, color = '#6366f1' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
    <div style={{
      flex: 1, height: 4,
      background: 'var(--bg-600)',
      borderRadius: 2,
      overflow: 'hidden',
    }}>
      <div style={{
        height: '100%',
        width: `${value}%`,
        background: `linear-gradient(90deg, ${color}, ${color}99)`,
        borderRadius: 2,
        transition: 'width 0.8s ease',
      }} />
    </div>
    <span style={{ fontSize: '10px', fontWeight: 600, color, fontFamily: 'var(--font-mono)' }}>{value}%</span>
  </div>
);

// ============================================================
// Main Component
// ============================================================
const AICopilot = () => {
  useEffect(() => { injectKeyframes(); }, []);

  const [messages, setMessages] = useState(() => {
    const initialMessages = [];
    copilotConversations.forEach(conv => {
      initialMessages.push({ id: `q-${conv.id}`, type: 'user', text: conv.query, time: new Date(Date.now() - (conv.id * 3600000)) });
      initialMessages.push({
        id: `a-${conv.id}`,
        type: 'ai',
        text: conv.response.summary,
        data: conv.response,
        time: new Date(Date.now() - (conv.id * 3600000) + 2000),
      });
    });
    return initialMessages;
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;

    const userMsg = { id: `u-${Date.now()}`, type: 'user', text, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        text: `I've analyzed your query: "${text}". Based on current fleet data across ${formatNumber(platformKPIs.totalTrucks)} trucks and ${formatNumber(platformKPIs.totalDrivers)} drivers, here's what I found:`,
        data: {
          summary: `Analysis complete. The fleet is operating at ${platformKPIs.fleetUtilization}% utilization with an on-time delivery rate of ${platformKPIs.onTimeDelivery}%.`,
          recommendation: 'I recommend reviewing the detailed analytics dashboard for deeper insights on this topic.',
        },
        time: new Date(),
      };
      setIsTyping(false);
      setMessages(prev => [...prev, aiMsg]);
    }, 1800);
  }, [inputValue]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // ---- Recent queries (from conversations + extra) ----
  const recentQueries = [
    ...copilotConversations.map(c => c.query),
    'Show fuel efficiency by truck type',
    'Which routes have the highest delay rates?',
    'Predict maintenance needs for next week',
  ];

  // ---- Trending topics ----
  const trendingTopics = [
    { topic: 'Fuel cost optimization', count: 234, trend: 'up' },
    { topic: 'Route delay analysis', count: 189, trend: 'up' },
    { topic: 'Driver performance', count: 156, trend: 'stable' },
    { topic: 'Revenue forecasting', count: 142, trend: 'up' },
    { topic: 'Fleet utilization gaps', count: 118, trend: 'down' },
  ];

  // ---- Capabilities ----
  const capabilities = [
    { category: 'Fleet Intelligence', items: ['Real-time tracking', 'Route optimization', 'Fuel analytics'], icon: <Truck size={14} />, color: '#38CE3C' },
    { category: 'Financial Insights', items: ['Revenue analysis', 'Cost breakdown', 'Toll reconciliation'], icon: <IndianRupee size={14} />, color: '#6366f1' },
    { category: 'Predictive Analytics', items: ['Demand forecasting', 'Churn prediction', 'Maintenance alerts'], icon: <Brain size={14} />, color: '#f59e0b' },
    { category: 'Operations', items: ['Load matching', 'Driver scheduling', 'Compliance checks'], icon: <Route size={14} />, color: '#3b82f6' },
  ];

  // ---- KPI cards ----
  const quickStats = [
    { label: 'Revenue', value: formatCurrency(platformKPIs.revenue.thisMonth), change: `+${platformKPIs.revenue.growth}%`, icon: <IndianRupee size={16} />, color: '#38CE3C' },
    { label: 'Fleet', value: formatNumber(platformKPIs.activeTrucks), change: `${platformKPIs.fleetUtilization}% util`, icon: <Truck size={16} />, color: '#3b82f6' },
    { label: 'Deliveries', value: formatNumber(platformKPIs.dailyShipments), change: `${platformKPIs.onTimeDelivery}% on-time`, icon: <Package size={16} />, color: '#6366f1' },
    { label: 'Alerts', value: '12', change: '3 critical', icon: <AlertTriangle size={16} />, color: '#FF4D6B' },
  ];

  // ---- Styles ----
  const s = {
    page: {
      display: 'flex',
      height: '100vh',
      background: 'var(--bg-900)',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-primary)',
      overflow: 'hidden',
    },

    // Left panel — Chat
    leftPanel: {
      flex: '0 0 60%',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid var(--surface-border)',
      position: 'relative',
    },
    chatHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '20px 28px',
      borderBottom: '1px solid var(--surface-border)',
      background: 'var(--surface)',
      backdropFilter: 'blur(16px)',
      flexShrink: 0,
    },
    chatHeaderIcon: {
      width: 42, height: 42,
      borderRadius: 'var(--radius-md)',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 0 20px rgba(99,102,241,0.25)',
    },
    chatHeaderTitle: {
      fontSize: '18px',
      fontWeight: 700,
    },
    chatHeaderSub: {
      fontSize: '12px',
      color: 'var(--text-muted)',
    },
    onlineBadge: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '11px',
      fontWeight: 600,
      color: '#38CE3C',
      padding: '4px 12px',
      borderRadius: '14px',
      background: 'rgba(56,206,60,0.1)',
      border: '1px solid rgba(56,206,60,0.2)',
    },
    onlineDot: {
      width: 7, height: 7,
      borderRadius: '50%',
      background: '#38CE3C',
      boxShadow: '0 0 6px #38CE3C',
    },

    // Messages area
    messagesArea: {
      flex: 1,
      overflowY: 'auto',
      padding: '24px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    welcomeCard: {
      textAlign: 'center',
      padding: '40px 32px',
      marginBottom: '8px',
    },
    welcomeIconWrap: {
      width: 72, height: 72,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      margin: '0 auto 16px',
      animation: 'gati-copilot-glow 3s ease-in-out infinite',
    },
    welcomeTitle: {
      fontSize: '22px',
      fontWeight: 800,
      background: 'linear-gradient(135deg, var(--text-primary), var(--primary-400))',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '6px',
    },
    welcomeSubtitle: {
      fontSize: '13px',
      color: 'var(--text-secondary)',
      maxWidth: '420px',
      margin: '0 auto',
      lineHeight: 1.5,
    },

    // User message
    userBubble: {
      alignSelf: 'flex-end',
      maxWidth: '70%',
      background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
      color: '#fff',
      padding: '12px 18px',
      borderRadius: '18px 18px 4px 18px',
      fontSize: '14px',
      lineHeight: 1.5,
    },
    // AI message
    aiBubble: {
      alignSelf: 'flex-start',
      maxWidth: '80%',
      background: 'var(--bg-700)',
      border: '1px solid var(--surface-border)',
      padding: '16px 20px',
      borderRadius: '4px 18px 18px 18px',
      fontSize: '14px',
      lineHeight: 1.6,
      color: 'var(--text-primary)',
    },
    aiHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px',
    },
    aiAvatarSmall: {
      width: 24, height: 24,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    aiName: {
      fontSize: '12px',
      fontWeight: 700,
      color: 'var(--primary-400)',
    },
    msgTime: {
      fontSize: '10px',
      color: 'var(--text-muted)',
      marginTop: '6px',
    },
    msgActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '8px',
    },
    msgActionBtn: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 28, height: 28,
      borderRadius: '50%',
      background: 'var(--bg-600)',
      border: 'none',
      color: 'var(--text-muted)',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    },

    // Reason cards in AI responses
    reasonCard: {
      background: 'var(--bg-800)',
      border: '1px solid var(--surface-border)',
      borderRadius: 'var(--radius-sm)',
      padding: '10px 14px',
      marginTop: '8px',
    },
    reasonRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '12px',
      marginBottom: '4px',
    },

    // Input area
    inputArea: {
      padding: '16px 28px 20px',
      borderTop: '1px solid var(--surface-border)',
      background: 'var(--surface)',
      backdropFilter: 'blur(16px)',
      flexShrink: 0,
    },
    suggestionsRow: {
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      paddingBottom: '12px',
      scrollbarWidth: 'none',
    },
    suggestionChip: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      padding: '6px 14px',
      borderRadius: '20px',
      background: 'var(--bg-700)',
      border: '1px solid var(--surface-border)',
      color: 'var(--text-secondary)',
      fontSize: '12px',
      fontWeight: 500,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'all 0.2s ease',
      flexShrink: 0,
    },
    inputRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: 'var(--bg-700)',
      border: '1px solid var(--surface-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '6px 8px 6px 18px',
    },
    textInput: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      color: 'var(--text-primary)',
      fontSize: '14px',
      fontFamily: 'var(--font-sans)',
      resize: 'none',
      minHeight: '24px',
      maxHeight: '100px',
    },
    sendBtn: (hasText) => ({
      width: 40, height: 40,
      borderRadius: 'var(--radius-md)',
      background: hasText ? 'linear-gradient(135deg, #6366f1, #7c3aed)' : 'var(--bg-600)',
      border: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: hasText ? 'pointer' : 'default',
      color: hasText ? '#fff' : 'var(--text-muted)',
      transition: 'all 0.2s ease',
      flexShrink: 0,
    }),
    inputHint: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '8px',
      fontSize: '10px',
      color: 'var(--text-muted)',
    },

    // Right panel — Context
    rightPanel: {
      flex: '0 0 40%',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      padding: '24px',
      gap: '20px',
      background: 'var(--bg-800)',
    },
    panelCard: {
      background: 'var(--surface)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--surface-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
    },
    panelTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: 700,
      color: 'var(--text-primary)',
      marginBottom: '16px',
    },

    // Quick stats
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '12px',
    },
    statMini: (color) => ({
      background: 'var(--bg-700)',
      border: '1px solid var(--surface-border)',
      borderRadius: 'var(--radius-md)',
      padding: '14px',
      position: 'relative',
      overflow: 'hidden',
    }),
    statMiniIcon: (color) => ({
      width: 32, height: 32,
      borderRadius: 'var(--radius-sm)',
      background: `${color}15`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: '8px',
    }),
    statMiniLabel: {
      fontSize: '11px',
      color: 'var(--text-muted)',
      marginBottom: '2px',
    },
    statMiniValue: {
      fontSize: '18px',
      fontWeight: 800,
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-primary)',
    },
    statMiniChange: (color) => ({
      fontSize: '10px',
      fontWeight: 600,
      color,
      marginTop: '2px',
    }),

    // Recent queries list
    queryItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 12px',
      borderRadius: 'var(--radius-sm)',
      cursor: 'pointer',
      transition: 'background 0.15s',
      fontSize: '12px',
      color: 'var(--text-secondary)',
      lineHeight: 1.4,
    },
    queryIcon: {
      width: 28, height: 28,
      borderRadius: '50%',
      background: 'var(--bg-600)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    },

    // Trending
    trendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 0',
      borderBottom: '1px solid var(--surface-border)',
    },
    trendRank: (i) => ({
      width: 22, height: 22,
      borderRadius: '50%',
      background: i < 3 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'var(--bg-600)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '10px',
      fontWeight: 700,
      color: i < 3 ? '#fff' : 'var(--text-muted)',
      flexShrink: 0,
    }),
    trendText: {
      flex: 1,
      fontSize: '12px',
      color: 'var(--text-secondary)',
    },
    trendCount: {
      fontSize: '10px',
      fontWeight: 600,
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
    },
    trendArrow: (trend) => ({
      color: trend === 'up' ? '#38CE3C' : trend === 'down' ? '#FF4D6B' : 'var(--text-muted)',
    }),

    // Capabilities
    capCategory: {
      marginBottom: '14px',
    },
    capCategoryTitle: (color) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '12px',
      fontWeight: 700,
      color,
      marginBottom: '8px',
    }),
    capItem: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '3px 10px',
      borderRadius: '10px',
      background: 'var(--bg-700)',
      border: '1px solid var(--surface-border)',
      fontSize: '11px',
      color: 'var(--text-secondary)',
      marginRight: '6px',
      marginBottom: '6px',
    },
  };

  const formatTime = (date) => {
    if (!(date instanceof Date)) return '';
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div style={s.page}>
      {/* =============== LEFT PANEL — Chat =============== */}
      <div style={s.leftPanel}>
        {/* Chat Header */}
        <div style={s.chatHeader}>
          <div style={s.chatHeaderIcon}>
            <Bot size={22} color="#fff" />
          </div>
          <div>
            <div style={s.chatHeaderTitle}>GatiFleet Copilot</div>
            <div style={s.chatHeaderSub}>Your AI-powered transportation intelligence assistant</div>
          </div>
          <div style={s.onlineBadge}>
            <span style={s.onlineDot} />
            Online
          </div>
        </div>

        {/* Messages */}
        <div style={s.messagesArea}>
          {/* Welcome */}
          <motion.div
            style={s.welcomeCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={s.welcomeIconWrap}>
              <Sparkles size={32} color="#818cf8" />
            </div>
            <div style={s.welcomeTitle}>Welcome to GatiFleet Copilot</div>
            <p style={s.welcomeSubtitle}>
              I can help you analyze fleet performance, track shipments, forecast demand, and optimize operations across India's largest transportation network.
            </p>
          </motion.div>

          {/* Messages */}
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start', maxWidth: msg.type === 'user' ? '70%' : '80%' }}
              >
                {msg.type === 'user' ? (
                  <div>
                    <div style={s.userBubble}>{msg.text}</div>
                    <div style={{ ...s.msgTime, textAlign: 'right' }}>{formatTime(msg.time)}</div>
                  </div>
                ) : (
                  <div>
                    <div style={s.aiBubble}>
                      <div style={s.aiHeader}>
                        <div style={s.aiAvatarSmall}>
                          <Bot size={13} color="#fff" />
                        </div>
                        <span style={s.aiName}>GatiFleet AI</span>
                      </div>
                      <div>{msg.text}</div>

                      {/* Render reason cards if available */}
                      {msg.data?.reasons && (
                        <DataCard
                          title="Root Cause Analysis"
                          color="#f59e0b"
                          items={msg.data.reasons.map(r => ({
                            label: r.factor,
                            value: r.impact,
                            highlight: r.confidence > 90,
                          }))}
                        />
                      )}

                      {/* Render customer churn cards if available */}
                      {msg.data?.customers && (
                        <DataCard
                          title="Churn Risk Analysis"
                          color="#FF4D6B"
                          items={msg.data.customers.map(c => ({
                            label: c.name,
                            value: `${c.risk}% risk — ${c.value}`,
                            highlight: c.risk > 80,
                          }))}
                        />
                      )}

                      {/* Recommendation */}
                      {msg.data?.recommendation && (
                        <div style={{
                          marginTop: '12px',
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(99,102,241,0.08)',
                          border: '1px solid rgba(99,102,241,0.15)',
                          fontSize: '12px',
                          color: 'var(--primary-400)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          lineHeight: 1.5,
                        }}>
                          <Lightbulb size={14} style={{ marginTop: '1px', flexShrink: 0 }} />
                          {msg.data.recommendation}
                        </div>
                      )}

                      {/* Sources */}
                      {msg.data?.sources && (
                        <div style={{
                          marginTop: '10px',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '6px',
                        }}>
                          {msg.data.sources.map((src, si) => (
                            <span key={si} style={{
                              padding: '2px 8px',
                              borderRadius: '8px',
                              background: 'var(--bg-600)',
                              fontSize: '10px',
                              color: 'var(--text-muted)',
                              fontFamily: 'var(--font-mono)',
                            }}>
                              📎 {src}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div style={s.msgActions}>
                        <button style={s.msgActionBtn} title="Copy"><Copy size={12} /></button>
                        <button style={s.msgActionBtn} title="Helpful"><ThumbsUp size={12} /></button>
                        <button style={s.msgActionBtn} title="Not helpful"><ThumbsDown size={12} /></button>
                        <button style={s.msgActionBtn} title="Regenerate"><RefreshCw size={12} /></button>
                      </div>
                    </div>
                    <div style={s.msgTime}>{formatTime(msg.time)}</div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ alignSelf: 'flex-start' }}
            >
              <div style={s.aiBubble}>
                <div style={s.aiHeader}>
                  <div style={s.aiAvatarSmall}>
                    <Bot size={13} color="#fff" />
                  </div>
                  <span style={s.aiName}>GatiFleet AI</span>
                </div>
                <TypingIndicator />
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div style={s.inputArea}>
          {/* Suggestion chips */}
          <div style={s.suggestionsRow}>
            {copilotSuggestions.slice(0, 5).map((sug, i) => (
              <motion.button
                key={i}
                style={s.suggestionChip}
                whileHover={{ background: 'var(--bg-600)', color: 'var(--text-primary)', borderColor: 'var(--primary-500)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSuggestionClick(sug)}
              >
                <Sparkles size={11} />
                {sug}
              </motion.button>
            ))}
          </div>

          <div style={s.inputRow}>
            <input
              ref={inputRef}
              style={s.textInput}
              placeholder="Ask anything about your fleet, finances, or operations..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <motion.button
              style={s.sendBtn(!!inputValue.trim())}
              whileHover={inputValue.trim() ? { scale: 1.05 } : {}}
              whileTap={inputValue.trim() ? { scale: 0.95 } : {}}
              onClick={handleSend}
              disabled={!inputValue.trim()}
            >
              <Send size={18} />
            </motion.button>
          </div>
          <div style={s.inputHint}>
            <span><CornerDownLeft size={10} style={{ verticalAlign: 'middle', marginRight: '3px' }} />Enter to send</span>
            <span>Powered by GatiFleet AI</span>
          </div>
        </div>
      </div>

      {/* =============== RIGHT PANEL — Context =============== */}
      <div style={s.rightPanel}>
        {/* Quick Stats */}
        <motion.div
          style={s.panelCard}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div style={s.panelTitle}>
            <BarChart3 size={16} color="var(--primary-400)" />
            Quick Stats
          </div>
          <div style={s.statsGrid}>
            {quickStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                style={s.statMini(stat.color)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
              >
                <div style={s.statMiniIcon(stat.color)}>
                  {React.cloneElement(stat.icon, { color: stat.color })}
                </div>
                <div style={s.statMiniLabel}>{stat.label}</div>
                <div style={s.statMiniValue}>{stat.value}</div>
                <div style={s.statMiniChange(stat.color)}>{stat.change}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Queries */}
        <motion.div
          style={s.panelCard}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div style={s.panelTitle}>
            <Clock size={16} color="#f59e0b" />
            Recent Queries
          </div>
          {recentQueries.slice(0, 5).map((q, i) => (
            <motion.div
              key={i}
              style={s.queryItem}
              whileHover={{ background: 'var(--bg-700)' }}
              onClick={() => handleSuggestionClick(q)}
            >
              <div style={s.queryIcon}>
                <MessageSquare size={12} color="var(--text-muted)" />
              </div>
              <span style={{ flex: 1 }}>{q}</span>
              <ChevronRight size={12} color="var(--text-muted)" />
            </motion.div>
          ))}
        </motion.div>

        {/* Trending Topics */}
        <motion.div
          style={s.panelCard}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div style={s.panelTitle}>
            <TrendingUp size={16} color="#ec4899" />
            Trending Topics
          </div>
          {trendingTopics.map((t, i) => (
            <div key={i} style={{
              ...s.trendItem,
              borderBottom: i === trendingTopics.length - 1 ? 'none' : '1px solid var(--surface-border)',
            }}>
              <div style={s.trendRank(i)}>{i + 1}</div>
              <span style={s.trendText}>{t.topic}</span>
              <span style={s.trendCount}>{t.count}</span>
              <span style={s.trendArrow(t.trend)}>
                {t.trend === 'up' ? <ArrowUpRight size={12} /> : t.trend === 'down' ? <TrendingUp size={12} style={{ transform: 'rotate(90deg)' }} /> : <span>—</span>}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Capabilities */}
        <motion.div
          style={s.panelCard}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div style={s.panelTitle}>
            <Cpu size={16} color="#38CE3C" />
            Capabilities
          </div>
          {capabilities.map((cat, i) => (
            <div key={i} style={s.capCategory}>
              <div style={s.capCategoryTitle(cat.color)}>
                {cat.icon}
                {cat.category}
              </div>
              <div>
                {cat.items.map((item, j) => (
                  <span key={j} style={s.capItem}>
                    <CheckCircle2 size={10} color="#38CE3C" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AICopilot;
