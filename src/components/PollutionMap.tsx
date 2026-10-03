import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { PollutionReport, PollutionType, SeverityLevel } from '../types.ts';
import { Layers, Crosshair, ZoomIn, ZoomOut, Flame, Filter, Eye } from 'lucide-react';

interface PollutionMapProps {
  reports: PollutionReport[];
  selectedLocation?: { lat: number; lng: number } | null;
  onLocationSelect?: (lat: number, lng: number, addressSuggestion?: string) => void;
  onReportSelect?: (report: PollutionReport) => void;
  height?: string;
  enableHotspotOverlayDefault?: boolean;
  interactiveSelection?: boolean;
}

export const PollutionMap: React.FC<PollutionMapProps> = ({
  reports,
  selectedLocation,
  onLocationSelect,
  onReportSelect,
  height = '500px',
  enableHotspotOverlayDefault = false,
  interactiveSelection = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const hotspotLayerRef = useRef<L.LayerGroup | null>(null);
  const selectionMarkerRef = useRef<L.Marker | null>(null);

  const [showHotspots, setShowHotspots] = useState(enableHotspotOverlayDefault);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const categoryColors: Record<PollutionType, string> = {
    air: '#9333ea', // purple
    water: '#0284c7', // sky blue
    waste: '#ea580c', // orange
    industrial: '#334155', // slate
    noise: '#eab308', // amber
    other: '#059669', // emerald
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center (San Francisco Bay Area default or first report coordinate)
    const initialLat = reports[0]?.latitude || 37.7749;
    const initialLng = reports[0]?.longitude || -122.4194;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 12,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | EcoWatch Platform',
      maxZoom: 19,
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    hotspotLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Click handler for location selection
    if (interactiveSelection && onLocationSelect) {
      map.on('click', async (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        onLocationSelect(lat, lng);

        if (selectionMarkerRef.current) {
          selectionMarkerRef.current.setLatLng([lat, lng]);
        } else {
          const pinIcon = L.divIcon({
            className: 'custom-selection-marker',
            html: `<div class="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-lg flex items-center justify-center text-white ring-4 ring-emerald-300/60 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          });
          selectionMarkerRef.current = L.marker([lat, lng], { icon: pinIcon }).addTo(map);
        }
      });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [interactiveSelection]);

  // Update selected location marker
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLocation) return;
    const { lat, lng } = selectedLocation;
    if (selectionMarkerRef.current) {
      selectionMarkerRef.current.setLatLng([lat, lng]);
    } else {
      const pinIcon = L.divIcon({
        className: 'custom-selection-marker',
        html: `<div class="w-8 h-8 rounded-full bg-emerald-600 border-2 border-white shadow-lg flex items-center justify-center text-white ring-4 ring-emerald-300/60 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });
      selectionMarkerRef.current = L.marker([lat, lng], { icon: pinIcon }).addTo(mapInstanceRef.current);
    }
    mapInstanceRef.current.panTo([lat, lng]);
  }, [selectedLocation]);

  // Update report markers and hotspots
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !hotspotLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    hotspotLayerRef.current.clearLayers();

    // Filter reports
    const filtered = reports.filter((r) => {
      if (filterType !== 'all' && r.pollution_type !== filterType) return false;
      if (filterSeverity !== 'all' && r.severity !== filterSeverity) return false;
      return true;
    });

    // Populate Report Markers
    filtered.forEach((r) => {
      const color = categoryColors[r.pollution_type] || '#059669';
      const isCritical = r.severity === 'critical';

      const customIcon = L.divIcon({
        className: 'custom-incident-pin',
        html: `
          <div class="relative group cursor-pointer">
            ${isCritical ? '<div class="absolute -inset-1 rounded-full bg-rose-500 opacity-75 animate-ping"></div>' : ''}
            <div style="background-color: ${color};" class="w-7 h-7 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white relative z-10 transition-transform transform group-hover:scale-110">
              <span class="text-[10px] font-black uppercase">${r.pollution_type.charAt(0)}</span>
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([r.latitude, r.longitude], { icon: customIcon });

      // Popup Content
      const popupHtml = `
        <div class="p-1 max-w-[240px] text-slate-800 font-sans">
          <div class="flex items-center justify-between mb-1.5 border-b pb-1 border-slate-100">
            <span class="text-[10px] font-mono font-bold text-slate-500">${r.report_number}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
              r.severity === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
            }">${r.severity}</span>
          </div>
          <h4 class="text-xs font-bold leading-tight text-slate-900 mb-1">${r.title}</h4>
          <p class="text-[11px] text-slate-500 line-clamp-2 mb-2">${r.description}</p>
          <div class="text-[10px] text-slate-500 mb-2 font-medium">📍 ${r.address}</div>
          <div class="flex items-center justify-between pt-1 border-t border-slate-100">
            <span class="text-[10px] font-semibold text-emerald-700">${r.status}</span>
            <button id="view-report-${r.id}" class="bg-slate-900 hover:bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded transition-colors cursor-pointer">
              Inspect Case
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { minWidth: 220, closeButton: false });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-report-${r.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onReportSelect) onReportSelect(r);
          };
        }
      });

      markersLayerRef.current!.addLayer(marker);
    });

    // Hotspot Circles Layer
    if (showHotspots) {
      filtered.forEach((r) => {
        const radius = r.severity === 'critical' ? 700 : r.severity === 'high' ? 500 : 350;
        const color = r.severity === 'critical' ? '#ef4444' : r.severity === 'high' ? '#f97316' : '#eab308';

        const circle = L.circle([r.latitude, r.longitude], {
          color: color,
          fillColor: color,
          fillOpacity: 0.18,
          radius: radius,
          weight: 1.5,
        });
        hotspotLayerRef.current!.addLayer(circle);
      });
    }
  }, [reports, filterType, filterSeverity, showHotspots, onReportSelect]);

  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        mapInstanceRef.current?.setView([latitude, longitude], 14);
        if (interactiveSelection && onLocationSelect) {
          onLocationSelect(latitude, longitude);
        }
      },
      (err) => console.warn('Geolocation denied or unavailable', err)
    );
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
      {/* Map Controls & Filters Overlay */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-slate-200/80">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mr-1">
          <Filter className="w-3.5 h-3.5 text-emerald-600" />
          Filter:
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          aria-label="Filter pollution by type"
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
        >
          <option value="all">All Types</option>
          <option value="air">Air Pollution</option>
          <option value="water">Water Pollution</option>
          <option value="waste">Waste / Dumping</option>
          <option value="industrial">Industrial Chemical</option>
          <option value="noise">Noise / Acoustic</option>
          <option value="other">Other Environmental</option>
        </select>

        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          aria-label="Filter pollution by severity"
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical Only</option>
          <option value="high">High & Critical</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <button
          type="button"
          onClick={() => setShowHotspots(!showHotspots)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
            showHotspots
              ? 'bg-rose-50 text-rose-700 border-rose-300'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-rose-500" />
          {showHotspots ? 'Hotspots Active' : 'Show Hotspots'}
        </button>
      </div>

      {/* Floating Action Controls */}
      <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleLocateMe}
          title="Zoom to current location"
          className="p-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl shadow-lg border border-slate-200 transition-all transform active:scale-95 cursor-pointer"
        >
          <Crosshair className="w-4 h-4 text-emerald-600" />
        </button>
        <button
          type="button"
          onClick={() => mapInstanceRef.current?.zoomIn()}
          title="Zoom In"
          className="p-2 bg-white hover:bg-slate-50 text-slate-700 rounded-t-xl shadow-lg border-t border-x border-slate-200 transition-all cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => mapInstanceRef.current?.zoomOut()}
          title="Zoom Out"
          className="p-2 bg-white hover:bg-slate-50 text-slate-700 rounded-b-xl shadow-lg border-b border-x border-slate-200 transition-all cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-slate-200/80 text-[11px] font-medium hidden sm:flex items-center gap-3 text-slate-700">
        <span className="font-bold text-slate-900">Key:</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" /> Air</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block" /> Water</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-600 inline-block" /> Waste</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" /> Industrial</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Noise</span>
      </div>

      {/* Leaflet Render Target */}
      <div ref={mapContainerRef} style={{ height, width: '100%' }} className="z-0" />
    </div>
  );
};
