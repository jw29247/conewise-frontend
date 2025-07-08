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

    });

    map.on('draw.create', handleDrawUpdate);
    map.on('draw.update', handleDrawUpdate);
    map.on('draw.delete', handleDrawUpdate);


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
      // Clear any auto-generated features from draw when switching to manual
      if (drawRef.current) {
        drawRef.current.deleteAll();
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
  
  // Handle map clicks for equipment placement
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const handleMapClick = (e: any) => {
      console.log('Map clicked:', { drawMode, selectedTool, coordinates: [e.lngLat.lng, e.lngLat.lat] });
      if (drawMode === 'auto' && selectedTool !== 'select' && EQUIPMENT_TYPES.find(t => t.id === selectedTool)) {
        console.log('Click conditions met, adding equipment');
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
          
          console.log('Adding new equipment:', newEquipment);
          addEquipmentMarker(newEquipment);
          if (mountedRef.current) {
            setEquipment((prev) => {
              const updated = [...prev, newEquipment];
              console.log('Updated equipment array:', updated);
              return updated;
            });
          }
        }
      }
    };

    mapRef.current.on('click', handleMapClick);
    
    return () => {
      if (mapRef.current) {
        mapRef.current.off('click', handleMapClick);
      }
    };
  }, [mapLoaded, drawMode, selectedTool]);

  // Separate effect for equipment changes in auto mode
  useEffect(() => {
    console.log('Equipment useEffect triggered:', { mapLoaded, drawMode, equipmentCount: equipment.length });
    if (!mapLoaded || !mapRef.current || drawMode !== 'auto') {
      console.log('Skipping equipment update:', { mapLoaded, drawMode });
      return;
    }
    
    console.log('Updating equipment rectangles and work area');
    updateEquipmentRectangles();
    generateAutoWorkArea();
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
        background: rgba(31, 41, 55, 0.95);
        color: #ffffff;
        padding: 3px 6px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 500;
        font-family: system-ui, -apple-system, sans-serif;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
        white-space: nowrap;
        z-index: 10;
        backdrop-filter: blur(4px);
        transition: all 0.2s ease;
        transform: translate(-50%, -50%);
      `;
      
      // Add subtle hover effect without changing position
      el.addEventListener('mouseenter', () => {
        el.style.backgroundColor = 'rgba(245, 158, 11, 0.95)';
        el.style.boxShadow = '0 2px 6px rgba(245, 158, 11, 0.4)';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.backgroundColor = 'rgba(31, 41, 55, 0.95)';
        el.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.3)';
      });

      // Create clean distance display with proper formatting
      const distanceText = length >= 1000 
        ? `${(length / 1000).toFixed(2)}km`
        : length >= 100 
          ? `${Math.round(length)}m`
          : `${length.toFixed(1)}m`;
      
      el.innerHTML = distanceText;

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

  const createEquipmentRectangle = (equipmentItem: Equipment) => {
    const { coordinates, width, length, rotation, color } = equipmentItem;
    
    // Convert meters to approximate degrees (rough approximation)
    const metersToLng = width / 111320;
    const metersToLat = length / 110540;
    
    // Create rectangle corners
    const halfWidth = metersToLng / 2;
    const halfLength = metersToLat / 2;
    
    const corners = [
      [-halfWidth, -halfLength],
      [halfWidth, -halfLength],
      [halfWidth, halfLength],
      [-halfWidth, halfLength],
      [-halfWidth, -halfLength]
    ];
    
    // Apply rotation if needed (for future use)
    const rotatedCorners = corners.map(([x, y]) => [
      coordinates[0] + x,
      coordinates[1] + y
    ]);
    
    return {
      type: 'Feature' as const,
      properties: {
        id: equipmentItem.id,
        color: color,
        name: equipmentItem.name,
        dimensions: `${width}m × ${length}m`
      },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [rotatedCorners]
      }
    };
  };

  const updateEquipmentRectangles = () => {
    if (!drawRef.current || !mapLoaded) {
      console.log('Cannot update equipment rectangles - missing refs');
      return;
    }
    
    console.log('Creating rectangles for equipment:', equipment);
    const rectangleFeatures = equipment.map(createEquipmentRectangle);
    console.log('Created rectangle features:', rectangleFeatures);
    
    // Clear existing equipment rectangles from draw
    const allFeatures = drawRef.current.getAll();
    console.log('All current draw features:', allFeatures);
    const nonEquipmentFeatures = allFeatures.features.filter(
      feature => !feature.properties?.isEquipment
    );
    console.log('Non-equipment features:', nonEquipmentFeatures);
    
    // Set all features (non-equipment + new equipment rectangles)
    const newRectanglesWithProperties = rectangleFeatures.map(rect => ({
      ...rect,
      properties: {
        ...rect.properties,
        isEquipment: true
      }
    }));
    
    const finalFeatures = [...nonEquipmentFeatures, ...newRectanglesWithProperties];
    console.log('Setting draw features to:', finalFeatures);
    
    drawRef.current.set({
      type: 'FeatureCollection',
      features: finalFeatures
    });
  };

  const generateAutoWorkArea = () => {
    if (!drawRef.current || !mapLoaded) return;
    
    if (equipment.length === 0) {
      // Clear work area if no equipment - just keep equipment rectangles
      const allFeatures = drawRef.current.getAll();
      const equipmentFeatures = allFeatures.features.filter(
        feature => feature.properties?.isEquipment
      );
      
      drawRef.current.set({
        type: 'FeatureCollection',
        features: equipmentFeatures
      });
      
      // Clear dimension labels
      dimensionLabelsRef.current.forEach(marker => marker.remove());
      dimensionLabelsRef.current = [];
      
      return;
    }

    // Get all equipment rectangles
    const rectangles = equipment.map(createEquipmentRectangle);
    
    // Find bounding box of all equipment
    let minLng = Infinity, maxLng = -Infinity;
    let minLat = Infinity, maxLat = -Infinity;
    
    rectangles.forEach(rect => {
      const coords = rect.geometry.coordinates[0];
      coords.forEach(([lng, lat]) => {
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
      });
    });
    
    // Add buffer around equipment (approximately 3 meters)
    const bufferLng = 3 / 111320;
    const bufferLat = 3 / 110540;
    
    const workAreaPolygon = {
      type: 'Feature' as const,
      properties: {
        isWorkArea: true
      },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [minLng - bufferLng, minLat - bufferLat],
          [maxLng + bufferLng, minLat - bufferLat],
          [maxLng + bufferLng, maxLat + bufferLat],
          [minLng - bufferLng, maxLat + bufferLat],
          [minLng - bufferLng, minLat - bufferLat]
        ]]
      }
    };


    // Get current equipment rectangles and add work area
    const allFeatures = drawRef.current.getAll();
    const equipmentFeatures = allFeatures.features.filter(
      feature => feature.properties?.isEquipment
    );
    
    drawRef.current.set({
      type: 'FeatureCollection',
      features: [...equipmentFeatures, workAreaPolygon]
    });

    // Update parent component with the generated work area
    if (mountedRef.current) {
      onDataUpdate(workAreaPolygon, equipment);
    }
    
    // Add dimension labels to the auto-generated work area
    addDimensionLabels(workAreaPolygon);
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
                ? '💡 Click and drag equipment rectangles to move. Right-click to remove. Each piece of equipment is shown as a colored rectangle with its actual dimensions.'
                : `💡 Click to place ${EQUIPMENT_TYPES.find((t) => t.id === selectedTool)?.name || 'equipment'}. You'll see a colored rectangle showing the actual equipment size. The work area will be automatically generated with buffer space.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapDrawing;