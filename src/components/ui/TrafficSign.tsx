import React from 'react';
import { jpgSignMapping } from '../../assets/signs/jpgSignMapping';

interface TrafficSignProps {
  signCode: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  onClick?: () => void;
}

/**
 * Component to display UK traffic signs
 * Uses JPG images from the public/signs directory
 */
export const TrafficSign: React.FC<TrafficSignProps> = ({
  signCode,
  width = 100,
  height = 100,
  className = '',
  onClick
}) => {
  const signPath = jpgSignMapping[signCode];
  
  if (!signPath) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-200 text-gray-600 rounded ${className}`}
        style={{ width, height }}
        onClick={onClick}
      >
        <div className="text-center">
          <span className="text-xs block">Sign not found</span>
          <span className="text-sm font-semibold">{signCode}</span>
        </div>
      </div>
    );
  }
  
  return (
    <img 
      src={signPath}
      alt={`UK Traffic Sign ${signCode}`}
      width={width}
      height={height}
      className={`object-contain ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onError={(e) => {
        // Replace broken image with placeholder
        const target = e.target as HTMLImageElement;
        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f3f4f6"/%3E%3Ctext x="50" y="45" text-anchor="middle" font-family="Arial" font-size="14" fill="%236b7280"%3E%3C/text%3E%3Ctext x="50" y="60" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="%23374151"%3E' + signCode + '%3C/text%3E%3C/svg%3E';
      }}
    />
  );
};

// Example usage component
export const TrafficSignExample: React.FC = () => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Traffic Sign Examples</h3>
      <div className="grid grid-cols-4 gap-4">
        <TrafficSign signCode="501" />
        <TrafficSign signCode="670V30" />
        <TrafficSign signCode="7001" />
        <TrafficSign signCode="954" />
      </div>
    </div>
  );
};