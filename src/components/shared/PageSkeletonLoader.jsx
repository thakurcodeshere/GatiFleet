import { Truck, Sparkles } from 'lucide-react';

export default function PageSkeletonLoader() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 120px)',
      width: '100%',
      gap: '20px',
      color: 'var(--text-secondary)',
    }}>
      <div style={{
        position: 'relative',
        width: 72,
        height: 72,
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 30px rgba(99, 102, 241, 0.2)',
      }}>
        <Truck size={36} color="var(--primary-400)" style={{ animation: 'pulse 1.2s ease-in-out infinite' }} />
        <Sparkles size={16} color="#a855f7" style={{ position: 'absolute', top: -6, right: -6 }} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
          Loading Module...
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Optimizing GatiFleet Telematics Matrix
        </div>
      </div>

      {/* Shimmer skeleton lines */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginTop: '10px'
      }}>
        <div className="skeleton-shimmer" style={{ height: '14px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)' }} />
        <div className="skeleton-shimmer" style={{ height: '14px', width: '80%', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', margin: '0 auto' }} />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        .skeleton-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.03) 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
