// ============================================================
// GatiFleet OS — L1 Event Taxonomy & Event Validation Engine
// Enforces Law 3 (Everything Important is an Event) & Plane 8 (Event Plane)
// ============================================================

const EVENT_TYPES = {
  // 1. Telemetry & Sensor Events
  TELEMETRY_SYNC: 'TELEMETRY_SYNC',
  GPS_PIN_MUTATED: 'GPS_PIN_MUTATED',
  GEOFENCE_ENTERED: 'GEOFENCE_ENTERED',
  GEOFENCE_EXITED: 'GEOFENCE_EXITED',
  FUEL_LEVEL_CHANGED: 'FUEL_LEVEL_CHANGED',
  ANOMALY_DETECTED: 'ANOMALY_DETECTED',

  // 2. Identity & Security Events
  IDENTITY_VERIFIED: 'IDENTITY_VERIFIED',
  AUTH_FAILED: 'AUTH_FAILED',
  TOKEN_REFRESHED: 'TOKEN_REFRESHED',
  KILL_SWITCH_TOGGLED: 'KILL_SWITCH_TOGGLED',
  POLICY_VIOLATED: 'POLICY_VIOLATED',

  // 3. Operational & Dispatch Events
  SHIPMENT_CREATED: 'SHIPMENT_CREATED',
  VEHICLE_DISPATCHED: 'VEHICLE_DISPATCHED',
  SHIPMENT_DELAYED: 'SHIPMENT_DELAYED',
  ROUTE_REROUTED: 'ROUTE_REROUTED',
  POD_VERIFIED: 'POD_VERIFIED',
  TRUCK_BROKEN_DOWN: 'TRUCK_BROKEN_DOWN',
  INCIDENT_RESOLVED: 'INCIDENT_RESOLVED',

  // 4. Commercial & Financial Events
  QUOTE_GENERATED: 'QUOTE_GENERATED',
  CONTRACT_SIGNED: 'CONTRACT_SIGNED',
  INVOICE_GENERATED: 'INVOICE_GENERATED',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  MARGIN_RECALCULATED: 'MARGIN_RECALCULATED',

  // 5. AI & Autonomy Loop Events
  AGENT_RECOMMENDATION_DISPATCHED: 'AGENT_RECOMMENDATION_DISPATCHED',
  AUTONOMOUS_ACTION_EXECUTED: 'AUTONOMOUS_ACTION_EXECUTED',
  SIMULATION_EXECUTED: 'SIMULATION_EXECUTED',
  GAP_DISCOVERED: 'GAP_DISCOVERED',
  STATE_RECONCILED: 'STATE_RECONCILED'
};

const AUTONOMY_LEVELS = {
  L0_OBSERVE: 'L0_OBSERVE',
  L1_RECOMMEND: 'L1_RECOMMEND',
  L2_PREPARE: 'L2_PREPARE',
  L3_EXECUTE_LOW_RISK: 'L3_EXECUTE_LOW_RISK',
  L4_EXECUTE_APPROVED: 'L4_EXECUTE_APPROVED',
  L5_CONTINUOUS_OPTIMIZATION: 'L5_CONTINUOUS_OPTIMIZATION'
};

class EventTaxonomyEngine {
  constructor() {
    this.types = EVENT_TYPES;
    this.autonomyLevels = AUTONOMY_LEVELS;
  }

  validateEvent(event) {
    if (!event || typeof event !== 'object') {
      return { valid: false, error: 'Event payload must be an object' };
    }

    const requiredFields = ['type', 'source', 'desc'];
    for (const field of requiredFields) {
      if (!event[field]) {
        return { valid: false, error: `Missing mandatory field: ${field}` };
      }
    }

    if (!Object.values(EVENT_TYPES).includes(event.type)) {
      return { valid: false, error: `Invalid event type: ${event.type}. Must be defined in Event Taxonomy.` };
    }

    // Return normalized event payload
    return {
      valid: true,
      event: {
        id: event.id || `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: event.timestamp || new Date().toISOString(),
        type: event.type,
        desc: event.desc,
        source: event.source,
        payload: event.payload || {},
        autonomyLevel: event.autonomyLevel || AUTONOMY_LEVELS.L0_OBSERVE,
        operatorId: event.operatorId || 'SYS-KERNEL',
        context: event.context || {}
      }
    };
  }
}

module.exports = {
  EVENT_TYPES,
  AUTONOMY_LEVELS,
  EventTaxonomyEngine: new EventTaxonomyEngine()
};
