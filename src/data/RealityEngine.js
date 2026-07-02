// ============================================================
// GatiFleet — Transportation Reality Engine (TRE) Core
// The single model of reality for the transportation ecosystem
// ============================================================

// ============================================================
// GatiFleet — Transportation Reality Engine (TRE) Core
// Integrated with the Unified Neural Network Engine (Modules 1-18)
// ============================================================

import { io } from 'socket.io-client';
import { 
  UnifiedNeuralNetworkEngine,
  ENTITY_TYPES,
  STATE_MACHINES,
  TWIN_SCHEMAS,
  KG_ONTOLOGY,
  CALCULATION_ENGINES,
  POLICY_REGISTRY,
  KPI_REGISTRY,
  AI_AGENT_REGISTRY,
  DEP_MATRIX,
  CLOSED_LOOPS
} from './neuralNetwork';

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

    // --- INTEGRATED UNIFIED NEURAL ENGINE ---
    this.neuralEngine = new UnifiedNeuralNetworkEngine(this);

    // Registries
    this.entityRegistry = ENTITY_TYPES;
    this.stateMachines = STATE_MACHINES;
    this.twinSchemas = TWIN_SCHEMAS;
    this.kgOntology = KG_ONTOLOGY;
    this.calculationEngines = CALCULATION_ENGINES;
    this.policyRegistry = POLICY_REGISTRY;
    this.kpiRegistry = KPI_REGISTRY;
    this.agentRegistry = AI_AGENT_REGISTRY;
    this.dependencyMatrix = DEP_MATRIX;
    this.closedLoops = CLOSED_LOOPS;

    // Fetch initial state from the API server
    this.fetchData();

    // Start background simulation ticker
    this.startTicker();
  }

  async fetchData() {
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

      // 2. Fetch cached data
      const [eventsRes, entitiesRes] = await Promise.all([
        fetch('http://localhost:3000/api/events'),
        fetch('http://localhost:3000/api/entities')
      ]);

      if (eventsRes.ok) {
        this.events = await eventsRes.json();
      }
      if (entitiesRes.ok) {
        this.entities = await entitiesRes.json();
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

    } catch (err) {
      console.error('Failed to fetch data from backend API:', err);
    }
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
  dispatchEvent(eventType, payload, operatorId = 'AI-SYSTEM') {
    const res = this.neuralEngine.dispatchEvent(eventType, payload, operatorId);
    this.notify();
    return res;
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
      auditLog: this.neuralEngine.getAuditLog()
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

      // Run continuous logic trigger
      this.neuralEngine.dispatchEvent('TELEMETRY_SYNC', {
        desc: 'Live edge sensors telemetry sync',
        fatigueIndex: 22,
        module: 'M7'
      });

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

