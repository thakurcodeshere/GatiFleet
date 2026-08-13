// ============================================================
// GatiFleet OS — Plane 9: Double Timeline Memory Ledger
// Principles: 29–32, 141–150, 371–380 | Law 1, Law 11
// ============================================================

class DoubleTimelineLedger {
  constructor() {
    this.operationalTimeline = [
      { id: 'op-1', timestamp: '2026-08-13T10:14:00Z', eventType: 'GPS_PING', desc: 'TRK-001 passed NH48 Khalapur Plaza at 64 km/h.', sensor: 'IoT/GPS' },
      { id: 'op-2', timestamp: '2026-08-13T11:30:00Z', eventType: 'FASTAG_DEBIT', desc: 'FASTag toll ₹1,450 debited at Lonavala plaza.', sensor: 'Toll Gateway' },
      { id: 'op-3', timestamp: '2026-08-13T12:45:00Z', eventType: 'TEMP_SPIKE', desc: 'Reefer cargo temp reached 14.2°C (Warning threshold 12°C).', sensor: 'Cold Chain IoT' }
    ];

    this.decisionTimeline = [
      { id: 'dec-1', timestamp: '2026-08-13T10:15:00Z', decisionType: 'ROUTE_APPROVAL', operatorId: 'LOGISTICS-AI', reason: 'Verified NH48 traffic flownominal. Approved standard route.', expectation: 'ETA 14:30' },
      { id: 'dec-2', timestamp: '2026-08-13T12:46:00Z', decisionType: 'REEFER_OVERRIDE', operatorId: 'SENTINEL-X', reason: 'Cold chain temp spike detected. Auto-adjusted compressor cooling to max.', expectation: 'Temp drops to 8°C in 15m' }
    ];
  }

  // Get Double Timeline view for an entity
  getDoubleTimeline(entityId) {
    return {
      entityId: entityId || 'GLOBAL',
      timestamp: new Date().toISOString(),
      operationalTimeline: this.operationalTimeline,
      decisionTimeline: this.decisionTimeline,
      rootCauseAnalysis: {
        incidentId: 'INC-2026-891',
        title: 'Cold Chain Temp Spike & Route Delay',
        fiveWhys: [
          '1. Why was ETA delayed? -> Reefer truck stopped at Lonavala station.',
          '2. Why did truck stop? -> Driver inspected reefer cooling line.',
          '3. Why was cooling line hot? -> Compressor filter clogged with dust.',
          '4. Why was filter clogged? -> Scheduled 30-day maintenance delayed by 3 days.',
          '5. Root Cause: Depot maintenance scheduler lacked automatic spare part pre-booking.'
        ]
      }
    };
  }

  // Log a Decision Override Journal Record
  logDecisionJournal({ decisionType, operatorId, reason, expectation, entityId = 'GLOBAL' }) {
    const journalEntry = {
      id: `dec-${Date.now()}`,
      timestamp: new Date().toISOString(),
      entityId,
      decisionType,
      operatorId,
      reason,
      expectation
    };

    this.decisionTimeline.unshift(journalEntry);
    if (this.decisionTimeline.length > 50) this.decisionTimeline.pop();
    return journalEntry;
  }
}

const doubleTimelineLedgerInstance = new DoubleTimelineLedger();
module.exports = { DoubleTimelineLedger: doubleTimelineLedgerInstance };
