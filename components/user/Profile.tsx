import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlusCircle, MessageCircle, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../../lib/context/auth-context';
import PinGrid from '../pins/PinGrid';
import { PinProps } from '../pins/Pin';

// Mock data for demonstration
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
];

const mockBoards = [
  {
    id: '1',
    name: 'Home Decor',
    pinCount: 45,
    coverImage: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
  },
  {
    id: '2',
    name: 'Fashion',
    pinCount: 78,
    coverImage: 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg',
  },
  {
    id: '3',
    name: 'Food & Recipes',
    pinCount: 32,
    coverImage: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg',
  },
  {
    id: '4',
    name: 'Travel',
    pinCount: 56,
    coverImage: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg',
  },
];

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'created' | 'saved' | 'boards'>('created');
  const [followersCount] = useState(1256);
  const [followingCount] = useState(834);
  const [isFollowing] = useState(false);
  
  // In a real app, you would fetch user data based on userId
  // For this demo, we'll use the current user's data if no userId is provided
  const isOwnProfile = !userId || (user && userId === user.uid);
  const profileData = userProfile || {
    displayName: 'John Doe',
    photoURL: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    bio: 'Designer and photography enthusiast. Creating and curating beautiful ideas.',
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <div className="text-center mb-8">
        <div className="relative mx-auto w-32 h-32 mb-4">
          <img
            src={profileData.photoURL}
            alt={profileData.displayName}
            className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{profileData.displayName}</h1>
        
        <p className="text-gray-600 mb-4 max-w-md mx-auto">
          {profileData.bio || 'No bio yet'}
        </p>
        
        <div className="flex justify-center space-x-4 text-sm text-gray-600 mb-6">
          <span>{followersCount.toLocaleString()} followers</span>
          <span>•</span>
          <span>{followingCount.toLocaleString()} following</span>
        </div>
        
        <div className="flex justify-center space-x-3">
          {isOwnProfile ? (
            <>
              <button className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 font-medium">
                Edit profile
              </button>
              <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                <MoreHorizontal size={20} className="text-gray-700" />
              </button>
            </>
          ) : (
            <>
              <button className={`px-4 py-2 rounded-full font-medium ${
                isFollowing 
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-900' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}>
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 font-medium">
                <MessageCircle size={20} className="text-gray-700" />
              </button>
              <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                <MoreHorizontal size={20} className="text-gray-700" />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Content Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex justify-center">
          <button
            onClick={() => setActiveTab('created')}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'created'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Created
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'saved'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Saved
          </button>
          <button
            onClick={() => setActiveTab('boards')}
            className={`px-4 py-3 font-medium text-sm ${
              activeTab === 'boards'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Boards
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="mt-6">
        {activeTab === 'created' && (
          <div>
            {mockPins.length > 0 ? (
              <PinGrid pins={mockPins} />
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nothing to show yet</h3>
                <p className="text-gray-600 mb-6">Create a pin to get started</p>
                <button className="inline-flex items-center px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium">
                  <PlusCircle size={20} className="mr-2" />
                  Create Pin
                </button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'saved' && (
          <div>
            {mockPins.length > 0 ? (
              <PinGrid pins={mockPins.slice().reverse()} />
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nothing saved yet</h3>
                <p className="text-gray-600 mb-6">Find ideas to save by browsing the feed</p>
                <button className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium">
                  Browse Feed
                </button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'boards' && (
          <div>
            {mockBoards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mockBoards.map((board) => (
                  <div 
                    key={board.id} 
                    className="rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="h-48 relative">
                      <img
                        src={board.coverImage}
                        alt={board.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1">{board.name}</h3>
                      <p className="text-sm text-gray-600">{board.pinCount} Pins</p>
                    </div>
                  </div>
                ))}
                
                {/* Create new board */}
                <div className="rounded-xl overflow-hidden border-2 border-dashed border-gray-300 flex flex-col items-center justify-center h-64 hover:border-gray-400 transition-colors cursor-pointer">
                  <PlusCircle size={32} className="text-gray-400 mb-3" />
                  <p className="font-medium text-gray-600">Create board</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No boards yet</h3>
                <p className="text-gray-600 mb-6">Create a board to organize your Pins</p>
                <button className="inline-flex items-center px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium">
                  <PlusCircle size={20} className="mr-2" />
                  Create Board
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;