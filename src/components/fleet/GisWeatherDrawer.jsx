import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function GisWeatherDrawer({ onClose }) {
  const [activeLayer, setActiveLayer] = useState('CYBER_DARK');
  const [trafficDensity, setTrafficDensity] = useState(true);
  const [weatherHazards, setWeatherHazards] = useState(true);

  const weatherAlerts = [
    { corridor: 'NH48 Manesar-Gurgaon Corridor', hazard: 'Dense Fog Warning (Visibility < 50m)', severity: 'HIGH', impact: 'Speed Cap 40 km/h' },
    { corridor: 'Western Coast Highway (Mumbai-Goa)', hazard: 'Heavy Rainfall & Landslide Alert', severity: 'CRITICAL', impact: 'Reroute Recommended' },
    { corridor: 'NH27 Rajasthan Corridor', hazard: 'Sandstorm & High Crosswinds (65 km/h)', severity: 'MEDIUM', impact: 'Lateral Stability Warning' }
  ];

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
        maxWidth: '900px',
        maxHeight: '90vh',
        background: 'var(--bg-800)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(56, 189, 248, 0.15)',
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
          background: 'rgba(56, 189, 248, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
            }}>
              🌐
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                GIS Weather & Highway Radar Layer
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Live Corridor Weather Hazards, Traffic Congestion Overlays & Satellite Basemaps
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

        {/* Content */}
        <div style={{ padding: '24px', flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Basemap Selection */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginBottom: '10px' }}>Basemap Layer Selector</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { id: 'CYBER_DARK', name: 'Cyber Dark (Default)', desc: 'High contrast telematics mode' },
                { id: 'SATELLITE', name: 'Satellite Imagery', desc: 'High resolution terrain imagery' },
                { id: 'HEATMAP', name: 'Fleet Density Heatmap', desc: 'Real-time vehicle cluster density' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setActiveLayer(m.id)}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: activeLayer === m.id ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                    background: activeLayer === m.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.02)',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 700, color: activeLayer === m.id ? '#38bdf8' : 'white' }}>{m.name}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Layer Toggles */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => setTrafficDensity(!trafficDensity)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '10px',
                border: trafficDensity ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                background: trafficDensity ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                color: trafficDensity ? '#6ee7b7' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>Live Traffic Congestion Overlay</span>
              <span>{trafficDensity ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => setWeatherHazards(!weatherHazards)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '10px',
                border: weatherHazards ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                background: weatherHazards ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                color: weatherHazards ? '#fcd34d' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>Weather Radar Hazard Warnings</span>
              <span>{weatherHazards ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Active Weather Radar Alerts List */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginBottom: '10px' }}>Active Corridor Weather Hazards</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {weatherAlerts.map((w, idx) => (
                <div key={idx} style={{
                  padding: '14px 18px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <AlertTriangle size={18} color={w.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b'} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>{w.corridor}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{w.hazard}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', padding: '4px 10px', borderRadius: '6px' }}>
                    {w.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
