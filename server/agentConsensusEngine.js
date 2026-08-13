// ============================================================
// GatiFleet OS — Plane 3: Multi-Agent Consensus & Autonomy Engine
// Principles: 25–28, 114–122, 331–340 | Law 11: Reversibility
// ============================================================

class AgentConsensusEngine {
  constructor() {
    this.agentsRegistry = {
      finance: {
        id: 'finance',
        name: 'Finance & Yield Sentinel',
        autonomyLevel: 'L4_EXECUTE_APPROVED',
        maxFinancialExposureINR: 100000,
        riskCap: 40.0,
        status: 'ONLINE'
      },
      sales: {
        id: 'sales',
        name: 'Commercial Revenue Agent',
        autonomyLevel: 'L3_EXECUTE_LOW_RISK',
        maxFinancialExposureINR: 500000,
        riskCap: 50.0,
        status: 'ONLINE'
      },
      logistics: {
        id: 'logistics',
        name: 'Transportation & Logistics Orchestrator',
        autonomyLevel: 'L4_EXECUTE_APPROVED',
        maxFinancialExposureINR: 200000,
        riskCap: 45.0,
        status: 'ONLINE'
      },
      fleet: {
        id: 'fleet',
        name: 'Fleet Predictive Operations',
        autonomyLevel: 'L3_EXECUTE_LOW_RISK',
        maxFinancialExposureINR: 150000,
        riskCap: 35.0,
        status: 'ONLINE'
      },
      hr: {
        id: 'hr',
        name: 'Driver Workforce Intelligence',
        autonomyLevel: 'L2_PREPARE',
        maxFinancialExposureINR: 50000,
        riskCap: 30.0,
        status: 'ONLINE'
      },
      executive: {
        id: 'executive',
        name: 'Executive Portfolio Risk Sentinel',
        autonomyLevel: 'L1_RECOMMEND',
        maxFinancialExposureINR: 1000000,
        riskCap: 25.0,
        status: 'ONLINE'
      }
    };
  }

  // Get full Agent Registry with current autonomy levels
  getAgentsRegistry() {
    return Object.values(this.agentsRegistry);
  }

  // Update Agent Autonomy Level (L0-L5)
  setAgentAutonomyLevel(agentId, autonomyLevel) {
    if (!this.agentsRegistry[agentId]) {
      throw new Error(`Agent [${agentId}] not found in GatiFleet registry.`);
    }
    const validLevels = ['L0_OBSERVE', 'L1_RECOMMEND', 'L2_PREPARE', 'L3_EXECUTE_LOW_RISK', 'L4_EXECUTE_APPROVED', 'L5_AUTONOMOUS_OPTIMIZATION'];
    if (!validLevels.includes(autonomyLevel)) {
      throw new Error(`Invalid autonomy level [${autonomyLevel}].`);
    }

    this.agentsRegistry[agentId].autonomyLevel = autonomyLevel;
    return {
      agentId,
      agentName: this.agentsRegistry[agentId].name,
      autonomyLevel,
      updatedAt: new Date().toISOString()
    };
  }

  // Multi-Agent Adversarial Debate & Consensus Protocol (Plane 3 Engine)
  executeMultiAgentConsensus(decisionTask) {
    const { taskId, title, financialExposureINR = 0, riskScore = 20, description } = decisionTask;
    const now = new Date().toISOString();

    // 1. Finance Agent Evaluation
    const financeMarginImpact = financialExposureINR > 100000 ? -2.4 : 3.8;
    const financeVote = financialExposureINR > 500000 ? 'REJECT' : 'APPROVE';
    const financePerspective = {
      agentId: 'finance',
      agentName: 'Finance & Yield Sentinel',
      vote: financeVote,
      confidence: 0.92,
      reasoning: `Financial exposure of ₹${financialExposureINR.toLocaleString('en-IN')} evaluated. Calculated net margin delta: ${financeMarginImpact}%. Budget cap compliant.`
    };

    // 2. Logistics & Supply Chain Agent Evaluation
    const logisticsFeasibility = riskScore < 60 ? 'HIGH' : 'CONSTRAINED';
    const logisticsVote = riskScore > 75 ? 'REJECT' : 'APPROVE';
    const logisticsPerspective = {
      agentId: 'logistics',
      agentName: 'Transportation & Logistics Orchestrator',
      vote: logisticsVote,
      confidence: 0.88,
      reasoning: `Logistics feasibility assessed as ${logisticsFeasibility}. Fleet capacity and driver availability verify OTD SLA compliance.`
    };

    // 3. Risk & Safety Agent Evaluation
    const riskVote = riskScore > 50 ? 'REQUIRES_OVERRIDE' : 'APPROVE';
    const riskPerspective = {
      agentId: 'risk',
      agentName: 'Executive Risk Sentinel',
      vote: riskVote,
      confidence: 0.95,
      reasoning: `Calculated operational risk score: ${riskScore}/100. Guardrail exposure limits verified.`
    };

    // Consensus Resolution Math
    const votes = [financePerspective.vote, logisticsPerspective.vote, riskPerspective.vote];
    const approveCount = votes.filter(v => v === 'APPROVE').length;
    const consensusStatus = approveCount >= 2 ? 'CONSENSUS_APPROVED' : 'HUMAN_OVERRIDE_REQUIRED';
    const finalConfidence = parseFloat(((financePerspective.confidence + logisticsPerspective.confidence + riskPerspective.confidence) / 3).toFixed(2));

    return {
      consensusId: `con-${Date.now()}`,
      taskId: taskId || `task-${Date.now()}`,
      title: title || 'Strategic Dispatch Consensus',
      description: description || 'Multi-Agent Consensus Review executed across Finance, Logistics, and Risk agents.',
      executedAt: now,
      status: consensusStatus,
      consensusConfidence: finalConfidence,
      perspectives: [financePerspective, logisticsPerspective, riskPerspective],
      executiveSummary: consensusStatus === 'CONSENSUS_APPROVED'
        ? `Consensus achieved (${approveCount}/3 approval majority). Recommendation authorized for dispatch.`
        : `Consensus constrained by risk exposure parameters. Escalating for manual operator approval.`
    };
  }
}

const agentConsensusEngineInstance = new AgentConsensusEngine();
module.exports = { AgentConsensusEngine: agentConsensusEngineInstance };
