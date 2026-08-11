import { useState } from 'react';
import { X } from 'lucide-react';

export default function PlaybackSettingsModal({ onClose }) {
  const [autoFollow, setAutoFollow] = useState(true);
  const [scrubberPrecision, setScrubberPrecision] = useState('30s'); // 5s, 30s, 60s
  const [audioChimes, setAudioChimes] = useState(true);

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
        background: '#0b0f19',
        border: '1px solid rgba(168, 85, 247, 0.4)',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(168, 85, 247, 0.08)'
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
              color: '#ffffff',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
            }}>
              ⚙
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                Playback Engine & Telematics Settings
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                Auto-Follow Vehicle Camera, Scrubber Precision & Audio Alert Preferences
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#9ca3af',
              borderRadius: '10px',
              width: 34,
              height: 34,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} color="#9ca3af" />
          </button>
        </div>

        {/* Toggles */}
        <div style={{ padding: '24px', flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Auto Follow */}
          <div style={{
            padding: '18px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>Auto-Follow Moving Vehicle</div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '3px' }}>Automatically pan map camera along with playback movement</div>
            </div>

            <button
              onClick={() => setAutoFollow(!autoFollow)}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: autoFollow ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.15)',
                background: autoFollow ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255,255,255,0.05)',
                color: autoFollow ? '#e9d5ff' : '#9ca3af',
                fontWeight: 800,
                fontSize: '11px',
                cursor: 'pointer',
                letterSpacing: '0.04em'
              }}
            >
              {autoFollow ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Scrubber Precision */}
          <div style={{
            padding: '18px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px'
          }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>Scrubber Timeline Precision</div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['5s', '30s', '60s'].map(p => {
                const isActive = scrubberPrecision === p;
                return (
                  <button
                    key={p}
                    onClick={() => setScrubberPrecision(p)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 800,
                      border: isActive ? '1px solid #a855f7' : '1px solid rgba(255,255,255,0.1)',
                      background: isActive ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255,255,255,0.03)',
                      color: isActive ? '#e9d5ff' : '#9ca3af',
                      cursor: 'pointer'
                    }}
                  >
                    {p} Micro-Step
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audio Alert Chimes */}
          <div style={{
            padding: '18px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>Audio Alert Chimes</div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '3px' }}>Play sound effect when playback encounters overspeed or panic event</div>
            </div>

            <button
              onClick={() => setAudioChimes(!audioChimes)}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: audioChimes ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.15)',
                background: audioChimes ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.05)',
                color: audioChimes ? '#6ee7b7' : '#9ca3af',
                fontWeight: 800,
                fontSize: '11px',
                cursor: 'pointer',
                letterSpacing: '0.04em'
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
