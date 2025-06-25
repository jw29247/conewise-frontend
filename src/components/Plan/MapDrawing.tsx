import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import mapDrawTheme from '../../utils/mapDrawTheme';

interface Equipment {
  id: string;
  type: string;
  name: string;
  icon: string;
  color: string;
  width: number;
  length: number;
  coordinates: [number, number];
  rotation: number;
}

interface MapDrawingProps {
  center: { lat: number; lng: number };
  onDataUpdate: (workArea: GeoJSON.Feature | null, equipment: Equipment[]) => void;
  initialWorkArea?: GeoJSON.Feature;
  initialEquipment?: Equipment[];
}

// Equipment with predetermined sizes in meters
const EQUIPMENT_TYPES = [
  { id: 'digger', name: 'Digger', icon: '🚜', color: '#10b981', width: 3, length: 5 },
  { id: 'van', name: 'Van', icon: '🚐', color: '#3b82f6', width: 2, length: 5 },
  { id: 'crane', name: 'Crane', icon: '🏗️', color: '#ef4444', width: 4, length: 8 },
  { id: 'truck', name: 'Truck', icon: '🚛', color: '#f59e0b', width: 2.5, length: 7 },
];

const MapDrawing: React.FC<MapDrawingProps> = ({
  center,
  onDataUpdate,
  initialWorkArea,
  initialEquipment = [],
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const [drawMode, setDrawMode] = useState<'manual' | 'auto'>('manual');
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [mapLoaded, setMapLoaded] = useState(false);
  const dimensionLabelsRef = useRef<maplibregl.Marker[]>([]);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [center.lng, center.lat],
      zoom: 18,
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {},
      defaultMode: 'simple_select',
      styles: mapDrawTheme,
      userProperties: true
    });

    map.addControl(draw);
    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 200 }), 'bottom-left');

    mapRef.current = map;
    drawRef.current = draw;

    map.on('load', () => {
      if (mountedRef.current) {
        setMapLoaded(true);
        if (drawRef.current && drawMode === 'manual') {
          drawRef.current.changeMode('draw_polygon');
        }
      }
      
      if (initialWorkArea) {
        draw.add(initialWorkArea);
        addDimensionLabels(initialWorkArea);
      }

      map.addSource('auto-work-area', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      map.addLayer({
        id: 'auto-work-area-fill',
        type: 'fill',
        source: 'auto-work-area',
        paint: {
          'fill-color': '#f59e0b',
          'fill-opacity': 0.15
        }
      });

      map.addLayer({
        id: 'auto-work-area-outline',
        type: 'line',
        source: 'auto-work-area',
        paint: {
          'line-color': '#f59e0b',
          'line-width': 2,
          'line-dasharray': [2, 2]
        }
      });
    });

    map.on('draw.create', handleDrawUpdate);
    map.on('draw.update', handleDrawUpdate);
    map.on('draw.delete', handleDrawUpdate);

    map.on('click', (e) => {
      if (drawMode === 'auto' && selectedTool !== 'select' && EQUIPMENT_TYPES.find(t => t.id === selectedTool)) {
        const equipmentType = EQUIPMENT_TYPES.find((t) => t.id === selectedTool);
        if (equipmentType) {
          const newEquipment = {
            id: `equipment-${Date.now()}`,
            type: equipmentType.id,
            name: equipmentType.name,
            icon: equipmentType.icon,
            color: equipmentType.color,
            width: equipmentType.width,
            length: equipmentType.length,
            coordinates: [e.lngLat.lng, e.lngLat.lat],
            rotation: 0,
          };
          
          addEquipmentMarker(newEquipment);
          if (mountedRef.current) {
            setEquipment((prev) => [...prev, newEquipment]);
          }
        }
      }
    });

    return () => {
      mountedRef.current = false;
      // Clear all markers before removing the map
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current.clear();
      map.remove();
    };
  }, [center]);

  useEffect(() => {
    if (mapLoaded && initialEquipment.length > 0) {
      initialEquipment.forEach(addEquipmentMarker);
    }
  }, [mapLoaded, initialEquipment]);

  // Separate effect for draw mode changes to avoid infinite loops
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    
    if (drawMode === 'manual') {
      try {
        const source = mapRef.current.getSource('auto-work-area') as maplibregl.GeoJSONSource;
        if (source) {
          source.setData({
            type: 'FeatureCollection',
            features: []
          });
        }
      } catch (error) {
        console.error('Error updating auto-work-area source:', error);
      }
      // Only clear equipment when switching to manual mode, not on every equipment change
      if (equipment.length > 0) {
        // Clear markers from map but don't update state to prevent infinite loop
        markersRef.current.forEach(marker => {
          if (marker && typeof marker.remove === 'function') {
            marker.remove();
          }
        });
        markersRef.current.clear();
        if (mountedRef.current) {
          setEquipment([]);
        }
      }
    }
  }, [drawMode, mapLoaded]);
  
  // Separate effect for equipment changes in auto mode
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || drawMode !== 'auto') return;
    
    if (equipment.length > 0) {
      // Placeholder for future auto work area generation
    }
  }, [equipment, mapLoaded, drawMode]);

  const addDimensionLabels = (feature: GeoJSON.Feature) => {
    if (!mapRef.current || !feature.geometry || feature.geometry.type !== 'Polygon') return;

    // Clear existing labels
    dimensionLabelsRef.current.forEach(marker => marker.remove());
    dimensionLabelsRef.current = [];

    const coords = feature.geometry.coordinates[0];
    for (let i = 0; i < coords.length - 1; i++) {
      const start = turf.point(coords[i]);
      const end = turf.point(coords[i + 1]);
      const length = turf.distance(start, end, { units: 'meters' });
      const midpoint = turf.midpoint(start, end).geometry.coordinates as [number, number];

      const el = document.createElement('div');
      el.className = 'dimension-label';
      el.style.cssText = `
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: #ffffff;
        padding: 8px 12px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 600;
        font-family: system-ui, -apple-system, sans-serif;
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        position: relative;
        text-align: center;
        white-space: nowrap;
        transform: translateY(-50%);
        z-index: 10;
        backdrop-filter: blur(8px);
        transition: all 0.2s ease;
      `;
      
      // Add hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'translateY(-50%) scale(1.05)';
        el.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.4), 0 3px 6px rgba(0, 0, 0, 0.15)';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translateY(-50%) scale(1)';
        el.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)';
      });

      // Create clean distance display with proper formatting
      const distanceText = length >= 1000 
        ? `${(length / 1000).toFixed(2)}km`
        : length >= 100 
          ? `${Math.round(length)}m`
          : `${length.toFixed(1)}m`;
      
      el.innerHTML = `
        <div style="display: flex; align-items: center; gap: 4px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style="opacity: 0.8;">
            <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/>
          </svg>
          <span>${distanceText}</span>
        </div>
      `;

      const label = new maplibregl.Marker({ element: el, className: 'dimension-label' })
        .setLngLat(midpoint)
        .addTo(mapRef.current);
      
      dimensionLabelsRef.current.push(label);
    }
  };

  const updateData = useCallback(() => {
    if (drawMode === 'manual' && drawRef.current) {
      const data = drawRef.current.getAll();
      const workArea = data.features.length > 0 ? data.features[0] : null;
      onDataUpdate(workArea, []);
    }
  }, [drawMode, onDataUpdate]);

  const handleDrawUpdate = useCallback(() => {
    if (!drawRef.current || drawMode !== 'manual') return;
    
    const data = drawRef.current.getAll();
    const workArea = data.features.length > 0 ? data.features[0] : null;
    
    if (workArea) {
      addDimensionLabels(workArea);
    } else {
      if (mountedRef.current) {
        dimensionLabelsRef.current.forEach(marker => marker.remove());
        dimensionLabelsRef.current = [];
      }
    }
    
    updateData();
  }, [drawMode, updateData]);

  const addEquipmentMarker = (equipmentItem: Equipment) => {
    if (!mapRef.current) return;

    const el = document.createElement('div');
    el.className = 'equipment-marker';
    el.style.position = 'relative';
    
    el.innerHTML = `
      <div style="
        background: linear-gradient(135deg, ${equipmentItem.color} 0%, ${equipmentItem.color}dd 100%);
        color: white;
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        cursor: move;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border: 1px solid rgba(255, 255, 255, 0.2);
        position: relative;
        transition: all 0.2s ease;
        backdrop-filter: blur(8px);
      " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'">
        ${equipmentItem.icon}
        <div style="
          position: absolute;
          bottom: -28px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
          color: white;
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 11px;
          white-space: nowrap;
          font-weight: 600;
          font-family: system-ui, -apple-system, sans-serif;
          box-shadow: 0 3px 8px rgba(0,0,0,0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
        ">
          <div style='display: flex; align-items: center; gap: 3px;'>
            <svg width='10' height='10' viewBox='0 0 16 16' fill='currentColor' style='opacity: 0.7;'>
              <path d='M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z'/>
            </svg>
            <span>${equipmentItem.width}m × ${equipmentItem.length}m</span>
          </div>
        </div>
      </div>
    `;

    const marker = new maplibregl.Marker({ element: el, draggable: true, className: 'equipment-marker' })
      .setLngLat(equipmentItem.coordinates)
      .addTo(mapRef.current);

    markersRef.current.set(equipmentItem.id, marker);

    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      if (mountedRef.current) {
        setEquipment((prev) =>
          prev.map((item) =>
            item.id === equipmentItem.id
              ? { ...item, coordinates: [lngLat.lng, lngLat.lat] }
              : item
          )
        );
      }
    });

    el.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      marker.remove();
      markersRef.current.delete(equipmentItem.id);
      if (mountedRef.current) {
        setEquipment((prev) => prev.filter((item) => item.id !== equipmentItem.id));
      }
    });

    el.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      if (mountedRef.current) {
        setEquipment((prev) =>
          prev.map((item) =>
            item.id === equipmentItem.id
              ? { ...item, rotation: (item.rotation + 45) % 360 }
              : item
          )
        );
      }
    });
  };


  const clearEquipment = () => {
    try {
      markersRef.current.forEach(marker => {
        if (marker && typeof marker.remove === 'function') {
          marker.remove();
        }
      });
      markersRef.current.clear();
      if (mountedRef.current) {
        setEquipment([]);
      }
    } catch (error) {
      console.error('Error clearing equipment:', error);
    }
  };

  const handleModeChange = (mode: 'manual' | 'auto') => {
    if (mode !== drawMode) {
      if (drawRef.current) {
        drawRef.current.deleteAll();
      }
      clearEquipment();
      dimensionLabelsRef.current.forEach(marker => marker.remove());
      dimensionLabelsRef.current = [];
      updateData();
      setDrawMode(mode);
      if (mode === 'manual') {
        setSelectedTool('select');
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <style>
        {`
          /* Hide MapboxDraw default vertex markers - these are the blue pins */
          .mapboxgl-canvas-container canvas + div {
            pointer-events: none;
          }
          
          .mapboxgl-canvas-container canvas + div > * {
            display: none !important;
          }
          
          /* Show only our custom markers by targeting their specific classes */
          .maplibregl-marker.dimension-label,
          .maplibregl-marker.equipment-marker {
            display: block !important;
            pointer-events: auto !important;
          }
          
          /* Alternative approach - hide draw vertices specifically */
          .mapboxgl-marker {
            display: none !important;
          }
          
          .maplibregl-marker {
            display: block !important;
          }
        `}
      </style>
      <div className="relative">
        {/* Drawing Mode Toggle */}
        <div className="absolute top-4 left-4 z-10 bg-white rounded-xl shadow-lg border border-gray-100 p-4" style={{ width: '320px' }}>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Drawing Mode</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleModeChange('manual')}
                className={`
                  w-full px-4 py-3 rounded-xl text-left transition-all
                  ${drawMode === 'manual'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <div className="font-medium">Manual Draw</div>
                <div className="text-xs mt-0.5 opacity-80">Draw work area polygon directly</div>
              </button>
              <button
                onClick={() => handleModeChange('auto')}
                className={`
                  w-full px-4 py-3 rounded-xl text-left transition-all
                  ${drawMode === 'auto'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <div className="font-medium">Auto from Equipment</div>
                <div className="text-xs mt-0.5 opacity-80">Place equipment to generate area</div>
              </button>
            </div>
          </div>

          {/* Drawing Tools - Only show in manual mode */}
          {drawMode === 'manual' && (
            <>
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Drawing Tools</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      if (drawRef.current) {
                        drawRef.current.changeMode('simple_select');
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all bg-gray-50 text-gray-700 hover:bg-gray-100"
                  >
                    🔄 Select / Edit
                  </button>
                  <button
                    onClick={() => {
                      if (drawRef.current) {
                        drawRef.current.changeMode('draw_polygon');
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all bg-blue-500 text-white hover:bg-blue-600"
                  >
                    ✏️ Draw Work Area
                  </button>
                  <button
                    onClick={() => {
                      if (drawRef.current) {
                        drawRef.current.trash();
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all bg-red-500 text-white hover:bg-red-600"
                  >
                    🗑️ Delete Selected
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Equipment Tools - Only show in auto mode */}
          {drawMode === 'auto' && (
            <>
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Equipment Tools</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedTool('select')}
                    className={`
                      w-full px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all
                      ${selectedTool === 'select'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    Select / Move
                  </button>
                  {EQUIPMENT_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedTool(type.id)}
                      className={`
                        w-full px-3 py-2.5 rounded-lg text-sm font-medium text-left flex items-center justify-between transition-all
                        ${selectedTool === type.id
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <span className="flex items-center">
                        <span className="text-lg mr-2">{type.icon}</span>
                        {type.name}
                      </span>
                      <span className="text-xs opacity-75">{type.width}×{type.length}m</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          
          </div>

        <div ref={mapContainer} className="w-full h-[600px] rounded-xl overflow-hidden" />

        {/* Equipment List - Only show in auto mode */}
        {drawMode === 'auto' && equipment.length > 0 && (
          <div className="absolute bottom-24 right-4 z-10 bg-white rounded-xl shadow-lg border border-gray-100 p-4 max-h-56 overflow-y-auto">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Placed Equipment ({equipment.length})
            </h4>
            <div className="space-y-2">
              {equipment.map((item) => (
                <div key={item.id} className="flex items-center text-sm text-gray-600">
                  <span className="text-lg mr-2">{item.icon}</span>
                  <span>{item.name}</span>
                  <span className="text-xs text-gray-400 ml-1">({item.width}×{item.length}m)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl shadow-lg p-4">
          <p className="text-sm">
            {drawMode === 'manual'
              ? '💡 Click "Draw Work Area" button above, then click on the map to start drawing a polygon. Click each corner of your work area, then double-click to finish.'
              : selectedTool === 'select'
                ? '💡 Click and drag equipment to move. Right-click to remove. Double-click to rotate.'
                : `💡 Click to place ${EQUIPMENT_TYPES.find((t) => t.id === selectedTool)?.name || 'equipment'}. The work area will be automatically generated.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapDrawing;