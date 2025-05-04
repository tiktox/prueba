import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/context/auth-context';

// Layout
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import SearchPage from './pages/SearchPage';
import CreatePinPage from './pages/CreatePinPage';
import PinDetailPage from './pages/PinDetailPage';
import Profile from './components/user/Profile';
import Login from './components/auth/Login';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="create" element={<CreatePinPage />} />
            <Route path="pin/:pinId" element={<PinDetailPage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="user/:userId" element={<Profile />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Navigate to="/login" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;