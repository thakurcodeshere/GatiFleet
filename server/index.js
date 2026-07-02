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
require('dotenv').config();

const { UnifiedNeuralNetworkEngine } = require('./neuralNetwork');
const { dispatchJob, getJobStatus } = require('./worker');

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
app.post('/api/events', authenticateToken, async (req, res) => {
  const { id, type, desc, source } = req.body;
  try {
    const newEvent = await prisma.event.create({
      data: {
        id: id || `ev-${Date.now()}`,
        timestamp: new Date(),
        type,
        desc,
        source
      }
    });
    
    myCache.del('all_events');
    io.emit('new_event', newEvent);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
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
