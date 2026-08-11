/* eslint-disable */
// ============================================================
// GatiFleet — Unified Next-Gen Fleet Command Center & Telematics OS
// Combines All Core Intelligence Views (Global, Region, Fleet, Cargo, Driver, AI Ops, Exec)
// with Control Tower SOS, Reefer Telematics, FASTag/e-Way, TPMS Heatmap & Trip Playback
// ============================================================

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, AlertTriangle, ShieldAlert, Radio, Clock, CheckCircle2,
  PhoneCall, Truck, MapPin, X, Search, Share2, Layers, ZoomIn, ZoomOut,
  Gauge, Thermometer, Disc, FileText, CheckCircle, IndianRupee, Settings, User,
  ChevronDown, ChevronRight, ChevronLeft, ArrowUpRight, Copy, Check, Sparkles, RefreshCw,
  Activity, PauseCircle, Wrench, WifiOff, Fuel, Lock, Unlock, Shield, Send, BarChart3, Users
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { generateTrucks, generateDrivers, generateShipments, CITIES } from '../../data/mockData';
import { useTheme } from '../../context/ThemeContext';
import GisWeatherDrawer from '../../components/fleet/GisWeatherDrawer';
import ConsignmentVaultModal from '../../components/fleet/ConsignmentVaultModal';
import WaypointFilterModal from '../../components/fleet/WaypointFilterModal';
import PlaybackSettingsModal from '../../components/fleet/PlaybackSettingsModal';

// ---- Static Data Generation ----
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const ALL_TRUCKS = generateTrucks(50).map((t) => {
  const coolantTemp = t.healthScore < 70 ? 118 : Math.floor(Math.random() * (95 - 80 + 1)) + 80;
  const tirePressure = t.healthScore < 70 ? 82 : Math.floor(Math.random() * (135 - 110 + 1)) + 110;
  const brakeWear = t.healthScore < 70 ? 84 : Math.floor(Math.random() * (55 - 20 + 1)) + 20;
  const axleVibration = t.healthScore < 70 ? 'Critical' : 'Normal';
  const refrigTemp = Math.floor(Math.random() * (8 - (-4) + 1)) - 4;
  const cargoWeight = Math.floor(Math.random() * (24 - 12 + 1)) + 12;
  const doorLocked = true;

  return {
    ...t,
    coolantTemp,
    tirePressure,
    brakeWear,
    axleVibration,
    refrigTemp,
    cargoWeight,
    doorLocked,
    rerouted: false
  };
});

const ALL_DRIVERS = generateDrivers(30);
const ALL_SHIPMENTS = generateShipments(30);

const CORRIDORS = [
  { name: 'NH48 Western Express (Mumbai-Delhi)', activeVehicles: 42, avgSpeed: 68, congestion: 'Normal', status: 'GREEN' },
  { name: 'NH44 North-South Spine (Kashmir-Kanyakumari)', activeVehicles: 38, avgSpeed: 54, congestion: 'Moderate', status: 'YELLOW' },
  { name: 'Golden Quadrilateral Eastern Section (Kolkata-Chennai)', activeVehicles: 24, avgSpeed: 42, congestion: 'High Risk', status: 'RED' },
  { name: 'NH27 East-West Connector (Porbandar-Silchar)', activeVehicles: 10, avgSpeed: 72, congestion: 'Clear', status: 'GREEN' }
];

const REGIONAL_HUBS = [
  { name: 'Bhiwandi Super Depot', state: 'Maharashtra', capacity: '88%', trucksInHub: 18, status: 'OPERATIONAL' },
  { name: 'Manesar Industrial Terminal', state: 'Haryana', capacity: '92%', trucksInHub: 24, status: 'HIGH_LOAD' },
  { name: 'Vapi Checkpoint Complex', state: 'Gujarat', capacity: '64%', trucksInHub: 12, status: 'OPERATIONAL' },
  { name: 'Jaipur Logistics Hub', state: 'Rajasthan', capacity: '78%', trucksInHub: 15, status: 'OPERATIONAL' },
  { name: 'Chakan Auto Hub', state: 'Maharashtra', capacity: '81%', trucksInHub: 11, status: 'OPERATIONAL' },
  { name: 'Sriperumbudur Complex', state: 'Tamil Nadu', capacity: '70%', trucksInHub: 9, status: 'OPERATIONAL' }
];

export default function LiveTracking() {
  const navigate = useNavigate();
  const { copilotOpen, toggleCopilot } = useTheme();

  // Navigation View Tab State: 'nation' | 'regional' | 'fleet' | 'shipment' | 'driver' | 'decision' | 'executive'
  const [activeView, setActiveView] = useState('fleet');

  // Sidebar Visibility & Width
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightDockOpen, setRightDockOpen] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedTruck, setSelectedTruck] = useState(ALL_TRUCKS[0]);
  const [commandMode, setCommandMode] = useState('maximize_eta'); // reduce_cost | maximize_eta | minimize_risk

  // Top Clock & Status
  const [timeString, setTimeString] = useState('14:45:12');
  const [currentDate] = useState('Nov 12, 2023');

  // Playback Controls State
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [playbackProgress, setPlaybackProgress] = useState(65);

  // Control Tower SOS Alert State
  const [sosDismissed, setSosDismissed] = useState(false);

  // Playback Icon Modals State
  const [showGisDrawer, setShowGisDrawer] = useState(false);
  const [showConsignmentVault, setShowConsignmentVault] = useState(false);
  const [showWaypointFilter, setShowWaypointFilter] = useState(false);
  const [showPlaybackSettings, setShowPlaybackSettings] = useState(false);

  // Consignee Link Copy State
  const [copiedLink, setCopiedLink] = useState(false);
  const [sharedUrl, setSharedUrl] = useState('https://danis.com/sharedftaltA9842');

  // Reefer Telemetry Selected Vehicle State
  const [reeferTruckId, setReeferTruckId] = useState('TRK-314');

  const currentReeferTruck = useMemo(() => {
    return ALL_TRUCKS.find(t => t.id === reeferTruckId) || ALL_TRUCKS[0];
  }, [reeferTruckId]);

  // Map Ref
  const mapRef = useRef(null);
  const leafletMap = useRef(null);

  // Clock interval
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const map = L.map(mapRef.current, {
      center: [22.5937, 78.9629],
      zoom: 5,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    leafletMap.current = map;

    // Route Polylines
    const routes = [
      { points: [[19.0760, 72.8777], [20.0, 73.5], [22.7196, 75.8577], [26.9124, 75.7873], [28.7041, 77.1025]], color: '#10b981', weight: 4 },
      { points: [[22.5726, 88.3639], [21.1458, 79.0882], [19.0760, 72.8777]], color: '#f59e0b', weight: 4 },
      { points: [[13.0827, 80.2707], [17.3850, 78.4867], [21.1458, 79.0882], [28.7041, 77.1025]], color: '#ef4444', weight: 4 },
      { points: [[26.9124, 75.7873], [23.0225, 72.5714], [19.0760, 72.8777]], color: '#10b981', weight: 4 }
    ];

    routes.forEach(r => {
      L.polyline(r.points, { color: r.color, weight: r.weight, opacity: 0.8 }).addTo(map);
    });

    // Render Markers for ALL_TRUCKS
    ALL_TRUCKS.forEach(t => {
      const isSOS = t.id === 'TRK-00001' || t.id === 'TRK-314';
      const markerColor = isSOS ? '#ef4444' : t.status === 'active' ? '#10b981' : t.status === 'idle' ? '#f59e0b' : '#64748b';

      const customHtml = `
        <div style="position:relative; display:flex; align-items:center; justify-content:center; cursor:pointer;">
          <div style="position:absolute; width:22px; height:22px; border-radius:50%; background:${markerColor}; opacity:0.4; animation: pulseRing 1.5s infinite;"></div>
          <div style="width:12px; height:12px; border-radius:50%; background:${markerColor}; border:2px solid #070b14; box-shadow:0 0 8px ${markerColor};"></div>
        </div>
      `;
      const icon = L.divIcon({ html: customHtml, className: 'custom-map-pin', iconSize: [22, 22] });
      const m = L.marker([t.lat, t.lng], { icon }).addTo(map);
      m.on('click', () => setSelectedTruck(t));
    });

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  // Filtered Trucks List
  const filteredTrucks = useMemo(() => {
    return ALL_TRUCKS.filter(t => {
      const matchSearch = t.id.toLowerCase().includes(searchQuery.toLowerCase()) || t.driverName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || t.status.toUpperCase() === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchQuery, statusFilter]);

  // Playback loop
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackProgress(prev => (prev >= 100 ? 0 : prev + 1 * playbackSpeed));
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const copyShareLink = () => {
    navigator.clipboard?.writeText(sharedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const toggleDoorLock = (truckId) => {
    setSelectedTruck(prev => prev ? { ...prev, doorLocked: !prev.doorLocked } : prev);
  };

  return (
    <div style={styles.container}>
      {/* Top Navbar Header */}
      <header style={styles.header}>
        <div style={{ ...styles.headerLeft, cursor: 'pointer' }} onClick={() => navigate('/')} title="Go to GatiFleet Homepage">
          <div style={styles.logoBadge}>
            <Truck size={18} color="white" />
          </div>
          <span style={styles.logoTitle}>GatiFleet</span>
        </div>

        {/* View Navigation Tabs */}
        <div style={styles.navTabsGroup}>
          {[
            { id: 'nation', label: 'Global' },
            { id: 'regional', label: 'Region' },
            { id: 'fleet', label: 'Fleet' },
            { id: 'shipment', label: 'Cargo' },
            { id: 'driver', label: 'Driver' },
            { id: 'decision', label: 'AI Ops' },
            { id: 'executive', label: 'Exec' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              style={styles.navTabBtn(activeView === tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={styles.headerRight}>
          <div style={styles.statusPill}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            Connected
          </div>
          <div style={styles.timeBadge}>{timeString}</div>
          <div style={styles.userBadge}>
            <User size={14} color="#818cf8" />
            <span>User: <strong>Admin</strong></span>
          </div>
        </div>
      </header>

      {/* Main Command Center Body Viewport */}
      <div style={styles.viewport}>
        {/* Left Interactive Operations Sidebar Drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              style={styles.leftSidebar}
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Sidebar Header & Toggle */}
              <div style={styles.sidebarHeader}>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {activeView} Intelligence
                </span>
                <button onClick={() => setSidebarOpen(false)} style={styles.closeBtn}><ChevronLeft size={16} /></button>
              </div>

              {/* View 1: NATION / GLOBAL */}
              {activeView === 'nation' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={styles.statBox}>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>Western India Capacity</span>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981', marginTop: 2 }}>88.4% (Nominal)</div>
                  </div>

                  <div style={{ fontSize: 11, fontWeight: 700, color: '#818cf8', marginTop: 6 }}>ACTIVE HIGHWAY CORRIDORS</div>
                  {CORRIDORS.map(c => (
                    <div key={c.name} style={styles.itemCard}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>{c.name}</div>
                      <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                        <span>Vehicles: <strong style={{ color: 'white' }}>{c.activeVehicles}</strong></span>
                        <span>Speed: <strong style={{ color: '#38bdf8' }}>{c.avgSpeed} km/h</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* View 2: REGIONAL HUBS */}
              {activeView === 'regional' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#818cf8' }}>REGIONAL TERMINALS & DEPOTS</div>
                  {REGIONAL_HUBS.map(hub => (
                    <div key={hub.name} style={styles.itemCard}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>{hub.name}</span>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7' }}>{hub.capacity}</span>
                      </div>
                      <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>
                        State: {hub.state} · Active Fleet: <strong style={{ color: 'white' }}>{hub.trucksInHub}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* View 3: FLEET ROSTER */}
              {activeView === 'fleet' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, overflow: 'hidden' }}>
                  {/* Search & Filter Bar */}
                  <div style={{ position: 'relative' }}>
                    <Search size={12} color="#6b7280" style={{ position: 'absolute', left: 10, top: 10 }} />
                    <input
                      type="text"
                      placeholder="Search TRK ID or Driver..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={styles.sidebarSearchInput}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 4 }}>
                    {['ALL', 'ACTIVE', 'IDLE', 'OFFLINE'].map(s => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        style={{
                          flex: 1,
                          padding: '4px 0',
                          fontSize: 9,
                          fontWeight: 700,
                          borderRadius: 4,
                          border: statusFilter === s ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.06)',
                          background: statusFilter === s ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                          color: statusFilter === s ? '#818cf8' : '#9ca3af',
                          cursor: 'pointer'
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  {/* Truck Cards Scroll Area */}
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, paddingRight: 4 }}>
                    {filteredTrucks.map(t => {
                      const isSelected = selectedTruck?.id === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => setSelectedTruck(t)}
                          style={{
                            ...styles.itemCard,
                            border: isSelected ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.06)',
                            background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.02)',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: isSelected ? '#818cf8' : 'white' }}>{t.id}</span>
                            <span style={{
                              fontSize: 9,
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: 4,
                              background: t.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                              color: t.status === 'active' ? '#6ee7b7' : '#fcd34d'
                            }}>
                              {t.status.toUpperCase()}
                            </span>
                          </div>
                          <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>
                            Driver: <strong style={{ color: 'white' }}>{t.driverName}</strong> · Speed: {t.speed} km/h
                          </div>
                          <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>
                            Reefer: {t.refrigTemp}°C · Health: {t.healthScore}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* View 4: CARGO / SHIPMENT */}
              {activeView === 'shipment' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#818cf8' }}>ACTIVE SHIPMENT CONSIGNMENTS</div>
                  {ALL_SHIPMENTS.slice(0, 6).map(s => (
                    <div key={s.id} style={styles.itemCard}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: 'white' }}>{s.id}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#34d399' }}>SLA 98.4%</span>
                      </div>
                      <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>
                        Client: <strong style={{ color: 'white' }}>{s.customer}</strong>
                      </div>
                      <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>
                        Route: {s.origin} ➔ {s.destination}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* View 5: DRIVERS */}
              {activeView === 'driver' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#818cf8' }}>DRIVER ROSTER & HOS SAFETY</div>
                  {ALL_DRIVERS.slice(0, 6).map(d => (
                    <div key={d.id} style={styles.itemCard}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: 'white' }}>{d.name}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: d.safetyScore > 85 ? '#34d399' : '#f59e0b' }}>Score: {d.safetyScore}/100</span>
                      </div>
                      <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>
                        Hours-of-Service: <strong style={{ color: 'white' }}>{d.hoursDriven || '6.2'}h / 10h</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* View 6: AI OPS / DECISION */}
              {activeView === 'decision' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#818cf8' }}>AI COMMAND MODE SELECTION</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {[
                      { id: 'reduce_cost', label: 'Reduce Cost Mode', desc: 'Optimize fuel consumption & empty km' },
                      { id: 'maximize_eta', label: 'Maximize ETA Mode', desc: 'Prioritize peak SLA on-time arrival' },
                      { id: 'minimize_risk', label: 'Minimize Risk Mode', desc: 'Reroute and bypass high-risk zones' }
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => setCommandMode(m.id)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 8,
                          textAlign: 'left',
                          border: commandMode === m.id ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.06)',
                          background: commandMode === m.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.02)',
                          color: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontSize: 11, fontWeight: 700, color: commandMode === m.id ? '#818cf8' : 'white' }}>{m.label}</div>
                        <div style={{ fontSize: 9, color: '#9ca3af', marginTop: 2 }}>{m.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* View 7: EXEC */}
              {activeView === 'executive' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={styles.statBox}>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>Portfolio Revenue At Risk</span>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#ef4444', marginTop: 2 }}>₹14.2 Lakhs</div>
                  </div>
                  <div style={styles.statBox}>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>Consensus Operating Margin</span>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981', marginTop: 2 }}>24.8%</div>
                  </div>
                </div>
              )}
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Sidebar Re-Open Button when Collapsed */}
        {!sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)} style={styles.reopenSidebarBtn} title="Open Operations Panel">
            <ChevronRight size={18} color="white" />
          </button>
        )}

        {/* Center GIS Map Canvas */}
        <div ref={mapRef} style={styles.mapCanvas} />

        {/* Floating Map Legend (Bottom Right of Map) */}
        <div style={styles.mapLegend}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'white', marginBottom: 6 }}>Routes</div>
          <div style={styles.legendRow}><span style={{ ...styles.legendDot, background: '#10b981' }} /> Green</div>
          <div style={styles.legendRow}><span style={{ ...styles.legendDot, background: '#f59e0b' }} /> Yellow</div>
          <div style={styles.legendRow}><span style={{ ...styles.legendDot, background: '#ef4444' }} /> Red</div>
        </div>

        {/* Floating Map Controls (Top Right of Map) */}
        <div style={{ ...styles.mapToolsGroup, right: rightDockOpen ? '340px' : '20px' }}>
          <button style={styles.mapToolBtn} onClick={() => leafletMap.current?.zoomIn()} title="Zoom In"><ZoomIn size={16} /></button>
          <button style={styles.mapToolBtn} onClick={() => leafletMap.current?.zoomOut()} title="Zoom Out"><ZoomOut size={16} /></button>
          <button style={styles.mapToolBtn} title="Layer Toggle"><Layers size={16} /></button>
          <button style={styles.mapToolBtn} title="Share Map View"><Share2 size={16} /></button>
        </div>

        {/* Top Left Overlay Card — CONTROL TOWER PANIC SOS */}
        <AnimatePresence>
          {!sosDismissed && (
            <motion.div
              style={{ ...styles.sosCard, left: sidebarOpen ? '340px' : '20px' }}
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.95 }}
            >
              <div style={styles.cardHeader}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#f3f4f6', letterSpacing: '0.05em' }}>CONTROL TOWER</span>
                <button onClick={() => setSosDismissed(true)} style={styles.closeBtn}><X size={14} /></button>
              </div>

              <div style={styles.sosAlertBox}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <AlertTriangle size={24} color="#ef4444" style={{ animation: 'bounce 1s infinite' }} />
                  <span style={{ fontSize: 18, fontWeight: 900, color: '#ef4444', letterSpacing: '0.04em' }}>PANIC SOS ALERT!</span>
                </div>
                <div style={{ fontSize: 12, color: 'white', fontWeight: 700, marginBottom: 4 }}>
                  URGENT: PANIC EVENT - DL 1GC 6789 - TRUCK 314
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>
                  Location: NH 48 near Jaipur (26.91N, 75.78E)
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 14 }}>
                  Timestamp: 14:42:01
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => alert('Dispatching nearest GatiFleet patrol team to TRUCK 314 (Jaipur NH48)...')} style={styles.btnAcknowledge}>
                    ACKNOWLEDGE & DISPATCH
                  </button>
                  <button onClick={() => alert('Connecting live vehicle dashcam video feed...')} style={styles.btnLiveFeed}>
                    LIVE FEED
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Vehicle Detail Floating Intelligence Drawer */}
        {selectedTruck && (
          <div style={{ ...styles.vehicleDetailDrawer, left: sidebarOpen ? '340px' : '20px', top: sosDismissed ? '16px' : '230px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Truck size={16} color="#6366f1" />
                <span style={{ fontSize: 13, fontWeight: 800, color: 'white' }}>{selectedTruck.id}</span>
                <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>● Active</span>
              </div>
              <button onClick={() => setSelectedTruck(null)} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}><X size={12} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, fontSize: 10, color: '#9ca3af', margin: '6px 0' }}>
              <div>Driver: <strong style={{ color: 'white' }}>{selectedTruck.driverName}</strong></div>
              <div>Speed: <strong style={{ color: '#38bdf8' }}>{selectedTruck.speed} km/h</strong></div>
              <div>Coolant: <strong style={{ color: '#f59e0b' }}>{selectedTruck.coolantTemp}°C</strong></div>
              <div>Reefer: <strong style={{ color: '#a855f7' }}>{selectedTruck.refrigTemp}°C</strong></div>
            </div>

            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <button
                onClick={() => toggleDoorLock(selectedTruck.id)}
                style={{
                  padding: '4px 10px',
                  background: selectedTruck.doorLocked ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  border: selectedTruck.doorLocked ? '1px solid #10b981' : '1px solid #ef4444',
                  color: selectedTruck.doorLocked ? '#6ee7b7' : '#fca5a5',
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                {selectedTruck.doorLocked ? <Lock size={12} /> : <Unlock size={12} />}
                {selectedTruck.doorLocked ? 'Door Locked' : 'Door Unlocked'}
              </button>

              <button
                onClick={() => alert(`Reroute Bypass Authorized for ${selectedTruck.id}`)}
                style={{
                  padding: '4px 10px',
                  background: 'rgba(99, 102, 241, 0.2)',
                  border: '1px solid #6366f1',
                  color: '#818cf8',
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Authorize Bypass Reroute
              </button>
            </div>
          </div>
        )}

        {/* Right Telemetry Stack (4 Stacked Widgets) */}
        <AnimatePresence>
          {rightDockOpen && (
            <motion.aside
              style={styles.rightDock}
              initial={{ x: 340, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 340, opacity: 0 }}
            >
              {/* Widget 1: FASTag TOLL & e-WAY BILL */}
              <div style={styles.widgetCard}>
                <div style={styles.widgetHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <IndianRupee size={15} color="#34d399" />
                    <span style={styles.widgetTitle}>FASTag TOLL & e-WAY BILL</span>
                  </div>
                  <button onClick={() => setRightDockOpen(false)} style={styles.closeBtn}><ChevronRight size={14} /></button>
                </div>
                <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 8 }}>List of recent automated transactions</div>

                <div style={styles.tableHeader}>
                  <span>ID</span>
                  <span>Amount</span>
                  <span>Status</span>
                  <span style={{ textAlign: 'right' }}>Timestamp</span>
                </div>
                <div style={styles.tableRow}>
                  <span style={{ color: '#818cf8', fontWeight: 700 }}>TRK-314</span>
                  <span>₹20.00</span>
                  <span style={styles.pillActive}>● Active</span>
                  <span style={styles.timeText}>14:42:27 AM</span>
                </div>
                <div style={styles.tableRow}>
                  <span style={{ color: '#818cf8', fontWeight: 700 }}>TRK-314</span>
                  <span>₹30.00</span>
                  <span style={styles.pillActive}>● Active</span>
                  <span style={styles.timeText}>14:42:27 AM</span>
                </div>
                <div style={styles.tableRow}>
                  <span style={{ color: '#818cf8', fontWeight: 700 }}>TRK-315</span>
                  <span>₹25.00</span>
                  <span style={styles.pillRone}>● Rone</span>
                  <span style={styles.timeText}>14:50:59 AM</span>
                </div>
              </div>

              {/* Widget 2: REEFER TELEMETRY */}
              <div style={styles.widgetCard}>
                <div style={styles.widgetHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Thermometer size={15} color="#38bdf8" />
                    <span style={styles.widgetTitle}>REEFER TELEMETRY</span>
                  </div>
                  <select
                    value={reeferTruckId}
                    onChange={(e) => setReeferTruckId(e.target.value)}
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: '#818cf8',
                      background: '#090d16',
                      border: '1px solid rgba(99, 102, 241, 0.4)',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {ALL_TRUCKS.map(t => (
                      <option key={t.id} value={t.id} style={{ background: '#090d16', color: '#f3f4f6' }}>
                        {t.id} ({t.refrigTemp}°C)
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '6px 0 8px' }}>
                  <div>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>Temperature °C &nbsp;</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8' }}>
                      {currentReeferTruck ? `${currentReeferTruck.refrigTemp}°C` : '-22.1°C'}
                    </span>
                    <span style={{ fontSize: 11, color: '#6b7280' }}> / -22.0°C</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 6px', borderRadius: 4 }}>
                    ⚠ Alerts
                  </span>
                </div>

                <div style={styles.chartContainer}>
                  <svg width="100%" height="54" viewBox="0 0 300 54" preserveAspectRatio="none">
                    <path
                      d="M 0,30 Q 30,10 60,35 T 120,20 T 180,40 T 240,15 T 300,32"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                    <path
                      d="M 0,30 Q 30,10 60,35 T 120,20 T 180,40 T 240,15 T 300,32 L 300,54 L 0,54 Z"
                      fill="rgba(56, 189, 248, 0.12)"
                    />
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#6b7280', marginTop: 2 }}>
                    <span>0h</span>
                    <span>8h</span>
                    <span>14h</span>
                    <span>20h</span>
                    <span>24h</span>
                  </div>
                </div>
              </div>

              {/* Widget 3: TPMS 18-WHEELER HEATMAP */}
              <div style={styles.widgetCard}>
                <div style={styles.widgetHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Disc size={15} color="#c084fc" />
                    <span style={styles.widgetTitle}>TPMS 18-WHEELER HEATMAP</span>
                  </div>
                  <span style={{ fontSize: 10, color: '#9ca3af' }}>•••</span>
                </div>
                <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 8 }}>Tyre pressure (PSI) and temp (°C)</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[
                    { label: 'Tyres', vals: [105, 105, 118, 105, 105, 118] },
                    { label: 'Tyres', vals: [105, 118, 118, 118, 118, 118] },
                    { label: 'Tyre 18', vals: [105, 118, 118, 118, 118, 118] },
                    { label: 'Tyres', vals: [105, 118, 118, 118, 118, 118] }
                  ].map((row, rIdx) => (
                    <div key={rIdx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 9, color: '#9ca3af', width: 42 }}>{row.label}</span>
                      <div style={{ display: 'flex', gap: 4, flex: 1 }}>
                        {row.vals.map((v, cIdx) => (
                          <span
                            key={cIdx}
                            style={{
                              flex: 1,
                              textAlign: 'center',
                              padding: '3px 0',
                              fontSize: 10,
                              fontWeight: 700,
                              borderRadius: 3,
                              background: v === 105 ? '#ef4444' : '#10b981',
                              color: 'white'
                            }}
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 9, color: '#9ca3af', marginTop: 8 }}>
                  <span>Alert</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: '#ef4444', borderRadius: 2 }} /> Red 105 PSI</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: '#10b981', borderRadius: 2 }} /> Green 118 PSI</span>
                </div>
              </div>

              {/* Widget 4: CONSIGNEE TRACKING LINK */}
              <div style={styles.widgetCard}>
                <div style={styles.widgetHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Share2 size={15} color="#818cf8" />
                    <span style={styles.widgetTitle}>CONSIGNEE TRACKING LINK</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, margin: '8px 0' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={12} color="#6b7280" style={{ position: 'absolute', left: 8, top: 8 }} />
                    <input
                      type="text"
                      placeholder="Search vehicle"
                      style={styles.searchInput}
                    />
                  </div>
                  <button style={styles.btnIconShare}><Share2 size={12} /></button>
                </div>

                <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>Shared links</div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <input
                    readOnly
                    value={sharedUrl}
                    style={styles.linkInput}
                  />
                  <button onClick={copyShareLink} style={styles.btnCopy}>
                    {copiedLink ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10 }}>
                  <div>
                    <span style={{ color: '#6b7280' }}>Recipient: </span>
                    <span style={{ color: 'white', fontWeight: 600 }}>Tata Motors</span>
                    <span style={{ color: '#34d399', marginLeft: 8, fontWeight: 700 }}>Active</span>
                  </div>
                  <button onClick={() => alert('Tracking link dispatched to Tata Motors Logistics Portal!')} style={styles.btnSharePrimary}>
                    Share
                  </button>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Right Dock Re-Open Button when Collapsed */}
        {!rightDockOpen && (
          <button onClick={() => setRightDockOpen(true)} style={styles.reopenRightBtn} title="Open Telematics Dock">
            <ChevronLeft size={18} color="white" />
          </button>
        )}

        {/* Bottom Full-Width Dock — TRIP PLAYBACK */}
        <footer style={{ ...styles.bottomDock, left: sidebarOpen ? '340px' : '16px', right: rightDockOpen ? '340px' : '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Play size={10} color="white" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'white', letterSpacing: '0.04em' }}>TRIP PLAYBACK</span>
          </div>

          <div style={styles.timelineScrubber}>
            <div style={styles.timelineLineBg} />
            <div style={{ ...styles.timelineLineProgress, width: `${playbackProgress}%` }} />

            <span style={{ ...styles.timelineNode, left: '20%', background: '#10b981' }}>210</span>
            <span style={{ ...styles.timelineNode, left: '40%', background: '#10b981' }}>555</span>
            <span style={{ ...styles.timelineNode, left: '60%', background: '#f59e0b' }}>510</span>
            <span style={{ ...styles.timelineNode, left: '90%', background: '#ef4444' }}>ROD</span>

            <div style={{ ...styles.playheadMarker, left: `${playbackProgress}%` }} />
          </div>

          <div style={styles.controlsBar}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button onClick={() => setIsPlaying(!isPlaying)} style={styles.btnPlayToggle}>
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button onClick={() => setPlaybackProgress(0)} style={styles.btnMiniControl}>
                ⏮
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#9ca3af' }}>
                <span>Speed</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={playbackProgress}
                  onChange={(e) => setPlaybackProgress(Number(e.target.value))}
                  style={{ width: 100, accentColor: '#6366f1' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>
                Timestamp <strong style={styles.timeBadgeDigit}>14:45:12</strong>
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>{currentDate}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                style={{ ...styles.btnBottomIcon, background: showGisDrawer ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.04)', borderColor: showGisDrawer ? '#38bdf8' : 'rgba(255,255,255,0.08)' }}
                title="GIS & Weather Radar Layer"
                onClick={() => setShowGisDrawer(true)}
              >
                🌐
              </button>
              <button
                style={{ ...styles.btnBottomIcon, background: showConsignmentVault ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.04)', borderColor: showConsignmentVault ? '#6366f1' : 'rgba(255,255,255,0.08)' }}
                title="Consignment & LR/GR Vault"
                onClick={() => setShowConsignmentVault(true)}
              >
                <FileText size={14} />
              </button>
              <button
                style={{ ...styles.btnBottomIcon, background: showWaypointFilter ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.04)', borderColor: showWaypointFilter ? '#f59e0b' : 'rgba(255,255,255,0.08)' }}
                title="Waypoint Anomaly Search"
                onClick={() => setShowWaypointFilter(true)}
              >
                <Search size={14} />
              </button>
              <button
                style={{ ...styles.btnBottomIcon, background: showPlaybackSettings ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.04)', borderColor: showPlaybackSettings ? '#a855f7' : 'rgba(255,255,255,0.08)' }}
                title="Playback Engine Settings"
                onClick={() => setShowPlaybackSettings(true)}
              >
                <Settings size={14} />
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Render 4 Interactive Playback Icon Feature Drawers */}
      {showGisDrawer && <GisWeatherDrawer onClose={() => setShowGisDrawer(false)} />}
      {showConsignmentVault && <ConsignmentVaultModal vehicle={selectedTruck} onClose={() => setShowConsignmentVault(false)} />}
      {showWaypointFilter && <WaypointFilterModal onClose={() => setShowWaypointFilter(false)} onSelectWaypoint={(wp) => alert(`Jumping map timeline to Waypoint ${wp.id}: ${wp.location}`)} />}
      {showPlaybackSettings && <PlaybackSettingsModal onClose={() => setShowPlaybackSettings(false)} />}

      <style>{`
        @keyframes pulseRing {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  );
}

// Inline Styles
const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    background: '#070b14',
    color: '#f3f4f6',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: "'Inter', system-ui, sans-serif",
    position: 'fixed',
    inset: 0,
    zIndex: 99999
  },
  header: {
    height: '48px',
    background: 'rgba(11, 15, 25, 0.95)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    zIndex: 100
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  logoBadge: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)'
  },
  logoTitle: {
    fontSize: '16px',
    fontWeight: 900,
    background: 'linear-gradient(90deg, #ffffff, #818cf8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em'
  },
  navTabsGroup: {
    display: 'flex',
    gap: '4px',
    background: 'rgba(255, 255, 255, 0.04)',
    padding: '3px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.06)'
  },
  navTabBtn: (active) => ({
    padding: '4px 12px',
    fontSize: '11px',
    fontWeight: 700,
    borderRadius: '6px',
    border: 'none',
    background: active ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
    color: active ? '#ffffff' : '#9ca3af',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }),
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  statusPill: {
    fontSize: '11px',
    color: '#10b981',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: 600
  },
  timeBadge: {
    fontSize: '12px',
    fontFamily: 'monospace',
    fontWeight: 700,
    color: '#818cf8',
    background: 'rgba(99, 102, 241, 0.1)',
    padding: '3px 8px',
    borderRadius: '6px',
    border: '1px solid rgba(99, 102, 241, 0.2)'
  },
  userBadge: {
    fontSize: '11px',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255, 255, 255, 0.04)',
    padding: '4px 10px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.08)'
  },
  viewport: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden'
  },
  leftSidebar: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    bottom: '90px',
    width: '310px',
    background: 'rgba(11, 15, 25, 0.94)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '14px',
    padding: '14px',
    backdropFilter: 'blur(16px)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 40,
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
  },
  sidebarSearchInput: {
    width: '100%',
    padding: '6px 8px 6px 28px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '6px',
    color: 'white',
    fontSize: '11px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  reopenSidebarBtn: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    background: 'rgba(11, 15, 25, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 40
  },
  reopenRightBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    background: 'rgba(11, 15, 25, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 40
  },
  statBox: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: '12px',
    borderRadius: '10px'
  },
  itemCard: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    padding: '10px',
    borderRadius: '10px'
  },
  mapCanvas: {
    position: 'absolute',
    inset: 0,
    zIndex: 1
  },
  mapLegend: {
    position: 'absolute',
    bottom: '90px',
    right: '340px',
    background: 'rgba(11, 15, 25, 0.85)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    padding: '10px 14px',
    backdropFilter: 'blur(10px)',
    zIndex: 20
  },
  legendRow: {
    fontSize: '10px',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '3px'
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  mapToolsGroup: {
    position: 'absolute',
    top: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    zIndex: 20
  },
  mapToolBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(11, 15, 25, 0.85)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)'
  },
  sosCard: {
    position: 'absolute',
    top: '16px',
    width: '360px',
    background: 'rgba(11, 15, 25, 0.92)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    borderRadius: '14px',
    padding: '14px',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 10px 40px rgba(239, 68, 68, 0.25)',
    zIndex: 30
  },
  vehicleDetailDrawer: {
    position: 'absolute',
    width: '360px',
    background: 'rgba(11, 15, 25, 0.92)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '14px',
    padding: '12px 14px',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 10px 40px rgba(99, 102, 241, 0.2)',
    zIndex: 30
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#6b7280',
    cursor: 'pointer'
  },
  sosAlertBox: {
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '10px',
    padding: '12px'
  },
  btnAcknowledge: {
    flex: 1,
    padding: '8px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '10px',
    fontWeight: 900,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
  },
  btnLiveFeed: {
    padding: '8px 14px',
    background: '#f59e0b',
    color: '#070b14',
    border: 'none',
    borderRadius: '8px',
    fontSize: '10px',
    fontWeight: 900,
    cursor: 'pointer'
  },
  rightDock: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    bottom: '90px',
    width: '310px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    overflowY: 'auto',
    zIndex: 20
  },
  widgetCard: {
    background: 'rgba(11, 15, 25, 0.92)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '12px',
    backdropFilter: 'blur(16px)'
  },
  widgetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  widgetTitle: {
    fontSize: '11px',
    fontWeight: 800,
    color: '#f3f4f6',
    letterSpacing: '0.04em'
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr 1fr 1.2fr',
    fontSize: '9px',
    color: '#6b7280',
    paddingBottom: '4px',
    borderBottom: '1px solid rgba(255,255,255,0.06)'
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr 1fr 1.2fr',
    fontSize: '10px',
    alignItems: 'center',
    padding: '4px 0',
    borderBottom: '1px solid rgba(255,255,255,0.03)'
  },
  pillActive: {
    fontSize: '9px',
    fontWeight: 700,
    color: '#34d399',
    background: 'rgba(52, 211, 153, 0.15)',
    padding: '1px 5px',
    borderRadius: '4px',
    display: 'inline-block'
  },
  pillRone: {
    fontSize: '9px',
    fontWeight: 700,
    color: '#f87171',
    background: 'rgba(248, 113, 113, 0.15)',
    padding: '1px 5px',
    borderRadius: '4px',
    display: 'inline-block'
  },
  timeText: {
    fontSize: '9px',
    color: '#6b7280'
  },
  chartContainer: {
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '8px',
    padding: '6px',
    border: '1px solid rgba(255,255,255,0.04)'
  },
  searchInput: {
    width: '100%',
    padding: '6px 8px 6px 24px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '6px',
    color: 'white',
    fontSize: '10px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  btnIconShare: {
    padding: '6px 8px',
    background: '#6366f1',
    border: 'none',
    color: 'white',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  linkInput: {
    flex: 1,
    padding: '4px 8px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '6px',
    color: '#818cf8',
    fontSize: '9px',
    fontFamily: 'monospace'
  },
  btnCopy: {
    padding: '4px 8px',
    background: 'rgba(255,255,255,0.06)',
    border: 'none',
    color: 'white',
    borderRadius: '6px',
    cursor: 'pointer'
  },
  btnSharePrimary: {
    padding: '4px 12px',
    background: '#6366f1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: 700,
    cursor: 'pointer'
  },
  bottomDock: {
    position: 'absolute',
    bottom: '12px',
    background: 'rgba(11, 15, 25, 0.94)',
    border: '1px solid rgba(99, 102, 241, 0.25)',
    borderRadius: '12px',
    padding: '10px 14px',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
    zIndex: 20,
    transition: 'all 0.3s ease'
  },
  timelineScrubber: {
    position: 'relative',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    margin: '4px 0 8px'
  },
  timelineLineBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '4px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '2px'
  },
  timelineLineProgress: {
    position: 'absolute',
    left: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #6366f1, #38bdf8)',
    borderRadius: '2px',
    boxShadow: '0 0 8px #38bdf8'
  },
  timelineNode: {
    position: 'absolute',
    transform: 'translate(-50%, -14px)',
    padding: '1px 6px',
    borderRadius: '4px',
    color: 'white',
    fontSize: '9px',
    fontWeight: 800,
    boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
  },
  playheadMarker: {
    position: 'absolute',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'white',
    border: '2px solid #6366f1',
    boxShadow: '0 0 10px white',
    transform: 'translateX(-50%)'
  },
  controlsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  btnPlayToggle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: '#6366f1',
    border: 'none',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  btnMiniControl: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    fontSize: '12px'
  },
  timeBadgeDigit: {
    color: 'white',
    fontFamily: 'monospace',
    background: 'rgba(255,255,255,0.06)',
    padding: '2px 6px',
    borderRadius: '4px',
    marginLeft: '4px'
  },
  btnBottomIcon: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#9ca3af',
    borderRadius: '6px',
    padding: '4px 8px',
    cursor: 'pointer'
  }
};
