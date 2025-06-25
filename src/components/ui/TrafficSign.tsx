import React from 'react';
import { getSignPath, getSignFullPath } from '@/assets/signs';

interface TrafficSignProps {
  signCode: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  alt?: string;
  onClick?: () => void;
}

/**
 * Component to display UK traffic signs
 * Note: EPS files cannot be directly displayed in browsers.
 * You'll need to either:
 * 1. Convert EPS files to SVG/PNG format
 * 2. Use a server-side conversion service
 * 3. Pre-convert all signs to web-friendly formats
 */
export const TrafficSign: React.FC<TrafficSignProps> = ({
  signCode,
  width = 100,
  height = 100,
  className = '',
  alt,
  onClick
}) => {
  const signPath = getSignPath(signCode);
  
  if (!signPath) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 text-gray-600 ${className}`}
        style={{ width, height }}
      >
        <span className="text-sm">Sign {signCode} not found</span>
      </div>
    );
  }

  // For now, showing a placeholder since EPS files can't be displayed directly
  // In production, replace with converted PNG/SVG paths
  const webPath = signPath.replace('.eps', '.png').replace('.EPS', '.png');
  
  return (
    <div 
      className={`traffic-sign ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Placeholder implementation - replace with actual image once converted */}
      <div 
        className="flex flex-col items-center justify-center bg-gray-100 border-2 border-gray-300 rounded"
        style={{ width, height }}
      >
        <span className="text-xs text-gray-600 mb-1">Sign Code:</span>
        <span className="font-bold text-lg">{signCode}</span>
        <span className="text-xs text-gray-500 mt-2 text-center px-2">
          {signPath.split('/')[0].replace(/-eps$/, '')}
        </span>
      </div>
      
      {/* This is how it would work with converted images:
      <img 
        src={`/assets/signs/${webPath}`}
        alt={alt || `UK Traffic Sign ${signCode}`}
        width={width}
        height={height}
        className={className}
      />
      */}
    </div>
  );
};

// Example usage component
export const TrafficSignExample: React.FC = () => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Traffic Sign Examples</h3>
      <div className="grid grid-cols-4 gap-4">
        <TrafficSign signCode="501" alt="Road narrows on both sides" />
        <TrafficSign signCode="670V30" alt="30 mph speed limit" />
        <TrafficSign signCode="7001" alt="Road works ahead" />
        <TrafficSign signCode="954" alt="Cycle lane" />
      </div>
    </div>
  );
};