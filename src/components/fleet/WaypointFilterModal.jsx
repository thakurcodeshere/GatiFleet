import { useState } from 'react';
import { Search, AlertTriangle, Gauge, Clock, Fuel, MapPin, X } from 'lucide-react';

export default function WaypointFilterModal({ onClose, onSelectWaypoint }) {
  const [filterCategory, setFilterCategory] = useState('ALL');

  const waypointsList = [
    { id: 'WP-101', time: '09:45 AM', location: 'NH48 Manesar Toll Plaza', speed: 84, type: 'OVERSPEED', desc: 'Overspeeding breach (84 km/h in 60 zone)' },
    { id: 'WP-102', time: '11:15 AM', location: 'Jaipur Bypass Highway', speed: 78, type: 'NORMAL', desc: 'Cruising speed nominal' },
    { id: 'WP-103', time: '01:00 PM', location: 'Kotputli Rest Stop', speed: 0, type: 'HALT', desc: 'Rest Halt (45 mins duration)' },
    { id: 'WP-104', time: '02:15 PM', location: 'Vapi Parking Corridor', speed: 0, type: 'FUEL_DROP', desc: 'Sudden fuel drop anomaly (-35L)' },
  ];

  const filtered = filterCategory === 'ALL'
    ? waypointsList
    : waypointsList.filter(w => w.type === filterCategory);

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
        maxWidth: '850px',
        maxHeight: '90vh',
        background: 'var(--bg-800)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(245, 158, 11, 0.15)',
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
          background: 'rgba(245, 158, 11, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
            }}>
              🔍
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Waypoint Anomaly Deep Search Filter
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Filter Route Waypoints by Overspeeding, Rest Halts & Fuel Siphoning Anomalies
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

        {/* Filter Pills */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '10px' }}>
          {['ALL', 'OVERSPEED', 'HALT', 'FUEL_DROP'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                border: filterCategory === cat ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                background: filterCategory === cat ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                color: filterCategory === cat ? '#fcd34d' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Waypoints List */}
        <div style={{ padding: '24px', flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(wp => (
            <div
              key={wp.id}
              onClick={() => {
                onSelectWaypoint?.(wp);
                onClose();
              }}
              style={{
                padding: '16px 20px',
                background: 'rgba(255,255,255,0.02)',
                border: wp.type === 'OVERSPEED' || wp.type === 'FUEL_DROP' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-subtle)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin size={18} color={wp.type === 'OVERSPEED' ? '#ef4444' : wp.type === 'HALT' ? '#f59e0b' : '#10b981'} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>{wp.location}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{wp.desc}</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b' }}>{wp.time}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Speed: {wp.speed} km/h</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
