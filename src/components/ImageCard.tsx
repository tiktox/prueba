import React from 'react';
import { Link } from 'react-router-dom';
import { ImagePost } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { Heart } from 'lucide-react';

interface ImageCardProps {
  post: ImagePost;
}

const ImageCard: React.FC<ImageCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        <img
          src={post.imageUrl}
          alt={post.description || 'Image post'}
          className="w-full object-cover"
          loading="lazy"
        />
        <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
          <Heart className="w-5 h-5 text-gray-500 hover:text-accent" />
        </button>
      </div>

      <div className="p-4">
        {post.description && (
          <p className="text-gray-800 text-sm mb-3">{post.description}</p>
        )}
        
        <div className="flex items-center gap-2">
          <Link to={`/profile/${post.authorId}`}>
            <img
              src={post.authorPhotoURL || 'https://via.placeholder.com/40'}
              alt={post.authorName}
              className="w-8 h-8 rounded-full object-cover"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <Link to={`/profile/${post.authorId}`} className="font-medium text-sm block truncate hover:text-primary">
              {post.username}
            </Link>
            {post.createdAt && (
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;