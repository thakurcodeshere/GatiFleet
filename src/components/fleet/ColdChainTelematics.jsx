import { useState } from 'react';
import { Thermometer, AlertCircle, X, Disc } from 'lucide-react';

export default function ColdChainTelematics({ onClose }) {
  const [activeTab, setActiveTab] = useState('REEFER');

  // TPMS Tyre Array Mock Data for 18-wheeler
  const tyres = [
    { id: 'FL1', pos: 'Front Left', psi: 110, temp: 38, status: 'NORMAL' },
    { id: 'FR1', pos: 'Front Right', psi: 108, temp: 39, status: 'NORMAL' },
    { id: 'AL1', pos: 'Axle 1 Left Outer', psi: 112, temp: 42, status: 'NORMAL' },
    { id: 'AL2', pos: 'Axle 1 Left Inner', psi: 94, temp: 58, status: 'LOW_PRESSURE' },
    { id: 'AR1', pos: 'Axle 1 Right Outer', psi: 111, temp: 41, status: 'NORMAL' },
    { id: 'AR2', pos: 'Axle 1 Right Inner', psi: 110, temp: 40, status: 'NORMAL' },
    { id: 'BL1', pos: 'Axle 2 Left Outer', psi: 115, temp: 44, status: 'NORMAL' },
    { id: 'BL2', pos: 'Axle 2 Left Inner', psi: 114, temp: 43, status: 'NORMAL' },
    { id: 'BR1', pos: 'Axle 2 Right Outer', psi: 113, temp: 45, status: 'NORMAL' },
    { id: 'BR2', pos: 'Axle 2 Right Inner', psi: 112, temp: 43, status: 'NORMAL' },
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
        maxWidth: '1050px',
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
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
            }}>
              <Thermometer size={22} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Fleetx Sensor Telematics & Cold-Chain Suite
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Multi-Zone Reefer Temperature Graphs, Fuel Theft Detection, and TPMS Tyre Sensor Grid
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

        {/* Tab Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '12px' }}>
          {['REEFER', 'FUEL_THEFT', 'TPMS_TYRES'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 700,
                border: activeTab === t ? '1px solid #a855f7' : '1px solid var(--border-subtle)',
                background: activeTab === t ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                color: activeTab === t ? '#c084fc' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '24px', flex: 1, overflow: 'auto' }}>
          {activeTab === 'REEFER' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Zone 1 (Pharma Cold Storage)</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#a855f7', marginTop: '4px' }}>-18.2 °C</div>
                  <div style={{ fontSize: '10px', color: '#10b981', marginTop: '4px' }}>Target: -18.0 °C (Nominal)</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Zone 2 (Fresh Dairy)</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>+4.1 °C</div>
                  <div style={{ fontSize: '10px', color: '#10b981', marginTop: '4px' }}>Target: +4.0 °C (Nominal)</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Door Sensor Sensor</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>SEALED</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Magnetic Seal Sensor Lock</div>
                </div>
              </div>

              {/* Temperature Graph Simulator */}
              <div style={{
                background: '#090d16',
                border: '1px solid var(--border-subtle)',
                borderRadius: '14px',
                padding: '20px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginBottom: '14px' }}>
                  24-Hour Temperature Sensor Trend (°C Line)
                </div>
                <div style={{ height: '160px', display: 'flex', alignItems: 'flex-end', gap: '8px', paddingBottom: '20px', borderBottom: '1px dashed var(--border-subtle)' }}>
                  {[18.1, 18.2, 17.9, 18.0, 18.3, 17.8, 18.2, 14.5, 18.1, 18.0, 18.2, 18.1].map((val, idx) => {
                    const heightPercent = (val / 20) * 100;
                    const isBreach = val < 16;
                    return (
                      <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: '100%',
                          height: `${heightPercent}%`,
                          background: isBreach ? 'linear-gradient(to top, #ef4444, #f87171)' : 'linear-gradient(to top, #6366f1, #a855f7)',
                          borderRadius: '4px'
                        }} />
                        <span style={{ fontSize: '9px', color: isBreach ? '#fca5a5' : 'var(--text-muted)' }}>-{val}°</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'FUEL_THEFT' && (
            <div>
              <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <AlertCircle size={20} color="#ef4444" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#fca5a5' }}>1 Fuel Theft Siphoning Event Prevented</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Detected 35L sudden fuel level drop while vehicle was stationary at Vapi Rest Stop (02:15 AM). Alarm sent to driver console.</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'TPMS_TYRES' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              {tyres.map(tyre => (
                <div key={tyre.id} style={{
                  padding: '14px',
                  background: tyre.status === 'LOW_PRESSURE' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.02)',
                  borderRadius: '12px',
                  border: tyre.status === 'LOW_PRESSURE' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Disc size={22} color={tyre.status === 'LOW_PRESSURE' ? '#ef4444' : '#10b981'} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>{tyre.id} — {tyre.pos}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pressure: {tyre.psi} PSI · Temp: {tyre.temp}°C</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: tyre.status === 'NORMAL' ? 'rgba(16, 185, 129, 0.2)' : '#ef4444',
                    color: 'white'
                  }}>
                    {tyre.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
