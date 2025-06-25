import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import 'maplibre-gl/dist/maplibre-gl.css';

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

// Equipment with predetermined sizes in meters (removed barriers and cones)
const EQUIPMENT_TYPES = [
  { id: 'digger', name: 'Digger', icon: '🚜', color: '#f59e0b', width: 3, length: 5 },
  { id: 'van', name: 'Van', icon: '🚐', color: '#3b82f6', width: 2, length: 5 },
  { id: 'crane', name: 'Crane', icon: '🏗️', color: '#ef4444', width: 4, length: 8 },
  { id: 'truck', name: 'Truck', icon: '🚛', color: '#10b981', width: 2.5, length: 7 },
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
  const [workAreaDimensions, setWorkAreaDimensions] = useState<{ area: number; perimeter: number } | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [center.lng, center.lat],
      zoom: 18, // Higher zoom for better detail
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
      defaultMode: 'simple_select',
    });

    map.addControl(draw);
    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add scale control to show distances
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 200 }), 'bottom-left');

    mapRef.current = map;
    drawRef.current = draw;

    map.on('load', () => {
      setMapLoaded(true);
      
      // Load initial work area if provided
      if (initialWorkArea) {
        draw.add(initialWorkArea);
        calculateAreaDimensions(initialWorkArea);
      }

      // Add layer for auto-generated work area
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
          'fill-color': '#f97316',
          'fill-opacity': 0.2
        }
      });

      map.addLayer({
        id: 'auto-work-area-outline',
        type: 'line',
        source: 'auto-work-area',
        paint: {
          'line-color': '#f97316',
          'line-width': 2
        }
      });
    });

    map.on('draw.create', handleDrawUpdate);
    map.on('draw.update', handleDrawUpdate);
    map.on('draw.delete', handleDrawUpdate);

    // Handle equipment placement (only in auto mode)
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
          setEquipment((prev) => [...prev, newEquipment]);
        }
      }
    });

    return () => {
      map.remove();
    };
  }, [center]);

  useEffect(() => {
    if (mapLoaded && initialEquipment.length > 0) {
      initialEquipment.forEach(addEquipmentMarker);
    }
  }, [mapLoaded, initialEquipment]);

  useEffect(() => {
    if (drawMode === 'auto' && equipment.length > 0) {
      generateAutoWorkArea();
    } else if (drawMode === 'manual' && mapRef.current) {
      // Clear auto-generated area when switching to manual
      const source = mapRef.current.getSource('auto-work-area') as maplibregl.GeoJSONSource;
      if (source) {
        source.setData({
          type: 'FeatureCollection',
          features: []
        });
      }
      // Also clear equipment when switching to manual
      clearEquipment();
    }
  }, [equipment, drawMode]);

  const calculateAreaDimensions = (feature: GeoJSON.Feature) => {
    if (feature && feature.geometry && feature.geometry.type === 'Polygon') {
      const area = turf.area(feature);
      const perimeter = turf.length(turf.lineString(feature.geometry.coordinates[0]), { units: 'meters' });
      setWorkAreaDimensions({
        area: Math.round(area * 100) / 100,
        perimeter: Math.round(perimeter * 100) / 100,
      });
    }
  };

  const handleDrawUpdate = () => {
    if (!drawRef.current || drawMode !== 'manual') return;
    
    const data = drawRef.current.getAll();
    const workArea = data.features.length > 0 ? data.features[0] : null;
    
    if (workArea) {
      calculateAreaDimensions(workArea);
    } else {
      setWorkAreaDimensions(null);
    }
    
    updateData();
  };

  const generateAutoWorkArea = () => {
    if (!mapRef.current || equipment.length === 0) return;

    // Create points for all equipment with their sizes
    const equipmentPolygons = equipment.map(eq => {
      const center = turf.point(eq.coordinates);
      // Create a buffer around each equipment based on its size
      const maxDimension = Math.max(eq.width, eq.length);
      const buffer = turf.buffer(center, maxDimension / 2 + 2, { units: 'meters' }); // Add 2m safety margin
      return buffer;
    });

    // Union all equipment buffers to create work area
    let workArea = equipmentPolygons[0];
    for (let i = 1; i < equipmentPolygons.length; i++) {
      workArea = turf.union(workArea, equipmentPolygons[i]) || workArea;
    }

    // Smooth the work area
    const smoothed = turf.simplify(workArea, { tolerance: 0.0001, highQuality: true });

    // Update the map
    const source = mapRef.current.getSource('auto-work-area') as maplibregl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: [smoothed]
      });
    }

    calculateAreaDimensions(smoothed);
    onDataUpdate(smoothed, equipment);
  };

  const addEquipmentMarker = (equipmentItem: Equipment) => {
    if (!mapRef.current) return;

    const el = document.createElement('div');
    el.className = 'equipment-marker';
    el.style.position = 'relative';
    
    // Create equipment visualization with size
    el.innerHTML = `
      <div style="
        background-color: ${equipmentItem.color};
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        cursor: move;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        position: relative;
      ">
        ${equipmentItem.icon}
        <div style="
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.8);
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
          white-space: nowrap;
        ">
          ${equipmentItem.width}m × ${equipmentItem.length}m
        </div>
      </div>
    `;

    const marker = new maplibregl.Marker({ element: el, draggable: true })
      .setLngLat(equipmentItem.coordinates)
      .addTo(mapRef.current);

    markersRef.current.set(equipmentItem.id, marker);

    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      setEquipment((prev) =>
        prev.map((item) =>
          item.id === equipmentItem.id
            ? { ...item, coordinates: [lngLat.lng, lngLat.lat] }
            : item
        )
      );
    });

    // Right-click to remove
    el.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      marker.remove();
      markersRef.current.delete(equipmentItem.id);
      setEquipment((prev) => prev.filter((item) => item.id !== equipmentItem.id));
    });

    // Double-click to rotate
    el.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      setEquipment((prev) =>
        prev.map((item) =>
          item.id === equipmentItem.id
            ? { ...item, rotation: (item.rotation + 45) % 360 }
            : item
        )
      );
    });
  };

  const updateData = () => {
    if (drawMode === 'manual' && drawRef.current) {
      const data = drawRef.current.getAll();
      const workArea = data.features.length > 0 ? data.features[0] : null;
      onDataUpdate(workArea, []);
    } else if (drawMode === 'auto') {
      // Data is updated via generateAutoWorkArea
    }
  };

  const clearEquipment = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current.clear();
    setEquipment([]);
  };

  const clearAll = () => {
    if (drawRef.current) {
      drawRef.current.deleteAll();
    }
    clearEquipment();
    setWorkAreaDimensions(null);
    updateData();
  };

  const handleModeChange = (mode: 'manual' | 'auto') => {
    if (mode !== drawMode) {
      clearAll();
      setDrawMode(mode);
      if (mode === 'manual') {
        setSelectedTool('select');
      }
    }
  };

  return (
    <div className="relative">
      {/* Drawing Mode Toggle */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3" style={{ width: '280px' }}>
        <div className="mb-3">
          <label className="text-sm font-medium text-gray-700">Drawing Mode:</label>
          <div className="mt-2 space-y-2">
            <button
              onClick={() => handleModeChange('manual')}
              className={`w-full px-3 py-2 rounded text-sm font-medium text-left transition-colors ${
                drawMode === 'manual'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="font-medium">Manual Draw</div>
              <div className="text-xs mt-1 opacity-80">Draw work area polygon directly</div>
            </button>
            <button
              onClick={() => handleModeChange('auto')}
              className={`w-full px-3 py-2 rounded text-sm font-medium text-left transition-colors ${
                drawMode === 'auto'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="font-medium">Auto from Equipment</div>
              <div className="text-xs mt-1 opacity-80">Place equipment to generate area</div>
            </button>
          </div>
        </div>

        {/* Equipment Tools - Only show in auto mode */}
        {drawMode === 'auto' && (
          <>
            <div className="border-t pt-3">
              <p className="text-xs font-medium text-gray-500 mb-2">Equipment Tools:</p>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedTool('select')}
                  className={`w-full px-3 py-2 rounded text-sm font-medium text-left transition-colors ${
                    selectedTool === 'select'
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Select / Move
                </button>
                {EQUIPMENT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedTool(type.id)}
                    className={`w-full px-3 py-2 rounded text-sm font-medium text-left flex items-center justify-between transition-colors ${
                      selectedTool === type.id
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="flex items-center">
                      <span className="mr-2">{type.icon}</span>
                      {type.name}
                    </span>
                    <span className="text-xs opacity-75">{type.width}×{type.length}m</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        
        <button
          onClick={clearAll}
          className="w-full mt-3 px-3 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Dimensions Display */}
      {workAreaDimensions && (
        <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-3 mr-12">
          <p className="text-sm font-medium text-gray-700">Work Area:</p>
          <p className="text-xs text-gray-600">Area: {workAreaDimensions.area} m²</p>
          <p className="text-xs text-gray-600">Perimeter: {workAreaDimensions.perimeter} m</p>
        </div>
      )}

      {/* Equipment List - Only show in auto mode */}
      {drawMode === 'auto' && equipment.length > 0 && (
        <div className="absolute bottom-20 right-4 z-10 bg-white rounded-lg shadow-lg p-3 max-h-48 overflow-y-auto">
          <p className="text-sm font-medium text-gray-700 mb-2">Placed Equipment ({equipment.length}):</p>
          <div className="space-y-1">
            {equipment.map((item) => (
              <div key={item.id} className="flex items-center text-xs text-gray-600">
                <span className="mr-2">{item.icon}</span>
                <span>{item.name} ({item.width}×{item.length}m)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4 z-10 bg-white rounded-lg shadow-lg p-3">
        <p className="text-sm text-gray-600">
          {drawMode === 'manual'
            ? 'Click on the map to start drawing a polygon. Click each corner of your work area, then double-click to finish. Use the polygon button in the map controls.'
            : selectedTool === 'select'
              ? 'Click and drag equipment to move. Right-click to remove. Double-click to rotate.'
              : `Click to place ${EQUIPMENT_TYPES.find((t) => t.id === selectedTool)?.name || 'equipment'}. The work area will be automatically generated around all placed equipment.`}
        </p>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-[600px] rounded-lg" />
    </div>
  );
};

export default MapDrawing;