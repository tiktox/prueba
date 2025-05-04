import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Upload, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../lib/context/auth-context';
import { PinProps } from './Pin';

interface PinDetailProps extends PinProps {
  comments?: {
    id: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
    text: string;
    createdAt: string;
  }[];
  onBack?: () => void;
}

const PinDetail: React.FC<PinDetailProps> = ({
  id,
  title,
  description,
  imageUrl,
  createdBy,
  savedCount,
  commentCount,
  tags,
  isSaved = false,
  comments = [],
  onBack,
}) => {
  const { user, userProfile } = useAuth();
  const [saved, setSaved] = useState(isSaved);
  const [saveCount, setSaveCount] = useState(savedCount);
  const [comment, setComment] = useState('');
  const [pinComments, setPinComments] = useState(comments);

  const handleSave = () => {
    setSaved(!saved);
    setSaveCount(saved ? saveCount - 1 : saveCount + 1);
    // Here you would update the database
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (comment.trim() && user && userProfile) {
      const newComment = {
        id: Date.now().toString(),
        user: {
          id: user.uid,
          name: userProfile.displayName,
          avatar: userProfile.photoURL,
        },
        text: comment,
        createdAt: new Date().toISOString(),
      };
      
      setPinComments([...pinComments, newComment]);
      setComment('');
      // Here you would update the database
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="md:flex">
        {/* Pin Image */}
        <div className="md:w-1/2 relative">
          <button 
            onClick={onBack} 
            className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md z-10"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        {/* Pin Information */}
        <div className="md:w-1/2 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleSave}
                className={`p-2 rounded-full ${
                  saved 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Heart size={20} fill={saved ? 'currentColor' : 'none'} />
              </button>
              
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <Upload size={20} className="text-gray-700" />
              </button>
              
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <MoreHorizontal size={20} className="text-gray-700" />
              </button>
            </div>
            
            {saved ? (
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full font-medium"
              >
                Saved
              </button>
            ) : (
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium"
              >
                Save
              </button>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          
          {description && (
            <p className="text-gray-600 mb-4">{description}</p>
          )}
          
          <div className="flex items-center mb-6">
            <Link to={`/user/${createdBy.id}`} className="flex items-center">
              <img
                src={createdBy.avatar}
                alt={createdBy.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-3">
                <h4 className="font-medium text-gray-900">{createdBy.name}</h4>
              </div>
            </Link>
          </div>
          
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap mb-6">
              {tags.map((tag, index) => (
                <Link
                  key={index}
                  to={`/search?q=${encodeURIComponent(tag)}`}
                  className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full mr-2 mb-2 hover:bg-gray-200"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-medium text-gray-900 mb-4">
              Comments <span className="text-gray-500">({pinComments.length})</span>
            </h3>
            
            {user ? (
              <form onSubmit={handleSubmitComment} className="mb-6">
                <div className="flex">
                  <img
                    src={userProfile?.photoURL || ''}
                    alt={userProfile?.displayName || 'User'}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment"
                      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </form>
            ) : (
              <div className="mb-6 text-center">
                <Link to="/login" className="text-red-600 hover:underline">
                  Log in to add a comment
                </Link>
              </div>
            )}
            
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {pinComments.length > 0 ? (
                pinComments.map((comment) => (
                  <div key={comment.id} className="flex">
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.name}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div>
                      <div className="bg-gray-100 rounded-2xl px-4 py-2">
                        <Link to={`/user/${comment.user.id}`} className="font-medium text-gray-900">
                          {comment.user.name}
                        </Link>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No comments yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinDetail;