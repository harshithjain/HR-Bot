import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import Chat from './pages/Chat';
import Users from './pages/Users';
import Conversations from './pages/Conversations';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/users" element={<Users />} />
        <Route path="/conversations" element={<Conversations />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App; 