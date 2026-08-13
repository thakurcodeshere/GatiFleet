/* eslint-disable */
// ============================================================
// GatiFleet — Executive Dashboard
// CEO-Level Command Center (Refactored with Multi-Tab Strategic Cockpit)
// ============================================================
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import SegmentDeepDiveCockpit from '../components/SegmentDeepDiveCockpit';
import {
  TrendingUp, TrendingDown, Truck, Gauge, Clock, Users, Fuel,
  IndianRupee, Brain, Lightbulb, ShieldAlert, AlertTriangle,
  ChevronRight, Sparkles, Target, Zap, BarChart3, Activity,
  MapPin, ArrowUpRight, ArrowDownRight, Info, CheckCircle,
  Circle, Eye, MoreHorizontal, Calendar, RefreshCw,
  Settings, Server, Check, FileText, CreditCard, Play, Terminal, X, ShieldCheck
} from 'lucide-react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  platformKPIs,
  revenueChartData,
  revenueStreams,
  popularRoutes,
  generateAlerts,
  aiInsights,
  regionUtilization,
  formatCurrency,
  formatNumber,
} from '../data/mockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

// ---- ANIMATED COUNTER HOOK ----
const useAnimatedValue = (target, duration = 1200) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let startTime = null;
    let raf;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
};

// ---- SPARKLINE COMPONENT ----
const Sparkline = ({ data, color = '#6366f1', width = 80, height = 28 }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#spark-${color.replace('#', '')})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const getCityCoordinates = (cityName) => {
  const fallbacks = {
    Delhi: [28.6139, 77.2090],
    Mumbai: [19.0760, 72.8777],
    Bangalore: [12.9716, 77.5946],
    Chennai: [13.0827, 80.2707],
    Kolkata: [22.5726, 88.3639],
    Hyderabad: [17.3850, 78.4867],
    Ahmedabad: [23.0225, 72.5714],
    Pune: [18.5204, 73.8567],
    Jaipur: [26.9124, 75.7873],
    Lucknow: [26.8467, 80.9462]
  };
  return fallbacks[cityName] || [20.5937, 78.9629];
};

const getBezierPoints = (fromLatLng, toLatLng, steps = 20) => {
  const [lat1, lng1] = fromLatLng;
  const [lat2, lng2] = toLatLng;

  // Calculate mid-point and add perpendicular offset for curvature
  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;

  // Offset depends on distance
  const dx = lat2 - lat1;
  const dy = lng2 - lng1;
  const len = Math.sqrt(dx * dx + dy * dy);

  // Perpendicular vector
  const px = -dy / (len || 1);
  const py = dx / (len || 1);

  // Offset scale (e.g., 12% of distance)
  const offset = len * 0.12;
  const controlLat = midLat + px * offset;
  const controlLng = midLng + py * offset;

  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * controlLat + t * t * lat2;
    const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * controlLng + t * t * lng2;
    points.push([lat, lng]);
  }
  return points;
};

// ---- INDIA MAP SECTION (REDESIGNED WITH GOOGLE MAPS LIGHT STREET VIEW, TILE SELECTOR & INTERACTIVE HUD) ----
const MAP_STYLES = {
  street: {
    name: '🗺️ Google/OSM Street View',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB &copy; OpenStreetMap'
  },
  positron: {
    name: '🏙️ Light Minimal',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB'
  },
  satellite: {
    name: '🛰️ Satellite Hybrid',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri World Imagery'
  },
  dark: {
    name: '🌙 Dark Navigation',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB'
  }
};

const IndiaMap = ({ dispatched }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const tileLayerRef = useRef(null);
  const markersRef = useRef({});
  const polylinesRef = useRef([]);

  const [mapReady, setMapReady] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState('all'); // all | hubs | lanes
  const [selectedMapStyleKey, setSelectedMapStyleKey] = useState(isDark ? 'dark' : 'street');
  const [selectedCorridorFilter, setSelectedCorridorFilter] = useState('all');
  const [selectedCityHub, setSelectedCityHub] = useState(null);

  // Default to Street View when in Light Mode
  useEffect(() => {
    if (!isDark && selectedMapStyleKey === 'dark') {
      setSelectedMapStyleKey('street');
    } else if (isDark && selectedMapStyleKey === 'street') {
      setSelectedMapStyleKey('dark');
    }
  }, [theme]);

  const getCityTrucksCount = (city) => {
    const base = city === 'Delhi' ? 68420 :
                 city === 'Mumbai' ? 72340 :
                 city === 'Bangalore' ? 58200 :
                 city === 'Chennai' ? 42100 :
                 city === 'Kolkata' ? 45600 :
                 city === 'Hyderabad' ? 52800 :
                 city === 'Ahmedabad' ? 41200 :
                 city === 'Pune' ? 38700 :
                 city === 'Jaipur' ? 32150 : 28900;
    
    if (dispatched) {
      if (city === 'Delhi') return base + 5;
      if (city === 'Mumbai') return base + 3;
    }
    return base;
  };

  useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
      leafletMap.current = L.map(mapRef.current, {
        center: [21.8, 79.5],
        zoom: 4.5,
        zoomControl: false,
        attributionControl: false
      });

      const initialStyle = MAP_STYLES[selectedMapStyleKey] || MAP_STYLES.street;
      tileLayerRef.current = L.tileLayer(initialStyle.url, {
        maxZoom: 20,
        attribution: initialStyle.attribution
      }).addTo(leafletMap.current);

      setMapReady(true);

      setTimeout(() => {
        if (leafletMap.current) {
          leafletMap.current.invalidateSize();
        }
      }, 250);
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
        setMapReady(false);
      }
    };
  }, []);

  // Sync Basemap Tile Swaps Dynamically
  useEffect(() => {
    if (leafletMap.current && mapReady) {
      if (tileLayerRef.current) {
        tileLayerRef.current.remove();
      }
      const style = MAP_STYLES[selectedMapStyleKey] || MAP_STYLES.street;
      tileLayerRef.current = L.tileLayer(style.url, {
        maxZoom: 20
      }).addTo(leafletMap.current);
    }
  }, [selectedMapStyleKey, mapReady]);

  // Update Markers & Polylines when filters change
  useEffect(() => {
    if (!leafletMap.current || !mapReady) return;

    polylinesRef.current.forEach(p => p.remove());
    polylinesRef.current = [];

    Object.keys(markersRef.current).forEach(key => {
      markersRef.current[key].remove();
    });
    markersRef.current = {};

    // 1. Render Corridors (Lanes)
    if (activeViewMode === 'all' || activeViewMode === 'lanes') {
      popularRoutes.forEach((route, idx) => {
        if (selectedCorridorFilter !== 'all') {
          if (selectedCorridorFilter === 'west' && !(route.from.includes('Delhi') || route.from.includes('Mumbai') || route.to.includes('Mumbai'))) return;
          if (selectedCorridorFilter === 'south' && !(route.from.includes('Bangalore') || route.from.includes('Chennai') || route.to.includes('Bangalore'))) return;
        }

        const coordsFrom = getCityCoordinates(route.from);
        const coordsTo = getCityCoordinates(route.to);
        
        if (coordsFrom && coordsTo) {
          const curvedPath = getBezierPoints(coordsFrom, coordsTo);
          const p = L.polyline(curvedPath, {
            color: idx % 2 === 0 ? '#6366f1' : '#16a34a',
            weight: 2.5,
            className: 'route-path-flow'
          }).addTo(leafletMap.current);
          
          polylinesRef.current.push(p);
        }
      });
    }

    // 2. Render Hubs (Markers)
    if (activeViewMode === 'all' || activeViewMode === 'hubs') {
      const citiesToMap = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Ahmedabad', 'Pune', 'Jaipur', 'Lucknow'];
      
      citiesToMap.forEach(cityName => {
        const trucks = getCityTrucksCount(cityName);
        const coords = getCityCoordinates(cityName);
        const size = Math.max(10, Math.min(20, trucks / 4500));
        
        const markerIcon = L.divIcon({
          html: `
            <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <div style="position: absolute; width: ${size + 14}px; height: ${size + 14}px; border-radius: 50%; background: #6366f1; opacity: 0.3; animation: mapPulse 2s infinite;"></div>
              <div style="width: ${size}px; height: ${size}px; border-radius: 50%; background: #4f46e5; border: 2px solid #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"></div>
            </div>
          `,
          className: 'custom-fleet-marker',
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        const m = L.marker(coords, { icon: markerIcon })
          .addTo(leafletMap.current)
          .bindTooltip(`
            <div style="background: ${isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)'}; border: ${isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1'}; border-radius: 8px; padding: 8px 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.15); color: ${isDark ? '#f8fafc' : '#0f172a'}; min-width: 130px;">
              <div style="font-size: 12px; font-weight: 700; margin-bottom: 2px;">${cityName} Freight Hub</div>
              <div style="font-size: 11px; color: #6366f1; font-weight: 700;">
                🚚 ${trucks.toLocaleString('en-IN')} Active Trucks
              </div>
              <div style="font-size: 9px; color: ${isDark ? '#94a3b8' : '#64748b'}; margin-top: 2px;">
                Click to inspect Hub Telemetry
              </div>
            </div>
          `, {
            permanent: false,
            direction: 'top',
            className: 'custom-map-tooltip',
            opacity: 0.98
          });

        m.on('click', () => {
          setSelectedCityHub({
            name: cityName,
            trucks: trucks,
            inbound: Math.round(trucks * 0.54),
            outbound: Math.round(trucks * 0.46),
            fastagSpeed: '98.2% Clearance',
            reeferTemp: '-18.4°C Optimal',
            otdSla: '96.8% Compliance'
          });
        });

        markersRef.current[cityName] = m;
      });
    }

  }, [mapReady, activeViewMode, selectedCorridorFilter, dispatched, isDark]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 400 }}>
      <style>{`
        @keyframes mapPulse {
          0% { transform: scale(0.5); opacity: 0.6; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .custom-map-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .custom-map-tooltip::before {
          display: none !important;
        }
        .route-path-flow {
          stroke-dasharray: 6, 6;
          animation: dashOffset 1.5s linear infinite;
        }
        @keyframes dashOffset {
          to { stroke-dashoffset: -20; }
        }
      `}</style>

      {/* 1. HUD Telemetry & Filter Bar */}
      <div style={{
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        background: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(10px)',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #cbd5e1',
        borderRadius: 8,
        padding: '8px 12px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
        boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={14} color="#16a34a" />
          <span style={{ fontSize: 11, color: isDark ? '#f8fafc' : '#0f172a', fontWeight: 700 }}>Live Telemetry HUD</span>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Map Basemap Style Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155' }}>Basemap:</span>
            <select
              value={selectedMapStyleKey}
              onChange={(e) => setSelectedMapStyleKey(e.target.value)}
              style={{
                background: isDark ? '#1e293b' : '#ffffff',
                border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                color: isDark ? '#f8fafc' : '#0f172a',
                padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, outline: 'none', cursor: 'pointer'
              }}
            >
              {Object.keys(MAP_STYLES).map(k => (
                <option key={k} value={k}>{MAP_STYLES[k].name}</option>
              ))}
            </select>
          </div>

          {/* Regional Corridor Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155' }}>Corridor:</span>
            <select
              value={selectedCorridorFilter}
              onChange={(e) => setSelectedCorridorFilter(e.target.value)}
              style={{
                background: isDark ? '#1e293b' : '#ffffff',
                border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                color: isDark ? '#f8fafc' : '#0f172a',
                padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="all">All Corridors</option>
              <option value="west">NH48 Western Freight</option>
              <option value="south">NH44 Southern Spine</option>
            </select>
          </div>

          {/* Layer View Mode */}
          <div style={{ display: 'flex', gap: 4 }}>
            {['all', 'hubs', 'lanes'].map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveViewMode(mode)}
                style={{
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: activeViewMode === mode ? 'var(--primary-500)' : isDark ? '#1e293b' : '#e2e8f0',
                  color: activeViewMode === mode ? '#ffffff' : isDark ? '#cbd5e1' : '#334155',
                  border: 'none',
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                {mode === 'all' ? 'Hybrid' : mode === 'hubs' ? 'Hubs' : 'Lanes'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Floating Zoom & Recenter Controls */}
      <div style={{
        position: 'absolute',
        top: 68,
        right: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        zIndex: 10,
      }}>
        <button
          onClick={() => leafletMap.current && leafletMap.current.zoomIn()}
          style={{
            width: 28, height: 28, borderRadius: 6,
            background: isDark ? '#1e293b' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
            color: isDark ? '#f8fafc' : '#0f172a',
            fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => leafletMap.current && leafletMap.current.zoomOut()}
          style={{
            width: 28, height: 28, borderRadius: 6,
            background: isDark ? '#1e293b' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
            color: isDark ? '#f8fafc' : '#0f172a',
            fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          title="Zoom Out"
        >
          -
        </button>
        <button
          onClick={() => leafletMap.current && leafletMap.current.setView([21.8, 79.5], 4.5)}
          style={{
            width: 28, height: 28, borderRadius: 6,
            background: isDark ? '#1e293b' : '#ffffff',
            border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
            color: isDark ? '#f8fafc' : '#0f172a',
            fontSize: 12, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          title="Recenter Map"
        >
          ⛶
        </button>
      </div>

      {/* 3. Interactive Hub Derivation Modal Overlay (When Hub Clicked) */}
      {selectedCityHub && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            background: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(12px)',
            border: '2px solid #6366f1',
            borderRadius: 10,
            padding: '12px 16px',
            zIndex: 20,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
              🏬 {selectedCityHub.name} Central Logistics Hub — Live Telemetry
            </div>
            <button
              onClick={() => setSelectedCityHub(null)}
              style={{ background: 'transparent', border: 'none', color: isDark ? '#cbd5e1' : '#64748b', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            <div style={{ background: isDark ? '#1e293b' : '#f8fafc', padding: 8, borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Active Moving Trucks</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#6366f1' }}>{selectedCityHub.trucks.toLocaleString()} Units</div>
            </div>
            <div style={{ background: isDark ? '#1e293b' : '#f8fafc', padding: 8, borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Inbound Cargo</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#16a34a' }}>{selectedCityHub.inbound.toLocaleString()} Manifests</div>
            </div>
            <div style={{ background: isDark ? '#1e293b' : '#f8fafc', padding: 8, borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Outbound Departures</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#2563eb' }}>{selectedCityHub.outbound.toLocaleString()} Trucks</div>
            </div>
            <div style={{ background: isDark ? '#1e293b' : '#f8fafc', padding: 8, borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>FASTag Toll Speed</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#f59e0b' }}>{selectedCityHub.fastagSpeed}</div>
            </div>
            <div style={{ background: isDark ? '#1e293b' : '#f8fafc', padding: 8, borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Reefer Temp Range</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#06b6d4' }}>{selectedCityHub.reeferTemp}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Map Container */}
      <div ref={mapRef} style={{ width: '100%', height: '400px', borderRadius: 10, border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1', overflow: 'hidden', zIndex: 1 }} />
    </div>
  );
};

// ---- KPI CARD COMPONENT ----
const formatKPIValue = (value, format) => {
  switch (format) {
    case 'currency': return `₹${(value / 1000000).toFixed(1)}M`;
    case 'percent': return `${value.toFixed(1)}%`;
    case 'number': return value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value.toLocaleString('en-IN');
    case 'kmpl': return `${value.toFixed(1)} km/L`;
    case 'growth': return `+${value.toFixed(1)}%`;
    default: return value;
  }
};

const KPICard = ({ config, index, isSelected, onClick, onOpenBlueprint }) => {
  const animatedVal = useAnimatedValue(config.value, 1400 + index * 100);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={() => onClick && config.key && onClick(config.key)}
      style={{
        ...styles.kpiCard,
        border: isSelected ? `1.5px solid ${config.sparkColor || '#6366f1'}` : '1px solid var(--surface-border)',
        boxShadow: isSelected
          ? `0 0 20px ${config.sparkColor || '#6366f1'}40, 0 8px 24px rgba(0,0,0,0.3)`
          : '0 4px 12px rgba(0,0,0,0.1)',
        transform: isSelected ? 'translateY(-2px)' : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              ...styles.kpiIconBox,
              background: config.gradient,
            }}
          >
            <Icon size={18} color="#fff" strokeWidth={2} />
          </div>
          {isSelected && (
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              color: '#fff',
              background: config.gradient,
              padding: '2px 6px',
              borderRadius: 4,
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              Active
            </span>
          )}
        </div>
        <Sparkline data={config.sparkData} color={config.sparkColor} />
      </div>
      <div style={{ marginTop: 14 }}>
        <div style={styles.kpiValue}>
          {formatKPIValue(animatedVal, config.format)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <span style={styles.kpiLabel}>{config.label}</span>
          <span
            style={{
              ...styles.kpiTrend,
              color: config.trendUp ? 'var(--success-500)' : 'var(--danger-500)',
            }}
          >
            {config.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {config.trend}%
          </span>
        </div>

        {/* Hover / Active Click Hint */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 10,
          paddingTop: 8,
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          fontSize: 10,
          color: isSelected ? config.sparkColor || 'var(--primary-400)' : 'var(--text-muted)',
          fontWeight: isSelected ? 600 : 400
        }}>
          <span>{isSelected ? '✓ Viewing Scalable Graph' : 'Click to expand graph'}</span>
          {config.key && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenBlueprint && onOpenBlueprint(config.key);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                fontSize: 10,
                fontWeight: 600,
                textDecoration: 'underline'
              }}
            >
              Blueprint
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ---- SECTION HEADER ----
const SectionHeader = ({ icon: Icon, title, subtitle, action }) => (
  <div style={styles.sectionHeader}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {Icon && <Icon size={16} color="var(--primary-400)" />}
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{subtitle}</div>}
      </div>
    </div>
    {action && action}
  </div>
);

// ---- REVENUE OVERVIEW & INDUSTRY DERIVATION ENGINE ----
const RevenueChart = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [period, setPeriod] = useState('daily'); // daily | weekly | monthly
  const [viewMode, setViewMode] = useState('stacked'); // stacked | net_target | corridor | fleet
  const [selectedStream, setSelectedStream] = useState('all'); // all | base | fuel | toll | detention
  const [selectedCorridor, setSelectedCorridor] = useState('all'); // all | west | north | south | east
  const [showFormula, setShowFormula] = useState(true);

  const chartRef = useRef(null);

  // Generate multi-layer dataset based on period, viewMode, selectedStream & selectedCorridor
  const chartData = useMemo(() => {
    const raw = revenueChartData[period];
    const labels = raw.labels;
    const values = raw.values;

    const corridorMult = selectedCorridor === 'west' ? 0.38 : selectedCorridor === 'north' ? 0.28 : selectedCorridor === 'south' ? 0.22 : selectedCorridor === 'east' ? 0.12 : 1.0;

    if (viewMode === 'stacked') {
      // 5 Revenue Streams Stacked Breakdown
      const baseFreight = values.map(v => Number((v * 0.760 * corridorMult).toFixed(1)));
      const fuelSurcharge = values.map(v => Number((v * 0.152 * corridorMult).toFixed(1)));
      const tollExpenses = values.map(v => Number((v * 0.061 * corridorMult).toFixed(1)));
      const detentionFees = values.map(v => Number((v * 0.043 * corridorMult).toFixed(1)));

      let datasets = [];

      if (selectedStream === 'all' || selectedStream === 'base') {
        datasets.push({
          label: 'Linehaul Base Freight (76.0%)',
          data: baseFreight,
          borderColor: '#6366f1',
          backgroundColor: isDark ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.25)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
        });
      }

      if (selectedStream === 'all' || selectedStream === 'fuel') {
        datasets.push({
          label: 'Dynamic Fuel Surcharge (15.2%)',
          data: fuelSurcharge,
          borderColor: '#10b981',
          backgroundColor: isDark ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.25)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
        });
      }

      if (selectedStream === 'all' || selectedStream === 'toll') {
        datasets.push({
          label: 'FASTag Toll Reconciled (6.1%)',
          data: tollExpenses,
          borderColor: '#f59e0b',
          backgroundColor: isDark ? 'rgba(245, 158, 11, 0.4)' : 'rgba(245, 158, 11, 0.25)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
        });
      }

      if (selectedStream === 'all' || selectedStream === 'detention') {
        datasets.push({
          label: 'Accessorial & Detention (4.3%)',
          data: detentionFees,
          borderColor: '#ec4899',
          backgroundColor: isDark ? 'rgba(236, 72, 153, 0.4)' : 'rgba(236, 72, 153, 0.25)',
          fill: true,
          tension: 0.35,
          borderWidth: 2,
        });
      }

      return { labels, datasets };
    } else if (viewMode === 'net_target') {
      // Net Revenue vs Benchmark Target
      const netRev = values.map(v => Number((v * corridorMult).toFixed(1)));
      const targetRev = values.map(v => Number((v * 1.08 * corridorMult).toFixed(1)));

      return {
        labels,
        datasets: [
          {
            label: 'Actual Net Revenue',
            data: netRev,
            borderColor: '#6366f1',
            backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
          },
          {
            label: 'Benchmark Target Goal',
            data: targetRev,
            borderColor: '#d97706',
            borderDash: [5, 5],
            fill: false,
            tension: 0.35,
            borderWidth: 1.8,
            pointRadius: 0,
          }
        ]
      };
    } else if (viewMode === 'corridor') {
      // Regional Corridor Performance Breakdown
      return {
        labels,
        datasets: [
          { label: 'Western Corridor (NH48)', data: values.map(v => Number((v * 0.38).toFixed(1))), borderColor: '#6366f1', fill: false, tension: 0.35 },
          { label: 'Northern Corridor (NCR)', data: values.map(v => Number((v * 0.28).toFixed(1))), borderColor: '#10b981', fill: false, tension: 0.35 },
          { label: 'Southern Spine', data: values.map(v => Number((v * 0.22).toFixed(1))), borderColor: '#f59e0b', fill: false, tension: 0.35 },
          { label: 'Eastern Freight Belt', data: values.map(v => Number((v * 0.12).toFixed(1))), borderColor: '#ec4899', fill: false, tension: 0.35 },
        ]
      };
    } else {
      // Fleet Category Breakdown (Express 32FT, Cold Chain Reefer, Electric EV)
      return {
        labels,
        datasets: [
          { label: '32FT Heavy Commercial', data: values.map(v => Number((v * 0.58).toFixed(1))), borderColor: '#6366f1', fill: false, tension: 0.35 },
          { label: 'Cold-Chain Reefer', data: values.map(v => Number((v * 0.28).toFixed(1))), borderColor: '#06b6d4', fill: false, tension: 0.35 },
          { label: 'Electric Fleet (EV)', data: values.map(v => Number((v * 0.14).toFixed(1))), borderColor: '#16a34a', fill: false, tension: 0.35 },
        ]
      };
    }
  }, [period, viewMode, selectedStream, selectedCorridor, isDark]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: isDark ? '#cbd5e1' : '#334155',
          font: { size: 11, family: 'Inter, sans-serif' },
          usePointStyle: true,
          boxWidth: 8
        }
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        bodyColor: isDark ? '#cbd5e1' : '#334155',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: { size: 12, weight: '700' },
        bodyFont: { size: 11 },
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ₹${ctx.raw}${period === 'daily' ? 'M' : 'Cr'}`
        }
      }
    },
    scales: {
      x: {
        stacked: viewMode === 'stacked',
        grid: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', drawBorder: false },
        ticks: { color: isDark ? '#94a3b8' : '#64748b', font: { size: 10 } }
      },
      y: {
        stacked: viewMode === 'stacked',
        grid: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', drawBorder: false },
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
          font: { size: 10 },
          callback: (v) => period === 'daily' ? `₹${v}M` : `₹${v}Cr`
        }
      }
    }
  }), [period, viewMode, isDark]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      style={{
        ...styles.card,
        gridColumn: 'span 12',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.06)'
      }}
    >
      {/* Header & Main Controls */}
      <SectionHeader
        icon={TrendingUp}
        title="Revenue Intelligence & Derivation Engine"
        subtitle="Multi-layered breakdown of Linehaul Base Tariffs, Dynamic Fuel Surcharges (FSC), FASTag Tolls, and Accessorial Detention"
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', background: isDark ? '#1e293b' : '#e2e8f0', padding: 2, borderRadius: 6 }}>
              {[
                { key: 'daily', label: 'Daily (30D)' },
                { key: 'weekly', label: 'Weekly (12W)' },
                { key: 'monthly', label: 'Monthly (12M)' }
              ].map(p => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  style={{
                    background: period === p.key ? 'var(--primary-500)' : 'transparent',
                    color: period === p.key ? '#fff' : isDark ? '#94a3b8' : '#475569',
                    border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* Multi-Dimensional Filter Toolbar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between',
        marginTop: 14, padding: '10px 14px', background: isDark ? 'rgba(0,0,0,0.25)' : '#f8fafc',
        borderRadius: 10, border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* View Mode Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155' }}>View Mode:</span>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              style={{
                background: isDark ? '#1e293b' : '#ffffff', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                color: isDark ? '#f8fafc' : '#0f172a', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="stacked">📊 Stacked Stream Breakdown</option>
              <option value="net_target">📈 Net vs Target Benchmark</option>
              <option value="corridor">🛣️ Corridor Performance</option>
              <option value="fleet">🚚 Fleet Class Performance</option>
            </select>
          </div>

          {/* Revenue Stream Filter */}
          {viewMode === 'stacked' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155' }}>Stream Filter:</span>
              <select
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
                style={{
                  background: isDark ? '#1e293b' : '#ffffff', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                  color: isDark ? '#f8fafc' : '#0f172a', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, outline: 'none', cursor: 'pointer'
                }}
              >
                <option value="all">All Revenue Streams (100%)</option>
                <option value="base">Linehaul Base Freight (76.0%)</option>
                <option value="fuel">Dynamic Fuel Surcharges (15.2%)</option>
                <option value="toll">FASTag Toll Reconciliations (6.1%)</option>
                <option value="detention">Accessorial & Detention (4.3%)</option>
              </select>
            </div>
          )}

          {/* Regional Corridor Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155' }}>Region:</span>
            <select
              value={selectedCorridor}
              onChange={(e) => setSelectedCorridor(e.target.value)}
              style={{
                background: isDark ? '#1e293b' : '#ffffff', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
                color: isDark ? '#f8fafc' : '#0f172a', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="all">All India Corridors</option>
              <option value="west">Western Corridor (NH48)</option>
              <option value="north">Northern Region (NCR/Punjab)</option>
              <option value="south">Southern Spine (BLR/CHN)</option>
              <option value="east">Eastern Freight Belt (KOL/OD)</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setShowFormula(!showFormula)}
          style={{
            background: showFormula ? 'rgba(99, 102, 241, 0.15)' : isDark ? '#1e293b' : '#ffffff',
            border: showFormula ? '1px solid #6366f1' : isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid #cbd5e1',
            color: showFormula ? 'var(--primary-400)' : isDark ? '#cbd5e1' : '#334155',
            borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer'
          }}
        >
          {showFormula ? '✓ Derivation Math Shown' : 'Show Derivation Math'}
        </button>
      </div>

      {/* Revenue Derivation KPI Summary Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginTop: 12 }}>
        <div style={{ background: isDark ? '#1e293b' : '#ffffff', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1', padding: '10px 12px', borderRadius: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>Linehaul Base Freight</span>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#6366f1', marginTop: 2 }}>₹32.56M <span style={{ fontSize: 10, fontWeight: 600 }}>(76.0%)</span></div>
          <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Fixed contract tariffs</span>
        </div>

        <div style={{ background: isDark ? '#1e293b' : '#ffffff', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1', padding: '10px 12px', borderRadius: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>Dynamic Fuel Surcharge</span>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#10b981', marginTop: 2 }}>₹6.51M <span style={{ fontSize: 10, fontWeight: 600 }}>(15.2%)</span></div>
          <span style={{ fontSize: 9, color: '#16a34a' }}>WTI/diesel index linked</span>
        </div>

        <div style={{ background: isDark ? '#1e293b' : '#ffffff', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1', padding: '10px 12px', borderRadius: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>FASTag Toll Reconciled</span>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#f59e0b', marginTop: 2 }}>₹2.61M <span style={{ fontSize: 10, fontWeight: 600 }}>(6.1%)</span></div>
          <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Highway toll pass-through</span>
        </div>

        <div style={{ background: isDark ? '#1e293b' : '#ffffff', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1', padding: '10px 12px', borderRadius: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>Accessorial & Detention</span>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#ec4899', marginTop: 2 }}>₹1.84M <span style={{ fontSize: 10, fontWeight: 600 }}>(4.3%)</span></div>
          <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Dock waiting dwell fees</span>
        </div>

        <div style={{ background: isDark ? '#1e293b' : '#ffffff', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1', padding: '10px 12px', borderRadius: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>Volume Rebates & Adjust</span>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#dc2626', marginTop: 2 }}>-₹0.68M <span style={{ fontSize: 10, fontWeight: 600 }}>(-1.6%)</span></div>
          <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Enterprise discount refund</span>
        </div>
      </div>

      {/* Main Chart */}
      <div style={{ height: 320, marginTop: 14 }}>
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </div>

      {/* Collapsible Revenue Derivation Formula Box */}
      {showFormula && (
        <div style={{
          marginTop: 14, padding: '12px 14px', background: isDark ? 'rgba(99, 102, 241, 0.1)' : '#f1f5f9',
          border: isDark ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid #cbd5e1', borderRadius: 8
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#a5b4fc' : '#4338ca', marginBottom: 4 }}>
            Enterprise Fleet Revenue Derivation Model (GatiFleet Standard)
          </div>
          <code style={{ fontSize: 11, fontFamily: 'monospace', color: isDark ? '#f8fafc' : '#0f172a', display: 'block', wordBreak: 'break-all' }}>
            Daily Net Revenue (₹42.85M) = Base Freight (₹32.56M) + Fuel Surcharge (₹6.51M) + Toll Reimbursements (₹2.61M) + Detention Fees (₹1.84M) - Volume Rebates (₹0.68M)
          </code>
        </div>
      )}
    </motion.div>
  );
};

// ---- INDIA MAP SECTION ----
const FleetMapSection = ({ dispatched, span = 8 }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      style={{
        ...styles.card,
        gridColumn: `span ${span}`,
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.06)'
      }}
    >
      <SectionHeader
        icon={MapPin}
        title="Fleet Distribution & Telemetry Map"
        subtitle="Active truck clusters across India"
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a', boxShadow: '0 0 8px #16a34a' }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', background: '#16a34a',
                animation: 'pulse 2s infinite',
              }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#16a34a' }}>Live</span>
          </div>
        }
      />
      <IndiaMap dispatched={dispatched} />
    </motion.div>
  );
};

// ---- TOP ROUTES TABLE (REDESIGNED WITH CITY-TO-CITY DERIVATIONS & INTERACTIVE DEEP-DIVE) ----
const getRouteDerivationData = (route) => {
  const from = route.from || 'Origin';
  const to = route.to || 'Destination';
  const dist = route.distance || 500;
  const trips = route.trips || 10000;
  const rev = route.revenue || 100000000;
  const eff = route.efficiency || 90;

  let cityLegs = [];
  if (from === 'Delhi' && to === 'Mumbai') {
    cityLegs = [
      { name: 'Delhi Logistics Hub ➔ Jaipur Toll Checkpoint', dist: 280, time: '4h 30m', speed: '62.2 km/h', tripsShare: Math.round(trips * 0.34), eff: 96, highway: 'NH48 Northern Section', tolls: 3 },
      { name: 'Jaipur Checkpoint ➔ Ahmedabad Hub', dist: 590, time: '9h 15m', speed: '63.8 km/h', tripsShare: Math.round(trips * 0.36), eff: 92, highway: 'NH48 Rajasthan-Gujarat Corridor', tolls: 5 },
      { name: 'Ahmedabad Hub ➔ Mumbai Cross-Dock', dist: 530, time: '8h 45m', speed: '60.6 km/h', tripsShare: Math.round(trips * 0.30), eff: 94, highway: 'NH48 Western Expressway', tolls: 4 },
    ];
  } else if (from === 'Mumbai' && to === 'Bangalore') {
    cityLegs = [
      { name: 'Mumbai Dock ➔ Pune Logistics Depot', dist: 150, time: '3h 10m', speed: '47.4 km/h', tripsShare: Math.round(trips * 0.35), eff: 93, highway: 'Mumbai-Pune Expressway', tolls: 2 },
      { name: 'Pune Depot ➔ Kolhapur Freight Hub', dist: 230, time: '4h 05m', speed: '56.3 km/h', tripsShare: Math.round(trips * 0.33), eff: 90, highway: 'NH48 Southern Maharashtra Belt', tolls: 3 },
      { name: 'Kolhapur Hub ➔ Bangalore Terminal', dist: 600, time: '9h 15m', speed: '64.9 km/h', tripsShare: Math.round(trips * 0.32), eff: 91, highway: 'NH48 Karnataka Spine Corridor', tolls: 6 },
    ];
  } else if (from === 'Delhi' && to === 'Kolkata') {
    cityLegs = [
      { name: 'Delhi Hub ➔ Kanpur Checkpoint', dist: 490, time: '7h 45m', speed: '63.2 km/h', tripsShare: Math.round(trips * 0.35), eff: 89, highway: 'NH19 Yamuna Expressway Section', tolls: 4 },
      { name: 'Kanpur Checkpoint ➔ Varanasi Hub', dist: 330, time: '5h 30m', speed: '60.0 km/h', tripsShare: Math.round(trips * 0.32), eff: 87, highway: 'NH19 Purvanchal Freight Belt', tolls: 3 },
      { name: 'Varanasi Hub ➔ Kolkata Dock', dist: 710, time: '11h 15m', speed: '63.1 km/h', tripsShare: Math.round(trips * 0.33), eff: 88, highway: 'NH19 Bengal Industrial Belt', tolls: 7 },
    ];
  } else if (from === 'Chennai' && to === 'Hyderabad') {
    cityLegs = [
      { name: 'Chennai Port ➔ Nellore Hub', dist: 175, time: '3h 00m', speed: '58.3 km/h', tripsShare: Math.round(trips * 0.38), eff: 97, highway: 'NH16 Coastal Route', tolls: 2 },
      { name: 'Nellore Hub ➔ Vijayawada Junction', dist: 280, time: '4h 15m', speed: '65.9 km/h', tripsShare: Math.round(trips * 0.34), eff: 95, highway: 'NH16 Andhra Freight Spine', tolls: 3 },
      { name: 'Vijayawada Junction ➔ Hyderabad Dry Port', dist: 175, time: '2h 45m', speed: '63.6 km/h', tripsShare: Math.round(trips * 0.28), eff: 96, highway: 'NH65 Telangana Corridor', tolls: 2 },
    ];
  } else if (from === 'Ahmedabad' && to === 'Pune') {
    cityLegs = [
      { name: 'Ahmedabad Hub ➔ Vadodara Depot', dist: 110, time: '1h 45m', speed: '62.8 km/h', tripsShare: Math.round(trips * 0.36), eff: 95, highway: 'NE1 National Expressway 1', tolls: 1 },
      { name: 'Vadodara Depot ➔ Surat Checkpoint', dist: 150, time: '2h 30m', speed: '60.0 km/h', tripsShare: Math.round(trips * 0.34), eff: 92, highway: 'NH48 Gujarat Industrial Belt', tolls: 2 },
      { name: 'Surat Checkpoint ➔ Pune Terminal', dist: 400, time: '6h 15m', speed: '64.0 km/h', tripsShare: Math.round(trips * 0.30), eff: 93, highway: 'NH48 Expressway Connector', tolls: 4 },
    ];
  } else if (from === 'Bangalore' && to === 'Chennai') {
    cityLegs = [
      { name: 'Bangalore Hub ➔ Hosur Checkpoint', dist: 40, time: '1h 00m', speed: '40.0 km/h', tripsShare: Math.round(trips * 0.30), eff: 96, highway: 'NH44 Inter-state Border Section', tolls: 1 },
      { name: 'Hosur Checkpoint ➔ Vellore Depot', dist: 170, time: '2h 30m', speed: '68.0 km/h', tripsShare: Math.round(trips * 0.38), eff: 98, highway: 'NH48 Tamil Nadu Freight Line', tolls: 2 },
      { name: 'Vellore Depot ➔ Chennai Port Terminal', dist: 140, time: '2h 15m', speed: '62.2 km/h', tripsShare: Math.round(trips * 0.32), eff: 97, highway: 'NH48 Chennai Outer Ring Road', tolls: 2 },
    ];
  } else if (from === 'Delhi' && to === 'Jaipur') {
    cityLegs = [
      { name: 'Delhi Hub ➔ Gurgaon Toll Plaza', dist: 40, time: '1h 10m', speed: '34.3 km/h', tripsShare: Math.round(trips * 0.35), eff: 97, highway: 'NH48 NCR Sub-Corridor', tolls: 1 },
      { name: 'Gurgaon Toll ➔ Shahjahanpur Border', dist: 110, time: '1h 40m', speed: '66.0 km/h', tripsShare: Math.round(trips * 0.35), eff: 99, highway: 'NH48 Haryana-Rajasthan State Border', tolls: 1 },
      { name: 'Shahjahanpur Border ➔ Jaipur Terminal', dist: 130, time: '1h 50m', speed: '70.9 km/h', tripsShare: Math.round(trips * 0.30), eff: 98, highway: 'NH48 Pink City Expressway', tolls: 1 },
    ];
  } else if (from === 'Mumbai' && to === 'Ahmedabad') {
    cityLegs = [
      { name: 'Mumbai Dock ➔ Surat Industrial Hub', dist: 280, time: '4h 30m', speed: '62.2 km/h', tripsShare: Math.round(trips * 0.52), eff: 96, highway: 'NH48 Coastal Corridor', tolls: 3 },
      { name: 'Surat Hub ➔ Ahmedabad Terminal', dist: 250, time: '3h 45m', speed: '66.7 km/h', tripsShare: Math.round(trips * 0.48), eff: 95, highway: 'NE1 Gujarat Expressway', tolls: 2 },
    ];
  } else {
    const halfDist = Math.round(dist / 2);
    cityLegs = [
      { name: `${from} Departure Hub ➔ Central Checkpoint`, dist: halfDist, time: `${Math.round(dist / 100 * 1.4)}h`, speed: '60.5 km/h', tripsShare: Math.round(trips * 0.52), eff: eff + 1, highway: 'National Highway Freight Edge', tolls: 2 },
      { name: `Central Checkpoint ➔ ${to} Destination Dock`, dist: dist - halfDist, time: `${Math.round(dist / 100 * 1.4)}h`, speed: '62.0 km/h', tripsShare: Math.round(trips * 0.48), eff: eff - 1, highway: 'State Express Connector', tolls: 2 },
    ];
  }

  const baseRate = Math.round(rev * 0.76);
  const fuelSurcharge = Math.round(rev * 0.152);
  const tollExpenses = Math.round(rev * 0.061);
  const detentionFees = Math.round(rev * 0.043);
  const rebates = Math.round(rev * 0.016);

  return {
    cityLegs,
    loadedTrips: Math.round(trips * 0.676),
    returnTrips: Math.round(trips * 0.324),
    activeTrucksOnRoute: Math.round(trips * 0.148),
    movingTimeHours: (dist / 62.5).toFixed(1),
    dwellTimeHours: (dist / 320).toFixed(1),
    baseRate,
    fuelSurcharge,
    tollExpenses,
    detentionFees,
    rebates,
    netRevenue: rev
  };
};

const TopRoutes = ({ routes }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0); // Default open first route
  const [activeDetailTab, setActiveDetailTab] = useState('legs'); // legs | trips | distance | efficiency | revenue

  const currentRoute = routes[selectedRouteIdx] || routes[0];
  const derivation = useMemo(() => getRouteDerivationData(currentRoute), [currentRoute]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.65 }}
      style={{
        ...styles.card,
        gridColumn: 'span 12',
        overflow: 'hidden',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.06)'
      }}
    >
      <SectionHeader
        icon={MapPin}
        title="Top Routes & Corridor Derivation Engine"
        subtitle="Click any route row or metric cell to inspect city-to-city travel, trips share, distance & time, efficiency math, and revenue surcharges"
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary-400)', background: 'rgba(99, 102, 241, 0.1)', padding: '4px 10px', borderRadius: 6 }}>
              8 Active Corridors Analyzed
            </span>
          </div>
        }
      />

      <div style={{ overflowX: 'auto', marginTop: 14 }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, cursor: 'pointer' }} onClick={() => setActiveDetailTab('legs')}>
                ROUTE (Departure ➔ Destination)
              </th>
              <th style={{ ...styles.th, textAlign: 'right', cursor: 'pointer' }} onClick={() => setActiveDetailTab('distance')}>
                DISTANCE & TIME
              </th>
              <th style={{ ...styles.th, textAlign: 'right', cursor: 'pointer' }} onClick={() => setActiveDetailTab('trips')}>
                TRIPS SHARE
              </th>
              <th style={{ ...styles.th, textAlign: 'right', cursor: 'pointer' }} onClick={() => setActiveDetailTab('revenue')}>
                REVENUE (Net)
              </th>
              <th style={{ ...styles.th, cursor: 'pointer' }} onClick={() => setActiveDetailTab('efficiency')}>
                EFFICIENCY (Derived)
              </th>
              <th style={{ ...styles.th, textAlign: 'center' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {routes.slice(0, 8).map((route, i) => {
              const isSelected = selectedRouteIdx === i;
              return (
                <React.Fragment key={i}>
                  <tr
                    onClick={() => setSelectedRouteIdx(isSelected ? null : i)}
                    style={{
                      ...styles.tr,
                      cursor: 'pointer',
                      background: isSelected
                        ? (isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)')
                        : 'transparent',
                      borderLeft: isSelected ? '4px solid var(--primary-500)' : '4px solid transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: route.efficiency >= 95 ? '#16a34a' :
                                      route.efficiency >= 90 ? '#6366f1' :
                                      route.efficiency >= 85 ? '#d97706' : '#dc2626',
                        }} />
                        <span style={{ fontWeight: 700, fontSize: 13, color: isDark ? '#f8fafc' : '#0f172a' }}>
                          {route.from}
                        </span>
                        <ChevronRight size={12} color="var(--primary-400)" />
                        <span style={{ fontWeight: 700, fontSize: 13, color: isDark ? '#f8fafc' : '#0f172a' }}>
                          {route.to}
                        </span>
                        {isSelected && (
                          <span style={{ fontSize: 9, fontWeight: 800, background: 'var(--primary-500)', color: '#fff', padding: '1px 6px', borderRadius: 4 }}>
                            INSPECTING
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right', fontSize: 12, color: isDark ? '#cbd5e1' : '#334155' }}>
                      <span style={{ fontWeight: 700 }}>{route.distance.toLocaleString('en-IN')} km</span>
                      <span style={{ fontSize: 10, color: isDark ? '#94a3b8' : '#64748b', display: 'block' }}>~{route.avgTime || '22h'} transit</span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right', fontSize: 12, fontFamily: 'var(--font-mono)', color: isDark ? '#cbd5e1' : '#334155' }}>
                      <span style={{ fontWeight: 700 }}>{route.trips.toLocaleString('en-IN')}</span>
                      <span style={{ fontSize: 10, color: 'var(--success-500)', display: 'block' }}>67.6% loaded</span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right', fontSize: 13, fontWeight: 700, color: '#16a34a' }}>
                      {formatCurrency(route.revenue)}
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={styles.progressBarBg}>
                          <div
                            style={{
                              ...styles.progressBarFill,
                              width: `${route.efficiency}%`,
                              transition: 'width 0.6s ease',
                              background: route.efficiency >= 95
                                ? 'linear-gradient(90deg, #16a34a, #10b981)'
                                : route.efficiency >= 90
                                  ? 'linear-gradient(90deg, #6366f1, #818cf8)'
                                  : route.efficiency >= 85
                                    ? 'linear-gradient(90deg, #d97706, #fbbf24)'
                                    : 'linear-gradient(90deg, #dc2626, #f87171)',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', color: isDark ? '#f8fafc' : '#0f172a', minWidth: 32, textAlign: 'right' }}>
                          {route.efficiency}%
                        </span>
                      </div>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRouteIdx(isSelected ? null : i);
                        }}
                        style={{
                          background: isSelected ? 'var(--primary-500)' : 'transparent',
                          color: isSelected ? '#fff' : 'var(--primary-400)',
                          border: '1px solid var(--primary-400)',
                          borderRadius: 6,
                          padding: '4px 8px',
                          fontSize: 10,
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {isSelected ? 'Hide Details' : 'Derivation Details'}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Route Derivation Inspector Frame */}
                  {isSelected && (
                    <tr>
                      <td colSpan={6} style={{ padding: '0', background: isDark ? '#0f172a' : '#f8fafc' }}>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            padding: '16px 20px',
                            borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
                            borderBottom: isDark ? '2px solid var(--primary-500)' : '2px solid var(--primary-500)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 14
                          }}
                        >
                          {/* Top Navigation & Breadcrumb for Selected Corridor */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{
                                fontSize: 11, fontWeight: 700, color: 'var(--primary-400)',
                                background: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)',
                                border: '1px solid rgba(99, 102, 241, 0.2)', padding: '4px 10px', borderRadius: 6
                              }}>
                                Dashboard ➔ Top Routes ➔ {route.from} to {route.to} Corridor Derivation
                              </span>
                            </div>

                            {/* Derivation Tabs */}
                            <div style={{ display: 'flex', gap: 6 }}>
                              {[
                                { id: 'legs', label: '🏙️ City-to-City Legs' },
                                { id: 'trips', label: '🚚 Trips Derivation' },
                                { id: 'distance', label: '⏱️ Distance & Time' },
                                { id: 'efficiency', label: '📊 Efficiency Math' },
                                { id: 'revenue', label: '💰 Revenue & Surcharges' }
                              ].map(tab => (
                                <button
                                  key={tab.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDetailTab(tab.id);
                                  }}
                                  style={{
                                    background: activeDetailTab === tab.id ? 'var(--primary-500)' : isDark ? '#1e293b' : '#ffffff',
                                    color: activeDetailTab === tab.id ? '#ffffff' : isDark ? '#cbd5e1' : '#334155',
                                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                                    borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer'
                                  }}
                                >
                                  {tab.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Tab 1: City-to-City Travel Legs */}
                          {activeDetailTab === 'legs' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>
                                City-to-City Travel Breakdown ({route.from} Departure ➔ {route.to} Destination)
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${derivation.cityLegs.length}, 1fr)`, gap: 12 }}>
                                {derivation.cityLegs.map((leg, idx) => (
                                  <div key={idx} style={{
                                    background: isDark ? '#1e293b' : '#ffffff',
                                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
                                    borderRadius: 10, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                  }}>
                                    <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--primary-400)', textTransform: 'uppercase', marginBottom: 4 }}>
                                      Leg {idx + 1} of {derivation.cityLegs.length}
                                    </div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', marginBottom: 6 }}>
                                      {leg.name}
                                    </div>
                                    <div style={{ fontSize: 11, color: isDark ? '#cbd5e1' : '#475569', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                      <div>📍 <strong>Distance & Time:</strong> {leg.dist} km ({leg.time})</div>
                                      <div>⚡ <strong>Avg Transit Speed:</strong> {leg.speed}</div>
                                      <div>🚚 <strong>Trips Volume:</strong> {leg.tripsShare.toLocaleString()} Trips</div>
                                      <div>🛣️ <strong>Highway & Tolls:</strong> {leg.highway} ({leg.tolls} Toll Plazas)</div>
                                      <div>⭐ <strong>Leg Efficiency Rating:</strong> <span style={{ color: '#16a34a', fontWeight: 700 }}>{leg.eff}%</span></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Tab 2: Trips Derivation */}
                          {activeDetailTab === 'trips' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                              <div style={{ background: isDark ? '#1e293b' : '#ffffff', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1', borderRadius: 10, padding: 12 }}>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total Corridor Volume</div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', marginTop: 4 }}>{route.trips.toLocaleString()} Trips</div>
                                <div style={{ fontSize: 10, color: '#16a34a', marginTop: 2 }}>100% Manifest Verified</div>
                              </div>
                              <div style={{ background: isDark ? '#1e293b' : '#ffffff', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1', borderRadius: 10, padding: 12 }}>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Outbound Loaded Trips</div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: '#2563eb', marginTop: 4 }}>{derivation.loadedTrips.toLocaleString()} (67.6%)</div>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Primary Cargo Manifests</div>
                              </div>
                              <div style={{ background: isDark ? '#1e293b' : '#ffffff', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1', borderRadius: 10, padding: 12 }}>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Return Backhauls</div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: '#7c3aed', marginTop: 4 }}>{derivation.returnTrips.toLocaleString()} (32.4%)</div>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Rebalanced Return Cargo</div>
                              </div>
                              <div style={{ background: isDark ? '#1e293b' : '#ffffff', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1', borderRadius: 10, padding: 12 }}>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Active Moving Trucks</div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: '#d97706', marginTop: 4 }}>{derivation.activeTrucksOnRoute.toLocaleString()} Units</div>
                                <div style={{ fontSize: 10, color: '#16a34a', marginTop: 2 }}>Live Telematics Pings</div>
                              </div>
                            </div>
                          )}

                          {/* Tab 3: Distance & Time */}
                          {activeDetailTab === 'distance' && (
                            <div style={{ background: isDark ? '#1e293b' : '#ffffff', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1', borderRadius: 10, padding: 14 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', marginBottom: 8 }}>
                                Distance & Transit Time Derivation
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 10 }}>
                                <div>
                                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total Corridor Distance:</span>
                                  <div style={{ fontSize: 15, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>{route.distance.toLocaleString()} km</div>
                                </div>
                                <div>
                                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pure Moving Time:</span>
                                  <div style={{ fontSize: 15, fontWeight: 700, color: '#16a34a' }}>{derivation.movingTimeHours} hours</div>
                                </div>
                                <div>
                                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Toll & Hub Dwell Time:</span>
                                  <div style={{ fontSize: 15, fontWeight: 700, color: '#d97706' }}>{derivation.dwellTimeHours} hours</div>
                                </div>
                              </div>
                              <div style={{ fontSize: 11, color: isDark ? '#cbd5e1' : '#475569', lineHeight: 1.5 }}>
                                <strong>Derivation Formula:</strong> Total Elapsed Transit Time = Pure Moving Time ({derivation.movingTimeHours}h) + FASTag Toll Clearance ({derivation.dwellTimeHours}h) + Driver Rest Windows.
                              </div>
                            </div>
                          )}

                          {/* Tab 4: Efficiency Math */}
                          {activeDetailTab === 'efficiency' && (
                            <div style={{ background: isDark ? '#1e293b' : '#ffffff', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1', borderRadius: 10, padding: 14 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', marginBottom: 8 }}>
                                Corridor Efficiency Rating Formula ({route.efficiency}%)
                              </div>
                              <code style={{ fontSize: 11, fontFamily: 'monospace', color: isDark ? '#a5b4fc' : '#4338ca', display: 'block', background: isDark ? 'rgba(0,0,0,0.3)' : '#f1f5f9', padding: '8px 12px', borderRadius: 6, marginBottom: 8 }}>
                                Efficiency % = ∑ (Leg Weight_i × [ 0.50 · OTD_SLA_i + 0.30 · FuelScore_i + 0.20 · SpeedRating_i ])
                              </code>
                              <div style={{ fontSize: 11, color: isDark ? '#cbd5e1' : '#475569', lineHeight: 1.5 }}>
                                City-to-city legs average {route.efficiency}% efficiency across On-Time Delivery compliance (94.2%), fuel consumption score (4.8 km/L average), and FASTag toll clearance speeds.
                              </div>
                            </div>
                          )}

                          {/* Tab 5: Revenue & Surcharges */}
                          {activeDetailTab === 'revenue' && (
                            <div style={{ background: isDark ? '#1e293b' : '#ffffff', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1', borderRadius: 10, padding: 14 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', marginBottom: 8 }}>
                                Revenue Line Item Derivation ({formatCurrency(derivation.netRevenue)})
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 10 }}>
                                <div style={{ background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', padding: 8, borderRadius: 6 }}>
                                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Base Tariff (76%)</div>
                                  <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>{formatCurrency(derivation.baseRate)}</div>
                                </div>
                                <div style={{ background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', padding: 8, borderRadius: 6 }}>
                                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Fuel Surcharge (15.2%)</div>
                                  <div style={{ fontSize: 13, fontWeight: 700, color: '#6366f1' }}>{formatCurrency(derivation.fuelSurcharge)}</div>
                                </div>
                                <div style={{ background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', padding: 8, borderRadius: 6 }}>
                                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>FASTag Tolls (6.1%)</div>
                                  <div style={{ fontSize: 13, fontWeight: 700, color: '#d97706' }}>{formatCurrency(derivation.tollExpenses)}</div>
                                </div>
                                <div style={{ background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', padding: 8, borderRadius: 6 }}>
                                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Detention Fees (4.3%)</div>
                                  <div style={{ fontSize: 13, fontWeight: 700, color: '#2563eb' }}>{formatCurrency(derivation.detentionFees)}</div>
                                </div>
                                <div style={{ background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', padding: 8, borderRadius: 6 }}>
                                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Volume Rebates (-1.6%)</div>
                                  <div style={{ fontSize: 13, fontWeight: 700, color: '#dc2626' }}>-{formatCurrency(derivation.rebates)}</div>
                                </div>
                              </div>
                              <code style={{ fontSize: 11, fontFamily: 'monospace', color: '#16a34a', display: 'block' }}>
                                Total Net Revenue = Base Rate ({formatCurrency(derivation.baseRate)}) + Fuel Surcharge ({formatCurrency(derivation.fuelSurcharge)}) + Tolls ({formatCurrency(derivation.tollExpenses)}) + Detention ({formatCurrency(derivation.detentionFees)}) - Rebates ({formatCurrency(derivation.rebates)}) = {formatCurrency(derivation.netRevenue)}
                              </code>
                            </div>
                          )}

                          {/* AI Telematics & Knowledge Graph Links */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0', fontSize: 11, color: isDark ? '#94a3b8' : '#64748b' }}>
                            <div>
                              ⚡ <strong>Knowledge Graph Node:</strong> {route.from} Hub ──[NH48 Corridor]──► {route.to} Terminal
                            </div>
                            <div>
                              🌱 <strong>Carbon Footprint:</strong> 1.18 kg CO₂ / km • 🔒 <strong>IoT Door Lock:</strong> 100% Secured
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

// ---- AI INSIGHTS PANEL (REDESIGNED WITH INTERACTIVE ROOT-CAUSE INSPECTOR & FILTERS) ----
const insightIcons = {
  revenue: TrendingUp,
  efficiency: Fuel,
  churn: ShieldAlert,
  maintenance: AlertTriangle,
  route: MapPin,
};

const insightColors = {
  revenue: '#16a34a',
  efficiency: '#2563eb',
  churn: '#dc2626',
  maintenance: '#d97706',
  route: '#7c3aed',
};

const AIInsightsPanel = ({ insights, onAction, span = 4 }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedInsightId, setSelectedInsightId] = useState(null);
  const [executedNotification, setExecutedNotification] = useState(null);

  const filteredInsights = useMemo(() => {
    if (categoryFilter === 'all') return insights;
    return insights.filter(i => i.type === categoryFilter);
  }, [insights, categoryFilter]);

  const handleExecuteOptimization = (insight) => {
    setExecutedNotification(`AI Action Executed: "${insight.title}" — Strategy deployed to operational ledger.`);
    setTimeout(() => setExecutedNotification(null), 4000);
    const caseMap = { revenue: 1, efficiency: 1, churn: 5, route: 3, maintenance: 6 };
    onAction && onAction(caseMap[insight.type] || 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.55 }}
      style={{
        ...styles.card,
        gridColumn: `span ${span}`,
        display: 'flex',
        flexDirection: 'column',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.06)'
      }}
    >
      <SectionHeader
        icon={Brain}
        title="AI Copilot Insights & Root Cause Engine"
        subtitle="Click any recommendation card to inspect root causes, sensor pings, and trigger autonomous execution"
        action={
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary-400)', background: 'rgba(99, 102, 241, 0.12)', padding: '3px 8px', borderRadius: 6 }}>
              <Sparkles size={10} style={{ display: 'inline', marginRight: 3 }} /> {filteredInsights.length} Recommendations
            </span>
          </div>
        }
      />

      {/* Filter Category Toolbar */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10, paddingBottom: 8, borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
        {[
          { id: 'all', label: 'All Insights' },
          { id: 'revenue', label: '💰 Revenue' },
          { id: 'efficiency', label: '⛽ Fuel & Efficiency' },
          { id: 'churn', label: '🛡️ Churn Risk' },
          { id: 'maintenance', label: '🔧 Maintenance' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            style={{
              background: categoryFilter === cat.id ? 'var(--primary-500)' : isDark ? '#1e293b' : '#f1f5f9',
              color: categoryFilter === cat.id ? '#ffffff' : isDark ? '#cbd5e1' : '#334155',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
              borderRadius: 6, padding: '3px 8px', fontSize: 10, fontWeight: 700, cursor: 'pointer'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notification Toast */}
      {executedNotification && (
        <div style={{ marginTop: 8, background: 'rgba(22, 163, 74, 0.12)', border: '1px solid rgba(22, 163, 74, 0.3)', color: '#16a34a', padding: '6px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
          ✓ {executedNotification}
        </div>
      )}

      {/* Insights List */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10, overflowY: 'auto', maxHeight: 420 }}>
        {filteredInsights.map((insight, i) => {
          const Icon = insightIcons[insight.type] || Lightbulb;
          const color = insightColors[insight.type] || '#6366f1';
          const isSelected = selectedInsightId === insight.id;

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              onClick={() => setSelectedInsightId(isSelected ? null : insight.id)}
              style={{
                ...styles.insightCard,
                cursor: 'pointer',
                borderLeft: `4px solid ${color}`,
                background: isSelected
                  ? (isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.06)')
                  : (isDark ? 'rgba(30, 41, 59, 0.5)' : '#ffffff'),
                border: isSelected ? `1.5px solid ${color}` : (isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1'),
                boxShadow: isSelected ? `0 0 12px ${color}30` : '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div
                  style={{
                    minWidth: 32,
                    height: 32,
                    borderRadius: 8,
                    background: `${color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={16} color={color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>
                      {insight.title}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExecuteOptimization(insight);
                      }}
                      style={{
                        background: color,
                        border: 'none',
                        color: '#ffffff',
                        borderRadius: 6,
                        padding: '4px 10px',
                        fontSize: 10,
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                      }}
                    >
                      Optimize Now
                    </button>
                  </div>
                  <div style={{ fontSize: 11, color: isDark ? '#cbd5e1' : '#334155', lineHeight: 1.4, margin: '4px 0' }}>
                    {insight.summary}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px',
                      borderRadius: 4, background: `${color}18`, color: color,
                    }}>
                      {insight.confidence}% AI confidence
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>
                      Impact: {insight.impact}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--primary-400)', marginLeft: 'auto' }}>
                      {isSelected ? '▲ Hide Root Cause' : '▼ Inspect Root Cause & Math'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inline Root Cause & Telemetry Derivation Inspector */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    marginTop: 10, paddingTop: 10,
                    borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
                    display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11
                  }}
                >
                  <div style={{ fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>
                    🔍 Underlying Telemetry & Root Cause Derivation:
                  </div>
                  <div style={{ color: isDark ? '#cbd5e1' : '#475569', background: isDark ? 'rgba(0,0,0,0.2)' : '#f8fafc', padding: 8, borderRadius: 6 }}>
                    <div>• <strong>Trigger:</strong> {insight.action || 'AI Agent observed 60-day historical variance anomaly.'}</div>
                    <div>• <strong>Primary Engine:</strong> Autonomous Intelligence Platform (AIP) & Knowledge Graph.</div>
                    <div>• <strong>Projected ROI:</strong> {insight.impact} within 30 days of execution.</div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
// ---- REVENUE STREAMS CHART (REDESIGNED WITH PRODUCT VERTICAL DEEP-DIVE & FILTERS) ----
const RevenueStreamsChart = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [streamFilterCategory, setStreamFilterCategory] = useState('all');
  const [selectedStreamName, setSelectedStreamName] = useState(null);

  const filteredStreams = useMemo(() => {
    const list = [...revenueStreams].sort((a, b) => b.value - a.value);
    if (streamFilterCategory === 'all') return list;
    if (streamFilterCategory === 'saas') return list.filter(s => s.name.includes('SaaS') || s.name.includes('Subscription') || s.name.includes('API') || s.name.includes('Copilot') || s.name.includes('ERP') || s.name.includes('CRM'));
    if (streamFilterCategory === 'logistics') return list.filter(s => s.name.includes('GPS') || s.name.includes('Toll') || s.name.includes('Fuel') || s.name.includes('Marketplace') || s.name.includes('Predictive'));
    return list.filter(s => s.name.includes('Insurance') || s.name.includes('Financing'));
  }, [streamFilterCategory]);

  const maxVal = filteredStreams[0]?.value || 1;
  const totalRev = filteredStreams.reduce((sum, s) => sum + s.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.75 }}
      style={{
        ...styles.card,
        gridColumn: 'span 8',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.06)'
      }}
    >
      <SectionHeader
        icon={BarChart3}
        title="Product Vertical Revenue Streams"
        subtitle={`Click any of the ${filteredStreams.length} product verticals to inspect MRR/ARR derivation formulas, ARPU, and active accounts`}
        action={
          <div style={{ fontSize: 11, color: isDark ? '#cbd5e1' : '#334155' }}>
            Total Vertical Revenue: <span style={{ color: '#16a34a', fontWeight: 800 }}>
              {formatCurrency(totalRev)}
            </span>
          </div>
        }
      />

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10, paddingBottom: 8, borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
        {[
          { id: 'all', label: 'All 12 Verticals' },
          { id: 'saas', label: '💻 SaaS & Subscriptions' },
          { id: 'logistics', label: '🚛 Logistics & Telematics' },
          { id: 'finance', label: '💳 Financial & Financing' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setStreamFilterCategory(cat.id)}
            style={{
              background: streamFilterCategory === cat.id ? 'var(--primary-500)' : isDark ? '#1e293b' : '#f1f5f9',
              color: streamFilterCategory === cat.id ? '#ffffff' : isDark ? '#cbd5e1' : '#334155',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
              borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredStreams.map((stream, i) => {
          const isSelected = selectedStreamName === stream.name;
          const sharePct = ((stream.value / totalRev) * 100).toFixed(1);

          return (
            <div key={stream.name} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.03 }}
                onClick={() => setSelectedStreamName(isSelected ? null : stream.name)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '6px 10px', borderRadius: 8, cursor: 'pointer',
                  background: isSelected ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)') : 'transparent',
                  border: isSelected ? '1px solid var(--primary-500)' : '1px solid transparent'
                }}
              >
                <div style={{
                  width: 150, fontSize: 12, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 0,
                }}>
                  {stream.name}
                </div>
                <div style={{ flex: 1, position: 'relative', height: 22, borderRadius: 6, background: isDark ? '#1e293b' : '#e2e8f0', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stream.value / maxVal) * 100}%` }}
                    transition={{ duration: 0.8, delay: 0.15 + i * 0.04 }}
                    style={{
                      height: '100%',
                      borderRadius: 6,
                      background: `linear-gradient(90deg, ${stream.color}dd, ${stream.color})`,
                      position: 'relative',
                    }}
                  />
                </div>
                <div style={{ width: 75, fontSize: 12, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', textAlign: 'right', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                  {formatCurrency(stream.value)}
                </div>
                <div style={{
                  width: 60, fontSize: 11, fontWeight: 700, textAlign: 'right', flexShrink: 0,
                  color: stream.growth >= 30 ? '#16a34a' : stream.growth >= 15 ? 'var(--primary-400)' : '#d97706',
                }}>
                  +{stream.growth}%
                </div>
              </motion.div>

              {/* Product Vertical Derivation Drawer */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    margin: '0 10px 6px', padding: 12, background: isDark ? '#1e293b' : '#f8fafc',
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1', borderRadius: 8,
                    display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11
                  }}
                >
                  <div style={{ fontWeight: 700, color: stream.color, fontSize: 12 }}>
                    💰 {stream.name} — Revenue Derivation Breakdown ({sharePct}% Vertical Share):
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 4 }}>
                    <div>• <strong>Annual Growth Rate:</strong> +{stream.growth}% YoY</div>
                    <div>• <strong>Active Subscribed Fleet:</strong> 524,389 Vehicles</div>
                    <div>• <strong>Net Revenue Retention:</strong> 98.4% NRR</div>
                  </div>
                  <code style={{ fontSize: 10, fontFamily: 'monospace', color: isDark ? '#a5b4fc' : '#4338ca', display: 'block', background: isDark ? 'rgba(0,0,0,0.3)' : '#ffffff', padding: '6px 8px', borderRadius: 4, marginTop: 4 }}>
                    MRR Derivation = Active Subscriptions ({stream.value > 100000000 ? '48,000 Shippers' : '108,000 Vehicles'}) × Average ARPU (₹{Math.round(stream.value / 524389)}) / month
                  </code>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
// ---- ALERTS FEED (REDESIGNED WITH INCIDENT INVESTIGATION HUD & SEVERITY FILTERS) ----
const alertTypeColors = {
  danger: '#dc2626',
  warning: '#d97706',
  success: '#16a34a',
  info: '#2563eb',
};

const AlertsFeed = ({ alerts, onResolveClick, span = 4 }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedAlertId, setSelectedAlertId] = useState(null);
  const [resolvedToast, setResolvedToast] = useState(null);

  const filteredAlerts = useMemo(() => {
    if (severityFilter === 'all') return alerts;
    return alerts.filter(a => a.type === severityFilter);
  }, [alerts, severityFilter]);

  const handleResolveAlert = (alert) => {
    setResolvedToast(`Alert Resolved: "${alert.title}" — Resolution logged to GatiFleet Audit Trail.`);
    setTimeout(() => setResolvedToast(null), 4000);
    const alertCaseMap = { 'Breakdown': 6, 'Temperature': 6, 'FASTag': 7, 'Fatigue': 4 };
    const key = Object.keys(alertCaseMap).find(k => alert.title.includes(k) || alert.message.includes(k));
    onResolveClick && onResolveClick(alertCaseMap[key] || 7);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.85 }}
      style={{
        ...styles.card,
        gridColumn: `span ${span}`,
        display: 'flex',
        flexDirection: 'column',
        border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.06)'
      }}
    >
      <SectionHeader
        icon={AlertTriangle}
        title="Operational Alerts & Telemetry Feed"
        subtitle="Click any notification to open live GPS telemetry HUD and dispatch resolution"
        action={
          <div style={{ ...styles.badge, background: 'rgba(220, 38, 38, 0.12)', color: '#dc2626', fontWeight: 800 }}>
            {alerts.filter(a => a.type === 'danger').length} Critical Alerts
          </div>
        }
      />

      {/* Severity Filter Toolbar */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10, paddingBottom: 8, borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'danger', label: '🔴 Critical' },
          { id: 'warning', label: '🟡 Warning' },
          { id: 'info', label: '🔵 Info' }
        ].map(sev => (
          <button
            key={sev.id}
            onClick={() => setSeverityFilter(sev.id)}
            style={{
              background: severityFilter === sev.id ? 'var(--primary-500)' : isDark ? '#1e293b' : '#f1f5f9',
              color: severityFilter === sev.id ? '#ffffff' : isDark ? '#cbd5e1' : '#334155',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
              borderRadius: 6, padding: '3px 8px', fontSize: 10, fontWeight: 700, cursor: 'pointer'
            }}
          >
            {sev.label}
          </button>
        ))}
      </div>

      {/* Toast Notification */}
      {resolvedToast && (
        <div style={{ marginTop: 8, background: 'rgba(22, 163, 74, 0.12)', border: '1px solid rgba(22, 163, 74, 0.3)', color: '#16a34a', padding: '6px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>
          ✓ {resolvedToast}
        </div>
      )}

      {/* Alerts Feed Items */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10, overflowY: 'auto', maxHeight: 420 }}>
        {filteredAlerts.slice(0, 6).map((alert, i) => {
          const isSelected = selectedAlertId === alert.id;
          const color = alertTypeColors[alert.type] || '#2563eb';

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              onClick={() => setSelectedAlertId(isSelected ? null : alert.id)}
              style={{
                ...styles.alertItem,
                cursor: 'pointer',
                borderRadius: 8,
                padding: '10px 12px',
                background: isSelected ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.06)') : (isDark ? 'rgba(30,41,59,0.4)' : '#ffffff'),
                border: isSelected ? `1.5px solid ${color}` : (isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #cbd5e1')
              }}
            >
              <div style={{
                minWidth: 10, height: 10, borderRadius: '50%',
                background: color,
                boxShadow: `0 0 8px ${color}60`,
                marginTop: 3,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a' }}>
                    {alert.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResolveAlert(alert);
                    }}
                    style={{
                      background: color,
                      border: 'none',
                      color: '#ffffff',
                      borderRadius: 6,
                      padding: '3px 8px',
                      fontSize: 10,
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Resolve
                  </button>
                </div>
                <div style={{ fontSize: 11, color: isDark ? '#cbd5e1' : '#334155', lineHeight: 1.4, margin: '2px 0' }}>
                  {alert.message}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, fontSize: 10, color: isDark ? '#94a3b8' : '#64748b' }}>
                  <span>⏱️ {alert.time}</span>
                  <span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>
                    {isSelected ? '▲ Hide Live HUD' : '▼ Inspect Telemetry HUD'}
                  </span>
                </div>

                {/* Expanded Telemetry HUD & Incident Action Box */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      marginTop: 8, paddingTop: 8,
                      borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
                      display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11
                    }}
                  >
                    <div style={{ fontWeight: 700, color: color }}>
                      📍 Live Incident Telemetry & Action HUD:
                    </div>
                    <div style={{ color: isDark ? '#cbd5e1' : '#475569', background: isDark ? 'rgba(0,0,0,0.25)' : '#f8fafc', padding: 8, borderRadius: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div>• <strong>CAN Bus DTC Code:</strong> OBD-II Ping Active (Code: P0300)</div>
                      <div>• <strong>FASTag Gate Status:</strong> Auto-recharge trigger standing by.</div>
                      <div>• <strong>Driver Fatigue Index:</strong> Hours of Service (HOS) boundary active.</div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// ---- HR WORKFORCE PANEL ----
const HRWorkforcePanel = () => {
  const styles = {
    card: {
      gridColumn: 'span 8',
      background: 'var(--surface)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid var(--surface-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    },
    listItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 12px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)'
    }
  };

  return (
    <div style={styles.card}>
      <SectionHeader icon={Users} title="HR & Workforce Operations" subtitle="Roster tracking, safe-driving metrics, and active shifts" />
      <div style={styles.grid}>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Active Driver Shift Logs</h4>
          <div style={styles.list}>
            <div style={styles.listItem}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>DRV-8821 (Amit Kumar)</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--success-500)' }}>In Transit (NH48)</span>
            </div>
            <div style={styles.listItem}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>DRV-9021 (Rajesh Singh)</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--warning-500)' }}>Resting (Siliguri)</span>
            </div>
            <div style={styles.listItem}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>DRV-1928 (Vikramaditya)</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary-400)' }}>Standby</span>
            </div>
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Compliance & Safety Scores</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Hours-of-Service (HOS) Compliance</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>98.2%</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg-600)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '98.2%', background: 'var(--success-500)' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>ADAS Lane-Safety Score</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>94.8%</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg-600)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '94.8%', background: 'var(--primary-500)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---- TECH SECURITY PANEL ----
const TechSecurityPanel = () => {
  const styles = {
    card: {
      gridColumn: 'span 8',
      background: 'var(--surface)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid var(--surface-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    },
    terminal: {
      background: 'rgba(0,0,0,0.3)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '12px',
      fontFamily: 'var(--font-mono)',
      fontSize: '11px',
      color: '#38ce3c',
      height: '110px',
      overflowY: 'auto'
    }
  };

  return (
    <div style={styles.card}>
      <SectionHeader icon={Server} title="DevOps Infrastructure & Security SOC" subtitle="API gateway nodes status and Sentinel-X security logs" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>API Gateway Telemetry Latency</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Gateway node-1:</span>
              <span style={{ color: 'var(--success-500)' }}>12ms</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Gateway node-2:</span>
              <span style={{ color: 'var(--success-500)' }}>14ms</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Gateway node-3:</span>
              <span style={{ color: 'var(--warning-500)' }}>84ms (high load)</span>
            </div>
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Sentinel-X Policy Enforcement</h4>
          <div style={styles.terminal}>
            <div>[12:15:10] POL-403 check passed for operator Arjun.</div>
            <div>[12:18:24] Telemetry check verified for VEH-MH12-9028.</div>
            <div>[12:28:40] Active connection synced with JNPT RFID gate.</div>
            <div>[12:45:00] Database auto-backup complete (SQLite ledger).</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---- MAIN DASHBOARD ----
const Dashboard = () => {
  const { userRole } = useTheme();
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  // --- Tabs Configuration ---
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = [
    { id: 'overview', label: 'Executive Overview', icon: BarChart3 },
    { id: 'cockpit', label: 'AI Strategic Cockpit', icon: Brain },
    { id: 'insights', label: 'AI Insights Directory', icon: Lightbulb },
    { id: 'alerts', label: 'Operational Alerts Feed', icon: AlertTriangle },
  ];

  // --- Stateful variables for segment selection & side panel views ---
  const [selectedSegmentKey, setSelectedSegmentKey] = useState(null);
  const [sidePanelTab, setSidePanelTab] = useState('graph');

  // --- Stateful variables for platform metrics ---
  const [kpis, setKpis] = useState({
    revenueToday: platformKPIs.revenue.today,
    fleetUtilization: platformKPIs.fleetUtilization,
    onTimeDelivery: platformKPIs.onTimeDelivery,
    activeTrucks: platformKPIs.activeTrucks,
    fuelEfficiency: platformKPIs.fuelEfficiency,
    customerGrowth: platformKPIs.customerGrowth,
  });

  const [insights, setInsights] = useState(aiInsights);
  const [alerts, setAlerts] = useState(() => generateAlerts().slice(0, 5));
  const [routes, setRoutes] = useState(popularRoutes);

  // --- Autonomy states ---
  const [isAutonomyEnabled, setIsAutonomyEnabled] = useState(false);
  const [autonomyLogs, setAutonomyLogs] = useState([
    "[11:04 AM] AI Finance Agent verified GST ledger compliance.",
    "[11:42 AM] HR Agent synchronized attendance roster patterns."
  ]);
  const [toasts, setToasts] = useState([]);

  // --- Specific control values ---
  const [fastagBalance, setFastagBalance] = useState(8500);
  const [apiGatewaysCount, setApiGatewaysCount] = useState(3);
  const [apiGatewayLoad, setApiGatewayLoad] = useState(94);

  const consoleRef = useRef(null);
  const selectedCaseRef = useRef(null);
  const [activeCaseId, setActiveCaseId] = useState(null);

  // --- Cases Array ---
  const [cases, setCases] = useState([
    {
      id: 1,
      title: 'Fuel Price Spike Mitigation',
      department: 'Finance & Supply Chain',
      status: 'pending',
      confidence: 94,
      description: 'Diesel prices jumped +8.3%. Projecting a ₹2.4Cr monthly margin reduction across contracts.',
      recommendation: 'Finance Agent suggests applying an automatic 3.8% fuel surcharge; Supply Chain Agent suggests shifting 40% cargo to rail multimodal corridors.',
      icon: Fuel,
      color: '#6366f1',
    },
    {
      id: 2,
      title: 'JNPT Port Cargo Backlog',
      department: 'Supply Chain',
      status: 'pending',
      confidence: 88,
      description: 'Container dwell time has increased by 48h at JNPT Terminal. 12 VIP accounts affected.',
      recommendation: 'Supply Chain Agent suggests matching idle trucks from Ahmedabad and auto-dispatching 8 standby units.',
      icon: Truck,
      color: '#38CE3C',
    },
    {
      id: 3,
      title: 'Route Corridor Underperformance',
      department: 'Supply Chain',
      status: 'pending',
      confidence: 86,
      description: 'Kolkata→Guwahati corridor efficiency drops to 79% due to NH-27 driver fatigue delays.',
      recommendation: 'Supply Chain Agent suggests pivoting to a hub-and-spoke relay model with a dedicated driver rest-hub at Siliguri.',
      icon: MapPin,
      color: '#8b5cf6',
    },
    {
      id: 4,
      title: 'Driver Safety Incentives',
      department: 'HR & Safety Academy',
      status: 'pending',
      confidence: 95,
      description: '18 high-performing drivers maintained Safety scores > 95 for 30 consecutive days.',
      recommendation: 'HR Agent suggests auto-disbursing ₹5,000 monthly safety bonuses to promote driver retention and fuel thrift.',
      icon: Users,
      color: '#ec4899',
    },
    {
      id: 5,
      title: 'VIP Retention: Tata Motors Churn Risk',
      department: 'Sales & CRM',
      status: 'pending',
      confidence: 92,
      description: 'VIP Account Tata Motors Logistics shows a 78% churn risk due to booking volumes dropping by 24%.',
      recommendation: 'Sales Agent recommends escalating to a CEO relationship call and offering a temporary 15% dedicated lane rebate.',
      icon: ShieldAlert,
      color: '#f59e0b',
    },
    {
      id: 6,
      title: 'Engine Thermal Warning (Nagpur)',
      department: 'Operations & Engineering',
      status: 'pending',
      confidence: 91,
      description: 'Vehicle TRK-00312 reports engine temperature critical at 108°C on Nagpur bypass NH-44.',
      recommendation: 'Engineering Agent recommends rerouting vehicle to the nearest Nagpur depot immediately and notifying the crew.',
      icon: AlertTriangle,
      color: '#f97316',
    },
    {
      id: 7,
      title: 'FASTag Balance Depletion',
      department: 'ERP Compliance',
      status: 'pending',
      confidence: 98,
      description: 'Total toll gateway balances fall to ₹8,500, breaching the regulatory safety threshold of ₹11,000.',
      recommendation: 'ERP Agent recommends auto-recharging ₹15,000 instantly to prevent vehicle stops at toll plazas.',
      icon: CreditCard,
      color: '#06b6d4',
    },
    {
      id: 8,
      title: 'E-Way Bill Validity Expiry',
      department: 'ERP Compliance',
      status: 'pending',
      confidence: 96,
      description: 'E-way bill EWB-88491 expiring in 2 hours for in-transit load SHP-99238.',
      recommendation: 'Compliance Agent recommends executing a 24h validity extension statefully and notifying the compliance desk.',
      icon: FileText,
      color: '#10b981',
    },
    {
      id: 9,
      title: 'DevOps Health: Tracking Latency',
      department: 'AI Systems & Infrastructure',
      status: 'pending',
      confidence: 97,
      description: 'API tracking gateways under heavy load (94% CPU). Telemetry package latency rising.',
      recommendation: 'Engineering DevOps Agent recommends auto-scaling API gateway container instances from 3 to 6.',
      icon: Server,
      color: '#a78bfa',
    },
    {
      id: 10,
      title: 'AI Confidence Policy & Autonomy',
      department: 'Executive Agent Configuration',
      status: 'pending',
      confidence: 99,
      description: 'Autonomy rules can be authorized. System is ready to auto-execute decisions with confidence scores > 90%.',
      recommendation: 'Enable autonomous mode to automate recurring operations under safety limits.',
      icon: Brain,
      color: '#3b82f6',
    }
  ]);

  // --- Helper to trigger a toast notification ---
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // --- Scroll triggers ---
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [autonomyLogs]);

  useEffect(() => {
    if (activeCaseId && selectedCaseRef.current) {
      selectedCaseRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeCaseId, activeTab]);

  // --- Resolve Case Logic ---
  const resolveCase = (caseId, isAuto = false) => {
    let alreadyResolved = false;
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        if (c.status === 'resolved') alreadyResolved = true;
        return { ...c, status: 'resolved' };
      }
      return c;
    }));

    if (alreadyResolved) return;

    const logPrefix = `[${new Date().toLocaleTimeString('en-IN', { hour12: false })}] ${isAuto ? 'AUTO-EXECUTE' : 'CEO-APPROVED'}:`;

    switch(caseId) {
      case 1: // Fuel Price Spike
        setKpis(prev => ({
          ...prev,
          revenueToday: prev.revenueToday + 2400000,
          fuelEfficiency: 5.2
        }));
        setAutonomyLogs(prev => [...prev, `${logPrefix} Fuel surcharge applied (+3.8% tariff, +₹24L/day) & multimodal rail shift activated (fuel efficiency 5.2 km/L).`]);
        showToast("Fuel surcharge applied & Rail pivot active", "success");
        break;
      case 2: // JNPT Port Backlog
        setKpis(prev => ({
          ...prev,
          fleetUtilization: 89.8,
          activeTrucks: prev.activeTrucks + 8
        }));
        setAlerts(prev => prev.map(a => a.id === 7 || a.title.includes('Traffic') || a.title.includes('Congestion') ? {
          ...a,
          type: 'success',
          title: 'Congestion Cleared',
          message: 'RESOLVED: Idle trucks matched & dispatched. Backlog cleared.',
          time: 'Just now'
        } : a));
        setAutonomyLogs(prev => [...prev, `${logPrefix} Dispatched 8 idle trucks to JNPT port backlog. Fleet utilization now 89.8%.`]);
        showToast("JNPT Port Backlog: 8 idle trucks dispatched", "success");
        break;
      case 3: // Route optimization (Kolkata-Guwahati)
        setRoutes(prev => prev.map(r => r.from === 'Kolkata' && r.to === 'Guwahati' ? { ...r, efficiency: 96 } : r));
        setKpis(prev => ({
          ...prev,
          onTimeDelivery: 95.1
        }));
        setAutonomyLogs(prev => [...prev, `${logPrefix} Siliguri relay model deployed. Kolkata→Guwahati route efficiency rose to 96%.`]);
        showToast("Siliguri Relay: Kolkata→Guwahati optimized to 96%", "success");
        break;
      case 4: // Driver Safety Bonuses
        setAutonomyLogs(prev => [...prev, `${logPrefix} Disbursed ₹5,000 safety bonuses to 18 eligible drivers. Total: ₹90,000 ledger post.`]);
        setAlerts(prev => prev.map(a => a.title.includes('Fatigue') ? {
          ...a,
          type: 'success',
          title: 'Rest Logged & Bonus Issued',
          message: 'RESOLVED: Safety bonus posted, fatigue warning cleared.',
          time: 'Just now'
        } : a));
        showToast("₹5,000 safety bonuses dispatched to 18 drivers", "success");
        break;
      case 5: // Churn Risk (Tata Motors)
        setKpis(prev => ({
          ...prev,
          customerGrowth: prev.customerGrowth + 1.5
        }));
        setInsights(prev => prev.map(i => i.type === 'churn' ? {
          ...i,
          confidence: 99,
          summary: 'RESOLVED: Churn risk mitigated via CEO Call and 15% dedicated lane rebate.',
          impact: '₹3.8Cr CLV secured'
        } : i));
        setAutonomyLogs(prev => [...prev, `${logPrefix} Scheduled CEO relationship call with Tata Motors. Offered 15% lane rebate. Churn risk reduced.`]);
        showToast("Tata Motors churn threat mitigated. CEO call booked.", "success");
        break;
      case 6: // Nagpur Engine Temperature
        setAlerts(prev => prev.map(a => a.title.includes('Breakdown') || a.message.includes('Nagpur') || a.title.includes('Temperature') ? {
          ...a,
          type: 'success',
          title: 'Vehicle Safely Parked',
          message: 'RESOLVED: TRK-00312 engine thermal warning cleared. Vehicle parked at Nagpur depot.',
          time: 'Just now'
        } : a));
        setAutonomyLogs(prev => [...prev, `${logPrefix} Rerouted TRK-00312 to nearest Nagpur warehouse depot. Maintenance alert created.`]);
        showToast("TRK-00312 rerouted to Nagpur depot", "success");
        break;
      case 7: // FASTag Recharge
        setFastagBalance(23500);
        setAlerts(prev => prev.map(a => a.title.includes('FASTag') || a.message.includes('FASTag') ? {
          ...a,
          type: 'success',
          title: 'FASTag Balance Restored',
          message: 'RESOLVED: recharged ₹15,000. Account balance: ₹23,500.',
          time: 'Just now'
        } : a));
        setAutonomyLogs(prev => [...prev, `${logPrefix} FASTag gateway account recharged with ₹15,000. Current Balance: ₹23,500.`]);
        showToast("FASTag balance auto-recharged to ₹23,500", "success");
        break;
      case 8: // E-Way Bill extension
        setAutonomyLogs(prev => [...prev, `${logPrefix} E-Way bill validity auto-extended by 24h. Validity matching rate is 99.4%.`]);
        showToast("E-way bill validity extended for 24h", "success");
        break;
      case 9: // API Gateway load
        setApiGatewaysCount(6);
        setApiGatewayLoad(45);
        setAutonomyLogs(prev => [...prev, `${logPrefix} Scaled API tracking gateways to 6 instances. Load stabilized to 45% CPU.`]);
        showToast("API tracking gateway auto-scaled to 6 instances", "success");
        break;
      case 10: // AI Autonomy Toggle
        setIsAutonomyEnabled(true);
        setAutonomyLogs(prev => [...prev, `${logPrefix} Autonomous operations policy authorized. Executing decisions > 90% confidence.`]);
        showToast("AI Autonomy policy authorized successfully", "success");
        break;
      default:
        break;
    }
  };

  // --- Auto-execution loop when Autonomy is enabled ---
  useEffect(() => {
    if (isAutonomyEnabled) {
      let delay = 600;
      cases.forEach((c) => {
        if (c.status === 'pending' && c.confidence >= 90) {
          setTimeout(() => {
            resolveCase(c.id, true);
          }, delay);
          delay += 1200;
        }
      });
    }
  }, [isAutonomyEnabled]);

  // --- Dynamic KPI configuration creation based on User Role ---
  const kpiConfigs = useMemo(() => {
    const allConfigs = [
      {
        key: 'revenueToday',
        label: 'Revenue Today',
        value: kpis.revenueToday,
        format: 'currency',
        trend: platformKPIs.revenue.growth,
        trendUp: true,
        icon: IndianRupee,
        gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        sparkData: [38.2, 41.5, 39.8, 42.1, 40.3, 43.7, 45.2, 42.8, 46.3, 42.9],
        sparkColor: '#818cf8',
        roles: ['ADMIN', 'CEO', 'FINANCE', 'CFO', 'ADVISOR', 'CRO']
      },
      {
        key: 'fleetUtilization',
        label: 'Fleet Utilization',
        value: kpis.fleetUtilization,
        format: 'percent',
        trend: 2.1,
        trendUp: true,
        icon: Gauge,
        gradient: 'linear-gradient(135deg, #38CE3C, #10b981)',
        sparkData: [82, 84, 85, 83, 86, 87, 88, 87.4],
        sparkColor: '#38CE3C',
        roles: ['ADMIN', 'CEO', 'OPERATIONS']
      },
      {
        key: 'onTimeDelivery',
        label: 'On-Time Delivery',
        value: kpis.onTimeDelivery,
        format: 'percent',
        trend: 1.8,
        trendUp: true,
        icon: Clock,
        gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
        sparkData: [91, 92, 93, 92.5, 93, 94, 94.5, 94.2],
        sparkColor: '#3b82f6',
        roles: ['ADMIN', 'CEO', 'OPERATIONS']
      },
      {
        key: 'activeTrucks',
        label: 'Active Trucks',
        value: kpis.activeTrucks,
        format: 'number',
        trend: 3.4,
        trendUp: true,
        icon: Truck,
        gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
        sparkData: [450, 458, 462, 470, 475, 480, 485, 487.6],
        sparkColor: '#f59e0b',
        roles: ['ADMIN', 'CEO', 'OPERATIONS']
      },
      {
        key: 'fuelEfficiency',
        label: 'Fuel Efficiency',
        value: kpis.fuelEfficiency,
        format: 'kmpl',
        trend: 4.3,
        trendUp: true,
        icon: Fuel,
        gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
        sparkData: [4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.8],
        sparkColor: '#ec4899',
        roles: ['ADMIN', 'CEO', 'OPERATIONS', 'FINANCE', 'CFO']
      },
      {
        key: 'customerGrowth',
        label: 'Customer Growth',
        value: kpis.customerGrowth,
        format: 'growth',
        trend: 12.6,
        trendUp: true,
        icon: Users,
        gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
        sparkData: [6.2, 7.1, 8.4, 9.2, 10.1, 11.0, 11.8, 12.6],
        sparkColor: '#a78bfa',
        roles: ['ADMIN', 'CEO', 'FINANCE', 'CFO', 'ADVISOR', 'CRO']
      },
      {
        label: 'Active Drivers',
        value: 384,
        format: 'number',
        trend: 1.5,
        trendUp: true,
        icon: Users,
        gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
        sparkData: [370, 372, 375, 378, 380, 382, 384],
        sparkColor: '#ec4899',
        roles: ['HR']
      },
      {
        label: 'Safety Compliance',
        value: 94.8,
        format: 'percent',
        trend: 0.8,
        trendUp: true,
        icon: ShieldCheck,
        gradient: 'linear-gradient(135deg, #38CE3C, #10b981)',
        sparkData: [93, 93.5, 94, 94.2, 94.5, 94.8],
        sparkColor: '#38CE3C',
        roles: ['HR']
      },
      {
        label: 'System Uptime',
        value: 99.97,
        format: 'percent',
        trend: 0.01,
        trendUp: true,
        icon: Server,
        gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
        sparkData: [99.95, 99.96, 99.97, 99.97],
        sparkColor: '#3b82f6',
        roles: ['CTO', 'SECURITY']
      },
      {
        label: 'Active API Gateways',
        value: apiGatewaysCount,
        format: 'number',
        trend: 0,
        trendUp: true,
        icon: Server,
        gradient: 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
        sparkData: [3, 3, 3, 3],
        sparkColor: '#a78bfa',
        roles: ['CTO', 'SECURITY']
      }
    ];
    return allConfigs.filter(c => !c.roles || c.roles.includes(userRole));
  }, [kpis, userRole, apiGatewaysCount]);

  const hasPendingBacklog = cases.find(c => c.id === 2)?.status === 'pending';
  const dispatchedActive = !hasPendingBacklog;

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      if (userRole === 'ADMIN' || userRole === 'CEO') return true;
      if (userRole === 'OPERATIONS') {
        return c.department.includes('Operations') || c.department.includes('Supply Chain');
      }
      if (userRole === 'FINANCE' || userRole === 'CFO' || userRole === 'ADVISOR' || userRole === 'CRO') {
        return c.department.includes('Finance') || c.department.includes('Compliance') || c.department.includes('Sales') || c.department.includes('CRM');
      }
      if (userRole === 'HR') {
        return c.department.includes('HR') || c.department.includes('Safety');
      }
      if (userRole === 'CTO' || userRole === 'SECURITY') {
        return c.department.includes('Infrastructure') || c.department.includes('Agent Configuration') || c.department.includes('DevOps') || c.department.includes('Systems');
      }
      return true;
    });
  }, [cases, userRole]);

  // --- Inline action trigger ---
  const handleInlineActionTrigger = (caseId) => {
    setActiveCaseId(caseId);
    setActiveTab('cockpit');
  };

  return (
    <div style={styles.dashboardRoot}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={styles.pageHeader}
      >
        <div>
          <h1 style={styles.pageTitle}>
            {greeting}, <span style={{ color: 'var(--primary-400)' }}>Commander</span>
          </h1>
          <p style={styles.pageSubtitle}>
            Your fleet intelligence dashboard — {now.toLocaleDateString('en-IN', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* 12-Plane OS 100% Complete Badge */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(99, 102, 241, 0.15))',
            border: '1px solid #10b981',
            borderRadius: 'var(--radius-sm)',
            color: '#34d399',
            padding: '6px 14px',
            fontSize: 11,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.25)'
          }}>
            <ShieldCheck size={16} color="#10b981" />
            <span>GatiFleet OS — 12/12 Planes 100% Active</span>
          </div>
          {/* Quick-Jump to Strategic Cockpit */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab('cockpit')}
            style={{
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--primary-400)',
              padding: '6px 14px',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'var(--font-sans)',
            }}
          >
            <Brain size={12} />
            Strategic Cockpit
          </motion.button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'flex' }}
            >
              <RefreshCw size={12} color="var(--success-500)" />
            </motion.div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Live</span>
            <div style={{
              width: 7, height: 7, borderRadius: '50%', background: 'var(--success-500)',
              boxShadow: '0 0 8px var(--success-500)',
            }} />
          </div>
        </div>
      </motion.div>

      {/* Tabs Menu Bar */}
      <div style={styles.tabsBar}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isCockpit = tab.id === 'cockpit';
          const alertCount = cases.filter(c => c.status === 'pending').length;
          return (
            <motion.button
              key={tab.id}
              style={styles.tab(activeTab === tab.id)}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={14} />
              {tab.label}
              {isCockpit && alertCount > 0 && (
                <span style={styles.tabBadge}>{alertCount}</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Dynamic Tab Contents */}
      {activeTab === 'overview' && (
        <div style={styles.bentoGrid}>
          {/* Row 1: KPI Strip */}
          {kpiConfigs.map((config, i) => (
            <div key={config.label} style={{ gridColumn: 'span 2' }}>
              <KPICard
                config={config}
                index={i}
                isSelected={selectedSegmentKey === config.key}
                onClick={(key) => {
                  setSelectedSegmentKey(key);
                  setSidePanelTab('graph');
                }}
                onOpenBlueprint={(key) => {
                  setSelectedSegmentKey(key);
                  setSidePanelTab('blueprint');
                }}
              />
            </div>
          ))}

          {/* Interactive Scalable Graph Cockpit & Feature Deep-Dive (Side Drawer Panel) */}
          {selectedSegmentKey && (
            <SegmentDeepDiveCockpit
              segmentKey={selectedSegmentKey}
              initialTab={sidePanelTab}
              onClose={() => setSelectedSegmentKey(null)}
            />
          )}

          {/* Row 2: Top Routes Corridor Engine */}
          {(userRole === 'ADMIN' || userRole === 'CEO' || userRole === 'OPERATIONS') && <TopRoutes routes={routes} />}

          {/* Row 3: Revenue Overview & Derivation Engine */}
          {(userRole === 'ADMIN' || userRole === 'CEO' || userRole === 'FINANCE' || userRole === 'CFO' || userRole === 'ADVISOR' || userRole === 'CRO') && <RevenueChart />}
          {userRole === 'HR' && <HRWorkforcePanel />}
          {(userRole === 'CTO' || userRole === 'SECURITY') && <TechSecurityPanel />}

          {/* Row 4: Revenue Streams & AI Copilot Insights */}
          {(userRole === 'ADMIN' || userRole === 'CEO' || userRole === 'FINANCE' || userRole === 'CFO' || userRole === 'ADVISOR' || userRole === 'CRO') && <RevenueStreamsChart />}
          <AIInsightsPanel 
            insights={insights} 
            onAction={handleInlineActionTrigger} 
            span={4}
          />

          {/* Bottom Row: Fleet Distribution Map frame placed right beside Operational Alerts & Telemetry Feed */}
          {(userRole === 'ADMIN' || userRole === 'CEO' || userRole === 'OPERATIONS') && (
            <FleetMapSection dispatched={dispatchedActive} span={8} />
          )}
          
          <AlertsFeed 
            alerts={alerts} 
            onResolveClick={handleInlineActionTrigger} 
            span={4}
          />
        </div>
      )}

      {activeTab === 'cockpit' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 16 }}>
          {/* Left panel: Autonomy console & System status indicators */}
          <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Agent Autonomy config panel */}
            <div style={styles.autonomySection}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Zap size={14} color={isAutonomyEnabled ? "var(--success-500)" : "var(--primary-400)"} />
                    Agent Autonomy Mode
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Auto-execute decisions &gt; 90% confidence</div>
                </div>
                <label style={styles.switch}>
                  <input
                    type="checkbox"
                    checked={isAutonomyEnabled}
                    onChange={(e) => setIsAutonomyEnabled(e.target.checked)}
                  />
                  <div style={{
                    ...styles.slider,
                    backgroundColor: isAutonomyEnabled ? 'var(--success-500)' : 'var(--bg-600)',
                  }}>
                    <div style={{
                      ...styles.sliderKnob,
                      transform: isAutonomyEnabled ? 'translateX(18px)' : 'translateX(2px)',
                    }} />
                  </div>
                </label>
              </div>

              {/* Console log window */}
              <div style={styles.consoleContainer}>
                <div style={styles.consoleHeader}>
                  <Terminal size={11} style={{ marginRight: 4 }} />
                  <span>AUTONOMOUS EXECUTION LOG</span>
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: isAutonomyEnabled ? 'var(--success-500)' : 'var(--warning-500)',
                      animation: isAutonomyEnabled ? 'pulse 1.5s infinite' : 'none'
                    }} />
                    {isAutonomyEnabled ? 'ACTIVE' : 'STANDBY'}
                  </span>
                </div>
                <div style={styles.consoleBody} ref={consoleRef}>
                  {autonomyLogs.map((log, idx) => (
                    <div key={idx} style={styles.consoleLine}>{log}</div>
                  ))}
                  {isAutonomyEnabled && (
                    <div style={{ ...styles.consoleLine, color: 'var(--success-400)', opacity: 0.8 }}>
                      &gt; Monitoring operational telemetry...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Real-time system states cards */}
            <div style={styles.card}>
              <SectionHeader icon={Settings} title="Operational Threshold Controls" />
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-muted)' }}>FASTag Balance Gateways</span>
                    <span style={{ color: fastagBalance > 10000 ? 'var(--success-500)' : 'var(--danger-500)', fontWeight: 600 }}>
                      ₹{fastagBalance.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-600)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (fastagBalance / 25000) * 100)}%`, background: fastagBalance > 10000 ? 'var(--success-500)' : 'var(--danger-500)', transition: 'width 0.4s ease' }} />
                  </div>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 2, display: 'block' }}>Min safety limit: ₹11,000</span>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-muted)' }}>API Tracking Gateways</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{apiGatewaysCount} nodes active</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Gateway Core Load</span>
                    <span style={{ color: apiGatewayLoad < 50 ? 'var(--success-500)' : 'var(--danger-500)', fontWeight: 600 }}>{apiGatewayLoad}% CPU</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-600)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${apiGatewayLoad}%`, background: apiGatewayLoad < 50 ? 'var(--success-500)' : 'var(--danger-500)', transition: 'width 0.4s ease' }} />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Active Autonomy Confidence Target</span>
                  <span style={{ color: 'var(--primary-400)', fontWeight: 600 }}>&gt; 90%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: 10 Collapsible Strategic Cases */}
          <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredCases.map((c) => {
              const CaseIcon = c.icon;
              const isSelected = activeCaseId === c.id;
              return (
                <div
                  key={c.id}
                  ref={isSelected ? selectedCaseRef : null}
                  style={{
                    ...styles.caseCard,
                    borderColor: isSelected ? 'var(--primary-500)' : 'var(--surface-border)',
                    boxShadow: isSelected ? '0 0 15px rgba(99, 102, 241, 0.18)' : 'none',
                    background: isSelected ? 'rgba(30, 41, 59, 0.65)' : 'rgba(30, 41, 59, 0.35)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 6,
                        background: `${c.color}15`, display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                      }}>
                        <CaseIcon size={14} color={c.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>{c.department}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{c.title}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: 'var(--bg-600)', color: 'var(--text-secondary)' }}>
                        Conf: {c.confidence}%
                      </span>
                      {c.status === 'resolved' ? (
                        <span style={{ ...styles.badge, background: 'rgba(56, 206, 60, 0.15)', color: 'var(--success-500)' }}>
                          <CheckCircle size={10} /> Resolved
                        </span>
                      ) : (
                        <span style={{ ...styles.badge, background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning-500)' }}>
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {c.description}
                  </div>

                  <div style={{
                    marginTop: 8, padding: '8px', background: 'var(--bg-800)',
                    borderRadius: 'var(--radius-sm)', borderLeft: `2px solid ${c.color}`
                  }}>
                    <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Brain size={10} color="var(--primary-400)" /> AI Recommendation
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.3 }}>{c.recommendation}</div>
                  </div>

                  {/* State Indicators */}
                  <div style={styles.caseIndicators}>
                    {c.id === 1 && (
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        Surcharge: <span style={{ color: kpis.revenueToday > 42850000 ? 'var(--success-500)' : 'var(--text-primary)', fontWeight: 600 }}>{kpis.revenueToday > 42850000 ? 'APPLIED (+3.8%)' : 'STANDBY'}</span> | Fuel Efficiency: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{kpis.fuelEfficiency} km/L</span>
                      </div>
                    )}
                    {c.id === 2 && (
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        JNPT Dispatch: <span style={{ color: dispatchedActive ? 'var(--success-500)' : 'var(--text-primary)', fontWeight: 600 }}>{dispatchedActive ? 'COMPLETED (+8 Trucks)' : 'STANDBY'}</span>
                      </div>
                    )}
                    {c.id === 3 && (
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        Siliguri Hub: <span style={{ color: routes.find(r => r.from === 'Kolkata' && r.to === 'Guwahati')?.efficiency === 96 ? 'var(--success-500)' : 'var(--text-primary)', fontWeight: 600 }}>{routes.find(r => r.from === 'Kolkata' && r.to === 'Guwahati')?.efficiency === 96 ? 'ACTIVE (96% Efficiency)' : 'INACTIVE (79%)'}</span>
                      </div>
                    )}
                    {c.id === 7 && (
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        FASTag Balance: <span style={{ color: fastagBalance > 10000 ? 'var(--success-500)' : 'var(--danger-500)', fontWeight: 600 }}>₹{fastagBalance.toLocaleString('en-IN')}</span> (Limit: ₹11,000)
                      </div>
                    )}
                    {c.id === 9 && (
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        Instances: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{apiGatewaysCount} active</span> | Telemetry Load: <span style={{ color: apiGatewayLoad < 50 ? 'var(--success-500)' : 'var(--danger-500)', fontWeight: 600 }}>{apiGatewayLoad}% CPU</span>
                      </div>
                    )}
                  </div>

                  {/* Manual trigger button */}
                  {c.status === 'pending' && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      {c.id === 1 && (
                        <>
                          <button onClick={() => resolveCase(1)} style={styles.actionBtnPrimary}>
                            <Zap size={11} style={{ marginRight: 4 }} /> Apply Surcharge
                          </button>
                          <button onClick={() => resolveCase(1)} style={styles.actionBtnSecondary}>
                            Shift to Rail
                          </button>
                        </>
                      )}
                      {c.id === 2 && (
                        <button onClick={() => resolveCase(2)} style={styles.actionBtnPrimary}>
                          <Truck size={11} style={{ marginRight: 4 }} /> Match & Auto-Dispatch
                        </button>
                      )}
                      {c.id === 3 && (
                        <button onClick={() => resolveCase(3)} style={styles.actionBtnPrimary}>
                          <MapPin size={11} style={{ marginRight: 4 }} /> Siliguri Relay Pivot
                        </button>
                      )}
                      {c.id === 4 && (
                        <button onClick={() => resolveCase(4)} style={styles.actionBtnPrimary}>
                          <IndianRupee size={11} style={{ marginRight: 4 }} /> Disburse Payouts
                        </button>
                      )}
                      {c.id === 5 && (
                        <button onClick={() => resolveCase(5)} style={styles.actionBtnPrimary}>
                          <Users size={11} style={{ marginRight: 4 }} /> CEO Escalation
                        </button>
                      )}
                      {c.id === 6 && (
                        <button onClick={() => resolveCase(6)} style={styles.actionBtnPrimary}>
                          <Activity size={11} style={{ marginRight: 4 }} /> Reroute TRK-00312
                        </button>
                      )}
                      {c.id === 7 && (
                        <button onClick={() => resolveCase(7)} style={styles.actionBtnPrimary}>
                          <CreditCard size={11} style={{ marginRight: 4 }} /> Recharge ₹15,000
                        </button>
                      )}
                      {c.id === 8 && (
                        <button onClick={() => resolveCase(8)} style={styles.actionBtnPrimary}>
                          <FileText size={11} style={{ marginRight: 4 }} /> Extend 24h
                        </button>
                      )}
                      {c.id === 9 && (
                        <button onClick={() => resolveCase(9)} style={styles.actionBtnPrimary}>
                          <Server size={11} style={{ marginRight: 4 }} /> Scale to 6 Nodes
                        </button>
                      )}
                      {c.id === 10 && (
                        <button onClick={() => resolveCase(10)} style={styles.actionBtnPrimary}>
                          <Brain size={11} style={{ marginRight: 4 }} /> Enable Autonomy Policy
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {insights.map((insight) => {
            const Icon = insightIcons[insight.type] || Lightbulb;
            const color = insightColors[insight.type] || '#6366f1';
            return (
              <div key={insight.id} style={styles.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-md)',
                    background: `${color}18`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Icon size={18} color={color} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-600)', color: 'var(--text-secondary)' }}>
                    {insight.confidence}% confidence
                  </span>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: 'var(--text-primary)' }}>{insight.title}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 12px', minHeight: 48 }}>{insight.summary}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--success-500)' }}>{insight.impact}</span>
                  <button
                    onClick={() => {
                      const caseMap = { revenue: 1, efficiency: 1, churn: 5, route: 3, maintenance: 6 };
                      handleInlineActionTrigger(caseMap[insight.type] || 1);
                    }}
                    style={styles.actionBtnPrimary}
                  >
                    Optimize <ChevronRight size={10} style={{ marginLeft: 2 }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {generateAlerts().map((alert) => (
            <div key={alert.id} style={{ ...styles.card, display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: alertTypeColors[alert.type] || 'var(--info-500)',
                boxShadow: `0 0 10px ${alertTypeColors[alert.type]}80`,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{alert.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{alert.message}</div>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{alert.time}</div>
              <button
                onClick={() => {
                  const alertCaseMap = { 'Breakdown': 6, 'Temperature': 6, 'FASTag': 7, 'Fatigue': 4 };
                  const key = Object.keys(alertCaseMap).find(k => alert.title.includes(k) || alert.message.includes(k));
                  handleInlineActionTrigger(alertCaseMap[key] || 7);
                }}
                style={{ ...styles.actionBtnSecondary, flex: 'none', padding: '6px 14px' }}
              >
                Resolve Anomaly
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Toast notifications */}
      <div style={styles.toastContainer}>
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.15 } }}
              style={styles.toast}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle size={13} color="var(--success-500)" />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>{t.message}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pulse animation keyframes injected via style tag */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.8); }
          100% { opacity: 0; transform: scale(2.5); }
        }
      `}</style>
    </div>
  );
};

// ============================================================
// STYLES
// ============================================================
const styles = {
  dashboardRoot: {
    padding: '24px',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text-primary)',
    minHeight: '100vh',
    position: 'relative',
  },

  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  pageTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
  },

  pageSubtitle: {
    margin: '4px 0 0',
    fontSize: 13,
    color: 'var(--text-muted)',
  },

  bentoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap: 16,
  },

  card: {
    background: 'var(--surface)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid var(--surface-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },

  kpiCard: {
    background: 'var(--surface)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid var(--surface-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '18px',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    height: '100%',
  },

  kpiIconBox: {
    width: 36,
    height: 36,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },

  kpiValue: {
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
    fontFamily: 'var(--font-sans)',
  },

  kpiLabel: {
    fontSize: 11,
    color: 'var(--text-muted)',
    fontWeight: 500,
  },

  kpiTrend: {
    fontSize: 11,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },

  toggleGroup: {
    display: 'flex',
    background: 'var(--bg-600)',
    borderRadius: 'var(--radius-sm)',
    padding: 2,
    gap: 2,
  },

  toggleBtn: {
    padding: '5px 12px',
    fontSize: 11,
    fontWeight: 500,
    border: 'none',
    borderRadius: 4,
    background: 'transparent',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'var(--font-sans)',
  },

  toggleBtnActive: {
    background: 'var(--primary-500)',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
  },

  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 10,
    fontWeight: 600,
    padding: '3px 8px',
    borderRadius: 'var(--radius-sm)',
  },

  insightCard: {
    padding: '10px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-800)',
    border: '1px solid var(--surface-border)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  insightActionLink: {
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--primary-400)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: 4,
    transition: 'background 0.15s ease',
  },

  viewAllBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 11,
    fontWeight: 500,
    color: 'var(--primary-400)',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    padding: 0,
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 12,
  },

  th: {
    textAlign: 'left',
    padding: '8px 10px',
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid var(--surface-border)',
    whiteSpace: 'nowrap',
  },

  tr: {
    transition: 'background 0.15s ease',
    cursor: 'pointer',
  },

  td: {
    padding: '10px 10px',
    color: 'var(--text-secondary)',
    borderBottom: '1px solid rgba(99, 102, 241, 0.05)',
    whiteSpace: 'nowrap',
  },

  progressBarBg: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    background: 'var(--bg-600)',
    overflow: 'hidden',
    minWidth: 50,
  },

  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  alertItem: {
    display: 'flex',
    gap: 10,
    padding: '10px 8px',
    borderRadius: 'var(--radius-sm)',
    transition: 'background 0.15s ease',
    cursor: 'pointer',
  },

  alertResolveBtn: {
    fontSize: 9,
    fontWeight: 600,
    color: 'var(--primary-400)',
    background: 'rgba(99, 102, 241, 0.12)',
    border: '1px solid rgba(99, 102, 241, 0.2)',
    borderRadius: 4,
    padding: '2px 8px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },

  // --- Tabs Styles ---
  tabsBar: {
    display: 'flex',
    gap: '4px',
    marginBottom: '20px',
    background: 'var(--surface)',
    backdropFilter: 'blur(16px)',
    borderRadius: 'var(--radius-md)',
    padding: '5px',
    border: '1px solid var(--surface-border)',
    width: 'fit-content',
  },

  tab: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: active ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'transparent',
    color: active ? '#fff' : 'var(--text-secondary)',
    fontSize: '12px',
    fontWeight: active ? '600' : '500',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    fontFamily: 'var(--font-sans)',
    boxShadow: active ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none',
    position: 'relative',
  }),

  tabBadge: {
    background: 'var(--danger-500)',
    color: '#fff',
    fontSize: '9px',
    fontWeight: '700',
    borderRadius: '10px',
    padding: '2px 6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '2px',
  },

  autonomySection: {
    background: 'rgba(9, 13, 22, 0.55)',
    borderRadius: 'var(--radius-lg)',
    padding: '16px',
    border: '1px solid var(--surface-border)',
  },

  switch: {
    position: 'relative',
    display: 'inline-block',
    width: 38,
    height: 20,
    cursor: 'pointer',
  },

  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    transition: 'background-color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
  },

  sliderKnob: {
    height: 16,
    width: 16,
    borderRadius: '50%',
    backgroundColor: '#fff',
    transition: 'transform 0.2s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
  },

  consoleContainer: {
    background: '#040711',
    border: '1px solid #14213d',
    borderRadius: 'var(--radius-sm)',
    overflow: 'hidden',
    marginTop: 10,
    fontFamily: 'var(--font-mono)',
  },

  consoleHeader: {
    background: '#0d1321',
    padding: '6px 10px',
    fontSize: 9,
    fontWeight: 600,
    color: '#818cf8',
    borderBottom: '1px solid #14213d',
    display: 'flex',
    alignItems: 'center',
  },

  consoleBody: {
    padding: '10px',
    height: '110px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },

  consoleLine: {
    fontSize: 9,
    color: '#34d399',
    lineHeight: 1.3,
  },

  caseCard: {
    border: '1px solid var(--surface-border)',
    borderRadius: 'var(--radius-md)',
    padding: '14px',
    transition: 'all 0.2s ease',
  },

  caseIndicators: {
    marginTop: 8,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: 8,
  },

  actionBtnPrimary: {
    padding: '6px 14px',
    fontSize: 10,
    fontWeight: 600,
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--primary-500)',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionBtnSecondary: {
    padding: '6px 14px',
    fontSize: 10,
    fontWeight: 600,
    border: '1px solid var(--surface-border)',
    borderRadius: 'var(--radius-sm)',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  toastContainer: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    zIndex: 9999,
  },

  toast: {
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(56, 206, 60, 0.3)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
};

export default Dashboard;
