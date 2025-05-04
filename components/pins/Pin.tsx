import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Upload, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../../lib/context/auth-context';

export interface PinProps {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  createdBy: {
    id: string;
    name: string;
    avatar: string;
  };
  savedCount: number;
  commentCount: number;
  tags?: string[];
  isSaved?: boolean;
}

const Pin: React.FC<PinProps> = ({
  id,
  title,
  description,
  imageUrl,
  createdBy,
  savedCount,
  commentCount,
  tags,
  isSaved = false,
}) => {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const [saveCount, setSaveCount] = useState(savedCount);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (user) {
      setSaved(!saved);
      setSaveCount(saved ? saveCount - 1 : saveCount + 1);
      // Here you would call a function to update the database
    }
  };

  return (
    <div
      className="rounded-lg overflow-hidden mb-6 transform transition duration-200 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/pin/${id}`} className="block relative">
        {/* Image */}
        <img
          src={imageUrl}
          alt={title}
          className="w-full object-cover rounded-lg"
          style={{ aspectRatio: '2/3' }}
        />
        
        {/* Overlay on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex flex-col justify-between p-4 transition-opacity duration-200">
            <div className="flex justify-end space-x-2">
              <button 
                className="bg-white p-2 rounded-full hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Handle share logic
                }}
              >
                <Upload size={18} className="text-gray-700" />
              </button>
              <button 
                className="bg-white p-2 rounded-full hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Handle more options
                }}
              >
                <MoreHorizontal size={18} className="text-gray-700" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center">
                <Link
                  to={`/user/${createdBy.id}`}
                  className="flex items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={createdBy.avatar}
                    alt={createdBy.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                  />
                  <span className="ml-2 text-white font-medium text-sm">{createdBy.name}</span>
                </Link>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  className="bg-white p-2 rounded-full hover:bg-gray-100 flex items-center space-x-1"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Navigate to comments
                  }}
                >
                  <MessageCircle size={18} className="text-gray-700" />
                  {commentCount > 0 && (
                    <span className="text-xs font-medium text-gray-700">{commentCount}</span>
                  )}
                </button>
                
                <button 
                  className={`p-2 rounded-full flex items-center space-x-1 ${
                    saved 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-white hover:bg-gray-100'
                  }`}
                  onClick={handleSave}
                >
                  <Heart 
                    size={18} 
                    className={saved ? 'text-white' : 'text-gray-700'}
                    fill={saved ? 'white' : 'none'}
                  />
                  {saveCount > 0 && (
                    <span className={`text-xs font-medium ${
                      saved ? 'text-white' : 'text-gray-700'
                    }`}>
                      {saveCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </Link>
      
      {/* Pin details below image */}
      <div className="p-2">
        <h3 className="font-medium text-gray-900 line-clamp-1">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap mt-2">
            {tags.map((tag, index) => (
              <Link
                key={index}
                to={`/search?q=${encodeURIComponent(tag)}`}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full mr-2 mb-2 hover:bg-gray-200"
                onClick={(e) => e.stopPropagation()}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pin;