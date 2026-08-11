import { useState } from 'react';
import { Disc, Download, RefreshCw, Wrench, X } from 'lucide-react';

export default function TpmsSettingsModal({ onClose }) {
  const [axleType, setAxleType] = useState('18_WHEELER');
  const [psiThreshold, setPsiThreshold] = useState(110);
  const [autoCalibrated, setAutoCalibrated] = useState(false);
  const [exported, setExported] = useState(false);

  const handleCalibrate = () => {
    setAutoCalibrated(true);
    setTimeout(() => setAutoCalibrated(false), 2500);
  };

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2000);
    alert('TPMS 18-Wheeler sensor pressure & temperature log exported as CSV!');
  };

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
        border: '1px solid rgba(192, 132, 252, 0.4)',
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
          background: 'rgba(192, 132, 252, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #c084fc, #9333ea)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 15px rgba(192, 132, 252, 0.4)'
            }}>
              <Disc size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                TPMS 18-Wheeler Telemetry Options & Diagnostics
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                Sensor Calibration, PSI Alert Boundaries, Axle Configuration & Maintenance Dispatches
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

        {/* Options Body */}
        <div style={{ padding: '24px', flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Action 1: Axle Configuration Switcher */}
          <div style={{
            padding: '18px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px'
          }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', marginBottom: '12px' }}>Axle & Wheel Matrix Profile</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { id: '18_WHEELER', name: '18-Wheeler Semi Trailer', count: '18 Tyres (4x4 Grid)' },
                { id: '12_WHEELER', name: '12-Wheeler Heavy Hauler', count: '12 Tyres (3x4 Grid)' },
                { id: '6_WHEELER', name: '6-Wheeler Rigid Truck', count: '6 Tyres (2x3 Grid)' }
              ].map(a => {
                const isActive = axleType === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => setAxleType(a.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      border: isActive ? '1px solid #c084fc' : '1px solid rgba(255,255,255,0.1)',
                      background: isActive ? 'rgba(192, 132, 252, 0.2)' : 'rgba(255,255,255,0.03)',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 800, color: isActive ? '#c084fc' : '#ffffff' }}>{a.name}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>{a.count}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action 2: Pressure Alert Threshold Slider */}
          <div style={{
            padding: '18px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>Under-Inflation Pressure Threshold</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>Alert triggers when tyre pressure drops below this boundary</div>
              </div>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#ef4444', background: 'rgba(239, 68, 68, 0.15)', padding: '4px 12px', borderRadius: '8px' }}>
                {psiThreshold} PSI
              </span>
            </div>

            <input
              type="range"
              min="90"
              max="125"
              value={psiThreshold}
              onChange={(e) => setPsiThreshold(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#c084fc', cursor: 'pointer' }}
            />
          </div>

          {/* Action 3: Quick Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <button
              onClick={handleCalibrate}
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: autoCalibrated ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.04)',
                border: autoCalibrated ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                color: autoCalibrated ? '#6ee7b7' : '#ffffff',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <RefreshCw size={16} className={autoCalibrated ? 'spin' : ''} />
              {autoCalibrated ? 'Sensors Calibrated!' : 'Calibrate All Sensors'}
            </button>

            <button
              onClick={handleExport}
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Download size={16} color="#38bdf8" />
              {exported ? 'Exported CSV' : 'Export Sensor Log'}
            </button>

            <button
              onClick={() => alert('Workorder ticket #WO-9941 created for 18-Wheeler tyre alignment and pressure check at Bhiwandi Depot!')}
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: 'rgba(192, 132, 252, 0.2)',
                border: '1px solid #c084fc',
                color: '#e9d5ff',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Wrench size={16} color="#c084fc" />
              Dispatch Maintenance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
