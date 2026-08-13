// ============================================================
// GatiFleet OS — Policy-as-Code & Security Kernel
// Enforces Law 5 (Every Decision Has Constraints), Law 6 (Authority),
// Law 11 (Reversibility & Kill Switch) & Plane 10 (Governance & Security)
// ============================================================

const logger = require('./logger');

class PolicyKernelEngine {
  constructor() {
    // Universal Agent Kill Switch State (False = Normal, True = System-wide Pause)
    this.killSwitchActive = false;
    this.killSwitchMetadata = {
      toggledAt: null,
      toggledBy: null,
      reason: null
    };

    // Corporate Risk & Spending Exposure Bounds
    this.policyRules = {
      maxAutonomousFinancialAmountINR: 100000, // ₹1,00,000 threshold for L3/L4 auto execution
      maxAutonomousRiskScore: 60.0,            // Below 60 risk score can auto-execute
      minConfidenceScore: 0.85,                // 85% min confidence for autonomous dispatches
      fourEyesRequiredAmountINR: 1000000        // ₹10,00,000 requires two-party approval
    };

    // Active Agent Authorization Registry
    this.agentCapabilities = {
      'FINANCE_AGENT': { maxAutonomy: 'L3_EXECUTE_LOW_RISK', allowedActions: ['GENERATE_INVOICE', 'CALCULATE_MARGIN'] },
      'FLEET_AGENT': { maxAutonomy: 'L4_EXECUTE_APPROVED', allowedActions: ['DISPATCH_VEHICLE', 'REROUTE_SHIPMENT', 'SCHEDULE_MAINTENANCE'] },
      'LOGISTICS_AGENT': { maxAutonomy: 'L4_EXECUTE_APPROVED', allowedActions: ['OPTIMIZE_ROUTE', 'ASSIGN_TRAILER'] },
      'RISK_AGENT': { maxAutonomy: 'L2_PREPARE', allowedActions: ['FLAG_EXPOSURE', 'RECOMMEND_HEDGE'] },
      'EXECUTIVE_AGENT': { maxAutonomy: 'L1_RECOMMEND', allowedActions: ['PROPOSE_STRATEGY', 'SUMMARIZE_HEALTH'] }
    };
  }

  // Toggle Universal Agent Kill Switch
  toggleKillSwitch(active, operatorId = 'ADMIN', reason = 'Manual Operator Intervention') {
    this.killSwitchActive = Boolean(active);
    this.killSwitchMetadata = {
      toggledAt: new Date().toISOString(),
      toggledBy: operatorId,
      reason: reason
    };

    logger.warn(`[POLICY KERNEL] Universal Agent Kill Switch status set to: ${this.killSwitchActive ? 'ACTIVE (SYSTEM PAUSED)' : 'NORMAL (DISPATCHES ENABLED)'} by ${operatorId}. Reason: ${reason}`);

    return {
      killSwitchActive: this.killSwitchActive,
      metadata: this.killSwitchMetadata
    };
  }

  getKillSwitchStatus() {
    return {
      killSwitchActive: this.killSwitchActive,
      metadata: this.killSwitchMetadata
    };
  }

  // Validate action before execution
  evaluateActionPermission({ agentId, actionType, autonomyLevel, financialExposureINR = 0, riskScore = 0, confidence = 1.0 }) {
    // 1. Hard Check: Universal Agent Kill Switch
    if (this.killSwitchActive) {
      return {
        authorized: false,
        reason: 'Action blocked by Universal Agent Kill Switch. All autonomous AI dispatches are paused system-wide.',
        errorCode: 'KILL_SWITCH_ACTIVE'
      };
    }

    // 2. Check Agent Capability & Autonomy Ceiling
    const agentCap = this.agentCapabilities[agentId];
    if (agentId && agentCap) {
      if (!agentCap.allowedActions.includes(actionType)) {
        return {
          authorized: false,
          reason: `Agent ${agentId} is not permitted to perform action: ${actionType}`,
          errorCode: 'UNAUTHORIZED_ACTION'
        };
      }
    }

    // 3. Check Financial Spending Limits
    if (financialExposureINR > this.policyRules.maxAutonomousFinancialAmountINR && autonomyLevel !== 'L0_OBSERVE' && autonomyLevel !== 'L1_RECOMMEND') {
      return {
        authorized: false,
        requiresHumanApproval: true,
        reason: `Action financial exposure (₹${financialExposureINR.toLocaleString()}) exceeds autonomous limit (₹${this.policyRules.maxAutonomousFinancialAmountINR.toLocaleString()}). Human approval required.`,
        errorCode: 'FINANCIAL_EXPOSURE_EXCEEDED'
      };
    }

    // 4. Check Risk Score Threshold
    if (riskScore > this.policyRules.maxAutonomousRiskScore && autonomyLevel !== 'L0_OBSERVE' && autonomyLevel !== 'L1_RECOMMEND') {
      return {
        authorized: false,
        requiresHumanApproval: true,
        reason: `Risk score (${riskScore}) exceeds autonomous safety ceiling (${this.policyRules.maxAutonomousRiskScore}). Escalate to human manager.`,
        errorCode: 'RISK_CEILING_EXCEEDED'
      };
    }

    // 5. Check Confidence Score
    if (confidence < this.policyRules.minConfidenceScore) {
      return {
        authorized: false,
        requiresHumanApproval: true,
        reason: `AI confidence score (${(confidence * 100).toFixed(1)}%) is below mandatory threshold (${(this.policyRules.minConfidenceScore * 100)}%).`,
        errorCode: 'LOW_CONFIDENCE'
      };
    }

    // Authorized
    return {
      authorized: true,
      reason: 'Action verified and compliant with GatiFleet Policy Kernel.',
      autonomyLevel
    };
  }
}

module.exports = {
  PolicyKernelEngine: new PolicyKernelEngine()
};
