import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PinGrid from '../components/pins/PinGrid';
import { PinProps } from '../components/pins/Pin';
import { Search } from 'lucide-react';

// Import mock data from HomePage
import { mockPins } from './HomePage';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [pins, setPins] = useState<PinProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const searchPins = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, you would search Firebase for pins
        // For this demo, we'll filter the mock data
        if (query) {
          const lowerQuery = query.toLowerCase();
          const filteredPins = mockPins.filter(pin => {
            return (
              pin.title.toLowerCase().includes(lowerQuery) ||
              (pin.description && pin.description.toLowerCase().includes(lowerQuery)) ||
              (pin.tags && pin.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
            );
          });
          setPins(filteredPins);
        } else {
          setPins([]);
        }
      } catch (error) {
        console.error('Error searching pins:', error);
      } finally {
        setLoading(false);
      }
    };
    
    searchPins();
  }, [query]);

  // Filter functions for different categories
  const filterPins = (filter: string) => {
    setActiveFilter(filter);
    
    if (filter === 'all') {
      // No additional filtering
      return;
    }
    
    // For this demo, we'll simulate filtering by categories
    // In a real app, you would implement proper filtering logic
    const shuffled = [...pins].sort(() => Math.random() - 0.5);
    const reducedPins = shuffled.slice(0, Math.floor(pins.length * 0.7));
    setPins(reducedPins);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Search header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {query ? `Search results for "${query}"` : 'Search'}
        </h1>
        {pins.length > 0 && (
          <p className="text-gray-600">
            Found {pins.length} {pins.length === 1 ? 'result' : 'results'}
          </p>
        )}
      </div>
      
      {/* Filter categories */}
      {pins.length > 0 && (
        <div className="flex mb-6 overflow-x-auto pb-2">
          <div className="flex space-x-2">
            {['all', 'pins', 'people', 'boards'].map((filter) => (
              <button
                key={filter}
                onClick={() => filterPins(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  filter === activeFilter 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : pins.length > 0 ? (
        <PinGrid pins={pins} />
      ) : (
        <div className="text-center py-16">
          <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-gray-100 mb-6">
            <Search size={32} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            {query ? `No results found for "${query}"` : 'Search for ideas'}
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            {query 
              ? 'Try checking your spelling or using different keywords.' 
              : 'Type in the search bar to find pins, people, and boards.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;