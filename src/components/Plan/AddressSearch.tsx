import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface AddressSearchProps {
  onAddressSelect: (address: string, coordinates: { lat: number; lng: number }) => void;
  initialAddress?: string;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}

const AddressSearch: React.FC<AddressSearchProps> = ({ onAddressSelect, initialAddress = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialAddress);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  // Using Nominatim API for address search (free alternative to Google Maps)
  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&limit=5&countrycodes=gb`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching address:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((query: string) => searchAddress(query), 500),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleResultSelect = (result: SearchResult) => {
    setSelectedResult(result);
    setSearchQuery(result.display_name);
    setSearchResults([]);
  };

  const handleConfirmLocation = () => {
    if (selectedResult) {
      onAddressSelect(selectedResult.display_name, {
        lat: parseFloat(selectedResult.lat),
        lng: parseFloat(selectedResult.lon),
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-light text-gray-900 mb-6">Search for Work Location</h2>
      
      <div className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Enter street address, postcode, or location name"
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
            <ul className="max-h-60 overflow-auto">
              {searchResults.map((result) => (
                <li
                  key={result.place_id}
                  onClick={() => handleResultSelect(result)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start transition-colors"
                >
                  <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{result.display_name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isSearching && (
          <div className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500"></div>
              <p className="text-sm text-gray-500 ml-3">Searching...</p>
            </div>
          </div>
        )}
      </div>

      {selectedResult && (
        <div className="mt-6 p-6 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200">
          <p className="text-sm font-medium text-gray-900 mb-2">Selected Location:</p>
          <p className="text-sm text-gray-700 flex items-start">
            <MapPinIcon className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
            {selectedResult.display_name}
          </p>
          <div className="mt-4">
            <Button 
              onClick={handleConfirmLocation} 
              variant="brand"
              size="lg"
              className="w-full"
            >
              Confirm Location and Continue
            </Button>
          </div>
        </div>
      )}

      {!selectedResult && searchQuery && !isSearching && searchResults.length === 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600 text-center">
            No results found. Try searching for a different address or postcode.
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressSearch;