import { useState } from 'react';
import { Settings, Volume2, Eye, Compass, Sliders, X } from 'lucide-react';

export default function PlaybackSettingsModal({ onClose }) {
  const [autoFollow, setAutoFollow] = useState(true);
  const [scrubberPrecision, setScrubberPrecision] = useState('30s'); // 5s, 30s, 60s
  const [audioChimes, setAudioChimes] = useState(true);
  const [showTelemetryBadges, setShowTelemetryBadges] = useState(true);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(3, 7, 18, 0.85)',
      backdropFilter: 'blur(16px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '750px',
        maxHeight: '90vh',
        background: 'var(--bg-800)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(168, 85, 247, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(168, 85, 247, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
            }}>
              ⚙
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Playback Engine & Telematics Settings
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Auto-Follow Vehicle Camera, Scrubber Precision & Audio Alert Preferences
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              borderRadius: '10px',
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Toggles */}
        <div style={{ padding: '24px', flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Auto Follow */}
          <div style={{
            padding: '16px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>Auto-Follow Moving Vehicle</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Automatically pan map camera along with playback movement</div>
            </div>

            <button
              onClick={() => setAutoFollow(!autoFollow)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: autoFollow ? '1px solid #a855f7' : '1px solid var(--border-subtle)',
                background: autoFollow ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                color: autoFollow ? '#c084fc' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              {autoFollow ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Scrubber Precision */}
          <div style={{
            padding: '16px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginBottom: '10px' }}>Scrubber Timeline Precision</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['5s', '30s', '60s'].map(p => (
                <button
                  key={p}
                  onClick={() => setScrubberPrecision(p)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: scrubberPrecision === p ? '1px solid #a855f7' : '1px solid var(--border-subtle)',
                    background: scrubberPrecision === p ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                    color: scrubberPrecision === p ? '#c084fc' : 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {p} Micro-Step
                </button>
              ))}
            </div>
          </div>

          {/* Audio Alert Chimes */}
          <div style={{
            padding: '16px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>Audio Alert Chimes</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Play sound effect when playback encounters overspeed or panic event</div>
            </div>

            <button
              onClick={() => setAudioChimes(!audioChimes)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: audioChimes ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                background: audioChimes ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                color: audioChimes ? '#6ee7b7' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              {audioChimes ? 'ACTIVE' : 'MUTED'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
