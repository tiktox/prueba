import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { User, ImagePost } from '../types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import Masonry from 'react-masonry-css';
import { Image, Users, Loader } from 'lucide-react';
import ImageCard from '../components/ImageCard';

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [currentUser] = useAuthState(auth);
  
  const [profile, setProfile] = useState<User | null>(null);
  const [posts, setPosts] = useState<ImagePost[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      
      setLoading(true);
      
      try {
        // Get user profile
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (userDoc.exists()) {
          setProfile(userDoc.data() as User);
        }
        
        // Get user posts
        const postsQuery = query(
          collection(db, 'posts'),
          where('authorId', '==', userId)
        );
        
        const querySnapshot = await getDocs(postsQuery);
        const userPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as ImagePost));
        
        // Sort by creation date (newest first)
        userPosts.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
        
        setPosts(userPosts);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId]);

  const breakpointColumns = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1
  };

  const isOwnProfile = currentUser?.uid === userId;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-2">User not found</h2>
          <p className="text-gray-500">The user you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={profile.photoURL || 'https://via.placeholder.com/150'}
            alt={profile.displayName}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-md"
          />
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold mb-1">{profile.displayName}</h1>
            <p className="text-gray-500 mb-4">@{profile.username}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
              <div className="text-center">
                <div className="text-xl font-semibold">{posts.length}</div>
                <div className="text-gray-500 text-sm">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold">0</div>
                <div className="text-gray-500 text-sm">Friends</div>
              </div>
            </div>
            
            {isOwnProfile ? (
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md transition-colors">
                Edit Profile
              </button>
            ) : (
              <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors">
                Message
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Profile Content */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        
        {posts.length > 0 ? (
          <Masonry
            breakpointCols={breakpointColumns}
            className="masonry-grid"
            columnClassName="masonry-grid_column"
          >
            {posts.map(post => (
              <div key={post.id} className="masonry-item animate-fade-in">
                <ImageCard post={post} />
              </div>
            ))}
          </Masonry>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200 p-8">
            <Image className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-gray-500 text-center">
              {isOwnProfile
                ? "You haven't shared any images yet. Upload your first image!"
                : `${profile.displayName} hasn't shared any images yet.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;