import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';
import { db } from '../firebase/config';
import { ImagePost } from '../types';
import Masonry from 'react-masonry-css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Plus, Image, Loader } from 'lucide-react';
import ImageCard from '../components/ImageCard';
import UploadModal from '../components/UploadModal';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<ImagePost[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const postsPerPage = 12;

  const fetchPosts = async (isInitial = false) => {
    try {
      let postsQuery;
      
      if (isInitial) {
        postsQuery = query(
          collection(db, 'posts'),
          orderBy('createdAt', 'desc'),
          limit(postsPerPage)
        );
      } else {
        if (!lastVisible) return;
        postsQuery = query(
          collection(db, 'posts'),
          orderBy('createdAt', 'desc'),
          startAfter(lastVisible),
          limit(postsPerPage)
        );
      }

      const querySnapshot = await getDocs(postsQuery);
      
      if (querySnapshot.empty) {
        setHasMore(false);
        return;
      }

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastDoc);

      const newPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ImagePost));

      if (isInitial) {
        setPosts(newPosts);
      } else {
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(true);
  }, []);

  const loadMorePosts = () => {
    if (!loading) {
      fetchPosts();
    }
  };

  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div className="container mx-auto px-4 pb-20">
      {loading && posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-gray-500">Loading amazing content...</p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={posts.length}
          next={loadMorePosts}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center py-4">
              <Loader className="w-8 h-8 text-primary animate-spin" />
            </div>
          }
          endMessage={
            <p className="text-center text-gray-500 py-4">
              You've seen all posts
            </p>
          }
        >
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
        </InfiniteScroll>
      )}

      {/* Upload FAB */}
      <button
        onClick={() => setIsUploadModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-10"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => {
          setIsUploadModalOpen(false);
          fetchPosts(true);
        }}
      />

      {/* Empty state */}
      {!loading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200 p-8">
          <Image className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
          <p className="text-gray-500 text-center mb-4">
            Be the first to share an image with the community
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors"
          >
            Upload an image
          </button>
        </div>
      )}
    </div>
  );
};

export default Feed;