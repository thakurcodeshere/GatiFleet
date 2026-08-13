// ============================================================
// GatiFleet OS — Plane 6: Spatio-Temporal World Model Engine
// Principles: 3, 4, 20, 301–310, 361–370 | Law 1: One Reality
// ============================================================

class WorldModelEngine {
  constructor() {
    this.lastReconciliationTime = new Date().toISOString();
  }

  // Calculate distance between two lat/lng points using Haversine formula (km)
  calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Synthesize 5-Dimensional Digital Twin Schema for an asset/entity
  synthesizeDigitalTwin(entityType, rawRecord) {
    const now = new Date();
    
    if (entityType === 'VEHICLE') {
      return {
        id: `twin-v-${rawRecord.id}`,
        entityId: rawRecord.id,
        entityType: 'VEHICLE',
        regNo: rawRecord.regNo,
        brains: {
          physical: {
            telemetryFreshnessSec: Math.floor(Math.random() * 5) + 1,
            lat: rawRecord.lat || 19.0760,
            lng: rawRecord.lng || 72.8777,
            speedKmh: rawRecord.speed || 58.4,
            headingDeg: rawRecord.heading || 142,
            fuelLevelPct: rawRecord.fuelLevel || 78.5,
            tyrePressurePsi: 110,
            engineTempC: 88,
            odometerKm: 142500,
            hardwareStatus: 'NOMINAL'
          },
          operational: {
            status: rawRecord.status || 'EN_ROUTE',
            activeRoute: rawRecord.route || 'NH48 Mumbai - Pune Corridor',
            eta: new Date(now.getTime() + 120 * 60000).toISOString(),
            assignedDriverId: rawRecord.driverId || 'DRV-001',
            slaComplianceIndex: 98.4,
            delayRisk: 'LOW'
          },
          financial: {
            accumulatedTripCostINR: 18450,
            fuelExpenseINR: 12200,
            tollExpenseINR: 1450,
            maintenanceReserveINR: 4800,
            netMarginContributionPct: 24.2
          },
          behavioral: {
            driverFatigueScore: 18.5,
            harshBrakingIncidentsToday: 0,
            speedingViolationsToday: 0,
            driverSafetyIndex: 96.8
          },
          risk: {
            mechanicalFailureProb: 0.04,
            weatherDisruptionRisk: 0.12,
            overallRiskScore: 14.5
          }
        },
        reconciledAt: now.toISOString()
      };
    }

    if (entityType === 'DRIVER') {
      return {
        id: `twin-d-${rawRecord.id}`,
        entityId: rawRecord.id,
        entityType: 'DRIVER',
        name: rawRecord.name,
        brains: {
          physical: {
            hoursOfServiceToday: rawRecord.hoursActive || 6.5,
            restBreakRequiredInMin: 90,
            microsleepAlerts: 0,
            fitnessStatus: 'FIT_FOR_DUTY'
          },
          operational: {
            assignedVehicleId: rawRecord.assignedVehicleId || 'TRK-001',
            completedTrips: rawRecord.tripsCount || 142,
            onTimeDeliveryRatePct: 97.6
          },
          financial: {
            monthlyEarningsINR: 42500,
            safetyBonusEarnedINR: 3800,
            fuelSavingsBonusINR: 1400
          },
          behavioral: {
            routeFamiliarityScore: 94.0,
            ecoDrivingGrade: 'A+',
            complianceRatingPct: 98.2
          },
          risk: {
            fatigueRiskIndex: 18.2,
            licenseExpiryDaysRemaining: rawRecord.licExpiryDays || 340
          }
        },
        reconciledAt: now.toISOString()
      };
    }

    return {
      id: `twin-gen-${rawRecord.id || Date.now()}`,
      entityId: rawRecord.id || 'GENERIC',
      entityType: entityType,
      reconciledAt: now.toISOString()
    };
  }

  // Spatio-Temporal Query Solver (Plane 6 Core Query Engine)
  querySpatioTemporalResources(dbVehicles, { centerLat, centerLng, radiusKm = 50, vehicleType, status }) {
    const centerLatNum = parseFloat(centerLat) || 19.0760;
    const centerLngNum = parseFloat(centerLng) || 72.8777;
    const radiusKmNum = parseFloat(radiusKm) || 50;

    const matchedVehicles = dbVehicles.filter(v => {
      const vLat = v.lat || 19.0760;
      const vLng = v.lng || 72.8777;
      const dist = this.calculateHaversineDistance(centerLatNum, centerLngNum, vLat, vLng);

      if (dist > radiusKmNum) return false;
      if (vehicleType && v.type && v.type.toLowerCase() !== vehicleType.toLowerCase()) return false;
      if (status && v.status && v.status.toLowerCase() !== status.toLowerCase()) return false;
      return true;
    }).map(v => {
      const dist = this.calculateHaversineDistance(centerLatNum, centerLngNum, v.lat || 19.0760, v.lng || 72.8777);
      return {
        ...v,
        distanceFromCenterKm: parseFloat(dist.toFixed(2)),
        digitalTwin: this.synthesizeDigitalTwin('VEHICLE', v)
      };
    });

    return {
      timestamp: new Date().toISOString(),
      queryParameters: { centerLat: centerLatNum, centerLng: centerLngNum, radiusKm: radiusKmNum, vehicleType, status },
      resultsCount: matchedVehicles.length,
      resources: matchedVehicles
    };
  }

  // Real-Time Anomaly Scanner
  detectSpatioTemporalAnomalies(vehicles) {
    const anomalies = [];
    vehicles.forEach(v => {
      if (v.speed > 110) {
        anomalies.push({
          vehicleId: v.id,
          regNo: v.regNo,
          type: 'SPEED_ANOMALY',
          severity: 'HIGH',
          desc: `Vehicle ${v.regNo} speed ${v.speed} km/h exceeds 110 km/h threshold.`
        });
      }
      if (v.fuelLevel < 15 && v.status === 'EN_ROUTE') {
        anomalies.push({
          vehicleId: v.id,
          regNo: v.regNo,
          type: 'LOW_FUEL_CRITICAL',
          severity: 'MEDIUM',
          desc: `Vehicle ${v.regNo} en-route with critically low fuel (${v.fuelLevel}%).`
        });
      }
    });
    return anomalies;
  }
}

const worldModelEngineInstance = new WorldModelEngine();
module.exports = { WorldModelEngine: worldModelEngineInstance };
