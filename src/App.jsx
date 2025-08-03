import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Quiz from './components/Quiz';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import PresenterView from './components/PresenterView';
import AudienceView from './components/AudienceView';
import Leaderboard from './components/Leaderboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white cyber-bg">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/presenter" element={<PresenterView />} />
          <Route path="/audience" element={<AudienceView />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
