// Sign mapping index for UK traffic signs
// Auto-generated from EPS files in the signs directory

import { signMapping } from './signMapping.js';

// Type definitions
export type SignCode = keyof typeof signMapping;

export interface SignInfo {
  code: string;
  path: string;
  category: string;
}

// Re-export the mapping
export { signMapping };

// Helper function to get sign path by code
export function getSignPath(signCode: string): string | null {
  return signMapping[signCode as SignCode] || null;
}

// Helper function to get full path relative to src
export function getSignFullPath(signCode: string): string | null {
  const relativePath = signMapping[signCode as SignCode];
  if (!relativePath) return null;
  return `/src/assets/signs/${relativePath}`;
}

// Helper function to get sign category from path
export function getSignCategory(signCode: string): string | null {
  const path = signMapping[signCode as SignCode];
  if (!path) return null;
  
  const category = path.split('/')[0];
  return category.replace(/-eps$/, '').replace(/-/g, ' ');
}

// Get all sign codes
export const signCodes = Object.keys(signMapping) as SignCode[];

// Get sign info with category
export function getSignInfo(signCode: string): SignInfo | null {
  const path = signMapping[signCode as SignCode];
  if (!path) return null;
  
  const category = getSignCategory(signCode);
  return {
    code: signCode,
    path: path,
    category: category || 'unknown'
  };
}

// Group signs by category
export function getSignsByCategory(): Record<string, SignCode[]> {
  const categories: Record<string, SignCode[]> = {};
  
  signCodes.forEach((code) => {
    const category = getSignCategory(code) || 'unknown';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(code);
  });
  
  return categories;
}

// Search signs by code (supports partial matching)
export function searchSignsByCode(searchTerm: string): SignCode[] {
  const term = searchTerm.toLowerCase();
  return signCodes.filter(code => code.toLowerCase().includes(term));
}

// Known duplicate signs (for reference)
export const duplicateSigns: Record<string, string[]> = {
  "512": ["speed-limit-signs-eps", "warning-signs-eps"],
  "516": ["traffic-calming-eps", "warning-signs-eps"],
  "517": ["traffic-calming-eps", "warning-signs-eps"],
  "544": ["traffic-calming-eps", "warning-signs-eps"],
  "562": ["miscellaneous-eps", "warning-signs-eps"],
  "570": ["on-street-parking-eps", "warning-signs-eps"],
  "572": ["road-works-and-temporary-eps 2", "warning-signs-eps"],
  "615": ["regulatory-signs-eps", "traffic-calming-eps"],
  "645": ["on-street-parking-eps", "road-works-and-temporary-eps 2", "speed-limit-signs-eps"],
  "665": ["low-bridge-signs-eps", "on-street-parking-eps", "regulatory-signs-eps"],
  "666": ["low-bridge-signs-eps", "on-street-parking-eps", "regulatory-signs-eps"],
  "674": ["speed-limit-signs-eps", "traffic-calming-eps"],
  "774": ["level-crossing-signs-eps", "tram-signs-eps"],
  "775": ["level-crossing-signs-eps", "tram-signs-eps"],
  "801": ["information-signs-eps", "on-street-parking-eps"],
  "2901": ["motorway-signs-eps", "speed-limit-signs-eps"],
  "7001": ["road-works-and-temporary-eps 2", "speed-limit-signs-eps"],
  "530A": ["low-bridge-signs-eps", "on-street-parking-eps", "regulatory-signs-eps"],
  "626.2A+627.1": ["low-bridge-signs-eps", "on-street-parking-eps", "regulatory-signs-eps"],
  "626.2AV2": ["low-bridge-signs-eps", "on-street-parking-eps", "regulatory-signs-eps"],
  "626.2AV6+627.1": ["low-bridge-signs-eps", "on-street-parking-eps", "regulatory-signs-eps"],
  "640.2A": ["low-bridge-signs-eps", "on-street-parking-eps", "regulatory-signs-eps"],
  "665V": ["low-bridge-signs-eps", "on-street-parking-eps", "regulatory-signs-eps"],
  "666V": ["low-bridge-signs-eps", "on-street-parking-eps", "regulatory-signs-eps"],
  "818.4": ["on-street-parking-eps", "regulatory-signs-eps"],
  "954.3": ["bus-and-cycle-signs-eps", "regulatory-signs-eps"],
  "2402.1+670V30": ["speed-limit-signs-eps", "traffic-calming-eps"],
  "615.1": ["regulatory-signs-eps", "traffic-calming-eps"],
  "953.2": ["bus-and-cycle-signs-eps", "tram-signs-eps"],
  "512.1": ["speed-limit-signs-eps", "warning-signs-eps"],
  "517L": ["traffic-calming-eps", "warning-signs-eps"]
};

// Example usage in a React component:
/*
import { getSignPath, getSignInfo, searchSignsByCode } from '@/assets/signs';

// Get a specific sign
const sign501Path = getSignPath('501');

// Search for signs
const speedSigns = searchSignsByCode('670'); // Returns ["670", "670V20", "670V30", etc.]

// Get sign info
const signInfo = getSignInfo('501');
// Returns: { code: "501", path: "warning-signs-eps/501.eps", category: "warning signs" }
*/