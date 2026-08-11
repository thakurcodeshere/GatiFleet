// ============================================================
// GatiFleet — Customer Intelligence Data Layer
// Enterprise Customer Registry + Mock Data Generator
// ============================================================

const secureRandom = () => {
  const array = new Uint32Array(1);
  const cryptoObj = (typeof window !== 'undefined' && window.crypto) || (typeof globalThis !== 'undefined' && globalThis.crypto);
  if (cryptoObj && cryptoObj.getRandomValues) {
    cryptoObj.getRandomValues(array);
    return array[0] / 4294967296;
  }
  let seed = Date.now();
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
};
const rand = (min, max) => Math.floor(secureRandom() * (max - min + 1)) + min;
const randFloat = (min, max) => +(secureRandom() * (max - min) + min).toFixed(1);

// ---- CUSTOMER LIFECYCLE STATES ----
export const LIFECYCLE_STATES = [
  { id: 'Prospect', color: '#6b7280', next: 'Qualified' },
  { id: 'Qualified', color: '#3b82f6', next: 'Opportunity' },
  { id: 'Opportunity', color: '#8b5cf6', next: 'Negotiation' },
  { id: 'Negotiation', color: '#f59e0b', next: 'Contracted' },
  { id: 'Contracted', color: '#06b6d4', next: 'Active' },
  { id: 'Active', color: '#10b981', next: 'Expanding' },
  { id: 'Expanding', color: '#22c55e', next: 'Strategic' },
  { id: 'Strategic', color: '#a855f7', next: null },
  { id: 'At Risk', color: '#ef4444', next: 'Recovering' },
  { id: 'Recovering', color: '#f97316', next: 'Active' },
  { id: 'Dormant', color: '#9ca3af', next: null },
  { id: 'Lost', color: '#374151', next: null },
];

// ---- NAMED ENTERPRISE CUSTOMERS ----
export const NAMED_CUSTOMERS = [
  {
    id: 'CUS-001',
    name: 'Tata Motors Logistics',
    shortName: 'Tata Motors',
    gstin: '27AAACT2727Q1ZW',
    industry: 'Automotive',
    legalForm: 'Public Limited',
    region: 'Pan-India',
    hq: 'Mumbai, Maharashtra',
    accountAge: '4.2 years',
    lifecycleState: 'Strategic',
    accountManager: 'Priya Sharma',
    executiveSponsor: 'Arjun Kapoor (CEO)',
    contacts: [
      { name: 'Arjun Kapoor', role: 'CEO', email: 'arjun.kapoor@tatamotors.com', influence: 95, champion: true, sentiment: 'Positive' },
      { name: 'Ritu Mehta', role: 'Supply Chain Head', email: 'ritu.mehta@tatamotors.com', influence: 88, champion: true, sentiment: 'Positive' },
      { name: 'Deepak Sharma', role: 'Procurement Manager', email: 'deepak.sharma@tatamotors.com', influence: 72, champion: false, sentiment: 'Neutral' },
      { name: 'Anjali Verma', role: 'Finance Controller', email: 'anjali.verma@tatamotors.com', influence: 65, champion: false, sentiment: 'Positive' },
    ],
    health: { commercial: 88, operational: 92, financial: 85, relationship: 91, strategic: 94, overall: 90 },
    kpis: {
      acrRevenue: '₹9.8 Cr/yr', ltv: '₹48.4 Cr', shipmentsMonth: 312, otdRate: 97.2,
      slaCompliance: 98.1, outstandingInvoices: '₹42.8 L', creditLine: '₹5 Cr', creditUsed: 34,
      avgPaymentDays: 18, churnRisk: 8, renewalLikelihood: 94, nps: 72,
    },
    contracts: [{ id: 'CTR-001', lanes: 'Delhi ↔ Pune, Mumbai ↔ Chennai', value: '₹9.8 Cr/yr', sla: '98% OTD, 24h resolution', start: '2024-04-01', end: '2026-03-31', status: 'Active', riskIndex: 12 }],
    opportunities: [{ id: 'OPP-001', name: 'Q3 DFC Rail Expansion', stage: 'Negotiation', value: '₹4.2 Cr', probability: 72, closingDate: '2026-09-15' }],
    recentShipments: [
      { id: 'SHP-T-001', route: 'Delhi → Pune', status: 'in_transit', eta: '14h', value: '₹36.0 L', slaRisk: 'Low' },
      { id: 'SHP-T-002', route: 'Mumbai → Chennai', status: 'delivered', eta: 'Done', value: '₹28.4 L', slaRisk: 'None' },
      { id: 'SHP-T-003', route: 'Bangalore → Delhi', status: 'delayed', eta: '+6h', value: '₹19.2 L', slaRisk: 'High' },
    ],
    billing: { invoicesThisMonth: 48, totalBilled: '₹82.4 L', paid: '₹62.0 L', pending: '₹14.8 L', overdue: '₹5.6 L', disputes: 1 },
    supportTickets: [{ id: 'TKT-001', type: 'SLA Breach', priority: 'Urgent', desc: 'SHP-T-003 delay compensation claim', slaTimer: '2h 14m', assignedAgent: 'Operations Agent', status: 'Open' }],
    digitalTwin: {
      commercial: { pipelineValue: '₹4.2 Cr', grossMargin: '24.6%', ltv: '₹48.4 Cr', expansionPotential: 'High (+30%)' },
      operational: { shipmentsPerMonth: 312, otdRate: '97.2%', fleetUtilization: '89%', slaIndex: '98.1%' },
      financial: { outstandingAR: '₹42.8 L', creditLineUsed: '34%', avgPaymentDelay: '18 days', disputes: 1, writeOffs: '₹0' },
      relationship: { nps: 72, executiveMeetings: '2/quarter', supportSentiment: 'Positive', escalations: 0 },
      strategic: { growthVelocity: '+28%', expansionPlans: 'DFC Rail pilot', competitorRisk: 'Low', pilotCorridors: 2 },
      learning: { concessionHistory: 'Waived ₹42K demurrage (Aug 2025)', outcomeValidation: '94% forecast accuracy', preferredRoutes: 'Delhi-Mumbai NH48, DFC Rail', modelAccuracy: '96.2%' },
    },
    decisionJournal: [
      { date: '2025-08-01', actor: 'Priya Sharma', action: 'Waived demurrage ₹42,000', expected: 'Retain strategic status', actual: 'Customer renewed +1 year early', divergence: 'Positive', lesson: 'VIP demurrage waivers increase early renewal probability by 34%' },
      { date: '2025-06-15', actor: 'AI-AGENT', action: 'Recommended DFC Rail pilot on Pune corridor', expected: '22% cost reduction, 98% OTD', actual: '24.1% reduction, 97.8% OTD', divergence: '+2.1% cost beat', lesson: 'DFC Rail consistently outperforms road on 600km+ corridors' },
    ],
    predictions: { churnRisk: 8, churnFactors: ['None — account is strategic'], ltv12m: '₹9.8 Cr', nextBestAction: 'Propose DFC expansion on Hyderabad lane', dealHealthIndex: 94 },
  },
  {
    id: 'CUS-002',
    name: 'Reliance Retail Supply Chain',
    shortName: 'Reliance Retail',
    gstin: '27AAACR5055K1ZS',
    industry: 'Retail & FMCG',
    legalForm: 'Public Limited',
    region: 'Pan-India',
    hq: 'Navi Mumbai, Maharashtra',
    accountAge: '2.8 years',
    lifecycleState: 'Expanding',
    accountManager: 'Suresh Nair',
    executiveSponsor: 'Kavita Patel (COO)',
    contacts: [
      { name: 'Kavita Patel', role: 'COO', email: 'kavita.patel@relianceretail.com', influence: 92, champion: true, sentiment: 'Positive' },
      { name: 'Rahul Joshi', role: 'Supply Chain Director', email: 'rahul.joshi@relianceretail.com', influence: 85, champion: true, sentiment: 'Positive' },
      { name: 'Sneha Gupta', role: 'Procurement Lead', email: 'sneha.gupta@relianceretail.com', influence: 68, champion: false, sentiment: 'Neutral' },
    ],
    health: { commercial: 82, operational: 88, financial: 90, relationship: 78, strategic: 86, overall: 85 },
    kpis: {
      acrRevenue: '₹5.6 Cr/yr', ltv: '₹28.4 Cr', shipmentsMonth: 218, otdRate: 95.4,
      slaCompliance: 96.2, outstandingInvoices: '₹28.2 L', creditLine: '₹3 Cr', creditUsed: 52,
      avgPaymentDays: 22, churnRisk: 14, renewalLikelihood: 88, nps: 61,
    },
    contracts: [{ id: 'CTR-002', lanes: 'Mumbai ↔ Delhi, Bangalore ↔ Hyderabad', value: '₹5.6 Cr/yr', sla: '96% OTD, 36h resolution', start: '2024-07-01', end: '2026-06-30', status: 'Active', riskIndex: 24 }],
    opportunities: [{ id: 'OPP-002', name: 'North India Cold Chain Expansion', stage: 'Proposal', value: '₹2.8 Cr', probability: 58, closingDate: '2026-10-01' }],
    recentShipments: [
      { id: 'SHP-R-001', route: 'Mumbai → Delhi', status: 'in_transit', eta: '22h', value: '₹18.4 L', slaRisk: 'Low' },
      { id: 'SHP-R-002', route: 'Bangalore → Hyderabad', status: 'delivered', eta: 'Done', value: '₹12.6 L', slaRisk: 'None' },
    ],
    billing: { invoicesThisMonth: 32, totalBilled: '₹48.2 L', paid: '₹38.0 L', pending: '₹8.2 L', overdue: '₹2.0 L', disputes: 0 },
    supportTickets: [{ id: 'TKT-002', type: 'Documentation', priority: 'Medium', desc: 'Missing e-way bill for SHP-R-001', slaTimer: '18h 30m', assignedAgent: 'Compliance Agent', status: 'Open' }],
    digitalTwin: {
      commercial: { pipelineValue: '₹2.8 Cr', grossMargin: '22.1%', ltv: '₹28.4 Cr', expansionPotential: 'Medium (+18%)' },
      operational: { shipmentsPerMonth: 218, otdRate: '95.4%', fleetUtilization: '82%', slaIndex: '96.2%' },
      financial: { outstandingAR: '₹28.2 L', creditLineUsed: '52%', avgPaymentDelay: '22 days', disputes: 0, writeOffs: '₹0' },
      relationship: { nps: 61, executiveMeetings: '1/quarter', supportSentiment: 'Neutral', escalations: 1 },
      strategic: { growthVelocity: '+18%', expansionPlans: 'Cold chain North India', competitorRisk: 'Medium', pilotCorridors: 1 },
      learning: { concessionHistory: 'Volume rebate ₹28K (Mar 2025)', outcomeValidation: '88% forecast accuracy', preferredRoutes: 'Mumbai-Delhi NH48', modelAccuracy: '91.4%' },
    },
    decisionJournal: [{ date: '2025-07-10', actor: 'Suresh Nair', action: 'Volume rebate 2% applied', expected: 'Volume increase +15%', actual: 'Volume increased +22%', divergence: 'Positive +7%', lesson: 'Price sensitivity in retail sector is higher than modeled' }],
    predictions: { churnRisk: 14, churnFactors: ['Credit line 52% utilized', 'NPS decline Q2'], ltv12m: '₹5.6 Cr', nextBestAction: 'Schedule executive QBR to present cold chain proposal', dealHealthIndex: 78 },
  },
  {
    id: 'CUS-003',
    name: 'Amazon India Fulfillment',
    shortName: 'Amazon India',
    gstin: '29AACCI1681G1ZN',
    industry: 'E-Commerce',
    legalForm: 'Private Limited',
    region: 'Pan-India',
    hq: 'Bangalore, Karnataka',
    accountAge: '1.4 years',
    lifecycleState: 'Negotiation',
    accountManager: 'Aditya Menon',
    executiveSponsor: 'Sanjay Bose (VP Logistics)',
    contacts: [
      { name: 'Sanjay Bose', role: 'VP Logistics', email: 'sanjay.bose@amazon.in', influence: 90, champion: true, sentiment: 'Positive' },
      { name: 'Priya Nair', role: 'Procurement Manager', email: 'priya.nair@amazon.in', influence: 75, champion: false, sentiment: 'Neutral' },
    ],
    health: { commercial: 74, operational: 71, financial: 82, relationship: 68, strategic: 76, overall: 74 },
    kpis: {
      acrRevenue: '₹12.5 Cr/yr (projected)', ltv: '₹62.8 Cr', shipmentsMonth: 89, otdRate: 93.1,
      slaCompliance: 94.4, outstandingInvoices: '₹8.4 L', creditLine: '₹8 Cr', creditUsed: 18,
      avgPaymentDays: 30, churnRisk: 28, renewalLikelihood: 62, nps: 48,
    },
    contracts: [{ id: 'CTR-003', lanes: 'Bangalore ↔ Mumbai (pilot)', value: '₹1.2 Cr/pilot', sla: '95% OTD, 12h resolution', start: '2025-03-01', end: '2025-12-31', status: 'Pilot', riskIndex: 38 }],
    opportunities: [{ id: 'OPP-003', name: 'National Last-Mile Network', stage: 'Negotiation', value: '₹12.5 Cr', probability: 44, closingDate: '2026-08-30' }],
    recentShipments: [
      { id: 'SHP-A-001', route: 'Bangalore → Mumbai', status: 'in_transit', eta: '8h', value: '₹4.2 L', slaRisk: 'Medium' },
      { id: 'SHP-A-002', route: 'Delhi → Kolkata', status: 'scheduled', eta: 'Tomorrow', value: '₹6.8 L', slaRisk: 'Low' },
    ],
    billing: { invoicesThisMonth: 12, totalBilled: '₹10.4 L', paid: '₹8.2 L', pending: '₹2.2 L', overdue: '₹0', disputes: 0 },
    supportTickets: [],
    digitalTwin: {
      commercial: { pipelineValue: '₹12.5 Cr', grossMargin: '18.4%', ltv: '₹62.8 Cr', expansionPotential: 'Very High (+80%)' },
      operational: { shipmentsPerMonth: 89, otdRate: '93.1%', fleetUtilization: '74%', slaIndex: '94.4%' },
      financial: { outstandingAR: '₹8.4 L', creditLineUsed: '18%', avgPaymentDelay: '30 days', disputes: 0, writeOffs: '₹0' },
      relationship: { nps: 48, executiveMeetings: '1/month', supportSentiment: 'Neutral', escalations: 0 },
      strategic: { growthVelocity: '+65%', expansionPlans: 'National network', competitorRisk: 'High (Delhivery active)', pilotCorridors: 1 },
      learning: { concessionHistory: 'None', outcomeValidation: '72% forecast accuracy', preferredRoutes: 'Bangalore-Mumbai', modelAccuracy: '84.2%' },
    },
    decisionJournal: [{ date: '2025-06-01', actor: 'Aditya Menon', action: 'Proposed national network at ₹12.5Cr', expected: 'Deal close by Aug 2025', actual: 'Still in negotiation', divergence: 'Neutral — timeline slipped', lesson: 'Amazon procurement cycles average 9 months for >₹10Cr contracts' }],
    predictions: { churnRisk: 28, churnFactors: ['Competitor Delhivery active bid', 'NPS 48 below threshold', 'Deal timeline slipping'], ltv12m: '₹12.5 Cr (if won)', nextBestAction: 'Schedule C-suite alignment — bring CEO to close', dealHealthIndex: 54 },
  },
  {
    id: 'CUS-004',
    name: 'Maruti Suzuki India Ltd.',
    shortName: 'Maruti Suzuki',
    gstin: '06AAACM3025H1ZM',
    industry: 'Automotive',
    legalForm: 'Public Limited',
    region: 'North & West India',
    hq: 'Gurugram, Haryana',
    accountAge: '3.1 years',
    lifecycleState: 'Active',
    accountManager: 'Neha Khanna',
    executiveSponsor: 'Rajiv Sood (MD)',
    contacts: [
      { name: 'Rajiv Sood', role: 'MD', email: 'rajiv.sood@marutisuzuki.com', influence: 98, champion: true, sentiment: 'Positive' },
      { name: 'Manish Arora', role: 'Logistics Head', email: 'manish.arora@marutisuzuki.com', influence: 82, champion: true, sentiment: 'Positive' },
    ],
    health: { commercial: 86, operational: 90, financial: 88, relationship: 84, strategic: 80, overall: 86 },
    kpis: {
      acrRevenue: '₹9.8 Cr/yr', ltv: '₹44.2 Cr', shipmentsMonth: 284, otdRate: 96.8,
      slaCompliance: 97.4, outstandingInvoices: '₹38.6 L', creditLine: '₹4 Cr', creditUsed: 42,
      avgPaymentDays: 21, churnRisk: 10, renewalLikelihood: 91, nps: 68,
    },
    contracts: [{ id: 'CTR-004', lanes: 'Gurugram ↔ Bangalore, Delhi ↔ Pune', value: '₹9.8 Cr/yr', sla: '97% OTD, 24h resolution', start: '2024-01-01', end: '2026-12-31', status: 'Active', riskIndex: 16 }],
    opportunities: [{ id: 'OPP-004', name: 'EV Battery Logistics Corridor', stage: 'Qualified', value: '₹3.4 Cr', probability: 65, closingDate: '2026-12-01' }],
    recentShipments: [
      { id: 'SHP-M-001', route: 'Gurugram → Bangalore', status: 'in_transit', eta: '36h', value: '₹42.8 L', slaRisk: 'Low' },
      { id: 'SHP-M-002', route: 'Delhi → Pune', status: 'delivered', eta: 'Done', value: '₹22.4 L', slaRisk: 'None' },
    ],
    billing: { invoicesThisMonth: 42, totalBilled: '₹76.8 L', paid: '₹62.4 L', pending: '₹10.8 L', overdue: '₹3.6 L', disputes: 0 },
    supportTickets: [],
    digitalTwin: {
      commercial: { pipelineValue: '₹3.4 Cr', grossMargin: '23.8%', ltv: '₹44.2 Cr', expansionPotential: 'Medium (+25%)' },
      operational: { shipmentsPerMonth: 284, otdRate: '96.8%', fleetUtilization: '86%', slaIndex: '97.4%' },
      financial: { outstandingAR: '₹38.6 L', creditLineUsed: '42%', avgPaymentDelay: '21 days', disputes: 0, writeOffs: '₹0' },
      relationship: { nps: 68, executiveMeetings: '1/quarter', supportSentiment: 'Positive', escalations: 0 },
      strategic: { growthVelocity: '+12%', expansionPlans: 'EV battery corridor', competitorRisk: 'Low', pilotCorridors: 0 },
      learning: { concessionHistory: 'Rate lock ₹0.12/km (Jan 2025)', outcomeValidation: '91% forecast accuracy', preferredRoutes: 'Gurugram-Bangalore NH44', modelAccuracy: '93.8%' },
    },
    decisionJournal: [],
    predictions: { churnRisk: 10, churnFactors: ['None — stable account'], ltv12m: '₹9.8 Cr', nextBestAction: 'Propose EV battery logistics pilot on Gurugram-Pune lane', dealHealthIndex: 88 },
  },
  {
    id: 'CUS-005',
    name: 'Hindustan Unilever Ltd.',
    shortName: 'HUL',
    gstin: '27AAACH0833E1ZJ',
    industry: 'FMCG',
    legalForm: 'Public Limited',
    region: 'Pan-India',
    hq: 'Mumbai, Maharashtra',
    accountAge: '5.6 years',
    lifecycleState: 'Strategic',
    accountManager: 'Priya Sharma',
    executiveSponsor: 'Anand Menon (CFO)',
    contacts: [
      { name: 'Anand Menon', role: 'CFO', email: 'anand.menon@hul.com', influence: 94, champion: true, sentiment: 'Positive' },
      { name: 'Sunita Rao', role: 'Supply Chain Director', email: 'sunita.rao@hul.com', influence: 87, champion: true, sentiment: 'Positive' },
    ],
    health: { commercial: 91, operational: 89, financial: 94, relationship: 88, strategic: 92, overall: 91 },
    kpis: {
      acrRevenue: '₹6.8 Cr/yr', ltv: '₹58.6 Cr', shipmentsMonth: 196, otdRate: 98.4,
      slaCompliance: 98.8, outstandingInvoices: '₹22.4 L', creditLine: '₹4 Cr', creditUsed: 28,
      avgPaymentDays: 14, churnRisk: 4, renewalLikelihood: 96, nps: 78,
    },
    contracts: [{ id: 'CTR-005', lanes: 'Pan-India Distribution Network', value: '₹6.8 Cr/yr', sla: '98% OTD, 24h resolution', start: '2022-01-01', end: '2027-12-31', status: 'Active', riskIndex: 6 }],
    opportunities: [{ id: 'OPP-005', name: 'Rural Distribution Expansion', stage: 'Proposal', value: '₹1.8 Cr', probability: 82, closingDate: '2026-09-30' }],
    recentShipments: [
      { id: 'SHP-H-001', route: 'Mumbai → Delhi', status: 'delivered', eta: 'Done', value: '₹14.8 L', slaRisk: 'None' },
      { id: 'SHP-H-002', route: 'Chennai → Hyderabad', status: 'in_transit', eta: '4h', value: '₹8.6 L', slaRisk: 'Low' },
    ],
    billing: { invoicesThisMonth: 28, totalBilled: '₹58.2 L', paid: '₹52.4 L', pending: '₹5.8 L', overdue: '₹0', disputes: 0 },
    supportTickets: [],
    digitalTwin: {
      commercial: { pipelineValue: '₹1.8 Cr', grossMargin: '26.4%', ltv: '₹58.6 Cr', expansionPotential: 'Low (+8%)' },
      operational: { shipmentsPerMonth: 196, otdRate: '98.4%', fleetUtilization: '91%', slaIndex: '98.8%' },
      financial: { outstandingAR: '₹22.4 L', creditLineUsed: '28%', avgPaymentDelay: '14 days', disputes: 0, writeOffs: '₹0' },
      relationship: { nps: 78, executiveMeetings: '2/quarter', supportSentiment: 'Very Positive', escalations: 0 },
      strategic: { growthVelocity: '+6%', expansionPlans: 'Rural distribution', competitorRisk: 'Very Low', pilotCorridors: 3 },
      learning: { concessionHistory: 'Annual rate renegotiation +2.1% (Jan 2026)', outcomeValidation: '97% forecast accuracy', preferredRoutes: 'Pan-India DFC Network', modelAccuracy: '97.8%' },
    },
    decisionJournal: [],
    predictions: { churnRisk: 4, churnFactors: ['None — 5+ year strategic account'], ltv12m: '₹6.8 Cr', nextBestAction: 'Close rural distribution proposal before Q3', dealHealthIndex: 96 },
  },
  {
    id: 'CUS-006',
    name: 'ITC Limited Agribusiness',
    shortName: 'ITC Limited',
    gstin: '33AAACI0615R1ZF',
    industry: 'Agribusiness & FMCG',
    legalForm: 'Public Limited',
    region: 'South & East India',
    hq: 'Kolkata, West Bengal',
    accountAge: '2.2 years',
    lifecycleState: 'Active',
    accountManager: 'Kiran Bhat',
    executiveSponsor: 'Mohan Das (VP Operations)',
    contacts: [
      { name: 'Mohan Das', role: 'VP Operations', email: 'mohan.das@itc.in', influence: 88, champion: true, sentiment: 'Positive' },
      { name: 'Geetha Krishnan', role: 'Procurement Head', email: 'geetha.krishnan@itc.in', influence: 74, champion: false, sentiment: 'Neutral' },
    ],
    health: { commercial: 78, operational: 82, financial: 80, relationship: 76, strategic: 72, overall: 78 },
    kpis: {
      acrRevenue: '₹7.2 Cr/yr', ltv: '₹32.4 Cr', shipmentsMonth: 142, otdRate: 94.6,
      slaCompliance: 95.2, outstandingInvoices: '₹34.8 L', creditLine: '₹3.5 Cr', creditUsed: 61,
      avgPaymentDays: 28, churnRisk: 22, renewalLikelihood: 76, nps: 54,
    },
    contracts: [{ id: 'CTR-006', lanes: 'Kolkata ↔ Chennai, Hyderabad ↔ Mumbai', value: '₹7.2 Cr/yr', sla: '95% OTD, 36h resolution', start: '2024-10-01', end: '2026-09-30', status: 'Active', riskIndex: 32 }],
    opportunities: [{ id: 'OPP-006', name: 'Agri Cold Chain — East India', stage: 'Qualified', value: '₹2.4 Cr', probability: 48, closingDate: '2026-11-30' }],
    recentShipments: [
      { id: 'SHP-I-001', route: 'Kolkata → Chennai', status: 'in_transit', eta: '48h', value: '₹22.4 L', slaRisk: 'Medium' },
      { id: 'SHP-I-002', route: 'Hyderabad → Mumbai', status: 'loading', eta: 'Today', value: '₹14.2 L', slaRisk: 'Low' },
    ],
    billing: { invoicesThisMonth: 22, totalBilled: '₹62.4 L', paid: '₹44.8 L', pending: '₹12.8 L', overdue: '₹4.8 L', disputes: 2 },
    supportTickets: [{ id: 'TKT-006', type: 'Billing Dispute', priority: 'High', desc: 'Fuel surcharge variance — SHP-I-001', slaTimer: '6h 45m', assignedAgent: 'Finance Agent', status: 'In Progress' }],
    digitalTwin: {
      commercial: { pipelineValue: '₹2.4 Cr', grossMargin: '19.8%', ltv: '₹32.4 Cr', expansionPotential: 'Medium (+20%)' },
      operational: { shipmentsPerMonth: 142, otdRate: '94.6%', fleetUtilization: '78%', slaIndex: '95.2%' },
      financial: { outstandingAR: '₹34.8 L', creditLineUsed: '61%', avgPaymentDelay: '28 days', disputes: 2, writeOffs: '₹0' },
      relationship: { nps: 54, executiveMeetings: '1/quarter', supportSentiment: 'Neutral', escalations: 1 },
      strategic: { growthVelocity: '+8%', expansionPlans: 'Cold chain agri', competitorRisk: 'Medium', pilotCorridors: 0 },
      learning: { concessionHistory: 'None', outcomeValidation: '82% forecast accuracy', preferredRoutes: 'Kolkata-Chennai via Visakhapatnam', modelAccuracy: '86.4%' },
    },
    decisionJournal: [],
    predictions: { churnRisk: 22, churnFactors: ['Credit line 61% used', 'Billing disputes open', 'NPS 54'], ltv12m: '₹7.2 Cr', nextBestAction: 'Resolve billing disputes immediately + offer volume rebate', dealHealthIndex: 64 },
  },
  {
    id: 'CUS-007',
    name: 'Asian Paints Distribution',
    shortName: 'Asian Paints',
    gstin: '27AAACA4267H1ZK',
    industry: 'Chemicals & Paints',
    legalForm: 'Public Limited',
    region: 'Pan-India',
    hq: 'Mumbai, Maharashtra',
    accountAge: '1.8 years',
    lifecycleState: 'Active',
    accountManager: 'Rohit Mehta',
    executiveSponsor: 'Vikram Shah (CFO)',
    contacts: [
      { name: 'Vikram Shah', role: 'CFO', email: 'vikram.shah@asianpaints.com', influence: 86, champion: false, sentiment: 'Neutral' },
      { name: 'Leela Nair', role: 'Logistics Manager', email: 'leela.nair@asianpaints.com', influence: 78, champion: true, sentiment: 'Positive' },
    ],
    health: { commercial: 76, operational: 84, financial: 82, relationship: 72, strategic: 68, overall: 76 },
    kpis: {
      acrRevenue: '₹5.4 Cr/yr', ltv: '₹22.8 Cr', shipmentsMonth: 168, otdRate: 95.8,
      slaCompliance: 96.4, outstandingInvoices: '₹18.4 L', creditLine: '₹2.5 Cr', creditUsed: 44,
      avgPaymentDays: 24, churnRisk: 18, renewalLikelihood: 80, nps: 58,
    },
    contracts: [{ id: 'CTR-007', lanes: 'Mumbai ↔ Delhi, Pune ↔ Bangalore', value: '₹5.4 Cr/yr', sla: '96% OTD, 36h resolution', start: '2025-01-01', end: '2026-12-31', status: 'Active', riskIndex: 22 }],
    opportunities: [{ id: 'OPP-007', name: 'Chemical Hazmat Corridor Expansion', stage: 'Prospect', value: '₹1.6 Cr', probability: 32, closingDate: '2027-01-01' }],
    recentShipments: [
      { id: 'SHP-AP-001', route: 'Mumbai → Delhi', status: 'delivered', eta: 'Done', value: '₹12.4 L', slaRisk: 'None' },
      { id: 'SHP-AP-002', route: 'Pune → Bangalore', status: 'in_transit', eta: '18h', value: '₹8.8 L', slaRisk: 'Low' },
    ],
    billing: { invoicesThisMonth: 24, totalBilled: '₹44.8 L', paid: '₹38.2 L', pending: '₹6.6 L', overdue: '₹0', disputes: 0 },
    supportTickets: [],
    digitalTwin: {
      commercial: { pipelineValue: '₹1.6 Cr', grossMargin: '21.2%', ltv: '₹22.8 Cr', expansionPotential: 'Low (+12%)' },
      operational: { shipmentsPerMonth: 168, otdRate: '95.8%', fleetUtilization: '80%', slaIndex: '96.4%' },
      financial: { outstandingAR: '₹18.4 L', creditLineUsed: '44%', avgPaymentDelay: '24 days', disputes: 0, writeOffs: '₹0' },
      relationship: { nps: 58, executiveMeetings: '1/quarter', supportSentiment: 'Positive', escalations: 0 },
      strategic: { growthVelocity: '+10%', expansionPlans: 'Hazmat corridor', competitorRisk: 'Low', pilotCorridors: 0 },
      learning: { concessionHistory: 'None', outcomeValidation: '87% forecast accuracy', preferredRoutes: 'Mumbai-Delhi road', modelAccuracy: '89.2%' },
    },
    decisionJournal: [],
    predictions: { churnRisk: 18, churnFactors: ['NPS 58 (below target 65)', 'No C-suite champion'], ltv12m: '₹5.4 Cr', nextBestAction: 'Invite CFO to GatiFleet innovation summit', dealHealthIndex: 72 },
  },
  {
    id: 'CUS-008',
    name: 'Mahindra Logistics Ltd.',
    shortName: 'Mahindra Logistics',
    gstin: '27AAACM0946E1Z5',
    industry: '3PL / Logistics',
    legalForm: 'Public Limited',
    region: 'Pan-India',
    hq: 'Mumbai, Maharashtra',
    accountAge: '0.8 years',
    lifecycleState: 'Contracted',
    accountManager: 'Deepa Iyer',
    executiveSponsor: 'Pankaj Munjal (CEO)',
    contacts: [
      { name: 'Pankaj Munjal', role: 'CEO', email: 'pankaj.munjal@mahindralogistics.com', influence: 96, champion: true, sentiment: 'Positive' },
      { name: 'Sonia Kapoor', role: 'Operations Head', email: 'sonia.kapoor@mahindralogistics.com', influence: 80, champion: true, sentiment: 'Positive' },
    ],
    health: { commercial: 72, operational: 68, financial: 78, relationship: 82, strategic: 74, overall: 75 },
    kpis: {
      acrRevenue: '₹4.2 Cr/yr', ltv: '₹18.6 Cr', shipmentsMonth: 48, otdRate: 91.4,
      slaCompliance: 92.8, outstandingInvoices: '₹6.2 L', creditLine: '₹2 Cr', creditUsed: 22,
      avgPaymentDays: 19, churnRisk: 12, renewalLikelihood: 84, nps: 62,
    },
    contracts: [{ id: 'CTR-008', lanes: 'Delhi ↔ Mumbai (pilot phase)', value: '₹4.2 Cr/yr', sla: '93% OTD, 48h resolution', start: '2025-11-01', end: '2026-10-31', status: 'Active', riskIndex: 28 }],
    opportunities: [{ id: 'OPP-008', name: 'Full Network Handover', stage: 'Proposal', value: '₹8.4 Cr', probability: 62, closingDate: '2026-10-31' }],
    recentShipments: [{ id: 'SHP-ML-001', route: 'Delhi → Mumbai', status: 'in_transit', eta: '28h', value: '₹8.4 L', slaRisk: 'Low' }],
    billing: { invoicesThisMonth: 8, totalBilled: '₹12.8 L', paid: '₹10.4 L', pending: '₹2.4 L', overdue: '₹0', disputes: 0 },
    supportTickets: [],
    digitalTwin: {
      commercial: { pipelineValue: '₹8.4 Cr', grossMargin: '20.4%', ltv: '₹18.6 Cr', expansionPotential: 'Very High (+100%)' },
      operational: { shipmentsPerMonth: 48, otdRate: '91.4%', fleetUtilization: '62%', slaIndex: '92.8%' },
      financial: { outstandingAR: '₹6.2 L', creditLineUsed: '22%', avgPaymentDelay: '19 days', disputes: 0, writeOffs: '₹0' },
      relationship: { nps: 62, executiveMeetings: '2/month', supportSentiment: 'Positive', escalations: 0 },
      strategic: { growthVelocity: '+88%', expansionPlans: 'Full network', competitorRisk: 'Low', pilotCorridors: 1 },
      learning: { concessionHistory: 'None', outcomeValidation: '76% forecast accuracy', preferredRoutes: 'Delhi-Mumbai', modelAccuracy: '82.4%' },
    },
    decisionJournal: [],
    predictions: { churnRisk: 12, churnFactors: ['New account — limited history'], ltv12m: '₹4.2 Cr', nextBestAction: 'Ensure pilot OTD hits 95%+ to unlock full network proposal', dealHealthIndex: 76 },
  },
  {
    id: 'CUS-009',
    name: 'Flipkart Logistics SCM',
    shortName: 'Flipkart',
    gstin: '29AABCF8885D1ZS',
    industry: 'E-Commerce',
    legalForm: 'Private Limited',
    region: 'Pan-India',
    hq: 'Bangalore, Karnataka',
    accountAge: '0.4 years',
    lifecycleState: 'Prospect',
    accountManager: 'Aditya Menon',
    executiveSponsor: 'Kalyan Krishnamurthy (CEO)',
    contacts: [
      { name: 'Kalyan Krishnamurthy', role: 'CEO', email: 'kalyan@flipkart.com', influence: 99, champion: false, sentiment: 'Neutral' },
      { name: 'Hemant Badri', role: 'Supply Chain VP', email: 'hemant.badri@flipkart.com', influence: 84, champion: true, sentiment: 'Positive' },
    ],
    health: { commercial: 52, operational: 0, financial: 60, relationship: 58, strategic: 88, overall: 52 },
    kpis: {
      acrRevenue: '₹2.4 Cr (prospected)', ltv: '₹82.4 Cr', shipmentsMonth: 0, otdRate: null,
      slaCompliance: null, outstandingInvoices: '₹0', creditLine: '₹10 Cr', creditUsed: 0,
      avgPaymentDays: null, churnRisk: 48, renewalLikelihood: null, nps: null,
    },
    contracts: [],
    opportunities: [{ id: 'OPP-009', name: 'Festive Season Surge Capacity', stage: 'Qualified', value: '₹2.4 Cr', probability: 38, closingDate: '2026-09-01' }],
    recentShipments: [],
    billing: { invoicesThisMonth: 0, totalBilled: '₹0', paid: '₹0', pending: '₹0', overdue: '₹0', disputes: 0 },
    supportTickets: [],
    digitalTwin: {
      commercial: { pipelineValue: '₹2.4 Cr', grossMargin: 'N/A', ltv: '₹82.4 Cr', expansionPotential: 'Exceptional (+400%)' },
      operational: { shipmentsPerMonth: 0, otdRate: 'N/A', fleetUtilization: 'N/A', slaIndex: 'N/A' },
      financial: { outstandingAR: '₹0', creditLineUsed: '0%', avgPaymentDelay: 'N/A', disputes: 0, writeOffs: '₹0' },
      relationship: { nps: 'N/A', executiveMeetings: '1 intro call completed', supportSentiment: 'Neutral', escalations: 0 },
      strategic: { growthVelocity: 'N/A', expansionPlans: 'Festive surge → National network', competitorRisk: 'Very High (Delhivery incumbent)', pilotCorridors: 0 },
      learning: { concessionHistory: 'None', outcomeValidation: 'N/A', preferredRoutes: 'TBD', modelAccuracy: 'N/A' },
    },
    decisionJournal: [],
    predictions: { churnRisk: 48, churnFactors: ['Pre-deal stage', 'Delhivery incumbent', 'No operational history'], ltv12m: '₹2.4 Cr (if pilot won)', nextBestAction: 'Prepare festive surge capacity proposal with dedicated fleet SLA', dealHealthIndex: 42 },
  },
  {
    id: 'CUS-010',
    name: 'BigBasket Express Foods',
    shortName: 'BigBasket',
    gstin: '29AABCB4077B1Z8',
    industry: 'Grocery & Cold Chain',
    legalForm: 'Private Limited',
    region: 'South & West India',
    hq: 'Bangalore, Karnataka',
    accountAge: '1.1 years',
    lifecycleState: 'Qualified',
    accountManager: 'Deepa Iyer',
    executiveSponsor: 'Hari Menon (Co-Founder)',
    contacts: [{ name: 'Hari Menon', role: 'Co-Founder & CEO', email: 'hari.menon@bigbasket.com', influence: 100, champion: true, sentiment: 'Positive' }],
    health: { commercial: 64, operational: 58, financial: 72, relationship: 70, strategic: 80, overall: 69 },
    kpis: {
      acrRevenue: '₹1.8 Cr (qualifying)', ltv: '₹24.6 Cr', shipmentsMonth: 22, otdRate: 88.4,
      slaCompliance: 90.2, outstandingInvoices: '₹4.8 L', creditLine: '₹1.5 Cr', creditUsed: 38,
      avgPaymentDays: 26, churnRisk: 34, renewalLikelihood: 68, nps: 44,
    },
    contracts: [],
    opportunities: [{ id: 'OPP-010', name: 'Bangalore Cold Chain Network', stage: 'Proposal', value: '₹1.8 Cr', probability: 52, closingDate: '2026-10-15' }],
    recentShipments: [{ id: 'SHP-BB-001', route: 'Bangalore → Mysore', status: 'delivered', eta: 'Done', value: '₹2.4 L', slaRisk: 'None' }],
    billing: { invoicesThisMonth: 4, totalBilled: '₹8.2 L', paid: '₹6.4 L', pending: '₹1.8 L', overdue: '₹0', disputes: 0 },
    supportTickets: [],
    digitalTwin: {
      commercial: { pipelineValue: '₹1.8 Cr', grossMargin: '18.8%', ltv: '₹24.6 Cr', expansionPotential: 'High (+60%)' },
      operational: { shipmentsPerMonth: 22, otdRate: '88.4%', fleetUtilization: '52%', slaIndex: '90.2%' },
      financial: { outstandingAR: '₹4.8 L', creditLineUsed: '38%', avgPaymentDelay: '26 days', disputes: 0, writeOffs: '₹0' },
      relationship: { nps: 44, executiveMeetings: '2 calls done', supportSentiment: 'Positive', escalations: 0 },
      strategic: { growthVelocity: 'N/A', expansionPlans: 'Cold chain buildout', competitorRisk: 'Medium', pilotCorridors: 0 },
      learning: { concessionHistory: 'None', outcomeValidation: '68% accuracy (low data)', preferredRoutes: 'Bangalore metro', modelAccuracy: 'Limited' },
    },
    decisionJournal: [],
    predictions: { churnRisk: 34, churnFactors: ['OTD 88.4% below target', 'Cold chain not proven', 'NPS 44 very low'], ltv12m: '₹1.8 Cr (if contracted)', nextBestAction: 'Deploy reefer fleet on pilot — achieve >96% OTD to win contract', dealHealthIndex: 56 },
  },
  {
    id: 'CUS-011',
    name: 'DMart Supply Chain',
    shortName: 'DMart',
    gstin: '27AABCD7777G1ZT',
    industry: 'Retail',
    legalForm: 'Public Limited',
    region: 'West & South India',
    hq: 'Navi Mumbai, Maharashtra',
    accountAge: '0.6 years',
    lifecycleState: 'Opportunity',
    accountManager: 'Rohit Mehta',
    executiveSponsor: 'Ignatius Navil Noronha (MD)',
    contacts: [
      { name: 'Ignatius Noronha', role: 'MD', email: 'ignatius@dmart.in', influence: 98, champion: false, sentiment: 'Neutral' },
      { name: 'Ramesh Shetty', role: 'Supply Chain Head', email: 'ramesh.shetty@dmart.in', influence: 82, champion: true, sentiment: 'Positive' },
    ],
    health: { commercial: 60, operational: 0, financial: 68, relationship: 62, strategic: 74, overall: 53 },
    kpis: {
      acrRevenue: '₹4.2 Cr (projected)', ltv: '₹36.8 Cr', shipmentsMonth: 0, otdRate: null,
      slaCompliance: null, outstandingInvoices: '₹0', creditLine: '₹5 Cr', creditUsed: 0,
      avgPaymentDays: null, churnRisk: 42, renewalLikelihood: null, nps: null,
    },
    contracts: [],
    opportunities: [{ id: 'OPP-011', name: 'Mumbai to Pune DC Distribution', stage: 'Opportunity', value: '₹4.2 Cr', probability: 46, closingDate: '2026-11-01' }],
    recentShipments: [],
    billing: { invoicesThisMonth: 0, totalBilled: '₹0', paid: '₹0', pending: '₹0', overdue: '₹0', disputes: 0 },
    supportTickets: [],
    digitalTwin: {
      commercial: { pipelineValue: '₹4.2 Cr', grossMargin: 'N/A', ltv: '₹36.8 Cr', expansionPotential: 'High (+180%)' },
      operational: { shipmentsPerMonth: 0, otdRate: 'N/A', fleetUtilization: 'N/A', slaIndex: 'N/A' },
      financial: { outstandingAR: '₹0', creditLineUsed: '0%', avgPaymentDelay: 'N/A', disputes: 0, writeOffs: '₹0' },
      relationship: { nps: 'N/A', executiveMeetings: '1 RFQ submitted', supportSentiment: 'Neutral', escalations: 0 },
      strategic: { growthVelocity: 'N/A', expansionPlans: 'Mumbai-Pune DC', competitorRisk: 'High', pilotCorridors: 0 },
      learning: { concessionHistory: 'None', outcomeValidation: 'N/A', preferredRoutes: 'TBD', modelAccuracy: 'N/A' },
    },
    decisionJournal: [],
    predictions: { churnRisk: 42, churnFactors: ['Pre-contract', 'Competitor bids active'], ltv12m: '₹4.2 Cr', nextBestAction: 'Submit competitive pricing proposal — close before Q3', dealHealthIndex: 46 },
  },
  {
    id: 'CUS-012',
    name: 'ONGC Petroleum Logistics',
    shortName: 'ONGC',
    gstin: '07AAACO0144D1ZN',
    industry: 'Oil & Gas',
    legalForm: 'Public Sector',
    region: 'Pan-India',
    hq: 'Delhi, NCT',
    accountAge: '3.8 years',
    lifecycleState: 'At Risk',
    accountManager: 'Kiran Bhat',
    executiveSponsor: 'Anurag Sharma (Director)',
    contacts: [
      { name: 'Anurag Sharma', role: 'Director Logistics', email: 'anurag.sharma@ongc.co.in', influence: 92, champion: false, sentiment: 'Negative' },
      { name: 'Prashant Dwivedi', role: 'Supply Chain GM', email: 'prashant.dwivedi@ongc.co.in', influence: 76, champion: true, sentiment: 'Neutral' },
    ],
    health: { commercial: 48, operational: 62, financial: 54, relationship: 38, strategic: 44, overall: 49 },
    kpis: {
      acrRevenue: '₹3.2 Cr/yr', ltv: '₹12.4 Cr', shipmentsMonth: 88, otdRate: 88.2,
      slaCompliance: 89.4, outstandingInvoices: '₹82.4 L', creditLine: '₹6 Cr', creditUsed: 84,
      avgPaymentDays: 68, churnRisk: 72, renewalLikelihood: 34, nps: 22,
    },
    contracts: [{ id: 'CTR-012', lanes: 'Delhi ↔ Mumbai, Ahmedabad ↔ Chennai', value: '₹3.2 Cr/yr', sla: '92% OTD, 48h resolution', start: '2023-04-01', end: '2026-03-31', status: 'At Risk', riskIndex: 78 }],
    opportunities: [],
    recentShipments: [
      { id: 'SHP-O-001', route: 'Delhi → Mumbai', status: 'delayed', eta: '+18h', value: '₹28.4 L', slaRisk: 'Critical' },
      { id: 'SHP-O-002', route: 'Ahmedabad → Chennai', status: 'in_transit', eta: '44h', value: '₹18.8 L', slaRisk: 'High' },
    ],
    billing: { invoicesThisMonth: 14, totalBilled: '₹48.4 L', paid: '₹22.8 L', pending: '₹16.2 L', overdue: '₹9.4 L', disputes: 4 },
    supportTickets: [
      { id: 'TKT-012A', type: 'SLA Breach', priority: 'Urgent', desc: 'SHP-O-001 delay — 3rd occurrence this month', slaTimer: '0h 42m', assignedAgent: 'Operations Agent', status: 'Escalated' },
      { id: 'TKT-012B', type: 'Billing Dispute', priority: 'High', desc: '4 invoices disputed — ₹9.4 L at risk', slaTimer: '4h 00m', assignedAgent: 'Finance Agent', status: 'Open' },
    ],
    digitalTwin: {
      commercial: { pipelineValue: '₹0', grossMargin: '14.2%', ltv: '₹12.4 Cr', expansionPotential: 'None (at risk)' },
      operational: { shipmentsPerMonth: 88, otdRate: '88.2%', fleetUtilization: '72%', slaIndex: '89.4%' },
      financial: { outstandingAR: '₹82.4 L', creditLineUsed: '84%', avgPaymentDelay: '68 days', disputes: 4, writeOffs: '₹0' },
      relationship: { nps: 22, executiveMeetings: '0 this quarter', supportSentiment: 'Very Negative', escalations: 4 },
      strategic: { growthVelocity: '-22%', expansionPlans: 'None', competitorRisk: 'Very High', pilotCorridors: 0 },
      learning: { concessionHistory: 'Rate concession denied (Jun 2025)', outcomeValidation: '62% forecast accuracy', preferredRoutes: 'Delhi-Mumbai road', modelAccuracy: '74.2%' },
    },
    decisionJournal: [{ date: '2025-07-20', actor: 'Kiran Bhat', action: 'Denied rate concession request', expected: 'Customer accepts market rates', actual: 'Customer escalated to senior management', divergence: 'Negative', lesson: 'For PSU accounts with >60 day payment cycles, use rate flexibility before billing disputes escalate' }],
    predictions: { churnRisk: 72, churnFactors: ['NPS 22 very low', 'Credit 84% used', '68-day payment delay', '4 billing disputes', '3rd SLA breach this month'], ltv12m: '₹3.2 Cr (at risk)', nextBestAction: 'URGENT: CEO intervention — schedule C-suite recovery meeting + SLA recovery package', dealHealthIndex: 24 },
  },
];

// ---- MOCK GENERATOR (fills list beyond the 12 anchors) ----
const INDUSTRIES_G = ['Manufacturing', 'Pharma', 'Textiles', 'Steel & Metals', 'Consumer Electronics', 'Agriculture', 'Construction'];
const STATES_G = ['Gujarat', 'Rajasthan', 'Haryana', 'Tamil Nadu', 'Telangana', 'Karnataka', 'West Bengal'];
const CITIES_G = ['Ahmedabad', 'Jaipur', 'Faridabad', 'Coimbatore', 'Warangal', 'Mysore', 'Durgapur'];
const LIFECYCLE_LIST = ['Prospect', 'Qualified', 'Opportunity', 'Active', 'Expanding', 'At Risk', 'Dormant'];
const MANAGERS_G = ['Priya Sharma', 'Suresh Nair', 'Aditya Menon', 'Neha Khanna', 'Rohit Mehta', 'Deepa Iyer', 'Kiran Bhat'];
const COMPANY_PREFIXES = ['Bharat', 'India', 'National', 'Supreme', 'Pioneer', 'Heritage', 'Prime', 'Apex'];
const COMPANY_SUFFIXES = ['Industries', 'Manufacturing', 'Logistics', 'Transport', 'Exports', 'Supply Co.', 'Distribution', 'Trade & Cargo'];

function generateMockCustomer(index) {
  const state = LIFECYCLE_LIST[index % LIFECYCLE_LIST.length];
  const h = {
    commercial: rand(40, 88),
    operational: rand(40, 90),
    financial: rand(45, 92),
    relationship: rand(35, 88),
    strategic: rand(40, 85),
  };
  h.overall = Math.round((h.commercial + h.operational + h.financial + h.relationship + h.strategic) / 5);
  const prefix = COMPANY_PREFIXES[index % COMPANY_PREFIXES.length];
  const suffix = COMPANY_SUFFIXES[index % COMPANY_SUFFIXES.length];
  return {
    id: `CUS-${String(100 + index).padStart(3, '0')}`,
    name: `${prefix} ${suffix}`,
    shortName: prefix,
    gstin: `${rand(10, 33)}AAAB${String.fromCharCode(65 + (index % 26))}${rand(1000, 9999)}X1Z${String.fromCharCode(65 + (index % 26))}`,
    industry: INDUSTRIES_G[index % INDUSTRIES_G.length],
    legalForm: index % 3 === 0 ? 'Private Limited' : 'LLP',
    region: STATES_G[index % STATES_G.length],
    hq: `${CITIES_G[index % CITIES_G.length]}, ${STATES_G[index % STATES_G.length]}`,
    accountAge: `${(index * 0.4 + 0.3).toFixed(1)} years`,
    lifecycleState: state,
    accountManager: MANAGERS_G[index % MANAGERS_G.length],
    executiveSponsor: 'N/A',
    contacts: [{ name: 'Primary Contact', role: 'MD', email: `contact@${prefix.toLowerCase()}.com`, influence: rand(60, 90), champion: true, sentiment: 'Neutral' }],
    health: h,
    kpis: {
      acrRevenue: `₹${randFloat(0.8, 4.2)} Cr/yr`, ltv: `₹${randFloat(4.0, 18.0)} Cr`,
      shipmentsMonth: rand(8, 120), otdRate: randFloat(88, 98), slaCompliance: randFloat(88, 98),
      outstandingInvoices: `₹${rand(2, 40)} L`, creditLine: `₹${rand(1, 5)} Cr`, creditUsed: rand(10, 75),
      avgPaymentDays: rand(14, 45), churnRisk: rand(5, 65), renewalLikelihood: rand(45, 95), nps: rand(28, 75),
    },
    contracts: [],
    opportunities: [],
    recentShipments: [],
    billing: { invoicesThisMonth: rand(2, 20), totalBilled: `₹${rand(4, 40)} L`, paid: `₹${rand(2, 30)} L`, pending: `₹${rand(0, 10)} L`, overdue: '₹0', disputes: 0 },
    supportTickets: [],
    digitalTwin: { commercial: {}, operational: {}, financial: {}, relationship: {}, strategic: {}, learning: {} },
    decisionJournal: [],
    predictions: { churnRisk: rand(5, 65), churnFactors: ['Limited data available'], ltv12m: `₹${randFloat(0.8, 4.2)} Cr`, nextBestAction: 'Conduct needs assessment call', dealHealthIndex: rand(30, 80) },
  };
}

const MOCK_EXTRAS = Array.from({ length: 8 }, (_, i) => generateMockCustomer(i));
export const ALL_CUSTOMERS = [...NAMED_CUSTOMERS, ...MOCK_EXTRAS];

// ---- HELPERS ----
export const getHealthColor = (score) => {
  if (score >= 80) return '#10b981';
  if (score >= 65) return '#06b6d4';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
};
export const getLifecycleColor = (state) => {
  const found = LIFECYCLE_STATES.find(s => s.id === state);
  return found ? found.color : '#6b7280';
};
export const getChurnColor = (risk) => {
  if (risk <= 15) return '#10b981';
  if (risk <= 35) return '#f59e0b';
  return '#ef4444';
};
export const getDealHealthColor = (idx) => {
  if (idx >= 80) return '#10b981';
  if (idx >= 60) return '#06b6d4';
  if (idx >= 40) return '#f59e0b';
  return '#ef4444';
};
