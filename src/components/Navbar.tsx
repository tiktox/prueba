import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { MessageSquare, User, LogOut, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link 
          to="/feed" 
          className="text-xl font-bold text-primary flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">PG</span>
          </div>
          <span className="hidden sm:inline-block">Pixelgram</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {user && (
            <>
              <Link 
                to="/messages" 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Messages"
              >
                <MessageSquare className="w-5 h-5" />
              </Link>
              <Link 
                to={`/profile/${user.uid}`} 
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="My Profile"
              >
                <User className="w-5 h-5" />
              </Link>
              <button 
                onClick={handleSignOut}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <Link to={`/profile/${user.uid}`}>
                <img 
                  src={user.photoURL || 'https://via.placeholder.com/40'} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-gray-200"
                />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2 px-4 animate-fade-in">
          {user && (
            <div className="flex flex-col gap-2">
              <Link 
                to={`/profile/${user.uid}`} 
                className="flex items-center gap-3 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <img 
                  src={user.photoURL || 'https://via.placeholder.com/40'} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full border border-gray-200"
                />
                <div>
                  <div className="font-medium">{user.displayName}</div>
                  <div className="text-sm text-gray-500">View profile</div>
                </div>
              </Link>
              <div className="border-t border-gray-200 my-2"></div>
              <Link 
                to="/messages" 
                className="flex items-center gap-3 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Messages</span>
              </Link>
              <button 
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 py-2 text-red-500"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;