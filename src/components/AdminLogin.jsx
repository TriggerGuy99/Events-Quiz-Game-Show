import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple password check - in production, use proper authentication
    if (password === 'admin2025') {
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminLoginTime', Date.now().toString());
      navigate('/admin');
    } else {
      setError('Invalid password. Please contact the event organizer.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen cyber-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-red-500 animate-ping"></div>
        <div className="absolute top-1/3 right-24 w-1 h-1 bg-orange-500 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-yellow-500 animate-ping delay-1000"></div>
      </div>

      <div className="max-w-md w-full">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-red-500 mb-4 font-['Orbitron'] tracking-wider">
            ADMIN ACCESS
          </h1>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-pulse mb-6"></div>
          <p className="text-orange-400 font-mono tracking-wider">
            🔒 RESTRICTED ZONE 🔒
          </p>
          <p className="text-sm text-yellow-400 font-mono mt-2">
            BlackBox AI Mavericks Club
          </p>
        </div>

        {/* Login Form */}
        <div className="quiz-card border-2 border-red-500/50 relative backdrop-blur-sm bg-black/60">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-black px-6 py-2 border-2 border-red-500 rounded-full shadow-lg shadow-red-500/30">
              <span className="text-red-500 font-mono text-sm tracking-[0.2em] font-bold">🛡️ ADMIN LOGIN 🛡️</span>
            </div>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6 pt-6">
            <div>
              <label className="block text-red-400 font-mono text-sm font-bold mb-3 tracking-[0.15em] uppercase">
                🔑 Admin Password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-black/70 border-2 border-red-500/30 rounded-xl 
                           text-white placeholder-red-400/50 font-mono tracking-wider text-lg
                           focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20
                           transition-all duration-300 group-hover:border-red-500/50
                           shadow-inner"
                  placeholder="Enter admin password..."
                  required
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse shadow-lg shadow-orange-500/50"></div>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm font-mono">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500
                       border-2 border-red-500 text-white font-bold py-4 px-8 rounded-xl text-xl
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                       relative overflow-hidden group font-mono tracking-wider"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    AUTHENTICATING...
                  </div>
                ) : (
                  '🚀 ACCESS ADMIN PANEL'
                )}
              </span>
            </button>
          </form>
          
          {/* Google Auth Option */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-orange-500/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-black px-4 text-orange-400 font-mono tracking-wider">OR</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                // For now, show an informational message about Google Auth
                alert('Google Authentication coming soon! Use password: admin2025 for now.');
              }}
              className="w-full mt-4 bg-white/10 border-2 border-gray-400/50 text-gray-300 font-mono py-3 px-6 rounded-xl
                       hover:bg-white/20 hover:border-gray-300 transition-all duration-300 transform hover:scale-105
                       flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="tracking-wider">Sign in with Google</span>
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
            <div className="text-center">
              <div className="text-yellow-400 font-mono text-xs tracking-wide mb-2">
                ⚠️ SECURITY NOTICE
              </div>
              <p className="text-yellow-300/80 text-xs leading-relaxed">
                Admin access is restricted to authorized event organizers only.
                Contact the BlackBox AI Mavericks Club team if you need assistance.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Main */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-cyan/80 hover:text-cyan font-mono text-sm tracking-wider underline transition-colors duration-300"
          >
            ← Back to Main Game
          </button>
        </div>
      </div>
    </div>
  );
}
