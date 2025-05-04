import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/context/auth-context';

interface CreatePinProps {
  onCancel?: () => void;
}

const CreatePin: React.FC<CreatePinProps> = ({ onCancel }) => {
  const { user, userProfile } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [board, setBoard] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  if (!user || !userProfile) {
    navigate('/login');
    return null;
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image || !title.trim()) {
      alert('Please add an image and title');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // In a real implementation, you would:
      // 1. Upload the image to storage (Firebase Storage or ImageKit)
      // 2. Create a pin document in Firestore
      // 3. Add the pin to the selected board
      
      // For this demo, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsUploading(false);
      navigate('/'); // Navigate to home/profile after successful upload
      
    } catch (error) {
      console.error('Error creating pin:', error);
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Create Pin</h2>
        {onCancel && (
          <button 
            onClick={onCancel}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X size={24} className="text-gray-500" />
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="md:flex">
          {/* Image Upload Section */}
          <div 
            className={`md:w-1/2 p-6 ${!imagePreview ? 'flex items-center justify-center' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!imagePreview ? (
              <div 
                className={`w-full aspect-[4/5] border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 transition-colors ${
                  isDragging ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-red-500'
                }`}
              >
                <Upload size={48} className="text-gray-400 mb-4" />
                <p className="text-gray-600 text-center mb-4">
                  Drag and drop an image or click to upload
                </p>
                <p className="text-gray-500 text-sm text-center mb-6">
                  Recommendation: Use high-quality .jpg files less than 20MB
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium"
                >
                  Choose an image
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative w-full">
                <img
                  src={imagePreview}
                  alt="Pin preview"
                  className="w-full rounded-lg object-cover"
                  style={{ maxHeight: '500px' }}
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  aria-label="Remove image"
                >
                  <X size={20} className="text-gray-700" />
                </button>
              </div>
            )}
          </div>
          
          {/* Pin Details Section */}
          <div className="md:w-1/2 p-6">
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-1">
                <img
                  src={userProfile.photoURL}
                  alt={userProfile.displayName}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-sm font-medium text-gray-700">{userProfile.displayName}</span>
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell everyone what your Pin is about"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="board" className="block text-sm font-medium text-gray-700 mb-1">
                Board
              </label>
              <select
                id="board"
                value={board}
                onChange={(e) => setBoard(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select board</option>
                <option value="create-new">+ Create board</option>
                {/* Board options would be dynamically loaded from the user's boards */}
                <option value="fashion">Fashion</option>
                <option value="home-decor">Home Decor</option>
                <option value="recipes">Recipes</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags (separated by commas)
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="fashion, design, art"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <div className="flex justify-end mt-8">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 mr-2 border border-gray-300 rounded-full font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
              
              <button
                type="submit"
                disabled={!image || !title.trim() || isUploading}
                className={`px-4 py-2 rounded-full font-medium ${
                  !image || !title.trim() || isUploading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isUploading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePin;