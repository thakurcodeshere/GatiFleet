// ============================================================
// GatiFleet OS — Plane 5: Canonical State Machine Engine
// Principles: 21–24, 131–135, 351–355 | Law 11: Reversibility
// ============================================================

class StateMachineEngine {
  constructor() {
    this.customerStates = [
      'Prospect', 'Qualified', 'Opportunity', 'Negotiation', 
      'Contracted', 'Active', 'Expanding', 'Strategic', 
      'At Risk', 'Recovering', 'Dormant', 'Lost'
    ];

    this.shipmentStates = [
      'BOOKED', 'DISPATCHED', 'IN_TRANSIT', 
      'ARRIVED', 'DELIVERED', 'INVOICED', 'SETTLED'
    ];

    // Allowed transition flows
    this.validTransitions = {
      CUSTOMER: {
        'Prospect': ['Qualified', 'Lost'],
        'Qualified': ['Opportunity', 'Dormant', 'Lost'],
        'Opportunity': ['Negotiation', 'Lost'],
        'Negotiation': ['Contracted', 'Lost'],
        'Contracted': ['Active', 'Dormant'],
        'Active': ['Expanding', 'Strategic', 'At Risk', 'Dormant'],
        'Expanding': ['Strategic', 'At Risk'],
        'Strategic': ['At Risk'],
        'At Risk': ['Recovering', 'Lost', 'Dormant'],
        'Recovering': ['Active', 'Strategic', 'Lost'],
        'Dormant': ['Active', 'Lost'],
        'Lost': ['Prospect']
      },
      SHIPMENT: {
        'BOOKED': ['DISPATCHED'],
        'DISPATCHED': ['IN_TRANSIT'],
        'IN_TRANSIT': ['ARRIVED'],
        'ARRIVED': ['DELIVERED'],
        'DELIVERED': ['INVOICED'],
        'INVOICED': ['SETTLED'],
        'SETTLED': []
      }
    };
  }

  // Get state machine schemas
  getSchema() {
    return {
      customerStates: this.customerStates,
      shipmentStates: this.shipmentStates,
      validTransitions: this.validTransitions
    };
  }

  // Execute State Transition with Pre-Condition Validation
  transitionState({ entityType = 'CUSTOMER', entityId, currentState, targetState, operatorId = 'AI-SYSTEM', reason = 'Operational state advance' }) {
    const transitions = this.validTransitions[entityType];
    if (!transitions) {
      throw new Error(`Invalid entityType [${entityType}]. Must be CUSTOMER or SHIPMENT.`);
    }

    const allowedNext = transitions[currentState] || [];
    if (!allowedNext.includes(targetState) && currentState !== targetState) {
      throw new Error(`Invalid transition leap from [${currentState}] to [${targetState}]. Allowed next states: ${allowedNext.join(', ')}.`);
    }

    const transitionRecord = {
      id: `trans-${Date.now()}`,
      entityType,
      entityId,
      previousState: currentState,
      newState: targetState,
      operatorId,
      reason,
      timestamp: new Date().toISOString(),
      l1EventEmitted: `${entityType}_STATE_TRANSITIONED`
    };

    return transitionRecord;
  }
}

const stateMachineEngineInstance = new StateMachineEngine();
module.exports = { StateMachineEngine: stateMachineEngineInstance };
