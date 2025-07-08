import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import AppLayout from '../components/Layout/AppLayout';
import Button from '../components/ui/Button';
import { TrafficSign } from '../components/ui/TrafficSign';
import { jpgSignMapping } from '../assets/signs/jpgSignMapping';
import 'maplibre-gl/dist/maplibre-gl.css';

// Mock GeoJSON data for traffic management features
const mockTrafficFeatures = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: {
        id: "sign-1",
        type: "traffic_sign",
        signCode: "7001",
        name: "Road Works",
        status: "active",
        installation_date: "2025-06-20"
      },
      geometry: {
        type: "Point" as const,
        coordinates: [-0.1276, 51.5074] // London coordinates
      }
    },
    {
      type: "Feature" as const,
      properties: {
        id: "sign-2", 
        type: "traffic_sign",
        signCode: "670V30",
        name: "30 mph Speed Limit",
        status: "active",
        installation_date: "2025-06-18"
      },
      geometry: {
        type: "Point" as const,
        coordinates: [-0.1376, 51.5174]
      }
    },
    {
      type: "Feature" as const,
      properties: {
        id: "sign-3",
        type: "traffic_sign", 
        signCode: "516",
        name: "Road Narrows",
        status: "pending",
        installation_date: "2025-06-22"
      },
      geometry: {
        type: "Point" as const,
        coordinates: [-0.1176, 51.4974]
      }
    },
    {
      type: "Feature" as const,
      properties: {
        id: "sign-4",
        type: "traffic_sign",
        signCode: "610",
        name: "Keep Left",
        status: "active", 
        installation_date: "2025-06-15"
      },
      geometry: {
        type: "Point" as const,
        coordinates: [-0.1476, 51.5274]
      }
    },
    {
      type: "Feature" as const,
      properties: {
        id: "sign-5",
        type: "traffic_sign",
        signCode: "954",
        name: "Cycle Lane",
        status: "active",
        installation_date: "2025-06-19"
      },
      geometry: {
        type: "Point" as const,
        coordinates: [-0.1226, 51.5124]
      }
    },
    {
      type: "Feature" as const,
      properties: {
        id: "sign-6",
        type: "traffic_sign",
        signCode: "615",
        name: "No Vehicles",
        status: "pending",
        installation_date: "2025-06-25"
      },
      geometry: {
        type: "Point" as const,
        coordinates: [-0.1326, 51.5024]
      }
    },
    {
      type: "Feature" as const,
      properties: {
        id: "area-1",
        type: "work_area",
        name: "Construction Zone",
        status: "active",
        start_date: "2025-06-20",
        end_date: "2025-08-15"
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [-0.1326, 51.5124],
          [-0.1226, 51.5124], 
          [-0.1226, 51.5024],
          [-0.1326, 51.5024],
          [-0.1326, 51.5124]
        ]]
      }
    }
  ]
};

interface SelectedFeature {
  id: string;
  type: string;
  properties: Record<string, string | number | boolean>;
}

const ReviewPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm'
          }
        ]
      },
      center: [-0.1276, 51.5074], // London center
      zoom: 14
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Add traffic management features source
      map.current.addSource('traffic-features', {
        type: 'geojson',
        data: mockTrafficFeatures
      });

      // Add work area polygons
      map.current.addLayer({
        id: 'work-areas',
        type: 'fill',
        source: 'traffic-features',
        filter: ['==', ['get', 'type'], 'work_area'],
        paint: {
          'fill-color': '#FCD34D',
          'fill-opacity': 0.3
        }
      });

      // Add work area borders
      map.current.addLayer({
        id: 'work-area-borders',
        type: 'line',
        source: 'traffic-features',
        filter: ['==', ['get', 'type'], 'work_area'],
        paint: {
          'line-color': '#F59E0B',
          'line-width': 2,
          'line-dasharray': [2, 2]
        }
      });

      // Add traffic signs as custom HTML markers with actual sign images
      const signFeatures = mockTrafficFeatures.features.filter(
        feature => feature.properties.type === 'traffic_sign'
      );

      signFeatures.forEach(feature => {
        if (feature.geometry.type === 'Point') {
          const signCode = feature.properties.signCode;
          const signPath = jpgSignMapping[signCode];
          
          // Create a custom marker element
          const el = document.createElement('div');
          el.className = 'traffic-sign-marker';
          el.style.width = '50px';
          el.style.height = '50px';
          el.style.cursor = 'pointer';
          el.style.position = 'relative';
          
          // Add the sign image
          const img = document.createElement('img');
          img.src = signPath || '/placeholder-sign.png';
          img.alt = `Traffic sign ${signCode}`;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'contain';
          img.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))';
          
          // Add status indicator
          const statusIndicator = document.createElement('div');
          statusIndicator.style.position = 'absolute';
          statusIndicator.style.bottom = '-4px';
          statusIndicator.style.right = '-4px';
          statusIndicator.style.width = '12px';
          statusIndicator.style.height = '12px';
          statusIndicator.style.borderRadius = '50%';
          statusIndicator.style.border = '2px solid white';
          statusIndicator.style.backgroundColor = feature.properties.status === 'active' 
            ? '#10B981' 
            : feature.properties.status === 'pending' 
            ? '#F59E0B' 
            : '#EF4444';
          
          el.appendChild(img);
          el.appendChild(statusIndicator);
          
          // Add click handler
          el.addEventListener('click', () => {
            setSelectedFeature({
              id: feature.properties.id,
              type: feature.properties.type,
              properties: feature.properties
            });
          });
          
          // Add the marker to the map
          new maplibregl.Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .addTo(map.current!);
        }
      });

      // Add click handler for work areas only

      map.current.on('click', 'work-areas', (e) => {
        if (e.features && e.features[0]) {
          const feature = e.features[0];
          setSelectedFeature({
            id: feature.properties?.id || '',
            type: feature.properties?.type || '',
            properties: feature.properties || {}
          });
        }
      });

      // Change cursor on hover for work areas

      map.current.on('mouseenter', 'work-areas', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'work-areas', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });

      setIsLoading(false);
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const renderSignPreview = (signCode: string) => {
    return <TrafficSign signCode={signCode} width={64} height={64} />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short', 
      year: 'numeric'
    });
  };

  return (
    <AppLayout
      title="Traffic Management Review"
      subtitle="Review and manage traffic control features for this plan"
    >
      <div className="flex-1 flex overflow-hidden">
        {/* Map Container */}
        <div className="flex-1 relative">
          <div ref={mapContainer} className="w-full h-full" />
          
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading map...</p>
              </div>
            </div>
          )}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => {
                if (map.current) {
                  map.current.fitBounds([
                    [-0.1576, 51.4874],
                    [-0.1076, 51.5374]
                  ], { padding: 50 });
                }
              }}
            >
              Fit to Features
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Plan Details</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Plan ID: TMG-2025-001</p>
              <p>Created: {formatDate('2025-06-20')}</p>
              <p>Status: <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span></p>
            </div>
          </div>

          {/* Feature List */}
          <div className="flex-1 overflow-y-auto p-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Features ({mockTrafficFeatures.features.length})</h4>
            
            <div className="space-y-3">
              {mockTrafficFeatures.features.map((feature) => (
                <div 
                  key={feature.properties.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedFeature?.id === feature.properties.id 
                      ? 'border-blue-300 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedFeature({
                    id: feature.properties.id,
                    type: feature.properties.type,
                    properties: feature.properties
                  })}
                >
                  <div className="flex items-start gap-3">
                    {feature.properties.type === 'traffic_sign' ? (
                      renderSignPreview(feature.properties.signCode)
                    ) : (
                      <div className="w-16 h-16 bg-amber-100 border-2 border-amber-300 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-medium text-gray-900 truncate">
                        {feature.properties.name}
                      </h5>
                      <p className="text-xs text-gray-500 mt-1">
                        {feature.properties.type === 'traffic_sign' 
                          ? `Code: ${feature.properties.signCode}`
                          : `Area: ${feature.properties.type.replace('_', ' ')}`
                        }
                      </p>
                      <div className="flex items-center mt-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          feature.properties.status === 'active' 
                            ? 'bg-green-100 text-green-700'
                            : feature.properties.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {feature.properties.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Feature Details */}
          {selectedFeature && (
            <div className="border-t border-gray-200 p-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Feature Details</h4>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Name:</span>
                  <p className="text-sm text-gray-600 mt-1">{selectedFeature.properties.name}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">Type:</span>
                  <p className="text-sm text-gray-600 mt-1 capitalize">
                    {selectedFeature.type.replace('_', ' ')}
                  </p>
                </div>

                {selectedFeature.properties.signCode && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Sign Code:</span>
                    <p className="text-sm text-gray-600 mt-1">{selectedFeature.properties.signCode}</p>
                  </div>
                )}

                <div>
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <p className="text-sm text-gray-600 mt-1 capitalize">{selectedFeature.properties.status}</p>
                </div>

                {selectedFeature.properties.installation_date && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Installation Date:</span>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(selectedFeature.properties.installation_date)}
                    </p>
                  </div>
                )}

                {selectedFeature.properties.start_date && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Duration:</span>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(selectedFeature.properties.start_date)} - {formatDate(selectedFeature.properties.end_date)}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <Button variant="brand" size="sm" className="w-full">
                  Edit Feature
                </Button>
                <Button variant="secondary" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ReviewPage;