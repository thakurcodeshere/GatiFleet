import { useState } from 'react';
import { IndianRupee, CheckCircle, X, PenTool } from 'lucide-react';

export default function FastagEwayHub({ onClose }) {
  const [activeTab, setActiveTab] = useState('FASTAG');
  const [showEpodModal, setShowEpodModal] = useState(false);
  const [signedEpod, setSignedEpod] = useState(false);

  const tollTransactions = [
    { id: 'TXN-9081', plaza: 'Kherki Daula Toll Plaza, NH48', vehicle: 'TRK-9842', trip: 'TRIP-7731', amount: '₹845', time: '10:42 AM', status: 'MATCHED' },
    { id: 'TXN-9082', plaza: 'Manesar FASTag Checkpoint', vehicle: 'TRK-4402', trip: 'TRIP-8820', amount: '₹420', time: '09:15 AM', status: 'MATCHED' },
    { id: 'TXN-9083', plaza: 'Yamuna Expressway Toll 2', vehicle: 'TRK-1290', trip: 'TRIP-9912', amount: '₹1,250', time: '08:30 AM', status: 'MATCHED' },
    { id: 'TXN-9084', plaza: 'Bhiwandi Outer Gate Toll', vehicle: 'TRK-5531', trip: 'UNMAPPED', amount: '₹310', time: '07:10 AM', status: 'FLAGGED' },
  ];

  const ewayBills = [
    { ewayNo: 'EWB-8849102931', vehicle: 'TRK-9842', consignee: 'Reliance Retail Ltd', validTill: '2026-08-14 23:59', distance: '1,420 km', status: 'ACTIVE' },
    { ewayNo: 'EWB-7738291044', vehicle: 'TRK-4402', consignee: 'Tata Motors Supply', validTill: '2026-08-12 18:00', distance: '850 km', status: 'EXPIRING_SOON' },
    { ewayNo: 'EWB-5529104822', vehicle: 'TRK-1290', consignee: 'Amazon Logistics India', validTill: '2026-08-16 12:00', distance: '2,100 km', status: 'ACTIVE' },
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
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(16, 185, 129, 0.15)',
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
          background: 'rgba(16, 185, 129, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
            }}>
              <IndianRupee size={22} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Fleetx FASTag Toll & e-Way Bill Automated Logistics Hub
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Automated Toll Deduction Mapping, e-Way Bill Expiry Sentinel, and EPOD Digital Closure
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

        {/* Tab Selection */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setActiveTab('FASTAG')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              border: activeTab === 'FASTAG' ? '1px solid #10b981' : '1px solid var(--border-subtle)',
              background: activeTab === 'FASTAG' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              color: activeTab === 'FASTAG' ? '#6ee7b7' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            FASTag Toll Stream
          </button>
          <button
            onClick={() => setActiveTab('EWAY')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              border: activeTab === 'EWAY' ? '1px solid #10b981' : '1px solid var(--border-subtle)',
              background: activeTab === 'EWAY' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              color: activeTab === 'EWAY' ? '#6ee7b7' : 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            e-Way Bill Manager
          </button>
          <button
            onClick={() => setShowEpodModal(true)}
            style={{
              marginLeft: 'auto',
              padding: '8px 18px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
            }}
          >
            <PenTool size={14} /> Capture EPOD Signature
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: '24px', flex: 1, overflow: 'auto' }}>
          {activeTab === 'FASTAG' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>FASTag Wallet Balance</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>₹48,250</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>NPCI Auto-Recharge Active</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Today's Toll Expenditure</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'white', marginTop: '4px' }}>₹12,840</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>18 Active Vehicles</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Trip Reconciliation Rate</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>98.4%</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>1 Flagged Anomaly</div>
                </div>
              </div>

              {tollTransactions.map(txn => (
                <div key={txn.id} style={{
                  padding: '14px 18px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>{txn.plaza}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Vehicle: <strong style={{ color: 'white' }}>{txn.vehicle}</strong> · Trip: {txn.trip} · Time: {txn.time}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#10b981' }}>{txn.amount}</div>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: txn.status === 'MATCHED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: txn.status === 'MATCHED' ? '#6ee7b7' : '#fca5a5'
                    }}>
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'EWAY' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ewayBills.map(ewb => (
                <div key={ewb.ewayNo} style={{
                  padding: '16px 20px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '12px',
                  border: ewb.status === 'EXPIRING_SOON' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>{ewb.ewayNo}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Consignee: {ewb.consignee} · Vehicle: <strong style={{ color: 'white' }}>{ewb.vehicle}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: ewb.status === 'EXPIRING_SOON' ? '#f59e0b' : '#10b981' }}>
                      Valid Till: {ewb.validTill}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Corridor Distance: {ewb.distance}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* EPOD Signature Modal */}
      {showEpodModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '500px',
            background: 'var(--bg-800)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'white' }}>Electronic Proof of Delivery (EPOD)</div>
              <button onClick={() => setShowEpodModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px dashed var(--border-subtle)', height: '140px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer', marginBottom: '16px' }}
                 onClick={() => setSignedEpod(true)}>
              {signedEpod ? (
                <div style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={20} /> Signature & Timestamp Verified (Rajesh Kumar - Store Manager)
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <PenTool size={24} color="#6366f1" />
                  <span>Click to Capture Consignee Digital Signature</span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                alert('EPOD Consignment Receipt Verified and Dispatched to Customer ERP.');
                setShowEpodModal(false);
              }}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Submit & Complete Trip Delivery
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
