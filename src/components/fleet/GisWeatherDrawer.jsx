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
        background: '#0b0f19',
        border: '1px solid rgba(56, 189, 248, 0.4)',
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
          background: 'rgba(56, 189, 248, 0.08)'
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
              color: '#ffffff',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
            }}>
              🌐
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                GIS Weather & Highway Radar Layer
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                Live Corridor Weather Hazards, Traffic Congestion Overlays & Satellite Basemaps
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

        {/* Content */}
        <div style={{ padding: '24px', flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Basemap Selection */}
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>Basemap Layer Selector</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { id: 'CYBER_DARK', name: 'Cyber Dark (Default)', desc: 'High contrast telematics mode' },
                { id: 'SATELLITE', name: 'Satellite Imagery', desc: 'High resolution terrain imagery' },
                { id: 'HEATMAP', name: 'Fleet Density Heatmap', desc: 'Real-time vehicle cluster density' }
              ].map(m => {
                const isActive = activeLayer === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveLayer(m.id)}
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: isActive ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.1)',
                      background: isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.03)',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 800, color: isActive ? '#38bdf8' : '#ffffff' }}>{m.name}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>{m.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Layer Toggles */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => setTrafficDensity(!trafficDensity)}
              style={{
                flex: 1,
                padding: '14px 18px',
                borderRadius: '12px',
                border: trafficDensity ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                background: trafficDensity ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.03)',
                color: trafficDensity ? '#6ee7b7' : '#9ca3af',
                fontWeight: 800,
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
                padding: '14px 18px',
                borderRadius: '12px',
                border: weatherHazards ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                background: weatherHazards ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.03)',
                color: weatherHazards ? '#fcd34d' : '#9ca3af',
                fontWeight: 800,
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
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>Active Corridor Weather Hazards</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {weatherAlerts.map((w, idx) => (
                <div key={idx} style={{
                  padding: '16px 20px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <AlertTriangle size={20} color={w.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b'} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>{w.corridor}</div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '3px' }}>{w.hazard}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.2)', padding: '6px 12px', borderRadius: '8px' }}>
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
