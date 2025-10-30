// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Layout/Navbar';

// Auth Components
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ChangePassword from './components/Auth/ChangePassword';

// Admin Components
import AdminDashboard from './components/Admin/AdminDashboard';
import MovieOperations from './components/Admin/MovieOperations';
import UserManagement from './components/Admin/UserManagement';

// User Components
import UserDashboard from './components/User/UserDashboard';
import MovieList from './components/User/MovieList';
import Recommendations from './components/User/Recommendations';
import MovieHistory from './components/User/MovieHistory';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes - All Users */}
            <Route 
              path="/change-password" 
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/movies" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <MovieOperations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <UserManagement />
                </ProtectedRoute>
              } 
            />

            {/* User Routes */}
            <Route 
              path="/user/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user/movies" 
              element={
                <ProtectedRoute>
                  <MovieList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user/recommendations" 
              element={
                <ProtectedRoute>
                  <Recommendations />
                </ProtectedRoute>
              } 
            />

            <Route
              path="/user/history"
              element={
                <ProtectedRoute>
                  <MovieHistory />
                </ProtectedRoute>
              }
            />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;