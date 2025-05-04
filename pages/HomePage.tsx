import React, { useState, useEffect } from 'react';
import PinGrid from '../components/pins/PinGrid';
import { PinProps } from '../components/pins/Pin';

// Mock data for demonstration
export const mockPins: PinProps[] = [
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
  {
    id: '6',
    title: 'Urban Gardening',
    description: 'Growing plants in limited spaces',
    imageUrl: 'https://images.pexels.com/photos/4505170/pexels-photo-4505170.jpeg',
    createdBy: {
      id: '106',
      name: 'Morgan Chen',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    },
    savedCount: 215,
    commentCount: 29,
    tags: ['gardening', 'urban', 'plants'],
  },
  {
    id: '7',
    title: 'Home Office Setup',
    description: 'Create a productive workspace at home',
    imageUrl: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg',
    createdBy: {
      id: '107',
      name: 'Taylor Wong',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    },
    savedCount: 287,
    commentCount: 34,
    tags: ['office', 'productivity', 'workspace'],
  },
  {
    id: '8',
    title: 'Watercolor Painting Techniques',
    description: 'Learn the basics of watercolor painting',
    imageUrl: 'https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg',
    createdBy: {
      id: '108',
      name: 'Jamie Rivera',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    },
    savedCount: 176,
    commentCount: 19,
    tags: ['art', 'painting', 'watercolor'],
  },
  {
    id: '9',
    title: 'Minimal Wardrobe Essentials',
    description: 'Build a versatile capsule wardrobe',
    imageUrl: 'https://images.pexels.com/photos/5705496/pexels-photo-5705496.jpeg',
    createdBy: {
      id: '109',
      name: 'Robin Silva',
      avatar: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg',
    },
    savedCount: 312,
    commentCount: 37,
    tags: ['fashion', 'minimalism', 'style'],
  },
  {
    id: '10',
    title: 'Indoor Plants for Beginners',
    description: 'Easy-to-care plants for your home',
    imageUrl: 'https://images.pexels.com/photos/1084188/pexels-photo-1084188.jpeg',
    createdBy: {
      id: '110',
      name: 'Drew Morgan',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    },
    savedCount: 254,
    commentCount: 42,
    tags: ['plants', 'home', 'gardening'],
  },
];

const HomePage: React.FC = () => {
  const [pins, setPins] = useState<PinProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Simulate loading pins from an API
  useEffect(() => {
    const loadPins = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would fetch pins from Firebase
        const shuffledPins = [...mockPins].sort(() => Math.random() - 0.5);
        const newPins = page === 1 ? shuffledPins : [...pins, ...shuffledPins];
        
        setPins(newPins);
        setHasMore(page < 3); // For demo purposes, limit to 3 pages
      } catch (error) {
        console.error('Error loading pins:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPins();
  }, [page]);

  // Implement infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >= 
        document.documentElement.offsetHeight - 500 &&
        !loading &&
        hasMore
      ) {
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Filter categories */}
      <div className="flex justify-center mb-6 overflow-x-auto pb-2">
        <div className="flex space-x-2">
          {['All', 'For You', 'Home', 'DIY', 'Fashion', 'Food', 'Travel', 'Art'].map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                category === 'All' 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Pins grid */}
      {pins.length > 0 ? (
        <PinGrid pins={pins} />
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      )}
      
      {/* Loading indicator for infinite scroll */}
      {loading && pins.length > 0 && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
        </div>
      )}
    </div>
  );
};

export default HomePage;