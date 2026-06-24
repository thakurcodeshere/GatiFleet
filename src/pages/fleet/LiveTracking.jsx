/* eslint-disable */
// ============================================================
// GatiFleet — Futuristic Transportation Intelligence Command Center (2035 Digital Twin)
// India's Logistics Network Operating System (Samsara-Grade Command Tower)
// ============================================================

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck, Search, MapPin, Navigation, Phone, ShieldAlert,
  Compass, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw,
  Layers, Bell, AlertTriangle, Play, Pause, RefreshCw, X,
  Activity, PauseCircle, Wrench, WifiOff, Fuel, Clock, Gauge, ArrowRight,
  Sparkles, Terminal, Shield, Lock, Unlock, Thermometer, Weight, Zap, Volume2,
  FileText, CheckCircle, BarChart3, Database, Cpu, User, Share2, HelpCircle, Send, Award
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { generateTrucks, generateDrivers, generateShipments, CITIES } from '../../data/mockData';

// ---- Module-level static data enrichment ----
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const ALL_TRUCKS = generateTrucks(50).map((t, idx) => {
  const coolantTemp = t.healthScore < 70 ? 118 : Math.floor(Math.random() * (95 - 80 + 1)) + 80;
  const tirePressure = t.healthScore < 70 ? 82 : Math.floor(Math.random() * (135 - 110 + 1)) + 110;
  const brakeWear = t.healthScore < 70 ? 84 : Math.floor(Math.random() * (55 - 20 + 1)) + 20;
  const axleVibration = t.healthScore < 70 ? 'Critical' : 'Normal';
  const refrigTemp = Math.floor(Math.random() * (8 - (-4) + 1)) - 4; // Cold chain temp
  const cargoWeight = Math.floor(Math.random() * (24 - 12 + 1)) + 12; // Tonnes
  const doorLocked = true;

  // Add state coordinate routes
  const routePoints = [
    [t.lat, t.lng],
    [t.lat + (Math.random() - 0.5) * 4, t.lng + (Math.random() - 0.5) * 4]
  ];

  return {
    ...t,
    coolantTemp,
    tirePressure,
    brakeWear,
    axleVibration,
    refrigTemp,
    cargoWeight,
    doorLocked,
    routePoints,
    rerouted: false
  };
});

const ALL_DRIVERS = generateDrivers(30);
const ALL_SHIPMENTS = generateShipments(30).map((s, idx) => {
  const progress = rand(15, 85);
  const etaConfidence = rand(65, 99);
  const milestones = [
    { label: 'Booked', date: 'June 21, 10:14', done: true },
    { label: 'Loaded', date: 'June 21, 14:32', done: true },
    { label: 'Dispatched', date: 'June 22, 08:00', done: true },
    { label: 'Checkpoint (Toll)', date: 'June 23, 11:45', done: progress > 60 },
    { label: 'Delivered (ETA)', date: 'June 24, 18:30 (Predicted)', done: false }
  ];
  return {
    ...s,
    progress,
    etaConfidence,
    milestones
  };
});

// ---- CORRIDOR DATA ----
const CORRIDORS = [
  { id: 'c1', name: 'Western Corridor (Delhi → Mumbai)', coords: [[28.6139, 77.2090], [23.5, 73.5], [19.0760, 72.8777]], capacity: '82%', congestion: 'Moderate', profitability: '₹14.2L/day', reliability: '94.2%', speed: '72 km/h' },
  { id: 'c2', name: 'Southern Corridor (Mumbai → Chennai)', coords: [[19.0760, 72.8777], [15.5, 77.5], [13.0827, 80.2707]], capacity: '64%', congestion: 'Low', profitability: '₹11.8L/day', reliability: '96.8%', speed: '78 km/h' },
  { id: 'c3', name: 'Eastern Corridor (Kolkata → Guwahati)', coords: [[22.5726, 88.3639], [25.0, 89.0], [26.1445, 91.7362]], capacity: '91%', congestion: 'High (Siliguri Bottleneck)', profitability: '₹9.4L/day', reliability: '82.5%', speed: '48 km/h' }
];

// ---- REGIONAL SENSORS AND LOGISTICS TARGETS ----
const REGIONS = [
  { name: 'Western India', lat: 21.0, lng: 73.5, fleetCount: 148230, utilization: 92.1, riskScore: 12, cashPos: '₹42.2Cr', activeSOS: 1 },
  { name: 'Northern India', lat: 29.5, lng: 76.0, fleetCount: 136420, utilization: 88.6, riskScore: 18, cashPos: '₹36.8Cr', activeSOS: 0 },
  { name: 'Southern India', lat: 12.5, lng: 78.5, fleetCount: 124890, utilization: 86.3, riskScore: 9, cashPos: '₹32.4Cr', activeSOS: 0 },
  { name: 'Eastern India', lat: 23.5, lng: 86.0, fleetCount: 78560, utilization: 81.2, riskScore: 32, cashPos: '₹19.8Cr', activeSOS: 2 },
  { name: 'Central India', lat: 22.0, lng: 79.0, fleetCount: 62340, utilization: 84.7, riskScore: 15, cashPos: '₹15.6Cr', activeSOS: 0 },
  { name: 'North-East India', lat: 26.0, lng: 92.5, fleetCount: 18240, utilization: 72.4, riskScore: 45, cashPos: '₹4.2Cr', activeSOS: 1 }
];

// ---- Status configurations ----
const STATUS_CONFIG = {
  active: { label: 'Active', color: '#38CE3C', bg: 'rgba(56, 206, 60, 0.12)', icon: Activity },
  idle: { label: 'Idle', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', icon: PauseCircle },
  maintenance: { label: 'Maintenance', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)', icon: Wrench },
  offline: { label: 'Offline', color: '#64748b', bg: 'rgba(100, 116, 139, 0.12)', icon: WifiOff },
};

// ---- Get curved route coordinate tracer ----
const getCurvedPath = (fromLatLng, toLatLng) => {
  const lat1 = fromLatLng[0];
  const lng1 = fromLatLng[1];
  const lat2 = toLatLng[0];
  const lng2 = toLatLng[1];
  const midLat = (lat1 + lat2) / 2 + (lng2 - lng1) * 0.15;
  const midLng = (lng1 + lng2) / 2 - (lat2 - lat1) * 0.15;
  return [fromLatLng, [midLat, midLng], toLatLng];
};

export default function LiveTracking() {
  const [activeView, setActiveView] = useState('nation'); // nation | regional | fleet | shipment | driver | decision | executive
  const [trucks, setTrucks] = useState(ALL_TRUCKS);
  const [drivers, setDrivers] = useState(ALL_DRIVERS);
  const [shipments, setShipments] = useState(ALL_SHIPMENTS);

  const [selectedTruck, setSelectedTruck] = useState(ALL_TRUCKS[0]);
  const [selectedDriver, setSelectedDriver] = useState(ALL_DRIVERS[0]);
  const [selectedShipment, setSelectedShipment] = useState(ALL_SHIPMENTS[0]);
  const [selectedSubsystem, setSelectedSubsystem] = useState('engine'); // engine | tyre | cargo | cabin

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionAlert, setActionAlert] = useState(null);

  // Command modes: reduce_cost | maximize_eta | minimize_risk
  const [commandMode, setCommandMode] = useState('maximize_eta');

  // Layer switches
  const [mapLayers, setMapLayers] = useState({
    demand: false,
    density: true,
    risk: false,
    weather: true,
    traffic: true,
    fuel: false
  });

  // Time Machine States
  const [timeSliderVal, setTimeSliderVal] = useState(0); // 0 = Live, 1 = +1h, 6 = +6h, 24 = +24h
  const [isTimeMachineActive, setIsTimeMachineActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // AI Decision States
  const [autonomySlider, setAutonomySlider] = useState(25); // percentage
  const [savingsCounter, setSavingsCounter] = useState(4200000); // ₹42 Lakhs initial
  const [approvedRecommendations, setApprovedRecommendations] = useState([]);
  const [terminalLogs, setTerminalLogs] = useState([
    'Initializing edge cognition pipeline...',
    'Sub-network telemetry synchronized.',
    'Autonomy status: Sentinel Mode (Active approvals required).'
  ]);

  // Executive AI Copilot chat state
  const [copilotOpen, setCopilotOpen] = useState(true);
  const [copilotInput, setCopilotInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copilotMsgs, setCopilotMsgs] = useState([
    { sender: 'copilot', text: "Welcome to GatiFleet Command Tower. I am your Executive Copilot. What logistics decisions should be optimized today?" }
  ]);

  // SOS States
  const [activeSosTruckId, setActiveSosTruckId] = useState(null);
  const [sosInterventions, setSosInterventions] = useState([]);

  // Telemetry simulation rates
  const [telemetryPingRate, setTelemetryPingRate] = useState('auto');
  const [lastPingTime, setLastPingTime] = useState('Just now');
  const [mouseCoords, setMouseCoords] = useState({ lat: 21.7679, lng: 78.8718 });

  // WebGL / Deck.gl High-Density Simulation States
  const [webglEnabled, setWebglEnabled] = useState(false);
  const webglCanvasRef = useRef(null);
  const [fps, setFps] = useState(60);
  const animationFrameId = useRef(null);
  const webglParticles = useRef([]);

  const initWebglParticles = () => {
    if (webglParticles.current.length > 0) return;
    const list = [];
    const routes = [
      { from: [28.6139, 77.2090], to: [19.0760, 72.8777] }, // Delhi-Mumbai
      { from: [19.0760, 72.8777], to: [13.0827, 80.2707] }, // Mumbai-Chennai
      { from: [22.5726, 88.3639], to: [26.1445, 91.7362] }, // Kolkata-Guwahati
      { from: [28.6139, 77.2090], to: [22.5726, 88.3639] }, // Delhi-Kolkata
      { from: [13.0827, 80.2707], to: [17.3850, 78.4867] }, // Chennai-Hyderabad
    ];

    for (let i = 0; i < 10000; i++) {
      const route = routes[i % routes.length];
      const progress = Math.random();
      const speed = 0.0003 + Math.random() * 0.0006;
      const deviation = (Math.random() - 0.5) * 0.25;
      list.push({
        from: route.from,
        to: route.to,
        progress,
        speed,
        deviation,
        color: i % 5 === 0 ? 'rgba(56, 206, 60, 0.85)' : i % 5 === 1 ? 'rgba(99, 102, 241, 0.85)' : i % 5 === 2 ? 'rgba(245, 158, 11, 0.85)' : i % 5 === 3 ? 'rgba(59, 130, 246, 0.85)' : 'rgba(236, 72, 153, 0.85)',
        trail: []
      });
    }
    webglParticles.current = list;
  };

  // Map refs
  const mapContainerRef = useRef(null);
  const leafletMap = useRef(null);
  const mapMarkers = useRef({});
  const corridorLines = useRef([]);
  const trafficFlowDashes = useRef([]);
  const ghostMarkerRef = useRef(null);
  const routeLineRef = useRef(null);
  const alternativeBypassRef = useRef(null);
  const heatmapLayersRef = useRef([]);

  // Toast helper
  const showToast = (message, type = 'success') => {
    setActionAlert({
      title: type === 'success' ? 'Resolution Dispatched' : type === 'warning' ? 'Telemetry Alert' : 'Emergency Sos Override',
      message,
      type
    });
    setTimeout(() => setActionAlert(null), 4000);
  };

  // Autonomy Log helper
  const logToTerminal = (msg) => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    setTerminalLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 8)]);
  };

  // Initialize raw Leaflet map
  useEffect(() => {
    if (mapContainerRef.current && !leafletMap.current) {
      leafletMap.current = L.map(mapContainerRef.current, {
        center: [21.7679, 78.8718],
        zoom: 5,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18
      }).addTo(leafletMap.current);

      leafletMap.current.on('mousemove', (e) => {
        setMouseCoords({
          lat: e.latlng.lat.toFixed(4),
          lng: e.latlng.lng.toFixed(4)
        });
      });
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  // WebGL / Deck.gl high-performance rendering animation loop
  useEffect(() => {
    if (webglEnabled) {
      initWebglParticles();
      
      let lastTime = performance.now();
      let frameCount = 0;
      
      const animate = (time) => {
        frameCount++;
        if (time > lastTime + 1000) {
          setFps(Math.round((frameCount * 1000) / (time - lastTime)));
          frameCount = 0;
          lastTime = time;
        }

        const canvas = webglCanvasRef.current;
        if (canvas && leafletMap.current) {
          const ctx = canvas.getContext('2d');
          
          // Sync size with parent bounds
          if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
          }
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // 1. Calculate dynamic density grid in screen space on the fly
          const gridRows = 16;
          const gridCols = 16;
          const cellWidth = canvas.width / gridCols;
          const cellHeight = canvas.height / gridRows;
          const densityGrid = Array.from({ length: gridRows }, () => new Float32Array(gridCols));

          const mappedParticles = [];

          // Draw 10,000 active particles and populate density grid
          webglParticles.current.forEach(p => {
            // Move progress along corridor
            p.progress += p.speed;
            if (p.progress > 1) {
              p.progress = 0;
              p.trail = [];
            }
            
            const lat = p.from[0] + (p.to[0] - p.from[0]) * p.progress + p.deviation * Math.sin(p.progress * Math.PI);
            const lng = p.from[1] + (p.to[1] - p.from[1]) * p.progress + p.deviation * Math.cos(p.progress * Math.PI);
            
            try {
              const pt = leafletMap.current.latLngToContainerPoint([lat, lng]);
              mappedParticles.push({ p, pt });
              
              if (pt.x >= 0 && pt.x < canvas.width && pt.y >= 0 && pt.y < canvas.height) {
                const col = Math.floor(pt.x / cellWidth);
                const row = Math.floor(pt.y / cellHeight);
                densityGrid[row][col]++;
              }
            } catch (err) {
              // Ignore boundary errors when panning
            }
          });

          // 2. Draw dynamic density grids based on particle density
          for (let r = 0; r < gridRows; r++) {
            for (let c = 0; c < gridCols; c++) {
              const count = densityGrid[r][c];
              if (count > 5) { // Threshold
                const opacity = Math.min(0.2, count / 150);
                // Dynamic density color: Cyan/Teal representing high traffic/density
                ctx.fillStyle = `rgba(6, 182, 212, ${opacity})`; 
                ctx.fillRect(c * cellWidth + 1, r * cellHeight + 1, cellWidth - 2, cellHeight - 2);
              }
            }
          }

          // 3. Draw dynamic risk heatmaps pulsing on the fly (representing high-risk bottleneck regions)
          const riskSpots = [
            { lat: 26.1445, lng: 91.7362, radius: 120, label: 'Siliguri Bottleneck' }, // East
            { lat: 19.0760, lng: 72.8777, radius: 180, label: 'JNPT Backlog' } // West
          ];

          riskSpots.forEach(spot => {
            try {
              const pt = leafletMap.current.latLngToContainerPoint([spot.lat, spot.lng]);
              if (pt.x >= -200 && pt.x < canvas.width + 200 && pt.y >= -200 && pt.y < canvas.height + 200) {
                const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, spot.radius);
                const alpha = 0.08 + Math.sin(performance.now() * 0.003) * 0.03;
                grad.addColorStop(0, `rgba(255, 77, 107, ${alpha})`);
                grad.addColorStop(0.5, `rgba(255, 77, 107, ${alpha * 0.4})`);
                grad.addColorStop(1, 'rgba(255, 77, 107, 0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, spot.radius, 0, 2 * Math.PI);
                ctx.fill();
              }
            } catch(e) {}
          });

          // 4. Draw trails and particles
          mappedParticles.forEach(({ p, pt }) => {
            // Push to path trail (TripsLayer simulation)
            p.trail.push({ x: pt.x, y: pt.y });
            if (p.trail.length > 6) p.trail.shift();
            
            if (p.trail.length > 1) {
              ctx.beginPath();
              ctx.moveTo(p.trail[0].x, p.trail[0].y);
              for (let j = 1; j < p.trail.length; j++) {
                ctx.lineTo(p.trail[j].x, p.trail[j].y);
              }
              ctx.strokeStyle = p.color.replace('0.85', '0.12');
              ctx.lineWidth = 1;
              ctx.stroke();
            }
            
            // Draw vehicle particle dot
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.8, 0, 2 * Math.PI);
            ctx.fillStyle = p.color;
            ctx.fill();
          });
        }
        
        animationFrameId.current = requestAnimationFrame(animate);
      };
      
      animationFrameId.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    }
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [webglEnabled]);

  // Time Machine Position Shift interpolator
  const getPlaybackPosition = (truck, hours) => {
    const originCity = CITIES.find(c => c.name === truck.origin) || CITIES[0];
    const destCity = CITIES.find(c => c.name === truck.destination) || CITIES[1];
    
    // Shift coordinate towards destination based on hours (e.g. 24h is complete arrival)
    const ratio = Math.min(1, hours / 24);
    const lat = originCity.lat + (destCity.lat - originCity.lat) * ratio;
    const lng = originCity.lng + (destCity.lng - originCity.lng) * ratio;

    return { lat, lng };
  };

  // Render Map Overlays statefully based on Active View, Map Layers, & Time Machine
  useEffect(() => {
    if (!leafletMap.current) return;

    // Clear old layers
    corridorLines.current.forEach(l => l.remove());
    trafficFlowDashes.current.forEach(l => l.remove());
    heatmapLayersRef.current.forEach(l => l.remove());
    if (routeLineRef.current) routeLineRef.current.remove();
    if (alternativeBypassRef.current) alternativeBypassRef.current.remove();
    if (ghostMarkerRef.current) ghostMarkerRef.current.remove();

    corridorLines.current = [];
    trafficFlowDashes.current = [];
    heatmapLayersRef.current = [];
    routeLineRef.current = null;
    alternativeBypassRef.current = null;
    ghostMarkerRef.current = null;

    if (webglEnabled) return;

    // 1. Draw Freight Corridors (Nation Control)
    if (activeView === 'nation') {
      CORRIDORS.forEach(corridor => {
        const line = L.polyline(corridor.coords, {
          color: '#6366f1',
          weight: 4,
          opacity: 0.75
        }).addTo(leafletMap.current);
        
        line.bindTooltip(`<b>${corridor.name}</b><br/>Capacity: ${corridor.capacity}<br/>Profitability: ${corridor.profitability}`, { sticky: true });
        corridorLines.current.push(line);

        // Animated neon flow particles
        if (mapLayers.traffic) {
          const flow = L.polyline(corridor.coords, {
            color: corridor.congestion.includes('High') ? '#FF4D6B' : '#38CE3C',
            weight: 3.5,
            opacity: 0.9,
            dashArray: '8, 25',
            className: 'leaflet-traffic-flow-dash'
          }).addTo(leafletMap.current);
          trafficFlowDashes.current.push(flow);
        }
      });
    }

    // 2. Draw Heatmaps (Demand, Density, Risk)
    if (mapLayers.demand) {
      CITIES.forEach(city => {
        const c = L.circle([city.lat, city.lng], { radius: 100000, color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.08, weight: 1 }).addTo(leafletMap.current);
        heatmapLayersRef.current.push(c);
      });
    }
    if (mapLayers.density) {
      CITIES.filter((_, i) => i % 3 === 0).forEach(city => {
        const c = L.circle([city.lat, city.lng], { radius: 140000, color: '#06b6d4', fillColor: '#06b6d4', fillOpacity: 0.06, weight: 1 }).addTo(leafletMap.current);
        heatmapLayersRef.current.push(c);
      });
    }
    if (mapLayers.risk) {
      CITIES.filter((_, i) => i % 4 === 1).forEach(city => {
        const c = L.circle([city.lat, city.lng], { radius: 80000, color: '#FF4D6B', fillColor: '#FF4D6B', fillOpacity: 0.12, weight: 1, className: 'leaflet-risk-halo' }).addTo(leafletMap.current);
        heatmapLayersRef.current.push(c);
      });
    }
    if (mapLayers.weather) {
      const storm1 = L.circle([24.2, 85.1], { radius: 180000, color: '#6366f1', fillOpacity: 0.05, weight: 1 }).addTo(leafletMap.current);
      const storm2 = L.circle([14.8, 77.2], { radius: 130000, color: '#6366f1', fillOpacity: 0.05, weight: 1 }).addTo(leafletMap.current);
      heatmapLayersRef.current.push(storm1, storm2);
    }
    if (mapLayers.fuel) {
      CITIES.forEach((city, i) => {
        const color = i % 2 === 0 ? '#38CE3C' : '#FF4D6B';
        const c = L.circle([city.lat, city.lng], { radius: 40000, color, fillColor: color, fillOpacity: 0.1, weight: 1 }).addTo(leafletMap.current);
        heatmapLayersRef.current.push(c);
      });
    }

    // 3. Draw Selected Truck Route (Fleet/Shipment View)
    if ((activeView === 'fleet' || activeView === 'shipment') && selectedTruck) {
      const originCity = CITIES.find(c => c.name === selectedTruck.origin) || CITIES[0];
      const destCity = CITIES.find(c => c.name === selectedTruck.destination) || CITIES[1];
      const start = [originCity.lat, originCity.lng];
      const end = [destCity.lat, destCity.lng];
      const routeCoords = getCurvedPath(start, end);

      routeLineRef.current = L.polyline(routeCoords, {
        color: selectedTruck.healthScore < 70 ? '#FF4D6B' : '#38CE3C',
        weight: 3.5,
        opacity: 0.85
      }).addTo(leafletMap.current);

      // Bypass route overlay
      if (!selectedTruck.rerouted) {
        alternativeBypassRef.current = L.polyline([selectedTruck.lat, selectedTruck.lng, destCity.lat + 0.5, destCity.lng - 0.5, destCity.lat], {
          color: '#f59e0b',
          weight: 2.5,
          opacity: 0.6,
          dashArray: '6, 6'
        }).addTo(leafletMap.current);
      }

      // Predictive Ghost Vehicle marker (2 hours ahead)
      const ghostPos = getPlaybackPosition(selectedTruck, timeSliderVal + 2);
      const ghostIcon = L.divIcon({
        html: `
          <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 18px; height: 18px; border-radius: 50%; background: #3b82f6; opacity: 0.35; animation: mapPulse 2s infinite;"></div>
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; border: 1.5px solid #fff; box-shadow: 0 0 8px #3b82f6;"></div>
          </div>
        `,
        className: 'ghost-fleet-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      ghostMarkerRef.current = L.marker([ghostPos.lat, ghostPos.lng], { icon: ghostIcon })
        .addTo(leafletMap.current)
        .bindTooltip("Ghost Twin (+2h Prediction)", { permanent: false, direction: 'top' });
    }

  }, [activeView, mapLayers, selectedTruck, timeSliderVal, webglEnabled]);

  // Update vehicle markers geographically
  useEffect(() => {
    if (!leafletMap.current) return;

    if (webglEnabled) {
      Object.keys(mapMarkers.current).forEach(id => {
        mapMarkers.current[id].remove();
      });
      mapMarkers.current = {};
      return;
    }

    trucks.forEach(truck => {
      let lat = truck.lat;
      let lng = truck.lng;

      // Adjust coordinate trace line dynamically if time machine slider moves
      if (isTimeMachineActive) {
        const pos = getPlaybackPosition(truck, timeSliderVal);
        lat = pos.lat;
        lng = pos.lng;
      }

      const isSelected = selectedTruck?.id === truck.id;
      const isSos = truck.id === activeSosTruckId;
      const cfg = STATUS_CONFIG[truck.status] || STATUS_CONFIG.active;
      const color = isSos ? '#FF4D6B' : cfg.color;

      const markerIcon = L.divIcon({
        html: `
          <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
            ${isSos ? `
              <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: #FF4D6B; opacity: 0.3; animation: mapSosRadar 1.5s infinite;"></div>
            ` : isSelected ? `
              <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: ${color}; opacity: 0.25; animation: mapPulse 2s infinite;"></div>
            ` : ''}
            <div style="width: ${isSelected ? '12px' : '9px'}; height: ${isSelected ? '12px' : '9px'}; border-radius: 50%; background: ${color}; border: 1.5px solid #fff; box-shadow: 0 0 10px ${color}; transition: all 0.2s;"></div>
          </div>
        `,
        className: 'custom-fleet-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      if (mapMarkers.current[truck.id]) {
        mapMarkers.current[truck.id].setLatLng([lat, lng]);
        mapMarkers.current[truck.id].setIcon(markerIcon);
      } else {
        const m = L.marker([lat, lng], { icon: markerIcon })
          .addTo(leafletMap.current)
          .on('click', () => {
            setSelectedTruck(truck);
            const matchingDriver = drivers.find(d => d.assignedTruck === truck.id);
            if (matchingDriver) setSelectedDriver(matchingDriver);
          });
        mapMarkers.current[truck.id] = m;
      }
    });

  }, [trucks, timeSliderVal, isTimeMachineActive, selectedTruck, activeSosTruckId, drivers, webglEnabled]);

  // Center on selected truck
  useEffect(() => {
    if (selectedTruck && leafletMap.current) {
      let lat = selectedTruck.lat;
      let lng = selectedTruck.lng;
      if (isTimeMachineActive) {
        const pos = getPlaybackPosition(selectedTruck, timeSliderVal);
        lat = pos.lat;
        lng = pos.lng;
      }
      leafletMap.current.setView([lat, lng], 6, { animate: true });
    }
  }, [selectedTruck, isTimeMachineActive, timeSliderVal]);

  // Time Machine Playback deck interval runner
  useEffect(() => {
    let interval = null;
    if (isPlaying && isTimeMachineActive) {
      interval = setInterval(() => {
        setTimeSliderVal(v => {
          const next = v + 1;
          return next > 24 ? 0 : next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isTimeMachineActive]);

  // AI Decision approvals triggers
  const handleApproveRec = (recId, costChange, msg) => {
    if (approvedRecommendations.includes(recId)) return;
    setApprovedRecommendations(prev => [...prev, recId]);
    setSavingsCounter(v => v + costChange);
    logToTerminal(`Approved recommendation: ${recId}. Dispatching operational scripts...`);
    showToast(msg, 'success');
  };

  // Executive AI Copilot handler
  const handleCopilotPrompt = (query) => {
    const userMsg = { sender: 'user', text: query };
    setCopilotMsgs(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      let replyText = '';
      let actionView = null;
      if (query.toLowerCase().includes('profitability')) {
        replyText = "Profitability across Western India has dipped 4.2% due to severe port backlog build-ups at JNPT, Mumbai. Current delay is +4.5h per en-route carrier. I suggest shifting 20% cargo loads to container rail routes immediately.";
        actionView = 'decision';
      } else if (query.toLowerCase().includes('churn')) {
        replyText = "Two enterprise shippers (Reliance Supply Chain and Safexpress bids) are identified as high churn risk due to reliability drop metrics on Kolkata-Guwahati line. Active fleet rerouting SH-14 recommended.";
        actionView = 'decision';
      } else if (query.toLowerCase().includes('delay')) {
        replyText = "Yesterday's delay spike was driven by heavy monsoon rainfall contours near Bengal corridors. Dynamic alternate route bypass SH-14 has successfully reduced delay by 2h on 18 en-route vehicles.";
        actionView = 'fleet';
      } else {
        replyText = "Daily executive telemetry is nominal. Current daily revenue stands at ₹4.28Cr (+8.3%), fleet utilization is 87.4%, and average safety twin scores are 94.2%. Click optimize below to maximize fuel margins.";
        actionView = 'decision';
      }

      setCopilotMsgs(prev => [...prev, { sender: 'copilot', text: replyText, view: actionView }]);
      setIsTyping(false);
    }, 1200);
  };

  // SVG Radar Coordinates calculator
  const getRadarPoints = (driver) => {
    const metrics = [
      driver.safetyScore,
      driver.attendance,
      Math.floor(driver.rating * 20),
      100 - (driver.violations * 15),
      Math.min(100, (driver.experience * 4) + 40),
      92
    ];
    const center = 80;
    const rMax = 55;
    const points = metrics.map((val, idx) => {
      const angle = (idx * 60 - 90) * Math.PI / 180;
      const r = (val / 100) * rMax;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    });
    return points.join(' ');
  };

  // Subsystem click sensor handlers
  const handleSubsystemClick = (system) => {
    setSelectedSubsystem(system);
    logToTerminal(`Interrogating Digital Twin subsystem telemetry: [${system.toUpperCase()}]`);
  };

  // Dispatch Action controllers
  const toggleDoorLock = (id) => {
    setTrucks(prev => prev.map(t => t.id === id ? { ...t, doorLocked: !t.doorLocked } : t));
    setSelectedTruck(prev => prev && prev.id === id ? { ...prev, doorLocked: !prev.doorLocked } : prev);
    logToTerminal(` cabin lock actuators toggled on vehicle ${id}`);
    showToast(`Cabin Door Actuator command: ${selectedTruck.doorLocked ? 'UNLOCKED' : 'LOCKED'}`, 'success');
  };

  const adjustReeferTemp = (id, delta) => {
    setTrucks(prev => prev.map(t => t.id === id ? { ...t, refrigTemp: Math.min(10, Math.max(-10, t.refrigTemp + delta)) } : t));
    setSelectedTruck(prev => prev && prev.id === id ? { ...prev, refrigTemp: Math.min(10, Math.max(-10, prev.refrigTemp + delta)) } : prev);
    showToast(`Refrigerated Cold Chain thermostat setpoint calibrated.`, 'success');
  };

  const executeReroute = (id) => {
    setTrucks(prev => prev.map(t => t.id === id ? { ...t, rerouted: true, origin: `${t.origin} (Bypass)`, destination: `${t.destination} via SH-14`, speed: 84 } : t));
    setSelectedTruck(prev => prev && prev.id === id ? { ...prev, rerouted: true, origin: `${prev.origin} (Bypass)`, destination: `${prev.destination} via SH-14`, speed: 84 } : prev);
    logToTerminal(`Dynamic alternative SH-14 route bypass authorized for ${id}.`);
    showToast("Route plan reassigned via green bypass corridor.", "success");
  };

  const triggerSos = (id) => {
    setActiveSosTruckId(id);
    showToast("SOS Alert Triggered. view flashes red border locator.", "warning");
    logToTerminal(`⚠️ SOS EMERGENCY SIGNAL INTERCEPTED FROM VEHICLE ${id}.`);
  };

  const clearSos = () => {
    setActiveSosTruckId(null);
    logToTerminal(`SOS status cleared. Target twin restored to stable.`);
    showToast("Emergency anomaly fully resolved.", "success");
  };

  return (
    <div style={{
      display: 'flex',
      height: 'calc(100vh - var(--topbar-height))',
      background: '#070a13',
      color: '#E0E0E0',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      border: activeSosTruckId ? '2px solid #FF4D6B' : 'none',
      animation: activeSosTruckId ? 'sosFlashBorder 1.5s infinite' : 'none'
    }}>
      {/* Dynamic Action Toast Notifications */}
      <AnimatePresence>
        {actionAlert && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            style={{
              position: 'absolute',
              top: '20px',
              left: '340px',
              zIndex: 9999,
              padding: '12px 18px',
              borderRadius: '8px',
              background: 'rgba(10, 15, 30, 0.95)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${actionAlert.type === 'success' ? '#38CE3C' : '#FF4D6B'}`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}
          >
            {actionAlert.type === 'success' ? <CheckCircle size={16} color="#38CE3C" /> : <AlertTriangle size={16} color="#FF4D6B" />}
            <div>
              <div style={{ fontWeight: 700, fontSize: 12, color: '#fff' }}>{actionAlert.title}</div>
              <div style={{ fontSize: 10, color: '#B0B0B0', marginTop: 2 }}>{actionAlert.message}</div>
            </div>
            <button onClick={() => setActionAlert(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 12 }}>
              <X size={14} color="#64748b" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT SIDE PANEL (MORPHS PER ACTIVE VIEW) */}
      <div style={{
        width: '380px',
        background: '#0d1322',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 20,
        flexShrink: 0
      }}>
        {/* Navigation Selector Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 2,
          background: '#070a13',
          padding: 4,
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <button onClick={() => setActiveView('nation')} style={viewTabBtnStyle(activeView === 'nation')}>Global</button>
          <button onClick={() => setActiveView('regional')} style={viewTabBtnStyle(activeView === 'regional')}>Region</button>
          <button onClick={() => setActiveView('fleet')} style={viewTabBtnStyle(activeView === 'fleet')}>Fleet</button>
          <button onClick={() => setActiveView('shipment')} style={viewTabBtnStyle(activeView === 'shipment')}>Cargo</button>
          <button onClick={() => setActiveView('driver')} style={viewTabBtnStyle(activeView === 'driver')}>Driver</button>
          <button onClick={() => setActiveView('decision')} style={viewTabBtnStyle(activeView === 'decision')}>AI Ops</button>
          <button onClick={() => setActiveView('executive')} style={viewTabBtnStyle(activeView === 'executive')}>Exec</button>
          <button onClick={() => setCopilotOpen(c => !c)} style={{
            ...viewTabBtnStyle(copilotOpen),
            background: copilotOpen ? 'rgba(99, 102, 241, 0.15)' : '#0d1322',
            color: copilotOpen ? '#818cf8' : '#64748b'
          }}>AI Copilot</button>
        </div>

        {/* View Specific Sidebar Panels */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* 1. NATION VIEW PANEL */}
          {activeView === 'nation' && (
            <>
              <div style={panelHeaderStyle}>Nation Digital Twin</div>
              <div style={kpiStripStyle}>
                <div style={kpiCardStyle}>
                  <div style={kpiLabelStyle}>Western Corridor Capacity</div>
                  <div style={kpiValStyle}>82% <span style={{ fontSize: 9, color: '#f59e0b' }}>Stable</span></div>
                </div>
                <div style={kpiCardStyle}>
                  <div style={kpiLabelStyle}>ETA Confidence Index</div>
                  <div style={kpiValStyle}>94.2% <span style={{ fontSize: 9, color: '#38CE3C' }}>High</span></div>
                </div>
              </div>

              <div style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', letterSpacing: '0.04em' }}>ACTIVE FREIGHT ROUTE CORRIDORS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {CORRIDORS.map(c => (
                  <div key={c.id} style={listItemStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: 12 }}>{c.name}</span>
                      <span style={{ fontSize: 10, color: '#38CE3C', fontWeight: 600 }}>{c.profitability}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#B0B0B0' }}>
                      <span>Congestion: {c.congestion}</span>
                      <span>Avg Speed: {c.speed}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 2. REGIONAL VIEW PANEL */}
          {activeView === 'regional' && (
            <>
              <div style={panelHeaderStyle}>Regional Control Centers</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {REGIONS.map(r => (
                  <div key={r.name} onClick={() => leafletMap.current?.setView([r.lat, r.lng], 6)} style={{ ...listItemStyle, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: 12 }}>{r.name}</span>
                      <span style={{ fontSize: 10, color: '#FF4D6B', fontWeight: 600 }}>{r.activeSOS > 0 ? `🚨 ${r.activeSOS} Active SOS` : ''}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#B0B0B0' }}>
                      <span>Fleet count: {r.fleetCount.toLocaleString()}</span>
                      <span>Utilization: {r.utilization}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#B0B0B0', marginTop: 2 }}>
                      <span>Asset Value: {r.cashPos}</span>
                      <span style={{ color: r.riskScore > 30 ? '#FF4D6B' : '#38CE3C' }}>Risk score: {r.riskScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 3. FLEET VIEW PANEL */}
          {activeView === 'fleet' && selectedTruck && (
            <>
              <div style={panelHeaderStyle}>Truck Telemetry Twin</div>
              
              {/* Selected Truck Selector */}
              <div style={{ display: 'flex', gap: 6 }}>
                <select
                  value={selectedTruck.id}
                  onChange={(e) => {
                    const t = trucks.find(tr => tr.id === e.target.value);
                    if (t) setSelectedTruck(t);
                  }}
                  style={{
                    background: '#1a2332', border: '1px solid rgba(255,255,255,0.1)', color: '#fff',
                    padding: '6px 12px', borderRadius: 4, width: '100%', fontSize: 12, outline: 'none'
                  }}
                >
                  {trucks.slice(0, 15).map(t => (
                    <option key={t.id} value={t.id}>{t.id} ({t.type})</option>
                  ))}
                </select>
              </div>

              {/* Truck twin stats card */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 8, padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{selectedTruck.id}</span>
                  <span style={{ fontSize: 11, color: '#38CE3C', fontWeight: 600 }}>Active en-route</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 11, color: '#B0B0B0' }}>
                  <div>Speed: <span style={{ color: '#fff', fontWeight: 600 }}>{selectedTruck.speed} km/h</span></div>
                  <div>Fuel Level: <span style={{ color: '#fff', fontWeight: 600 }}>{selectedTruck.fuelLevel}%</span></div>
                  <div>Driver: <span style={{ color: '#fff', fontWeight: 600 }}>{selectedTruck.driver}</span></div>
                  <div>Weight Load: <span style={{ color: '#fff', fontWeight: 600 }}>{selectedTruck.cargoWeight}t</span></div>
                  <div>ETA: <span style={{ color: '#f59e0b', fontWeight: 600 }}>{selectedTruck.eta}</span></div>
                  <div>Health: <span style={{ color: selectedTruck.healthScore > 75 ? '#38CE3C' : '#FF4D6B', fontWeight: 600 }}>{selectedTruck.healthScore}%</span></div>
                </div>
                
                {/* Dispatch Controls */}
                <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                  <button onClick={() => executeReroute(selectedTruck.id)} style={miniBtnStyle(false)}>Reroute Bypass</button>
                  {activeSosTruckId === selectedTruck.id ? (
                    <button onClick={clearSos} style={{ ...miniBtnStyle(true), background: '#38CE3C' }}>Clear SOS</button>
                  ) : (
                    <button onClick={() => triggerSos(selectedTruck.id)} style={miniBtnStyle(true)}>Trigger SOS</button>
                  )}
                </div>
              </div>

              {/* INTERACTIVE SVG TRUCK MODEL */}
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', letterSpacing: '0.04em', marginBottom: 8 }}>DIGITAL TWIN HARDWARE DIAGNOSTICS</div>
                
                <div style={{ background: '#070a13', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <svg width="300" height="90" viewBox="0 0 300 90" style={{ overflow: 'visible' }}>
                    {/* Trailer Body */}
                    <rect x="10" y="10" width="180" height="50" rx="3" fill="none" stroke={selectedSubsystem === 'cargo' ? '#818cf8' : '#334155'} strokeWidth="2.5" style={{ cursor: 'pointer' }} onClick={() => handleSubsystemClick('cargo')} />
                    {/* Cabin Front */}
                    <path d="M 200,60 L 200,20 L 240,20 L 260,40 L 260,60 Z" fill="none" stroke={selectedSubsystem === 'engine' ? '#38CE3C' : '#334155'} strokeWidth="2.5" style={{ cursor: 'pointer' }} onClick={() => handleSubsystemClick('engine')} />
                    {/* Connector Hook */}
                    <line x1="190" y1="52" x2="200" y2="52" stroke="#334155" strokeWidth="3" />
                    
                    {/* Wheels / Tyres */}
                    <circle cx="45" cy="70" r="10" fill="none" stroke={selectedSubsystem === 'tyre' ? '#818cf8' : '#334155'} strokeWidth="3.5" style={{ cursor: 'pointer' }} onClick={() => handleSubsystemClick('tyre')} />
                    <circle cx="85" cy="70" r="10" fill="none" stroke={selectedSubsystem === 'tyre' ? '#818cf8' : '#334155'} strokeWidth="3.5" style={{ cursor: 'pointer' }} onClick={() => handleSubsystemClick('tyre')} />
                    <circle cx="150" cy="70" r="10" fill="none" stroke={selectedSubsystem === 'tyre' ? '#818cf8' : '#334155'} strokeWidth="3.5" style={{ cursor: 'pointer' }} onClick={() => handleSubsystemClick('tyre')} />
                    <circle cx="230" cy="70" r="10" fill="none" stroke={selectedSubsystem === 'tyre' ? '#818cf8' : '#334155'} strokeWidth="3.5" style={{ cursor: 'pointer' }} onClick={() => handleSubsystemClick('tyre')} />

                    {/* Sensor Dots */}
                    <circle cx="30" cy="20" r="3" fill="#818cf8" className="animate-ping" style={{ transformOrigin: '30px 20px' }} />
                    <circle cx="30" cy="20" r="3" fill="#818cf8" />
                    <circle cx="215" cy="30" r="3" fill="#38CE3C" className="animate-ping" style={{ transformOrigin: '215px 30px' }} />
                    <circle cx="215" cy="30" r="3" fill="#38CE3C" />

                    {/* Cabin Door Handle clickable Area */}
                    <rect x="205" y="35" width="20" height="20" rx="2" fill="rgba(255,255,255,0.02)" stroke={selectedSubsystem === 'cabin' ? '#f59e0b' : 'transparent'} strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={() => handleSubsystemClick('cabin')} />
                    <line x1="210" y1="45" x2="218" y2="45" stroke="#334155" strokeWidth="2.5" />
                  </svg>

                  {/* Subsystem Details Display */}
                  <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 12, paddingTop: 10, fontSize: 11 }}>
                    {selectedSubsystem === 'engine' && (
                      <div>
                        <div style={{ fontWeight: 700, color: '#38CE3C', display: 'flex', justify: 'space-between' }}>
                          <span>ENGINE CONTROL UNIT</span>
                          <span>NOMINAL</span>
                        </div>
                        <div style={{ marginTop: 4, color: '#B0B0B0' }}>Coolant Temperature: {selectedTruck.coolantTemp}°C</div>
                        <div style={{ color: '#B0B0B0' }}>Fault Logs: No active OBD DTC engine trouble codes.</div>
                      </div>
                    )}
                    {selectedSubsystem === 'tyre' && (
                      <div>
                        <div style={{ fontWeight: 700, color: '#818cf8' }}>TYRE PRESSURE MONITORING SYSTEM</div>
                        <div style={{ marginTop: 4, display: 'grid', gridTemplateColumns: '1fr 1fr', color: '#B0B0B0' }}>
                          <span>Front Wheel: 118 PSI</span>
                          <span>Drive Wheel: 122 PSI</span>
                          <span>Axle Weight: 8.4t</span>
                          <span>Tyre Wear: 18%</span>
                        </div>
                      </div>
                    )}
                    {selectedSubsystem === 'cargo' && (
                      <div>
                        <div style={{ fontWeight: 700, color: '#818cf8' }}>REEFER COLD CHAIN CONTROL</div>
                        <div style={{ marginTop: 4, display: 'flex', justify: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#B0B0B0' }}>Thermostat Setting: {selectedTruck.refrigTemp}°C</span>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button onClick={() => adjustReeferTemp(selectedTruck.id, 1)} style={{ padding: '2px 8px', background: '#1a2332', border: 'none', color: '#fff', cursor: 'pointer' }}>+</button>
                            <button onClick={() => adjustReeferTemp(selectedTruck.id, -1)} style={{ padding: '2px 8px', background: '#1a2332', border: 'none', color: '#fff', cursor: 'pointer' }}>-</button>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedSubsystem === 'cabin' && (
                      <div>
                        <div style={{ fontWeight: 700, color: '#f59e0b' }}>CABIN SECURITY CONTROL</div>
                        <div style={{ marginTop: 4, display: 'flex', justify: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#B0B0B0' }}>Status: {selectedTruck.doorLocked ? 'LOCKED' : 'UNLOCKED'}</span>
                          <button onClick={() => toggleDoorLock(selectedTruck.id)} style={{ padding: '3px 10px', background: '#1a2332', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: 2 }}>
                            {selectedTruck.doorLocked ? 'Unlock Door' : 'Lock Door'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 4. SHIPMENT VIEW PANEL */}
          {activeView === 'shipment' && selectedShipment && (
            <>
              <div style={panelHeaderStyle}>Shipment Intelligence</div>
              
              <div style={{ display: 'flex', gap: 6 }}>
                <select
                  value={selectedShipment.id}
                  onChange={(e) => {
                    const sh = shipments.find(s => s.id === e.target.value);
                    if (sh) {
                      setSelectedShipment(sh);
                      const matchingTruck = trucks.find(t => t.id === sh.truck);
                      if (matchingTruck) setSelectedTruck(matchingTruck);
                    }
                  }}
                  style={{
                    background: '#1a2332', border: '1px solid rgba(255,255,255,0.1)', color: '#fff',
                    padding: '6px 12px', borderRadius: 4, width: '100%', fontSize: 12, outline: 'none'
                  }}
                >
                  {shipments.map(s => (
                    <option key={s.id} value={s.id}>{s.id} ({s.origin} ➔ {s.destination})</option>
                  ))}
                </select>
              </div>

              {/* shipment details */}
              <div style={listItemStyle}>
                <div style={{ display: 'flex', justify: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: '#fff' }}>Bill: {selectedShipment.ewayBill}</span>
                  <span style={{ color: '#818cf8', fontWeight: 600 }}>{selectedShipment.status}</span>
                </div>
                <div style={{ fontSize: 11, color: '#B0B0B0' }}>
                  Route: {selectedShipment.origin} ➔ {selectedShipment.destination}
                </div>
                <div style={{ fontSize: 11, color: '#B0B0B0', marginTop: 4 }}>
                  Assigned Truck: {selectedShipment.truck}
                </div>
                <div style={{ fontSize: 11, color: '#B0B0B0' }}>
                  ETA Confidence: <span style={{ color: '#38CE3C', fontWeight: 600 }}>{selectedShipment.etaConfidence}%</span>
                </div>
              </div>

              {/* PREDICTIVE MILESTONES TIMELINE */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', letterSpacing: '0.04em', marginBottom: 8 }}>PREDICTIVE TRANSIT MILESTONES</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingLeft: 12, borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                  {selectedShipment.milestones.map((m, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute', left: '-17px', top: '2px', width: '9px', height: '9px', borderRadius: '50%',
                        background: m.done ? '#38CE3C' : '#334155', border: '1.5px solid #0d1322'
                      }} />
                      <div style={{ fontSize: 11, fontWeight: m.done ? 600 : 400, color: m.done ? '#fff' : '#64748b' }}>{m.label}</div>
                      <div style={{ fontSize: 9, color: '#B0B0B0' }}>{m.date}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ANTIMATED RELATIONSHIP GRAPH */}
              <div style={{ marginTop: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', letterSpacing: '0.04em', marginBottom: 6 }}>NETWORK RELATIONSHIP GRAPH</div>
                <div style={{ background: '#070a13', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: 12, display: 'flex', justify: 'center' }}>
                  <svg width="280" height="70" viewBox="0 0 280 70">
                    {/* Connections */}
                    <line x1="30" y1="35" x2="90" y2="35" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="3,3" />
                    <line x1="90" y1="35" x2="150" y2="35" stroke="#38CE3C" strokeWidth="1.5" strokeDasharray="3,3" />
                    <line x1="150" y1="35" x2="210" y2="35" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" />
                    <line x1="210" y1="35" x2="250" y2="35" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />

                    {/* Nodes */}
                    <circle cx="30" cy="35" r="14" fill="#0d1322" stroke="#818cf8" strokeWidth="2" />
                    <text x="30" y="39" fill="#818cf8" fontSize="8" textAnchor="middle" fontWeight="bold">CLI</text>
                    
                    <circle cx="90" cy="35" r="14" fill="#0d1322" stroke="#38CE3C" strokeWidth="2" />
                    <text x="90" y="39" fill="#38CE3C" fontSize="8" textAnchor="middle" fontWeight="bold">SHP</text>

                    <circle cx="150" cy="35" r="14" fill="#0d1322" stroke="#3b82f6" strokeWidth="2" />
                    <text x="150" y="39" fill="#3b82f6" fontSize="8" textAnchor="middle" fontWeight="bold">TRK</text>

                    <circle cx="210" cy="35" r="14" fill="#0d1322" stroke="#f59e0b" strokeWidth="2" />
                    <text x="210" y="39" fill="#f59e0b" fontSize="8" textAnchor="middle" fontWeight="bold">DRV</text>
                  </svg>
                </div>
              </div>
            </>
          )}

          {/* 5. DRIVER VIEW PANEL */}
          {activeView === 'driver' && selectedDriver && (
            <>
              <div style={panelHeaderStyle}>Driver Digital Twin</div>
              
              <div style={{ display: 'flex', gap: 6 }}>
                <select
                  value={selectedDriver.id}
                  onChange={(e) => {
                    const dr = drivers.find(d => d.id === e.target.value);
                    if (dr) {
                      setSelectedDriver(dr);
                      const matchingTruck = trucks.find(t => t.id === dr.assignedTruck);
                      if (matchingTruck) setSelectedTruck(matchingTruck);
                    }
                  }}
                  style={{
                    background: '#1a2332', border: '1px solid rgba(255,255,255,0.1)', color: '#fff',
                    padding: '6px 12px', borderRadius: 4, width: '100%', fontSize: 12, outline: 'none'
                  }}
                >
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.id})</option>
                  ))}
                </select>
              </div>

              {/* Driver twin stats */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 8, padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{selectedDriver.name}</span>
                  <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>On Duty</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 11, color: '#B0B0B0' }}>
                  <div>Safety Score: <span style={{ color: '#38CE3C', fontWeight: 600 }}>{selectedDriver.safetyScore}%</span></div>
                  <div>Fatigue Risk: <span style={{ color: '#FF4D6B', fontWeight: 600 }}>{selectedDriver.violations * 15}%</span></div>
                  <div>Experience: <span style={{ color: '#fff', fontWeight: 600 }}>{selectedDriver.experience} years</span></div>
                  <div>Assigned Truck: <span style={{ color: '#fff', fontWeight: 600 }}>{selectedDriver.assignedTruck}</span></div>
                  <div>Trips Completed: <span style={{ color: '#fff', fontWeight: 600 }}>{selectedDriver.tripsCompleted}</span></div>
                  <div>Attendance Rate: <span style={{ color: '#fff', fontWeight: 600 }}>{selectedDriver.attendance}%</span></div>
                </div>
              </div>

              {/* DRIVER BEHAVIOR RADAR CHART */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', letterSpacing: '0.04em', marginBottom: 8 }}>DRIVER SKILLS RADAR CHART</div>
                <div style={{ background: '#070a13', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    {/* Background concentric hex circles */}
                    <circle cx="80" cy="80" r="55" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <circle cx="80" cy="80" r="40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <circle cx="80" cy="80" r="25" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    
                    {/* Axis lines */}
                    {[0, 60, 120, 180, 240, 300].map(deg => {
                      const rad = deg * Math.PI / 180;
                      return <line key={deg} x1="80" y1="80" x2={80 + 55 * Math.cos(rad)} y2={80 + 55 * Math.sin(rad)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />;
                    })}

                    {/* Radar polygon coordinates */}
                    <polygon points={getRadarPoints(selectedDriver)} fill="rgba(99, 102, 241, 0.25)" stroke="#818cf8" strokeWidth="1.5" />
                    
                    {/* Labels */}
                    <text x="80" y="16" fill="#B0B0B0" fontSize="7" textAnchor="middle">Safety</text>
                    <text x="140" y="52" fill="#B0B0B0" fontSize="7" textAnchor="middle">Compliance</text>
                    <text x="140" y="112" fill="#B0B0B0" fontSize="7" textAnchor="middle">Skill</text>
                    <text x="80" y="148" fill="#B0B0B0" fontSize="7" textAnchor="middle">Fatigue</text>
                    <text x="20" y="112" fill="#B0B0B0" fontSize="7" textAnchor="middle">Experience</text>
                    <text x="20" y="52" fill="#B0B0B0" fontSize="7" textAnchor="middle">Reliability</text>
                  </svg>
                </div>
              </div>
            </>
          )}

          {/* 6. AI DECISION CENTER */}
          {activeView === 'decision' && (
            <>
              <div style={panelHeaderStyle}>AI Strategic Cockpit</div>
              
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 8, padding: 12 }}>
                <div style={{ display: 'flex', justify: 'space-between', fontSize: 11, color: '#B0B0B0', marginBottom: 4 }}>
                  <span>Dynamic Savings Realized:</span>
                  <span style={{ color: '#38CE3C', fontWeight: 700 }}>₹{(savingsCounter / 100000).toFixed(1)} Lakhs</span>
                </div>
                <div style={{ display: 'flex', justify: 'space-between', fontSize: 11, color: '#B0B0B0' }}>
                  <span>Autonomy Policy:</span>
                  <span style={{ color: '#818cf8', fontWeight: 700 }}>{autonomySlider}% Autonomous</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={autonomySlider}
                  onChange={e => setAutonomySlider(parseInt(e.target.value))}
                  style={{ accentColor: '#818cf8', width: '100%', marginTop: 8 }}
                />
              </div>

              {/* AI Recommendations ledger list */}
              <div style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', letterSpacing: '0.04em' }}>ACTIVE DECISION FEED RECOMMENDATIONS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Rec card 1 */}
                <div style={{ ...listItemStyle, borderLeft: '3px solid #f59e0b' }}>
                  <div style={{ display: 'flex', justify: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: 11 }}>JNPT Port backlog build-up</span>
                    <span style={{ fontSize: 10, color: '#38CE3C', fontWeight: 600 }}>₹34 Lakhs savings</span>
                  </div>
                  <div style={{ fontSize: 10, color: '#B0B0B0', marginBottom: 8 }}>
                    Shift 20% freight capacity of active Delhi-Mumbai corridor cargo to container rail.
                  </div>
                  <button
                    disabled={approvedRecommendations.includes('rec1')}
                    onClick={() => handleApproveRec('rec1', 3400000, "Shifted 20% en-route containers to Western Rail freight line.")}
                    style={miniBtnStyle(false)}
                  >
                    {approvedRecommendations.includes('rec1') ? '✓ Authorized Execution' : 'Authorize Action'}
                  </button>
                </div>

                {/* Rec card 2 */}
                <div style={{ ...listItemStyle, borderLeft: '3px solid #FF4D6B' }}>
                  <div style={{ display: 'flex', justify: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: 11 }}>Siliguri Monsoon Landslide</span>
                    <span style={{ fontSize: 10, color: '#38CE3C', fontWeight: 600 }}>₹18 Lakhs savings</span>
                  </div>
                  <div style={{ fontSize: 10, color: '#B0B0B0', marginBottom: 8 }}>
                    Reroute 8 en-route vehicles via alternative state highway bypass SH-14.
                  </div>
                  <button
                    disabled={approvedRecommendations.includes('rec2')}
                    onClick={() => handleApproveRec('rec2', 1800000, "Authorized alternative SH-14 bypass route.")}
                    style={miniBtnStyle(false)}
                  >
                    {approvedRecommendations.includes('rec2') ? '✓ Authorized Execution' : 'Authorize Action'}
                  </button>
                </div>
              </div>

              {/* COGNITIVE GREEN SCREEN TERMINAL */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.04em', marginBottom: 6 }}>EDGE COGNITION LOG CONSOLE</div>
                <div style={{
                  background: '#040711', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 6,
                  padding: '8px 12px', fontFamily: 'monospace', fontSize: 10, color: '#38CE3C', display: 'flex',
                  flexDirection: 'column', gap: 4, height: '90px', overflowY: 'auto'
                }}>
                  {terminalLogs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 7. EXECUTIVE VIEW PANEL */}
          {activeView === 'executive' && (
            <>
              <div style={panelHeaderStyle}>CEO Executive Dashboard</div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={kpiCardStyle}>
                  <div style={kpiLabelStyle}>Revenue Today</div>
                  <div style={kpiValStyle}>₹4.28Cr</div>
                </div>
                <div style={kpiCardStyle}>
                  <div style={kpiLabelStyle}>Fleet Utilization</div>
                  <div style={kpiValStyle}>87.4%</div>
                </div>
                <div style={kpiCardStyle}>
                  <div style={kpiLabelStyle}>Customer Health Index</div>
                  <div style={kpiValStyle}>96.8%</div>
                </div>
                <div style={kpiCardStyle}>
                  <div style={kpiLabelStyle}>Driver Safety Twin</div>
                  <div style={kpiValStyle}>94.2%</div>
                </div>
                <div style={kpiCardStyle}>
                  <div style={kpiLabelStyle}>Operational Cash</div>
                  <div style={kpiValStyle}>₹14.2Cr</div>
                </div>
                <div style={kpiCardStyle}>
                  <div style={kpiLabelStyle}>Network Risk Level</div>
                  <div style={{ ...kpiValStyle, color: '#FF4D6B' }}>Low</div>
                </div>
              </div>

              {/* Predicted Revenue sparks */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 8, padding: 12, marginTop: 4 }}>
                <div style={{ display: 'flex', justify: 'space-between', fontSize: 11, color: '#B0B0B0', marginBottom: 4 }}>
                  <span>Predicted Month Revenue:</span>
                  <span style={{ color: '#38CE3C', fontWeight: 700 }}>₹1.32 Cr</span>
                </div>
                <div style={{ fontSize: 9, color: '#64748b' }}>
                  Calculated based on en-route logistics contracts ETA completion.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Dynamic Telemetry rate footer */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: '#070a13',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 10,
          color: '#64748b'
        }}>
          <span>Telemping: {lastPingTime}</span>
          <span style={{ color: '#38CE3C' }}>System Nominal</span>
        </div>
      </div>

      {/* EXECUTIVE COPILOT CHAT SIDEBAR PANEL (DRAWS IN WHEN TOGGLED) */}
      <AnimatePresence>
        {copilotOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '320px', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            style={{
              background: '#0a0e18',
              borderRight: '1px solid rgba(255, 255, 255, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 19,
              flexShrink: 0
            }}
          >
            <div style={{ padding: '16px 16px 8px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justify: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: '#fff', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={14} color="#818cf8" /> EXECUTIVE AI COPILOT
              </span>
              <button onClick={() => setCopilotOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                <X size={14} color="#64748b" />
              </button>
            </div>

            {/* Chat message list area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {copilotMsgs.map((m, idx) => (
                <div key={idx} style={{
                  background: m.sender === 'user' ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${m.sender === 'user' ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)'}`,
                  borderRadius: 6, padding: '10px 12px', alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '90%', fontSize: 11, color: m.sender === 'user' ? '#fff' : '#B0B0B0', lineHeight: 1.4
                }}>
                  {m.text}
                  {m.action && (
                    <button
                      onClick={() => setActiveView(m.action.view)}
                      style={{
                        display: 'block', width: '100%', marginTop: 8, padding: '4px 8px', fontSize: 10,
                        background: '#818cf8', border: 'none', color: '#fff', borderRadius: 4, cursor: 'pointer', fontWeight: 600
                      }}
                    >
                      {m.action.text}
                    </button>
                  )}
                </div>
              ))}
              {isTyping && (
                <div style={{ color: '#64748b', fontSize: 10, alignSelf: 'flex-start' }}>Copilot is thinking...</div>
              )}
            </div>

            {/* Suggestions Chips list */}
            <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button onClick={() => handleCopilotPrompt("Why is Western India profitability down?")} style={suggestionChipStyle}>Why is Western India profitability down?</button>
              <button onClick={() => handleCopilotPrompt("Which customers may churn?")} style={suggestionChipStyle}>Which customers may churn?</button>
              <button onClick={() => handleCopilotPrompt("What caused yesterday's delay spike?")} style={suggestionChipStyle}>What caused yesterday's delay spike?</button>
            </div>

            {/* Chat Input form */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 6 }}>
              <input
                type="text"
                placeholder="Ask Executive Copilot..."
                value={copilotInput}
                onChange={e => setCopilotInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && copilotInput.trim()) { handleCopilotPrompt(copilotInput); setCopilotInput(''); } }}
                style={{
                  flex: 1, background: '#131929', border: '1px solid rgba(255,255,255,0.05)', color: '#fff',
                  borderRadius: 4, padding: '6px 12px', fontSize: 11, outline: 'none'
                }}
              />
              <button onClick={() => { if (copilotInput.trim()) { handleCopilotPrompt(copilotInput); setCopilotInput(''); } }} style={{ background: '#818cf8', border: 'none', padding: '6px 10px', color: '#fff', borderRadius: 4, cursor: 'pointer' }}><Send size={12} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAP CANVAS VIEWPORT */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex' }}>
        
        {/* Tactical HUD grid coordinate overlay */}
        <div style={hudGridStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: 10, marginBottom: 4 }}>
            <Compass size={11} color="#818cf8" />
            <span>NOC TACTICAL Digital Twin</span>
          </div>
          <div>CURSOR: {mouseCoords.lat}°N, {mouseCoords.lng}°E</div>
          <div>ACTIVE FLIGHTS: {trucks.filter(t => t.status === 'active').length} units</div>
          <div>ESTIMATED REVENUE: ₹4.28Cr</div>
        </div>

        {/* WebGL Performance Diagnostics HUD */}
        {webglEnabled && (
          <div style={{
            ...hudGridStyle,
            top: '130px',
            color: '#38CE3C',
            border: '1px solid rgba(56, 206, 60, 0.25)',
            background: 'rgba(5, 16, 8, 0.85)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: 10, marginBottom: 4 }}>
              <Cpu size={11} color="#38CE3C" />
              <span style={{ fontWeight: 'bold' }}>GPU TELEMETRY HUD</span>
            </div>
            <div>ENGINE: WebGL2 / 2D Canvas</div>
            <div>RENDER RATE: <span style={{ color: fps >= 55 ? '#38CE3C' : '#f59e0b', fontWeight: 'bold' }}>{fps} FPS</span></div>
            <div>PARTICLES: 10,000 units</div>
            <div>VERTEX COUNT: ~80,000 dynamic</div>
            <div>EST. VRAM SIZE: 41.8 MB</div>
            <div style={{ borderTop: '1px solid rgba(56, 206, 60, 0.15)', marginTop: 4, paddingTop: 4 }}>
              <div style={{ color: '#aaa' }}>DOM Node count:</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: '#FF4D6B' }}>DOM (Standard): 10,000</span>
                <span style={{ color: '#38CE3C' }}>WebGL (Canvas): 1</span>
              </div>
            </div>
          </div>
        )}

        {/* COMMAND MODE DECKS (REDUCE COST / MAX ETA / MIN RISK) */}
        <div style={{
          position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 999,
          display: 'flex', gap: 6, background: 'rgba(10, 15, 30, 0.85)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: 6, boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
        }}>
          <button onClick={() => { setCommandMode('reduce_cost'); logToTerminal('Command Mode: Minimize operational expenses.'); }} style={commandModeBtnStyle(commandMode === 'reduce_cost')}>Reduce Cost</button>
          <button onClick={() => { setCommandMode('maximize_eta'); logToTerminal('Command Mode: Prioritize maximum SLA on-time speeds.'); }} style={commandModeBtnStyle(commandMode === 'maximize_eta')}>Maximize ETA</button>
          <button onClick={() => { setCommandMode('minimize_risk'); logToTerminal('Command Mode: Reroute and bypass high-risk zones.'); }} style={commandModeBtnStyle(commandMode === 'minimize_risk')}>Minimize Risk</button>
        </div>

        {/* TIME MACHINE SLIDER CONTROLLER */}
        <div style={{
          position: 'absolute', bottom: '72px', left: '50%', transform: 'translateX(-50%)', zIndex: 999,
          background: 'rgba(10, 15, 30, 0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)',
          padding: '10px 16px', borderRadius: 8, width: '400px', display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
        }}>
          <button
            onClick={() => {
              setIsTimeMachineActive(!isTimeMachineActive);
              setIsPlaying(false);
              logToTerminal(isTimeMachineActive ? "Telemetry restoration." : "Entering future network projections.");
            }}
            style={{
              padding: '6px 12px', borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 700,
              background: isTimeMachineActive ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'rgba(255,255,255,0.05)',
              color: '#fff', display: 'flex', alignItems: 'center', gap: 4
            }}
          >
            <Clock size={11} /> {isTimeMachineActive ? 'Predictive state' : 'Time Machine'}
          </button>

          {isTimeMachineActive && (
            <>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
              
              <input
                type="range"
                min="0"
                max="24"
                value={timeSliderVal}
                onChange={(e) => { setTimeSliderVal(parseInt(e.target.value)); setIsPlaying(false); }}
                style={{ flex: 1, accentColor: '#818cf8', cursor: 'pointer' }}
              />
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#818cf8', fontWeight: 600 }}>
                {timeSliderVal === 0 ? 'Live' : `+${timeSliderVal}h`}
              </span>
            </>
          )}
        </div>

        {/* Floating map controls */}
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 999, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button onClick={() => leafletMap.current?.zoomIn()} style={mapControlBtnStyle}><ZoomIn size={14} /></button>
          <button onClick={() => leafletMap.current?.zoomOut()} style={mapControlBtnStyle}><ZoomOut size={14} /></button>
          <button onClick={() => leafletMap.current?.setView([21.7679, 78.8718], 5)} style={mapControlBtnStyle}><RotateCcw size={14} /></button>
          
          <button
            onClick={() => {
              setWebglEnabled(!webglEnabled);
              logToTerminal(webglEnabled ? "Deactivating WebGL High-Density Engine." : "Activating WebGL High-Density Engine (10k particles).");
              showToast(webglEnabled ? "Deactivated WebGL simulation" : "Activated WebGL high-density particle engine", "success");
            }}
            style={{
              ...mapControlBtnStyle,
              background: webglEnabled ? 'linear-gradient(135deg, #38CE3C, #059669)' : 'rgba(10,15,30,0.85)',
              boxShadow: webglEnabled ? '0 0 10px rgba(56, 206, 60, 0.5)' : 'none',
              border: webglEnabled ? '1px solid #38CE3C' : '1px solid rgba(255,255,255,0.05)',
            }}
            title="Toggle WebGL Engine"
          >
            <Cpu size={14} color={webglEnabled ? '#fff' : '#64748b'} />
          </button>
          
          {/* Map Layer Switch Dropdown */}
          <div style={{ position: 'relative' }}>
            <button style={mapControlBtnStyle} onClick={() => setMapLayers(l => ({ ...l, dropdown: !l.dropdown }))}>
              <Layers size={14} />
            </button>
            {mapLayers.dropdown && (
              <div style={{
                position: 'absolute', right: '40px', top: 0, background: 'rgba(10,15,30,0.9)', border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 6, padding: 8, display: 'flex', flexDirection: 'column', gap: 6, width: '130px', boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
              }}>
                <label style={layerOptionStyle}>
                  <input type="checkbox" checked={mapLayers.demand} onChange={e => setMapLayers(l => ({ ...l, demand: e.target.checked }))} />
                  <span>Demand Grid</span>
                </label>
                <label style={layerOptionStyle}>
                  <input type="checkbox" checked={mapLayers.density} onChange={e => setMapLayers(l => ({ ...l, density: e.target.checked }))} />
                  <span>Fleet density</span>
                </label>
                <label style={layerOptionStyle}>
                  <input type="checkbox" checked={mapLayers.risk} onChange={e => setMapLayers(l => ({ ...l, risk: e.target.checked }))} />
                  <span>Risk factors</span>
                </label>
                <label style={layerOptionStyle}>
                  <input type="checkbox" checked={mapLayers.weather} onChange={e => setMapLayers(l => ({ ...l, weather: e.target.checked }))} />
                  <span>Weather Storm</span>
                </label>
                <label style={layerOptionStyle}>
                  <input type="checkbox" checked={mapLayers.traffic} onChange={e => setMapLayers(l => ({ ...l, traffic: e.target.checked }))} />
                  <span>Traffic speed</span>
                </label>
                <label style={layerOptionStyle}>
                  <input type="checkbox" checked={mapLayers.fuel} onChange={e => setMapLayers(l => ({ ...l, fuel: e.target.checked }))} />
                  <span>Fuel corridors</span>
                </label>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 4, paddingTop: 4 }}>
                  <label style={{ ...layerOptionStyle, color: '#38CE3C' }}>
                    <input type="checkbox" checked={webglEnabled} onChange={e => {
                      setWebglEnabled(e.target.checked);
                      logToTerminal(e.target.checked ? "Activating WebGL High-Density Engine." : "Deactivating WebGL High-Density Engine.");
                      showToast(e.target.checked ? "Activated WebGL simulation" : "Deactivated WebGL simulation", "success");
                    }} />
                    <span>WebGL Engine</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Real Leaflet canvas target */}
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />
        {webglEnabled && (
          <canvas
            ref={webglCanvasRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 2,
              pointerEvents: 'none'
            }}
          />
        )}

        {/* Dynamic route planner recommendation floating banner */}
        {selectedTruck && !selectedTruck.rerouted && activeView === 'fleet' && (
          <div style={{
            position: 'absolute', top: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 999,
            background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: 6,
            padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12, backdropFilter: 'blur(8px)'
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Sparkles size={11} /> AI Re-route Recommendation: SH-14 corridor bypass saves 2.2 hrs
            </span>
            <button onClick={() => executeReroute(selectedTruck.id)} style={{
              background: '#f59e0b', border: 'none', color: '#000', fontSize: 9, fontWeight: 800,
              padding: '3px 8px', borderRadius: 4, cursor: 'pointer'
            }}>Authorize Bypass</button>
          </div>
        )}

        {/* BOTTOM GLOBAL STATUS BAR */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '52px', background: '#0d1322',
          borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 20px', zIndex: 999
        }}>
          <div style={bottomStatBlockStyle}>
            <span style={bottomStatLabelStyle}>Network Freight:</span>
            <span style={bottomStatValStyle}>{trucks.length} Active twins</span>
          </div>
          <div style={bottomStatBlockStyle}>
            <span style={bottomStatLabelStyle}>Corridor Reliability:</span>
            <span style={bottomStatValStyle} style={{ color: '#38CE3C' }}>94.2% (Nominal)</span>
          </div>
          <div style={bottomStatBlockStyle}>
            <span style={bottomStatLabelStyle}>Edge Telemetry polling:</span>
            <span style={bottomStatValStyle}>{lastPingTime}</span>
          </div>
          <div style={bottomStatBlockStyle}>
            <span style={bottomStatLabelStyle}>Decision savings pool:</span>
            <span style={bottomStatValStyle} style={{ color: '#38CE3C' }}>₹{(savingsCounter / 100000).toFixed(1)} Lakhs</span>
          </div>
        </div>
      </div>

      {/* Embedded CSS Animations */}
      <style>{`
        @keyframes sosFlashBorder {
          0% { border-color: #FF4D6B; box-shadow: inset 0 0 16px rgba(255, 77, 107, 0.4); }
          50% { border-color: transparent; box-shadow: inset 0 0 0px transparent; }
          100% { border-color: #FF4D6B; box-shadow: inset 0 0 16px rgba(255, 77, 107, 0.4); }
        }
        @keyframes flow {
          to { stroke-dashoffset: -120px; }
        }
        .leaflet-traffic-flow-dash {
          animation: flow 4s linear infinite !important;
        }
        @keyframes mapPulse {
          0% { transform: scale(0.6); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes mapSosRadar {
          0% { transform: scale(0.5); opacity: 0.7; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .animate-ping {
          animation: mapPulse 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}

// ---- INLINE CYBER-GRID STYLES ----
const viewTabBtnStyle = (active) => ({
  padding: '6px 0',
  fontSize: '9px',
  fontWeight: 700,
  textTransform: 'uppercase',
  cursor: 'pointer',
  background: active ? '#1a2332' : 'transparent',
  color: active ? '#818cf8' : '#64748b',
  border: 'none',
  borderRadius: 4,
  transition: 'all 0.15s ease',
  outline: 'none'
});

const panelHeaderStyle = {
  fontSize: '15px',
  fontWeight: 800,
  color: '#fff',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  paddingBottom: '8px',
  letterSpacing: '0.02em'
};

const kpiStripStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 10
};

const kpiCardStyle = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.04)',
  padding: '10px 12px',
  borderRadius: 6
};

const kpiLabelStyle = {
  fontSize: '9px',
  color: '#64748b',
  textTransform: 'uppercase',
  marginBottom: 2
};

const kpiValStyle = {
  fontSize: '14px',
  fontWeight: 700,
  color: '#fff'
};

const listItemStyle = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.04)',
  padding: '10px 12px',
  borderRadius: 6,
  transition: 'all 0.2s ease'
};

const miniBtnStyle = (danger) => ({
  flex: 1,
  padding: '6px 0',
  fontSize: '9px',
  fontWeight: 700,
  borderRadius: 4,
  cursor: 'pointer',
  border: 'none',
  background: danger ? '#FF4D6B' : '#1a2332',
  color: '#fff',
  textAlign: 'center'
});

const suggestionChipStyle = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.04)',
  borderRadius: 4,
  padding: '6px 12px',
  color: '#818cf8',
  fontSize: '10px',
  textAlign: 'left',
  cursor: 'pointer',
  outline: 'none',
  width: '100%',
  transition: 'all 0.15s'
};

const hudGridStyle = {
  position: 'absolute',
  top: '20px',
  left: '20px',
  background: 'rgba(5, 8, 16, 0.75)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: 4,
  padding: '8px 12px',
  zIndex: 999,
  fontFamily: 'monospace',
  fontSize: 10,
  color: '#818cf8',
  boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
  display: 'flex',
  flexDirection: 'column',
  gap: 4
};

const commandModeBtnStyle = (active) => ({
  padding: '5px 12px',
  fontSize: '9px',
  fontWeight: 700,
  borderRadius: 4,
  cursor: 'pointer',
  border: 'none',
  background: active ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'transparent',
  color: active ? '#fff' : '#64748b',
  transition: 'all 0.15s ease'
});

const mapControlBtnStyle = {
  width: '32px',
  height: '32px',
  background: 'rgba(10,15,30,0.85)',
  border: '1px solid rgba(255,255,255,0.05)',
  color: '#fff',
  borderRadius: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  backdropFilter: 'blur(10px)',
  outline: 'none'
};

const layerOptionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: '9px',
  color: '#B0B0B0',
  cursor: 'pointer'
};

const bottomStatBlockStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 6
};

const bottomStatLabelStyle = {
  fontSize: '9px',
  color: '#64748b',
  textTransform: 'uppercase'
};

const bottomStatValStyle = {
  fontSize: '11px',
  fontWeight: 700,
  color: '#fff'
};
