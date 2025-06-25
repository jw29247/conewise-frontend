import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import Input from '../ui/Input';
import Button from '../ui/Button';

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
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-light text-gray-900">Search for Work Location</h2>
          <p className="text-sm text-gray-500 mt-1">Enter the address where traffic management is needed</p>
        </div>
      </div>
      
      <div className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Enter street address, postcode, or location name"
            className="pl-10"
          />
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-2 w-full bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden">
            <ul className="max-h-60 overflow-auto">
              {searchResults.map((result) => (
                <li
                  key={result.place_id}
                  onClick={() => handleResultSelect(result)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm text-gray-700">{result.display_name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isSearching && (
          <div className="absolute z-10 mt-2 w-full bg-white shadow-xl rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-sm text-gray-500">Searching locations...</p>
            </div>
          </div>
        )}
      </div>

      {selectedResult && (
        <div className="mt-6 p-6 bg-gradient-to-br from-amber-50 to-green-50 rounded-xl border border-amber-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">Selected Location</p>
              <p className="text-sm text-gray-600">
                {selectedResult.display_name}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Button onClick={handleConfirmLocation} variant="brand" className="w-full">
              Confirm Location and Continue
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
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