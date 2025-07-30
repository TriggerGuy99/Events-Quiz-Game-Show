import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAnonymously } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [appState, setAppState] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for app state changes
    const unsubscribe = onSnapshot(doc(db, 'app', 'state'), (doc) => {
      if (doc.exists()) {
        setAppState(doc.data());
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Try Firebase authentication
      await signInAnonymously(auth);
      
      // Store email in localStorage for later use
      localStorage.setItem('userEmail', email);
      
      // Try to check app state, but provide fallback
      try {
        // Check if user should go to quiz or leaderboard based on app state
        if (appState?.currentPhase === 'quiz') {
          navigate('/quiz');
        } else {
          navigate('/leaderboard');
        }
      } catch (dbError) {
        console.warn('Database not accessible, using fallback navigation:', dbError);
        // Fallback: go to leaderboard by default
        navigate('/leaderboard');
      }
      
    } catch (error) {
      console.error('Authentication failed:', error);
      
      // Provide specific error messages
      if (error.code === 'auth/operation-not-allowed') {
        alert('🔧 Firebase Setup Required!\n\nPlease enable Anonymous Authentication in Firebase Console:\n1. Go to Firebase Console\n2. Authentication > Sign-in method\n3. Enable Anonymous\n\nOr use local testing mode.');
      } else if (error.message.includes('PERMISSION_DENIED') || error.message.includes('API has not been used')) {
        alert('🔧 Firebase Setup Required!\n\nPlease enable Firestore in Firebase Console:\n1. Go to Firebase Console\n2. Firestore Database > Create database\n3. Choose "Start in test mode"\n\nOr continue to test the UI without backend.');
        
        // Allow user to continue with local testing
        if (confirm('Would you like to continue with local testing mode? (No backend required)')) {
          localStorage.setItem('userEmail', email);
          localStorage.setItem('localMode', 'true');
          navigate('/leaderboard');
        }
      } else {
        alert('❌ Connection failed. Please check your internet connection and try again.\n\nError: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen cyber-bg flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Animated Background Elements - Reduced for Mobile */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        <div className="absolute top-10 left-10 w-2 h-2 bg-cyan animate-ping"></div>
        <div className="absolute top-1/4 right-20 w-1 h-1 bg-neon animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-purple animate-ping delay-1000"></div>
        <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-hot-pink animate-pulse delay-500"></div>
      </div>

      <div className="max-w-2xl w-full px-2 sm:px-0">
        {/* Main Title with Enhanced Cyber Effect - Mobile Optimized */}
        <div className="text-center mb-8 sm:mb-12 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl sm:text-6xl md:text-8xl font-black text-cyan/20 blur-sm animate-pulse">
              TECH FEUD
            </div>
          </div>
          <h1 className="relative text-4xl sm:text-6xl md:text-8xl font-black holographic mb-4 font-['Orbitron'] tracking-wider">
            TECH FEUD
          </h1>
          <div className="h-1 w-24 sm:w-32 mx-auto bg-gradient-to-r from-cyan via-neon to-purple animate-pulse mb-4 sm:mb-6 shadow-lg shadow-cyan/50"></div>
          <p className="text-lg sm:text-xl md:text-2xl matrix-text font-mono tracking-[0.2em] sm:tracking-[0.3em] uppercase px-2">
            THE ULTIMATE TECH BATTLE
          </p>
          <div className="mt-4 flex justify-center items-center space-x-2">
            <div className="w-2 h-2 bg-cyan rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-neon rounded-full animate-ping animation-delay-100"></div>
            <div className="w-2 h-2 bg-purple rounded-full animate-ping animation-delay-200"></div>
          </div>
        </div>

        {/* Status Display - Mobile Optimized */}
        {appState && (
          <div className="quiz-card scan-line mb-6 sm:mb-8 text-center border-2 border-cyan mx-2 sm:mx-0">
            <div className="flex items-center justify-center mb-4">
              <div className="cyber-spinner w-4 sm:w-6 h-4 sm:h-6 mr-3"></div>
              <h2 className="text-lg sm:text-2xl font-bold matrix-text">SYSTEM STATUS</h2>
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 sm:p-3 bg-black/50 rounded-lg border border-cyan/30">
                <span className="font-mono text-cyan text-sm sm:text-base mb-1 sm:mb-0">CURRENT PHASE:</span>
                <span className="font-bold text-neon uppercase tracking-widest text-sm sm:text-base">
                  {appState.currentPhase}
                </span>
              </div>
              
              {appState.currentPhase === 'quiz' && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 sm:p-3 bg-black/50 rounded-lg border border-neon/30">
                  <span className="font-mono text-cyan text-sm sm:text-base mb-1 sm:mb-0">ACTIVE PLAYERS:</span>
                  <span className="font-bold text-hot-pink text-sm sm:text-base">
                    {appState.activeUsers || 0}
                  </span>
                </div>
              )}
              
              {appState.currentPhase === 'game' && (
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 sm:p-3 bg-black/50 rounded-lg border border-purple/30">
                    <span className="font-mono text-cyan text-sm sm:text-base mb-1 sm:mb-0">FINALISTS:</span>
                    <span className="font-bold text-purple text-sm sm:text-base">
                      {appState.finalists?.length || 0}/5
                    </span>
                  </div>
                  {appState.currentQuestion && (
                    <div className="p-2 sm:p-3 bg-black/50 rounded-lg border border-hot-pink/30">
                      <div className="font-mono text-cyan text-xs sm:text-sm mb-1">CURRENT QUESTION:</div>
                      <div className="font-bold text-white text-sm sm:text-lg">
                        {appState.currentQuestion}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Login Form - Mobile Optimized */}
        <div className="quiz-card border-2 border-cyan/50 relative backdrop-blur-sm bg-black/40 mx-2 sm:mx-0">
          <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-black px-4 sm:px-6 py-1 sm:py-2 border-2 border-cyan rounded-full shadow-lg shadow-cyan/30">
              <span className="text-cyan font-mono text-xs sm:text-sm tracking-[0.2em] font-bold">⚡ ACCESS TERMINAL ⚡</span>
            </div>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-6 sm:space-y-8 pt-4 sm:pt-6">
            <div>
              <label className="block text-cyan font-mono text-xs sm:text-sm font-bold mb-2 sm:mb-3 tracking-[0.15em] uppercase">
                🔐 Operator Identifier
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/60 border-2 border-cyan/30 rounded-lg sm:rounded-xl 
                           text-white placeholder-cyan/50 font-mono tracking-wider text-base sm:text-lg
                           focus:border-neon focus:outline-none focus:ring-4 focus:ring-neon/20
                           transition-all duration-300 group-hover:border-cyan/50
                           shadow-inner"
                  placeholder="enter.your@email.com"
                  required
                />
                <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 sm:w-3 h-2 sm:h-3 bg-neon rounded-full animate-pulse shadow-lg shadow-neon/50"></div>
                </div>
                <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan/10 via-transparent to-neon/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 sm:py-5 px-6 sm:px-8 rounded-lg sm:rounded-xl text-lg sm:text-xl font-black
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                       relative overflow-hidden group min-h-[48px] sm:min-h-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan via-neon to-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading-spinner w-5 sm:w-6 h-5 sm:h-6 mr-3 sm:mr-4"></div>
                    <span className="font-mono tracking-[0.1em] sm:tracking-[0.2em] text-sm sm:text-base">⚡ CONNECTING...</span>
                  </div>
                ) : (
                  <span className="font-mono tracking-[0.1em] sm:tracking-[0.2em] text-sm sm:text-base">🚀 INITIALIZE CONNECTION</span>
                )}
              </span>
            </button>

            {/* Demo Mode Button */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  localStorage.setItem('userEmail', email || 'demo@user.com');
                  localStorage.setItem('localMode', 'true');
                  navigate('/leaderboard');
                }}
                className="text-purple/80 hover:text-purple font-mono text-sm tracking-wider underline transition-colors duration-300"
              >
                🎮 Try Demo Mode (No Firebase Required)
              </button>
            </div>
          </form>
          
          {/* Enhanced Quick Access Panel - Mobile Optimized */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-black/50 rounded-lg sm:rounded-xl border-2 border-purple/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple/5 via-transparent to-cyan/5"></div>
            <div className="relative">
              <div className="text-center mb-3 sm:mb-4">
                <div className="text-purple font-mono text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] mb-2 sm:mb-3 font-bold">
                  🔗 QUICK ACCESS CODES
                </div>
                <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-purple to-transparent mx-auto mb-3 sm:mb-4"></div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm font-mono">
                <div className="p-2 sm:p-2 bg-cyan/10 rounded-md sm:rounded-lg border border-cyan/20 text-center hover:bg-cyan/20 transition-all duration-300">
                  <div className="text-cyan/90 font-bold text-xs sm:text-sm">👑 ADMIN</div>
                  <div className="text-cyan/60 text-[10px] sm:text-xs">/admin</div>
                </div>
                <div className="p-2 sm:p-2 bg-neon/10 rounded-md sm:rounded-lg border border-neon/20 text-center hover:bg-neon/20 transition-all duration-300">
                  <div className="text-neon/90 font-bold text-xs sm:text-sm">🎤 PRESENTER</div>
                  <div className="text-neon/60 text-[10px] sm:text-xs">/presenter</div>
                </div>
                <div className="p-2 sm:p-2 bg-purple/10 rounded-md sm:rounded-lg border border-purple/20 text-center hover:bg-purple/20 transition-all duration-300">
                  <div className="text-purple/90 font-bold text-xs sm:text-sm">👥 AUDIENCE</div>
                  <div className="text-purple/60 text-[10px] sm:text-xs">/audience</div>
                </div>
                <div className="p-2 sm:p-2 bg-hot-pink/10 rounded-md sm:rounded-lg border border-hot-pink/20 text-center hover:bg-hot-pink/20 transition-all duration-300">
                  <div className="text-hot-pink/90 font-bold text-xs sm:text-sm">🏆 LEADERBOARD</div>
                  <div className="text-hot-pink/60 text-[10px] sm:text-xs">/leaderboard</div>
                </div>
              </div>
            </div>
          </div>

          {/* Firebase Setup Info */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
            <div className="text-center">
              <div className="text-yellow-400 font-mono text-[10px] sm:text-xs tracking-wide mb-2">
                🔧 SETUP INFO
              </div>
              <p className="text-yellow-300/80 text-[10px] sm:text-xs leading-relaxed">
                For full functionality, enable Firebase Firestore & Authentication in your Firebase Console.
                <br />
                <span className="text-purple/80">Or use Demo Mode below for immediate testing!</span>
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Footer - Mobile Optimized */}
        <div className="text-center mt-8 sm:mt-12 px-2">
          <div className="relative">
            <p className="text-cyan/80 font-mono text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.15em] mb-3 sm:mb-4">
              ⚡ SYSTEM VERSION 2.0 | POWERED BY QUANTUM TECH ⚡
            </p>
            <div className="flex justify-center items-center space-x-4 sm:space-x-6">
              <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent via-cyan to-transparent"></div>
              <div className="flex space-x-1 sm:space-x-2">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-cyan rounded-full animate-pulse"></div>
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-neon rounded-full animate-pulse animation-delay-200"></div>
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-purple rounded-full animate-pulse animation-delay-400"></div>
              </div>
              <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent via-cyan to-transparent"></div>
            </div>
            <div className="mt-3 sm:mt-4 text-[10px] sm:text-xs font-mono text-cyan/50 tracking-wide sm:tracking-wider">
              🔮 Initializing neural networks... Ready for combat 🔮
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
