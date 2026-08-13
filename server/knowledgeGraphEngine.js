// ============================================================
// GatiFleet OS — Plane 4: Knowledge Graph Engine
// Principles: 13–16, 123–130, 341–350, 491–500 | Law 3: Dependency
// ============================================================

class KnowledgeGraphEngine {
  constructor() {
    this.nodes = [
      { id: 'CUS-001', type: 'Customer', label: 'Tata Motors Limited', riskScore: 12.5 },
      { id: 'CUS-002', type: 'Customer', label: 'Amazon India Logistics', riskScore: 18.0 },
      { id: 'CON-101', type: 'Contract', label: 'Tata Long-Haul SLA 2026', penaltyRateINR: 5000 },
      { id: 'TRK-001', type: 'Vehicle', label: 'TRK-001 (MH-12-PQ-9048)', status: 'EN_ROUTE', lat: 19.0760, lng: 72.8777 },
      { id: 'TRK-002', type: 'Vehicle', label: 'TRK-002 (MH-14-AB-1234)', status: 'MAINTENANCE', lat: 18.5204, lng: 73.8567 },
      { id: 'DRV-001', type: 'Driver', label: 'Ashok Pandey', fatigueIndex: 18.5 },
      { id: 'RTE-48', type: 'Route', label: 'NH48 Mumbai - Pune Express Corridor', distanceKm: 148 }
    ];

    this.edges = [
      { source: 'CUS-001', target: 'CON-101', relation: 'HAS_CONTRACT' },
      { source: 'CON-101', target: 'RTE-48', relation: 'USES_CORRIDOR' },
      { source: 'TRK-001', target: 'RTE-48', relation: 'ASSIGNED_TO_ROUTE' },
      { source: 'DRV-001', target: 'TRK-001', relation: 'OPERATES_VEHICLE' },
      { source: 'TRK-001', target: 'CUS-001', relation: 'SERVES_CUSTOMER' }
    ];
  }

  // Get full Knowledge Graph nodes & edges
  getGraph() {
    return {
      timestamp: new Date().toISOString(),
      nodesCount: this.nodes.length,
      edgesCount: this.edges.length,
      nodes: this.nodes,
      edges: this.edges
    };
  }

  // Cascade Impact Traversal Solver (Plane 4 Core Engine)
  findCascadeImpact(entityId) {
    const rootNode = this.nodes.find(n => n.id === entityId) || { id: entityId, type: 'UNKNOWN', label: entityId };
    
    // Find all directly connected nodes (1-hop)
    const directEdges = this.edges.filter(e => e.source === entityId || e.target === entityId);
    const directConnectedIds = directEdges.map(e => e.source === entityId ? e.target : e.source);

    // Find 2-hop connected nodes
    const secondaryEdges = this.edges.filter(e => directConnectedIds.includes(e.source) || directConnectedIds.includes(e.target));
    const secondaryConnectedIds = secondaryEdges.map(e => directConnectedIds.includes(e.source) ? e.target : e.source);

    const affectedNodeIds = Array.from(new Set([entityId, ...directConnectedIds, ...secondaryConnectedIds]));
    const affectedNodes = this.nodes.filter(n => affectedNodeIds.includes(n.id));

    // Calculate revenue-at-risk and operational risk
    const contractsAffected = affectedNodes.filter(n => n.type === 'Contract');
    const revenueAtRiskINR = contractsAffected.length * 450000;
    const SLAExposureINR = contractsAffected.reduce((sum, c) => sum + (c.penaltyRateINR || 5000), 0);

    return {
      timestamp: new Date().toISOString(),
      triggerEntityId: entityId,
      triggerNode: rootNode,
      cascadeDepth: 2,
      affectedNodesCount: affectedNodes.length,
      affectedNodes,
      financialImpact: {
        revenueAtRiskINR,
        SLAExposureINR,
        estimatedRecoveryCostINR: 18500
      },
      recommendedActions: [
        `Reallocate standby trailer TRK-003 to corridor ${rootNode.id}`,
        `Notify customer representative for contract ${contractsAffected.map(c=>c.id).join(', ')}`,
        `Dispatch express maintenance crew to GPS coordinates`
      ]
    };
  }
}

const knowledgeGraphEngineInstance = new KnowledgeGraphEngine();
module.exports = { KnowledgeGraphEngine: knowledgeGraphEngineInstance };
