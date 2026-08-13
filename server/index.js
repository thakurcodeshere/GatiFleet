const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const http = require('http');
const { Server } = require('socket.io');
const NodeCache = require('node-cache');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const morgan = require('morgan');
const logger = require('./logger');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { UnifiedNeuralNetworkEngine } = require('./neuralNetwork');
const { dispatchJob, getJobStatus } = require('./worker');
const { EventTaxonomyEngine, EVENT_TYPES, AUTONOMY_LEVELS } = require('./eventTaxonomy');
const { PolicyKernelEngine } = require('./policyKernel');
const { WorldModelEngine } = require('./worldModelEngine');
const { AgentConsensusEngine } = require('./agentConsensusEngine');
const { IntelligenceLoopEngine } = require('./intelligenceLoopEngine');
const { KnowledgeGraphEngine } = require('./knowledgeGraphEngine');
const { CalculationEngine } = require('./calculationEngine');
const { DigitalTwinBrainEngine } = require('./digitalTwinBrainEngine');
const { StateMachineEngine } = require('./stateMachineEngine');
const { DoubleTimelineLedger } = require('./doubleTimelineLedger');
const { IntegrationEcosystemEngine } = require('./integrationEcosystemEngine');
const { EvolutionMatrixEngine } = require('./evolutionMatrixEngine');

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, { cors: { origin: '*' } });

// Initialize Cache
const myCache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'gatisecret_super_safe_zero_cost';

app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Global Rate Limiter to prevent abuse (GitHub Code Scanning Alert Fix)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(apiLimiter); // Apply globally to all routes so CodeQL definitively resolves it

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Initialize Intelligence Engine
// Pass a mock state holder since it expects RealityEngine context
const intelligenceEngine = new UnifiedNeuralNetworkEngine({
  events: [],
  entities: {},
  kgOntology: {},
  calculationEngines: {},
  policyRegistry: {},
  agentRegistry: {}
});

// --- AUTHENTICATION MIDDLEWARE ---
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
}

// --- AUTH ROUTES ---
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });
    
    // Create JWT payload
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
    
    res.json({ token, user: payload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// --- CACHED DATA ROUTES ---
app.get('/api/events', async (req, res) => {
  try {
    const cacheKey = 'all_events';
    let events = myCache.get(cacheKey);

    if (!events) {
      events = await prisma.event.findMany({ orderBy: { timestamp: 'desc' }, take: 50 });
      myCache.set(cacheKey, events);
    }
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.get('/api/entities', async (req, res) => {
  try {
    const cacheKey = 'all_entities';
    let grouped = myCache.get(cacheKey);

    if (!grouped) {
      const allEntities = await prisma.entity.findMany();
      grouped = {};
      allEntities.forEach(ent => {
        grouped[ent.type] = {
          id: ent.id,
          label: ent.label,
          state: ent.state,
          relations: JSON.parse(ent.relations),
          riskScore: ent.riskScore,
          performance: ent.performance
        };
      });
      myCache.set(cacheKey, grouped);
    }
    res.json(grouped);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch entities' });
  }
});

// Create a new event (Protected Route)
// Create a new L1 Taxonomy-Validated Event (Protected Route)
app.post('/api/events', authenticateToken, async (req, res) => {
  const { type, desc, source, payload, autonomyLevel, financialExposureINR, riskScore, confidence } = req.body;
  
  // 1. Validate event against L1 Event Taxonomy
  const validation = EventTaxonomyEngine.validateEvent({
    id: req.body.id,
    type,
    desc,
    source,
    payload,
    autonomyLevel
  });

  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const validEvent = validation.event;

  // 2. Evaluate Policy Kernel Permissions
  const policyCheck = PolicyKernelEngine.evaluateActionPermission({
    agentId: source,
    actionType: type,
    autonomyLevel: validEvent.autonomyLevel,
    financialExposureINR: financialExposureINR || 0,
    riskScore: riskScore || 0,
    confidence: confidence || 1.0
  });

  if (!policyCheck.authorized) {
    // Log policy violation event
    const violationEvent = {
      id: `ev-viol-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: EVENT_TYPES.POLICY_VIOLATED,
      desc: `Blocked action [${type}]: ${policyCheck.reason}`,
      source: 'SYS/POLICY_KERNEL'
    };
    io.emit('policy_violated', violationEvent);
    return res.status(403).json({ error: policyCheck.reason, code: policyCheck.errorCode, violationEvent });
  }

  try {
    const newEvent = await prisma.event.create({
      data: {
        id: validEvent.id,
        timestamp: new Date(validEvent.timestamp),
        type: validEvent.type,
        desc: validEvent.desc,
        source: validEvent.source
      }
    });
    
    myCache.del('all_events');
    io.emit('new_event', { ...newEvent, fullPayload: validEvent });
    res.status(201).json(newEvent);
  } catch (error) {
    logger.error('Failed to create event: ' + error.message);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// --- GOVERNANCE & SECURITY KERNEL ROUTES ---
app.get('/api/governance/kill-switch', (req, res) => {
  res.json(PolicyKernelEngine.getKillSwitchStatus());
});

app.post('/api/governance/kill-switch', authenticateToken, async (req, res) => {
  const { active, reason } = req.body;
  const operatorId = req.user ? req.user.email : 'ADMIN';
  
  const status = PolicyKernelEngine.toggleKillSwitch(active, operatorId, reason);
  
  // Record L1 Event
  const killSwitchEvent = {
    id: `ev-ks-${Date.now()}`,
    timestamp: new Date(),
    type: EVENT_TYPES.KILL_SWITCH_TOGGLED,
    desc: `Universal Agent Kill Switch ${status.killSwitchActive ? 'ACTIVATED (PAUSED DISPATCHES)' : 'DEACTIVATED (DISPATCHES RESTORED)'}. Operator: ${operatorId}. Reason: ${reason || 'N/A'}`,
    source: 'SYS/GUARD'
  };

  try {
    await prisma.event.create({ data: killSwitchEvent });
    myCache.del('all_events');
  } catch (e) {
    console.error('Failed to write kill switch log', e);
  }

  io.emit('kill_switch_toggled', { ...status, event: killSwitchEvent });
  res.json({ message: 'Kill switch updated', ...status });
});

app.post('/api/governance/evaluate', authenticateToken, (req, res) => {
  const evaluation = PolicyKernelEngine.evaluateActionPermission(req.body);
  res.json(evaluation);
});

// --- LAW 1: CANONICAL 3-WAY STATE RECONCILIATION ROUTE ---
app.post('/api/reconcile', authenticateToken, async (req, res) => {
  try {
    const [eventsCount, vehiclesCount, driversCount, shipmentsCount] = await Promise.all([
      prisma.event.count(),
      prisma.fleetVehicle.count(),
      prisma.driver.count(),
      prisma.shipmentOrder.count()
    ]);

    const killSwitch = PolicyKernelEngine.getKillSwitchStatus();

    const reconciledState = {
      timestamp: new Date().toISOString(),
      status: 'CANONICAL_RECONCILED',
      killSwitchActive: killSwitch.killSwitchActive,
      ledger: {
        eventsCount,
        vehiclesCount,
        driversCount,
        shipmentsCount
      },
      truthHierarchy: {
        location: 'GPS_IOT_EDGE',
        financials: 'EXECUTABLE_CALCULATION_ENGINE',
        identity: 'RBAC_SECURITY_KERNEL',
        governance: 'POLICY_AS_CODE'
      }
    };

    io.emit('state_reconciled', reconciledState);
    res.json(reconciledState);
  } catch (error) {
    res.status(500).json({ error: 'Reconciliation failed' });
  }
});

// --- PLANE 6: SPATIO-TEMPORAL WORLD MODEL API ROUTES ---
app.get('/api/world-model/twins', async (req, res) => {
  try {
    const [vehicles, drivers] = await Promise.all([
      prisma.fleetVehicle.findMany(),
      prisma.driver.findMany()
    ]);

    const vehicleTwins = vehicles.map(v => WorldModelEngine.synthesizeDigitalTwin('VEHICLE', v));
    const driverTwins = drivers.map(d => WorldModelEngine.synthesizeDigitalTwin('DRIVER', d));
    const anomalies = WorldModelEngine.detectSpatioTemporalAnomalies(vehicles);

    res.json({
      timestamp: new Date().toISOString(),
      counts: {
        vehicles: vehicleTwins.length,
        drivers: driverTwins.length,
        anomalies: anomalies.length
      },
      twins: {
        vehicles: vehicleTwins,
        drivers: driverTwins
      },
      anomalies
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to synthesize World Model Digital Twins' });
  }
});

app.post('/api/world-model/query', async (req, res) => {
  try {
    const vehicles = await prisma.fleetVehicle.findMany();
    const queryResults = WorldModelEngine.querySpatioTemporalResources(vehicles, req.body);
    res.json(queryResults);
  } catch (err) {
    res.status(500).json({ error: 'Spatio-Temporal Query failed' });
  }
});

// --- PLANE 3: AGENT PLANE & MULTI-AGENT CONSENSUS API ROUTES ---
app.get('/api/agents/registry', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    agents: AgentConsensusEngine.getAgentsRegistry()
  });
});

app.post('/api/agents/autonomy', authenticateToken, (req, res) => {
  const { agentId, autonomyLevel } = req.body;
  try {
    const updated = AgentConsensusEngine.setAgentAutonomyLevel(agentId, autonomyLevel);
    
    // Notify Socket.io
    io.emit('agent_autonomy_updated', updated);

    // Write audit event
    prisma.event.create({
      data: {
        id: `ev-autonomy-${Date.now()}`,
        timestamp: new Date(),
        type: EVENT_TYPES.AUTONOMY_MODIFIED,
        desc: `Agent [${agentId}] autonomy level set to [${autonomyLevel}] by ${req.user ? req.user.email : 'ADMIN'}`,
        source: 'SYS/GOVERNANCE'
      }
    }).catch(e => console.error('Failed to log autonomy event', e));

    res.json({ message: 'Autonomy updated successfully', ...updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/agents/consensus', authenticateToken, async (req, res) => {
  try {
    const consensusResult = AgentConsensusEngine.executeMultiAgentConsensus(req.body);
    
    // Broadcast consensus event via Socket.io
    io.emit('multi_agent_consensus', consensusResult);

    // Record consensus event in DB
    const event = await prisma.event.create({
      data: {
        id: `ev-consensus-${Date.now()}`,
        timestamp: new Date(),
        type: 'MULTI_AGENT_CONSENSUS',
        desc: `Consensus protocol executed for task [${consensusResult.title}]: ${consensusResult.status} (Confidence: ${consensusResult.consensusConfidence})`,
        source: 'SYS/CONSENSUS_ENGINE'
      }
    });

    myCache.del('all_events');
    res.json({ ...consensusResult, event });
  } catch (err) {
    res.status(500).json({ error: 'Multi-Agent Consensus evaluation failed' });
  }
});

// --- PLANE 1: INTELLIGENCE & LEARNING LOOP API ROUTES ---
app.get('/api/intelligence/learning-stats', (req, res) => {
  res.json(IntelligenceLoopEngine.getLearningStats());
});

app.post('/api/intelligence/evaluate-outcome', authenticateToken, (req, res) => {
  const operatorId = req.user ? req.user.email : 'AI-SYSTEM';
  const evaluation = IntelligenceLoopEngine.evaluateOutcome({ ...req.body, operatorId });
  
  io.emit('outcome_evaluated', evaluation);
  res.json(evaluation);
});

// --- PLANE 4: KNOWLEDGE GRAPH API ROUTES ---
app.get('/api/kg/graph', (req, res) => {
  res.json(KnowledgeGraphEngine.getGraph());
});

app.post('/api/kg/impact', (req, res) => {
  const { entityId } = req.body;
  if (!entityId) return res.status(400).json({ error: 'entityId is required' });

  const impactAnalysis = KnowledgeGraphEngine.findCascadeImpact(entityId);
  res.json(impactAnalysis);
});

// --- PLANE 7: EXECUTABLE CALCULATION ENGINE API ROUTES ---
app.post('/api/calculations/evaluate', (req, res) => {
  const { formulaType, inputs } = req.body;
  if (!formulaType) return res.status(400).json({ error: 'formulaType is required' });

  const result = CalculationEngine.evaluate(formulaType, inputs);
  res.json(result);
});

// --- PLANE 2: DIGITAL TWIN 6-BRAIN COGNITIVE API ROUTES ---
app.get('/api/twins/brains/:id', async (req, res) => {
  try {
    const entityId = req.params.id;
    const customer = await prisma.entity.findUnique({ where: { id: entityId } }).catch(() => null);
    const schema = DigitalTwinBrainEngine.getSixBrainSchema(entityId, customer || {});
    res.json(schema);
  } catch (err) {
    res.status(500).json({ error: 'Failed to synthesize 6-Brain Digital Twin' });
  }
});

// --- PLANE 5: CANONICAL STATE MACHINE API ROUTES ---
app.get('/api/state-machine/schema', (req, res) => {
  res.json(StateMachineEngine.getSchema());
});

app.post('/api/state-machine/transition', authenticateToken, async (req, res) => {
  try {
    const operatorId = req.user ? req.user.email : 'AI-SYSTEM';
    const transition = StateMachineEngine.transitionState({ ...req.body, operatorId });

    // Emit L1 Event
    const stateEvent = await prisma.event.create({
      data: {
        id: `ev-state-${Date.now()}`,
        timestamp: new Date(),
        type: transition.l1EventEmitted,
        desc: `Entity [${transition.entityId}] transitioned state from [${transition.previousState}] to [${transition.newState}]. Reason: ${transition.reason}`,
        source: 'SYS/STATE_MACHINE'
      }
    });

    myCache.del('all_events');
    io.emit('state_transitioned', { ...transition, event: stateEvent });
    res.json({ message: 'State transitioned successfully', ...transition, event: stateEvent });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- PLANE 9: DOUBLE TIMELINE MEMORY LEDGER API ROUTES ---
app.get('/api/ledger/double-timeline/:id', (req, res) => {
  res.json(DoubleTimelineLedger.getDoubleTimeline(req.params.id));
});

app.post('/api/ledger/decision-journal', authenticateToken, (req, res) => {
  const operatorId = req.user ? req.user.email : 'AI-SYSTEM';
  const journal = DoubleTimelineLedger.logDecisionJournal({ ...req.body, operatorId });
  
  io.emit('decision_journal_logged', journal);
  res.json(journal);
});

// --- PLANE 11: INTEGRATION & ECOSYSTEM INTEROPERABILITY API ROUTES ---
app.get('/api/integration/adapters', (req, res) => {
  res.json(IntegrationEcosystemEngine.getAdapters());
});

app.post('/api/integration/webhook/dispatch', authenticateToken, (req, res) => {
  const dispatched = IntegrationEcosystemEngine.dispatchWebhook(req.body);
  res.json(dispatched);
});

// --- PLANE 12: SELF-EVOLUTION MATRIX & GENETIC POLICY MUTATION API ROUTES ---
app.get('/api/evolution/matrix', (req, res) => {
  res.json(EvolutionMatrixEngine.getEvolutionMatrix());
});

app.post('/api/evolution/mutate-policy', authenticateToken, (req, res) => {
  try {
    const mutation = EvolutionMatrixEngine.mutatePolicy(req.body);
    
    // Broadcast evolution mutation event
    io.emit('policy_mutated', mutation);
    res.json(mutation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- STORAGE TIER ---
// Upload a file (Protected Route)
app.post('/api/upload', authenticateToken, upload.single('document'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  
  // Return the public URL for the uploaded file
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(201).json({
    message: 'File uploaded successfully',
    fileUrl: fileUrl,
    filename: req.file.filename
  });
});

// --- BACKGROUND JOB & WORKER TIER ---
app.post('/api/jobs', authenticateToken, (req, res) => {
  const { type, payload } = req.body;
  if (!type) return res.status(400).json({ error: 'Job type is required' });
  
  const jobId = dispatchJob(type, payload);
  res.status(202).json({ message: 'Job accepted', jobId });
});

app.get('/api/jobs/:id', authenticateToken, (req, res) => {
  const status = getJobStatus(req.params.id);
  res.json(status);
});

// --- MONITORING & OBSERVABILITY TIER ---
app.get('/api/admin/logs', authenticateToken, (req, res) => {
  try {
    const logPath = path.join(__dirname, 'logs', 'combined.log');
    if (fs.existsSync(logPath)) {
      // Read the last 100 lines or just stream it back
      const logs = fs.readFileSync(logPath, 'utf8').split('\n').slice(-100).join('\n');
      res.send(logs);
    } else {
      res.send('No logs found.');
    }
  } catch (error) {
    logger.error('Failed to read logs: ' + error.message);
    res.status(500).json({ error: 'Failed to read logs' });
  }
});

// --- REAL-TIME SIMULATOR WITH INTELLIGENCE ENGINE ---
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
});

setInterval(async () => {
  if (io.engine.clientsCount === 0) return; 

  const newEventData = {
    id: `ev-${Date.now()}`,
    timestamp: new Date(),
    type: 'TELEMETRY_SYNC',
    desc: 'GPS pin synced for SHP-CT-90481. Speed: 62 km/h.',
    source: 'Edge/IoT'
  };

  try {
    // 1. Log event
    const dbEvent = await prisma.event.create({ data: newEventData });
    myCache.del('all_events'); 
    io.emit('telemetry_update', dbEvent); 

    // 2. Feed event to Intelligence Engine to trigger AI evaluations
    intelligenceEngine.dispatchEvent('TELEMETRY_SYNC', {
      desc: 'Live edge sensors telemetry sync',
      fatigueIndex: 22,
      module: 'M7'
    });

  } catch (err) {
    console.error("Simulation error", err);
  }
}, 5000);

server.listen(PORT, () => {
  console.log(`GatiFleet Backend running on http://localhost:${PORT}`);
});
