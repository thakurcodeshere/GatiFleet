import { useState } from 'react';
import { ShieldAlert, Radio, Clock, CheckCircle2, PhoneCall, Truck, MapPin, X } from 'lucide-react';

export default function ControlTowerView({ onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeAlerts, setActiveAlerts] = useState([
    { id: 'ALT-101', vehicle: 'TRK-9842', driver: 'Vikram Singh', category: 'COLD_CHAIN', title: 'Reefer Temp Breach (-14.2°C vs Target -18°C)', location: 'NH48 KM 214, Jaipur Corridor', time: '4 mins ago', severity: 'CRITICAL' },
    { id: 'ALT-102', vehicle: 'TRK-4402', driver: 'Ramesh Patel', category: 'FUEL', title: 'Sudden Fuel Drop (-35L Anomaly)', location: 'Bhiwandi Parking Bay #4', time: '12 mins ago', severity: 'HIGH' },
    { id: 'ALT-103', vehicle: 'TRK-1290', driver: 'Suresh Kumar', category: 'IDLING', title: 'Excessive Idling (>2.5 Hours)', location: 'Vapi Checkpoint', time: '28 mins ago', severity: 'MEDIUM' },
    { id: 'ALT-104', vehicle: 'TRK-5531', driver: 'Amit Sharma', category: 'SAFETY', title: 'Harsh Braking & DMS Drowsiness Alert', location: 'Surat Bypass', time: '42 mins ago', severity: 'HIGH' },
  ]);

  const resolveAlert = (id) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== id));
  };

  const filteredAlerts = selectedCategory === 'ALL' 
    ? activeAlerts 
    : activeAlerts.filter(a => a.category === selectedCategory);

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
        maxWidth: '1050px',
        maxHeight: '90vh',
        background: 'var(--bg-800)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(239, 68, 68, 0.15)',
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
          background: 'rgba(239, 68, 68, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)'
            }}>
              <ShieldAlert size={22} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Fleetx Logistics Control Tower & Exception Wall
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Real-Time Panic, SOS, Fuel Drain, and Reefer Breach Incident Desk
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

        {/* Filter Pills Bar */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '10px' }}>
          {['ALL', 'COLD_CHAIN', 'FUEL', 'IDLING', 'SAFETY'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                border: selectedCategory === cat ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
                background: selectedCategory === cat ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                color: selectedCategory === cat ? '#fca5a5' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Radio size={14} color="#ef4444" style={{ animation: 'pulse 1s infinite' }} />
            Active Exceptions: <strong style={{ color: 'white' }}>{activeAlerts.length}</strong>
          </div>
        </div>

        {/* Alarm Wall Stream */}
        <div style={{ padding: '24px', flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredAlerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={40} color="#10b981" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'white' }}>All Exceptions Resolved</div>
              <div style={{ fontSize: '12px' }}>Fleet operating within normal parameter limits.</div>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <div key={alert.id} style={{
                background: alert.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: alert.severity === 'CRITICAL' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-subtle)',
                borderRadius: '14px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: alert.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b',
                    boxShadow: alert.severity === 'CRITICAL' ? '0 0 10px #ef4444' : 'none'
                  }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>{alert.title}</span>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: alert.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b',
                        color: 'white'
                      }}>
                        {alert.severity}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', gap: '12px' }}>
                      <span><Truck size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{alert.vehicle} ({alert.driver})</span>
                      <span><MapPin size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{alert.location}</span>
                      <span><Clock size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{alert.time}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => alert(`Calling driver ${alert.driver} (${alert.vehicle})...`)}
                    style={{
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid #6366f1',
                      color: '#818cf8',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <PhoneCall size={12} /> Contact Driver
                  </button>
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid #10b981',
                      color: '#6ee7b7',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <CheckCircle2 size={12} /> Resolve Incident
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
