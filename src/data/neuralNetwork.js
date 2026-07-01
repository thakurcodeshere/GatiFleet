// ============================================================
// GatiFleet — Unified Neural Network Data & Logic Engine (Modules 1-18)
// Core semantic registry, calculation engines, state machines, and closed loops
// ============================================================

// --- HELPER UTILITIES ---
const generateId = (prefix) => `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;

// --- LAYER 1: UNIVERSAL ENTITY REGISTER & SCHEMAS ---
export const ENTITY_TYPES = {
  CUSTOMER: 'CUSTOMER',
  CONTACT: 'CONTACT',
  LEAD: 'LEAD',
  OPPORTUNITY: 'OPPORTUNITY',
  PROPOSAL: 'PROPOSAL',
  MOBILIZATION_PLAN: 'MOBILIZATION_PLAN',
  AGREEMENT: 'AGREEMENT',
  AGREEMENT_CLAUSE: 'AGREEMENT_CLAUSE',
  INVOICE: 'INVOICE',
  CREDIT_NOTE: 'CREDIT_NOTE',
  DEBIT_NOTE: 'DEBIT_NOTE',
  PAYMENT_RECORD: 'PAYMENT_RECORD',
  DISPUTE: 'DISPUTE',
  OPERATIONAL_INCIDENT: 'OPERATIONAL_INCIDENT',
  RECOVERY_PLAN: 'RECOVERY_PLAN',
  VEHICLE: 'VEHICLE',
  TRAILER: 'TRAILER',
  SENSOR_FEED: 'SENSOR_FEED',
  MAINTENANCE_ORDER: 'MAINTENANCE_ORDER',
  SHIPMENT: 'SHIPMENT',
  ROUTE: 'ROUTE',
  TRANSPORT_NODE: 'TRANSPORT_NODE',
  DISPATCH_PLAN: 'DISPATCH_PLAN',
  DRIVER: 'DRIVER',
  DRIVER_SHIFT: 'DRIVER_SHIFT',
  WAREHOUSE: 'WAREHOUSE',
  DOCK: 'DOCK',
  YARD_SLOT: 'YARD_SLOT',
  FORKLIFT: 'FORKLIFT',
  PARTNER_CARRIER: 'PARTNER_CARRIER',
  PORT_TERMINAL: 'PORT_TERMINAL',
  CUSTOMS_CHECKPOINT: 'CUSTOMS_CHECKPOINT',
  MULTIMODAL_SEGMENT: 'MULTIMODAL_SEGMENT',
  BANK_ACCOUNT: 'BANK_ACCOUNT',
  ACCOUNTS_RECEIVABLE: 'ACCOUNTS_RECEIVABLE',
  ACCOUNTS_PAYABLE: 'ACCOUNTS_PAYABLE',
  BUDGET: 'BUDGET',
  IDENTITY: 'IDENTITY',
  THREAT_EVENT: 'THREAT_EVENT',
  COMPLIANCE_RECORD: 'COMPLIANCE_RECORD',
  STRATEGIC_OBJECTIVE: 'STRATEGIC_OBJECTIVE',
  BOARD_PACK: 'BOARD_PACK',
  STRATEGIC_DECISION: 'STRATEGIC_DECISION',
  KNOWLEDGE_NODE: 'KNOWLEDGE_NODE',
  KNOWLEDGE_EDGE: 'KNOWLEDGE_EDGE',
  SEMANTIC_MEMORY: 'SEMANTIC_MEMORY',
  AI_AGENT: 'AI_AGENT',
  AGENT_TASK: 'AGENT_TASK',
  AGENT_DEBATE: 'AGENT_DEBATE',
  EXPERIMENT: 'EXPERIMENT',
  POLICY_VERSION: 'POLICY_VERSION',
  PROCESS_MINING_RESULT: 'PROCESS_MINING_RESULT',
  REALITY_SNAPSHOT: 'REALITY_SNAPSHOT',
  SCENARIO: 'SCENARIO',
  STRATEGY_CANDIDATE: 'STRATEGY_CANDIDATE',
  FASTAG_ACCOUNT: 'FASTAG_ACCOUNT',
  EWAY_BILL: 'EWAY_BILL',
  FUEL_TRANSACTION: 'FUEL_TRANSACTION',
  TOLL_CROSSING: 'TOLL_CROSSING',
  EMPLOYEE: 'EMPLOYEE'
};

// --- LAYER 2: STATE MACHINES ---
export const STATE_MACHINES = {
  CUSTOMER: {
    states: ['Prospect', 'Qualified', 'Opportunity', 'Negotiation', 'Contracted', 'Active', 'Expanding', 'Strategic', 'At Risk', 'Recovering', 'Dormant', 'Lost'],
    transitions: {
      'Prospect': ['Qualified', 'Dormant'],
      'Qualified': ['Opportunity', 'Dormant'],
      'Opportunity': ['Negotiation', 'Dormant', 'Lost'],
      'Negotiation': ['Contracted', 'Opportunity', 'Lost'],
      'Contracted': ['Active', 'Lost'],
      'Active': ['Expanding', 'Strategic', 'At Risk', 'Dormant'],
      'Expanding': ['Strategic', 'Active', 'At Risk'],
      'Strategic': ['Expanding', 'At Risk'],
      'At Risk': ['Recovering', 'Dormant', 'Lost', 'Active'],
      'Recovering': ['Active', 'At Risk', 'Dormant'],
      'Dormant': ['Recovering', 'Lost', 'Prospect'],
      'Lost': ['Prospect']
    }
  },
  OPPORTUNITY: {
    states: ['Discovery', 'Qualification', 'Feasibility', 'Proposal', 'Negotiation', 'Final Review', 'Closed Won', 'Closed Lost'],
    transitions: {
      'Discovery': ['Qualification', 'Closed Lost'],
      'Qualification': ['Feasibility', 'Discovery', 'Closed Lost'],
      'Feasibility': ['Proposal', 'Qualification', 'Closed Lost'],
      'Proposal': ['Negotiation', 'Feasibility', 'Closed Lost'],
      'Negotiation': ['Final Review', 'Proposal', 'Closed Lost'],
      'Final Review': ['Closed Won', 'Closed Lost', 'Negotiation'],
      'Closed Won': [],
      'Closed Lost': ['Discovery']
    }
  },
  MOBILIZATION: {
    states: ['Initiated', 'Lanes In Progress', 'Readiness Testing', 'Go-Live Pending', 'Operational', 'Hypercare', 'Steady State'],
    transitions: {
      'Initiated': ['Lanes In Progress'],
      'Lanes In Progress': ['Readiness Testing'],
      'Readiness Testing': ['Go-Live Pending', 'Lanes In Progress'],
      'Go-Live Pending': ['Operational', 'Readiness Testing'],
      'Operational': ['Hypercare'],
      'Hypercare': ['Steady State'],
      'Steady State': []
    }
  },
  AGREEMENT: {
    states: ['Draft', 'Review', 'Approved', 'Active', 'Amendment', 'Renewal Pending', 'Renewed', 'Expired', 'Terminated'],
    transitions: {
      'Draft': ['Review'],
      'Review': ['Approved', 'Draft'],
      'Approved': ['Active', 'Draft'],
      'Active': ['Amendment', 'Renewal Pending', 'Expired', 'Terminated'],
      'Amendment': ['Active', 'Review'],
      'Renewal Pending': ['Renewed', 'Expired', 'Active'],
      'Renewed': ['Active'],
      'Expired': [],
      'Terminated': []
    }
  },
  INVOICE: {
    states: ['Draft', 'Generated', 'Sent', 'Acknowledged', 'Disputed', 'Approved', 'Paid', 'Overdue', 'Written Off'],
    transitions: {
      'Draft': ['Generated'],
      'Generated': ['Sent', 'Draft'],
      'Sent': ['Acknowledged', 'Disputed', 'Overdue'],
      'Acknowledged': ['Approved', 'Disputed', 'Overdue'],
      'Disputed': ['Approved', 'Written Off', 'Sent'],
      'Approved': ['Paid', 'Overdue'],
      'Paid': [],
      'Overdue': ['Paid', 'Disputed', 'Written Off'],
      'Written Off': []
    }
  },
  INCIDENT: {
    states: ['Detected', 'Triaging', 'Recovery Active', 'Resolved', 'Post-Mortem', 'Lessons Recorded'],
    transitions: {
      'Detected': ['Triaging'],
      'Triaging': ['Recovery Active', 'Resolved'],
      'Recovery Active': ['Resolved', 'Triaging'],
      'Resolved': ['Post-Mortem'],
      'Post-Mortem': ['Lessons Recorded'],
      'Lessons Recorded': []
    }
  },
  VEHICLE: {
    states: ['Available', 'Assigned', 'In Transit', 'Loading', 'Unloading', 'Maintenance', 'Broken Down', 'Decommissioned'],
    transitions: {
      'Available': ['Assigned', 'Maintenance', 'Decommissioned'],
      'Assigned': ['In Transit', 'Loading', 'Available'],
      'Loading': ['In Transit', 'Available'],
      'In Transit': ['Unloading', 'Broken Down'],
      'Unloading': ['Available', 'Assigned'],
      'Maintenance': ['Available', 'Decommissioned'],
      'Broken Down': ['Maintenance', 'Available']
    }
  },
  SHIPMENT: {
    states: ['Booked', 'Scheduled', 'Loading', 'In Transit', 'At Checkpoint', 'Unloading', 'Delivered', 'Delayed', 'Failed'],
    transitions: {
      'Booked': ['Scheduled', 'Failed'],
      'Scheduled': ['Loading', 'Booked', 'Failed'],
      'Loading': ['In Transit', 'Scheduled'],
      'In Transit': ['At Checkpoint', 'Unloading', 'Delayed', 'Failed'],
      'At Checkpoint': ['In Transit', 'Unloading', 'Delayed', 'Failed'],
      'Delayed': ['In Transit', 'At Checkpoint', 'Unloading', 'Failed'],
      'Unloading': ['Delivered', 'Failed'],
      'Delivered': [],
      'Failed': []
    }
  },
  DRIVER: {
    states: ['Available', 'On Duty', 'On Trip', 'Rest Break', 'Off Duty', 'On Leave', 'Training', 'Suspended', 'Terminated'],
    transitions: {
      'Available': ['On Duty', 'On Leave', 'Training', 'Suspended'],
      'On Duty': ['On Trip', 'Rest Break', 'Off Duty'],
      'On Trip': ['Rest Break', 'Available', 'Suspended'],
      'Rest Break': ['On Trip', 'On Duty', 'Off Duty'],
      'Off Duty': ['On Duty', 'Available', 'On Leave'],
      'On Leave': ['Available'],
      'Training': ['Available'],
      'Suspended': ['Available', 'Terminated'],
      'Terminated': []
    }
  },
  WAREHOUSE: {
    states: ['Operational', 'Congested', 'Overflow', 'Maintenance', 'Emergency', 'Offline'],
    transitions: {
      'Operational': ['Congested', 'Maintenance', 'Emergency', 'Offline'],
      'Congested': ['Operational', 'Overflow', 'Emergency'],
      'Overflow': ['Congested', 'Emergency'],
      'Maintenance': ['Operational', 'Offline'],
      'Emergency': ['Offline', 'Operational'],
      'Offline': ['Operational']
    }
  },
  THREAT: {
    states: ['Detected', 'Analyzing', 'Contained', 'Remediated', 'Post-Incident Review', 'Closed'],
    transitions: {
      'Detected': ['Analyzing'],
      'Analyzing': ['Contained', 'Closed'],
      'Contained': ['Remediated'],
      'Remediated': ['Post-Incident Review'],
      'Post-Incident Review': ['Closed'],
      'Closed': []
    }
  },
  AUTONOMY: {
    states: ['L0 Recommendation', 'L1 Draft Actions', 'L2 Execute After Approval', 'L3 Low-Risk Autonomous', 'L4 Cross-Department Autonomous', 'L5 Network Optimization'],
    transitions: {
      'L0 Recommendation': ['L1 Draft Actions'],
      'L1 Draft Actions': ['L2 Execute After Approval', 'L0 Recommendation'],
      'L2 Execute After Approval': ['L3 Low-Risk Autonomous', 'L1 Draft Actions'],
      'L3 Low-Risk Autonomous': ['L4 Cross-Department Autonomous', 'L2 Execute After Approval'],
      'L4 Cross-Department Autonomous': ['L5 Network Optimization', 'L3 Low-Risk Autonomous'],
      'L5 Network Optimization': ['L4 Cross-Department Autonomous']
    }
  },
  EXPERIMENT: {
    states: ['Hypothesis', 'Designed', 'Running', 'Analyzing', 'Validated', 'Promoted', 'Rejected'],
    transitions: {
      'Hypothesis': ['Designed'],
      'Designed': ['Running', 'Rejected'],
      'Running': ['Analyzing'],
      'Analyzing': ['Validated', 'Rejected'],
      'Validated': ['Promoted', 'Rejected'],
      'Promoted': [],
      'Rejected': []
    }
  },
  STRATEGY: {
    states: ['Generated', 'Simulated', 'Ranked', 'Debated', 'Approved', 'Executing', 'Measured', 'Archived'],
    transitions: {
      'Generated': ['Simulated'],
      'Simulated': ['Ranked'],
      'Ranked': ['Debated', 'Archived'],
      'Debated': ['Approved', 'Archived'],
      'Approved': ['Executing'],
      'Executing': ['Measured'],
      'Measured': ['Archived'],
      'Archived': []
    }
  }
};

// Validate transition helper
export const validateTransition = (machineType, fromState, toState) => {
  const machine = STATE_MACHINES[machineType];
  if (!machine) return false;
  if (fromState === toState) return true;
  return machine.transitions[fromState]?.includes(toState) || false;
};

// --- LAYER 3: COGNITIVE DIGITAL TWIN BRAINS ---
export const TWIN_SCHEMAS = {
  CUSTOMER: ['Commercial', 'Operational', 'Financial', 'Relationship', 'Strategic', 'Learning'],
  OPPORTUNITY: ['Commercial', 'Customer', 'Logistics', 'Financial', 'Competitive', 'Executive', 'AI'],
  VEHICLE: ['Physical', 'Operational', 'Financial', 'Maintenance', 'Safety', 'Environmental'],
  DRIVER: ['Physical', 'Operational', 'Financial', 'Behavioral', 'Safety', 'Career'],
  WAREHOUSE: ['Physical', 'Operational', 'Financial', 'Flow', 'Environmental', 'Capacity'],
  ROUTE: ['Physical', 'Operational', 'Financial', 'Congestion', 'Environmental', 'Risk'],
  ENTERPRISE: ['Operational', 'Financial', 'Customer', 'Workforce', 'Asset', 'Risk', 'Market', 'AI'],
  FINANCIAL: ['Cash', 'AR/AP', 'Depreciation', 'Tax', 'WorkingCapital', 'Margin'],
  IDENTITY: ['Authentication', 'Access', 'Compliance', 'Threat', 'Behavioral', 'Trust'],
  NETWORK: ['Topology', 'Capacity', 'Reliability', 'Cost', 'Carbon', 'Risk'],
  AGENT: ['Performance', 'Goals', 'Memory', 'Confidence', 'Collaboration', 'Learning']
};

// --- LAYER 4: KNOWLEDGE GRAPH ONTOLOGY ---
export const KG_ONTOLOGY = {
  nodeTypes: Object.keys(ENTITY_TYPES),
  edgeTypes: [
    { from: 'CUSTOMER', to: 'AGREEMENT', label: 'owns', cardinality: '1:N' },
    { from: 'CUSTOMER', to: 'SHIPMENT', label: 'ordered', cardinality: '1:N' },
    { from: 'CUSTOMER', to: 'ROUTE', label: 'uses_route', cardinality: 'N:M' },
    { from: 'CUSTOMER', to: 'EMPLOYEE', label: 'served_by', cardinality: 'N:M' },
    { from: 'CUSTOMER', to: 'CONTACT', label: 'has_contact', cardinality: '1:N' },
    { from: 'AGREEMENT', to: 'ROUTE', label: 'covers', cardinality: '1:N' },
    { from: 'AGREEMENT', to: 'INVOICE', label: 'governs', cardinality: '1:N' },
    { from: 'SHIPMENT', to: 'VEHICLE', label: 'carried_by', cardinality: 'N:1' },
    { from: 'SHIPMENT', to: 'DRIVER', label: 'operated_by', cardinality: 'N:1' },
    { from: 'SHIPMENT', to: 'ROUTE', label: 'traverses', cardinality: 'N:1' },
    { from: 'SHIPMENT', to: 'WAREHOUSE', label: 'origin_hub', cardinality: 'N:1' },
    { from: 'SHIPMENT', to: 'WAREHOUSE', label: 'dest_hub', cardinality: 'N:1' },
    { from: 'SHIPMENT', to: 'INVOICE', label: 'billed_in', cardinality: 'N:1' },
    { from: 'VEHICLE', to: 'DRIVER', label: 'driven_by', cardinality: 'N:1' },
    { from: 'VEHICLE', to: 'WAREHOUSE', label: 'assigned_to', cardinality: 'N:1' },
    { from: 'VEHICLE', to: 'TOLL_CROSSING', label: 'passes_toll', cardinality: 'N:M' },
    { from: 'VEHICLE', to: 'FUEL_TRANSACTION', label: 'refuels_at', cardinality: 'N:M' },
    { from: 'VEHICLE', to: 'SENSOR_FEED', label: 'has_sensor', cardinality: '1:N' },
    { from: 'VEHICLE', to: 'TRAILER', label: 'has_trailer', cardinality: '1:1' },
    { from: 'ROUTE', to: 'TOLL_CROSSING', label: 'includes', cardinality: '1:N' },
    { from: 'ROUTE', to: 'FUEL_TRANSACTION', label: 'includes', cardinality: '1:N' },
    { from: 'ROUTE', to: 'WAREHOUSE', label: 'connects', cardinality: 'N:M' },
    { from: 'WAREHOUSE', to: 'DOCK', label: 'has_dock', cardinality: '1:N' },
    { from: 'WAREHOUSE', to: 'FORKLIFT', label: 'has_forklift', cardinality: '1:N' },
    { from: 'PARTNER_CARRIER', to: 'ROUTE', label: 'operates_lane', cardinality: 'N:M' },
    { from: 'PARTNER_CARRIER', to: 'CUSTOMER', label: 'serves', cardinality: 'N:M' },
    { from: 'AI_AGENT', to: 'CUSTOMER', label: 'monitors', cardinality: 'N:M' },
    { from: 'AI_AGENT', to: 'ROUTE', label: 'optimizes', cardinality: 'N:M' },
    { from: 'AI_AGENT', to: 'INVOICE', label: 'audits', cardinality: 'N:M' },
    { from: 'AI_AGENT', to: 'VEHICLE', label: 'manages', cardinality: 'N:M' },
    { from: 'AI_AGENT', to: 'DRIVER', label: 'supervises', cardinality: 'N:M' },
    { from: 'STRATEGIC_OBJECTIVE', to: 'STRATEGIC_DECISION', label: 'measured_by', cardinality: '1:N' },
    { from: 'EXPERIMENT', to: 'POLICY_VERSION', label: 'tests', cardinality: 'N:1' },
    { from: 'EMPLOYEE', to: 'CUSTOMER', label: 'manages', cardinality: 'N:M' },
    { from: 'EMPLOYEE', to: 'EMPLOYEE', label: 'reports_to', cardinality: 'N:1' }
  ]
};

// --- LAYER 5: CALCULATION ENGINES (RUNNABLE JAVASCRIPT CODES) ---
export const CALCULATION_ENGINES = {
  // M1: Customer Health
  calculateHealthScore: (customer) => {
    const commercial = customer.acv > 10000000 ? 95 : 80;
    const operational = customer.slaCompliance || 94.2;
    const financial = Math.max(20, 100 - (customer.paymentDelayDays || 5) * 3);
    const relationship = customer.supportSentiment === 'Positive' ? 95 : customer.supportSentiment === 'Negative' ? 50 : 75;
    const strategic = customer.tier === 'Strategic' ? 98 : 80;
    
    const overall = (commercial * 0.2 + operational * 0.3 + financial * 0.2 + relationship * 0.15 + strategic * 0.15);
    return Math.min(100, Math.max(0, Math.round(overall * 10) / 10));
  },
  
  // M1: Churn Prediction
  predictChurn: (customer) => {
    const dropScore = Math.max(0, customer.bookingsDropPct || 0) * 2.5;
    const delayScore = Math.max(0, (customer.paymentDelayDays || 0) - 10) * 1.5;
    const disputeScore = (customer.activeDisputes || 0) * 15;
    const sentimentPenalty = customer.supportSentiment === 'Negative' ? 30 : customer.supportSentiment === 'Neutral' ? 10 : 0;
    const competitorFactor = customer.competitorActivity && customer.competitorActivity !== 'None detected' ? 20 : 0;
    
    const prob = dropScore + delayScore + disputeScore + sentimentPenalty + competitorFactor;
    return Math.min(100, Math.max(0, Math.round(prob)));
  },

  // M1/M2: LTV Projection
  calculateLTV: (customer) => {
    const acv = customer.acv || 5000000;
    const churnProb = Math.max(0.01, (customer.churnProbability || 5) / 100);
    const expansion = 1 + (customer.expansionProbability || 10) / 100;
    const lifespans = 1 / churnProb;
    const ltv = acv * lifespans * expansion;
    return Math.round(ltv);
  },

  // M2: AI Pricing Engine
  calculatePricingTiers: (baseCost, multiplier = 1, demandDensity = 1.0, fuelIndex = 1.0) => {
    const adjustedCost = baseCost * multiplier * fuelIndex;
    const bestMargin = adjustedCost * 1.35 * (1 + (demandDensity - 1) * 0.5); // Peak tariff
    const bestPrice = adjustedCost * 1.18 * (1 + (demandDensity - 1) * 0.2);  // High win rate
    const negotiationRange = adjustedCost * 1.08;                           // Floor cost
    
    return {
      bestMargin: Math.round(bestMargin),
      bestPrice: Math.round(bestPrice),
      floorPrice: Math.round(negotiationRange)
    };
  },

  // M3: Readiness Score
  calculateReadinessScore: (lanes) => {
    const sum = Object.values(lanes).reduce((acc, curr) => acc + (curr.score || 0), 0);
    return Math.min(100, Math.round(sum / Object.keys(lanes).length));
  },

  // M4: Commercial Agreement Risk Index
  calculateAgreementRiskIndex: (agreement) => {
    const cashflowExposure = agreement.exposureLimit > 50000000 ? 40 : 15;
    const fuelPriceVolatilitySensitivity = agreement.fuelClausesLocked ? 5 : 35;
    const laneMarginStability = agreement.laneGuaranteeHours > 72 ? 30 : 10;
    
    return cashflowExposure + fuelPriceVolatilitySensitivity + laneMarginStability;
  },

  // M5: Freight Rating Engine
  rateFreight: (distance, weight, baseRatePerTonKm, accessorials = 0, fuelSurcharge = 0) => {
    const baseAmount = distance * weight * baseRatePerTonKm;
    const withSurcharge = baseAmount * (1 + fuelSurcharge / 100);
    const finalAmount = withSurcharge + accessorials;
    return Math.round(finalAmount);
  },

  // M5: SLA Penalties
  calculateSlaPenalty: (transitTimeHours, targetHours, invoiceAmount, penaltyPctPerHour = 0.5, capPct = 10.0) => {
    if (transitTimeHours <= targetHours) return 0;
    const delay = transitTimeHours - targetHours;
    const rawPenaltyPct = delay * penaltyPctPerHour;
    const finalPenaltyPct = Math.min(capPct, rawPenaltyPct);
    return Math.round((invoiceAmount * finalPenaltyPct) / 100);
  },

  // M5: Billing Fraud Engine
  calculateFraudScore: (data) => {
    let score = 0;
    if (data.duplicateInvoiceFlag) score += 50;
    if (data.gpsTimestampMismatch) score += 30;
    if (data.excessiveTollClaims) score += 15;
    if (data.driverOverrideAttempts > 2) score += 20;
    return Math.min(100, score);
  },

  // M7: Mechanical Remaining Useful Life (RUL)
  calculateRUL: (mileage, healthScore, componentBaseLife = 100000) => {
    const currentLife = componentBaseLife * (healthScore / 100);
    const remLife = Math.max(0, currentLife - (mileage % componentBaseLife));
    return Math.round(remLife);
  },

  // M8: Multi-Objective Routing Optimization (OTD vs Cost vs Carbon)
  solveRoutingObjectives: (options) => {
    // options: array of route proposals with cost, otd_probability, carbon_emissions
    return options.map(opt => {
      // weights: OTD = 0.4, Cost = 0.4, Carbon = 0.2
      const costScore = Math.max(0, 100 - (opt.cost / 20000));
      const carbonScore = Math.max(0, 100 - (opt.carbon / 500));
      const score = (opt.otd * 0.4) + (costScore * 0.4) + (carbonScore * 0.2);
      return { ...opt, finalRankScore: Math.round(score * 10) / 10 };
    }).sort((a, b) => b.finalRankScore - a.finalRankScore);
  },

  // M9: Driver Safety Score
  calculateDriverSafetyScore: (violations) => {
    const harshBrakingPenalty = (violations.harshBraking || 0) * 3;
    const overSpeedingPenalty = (violations.overSpeeding || 0) * 5;
    const tailgatingPenalty = (violations.tailgating || 0) * 4;
    const hosViolationPenalty = (violations.hos || 0) * 15;
    
    return Math.max(0, 100 - harshBrakingPenalty - overSpeedingPenalty - tailgatingPenalty - hosViolationPenalty);
  },

  // M9: Driver Fatigue Index
  calculateFatigueIndex: (hoursOnDuty, restBreaksCount, sleepQualityIndex = 80) => {
    let baseFatigue = hoursOnDuty * 4.5;
    let recovery = restBreaksCount * 12;
    let sleepEffect = (100 - sleepQualityIndex) * 0.15;
    
    const fatigue = baseFatigue - recovery + sleepEffect;
    return Math.min(100, Math.max(0, Math.round(fatigue)));
  },

  // M10: Yard Congestion Prediction
  calculateYardCongestion: (inboundCount, activeDocksCount, avgTurnaroundMinutes = 45) => {
    const totalProcessingCapacityPerHour = (activeDocksCount * 60) / avgTurnaroundMinutes;
    if (totalProcessingCapacityPerHour === 0) return 100;
    const congestionRatio = inboundCount / totalProcessingCapacityPerHour;
    return Math.min(100, Math.round(congestionRatio * 50));
  },

  // M12: Contribution Margin
  calculateContributionMargin: (revenue, costs) => {
    const directCosts = (costs.fuel || 0) + (costs.toll || 0) + (costs.driver || 0) + (costs.maintenance || 0) + (costs.insurance || 0) + (costs.depreciation || 0);
    const contributionMargin = revenue - directCosts;
    const contributionMarginPct = revenue > 0 ? (contributionMargin / revenue) * 100 : 0;
    return {
      marginAmount: Math.round(contributionMargin),
      marginPct: Math.round(contributionMarginPct * 10) / 10
    };
  },

  // M12: Accounts Receivable Delinquency Predictor
  predictARDelinquency: (arRecord, customerHealth) => {
    const ageFactor = arRecord.agingDays * 1.2;
    const valueFactor = arRecord.amount > 5000000 ? 10 : 0;
    const healthPenalty = (100 - customerHealth) * 0.4;
    const prob = ageFactor + valueFactor + healthPenalty;
    return Math.min(100, Math.round(prob));
  }
};

// --- LAYER 6: POLICY REGISTRY (BUSINESS RULE GUARDRAILS) ---
export const POLICY_REGISTRY = [
  {
    id: 'POL-001',
    domain: 'Credit Limit Exposure',
    module: 'M1/M12',
    rules: {
      Strategic: 50000000,
      Expanding: 20000000,
      Active: 10000000,
      Prospect: 1000000
    },
    version: '1.2'
  },
  {
    id: 'POL-002',
    domain: 'Pricing Approval Gates',
    module: 'M2',
    rules: {
      discountThresholds: [
        { maxDiscountPct: 5, approvalRole: 'Manager' },
        { maxDiscountPct: 15, approvalRole: 'VP' },
        { maxDiscountPct: 100, approvalRole: 'CEO' }
      ]
    },
    version: '2.0'
  },
  {
    id: 'POL-003',
    domain: 'Driver HOS Limits',
    module: 'M9',
    rules: {
      maxDrivingHoursDaily: 10,
      mandatoryRestBreakMinutes: 30,
      restBreakThresholdHours: 4,
      weeklyRestPeriodHours: 34
    },
    version: '1.0'
  },
  {
    id: 'POL-004',
    domain: 'Driver Fatigue Swaps',
    module: 'M9',
    rules: {
      warningFatigueIndex: 40,
      criticalFatigueIndex: 70,
      mandatoryRestFatigueIndex: 85
    },
    version: '1.1'
  },
  {
    id: 'POL-005',
    domain: 'AI Agent Governance Uptime',
    module: 'M16',
    rules: {
      minimumConfidenceFloor: 70,
      escalationRoles: {
        finance: 'CFO_Advisor',
        operations: 'COO_Advisor',
        hr: 'CHRO_Advisor',
        security: 'CISO_Advisor'
      }
    },
    version: '1.4'
  }
];

// --- LAYER 7: KPI REGISTRY (49 CRITICAL METRICS) ---
export const KPI_REGISTRY = {
  M1_CIC: [
    { name: 'Customer Health Score', unit: '0-100', target: 80, current: 82.4 },
    { name: 'Customer Churn Rate', unit: '%', target: 5.0, current: 3.2 },
    { name: 'Annual Contract Value (ACV)', unit: '₹', target: 2500000000, current: 2480000000 }
  ],
  M2_ARIE: [
    { name: 'Pipeline Value', unit: '₹', target: 200000000, current: 156000000 },
    { name: 'Sales Opportunity Win Rate', unit: '%', target: 25, current: 22.4 },
    { name: 'Average Deal Cycle Time', unit: 'Days', target: 45, current: 48.2 }
  ],
  M3_ACMS: [
    { name: 'Average Customer Mobilization Time', unit: 'Days', target: 14, current: 15.6 },
    { name: 'Mobilization Readiness Score', unit: '0-100', target: 85, current: 87.2 }
  ],
  M4_ACAIS: [
    { name: 'Commercial Agreement Risk Index', unit: '0-100', target: 30, current: 24.6 },
    { name: 'Contract Renewal Rate', unit: '%', target: 85, current: 89.2 }
  ],
  M5_RABIP: [
    { name: 'Revenue Leakage Ratio', unit: '%', target: 0.5, current: 0.35 },
    { name: 'Billing Invoice Accuracy', unit: '%', target: 99.0, current: 99.2 },
    { name: 'Days Sales Outstanding (DSO)', unit: 'Days', target: 30, current: 32.1 },
    { name: 'Fraud Detection Rate', unit: '%', target: 95.0, current: 98.4 }
  ],
  M6_ACOIP: [
    { name: 'Proactive Operational Issue Detection Rate', unit: '%', target: 80.0, current: 84.5 },
    { name: 'Mean Time to Incident Resolution (MTTR)', unit: 'Hours', target: 4.0, current: 3.8 }
  ],
  M7_IFAOS: [
    { name: 'Active Fleet Utilization', unit: '%', target: 87.0, current: 87.4 },
    { name: 'Breakdown Rate per 1000km', unit: 'count', target: 0.5, current: 0.38 },
    { name: 'Predictive Maintenance Precision', unit: '%', target: 90.0, current: 92.1 }
  ],
  M8_ATPDS: [
    { name: 'On-Time Delivery (OTD) SLA', unit: '%', target: 94.0, current: 94.2 },
    { name: 'Empty Kilometer Ratio', unit: '%', target: 12.0, current: 10.8 },
    { name: 'Global Operational Certainty Index (OCI)', unit: '0-100', target: 90, current: 93.4 }
  ],
  M9_DWIP: [
    { name: 'Driver Safety Score Average', unit: '0-100', target: 90, current: 91.2 },
    { name: 'Driver HOS Compliance Rate', unit: '%', target: 98.0, current: 99.1 },
    { name: 'Annual Driver Retention Rate', unit: '%', target: 85, current: 88.4 }
  ],
  M10_LIIS: [
    { name: 'Depot Warehouse Throughput', unit: 'Tons/day', target: 50000, current: 52400 },
    { name: 'Dock Turnaround Time Average', unit: 'Minutes', target: 45, current: 42.1 },
    { name: 'Yard Congestion Index', unit: '0-100', target: 30, current: 22.4 }
  ],
  M11_ASNIP: [
    { name: 'Supply Network Carrier Reliability', unit: '%', target: 95.0, current: 96.2 },
    { name: 'Multimodal Transport Segment Share', unit: '%', target: 20.0, current: 24.6 },
    { name: 'Carbon footprint per Ton-km', unit: 'gCO2', target: 12.0, current: 11.4 }
  ],
  M12_AFITP: [
    { name: 'EBITDA Gross Margin', unit: '%', target: 20.0, current: 24.6 },
    { name: 'Cash Conversion Cycle (CCC)', unit: 'Days', target: 45, current: 41.2 },
    { name: 'Working Capital Ratio', unit: 'ratio', target: 1.5, current: 1.62 }
  ],
  M13_ETRSGP: [
    { name: 'Threat Identification Time', unit: 'Seconds', target: 60, current: 45 },
    { name: 'Access Controller Compliance Rate', unit: '%', target: 99.5, current: 99.8 },
    { name: 'GST data lineage mapping rate', unit: '%', target: 95.0, current: 98.2 }
  ],
  M14_EDIS: [
    { name: 'Corporate Enterprise Value Index', unit: '0-100', target: 80, current: 84.6 },
    { name: 'Strategic Decision Accuracy Rate', unit: '%', target: 75.0, current: 78.4 }
  ],
  M15_EKG_CDTP: [
    { name: 'Knowledge Graph Semantic Entity Coverage', unit: '%', target: 98.0, current: 98.8 },
    { name: 'Semantic Context Retrieval Accuracy', unit: '%', target: 90.0, current: 93.2 }
  ],
  M16_EAIAOS: [
    { name: 'Agent Task Success Rate', unit: '%', target: 95.0, current: 96.8 },
    { name: 'Human Action Override Rate', unit: '%', target: 10.0, current: 4.2 },
    { name: 'Autonomous Operations Index', unit: 'L0-L5', target: 3.5, current: 3.8 }
  ],
  M17_EALEE: [
    { name: 'Experiment Promotion Rate', unit: '%', target: 30.0, current: 33.3 },
    { name: 'Continuous Process Efficiency Gain', unit: '%', target: 5.0, current: 6.8 },
    { name: 'Model Evolution Rate', unit: 'count/mo', target: 10, current: 12 }
  ],
  M18_ERSASE: [
    { name: 'Decision Simulation Accuracy', unit: '%', target: 85, current: 88.5 },
    { name: 'Debated Strategy Consensus level', unit: '%', target: 75, current: 81.2 },
    { name: 'Scenario Simulation Coverage', unit: 'count', target: 10000, current: 12450 }
  ]
};

// --- LAYER 8: AI AGENT REGISTRY (20 specialized agents) ---
export const AI_AGENT_REGISTRY = [
  { id: 'agt-cic', name: 'Customer Intelligence Agent', department: 'Sales', autonomyLevel: 'L2', primaryGoal: 'Grow LTV and predict churn risks' },
  { id: 'agt-arie', name: 'Revenue Optimization Agent', department: 'Sales', autonomyLevel: 'L3', primaryGoal: 'Dynamic margin protection bidding' },
  { id: 'agt-acms', name: 'Mobilization Coordinator Agent', department: 'Operations', autonomyLevel: 'L3', primaryGoal: 'Orchestrate 9 setup lanes concurrently' },
  { id: 'agt-acais', name: 'Agreement Compliance Agent', department: 'Legal', autonomyLevel: 'L1', primaryGoal: 'SLA penalty enforcement and renewals' },
  { id: 'agt-rabip', name: 'Revenue Assurance Agent', department: 'Finance', autonomyLevel: 'L3', primaryGoal: 'Auto-audit invoices and capture leaks' },
  { id: 'agt-acoip', name: 'Operations Sentinel Agent', department: 'Operations', autonomyLevel: 'L3', primaryGoal: 'Proactive reroutes and incident response' },
  { id: 'agt-ifaos', name: 'Fleet Asset Agent', department: 'Operations', autonomyLevel: 'L3', primaryGoal: 'Predict breakdown probability and RUL' },
  { id: 'agt-atpds', name: 'Dispatch Planner Agent', department: 'Operations', autonomyLevel: 'L4', primaryGoal: 'Multi-objective route solving' },
  { id: 'agt-dwip', name: 'Driver Welfare Agent', department: 'HR', autonomyLevel: 'L2', primaryGoal: 'Fatigue checking and roster filling' },
  { id: 'agt-liis', name: 'Warehouse Flow Agent', department: 'Operations', autonomyLevel: 'L3', primaryGoal: 'Dock allocator and congestion controller' },
  { id: 'agt-asnip', name: 'Network Coordinator Agent', department: 'Operations', autonomyLevel: 'L3', primaryGoal: 'Multi-modal segment optimization' },
  { id: 'agt-afitp', name: 'Treasury Controller Agent', department: 'Finance', autonomyLevel: 'L3', primaryGoal: 'Rebalance liquidity and working capital' },
  { id: 'agt-etrsgp', name: 'Security Fortress Agent', department: 'Security', autonomyLevel: 'L3', primaryGoal: 'Zero-trust auth and threat container' },
  { id: 'agt-edis', name: 'Executive Advisor Agent', department: 'Executive', autonomyLevel: 'L2', primaryGoal: 'Macro KPI forecasting and M&A briefs' },
  { id: 'agt-ekg', name: 'Cognitive Memory Agent', department: 'IT', autonomyLevel: 'L5', primaryGoal: 'Build semantic context graphs' },
  { id: 'agt-ealee', name: 'Autonomous Learner Agent', department: 'IT', autonomyLevel: 'L4', primaryGoal: 'Auto-retrain models and evolve policies' },
  { id: 'agt-ersase', name: 'Reality Simulator Agent', department: 'IT', autonomyLevel: 'L5', primaryGoal: 'Continuous future scenario modeling' },
  { id: 'agt-custsuccess', name: 'Success Advisor Agent', department: 'Customer Success', autonomyLevel: 'L2', primaryGoal: 'Enhance customer retention and NPS' },
  { id: 'agt-procurement', name: 'Procurement Sourcing Agent', department: 'Finance', autonomyLevel: 'L2', primaryGoal: 'Rebalance inventory and PO pricing' },
  { id: 'agt-sustainability', name: 'Carbon Tracker Agent', department: 'Operations', autonomyLevel: 'L2', primaryGoal: 'Track emissions and solve eco routes' }
];

// --- LAYER 9: CROSS-MODULE RELATIONSHIP MATRIX (18x18) ---
// Represented as a look-up registry of connection types
export const DEP_MATRIX = {
  getConnection: (fromModule, toModule) => {
    const connections = {
      'M1_M2': 'Customer contract boundaries propagate to Opportunities',
      'M1_M3': 'Onboarding triggers Mobilization Lanes',
      'M1_M5': 'Invoice records recompute Customer financial twin',
      'M1_M6': 'Operational incident history recalculates Customer riskScore',
      'M2_M3': 'Closed Won Deal spawns post-sale Mobilization Plan',
      'M2_M4': 'Opportunity requirements compile into Agreement',
      'M3_M7': 'Mobilization Fleet Setup qualifies reserved trailers',
      'M4_M5': 'Compiled Clauses feed Dynamic Rating & Penalties',
      'M5_M12': 'Invoices update General Ledger and AR Twin',
      'M6_M7': 'Breakdowns alert Maintenance Hub for yard slot booking',
      'M6_M8': 'Operational delays trigger re-optimization engine',
      'M7_M8': 'Vehicle health score dictates dispatch weight limits',
      'M8_M9': 'Dispatch schedules driver shifts and checks fatigue',
      'M9_M12': 'Driver hours feed payroll bonuses and penalties',
      'M10_M11': 'Depot bottlenecks update supply network corridors',
      'M12_M14': 'Treasury rebalances feed Strategic cashflow forecasts',
      'M13_M16': 'Threat alerts quarantine rogue AI agent tokens',
      'M15_M16': 'KG context sub-graphs ground Agent reasoning',
      'M16_M17': 'Debate consensus updates global policy rules',
      'M17_M18': 'Evolved policy parameters calibrates Reality Simulator'
    };
    const key = `${fromModule}_${toModule}`;
    return connections[key] || 'Indirect neural link (graph traversal routing)';
  }
};

// --- LAYER 10: CLOSED COGNITIVE INTELLIGENCE LOOPS ---
export const CLOSED_LOOPS = {
  LOOP_A_OPERATIONAL: {
    name: 'Real-Time Operational Security Loop',
    path: ['Telemetry Sync', 'Vehicle Health Update', 'Fatigue Monitoring', 'Incident Resolution', 'Dispatch Re-optimization'],
    modules: ['M7', 'M9', 'M6', 'M8'],
    trigger: (vehicleId, realityState) => {
      const vehicle = realityState.entities.truck;
      if (vehicle && vehicle.state === 'broken_down') {
        return {
          status: 'Active',
          action: 'Dispatched spare parts trailer from Panvel Hub, reallocated driver route, sent live SMS notifications to Customer Success portal.'
        };
      }
      return { status: 'Nominal', action: 'Monitoring telematics.' };
    }
  },
  LOOP_B_COMMERCIAL: {
    name: 'Dynamic Customer Churn Protection Loop',
    path: ['SLA Violation Event', 'Customer Health Update', 'Churn Risk Recalculation', 'Concession Recommendation', 'Agreement Amendment'],
    modules: ['M1', 'M2', 'M4', 'M5', 'M12'],
    trigger: (customerId, realityState) => {
      const customer = realityState.entities.customer;
      if (customer && customer.riskScore > 30) {
        return {
          status: 'Intervening',
          action: 'Created temporary 8% corridor rebate, updated opportunity pipeline, dispatched sales alert to CFO.'
        };
      }
      return { status: 'Nominal', action: 'Monitoring health scores.' };
    }
  },
  LOOP_C_STRATEGIC: {
    name: 'Strategic Strategic Decision Loop',
    path: ['KPI Trigger', 'Multi-Agent Strategic Debate', 'Scenario Simulation', 'Strategic Decision Output', 'Action Rollout'],
    modules: ['M14', 'M16', 'M18', 'M17'],
    trigger: (kpiTrigger, realityState) => {
      if (realityState.simulationState.dieselIncrease > 15) {
        return {
          status: 'Executing Debate',
          action: 'Finance, Operations, and Supply Chain agents agree to move 22% of Western Corridor shipments to container rail DFC.'
        };
      }
      return { status: 'Nominal', action: 'Awaiting macro-shocks.' };
    }
  },
  LOOP_D_EVOLUTION: {
    name: 'Continuous Evolution Loop',
    path: ['Universal Event Logging', 'Causal Analysis', 'A/B Experiment Desk', 'Policy Upgrade', 'Knowledge Graph Update'],
    modules: ['M17', 'M15', 'M16', 'M13'],
    trigger: (experimentId, realityState) => {
      const exp = realityState.evolutionMatrix.experiments[0];
      if (exp && exp.status.includes('Running')) {
        return {
          status: 'Evolving',
          action: 'Validating invoice auto-verify speed. Promoted policy rule POL-007 (Auto-Reconcile Tolls) to production, improving cash cycle by 2.8 days.'
        };
      }
      return { status: 'Nominal', action: 'Awaiting experiment outcomes.' };
    }
  }
};

// --- CORE NEURAL STATE WRAPPER CLASS ---
export class UnifiedNeuralNetworkEngine {
  constructor(initialRealityState) {
    this.state = initialRealityState || {};
    this.eventsCount = 0;
    this.auditLedger = [];
  }

  // L1 Event Dispatcher with Policy Enforcement & KG Updates
  dispatchEvent(eventType, payload, operatorId = 'AI-SYSTEM') {
    this.eventsCount++;
    const eventId = `ev-${Date.now()}-${this.eventsCount}`;
    
    // 1. Compile L1 event
    const eventRecord = {
      id: eventId,
      timestamp: new Date().toISOString(),
      type: eventType,
      desc: payload.desc || `Unified event ${eventType} dispatched.`,
      source: payload.source || 'NEURAL_ORCHESTRATOR'
    };

    // 2. Add to local cache
    if (this.state.events) {
      this.state.events = [eventRecord, ...this.state.events.slice(0, 49)];
    }

    // 3. Enforce policy check (if applicable)
    const policyViolations = [];
    if (eventType === 'TELEMETRY_SYNC' && payload.fatigueIndex > 40) {
      policyViolations.push({
        policyId: 'POL-004',
        status: 'Warning',
        details: 'Driver fatigue index exceeded warning threshold'
      });
    }

    // 4. Record Audit Entry
    const auditRecord = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actorType: operatorId.startsWith('DRV') || operatorId.startsWith('EMP') ? 'human' : 'ai_agent',
      actorId: operatorId,
      action: eventType,
      entityType: payload.entityType || 'SYSTEM',
      entityId: payload.entityId || 'SYS-000',
      previousState: payload.previousState || {},
      newState: payload.newState || {},
      reason: payload.desc || '',
      expectedOutcome: payload.expectedOutcome || 'System stability nominal',
      actualOutcome: 'Executed successfully',
      moduleOrigin: payload.module || 'M15',
      policyChecks: policyViolations,
      reversible: payload.reversible || false,
      rollbackRef: null
    };

    this.auditLedger.unshift(auditRecord);

    // 5. Run downstream calculations & propagate state
    this.propagateClosedLoops(eventType, payload);

    return {
      event: eventRecord,
      audit: auditRecord,
      policyWarnings: policyViolations
    };
  }

  // Closed Loop Cascade triggers
  propagateClosedLoops(eventType, payload) {
    if (!this.state) return;

    // Loop A: Operational
    if (eventType === 'TruckBrokenDown') {
      const result = CLOSED_LOOPS.LOOP_A_OPERATIONAL.trigger('trk-90482', this.state);
      this.state.executionAgentStatus = {
        state: 'busy_reallocation',
        lastExecutedAction: result.action,
        webhookStatus: 'Secure ZKP Handshake complete',
        autoDispatches: [
          'Rerouted Delhi -> Mumbai cargo via rail',
          'Notified customer Tata Motors Logistics of alternate ETA (+4h)',
          result.action
        ]
      };
    }

    // Loop B: Commercial
    if (eventType === 'CUSTOMER_STATE_CHANGED' || (this.state.entities && this.state.entities.customer && this.state.entities.customer.riskScore > 30)) {
      const result = CLOSED_LOOPS.LOOP_B_COMMERCIAL.trigger('cust-102', this.state);
      this.state.predictions.churn = {
        probability: '98%',
        reason: 'Customer Health Score degraded',
        impact: result.action
      };
    }

    // Loop C: Strategic
    if (eventType === 'SimulationParameterChanged') {
      const result = CLOSED_LOOPS.LOOP_C_STRATEGIC.trigger('diesel', this.state);
      if (this.state.simulationState.dieselIncrease > 15) {
        this.state.decisionPackage = {
          target: 'Western Corridor Surcharges',
          optionsScanned: 10000,
          selectedPlan: 'Move 22% capacity to DFC Rail Segment',
          reasoning: result.action,
          alternatives: ['Apply 5% flat invoice fuel surcharge', 'Idle 10% fleet to save mileage cost']
        };
      }
    }
  }

  // Helper to fetch complete audit log
  getAuditLog() {
    return this.auditLedger;
  }
}
