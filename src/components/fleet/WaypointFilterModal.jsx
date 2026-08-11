import { useState } from 'react';
import { MapPin, X } from 'lucide-react';

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
        background: '#0b0f19',
        border: '1px solid rgba(245, 158, 11, 0.4)',
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
          background: 'rgba(245, 158, 11, 0.08)'
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
              color: '#ffffff',
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)'
            }}>
              🔍
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                Waypoint Anomaly Deep Search Filter
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                Filter Route Waypoints by Overspeeding, Rest Halts & Fuel Siphoning Anomalies
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

        {/* Filter Pills */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', gap: '10px' }}>
          {['ALL', 'OVERSPEED', 'HALT', 'FUEL_DROP'].map(cat => {
            const isActive = filterCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 800,
                  border: isActive ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.12)',
                  background: isActive ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255,255,255,0.04)',
                  color: isActive ? '#fef3c7' : '#9ca3af',
                  cursor: 'pointer',
                  letterSpacing: '0.03em'
                }}
              >
                {cat.replace('_', ' ')}
              </button>
            );
          })}
        </div>

        {/* Waypoints List */}
        <div style={{ padding: '24px', flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map(wp => (
            <div
              key={wp.id}
              onClick={() => {
                onSelectWaypoint?.(wp);
                onClose();
              }}
              style={{
                padding: '18px 22px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: wp.type === 'OVERSPEED' || wp.type === 'FUEL_DROP' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <MapPin size={20} color={wp.type === 'OVERSPEED' ? '#ef4444' : wp.type === 'HALT' ? '#f59e0b' : '#10b981'} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>{wp.location}</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '3px' }}>{wp.desc}</div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#f59e0b' }}>{wp.time}</div>
                <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '3px' }}>Speed: {wp.speed} km/h</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
