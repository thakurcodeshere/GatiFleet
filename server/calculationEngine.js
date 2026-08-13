// ============================================================
// GatiFleet OS — Plane 7: Executable Calculation Engine
// Principles: 17–19, 131–140, 351–360, 501–510 | Law 4: Integrity
// ============================================================

class CalculationEngine {
  // 1. Net Margin Calculation Schema (Plane 7)
  evaluateNetMargin({ freightTariffINR, fuelCostINR, tollCostINR, driverAllowanceINR, assetDepreciationINR = 1200, overheadCostINR = 800 }) {
    const tariff = parseFloat(freightTariffINR) || 45000;
    const fuel = parseFloat(fuelCostINR) || 18500;
    const tolls = parseFloat(tollCostINR) || 3200;
    const driver = parseFloat(driverAllowanceINR) || 2500;
    const depr = parseFloat(assetDepreciationINR) || 1200;
    const overhead = parseFloat(overheadCostINR) || 800;

    const totalCost = fuel + tolls + driver + depr + overhead;
    const netProfitINR = tariff - totalCost;
    const marginPct = (netProfitINR / tariff) * 100;

    return {
      formulaType: 'NET_MARGIN',
      timestamp: new Date().toISOString(),
      inputs: { freightTariffINR: tariff, fuelCostINR: fuel, tollCostINR: tolls, driverAllowanceINR: driver, assetDepreciationINR: depr, overheadCostINR: overhead },
      outputs: {
        totalCostINR: parseFloat(totalCost.toFixed(2)),
        netProfitINR: parseFloat(netProfitINR.toFixed(2)),
        marginPct: parseFloat(marginPct.toFixed(2)),
        healthStatus: marginPct > 20 ? 'HEALTHY_MARGIN' : marginPct > 10 ? 'ACCEPTABLE_MARGIN' : 'MARGIN_WARNING'
      },
      formulaBreakdown: [
        `1. Gross Tariff = ₹${tariff.toLocaleString('en-IN')}`,
        `2. Operational Costs = Fuel (₹${fuel}) + Tolls (₹${tolls}) + Driver (₹${driver}) + Depr (₹${depr}) + Overhead (₹${overhead}) = ₹${totalCost.toLocaleString('en-IN')}`,
        `3. Net Profit = ₹${tariff} - ₹${totalCost} = ₹${netProfitINR.toLocaleString('en-IN')}`,
        `4. Margin Percentage = (₹${netProfitINR} / ₹${tariff}) * 100 = ${marginPct.toFixed(2)}%`
      ]
    };
  }

  // 2. Dynamic Fuel Surcharge (FSC) Schema
  evaluateFuelSurcharge({ baseTariffINR, currentFuelPriceINR, baseFuelPriceINR = 90 }) {
    const tariff = parseFloat(baseTariffINR) || 50000;
    const currentPrice = parseFloat(currentFuelPriceINR) || 96.5;
    const basePrice = parseFloat(baseFuelPriceINR) || 90;

    const priceDeltaPct = ((currentPrice - basePrice) / basePrice);
    const surchageRatio = Math.max(0, priceDeltaPct * 0.5); // 50% fuel pass-through
    const surchargeINR = tariff * surchageRatio;
    const finalTariffINR = tariff + surchargeINR;

    return {
      formulaType: 'FUEL_SURCHARGE',
      timestamp: new Date().toISOString(),
      inputs: { baseTariffINR: tariff, currentFuelPriceINR: currentPrice, baseFuelPriceINR: basePrice },
      outputs: {
        fuelPriceDeltaPct: parseFloat((priceDeltaPct * 100).toFixed(2)),
        surchargeINR: parseFloat(surchargeINR.toFixed(2)),
        finalTariffINR: parseFloat(finalTariffINR.toFixed(2))
      },
      formulaBreakdown: [
        `1. Base Fuel Index = ₹${basePrice}/L, Current Price = ₹${currentPrice}/L (Delta: +${(priceDeltaPct * 100).toFixed(2)}%)`,
        `2. Fuel Pass-Through Ratio = 50% * ${(priceDeltaPct * 100).toFixed(2)}% = ${(surchageRatio * 100).toFixed(2)}%`,
        `3. Fuel Surcharge = ₹${tariff} * ${(surchageRatio * 100).toFixed(2)}% = ₹${surchargeINR.toFixed(2)}`,
        `4. Final Tariff = ₹${tariff} + ₹${surchargeINR.toFixed(2)} = ₹${finalTariffINR.toFixed(2)}`
      ]
    };
  }

  // 3. SLA Penalty Deduction Schema
  evaluateSlaPenalty({ delayHours, hourlyPenaltyINR = 2500, gracePeriodHours = 1 }) {
    const delay = parseFloat(delayHours) || 3.5;
    const penaltyRate = parseFloat(hourlyPenaltyINR) || 2500;
    const grace = parseFloat(gracePeriodHours) || 1;

    const billableDelayHours = Math.max(0, delay - grace);
    const totalPenaltyINR = billableDelayHours * penaltyRate;

    return {
      formulaType: 'SLA_PENALTY',
      timestamp: new Date().toISOString(),
      inputs: { delayHours: delay, hourlyPenaltyINR: penaltyRate, gracePeriodHours: grace },
      outputs: {
        billableDelayHours: parseFloat(billableDelayHours.toFixed(1)),
        totalPenaltyINR: parseFloat(totalPenaltyINR.toFixed(2)),
        penaltyWaived: billableDelayHours === 0
      },
      formulaBreakdown: [
        `1. Total Transit Delay = ${delay} hours, Grace Period = ${grace} hours`,
        `2. Billable Delay = max(0, ${delay} - ${grace}) = ${billableDelayHours} hours`,
        `3. SLA Penalty Rate = ₹${penaltyRate}/hour`,
        `4. Total Penalty Deduction = ${billableDelayHours} hrs * ₹${penaltyRate} = ₹${totalPenaltyINR.toFixed(2)}`
      ]
    };
  }

  // Generic Router
  evaluate(formulaType, inputs = {}) {
    switch (formulaType) {
      case 'NET_MARGIN':
        return this.evaluateNetMargin(inputs);
      case 'FUEL_SURCHARGE':
        return this.evaluateFuelSurcharge(inputs);
      case 'SLA_PENALTY':
        return this.evaluateSlaPenalty(inputs);
      default:
        return this.evaluateNetMargin(inputs);
    }
  }
}

const calculationEngineInstance = new CalculationEngine();
module.exports = { CalculationEngine: calculationEngineInstance };
