import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PinDetail from '../components/pins/PinDetail';
import { PinProps } from '../components/pins/Pin';

// Mock data for demonstration
const mockPins: PinProps[] = [
  {
    id: '1',
    title: 'Modern Living Room Design',
    description: 'Minimalist approach with neutral colors and clean lines. This living room design focuses on creating a calm, uncluttered space with functional furniture and subtle decorative elements. Natural light plays a key role in enhancing the spacious feel of the room.',
    imageUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    createdBy: {
      id: '101',
      name: 'Jane Smith',
      avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg',
    },
    savedCount: 245,
    commentCount: 32,
    tags: ['interior', 'design', 'minimalist', 'modern', 'living room'],
  },
  {
    id: '2',
    title: 'Summer Fashion 2023',
    description: 'Trendy outfits for the summer season with a focus on sustainable fabrics and versatile pieces. This collection features light, breathable materials in vibrant colors that are perfect for warm weather.',
    imageUrl: 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg',
    createdBy: {
      id: '102',
      name: 'Alex Johnson',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
    },
    savedCount: 189,
    commentCount: 14,
    tags: ['fashion', 'summer', 'style', 'outfit', 'trendy'],
  },
  {
    id: '3',
    title: 'Healthy Breakfast Ideas',
    description: 'Start your day right with these nutritious options that are both delicious and easy to prepare. These recipes are packed with nutrients to fuel your morning and keep you energized throughout the day.',
    imageUrl: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg',
    createdBy: {
      id: '103',
      name: 'Chris Williams',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    },
    savedCount: 320,
    commentCount: 41,
    tags: ['food', 'healthy', 'breakfast', 'recipes', 'nutrition'],
  },
];

// Mock comments data
const mockComments = [
  {
    id: '1',
    user: {
      id: '201',
      name: 'Emma Rodriguez',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
    },
    text: 'This looks amazing! I love the clean aesthetic.',
    createdAt: '2023-06-15T14:48:00.000Z',
  },
  {
    id: '2',
    user: {
      id: '202',
      name: 'Michael Chang',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    },
    text: "Thanks for sharing! I've been looking for ideas like this.",
    createdAt: '2023-06-16T09:23:00.000Z',
  },
  {
    id: '3',
    user: {
      id: '203',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    },
    text: 'I tried this and it turned out great! Highly recommend.',
    createdAt: '2023-06-16T16:05:00.000Z',
  },
];

const PinDetailPage: React.FC = () => {
  const { pinId } = useParams<{ pinId: string }>();
  const [pin, setPin] = useState<PinProps | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPin = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch the pin data from Firebase
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const foundPin = mockPins.find(p => p.id === pinId);
        if (foundPin) {
          setPin(foundPin);
        } else {
          // Handle pin not found
          navigate('/not-found');
        }
      } catch (error) {
        console.error('Error fetching pin:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (pinId) {
      fetchPin();
    }
  }, [pinId, navigate]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }
  
  if (!pin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-gray-900 mb-2">Pin not found</h2>
        <p className="text-gray-600 mb-6">The pin you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium"
        >
          Go Home
        </button>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <PinDetail {...pin} comments={mockComments} onBack={handleBack} />
    </div>
  );
};

export default PinDetailPage;