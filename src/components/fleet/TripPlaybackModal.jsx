import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Gauge, MapPin, AlertTriangle, X } from 'lucide-react';

export default function TripPlaybackModal({ vehicle, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x, 2x, 5x, 10x
  const [progress, setProgress] = useState(15); // 0 to 100%
  const [activeTab, setActiveTab] = useState('telemetry'); // telemetry, halts, alerts

  // Mock route waypoints dataset
  const waypoints = [
    { time: '08:30 AM', location: 'Bhiwandi Hub Depot, MH', speed: 0, status: 'Departed', fuel: 98, ignition: 'ON' },
    { time: '09:45 AM', location: 'NH48 Toll Plaza 1 (Manesar)', speed: 64, status: 'Cruising', fuel: 91, ignition: 'ON' },
    { time: '11:15 AM', location: 'Jaipur Bypass Highway', speed: 78, status: 'Overspeed Alert', fuel: 82, ignition: 'ON' },
    { time: '01:00 PM', location: 'Kotputli Driver Rest Stop', speed: 0, status: 'Halt (45m)', fuel: 80, ignition: 'OFF' },
    { time: '03:20 PM', location: 'Ajmer Logistics Node', speed: 58, status: 'In Transit', fuel: 68, ignition: 'ON' },
    { time: '05:45 PM', location: 'Ahmedabad Ring Road Dock', speed: 0, status: 'Arrived', fuel: 55, ignition: 'OFF' },
  ];

  // Playback timer effect
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const currentWaypointIndex = Math.min(
    Math.floor((progress / 100) * waypoints.length),
    waypoints.length - 1
  );
  const currentPoint = waypoints[currentWaypointIndex];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(3, 7, 18, 0.82)',
      backdropFilter: 'blur(16px)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        maxHeight: '90vh',
        background: 'var(--bg-800)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
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
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
            }}>
              <Play size={20} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Fleetx Trip Playback Engine — {vehicle?.id || 'TRK-9842'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Driver: {vehicle?.driver || 'Vikram Singh'} · Corridor: NH48 Mumbai-Delhi Expressway
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

        {/* Playback Canvas Simulator */}
        <div style={{
          position: 'relative',
          height: '280px',
          background: '#090d16',
          backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '20px'
        }}>
          {/* Top Info HUD */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid var(--border-subtle)',
              padding: '8px 14px',
              borderRadius: '10px',
              backdropFilter: 'blur(10px)',
              fontSize: '12px'
            }}>
              <span style={{ color: 'var(--text-muted)' }}>Timestamp: </span>
              <span style={{ color: '#818cf8', fontWeight: 700 }}>{currentPoint.time}</span>
            </div>
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid var(--border-subtle)',
              padding: '8px 14px',
              borderRadius: '10px',
              backdropFilter: 'blur(10px)',
              fontSize: '12px'
            }}>
              <span style={{ color: 'var(--text-muted)' }}>Location: </span>
              <span style={{ color: 'white', fontWeight: 600 }}>{currentPoint.location}</span>
            </div>
            <div style={{
              background: currentPoint.speed > 75 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.15)',
              border: currentPoint.speed > 75 ? '1px solid #ef4444' : '1px solid #10b981',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              color: currentPoint.speed > 75 ? '#fca5a5' : '#6ee7b7',
              fontWeight: 700,
              marginLeft: 'auto'
            }}>
              <Gauge size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              {currentPoint.speed} km/h
            </div>
          </div>

          {/* Route Playback Map Path Graphic */}
          <div style={{ position: 'relative', width: '100%', height: '100px', display: 'flex', alignItems: 'center' }}>
            <div style={{
              position: 'absolute',
              left: '5%',
              right: '5%',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2px'
            }} />
            <div style={{
              position: 'absolute',
              left: '5%',
              width: `${progress * 0.9}%`,
              height: '4px',
              background: 'linear-gradient(90deg, #6366f1, #38bdf8, #10b981)',
              borderRadius: '2px',
              boxShadow: '0 0 10px #38bdf8'
            }} />

            {/* Waypoint Markers */}
            {waypoints.map((wp, idx) => {
              const posPercent = (idx / (waypoints.length - 1)) * 90 + 5;
              const isPassed = idx <= currentWaypointIndex;
              return (
                <div key={idx} style={{
                  position: 'absolute',
                  left: `${posPercent}%`,
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <div style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: isPassed ? '#10b981' : '#334155',
                    border: '2px solid #0f172a',
                    boxShadow: isPassed ? '0 0 8px #10b981' : 'none'
                  }} />
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{wp.time}</span>
                </div>
              );
            })}

            {/* Live Vehicle Moving Pin */}
            <div style={{
              position: 'absolute',
              left: `${progress * 0.9 + 5}%`,
              transform: 'translateX(-50%) translateY(-18px)',
              transition: 'left 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                background: '#6366f1',
                padding: '4px 8px',
                borderRadius: '6px',
                color: 'white',
                fontSize: '10px',
                fontWeight: 700,
                boxShadow: '0 0 12px #6366f1',
                whiteSpace: 'nowrap'
              }}>
                TRK-9842 ({currentPoint.speed} km/h)
              </div>
              <MapPin size={22} color="#818cf8" />
            </div>
          </div>

          {/* Control Bar & Timeline Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                border: 'none',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
              }}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <button
              onClick={() => { setProgress(0); setIsPlaying(false); }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} /> Reset
            </button>

            {/* Speed Multipliers */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '2px' }}>
              {[1, 2, 5, 10].map(s => (
                <button
                  key={s}
                  onClick={() => setPlaybackSpeed(s)}
                  style={{
                    background: playbackSpeed === s ? '#6366f1' : 'transparent',
                    border: 'none',
                    color: playbackSpeed === s ? 'white' : 'var(--text-muted)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Scrub Slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#6366f1', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', width: '40px' }}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Telemetry & Route Details Tab Section */}
        <div style={{ padding: '20px', flex: 1, overflow: 'auto' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            {['telemetry', 'halts', 'alerts'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  border: activeTab === tab ? '1px solid #6366f1' : '1px solid var(--border-subtle)',
                  background: activeTab === tab ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: activeTab === tab ? '#818cf8' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'telemetry' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Current Speed</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: currentPoint.speed > 75 ? '#ef4444' : '#10b981', marginTop: '4px' }}>
                  {currentPoint.speed} km/h
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Max Target: 80 km/h</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Fuel Tank Sensor</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                  {currentPoint.fuel}%
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Sensors Nominal · 320L</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ignition State</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: currentPoint.ignition === 'ON' ? '#10b981' : '#f59e0b', marginTop: '4px' }}>
                  {currentPoint.ignition}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>OBD-II Engine Status</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reefer Temp</div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#a855f7', marginTop: '4px' }}>
                  -18.4 °C
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Cold Chain Intact</div>
              </div>
            </div>
          )}

          {activeTab === 'halts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Kotputli Driver Rest Stop</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Duration: 45 minutes · Mandatory HOS Rest Break</div>
                </div>
                <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>Approved Stop</div>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <AlertTriangle size={18} color="#ef4444" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#fca5a5' }}>Overspeed Triggered at 11:15 AM</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Vehicle reached 78 km/h in 60 km/h restricted zone. Driver notified via console.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
