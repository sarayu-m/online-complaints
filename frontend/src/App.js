import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminAgentDashboard from './components/admin/AdminAgentDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-home"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAgentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent-home"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <AdminAgentDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
