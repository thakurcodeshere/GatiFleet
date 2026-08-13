// ============================================================
// GatiFleet — Transportation Reality Engine (TRE) Core
// The single model of reality for the transportation ecosystem
// ============================================================

// ============================================================
// GatiFleet — Transportation Reality Engine (TRE) Core
// Integrated with the Unified Neural Network Engine (Modules 1-18)
// ============================================================

import { io } from 'socket.io-client';

class TransportationRealityEngine {
  constructor() {
    this.subscribers = new Set();
    this.isSimulationRunning = true;

    // Layer 1: Event Capture Layer (L1 Event)
    this.events = [];

    // Layer 2: Universal Entity Layer (L2 Entity)
    this.entities = {};

    // Layer 3: Digital Twin Layer (L3 Digital Twin)
    // Every entity gets Physical, Operational, Financial, Behavioral, and Risk twins
    this.twins = {
      customer: {
        physical: 'Mumbai Factory Docks',
        operational: 'Active (42 shipments/mo)',
        financial: 'Contract margins: 24.6%',
        behavioral: 'Payment cycles: 2.1 days average',
        risk: 'Low Contract Risk (12%)'
      },
      driver: {
        physical: 'Obd-II Cab Telemetry OK',
        operational: 'Active duty: 6.2 hours driven',
        financial: 'Bonus potential accrued: ₹4,500',
        behavioral: 'Habit safety: 91.2% score',
        risk: 'Fatigue index: 22%'
      },
      route: {
        physical: 'NH48 Western Corridor',
        operational: 'Dwell bottlenecks: +22m average',
        financial: 'Toll card expense: ₹4,200',
        behavioral: 'Monday congestion loops detected',
        risk: 'Monsoon landslide alerts: Moderate'
      },
      shipment: {
        physical: 'Reefer box temp: 4.2°C',
        operational: 'In-transit: Delhi ➔ Mumbai',
        financial: 'Freight value: ₹36.0 Lakhs',
        behavioral: 'SLA priority rating: High',
        risk: 'Theft forecast risk: 0.04%'
      }
    };

    // Layer 4: Memory Layer (L4 Memory)
    this.lessons = [
      {
        id: 'les-0',
        event: 'Siliguri landslide delay',
        cause: 'Monsoon landslide corridor blockage on NH27',
        factors: 'Subcontractor trailer lack of GPS telemetry + poor alternate route routing',
        financialImpact: 'SLA penalty debit of ₹42,000 + factory standby penalty',
        recovery: 'Re-routed en-route cargo via secondary DFC rail wagons',
        outcome: 'Detour latency minimized. Delay duration reduced by 60%'
      },
      {
        id: 'les-1',
        event: 'FASTag toll card depletion stoppage',
        cause: 'Toll balance zeroed out at NH8 toll gateway',
        factors: 'Demurrage balances charged on concurrent routes, bypassing local refill triggers',
        financialImpact: 'Idle driver overtime pay + toll block fine: ₹18,000',
        recovery: 'Auto-refilled accounts via corporate bank credit lines',
        outcome: 'Enabled route-based predictive toll liquidity transfers 30m prior to plaza'
      }
    ];

    // Layer 5: Learning Layer (L5 Learning)
    this.learningStats = {
      etaAccuracy: 96.2,
      costAccuracy: 98.4,
      capacityAccuracy: 91.5,
      activeModels: ['ETA-XGBoost-v4', 'TollPath-RNN-v1'],
      learnedFeatures: [
        { name: 'Monday Congestion Factor (NH48)', impact: '+4.2h delay probability weekly', source: 'Continuous loop audit' },
        { name: 'Jaipur Toll Queue Index', impact: '+22m toll plaza backlog patterns', source: 'FASTag transit timing feedback' }
      ]
    };

    // Layer 6: Prediction Layer (L6 Prediction)
    this.predictions = {
      delays: { probability: '12%', reason: 'Monsoon border checkpoints', impact: '+2.4h potential' },
      breakdowns: { probability: '4.2%', reason: 'High radiator coolant heat', impact: 'TRK-90482 engine check' },
      churn: { probability: '2.8%', reason: 'SLA compliance stable', impact: 'Rebate triggers inactive' },
      capacity: { probability: '45%', reason: 'Pre-festival container volume spikes', impact: '-18 trailer shortages' },
      costSpikes: { probability: '32%', reason: 'Diesel price revisions', impact: '+₹1.8/L forecast' },
      resignation: {
        probability: '82%',
        reason: 'Overtime hours rising + average monthly bonuses declining + trip distances increasing',
        driver: 'drv-1209 (Rajesh Kumar)'
      }
    };

    // Layer 7: Simulation Layer (L7 Simulation)
    this.simulationState = {
      dieselIncrease: 0,
      portClosed: false,
      monsoonFlashFlood: false,
      demandDoubled: false,
      scenarioResult: null
    };

    // Layer 8: Decision Layer (L8 Decision)
    this.decisionPackage = {
      target: 'Delhi ➔ Chennai (500 Tons)',
      optionsScanned: 30000000,
      selectedPlan: 'Dedicated Rail DFC Line',
      reasoning: 'DFC Rail achieves cost minimization target while protecting SLA reliability at 98.5% confidence.',
      alternatives: ['NH44 Direct Road (High Risk)', 'Multimodal Hub (Moderate Cost)']
    };

    // Layer 9: Execution Layer (L9 Execution)
    this.executionAgentStatus = {
      state: 'idle',
      lastExecutedAction: 'Reassign shipment SHP-CT-90482 to standby driver Suresh Yadav.',
      webhookStatus: 'Secure ZKP Handshake complete',
      autoDispatches: [
        'Dispatched trailer allocation confirmation to BlueDart',
        'Updated ETA records inside client intelligence dashboard',
        'Registered geofence route tracking tags on NH14 Corridor'
      ]
    };

    // Layer 10: Evolution Layer (L10 Evolution)
    this.evolutionMatrix = {
      topDataGaps: ['Odometer telemetry on subcontractor trailers', 'Real-time dock utilization in Eastern ports'],
      topPredictionFailures: ['ETA accuracy drops near Siliguri border (+8.5% dev)'],
      topRevenueLeaks: ['Subcontractor spot price hikes on seasonal corridors (₹14.2L lost)'],
      experiments: [
        { id: 'exp-1', name: 'ZKP Invoice Auto-verify', status: 'Running (Group A: 20 carriers)', result: 'Reduced billing cycle from 3.2 days to 0.4 days' }
      ],
      selfUpgrades: {
        weakness: 'ETA Accuracy in West Bengal (degraded to 84% vs 97% target)',
        rootCause: 'Missing toll plaza queue data near Raxaul border',
        newRequirement: 'Acquire live NH27 toll queue parameters via Fastag registry APIs',
        modelStatus: 'Retrained and Deployed (Model ETA-XGBoost-v4-WB)'
      }
    };

    // Global Metric: Operational Certainty Index (OCI)
    this.oci = {
      etaCertainty: 96.2,
      costCertainty: 98.4,
      capacityCertainty: 91.5,
      demandCertainty: 92.8,
      customerCertainty: 94.6,
      driverCertainty: 90.2,
      networkCertainty: 88.5,
      revenueCertainty: 95.0,
      globalCertainty: 93.4
    };

    // Plane 10: Universal Agent Kill Switch State
    this.killSwitchActive = false;
    this.killSwitchMetadata = {
      toggledAt: null,
      toggledBy: null,
      reason: null
    };

    // Registries (Now managed by the backend Intelligence Tier)
    this.entityRegistry = {};
    this.stateMachines = {};
    this.twinSchemas = {};
    this.kgOntology = {};
    this.calculationEngines = {};
    this.policyRegistry = {};
    this.kpiRegistry = {};
    this.agentRegistry = {};
    this.dependencyMatrix = {};
    this.closedLoops = {};

    // Fetch initial state from the API server
    this.fetchData();

    // Start background simulation ticker
    this.startTicker();
  }

  async fetchData() {
    // Only attempt local backend API connection if running on localhost dev server
    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    if (!isLocalhost) {
      console.log('Running in Production / Vercel environment: Reality Engine initialized in Autonomous Offline Simulation mode.');
      return;
    }

    try {
      // 1. Authenticate with backend using seeded Admin credentials
      const authRes = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@gatifleet.com', password: 'admin123' })
      });
      
      if (authRes.ok) {
        const authData = await authRes.json();
        this.token = authData.token;
        this.user = authData.user;
        console.log(`Successfully authenticated as ${this.user.role}`);
      } else {
        console.error('Authentication failed.');
      }

      // 2. Fetch cached data, kill switch status, twins & agents registry
      const [eventsRes, entitiesRes, ksRes, twinsRes, agentsRes] = await Promise.all([
        fetch('http://localhost:3000/api/events'),
        fetch('http://localhost:3000/api/entities'),
        fetch('http://localhost:3000/api/governance/kill-switch'),
        fetch('http://localhost:3000/api/world-model/twins'),
        fetch('http://localhost:3000/api/agents/registry')
      ]);

      if (eventsRes.ok) {
        this.events = await eventsRes.json();
      }
      if (entitiesRes.ok) {
        this.entities = await entitiesRes.json();
      }
      if (ksRes.ok) {
        const ksData = await ksRes.json();
        this.killSwitchActive = ksData.killSwitchActive;
        this.killSwitchMetadata = ksData.metadata;
      }
      if (twinsRes.ok) {
        const twinsData = await twinsRes.json();
        this.worldModelDigitalTwins = twinsData.twins;
        this.spatioTemporalAnomalies = twinsData.anomalies;
      }
      if (agentsRes.ok) {
        const agentsData = await agentsRes.json();
        this.agentRegistryList = agentsData.agents;
      }
      this.notify();

      // Initialize Socket.io connection
      this.socket = io('http://localhost:3000');
      
      this.socket.on('new_event', (dbEvent) => {
        this.events = [dbEvent, ...this.events.slice(0, 49)];
        this.notify();
      });

      this.socket.on('telemetry_update', (dbEvent) => {
        this.events = [dbEvent, ...this.events.slice(0, 49)];
        this.notify();
      });

      this.socket.on('kill_switch_toggled', (ksPayload) => {
        this.killSwitchActive = ksPayload.killSwitchActive;
        this.killSwitchMetadata = ksPayload.metadata;
        if (ksPayload.event) {
          this.events = [ksPayload.event, ...this.events.slice(0, 49)];
        }
        this.notify();
      });

      this.socket.on('policy_violated', (violEvent) => {
        this.events = [violEvent, ...this.events.slice(0, 49)];
        this.notify();
      });

      this.socket.on('state_reconciled', (reconciledData) => {
        console.log('[REALITY ENGINE] Canonical 3-Way State Reconciled:', reconciledData);
        this.notify();
      });

      this.socket.on('world_model_tick', (tickData) => {
        this.spatioTemporalAnomalies = tickData.anomalies || [];
        this.notify();
      });

      this.socket.on('agent_autonomy_updated', (updatedAgent) => {
        if (this.agentRegistryList) {
          this.agentRegistryList = this.agentRegistryList.map(a => 
            a.id === updatedAgent.agentId ? { ...a, autonomyLevel: updatedAgent.autonomyLevel } : a
          );
        }
        this.notify();
      });

      this.socket.on('multi_agent_consensus', (consensusResult) => {
        console.log('[REALITY ENGINE] Multi-Agent Consensus Event Received:', consensusResult);
        this.notify();
      });

    } catch (err) {
      console.error('Failed to fetch data from backend API:', err);
    }
  }

  // Universal Agent Kill Switch Toggle Action
  async toggleKillSwitch(active, reason = 'Operator Toggle via Security Fortress') {
    this.killSwitchActive = Boolean(active);
    this.killSwitchMetadata = {
      toggledAt: new Date().toISOString(),
      toggledBy: this.user ? this.user.email : 'ADMIN',
      reason: reason
    };

    const newEvent = {
      id: `ev-ks-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'KILL_SWITCH_TOGGLED',
      desc: `Universal Agent Kill Switch ${this.killSwitchActive ? 'ACTIVATED (PAUSED DISPATCHES)' : 'DEACTIVATED (DISPATCHES RESTORED)'}. Reason: ${reason}`,
      source: 'SYS/GUARD'
    };
    this.events = [newEvent, ...this.events.slice(0, 49)];
    this.notify();

    if (this.token) {
      try {
        await fetch('http://localhost:3000/api/governance/kill-switch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ active, reason })
        });
      } catch (err) {
        console.error('Failed to sync kill switch toggle with backend:', err);
      }
    }
  }

  // Canonical 3-Way State Reconciliation (Law 1)
  async reconcileCanonicalState() {
    if (this.token) {
      try {
        const res = await fetch('http://localhost:3000/api/reconcile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        });
        if (res.ok) {
          const reconciled = await res.json();
          this.events = [{
            id: `ev-recon-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: 'STATE_RECONCILED',
            desc: `Canonical 3-way State Reconciled (Events: ${reconciled.ledger.eventsCount}, Vehicles: ${reconciled.ledger.vehiclesCount}, Shipments: ${reconciled.ledger.shipmentsCount})`,
            source: 'SYS/RECONCILER'
          }, ...this.events.slice(0, 49)];
          this.notify();
          return reconciled;
        }
      } catch (err) {
        console.error('Reconciliation request failed', err);
      }
    }
    return { status: 'OFFLINE_RECONCILED' };
  }

  // Update Agent Autonomy Level (L0-L5)
  async updateAgentAutonomy(agentId, autonomyLevel) {
    if (this.token) {
      try {
        const res = await fetch('http://localhost:3000/api/agents/autonomy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ agentId, autonomyLevel })
        });
        if (res.ok) {
          const data = await res.json();
          this.notify();
          return data;
        }
      } catch (err) {
        console.error('Failed to update agent autonomy:', err);
      }
    }
    return { status: 'LOCAL_UPDATED' };
  }

  // Canonical State Machine Transition (Plane 5)
  async transitionEntityState(entityType, entityId, currentState, targetState, reason = 'Operator Transition') {
    if (this.token) {
      try {
        const res = await fetch('http://localhost:3000/api/state-machine/transition', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ entityType, entityId, currentState, targetState, reason })
        });
        if (res.ok) {
          const data = await res.json();
          this.notify();
          return data;
        }
      } catch (err) {
        console.error('State transition failed:', err);
      }
    }
    return { status: 'LOCAL_STATE_TRANSITIONED' };
  }

  // Fetch 6-Brain Customer Digital Twin (Plane 2)
  async fetchSixBrainTwin(entityId) {
    try {
      const res = await fetch(`http://localhost:3000/api/twins/brains/${entityId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error('Failed to fetch 6-Brain Digital Twin:', e);
    }
    return null;
  }

  // Get Double Timeline Memory Ledger (Plane 9)
  async getDoubleTimeline(entityId = 'GLOBAL') {
    try {
      const res = await fetch(`http://localhost:3000/api/ledger/double-timeline/${entityId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error('Failed to fetch Double Timeline:', e);
    }
    return null;
  }

  // Mutate Evolution Policy Genome (Plane 12)
  async mutateEvolutionPolicy(policyId, newValue, reason) {
    if (this.token) {
      try {
        const res = await fetch('http://localhost:3000/api/evolution/mutate-policy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ policyId, newValue, reason })
        });
        if (res.ok) {
          const data = await res.json();
          this.notify();
          return data;
        }
      } catch (e) {
        console.error('Policy mutation failed:', e);
      }
    }
    return { status: 'OFFLINE_POLICY_MUTATED' };
  }

  // Execute Multi-Agent Consensus & Adversarial Debate Protocol (Plane 3)
  async runMultiAgentConsensus(decisionTask) {
    if (this.token) {
      try {
        const res = await fetch('http://localhost:3000/api/agents/consensus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify(decisionTask)
        });
        if (res.ok) {
          const consensusData = await res.json();
          this.events = [{
            id: `ev-con-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: 'MULTI_AGENT_CONSENSUS',
            desc: `Multi-Agent Debate Completed [${consensusData.title}]: ${consensusData.status}`,
            source: 'SYS/CONSENSUS'
          }, ...this.events.slice(0, 49)];
          this.notify();
          return consensusData;
        }
      } catch (err) {
        console.error('Consensus evaluation failed:', err);
      }
    }
    return { status: 'OFFLINE_CONSENSUS_EXECUTED' };
  }

  // Subscribe to changes (UI triggers redraws)
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    this.subscribers.forEach(cb => cb(this.getState()));
  }

  // Hook to allow event dispatches to propagate downstream
  async dispatchEvent(eventType, payload, operatorId = 'AI-SYSTEM') {
    console.log(`Dispatching L1 event ${eventType} by ${operatorId}`);
    
    // Check local Kill Switch state before attempting dispatch
    if (this.killSwitchActive && eventType !== 'KILL_SWITCH_TOGGLED') {
      const blockedEvent = {
        id: `ev-blocked-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'POLICY_VIOLATED',
        desc: `Action [${eventType}] BLOCKED by active Universal Agent Kill Switch.`,
        source: 'SYS/POLICY_KERNEL'
      };
      this.events = [blockedEvent, ...this.events.slice(0, 49)];
      this.notify();
      return { status: 'BLOCKED_BY_KILL_SWITCH', reason: 'Universal Agent Kill Switch is ACTIVE.' };
    }

    const localEvent = {
      id: `ev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: eventType,
      desc: payload.desc || `L1 Event ${eventType} dispatched`,
      source: operatorId
    };

    this.events = [localEvent, ...this.events.slice(0, 49)];
    this.notify();

    if (this.token) {
      try {
        const res = await fetch('http://localhost:3000/api/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({
            type: eventType,
            desc: payload.desc || `L1 Event ${eventType} dispatched`,
            source: operatorId,
            payload: payload,
            autonomyLevel: payload.autonomyLevel || 'L0_OBSERVE',
            financialExposureINR: payload.financialExposureINR || 0,
            riskScore: payload.riskScore || 0,
            confidence: payload.confidence || 1.0
          })
        });

        if (!res.ok) {
          const errData = await res.json();
          console.warn('Backend rejected event dispatch:', errData);
          return { status: 'BLOCKED_BY_POLICY', error: errData.error };
        }
      } catch (e) {
        console.error('Failed to post event to API', e);
      }
    }

    return { status: 'DISPATCHED', event: localEvent };
  }

  getState() {
    return {
      events: this.events,
      entities: this.entities,
      twins: this.twins,
      lessons: this.lessons,
      predictions: this.predictions,
      causality: this.causality,
      simulationState: this.simulationState,
      decisionPackage: this.decisionPackage,
      executionAgentStatus: this.executionAgentStatus,
      learningStats: this.learningStats,
      evolutionMatrix: this.evolutionMatrix,
      oci: this.oci,

      // Universal Kill Switch State (Plane 10)
      killSwitchActive: this.killSwitchActive,
      killSwitchMetadata: this.killSwitchMetadata,

      // Neural registries & engines
      entityRegistry: this.entityRegistry,
      stateMachines: this.stateMachines,
      twinSchemas: this.twinSchemas,
      kgOntology: this.kgOntology,
      calculationEngines: this.calculationEngines,
      policyRegistry: this.policyRegistry,
      kpiRegistry: this.kpiRegistry,
      agentRegistry: this.agentRegistry,
      dependencyMatrix: this.dependencyMatrix,
      closedLoops: this.closedLoops,
      auditLog: []
    };
  }

  // Ticks every few seconds simulating the reality flow
  startTicker() {
    setInterval(() => {
      if (!this.isSimulationRunning) return;

      // Jitter OCI certainties
      this.oci = {
        ...this.oci,
        etaCertainty: +(this.oci.etaCertainty + (Math.random() - 0.5) * 0.2).toFixed(2),
        costCertainty: +(this.oci.costCertainty + (Math.random() - 0.5) * 0.1).toFixed(2),
        driverCertainty: +(this.oci.driverCertainty + (Math.random() - 0.5) * 0.3).toFixed(2)
      };
      this.oci.globalCertainty = +(
        (this.oci.etaCertainty +
          this.oci.costCertainty +
          this.oci.capacityCertainty +
          this.oci.demandCertainty +
          this.oci.customerCertainty +
          this.oci.driverCertainty +
          this.oci.networkCertainty +
          this.oci.revenueCertainty) /
        8
      ).toFixed(2);

      // Live edge sensors telemetry sync should now be handled by WebSocket events
      // The backend will process and emit these.

      this.notify();
    }, 5000);
  }

  // Simulation Controls (What-if scenario executions)
  setDieselSimulation(pct) {
    this.simulationState.dieselIncrease = pct;
    
    if (pct > 0) {
      this.simulationState.scenarioResult = {
        marginImpact: `-8%`,
        revenueImpact: `-2%`,
        regionRisk: `+11% (West Region)`,
        recommendation: `Shift upcoming Western corridors to container rail corridors and apply a 3% fuel card pre-buy surcharge.`
      };
      this.predictions.costSpikes.probability = '98%';
      this.oci.costCertainty = +(98.4 - pct * 0.25).toFixed(2);
    } else {
      this.simulationState.scenarioResult = null;
      this.predictions.costSpikes.probability = '32%';
      this.oci.costCertainty = 98.4;
    }

    this.oci.globalCertainty = +(
      (this.oci.etaCertainty +
        this.oci.costCertainty +
        this.oci.capacityCertainty +
        this.oci.demandCertainty +
        this.oci.customerCertainty +
        this.oci.driverCertainty +
        this.oci.networkCertainty +
        this.oci.revenueCertainty) /
      8
    ).toFixed(2);

    this.dispatchEvent('SimulationParameterChanged', {
      desc: `Simulation: Diesel price spike modifier adjusted to +${pct}%. margins calculated: Scenario A active.`,
      module: 'M18',
      source: 'SIMULATION/ENGINE'
    });
  }

  setPortClosed(closed) {
    this.simulationState.portClosed = closed;
    if (closed) {
      this.entities.route.state = 'congested';
      this.predictions.delays.probability = '98%';
      this.oci.networkCertainty = 68.4;

      this.dispatchEvent('AutonomousActionDispatched', {
        desc: 'JNPT Port Closure detected. Autonomous Agent rerouted 8 container shipments to Panvel hub.',
        module: 'M11',
        source: 'AUTONOMY/BROKER'
      });
    } else {
      this.entities.route.state = 'nominal';
      this.predictions.delays.probability = '12%';
      this.oci.networkCertainty = 88.5;
    }
    this.oci.globalCertainty = +(
      (this.oci.etaCertainty +
        this.oci.costCertainty +
        this.oci.capacityCertainty +
        this.oci.demandCertainty +
        this.oci.customerCertainty +
        this.oci.driverCertainty +
        this.oci.networkCertainty +
        this.oci.revenueCertainty) /
      8
    ).toFixed(2);

    this.notify();
  }

  triggerIncidentBreakdown() {
    this.isSimulationRunning = false;
    this.entities.truck.state = 'broken_down';
    this.twins.driver.risk = 'Fatigue index: 88% (Breached)';
    this.twins.shipment.risk = 'Theft risk: Critical (12.4%)';
    this.oci.etaCertainty = 42.1;
    this.oci.revenueCertainty = 62.4;
    this.oci.globalCertainty = +(
      (this.oci.etaCertainty +
        this.oci.costCertainty +
        this.oci.capacityCertainty +
        this.oci.demandCertainty +
        this.oci.customerCertainty +
        this.oci.driverCertainty +
        this.oci.networkCertainty +
        this.oci.revenueCertainty) /
      8
    ).toFixed(2);

    this.dispatchEvent('TruckBrokenDown', {
      desc: 'TRK-90482 engine coolant breach detected. Safety score degraded, fatigue flagged.',
      module: 'M7',
      source: 'TRK-90482/OBD'
    });
  }

  resolveIncidentBreakdown() {
    this.isSimulationRunning = true;
    this.entities.truck.state = 'active';
    this.twins.driver.risk = 'Fatigue index: 22%';
    this.twins.shipment.risk = 'Theft risk: 0.04%';
    this.oci.etaCertainty = 96.2;
    this.oci.revenueCertainty = 95.0;
    this.oci.globalCertainty = +(
      (this.oci.etaCertainty +
        this.oci.costCertainty +
        this.oci.capacityCertainty +
        this.oci.demandCertainty +
        this.oci.customerCertainty +
        this.oci.driverCertainty +
        this.oci.networkCertainty +
        this.oci.revenueCertainty) /
      8
    ).toFixed(2);

    const newLesson = {
      id: `les-${Date.now()}`,
      event: 'TRK-90482 coolant breach recovery',
      cause: 'OBD-II error P0117 coolant leak sensor breach',
      factors: 'Driver fatigue accumulation limits + highway checkpoint backlogs',
      financialImpact: 'Auto-credited 10% SLA penalty: ₹9,600',
      recovery: 'Dispatched backup trailer TRK-00052, transferred en-route coordinates, auto-notified customer.',
      outcome: 'Detour success. Bypassed flood congestion, protected production lines.'
    };
    this.lessons = [newLesson, ...this.lessons];

    this.dispatchEvent('SentinelResolutionComplete', {
      desc: 'Auto-exception resolution complete. Driver rest trigger dispatched. SLA Protected.',
      module: 'M6',
      source: 'SENTINEL/AUTONOMY'
    });
  }
}

// Export singleton instance representing GatiFleet's unified reality
export const RealityEngine = new TransportationRealityEngine();

