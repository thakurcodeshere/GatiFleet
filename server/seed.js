const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ log: ['info'] });

async function main() {
  console.log('Seeding database...');
  
  // Layer 1: Event Capture Layer (L1 Event)
  const events = [
    { id: 'ev-0', timestamp: new Date(Date.now() - 30000).toISOString(), type: 'SHIPMENT_CREATED', desc: 'New shipment order initialized for Delhi Depot.', source: 'SYS/CLIENT' },
    { id: 'ev-1', timestamp: new Date(Date.now() - 25000).toISOString(), type: 'ROUTE_CHANGED', desc: 'Detour set to bypass NH48 due to flooding.', source: 'SYS/NOC' },
    { id: 'ev-2', timestamp: new Date(Date.now() - 20000).toISOString(), type: 'HARSH_BRAKE', desc: 'ADAS Warning: Harsh brake detected for TRK-90482 on NH27. G-Force: 0.85G.', source: 'TRK-90482/ADAS' },
    { id: 'ev-3', timestamp: new Date(Date.now() - 15000).toISOString(), type: 'INVOICE_APPROVED', desc: 'Invoice INV-90481 approved by consignee. Settle ledger active.', source: 'ERP/LEDGER' }
  ];

  // Layer 2: Universal Entity Layer (L2 Entity)
  const entities = {
    customer: { id: 'cust-102', label: 'Tata Motors', state: 'active', relations: ['ord-481'], riskScore: 12, performance: 98.4 },
    order: { id: 'ord-481', label: 'PO-928410', state: 'processing', relations: ['shp-90481'], riskScore: 8, performance: 100 },
    shipment: { id: 'shp-90481', label: 'SHP-CT-90481', state: 'in_transit', relations: ['trk-90482', 'wh-12'], riskScore: 15, performance: 94.2 },
    truck: { id: 'trk-90482', label: 'TRK-90482', state: 'active', relations: ['drv-1209', 'car-01'], riskScore: 10, performance: 96.8 },
    driver: { id: 'drv-1209', label: 'Rajesh Kumar', state: 'driving', relations: ['rt-nh48'], riskScore: 18, performance: 91.2 },
    route: { id: 'rt-nh48', label: 'Delhi-Mumbai NH48', state: 'nominal', relations: ['fuel-22', 'toll-98'], riskScore: 22, performance: 88.5 },
    fuel: { id: 'fuel-22', label: 'IOCL Jaipur Refuel', state: 'active', relations: [], riskScore: 5, performance: 100 },
    toll: { id: 'toll-98', label: 'FASTag FT8248', state: 'active', relations: [], riskScore: 8, performance: 99.1 },
    warehouse: { id: 'wh-12', label: 'Panvel Dock Hub', state: 'nominal', relations: [], riskScore: 14, performance: 95.0 },
    carrier: { id: 'car-01', label: 'BlueDart Trans', state: 'active', relations: [], riskScore: 11, performance: 96.2 },
    invoice: { id: 'inv-904', label: 'INV-90481', state: 'generated', relations: ['pay-42'], riskScore: 4, performance: 100 },
    payment: { id: 'pay-42', label: 'ZKP Ledger Settle', state: 'pending', relations: [], riskScore: 3, performance: 100 }
  };

  // Clear existing
  await prisma.event.deleteMany();
  await prisma.entity.deleteMany();

  // Insert events
  for (const ev of events) {
    await prisma.event.create({
      data: {
        id: ev.id,
        timestamp: new Date(ev.timestamp),
        type: ev.type,
        desc: ev.desc,
        source: ev.source
      }
    });
  }

  // Insert entities
  for (const [type, ent] of Object.entries(entities)) {
    await prisma.entity.create({
      data: {
        id: ent.id,
        type: type,
        label: ent.label,
        state: ent.state,
        relations: JSON.stringify(ent.relations || []),
        riskScore: ent.riskScore,
        performance: ent.performance
      }
    });
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
