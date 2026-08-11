const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({ log: ['info'] });

async function main() {
  console.log('🌱 Seeding GatiFleet Enterprise Database (User Backend & Data Layer)...');

  // Clear existing records in correct order (child to parent)
  await prisma.auditLog.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.shipmentOrder.deleteMany();
  await prisma.fleetVehicle.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.user.deleteMany();
  await prisma.geofenceZone.deleteMany();
  await prisma.event.deleteMany();
  await prisma.entity.deleteMany();

  // --------------------------------------------------------
  // 1. USER BACKEND & AUTHENTICATION SEEDING
  // --------------------------------------------------------
  const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);
  const operatorPasswordHash = await bcrypt.hash('Operator@123456', 10);
  const driverPasswordHash = await bcrypt.hash('Driver@123456', 10);
  const customerPasswordHash = await bcrypt.hash('Customer@123456', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@gatifleet.in',
      password: adminPasswordHash,
      name: 'System Admin',
      phone: '+919999900001',
      role: 'ADMIN',
      status: 'ACTIVE',
      mfaEnabled: true,
      lastLoginAt: new Date()
    }
  });

  const operatorUser = await prisma.user.create({
    data: {
      email: 'operator@gatifleet.in',
      password: operatorPasswordHash,
      name: 'Fleet NOC Dispatcher',
      phone: '+919999900002',
      role: 'OPERATOR',
      status: 'ACTIVE',
      lastLoginAt: new Date()
    }
  });

  const driverUser = await prisma.user.create({
    data: {
      email: 'rajesh@gatifleet.in',
      password: driverPasswordHash,
      name: 'Rajesh Kumar',
      phone: '+919876543210',
      role: 'DRIVER',
      status: 'ACTIVE'
    }
  });

  const customerUser = await prisma.user.create({
    data: {
      email: 'tata.procurement@tatamotors.com',
      password: customerPasswordHash,
      name: 'Tata Motors Logistics',
      phone: '+919876543299',
      role: 'CUSTOMER',
      status: 'ACTIVE'
    }
  });

  console.log('✅ Users created successfully.');

  // API Keys
  await prisma.apiKey.create({
    data: {
      name: 'Production Live Telemetry API',
      keyHash: await bcrypt.hash('gf_live_pk_e42f', 5),
      prefix: 'gf_live_pk_',
      userId: adminUser.id,
      scope: 'read:telemetry,write:fleet,read:shipments',
      rateLimitMax: 5000,
      status: 'ACTIVE'
    }
  });

  await prisma.apiKey.create({
    data: {
      name: 'Salesforce CRM Partner Key',
      keyHash: await bcrypt.hash('gf_sec_sfdc_2f92', 5),
      prefix: 'gf_sec_sfdc_',
      userId: operatorUser.id,
      scope: 'read:shipments,write:shipments',
      rateLimitMax: 2000,
      status: 'ACTIVE'
    }
  });

  // Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: 'SYSTEM_BOOTSTRAP',
      entity: 'User',
      entityId: adminUser.id,
      details: JSON.stringify({ message: 'GatiFleet Enterprise DB Initialized' }),
      ipAddress: '127.0.0.1',
      userAgent: 'GatiFleet-Bootstrap/1.0'
    }
  });

  // --------------------------------------------------------
  // 2. DRIVERS & FLEET VEHICLES SEEDING
  // --------------------------------------------------------
  const driverRajesh = await prisma.driver.create({
    data: {
      userId: driverUser.id,
      fullName: 'Rajesh Kumar',
      phone: '+919876543210',
      licenseNo: 'DL-1420110092841',
      licenseExpiry: new Date('2029-12-31'),
      dutyStatus: 'DRIVING',
      fatigueScore: 18.0,
      safetyRating: 4.9,
      totalTrips: 142,
      totalDistance: 64200.5
    }
  });

  const driverVikram = await prisma.driver.create({
    data: {
      fullName: 'Vikram Singh',
      phone: '+919876543211',
      licenseNo: 'MH-1220150048291',
      licenseExpiry: new Date('2028-06-30'),
      dutyStatus: 'DRIVING',
      fatigueScore: 22.5,
      safetyRating: 4.8,
      totalTrips: 98,
      totalDistance: 41200.0
    }
  });

  const driverSunita = await prisma.driver.create({
    data: {
      fullName: 'Sunita Sharma',
      phone: '+919876543212',
      licenseNo: 'KA-0320180010294',
      licenseExpiry: new Date('2030-01-15'),
      dutyStatus: 'STANDBY',
      fatigueScore: 5.0,
      safetyRating: 5.0,
      totalTrips: 64,
      totalDistance: 28900.0
    }
  });

  // Vehicles
  const vehicle1 = await prisma.fleetVehicle.create({
    data: {
      registrationNo: 'DL-01-AX-9048',
      model: 'Tata Signa 5530.S',
      type: 'HEAVY_TRUCK',
      capacityTons: 55.0,
      fuelCapacityLiters: 400.0,
      fuelLevelPercent: 78.5,
      status: 'IN_TRANSIT',
      currentSpeed: 62.0,
      latitude: 28.6139,
      longitude: 77.2090,
      locationName: 'NH48 Corridor (Gurugram Toll)',
      odometerKm: 84200.0,
      healthScore: 96.8,
      driverId: driverRajesh.id
    }
  });

  const vehicle2 = await prisma.fleetVehicle.create({
    data: {
      registrationNo: 'MH-12-PQ-8821',
      model: 'Ashok Leyland 2820 Reefer',
      type: 'REEFER',
      capacityTons: 28.0,
      fuelCapacityLiters: 300.0,
      fuelLevelPercent: 64.0,
      status: 'IN_TRANSIT',
      currentSpeed: 58.0,
      latitude: 19.0760,
      longitude: 72.8777,
      locationName: 'Panvel Dock Hub',
      odometerKm: 52100.0,
      healthScore: 94.2,
      driverId: driverVikram.id
    }
  });

  const vehicle3 = await prisma.fleetVehicle.create({
    data: {
      registrationNo: 'KA-03-MN-1049',
      model: 'BharatBenz 3523R Container',
      type: 'CONTAINER',
      capacityTons: 35.0,
      fuelCapacityLiters: 350.0,
      fuelLevelPercent: 92.0,
      status: 'IDLE',
      currentSpeed: 0.0,
      latitude: 12.9716,
      longitude: 77.5946,
      locationName: 'Hoskote Depot',
      odometerKm: 31000.0,
      healthScore: 99.1,
      driverId: driverSunita.id
    }
  });

  console.log('✅ Vehicles & Drivers created successfully.');

  // --------------------------------------------------------
  // 3. SHIPMENT ORDERS, FUEL & MAINTENANCE SEEDING
  // --------------------------------------------------------
  await prisma.shipmentOrder.create({
    data: {
      orderNo: 'PO-928410',
      customerName: 'Tata Motors',
      cargoType: 'EV Battery Modules',
      cargoWeightKg: 24000.0,
      origin: 'Delhi Cargo Terminal',
      destination: 'Pune Chakan Plant',
      status: 'IN_TRANSIT',
      priceINR: 485000.0,
      costMarginINR: 112000.0,
      riskScore: 12.0,
      vehicleId: vehicle1.id,
      slaDeliveryDate: new Date(Date.now() + 86400000 * 2) // +2 days
    }
  });

  await prisma.shipmentOrder.create({
    data: {
      orderNo: 'PO-773912',
      customerName: 'Amul Dairy Chain',
      cargoType: 'Cold Chain Butter & Cheese',
      cargoWeightKg: 18000.0,
      origin: 'Anand Processing Hub',
      destination: 'Mumbai Vashi Market',
      status: 'DISPATCHED',
      priceINR: 210000.0,
      costMarginINR: 54000.0,
      riskScore: 8.5,
      vehicleId: vehicle2.id,
      slaDeliveryDate: new Date(Date.now() + 86400000 * 1) // +1 day
    }
  });

  // Fuel Logs
  await prisma.fuelLog.create({
    data: {
      vehicleId: vehicle1.id,
      driverId: driverRajesh.id,
      litersFilled: 120.0,
      costINR: 10680.0,
      stationName: 'IOCL Jaipur Plaza',
      odometerKm: 84050.0,
      isAnomaly: false
    }
  });

  // Maintenance Logs
  await prisma.maintenanceLog.create({
    data: {
      vehicleId: vehicle2.id,
      issueSummary: 'Reefer Cooling Compressor Sensor Calibration',
      workType: 'REEFER',
      costINR: 15400.0,
      status: 'COMPLETED',
      mechanicNotes: 'Replaced thermal sensor valve. System temperature nominal.',
      scheduledDate: new Date(Date.now() - 86400000 * 5),
      completedDate: new Date(Date.now() - 86400000 * 4)
    }
  });

  // Geofence Zones
  await prisma.geofenceZone.create({
    data: {
      name: 'Delhi Cargo Terminal Hub',
      type: 'DEPOT',
      coordinates: JSON.stringify({ lat: 28.6139, lng: 77.2090 }),
      radiusMeters: 1000.0,
      status: 'ACTIVE'
    }
  });

  await prisma.geofenceZone.create({
    data: {
      name: 'Panvel Maritime Dock Hub',
      type: 'PORT',
      coordinates: JSON.stringify({ lat: 18.9894, lng: 73.1175 }),
      radiusMeters: 1500.0,
      status: 'ACTIVE'
    }
  });

  // Events & Entities
  await prisma.event.create({
    data: {
      id: 'ev-0',
      timestamp: new Date(Date.now() - 30000),
      type: 'SHIPMENT_CREATED',
      desc: 'New EV Battery shipment order PO-928410 initialized for Delhi Depot.',
      source: 'SYS/CLIENT'
    }
  });

  await prisma.entity.create({
    data: {
      id: 'cust-102',
      type: 'customer',
      label: 'Tata Motors',
      state: 'active',
      relations: JSON.stringify(['ord-481']),
      riskScore: 12.0,
      performance: 98.4
    }
  });

  console.log('🚀 GatiFleet Enterprise DB Seeding Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
