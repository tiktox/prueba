import React, { useState, useEffect } from 'react';
import PinGrid from '../components/pins/PinGrid';
import { PinProps } from '../components/pins/Pin';

// Reuse mock data from HomePage
const mockPins: PinProps[] = [
  {
    id: '1',
    title: 'Modern Living Room Design',
    description: 'Minimalist approach with neutral colors and clean lines',
    imageUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    createdBy: {
      id: '101',
      name: 'Jane Smith',
      avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg',
    },
    savedCount: 245,
    commentCount: 32,
    tags: ['interior', 'design', 'minimalist'],
  },
  {
    id: '2',
    title: 'Summer Fashion 2023',
    description: 'Trendy outfits for the summer season',
    imageUrl: 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg',
    createdBy: {
      id: '102',
      name: 'Alex Johnson',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    },
    savedCount: 189,
    commentCount: 14,
    tags: ['fashion', 'summer', 'style'],
  },
  {
    id: '3',
    title: 'Healthy Breakfast Ideas',
    description: 'Start your day right with these nutritious options',
    imageUrl: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg',
    createdBy: {
      id: '103',
      name: 'Chris Williams',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    },
    savedCount: 320,
    commentCount: 41,
    tags: ['food', 'healthy', 'breakfast'],
  },
  {
    id: '4',
    title: 'DIY Home Decor',
    description: 'Easy and affordable home decoration projects',
    imageUrl: 'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg',
    createdBy: {
      id: '104',
      name: 'Sam Taylor',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    },
    savedCount: 178,
    commentCount: 23,
    tags: ['DIY', 'decor', 'crafts'],
  },
  {
    id: '5',
    title: 'Travel Photography Tips',
    description: 'Capture amazing memories during your travels',
    imageUrl: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg',
    createdBy: {
      id: '105',
      name: 'Jordan Lee',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    },
    savedCount: 401,
    commentCount: 56,
    tags: ['photography', 'travel', 'tips'],
  },
];

// Categories for the Explore page
const exploreCategories = [
  { id: 'trending', name: 'Trending', icon: '🔥' },
  { id: 'home', name: 'Home', icon: '🏠' },
  { id: 'fashion', name: 'Fashion', icon: '👗' },
  { id: 'food', name: 'Food', icon: '🍲' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'art', name: 'Art', icon: '🎨' },
  { id: 'photography', name: 'Photography', icon: '📷' },
  { id: 'diy', name: 'DIY & Crafts', icon: '🔨' },
  { id: 'beauty', name: 'Beauty', icon: '💄' },
  { id: 'health', name: 'Health & Fitness', icon: '💪' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'education', name: 'Education', icon: '📚' },
];

const ExplorePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('trending');
  const [pins, setPins] = useState<PinProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPins = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, you would fetch pins based on the selected category
        // For this demo, we'll use the same pins for all categories, but shuffle them
        const shuffledPins = [...mockPins].sort(() => Math.random() - 0.5);
        setPins(shuffledPins);
      } catch (error) {
        console.error('Error loading pins:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPins();
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Explore</h1>
      
      {/* Categories grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        {exploreCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`p-4 rounded-lg text-center transition-all ${
              selectedCategory === category.id
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            <div className="text-2xl mb-2">{category.icon}</div>
            <div className="font-medium text-sm">{category.name}</div>
          </button>
        ))}
      </div>
      
      {/* Category title */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {exploreCategories.find(c => c.id === selectedCategory)?.name || 'Explore'} ideas
        </h2>
      </div>
      
      {/* Pins grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <PinGrid pins={pins} />
      )}
    </div>
  );
};

export default ExplorePage;