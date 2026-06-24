import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  Sparkles, Send, X, ThumbsUp, ThumbsDown, ExternalLink, 
  Lightbulb, ChevronRight, Zap
} from 'lucide-react';
import { copilotSuggestions, copilotConversations } from '../../data/mockData';

export default function CopilotPanel() {
  const { copilotOpen, toggleCopilot } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (copilotOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [copilotOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Find matching conversation or generate generic response
    const match = copilotConversations.find(c => 
      input.toLowerCase().includes(c.query.toLowerCase().split(' ').slice(0, 3).join(' '))
    );

    setTimeout(() => {
      setIsTyping(false);
      if (match) {
        setMessages(prev => [...prev, { role: 'ai', data: match.response, timestamp: new Date() }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          data: {
            summary: `I've analyzed your query: "${input}". Here's what I found across the GatiFleet network.`,
            reasons: [
              { factor: 'Based on current fleet data analysis', impact: 'Processing 524K+ trucks', confidence: 92 },
              { factor: 'Cross-referencing with knowledge graph', impact: '108K+ business connections', confidence: 88 },
            ],
            recommendation: 'For a more detailed analysis, try specifying a truck ID, route, or business name.',
            sources: ['Fleet Database', 'Knowledge Graph', 'Route Analytics'],
          },
          timestamp: new Date() 
        }]);
      }
    }, 1500 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setTimeout(() => {
      setInput(suggestion);
      handleSendWithQuery(suggestion);
    }, 100);
  };

  const handleSendWithQuery = (query) => {
    const userMsg = { role: 'user', content: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    const match = copilotConversations.find(c => query.toLowerCase().includes(c.query.toLowerCase().split(' ').slice(0, 3).join(' ')));
    setTimeout(() => {
      setIsTyping(false);
      if (match) {
        setMessages(prev => [...prev, { role: 'ai', data: match.response, timestamp: new Date() }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', data: { summary: `Analysis complete for: "${query}"`, reasons: [{ factor: 'Data processed across fleet network', impact: 'Real-time insights generated', confidence: 90 }], recommendation: 'Try asking about specific trucks, routes, or customers for deeper insights.', sources: ['Fleet DB', 'Knowledge Graph'] }, timestamp: new Date() }]);
      }
    }, 1500);
  };

  const s = {
    panel: {
      height: '100%',
      background: 'var(--bg-800)',
      borderLeft: '1px solid var(--surface-border)',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'var(--shadow-xl)',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-700)',
    },
    headerTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontWeight: 700,
      fontSize: 'var(--text-md)',
    },
    sparkleIcon: {
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-md)',
      background: 'var(--gradient-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeBtn: {
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-muted)',
      cursor: 'pointer',
      background: 'transparent',
      border: 'none',
      transition: 'all var(--transition-fast)',
    },
    messages: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    },
    empty: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      gap: 16,
    },
    emptyIcon: {
      width: 56,
      height: 56,
      borderRadius: 'var(--radius-xl)',
      background: 'rgba(99, 102, 241, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'float 3s ease-in-out infinite',
    },
    emptyTitle: {
      fontWeight: 700,
      fontSize: 'var(--text-lg)',
      textAlign: 'center',
    },
    emptyDesc: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)',
      textAlign: 'center',
      lineHeight: 1.5,
    },
    proactive: {
      background: 'rgba(99, 102, 241, 0.08)',
      border: '1px solid rgba(99, 102, 241, 0.15)',
      borderRadius: 'var(--radius-lg)',
      padding: '14px',
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      animation: 'fadeInUp 0.4s ease-out',
    },
    proactiveIcon: {
      color: 'var(--warning-500)',
      flexShrink: 0,
      marginTop: 2,
    },
    proactiveText: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-primary)',
      lineHeight: 1.5,
    },
    suggestions: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      width: '100%',
      marginTop: 8,
    },
    suggestion: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 12px',
      borderRadius: 'var(--radius-md)',
      background: 'var(--bg-700)',
      border: '1px solid var(--border-subtle)',
      color: 'var(--text-secondary)',
      fontSize: 'var(--text-xs)',
      cursor: 'pointer',
      transition: 'all var(--transition-fast)',
      textAlign: 'left',
      width: '100%',
    },
    userMsg: {
      alignSelf: 'flex-end',
      background: 'var(--primary-500)',
      color: 'white',
      padding: '10px 16px',
      borderRadius: '16px 16px 4px 16px',
      maxWidth: '85%',
      fontSize: 'var(--text-sm)',
      lineHeight: 1.5,
    },
    aiMsg: {
      alignSelf: 'flex-start',
      background: 'var(--bg-700)',
      border: '1px solid var(--surface-border)',
      borderRadius: '4px 16px 16px 16px',
      padding: '14px',
      maxWidth: '95%',
      fontSize: 'var(--text-sm)',
    },
    aiSummary: {
      lineHeight: 1.6,
      color: 'var(--text-primary)',
      marginBottom: 12,
    },
    reasonItem: {
      display: 'flex',
      gap: 10,
      padding: '8px 0',
      borderBottom: '1px solid var(--border-subtle)',
    },
    reasonDot: (confidence) => ({
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: confidence > 90 ? 'var(--success-500)' : confidence > 80 ? 'var(--warning-500)' : 'var(--info-500)',
      marginTop: 7,
      flexShrink: 0,
    }),
    reasonFactor: {
      fontSize: 'var(--text-xs)',
      color: 'var(--text-primary)',
      fontWeight: 500,
    },
    reasonImpact: {
      fontSize: '11px',
      color: 'var(--text-muted)',
    },
    reasonConfidence: {
      fontSize: '10px',
      color: 'var(--primary-400)',
      fontFamily: 'var(--font-mono)',
    },
    recommendation: {
      marginTop: 12,
      padding: '10px 12px',
      background: 'rgba(56, 206, 60, 0.08)',
      border: '1px solid rgba(56, 206, 60, 0.15)',
      borderRadius: 'var(--radius-md)',
      fontSize: 'var(--text-xs)',
      color: 'var(--success-500)',
      display: 'flex',
      gap: 8,
      alignItems: 'flex-start',
    },
    sources: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 10,
    },
    sourceTag: {
      padding: '2px 8px',
      borderRadius: 'var(--radius-full)',
      background: 'var(--bg-600)',
      fontSize: '10px',
      color: 'var(--text-muted)',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
    },
    feedback: {
      display: 'flex',
      gap: 6,
      marginTop: 10,
      justifyContent: 'flex-end',
    },
    feedbackBtn: {
      width: 28,
      height: 28,
      borderRadius: 'var(--radius-sm)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      border: '1px solid var(--border-subtle)',
      color: 'var(--text-muted)',
      cursor: 'pointer',
      transition: 'all var(--transition-fast)',
    },
    typing: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '12px 16px',
      background: 'var(--bg-700)',
      borderRadius: '4px 16px 16px 16px',
      alignSelf: 'flex-start',
    },
    typingDot: (delay) => ({
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'var(--primary-400)',
      animation: `dotPulse 1.4s ease-in-out ${delay}ms infinite`,
    }),
    inputArea: {
      padding: '12px 16px',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--bg-700)',
    },
    inputWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--bg-800)',
      borderRadius: 'var(--radius-lg)',
      padding: '4px 4px 4px 16px',
      border: '1px solid var(--border-subtle)',
    },
    input: {
      flex: 1,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: 'var(--text-primary)',
      fontSize: 'var(--text-sm)',
      fontFamily: 'var(--font-sans)',
    },
    sendBtn: {
      width: 36,
      height: 36,
      borderRadius: 'var(--radius-md)',
      background: input.trim() ? 'var(--gradient-primary)' : 'var(--bg-600)',
      border: 'none',
      color: input.trim() ? 'white' : 'var(--text-muted)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: input.trim() ? 'pointer' : 'default',
      transition: 'all var(--transition-fast)',
    },
  };

  const renderAIResponse = (data) => {
    if (!data) return null;
    return (
      <div>
        <div style={s.aiSummary}>{data.summary}</div>
        
        {data.reasons && data.reasons.map((r, i) => (
          <div key={i} style={s.reasonItem}>
            <div style={s.reasonDot(r.confidence)} />
            <div style={{ flex: 1 }}>
              <div style={s.reasonFactor}>{r.factor}</div>
              <div style={s.reasonImpact}>{r.impact}</div>
            </div>
            <div style={s.reasonConfidence}>{r.confidence}%</div>
          </div>
        ))}

        {data.customers && data.customers.map((c, i) => (
          <div key={i} style={{ ...s.reasonItem, flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span style={s.reasonFactor}>{c.name}</span>
              <span style={{ ...s.reasonConfidence, color: c.risk > 80 ? 'var(--danger-500)' : 'var(--warning-500)' }}>
                {c.risk}% risk
              </span>
            </div>
            <div style={s.reasonImpact}>{c.reason}</div>
            <div style={{ fontSize: '10px', color: 'var(--primary-400)' }}>{c.value}</div>
          </div>
        ))}
        
        {data.recommendation && (
          <div style={s.recommendation}>
            <Lightbulb size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>{data.recommendation}</span>
          </div>
        )}
        
        {data.sources && (
          <div style={s.sources}>
            {data.sources.map((src, i) => (
              <span key={i} style={s.sourceTag}>
                <ExternalLink size={8} /> {src}
              </span>
            ))}
          </div>
        )}
        
        <div style={s.feedback}>
          <button
            style={s.feedbackBtn}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--success-500)'; e.currentTarget.style.color = 'var(--success-500)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <ThumbsUp size={12} />
          </button>
          <button
            style={s.feedbackBtn}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--danger-500)'; e.currentTarget.style.color = 'var(--danger-500)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <ThumbsDown size={12} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={s.panel}>
      <div style={s.header}>
        <div style={s.headerTitle}>
          <div style={s.sparkleIcon}>
            <Sparkles size={16} color="white" />
          </div>
          Fleet Copilot
        </div>
        <button
          style={s.closeBtn}
          onClick={toggleCopilot}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <X size={16} />
        </button>
      </div>

      <div style={s.messages}>
        {messages.length === 0 ? (
          <div style={s.empty}>
            <div style={s.emptyIcon}>
              <Sparkles size={24} color="var(--primary-400)" />
            </div>
            <div style={s.emptyTitle}>Fleet Copilot</div>
            <div style={s.emptyDesc}>
              Your AI-powered assistant for fleet intelligence. Ask anything about your trucks, routes, drivers, or business metrics.
            </div>

            {/* Proactive Alert */}
            <div style={s.proactive}>
              <Zap size={16} style={s.proactiveIcon} />
              <div style={s.proactiveText}>
                <strong>⚡ 3 vehicles</strong> show unusually high fuel consumption this week. Want me to investigate?
              </div>
            </div>

            <div style={s.suggestions}>
              {copilotSuggestions.slice(0, 5).map((sug, i) => (
                <button
                  key={i}
                  style={s.suggestion}
                  onClick={() => handleSuggestionClick(sug)}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-500)'; e.currentTarget.style.color = 'var(--primary-400)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  <ChevronRight size={12} style={{ flexShrink: 0 }} />
                  {sug}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={i} style={msg.role === 'user' ? s.userMsg : s.aiMsg}>
                {msg.role === 'user' ? msg.content : renderAIResponse(msg.data)}
              </div>
            ))}
          </>
        )}

        {isTyping && (
          <div style={s.typing}>
            <div style={s.typingDot(0)} />
            <div style={s.typingDot(200)} />
            <div style={s.typingDot(400)} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={s.inputArea}>
        <div style={s.inputWrapper}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask about your fleet..."
            style={s.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button style={s.sendBtn} onClick={handleSend}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
