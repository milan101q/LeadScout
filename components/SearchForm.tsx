import React, { useState } from 'react';
import { SearchCriteria, SearchStatus } from '../types';
import { Search, Loader2, Settings2, Map, Star, Hash } from 'lucide-react';

interface SearchFormProps {
  onSearch: (criteria: SearchCriteria) => void;
  status: SearchStatus;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, status }) => {
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState(10);
  const [minReviews, setMinReviews] = useState<number | ''>('');
  const [maxDistance, setMaxDistance] = useState('');
  const [ratingThreshold, setRatingThreshold] = useState(4.0);
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;

    onSearch({
      location,
      quantity,
      minReviews: minReviews === '' ? 0 : Number(minReviews),
      maxDistance: maxDistance || undefined,
      ratingThreshold,
    });
  };

  const isLoading = status === SearchStatus.LOADING;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Inputs */}
          <div className="md:col-span-8 space-y-2">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Target Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Map className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="location"
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm transition-colors"
                placeholder="e.g. Downtown Los Angeles, NY 10001"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="md:col-span-4 space-y-2">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Leads Quantity
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="quantity"
                min={1}
                max={50}
                required
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Filters Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <Settings2 className="w-4 h-4 mr-1.5" />
            {showFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 animate-fadeIn">
            <div className="space-y-2">
              <label htmlFor="minReviews" className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                Min Reviews
              </label>
              <input
                type="number"
                id="minReviews"
                min={0}
                placeholder="0"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={minReviews}
                onChange={(e) => setMinReviews(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="maxDistance" className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                Radius / Distance
              </label>
              <input
                type="text"
                id="maxDistance"
                placeholder="e.g. 5 miles"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="rating" className="block text-xs font-medium text-gray-500 uppercase tracking-wider">
                Max Rating ({ratingThreshold})
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  id="rating"
                  min="1"
                  max="5"
                  step="0.1"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  value={ratingThreshold}
                  onChange={(e) => setRatingThreshold(Number(e.target.value))}
                />
                <div className="flex items-center justify-center w-12 h-8 bg-gray-100 rounded text-sm font-semibold text-gray-700">
                  {ratingThreshold}
                  <Star className="w-3 h-3 ml-0.5 text-yellow-500 fill-yellow-500" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white
              ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}
              transition-all duration-200
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Scraping Google Maps...
              </>
            ) : (
              <>
                <Search className="-ml-1 mr-2 h-5 w-5" />
                Find Leads
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};