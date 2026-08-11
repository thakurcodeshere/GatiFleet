import { useState } from 'react';
import { Download, ShieldCheck, X } from 'lucide-react';

export default function ConsignmentVaultModal({ vehicle, onClose }) {
  const [downloaded, setDownloaded] = useState(false);

  const documentData = {
    lrNo: 'LR-9984102',
    date: '12-Nov-2023',
    consignor: 'Reliance Logistics Hub, Bhiwandi',
    consignee: 'Tata Motors Assembly Plant, Jaipur',
    cargo: 'Auto Components & Engine Modules',
    weight: '18.4 Tonnes',
    ewayBill: 'EWB-8849102931',
    driver: vehicle?.driverName || 'Vikram Singh',
    driverLicense: 'DL-MH04-2018-0914',
    freightAmount: '₹84,500',
    gstin: '27AAAAA0000A1Z5'
  };

  const handleDownloadLR = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
    alert(`Lorry Receipt (LR-9984102) downloaded as PDF for vehicle ${vehicle?.id || 'TRK-9842'}!`);
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
        maxWidth: '850px',
        maxHeight: '90vh',
        background: 'var(--bg-800)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(99, 102, 241, 0.15)',
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
          background: 'rgba(99, 102, 241, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
            }}>
              📄
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Consignment & LR/GR Document Vault
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Digital Lorry Receipt, e-Way Bill Verification Seal & EPOD Delivery Certificate
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

        {/* LR Document Details Grid */}
        <div style={{ padding: '24px', flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Stamp Bar */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={20} color="#10b981" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#6ee7b7' }}>GSTIN & GST Tax Invoice Compliant</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>GSTIN: {documentData.gstin} · e-Way Bill: {documentData.ewayBill}</div>
              </div>
            </div>

            <button
              onClick={handleDownloadLR}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={14} /> {downloaded ? 'Downloaded PDF' : 'Download Official LR'}
            </button>
          </div>

          {/* Consignment Document Sheet Grid */}
          <div style={{
            background: '#090d16',
            border: '1px solid var(--border-subtle)',
            borderRadius: '14px',
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Lorry Receipt No.</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#818cf8', marginTop: '2px' }}>{documentData.lrNo}</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Consignment Date</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginTop: '2px' }}>{documentData.date}</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Consignor (Origin)</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginTop: '2px' }}>{documentData.consignor}</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Consignee (Destination)</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginTop: '2px' }}>{documentData.consignee}</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cargo Description & Weight</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'white', marginTop: '2px' }}>{documentData.cargo} ({documentData.weight})</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Freight Commercial Rate</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>{documentData.freightAmount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
