import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

const Leaderboard = () => {
  const [user] = useAuthState(auth);
  const [participants, setParticipants] = useState([]);
  const [gameState, setGameState] = useState({ 
    isQuizActive: false, 
    showLeaderboard: false,
    currentQuestionId: null 
  });
  const [userRank, setUserRank] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen to participants collection for real-time updates
    const participantsQuery = query(collection(db, 'participants'), orderBy('score', 'desc'));
    const unsubscribeParticipants = onSnapshot(participantsQuery, (snapshot) => {
      const participantsData = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        rank: index + 1,
        ...doc.data()
      }));
      setParticipants(participantsData);

      // Find current user's rank
      if (user) {
        const currentUser = participantsData.find(u => u.email === user.email);
        setUserRank(currentUser?.rank || null);
      }
    });

    // Listen to game state
    const unsubscribeGameState = onSnapshot(doc(db, 'config', 'gameState'), (doc) => {
      if (doc.exists()) {
        const state = doc.data();
        setGameState(state);
        
        // Redirect based on game state changes
        if (state.isQuizActive) {
          // Redirect to audience view if quiz becomes active
          setTimeout(() => {
            navigate('/audience');
          }, 3000);
        }
      }
    });

    return () => {
      unsubscribeParticipants();
      unsubscribeGameState();
    };
  }, [user, navigate]);

  const topFinalists = participants.slice(0, 10);
  const isFinalist = user && topFinalists.some(f => f.email === user.email);

  return (
    <div className="min-h-screen cyber-bg py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-black holographic mb-4 font-['Orbitron'] tracking-wider">
            🏆 TECH FEUD LEADERBOARD 🏆
          </h1>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-cyan via-neon to-purple animate-pulse mb-4 shadow-lg shadow-cyan/50"></div>
          <p className="text-cyan/80 font-mono text-sm sm:text-base">Final Quiz Results</p>
          
          {/* User Status */}
          {user && (
            <div className="mt-6">
              <div className={`inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg border-2 font-semibold font-mono text-sm sm:text-base ${
                isFinalist 
                  ? 'bg-neon/20 border-neon text-neon shadow-lg shadow-neon/30' 
                  : 'bg-cyan/20 border-cyan text-cyan shadow-lg shadow-cyan/30'
              }`}>
                {isFinalist ? (
                  <>
                    🎉 Congratulations! You're a finalist! (Rank #{userRank})
                  </>
                ) : (
                  <>
                    Your rank: #{userRank} - {userRank <= 15 ? 'So close!' : 'Better luck next time!'}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Game Status */}
        <div className="quiz-card mb-6 sm:mb-8 text-center">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
            gameState.isQuizActive ? 'bg-cyan/20 border-2 border-cyan' :
            gameState.showLeaderboard ? 'bg-neon/20 border-2 border-neon' :
            'bg-purple/20 border-2 border-purple'
          }`}>
            {gameState.isQuizActive && <span className="text-2xl">🎮</span>}
            {gameState.showLeaderboard && <span className="text-2xl">🏆</span>}
            {!gameState.isQuizActive && !gameState.showLeaderboard && <span className="text-2xl">⏳</span>}
          </div>
          
          <h2 className="text-xl font-bold text-white mb-2">
            {gameState.isQuizActive && 'Tech Feud in Progress'}
            {gameState.showLeaderboard && 'Final Results'}
            {!gameState.isQuizActive && !gameState.showLeaderboard && 'Quiz Completed'}
          </h2>
          
          <p className="text-gray-400 text-sm font-mono">
            {gameState.isQuizActive && 'Live competition happening now!'}
            {gameState.showLeaderboard && 'These are the final standings'}
            {!gameState.isQuizActive && !gameState.showLeaderboard && 'Waiting for next phase'}
          </p>
        </div>

        {/* Finalists Section */}
        <div className="mb-12">
          <div className="quiz-card">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center font-['Orbitron']">
              🌟 Top Finalists 🌟
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {topFinalists.slice(0, 5).map((finalist, index) => (
                  <div
                    key={finalist.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-900 to-yellow-800 border-yellow-400' :
                      index === 1 ? 'bg-gradient-to-r from-gray-800 to-gray-700 border-gray-300' :
                      index === 2 ? 'bg-gradient-to-r from-orange-900 to-orange-800 border-orange-400' :
                      'bg-gradient-to-r from-primary-900 to-primary-800 border-primary-400'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="text-2xl font-bold text-white mr-3">
                          #{index + 1}
                          {index === 0 && ' 👑'}
                          {index === 1 && ' 🥈'}
                          {index === 2 && ' 🥉'}
                        </div>
                        <div>
                          <div className={`font-semibold text-lg ${
                            user?.email === finalist.email ? 'text-green-300' : 'text-white'
                          }`}>
                            {finalist.email.split('@')[0]}
                            {user?.email === finalist.email && ' (You!)'}
                          </div>
                          <div className="text-sm text-gray-300">
                            Quiz Score: {finalist.quizScore || 0}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                          {finalist.quizScore || 0}
                        </div>
                        <div className="text-xs text-gray-300">points</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3">
                {topFinalists.slice(5, 10).map((finalist, index) => (
                  <div
                    key={finalist.id}
                    className="p-4 rounded-lg bg-gradient-to-r from-primary-900 to-primary-800 border-l-4 border-primary-400"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="text-2xl font-bold text-white mr-3">
                          #{index + 6}
                        </div>
                        <div>
                          <div className={`font-semibold text-lg ${
                            user?.email === finalist.email ? 'text-green-300' : 'text-white'
                          }`}>
                            {finalist.email.split('@')[0]}
                            {user?.email === finalist.email && ' (You!)'}
                          </div>
                          <div className="text-sm text-gray-300">
                            Quiz Score: {finalist.quizScore || 0}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                          {finalist.quizScore || 0}
                        </div>
                        <div className="text-xs text-gray-300">points</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* All Participants */}
        <div className="quiz-card">
          <h2 className="text-xl font-bold text-white mb-6">
            All Participants ({users.length})
          </h2>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {users.map((participant, index) => (
              <div
                key={participant.id}
                className={`p-3 rounded flex justify-between items-center ${
                  index < 10 
                    ? 'bg-gradient-to-r from-primary-800 to-primary-700' 
                    : 'bg-dark-700'
                } ${user?.email === participant.email ? 'ring-2 ring-green-400' : ''}`}
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-dark-900 flex items-center justify-center text-white font-bold text-sm mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <div className={`font-medium ${
                      user?.email === participant.email ? 'text-green-300' : 'text-white'
                    }`}>
                      {participant.email.split('@')[0]}
                      {user?.email === participant.email && ' (You)'}
                      {index < 10 && ' ⭐'}
                    </div>
                    <div className="text-sm text-gray-400">
                      {participant.email}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white">
                    {participant.quizScore || 0}
                  </div>
                  <div className="text-xs text-gray-400">points</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 text-center">
          {appState.currentPhase === 'liveGame' ? (
            <div className="quiz-card">
              <h3 className="text-xl font-bold text-white mb-4">🎮 Live Game Starting!</h3>
              <p className="text-gray-300 mb-4">
                The live Tech Feud round is beginning. 
                {isFinalist ? ' You\'re a finalist!' : ' Watch the action unfold!'}
              </p>
              <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-400">Redirecting to audience view...</p>
            </div>
          ) : (
            <div className="text-gray-400">
              <p className="mb-2">🎯 Results are final!</p>
              <p className="text-sm">
                Finalists will compete in the live Tech Feud round on stage.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2025 Blackbox AI Mavericks Club</p>
          <p className="mt-1">Thank you for participating in Tech Feud!</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
