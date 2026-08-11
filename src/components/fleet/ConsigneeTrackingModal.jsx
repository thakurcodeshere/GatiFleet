import { useState } from 'react';
import { Share2, Copy, Check, Smartphone, Send, Truck, X } from 'lucide-react';

export default function ConsigneeTrackingModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const [expiryHours, setExpiryHours] = useState(24);

  const generatedUrl = `https://track.gatifleet.com/s/TRK-9842?pin=4912&exp=${expiryHours}h`;

  const copyLink = () => {
    navigator.clipboard?.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              background: 'linear-gradient(135deg, #38bdf8, #0284c7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
            }}>
              <Share2 size={22} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Fleetx Consignee Live Tracking Share Generator
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Generate Secure Public Tracking Link for Shippers & Consignees (No Login Required)
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

        {/* Content Body */}
        <div style={{ padding: '24px', flex: 1, overflow: 'auto', display: 'flex', gap: '24px' }}>
          {/* Left Options */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Secure Generated Tracking URL</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <input
                  readOnly
                  value={generatedUrl}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    color: '#38bdf8',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}
                />
                <button
                  onClick={copyLink}
                  style={{
                    padding: '10px 16px',
                    background: copied ? '#10b981' : '#0284c7',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Expiry Selector */}
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Link Expiration Duration</label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                {[12, 24, 48, 72].map(h => (
                  <button
                    key={h}
                    onClick={() => setExpiryHours(h)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      border: expiryHours === h ? '1px solid #38bdf8' : '1px solid var(--border-subtle)',
                      background: expiryHours === h ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                      color: expiryHours === h ? '#38bdf8' : 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    {h} Hours
                  </button>
                ))}
              </div>
            </div>

            {/* Dispatch Channels */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => alert(`WhatsApp notification with link ${generatedUrl} dispatched to Consignee (+91 98765 43210)!`)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Send size={14} /> Dispatch WhatsApp Alert
              </button>
              <button
                onClick={() => alert(`SMS notification with link ${generatedUrl} dispatched to Consignee!`)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'white',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Smartphone size={14} /> Send SMS
              </button>
            </div>
          </div>

          {/* Right Mobile Public Preview Simulator */}
          <div style={{
            width: '300px',
            background: '#090d16',
            border: '2px solid #334155',
            borderRadius: '24px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8' }}>GatiFleet Public View</span>
              <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 700 }}>● LIVE TRACKING</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
              <Truck size={24} color="#38bdf8" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '13px', fontWeight: 800, color: 'white' }}>Shipment TRK-9842</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Reliance Retail · Order #88194</div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '10px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Estimated Time of Arrival</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#6ee7b7', marginTop: '2px' }}>Today, 05:45 PM</div>
              <div style={{ fontSize: '9px', color: '#10b981', marginTop: '2px' }}>On Schedule · 42 km remaining</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
